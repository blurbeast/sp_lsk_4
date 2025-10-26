import { useEffect, useMemo, useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { Abi, AbiEvent, ExtractAbiEventNames } from "abitype";
import { useInterval } from "usehooks-ts";
import { Hash } from "viem";
import * as chains from "viem/chains";
import { usePublicClient } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { replacer } from "~~/utils/scaffold-eth/common";
import {
  ContractAbi,
  ContractName,
  UseScaffoldEventHistoryConfig,
  UseScaffoldEventHistoryData,
} from "~~/utils/scaffold-eth/contract";

/**
 * Reads events from a deployed contract
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.eventName - name of the event to listen for
 * @param config.fromBlock - the block number to start reading events from
 * @param config.filters - filters to be applied to the event (parameterName: value)
 * @param config.blockData - if set to true it will return the block data for each event (default: false)
 * @param config.transactionData - if set to true it will return the transaction data for each event (default: false)
 * @param config.receiptData - if set to true it will return the receipt data for each event (default: false)
 * @param config.watch - if set to true, the events will be updated every pollingInterval milliseconds set at scaffoldConfig (default: false)
 * @param config.enabled - set this to false to disable the hook from running (default: true)
 */
export const useScaffoldEventHistory = <
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
  TBlockData extends boolean = false,
  TTransactionData extends boolean = false,
  TReceiptData extends boolean = false,
>({
  contractName,
  eventName,
  fromBlock,
  filters,
  blockData,
  transactionData,
  receiptData,
  watch,
  enabled = true,
}: UseScaffoldEventHistoryConfig<TContractName, TEventName, TBlockData, TTransactionData, TReceiptData>) => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  // normalize fromBlock to a bigint default (0n) so hook works even if caller omits fromBlock
  const [fromBlockUpdated, setFromBlockUpdated] = useState<bigint>(fromBlock ?? 0n);

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
  const publicClient = usePublicClient();
  const { targetNetwork } = useTargetNetwork();

  const readEvents = async (fromBlock?: bigint) => {
    setIsLoading(true);
    try {
      if (!deployedContractData) {
        // Contract not deployed yet or still loading - silently skip and don't spam errors
        setIsLoading(false);
        return;
      }

      if (!enabled) {
        setIsLoading(false);
        return;
      }

      const event = (deployedContractData.abi as Abi).find(
        part => part.type === "event" && part.name === eventName,
      ) as AbiEvent;

      const blockNumber = await publicClient.getBlockNumber({ cacheTime: 0 });

      if ((fromBlock && blockNumber >= fromBlock) || blockNumber >= fromBlockUpdated) {
        // Some RPC providers limit the max block range for eth_getLogs (e.g. 100000 blocks).
        // To avoid "query exceeds max block range" errors we chunk requests into windows.
        const maxWindow = 100000n; // provider max range (kept as bigint)
        const startBlock = fromBlock || fromBlockUpdated;
        const allLogs: any[] = [];

        // iterate windows from startBlock to current blockNumber
        // Use a paced sequential strategy with retries/backoff to avoid provider rate limits (429)
        const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
        const isRateLimitError = (err: any) => {
          const msg = String(err?.message || err);
          return msg.includes("Too Many Requests") || msg.includes("429") || msg.includes("rate limit");
        };

        const fetchWindowWithRetry = async (start: bigint, end: bigint) => {
          const maxAttempts = 5;
          let attempt = 0;
          let lastErr: any = null;
          while (attempt < maxAttempts) {
            try {
              // eslint-disable-next-line no-await-in-loop
              const windowLogs = await publicClient.getLogs({
                address: deployedContractData?.address,
                event,
                args: filters as any, // TODO: check if it works and fix type
                fromBlock: start,
                toBlock: end,
              });
              return windowLogs || [];
            } catch (err: any) {
              lastErr = err;
              attempt += 1;
              // If rate limited, wait exponentially longer before retrying
              if (isRateLimitError(err)) {
                const backoff = Math.min(30_000, 1000 * Math.pow(2, attempt));
                // add some jitter
                const jitter = Math.floor(Math.random() * 500);
                // eslint-disable-next-line no-await-in-loop
                await sleep(backoff + jitter);
                continue;
              }

              // For other transient errors, do a small exponential backoff
              const backoff = 300 * Math.pow(2, attempt);
              // eslint-disable-next-line no-await-in-loop
              await sleep(backoff);
            }
          }
          throw lastErr;
        };

        for (let start = startBlock; start <= blockNumber; start = start + (maxWindow + 1n)) {
          const end = blockNumber < start + maxWindow ? blockNumber : start + maxWindow;
          try {
            const windowLogs = await fetchWindowWithRetry(start, end);
            if (windowLogs && windowLogs.length > 0) {
              allLogs.push(...windowLogs);
            }
          } catch (chunkErr) {
            // If a chunk fails after retries, log and rethrow so consumer can handle it
            console.error("Error fetching logs for range", start.toString(), "-", end.toString(), chunkErr);
            throw chunkErr;
          }

          // Pause between windows to avoid bursting requests (increased to reduce rate limits)
          // eslint-disable-next-line no-await-in-loop
          await sleep(400);
        }

        setFromBlockUpdated(blockNumber + 1n);

        const newEvents = [];
        for (let i = allLogs.length - 1; i >= 0; i--) {
          const log = allLogs[i];
          newEvents.push({
            log,
            args: log.args,
            block:
              blockData && log.blockHash === null
                ? null
                : await publicClient.getBlock({ blockHash: log.blockHash as Hash }),
            transaction:
              transactionData && log.transactionHash !== null
                ? await publicClient.getTransaction({ hash: log.transactionHash as Hash })
                : null,
            receipt:
              receiptData && log.transactionHash !== null
                ? await publicClient.getTransactionReceipt({ hash: log.transactionHash as Hash })
                : null,
          });
        }
        if (events && typeof fromBlock === "undefined") {
          setEvents([...newEvents, ...events]);
        } else {
          setEvents(newEvents);
        }
        setError(undefined);
      }
    } catch (e: any) {
      console.error(e);
      setEvents([]);
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    readEvents(fromBlock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromBlock, enabled]);

  useEffect(() => {
    if (!deployedContractLoading) {
      readEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    publicClient,
    contractName,
    eventName,
    deployedContractLoading,
    deployedContractData?.address,
    deployedContractData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filters, replacer),
    blockData,
    transactionData,
    receiptData,
  ]);

  useEffect(() => {
    // Reset the internal state when target network or fromBlock changed
    setEvents([]);
    setFromBlockUpdated(fromBlock ?? 0n);
    setError(undefined);
  }, [fromBlock, targetNetwork.id]);

  useInterval(
    async () => {
      if (!deployedContractLoading) {
        readEvents();
      }
    },
    watch ? (targetNetwork.id !== chains.hardhat.id ? scaffoldConfig.pollingInterval : 4_000) : null,
  );

  const eventHistoryData = useMemo(
    () =>
      events?.map(addIndexedArgsToEvent) as UseScaffoldEventHistoryData<
        TContractName,
        TEventName,
        TBlockData,
        TTransactionData,
        TReceiptData
      >,
    [events],
  );

  return {
    data: eventHistoryData,
    isLoading: isLoading,
    error: error,
  };
};

export const addIndexedArgsToEvent = (event: any) => {
  if (event.args && !Array.isArray(event.args)) {
    return { ...event, args: { ...event.args, ...Object.values(event.args) } };
  }

  return event;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default function GaslessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

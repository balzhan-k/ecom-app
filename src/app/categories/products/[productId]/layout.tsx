import YouMightAlsoLike from "@/components/common/YouMightAlsoLike";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <YouMightAlsoLike />
    </div>
  );
}

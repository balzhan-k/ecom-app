import YouMightAlsoLike from "@/components/cart/YouMightAlsoLike";

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

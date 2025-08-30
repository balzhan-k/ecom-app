import YouMightAlsoLike from "@/components/common/FeaturedProducts";

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

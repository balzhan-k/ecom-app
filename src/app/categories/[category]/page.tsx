import { notFound } from "next/navigation";
import ProductGrid from "@/components/products/ProductGrid";
import { getProductsByCategory } from "@/utils/products";
import { Category } from "@/types/product";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getCategoryFromSlug(slug: string): string {
  const categoryMap: Record<string, string> = {
    pens: "Pens",
    notebooks: "Notebooks",
    "staplers-staples": "Staplers/Staples",
    "staplers/staples": "Staplers/Staples",
    "sticky-notes": "Sticky Notes",
    "desk-organizers": "Desk Organizers",
  };

  return categoryMap[slug] || slug;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryName = getCategoryFromSlug(category);

  if (!Object.values(Category).includes(categoryName as Category)) {
    notFound();
  }

  const products = await getProductsByCategory(categoryName as Category);

  return (
    <div className="py-8 pt-10">
      <ProductGrid products={products} />
    </div>
  );
}

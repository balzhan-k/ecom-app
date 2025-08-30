import Link from "next/link";
import { Category } from "@/types/product";

interface CategoryCardProps {
  category: Category;
}

function getCategoryImage(category: Category): string {
  const imageMap: Record<Category, string> = {
    [Category.PENS]: "/categories/pens.jpg",
    [Category.NOTEBOOKS]: "/categories/notebooks.jpg",
    [Category.STAPLERS_STAPLES]: "/categories/staplers.jpg",
    [Category.STICKY_NOTES]: "/categories/stickynotes.jpg",
    [Category.DESK_ORGANIZERS]: "/categories/organizers.jpg",
  };

  return imageMap[category] || "/categories/pens.jpg";
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const categorySlug = category
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "-");
  const imageUrl = getCategoryImage(category);

  return (
    <Link href={`/categories/${categorySlug}`}>
      <div className="cursor-pointer transition-transform duration-300 hover:scale-105">
        <div
          className="bg-cover bg-center rounded-full w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto"
          style={{
            backgroundImage: `url("${imageUrl}")`,
          }}
        />
      </div>
      <div className="mt-2 sm:mb-3 md:mb-4">
        <h3 className="text-stone-600 font-semibold text-xs md:text-sm lg:text-lg text-center">
          {category}
        </h3>
      </div>
    </Link>
  );
}

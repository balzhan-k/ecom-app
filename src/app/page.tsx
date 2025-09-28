import CategoryCard from "@/components/categories/CategoryCard";
import { Category } from "@/types/product";
import DiscountedProducts from "@/components/common/FeaturedProducts";
import Image from "next/image";

export default function HomePage() {
  const categories = Object.values(Category);
  return (
    <main>
      <section className="bg-yellow-50 px-4 py-16 lg:py-24 mt-5 rounded-2xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-10">
            <div className="space-y-6 ">
              <h1 className="text-4xl lg:text-6xl font-bold text-cyan-700 leading-tight">
                Elevate Your Workspace
              </h1>
              <p className="text-lg lg:text-xl text-cyan-700 leading-relaxed max-w-md">
                Discover our curated collection of beautiful and functional
                stationery.
              </p>
            </div>

            <div className="relative">
              <Image
                src="/home-main-banner.jpg"
                alt="Beautiful workspace with stationery"
                width={500}
                height={500}
                className="w-full h-auto rounded-2xl shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-16 pb-8">
        <div className="container mx-auto">
          <h2 className="text-xl font-bold text-cyan-700 mb-6">Categories</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mb-15">
            {categories.map((category) => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <DiscountedProducts />
      </section>
    </main>
  );
}

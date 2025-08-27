"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/utils/products";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  formatPrice,
  getProductDisplayTitle,
  calculateDiscountedPrice,
} from "@/utils/formatters";

export default function AdminDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  // Проверяем аутентификацию и роль
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (userData?.role !== "admin") {
        router.push("/");
        return;
      }
    }
  }, [user, userData, loading, router]);

  // Показываем загрузку пока проверяем права
  if (loading) {
    return (
      <div className="container mx-auto py-4 pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Если не админ, не показываем контент
  if (!user || userData?.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto py-4 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="tracking-light text-2xl font-bold leading-tight text-cyan-700 py-2">
          Admin Products
        </h1>
        <Link
          href="/admin/products/new"
          className="bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-800 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Здесь будет список продуктов */}
        <div className="text-center text-gray-600">
          <p>Products will be loaded here...</p>
        </div>
      </div>
    </div>
  );
}

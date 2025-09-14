"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/outline";
import { UserMenu } from "./UserMenu";
import { CartIcon } from "./CartIcon";
import { SearchInput } from "@/components/common/SearchInput";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const currentPath = usePathname();
  const { user } = useAuth();

  return (
    <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto lg:max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.jpg"
                alt="MiniCom Logo"
                width={0}
                height={0}
                sizes="100vw"
                className="w-[150px] h-auto"
                priority
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6 lg:gap-8 text-cyan-800">
            <Link
              href="/categories/pens"
              className={`font-bold transition-colors ${
                currentPath.includes("/categories/pens")
                  ? "text-cyan-600"
                  : "hover:text-cyan-600"
              }`}
            >
              Pens
            </Link>

            <Link
              href="/categories/notebooks"
              className={`font-bold transition-colors ${
                currentPath.includes("/categories/notebooks")
                  ? "text-cyan-600"
                  : "hover:text-cyan-600"
              }`}
            >
              Notebooks
            </Link>

            <Link
              href="/categories/staplers-staples"
              className={`font-bold transition-colors ${
                currentPath.includes("/categories/staplers-staples")
                  ? "text-cyan-600"
                  : "hover:text-cyan-600"
              }`}
            >
              Staplers
            </Link>

            <Link
              href="/categories/sticky-notes"
              className={`font-bold transition-colors ${
                currentPath.includes("/categories/sticky-notes")
                  ? "text-cyan-600"
                  : "hover:text-cyan-600"
              }`}
            >
              Sticky Notes
            </Link>

            <Link
              href="/categories/desk-organizers"
              className={`font-bold transition-colors ${
                currentPath.includes("/categories/desk-organizers")
                  ? "text-cyan-600"
                  : "hover:text-cyan-600"
              }`}
            >
              Organizers
            </Link>

            <SearchInput size="md" />
          </nav>

          <div className="flex items-center gap-3">
            <SearchInput
              size="sm"
              placeholder="Search..."
              className="lg:hidden"
            />

            <div className="hidden md:flex items-center gap-5">

              {user ? (
                <UserMenu />
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-cyan-800 hover:text-cyan-600 transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}
            </div>

            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}

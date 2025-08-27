"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SearchInput({
  placeholder = "Search products...",
  className = "",
  size = "md",
}: SearchInputProps) {
  const sizeClasses = {
    sm: "pl-8 pr-3 py-2 w-32 sm:w-40",
    md: "pl-10 pr-4 py-2 w-48",
    lg: "pl-12 pr-6 py-3 w-64",
  };

  const iconClasses = {
    sm: "absolute left-2 w-4 h-4",
    md: "absolute left-3 w-4 h-4",
    lg: "absolute left-4 w-5 h-5",
  };

  return (
    <div className={`flex items-center relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className={`${sizeClasses[size]} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm`}
      />
      <MagnifyingGlassIcon className={`${iconClasses[size]} text-gray-400`} />
    </div>
  );
}

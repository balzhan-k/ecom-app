"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

export function UserMenu() {
  const { user, userData, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-cyan-800 hover:text-cyan-600 transition-colors"
      >
        <UserIcon className="w-5 h-5" />
        <span className="font-medium">{userData?.email || user.email}</span>
        <ArrowDownIcon
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              <div className="font-medium">{userData?.email}</div>
              <div className="text-xs text-gray-500 capitalize">
                {userData?.role}
              </div>
            </div>

            {userData?.role === "admin" ? (
              <>
                <button
                  onClick={() => {
                    router.push("/admin");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Admin Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    router.push("/orders");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Orders
                </button>
              </>
            )}

            <div className="border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

export default function ClearCartOnMount() {
  const { clearCart } = useCart();
  const hasClearedRef = useRef(false);

  useEffect(() => {
    if (!hasClearedRef.current) {
      hasClearedRef.current = true;
      clearCart();
    }
    // Run only once on mount
  }, []);

  return null;
}

"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import QuantityControl from "@/components/common/QuantityControl";
import { formatPrice, calculateDiscountedPrice } from "@/utils/formatters";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CartPage() {
  const {
    cart,
    getTotalItems,
    getTotalPrice,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      // Преобразуем элементы корзины в формат, который ожидает бэкенд для Stripe
      const checkoutItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price, // Предполагается, что item.price уже в центах
        quantity: item.quantity,
      }));

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: checkoutItems }),
      });

      const session = await response.json();

      if (response.ok) {
        const result = await stripe?.redirectToCheckout({
          sessionId: session.id,
        });

        if (result?.error) {
          alert(result.error.message);
        }
      } else {
        alert(session.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An unexpected error occurred.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container min-h-screen mx-auto p-4">
        <h1 className="tracking-light text-2xl font-bold leading-tight text-cyan-700 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-600 text-sm">
          Add some products to your cart to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="tracking-light text-2xl font-bold leading-tight text-cyan-700">
          Your Cart
        </h1>
        <button
          onClick={clearCart}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faTrash} />
          Clear Cart
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ul className="space-y-4">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex items-center border-b border-gray-200 pb-4 last:border-b-0"
            >
              <Image
                src={item.thumbnail}
                alt={item.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h2>
                <p className="font-semibold text-cyan-700">
                  Price: {formatPrice(item.price)}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <QuantityControl
                      quantity={item.quantity}
                      onIncrease={() => increaseQuantity(item.id)}
                      onDecrease={() => decreaseQuantity(item.id)}
                      size="sm"
                    />
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-2 rounded"
                    aria-label="Remove from cart"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-md text-gray-600">
                Total Items: {getTotalItems()}
              </p>
              <p className="text-xl font-bold text-cyan-700">
                Total Price: {formatPrice(getTotalPrice())}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 transition-colors font-semibold"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

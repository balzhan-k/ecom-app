"use client";

import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/context/CartContext";
import QuantityControl from "@/components/common/QuantityControl";
import { createCheckoutSession } from "@/app/actions/checkout";
import { formatPrice } from "@/utils/formatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

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

      // Преобразуем элементы корзины в формат для Server Action
      const checkoutItems = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      // Используем Server Action вместо прямого API вызова
      // Передаем текущий origin для создания правильных URL
      const result = await createCheckoutSession(
        checkoutItems,
        window.location.origin
      );

      if (result.success && result.url) {
        // Прямой редирект на Stripe (как в коде учительницы)
        window.location.href = result.url;
      } else if (result.success && result.sessionId) {
        // Fallback: используем Stripe.js для редиректа
        const checkoutResult = await stripe?.redirectToCheckout({
          sessionId: result.sessionId,
        });

        if (checkoutResult?.error) {
          alert(checkoutResult.error.message);
        }
      } else {
        alert(result.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An unexpected error occurred.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-10 mx-auto p-4 flex flex-col items-center justify-center">
        <Image
          src="/shoppingBag.jpg"
          alt="Shopping Bag"
          width={480}
          height={480}
          className="rounded-lg w-full max-w-[480px]"
        />

        <p className="text-lg font-bold leading-tight max-w-[480px] text-center text-cyan-700 mt-6">
          Your bag is empty
        </p>
        <p className="text-sm font-normal leading-normal  text-center mt-2 text-stone-500">
          Looks like you haven't added anything to your bag yet. Let's find
          something you love!
        </p>
        <Link
          href="/"
          className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-3 rounded-lg transition-colors mt-4 font-semibold"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 pb-20">
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
                  {formatPrice(item.price)}
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
                    className="text-cyan-600 hover:text-cyan-800 transition-colors p-2 rounded"
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
            <div className="flex justify-between gap-4 items-center mb-8">
              <button
                onClick={clearCart}
                className="bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 transition-colors font-semibold"
              >
                Clear Cart
              </button>
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
    </div>
  );
}

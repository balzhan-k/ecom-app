import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="container mx-auto p-8 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            You cancelled the payment process. Your order was not processed.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/cart"
            className="inline-block bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 transition-colors font-semibold"
          >
            Return to Cart
          </Link>

          <Link
            href="/"
            className="inline-block bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold ml-4"
          >
            Continue Shopping
          </Link>

          <div className="text-sm text-gray-500 mt-6">
            <p>
              If you had any issues with the payment, please contact our support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

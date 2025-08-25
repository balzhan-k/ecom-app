import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

interface SuccessProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function Success({ searchParams }: SuccessProps) {
  const { session_id } = searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    const status = session.status;
    const customerEmail = session.customer_details?.email;

    if (status === "open") {
      return redirect("/");
    }

    if (status === "complete") {
      return (
        <div className="container mx-auto p-8 min-h-screen">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-cyan-700 mb-4">
                Payment Successful!
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Thank you for your order! A confirmation will be sent to{" "}
                <span className="font-semibold text-cyan-700">
                  {customerEmail}
                </span>
                .
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Details
              </h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Session ID:</span> {session_id}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Status:</span> Paid
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {customerEmail}
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="/"
                className="inline-block bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 transition-colors font-semibold"
              >
                Continue Shopping
              </a>

              <div className="text-sm text-gray-500 mt-6">
                <p>
                  If you have any questions, please contact our support:{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-cyan-600 hover:underline"
                  >
                    support@example.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-8 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">
            Payment Processing
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Your payment is being processed. Status: {status}
          </p>
          <a
            href="/"
            className="inline-block bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 transition-colors font-semibold"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error retrieving session:", error);
    return (
      <div className="container mx-auto p-8 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Error Checking Payment
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Unable to verify your payment status. Please contact support.
          </p>
          <a
            href="/"
            className="inline-block bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 transition-colors font-semibold"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }
}

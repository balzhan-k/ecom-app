import { NextResponse } from "next/server";
import { backfillStripeIds } from "@/app/actions/admin/backfills";

export async function GET() {
  try {
    console.log("Starting Stripe backfill process...");

    const result = await backfillStripeIds();

    console.log("Backfill completed successfully:", result);

    return NextResponse.json({
      success: true,
      message: "Backfill completed successfully",
      ...result,
    });
  } catch (error: unknown) {
    console.error("Backfill failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Backfill failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

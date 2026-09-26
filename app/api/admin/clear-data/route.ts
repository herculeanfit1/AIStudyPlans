import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { clearAllFeedbackData } from "@/lib/admin-supabase";

export async function POST() {
  // Admin only (PLAN-001). Per-route check behind the middleware guard; the
  // `.catch` turns an auth() failure into a 401 instead of a 500.
  const session = await auth().catch(() => null);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
  }

  try {
    // Clear all feedback data
    clearAllFeedbackData();

    return NextResponse.json({ success: true, message: "All feedback data cleared successfully" });
  } catch (error) {
    console.error("Error clearing feedback data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to clear feedback data" },
      { status: 500 },
    );
  }
}

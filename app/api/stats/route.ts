import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const revenueResult = await query(`SELECT COALESCE(SUM(amount), 0) as total FROM bookings WHERE status = 'confirmed'`);
    const bookingsResult = await query(`SELECT COUNT(*) as count FROM bookings`);
    const guestsResult = await query(`SELECT COALESCE(SUM(guests), 0) as total FROM bookings WHERE status = 'confirmed' AND check_in >= CURRENT_DATE`);

    return NextResponse.json({
      revenue: parseInt(revenueResult.rows[0]?.total) || 0,
      bookings: parseInt(bookingsResult.rows[0]?.count) || 0,
      guests: parseInt(guestsResult.rows[0]?.total) || 0,
      views: 12400,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
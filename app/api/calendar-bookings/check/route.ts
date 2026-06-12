import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { booking_date, time_slot } = await request.json();
    
    const result = await query(
      `SELECT * FROM calendar_bookings 
       WHERE booking_date = $1 AND time_slot = $2 AND status IN ('pending', 'confirmed')`,
      [booking_date, time_slot]
    );
    
    return NextResponse.json({ available: result.rows.length === 0 });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}
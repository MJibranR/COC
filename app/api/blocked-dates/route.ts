import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Create table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS blocked_dates (
        id SERIAL PRIMARY KEY,
        booking_date DATE NOT NULL,
        time_slot VARCHAR(20) NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(booking_date, time_slot)
      )
    `);
    
    const result = await query(`
      SELECT * FROM blocked_dates 
      WHERE booking_date >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY booking_date ASC
    `);
    
    console.log("Blocked dates fetched:", result.rows);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { booking_date, time_slot, reason } = await request.json();
    
    const result = await query(
      `INSERT INTO blocked_dates (booking_date, time_slot, reason, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (booking_date, time_slot) DO UPDATE 
       SET reason = $3, updated_at = NOW()
       RETURNING *`,
      [booking_date, time_slot, reason || "Blocked by admin"]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error blocking date:", error);
    return NextResponse.json({ error: "Failed to block date" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    await query(`DELETE FROM blocked_dates WHERE id = $1`, [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unblocking date:", error);
    return NextResponse.json({ error: "Failed to unblock date" }, { status: 500 });
  }
}
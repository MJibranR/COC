import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET all calendar bookings
export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM calendar_bookings 
      ORDER BY booking_date DESC, created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching calendar bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar bookings" },
      { status: 500 }
    );
  }
}

// POST new calendar booking
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, booking_date, time_slot, hours, status } = await request.json();
    
    // Check if slot is already booked
    const existing = await query(
      `SELECT * FROM calendar_bookings 
       WHERE booking_date = $1 AND time_slot = $2 AND status IN ('pending', 'confirmed')`,
      [booking_date, time_slot]
    );
    
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }
    
    const result = await query(
      `INSERT INTO calendar_bookings (name, email, phone, booking_date, time_slot, hours, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [name, email, phone, booking_date, time_slot, hours, status || 'pending']
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating calendar booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// PUT update calendar booking status
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const result = await query(
      `UPDATE calendar_bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating calendar booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE calendar booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await query(`DELETE FROM calendar_bookings WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting calendar booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
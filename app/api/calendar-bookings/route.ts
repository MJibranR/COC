import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query(`
      CREATE TABLE IF NOT EXISTS calendar_bookings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        booking_date DATE NOT NULL,
        time_slot VARCHAR(20) NOT NULL,
        hours INTEGER NOT NULL,
        amount INTEGER,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    const bookings = await query(`
      SELECT * FROM calendar_bookings 
      ORDER BY booking_date DESC, created_at DESC
    `);
    
    return NextResponse.json(bookings.rows);
  } catch (error) {
    console.error("Error fetching calendar bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, booking_date, time_slot, hours, amount, status } = await request.json();
    
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
      `INSERT INTO calendar_bookings (name, email, phone, booking_date, time_slot, hours, amount, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [name, email, phone, booking_date, time_slot, hours, amount, status || 'pending']
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating calendar booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

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
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await query(`DELETE FROM calendar_bookings WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting calendar booking:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
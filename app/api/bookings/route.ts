import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query(`
      SELECT b.*, v.name as villa_name 
      FROM bookings b 
      LEFT JOIN villas v ON b.villa_id = v.id 
      ORDER BY b.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, villa_id, check_in, check_out, guests, amount, timeSlot, hours, date, status } = await request.json();
    
    // For calendar booking (date, timeSlot, hours)
    if (date && timeSlot && hours) {
      const result = await query(
        `INSERT INTO calendar_bookings (name, email, phone, booking_date, time_slot, hours, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING *`,
        [name, email, phone, date, timeSlot, hours, status || 'pending']
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }
    
    // For regular villa booking
    const result = await query(
      `INSERT INTO bookings (name, email, phone, villa_id, check_in, check_out, guests, amount, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
       RETURNING *`,
      [name, email, phone, villa_id, check_in, check_out, guests, amount]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const result = await query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await query(`DELETE FROM bookings WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
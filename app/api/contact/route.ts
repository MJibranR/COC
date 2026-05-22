// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query(`SELECT * FROM contact_messages ORDER BY created_at DESC`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();
    
    console.log("Received contact form submission:", { name, email, phone, message });
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }
    
    const result = await query(
      `INSERT INTO contact_messages (name, email, phone, message, read, created_at)
       VALUES ($1, $2, $3, $4, false, NOW())
       RETURNING *`,
      [name, email, phone || null, message]
    );
    
    console.log("Message saved:", result.rows[0]);
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, read } = await request.json();
    const result = await query(
      `UPDATE contact_messages SET read = $1 WHERE id = $2 RETURNING *`,
      [read, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await query(`DELETE FROM contact_messages WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
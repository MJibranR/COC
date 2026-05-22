import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query(`SELECT * FROM villas ORDER BY price ASC`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching villas:", error);
    return NextResponse.json(
      { error: "Failed to fetch villas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, price, capacity, bedrooms, image, features, popular } = await request.json();
    const result = await query(
      `INSERT INTO villas (name, price, capacity, bedrooms, image, features, popular, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [name, price, capacity, bedrooms, image, features, popular]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating villa:", error);
    return NextResponse.json(
      { error: "Failed to create villa" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, price, capacity, bedrooms, image, features, popular } = await request.json();
    const result = await query(
      `UPDATE villas 
       SET name = $1, price = $2, capacity = $3, bedrooms = $4, image = $5, features = $6, popular = $7
       WHERE id = $8 RETURNING *`,
      [name, price, capacity, bedrooms, image, features, popular, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating villa:", error);
    return NextResponse.json(
      { error: "Failed to update villa" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await query(`DELETE FROM villas WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting villa:", error);
    return NextResponse.json(
      { error: "Failed to delete villa" },
      { status: 500 }
    );
  }
}
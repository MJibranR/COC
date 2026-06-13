import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Create table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS calendar_prices (
        id SERIAL PRIMARY KEY,
        weekday_morning_10 INTEGER DEFAULT 25000,
        weekday_night_10 INTEGER DEFAULT 35000,
        weekend_morning_10 INTEGER DEFAULT 35000,
        weekend_night_10 INTEGER DEFAULT 45000,
        twenty_two_hours INTEGER DEFAULT 85000,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    const result = await query(`SELECT * FROM calendar_prices LIMIT 1`);
    
    if (result.rows.length === 0) {
      // Insert default values
      await query(`
        INSERT INTO calendar_prices (weekday_morning_10, weekday_night_10, weekend_morning_10, weekend_night_10, twenty_two_hours)
        VALUES (25000, 35000, 35000, 45000, 85000)
      `);
      return NextResponse.json({
        weekdayMorning10: 25000,
        weekdayNight10: 35000,
        weekendMorning10: 35000,
        weekendNight10: 45000,
        twentyTwoHours: 85000
      });
    }
    
    const data = result.rows[0];
    return NextResponse.json({
      weekdayMorning10: data.weekday_morning_10,
      weekdayNight10: data.weekday_night_10,
      weekendMorning10: data.weekend_morning_10,
      weekendNight10: data.weekend_night_10,
      twentyTwoHours: data.twenty_two_hours
    });
  } catch (error) {
    console.error("Error fetching calendar prices:", error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekdayMorning10, weekdayNight10, weekendMorning10, weekendNight10, twentyTwoHours } = body;
    
    console.log("Saving calendar prices:", { weekdayMorning10, weekdayNight10, weekendMorning10, weekendNight10, twentyTwoHours });
    
    const existing = await query(`SELECT id FROM calendar_prices LIMIT 1`);
    
    if (existing.rows.length > 0) {
      await query(
        `UPDATE calendar_prices SET 
          weekday_morning_10 = $1,
          weekday_night_10 = $2,
          weekend_morning_10 = $3,
          weekend_night_10 = $4,
          twenty_two_hours = $5,
          updated_at = NOW()
        WHERE id = $6`,
        [weekdayMorning10, weekdayNight10, weekendMorning10, weekendNight10, twentyTwoHours, existing.rows[0].id]
      );
    } else {
      await query(
        `INSERT INTO calendar_prices (weekday_morning_10, weekday_night_10, weekend_morning_10, weekend_night_10, twenty_two_hours)
         VALUES ($1, $2, $3, $4, $5)`,
        [weekdayMorning10, weekdayNight10, weekendMorning10, weekendNight10, twentyTwoHours]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving calendar prices:", error);
    return NextResponse.json({ error: "Failed to save prices" }, { status: 500 });
  }
}
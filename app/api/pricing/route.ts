import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS pricing (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        facilities TEXT[],
        contact_number VARCHAR(50),
        website VARCHAR(255),
        enabled BOOLEAN DEFAULT true,
        pricing_options JSONB DEFAULT '[]',
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    const result = await query(`SELECT * FROM pricing LIMIT 1`);
    
    if (result.rows.length === 0) {
      const defaultData = {
        id: 1,
        title: "Colors of Combine Farm House",
        description: "Secure your booking before the slots are gone!",
        facilities: [
          "3 Bedrooms (without AC)",
          "Kitchen",
          "Kidz Play Area & Birds Area",
          "Table Tennis",
          "Foosball, Carrom, Pool ball",
          "BBQ Pit (Angeethi + 1 Dozen Seekh)",
          "Spacious Parking Area",
          "K-Electric + Solar + Generator Backup",
          "2 Swimming Pools (Adults & Kids)",
          "Poolside Shower Area + 4 Changing Rooms",
          "6 Public Washrooms (Ladies & Gents)"
        ],
        contactNumber: "03193372277",
        website: "www.combinegrp.com",
        enabled: true,
        pricingOptions: [
          { id: "weekday-night", name: "weekday-night", label: "Weekday Night", description: "Monday - Thursday", price: 45000, isTrending: false, enabled: true, icon: "🌙" },
          { id: "weekend-night", name: "weekend-night", label: "Weekend Night", description: "Friday - Sunday", price: 55000, isTrending: true, enabled: true, icon: "⭐" },
          { id: "22-hours", name: "22-hours", label: "22 Hours", description: "Any 22-hour slot", price: 85000, isTrending: false, enabled: true, icon: "⏰" }
        ]
      };
      return NextResponse.json(defaultData);
    }
    
    const data = result.rows[0];
    if (data.pricing_options && typeof data.pricing_options === 'string') {
      data.pricing_options = JSON.parse(data.pricing_options);
    }
    
    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      facilities: data.facilities,
      contactNumber: data.contact_number,
      website: data.website,
      enabled: data.enabled,
      pricingOptions: data.pricing_options || []
    });
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, facilities, contactNumber, website, enabled, pricingOptions } = body;
    
    const existing = await query(`SELECT id FROM pricing LIMIT 1`);
    
    if (existing.rows.length > 0) {
      await query(
        `UPDATE pricing SET 
          title = $1, 
          description = $2, 
          facilities = $3, 
          contact_number = $4, 
          website = $5, 
          enabled = $6, 
          pricing_options = $7, 
          updated_at = NOW() 
        WHERE id = $8`,
        [title, description, facilities, contactNumber, website, enabled, JSON.stringify(pricingOptions), existing.rows[0].id]
      );
    } else {
      await query(
        `INSERT INTO pricing (title, description, facilities, contact_number, website, enabled, pricing_options, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [title, description, facilities, contactNumber, website, enabled, JSON.stringify(pricingOptions)]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating pricing:", error);
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 });
  }
}
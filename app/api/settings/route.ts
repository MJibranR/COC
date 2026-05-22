import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET all settings
export async function GET() {
  try {
    // Check if site_settings table exists
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'site_settings'
      );
    `);
    
    const tableExists = tableCheck.rows[0]?.exists;
    
    if (!tableExists) {
      // Return default settings if table doesn't exist
      return NextResponse.json(getDefaultSettings());
    }
    
    const result = await query(`SELECT setting_key, setting_value FROM site_settings`);
    const settings: Record<string, any> = {};
    
    result.rows.forEach(row => {
      try {
        settings[row.setting_key] = typeof row.setting_value === 'string' 
          ? JSON.parse(row.setting_value) 
          : row.setting_value;
      } catch (e) {
        settings[row.setting_key] = row.setting_value;
      }
    });
    
    // Merge with defaults for missing keys
    const defaults = getDefaultSettings();
    const merged = { ...defaults, ...settings };
    
    return NextResponse.json(merged);
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return default settings on error
    return NextResponse.json(getDefaultSettings());
  }
}

// PUT update a setting
export async function PUT(request: NextRequest) {
  try {
    const { key, value } = await request.json();
    
    // Ensure table exists
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await query(
      `INSERT INTO site_settings (setting_key, setting_value, updated_at) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (setting_key) DO UPDATE 
       SET setting_value = $2, updated_at = NOW()`,
      [key, JSON.stringify(value)]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}

function getDefaultSettings() {
  return {
    hero: {
      title: "Embrace the Spectrum of Serenity",
      subtitle: "Where nature's palette meets architectural poetry — an exclusive sanctuary for the discerning soul.",
      badge: "Award-Winning Luxury Estate",
      buttonText: "Begin Your Journey",
      backgroundImage: "/hero.jpeg",
      enabled: true,
    },
    about: {
      title: "Where Architecture Meets the Wilderness",
      subtitle: "The Estate",
      description: "Spanning over 50 acres of pristine landscape, Colors of Combine is a masterpiece of sustainable luxury. Each villa is meticulously crafted to harmonize with the natural contours of the land.",
      stats: [
        { label: "Acres of Wilderness", value: "50+" },
        { label: "Private Villas", value: "12" },
        { label: "Award Winning", value: "2024" },
        { label: "Guest Rating", value: "5.0" }
      ],
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
      enabled: true,
    },
    villas: {
      title: "The Villas",
      subtitle: "Private Sanctuaries",
      enabled: true,
    },
    experiences: {
      title: "Immersive Experiences",
      subtitle: "Curated Journeys",
      items: [
        { icon: "Waves", title: "Nature Pools", description: "Crystal-clear infinity pools blending with horizon", color: "from-cyan-400 to-blue-500" },
        { icon: "Coffee", title: "Farm to Table", description: "Gourmet dining with organic local ingredients", color: "from-amber-400 to-orange-500" },
        { icon: "Flower2", title: "Wellness Retreats", description: "Holistic healing and rejuvenation programs", color: "from-emerald-400 to-teal-500" },
        { icon: "Compass", title: "Curated Excursions", description: "Private tours of nearby vineyards and trails", color: "from-rose-400 to-pink-500" }
      ],
      enabled: true,
    },
    wellness: {
      title: "Rejuvenate Your Mind & Body",
      subtitle: "Holistic Wellness",
      items: ["Ayurvedic Treatments", "Guided Meditation", "Cryotherapy & Sauna", "Personalized Nutrition Plans"],
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
      enabled: true,
    },
    gallery: {
      title: "The Gallery",
      subtitle: "Visual Poetry",
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600",
        "https://images.unsplash.com/photo-1540206395-68808572332f?w=600",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
      ],
      enabled: true,
    },
    journal: {
      title: "The Journal",
      subtitle: "Stories & Inspiration",
      posts: [
        { title: "The Art of Slow Living", date: "Dec 15, 2024", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600", description: "Embracing mindfulness in the modern world" },
        { title: "Farm to Fork: Our Philosophy", date: "Dec 10, 2024", image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600", description: "How we're redefining sustainable dining" },
        { title: "Architecture in Harmony", date: "Dec 5, 2024", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600", description: "Designing spaces that celebrate nature" }
      ],
      enabled: true,
    },
    contact: {
      title: "Begin Your Journey Today",
      subtitle: "Get in Touch",
      address: "Colors of Combine Estate, Serenity Valley",
      phone: "+1 (888) 123-4567",
      email: "hello@colorsofcombine.com",
      enabled: true,
    },
    footer: {
      logo: "Colors of Combine",
      description: "Sustainable luxury nestled in nature's embrace.",
      copyright: "© 2024 Colors of Combine. All rights reserved.",
      enabled: true,
      socialLinks: {
        facebook: "https://facebook.com/colorsofcombine",
        instagram: "https://instagram.com/colorsofcombine",
        twitter: "https://twitter.com/colorsofcombine",
        youtube: "https://youtube.com/colorsofcombine"
      },
      contact: {
        address: "Colors of Combine Estate, Serenity Valley",
        phone: "+1 (888) 123-4567",
        email: "hello@colorsofcombine.com"
      }
    },
    header: {
      logo: {
        text: "Colors of Combine",
        image: "",
        useImage: false
      },
      navLinks: [
        { id: "home", label: "Home", href: "#home", enabled: true },
        { id: "theestate", label: "The Estate", href: "#theestate", enabled: true },
        { id: "villas", label: "Villas", href: "#villas", enabled: true },
        { id: "experiences", label: "Experiences", href: "#experiences", enabled: true },
        { id: "wellness", label: "Wellness", href: "#wellness", enabled: true },
        { id: "gallery", label: "Gallery", href: "#gallery", enabled: true },
        { id: "journal", label: "Journal", href: "#journal", enabled: true },
        { id: "contact", label: "Contact", href: "#contact", enabled: true }
      ],
      showBookingButton: true,
      bookingButtonText: "Book Your Stay",
      backgroundColor: "transparent",
      textColor: "#ffffff",
      transparentOnScroll: true
    },
    colors: {
      primary: "#1A2E26",
      secondary: "#FFD700",
      accent: "#FF8C00",
      background: "#FDFBF7",
      text: "#333333"
    }
  };
}
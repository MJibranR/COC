"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  DollarSign,
  Eye,
  TrendingUp,
  MessageSquare,
  Home,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Bell,
  Shield,
  BarChart3,
  X,
  RefreshCw,
  Image as ImageIcon,
  FileText,
  Settings,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  Upload,
  Save,
  Eye as EyeIcon,
  Palette,
  Layout,
  Menu as MenuIcon,
  Globe as Facebook,
  Globe as Instagram,
  Globe as Twitter,
  Globe as Youtube,
  EyeOff,
  Link as LinkIcon,
  GripVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpDown,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

// Types
interface PricingOption {
  id: string;
  name: string;
  label: string;
  description: string;
  price: number;
  isTrending: boolean;
  enabled: boolean;
  icon?: string;
}

interface PricingData {
  id: number;
  title: string;
  description: string;
  facilities: string[];
  contactNumber: string;
  website: string;
  enabled: boolean;
  pricingOptions: PricingOption[];
}

interface CalendarBooking {
  id: number;
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  time_slot: "morning" | "night";
  hours: number;
  status: string;
  created_at: string;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  villa_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  amount: number;
  status: string;
  created_at: string;
}

interface Villa {
  id: number;
  name: string;
  price: number;
  capacity: number;
  bedrooms: number;
  image: string;
  features: string[];
  popular: boolean;
  description?: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface NavLink {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
}

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    buttonText: string;
    backgroundImage: string;
    enabled: boolean;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    stats: Array<{ label: string; value: string }>;
    image: string;
    enabled: boolean;
  };
  villas: {
    title: string;
    subtitle: string;
    enabled: boolean;
  };
  experiences: {
    title: string;
    subtitle: string;
    items: Array<{ icon: string; title: string; description: string; color: string }>;
    enabled: boolean;
  };
  wellness: {
    title: string;
    subtitle: string;
    items: string[];
    image: string;
    enabled: boolean;
  };
  gallery: {
    title: string;
    subtitle: string;
    images: string[];
    enabled: boolean;
  };
  journal: {
    title: string;
    subtitle: string;
    posts: Array<{ title: string; date: string; image: string; description: string }>;
    enabled: boolean;
  };
  contact: {
    title: string;
    subtitle: string;
    address: string;
    phone: string;
    email: string;
    enabled: boolean;
  };
  footer: {
    logo: string;
    description: string;
    copyright: string;
    enabled: boolean;
    socialLinks: {
      facebook: string;
      instagram: string;
      twitter: string;
      youtube: string;
    };
    contact: {
      address: string;
      phone: string;
      email: string;
    };
  };
  header: {
    logo: {
      text: string;
      image: string;
      useImage: boolean;
    };
    navLinks: NavLink[];
    showBookingButton: boolean;
    bookingButtonText: string;
    backgroundColor: string;
    textColor: string;
    transparentOnScroll: boolean;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  customSections: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    layout: string;
    backgroundColor: string;
    textColor: string;
    enabled: boolean;
    items: Array<{ title: string; description: string; icon: string }>;
  }>;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [pricingData, setPricingData] = useState<PricingData>({
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
    { id: "22-hours", name: "22-hours", label: "22 Hours", description: "Any 22-hour slot", price: 85000, isTrending: false, enabled: true, icon: "⏰" },
    { id: "weekday-morning", name: "weekday-morning", label: "Weekday Morning", description: "Monday - Thursday (8 AM - 6 PM)", price: 35000, isTrending: false, enabled: false, icon: "☀️" },
    { id: "weekend-morning", name: "weekend-morning", label: "Weekend Morning", description: "Friday - Sunday (8 AM - 6 PM)", price: 45000, isTrending: false, enabled: false, icon: "🌅" }
  ]
});
const [newPricingOption, setNewPricingOption] = useState<Partial<PricingOption>>({ 
  label: "", 
  description: "", 
  price: 0, 
  icon: "🏷️" 
});
const [showAddPricingOption, setShowAddPricingOption] = useState(false);
const [newFacility, setNewFacility] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [calendarBookings, setCalendarBookings] = useState<CalendarBooking[]>([]);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [showBlockDateModal, setShowBlockDateModal] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState({
    booking_date: "",
    time_slot: "morning",
    reason: ""
  });
  const [showSectionBuilder, setShowSectionBuilder] = useState(false);
  const [newSection, setNewSection] = useState({
    id: Date.now().toString(),
    title: "",
    subtitle: "",
    description: "",
    layout: "grid",
    backgroundColor: "#FDFBF7",
    textColor: "#333333",
    enabled: true,
    items: [{ title: "", description: "", icon: "⭐" }]
  });
  const [siteContent, setSiteContent] = useState<SiteContent>({
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
      description: "Spanning over 50 acres of pristine landscape, Colors of Combine is a masterpiece of sustainable luxury.",
      stats: [
        { label: "Acres of Wilderness", value: "50+" },
        { label: "Private Villas", value: "12" },
        { label: "Award Winning", value: "2024" },
        { label: "Guest Rating", value: "5.0" },
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
        { icon: "Compass", title: "Curated Excursions", description: "Private tours of nearby vineyards and trails", color: "from-rose-400 to-pink-500" },
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
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
      ],
      enabled: true,
    },
    journal: {
      title: "The Journal",
      subtitle: "Stories & Inspiration",
      posts: [
        { title: "The Art of Slow Living", date: "Dec 15, 2024", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600", description: "Embracing mindfulness in the modern world" },
        { title: "Farm to Fork: Our Philosophy", date: "Dec 10, 2024", image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600", description: "How we're redefining sustainable dining" },
        { title: "Architecture in Harmony", date: "Dec 5, 2024", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600", description: "Designing spaces that celebrate nature" },
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
        youtube: "https://youtube.com/colorsofcombine",
      },
      contact: {
        address: "Colors of Combine Estate, Serenity Valley",
        phone: "+1 (888) 123-4567",
        email: "hello@colorsofcombine.com",
      },
    },
    header: {
      logo: {
        text: "Colors of Combine",
        image: "",
        useImage: false,
      },
      navLinks: [
        { id: "home", label: "Home", href: "#home", enabled: true },
        { id: "theestate", label: "The Estate", href: "#theestate", enabled: true },
        { id: "villas", label: "Villas", href: "#villas", enabled: true },
        { id: "experiences", label: "Experiences", href: "#experiences", enabled: true },
        { id: "wellness", label: "Wellness", href: "#wellness", enabled: true },
        { id: "gallery", label: "Gallery", href: "#gallery", enabled: true },
        { id: "journal", label: "Journal", href: "#journal", enabled: true },
        { id: "contact", label: "Contact", href: "#contact", enabled: true },
      ],
      showBookingButton: true,
      bookingButtonText: "Book Your Stay",
      backgroundColor: "transparent",
      textColor: "#ffffff",
      transparentOnScroll: true,
    },
    colors: {
      primary: "#1A2E26",
      secondary: "#FFD700",
      accent: "#FF8C00",
      background: "#FDFBF7",
      text: "#333333",
    },
    customSections: [],
  });
  const [stats, setStats] = useState({ revenue: 0, bookings: 0, guests: 0, views: 12400 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddVilla, setShowAddVilla] = useState(false);
  const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [newNavLink, setNewNavLink] = useState({ label: "", href: "" });
  const [newGalleryImage, setNewGalleryImage] = useState("");
  const [newJournalPost, setNewJournalPost] = useState({ title: "", date: "", image: "", description: "" });
  const [newExperienceItem, setNewExperienceItem] = useState({ title: "", description: "", color: "from-cyan-400 to-blue-500" });

useEffect(() => {
  const token = localStorage.getItem("adminAuth");
  if (token === "true") {
    setIsAuthenticated(true);
    fetchData();
    loadSiteContent();
    fetchCalendarBookings();
    fetchPricingData();
    fetchBlockedDates();
  }
}, []);

  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingsRes, villasRes, messagesRes, statsRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/villas"),
        fetch("/api/contact"),
        fetch("/api/stats"),
      ]);
      
      const bookingsData = await bookingsRes.json();
      const villasData = await villasRes.json();
      const messagesData = await messagesRes.json();
      const statsData = await statsRes.json();
      
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setVillas(Array.isArray(villasData) ? villasData : []);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarBookings = async () => {
    try {
      const res = await fetch("/api/calendar-bookings");
      const data = await res.json();
      setCalendarBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching calendar bookings:", error);
    }
  };

  const updateCalendarBookingStatus = async (id: number, status: string) => {
    try {
      await fetch("/api/calendar-bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchCalendarBookings();
      showToast(`Calendar booking status updated to ${status}`);
    } catch (error) {
      showToast("Failed to update booking", "error");
    }
  };

  const deleteCalendarBooking = async (id: number) => {
    if (confirm("Delete this calendar booking?")) {
      try {
        await fetch(`/api/calendar-bookings?id=${id}`, { method: "DELETE" });
        fetchCalendarBookings();
        showToast("Calendar booking deleted");
      } catch (error) {
        showToast("Failed to delete booking", "error");
      }
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch("/api/blocked-dates");
      const data = await res.json();
      setBlockedDates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
    }
  };

  const addBlockedDate = async () => {
  if (!newBlockedDate.booking_date) {
    showToast("Please select a date", "error");
    return;
  }
  
  try {
    await fetch("/api/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBlockedDate)
    });
    fetchBlockedDates();
    setShowBlockDateModal(false);
    setNewBlockedDate({ booking_date: "", time_slot: "morning", reason: "" });
    showToast("Date blocked successfully!");
  } catch (error) {
    showToast("Failed to block date", "error");
  }
};

const unblockDate = async (id: number) => {
  if (confirm("Unblock this date?")) {
    try {
      await fetch(`/api/blocked-dates?id=${id}`, { method: "DELETE" });
      fetchBlockedDates();
      showToast("Date unblocked successfully!");
    } catch (error) {
      showToast("Failed to unblock date", "error");
    }
  }
};

  const loadSiteContent = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setSiteContent(prev => ({
            ...prev,
            ...data,
            header: { ...prev.header, ...(data.header || {}) },
            colors: { ...prev.colors, ...(data.colors || {}) },
          }));
          showToast("Settings loaded successfully!");
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      const saved = localStorage.getItem("siteContent");
      if (saved) {
        try {
          setSiteContent(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing saved content:", e);
        }
      }
    }
  };

  const saveSiteContent = async (content: SiteContent) => {
    localStorage.setItem("siteContent", JSON.stringify(content));
    setSiteContent(content);
    
    const sections = ['hero', 'about', 'villas', 'experiences', 'wellness', 'gallery', 'journal', 'contact', 'footer', 'header', 'colors', 'customSections'];
    for (const section of sections) {
      try {
        await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: section, value: content[section as keyof SiteContent] }),
        });
      } catch (error) {
        console.error(`Error saving ${section}:`, error);
      }
    }
    showToast("Changes saved successfully!");
  };

  // Header Functions
  const updateHeaderLogo = (field: string, value: string | boolean) => {
    const updated = { ...siteContent, header: { ...siteContent.header, logo: { ...siteContent.header.logo, [field]: value } } };
    saveSiteContent(updated);
  };

  const updateNavLink = (id: string, field: string, value: string | boolean) => {
    const updated = {
      ...siteContent,
      header: {
        ...siteContent.header,
        navLinks: siteContent.header.navLinks.map(link => link.id === id ? { ...link, [field]: value } : link)
      }
    };
    saveSiteContent(updated);
  };

  const deleteNavLink = (id: string) => {
    const updated = {
      ...siteContent,
      header: {
        ...siteContent.header,
        navLinks: siteContent.header.navLinks.filter(link => link.id !== id)
      }
    };
    saveSiteContent(updated);
    showToast("Navigation link removed");
  };

  const addNavLink = () => {
    if (newNavLink.label && newNavLink.href) {
      const newLink = { id: Date.now().toString(), label: newNavLink.label, href: newNavLink.href, enabled: true };
      const updated = {
        ...siteContent,
        header: { ...siteContent.header, navLinks: [...siteContent.header.navLinks, newLink] }
      };
      saveSiteContent(updated);
      setNewNavLink({ label: "", href: "" });
      showToast("Navigation link added!");
    }
  };

  const updateHeader = (field: string, value: string | boolean) => {
    const updated = { ...siteContent, header: { ...siteContent.header, [field]: value } };
    saveSiteContent(updated);
  };

  // Section Visibility Functions
  const toggleSection = (section: string, enabled: boolean) => {
    const updated = { ...siteContent };
    if (section === 'hero') updated.hero.enabled = enabled;
    if (section === 'about') updated.about.enabled = enabled;
    if (section === 'villas') updated.villas.enabled = enabled;
    if (section === 'experiences') updated.experiences.enabled = enabled;
    if (section === 'wellness') updated.wellness.enabled = enabled;
    if (section === 'gallery') updated.gallery.enabled = enabled;
    if (section === 'journal') updated.journal.enabled = enabled;
    if (section === 'contact') updated.contact.enabled = enabled;
    if (section === 'footer') updated.footer.enabled = enabled;
    saveSiteContent(updated);
  };

  // Content Update Functions
  const updateHeroContent = (field: string, value: string) => {
    const updated = { ...siteContent, hero: { ...siteContent.hero, [field]: value } };
    saveSiteContent(updated);
  };

  const updateAboutContent = (field: string, value: string | any[]) => {
    const updated = { ...siteContent, about: { ...siteContent.about, [field]: value } };
    saveSiteContent(updated);
  };

  const updateExperiencesContent = (items: any[]) => {
    const updated = { ...siteContent, experiences: { ...siteContent.experiences, items } };
    saveSiteContent(updated);
  };

  const addExperienceItem = () => {
    if (newExperienceItem.title && newExperienceItem.description) {
      const updated = {
        ...siteContent,
        experiences: {
          ...siteContent.experiences,
          items: [...siteContent.experiences.items, { ...newExperienceItem, icon: "Star" }]
        }
      };
      saveSiteContent(updated);
      setNewExperienceItem({ title: "", description: "", color: "from-cyan-400 to-blue-500" });
      showToast("Experience added!");
    }
  };

  const deleteExperienceItem = (index: number) => {
    const updated = {
      ...siteContent,
      experiences: {
        ...siteContent.experiences,
        items: siteContent.experiences.items.filter((_, i) => i !== index)
      }
    };
    saveSiteContent(updated);
    showToast("Experience removed");
  };

  const updateWellnessContent = (field: string, value: string | string[]) => {
    const updated = { ...siteContent, wellness: { ...siteContent.wellness, [field]: value } };
    saveSiteContent(updated);
  };

  const updateGalleryContent = (images: string[]) => {
    const updated = { ...siteContent, gallery: { ...siteContent.gallery, images } };
    saveSiteContent(updated);
  };

  const addGalleryImage = () => {
    if (newGalleryImage) {
      const updated = { ...siteContent, gallery: { ...siteContent.gallery, images: [...siteContent.gallery.images, newGalleryImage] } };
      saveSiteContent(updated);
      setNewGalleryImage("");
      showToast("Gallery image added!");
    }
  };

  const deleteGalleryImage = (index: number) => {
    const updated = {
      ...siteContent,
      gallery: { ...siteContent.gallery, images: siteContent.gallery.images.filter((_, i) => i !== index) }
    };
    saveSiteContent(updated);
    showToast("Image removed");
  };

  const updateJournalPosts = (posts: any[]) => {
    const updated = { ...siteContent, journal: { ...siteContent.journal, posts } };
    saveSiteContent(updated);
  };

  const addJournalPost = () => {
    if (newJournalPost.title && newJournalPost.image) {
      const updated = {
        ...siteContent,
        journal: { ...siteContent.journal, posts: [...siteContent.journal.posts, { ...newJournalPost, date: newJournalPost.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }] }
      };
      saveSiteContent(updated);
      setNewJournalPost({ title: "", date: "", image: "", description: "" });
      showToast("Journal post added!");
    }
  };

  const deleteJournalPost = (index: number) => {
    const updated = {
      ...siteContent,
      journal: { ...siteContent.journal, posts: siteContent.journal.posts.filter((_, i) => i !== index) }
    };
    saveSiteContent(updated);
    showToast("Post removed");
  };

  const updateContactContent = (field: string, value: string) => {
    const updated = { ...siteContent, contact: { ...siteContent.contact, [field]: value } };
    saveSiteContent(updated);
  };

  const updateFooterContent = (section: string, field: string, value: string) => {
    const updated = { ...siteContent };
    if (section === "contact") {
      updated.footer.contact = { ...updated.footer.contact, [field]: value };
    } else if (section === "social") {
      updated.footer.socialLinks = { ...updated.footer.socialLinks, [field]: value };
    } else {
      updated.footer = { ...updated.footer, [field]: value };
    }
    saveSiteContent(updated);
  };

  const updateColors = (field: string, value: string) => {
    const updated = { ...siteContent, colors: { ...siteContent.colors, [field]: value } };
    saveSiteContent(updated);
  };

  // Custom Sections Functions
  const addCustomSection = () => {
    const updated = { 
      ...siteContent, 
      customSections: [...(siteContent.customSections || []), { ...newSection, id: Date.now().toString() }] 
    };
    saveSiteContent(updated);
    setShowSectionBuilder(false);
    setNewSection({
      id: Date.now().toString(),
      title: "",
      subtitle: "",
      description: "",
      layout: "grid",
      backgroundColor: "#FDFBF7",
      textColor: "#333333",
      enabled: true,
      items: [{ title: "", description: "", icon: "⭐" }]
    });
    showToast("Custom section added!");
  };

  const updateCustomSection = (index: number, field: string, value: any) => {
    const updated = { ...siteContent };
    if (field === 'title') updated.customSections[index].title = value;
    if (field === 'subtitle') updated.customSections[index].subtitle = value;
    if (field === 'description') updated.customSections[index].description = value;
    if (field === 'layout') updated.customSections[index].layout = value;
    if (field === 'backgroundColor') updated.customSections[index].backgroundColor = value;
    if (field === 'textColor') updated.customSections[index].textColor = value;
    if (field === 'enabled') updated.customSections[index].enabled = value;
    saveSiteContent(updated);
  };

  const deleteCustomSection = (index: number) => {
    if (confirm("Delete this section?")) {
      const updated = { ...siteContent };
      updated.customSections = updated.customSections.filter((_, i) => i !== index);
      saveSiteContent(updated);
      showToast("Section deleted");
    }
  };

  const addSectionItem = (sectionIndex: number) => {
    const updated = { ...siteContent };
    updated.customSections[sectionIndex].items.push({ title: "", description: "", icon: "⭐" });
    saveSiteContent(updated);
  };

  const updateSectionItem = (sectionIndex: number, itemIndex: number, field: string, value: string) => {
    const updated = { ...siteContent };
    if (field === 'icon') updated.customSections[sectionIndex].items[itemIndex].icon = value;
    if (field === 'title') updated.customSections[sectionIndex].items[itemIndex].title = value;
    if (field === 'description') updated.customSections[sectionIndex].items[itemIndex].description = value;
    saveSiteContent(updated);
  };

  const deleteSectionItem = (sectionIndex: number, itemIndex: number) => {
    const updated = { ...siteContent };
    updated.customSections[sectionIndex].items = updated.customSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
    saveSiteContent(updated);
  };

  // Booking Functions
  const updateBookingStatus = async (id: number, status: string) => {
    try {
      await fetch("/api/bookings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      fetchData();
      showToast(`Booking status updated to ${status}`);
    } catch (error) {
      showToast("Failed to update booking", "error");
    }
  };

  const deleteBooking = async (id: number) => {
    if (confirm("Delete this booking?")) {
      await fetch(`/api/bookings?id=${id}`, { method: "DELETE" });
      fetchData();
      showToast("Booking deleted");
    }
  };

  const deleteMessage = async (id: number) => {
    if (confirm("Delete this message?")) {
      await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      fetchData();
      showToast("Message deleted");
    }
  };

  const markMessageRead = async (id: number) => {
    await fetch("/api/contact", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, read: true }) });
    fetchData();
    showToast("Message marked as read");
  };

  const fetchPricingData = async () => {
  try {
    const res = await fetch("/api/pricing");
    const data = await res.json();
    if (data && Object.keys(data).length > 0) {
      setPricingData({
        ...data,
        pricingOptions: data.pricingOptions || [
          { id: "weekday-night", name: "weekday-night", label: "Weekday Night", description: "Monday - Thursday", price: 45000, isTrending: false, enabled: true, icon: "🌙" },
          { id: "weekend-night", name: "weekend-night", label: "Weekend Night", description: "Friday - Sunday", price: 55000, isTrending: true, enabled: true, icon: "⭐" },
          { id: "22-hours", name: "22-hours", label: "22 Hours", description: "Any 22-hour slot", price: 85000, isTrending: false, enabled: true, icon: "⏰" }
        ]
      });
    }
  } catch (error) {
    console.error("Error fetching pricing:", error);
  }
};

const savePricingData = async () => {
  try {
    await fetch("/api/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: pricingData.title,
        description: pricingData.description,
        facilities: pricingData.facilities,
        contactNumber: pricingData.contactNumber,
        website: pricingData.website,
        enabled: pricingData.enabled,
        pricingOptions: pricingData.pricingOptions
      })
    });
    showToast("Pricing updated successfully!");
  } catch (error) {
    showToast("Failed to update pricing", "error");
  }
};

const updatePricingOption = (id: string, field: string, value: any) => {
  setPricingData(prev => ({
    ...prev,
    pricingOptions: prev.pricingOptions.map(opt => 
      opt.id === id ? { ...opt, [field]: value } : opt
    )
  }));
};

const addPricingOption = () => {
  if (newPricingOption.label && newPricingOption.price) {
    const newOption: PricingOption = {
      id: newPricingOption.label.toLowerCase().replace(/\s+/g, '-'),
      name: newPricingOption.label.toLowerCase().replace(/\s+/g, '-'),
      label: newPricingOption.label,
      description: newPricingOption.description || "",
      price: newPricingOption.price,
      isTrending: false,
      enabled: true,
      icon: newPricingOption.icon || "🏷️"
    };
    setPricingData(prev => ({
      ...prev,
      pricingOptions: [...prev.pricingOptions, newOption]
    }));
    setNewPricingOption({ label: "", description: "", price: 0, icon: "🏷️" });
    setShowAddPricingOption(false);
    showToast("Pricing option added! Click Save to persist.");
  }
};

const deletePricingOption = (id: string) => {
  if (confirm("Delete this pricing option?")) {
    setPricingData(prev => ({
      ...prev,
      pricingOptions: prev.pricingOptions.filter(opt => opt.id !== id)
    }));
    showToast("Pricing option removed. Click Save to persist.");
  }
};

const addFacility = () => {
  if (newFacility.trim()) {
    setPricingData(prev => ({
      ...prev,
      facilities: [...prev.facilities, newFacility.trim()]
    }));
    setNewFacility("");
  }
};

const removeFacility = (index: number) => {
  setPricingData(prev => ({
    ...prev,
    facilities: prev.facilities.filter((_, i) => i !== index)
  }));
};

  // Villa Functions
  const saveVilla = async (villaData: Partial<Villa>) => {
    try {
      await fetch("/api/villas", { method: editingVilla ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingVilla ? { ...villaData, id: editingVilla.id } : villaData) });
      setShowAddVilla(false);
      setEditingVilla(null);
      fetchData();
      showToast(editingVilla ? "Villa updated" : "Villa created");
    } catch (error) {
      showToast("Failed to save villa", "error");
    }
  };

  const deleteVilla = async (id: number) => {
    if (confirm("Delete this villa?")) {
      await fetch(`/api/villas?id=${id}`, { method: "DELETE" });
      fetchData();
      showToast("Villa deleted");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      fetchData();
      loadSiteContent();
      showToast("Login successful!");
    } else {
      alert("Invalid password. Try: admin123");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
    showToast("Logged out");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A2E26] to-[#2D4A3E] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-4"><Shield size={32} className="text-[#1A2E26]" /></div>
            <h2 className="text-2xl font-light text-white">Admin Access</h2>
            <p className="text-white/50 text-sm mt-2">Password: admin123</p>
          </div>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-[#FFD700] mb-4" />
            <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold">Login</button>
          </form>
          <Link href="/" className="block text-center mt-4 text-white/50 text-sm hover:text-white">← Back to Website</Link>
        </motion.div>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.read).length;
  const filteredBookings = bookings.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const sections = [
    { id: "hero", label: "Hero Section", icon: EyeIcon, enabled: siteContent.hero.enabled },
    { id: "about", label: "About Section", icon: FileText, enabled: siteContent.about.enabled },
    { id: "villas", label: "Villas Section", icon: Home, enabled: siteContent.villas.enabled },
    { id: "experiences", label: "Experiences Section", icon: Star, enabled: siteContent.experiences.enabled },
    { id: "wellness", label: "Wellness Section", icon: Heart, enabled: siteContent.wellness.enabled },
    { id: "gallery", label: "Gallery Section", icon: ImageIcon, enabled: siteContent.gallery.enabled },
    { id: "journal", label: "Journal Section", icon: FileText, enabled: siteContent.journal.enabled },
    { id: "contact", label: "Contact Section", icon: Mail, enabled: siteContent.contact.enabled },
    { id: "footer", label: "Footer", icon: Layout, enabled: siteContent.footer.enabled },
  ];

  return (
    <div className="min-h-screen text-black bg-[#F5F2ED]">
      <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className={`fixed top-20 right-6 z-50 px-6 py-3 rounded-lg shadow-lg ${toast.type === "error" ? "bg-red-500" : "bg-green-500"} text-white`}>{toast.message}</motion.div>}</AnimatePresence>
      
      <nav className="bg-[#1A2E26] text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] rounded-full flex items-center justify-center"><span className="text-[#1A2E26] font-bold">C</span></div>
            <span>Colors of Combine | Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchData}><RefreshCw size={18} /></button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"><LogOut size={16} /> Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: DollarSign, label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, change: "+23%", color: "from-emerald-400 to-teal-500" },
            { icon: Calendar, label: "Total Bookings", value: stats.bookings.toString(), change: "+12%", color: "from-blue-400 to-cyan-500" },
            { icon: Users, label: "Active Guests", value: stats.guests.toString(), change: "+8%", color: "from-amber-400 to-orange-500" },
            { icon: Eye, label: "Website Views", value: stats.views.toLocaleString(), change: "+31%", color: "from-rose-400 to-pink-500" },
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}><stat.icon size={20} className="text-white" /></div>
                <span className="text-green-500 text-sm font-semibold"><TrendingUp size={12} className="inline" /> {stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-[#1A2E26]">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
        
        {loading ? (
          <div className="flex justify-center"><div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
              {[
                { id: "dashboard", icon: BarChart3, label: "Dashboard" },
                { id: "bookings", icon: Calendar, label: "Bookings", count: bookings.length },
                { id: "messages", icon: MessageSquare, label: "Messages", count: unreadCount },
                { id: "villas", icon: Home, label: "Villas", count: villas.length },
                { id: "header", icon: MenuIcon, label: "Header & Navigation" },
                { id: "sections", icon: Layout, label: "Section Visibility" },
                { id: "hero", icon: EyeIcon, label: "Hero Section" },
                { id: "about", icon: FileText, label: "About Section" },
                { id: "experiences", icon: Star, label: "Experiences" },
                { id: "wellness", icon: Heart, label: "Wellness" },
                { id: "gallery", icon: ImageIcon, label: "Gallery" },
                { id: "journal", icon: FileText, label: "Journal" },
                { id: "pricing", icon: DollarSign, label: "Pricing" },
                { id: "calendar-bookings", icon: Calendar, label: "Calendar Bookings", count: calendarBookings.length },
                { id: "blocked-dates", icon: Calendar, label: "Blocked Dates", count: blockedDates.length },
                { id: "contact", icon: Mail, label: "Contact" },
                { id: "footer", icon: Layout, label: "Footer" },
                { id: "colors", icon: Palette, label: "Colors & Styling" },
                { id: "customsections", icon: Layout, label: "Custom Sections", count: siteContent.customSections?.length || 0 },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all ${activeTab === tab.id ? "bg-white text-[#1A2E26] border-b-2 border-[#FFD700] font-semibold" : "text-gray-500 hover:text-[#1A2E26]"}`}>
                  <tab.icon size={16} /> {tab.label}
                  {tab.count !== undefined && tab.count > 0 && <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-[#FFD700] text-[#1A2E26]" : "bg-gray-200 text-gray-600"}`}>{tab.count}</span>}
                </button>
              ))}
            </div>

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>{bookings.slice(0, 5).map(b => (<div key={b.id} className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2"><div><div className="font-medium">{b.name}</div><div className="text-sm text-gray-500">{b.villa_name}</div></div><div className="text-right"><div>${b.amount}</div><span className={`text-xs px-2 py-0.5 rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{b.status}</span></div></div>))}</div>
                  <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-lg font-semibold mb-4">Recent Messages</h3>{messages.slice(0, 5).map(m => (<div key={m.id} className={`p-3 rounded-lg mb-2 ${!m.read ? "bg-amber-50" : "bg-gray-50"}`}><div className="font-medium">{m.name}</div><div className="text-sm text-gray-500 truncate">{m.message}</div></div>))}</div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b flex justify-between"><h3 className="text-lg font-semibold">All Bookings ({bookings.length})</h3><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-64" /></div></div>
                <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left">Guest</th><th>Villa</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredBookings.map(b => (<tr key={b.id} className="border-t"><td className="px-6 py-4"><div className="font-medium">{b.name}</div><div className="text-sm text-gray-500">{b.email}</div></td><td>{b.villa_name}</td><td>{b.check_in} → {b.check_out}</td><td>${b.amount}</td><td><select value={b.status} onChange={(e) => updateBookingStatus(b.id, e.target.value)} className={`text-xs px-2 py-1 rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></td><td><button onClick={() => deleteBooking(b.id)} className="text-red-500"><Trash2 size={16} /></button></td></tr>))}</tbody></table></div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden"><div className="p-6 border-b"><h3 className="text-lg font-semibold">Contact Messages ({messages.length})</h3></div><div className="divide-y">{messages.map(m => (<div key={m.id} className={`p-6 ${!m.read ? "bg-amber-50" : ""}`}><div className="flex justify-between"><div><h4 className="font-semibold">{m.name}</h4><p className="text-sm text-gray-500">{m.email} • {m.phone}</p></div><span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span></div><p className="mt-2">{m.message}</p><div className="flex gap-3 mt-3">{!m.read && <button onClick={() => markMessageRead(m.id)} className="text-sm text-[#FF8C00]">Mark Read</button>}<button onClick={() => deleteMessage(m.id)} className="text-sm text-red-500">Delete</button></div></div>))}</div>
              </div>
            )}

            {/* Villas Tab */}
            {activeTab === "villas" && (
              <div className="space-y-6"><div className="flex justify-end"><button onClick={() => { setEditingVilla(null); setShowAddVilla(true); }} className="bg-[#1A2E26] text-white px-4 py-2 rounded-lg"><Plus size={14} /> Add Villa</button></div><div className="grid md:grid-cols-3 gap-6">{villas.map(v => (<div key={v.id} className="bg-white rounded-xl overflow-hidden shadow-lg"><img src={v.image} alt={v.name} className="h-48 w-full object-cover" /><div className="p-4"><h3 className="font-semibold text-lg">{v.name}</h3><div className="text-2xl font-bold text-[#FF8C00]">${v.price}<span className="text-sm text-gray-400">/night</span></div><div className="flex gap-2 mt-4"><button onClick={() => { setEditingVilla(v); setShowAddVilla(true); }} className="flex-1 py-2 border rounded-lg"><Edit size={14} /> Edit</button><button onClick={() => deleteVilla(v.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg">Delete</button></div></div></div>))}</div>
              </div>
            )}

            {/* Header & Navigation Tab */}
            {activeTab === "header" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-xl font-semibold mb-6">Logo Settings</h3><div><label className="flex items-center gap-2"><input type="checkbox" checked={siteContent.header.logo.useImage} onChange={(e) => updateHeaderLogo("useImage", e.target.checked)} /> Use Image Logo</label>{siteContent.header.logo.useImage ? <input type="text" value={siteContent.header.logo.image} onChange={(e) => updateHeaderLogo("image", e.target.value)} className="w-full mt-2 px-4 py-2 border rounded-lg" /> : <input type="text" value={siteContent.header.logo.text} onChange={(e) => updateHeaderLogo("text", e.target.value)} className="w-full mt-2 px-4 py-2 border rounded-lg" />}</div></div>
                <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-xl font-semibold mb-6">Navigation Links</h3>{siteContent.header.navLinks.map(link => (<div key={link.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg mb-2"><input type="text" value={link.label} onChange={(e) => updateNavLink(link.id, "label", e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" /><input type="text" value={link.href} onChange={(e) => updateNavLink(link.id, "href", e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" /><button onClick={() => updateNavLink(link.id, "enabled", !link.enabled)} className="px-3 py-2 rounded-lg bg-gray-100">{link.enabled ? "Visible" : "Hidden"}</button><button onClick={() => deleteNavLink(link.id)} className="p-2 text-red-500"><Trash2 size={16} /></button></div>))}<div className="border-t pt-4"><div className="flex gap-3"><input type="text" placeholder="Label" value={newNavLink.label} onChange={(e) => setNewNavLink({...newNavLink, label: e.target.value})} className="flex-1 px-4 py-2 border rounded-lg" /><input type="text" placeholder="URL" value={newNavLink.href} onChange={(e) => setNewNavLink({...newNavLink, href: e.target.value})} className="flex-1 px-4 py-2 border rounded-lg" /><button onClick={addNavLink} className="px-4 py-2 bg-[#1A2E26] text-white rounded-lg"><Plus size={16} /> Add</button></div></div></div>
                <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-xl font-semibold mb-6">Header Styling</h3><div className="grid md:grid-cols-2 gap-4"><div><label>Background Color</label><input type="color" value={siteContent.header.backgroundColor} onChange={(e) => updateHeader("backgroundColor", e.target.value)} className="w-full h-10 rounded" /></div><div><label>Text Color</label><input type="color" value={siteContent.header.textColor} onChange={(e) => updateHeader("textColor", e.target.value)} className="w-full h-10 rounded" /></div></div><label className="flex items-center gap-2 mt-4"><input type="checkbox" checked={siteContent.header.transparentOnScroll} onChange={(e) => updateHeader("transparentOnScroll", e.target.checked)} /> Transparent on scroll</label><div className="mt-4"><label className="flex items-center gap-2"><input type="checkbox" checked={siteContent.header.showBookingButton} onChange={(e) => updateHeader("showBookingButton", e.target.checked)} /> Show Booking Button</label>{siteContent.header.showBookingButton && <input type="text" value={siteContent.header.bookingButtonText} onChange={(e) => updateHeader("bookingButtonText", e.target.value)} className="w-full mt-2 px-4 py-2 border rounded-lg" />}</div></div>
              </div>
            )}

            {/* Section Visibility Tab */}
            {activeTab === "sections" && (
              <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-xl font-semibold mb-6">Section Visibility</h3><div className="grid md:grid-cols-2 gap-4">{sections.map(section => (<div key={section.id} className={`p-4 rounded-xl border-2 ${section.enabled ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}><div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.enabled ? "bg-green-500" : "bg-gray-400"}`}><section.icon size={20} className="text-white" /></div><div><h4 className="font-semibold">{section.label}</h4><p className="text-xs text-gray-500">{section.enabled ? "Visible" : "Hidden"}</p></div></div><button onClick={() => toggleSection(section.id, !section.enabled)} className={`px-4 py-2 rounded-lg ${section.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{section.enabled ? "Hide" : "Show"}</button></div></div>))}</div></div>
            )}

            {/* Hero Section Tab */}
            {activeTab === "hero" && (
              <div className="bg-white rounded-xl shadow-lg p-6"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Edit Hero Section</h3><button onClick={() => toggleSection("hero", !siteContent.hero.enabled)} className="px-3 py-1 rounded-lg text-sm bg-red-100">{siteContent.hero.enabled ? "Hide" : "Show"}</button></div><div className="space-y-4"><input type="text" placeholder="Badge" value={siteContent.hero.badge} onChange={(e) => updateHeroContent("badge", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Title" value={siteContent.hero.title} onChange={(e) => updateHeroContent("title", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><textarea placeholder="Subtitle" value={siteContent.hero.subtitle} onChange={(e) => updateHeroContent("subtitle", e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Button Text" value={siteContent.hero.buttonText} onChange={(e) => updateHeroContent("buttonText", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Background Image URL" value={siteContent.hero.backgroundImage} onChange={(e) => updateHeroContent("backgroundImage", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div></div>
            )}

            {/* About Section Tab */}
            {activeTab === "about" && (
              <div className="bg-white rounded-xl shadow-lg p-6"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Edit About Section</h3><button onClick={() => toggleSection("about", !siteContent.about.enabled)} className="px-3 py-1 rounded-lg text-sm bg-red-100">{siteContent.about.enabled ? "Hide" : "Show"}</button></div><div className="space-y-4"><input type="text" placeholder="Section Tag" value={siteContent.about.subtitle} onChange={(e) => updateAboutContent("subtitle", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Title" value={siteContent.about.title} onChange={(e) => updateAboutContent("title", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><textarea placeholder="Description" value={siteContent.about.description} onChange={(e) => updateAboutContent("description", e.target.value)} rows={5} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Image URL" value={siteContent.about.image} onChange={(e) => updateAboutContent("image", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><textarea placeholder="Statistics JSON" value={JSON.stringify(siteContent.about.stats, null, 2)} onChange={(e) => { try { const parsed = JSON.parse(e.target.value); if (Array.isArray(parsed)) updateAboutContent("stats", parsed); } catch(err) {} }} rows={6} className="w-full px-4 py-2 border rounded-lg font-mono text-sm" /></div></div>
            )}

            {/* Experiences Tab */}
            {activeTab === "experiences" && (
              <div className="bg-white rounded-xl shadow-lg p-6"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Edit Experiences</h3><button onClick={() => toggleSection("experiences", !siteContent.experiences.enabled)} className="px-3 py-1 rounded-lg text-sm bg-red-100">{siteContent.experiences.enabled ? "Hide" : "Show"}</button></div><div className="space-y-4"><input type="text" placeholder="Title" value={siteContent.experiences.title} onChange={(e) => setSiteContent({...siteContent, experiences: {...siteContent.experiences, title: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Subtitle" value={siteContent.experiences.subtitle} onChange={(e) => setSiteContent({...siteContent, experiences: {...siteContent.experiences, subtitle: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />{siteContent.experiences.items.map((item, idx) => (<div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg"><input type="text" value={item.title} onChange={(e) => { const items = [...siteContent.experiences.items]; items[idx].title = e.target.value; updateExperiencesContent(items); }} className="flex-1 px-3 py-2 border rounded-lg" /><input type="text" value={item.description} onChange={(e) => { const items = [...siteContent.experiences.items]; items[idx].description = e.target.value; updateExperiencesContent(items); }} className="flex-1 px-3 py-2 border rounded-lg" /><button onClick={() => deleteExperienceItem(idx)} className="p-2 text-red-500"><Trash2 size={16} /></button></div>))}<div className="flex gap-3"><input type="text" placeholder="New Title" value={newExperienceItem.title} onChange={(e) => setNewExperienceItem({...newExperienceItem, title: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg" /><input type="text" placeholder="Description" value={newExperienceItem.description} onChange={(e) => setNewExperienceItem({...newExperienceItem, description: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg" /><button onClick={addExperienceItem} className="px-4 py-2 bg-[#1A2E26] text-white rounded-lg"><Plus size={16} /> Add</button></div></div></div>
            )}

            {/* Wellness Tab */}
            {activeTab === "wellness" && (
              <div className="bg-white rounded-xl shadow-lg p-6"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Edit Wellness</h3><button onClick={() => toggleSection("wellness", !siteContent.wellness.enabled)} className="px-3 py-1 rounded-lg text-sm bg-red-100">{siteContent.wellness.enabled ? "Hide" : "Show"}</button></div><div className="space-y-4"><input type="text" placeholder="Title" value={siteContent.wellness.title} onChange={(e) => setSiteContent({...siteContent, wellness: {...siteContent.wellness, title: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Image URL" value={siteContent.wellness.image} onChange={(e) => updateWellnessContent("image", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><textarea placeholder="Wellness Items (comma separated)" value={siteContent.wellness.items.join(", ")} onChange={(e) => updateWellnessContent("items", e.target.value.split(",").map(s => s.trim()))} rows={3} className="w-full px-4 py-2 border rounded-lg" /></div></div>
            )}

            {/* Gallery Tab */}
            {activeTab === "gallery" && (
              <div className="bg-white rounded-xl shadow-lg p-6"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Edit Gallery</h3><button onClick={() => toggleSection("gallery", !siteContent.gallery.enabled)} className="px-3 py-1 rounded-lg text-sm bg-red-100">{siteContent.gallery.enabled ? "Hide" : "Show"}</button></div><div className="grid grid-cols-4 gap-4 mb-4">{siteContent.gallery.images.map((img, idx) => (<div key={idx} className="relative"><img src={img} className="h-24 w-full object-cover rounded-lg" /><button onClick={() => deleteGalleryImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><Trash2 size={12} /></button></div>))}</div><div className="flex gap-3"><input type="text" placeholder="New Image URL" value={newGalleryImage} onChange={(e) => setNewGalleryImage(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" /><button onClick={addGalleryImage} className="px-4 py-2 bg-[#1A2E26] text-white rounded-lg"><Plus size={16} /> Add</button></div></div>
            )}

            {/* Journal Tab */}
            {activeTab === "journal" && (
              <div className="bg-white rounded-xl shadow-lg p-6"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Edit Journal</h3><button onClick={() => toggleSection("journal", !siteContent.journal.enabled)} className="px-3 py-1 rounded-lg text-sm bg-red-100">{siteContent.journal.enabled ? "Hide" : "Show"}</button></div>{siteContent.journal.posts.map((post, idx) => (<div key={idx} className="p-4 bg-gray-50 rounded-lg mb-3"><input type="text" value={post.title} onChange={(e) => { const posts = [...siteContent.journal.posts]; posts[idx].title = e.target.value; updateJournalPosts(posts); }} placeholder="Title" className="w-full mb-2 px-3 py-2 border rounded-lg" /><input type="text" value={post.image} onChange={(e) => { const posts = [...siteContent.journal.posts]; posts[idx].image = e.target.value; updateJournalPosts(posts); }} placeholder="Image URL" className="w-full mb-2 px-3 py-2 border rounded-lg" /><textarea value={post.description} onChange={(e) => { const posts = [...siteContent.journal.posts]; posts[idx].description = e.target.value; updateJournalPosts(posts); }} rows={2} className="w-full px-3 py-2 border rounded-lg" /><button onClick={() => deleteJournalPost(idx)} className="mt-2 text-red-500 text-sm">Delete</button></div>))}<div className="border-t pt-4"><div className="flex gap-3"><input type="text" placeholder="Title" value={newJournalPost.title} onChange={(e) => setNewJournalPost({...newJournalPost, title: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg" /><input type="text" placeholder="Image URL" value={newJournalPost.image} onChange={(e) => setNewJournalPost({...newJournalPost, image: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg" /></div><textarea placeholder="Description" value={newJournalPost.description} onChange={(e) => setNewJournalPost({...newJournalPost, description: e.target.value})} rows={2} className="w-full mt-2 px-3 py-2 border rounded-lg" /><button onClick={addJournalPost} className="mt-2 px-4 py-2 bg-[#1A2E26] text-white rounded-lg"><Plus size={16} /> Add</button></div></div>
            )}

            {/* Pricing Tab - Complete Management */}
{activeTab === "pricing" && (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign size={24} className="text-[#FF8C00]" /> Pricing Management
        </h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={pricingData.enabled}
              onChange={(e) => setPricingData({ ...pricingData, enabled: e.target.checked })}
              className="w-4 h-4 text-[#FF8C00]"
            />
            <span className="text-sm">Show Pricing Section</span>
          </label>
          <button
            onClick={savePricingData}
            className="px-4 py-2 bg-[#1A2E26] text-white rounded-lg hover:bg-[#2D4A3E] flex items-center gap-2"
          >
            <Save size={16} /> Save All Changes
          </button>
        </div>
      </div>

      {/* Main Settings */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <input
            type="text"
            value={pricingData.title}
            onChange={(e) => setPricingData({ ...pricingData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={pricingData.description}
            onChange={(e) => setPricingData({ ...pricingData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
          />
        </div>
      </div>

      {/* Pricing Options Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-[#1A2E26]">Pricing Options</h4>
          <button
            onClick={() => setShowAddPricingOption(true)}
            className="px-3 py-1 bg-[#1A2E26] text-white rounded-lg text-sm flex items-center gap-1"
          >
            <Plus size={14} /> Add Option
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price (PKR)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trending</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pricingData.pricingOptions.map((option) => (
                <tr key={option.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={option.icon}
                      onChange={(e) => updatePricingOption(option.id, "icon", e.target.value)}
                      className="w-12 text-center text-xl border rounded-lg px-2 py-1"
                      maxLength={2}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => updatePricingOption(option.id, "label", e.target.value)}
                      className="w-32 px-2 py-1 border rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={option.description}
                      onChange={(e) => updatePricingOption(option.id, "description", e.target.value)}
                      className="w-40 px-2 py-1 border rounded-lg"
                      placeholder="e.g., Monday - Thursday"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={option.price}
                      onChange={(e) => updatePricingOption(option.id, "price", parseInt(e.target.value))}
                      className="w-28 px-2 py-1 border rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        // Set only one trending option
                        setPricingData(prev => ({
                          ...prev,
                          pricingOptions: prev.pricingOptions.map(opt => ({
                            ...opt,
                            isTrending: opt.id === option.id
                          }))
                        }));
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        option.isTrending 
                          ? 'bg-[#FFD700] text-[#1A2E26] shadow-md' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {option.isTrending ? '★ Trending' : 'Set Trending'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updatePricingOption(option.id, "enabled", !option.enabled)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        option.enabled 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {option.enabled ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deletePricingOption(option.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      disabled={pricingData.pricingOptions.length <= 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Facilities Management */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-[#1A2E26] mb-4">Facilities</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          {pricingData.facilities.map((facility, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm">{facility}</span>
              <button onClick={() => removeFacility(idx)} className="p-1 text-red-500 hover:text-red-700">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            placeholder="New facility (e.g., Swimming Pool)"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
            onKeyPress={(e) => e.key === 'Enter' && addFacility()}
          />
          <button onClick={addFacility} className="px-4 py-2 bg-[#1A2E26] text-white rounded-lg hover:bg-[#2D4A3E]">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp/Phone Number</label>
          <input
            type="text"
            value={pricingData.contactNumber || ""}
            onChange={(e) => setPricingData({ ...pricingData, contactNumber: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="text"
            value={pricingData.website || ""}
            onChange={(e) => setPricingData({ ...pricingData, website: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium text-gray-700 mb-3">Live Preview</h4>
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] rounded-lg p-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            {pricingData.pricingOptions.filter(opt => opt.enabled).slice(0, 3).map(opt => (
              <div key={opt.id} className="bg-white/20 rounded-lg p-2">
                <div className="text-2xl">{opt.icon}</div>
                <div className="font-bold text-white text-sm">{opt.label}</div>
                <div className="text-xs text-white/80">₨ {opt.price.toLocaleString()}</div>
                {opt.isTrending && <div className="text-[10px] text-[#FFD700] mt-1">🔥 Trending</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Add Pricing Option Modal */}
    {showAddPricingOption && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Add Pricing Option</h3>
            <button onClick={() => setShowAddPricingOption(false)}><X size={20} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
              <input
                type="text"
                value={newPricingOption.icon}
                onChange={(e) => setNewPricingOption({ ...newPricingOption, icon: e.target.value })}
                placeholder="e.g., 🌙, ⭐, ☀️"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={newPricingOption.label}
                onChange={(e) => setNewPricingOption({ ...newPricingOption, label: e.target.value })}
                placeholder="e.g., Weekday Night"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newPricingOption.description}
                onChange={(e) => setNewPricingOption({ ...newPricingOption, description: e.target.value })}
                placeholder="e.g., Monday - Thursday"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
              <input
                type="number"
                value={newPricingOption.price || 0}
                onChange={(e) => setNewPricingOption({ ...newPricingOption, price: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 45000"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
                required
              />
            </div>
            <button
              onClick={addPricingOption}
              className="w-full py-2 bg-[#1A2E26] text-white rounded-lg hover:bg-[#2D4A3E]"
            >
              Add Option
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

            {/* Calendar Bookings Tab */}
            {activeTab === "calendar-bookings" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-[#1A2E26]">Calendar Bookings ({calendarBookings.length})</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage farmhouse time slot bookings</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked On</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {calendarBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4"><div className="font-medium">{booking.name}</div><div className="text-xs text-gray-500">{booking.email}</div></td>
                          <td className="px-6 py-4"><div className="font-medium">{booking.booking_date}</div><span className={`text-xs px-2 py-0.5 rounded-full ${booking.time_slot === "morning" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>{booking.time_slot === "morning" ? "☀️ Morning (8 AM - 6 PM)" : "🌙 Night (8 PM - 6 AM)"}</span></td>
                          <td className="px-6 py-4"><span className="font-medium">{booking.hours} hours</span><div className="text-xs text-gray-500">{booking.hours === 24 ? "Full Day" : `${booking.hours} Hour Booking`}</div></td>
                          <td className="px-6 py-4"><div className="text-sm">{booking.phone}</div><a href={`mailto:${booking.email}`} className="text-xs text-[#FF8C00] hover:underline">Send Email</a></td>
                          <td className="px-6 py-4"><select value={booking.status} onChange={(e) => updateCalendarBookingStatus(booking.id, e.target.value)} className={`text-xs px-2 py-1 rounded-full font-semibold border-none ${booking.status === "confirmed" ? "bg-green-100 text-green-700" : booking.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></td>
                          <td className="px-6 py-4 text-sm text-gray-500">{new Date(booking.created_at).toLocaleDateString()}                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <a
                                href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(booking.name)}%2C%20your%20booking%20for%20${booking.booking_date}%20has%20been%20${booking.status}.%20Thank%20you!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-green-500 hover:text-green-700"
                              >
                                <MessageCircle size={16} />
                              </a>
                              <button onClick={() => deleteCalendarBooking(booking.id)} className="p-1 text-red-500 hover:text-red-700">
                                <Trash2 size={16} />
                              </button>
                            </div>
                           </td>
                           </td>
                         </tr>
                      ))}
                      {calendarBookings.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-gray-500">
                            No calendar bookings yet. Bookings from the availability calendar will appear here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Blocked Dates Tab */}
{activeTab === "blocked-dates" && (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Calendar size={24} className="text-[#FF8C00]" /> Blocked Dates Management
        </h3>
        <button
          onClick={() => setShowBlockDateModal(true)}
          className="px-4 py-2 bg-[#1A2E26] text-white rounded-lg flex items-center gap-2 hover:bg-[#2D4A3E]"
        >
          <Plus size={16} /> Block Date
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Block specific dates and time slots to prevent bookings. Useful for maintenance, private events, or holidays.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blocked On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blockedDates.map((date) => (
              <tr key={date.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{new Date(date.booking_date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    date.time_slot === "morning" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                  }`}>
                    {date.time_slot === "morning" ? "☀️ Morning (8 AM - 6 PM)" : "🌙 Night (8 PM - 6 AM)"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{date.reason || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(date.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => unblockDate(date.id)} className="text-green-500 hover:text-green-700">
                    <CheckCircle size={18} /> Unblock
                  </button>
                </td>
              </tr>
            ))}
            {blockedDates.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">
                  No blocked dates. All dates are available for booking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Block Date Modal */}
    {showBlockDateModal && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Block Date & Time Slot</h3>
            <button onClick={() => setShowBlockDateModal(false)}><X size={20} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                value={newBlockedDate.booking_date}
                onChange={(e) => setNewBlockedDate({ ...newBlockedDate, booking_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select
                value={newBlockedDate.time_slot}
                onChange={(e) => setNewBlockedDate({ ...newBlockedDate, time_slot: e.target.value as "morning" | "night" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
              >
                <option value="morning">Morning (8 AM - 6 PM)</option>
                <option value="night">Night (8 PM - 6 AM)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
              <textarea
                value={newBlockedDate.reason}
                onChange={(e) => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                placeholder="e.g., Maintenance, Private Event, Holiday"
                rows={2}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
              />
            </div>
            <button
              onClick={addBlockedDate}
              className="w-full py-2 bg-[#1A2E26] text-white rounded-lg hover:bg-[#2D4A3E]"
            >
              Block Date
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Edit Contact Section</h3><button onClick={() => toggleSection("contact", !siteContent.contact.enabled)} className="px-3 py-1 rounded-lg text-sm bg-red-100">{siteContent.contact.enabled ? "Hide" : "Show"}</button></div>
                <div className="space-y-4"><input type="text" placeholder="Title" value={siteContent.contact.title} onChange={(e) => updateContactContent("title", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Subtitle" value={siteContent.contact.subtitle} onChange={(e) => updateContactContent("subtitle", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Address" value={siteContent.contact.address} onChange={(e) => updateContactContent("address", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Phone" value={siteContent.contact.phone} onChange={(e) => updateContactContent("phone", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="email" placeholder="Email" value={siteContent.contact.email} onChange={(e) => updateContactContent("email", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
              </div>
            )}

            {/* Footer Tab */}
            {activeTab === "footer" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Edit Footer</h3><button onClick={() => toggleSection("footer", !siteContent.footer.enabled)} className="px-3 py-1 rounded-lg text-sm bg-red-100">{siteContent.footer.enabled ? "Hide" : "Show"}</button></div>
                <div className="space-y-4"><input type="text" placeholder="Logo" value={siteContent.footer.logo} onChange={(e) => updateFooterContent("brand", "logo", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><textarea placeholder="Description" value={siteContent.footer.description} onChange={(e) => updateFooterContent("brand", "description", e.target.value)} rows={2} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Copyright" value={siteContent.footer.copyright} onChange={(e) => updateFooterContent("brand", "copyright", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Address" value={siteContent.footer.contact.address} onChange={(e) => updateFooterContent("contact", "address", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="text" placeholder="Phone" value={siteContent.footer.contact.phone} onChange={(e) => updateFooterContent("contact", "phone", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="email" placeholder="Email" value={siteContent.footer.contact.email} onChange={(e) => updateFooterContent("contact", "email", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="url" placeholder="Facebook" value={siteContent.footer.socialLinks.facebook} onChange={(e) => updateFooterContent("social", "facebook", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="url" placeholder="Instagram" value={siteContent.footer.socialLinks.instagram} onChange={(e) => updateFooterContent("social", "instagram", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="url" placeholder="Twitter" value={siteContent.footer.socialLinks.twitter} onChange={(e) => updateFooterContent("social", "twitter", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /><input type="url" placeholder="YouTube" value={siteContent.footer.socialLinks.youtube} onChange={(e) => updateFooterContent("social", "youtube", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === "colors" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Customize Colors</h3>
                <div className="grid md:grid-cols-2 gap-6">{Object.entries(siteContent.colors).map(([key, value]) => (<div key={key}><label className="capitalize">{key}</label><div className="flex gap-3 mt-1"><input type="color" value={value} onChange={(e) => updateColors(key, e.target.value)} className="w-12 h-10 rounded" /><input type="text" value={value} onChange={(e) => updateColors(key, e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" /><div className="w-8 h-8 rounded-full border" style={{ backgroundColor: value }} /></div></div>))}</div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg"><h4>Live Preview</h4><div className="p-3 rounded mt-2" style={{ backgroundColor: siteContent.colors.primary, color: "#fff" }}>Primary Color</div><div className="p-3 rounded mt-2" style={{ backgroundColor: siteContent.colors.secondary, color: siteContent.colors.primary }}>Secondary Color</div><div className="p-3 rounded mt-2" style={{ color: siteContent.colors.accent }}>Accent Color</div></div>
              </div>
            )}

            {/* Custom Sections Tab */}
            {activeTab === "customsections" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Layout size={24} className="text-[#FF8C00]" /> Custom Sections ({siteContent.customSections?.length || 0})
                  </h3>
                  <button onClick={() => setShowSectionBuilder(true)} className="px-4 py-2 bg-[#1A2E26] text-white rounded-lg flex items-center gap-2">
                    <Plus size={16} /> Create New Section
                  </button>
                </div>

                {siteContent.customSections?.length === 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold mb-2">No Custom Sections Yet</h3>
                    <p className="text-gray-500 mb-4">Create your own custom sections with any layout you want!</p>
                    <button onClick={() => setShowSectionBuilder(true)} className="px-6 py-2 bg-[#1A2E26] text-white rounded-lg">Create Your First Section</button>
                  </div>
                )}

                {siteContent.customSections?.map((section, idx) => (
                  <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{section.title || "Untitled Section"}</h3>
                        <p className="text-sm text-gray-500">Layout: {section.layout} | {section.items.length} items</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateCustomSection(idx, "enabled", !section.enabled)} className={`px-3 py-1 rounded-lg text-sm ${section.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {section.enabled ? "Visible" : "Hidden"}
                        </button>
                        <button onClick={() => deleteCustomSection(idx)} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">Delete</button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Section Title" value={section.title} onChange={(e) => updateCustomSection(idx, "title", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                        <input type="text" placeholder="Subtitle" value={section.subtitle} onChange={(e) => updateCustomSection(idx, "subtitle", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <textarea placeholder="Description" value={section.description} onChange={(e) => updateCustomSection(idx, "description", e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg" />
                      <div className="grid md:grid-cols-3 gap-4">
                        <select value={section.layout} onChange={(e) => updateCustomSection(idx, "layout", e.target.value)} className="px-3 py-2 border rounded-lg">
                          <option value="grid">Grid (3 columns)</option>
                          <option value="list">List (1 column)</option>
                        </select>
                        <input type="color" value={section.backgroundColor} onChange={(e) => updateCustomSection(idx, "backgroundColor", e.target.value)} className="h-10 rounded border" />
                        <input type="color" value={section.textColor} onChange={(e) => updateCustomSection(idx, "textColor", e.target.value)} className="h-10 rounded border" />
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Items ({section.items.length})</h4>
                        {section.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="p-4 bg-gray-50 rounded-lg mb-3">
                            <div className="grid md:grid-cols-3 gap-3 mb-2">
                              <input type="text" placeholder="Icon (emoji)" value={item.icon} onChange={(e) => updateSectionItem(idx, itemIdx, "icon", e.target.value)} className="px-3 py-2 border rounded-lg" />
                              <input type="text" placeholder="Title" value={item.title} onChange={(e) => updateSectionItem(idx, itemIdx, "title", e.target.value)} className="px-3 py-2 border rounded-lg" />
                              <button onClick={() => deleteSectionItem(idx, itemIdx)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg">Remove</button>
                            </div>
                            <textarea placeholder="Description" value={item.description} onChange={(e) => updateSectionItem(idx, itemIdx, "description", e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg" />
                          </div>
                        ))}
                        <button onClick={() => addSectionItem(idx)} className="mt-2 w-full px-4 py-2 border border-dashed rounded-lg text-gray-500 hover:border-[#FFD700] hover:text-[#FFD700]"><Plus size={16} /> Add Item</button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Section Builder Modal */}
                {showSectionBuilder && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Create New Section</h3>
                        <button onClick={() => setShowSectionBuilder(false)}><X size={20} /></button>
                      </div>
                      <div className="space-y-4">
                        <input type="text" placeholder="Section Title" value={newSection.title} onChange={(e) => setNewSection({...newSection, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        <input type="text" placeholder="Subtitle" value={newSection.subtitle} onChange={(e) => setNewSection({...newSection, subtitle: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        <textarea placeholder="Description" value={newSection.description} onChange={(e) => setNewSection({...newSection, description: e.target.value})} rows={2} className="w-full px-3 py-2 border rounded-lg" />
                        <div className="grid md:grid-cols-2 gap-4">
                          <select value={newSection.layout} onChange={(e) => setNewSection({...newSection, layout: e.target.value})} className="px-3 py-2 border rounded-lg">
                            <option value="grid">Grid (3 columns)</option>
                            <option value="list">List (1 column)</option>
                          </select>
                          <input type="color" value={newSection.backgroundColor} onChange={(e) => setNewSection({...newSection, backgroundColor: e.target.value})} className="h-10 rounded border" />
                        </div>
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-3">Items</h4>
                          {newSection.items.map((item, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-lg mb-3">
                              <div className="grid md:grid-cols-2 gap-3 mb-2">
                                <input type="text" placeholder="Icon (emoji)" value={item.icon} onChange={(e) => { const items = [...newSection.items]; items[idx].icon = e.target.value; setNewSection({...newSection, items}); }} className="px-3 py-2 border rounded-lg" />
                                <input type="text" placeholder="Title" value={item.title} onChange={(e) => { const items = [...newSection.items]; items[idx].title = e.target.value; setNewSection({...newSection, items}); }} className="px-3 py-2 border rounded-lg" />
                              </div>
                              <textarea placeholder="Description" value={item.description} onChange={(e) => { const items = [...newSection.items]; items[idx].description = e.target.value; setNewSection({...newSection, items}); }} rows={2} className="w-full px-3 py-2 border rounded-lg" />
                              <button onClick={() => { const items = newSection.items.filter((_, i) => i !== idx); setNewSection({...newSection, items}); }} className="mt-2 text-red-500 text-sm">Remove</button>
                            </div>
                          ))}
                          <button onClick={() => setNewSection({...newSection, items: [...newSection.items, { title: "", description: "", icon: "⭐" }]})} className="w-full px-4 py-2 border border-dashed rounded-lg text-gray-500 hover:border-[#FFD700]"><Plus size={16} /> Add Item</button>
                        </div>
                        <button onClick={addCustomSection} className="w-full py-2 bg-[#1A2E26] text-white rounded-lg mt-4">Create Section</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Villa Modal */}
      <AnimatePresence>{showAddVilla && <VillaModal villa={editingVilla} onSave={saveVilla} onClose={() => { setShowAddVilla(false); setEditingVilla(null); }} />}</AnimatePresence>
    </div>
  );
}

function VillaModal({ villa, onSave, onClose }: { villa: Villa | null; onSave: (data: any) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: villa?.name || "", price: villa?.price || 890, capacity: villa?.capacity || 4, bedrooms: villa?.bedrooms || 2,
    image: villa?.image || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    features: villa?.features?.join(", ") || "Private Pool, Forest View, Butler Service",
    popular: villa?.popular || false, description: villa?.description || ""
  });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...formData, features: formData.features.split(",").map(f => f.trim()) }); };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between mb-4"><h3 className="text-xl font-semibold">{villa ? "Edit" : "Add"} Villa</h3><button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
          <div className="grid grid-cols-2 gap-4"><input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="px-4 py-2 border rounded-lg" /><input type="number" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} className="px-4 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4"><input type="number" placeholder="Bedrooms" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})} className="px-4 py-2 border rounded-lg" /><input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="px-4 py-2 border rounded-lg" /></div>
          <input type="text" placeholder="Features (comma separated)" value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-lg" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({...formData, popular: e.target.checked})} /> Popular Villa</label>
          <button type="submit" className="w-full py-2 bg-[#1A2E26] text-white rounded-lg">{villa ? "Update" : "Create"}</button>
        </form>
      </motion.div>
    </motion.div>
  );
}
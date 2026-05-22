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
} from "lucide-react";
import Link from "next/link";

// Types
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
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
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
      description: "Spanning over 50 acres of pristine landscape, Colors of Combine is a masterpiece of sustainable luxury. Each villa is meticulously crafted to harmonize with the natural contours of the land, offering uninterrupted views of the rolling hills and ancient forests.",
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
    
    // Read each response once
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

// Replace loadSiteContent with:
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
    // Fallback to localStorage
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

// Replace saveSiteContent with:
const saveSiteContent = async (content: SiteContent) => {
  // Save to localStorage as backup
  localStorage.setItem("siteContent", JSON.stringify(content));
  setSiteContent(content);
  
  // Save each section to database
  const sections = ['hero', 'about', 'villas', 'experiences', 'wellness', 'gallery', 'journal', 'contact', 'footer', 'header', 'colors'];
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

  const addWellnessItem = (item: string) => {
    if (item) {
      const updated = { ...siteContent, wellness: { ...siteContent.wellness, items: [...siteContent.wellness.items, item] } };
      saveSiteContent(updated);
    }
  };

  const deleteWellnessItem = (index: number) => {
    const updated = {
      ...siteContent,
      wellness: { ...siteContent.wellness, items: siteContent.wellness.items.filter((_, i) => i !== index) }
    };
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
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
      alert("Invalid password.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
    showToast("Logged out");
  };

  if (!isAuthenticated) {
    return (
      <div className="text-black">
      <div className="min-h-screen bg-gradient-to-br from-[#1A2E26] to-[#2D4A3E] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-4"><Shield size={32} className="text-[#1A2E26]" /></div>
            <h2 className="text-2xl font-light text-white">Admin Access</h2>
          </div>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-[#FFD700] mb-4" />
            <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold">Login</button>
          </form>
          <Link href="/" className="block text-center mt-4 text-white/50 text-sm hover:text-white">← Back to Website</Link>
        </motion.div>
      </div>
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
    <div className="text-black">
    <div className="min-h-screen bg-[#F5F2ED]">
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
                { id: "contact", icon: Mail, label: "Contact" },
                { id: "footer", icon: Layout, label: "Footer" },
                { id: "colors", icon: Palette, label: "Colors & Styling" },
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
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                    {bookings.slice(0, 5).map(b => (
                      <div key={b.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
                        <div><div className="font-medium">{b.name}</div><div className="text-sm text-gray-500">{b.villa_name}</div></div>
                        <div className="text-right"><div className="font-semibold">${b.amount}</div><span className={`text-xs px-2 py-0.5 rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{b.status}</span></div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
                    {messages.slice(0, 5).map(m => (
                      <div key={m.id} className={`p-3 rounded-lg mb-2 ${!m.read ? "bg-amber-50 border-l-4 border-[#FFD700]" : "bg-gray-50"}`}>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-sm text-gray-500 truncate">{m.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center flex-wrap gap-4">
                  <h3 className="text-lg font-semibold">All Bookings ({bookings.length})</h3>
                  <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-64" /></div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left">Guest</th><th>Villa</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{filteredBookings.map(b => (<tr key={b.id} className="border-t hover:bg-gray-50"><td className="px-6 py-4"><div className="font-medium">{b.name}</div><div className="text-sm text-gray-500">{b.email}</div></td><td>{b.villa_name}</td><td>{b.check_in} → {b.check_out}</td><td>${b.amount}</td><td><select value={b.status} onChange={(e) => updateBookingStatus(b.id, e.target.value)} className={`text-xs px-2 py-1 rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></td><td><button onClick={() => deleteBooking(b.id)} className="text-red-500"><Trash2 size={16} /></button></td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b"><h3 className="text-lg font-semibold">Contact Messages ({messages.length})</h3></div>
                <div className="divide-y">{messages.map(m => (<div key={m.id} className={`p-6 ${!m.read ? "bg-amber-50" : ""}`}><div className="flex justify-between items-start"><div><h4 className="font-semibold">{m.name}</h4><p className="text-sm text-gray-500">{m.email} • {m.phone}</p></div><span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span></div><p className="mt-2">{m.message}</p><div className="flex gap-3 mt-3">{!m.read && <button onClick={() => markMessageRead(m.id)} className="text-sm text-[#FF8C00]">Mark Read</button>}<button onClick={() => deleteMessage(m.id)} className="text-sm text-red-500">Delete</button></div></div>))}</div>
              </div>
            )}

            {/* Villas Tab */}
            {activeTab === "villas" && (
              <div className="space-y-6">
                <div className="flex justify-end"><button onClick={() => { setEditingVilla(null); setShowAddVilla(true); }} className="bg-[#1A2E26] text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={14} /> Add Villa</button></div>
                <div className="grid md:grid-cols-3 gap-6">{villas.map(v => (<div key={v.id} className="bg-white rounded-xl overflow-hidden shadow-lg"><img src={v.image} alt={v.name} className="h-48 w-full object-cover" /><div className="p-4"><h3 className="font-semibold text-lg">{v.name}</h3><div className="text-2xl font-bold text-[#FF8C00]">${v.price}<span className="text-sm text-gray-400">/night</span></div><div className="flex gap-2 mt-4"><button onClick={() => { setEditingVilla(v); setShowAddVilla(true); }} className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-1"><Edit size={14} /> Edit</button><button onClick={() => deleteVilla(v.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg">Delete</button></div></div></div>))}</div>
              </div>
            )}

            {/* Header & Navigation Tab */}
            {activeTab === "header" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><MenuIcon size={24} className="text-[#FF8C00]" /> Logo Settings</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={siteContent.header.logo.useImage} onChange={(e) => updateHeaderLogo("useImage", e.target.checked)} className="w-4 h-4" /> Use Image Logo</label>
                    {siteContent.header.logo.useImage ? (
                      <div><label className="block text-sm font-medium mb-2">Logo Image URL</label><input type="text" value={siteContent.header.logo.image} onChange={(e) => updateHeaderLogo("image", e.target.value)} placeholder="Logo Image URL" className="w-full px-4 py-2 border rounded-lg" /></div>
                    ) : (
                      <div><label className="block text-sm font-medium mb-2">Logo Text</label><input type="text" value={siteContent.header.logo.text} onChange={(e) => updateHeaderLogo("text", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><LinkIcon size={24} className="text-[#FF8C00]" /> Navigation Links</h3>
                  <div className="space-y-3 mb-6">{siteContent.header.navLinks.map(link => (<div key={link.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><div className="flex-1 grid grid-cols-3 gap-3"><input type="text" value={link.label} onChange={(e) => updateNavLink(link.id, "label", e.target.value)} className="px-3 py-2 border rounded-lg" /><input type="text" value={link.href} onChange={(e) => updateNavLink(link.id, "href", e.target.value)} className="px-3 py-2 border rounded-lg" /><div className="flex gap-2"><button onClick={() => updateNavLink(link.id, "enabled", !link.enabled)} className={`px-3 py-2 rounded-lg ${link.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{link.enabled ? <EyeIcon size={16} /> : <EyeOff size={16} />}</button><button onClick={() => deleteNavLink(link.id)} className="p-2 text-red-500"><Trash2 size={16} /></button></div></div></div>))}</div>
                  <div className="border-t pt-4"><h4 className="font-medium mb-3">Add New Link</h4><div className="flex gap-3"><input type="text" placeholder="Label" value={newNavLink.label} onChange={(e) => setNewNavLink({...newNavLink, label: e.target.value})} className="flex-1 px-4 py-2 border rounded-lg" /><input type="text" placeholder="URL (e.g., #section)" value={newNavLink.href} onChange={(e) => setNewNavLink({...newNavLink, href: e.target.value})} className="flex-1 px-4 py-2 border rounded-lg" /><button onClick={addNavLink} className="px-4 py-2 bg-[#1A2E26] text-white rounded-lg"><Plus size={16} /> Add</button></div></div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Palette size={24} className="text-[#FF8C00]" /> Header Styling</h3>
                  <div className="grid md:grid-cols-2 gap-4"><div><label>Background Color</label><div className="flex gap-2 mt-1"><input type="color" value={siteContent.header.backgroundColor} onChange={(e) => updateHeader("backgroundColor", e.target.value)} className="w-12 h-10 rounded" /><input type="text" value={siteContent.header.backgroundColor} onChange={(e) => updateHeader("backgroundColor", e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" /></div></div><div><label>Text Color</label><div className="flex gap-2 mt-1"><input type="color" value={siteContent.header.textColor} onChange={(e) => updateHeader("textColor", e.target.value)} className="w-12 h-10 rounded" /><input type="text" value={siteContent.header.textColor} onChange={(e) => updateHeader("textColor", e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" /></div></div></div>
                  <label className="flex items-center gap-2 mt-4"><input type="checkbox" checked={siteContent.header.transparentOnScroll} onChange={(e) => updateHeader("transparentOnScroll", e.target.checked)} /> Make header transparent on scroll</label>
                  <div className="mt-4"><label className="flex items-center gap-2"><input type="checkbox" checked={siteContent.header.showBookingButton} onChange={(e) => updateHeader("showBookingButton", e.target.checked)} /> Show Booking Button</label>{siteContent.header.showBookingButton && <input type="text" value={siteContent.header.bookingButtonText} onChange={(e) => updateHeader("bookingButtonText", e.target.value)} className="w-full mt-2 px-4 py-2 border rounded-lg" placeholder="Button Text" />}</div>
                </div>
              </div>
            )}

            {/* Section Visibility Tab */}
            {activeTab === "sections" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Layout size={24} className="text-[#FF8C00]" /> Section Visibility</h3>
                <div className="grid md:grid-cols-2 gap-4">{sections.map(section => (<div key={section.id} className={`p-4 rounded-xl border-2 ${section.enabled ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}><div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.enabled ? "bg-green-500" : "bg-gray-400"}`}><section.icon size={20} className="text-white" /></div><div><h4 className="font-semibold">{section.label}</h4><p className="text-xs text-gray-500">{section.enabled ? "Visible" : "Hidden"}</p></div></div><button onClick={() => toggleSection(section.id, !section.enabled)} className={`px-4 py-2 rounded-lg ${section.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{section.enabled ? <><EyeOff size={16} /> Hide</> : <><EyeIcon size={16} /> Show</>}</button></div></div>))}</div>
              </div>
            )}

            {/* Hero Section Tab */}
            {activeTab === "hero" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold flex items-center gap-2"><EyeIcon size={24} className="text-[#FF8C00]" /> Edit Hero Section</h3><button onClick={() => toggleSection("hero", !siteContent.hero.enabled)} className={`px-3 py-1 rounded-lg text-sm ${siteContent.hero.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{siteContent.hero.enabled ? "Hide" : "Show"} Section</button></div>
                <div className="space-y-4"><div><label>Hero Badge</label><input type="text" value={siteContent.hero.badge} onChange={(e) => updateHeroContent("badge", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Hero Title</label><input type="text" value={siteContent.hero.title} onChange={(e) => updateHeroContent("title", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Hero Subtitle</label><textarea value={siteContent.hero.subtitle} onChange={(e) => updateHeroContent("subtitle", e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Button Text</label><input type="text" value={siteContent.hero.buttonText} onChange={(e) => updateHeroContent("buttonText", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Background Image URL</label><input type="text" value={siteContent.hero.backgroundImage} onChange={(e) => updateHeroContent("backgroundImage", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div></div>
              </div>
            )}

            {/* About Section Tab */}
            {activeTab === "about" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold flex items-center gap-2"><FileText size={24} className="text-[#FF8C00]" /> Edit About Section</h3><button onClick={() => toggleSection("about", !siteContent.about.enabled)} className={`px-3 py-1 rounded-lg text-sm ${siteContent.about.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{siteContent.about.enabled ? "Hide" : "Show"} Section</button></div>
                <div className="space-y-4"><div><label>Section Tag</label><input type="text" value={siteContent.about.subtitle} onChange={(e) => updateAboutContent("subtitle", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Title</label><input type="text" value={siteContent.about.title} onChange={(e) => updateAboutContent("title", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Description</label><textarea value={siteContent.about.description} onChange={(e) => updateAboutContent("description", e.target.value)} rows={5} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Image URL</label><input type="text" value={siteContent.about.image} onChange={(e) => updateAboutContent("image", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Statistics (JSON)</label><textarea value={JSON.stringify(siteContent.about.stats, null, 2)} onChange={(e) => { try { const parsed = JSON.parse(e.target.value); if (Array.isArray(parsed)) updateAboutContent("stats", parsed); } catch(err) { console.error("Invalid JSON"); } }} rows={6} className="w-full px-4 py-2 border rounded-lg font-mono text-sm" /></div></div>
              </div>
            )}

            {/* Experiences Tab */}
            {activeTab === "experiences" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold flex items-center gap-2"><Star size={24} className="text-[#FF8C00]" /> Edit Experiences</h3><button onClick={() => toggleSection("experiences", !siteContent.experiences.enabled)} className={`px-3 py-1 rounded-lg text-sm ${siteContent.experiences.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{siteContent.experiences.enabled ? "Hide" : "Show"} Section</button></div>
                <div className="space-y-4"><div><label>Section Title</label><input type="text" value={siteContent.experiences.title} onChange={(e) => setSiteContent({...siteContent, experiences: {...siteContent.experiences, title: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Section Subtitle</label><input type="text" value={siteContent.experiences.subtitle} onChange={(e) => setSiteContent({...siteContent, experiences: {...siteContent.experiences, subtitle: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" /></div>
                <div className="space-y-3">{siteContent.experiences.items.map((item, idx) => (<div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg"><input type="text" value={item.title} onChange={(e) => { const newItems = [...siteContent.experiences.items]; newItems[idx].title = e.target.value; updateExperiencesContent(newItems); }} className="flex-1 px-3 py-2 border rounded-lg" /><input type="text" value={item.description} onChange={(e) => { const newItems = [...siteContent.experiences.items]; newItems[idx].description = e.target.value; updateExperiencesContent(newItems); }} className="flex-1 px-3 py-2 border rounded-lg" /><select value={item.color} onChange={(e) => { const newItems = [...siteContent.experiences.items]; newItems[idx].color = e.target.value; updateExperiencesContent(newItems); }} className="px-3 py-2 border rounded-lg"><option value="from-cyan-400 to-blue-500">Blue</option><option value="from-amber-400 to-orange-500">Orange</option><option value="from-emerald-400 to-teal-500">Green</option><option value="from-rose-400 to-pink-500">Pink</option></select><button onClick={() => deleteExperienceItem(idx)} className="p-2 text-red-500"><Trash2 size={16} /></button></div>))}</div>
                <div className="border-t pt-4"><h4 className="font-medium mb-3">Add New Experience</h4><div className="flex gap-3"><input type="text" placeholder="Title" value={newExperienceItem.title} onChange={(e) => setNewExperienceItem({...newExperienceItem, title: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg" /><input type="text" placeholder="Description" value={newExperienceItem.description} onChange={(e) => setNewExperienceItem({...newExperienceItem, description: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg" /><select value={newExperienceItem.color} onChange={(e) => setNewExperienceItem({...newExperienceItem, color: e.target.value})} className="px-3 py-2 border rounded-lg"><option value="from-cyan-400 to-blue-500">Blue</option><option value="from-amber-400 to-orange-500">Orange</option><option value="from-emerald-400 to-teal-500">Green</option><option value="from-rose-400 to-pink-500">Pink</option></select><button onClick={addExperienceItem} className="px-4 py-2 bg-[#1A2E26] text-white rounded-lg"><Plus size={16} /> Add</button></div></div></div>
              </div>
            )}

            {/* Wellness Tab */}
            {activeTab === "wellness" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold flex items-center gap-2"><Heart size={24} className="text-[#FF8C00]" /> Edit Wellness</h3><button onClick={() => toggleSection("wellness", !siteContent.wellness.enabled)} className={`px-3 py-1 rounded-lg text-sm ${siteContent.wellness.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{siteContent.wellness.enabled ? "Hide" : "Show"} Section</button></div>
                <div className="space-y-4"><div><label>Section Title</label><input type="text" value={siteContent.wellness.title} onChange={(e) => setSiteContent({...siteContent, wellness: {...siteContent.wellness, title: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Image URL</label><input type="text" value={siteContent.wellness.image} onChange={(e) => updateWellnessContent("image", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Wellness Items (comma separated)</label><textarea value={siteContent.wellness.items.join(", ")} onChange={(e) => updateWellnessContent("items", e.target.value.split(",").map(s => s.trim()))} rows={3} className="w-full px-4 py-2 border rounded-lg" /></div></div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === "gallery" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold flex items-center gap-2"><ImageIcon size={24} className="text-[#FF8C00]" /> Edit Gallery</h3><button onClick={() => toggleSection("gallery", !siteContent.gallery.enabled)} className={`px-3 py-1 rounded-lg text-sm ${siteContent.gallery.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{siteContent.gallery.enabled ? "Hide" : "Show"} Section</button></div>
                <div><label>Section Title</label><input type="text" value={siteContent.gallery.title} onChange={(e) => setSiteContent({...siteContent, gallery: {...siteContent.gallery, title: e.target.value}})} className="w-full mb-4 px-4 py-2 border rounded-lg" /></div>
                <div className="grid grid-cols-4 gap-4 mb-4">{siteContent.gallery.images.map((img, idx) => (<div key={idx} className="relative group"><img src={img} alt="Gallery" className="h-24 w-full object-cover rounded-lg" /><button onClick={() => deleteGalleryImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"><Trash2 size={12} /></button></div>))}</div>
                <div className="flex gap-3"><input type="text" placeholder="New Image URL" value={newGalleryImage} onChange={(e) => setNewGalleryImage(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" /><button onClick={addGalleryImage} className="px-4 py-2 bg-[#1A2E26] text-white rounded-lg"><Plus size={16} /> Add Image</button></div>
              </div>
            )}

            {/* Journal Tab */}
            {activeTab === "journal" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold flex items-center gap-2"><FileText size={24} className="text-[#FF8C00]" /> Edit Journal</h3><button onClick={() => toggleSection("journal", !siteContent.journal.enabled)} className={`px-3 py-1 rounded-lg text-sm ${siteContent.journal.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{siteContent.journal.enabled ? "Hide" : "Show"} Section</button></div>
                <div className="space-y-4">{siteContent.journal.posts.map((post, idx) => (<div key={idx} className="p-4 bg-gray-50 rounded-lg"><div className="flex gap-3"><input type="text" value={post.title} onChange={(e) => { const newPosts = [...siteContent.journal.posts]; newPosts[idx].title = e.target.value; updateJournalPosts(newPosts); }} placeholder="Title" className="flex-1 px-3 py-2 border rounded-lg" /><input type="text" value={post.image} onChange={(e) => { const newPosts = [...siteContent.journal.posts]; newPosts[idx].image = e.target.value; updateJournalPosts(newPosts); }} placeholder="Image URL" className="flex-1 px-3 py-2 border rounded-lg" /></div><textarea value={post.description} onChange={(e) => { const newPosts = [...siteContent.journal.posts]; newPosts[idx].description = e.target.value; updateJournalPosts(newPosts); }} rows={2} className="w-full mt-2 px-3 py-2 border rounded-lg" placeholder="Description" /><button onClick={() => deleteJournalPost(idx)} className="mt-2 text-red-500 text-sm">Delete</button></div>))}</div>
                <div className="border-t pt-4 mt-4"><h4 className="font-medium mb-3">Add New Post</h4><div className="flex gap-3"><input type="text" placeholder="Title" value={newJournalPost.title} onChange={(e) => setNewJournalPost({...newJournalPost, title: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg" /><input type="text" placeholder="Image URL" value={newJournalPost.image} onChange={(e) => setNewJournalPost({...newJournalPost, image: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg" /></div><textarea placeholder="Description" value={newJournalPost.description} onChange={(e) => setNewJournalPost({...newJournalPost, description: e.target.value})} rows={2} className="w-full mt-2 px-3 py-2 border rounded-lg" /><button onClick={addJournalPost} className="mt-2 px-4 py-2 bg-[#1A2E26] text-white rounded-lg"><Plus size={16} /> Add Post</button></div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold flex items-center gap-2"><Mail size={24} className="text-[#FF8C00]" /> Edit Contact Section</h3><button onClick={() => toggleSection("contact", !siteContent.contact.enabled)} className={`px-3 py-1 rounded-lg text-sm ${siteContent.contact.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{siteContent.contact.enabled ? "Hide" : "Show"} Section</button></div>
                <div className="space-y-4"><div><label>Title</label><input type="text" value={siteContent.contact.title} onChange={(e) => updateContactContent("title", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Subtitle</label><input type="text" value={siteContent.contact.subtitle} onChange={(e) => updateContactContent("subtitle", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Address</label><input type="text" value={siteContent.contact.address} onChange={(e) => updateContactContent("address", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Phone</label><input type="text" value={siteContent.contact.phone} onChange={(e) => updateContactContent("phone", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Email</label><input type="email" value={siteContent.contact.email} onChange={(e) => updateContactContent("email", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div></div>
              </div>
            )}

            {/* Footer Tab */}
            {activeTab === "footer" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold flex items-center gap-2"><Layout size={24} className="text-[#FF8C00]" /> Edit Footer</h3><button onClick={() => toggleSection("footer", !siteContent.footer.enabled)} className={`px-3 py-1 rounded-lg text-sm ${siteContent.footer.enabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{siteContent.footer.enabled ? "Hide" : "Show"} Footer</button></div>
                <div className="space-y-4"><div><label>Logo Text</label><input type="text" value={siteContent.footer.logo} onChange={(e) => updateFooterContent("brand", "logo", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Description</label><textarea value={siteContent.footer.description} onChange={(e) => updateFooterContent("brand", "description", e.target.value)} rows={2} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Copyright</label><input type="text" value={siteContent.footer.copyright} onChange={(e) => updateFooterContent("brand", "copyright", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Address</label><input type="text" value={siteContent.footer.contact.address} onChange={(e) => updateFooterContent("contact", "address", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Phone</label><input type="text" value={siteContent.footer.contact.phone} onChange={(e) => updateFooterContent("contact", "phone", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Email</label><input type="email" value={siteContent.footer.contact.email} onChange={(e) => updateFooterContent("contact", "email", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Facebook URL</label><input type="url" value={siteContent.footer.socialLinks.facebook} onChange={(e) => updateFooterContent("social", "facebook", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Instagram URL</label><input type="url" value={siteContent.footer.socialLinks.instagram} onChange={(e) => updateFooterContent("social", "instagram", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>Twitter URL</label><input type="url" value={siteContent.footer.socialLinks.twitter} onChange={(e) => updateFooterContent("social", "twitter", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div><div><label>YouTube URL</label><input type="url" value={siteContent.footer.socialLinks.youtube} onChange={(e) => updateFooterContent("social", "youtube", e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div></div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === "colors" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Palette size={24} className="text-[#FF8C00]" /> Customize Colors</h3>
                <div className="grid md:grid-cols-2 gap-6">{Object.entries(siteContent.colors).map(([key, value]) => (<div key={key}><label className="block text-sm font-medium mb-2 capitalize">{key}</label><div className="flex gap-3"><input type="color" value={value} onChange={(e) => updateColors(key, e.target.value)} className="w-12 h-10 rounded" /><input type="text" value={value} onChange={(e) => updateColors(key, e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" /><div className="w-8 h-8 rounded-full border" style={{ backgroundColor: value }} /></div></div>))}</div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg"><h4 className="font-medium mb-2">Live Preview</h4><div className="space-y-2"><div className="p-3 rounded" style={{ backgroundColor: siteContent.colors.primary, color: "#fff" }}>Primary Color</div><div className="p-3 rounded" style={{ backgroundColor: siteContent.colors.secondary, color: siteContent.colors.primary }}>Secondary Color</div><div className="p-3 rounded" style={{ color: siteContent.colors.accent }}>Accent Color Text</div></div></div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Villa Modal */}
      <AnimatePresence>{showAddVilla && <VillaModal villa={editingVilla} onSave={saveVilla} onClose={() => { setShowAddVilla(false); setEditingVilla(null); }} />}</AnimatePresence>
    </div>
    </div>
  );
}

function VillaModal({ villa, onSave, onClose }: { villa: Villa | null; onSave: (data: any) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: villa?.name || "", price: villa?.price || 890, capacity: villa?.capacity || 4, bedrooms: villa?.bedrooms || 2, image: villa?.image || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600", features: villa?.features?.join(", ") || "Private Pool, Forest View, Butler Service", popular: villa?.popular || false, description: villa?.description || "" });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...formData, features: formData.features.split(",").map(f => f.trim()) }); };
  return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}><div className="flex justify-between mb-4"><h3 className="text-xl font-semibold">{villa ? "Edit" : "Add"} Villa</h3><button onClick={onClose}><X size={20} /></button></div><form onSubmit={handleSubmit} className="space-y-4"><input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required /><div className="grid grid-cols-2 gap-4"><input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="px-4 py-2 border rounded-lg" /><input type="number" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} className="px-4 py-2 border rounded-lg" /></div><div className="grid grid-cols-2 gap-4"><input type="number" placeholder="Bedrooms" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})} className="px-4 py-2 border rounded-lg" /><input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="px-4 py-2 border rounded-lg" /></div><input type="text" placeholder="Features (comma separated)" value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} className="w-full px-4 py-2 border rounded-lg" /><textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-lg" /><label className="flex items-center gap-2"><input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({...formData, popular: e.target.checked})} /> <span>Popular Villa</span></label><button type="submit" className="w-full py-2 bg-[#1A2E26] text-white rounded-lg">{villa ? "Update" : "Create"}</button></form></motion.div></motion.div>);
}

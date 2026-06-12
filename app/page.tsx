"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Menu, X, ChevronDown, Calendar, Users, MapPin, ArrowRight, Play, Check, Sparkles,
  Waves, Coffee, Flower2, Compass, Phone, Mail, MessageCircle, Globe, Settings, Star, EyeIcon
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import BookingCalendar from "@/app/components/BookingCalendar";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
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
}

const LazyImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="relative overflow-hidden bg-gray-100">
      {!isLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

const FloatingBookingWidget = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Booking request sent! We'll contact you soon.");
    setTimeout(() => setMessage(""), 3000);
  };
  
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block w-72">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] p-3"><h3 className="text-[#1A2E26] font-semibold text-center text-sm">Book Your Escape</h3></div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div><label className="text-xs text-gray-500">Check In</label><input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-2 py-1.5 border rounded-lg text-xs" required /></div>
          <div><label className="text-xs text-gray-500">Check Out</label><input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-2 py-1.5 border rounded-lg text-xs" required /></div>
          <div><label className="text-xs text-gray-500">Guests</label><select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-xs">{[1,2,3,4,5,6].map(n => <option key={n}>{n} Guest{n !== 1 ? 's' : ''}</option>)}</select></div>
          <button type="submit" className="w-full py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold text-sm">Check Availability</button>
          {message && <p className="text-xs text-center text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
      {submitted && <div className="p-2 bg-green-100 text-green-700 rounded-lg text-center text-sm">✓ Message sent!</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" required />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" required />
      </div>
      <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
      <textarea rows={3} placeholder="Your Message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" required />
      <button type="submit" disabled={loading} className="w-full py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold text-sm">{loading ? "Sending..." : "Send Message"}</button>
    </form>
  );
};

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const ch = () => setHover(!!document.querySelector("a, button"));
    window.addEventListener("mousemove", move); window.addEventListener("mouseover", ch);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", ch); };
  }, []);
  return (<motion.div className="fixed top-0 left-0 w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF6B6B] mix-blend-difference pointer-events-none z-[100] hidden xl:block" animate={{ x: pos.x - 12, y: pos.y - 12, scale: hover ? 1.5 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 28 }} />);
};

const FloatingLeaves = () => {
  const leaves = Array.from({ length: 10 }, (_, i) => ({ id: i, left: `${Math.random() * 100}%`, duration: 10 + Math.random() * 10, delay: Math.random() * 5, tx: -60 + Math.random() * 120, ty: -150 - Math.random() * 100, rot: 180 + Math.random() * 360 }));
  return (<div className="absolute inset-0 pointer-events-none overflow-hidden">{leaves.map((leaf) => (<motion.div key={leaf.id} className="absolute text-[#FFD700]/30 text-lg md:text-xl" initial={{ left: leaf.left, top: "100%", opacity: 0 }} animate={{ top: "-20%", x: leaf.tx, rotate: leaf.rot, opacity: [0, 0.5, 0.5, 0] }} transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "linear" }} style={{ left: leaf.left }}>🍃</motion.div>))}</div>);
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const villaCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const experienceCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const galleryItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const journalCardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    fetchVillas();
    fetchSettings();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const fetchVillas = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch("/api/villas", { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      setVillas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching villas:", error);
      setVillas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        setSettings(data);
      } else {
        setSettings({
          hero: { enabled: true, title: "Spectrum of Serenity", subtitle: "Where nature's palette meets architectural poetry", badge: "Award-Winning Luxury Estate", buttonText: "Begin Your Journey", backgroundImage: "/hero.jpeg" },
          about: { enabled: true, title: "Where Architecture Meets the Wilderness", subtitle: "The Estate", description: "Spanning over 50 acres of pristine landscape...", stats: [{ label: "Acres", value: "50+" }, { label: "Villas", value: "12" }], image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800" },
          villas: { enabled: true, title: "The Villas", subtitle: "Private Sanctuaries" },
          experiences: { enabled: true, title: "Immersive Experiences", subtitle: "Curated Journeys", items: [] },
          wellness: { enabled: true, title: "Rejuvenate Your Mind & Body", subtitle: "Holistic Wellness", items: [], image: "" },
          gallery: { enabled: true, title: "The Gallery", subtitle: "Visual Poetry", images: [] },
          journal: { enabled: true, title: "The Journal", subtitle: "Stories & Inspiration", posts: [] },
          contact: { enabled: true, title: "Begin Your Journey Today", subtitle: "Get in Touch", address: "Colors of Combine Estate, Serenity Valley", phone: "+1 (888) 123-4567", email: "hello@colorsofcombine.com" },
          footer: { enabled: true, logo: "Colors of Combine", description: "Sustainable luxury", copyright: "© 2026" },
          header: { logo: { text: "Colors of Combine", image: Logo, useImage: false }, navLinks: [{ id: "home", label: "Home", href: "#home", enabled: true }], showBookingButton: true, bookingButtonText: "Book Your Stay", backgroundColor: "transparent", textColor: "#ffffff" },
          colors: { primary: "#1A2E26", secondary: "#FFD700", accent: "#FF8C00", background: "#FDFBF7", text: "#333333" },
          customSections: []
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    if (settings && !loading) {
      const timer = setTimeout(() => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.to(".hero-image", { scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 0.5 }, scale: 1.1, duration: 0.5 });
        gsap.from(".estate-content", { scrollTrigger: { trigger: ".estate-section", start: "top 80%" }, x: -50, opacity: 0, duration: 0.8 });
        gsap.from(".estate-media", { scrollTrigger: { trigger: ".estate-section", start: "top 80%" }, scale: 0.9, opacity: 0, duration: 0.8 });
        if (villaCardsRef.current.length) gsap.from(villaCardsRef.current, { scrollTrigger: { trigger: ".villas-section", start: "top 80%" }, y: 50, opacity: 0, stagger: 0.1, duration: 0.6 });
        ScrollTrigger.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [settings, loading, villas]);

  if (!settings) {
    return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const hero = settings.hero;
  const about = settings.about;
  const villasSection = settings.villas;
  const experiences = settings.experiences;
  const wellness = settings.wellness;
  const gallery = settings.gallery;
  const journal = settings.journal;
  const contact = settings.contact;
  const footer = settings.footer;
  const headerStyle = settings.header;
  const colors = settings.colors;
  const customSections = settings.customSections || [];

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: colors.background, fontFamily: "'Inter', 'Playfair Display', sans-serif" }}>
      
      <Link href="/admin" className="fixed bottom-6 right-6 z-50 bg-[#1A2E26] text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-[#2D4A3E] transition-all hover:scale-110 block"><Settings size={18} className="md:w-5 md:h-5" /></Link>

      <div className="hidden lg:block"><CustomCursor /></div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 left-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full bg-gradient-to-r from-[#FFD700]/10 via-[#FF8C00]/5 to-transparent blur-3xl" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 12, repeat: Infinity, delay: 1 }} className="absolute bottom-0 right-0 w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] rounded-full bg-gradient-to-l from-[#2E8B57]/10 via-[#00CED1]/5 to-transparent blur-3xl" />
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#1A2E26]/95 backdrop-blur-xl py-2 md:py-3 shadow-lg" : "bg-black/30 backdrop-blur-md py-3 md:py-5"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center"><Image src={Logo} alt="Logo" className="w-full h-full object-contain" /></div>
            <div><div className="text-base md:text-xl font-light bg-gradient-to-r from-[#FFD700] via-[#FF8C00] to-[#FF6B6B] bg-clip-text text-transparent line-clamp-1">{headerStyle.logo.text}</div></div>
          </div>
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {headerStyle.navLinks?.filter((l: any) => l.enabled).map((item: any) => (
              <a key={item.id} href={item.href} onClick={(e) => { e.preventDefault(); document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" }); }} className="text-xs xl:text-sm font-light text-white/80 hover:text-white transition-colors whitespace-nowrap">{item.label}</a>
            ))}
          </div>
          {headerStyle.showBookingButton && <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="hidden lg:block px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] text-xs md:text-sm font-semibold whitespace-nowrap">{headerStyle.bookingButtonText}</button>}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white p-1.5 md:p-2 rounded-full bg-white/10 backdrop-blur-md">{isMenuOpen ? <X size={20} className="md:w-6 md:h-6" /> : <Menu size={20} className="md:w-6 md:h-6" />}</button>
        </div>
      </nav>

      <AnimatePresence>{isMenuOpen && (<motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-40 bg-[#1A2E26] lg:hidden"><div className="flex flex-col items-center justify-center h-full space-y-4 md:space-y-6 px-4">{headerStyle.navLinks?.filter((l: any) => l.enabled).map((item: any) => (<a key={item.id} href={item.href} onClick={(e) => { e.preventDefault(); document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" }); setIsMenuOpen(false); }} className="text-lg md:text-xl font-light text-white/80 hover:text-white">{item.label}</a>))}</div></motion.div>)}</AnimatePresence>

      {hero.enabled && (
        <section id="home" ref={heroRef} className="hero-section relative h-screen w-full overflow-hidden">
          <motion.div className="absolute inset-0" style={{ scale: heroScale, opacity: heroOpacity }}>
            <div className="relative w-full h-full">
              <LazyImage src={hero.backgroundImage} alt="Hero" className="hero-image w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
              <FloatingLeaves />
            </div>
          </motion.div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 md:mb-6"><Sparkles size={12} className="md:w-3.5 md:h-3.5 text-[#FFD700]" /><span className="text-[10px] md:text-xs tracking-wider text-white/90 uppercase">{hero.badge}</span></div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-white mb-3 md:mb-4"><span className="font-serif italic block">Embrace the</span><span className="bg-gradient-to-r from-[#FFD700] via-[#FF8C00] to-[#FF6B6B] bg-clip-text text-transparent text-2xl sm:text-3xl md:text-5xl lg:text-6xl">{hero.title}</span></h1>
              <p className="text-white/80 text-sm md:text-base lg:text-lg max-w-2xl mx-auto mb-4 md:mb-6 px-2">{hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold text-sm md:text-base hover:scale-105 transition-all">{hero.buttonText} <ArrowRight className="inline ml-1 md:w-4 md:h-4" size={14} /></button>
                <button onClick={() => document.getElementById("theestate")?.scrollIntoView({ behavior: "smooth" })} className="px-4 md:px-6 py-2 md:py-3 rounded-full border-2 border-white/30 text-white font-medium backdrop-blur-sm hover:bg-white/10 transition-all text-sm md:text-base">Explore the Estate</button>
              </div>
            </div>
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 cursor-pointer" onClick={() => document.getElementById("theestate")?.scrollIntoView({ behavior: "smooth" })}><ChevronDown size={16} className="md:w-5 md:h-5 text-white/60 animate-bounce" /></div>
          </div>
        </section>
      )}

      {about.enabled && (
        <section id="theestate" className="estate-section py-12 md:py-20 px-4 sm:px-6 overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="estate-content">
                <span className="text-[#FF8C00] text-xs md:text-sm tracking-[0.3em] uppercase">{about.subtitle}</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A2E26] mt-2 md:mt-3 mb-3 md:mb-4">{about.title}</h2>
                <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">{about.description}</p>
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">{about.stats?.map((stat: any, idx: number) => (<div key={idx} ref={el => { if (el) statsRefs.current[idx] = el; }}><div className="text-xl md:text-2xl font-bold text-[#FF8C00]">{stat.value}</div><div className="text-xs md:text-sm text-gray-500">{stat.label}</div></div>))}</div>
                <button className="flex items-center gap-2 text-[#1A2E26] border-b-2 border-[#FFD700] pb-1 hover:gap-3 transition-all text-xs md:text-sm">Discover the Story <ArrowRight size={12} className="md:w-3.5 md:h-3.5" /></button>
              </div>
              <div className="estate-media relative"><div className="relative rounded-2xl overflow-hidden shadow-xl"><LazyImage src={about.image} alt="Estate" className="w-full h-[250px] md:h-[400px] object-cover" /></div></div>
            </div>
          </div>
        </section>
      )}

      {villasSection.enabled && (
        <section id="villas" className="villas-section py-12 md:py-20 px-4 sm:px-6 bg-[#F5F2ED]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8 md:mb-12"><span className="text-[#FF8C00] text-xs md:text-sm tracking-[0.3em] uppercase">{villasSection.subtitle}</span><h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A2E26] mt-2">{villasSection.title}</h2></div>
            {loading ? <div className="flex justify-center"><div className="w-8 h-8 md:w-10 md:h-10 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div></div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">{villas.map((villa, idx) => (<div key={villa.id} ref={el => { if (el) villaCardsRef.current[idx] = el; }} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1">{villa.popular && <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">SIGNATURE</div>}<div className="relative h-48 md:h-56 overflow-hidden"><LazyImage src={villa.image} alt={villa.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-3 left-3"><div className="text-lg md:text-xl font-bold text-white">${villa.price}</div><div className="text-white/70 text-[10px] md:text-xs">/night</div></div></div><div className="p-3 md:p-4"><h3 className="text-base md:text-lg font-semibold text-[#1A2E26] mb-1">{villa.name}</h3><div className="flex flex-wrap gap-1 mb-2 md:mb-3">{villa.features?.slice(0, 3).map((f: string) => <span key={f} className="text-[10px] md:text-xs text-gray-500 bg-gray-100 px-1.5 md:px-2 py-0.5 rounded-full">{f}</span>)}</div><button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="w-full py-1.5 md:py-2 text-xs md:text-sm rounded-full border border-[#1A2E26]/20 hover:bg-[#1A2E26] hover:text-white transition-all">Explore Villa</button></div></div>))}</div>
            )}
          </div>
        </section>
      )}

      {experiences.enabled && experiences.items?.length > 0 && (
        <section id="experiences" className="experiences-section py-12 md:py-20 px-4 sm:px-6 overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8 md:mb-12"><span className="text-[#FF8C00] text-xs md:text-sm tracking-[0.3em] uppercase">{experiences.subtitle}</span><h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A2E26] mt-2">{experiences.title}</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{experiences.items.map((exp: any, idx: number) => (<div key={idx} ref={el => { if (el) experienceCardsRef.current[idx] = el; }} className="bg-white rounded-xl p-4 md:p-6 text-center shadow-md hover:shadow-xl transition-all hover:-translate-y-1"><div className={`w-10 h-10 md:w-14 md:h-14 mx-auto rounded-full bg-gradient-to-r ${exp.color} flex items-center justify-center mb-3 md:mb-4`}><div className="text-white text-lg md:text-2xl">⭐</div></div><h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{exp.title}</h3><p className="text-gray-500 text-xs md:text-sm">{exp.description}</p></div>))}</div>
          </div>
        </section>
      )}

      {wellness.enabled && (
        <section id="wellness" className="wellness-section py-12 md:py-20 px-4 sm:px-6 bg-[#1A2E26]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="wellness-media order-2 lg:order-1"><LazyImage src={wellness.image} alt="Wellness" className="rounded-2xl w-full h-[250px] md:h-[400px] object-cover" /></div>
              <div className="wellness-content order-1 lg:order-2"><span className="text-[#FFD700] text-xs md:text-sm tracking-[0.3em] uppercase">{wellness.subtitle}</span><h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mt-2 md:mt-3 mb-3 md:mb-4">{wellness.title}</h2><p className="text-white/70 text-sm md:text-base mb-4 md:mb-6">Our award-winning spa combines ancient healing traditions with modern wellness science.</p><div className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">{wellness.items?.map((item: string, idx: number) => (<div key={idx} className="flex items-center gap-2 md:gap-3"><Check size={14} className="md:w-4 md:h-4 text-[#FFD700]" /><span className="text-white/80 text-xs md:text-sm">{item}</span></div>))}</div><button className="px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold text-xs md:text-sm">Explore Wellness</button></div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section with Lightbox */}
      {gallery.enabled && gallery.images?.length > 0 && (
        <section id="gallery" className="gallery-section py-12 md:py-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8 md:mb-12">
              <span className="text-[#FF8C00] text-xs md:text-sm tracking-[0.3em] uppercase">{gallery.subtitle}</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A2E26] mt-2">{gallery.title}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {gallery.images.map((img: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setLightboxOpen(true);
                  }}
                >
                  <LazyImage 
                    src={img} 
                    alt={`Gallery ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-2 md:p-3">
                      <EyeIcon size={16} className="md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button onClick={() => setLightboxOpen(false)} className="absolute top-3 right-3 md:top-6 md:right-6 text-white hover:text-[#FFD700] transition-colors z-10 bg-black/50 rounded-full p-1.5 md:p-2 hover:bg-black/70"><X size={20} className="md:w-7 md:h-7" /></button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + gallery.images.length) % gallery.images.length); }} className="absolute left-2 md:left-6 text-white hover:text-[#FFD700] transition-colors bg-black/50 rounded-full p-2 md:p-3 hover:bg-black/70"><ChevronDown size={24} className="md:w-8 md:h-8 rotate-90" /></button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % gallery.images.length); }} className="absolute right-2 md:right-6 text-white hover:text-[#FFD700] transition-colors bg-black/50 rounded-full p-2 md:p-3 hover:bg-black/70"><ChevronDown size={24} className="md:w-8 md:h-8 -rotate-90" /></button>
            <div className="absolute top-3 left-3 md:top-6 md:left-6 text-white/70 text-[10px] md:text-sm bg-black/50 px-2 py-0.5 md:px-3 md:py-1 rounded-full">{currentImageIndex + 1} / {gallery.images.length}</div>
            
            <motion.img 
              key={currentImageIndex} 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              transition={{ duration: 0.3 }} 
              src={gallery.images[currentImageIndex]} 
              alt={`Gallery ${currentImageIndex + 1}`} 
              className="w-[90vw] h-auto max-h-[80vh] md:w-auto md:max-w-[90vw] md:max-h-[90vh] object-contain rounded-lg cursor-pointer" 
              onClick={(e) => e.stopPropagation()} 
            />
            
            <div className="absolute bottom-2 md:bottom-6 left-0 right-0 flex justify-center gap-1 md:gap-2 overflow-x-auto px-2 md:px-4 py-1 md:py-2">
              {gallery.images.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }} 
                  className={`w-10 h-10 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all ${idx === currentImageIndex ? 'ring-2 ring-[#FFD700] scale-110' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {journal.enabled && journal.posts?.length > 0 && (
        <section id="journal" className="journal-section py-12 md:py-20 px-4 sm:px-6 bg-[#F5F2ED]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8 md:mb-12"><span className="text-[#FF8C00] text-xs md:text-sm tracking-[0.3em] uppercase">{journal.subtitle}</span><h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A2E26] mt-2">{journal.title}</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">{journal.posts.map((post: any, idx: number) => (<div key={idx} ref={el => { if (el) journalCardsRef.current[idx] = el; }} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"><div className="relative h-40 md:h-48 overflow-hidden"><LazyImage src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div><div className="p-3 md:p-4"><div className="text-[#FF8C00] text-[10px] md:text-xs mb-1">{post.date}</div><h3 className="text-base md:text-lg font-semibold text-[#1A2E26] mb-1 group-hover:text-[#FF8C00] transition-colors line-clamp-2">{post.title}</h3><p className="text-gray-500 text-xs md:text-sm line-clamp-2">{post.description}</p></div></div>))}</div>
          </div>
        </section>
      )}

      {customSections.map((section: any, idx: number) => (
        section.enabled && (
          <section key={section.id} className="py-12 md:py-20 px-4 sm:px-6" style={{ backgroundColor: section.backgroundColor || '#FDFBF7' }}>
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <span className="text-[#FF8C00] text-xs md:text-sm tracking-[0.3em] uppercase">{section.subtitle}</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A2E26] mt-2">{section.title}</h2>
                {section.description && <p className="text-gray-500 text-sm md:text-base mt-2 md:mt-3 max-w-2xl mx-auto">{section.description}</p>}
              </div>
              <div className={`grid gap-4 md:gap-6 ${section.layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
                {section.items?.map((item: any, itemIdx: number) => (
                  <div key={itemIdx} className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all text-center">
                    {item.icon && <div className="text-3xl md:text-4xl mb-2 md:mb-3">{item.icon}</div>}
                    <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm md:text-base">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      ))}

      <section className="py-20 px-6 bg-[#F5F2ED]">
        <div className="container mx-auto max-w-4xl">
          <BookingCalendar />
        </div>
      </section>

      {contact.enabled && (
        <section id="contact" className="contact-section py-12 md:py-20 px-4 sm:px-6 text-black">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
              <div className="contact-info"><span className="text-[#FF8C00] text-xs md:text-sm tracking-[0.3em] uppercase">{contact.subtitle}</span><h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A2E26] mt-2 mb-3 md:mb-4">{contact.title}</h2><p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">Our concierge team is available 24/7.</p><div className="space-y-2 md:space-y-3"><div className="flex items-center gap-2 md:gap-3"><MapPin size={14} className="md:w-4 md:h-4" /><span className="text-xs md:text-sm">{contact.address}</span></div><div className="flex items-center gap-2 md:gap-3"><Phone size={14} className="md:w-4 md:h-4" /><span className="text-xs md:text-sm">{contact.phone}</span></div><div className="flex items-center gap-2 md:gap-3"><Mail size={14} className="md:w-4 md:h-4" /><span className="text-xs md:text-sm">{contact.email}</span></div></div></div>
              <div><ContactForm /></div>
            </div>
          </div>
        </section>
      )}

      {footer.enabled && (
        <footer className="bg-[#1A2E26] py-8 md:py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
              <div><div className="text-base md:text-xl font-light mb-2 md:mb-3 text-[#FFD700]">{footer.logo}</div><p className="text-white/50 text-xs md:text-sm">{footer.description}</p></div>
              <div><h4 className="text-white text-xs md:text-sm mb-2 md:mb-3">Explore</h4><ul className="space-y-1 text-white/50 text-[10px] md:text-sm"><li>The Estate</li><li>Villas</li><li>Experiences</li><li>Wellness</li></ul></div>
              <div><h4 className="text-white text-xs md:text-sm mb-2 md:mb-3">Legal</h4><ul className="space-y-1 text-white/50 text-[10px] md:text-sm"><li>Privacy Policy</li><li>Terms & Conditions</li></ul></div>
              <div><h4 className="text-white text-xs md:text-sm mb-2 md:mb-3">Connect</h4><div className="flex gap-2 md:gap-3"><MessageCircle size={14} className="md:w-4.5 md:h-4.5 text-white/50 hover:text-white cursor-pointer" /><Globe size={14} className="md:w-4.5 md:h-4.5 text-white/50 hover:text-white cursor-pointer" /><FaYoutube size={14} className="md:w-4.5 md:h-4.5 text-white/50 hover:text-white cursor-pointer" /></div></div>
            </div>
            <div className="border-t border-white/10 pt-4 md:pt-6 text-center text-white/30 text-[10px] md:text-xs">{footer.copyright}</div>
          </div>
        </footer>
      )}
    </div>
  );
}
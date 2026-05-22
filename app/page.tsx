"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import LOGO from "@/public/logo.png";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Menu,
  X,
  ChevronDown,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  Play,
  Check,
  Sparkles,
  Waves,
  Coffee,
  Flower2,
  Compass,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Settings,
  Star,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";

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

interface SiteSettings {
  hero: { title: string; subtitle: string; badge: string; buttonText: string; backgroundImage: string; enabled: boolean };
  about: { title: string; subtitle: string; description: string; stats: Array<{ label: string; value: string }>; image: string; enabled: boolean };
  villas: { title: string; subtitle: string; enabled: boolean };
  experiences: { title: string; subtitle: string; items: Array<{ icon: string; title: string; description: string; color: string }>; enabled: boolean };
  wellness: { title: string; subtitle: string; items: string[]; image: string; enabled: boolean };
  gallery: { title: string; subtitle: string; images: string[]; enabled: boolean };
  journal: { title: string; subtitle: string; posts: Array<{ title: string; date: string; image: string; description: string }>; enabled: boolean };
  contact: { title: string; subtitle: string; address: string; phone: string; email: string; enabled: boolean };
  footer: { logo: string; description: string; copyright: string; enabled: boolean; socialLinks: { facebook: string; instagram: string; twitter: string; youtube: string }; contact: { address: string; phone: string; email: string } };
  header: { logo: { text: string; image: string; useImage: boolean }; navLinks: Array<{ id: string; label: string; href: string; enabled: boolean }>; showBookingButton: boolean; bookingButtonText: string; backgroundColor: string; textColor: string; transparentOnScroll: boolean };
  colors: { primary: string; secondary: string; accent: string; background: string; text: string };
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  
  const statsRefs = useRef<(HTMLElement | null)[]>([]);
  const villaCardsRef = useRef<(HTMLElement | null)[]>([]);
  const experienceCardsRef = useRef<(HTMLElement | null)[]>([]);
  const galleryItemsRef = useRef<(HTMLElement | null)[]>([]);
  const journalCardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    fetchVillas();
    fetchSettings();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (settings) {
      setTimeout(() => initGSAPAnimations(), 500);
    }
  }, [settings, villas]);

  const fetchVillas = async () => {
    try {
      const res = await fetch("/api/villas");
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
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      const saved = localStorage.getItem("siteContent");
      if (saved) setSettings(JSON.parse(saved));
    }
  };

  const initGSAPAnimations = () => {
    gsap.to(".hero-image", {
      scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 1 },
      scale: 1.15, duration: 1,
    });

    gsap.from(".estate-content", {
      scrollTrigger: { trigger: ".estate-section", start: "top 70%", toggleActions: "play none none reverse" },
      x: -80, opacity: 0, duration: 1.2, ease: "power3.out",
    });

    gsap.from(".estate-media", {
      scrollTrigger: { trigger: ".estate-section", start: "top 70%", toggleActions: "play none none reverse" },
      scale: 0.8, opacity: 0, duration: 1.2, ease: "back.out(0.6)",
    });

    document.querySelectorAll(".stat-value-number").forEach((stat) => {
      gsap.from(stat, {
        scrollTrigger: { trigger: ".estate-section", start: "top 60%", toggleActions: "play none none reverse" },
        innerText: 0, duration: 2, snap: { innerText: 1 }, ease: "power2.out",
        onUpdate: function() {
          if (stat.textContent?.includes("+")) {
            stat.textContent = Math.floor(Number(stat.textContent)) + "+";
          }
        },
      });
    });

    villaCardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.from(card, {
          scrollTrigger: { trigger: ".villas-section", start: "top 70%", toggleActions: "play none none reverse" },
          y: 100, opacity: 0, rotationX: 15, duration: 0.8, delay: i * 0.15, ease: "back.out(0.7)",
        });
      }
    });

    experienceCardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.from(card, {
          scrollTrigger: { trigger: ".experiences-section", start: "top 75%", toggleActions: "play none none reverse" },
          y: 50, opacity: 0, duration: 0.6, delay: i * 0.1, ease: "power2.out",
        });
      }
    });

    gsap.from(".wellness-media", {
      scrollTrigger: { trigger: ".wellness-section", start: "top 70%", toggleActions: "play none none reverse" },
      x: -100, opacity: 0, rotationY: 20, duration: 1, ease: "power3.out",
    });

    gsap.from(".wellness-content", {
      scrollTrigger: { trigger: ".wellness-section", start: "top 70%", toggleActions: "play none none reverse" },
      x: 100, opacity: 0, duration: 1, ease: "power3.out",
    });

    galleryItemsRef.current.forEach((item, i) => {
      if (item) {
        gsap.from(item, {
          scrollTrigger: { trigger: ".gallery-section", start: "top 75%", toggleActions: "play none none reverse" },
          scale: 0, opacity: 0, rotation: -10, duration: 0.5, delay: i * 0.05, ease: "back.out(0.8)",
        });
      }
    });

    journalCardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.from(card, {
          scrollTrigger: { trigger: ".journal-section", start: "top 70%", toggleActions: "play none none reverse" },
          y: 60, opacity: 0, duration: 0.7, delay: i * 0.15, ease: "power3.out",
        });
      }
    });
  };

  const navItems = settings?.header?.navLinks?.filter(l => l.enabled).map(l => l.label) || [
    "Home", "The Estate", "Villas", "Experiences", "Wellness", "Gallery", "Journal", "Contact"
  ];

  const headerStyle = settings?.header || { backgroundColor: "transparent", textColor: "#ffffff", logo: { text: "Colors of Combine", image: {LOGO}, useImage: false } };
  const hero = settings?.hero || { title: "Embrace the Spectrum of Serenity", subtitle: "Where nature's palette meets architectural poetry", badge: "Award-Winning Luxury Estate", buttonText: "Begin Your Journey", backgroundImage: "/hero.jpeg", enabled: true };
  const about = settings?.about || { title: "Where Architecture Meets the Wilderness", subtitle: "The Estate", description: "Spanning over 50 acres of pristine landscape...", stats: [{ label: "Acres", value: "50+" }, { label: "Villas", value: "12" }, { label: "Award", value: "2024" }, { label: "Rating", value: "5.0" }], image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800", enabled: true };
  const experiences = settings?.experiences || { title: "Immersive Experiences", subtitle: "Curated Journeys", items: [], enabled: true };
  const wellness = settings?.wellness || { title: "Rejuvenate Your Mind & Body", subtitle: "Holistic Wellness", items: ["Ayurvedic Treatments", "Guided Meditation", "Cryotherapy & Sauna", "Nutrition Plans"], image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800", enabled: true };
  const gallery = settings?.gallery || { title: "The Gallery", subtitle: "Visual Poetry", images: [], enabled: true };
  const journal = settings?.journal || { title: "The Journal", subtitle: "Stories & Inspiration", posts: [], enabled: true };
  const contact = settings?.contact || { title: "Begin Your Journey Today", subtitle: "Get in Touch", address: "Colors of Combine Estate, Serenity Valley", phone: "+1 (888) 123-4567", email: "hello@colorsofcombine.com", enabled: true };
  const footer = settings?.footer || { logo: "Colors of Combine", description: "Sustainable luxury nestled in nature's embrace.", copyright: "© 2024 Colors of Combine. All rights reserved.", enabled: true, socialLinks: { facebook: "#", instagram: "#", twitter: "#", youtube: "#" }, contact: { address: "", phone: "", email: "" } };
  const colors = settings?.colors || { primary: "#1A2E26", secondary: "#FFD700", accent: "#FF8C00", background: "#FDFBF7", text: "#333333" };

  if (!settings) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] overflow-x-hidden" style={{ backgroundColor: colors.background, fontFamily: "'Inter', 'Playfair Display', sans-serif" }}>
      {/* Admin Button */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: "spring" }} className="fixed bottom-6 right-6 z-50">
        <Link href="/admin" className="bg-[#1A2E26] text-white p-3 rounded-full shadow-lg hover:bg-[#2D4A3E] transition-all duration-300 hover:scale-110 flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}><Settings size={20} /></motion.div>
        </Link>
      </motion.div>

      <div className="hidden lg:block"><CustomCursor /></div>

      {/* Animated Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#FFD700]/10 via-[#FF8C00]/5 to-transparent blur-3xl" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 12, repeat: Infinity, delay: 1 }} className="absolute bottom-0 right-0 w-[1000px] h-[1000px] rounded-full bg-gradient-to-l from-[#2E8B57]/10 via-[#00CED1]/5 to-transparent blur-3xl" />
      </div>

      {/* Navigation */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#1A2E26]/95 backdrop-blur-xl py-4 border-b border-white/10 shadow-lg" : "bg-black/30 backdrop-blur-md py-6"}`}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-10 h-10 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] rounded-full flex items-center justify-center"><span className="bg-white rounded-full text-[#1A2E26] font-bold text-xl">
              <Image
                src={LOGO}
                alt="Logo"
                className="rounded-full"
                width={30}
                height={30} 
              />
                </span></div>
            <div><div className="text-xl font-light text-white">{headerStyle.logo.text}</div><div className="text-[10px] tracking-wider text-white/50">LUXURY FARMHOUSE</div></div>
          </motion.div>
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, idx) => (
              <motion.a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "")}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="relative text-sm font-light tracking-wide text-white/80 hover:text-white transition-colors py-2 group" onClick={(e) => { e.preventDefault(); document.getElementById(item.toLowerCase().replace(/\s+/g, ""))?.scrollIntoView({ behavior: "smooth" }); }}>
                {item}
                <motion.span className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-[#FFD700] to-[#FF6B6B]" initial={{ width: 0 }} whileHover={{ width: "100%" }} transition={{ duration: 0.3 }} />
              </motion.a>
            ))}
          </div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] text-sm font-semibold" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Calendar size={16} /> Book Your Stay</motion.button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white p-2 rounded-full bg-white/10 backdrop-blur-md">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </motion.nav>

      <AnimatePresence>{isMenuOpen && (<motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-40 bg-[#1A2E26] lg:hidden"><div className="flex flex-col items-center justify-center h-full space-y-8">{navItems.map((item, idx) => (<motion.a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "")}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="text-2xl font-light text-white/80 hover:text-white" onClick={() => setIsMenuOpen(false)}>{item}</motion.a>))}<motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold" onClick={() => { setIsMenuOpen(false); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>Book Your Stay</motion.button></div></motion.div>)}</AnimatePresence>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="hero-section relative h-screen w-full overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale, opacity: heroOpacity }}>
          <div className="relative w-full h-full">
            <img src={hero.backgroundImage} alt="Hero" className="hero-image w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            <FloatingLeaves />
          </div>
        </motion.div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"><Sparkles size={14} className="text-[#FFD700]" /><span className="text-xs tracking-wider text-white/90 uppercase">{hero.badge}</span></div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-6"><span className="font-serif italic block">Embrace the</span><span className="bg-gradient-to-r from-[#FFD700] via-[#FF8C00] to-[#FF6B6B] bg-clip-text text-transparent animate-gradient">{hero.title}</span></h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">{hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold text-lg hover:scale-105 transition-all">{hero.buttonText} <ArrowRight className="inline ml-2" size={20} /></button>
              <button onClick={() => document.getElementById("theestate")?.scrollIntoView({ behavior: "smooth" })} className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-medium backdrop-blur-sm hover:bg-white/10 transition-all">Explore the Estate</button>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer" onClick={() => document.getElementById("theestate")?.scrollIntoView({ behavior: "smooth" })}><span className="text-white/60 text-xs tracking-widest uppercase">Scroll to Discover</span><motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ChevronDown size={20} className="text-white/60" /></motion.div></div>
        </div>
      </section>


      {/* The Estate Section */}
      <section id="theestate" className="estate-section relative py-32 px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="estate-content">
              <span className="text-[#FF8C00] text-sm tracking-[0.3em] uppercase">{about.subtitle}</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1A2E26] mt-4 mb-6 leading-tight">{about.title}</h2>
              <p className="text-gray-600 text-lg mb-6">{about.description}</p>
              <div className="grid grid-cols-2 gap-6 mb-8">{about.stats.map((stat, idx) => (<div key={idx} ref={el => { if (el) statsRefs.current[idx] = el; }}><div className="stat-value-number text-3xl font-bold text-[#FF8C00]">{stat.value}</div><div className="text-gray-500">{stat.label}</div></div>))}</div>
              <button className="flex items-center gap-2 text-[#1A2E26] border-b-2 border-[#FFD700] pb-1 hover:gap-3 transition-all">Discover the Story <ArrowRight size={16} /></button>
            </div>
            <div className="estate-media relative"><div className="relative rounded-3xl overflow-hidden shadow-2xl"><img src={about.image} alt="Estate" className="w-full h-[500px] object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /><div className="absolute bottom-6 left-6"><div className="flex items-center gap-2 text-white"><Play size={16} className="text-[#FFD700]" /><span>Watch Film</span></div></div></div></div>
          </div>
        </div>
      </section>

      {/* Villas Section */}
      <section id="villas" className="villas-section relative py-32 px-6 bg-[#F5F2ED]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16"><span className="text-[#FF8C00] text-sm tracking-[0.3em] uppercase">{settings.villas.subtitle}</span><h2 className="text-4xl md:text-5xl font-light text-[#1A2E26] mt-4">{settings.villas.title}</h2></div>
          {loading ? <div className="flex justify-center"><div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div></div> : (
            <div className="grid md:grid-cols-3 gap-8">{villas.map((villa, idx) => (<motion.div key={villa.id} ref={el => { if (el) villaCardsRef.current[idx] = el; }} className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">{villa.popular && <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] text-xs font-bold px-3 py-1 rounded-full">SIGNATURE</div>}<div className="relative h-72 overflow-hidden"><img src={villa.image} alt={villa.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-4 left-4"><div className="text-2xl font-bold text-white">${villa.price}</div><div className="text-white/80 text-sm">/night</div></div></div><div className="p-6"><h3 className="text-xl font-semibold text-[#1A2E26] mb-2">{villa.name}</h3><div className="flex flex-wrap gap-2 mb-4">{villa.features?.slice(0, 3).map(f => <span key={f} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{f}</span>)}</div><button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="w-full py-3 rounded-full border border-[#1A2E26]/20 hover:bg-[#1A2E26] hover:text-white transition-all">Explore Villa</button></div></motion.div>))}</div>
          )}
        </div>
      </section>

      {/* Experiences Section */}
      <section id="experiences" className="experiences-section relative py-32 px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16"><span className="text-[#FF8C00] text-sm tracking-[0.3em] uppercase">{settings.experiences.subtitle}</span><h2 className="text-4xl md:text-5xl font-light text-[#1A2E26] mt-4">{settings.experiences.title}</h2></div>
          <div className="grid md:grid-cols-4 gap-6">{experiences.items.map((exp, idx) => (<motion.div key={idx} ref={el => { if (el) experienceCardsRef.current[idx] = el; }} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"><div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-r ${exp.color} flex items-center justify-center mb-4`}><div className="text-white text-2xl">⭐</div></div><h3 className="text-xl font-semibold mb-2">{exp.title}</h3><p className="text-gray-500 text-sm">{exp.description}</p></motion.div>))}</div>
        </div>
      </section>

      {/* Wellness Section */}
      <section id="wellness" className="wellness-section relative py-32 px-6 bg-[#1A2E26]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div className="wellness-media"><img src={wellness.image} alt="Wellness" className="rounded-3xl w-full h-[500px] object-cover" /></motion.div>
            <motion.div className="wellness-content"><span className="text-[#FFD700] text-sm tracking-[0.3em] uppercase">{wellness.subtitle}</span><h2 className="text-4xl md:text-5xl font-light text-white mt-4 mb-6">{wellness.title}</h2><p className="text-white/70 text-lg mb-6">Our award-winning spa combines ancient healing traditions with modern wellness science.</p><div className="space-y-3 mb-8">{wellness.items.map((item, idx) => (<div key={idx} className="flex items-center gap-3"><Check size={18} className="text-[#FFD700]" /><span className="text-white/80">{item}</span></div>))}</div><button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold">Explore Wellness</button></motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section relative py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16"><span className="text-[#FF8C00] text-sm tracking-[0.3em] uppercase">{gallery.subtitle}</span><h2 className="text-4xl md:text-5xl font-light text-[#1A2E26] mt-4">{gallery.title}</h2></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{(gallery.images.length ? gallery.images : ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400","https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400","https://images.unsplash.com/photo-1540206395-68808572332f?w=400","https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400"]).map((img, idx) => (<motion.div key={idx} ref={el => { if (el) galleryItemsRef.current[idx] = el; }} className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"><img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" /><div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors" /></motion.div>))}</div>
        </div>
      </section>

      {/* Journal Section */}
      <section id="journal" className="journal-section relative py-32 px-6 bg-[#F5F2ED]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16"><span className="text-[#FF8C00] text-sm tracking-[0.3em] uppercase">{journal.subtitle}</span><h2 className="text-4xl md:text-5xl font-light text-[#1A2E26] mt-4">{journal.title}</h2></div>
          <div className="grid md:grid-cols-3 gap-8">{(journal.posts.length ? journal.posts : [{ title: "The Art of Slow Living", date: "Dec 15, 2024", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600", description: "Embracing mindfulness" }]).map((post, idx) => (<motion.article key={idx} ref={el => { if (el) journalCardsRef.current[idx] = el; }} className="group cursor-pointer"><div className="relative h-64 rounded-xl overflow-hidden mb-4"><img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div><div className="text-sm text-[#FF8C00] mb-2"></div><h3 className="text-xl font-semibold text-[#1A2E26] mb-2 group-hover:text-[#FF8C00] transition-colors">{post.title}</h3><p className="text-gray-500">{post.description}</p></motion.article>))}</div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section relative py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div className="contact-info"><span className="text-[#FF8C00] text-sm tracking-[0.3em] uppercase">{contact.subtitle}</span><h2 className="text-4xl md:text-5xl font-light text-[#1A2E26] mt-4 mb-6">{contact.title}</h2><p className="text-gray-600 text-lg mb-8">Our concierge team is available 24/7.</p><div className="space-y-4 text-[#1A2E26]"><div className="flex items-center gap-4"><MapPin size={18} /><span>{contact.address}</span></div><div className="flex items-center gap-4"><Phone size={18} /><span>{contact.phone}</span></div><div className="flex items-center gap-4"><Mail size={18} /><span>{contact.email}</span></div></div></motion.div>
            <motion.div className="contact-form-container"><ContactForm /></motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2E26] py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div><div className="text-2xl font-light mb-4 text-[#FFD700]">{footer.logo}</div><p className="text-white/50">{footer.description}</p></div>
            <div><h4 className="text-white mb-4">Explore</h4><ul className="space-y-2 text-white/50"><li>The Estate</li><li>Villas</li><li>Experiences</li><li>Wellness</li></ul></div>
            <div><h4 className="text-white mb-4">Legal</h4><ul className="space-y-2 text-white/50"><li>Privacy Policy</li><li>Terms & Conditions</li></ul></div>
            <div><h4 className="text-white mb-4">Connect</h4><div className="flex gap-4"><MessageCircle size={20} className="text-white/50 hover:text-white cursor-pointer" /><Globe size={20} className="text-white/50 hover:text-white cursor-pointer" /><FaYoutube size={20} className="text-white/50 hover:text-white cursor-pointer" /></div></div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/30">{footer.copyright}</div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes floatLeaf { 0%,100% { transform: translate(0,0) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(var(--tx,100px),var(--ty,-200px)) rotate(var(--rot,360deg)); opacity: 0; } }
        @keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-gradient { background-size: 200% auto; animation: gradientShift 3s ease infinite; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1A2E26; }
        ::-webkit-scrollbar-thumb { background: #FFD700; border-radius: 4px; }
      `}</style>
    </div>
  );
}


function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
      {submitted && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg text-center">
          ✓ Message sent! We'll contact you soon.
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">
          ✗ {error}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:border-[#FF8C00] focus:outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:border-[#FF8C00] focus:outline-none"
          required
        />
      </div>
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full px-4 py-3 border rounded-lg focus:border-[#FF8C00] focus:outline-none"
      />
      <textarea
        rows={4}
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full px-4 py-3 border rounded-lg focus:border-[#FF8C00] focus:outline-none resize-none"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const ch = () => setHover(!!document.querySelector("a, button"));
    window.addEventListener("mousemove", move); window.addEventListener("mouseover", ch);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", ch); };
  }, []);
  return (<motion.div className="fixed top-0 left-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF6B6B] mix-blend-difference pointer-events-none z-[100]" animate={{ x: pos.x - 16, y: pos.y - 16, scale: hover ? 1.5 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 28 }} />);
}

function FloatingLeaves() {
  const leaves = Array.from({ length: 15 }, (_, i) => ({ id: i, left: `${Math.random() * 100}%`, duration: 8 + Math.random() * 12, delay: Math.random() * 8, tx: -80 + Math.random() * 160, ty: -200 - Math.random() * 100, rot: 180 + Math.random() * 360 }));
  return (<div className="absolute inset-0 pointer-events-none overflow-hidden">{leaves.map((leaf) => (<motion.div key={leaf.id} className="absolute text-[#FFD700]/40 text-2xl" initial={{ left: leaf.left, top: "100%", opacity: 0 }} animate={{ top: "-20%", x: leaf.tx, rotate: leaf.rot, opacity: [0, 0.6, 0.6, 0] }} transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "linear" }} style={{ left: leaf.left }}>🍃</motion.div>))}</div>);
}
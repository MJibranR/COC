"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Menu, X, ChevronDown, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, MapPin, ArrowRight, Play, Check, Sparkles,
  Waves, Coffee, Flower2, Compass, CheckCircle, Phone, Mail, MessageCircle, Globe, Settings, Star, EyeIcon, Sun, Moon, Clock, User, AlertCircle
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import PricingSection from "@/app/components/PricingSection";



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

// Pricing Section Component
function PricingSectionComponent() {
  const [pricing, setPricing] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      console.log("Pricing data:", data);
      setPricing(data);
      
      // Find trending option or first enabled option
      if (data.pricingOptions && data.pricingOptions.length > 0) {
        const trending = data.pricingOptions.find((opt: any) => opt.isTrending && opt.enabled);
        const firstEnabled = data.pricingOptions.find((opt: any) => opt.enabled);
        setSelectedOption(trending || firstEnabled || data.pricingOptions[0]);
      } else {
        // Fallback for old data structure
        setSelectedOption({
          label: "Weekday Night",
          price: data.weekday_night_price || data.weekdayNightPrice || 45000,
          description: "Monday - Thursday"
        });
      }
    } catch (error) {
      console.error("Error fetching pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK').format(price);
  };

  if (loading) {
    return (
      <div className="py-20 px-4 bg-gradient-to-br from-[#1A2E26] to-[#2D4A3E]">
        <div className="container mx-auto max-w-6xl flex justify-center">
          <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!pricing || pricing.enabled === false) return null;

  // Get facilities
  const facilities = pricing.facilities || [
    "3 Bedrooms (without AC)", "Kitchen", "Kidz Play Area & Birds Area", "Table Tennis",
    "Foosball, Carrom, Pool ball", "BBQ Pit (Angeethi + 1 Dozen Seekh)", "Spacious Parking Area",
    "K-Electric + Solar + Generator Backup", "2 Swimming Pools (Adults & Kids)",
    "Poolside Shower Area + 4 Changing Rooms", "6 Public Washrooms (Ladies & Gents)"
  ];

  // Get pricing options from API or use fallback
  const pricingOptions = pricing.pricingOptions || [
    { id: "weekday", label: "Weekday Night", description: "Monday - Thursday", price: pricing.weekday_night_price || pricing.weekdayNightPrice || 45000, icon: "🌙", enabled: true, isTrending: false },
    { id: "weekend", label: "Weekend Night", description: "Friday - Sunday", price: pricing.weekend_night_price || pricing.weekendNightPrice || 55000, icon: "⭐", enabled: true, isTrending: true },
    { id: "22hours", label: "22 Hours", description: "Any 22-hour slot", price: pricing.twenty_two_hours_price || pricing.twentyTwoHoursPrice || 85000, icon: "⏰", enabled: true, isTrending: false }
  ];

  const enabledOptions = pricingOptions.filter((opt: any) => opt.enabled !== false);

  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#1A2E26] to-[#2D4A3E] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD700] rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF8C00] rounded-full filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF6B6B] rounded-full filter blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4"
          >
            <Sparkles size={14} className="text-[#FFD700]" />
            <span className="text-xs tracking-wider text-white/90 uppercase">Exclusive Rates</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4"
          >
            <span className="font-serif italic">Secure Your</span> Booking
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-base md:text-lg max-w-2xl mx-auto"
          >
            {pricing.description || "Secure your booking before the slots are gone!"}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Facilities Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] rounded-full flex items-center justify-center shadow-lg">
                <Sparkles size={24} className="text-[#1A2E26]" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Premium Facilities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {facilities.map((facility: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-all duration-300 group"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FFD700]/20 flex items-center justify-center group-hover:bg-[#FFD700]/40 transition-all">
                    <Check size={12} className="text-[#FFD700] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm">{facility}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pricing Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Pricing Options */}
            <div className="space-y-3">
              {enabledOptions.map((option: any, idx: number) => (
                <motion.div
                  key={option.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                    selectedOption?.id === option.id || selectedOption?.label === option.label
                      ? 'ring-2 ring-[#FFD700] shadow-xl scale-[1.02]'
                      : 'hover:shadow-lg hover:scale-[1.01]'
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{option.icon || (idx === 0 ? "🌙" : idx === 1 ? "⭐" : "⏰")}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800">{option.label}</h3>
                          {option.isTrending && (
                            <span className="text-[10px] bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] px-2 py-0.5 rounded-full font-bold">
                              🔥 Trending
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{option.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#FF8C00]">₨ {formatPrice(option.price)}</div>
                      <div className="text-[10px] text-gray-400">per night</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Book Now Card */}
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-5 text-center mt-4 shadow-lg"
              >
                <div className="mb-3">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Selected Package</div>
                  <div className="text-lg font-bold text-gray-800">{selectedOption.label}</div>
                  <div className="text-2xl font-bold text-[#FF8C00] mt-1">₨ {formatPrice(selectedOption.price)}</div>
                </div>
                
                {/* <a
                  href={`https://wa.me/${(pricing.contact_number || pricing.contactNumber || "923193372277").replace(/[^0-9]/g, '')}?text=Hello%21%20I%20would%20like%20to%20book%20the%20farmhouse%20for%20${encodeURIComponent(selectedOption.label)}%20at%20₨${formatPrice(selectedOption.price)}.%20Please%20confirm%20availability.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all transform hover:scale-[1.02] group"
                >
                  <Phone size={16} className="group-hover:animate-pulse" />
                  Book Now via WhatsApp
                </a> */}
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                    <Phone size={12} className="text-[#FF8C00]" />
                    <span>{pricing.contact_number || pricing.contactNumber || "03193372277"}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">{pricing.website || "www.combinegrp.com"}</div>
                </div>
              </motion.div>
            )}

            {/* Trust Badge */}
            <div className="text-center pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <CheckCircle size={12} className="text-[#FFD700]" />
                <span className="text-[10px] text-white/70">Best Price Guaranteed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}

// Booking Calendar Component - Fixed with proper 22-hour pricing
function BookingCalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<"morning" | "night">("morning");
  const [hours, setHours] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState({ name: "", email: "", phone: "" });
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarPrices, setCalendarPrices] = useState({
    weekdayMorning10: 25000,
    weekdayNight10: 35000,
    weekendMorning10: 35000,
    weekendNight10: 45000,
    twentyTwoHours: 85000
  });

  // Helper function to determine day type
  const getDayType = (date: Date) => {
    const day = date.getDay();
    return (day >= 1 && day <= 4) ? "weekday" : "weekend";
  };

  // Get price for selected slot
  const getPriceForSlot = (date: Date, timeSlot: "morning" | "night", hoursCount: number) => {
    // For 22 hours booking - ALWAYS use twentyTwoHours price
    if (hoursCount === 22) {
      console.log("22 Hours price:", calendarPrices.twentyTwoHours);
      return calendarPrices.twentyTwoHours;
    }
    
    // For 10 hours booking - use day-specific pricing
    const dayType = getDayType(date);
    if (dayType === "weekday") {
      return timeSlot === "morning" ? calendarPrices.weekdayMorning10 : calendarPrices.weekdayNight10;
    } else {
      return timeSlot === "morning" ? calendarPrices.weekendMorning10 : calendarPrices.weekendNight10;
    }
  };

  // Get 22 hours price directly
  const getTwentyTwoHoursPrice = () => {
    return calendarPrices.twentyTwoHours;
  };

  // Get 10 hours price for display
  const getTenHoursPrice = (date: Date, timeSlot: "morning" | "night") => {
    const dayType = getDayType(date);
    if (dayType === "weekday") {
      return timeSlot === "morning" ? calendarPrices.weekdayMorning10 : calendarPrices.weekdayNight10;
    } else {
      return timeSlot === "morning" ? calendarPrices.weekendMorning10 : calendarPrices.weekendNight10;
    }
  };

  // Fetch blocked dates
  useEffect(() => {
    const loadBlockedDates = async () => {
      try {
        const res = await fetch("/api/blocked-dates");
        const data = await res.json();
        console.log("Loaded blocked dates:", data);
        setBlockedDates(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading blocked dates:", error);
        setBlockedDates([]);
      }
    };
    
    loadBlockedDates();
    fetchCalendarPrices();
  }, []);

  // Fetch calendar prices from API
  const fetchCalendarPrices = async () => {
    try {
      const res = await fetch("/api/calendar-prices");
      const data = await res.json();
      console.log("Fetched calendar prices:", data);
      if (data) {
        setCalendarPrices({
          weekdayMorning10: data.weekdayMorning10 || 25000,
          weekdayNight10: data.weekdayNight10 || 35000,
          weekendMorning10: data.weekendMorning10 || 35000,
          weekendNight10: data.weekendNight10 || 45000,
          twentyTwoHours: data.twentyTwoHours || 85000
        });
      }
    } catch (error) {
      console.error("Error fetching calendar prices:", error);
    } finally {
      setCalendarLoading(false);
    }
  };

  // Helper: Format date to YYYY-MM-DD for comparison
  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Check if a specific date and time slot is blocked
  const isSlotBlocked = (dateStr: string, timeSlot: string) => {
    const inputDate = new Date(dateStr);
    const inputDateKey = formatDateKey(inputDate);
    
    return blockedDates.some(b => {
      const blockedDate = new Date(b.booking_date);
      const blockedDateKey = formatDateKey(blockedDate);
      return blockedDateKey === inputDateKey && b.time_slot === timeSlot;
    });
  };

  // Get the status of a date for calendar display
  const getDateStatus = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = formatDateKey(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return "past";
    
    const morningBlocked = isSlotBlocked(dateStr, "morning");
    const nightBlocked = isSlotBlocked(dateStr, "night");
    
    if (morningBlocked && nightBlocked) return "fully-booked";
    if (morningBlocked || nightBlocked) return "partial";
    return "available";
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(i);
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleCheckAvailability = () => {
    if (!selectedDate) {
      setMessage("Please select a date");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    if (isSlotBlocked(selectedDate, selectedTime)) {
      setMessage("This time slot is already booked. Please select another date or time.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    setShowModal(true);
  };

  const handleBooking = async () => {
    if (!bookingData.name || !bookingData.email || !bookingData.phone) {
      setMessage("Please fill all fields");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    setLoading(true);
    const selectedDateObj = new Date(selectedDate);
    const totalPrice = getPriceForSlot(selectedDateObj, selectedTime, hours);
    const timeText = selectedTime === "morning" ? "Morning (8 AM - 6 PM)" : "Night (8 PM - 6 AM)";
    const dayType = getDayType(selectedDateObj);
    const slotLabel = selectedTime === "morning" ? (dayType === "weekday" ? "Weekday Morning" : "Weekend Morning") : (dayType === "weekday" ? "Weekday Night" : "Weekend Night");
    const durationText = hours === 22 ? "22 Hours" : "10 Hours";
    
    const messageText = `Hello! I would like to book the farmhouse.%0A%0A📅 Date: ${selectedDate} (${dayType === "weekday" ? "Weekday" : "Weekend"})%0A⏰ Time: ${timeText} (${slotLabel})%0A🕐 Duration: ${durationText}%0A💰 Total: ₨ ${totalPrice.toLocaleString()}%0A👤 Name: ${bookingData.name}%0A📧 Email: ${bookingData.email}%0A📞 Phone: ${bookingData.phone}%0A%0APlease confirm my booking. Thank you!`;
    const whatsappUrl = `https://wa.me/${bookingData.phone.replace(/[^0-9]/g, '')}?text=${messageText}`;
    
    try {
      await fetch("/api/calendar-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          booking_date: selectedDate,
          time_slot: selectedTime,
          hours: hours,
          amount: totalPrice,
          status: "pending"
        }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
    
    window.open(whatsappUrl, "_blank");
    setLoading(false);
    setShowModal(false);
    setBookingData({ name: "", email: "", phone: "" });
    setMessage("Booking request sent! Check your WhatsApp.");
    setTimeout(() => setMessage(""), 3000);
  };

  // Helper to format display date
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (calendarLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading calendar...</p>
      </div>
    );
  }

  // Get display prices
  const displayPrice10 = selectedDate ? getTenHoursPrice(new Date(selectedDate), selectedTime) : 0;
  const displayPrice22 = getTwentyTwoHoursPrice();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] px-6 py-4">
        <h3 className="text-xl font-semibold text-[#1A2E26] text-center">Select Date & Time</h3>
      </div>

      <div className="p-6">
        {message && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-xl text-center text-sm">
            {message}
          </div>
        )}

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); setSelectedDate(""); }} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h4 className="text-lg font-semibold text-[#1A2E26]">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
          <button onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); setSelectedDate(""); }} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (<div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {getDaysInMonth().map((day, idx) => {
            if (day === null) {
              return <div key={idx} className="aspect-square p-0.5"><div className="w-full h-full"></div></div>;
            }
            
            const status = getDateStatus(day);
            const isSelected = selectedDate === formatDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            
            let bgClass = "";
            let textClass = "";
            let statusLabel = "";
            let dotColor = "";
            
            if (status === "past") {
              bgClass = "bg-gray-100";
              textClass = "text-gray-400";
            } else if (status === "fully-booked") {
              bgClass = "bg-red-100";
              textClass = "text-red-700";
              statusLabel = "Booked";
            } else if (status === "partial") {
              bgClass = "bg-amber-100";
              textClass = "text-amber-700";
              statusLabel = "Limited";
            } else if (status === "available") {
              bgClass = "bg-white hover:bg-[#FFD700]/10 hover:scale-105";
              textClass = "text-gray-700";
              dotColor = "bg-green-500";
            }
            
            if (isSelected) {
              bgClass = "bg-[#FFD700]/30 ring-2 ring-[#FFD700]";
            }
            
            return (
              <div key={idx} className="aspect-square p-0.5">
                <button
                  onClick={() => { 
                    if (status !== 'past') {
                      setSelectedDate(formatDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)));
                    }
                  }}
                  disabled={status === 'past'}
                  className={`w-full h-full rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all ${bgClass} ${textClass}`}
                >
                  <span className="text-base">{day}</span>
                  {dotColor && <div className={`w-1.5 h-1.5 ${dotColor} rounded-full mt-1`}></div>}
                  {statusLabel && <div className="text-[9px] mt-0.5">{statusLabel}</div>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span>Available</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-500 rounded-full"></div><span>Limited Slots</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span>Fully Booked</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-300 rounded-full"></div><span>Past Date</span></div>
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-semibold text-[#1A2E26] mb-3">Select Time Slot for {formatDisplayDate(selectedDate)}</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedTime("morning")}
                disabled={isSlotBlocked(selectedDate, "morning")}
                className={`p-3 rounded-xl border-2 transition-all text-left
                  ${selectedTime === "morning" ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-gray-200'}
                  ${isSlotBlocked(selectedDate, "morning") ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-[#FFD700]'}
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sun size={18} className={selectedTime === "morning" ? 'text-[#FF8C00]' : 'text-gray-500'} />
                  <span className="font-semibold text-sm">Morning</span>
                </div>
                <div className="text-xs text-gray-500">8 AM - 6 PM (10 Hours)</div>
                <div className="text-sm font-semibold text-[#FF8C00] mt-1">
                  ₨ {displayPrice10.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400">
                  {getDayType(new Date(selectedDate)) === "weekday" ? "Weekday" : "Weekend"} Rate
                </div>
                {isSlotBlocked(selectedDate, "morning") && <div className="text-xs text-red-500 mt-1">❌ Booked</div>}
              </button>
              <button
                onClick={() => setSelectedTime("night")}
                disabled={isSlotBlocked(selectedDate, "night")}
                className={`p-3 rounded-xl border-2 transition-all text-left
                  ${selectedTime === "night" ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-gray-200'}
                  ${isSlotBlocked(selectedDate, "night") ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-[#FFD700]'}
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Moon size={18} className={selectedTime === "night" ? 'text-[#FF8C00]' : 'text-gray-500'} />
                  <span className="font-semibold text-sm">Night</span>
                </div>
                <div className="text-xs text-gray-500">8 PM - 6 AM (10 Hours)</div>
                <div className="text-sm font-semibold text-[#FF8C00] mt-1">
                  ₨ {displayPrice10.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400">
                  {getDayType(new Date(selectedDate)) === "weekday" ? "Weekday" : "Weekend"} Rate
                </div>
                {isSlotBlocked(selectedDate, "night") && <div className="text-xs text-red-500 mt-1">❌ Booked</div>}
              </button>
            </div>
          </div>
        )}

        {/* Duration Selection - Only 10 Hours and 22 Hours */}
        {selectedDate && selectedTime && !isSlotBlocked(selectedDate, selectedTime) && (
          <div className="mb-6">
            <label className="text-sm font-semibold text-black mb-3 block">Select Duration</label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setHours(10)}
                className={`px-6 py-3 rounded-full border-2 transition-all text-sm font-semibold flex-1
                  ${hours === 10 ? 'bg-[#1A2E26] text-white border-[#1A2E26] shadow-md' : 'border-gray-300 hover:border-[#FFD700] bg-white'}
                `}
              >
                <div>10 Hours</div>
                <div className="text-xs opacity-80 mt-1">
                  ₨ {displayPrice10.toLocaleString()}
                </div>
              </button>
              <button
                onClick={() => setHours(22)}
                className={`px-6 py-3 rounded-full border-2 transition-all text-sm font-semibold flex-1
                  ${hours === 22 ? 'bg-[#1A2E26] text-white border-[#1A2E26] shadow-md' : 'border-gray-300 hover:border-[#FFD700] bg-white'}
                `}
              >
                <div>22 Hours</div>
                <div className="text-xs opacity-80 mt-1">
                  ₨ {displayPrice22.toLocaleString()}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Check Button */}
        <button
          onClick={handleCheckAvailability}
          disabled={!selectedDate || !selectedTime || isSlotBlocked(selectedDate, selectedTime)}
          className={`w-full py-3 rounded-xl font-semibold transition-all
            ${selectedDate && selectedTime && !isSlotBlocked(selectedDate, selectedTime) 
              ? 'bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] hover:shadow-lg hover:scale-[1.02]' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
          `}
        >
          Check Availability
        </button>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && selectedDate && selectedTime && !isSlotBlocked(selectedDate, selectedTime) && (
          <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#1A2E26]">Complete Your Booking</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                <div className="bg-green-50 p-4 rounded-xl mb-4 border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 mb-2"><Check className="w-5 h-5" /><span className="font-semibold">Available! Complete your booking</span></div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📅 Date: {formatDisplayDate(selectedDate)} ({getDayType(new Date(selectedDate)) === "weekday" ? "Weekday" : "Weekend"})</p>
                    <p>⏰ Time: {selectedTime === "morning" ? "Morning (8 AM - 6 PM)" : "Night (8 PM - 6 AM)"}</p>
                    <p>🕐 Duration: {hours} {hours === 22 ? 'Hours' : 'Hours'}</p>
                    <p>💰 Total: ₨ {getPriceForSlot(new Date(selectedDate), selectedTime, hours).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <input type="text" placeholder="Your Full Name" value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]" required />
                  <input type="email" placeholder="Your Email" value={bookingData.email} onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]" required />
                  <input type="tel" placeholder="Your Phone Number" value={bookingData.phone} onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]" required />
                </div>

                <button onClick={handleBooking} disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                  {loading ? "Processing..." : <><MessageCircle className="w-5 h-5" /> Confirm Booking via WhatsApp</>}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">You'll be redirected to WhatsApp to confirm your booking</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
            <LazyImage 
              src={hero.backgroundImage} 
              alt="Hero" 
              className="hero-image w-full min-h-screen max-h-screen object-cover object-center" 
            />
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
                <button onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })} className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] font-semibold text-sm md:text-base hover:scale-105 transition-all">{hero.buttonText} <ArrowRight className="inline ml-1" size={14} /></button>
                <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="px-4 md:px-6 py-2 md:py-3 rounded-full border-2 border-white/30 text-white font-medium backdrop-blur-sm hover:bg-white/10 transition-all text-sm md:text-base">Pricing</button>
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
                <button className="flex items-center gap-2 text-[#1A2E26] border-b-2 border-[#FFD700] pb-1 hover:gap-3 transition-all text-xs md:text-sm">Discover the Story <ArrowRight size={12} /></button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{experiences.items.map((exp: any, idx: number) => (<div key={idx} ref={el => { if (el) experienceCardsRef.current[idx] = el; }} className="bg-white rounded-xl p-4 md:p-6 text-center shadow-md hover:shadow-xl transition-all hover:-translate-y-1"><div className={`w-10 h-10 md:w-14 md:h-14 mx-auto rounded-full bg-gradient-to-r ${exp.color} flex items-center justify-center mb-3 md:mb-4`}><div className="text-white text-lg md:text-2xl">⭐</div></div><h3 className="text-black md:text-lg font-semibold mb-1 md:mb-2">{exp.title}</h3><p className="text-gray-500 text-xs md:text-sm">{exp.description}</p></div>))}</div>
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

      {/* Gallery Section */}
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
                  onClick={() => { setCurrentImageIndex(idx); setLightboxOpen(true); }}
                >
                  <LazyImage src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-2 md:p-3"><EyeIcon size={16} className="md:w-6 md:h-6 text-white" /></div>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
            <button onClick={() => setLightboxOpen(false)} className="absolute top-3 right-3 md:top-6 md:right-6 text-white hover:text-[#FFD700] transition-colors z-10 bg-black/50 rounded-full p-1.5 md:p-2 hover:bg-black/70"><X size={20} className="md:w-7 md:h-7" /></button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + gallery.images.length) % gallery.images.length); }} className="absolute left-2 md:left-6 text-white hover:text-[#FFD700] transition-colors bg-black/50 rounded-full p-2 md:p-3 hover:bg-black/70"><ChevronDown size={24} className="md:w-8 md:h-8 rotate-90" /></button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % gallery.images.length); }} className="absolute right-2 md:right-6 text-white hover:text-[#FFD700] transition-colors bg-black/50 rounded-full p-2 md:p-3 hover:bg-black/70"><ChevronDown size={24} className="md:w-8 md:h-8 -rotate-90" /></button>
            <div className="absolute top-3 left-3 md:top-6 md:left-6 text-white/70 text-[10px] md:text-sm bg-black/50 px-2 py-0.5 md:px-3 md:py-1 rounded-full">{currentImageIndex + 1} / {gallery.images.length}</div>
            <motion.img key={currentImageIndex} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }} src={gallery.images[currentImageIndex]} alt="Gallery" className="w-[90vw] h-auto max-h-[80vh] md:w-auto md:max-w-[90vw] md:max-h-[90vh] object-contain rounded-lg cursor-pointer" onClick={(e) => e.stopPropagation()} />
            <div className="absolute bottom-2 md:bottom-6 left-0 right-0 flex justify-center gap-1 md:gap-2 overflow-x-auto px-2 md:px-4 py-1 md:py-2">
              {gallery.images.map((img: string, idx: number) => (<button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }} className={`w-10 h-10 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all ${idx === currentImageIndex ? 'ring-2 ring-[#FFD700] scale-110' : 'opacity-60 hover:opacity-100'}`}><img src={img} alt="Thumb" className="w-full h-full object-cover" /></button>))}
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

        {/* Booking Calendar Section */}
        <section id="booking" className="py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-[#FDFBF7] to-[#F5F2ED]">
          <div className="container mx-auto max-w-4xl">
            <BookingCalendarComponent />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-[#FDFBF7] to-[#F5F2ED] overflow-hidden">
          <PricingSectionComponent />
        </section>

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

      {contact.enabled && (
        <section id="contact" className="contact-section py-12 md:py-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 text-black gap-8 md:gap-12">
              <div className="contact-info"><span className="text-[#FF8C00] text-xs md:text-sm tracking-[0.3em] uppercase">{contact.subtitle}</span><h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A2E26] mt-2 mb-3 md:mb-4">{contact.title}</h2><p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">Our concierge team is available 24/7.</p><div className="space-y-2 md:space-y-3"><div className="flex items-center gap-2 md:gap-3"><MapPin size={14} className="md:w-4 md:h-4" /><span className="text-xs md:text-sm">{contact.address}</span></div><div className="flex items-center gap-2 md:gap-3"><Phone size={14} className="md:w-4 md:h-4" /><span className="text-xs md:text-sm">{contact.phone}</span></div><div className="flex items-center gap-2 md:gap-3"><Mail size={14} className="md:w-4 md:h-4" /><span className="text-xs md:text-sm">{contact.email}</span></div></div></div>
              <div className="text-black"><ContactForm /></div>
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
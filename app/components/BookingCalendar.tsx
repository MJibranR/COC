"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronLeft, ChevronRight, Sun, Moon, Phone, MessageCircle } from "lucide-react";

interface PricingOption {
  id: string;
  label: string;
  description: string;
  price: number;
  enabled: boolean;
  icon: string;
}

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<"morning" | "night">("morning");
  const [hours, setHours] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState({ name: "", email: "", phone: "" });
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([]);
  const [contactNumber, setContactNumber] = useState("03193372277");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [calendarLoading, setCalendarLoading] = useState(true);

  useEffect(() => {
    fetchBlockedDates();
    fetchPricing();
  }, []);

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch("/api/blocked-dates");
      const data = await res.json();
      setBlockedDates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
    }
  };

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      console.log("Pricing data:", data);
      
      if (data) {
        setContactNumber(data.contactNumber || data.contact_number || "03193372277");
        
        if (data.pricingOptions && data.pricingOptions.length > 0) {
          setPricingOptions(data.pricingOptions);
        } else {
          // Fallback pricing options
          setPricingOptions([
            { id: "weekday-morning", label: "Weekday Morning", description: "Monday - Thursday", price: 25000, enabled: true, icon: "☀️" },
            { id: "weekend-morning", label: "Weekend Morning", description: "Friday - Sunday", price: 35000, enabled: true, icon: "☀️" },
            { id: "weekday-night", label: "Weekday Night", description: "Monday - Thursday", price: 35000, enabled: true, icon: "🌙" },
            { id: "weekend-night", label: "Weekend Night", description: "Friday - Sunday", price: 45000, enabled: true, icon: "⭐" },
            { id: "22-hours", label: "22 Hours", description: "Any 22-hour slot", price: 85000, enabled: true, icon: "⏰" }
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching pricing:", error);
      // Fallback pricing
      setPricingOptions([
        { id: "weekday-morning", label: "Weekday Morning", description: "Monday - Thursday", price: 25000, enabled: true, icon: "☀️" },
        { id: "weekend-morning", label: "Weekend Morning", description: "Friday - Sunday", price: 35000, enabled: true, icon: "☀️" },
        { id: "weekday-night", label: "Weekday Night", description: "Monday - Thursday", price: 35000, enabled: true, icon: "🌙" },
        { id: "weekend-night", label: "Weekend Night", description: "Friday - Sunday", price: 45000, enabled: true, icon: "⭐" },
        { id: "22-hours", label: "22 Hours", description: "Any 22-hour slot", price: 85000, enabled: true, icon: "⏰" }
      ]);
    } finally {
      setCalendarLoading(false);
    }
  };

  const isSlotBlocked = (dateStr: string, timeSlot: string) => {
    return blockedDates.some(b => {
      const bDate = new Date(b.booking_date).toISOString().split('T')[0];
      return bDate === dateStr && b.time_slot === timeSlot;
    });
  };

  const getDayType = (date: Date) => {
    const day = date.getDay();
    // 1-4 = Monday-Thursday (Weekday), 0,5,6 = Sunday, Friday, Saturday (Weekend)
    return (day >= 1 && day <= 4) ? "weekday" : "weekend";
  };

  const getPriceForSlot = (date: Date, timeSlot: "morning" | "night", hoursCount: number) => {
    const dayType = getDayType(date);
    
    // For 22 hours booking
    if (hoursCount === 22) {
      const option = pricingOptions.find(opt => opt.id === "22-hours" && opt.enabled);
      return option?.price || 85000;
    }
    
    // For morning/night bookings
    const optionKey = `${dayType}-${timeSlot}`;
    const option = pricingOptions.find(opt => opt.id === optionKey && opt.enabled);
    
    let basePrice = 0;
    if (option) {
      basePrice = option.price;
    } else {
      // Fallback prices
      if (dayType === "weekday") {
        basePrice = timeSlot === "morning" ? 25000 : 35000;
      } else {
        basePrice = timeSlot === "morning" ? 35000 : 45000;
      }
    }
    
    // Add extra hours cost if more than 10 hours
    if (hoursCount > 10) {
      const extraHours = hoursCount - 10;
      const extraCost = extraHours * 2000;
      return basePrice + extraCost;
    }
    
    return basePrice;
  };

  const getTimeSlotPrice = (date: Date, timeSlot: "morning" | "night") => {
    const dayType = getDayType(date);
    const optionKey = `${dayType}-${timeSlot}`;
    const option = pricingOptions.find(opt => opt.id === optionKey && opt.enabled);
    
    if (option) {
      return option.price;
    }
    
    // Fallback
    if (dayType === "weekday") {
      return timeSlot === "morning" ? 25000 : 35000;
    } else {
      return timeSlot === "morning" ? 35000 : 45000;
    }
  };

  const getTimeSlotLabel = (date: Date, timeSlot: "morning" | "night") => {
    const dayType = getDayType(date);
    if (dayType === "weekday") {
      return timeSlot === "morning" ? "Weekday Morning" : "Weekday Night";
    } else {
      return timeSlot === "morning" ? "Weekend Morning" : "Weekend Night";
    }
  };

  const getDateStatus = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
    const dayType = getDayType(selectedDateObj);
    const timeText = selectedTime === "morning" ? "Morning (10 AM - 10 PM)" : "Night (10 PM - 10 AM)";
    const slotLabel = getTimeSlotLabel(selectedDateObj, selectedTime);
    const totalPrice = getPriceForSlot(selectedDateObj, selectedTime, hours);
    
    const messageText = `Hello! I would like to book the farmhouse.%0A%0A📅 Date: ${selectedDate} (${dayType === "weekday" ? "Weekday" : "Weekend"})%0A⏰ Time: ${timeText} (${slotLabel})%0A🕐 Duration: ${hours} hours%0A💰 Total: ₨ ${totalPrice.toLocaleString()}%0A👤 Name: ${bookingData.name}%0A📧 Email: ${bookingData.email}%0A📞 Phone: ${bookingData.phone}%0A%0APlease confirm my booking. Thank you!`;
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

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (calendarLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] px-6 py-4">
        <h3 className="text-xl font-semibold text-[#1A2E26] text-center">Check Availability</h3>
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
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            
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
                      setSelectedDate(dateStr);
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
            <h4 className="text-sm font-semibold text-[#1A2E26] mb-3">
              Select Time Slot for {formatDisplayDate(selectedDate)}
              <span className="text-xs text-gray-500 ml-2">
                ({getDayType(new Date(selectedDate)) === "weekday" ? "Weekday" : "Weekend"})
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {/* Morning Slot */}
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
                <div className="text-xs text-gray-500">10 AM - 10 PM</div>
                <div className="text-sm font-semibold text-[#FF8C00] mt-1">
                  ₨ {getTimeSlotPrice(new Date(selectedDate), "morning").toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400">{getTimeSlotLabel(new Date(selectedDate), "morning")}</div>
                {isSlotBlocked(selectedDate, "morning") && <div className="text-xs text-red-500 mt-1">❌ Booked</div>}
              </button>

              {/* Night Slot */}
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
                <div className="text-xs text-gray-500">10 PM - 10 AM</div>
                <div className="text-sm font-semibold text-[#FF8C00] mt-1">
                  ₨ {getTimeSlotPrice(new Date(selectedDate), "night").toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400">{getTimeSlotLabel(new Date(selectedDate), "night")}</div>
                {isSlotBlocked(selectedDate, "night") && <div className="text-xs text-red-500 mt-1">❌ Booked</div>}
              </button>
            </div>
          </div>
        )}

        {/* Duration Selection */}
        {selectedDate && selectedTime && !isSlotBlocked(selectedDate, selectedTime) && (
          <div className="mb-6">
            <label className="text-sm font-semibold text-[#1A2E26] mb-3 block">Duration (Hours)</label>
            <div className="flex flex-wrap gap-2">
              {[10, 12, 14, 16, 18, 20, 22, 24].map(h => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`px-4 py-2 rounded-full border transition-all text-sm
                    ${hours === h ? 'bg-[#1A2E26] text-white border-[#1A2E26]' : 'border-gray-300 hover:border-[#FFD700]'}
                  `}
                >
                  {h} {h === 24 ? 'Hrs' : 'Hrs'}
                </button>
              ))}
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
                    <p>⏰ Time: {selectedTime === "morning" ? "Morning (10 AM - 10 PM)" : "Night (10 PM - 10 AM)"}</p>
                    <p>🕐 Duration: {hours} hours</p>
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
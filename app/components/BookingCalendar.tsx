"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, MessageCircle, X, Check, AlertCircle, ChevronDown } from "lucide-react";

interface BookingSlot {
  date: string;
  timeSlot: "morning" | "night";
  available: boolean;
  bookedBy?: string;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: "morning" | "night";
  hours: number;
  status: "pending" | "confirmed" | "cancelled";
}

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<"morning" | "night">("morning");
  const [hours, setHours] = useState(10);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [availability, setAvailability] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Mock bookings data - In production, fetch from API
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 1, name: "John Doe", email: "john@email.com", phone: "+1234567890", date: "2024-12-25", timeSlot: "morning", hours: 10, status: "confirmed" },
    { id: 2, name: "Jane Smith", email: "jane@email.com", phone: "+1234567890", date: "2024-12-31", timeSlot: "night", hours: 22, status: "confirmed" },
  ]);

  useEffect(() => {
    generateAvailability();
  }, [currentDate]);

  const generateAvailability = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const slots: BookingSlot[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Check if date is already booked
      const morningBooked = bookings.some(b => b.date === date && b.timeSlot === "morning" && b.status === "confirmed");
      const nightBooked = bookings.some(b => b.date === date && b.timeSlot === "night" && b.status === "confirmed");
      
      slots.push({
        date,
        timeSlot: "morning",
        available: !morningBooked && new Date(date) >= new Date(),
      });
      slots.push({
        date,
        timeSlot: "night",
        available: !nightBooked && new Date(date) >= new Date(),
      });
    }
    
    setAvailability(slots);
  };

  const checkAvailability = () => {
    if (!selectedDate) {
      setMessage("Please select a date first");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    const morningSlot = availability.find(s => s.date === selectedDate && s.timeSlot === "morning");
    const nightSlot = availability.find(s => s.date === selectedDate && s.timeSlot === "night");
    
    setSelectedSlot({
      date: selectedDate,
      timeSlot: selectedTime,
      available: selectedTime === "morning" ? (morningSlot?.available || false) : (nightSlot?.available || false)
    });
    
    setShowBookingModal(true);
  };

const handleBooking = async () => {
  if (!bookingData.name || !bookingData.email || !bookingData.phone) {
    setMessage("Please fill all fields");
    setTimeout(() => setMessage(""), 3000);
    return;
  }
  
  setLoading(true);
  
  // Check if still available via API
  try {
    const checkRes = await fetch("/api/calendar-bookings/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_date: selectedDate,
        time_slot: selectedTime
      }),
    });
    
    const checkData = await checkRes.json();
    if (!checkData.available) {
      setMessage("Sorry, this slot is no longer available!");
      setTimeout(() => setMessage(""), 3000);
      setLoading(false);
      return;
    }
    
    // Save booking
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
        status: "pending"
      }),
    });
    
    // WhatsApp message
    const timeText = selectedTime === "morning" ? "Morning (10 AM - 10 PM)" : "Night (10 PM - 10 AM)";
    const messageText = `Hello! I would like to book the farmhouse.%0A%0A📅 Date: ${selectedDate}%0A⏰ Time: ${timeText}%0A🕐 Duration: ${hours} hours%0A👤 Name: ${bookingData.name}%0A📧 Email: ${bookingData.email}%0A📞 Phone: ${bookingData.phone}%0A%0APlease confirm my booking. Thank you!`;
    
    const whatsappUrl = `https://wa.me/923333333333?text=${messageText}`;
    window.open(whatsappUrl, "_blank");
    
    setLoading(false);
    setShowBookingModal(false);
    setBookingData({ name: "", email: "", phone: "" });
    setMessage("Booking request sent! Check your WhatsApp.");
    setTimeout(() => setMessage(""), 3000);
    
    // Refresh availability
    generateAvailability();
    
  } catch (error) {
    console.error("Error:", error);
    setMessage("Booking failed. Please try again.");
    setTimeout(() => setMessage(""), 3000);
    setLoading(false);
  }
};

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  const isDateAvailable = (day: number) => {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const morningAvailable = availability.find(s => s.date === date && s.timeSlot === "morning")?.available;
    const nightAvailable = availability.find(s => s.date === date && s.timeSlot === "night")?.available;
    return morningAvailable || nightAvailable;
  };

  const isDateFullyBooked = (day: number) => {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const morningAvailable = availability.find(s => s.date === date && s.timeSlot === "morning")?.available;
    const nightAvailable = availability.find(s => s.date === date && s.timeSlot === "night")?.available;
    return !morningAvailable && !nightAvailable;
  };

  const isPastDate = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-light text-[#1A2E26]">Check Availability</h3>
        <p className="text-gray-500 text-sm mt-2">Select your preferred date and time slot</p>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center text-sm"
        >
          {message}
        </motion.div>
      )}

      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronDown className="w-5 h-5 rotate-90" />
        </button>
        <h4 className="text-lg md:text-xl font-semibold text-[#1A2E26]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronDown className="w-5 h-5 -rotate-90" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs md:text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {getDaysInMonth().map((day, idx) => (
          <div key={idx} className="aspect-square p-1">
            {day && (
              <button
                onClick={() => {
                  if (!isPastDate(day)) {
                    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    setSelectedDate(date);
                  }
                }}
                disabled={isPastDate(day)}
                className={`
                  w-full h-full rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all
                  ${isPastDate(day) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                  ${selectedDate === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ? 'ring-2 ring-[#FFD700] bg-[#FFD700]/10' : ''}
                  ${!isPastDate(day) && isDateFullyBooked(day) ? 'bg-red-50 text-red-500 cursor-not-allowed' : ''}
                  ${!isPastDate(day) && !isDateFullyBooked(day) && isDateAvailable(day) ? 'hover:bg-[#FFD700]/20 hover:scale-105' : ''}
                `}
              >
                <span className="text-base md:text-lg">{day}</span>
                {!isPastDate(day) && isDateAvailable(day) && !isDateFullyBooked(day) && (
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1"></div>
                )}
                {!isPastDate(day) && isDateFullyBooked(day) && (
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1"></div>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Time Slot Selection */}
      {selectedDate && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-semibold text-[#1A2E26] mb-3">Select Time Slot</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "morning", label: "Morning (10 AM - 10 PM)", icon: "☀️", price: "₨ 25,000" },
              { value: "night", label: "Night (10 PM - 10 AM)", icon: "🌙", price: "₨ 35,000" }
            ].map((slot) => {
              const slotAvailable = availability.find(s => s.date === selectedDate && s.timeSlot === slot.value as any)?.available;
              return (
                <button
                  key={slot.value}
                  onClick={() => setSelectedTime(slot.value as any)}
                  disabled={!slotAvailable}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-left
                    ${selectedTime === slot.value ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-gray-200'}
                    ${!slotAvailable ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-[#FFD700] cursor-pointer'}
                  `}
                >
                  <div className="text-2xl mb-1">{slot.icon}</div>
                  <div className="font-semibold text-sm text-[#1A2E26]">{slot.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{slot.price}</div>
                  {!slotAvailable && <div className="text-xs text-red-500 mt-1">Booked</div>}
                  {slotAvailable && <div className="text-xs text-green-500 mt-1">Available</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Duration Selection */}
      {selectedDate && (
        <div className="mb-6">
          <label className="text-sm font-semibold text-[#1A2E26] mb-2 block">Duration (Hours)</label>
          <div className="flex gap-3 flex-wrap">
            {[10, 12, 14, 16, 18, 20, 22, 24].map(h => (
              <button
                key={h}
                onClick={() => setHours(h)}
                className={`
                  px-4 py-2 rounded-full border transition-all
                  ${hours === h ? 'bg-[#1A2E26] text-white border-[#1A2E26]' : 'border-gray-300 hover:border-[#FFD700]'}
                `}
              >
                {h} {h === 24 ? 'Hours (Full Day)' : 'Hours'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Check Availability Button */}
      <button
        onClick={checkAvailability}
        disabled={!selectedDate}
        className={`
          w-full py-3 rounded-full font-semibold transition-all
          ${selectedDate 
            ? 'bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#1A2E26] hover:shadow-lg hover:scale-105' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
        `}
      >
        Check Availability
      </button>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#1A2E26]">
                    {selectedSlot.available ? "Book Your Stay" : "Not Available"}
                  </h3>
                  <button onClick={() => setShowBookingModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedSlot.available ? (
                  <>
                    <div className="bg-green-50 p-4 rounded-xl mb-4">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <Check className="w-5 h-5" />
                        <span className="font-semibold">Available!</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        📅 Date: {selectedSlot.date}<br />
                        ⏰ Time: {selectedSlot.timeSlot === "morning" ? "Morning (10 AM - 10 PM)" : "Night (10 PM - 10 AM)"}<br />
                        🕐 Duration: {hours} hours<br />
                        💰 Total: ₨ {hours === 24 ? (selectedSlot.timeSlot === "morning" ? "55,000" : "65,000") : (selectedSlot.timeSlot === "morning" ? "25,000" : "35,000")}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Your Phone Number"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF8C00]"
                        required
                      />
                    </div>

                    <button
                      onClick={handleBooking}
                      disabled={loading}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      {loading ? (
                        "Processing..."
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5" />
                          Book Now via WhatsApp
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      You will be redirected to WhatsApp to confirm your booking
                    </p>
                  </>
                ) : (
                  <div className="bg-red-50 p-4 rounded-xl mb-4">
                    <div className="flex items-center gap-2 text-red-700 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">Not Available</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      This time slot is already booked. Please select another date or time slot.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
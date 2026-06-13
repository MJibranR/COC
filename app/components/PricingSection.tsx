"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Sparkles, CheckCircle } from "lucide-react";

interface PricingOption {
  id: string;
  name: string;
  label: string;
  description: string;
  price: number;
  isTrending: boolean;
  enabled: boolean;
  icon: string;
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

export default function PricingSection() {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [selectedOption, setSelectedOption] = useState<PricingOption | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      console.log("Fetched pricing data:", data);
      
      if (data && Object.keys(data).length > 0) {
        setPricing(data);
        
        // Find trending option or first enabled option
        const trending = data.pricingOptions?.find((opt: PricingOption) => opt.isTrending === true && opt.enabled === true);
        const firstEnabled = data.pricingOptions?.find((opt: PricingOption) => opt.enabled === true);
        setSelectedOption(trending || firstEnabled || null);
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
      <section className="py-20 px-4 bg-gradient-to-br from-[#1A2E26] to-[#2D4A3E]">
        <div className="container mx-auto max-w-6xl flex justify-center">
          <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (!pricing || !pricing.enabled) return null;

  // Filter only enabled pricing options
  const enabledOptions = pricing.pricingOptions?.filter(opt => opt.enabled === true) || [];
  
  console.log("Enabled options to display:", enabledOptions);

  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#1A2E26] to-[#2D4A3E] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD700] rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF8C00] rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header - Dynamic Title and Description */}
        <div className="text-center mb-12">
          <span className="text-[#FFD700] text-sm tracking-[0.3em] uppercase">Pricing</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mt-2 mb-4">
            <span className="font-serif italic">{pricing.title?.split(' ')[0] || "Secure"}</span> {pricing.title?.split(' ').slice(1).join(' ') || "Your Booking"}
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{pricing.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Facilities Column - Dynamic Facilities */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] rounded-full flex items-center justify-center">
                <Sparkles size={24} className="text-[#1A2E26]" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Facilities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pricing.facilities?.map((facility, index) => (
                <div key={index} className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                  <CheckCircle size={16} className="text-[#FFD700] group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Options Column - Dynamic from API */}
          <div className="space-y-4">
            {enabledOptions.map((option) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all cursor-pointer hover:shadow-xl ${
                  selectedOption?.id === option.id ? 'ring-2 ring-[#FFD700]' : ''
                }`}
                onClick={() => setSelectedOption(option)}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{option.icon || "🏷️"}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#1A2E26]">{option.label}</h3>
                        {option.isTrending && (
                          <span className="text-xs bg-[#FFD700] text-[#1A2E26] px-2 py-0.5 rounded-full">Trending</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#FF8C00]">₨ {formatPrice(option.price)}</div>
                    <div className="text-[10px] text-gray-400">+ Taxes</div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Book Now Button - Dynamic Contact Info */}
            {selectedOption && (
              <div className="bg-white rounded-2xl p-6 text-center mt-4">
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Selected Package</div>
                  <div className="text-xl font-bold text-[#1A2E26]">{selectedOption.label}</div>
                  <div className="text-3xl font-bold text-[#FF8C00] mt-1">₨ {formatPrice(selectedOption.price)}</div>
                </div>
                <a
                  href={`https://wa.me/${(pricing.contactNumber || "03193372277").replace(/[^0-9]/g, '')}?text=Hello%21%20I%20would%20like%20to%20book%20the%20farmhouse%20for%20${encodeURIComponent(selectedOption.label)}%20at%20₨${formatPrice(selectedOption.price)}.%20Please%20confirm%20availability.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all transform hover:scale-[1.02]"
                >
                  <Phone size={18} />
                  Book Now via WhatsApp
                </a>
                <div className="mt-3">
                  <div className="flex items-center justify-center gap-3 text-gray-500 text-sm">
                    <Phone size={14} className="text-[#FF8C00]" />
                    <span>{pricing.contactNumber || "03193372277"}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{pricing.website || "www.combinegrp.com"}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
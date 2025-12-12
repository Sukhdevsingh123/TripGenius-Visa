import React from 'react';
import {
  Plane,
  Calendar,
  Wallet,
  MapPin,
  Users,
  Heart,
  Loader2,
  Sparkles,
  Compass // Added for Travel Style
} from "lucide-react";

// ✅ FIXED: Component defined OUTSIDE to prevent re-render focus loss
const ModernInput = ({
  label,
  icon: Icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  min,
  ...props
}) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-2">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300">
        <Icon size={18} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        className="w-full bg-slate-950/50 text-slate-100 border border-slate-800 rounded-xl py-3.5 pl-10 pr-4 
                   focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 
                   placeholder:text-slate-600 transition-all duration-300 hover:border-slate-700"
        placeholder={placeholder}
        {...props}
      />
      {/* Subtle glow effect on focus */}
      <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
    </div>
  </div>
);

// ✅ Reusable Select Component to match the design
const ModernSelect = ({ label, icon: Icon, name, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-2">
      {label}
    </label>
    <div className="relative group/select">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/select:text-blue-400 transition-colors">
        <Icon size={18} />
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-950/50 text-slate-100 border border-slate-800 rounded-xl py-3.5 pl-10 pr-4 
                   focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 
                   appearance-none transition-all duration-300 cursor-pointer hover:border-slate-700"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
          <path d="M1 1L5 5L9 1" />
        </svg>
      </div>
    </div>
  </div>
);

export default function TravelForm({
  formData,
  setFormData,
  onSubmit,
  loading,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full h-auto flex flex-col">
      {/* Card Container */}
      <div className="bg-gradient-to-br from-[#0B1120]/95 to-[#0F1629]/95 backdrop-blur-2xl border border-slate-700/50 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-blue-500/30">
        
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none group-hover:bg-blue-600/15 transition-all duration-300" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Header Section */}
        <div className="mb-10 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20 transition-all duration-300">
              <Plane className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent tracking-tight">
                AI Travel Agent
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2" />
            </div>
          </div>
          <p className="text-slate-400 text-base leading-relaxed ml-0">
            

[Image of travel map]

            ✨ Design your dream journey with AI precision. Tell us where you
            want to go and let our agents create your perfect itinerary.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={onSubmit} className="space-y-6 flex-1 relative z-10">
          
          {/* Row 1: Locations */}
          <div className="grid grid-cols-1 gap-5">
            <ModernInput
              label="Origin City"
              name="origin"
              icon={MapPin}
              placeholder="e.g. Mumbai, India"
              value={formData.origin}
              onChange={handleChange}
              required
            />
            <ModernInput
              label="Destination"
              name="destinations"
              icon={Sparkles}
              placeholder="e.g. Vrindavan, Kyoto, Paris"
              value={formData.destinations}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 2: Dates */}
          <div className="grid grid-cols-2 gap-4">
            <ModernInput
              label="Start Date"
              name="start_date"
              type="date"
              icon={Calendar}
              value={formData.start_date}
              onChange={handleChange}
              required
            />
            <ModernInput
              label="End Date"
              name="end_date"
              type="date"
              icon={Calendar}
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 3: Travelers & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <ModernInput
              label="Travelers"
              name="group_size"
              type="number"
              icon={Users}
              min="1"
              value={formData.group_size}
              onChange={handleChange}
              required
            />

            <ModernSelect 
                label="Budget"
                name="budget_range"
                icon={Wallet}
                value={formData.budget_range}
                onChange={handleChange}
                options={[
                    { value: "budget", label: "💰 Budget" },
                    { value: "mid-range", label: "⚖️ Mid-Range" },
                    { value: "luxury", label: "💎 Luxury" },
                ]}
            />
          </div>

          {/* Row 4: Travel Style & Interests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModernSelect 
                label="Travel Style"
                name="travel_style"
                icon={Compass}
                value={formData.travel_style}
                onChange={handleChange}
                options={[
                    { value: "cultural", label: "🏛️ Cultural" },
                    { value: "relaxed", label: "🧘 Relaxed" },
                    { value: "adventure", label: "⛰️ Adventure" },
                    { value: "romantic", label: "💖 Romantic" },
                    { value: "business", label: "💼 Business" },
                ]}
            />
            <ModernInput
                label="Interests"
                name="interests"
                icon={Heart}
                placeholder="Photography, Food..."
                value={formData.interests}
                onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-base tracking-wide shadow-xl transition-all duration-300 relative overflow-hidden group/btn
                ${
                  loading
                    ? "bg-slate-800/50 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] hover:from-blue-500 hover:to-cyan-400"
                }
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Orchestrating Trip...</span>
                  </>
                ) : (
                  <>
                    <span>Launch AI Agent</span>
                    <Plane className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>

              {/* Shine Effect */}
              {!loading && (
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
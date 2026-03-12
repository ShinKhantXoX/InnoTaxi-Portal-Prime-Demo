import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  User,
  Building2,
  ChevronDown,
  Waves,
} from "lucide-react";
import { toast } from "sonner";
import { PhoneInput } from "./PhoneInput";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const INQUIRY_TYPES = [
  "General Inquiry",
  "Product Information",
  "Wholesale / Bulk Order",
  "Shipping & Delivery",
  "Return & Refund",
  "Partnership / Collaboration",
  "Feedback / Suggestion",
  "Other",
];

export function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email address";
    if (!form.inquiryType) newErrors.inquiryType = "Please select an inquiry type";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    else if (form.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55db73c3/inquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Server error submitting inquiry:", data);
        throw new Error(data.error || "Failed to submit inquiry");
      }
      setSending(false);
      setSubmitted(true);
      toast.success("Your inquiry has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setSending(false);
      toast.error("Failed to submit inquiry. Please try again.");
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      inquiryType: "",
      subject: "",
      message: "",
    });
    setErrors({});
    setSubmitted(false);
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border ${
      errors[field] ? "border-red-300 bg-red-50/30" : "border-gray-200"
    } focus:border-[#0369a1] focus:ring-2 focus:ring-[#0369a1]/10 outline-none transition-all bg-white`;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0284c7] text-white py-16 overflow-hidden">
        {/* Ocean decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 left-[10%] opacity-10">
            <Waves size={120} />
          </div>
          <div className="absolute bottom-4 right-[15%] opacity-10 rotate-12">
            <Waves size={80} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6" style={{ fontSize: "0.85rem" }}>
            <Link to="/" className="text-white/70 hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white">Contact Us</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-white mb-3" style={{ fontSize: "2.2rem" }}>
              Get In Touch
            </h1>
            <p className="text-white/70 max-w-xl" style={{ fontSize: "1rem" }}>
              Have a question about our fresh seafood or need help with an order? We'd love to hear from you.
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Contact Cards */}
            {[
              {
                icon: <MapPin size={20} />,
                title: "Visit Us",
                lines: ["123 Ocean Drive, Suite 100", "Yangon, Myanmar"],
              },
              {
                icon: <Phone size={20} />,
                title: "Call Us",
                lines: ["+95 9 123 456 789", "+95 1 234 567"],
              },
              {
                icon: <Mail size={20} />,
                title: "Email Us",
                lines: ["info@gloryone.com", "support@gloryone.com"],
              },
              {
                icon: <Clock size={20} />,
                title: "Business Hours",
                lines: ["Mon – Fri: 8:00 AM – 6:00 PM", "Sat: 9:00 AM – 3:00 PM", "Sun: Closed"],
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="bg-white border border-blue-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0369a1] shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-[#0c4a6e] mb-1" style={{ fontSize: "0.95rem" }}>
                      {card.title}
                    </h3>
                    {card.lines.map((line, j) => (
                      <p key={j} className="text-gray-500" style={{ fontSize: "0.85rem" }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-100 text-center"
            >
              <MapPin size={32} className="text-[#0369a1]/40 mx-auto mb-3" />
              <p className="text-[#0c4a6e]" style={{ fontSize: "0.9rem" }}>
                Find us on the map
              </p>
              <p className="text-gray-400 mt-1" style={{ fontSize: "0.78rem" }}>
                123 Ocean Drive, Yangon
              </p>
              <div className="mt-4 w-full h-32 rounded-xl bg-[#0369a1]/10 flex items-center justify-center">
                <span className="text-[#0369a1]/40" style={{ fontSize: "0.8rem" }}>
                  🗺️ Map View
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                /* Success State */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-blue-50 rounded-2xl p-10 shadow-sm text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <CheckCircle size={40} className="text-green-600" />
                  </motion.div>
                  <h2 className="text-[#0c4a6e] mb-3" style={{ fontSize: "1.5rem" }}>
                    Thank You!
                  </h2>
                  <p className="text-gray-500 mb-2 max-w-md mx-auto" style={{ fontSize: "0.95rem" }}>
                    Your inquiry has been submitted successfully.
                  </p>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto" style={{ fontSize: "0.85rem" }}>
                    Our team will review your message and get back to you within 24 hours.
                    Check your email at <span className="text-[#0369a1]">{form.email}</span> for our response.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleReset}
                      className="bg-[#0369a1] text-white px-8 py-3 rounded-xl hover:bg-[#0c4a6e] transition-colors cursor-pointer flex items-center gap-2"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <MessageSquare size={18} />
                      Send Another Inquiry
                    </button>
                    <Link
                      to="/"
                      className="border border-[#0369a1] text-[#0369a1] px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              ) : (
                /* Form */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-white border border-blue-50 rounded-2xl p-6 sm:p-8 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <MessageSquare size={20} className="text-[#0369a1]" />
                    </div>
                    <div>
                      <h2 className="text-[#0c4a6e]" style={{ fontSize: "1.25rem" }}>
                        Inquiry Form
                      </h2>
                      <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>
                        Fields marked with * are required
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                          <User size={13} className="inline mr-1 mb-0.5" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputClass("name")}
                          style={{ fontSize: "0.9rem" }}
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                          <Mail size={13} className="inline mr-1 mb-0.5" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={inputClass("email")}
                          style={{ fontSize: "0.9rem" }}
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                          <Phone size={13} className="inline mr-1 mb-0.5" />
                          Phone Number
                        </label>
                        <PhoneInput
                          value={form.phone}
                          onChange={(val) => setForm({ ...form, phone: val })}
                          className={inputClass("phone")}
                          style={{ fontSize: "0.9rem" }}
                          placeholder="+95 9 xxx xxx xxx"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                          <Building2 size={13} className="inline mr-1 mb-0.5" />
                          Company (Optional)
                        </label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className={inputClass("company")}
                          style={{ fontSize: "0.9rem" }}
                          placeholder="Your company name"
                        />
                      </div>
                    </div>

                    {/* Inquiry Type Dropdown */}
                    <div>
                      <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                        Inquiry Type *
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.inquiryType ? "border-red-300 bg-red-50/30" : "border-gray-200"
                          } focus:border-[#0369a1] focus:ring-2 focus:ring-[#0369a1]/10 outline-none transition-all bg-white text-left flex items-center justify-between cursor-pointer`}
                          style={{ fontSize: "0.9rem" }}
                        >
                          <span className={form.inquiryType ? "text-gray-800" : "text-gray-400"}>
                            {form.inquiryType || "Select inquiry type"}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence>
                          {dropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 max-h-60 overflow-y-auto"
                            >
                              {INQUIRY_TYPES.map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => {
                                    setForm({ ...form, inquiryType: type });
                                    setDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors cursor-pointer ${
                                    form.inquiryType === type
                                      ? "text-[#0369a1] bg-blue-50/50"
                                      : "text-gray-700"
                                  }`}
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  {type}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {errors.inquiryType && (
                        <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>
                          {errors.inquiryType}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className={inputClass("subject")}
                        style={{ fontSize: "0.9rem" }}
                        placeholder="Brief subject of your inquiry"
                      />
                      {errors.subject && (
                        <p className="text-red-500 mt-1" style={{ fontSize: "0.75rem" }}>
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                        Message *
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={5}
                        className={`${inputClass("message")} resize-none`}
                        style={{ fontSize: "0.9rem" }}
                        placeholder="Tell us more about your inquiry..."
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.message ? (
                          <p className="text-red-500" style={{ fontSize: "0.75rem" }}>
                            {errors.message}
                          </p>
                        ) : (
                          <span />
                        )}
                        <span className="text-gray-300" style={{ fontSize: "0.72rem" }}>
                          {form.message.length} characters
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-gray-300 hidden sm:block" style={{ fontSize: "0.75rem" }}>
                        We typically respond within 24 hours
                      </p>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={sending}
                        className={`px-8 py-3.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
                          sending
                            ? "bg-amber-500 text-white"
                            : "bg-[#0369a1] text-white hover:bg-[#0c4a6e]"
                        }`}
                        style={{ fontSize: "0.95rem" }}
                      >
                        {sending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                              <Send size={18} />
                            </motion.div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Submit Inquiry
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
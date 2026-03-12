import { useParams, Link, useNavigate } from "react-router";
import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Share2,
  Users,
  CheckCircle,
  Star,
  ChevronRight,
  Mail,
  Phone,
  Ticket,
  ExternalLink,
  Copy,
  Waves,
} from "lucide-react";
import { motion } from "motion/react";
import { EVENTS } from "./EventsExpoPage";

const TYPE_COLORS: Record<string, string> = {
  expo: "bg-blue-100 text-blue-700",
  festival: "bg-orange-100 text-orange-700",
  workshop: "bg-green-100 text-green-700",
  tasting: "bg-purple-100 text-purple-700",
};

// Extended event details (mock data for detail page)
const EVENT_DETAILS: Record<
  string,
  {
    fullDescription: string;
    highlights: string[];
    schedule: { time: string; activity: string }[];
    capacity: string;
    price: string;
    organizer: string;
    contactEmail: string;
    contactPhone: string;
  }
> = {
  "evt-1": {
    fullDescription:
      "Glory One Seafood Expo 2026 is our flagship annual event, bringing together the finest seafood suppliers, chefs, and enthusiasts from across the globe. Over three exciting days, you'll discover premium seafood selections, watch live cooking demonstrations by renowned chefs, attend expert-led seminars on seafood preparation and sustainability, and enjoy exclusive expo-only pricing on our entire product range.\n\nWhether you're a restaurant owner looking for premium suppliers, a home cook eager to learn new techniques, or simply a seafood lover, this expo has something special for everyone. Don't miss the grand tasting hall featuring over 50 varieties of fresh and prepared seafood.",
    highlights: [
      "50+ seafood varieties available for tasting",
      "Live cooking demonstrations by celebrity chefs",
      "Exclusive expo-only deals — up to 40% off",
      "Sustainability panel with marine biologists",
      "Kids' discovery zone with ocean education",
      "VIP early access passes available",
    ],
    schedule: [
      { time: "9:00 AM", activity: "Doors Open & Welcome" },
      { time: "10:00 AM", activity: "Opening Ceremony & Keynote" },
      { time: "11:00 AM", activity: "Live Cooking Demo: Chef Sarah Lin" },
      { time: "12:30 PM", activity: "Grand Tasting Hall Opens" },
      { time: "2:00 PM", activity: "Sustainability Panel Discussion" },
      { time: "3:30 PM", activity: "Seafood Preparation Workshop" },
      { time: "5:00 PM", activity: "Exclusive Deals Hour" },
      { time: "6:00 PM", activity: "Closing & Raffle Draw" },
    ],
    capacity: "5,000 attendees",
    price: "Free Entry (VIP: $49)",
    organizer: "Glory One Seafood Pty Ltd",
    contactEmail: "events@gloryone.com.au",
    contactPhone: "+61 2 9876 5432",
  },
  "evt-2": {
    fullDescription:
      "The Fresh Catch Festival is Melbourne's premier seafood celebration, set against the stunning backdrop of South Wharf Promenade. This two-day waterfront festival brings together the best of Australia's seafood industry with vibrant entertainment, gourmet dining experiences, and family-friendly fun.\n\nExplore artisan stalls featuring freshly prepared seafood dishes from Melbourne's top restaurants, enjoy live music performances throughout the day, and let the kids discover marine life at the interactive Ocean Discovery Zone. The festival also features a 'Cook-Off Challenge' where amateur chefs compete using Glory One's premium ingredients.",
    highlights: [
      "Waterfront dining with stunning harbour views",
      "Live music & entertainment all day",
      "Amateur cook-off competition with prizes",
      "Ocean Discovery Zone for kids",
      "20+ gourmet food stalls",
      "Free face painting & activities for children",
    ],
    schedule: [
      { time: "10:00 AM", activity: "Festival Gates Open" },
      { time: "11:00 AM", activity: "Live Band: The Salty Dogs" },
      { time: "12:00 PM", activity: "Cook-Off Challenge Round 1" },
      { time: "1:30 PM", activity: "Kids' Ocean Discovery Show" },
      { time: "3:00 PM", activity: "Cook-Off Challenge Finals" },
      { time: "5:00 PM", activity: "Sunset Acoustic Session" },
      { time: "7:00 PM", activity: "Awards Ceremony" },
      { time: "8:00 PM", activity: "Festival Closing" },
    ],
    capacity: "10,000 attendees",
    price: "Adults $15 | Kids Free",
    organizer: "Glory One Seafood & Melbourne Events Co.",
    contactEmail: "festival@gloryone.com.au",
    contactPhone: "+61 3 8765 4321",
  },
  "evt-3": {
    fullDescription:
      "Join award-winning Chef Kenji Takahashi for an immersive 3-hour masterclass in the art of sushi and sashimi. This hands-on workshop takes place in our purpose-built Glory One Test Kitchen and covers everything from selecting the freshest fish to mastering knife techniques, rice preparation, and beautiful plating.\n\nAll ingredients are provided — including premium sashimi-grade tuna, salmon, and kingfish sourced directly from our suppliers. You'll leave with new skills, a full belly, and a beautifully illustrated recipe booklet to recreate the dishes at home. Spaces are strictly limited to ensure personal attention from Chef Kenji.",
    highlights: [
      "Hands-on practice with premium ingredients",
      "Expert instruction from Chef Kenji Takahashi",
      "Take-home recipe booklet included",
      "All tools and ingredients provided",
      "Complimentary sake tasting",
      "Certificate of completion",
    ],
    schedule: [
      { time: "2:00 PM", activity: "Welcome & Introduction" },
      { time: "2:15 PM", activity: "Knife Skills & Fish Selection" },
      { time: "3:00 PM", activity: "Sashimi Preparation Techniques" },
      { time: "3:45 PM", activity: "Sushi Rice Masterclass" },
      { time: "4:15 PM", activity: "Roll & Nigiri Assembly" },
      { time: "4:45 PM", activity: "Tasting & Sake Pairing" },
      { time: "5:00 PM", activity: "Wrap-up & Certificates" },
    ],
    capacity: "20 participants",
    price: "$149 per person",
    organizer: "Glory One Seafood Academy",
    contactEmail: "classes@gloryone.com.au",
    contactPhone: "+61 7 6543 2109",
  },
  "evt-4": {
    fullDescription:
      "Indulge in an evening of refined flavours at The Pearl Lounge, where the freshest Pacific oysters meet carefully curated wines from Australia's top vineyards. This exclusive tasting event is limited to just 50 guests, ensuring an intimate and luxurious experience.\n\nOur expert sommelier will guide you through six wine pairings alongside a selection of rock oysters, Pacific oysters, and specialty preparations including Kilpatrick, natural with mignonette, and tempura. The evening includes a welcome cocktail, live jazz, and a special gift bag featuring Glory One products.",
    highlights: [
      "6 curated wine pairings",
      "Multiple oyster varieties & preparations",
      "Welcome cocktail on arrival",
      "Live jazz quartet",
      "Exclusive gift bag with Glory One products",
      "Expert sommelier-guided experience",
    ],
    schedule: [
      { time: "6:00 PM", activity: "Welcome Cocktail & Arrival" },
      { time: "6:30 PM", activity: "Introduction & First Pairing" },
      { time: "7:00 PM", activity: "Oyster Varieties Showcase" },
      { time: "7:30 PM", activity: "Wine Pairing Flight 2 & 3" },
      { time: "8:00 PM", activity: "Specialty Preparations Tasting" },
      { time: "8:30 PM", activity: "Dessert & Final Pairing" },
      { time: "9:00 PM", activity: "Farewell & Gift Bags" },
    ],
    capacity: "50 guests",
    price: "$89 per person",
    organizer: "Glory One Seafood & The Pearl Lounge",
    contactEmail: "tasting@gloryone.com.au",
    contactPhone: "+61 8 5432 1098",
  },
  "evt-5": {
    fullDescription:
      "The Sustainable Seafood Symposium brings together leading marine biologists, industry experts, and policymakers for a full day of thought-provoking discussions about the future of our oceans and seafood supply chain.\n\nTopics include sustainable fishing practices, aquaculture innovation, reducing bycatch, traceability in the supply chain, and consumer education. The event features keynote presentations, interactive panel discussions, and a networking lunch featuring sustainably sourced seafood from Glory One's certified partners.",
    highlights: [
      "Keynote by Dr. Ocean Conservation Expert",
      "Interactive panel discussions",
      "Networking lunch with sustainable seafood",
      "Latest research presentations",
      "Industry certification information",
      "Post-event networking reception",
    ],
    schedule: [
      { time: "9:30 AM", activity: "Registration & Morning Tea" },
      { time: "10:00 AM", activity: "Opening Keynote Address" },
      { time: "11:00 AM", activity: "Panel: Future of Sustainable Fishing" },
      { time: "12:30 PM", activity: "Networking Lunch" },
      { time: "1:30 PM", activity: "Research Presentations" },
      { time: "3:00 PM", activity: "Panel: Supply Chain Traceability" },
      { time: "4:00 PM", activity: "Closing Remarks" },
      { time: "4:30 PM", activity: "Networking Reception" },
    ],
    capacity: "300 attendees",
    price: "$35 (Students: $15)",
    organizer: "Glory One Seafood & Ocean Alliance",
    contactEmail: "symposium@gloryone.com.au",
    contactPhone: "+61 8 4321 0987",
  },
};

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "info">("overview");

  const event = EVENTS.find((e) => e.id === id);
  const details = id ? EVENT_DETAILS[id] : undefined;
  const otherEvents = EVENTS.filter((e) => e.id !== id).slice(0, 3);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50/40 to-white px-4">
        <h2 className="text-[#0c4a6e] mb-4" style={{ fontSize: "1.5rem" }}>
          Event Not Found
        </h2>
        <p className="text-gray-500 mb-6" style={{ fontSize: "0.9rem" }}>
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/events"
          className="px-6 py-2.5 rounded-full bg-[#0369a1] text-white hover:bg-[#0c4a6e] transition-colors"
          style={{ fontSize: "0.85rem" }}
        >
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c4a6e]/95 via-[#0c4a6e]/60 to-[#0c4a6e]/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-16 md:pb-24">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-white/70 mb-8"
            style={{ fontSize: "0.8rem" }}
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link to="/events" className="hover:text-white transition-colors">
              Events & Expo
            </Link>
            <ChevronRight size={12} />
            <span className="text-white">{event.title}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full ${TYPE_COLORS[event.type] || "bg-gray-100 text-gray-600"}`}
                style={{ fontSize: "0.75rem" }}
              >
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </span>
              {event.isFeatured && (
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700" style={{ fontSize: "0.75rem" }}>
                  Featured Event
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700" style={{ fontSize: "0.75rem" }}>
                Upcoming
              </span>
            </div>
            <h1 className="text-white mb-4 max-w-3xl" style={{ fontSize: "2rem" }}>
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-5 text-white/90 mb-6" style={{ fontSize: "0.85rem" }}>
              <span className="flex items-center gap-2">
                <Calendar size={16} /> {event.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} /> {event.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} /> {event.location}
              </span>
              {details && (
                <span className="flex items-center gap-2">
                  <Users size={16} /> {details.capacity}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRegistered(true)}
                disabled={registered}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-colors cursor-pointer ${
                  registered
                    ? "bg-green-500 text-white"
                    : "bg-white text-[#0369a1] hover:bg-blue-50"
                }`}
                style={{ fontSize: "0.9rem" }}
              >
                {registered ? (
                  <>
                    <CheckCircle size={16} /> Registered!
                  </>
                ) : (
                  "Register Now"
                )}
              </motion.button>
              <button
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
                title="Share event"
              >
                <Share2 size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Tabs & Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-blue-100">
                {(["overview", "schedule", "info"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3.5 border-b-2 transition-all cursor-pointer text-center ${
                      activeTab === tab
                        ? "border-[#0369a1] text-[#0369a1] bg-blue-50/40"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                    }`}
                    style={{ fontSize: "0.85rem" }}
                  >
                    {tab === "overview" ? "Overview" : tab === "schedule" ? "Schedule" : "Event Info"}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <h2 className="text-[#0c4a6e] mb-4" style={{ fontSize: "1.25rem" }}>
                      About This Event
                    </h2>
                    {details?.fullDescription.split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        className="text-gray-600 mb-4"
                        style={{ fontSize: "0.88rem", lineHeight: 1.8 }}
                      >
                        {para}
                      </p>
                    ))}

                    {/* Highlights */}
                    {details && (
                      <div className="mt-8 pt-6 border-t border-blue-50">
                        <h3 className="text-[#0c4a6e] mb-4 flex items-center gap-2" style={{ fontSize: "1.1rem" }}>
                          <Star size={18} className="text-[#0369a1]" />
                          Event Highlights
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {details.highlights.map((hl, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.06 }}
                              className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-blue-50/30 border border-blue-100/50"
                            >
                              <CheckCircle size={16} className="text-[#0369a1] mt-0.5 shrink-0" />
                              <span className="text-gray-700" style={{ fontSize: "0.84rem" }}>
                                {hl}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Schedule Tab */}
                {activeTab === "schedule" && details && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <h2 className="text-[#0c4a6e] mb-6 flex items-center gap-2" style={{ fontSize: "1.25rem" }}>
                      <Clock size={20} className="text-[#0369a1]" />
                      Event Schedule
                    </h2>
                    <div className="relative">
                      <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#0369a1]/40 via-[#0369a1]/20 to-transparent" />
                      <div className="space-y-1">
                        {details.schedule.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="flex items-start gap-4 pb-5 relative"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#0369a1] flex items-center justify-center text-white shrink-0 z-10 shadow-md shadow-[#0369a1]/20">
                              <span style={{ fontSize: "0.6rem", fontWeight: 700 }}>{i + 1}</span>
                            </div>
                            <div className="flex-1 bg-white rounded-xl border border-blue-100 p-4 shadow-sm hover:shadow-md transition-all hover:border-[#0369a1]/30 group">
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <span className="text-gray-800" style={{ fontSize: "0.88rem" }}>
                                  {item.activity}
                                </span>
                                <span
                                  className="text-[#0369a1] bg-blue-50 px-2.5 py-0.5 rounded-full shrink-0"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  {item.time}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Info Tab */}
                {activeTab === "info" && details && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <h2 className="text-[#0c4a6e] mb-6" style={{ fontSize: "1.25rem" }}>
                      Event Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoCard label="Date" value={event.date} icon={<Calendar size={18} />} />
                      <InfoCard label="Time" value={event.time} icon={<Clock size={18} />} />
                      <InfoCard label="Venue" value={event.location} icon={<MapPin size={18} />} />
                      <InfoCard label="Address" value={event.address} icon={<MapPin size={18} />} />
                      <InfoCard label="Capacity" value={details.capacity} icon={<Users size={18} />} />
                      <InfoCard label="Price" value={details.price} icon={<Ticket size={18} />} />
                      <InfoCard label="Organizer" value={details.organizer} icon={<Users size={18} />} />
                      <InfoCard label="Email" value={details.contactEmail} icon={<Mail size={18} />} />
                      <InfoCard label="Phone" value={details.contactPhone} icon={<Phone size={18} />} />
                    </div>

                    {/* Map placeholder */}
                    <div className="mt-8 rounded-xl overflow-hidden border border-blue-100">
                      <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 text-center">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                          <MapPin size={28} className="text-[#0369a1]" />
                        </div>
                        <p className="text-[#0c4a6e] font-medium" style={{ fontSize: "0.95rem" }}>
                          {event.location}
                        </p>
                        <p className="text-gray-500 mt-1" style={{ fontSize: "0.82rem" }}>
                          {event.address}
                        </p>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-[#0369a1] text-white hover:bg-[#0c4a6e] transition-colors"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <ExternalLink size={14} />
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="order-1 lg:order-2 space-y-5">
            {/* Registration Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden lg:sticky lg:top-20"
            >
              {/* Price header */}
              <div className="bg-gradient-to-r from-[#0369a1] to-[#0284c7] p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Ticket size={16} className="opacity-80" />
                  <span style={{ fontSize: "0.75rem" }} className="opacity-80 uppercase tracking-wider">Admission</span>
                </div>
                <p className="text-white font-bold" style={{ fontSize: "1.3rem" }}>
                  {details?.price || "Free"}
                </p>
              </div>

              <div className="p-5 space-y-4">
                {/* Quick Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Calendar size={16} className="text-[#0369a1]" />
                    </div>
                    <div>
                      <div className="text-gray-400" style={{ fontSize: "0.68rem" }}>Date</div>
                      <div className="text-[#0c4a6e]" style={{ fontSize: "0.84rem" }}>{event.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Clock size={16} className="text-[#0369a1]" />
                    </div>
                    <div>
                      <div className="text-gray-400" style={{ fontSize: "0.68rem" }}>Time</div>
                      <div className="text-[#0c4a6e]" style={{ fontSize: "0.84rem" }}>{event.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-[#0369a1]" />
                    </div>
                    <div>
                      <div className="text-gray-400" style={{ fontSize: "0.68rem" }}>Venue</div>
                      <div className="text-[#0c4a6e]" style={{ fontSize: "0.84rem" }}>{event.location}</div>
                    </div>
                  </div>
                  {details && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Users size={16} className="text-[#0369a1]" />
                      </div>
                      <div>
                        <div className="text-gray-400" style={{ fontSize: "0.68rem" }}>Capacity</div>
                        <div className="text-[#0c4a6e]" style={{ fontSize: "0.84rem" }}>{details.capacity}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Register Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRegistered(true)}
                  disabled={registered}
                  className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-medium ${
                    registered
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                      : "bg-[#0369a1] text-white hover:bg-[#0c4a6e] shadow-lg shadow-[#0369a1]/20"
                  }`}
                  style={{ fontSize: "0.9rem" }}
                >
                  {registered ? (
                    <>
                      <CheckCircle size={18} /> Registered!
                    </>
                  ) : (
                    <>
                      <Ticket size={18} /> Register Now
                    </>
                  )}
                </motion.button>

                {/* Share / Copy */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const url = window.location.href;
                      const textarea = document.createElement("textarea");
                      textarea.value = url;
                      textarea.style.position = "fixed";
                      textarea.style.opacity = "0";
                      document.body.appendChild(textarea);
                      textarea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textarea);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 text-[#0369a1] hover:bg-blue-50 transition-colors cursor-pointer"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <Copy size={14} /> Copy Link
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 text-[#0369a1] hover:bg-blue-50 transition-colors cursor-pointer"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>

              {/* Organizer */}
              {details && (
                <div className="border-t border-blue-50 p-5">
                  <p className="text-gray-400 uppercase tracking-wider mb-3" style={{ fontSize: "0.65rem" }}>
                    Organized by
                  </p>
                  <p className="text-[#0c4a6e] font-medium mb-3" style={{ fontSize: "0.88rem" }}>
                    {details.organizer}
                  </p>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${details.contactEmail}`}
                      className="flex items-center gap-2 text-gray-500 hover:text-[#0369a1] transition-colors"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <Mail size={14} /> {details.contactEmail}
                    </a>
                    <a
                      href={`tel:${details.contactPhone}`}
                      className="flex items-center gap-2 text-gray-500 hover:text-[#0369a1] transition-colors"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <Phone size={14} /> {details.contactPhone}
                    </a>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Map Quick Link */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border border-blue-100 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <MapPin size={18} className="text-[#0369a1]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#0c4a6e] font-medium" style={{ fontSize: "0.85rem" }}>{event.location}</p>
                  <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>{event.address}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400 group-hover:text-[#0369a1] transition-colors" />
              </div>
            </motion.a>
          </div>
        </div>

        {/* Ocean divider */}
        <div className="flex items-center gap-3 my-14">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          <Waves size={20} className="text-blue-200" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
        </div>

        {/* Other Events */}
        {otherEvents.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[#0c4a6e]" style={{ fontSize: "1.25rem" }}>
                  Other Upcoming Events
                </h2>
                <p className="text-gray-400 mt-1" style={{ fontSize: "0.8rem" }}>
                  Discover more events from Glory One
                </p>
              </div>
              <Link
                to="/events"
                className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-full border border-blue-200 text-[#0369a1] hover:bg-blue-50 transition-colors"
                style={{ fontSize: "0.82rem" }}
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherEvents.map((evt, i) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/events/${evt.id}`} className="block group">
                    <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <span
                          className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full backdrop-blur-sm ${TYPE_COLORS[evt.type] || "bg-gray-100 text-gray-600"}`}
                          style={{ fontSize: "0.7rem" }}
                        >
                          {evt.type.charAt(0).toUpperCase() + evt.type.slice(1)}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-[#0c4a6e] mb-3 line-clamp-1 font-medium" style={{ fontSize: "0.92rem" }}>
                          {evt.title}
                        </h3>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-gray-500" style={{ fontSize: "0.75rem" }}>
                            <Calendar size={13} className="text-[#0369a1]" />
                            <span>{evt.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500" style={{ fontSize: "0.75rem" }}>
                            <MapPin size={13} className="text-[#0369a1]" />
                            <span>{evt.location}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-blue-50 flex items-center text-[#0369a1] group-hover:gap-2 gap-1 transition-all" style={{ fontSize: "0.8rem" }}>
                          View Details <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="sm:hidden mt-6 text-center">
              <Link
                to="/events"
                className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full border border-blue-200 text-[#0369a1] hover:bg-blue-50 transition-colors"
                style={{ fontSize: "0.82rem" }}
              >
                View All Events <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/events")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-blue-200 text-[#0369a1] hover:bg-blue-50 hover:border-[#0369a1]/30 transition-all cursor-pointer group"
            style={{ fontSize: "0.85rem" }}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to All Events
          </button>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/50 border border-blue-100/60">
      <div className="text-[#0369a1] shrink-0 mt-0.5">{icon}</div>
      <div>
        <span className="text-gray-400 block" style={{ fontSize: "0.72rem" }}>
          {label}
        </span>
        <span className="text-gray-700" style={{ fontSize: "0.84rem" }}>
          {value}
        </span>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Calendar, MapPin, Clock, ArrowRight, Filter } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

type EventType = "all" | "expo" | "festival" | "workshop" | "tasting";
type EventStatus = "upcoming" | "ongoing" | "past";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  address: string;
  type: EventType;
  status: EventStatus;
  image: string;
  isFeatured?: boolean;
  tags: string[];
}

export const EVENTS: EventItem[] = [
  {
    id: "evt-1",
    title: "Glory One Seafood Expo 2026",
    description:
      "Our biggest annual expo showcasing the finest seafood from around the world. Meet suppliers, taste samples, and discover exclusive deals on premium seafood selections.",
    date: "April 18–20, 2026",
    time: "9:00 AM – 6:00 PM",
    location: "Sydney Convention Centre",
    address: "14 Darling Dr, Sydney NSW 2000",
    type: "expo",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1684655531475-e9f0af4c47dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwZmVzdGl2YWwlMjBleHBvJTIwZXZlbnR8ZW58MXx8fHwxNzcyNjMxMzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    isFeatured: true,
    tags: ["Expo", "Live Demos", "Exclusive Deals"],
  },
  {
    id: "evt-2",
    title: "Fresh Catch Festival – Melbourne",
    description:
      "A weekend-long celebration of fresh seafood with live cooking demonstrations, ocean-to-table dining experiences, live music, and family-friendly activities by the waterfront.",
    date: "May 9–10, 2026",
    time: "10:00 AM – 8:00 PM",
    location: "South Wharf Promenade",
    address: "South Wharf, Melbourne VIC 3006",
    type: "festival",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1758346970392-4e9e1031d58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbWFya2V0JTIwc3RhbGwlMjBvdXRkb29yfGVufDF8fHx8MTc3MjYzMTM0NHww&ixlib=rb-4.1.0&q=80&w=1080",
    isFeatured: false,
    tags: ["Festival", "Family Friendly", "Live Music"],
  },
  {
    id: "evt-3",
    title: "Seafood Master Class: Sushi & Sashimi",
    description:
      "Learn the art of sushi and sashimi preparation from award-winning chef Kenji Takahashi. Includes hands-on practice, premium ingredients, and a take-home recipe booklet.",
    date: "March 22, 2026",
    time: "2:00 PM – 5:00 PM",
    location: "Glory One Test Kitchen",
    address: "88 Ocean Blvd, Brisbane QLD 4000",
    type: "workshop",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1700402871735-8a67fa40d4ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwY29va2luZyUyMGNsYXNzJTIwd29ya3Nob3B8ZW58MXx8fHwxNzcyNjMxMzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    isFeatured: false,
    tags: ["Workshop", "Hands-on", "Chef-led"],
  },
  {
    id: "evt-4",
    title: "Oyster & Wine Tasting Evening",
    description:
      "An exclusive tasting evening pairing the freshest Pacific oysters with curated wines from top Australian vineyards. Limited to 50 guests for an intimate experience.",
    date: "April 5, 2026",
    time: "6:00 PM – 9:00 PM",
    location: "The Pearl Lounge",
    address: "22 Harbour St, Perth WA 6000",
    type: "tasting",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1688224178074-77567a36d669?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMGZvb2QlMjB0YXN0aW5nJTIwZXZlbnR8ZW58MXx8fHwxNzcyNjMxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    isFeatured: false,
    tags: ["Tasting", "Exclusive", "Wine Pairing"],
  },
  {
    id: "evt-5",
    title: "Sustainable Seafood Symposium",
    description:
      "Join industry leaders and marine biologists for a day of panels and presentations on sustainable fishing, ocean conservation, and the future of responsible seafood sourcing.",
    date: "June 14, 2026",
    time: "9:30 AM – 4:30 PM",
    location: "Adelaide Conference Hall",
    address: "North Terrace, Adelaide SA 5000",
    type: "expo",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1761594607277-305e41d972d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXJzJTIwbWFya2V0JTIwc2VhZm9vZCUyMGRpc3BsYXl8ZW58MXx8fHwxNzcyNjMxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    isFeatured: false,
    tags: ["Symposium", "Sustainability", "Industry"],
  },
];

const FILTER_TABS: { label: string; value: EventType }[] = [
  { label: "All Events", value: "all" },
  { label: "Expos", value: "expo" },
  { label: "Festivals", value: "festival" },
  { label: "Workshops", value: "workshop" },
  { label: "Tastings", value: "tasting" },
];

const TYPE_COLORS: Record<string, string> = {
  expo: "bg-blue-100 text-blue-700",
  festival: "bg-orange-100 text-orange-700",
  workshop: "bg-green-100 text-green-700",
  tasting: "bg-purple-100 text-purple-700",
};

export function EventsExpoPage() {
  const [filter, setFilter] = useState<EventType>("all");

  const filtered = filter === "all" ? EVENTS : EVENTS.filter((e) => e.type === filter);
  const featured = EVENTS.find((e) => e.isFeatured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white">
      {/* Hero / Featured Event */}
      {featured && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c4a6e]/90 via-[#0c4a6e]/70 to-[#0c4a6e]/40" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <span
                className="inline-block px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm mb-4"
                style={{ fontSize: "0.8rem" }}
              >
                Featured Event
              </span>
              <h1 className="text-white mb-4" style={{ fontSize: "2.25rem" }}>
                {featured.title}
              </h1>
              <p className="text-white/80 mb-6" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
                {featured.description}
              </p>
              <div className="flex flex-wrap gap-4 text-white/90 mb-8" style={{ fontSize: "0.85rem" }}>
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} /> {featured.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> {featured.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} /> {featured.location}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-full bg-white text-[#0369a1] hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-2"
                style={{ fontSize: "0.9rem" }}
              >
                Register Now <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Events Listing */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-[#0c4a6e] mb-2" style={{ fontSize: "1.75rem" }}>
            Upcoming Events & Expos
          </h2>
          <p className="text-gray-500" style={{ fontSize: "0.9rem" }}>
            Join us at seafood festivals, expos, workshops, and exclusive tasting events
          </p>
          <div className="w-16 h-1 bg-[#0369a1] mx-auto mt-3 rounded-full" />
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <Filter size={16} className="text-gray-400 mr-1" />
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
                filter === tab.value
                  ? "bg-[#0369a1] text-white border-[#0369a1]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#0369a1] hover:text-[#0369a1]"
              }`}
              style={{ fontSize: "0.8rem" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p style={{ fontSize: "1rem" }}>No events found in this category.</p>
            <p style={{ fontSize: "0.85rem" }} className="mt-2">
              Check back soon for updates!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA section */}
      <section className="bg-gradient-to-r from-[#0c4a6e] to-[#0369a1] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="mb-4" style={{ fontSize: "1.5rem" }}>
            Want to Partner or Exhibit?
          </h2>
          <p className="text-white/80 mb-8" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
            If you're a seafood supplier, chef, or industry partner interested in exhibiting at our events or
            collaborating with Glory One Seafood, we'd love to hear from you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-full bg-white text-[#0369a1] hover:bg-blue-50 transition-colors cursor-pointer"
              style={{ fontSize: "0.9rem" }}
            >
              Become an Exhibitor
            </motion.button>
            <Link
              to="/"
              className="px-6 py-3 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors inline-block"
              style={{ fontSize: "0.9rem" }}
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full ${TYPE_COLORS[event.type] || "bg-gray-100 text-gray-600"}`}
          style={{ fontSize: "0.7rem" }}
        >
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </span>
        {event.isFeatured && (
          <span
            className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700"
            style={{ fontSize: "0.7rem" }}
          >
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-[#0c4a6e] mb-2 line-clamp-2" style={{ fontSize: "1rem" }}>
          {event.title}
        </h3>
        <p className="text-gray-500 mb-4 line-clamp-2" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
          {event.description}
        </p>
        <div className="space-y-1.5 mb-4" style={{ fontSize: "0.78rem" }}>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} className="text-[#0369a1] shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={14} className="text-[#0369a1] shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={14} className="text-[#0369a1] shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-blue-50 text-[#0369a1]"
              style={{ fontSize: "0.68rem" }}
            >
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/events/${event.id}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 rounded-lg bg-[#0369a1] text-white hover:bg-[#0c4a6e] transition-colors cursor-pointer flex items-center justify-center gap-2"
            style={{ fontSize: "0.82rem" }}
          >
            Learn More <ArrowRight size={14} />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

export { type EventItem };
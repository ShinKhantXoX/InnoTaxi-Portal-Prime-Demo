import { Anchor, Truck, ShieldCheck, ThermometerSnowflake, Fish, Award, Headset } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const reasons = [
  {
    icon: <Fish size={28} />,
    title: "Ocean-Fresh Quality",
    description:
      "Every product is harvested at peak freshness and flash-frozen within hours to lock in flavor, texture, and nutrients.",
  },
  {
    icon: <Anchor size={28} />,
    title: "Sustainably Sourced",
    description:
      "We partner exclusively with certified sustainable fisheries and responsible aquaculture farms worldwide.",
  },
  {
    icon: <ThermometerSnowflake size={28} />,
    title: "Cold-Chain Guaranteed",
    description:
      "From ocean to your door, our temperature-controlled logistics keep your seafood perfectly chilled every step of the way.",
  },
  {
    icon: <Truck size={28} />,
    title: "Free Express Shipping",
    description:
      "Enjoy complimentary overnight delivery on orders over $200 — so your seafood arrives as fresh as the day it was caught.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "100% Satisfaction Promise",
    description:
      "Not happy? We'll replace your order or give you a full refund — no questions asked. Your trust means everything to us.",
  },
  {
    icon: <Award size={28} />,
    title: "Expert Curated Selection",
    description:
      "Our seafood specialists hand-pick every product, ensuring only the finest cuts and catches make it to your table.",
  },
  {
    icon: <Headset size={28} />,
    title: "7-Day Customer Support",
    description:
      "Our dedicated team is available every day of the week to help with orders, recipes, and anything seafood-related.",
  },
];

export function WhyBuySection() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Ocean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0f9ff] via-white to-[#f0f9ff]" />

      {/* Decorative wave SVG */}
      <div className="absolute top-0 left-0 right-0 opacity-30">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path
            d="M0 30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0V30Z"
            fill="#0369a1"
            opacity="0.15"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <span
            className="inline-block bg-[#0369a1]/10 text-[#0369a1] px-4 py-1 rounded-full mb-3"
            style={{ fontSize: "0.8rem" }}
          >
            The Glory One Difference
          </span>
          <h2 className="text-[#0c4a6e] mb-3" style={{ fontSize: "1.8rem" }}>
            Why Buy From Glory One Seafood?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto" style={{ fontSize: "0.95rem" }}>
            We go above and beyond to bring you the freshest, most responsibly sourced seafood — delivered right to your doorstep with care.
          </p>
        </div>

        {/* Top row: image + first 3 reasons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image card */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-[320px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1766059965546-c335e31ac4be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNlYWZvb2QlMjBtYXJrZXQlMjBvY2VhbnxlbnwxfHx8fDE3NzI2Mjg3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Fresh seafood selection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c4a6e]/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div style={{ fontSize: "1.2rem" }} className="mb-1">
                Trusted by 10,000+ Families
              </div>
              <p className="text-white/80" style={{ fontSize: "0.85rem" }}>
                Delivering premium seafood across the country since 2015.
              </p>
            </div>
          </div>

          {/* First 3 reason cards */}
          <div className="flex flex-col gap-4">
            {reasons.slice(0, 3).map((reason) => (
              <div
                key={reason.title}
                className="group flex gap-4 items-start bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0369a1]/20 transition-all duration-300 cursor-default"
              >
                <div className="shrink-0 w-12 h-12 rounded-lg bg-[#0369a1]/10 text-[#0369a1] flex items-center justify-center group-hover:bg-[#0369a1] group-hover:text-white transition-colors duration-300">
                  {reason.icon}
                </div>
                <div>
                  <div className="text-[#0c4a6e] mb-0.5" style={{ fontSize: "0.95rem" }}>
                    {reason.title}
                  </div>
                  <p className="text-gray-500 leading-relaxed" style={{ fontSize: "0.82rem" }}>
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row: remaining 4 reasons in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reasons.slice(3).map((reason) => (
            <div
              key={reason.title}
              className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0369a1]/20 transition-all duration-300 text-center cursor-default"
            >
              <div className="w-14 h-14 rounded-full bg-[#0369a1]/10 text-[#0369a1] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#0369a1] group-hover:text-white transition-colors duration-300">
                {reason.icon}
              </div>
              <div className="text-[#0c4a6e] mb-1" style={{ fontSize: "0.95rem" }}>
                {reason.title}
              </div>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: "0.82rem" }}>
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 opacity-30">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V0H0V30Z"
              fill="#0369a1"
              opacity="0.15"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

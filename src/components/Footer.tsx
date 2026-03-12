import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import logoImage from "figma:asset/e358090199fea4196ab2121252a99683b52376f3.png";

export function Footer() {
  return (
    <footer className="bg-[#0c4a6e] text-white">
      {/* Wave top */}
      <div className="relative">
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none" style={{ marginBottom: "-1px" }}>
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,10 1440,30 L1440,60 L0,60 Z" fill="#0c4a6e" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <img src={logoImage} alt="Glory One" className="h-14 w-auto mb-4 brightness-0 invert" />
            <p className="text-white/70 mb-4" style={{ fontSize: "0.85rem" }}>
              Glory One Seafood Export - Your Reliable Seafood Partner. Premium quality seafood processing and cold storage since 2020.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4" style={{ fontSize: "1rem" }}>Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Best Sellers", to: "/#best-sellers" },
                { label: "Seafood", to: "/all-seafood" },
                { label: "About Us", to: "/about" },
                { label: "Contact Us", to: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-white/70 hover:text-white transition-colors" style={{ fontSize: "0.85rem" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Orders & Shipping */}
          <div>
            <h4 className="text-white mb-4" style={{ fontSize: "1rem" }}>Orders & Shipping</h4>
            <ul className="space-y-2">
              {[
                { label: "Shipping Policy", href: "#shipping-policy" },
                { label: "Refund Policy", href: "#refund-policy" },
                { label: "Data Privacy", href: "#data-privacy" },
                { label: "Terms and Conditions", href: "#terms" },
              ].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-white/70 hover:text-white transition-colors" style={{ fontSize: "0.85rem" }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4" style={{ fontSize: "1rem" }}>Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-white/50" />
                <span className="text-white/70" style={{ fontSize: "0.8rem" }}>
                  No. 9/3, D-1, Twin Thin Taik Wun U Tun Nyo St, Industrial Zone (6), Hlaing Tharyar Township, Yangon Region
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0 text-white/50" />
                <span className="text-white/70" style={{ fontSize: "0.85rem" }}>+95-9787850193</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0 text-white/50" />
                <span className="text-white/70" style={{ fontSize: "0.85rem" }}>intyangon@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50" style={{ fontSize: "0.8rem" }}>
            &copy; 2026 Glory One Seafood Export. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-white/50" style={{ fontSize: "0.8rem" }}>
            <span>Glory One Company Limited (Myanmar)</span>
            <span className="hidden md:inline">|</span>
            <span>Goldennet Trading Co., Ltd. (Thailand)</span>
            <span className="hidden md:inline">|</span>
            <span>Goldennet Trading FZC (UAE)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { SEAFOOD_SUBCATEGORIES } from "../mock/data";

const POLICY_ITEMS = [
  { label: "Shipping Policy", href: "#shipping-policy" },
  { label: "Return Policy", href: "#return-policy" },
  { label: "Data Privacy", href: "#data-privacy" },
  { label: "Terms and Conditions", href: "#terms" },
];

const SEAFOOD_CATS = Object.entries(SEAFOOD_SUBCATEGORIES).map(([slug, items]) => ({
  slug,
  name: slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
  items,
}));

export function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#0369a1] text-white relative z-30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0">
          <NavItem label="Home" href="/" />
          <NavItem label="Best Seller" href="/#best-sellers" />

          {/* Seafood Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("seafood")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 px-4 py-3 hover:bg-white/10 transition-colors" style={{ fontSize: "0.875rem" }}>
              Seafood <ChevronDown size={14} className={`transition-transform ${activeDropdown === "seafood" ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === "seafood" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 bg-white text-gray-800 shadow-2xl rounded-b-lg border border-blue-100 min-w-[600px] p-6"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-100">
                    <h3 className="text-[#0369a1]" style={{ fontSize: "1rem" }}>All Seafood Categories</h3>
                    <Link to="/all-seafood" className="text-[#0369a1] hover:underline" style={{ fontSize: "0.8rem" }}>
                      View All →
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {SEAFOOD_CATS.map((cat) => (
                      <div key={cat.slug}>
                        <Link
                          to={`/all-seafood?category=${cat.slug}`}
                          className="text-[#0369a1] mb-2 pb-1 border-b border-blue-50 block hover:text-[#0c4a6e] transition-colors"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {cat.name}
                        </Link>
                        <ul className="space-y-1">
                          {cat.items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/all-seafood?category=${encodeURIComponent(item.toLowerCase())}`}
                                className="text-gray-600 hover:text-[#0369a1] transition-colors block py-0.5"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link to={`/all-seafood?category=${cat.slug}`} className="text-[#0369a1] hover:underline" style={{ fontSize: "0.75rem" }}>
                              View All →
                            </Link>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavItem label="About Us" href="/about" />
          <NavItem label="Events & Expo" href="/events" />
          <NavItem label="Contact Us" href="/contact" />

          {/* Policy Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("policy")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            

            <AnimatePresence>
              {activeDropdown === "policy" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 bg-white text-gray-800 shadow-xl rounded-b-lg border border-blue-100 min-w-[200px] py-2"
                >
                  {POLICY_ITEMS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 hover:bg-blue-50 hover:text-[#0369a1] transition-colors"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {item.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center py-2">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-white">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span style={{ fontSize: "0.875rem" }} className="ml-2">Menu</span>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[#0c4a6e] overflow-hidden"
          >
            <div className="px-4 py-2 space-y-1">
              <MobileNavItem label="Home" href="/" onClick={() => setMobileOpen(false)} />
              <MobileNavItem label="Best Seller" href="/#best-sellers" onClick={() => setMobileOpen(false)} />
              <div className="border-t border-white/10 pt-2 mt-2">
                <div style={{ fontSize: "0.75rem" }} className="text-white/50 px-3 pb-1">Seafood</div>
                {SEAFOOD_CATS.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/all-seafood?category=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded hover:bg-white/10 transition-colors"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  to="/all-seafood"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-white/10 transition-colors text-blue-200"
                  style={{ fontSize: "0.8rem" }}
                >
                  View All Seafood →
                </Link>
              </div>
              <MobileNavItem label="About Us" href="/about" onClick={() => setMobileOpen(false)} />
              <MobileNavItem label="Events & Expo" href="/events" onClick={() => setMobileOpen(false)} />
              <MobileNavItem label="Contact Us" href="/contact" onClick={() => setMobileOpen(false)} />
              <div className="border-t border-white/10 pt-2 mt-2">
                <div style={{ fontSize: "0.75rem" }} className="text-white/50 px-3 pb-1">Policy</div>
                {POLICY_ITEMS.map((item) => (
                  <MobileNavItem key={item.href} label={item.label} href={item.href} onClick={() => setMobileOpen(false)} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavItem({ label, href }: { label: string; href: string }) {
  const isInternal = href.startsWith("/");
  if (isInternal) {
    return (
      <Link to={href} className="px-4 py-3 hover:bg-white/10 transition-colors block" style={{ fontSize: "0.875rem" }}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className="px-4 py-3 hover:bg-white/10 transition-colors block" style={{ fontSize: "0.875rem" }}>
      {label}
    </a>
  );
}

function MobileNavItem({ label, href, onClick }: { label: string; href: string; onClick: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block px-3 py-2 rounded hover:bg-white/10 transition-colors"
      style={{ fontSize: "0.85rem" }}
    >
      {label}
    </a>
  );
}
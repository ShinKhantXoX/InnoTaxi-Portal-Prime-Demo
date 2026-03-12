import { Search, Phone, ShoppingCart } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "./Layout";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS } from "../mock/data";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const showDropdown = (isFocused || isMobileFocused) && searchQuery.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setIsMobileFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsFocused(false);
      setIsMobileFocused(false);
      navigate(`/all-seafood?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (id: string) => {
    setSearchQuery("");
    setIsFocused(false);
    setIsMobileFocused(false);
    navigate(`/product/${id}`);
  };

  const handleViewAll = () => {
    setIsFocused(false);
    setIsMobileFocused(false);
    navigate(`/all-seafood?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const searchDropdownContent = showDropdown ? (
    <motion.div
      key="search-dropdown"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden z-50"
    >
      {filteredProducts.length > 0 ? (
        <>
          <div className="px-4 py-2 border-b border-blue-50 flex items-center justify-between">
            <span className="text-gray-400" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {filteredProducts.length} result{filteredProducts.length > 1 ? "s" : ""} found
            </span>
            <button
              onClick={handleViewAll}
              className="text-[#0369a1] hover:underline cursor-pointer"
              style={{ fontSize: "0.75rem" }}
            >
              View All Results
            </button>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50/60 transition-colors cursor-pointer text-left"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 rounded-lg object-cover border border-blue-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[#0c4a6e] truncate" style={{ fontSize: "0.85rem" }}>
                    {product.title}
                  </div>
                  <div className="text-gray-400 truncate" style={{ fontSize: "0.72rem" }}>
                    {product.category} · {product.subCategory}
                  </div>
                </div>
                <div className="text-[#0369a1] flex-shrink-0" style={{ fontSize: "0.85rem" }}>
                  ${product.sizes[0].price.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="px-4 py-8 text-center">
          <Search className="mx-auto text-gray-300 mb-2" size={24} />
          <p className="text-gray-400" style={{ fontSize: "0.85rem" }}>
            No products found for "{searchQuery}"
          </p>
          <p className="text-gray-300 mt-1" style={{ fontSize: "0.75rem" }}>
            Try a different search term
          </p>
        </div>
      )}
    </motion.div>
  ) : null;

  return (
    <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-2">
            <div className="flex items-center gap-2.5">
              {/* Drawn Logo Icon */}
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                {/* Outer circle */}
                <circle cx="22" cy="22" r="21" stroke="#0369a1" strokeWidth="1.5" fill="#f0f9ff" />
                {/* Inner gradient circle */}
                <circle cx="22" cy="22" r="17" fill="url(#logoGrad)" />
                {/* Wave decoration */}
                <path d="M8 26c3-3 6 0 9-3s6 0 9-3 6 0 9-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
                <path d="M8 30c3-3 6 0 9-3s6 0 9-3 6 0 9-3" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
                {/* Fish icon */}
                <g transform="translate(13, 14)">
                  <path d="M0 8c3-2 5-6 10-6s5 2 8 0c-3 2-5 6-8 6L0 8z" fill="white" opacity="0.95" />
                  <path d="M10 2c2 1 3 3 3 6s-1 4-3 6c2-2 5-3 8-6-3-3-6-4-8-6z" fill="white" opacity="0.7" />
                  <circle cx="6" cy="7" r="1.2" fill="#0369a1" />
                </g>
                {/* Anchor hint */}
                <line x1="22" y1="30" x2="22" y2="36" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
                <circle cx="22" cy="29" r="2" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
                <defs>
                  <linearGradient id="logoGrad" x1="5" y1="5" x2="39" y2="39" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0284c7" />
                    <stop offset="1" stopColor="#0c4a6e" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Text */}
              <div className="flex flex-col leading-none">
                <span className="text-[#0c4a6e] font-bold tracking-tight" style={{ fontSize: "1.25rem", lineHeight: 1.2 }}>
                  Glory One
                </span>
                <span className="text-[#0369a1] tracking-widest uppercase" style={{ fontSize: "0.48rem", lineHeight: 1.4 }}>
                  Seafood Distribution
                </span>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search fresh seafood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-blue-200 bg-blue-50/50 focus:outline-none focus:border-[#0369a1] focus:ring-2 focus:ring-[#0369a1]/20 transition-all"
              style={{ fontSize: "0.875rem" }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0369a1]" size={18} />
            <AnimatePresence>{searchDropdownContent}</AnimatePresence>
          </div>
        </div>

        {/* Hotline & Lang & Cart */}
        <div className="flex items-center gap-3 md:gap-5">
          <motion.a
            href="tel:+959787850193"
            whileHover={{ scale: 1.05 }}
            className="hidden sm:flex items-center gap-2 text-[#0c4a6e] hover:text-[#0369a1] transition-colors"
          >
            <div className="bg-blue-50 p-2 rounded-full">
              <Phone size={16} />
            </div>
            <div className="hidden lg:block">
              <div style={{ fontSize: "0.7rem" }} className="text-gray-500">Hotline</div>
              <div style={{ fontSize: "0.85rem" }} className="text-[#0c4a6e]">+95-9787850193</div>
            </div>
          </motion.a>

          <LanguageSwitcher />

          <Link to="/cart">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-[#0369a1] text-white p-2.5 rounded-full hover:bg-[#0c4a6e] transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ fontSize: "0.65rem" }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative" ref={mobileSearchRef}>
          <input
            type="text"
            placeholder="Search fresh seafood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsMobileFocused(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-blue-200 bg-blue-50/50 focus:outline-none focus:border-[#0369a1]"
            style={{ fontSize: "0.875rem" }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0369a1]" size={18} />
          <AnimatePresence>{searchDropdownContent}</AnimatePresence>
        </div>
      </div>
    </header>
  );
}
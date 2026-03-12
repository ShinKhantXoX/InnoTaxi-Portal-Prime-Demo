import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Country {
  code: string;
  name: string;
  flag: string;
  prefix: string;
}

const COUNTRIES: Country[] = [
  { code: "MM", name: "Myanmar", flag: "🇲🇲", prefix: "+95" },
  { code: "US", name: "United States", flag: "🇺🇸", prefix: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", prefix: "+44" },
  { code: "CN", name: "China", flag: "🇨🇳", prefix: "+86" },
  { code: "JP", name: "Japan", flag: "🇯🇵", prefix: "+81" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", prefix: "+82" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", prefix: "+65" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", prefix: "+66" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", prefix: "+60" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", prefix: "+84" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", prefix: "+63" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", prefix: "+62" },
  { code: "IN", name: "India", flag: "🇮🇳", prefix: "+91" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", prefix: "+880" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", prefix: "+92" },
  { code: "LA", name: "Laos", flag: "🇱🇦", prefix: "+856" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭", prefix: "+855" },
  { code: "AU", name: "Australia", flag: "🇦🇺", prefix: "+61" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", prefix: "+64" },
  { code: "DE", name: "Germany", flag: "🇩🇪", prefix: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", prefix: "+33" },
  { code: "IT", name: "Italy", flag: "🇮🇹", prefix: "+39" },
  { code: "ES", name: "Spain", flag: "🇪🇸", prefix: "+34" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", prefix: "+31" },
  { code: "CA", name: "Canada", flag: "🇨🇦", prefix: "+1" },
  { code: "AE", name: "UAE", flag: "🇦🇪", prefix: "+971" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", prefix: "+966" },
  { code: "RU", name: "Russia", flag: "🇷🇺", prefix: "+7" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", prefix: "+55" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", prefix: "+27" },
];

interface PhoneInputProps {
  value: string;
  onChange: (fullValue: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export function PhoneInput({
  value,
  onChange,
  className = "",
  style,
  placeholder,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extract local number (strip prefix if present)
  const localNumber = value.startsWith(selectedCountry.prefix)
    ? value.slice(selectedCountry.prefix.length).trimStart()
    : value.replace(/^\+\d+\s*/, "");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (dropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dropdownOpen]);

  const filteredCountries = search.trim()
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.prefix.includes(search) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES;

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    setSearch("");
    onChange(localNumber ? `${country.prefix} ${localNumber}` : "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw) {
      onChange(`${selectedCountry.prefix} ${raw}`);
    } else {
      onChange("");
    }
  };

  const dynamicPlaceholder =
    placeholder || `${selectedCountry.prefix} 9 xxx xxx xxx`;

  return (
    <div className="relative flex" ref={dropdownRef}>
      {/* Country selector button */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-1 px-3 rounded-l-xl border border-r-0 bg-blue-50/60 hover:bg-blue-100/70 transition-colors cursor-pointer flex-shrink-0 ${
          className.includes("border-red") ? "border-red-300" : "border-blue-200"
        }`}
        style={{ fontSize: "0.85rem" }}
      >
        <span style={{ fontSize: "1.15rem" }}>{selectedCountry.flag}</span>
        <span className="text-[#0c4a6e] font-medium" style={{ fontSize: "0.8rem" }}>
          {selectedCountry.prefix}
        </span>
        <ChevronDown
          size={12}
          className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Phone number input */}
      <input
        type="tel"
        value={localNumber}
        onChange={handleInputChange}
        className={`flex-1 min-w-0 px-3 py-3 rounded-r-xl border border-l-0 ${
          className.includes("border-red")
            ? "border-red-300 bg-red-50/30"
            : "border-blue-200 bg-white"
        } focus:outline-none focus:ring-2 focus:ring-[#0369a1]/20 focus:border-[#0369a1] transition-all`}
        style={style}
        placeholder={dynamicPlaceholder.replace(selectedCountry.prefix + " ", "")}
      />

      {/* Dropdown */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-blue-100 z-50 w-72 overflow-hidden"
          >
            {/* Search */}
            <div className="p-2 border-b border-blue-50">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-blue-100 bg-blue-50/30 focus:outline-none focus:border-[#0369a1] text-gray-700"
                  style={{ fontSize: "0.8rem" }}
                />
              </div>
            </div>

            {/* Country list */}
            <div className="max-h-56 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                      selectedCountry.code === country.code
                        ? "bg-blue-50/80 text-[#0369a1]"
                        : "text-gray-700 hover:bg-blue-50/40"
                    }`}
                    style={{ fontSize: "0.82rem" }}
                  >
                    <span style={{ fontSize: "1.15rem" }}>{country.flag}</span>
                    <span className="flex-1 text-left truncate">
                      {country.name}
                    </span>
                    <span
                      className={`flex-shrink-0 ${
                        selectedCountry.code === country.code
                          ? "text-[#0369a1] font-medium"
                          : "text-gray-400"
                      }`}
                      style={{ fontSize: "0.78rem" }}
                    >
                      {country.prefix}
                    </span>
                    <span
                      className="text-gray-300 flex-shrink-0"
                      style={{ fontSize: "0.72rem" }}
                    >
                      {country.code}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-6 text-center">
                  <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>
                    No country found
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

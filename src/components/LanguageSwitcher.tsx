import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Language {
  code: string;
  label: string;
  flag: string;
  nativeName: string;
}

const LANGUAGES: Language[] = [
  { code: "en", label: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "zh-CN", label: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  { code: "my", label: "Myanmar", flag: "🇲🇲", nativeName: "မြန်မာ" },
];

// Inject the Google Translate script once
let scriptInjected = false;
function injectGoogleTranslateScript() {
  if (scriptInjected) return;
  scriptInjected = true;

  // Create the hidden container for the Google Translate widget
  const container = document.createElement("div");
  container.id = "google_translate_element";
  container.style.display = "none";
  document.body.appendChild(container);

  // Define the callback
  (window as any).googleTranslateElementInit = () => {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,zh-CN,my",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  // Inject the script
  const script = document.createElement("script");
  script.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);

  // Inject CSS to hide the Google Translate top bar and other UI
  const style = document.createElement("style");
  style.textContent = `
    .goog-te-banner-frame, .skiptranslate, #goog-gt-tt, .goog-te-balloon-frame {
      display: none !important;
    }
    body { top: 0 !important; }
    .goog-text-highlight { background: none !important; box-shadow: none !important; }
  `;
  document.head.appendChild(style);
}

function triggerTranslation(langCode: string) {
  // Find the Google Translate select element and change its value
  const select = document.querySelector(
    ".goog-te-combo"
  ) as HTMLSelectElement | null;
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event("change"));
  }
}

function getCurrentGoogleLang(): string {
  // Check cookie for Google Translate language
  const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  return match ? match[1] : "en";
}

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectGoogleTranslateScript();
    // Detect if a language was previously selected
    const saved = getCurrentGoogleLang();
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setCurrentLang(saved);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (lang: Language) => {
    setCurrentLang(lang.code);
    setIsOpen(false);

    if (lang.code === "en") {
      // Reset to English — remove the googtrans cookie and reload
      document.cookie =
        "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
        window.location.hostname;
      // Try triggering translation to English first
      triggerTranslation("en");
      // If that doesn't fully reset, reload
      setTimeout(() => {
        const currentGoog = getCurrentGoogleLang();
        if (currentGoog !== "en") {
          window.location.reload();
        }
      }, 500);
    } else {
      // Small delay to ensure Google Translate widget is ready
      setTimeout(() => triggerTranslation(lang.code), 300);
    }
  };

  const activeLang =
    LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 transition-all cursor-pointer"
        style={{ fontSize: "0.78rem" }}
      >
        <Globe size={14} className="text-[#0369a1]" />
        <span className="hidden sm:inline text-[#0c4a6e]">
          {activeLang.flag}
        </span>
        <span className="hidden lg:inline text-[#0c4a6e]">
          {activeLang.label}
        </span>
        <ChevronDown
          size={12}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden z-50 w-48"
          >
            <div className="px-3 py-2 border-b border-blue-50">
              <p
                className="text-gray-400 uppercase tracking-wider"
                style={{ fontSize: "0.65rem" }}
              >
                Select Language
              </p>
            </div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  currentLang === lang.code
                    ? "bg-blue-50/80 text-[#0369a1]"
                    : "text-gray-700 hover:bg-blue-50/40"
                }`}
                style={{ fontSize: "0.82rem" }}
              >
                <span style={{ fontSize: "1.1rem" }}>{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div style={{ fontSize: "0.82rem" }}>{lang.label}</div>
                  <div
                    className="text-gray-400"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {lang.nativeName}
                  </div>
                </div>
                {currentLang === lang.code && (
                  <Check size={14} className="text-[#0369a1]" />
                )}
              </button>
            ))}
            <div className="px-3 py-2 border-t border-blue-50 bg-gray-50/50">
              <p className="text-gray-300 text-center" style={{ fontSize: "0.62rem" }}>
                Powered by Google Translate
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

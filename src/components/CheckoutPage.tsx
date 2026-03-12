import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Shield,
  Truck,
  Lock,
  QrCode,
  Check,
  Clock,
  Copy,
  ChevronDown,
  ChevronUp,
  Smartphone,
  CircleAlert,
  ShoppingCart,
  Package,
  Wallet,
  Landmark,
  Upload,
  ImageIcon,
  X,
  FileText,
  Download,
  Mail,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "./Layout";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import logoImage from "figma:asset/e358090199fea4196ab2121252a99683b52376f3.png";

type CheckoutStep = "information" | "payment" | "confirmation";
type PaymentMethod = "kbzpay" | "ayapay" | "uabpay" | "citizenpay" | "wavemoney";

// Country codes with flags
const countryCodes = [
  { code: "+95", flag: "🇲🇲", name: "Myanmar" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "+855", flag: "🇰🇭", name: "Cambodia" },
  { code: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
];

// Cities by country
const citiesByCountry: Record<string, string[]> = {
  Myanmar: ["Yangon", "Mandalay", "Naypyidaw", "Mawlamyine", "Bago", "Pathein", "Monywa", "Meiktila", "Sittwe", "Myitkyina", "Taunggyi", "Lashio", "Hpa-An", "Dawei", "Magway"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "San Francisco", "Seattle", "Denver", "Miami", "Boston", "Las Vegas", "Portland", "Atlanta"],
  "United Kingdom": ["London", "Birmingham", "Manchester", "Leeds", "Glasgow", "Liverpool", "Newcastle", "Sheffield", "Bristol", "Edinburgh", "Cardiff", "Belfast", "Nottingham", "Leicester", "Brighton"],
  Singapore: ["Singapore"],
  Thailand: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Nonthaburi", "Hat Yai", "Nakhon Ratchasima", "Udon Thani", "Khon Kaen", "Chiang Rai"],
  Malaysia: ["Kuala Lumpur", "George Town", "Johor Bahru", "Ipoh", "Shah Alam", "Petaling Jaya", "Kuching", "Kota Kinabalu", "Malacca", "Seremban"],
  Japan: ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Kobe", "Kyoto", "Fukuoka", "Kawasaki", "Hiroshima"],
  "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon", "Seongnam"],
  China: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Chengdu", "Hangzhou", "Wuhan", "Chongqing", "Nanjing", "Tianjin"],
  India: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Hobart", "Darwin"],
  Germany: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Dresden"],
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"],
  Italy: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Venice", "Verona"],
  Spain: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Bilbao", "Murcia", "Palma", "Granada"],
  Russia: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan", "Nizhny Novgorod", "Samara", "Chelyabinsk", "Omsk", "Rostov-on-Don"],
  Brazil: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre"],
  Mexico: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Cancún", "Mérida", "Querétaro", "Chihuahua"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Al Ain", "Umm Al Quwain"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Tabuk", "Buraidah", "Abha", "Najran"],
  Indonesia: ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang", "Denpasar", "Yogyakarta", "Batam"],
  Philippines: ["Manila", "Quezon City", "Davao", "Cebu City", "Zamboanga", "Taguig", "Pasig", "Cagayan de Oro", "Iloilo City", "Bacolod"],
  Vietnam: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hai Phong", "Can Tho", "Nha Trang", "Hue", "Bien Hoa", "Vung Tau", "Da Lat"],
  Cambodia: ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kampong Cham", "Poipet", "Kampot", "Pursat"],
  Laos: ["Vientiane", "Luang Prabang", "Savannakhet", "Pakse", "Thakhek", "Vang Vieng", "Phonsavan", "Sam Neua"],
  Bangladesh: ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Rangpur", "Comilla", "Gazipur", "Narayanganj", "Mymensingh"],
  "Sri Lanka": ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Trincomalee", "Batticaloa", "Anuradhapura", "Matara", "Nuwara Eliya"],
  Nepal: ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar", "Birgunj", "Dharan", "Butwal", "Hetauda", "Janakpur"],
  "New Zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin", "Napier", "Palmerston North", "Nelson", "Rotorua"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "East London", "Polokwane", "Nelspruit", "Kimberley"],
};

// City to State/Region mapping
const cityToState: Record<string, string> = {
  Yangon: "Yangon Region", Mandalay: "Mandalay Region", Naypyidaw: "Naypyidaw Union Territory", Mawlamyine: "Mon State", Bago: "Bago Region", Pathein: "Ayeyarwady Region", Monywa: "Sagaing Region", Meiktila: "Mandalay Region", Sittwe: "Rakhine State", Myitkyina: "Kachin State", Taunggyi: "Shan State", Lashio: "Shan State", "Hpa-An": "Kayin State", Dawei: "Tanintharyi Region", Magway: "Magway Region",
  "New York": "New York", "Los Angeles": "California", Chicago: "Illinois", Houston: "Texas", Phoenix: "Arizona", Philadelphia: "Pennsylvania", "San Antonio": "Texas", "San Diego": "California", Dallas: "Texas", "San Jose": "California", Austin: "Texas", Jacksonville: "Florida", "San Francisco": "California", Seattle: "Washington", Denver: "Colorado", Miami: "Florida", Boston: "Massachusetts", "Las Vegas": "Nevada", Portland: "Oregon", Atlanta: "Georgia",
  London: "England", Birmingham: "England", Manchester: "England", Leeds: "England", Glasgow: "Scotland", Liverpool: "England", Newcastle: "England", Sheffield: "England", Bristol: "England", Edinburgh: "Scotland", Cardiff: "Wales", Belfast: "Northern Ireland", Nottingham: "England", Leicester: "England", Brighton: "England",
  Singapore: "Singapore",
  Bangkok: "Bangkok", "Chiang Mai": "Chiang Mai", Phuket: "Phuket", Pattaya: "Chonburi", Nonthaburi: "Nonthaburi", "Hat Yai": "Songkhla", "Nakhon Ratchasima": "Nakhon Ratchasima", "Udon Thani": "Udon Thani", "Khon Kaen": "Khon Kaen", "Chiang Rai": "Chiang Rai",
  "Kuala Lumpur": "Kuala Lumpur", "George Town": "Penang", "Johor Bahru": "Johor", Ipoh: "Perak", "Shah Alam": "Selangor", "Petaling Jaya": "Selangor", Kuching: "Sarawak", "Kota Kinabalu": "Sabah", Malacca: "Malacca", Seremban: "Negeri Sembilan",
  Tokyo: "Tokyo", Osaka: "Osaka", Yokohama: "Kanagawa", Nagoya: "Aichi", Sapporo: "Hokkaido", Kobe: "Hyogo", Kyoto: "Kyoto", Fukuoka: "Fukuoka", Kawasaki: "Kanagawa", Hiroshima: "Hiroshima",
  Seoul: "Seoul", Busan: "Busan", Incheon: "Incheon", Daegu: "Daegu", Daejeon: "Daejeon", Gwangju: "Gwangju", Suwon: "Gyeonggi", Ulsan: "Ulsan", Changwon: "Gyeongsang", Seongnam: "Gyeonggi",
  Shanghai: "Shanghai", Beijing: "Beijing", Guangzhou: "Guangdong", Shenzhen: "Guangdong", Chengdu: "Sichuan", Hangzhou: "Zhejiang", Wuhan: "Hubei", Chongqing: "Chongqing", Nanjing: "Jiangsu", Tianjin: "Tianjin",
  Mumbai: "Maharashtra", Delhi: "Delhi", Bangalore: "Karnataka", Hyderabad: "Telangana", Chennai: "Tamil Nadu", Kolkata: "West Bengal", Pune: "Maharashtra", Ahmedabad: "Gujarat", Jaipur: "Rajasthan", Lucknow: "Uttar Pradesh",
  Sydney: "New South Wales", Melbourne: "Victoria", Brisbane: "Queensland", Perth: "Western Australia", Adelaide: "South Australia", "Gold Coast": "Queensland", Canberra: "ACT", Hobart: "Tasmania", Darwin: "Northern Territory",
  Berlin: "Berlin", Hamburg: "Hamburg", Munich: "Bavaria", Cologne: "North Rhine-Westphalia", Frankfurt: "Hesse", Stuttgart: "Baden-Württemberg", "Düsseldorf": "North Rhine-Westphalia", Leipzig: "Saxony", Dortmund: "North Rhine-Westphalia", Dresden: "Saxony",
  Paris: "Île-de-France", Marseille: "Provence-Alpes-Côte d'Azur", Lyon: "Auvergne-Rhône-Alpes", Toulouse: "Occitanie", Nice: "Provence-Alpes-Côte d'Azur", Nantes: "Pays de la Loire", Strasbourg: "Grand Est", Montpellier: "Occitanie", Bordeaux: "Nouvelle-Aquitaine", Lille: "Hauts-de-France",
  Rome: "Lazio", Milan: "Lombardy", Naples: "Campania", Turin: "Piedmont", Palermo: "Sicily", Genoa: "Liguria", Bologna: "Emilia-Romagna", Florence: "Tuscany", Venice: "Veneto", Verona: "Veneto",
  Madrid: "Community of Madrid", Barcelona: "Catalonia", Valencia: "Valencian Community", Seville: "Andalusia", Zaragoza: "Aragon", "Málaga": "Andalusia", Bilbao: "Basque Country", Murcia: "Region of Murcia", Palma: "Balearic Islands", Granada: "Andalusia",
  Moscow: "Moscow", "Saint Petersburg": "Saint Petersburg", Novosibirsk: "Novosibirsk Oblast", Yekaterinburg: "Sverdlovsk Oblast", Kazan: "Tatarstan", "Nizhny Novgorod": "Nizhny Novgorod Oblast", Samara: "Samara Oblast", Chelyabinsk: "Chelyabinsk Oblast", Omsk: "Omsk Oblast", "Rostov-on-Don": "Rostov Oblast",
  "São Paulo": "São Paulo", "Rio de Janeiro": "Rio de Janeiro", "Brasília": "Federal District", Salvador: "Bahia", Fortaleza: "Ceará", "Belo Horizonte": "Minas Gerais", Manaus: "Amazonas", Curitiba: "Paraná", Recife: "Pernambuco", "Porto Alegre": "Rio Grande do Sul",
  "Mexico City": "Mexico City", Guadalajara: "Jalisco", Monterrey: "Nuevo León", Puebla: "Puebla", Tijuana: "Baja California", "León": "Guanajuato", "Cancún": "Quintana Roo", "Mérida": "Yucatán", "Querétaro": "Querétaro", Chihuahua: "Chihuahua",
  Dubai: "Dubai", "Abu Dhabi": "Abu Dhabi", Sharjah: "Sharjah", Ajman: "Ajman", "Ras Al Khaimah": "Ras Al Khaimah", Fujairah: "Fujairah", "Al Ain": "Abu Dhabi", "Umm Al Quwain": "Umm Al Quwain",
  Riyadh: "Riyadh Province", Jeddah: "Makkah Province", Mecca: "Makkah Province", Medina: "Madinah Province", Dammam: "Eastern Province", Khobar: "Eastern Province", Tabuk: "Tabuk Province", Buraidah: "Qassim Province", Abha: "Asir Province", Najran: "Najran Province",
  Jakarta: "DKI Jakarta", Surabaya: "East Java", Bandung: "West Java", Medan: "North Sumatra", Semarang: "Central Java", Makassar: "South Sulawesi", Palembang: "South Sumatra", Denpasar: "Bali", Yogyakarta: "Yogyakarta", Batam: "Riau Islands",
  Manila: "Metro Manila", "Quezon City": "Metro Manila", Davao: "Davao del Sur", "Cebu City": "Cebu", Zamboanga: "Zamboanga del Sur", Taguig: "Metro Manila", Pasig: "Metro Manila", "Cagayan de Oro": "Misamis Oriental", "Iloilo City": "Iloilo", Bacolod: "Negros Occidental",
  "Ho Chi Minh City": "Ho Chi Minh City", Hanoi: "Hanoi", "Da Nang": "Da Nang", "Hai Phong": "Hai Phong", "Can Tho": "Can Tho", "Nha Trang": "Khanh Hoa", Hue: "Thua Thien Hue", "Bien Hoa": "Dong Nai", "Vung Tau": "Ba Ria-Vung Tau", "Da Lat": "Lam Dong",
  "Phnom Penh": "Phnom Penh", "Siem Reap": "Siem Reap", Battambang: "Battambang", Sihanoukville: "Preah Sihanouk", "Kampong Cham": "Kampong Cham", Poipet: "Banteay Meanchey", Kampot: "Kampot", Pursat: "Pursat",
  Vientiane: "Vientiane Prefecture", "Luang Prabang": "Luang Prabang", Savannakhet: "Savannakhet", Pakse: "Champasak", Thakhek: "Khammouane", "Vang Vieng": "Vientiane Province", Phonsavan: "Xiangkhouang", "Sam Neua": "Houaphan",
  Dhaka: "Dhaka Division", Chittagong: "Chattogram Division", Khulna: "Khulna Division", Rajshahi: "Rajshahi Division", Sylhet: "Sylhet Division", Rangpur: "Rangpur Division", Comilla: "Chattogram Division", Gazipur: "Dhaka Division", Narayanganj: "Dhaka Division", Mymensingh: "Mymensingh Division",
  Colombo: "Western Province", Kandy: "Central Province", Galle: "Southern Province", Jaffna: "Northern Province", Negombo: "Western Province", Trincomalee: "Eastern Province", Anuradhapura: "North Central Province", Matara: "Southern Province", "Nuwara Eliya": "Central Province",
  Kathmandu: "Bagmati Province", Pokhara: "Gandaki Province", Lalitpur: "Bagmati Province", Bharatpur: "Bagmati Province", Biratnagar: "Province No. 1", Birgunj: "Madhesh Province", Dharan: "Province No. 1", Butwal: "Lumbini Province", Hetauda: "Bagmati Province", Janakpur: "Madhesh Province",
  Auckland: "Auckland", Wellington: "Wellington", Christchurch: "Canterbury", Hamilton: "Waikato", Tauranga: "Bay of Plenty", Dunedin: "Otago", Napier: "Hawke's Bay", "Palmerston North": "Manawatū-Whanganui", Nelson: "Nelson", Rotorua: "Bay of Plenty",
  Johannesburg: "Gauteng", "Cape Town": "Western Cape", Durban: "KwaZulu-Natal", Pretoria: "Gauteng", "Port Elizabeth": "Eastern Cape", Bloemfontein: "Free State", "East London": "Eastern Cape", Polokwane: "Limpopo", Nelspruit: "Mpumalanga", Kimberley: "Northern Cape",
};

// Get unique states for a country
const getStatesForCountry = (countryName: string): string[] => {
  const cities = citiesByCountry[countryName] || [];
  const statesSet = new Set<string>();
  cities.forEach((city) => {
    const st = cityToState[city];
    if (st) statesSet.add(st);
  });
  return Array.from(statesSet).sort();
};

// Mock order ID generator
function generateOrderId() {
  return `GO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export function CheckoutPage() {
  const {
    cartItems,
    cartTotal,
    cartCount,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<CheckoutStep>("information");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("kbzpay");
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderId] = useState(generateOrderId);
  const [paymentTimer, setPaymentTimer] = useState(900); // 15 minutes
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Invoice auto-download & email status
  const [invoiceAutoDownloaded, setInvoiceAutoDownloaded] = useState(false);
  const [invoiceEmailed, setInvoiceEmailed] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  // Phone country code
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]); // Myanmar default
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // City dropdown
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // State dropdown
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  // Transaction proof
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Store cart items snapshot for invoice (since cart is cleared on confirmation)
  const savedCartRef = useRef<{ items: typeof cartItems; subtotal: number; count: number }>({
    items: [],
    subtotal: 0,
    count: 0,
  });

  // Customer form
  const [form, setForm] = useState({
    firstName: "Aung",
    lastName: "Kyaw",
    email: "aungkyaw@example.com",
    phone: "9 781 234 567",
    address: "No. 42, Strand Road, Botahtaung Township",
    city: "Yangon",
    state: "Yangon Region",
    zip: "11181",
    notes: "Please deliver before 5 PM. Call before arrival.",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingThreshold = 200;
  const freeShipping = cartTotal >= shippingThreshold;
  const shippingCost = freeShipping ? 0 : 15;
  const finalTotal = cartTotal + shippingCost;

  // Close country/city dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
        setCountrySearch("");
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
        setCitySearch("");
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(e.target as Node)) {
        setShowStateDropdown(false);
        setStateSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear city when country changes
  const availableCities = citiesByCountry[selectedCountry.name] || [];
  const filteredCities = availableCities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  // States for current country, filtered by search
  const availableStates = getStatesForCountry(selectedCountry.name);
  const filteredStates = availableStates.filter((st) =>
    st.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const filteredCountries = countryCodes.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  // Payment timer countdown
  useEffect(() => {
    if (step !== "payment" || orderConfirmed) return;
    const interval = setInterval(() => {
      setPaymentTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, orderConfirmed]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Auto-download invoice & simulate email when confirmation step loads
  useEffect(() => {
    if (step !== "confirmation" || invoiceAutoDownloaded) return;

    // Auto-download PDF after a short delay for the animation to play
    const downloadTimer = setTimeout(() => {
      handleDownloadInvoice();
      setInvoiceAutoDownloaded(true);
    }, 1500);

    // Simulate sending invoice email
    setEmailSending(true);
    const emailTimer = setTimeout(() => {
      setEmailSending(false);
      setInvoiceEmailed(true);
      toast.success(
        `Invoice sent to ${form.email}`,
        {
          description: "A copy of your invoice with company details has been emailed to you.",
          duration: 5000,
        }
      );
    }, 3000);

    return () => {
      clearTimeout(downloadTimer);
      clearTimeout(emailTimer);
    };
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect if cart is empty and not on confirmation
  useEffect(() => {
    if (cartItems.length === 0 && step !== "confirmation") {
      navigate("/cart");
    }
  }, [cartItems.length, step, navigate]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.zip.trim()) newErrors.zip = "ZIP code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleConfirmPayment = () => {
    if (!transactionId.trim()) {
      toast.error("Please enter your Transaction ID");
      return;
    }
    if (!screenshotFile) {
      toast.error("Please upload your transaction screenshot");
      return;
    }
    // Save cart snapshot for invoice before clearing
    savedCartRef.current = {
      items: [...cartItems],
      subtotal: cartTotal,
      count: cartCount,
    };
    setPaymentVerifying(true);
    // Simulate payment verification
    setTimeout(() => {
      setPaymentVerifying(false);
      setOrderConfirmed(true);
      setStep("confirmation");
      clearCart();
      toast.success("Payment confirmed! Your order is being processed.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2500);
  };

  const handleCopyOrderId = () => {
    const textarea = document.createElement("textarea");
    textarea.value = orderId;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    toast.success("Order ID copied!");
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (PNG, JPG, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success("Screenshot uploaded successfully!");
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
  };

  const handleDownloadInvoice = async () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentW = pageW - margin * 2;
      const cart = savedCartRef.current;
      const invoiceDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // ===== Load and add logo =====
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = logoImage;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        doc.addImage(dataUrl, "PNG", margin, 12, 36, 18);
      } catch {
        doc.setFontSize(20);
        doc.setTextColor(3, 105, 161);
        doc.text("GLORY ONE", margin, 25);
      }

      // ===== Company Letterhead =====
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Glory One Seafood Co., Ltd.", pageW - margin, 15, { align: "right" });
      doc.text("123 Ocean Drive, Suite 100", pageW - margin, 20, { align: "right" });
      doc.text("Yangon, Myanmar", pageW - margin, 25, { align: "right" });
      doc.text("Phone: +95 9 123 456 789", pageW - margin, 30, { align: "right" });
      doc.text("Email: info@gloryone.com", pageW - margin, 35, { align: "right" });

      // Decorative header line
      doc.setDrawColor(3, 105, 161);
      doc.setLineWidth(0.8);
      doc.line(margin, 42, pageW - margin, 42);
      doc.setDrawColor(186, 230, 253);
      doc.setLineWidth(0.4);
      doc.line(margin, 43.5, pageW - margin, 43.5);

      // ===== INVOICE Title =====
      let y = 52;
      doc.setFontSize(22);
      doc.setTextColor(12, 74, 110);
      doc.text("INVOICE", margin, y);

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Invoice #: INV-${orderId}`, pageW - margin, y - 5, { align: "right" });
      doc.text(`Date: ${invoiceDate}`, pageW - margin, y, { align: "right" });
      doc.text(`Transaction ID: ${transactionId || "N/A"}`, pageW - margin, y + 5, { align: "right" });

      // ===== Bill To & Ship To =====
      y = 70;
      doc.setFillColor(240, 249, 255);
      doc.roundedRect(margin, y - 3, contentW / 2 - 3, 30, 2, 2, "F");
      doc.roundedRect(margin + contentW / 2 + 3, y - 3, contentW / 2 - 3, 30, 2, 2, "F");

      doc.setFontSize(8);
      doc.setTextColor(3, 105, 161);
      doc.text("BILL TO:", margin + 4, y + 3);
      doc.setTextColor(12, 74, 110);
      doc.setFontSize(9);
      doc.text(`${form.firstName} ${form.lastName}`, margin + 4, y + 9);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(form.address, margin + 4, y + 14);
      doc.text(`${form.city}, ${form.state} ${form.zip}`, margin + 4, y + 19);
      doc.text(`Phone: ${form.phone}`, margin + 4, y + 24);

      const shipX = margin + contentW / 2 + 7;
      doc.setFontSize(8);
      doc.setTextColor(3, 105, 161);
      doc.text("SHIP TO:", shipX, y + 3);
      doc.setTextColor(12, 74, 110);
      doc.setFontSize(9);
      doc.text(`${form.firstName} ${form.lastName}`, shipX, y + 9);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(form.address, shipX, y + 14);
      doc.text(`${form.city}, ${form.state} ${form.zip}`, shipX, y + 19);
      doc.text(`Email: ${form.email}`, shipX, y + 24);

      // ===== Payment info bar =====
      y = 103;
      doc.setFillColor(3, 105, 161);
      doc.roundedRect(margin, y, contentW, 8, 1.5, 1.5, "F");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`Payment Method: ${paymentMethodLabels[paymentMethod]}`, margin + 4, y + 5.5);
      doc.text(`Order Ref: ${orderId}`, pageW - margin - 4, y + 5.5, { align: "right" });

      // ===== Items Table Header =====
      y = 118;
      doc.setFillColor(12, 74, 110);
      doc.roundedRect(margin, y, contentW, 8, 1, 1, "F");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text("#", margin + 3, y + 5.5);
      doc.text("ITEM", margin + 12, y + 5.5);
      doc.text("SIZE", margin + 95, y + 5.5);
      doc.text("QTY", margin + 120, y + 5.5);
      doc.text("PRICE", margin + 137, y + 5.5);
      doc.text("TOTAL", pageW - margin - 3, y + 5.5, { align: "right" });

      // ===== Items rows =====
      y += 12;
      doc.setFontSize(8);
      cart.items.forEach((item, i) => {
        const isEven = i % 2 === 0;
        if (isEven) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 4, contentW, 9, "F");
        }
        const lineTotal = item.size.price * item.quantity;
        doc.setTextColor(12, 74, 110);
        doc.text(`${i + 1}`, margin + 3, y + 1);
        const maxNameLen = 42;
        const name = item.title.length > maxNameLen ? item.title.substring(0, maxNameLen) + "..." : item.title;
        doc.text(name, margin + 12, y + 1);
        doc.setTextColor(100, 116, 139);
        doc.text(`${item.size.label}`, margin + 95, y + 1);
        doc.text(`${item.quantity}`, margin + 123, y + 1);
        doc.text(`$${item.size.price.toFixed(2)}`, margin + 137, y + 1);
        doc.setTextColor(12, 74, 110);
        doc.text(`$${lineTotal.toFixed(2)}`, pageW - margin - 3, y + 1, { align: "right" });
        y += 9;
      });

      // ===== Totals =====
      y += 4;
      doc.setDrawColor(186, 230, 253);
      doc.setLineWidth(0.3);
      doc.line(margin + 100, y, pageW - margin, y);
      y += 7;

      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Subtotal:", margin + 105, y);
      doc.setTextColor(12, 74, 110);
      doc.text(`$${cart.subtotal.toFixed(2)}`, pageW - margin - 3, y, { align: "right" });

      y += 6;
      const savedShipping = cart.subtotal >= 200 ? 0 : 15;
      doc.setTextColor(100, 116, 139);
      doc.text("Shipping:", margin + 105, y);
      doc.setTextColor(savedShipping === 0 ? 22 : 12, savedShipping === 0 ? 163 : 74, savedShipping === 0 ? 74 : 110);
      doc.text(savedShipping === 0 ? "FREE" : `$${savedShipping.toFixed(2)}`, pageW - margin - 3, y, { align: "right" });

      y += 3;
      doc.setDrawColor(3, 105, 161);
      doc.setLineWidth(0.5);
      doc.line(margin + 100, y, pageW - margin, y);
      y += 7;

      const savedTotal = cart.subtotal + savedShipping;
      doc.setFillColor(3, 105, 161);
      doc.roundedRect(margin + 98, y - 5, contentW - 98, 12, 2, 2, "F");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text("TOTAL:", margin + 105, y + 3);
      doc.text(`$${savedTotal.toFixed(2)}`, pageW - margin - 5, y + 3, { align: "right" });

      // ===== Footer =====
      const footerY = 265;
      doc.setDrawColor(186, 230, 253);
      doc.setLineWidth(0.3);
      doc.line(margin, footerY, pageW - margin, footerY);

      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("Thank you for choosing Glory One Seafood! We guarantee the freshest ocean products delivered to your door.", pageW / 2, footerY + 6, { align: "center" });
      doc.text("Your order will be delivered within 1-3 business days in temperature-controlled packaging.", pageW / 2, footerY + 11, { align: "center" });

      doc.setDrawColor(3, 105, 161);
      doc.setLineWidth(0.2);
      doc.line(margin, footerY + 15, pageW - margin, footerY + 15);

      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text("Glory One Seafood Co., Ltd. | www.gloryone.com | info@gloryone.com | +95 9 123 456 789", pageW / 2, footerY + 20, { align: "center" });
      doc.text("This is a computer-generated invoice and does not require a signature.", pageW / 2, footerY + 24, { align: "center" });

      // ===== Save =====
      doc.save(`GloryOne_Invoice_${orderId}.pdf`);
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate invoice. Please try again.");
    }
  };

  // QR payment data (simulated payment URL)
  const qrPaymentData = `gloryone://pay?order=${orderId}&amount=${finalTotal.toFixed(2)}&method=${paymentMethod}`;

  const paymentMethodLabels: Record<PaymentMethod, string> = {
    kbzpay: "KBZPay QR",
    ayapay: "AYAPay QR",
    uabpay: "UAB Pay QR",
    citizenpay: "Citizen Pay QR",
    wavemoney: "Wave Money QR",
  };

  // Step progress indicator
  const steps: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
    { key: "information", label: "Information", icon: <Smartphone size={16} /> },
    { key: "payment", label: "Payment", icon: <QrCode size={16} /> },
    { key: "confirmation", label: "Confirmation", icon: <Check size={16} /> },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  if (cartItems.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingCart size={40} className="text-[#0369a1]/40" />
          </div>
          <h2 className="text-[#0c4a6e] mb-2" style={{ fontSize: "1.5rem" }}>
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-md" style={{ fontSize: "0.9rem" }}>
            Add some items to your cart before checking out.
          </p>
          <Link
            to="/all-seafood"
            className="inline-flex items-center gap-2 bg-[#0369a1] text-white px-6 py-3 rounded-full hover:bg-[#0c4a6e] transition-colors"
            style={{ fontSize: "0.9rem" }}
          >
            <Package size={18} />
            Browse Seafood
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6" style={{ fontSize: "0.85rem" }}>
        <Link to="/" className="text-[#0369a1] hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link to="/cart" className="text-[#0369a1] hover:underline">
          Cart
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700">Checkout</span>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  i < stepIndex
                    ? "bg-green-500 text-white"
                    : i === stepIndex
                      ? "bg-[#0369a1] text-white shadow-lg shadow-blue-200"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < stepIndex ? <Check size={18} /> : s.icon}
              </div>
              <span
                className={`mt-2 ${i === stepIndex ? "text-[#0369a1]" : i < stepIndex ? "text-green-600" : "text-gray-400"}`}
                style={{ fontSize: "0.75rem" }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded-full transition-all ${
                  i < stepIndex ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* STEP 1: Customer Information */}
            {step === "information" && (
              <motion.div
                key="information"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-[#0c4a6e] mb-6" style={{ fontSize: "1.35rem" }}>
                  Shipping Information
                </h2>

                <div className="bg-white border border-blue-50 rounded-2xl p-6 shadow-sm space-y-5">
                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.firstName ? "border-red-300 bg-red-50/30" : "border-gray-200"} focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all`}
                        style={{ fontSize: "0.9rem" }}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 mt-1 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                          <CircleAlert size={12} /> {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.lastName ? "border-red-300 bg-red-50/30" : "border-gray-200"} focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all`}
                        style={{ fontSize: "0.9rem" }}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 mt-1 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                          <CircleAlert size={12} /> {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? "border-red-300 bg-red-50/30" : "border-gray-200"} focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all`}
                        style={{ fontSize: "0.9rem" }}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 mt-1 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                          <CircleAlert size={12} /> {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                        Phone Number *
                      </label>
                      <div className="relative flex" ref={countryDropdownRef}>
                        {/* Country Code Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowCountryDropdown(!showCountryDropdown);
                            setCountrySearch("");
                          }}
                          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-l-lg border border-r-0 ${errors.phone ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-gray-50"} hover:bg-gray-100 transition-colors cursor-pointer shrink-0`}
                          style={{ fontSize: "0.85rem" }}
                        >
                          <span style={{ fontSize: "1.1rem" }}>{selectedCountry.flag}</span>
                          <span className="text-gray-700">{selectedCountry.code}</span>
                          <ChevronDown size={13} className={`text-gray-400 transition-transform ${showCountryDropdown ? "rotate-180" : ""}`} />
                        </button>

                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                            {/* Search */}
                            <div className="p-2 border-b border-gray-100">
                              <input
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                placeholder="Search country..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none"
                                style={{ fontSize: "0.82rem" }}
                                autoFocus
                              />
                            </div>
                            {/* List */}
                            <div className="max-h-48 overflow-y-auto">
                              {filteredCountries.map((country) => (
                                <button
                                  key={country.code + country.name}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setShowCountryDropdown(false);
                                    setCountrySearch("");
                                    // Clear city and state when country changes
                                    setForm((prev) => ({ ...prev, city: "", state: "" }));
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left cursor-pointer ${
                                    selectedCountry.code === country.code && selectedCountry.name === country.name
                                      ? "bg-blue-50/70"
                                      : ""
                                  }`}
                                >
                                  <span style={{ fontSize: "1.15rem" }}>{country.flag}</span>
                                  <span className="text-gray-700 flex-1 truncate" style={{ fontSize: "0.82rem" }}>
                                    {country.name}
                                  </span>
                                  <span className="text-gray-400 shrink-0" style={{ fontSize: "0.78rem" }}>
                                    {country.code}
                                  </span>
                                  {selectedCountry.code === country.code && selectedCountry.name === country.name && (
                                    <Check size={14} className="text-[#0369a1] shrink-0" />
                                  )}
                                </button>
                              ))}
                              {filteredCountries.length === 0 && (
                                <p className="text-gray-400 text-center py-3" style={{ fontSize: "0.8rem" }}>
                                  No countries found
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Phone Input */}
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-r-lg border ${errors.phone ? "border-red-300 bg-red-50/30" : "border-gray-200"} focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all`}
                          style={{ fontSize: "0.9rem" }}
                          placeholder="9 123 456 789"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 mt-1 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                          <CircleAlert size={12} /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border ${errors.address ? "border-red-300 bg-red-50/30" : "border-gray-200"} focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all`}
                      style={{ fontSize: "0.9rem" }}
                      placeholder="123 Ocean Drive"
                    />
                    {errors.address && (
                      <p className="text-red-500 mt-1 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                        <CircleAlert size={12} /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                        City *
                      </label>
                      <div className="relative" ref={cityDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCityDropdown(!showCityDropdown);
                            setCitySearch("");
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border ${errors.city ? "border-red-300 bg-red-50/30" : "border-gray-200"} hover:bg-gray-50 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all text-left cursor-pointer`}
                          style={{ fontSize: "0.9rem" }}
                        >
                          <span className={form.city ? "text-gray-900" : "text-gray-400"}>
                            {form.city || "Select city"}
                          </span>
                          <ChevronDown size={14} className={`text-gray-400 transition-transform shrink-0 ml-2 ${showCityDropdown ? "rotate-180" : ""}`} />
                        </button>

                        {showCityDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                            {/* Search */}
                            <div className="p-2 border-b border-gray-100">
                              <input
                                type="text"
                                value={citySearch}
                                onChange={(e) => setCitySearch(e.target.value)}
                                placeholder="Search city..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none"
                                style={{ fontSize: "0.82rem" }}
                                autoFocus
                              />
                            </div>
                            {/* City List */}
                            <div className="max-h-48 overflow-y-auto">
                              {filteredCities.map((city) => (
                                <button
                                  key={city}
                                  type="button"
                                  onClick={() => {
                                    const autoState = cityToState[city] || "";
                                    setForm((prev) => ({ ...prev, city, state: autoState }));
                                    setShowCityDropdown(false);
                                    setCitySearch("");
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left cursor-pointer ${
                                    form.city === city ? "bg-blue-50/70" : ""
                                  }`}
                                >
                                  <MapPin size={13} className="text-gray-400 shrink-0" />
                                  <span className="text-gray-700 flex-1 truncate" style={{ fontSize: "0.82rem" }}>
                                    {city}
                                  </span>
                                  {form.city === city && (
                                    <Check size={14} className="text-[#0369a1] shrink-0" />
                                  )}
                                </button>
                              ))}
                              {filteredCities.length === 0 && (
                                <p className="text-gray-400 text-center py-3" style={{ fontSize: "0.8rem" }}>
                                  {availableCities.length === 0
                                    ? `No cities for ${selectedCountry.name}`
                                    : "No matching cities"}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.city && (
                        <p className="text-red-500 mt-1 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                          <CircleAlert size={12} /> {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                        State *
                      </label>
                      <div className="relative" ref={stateDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowStateDropdown(!showStateDropdown);
                            setStateSearch("");
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border ${errors.state ? "border-red-300 bg-red-50/30" : "border-gray-200"} hover:bg-gray-50 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all text-left cursor-pointer`}
                          style={{ fontSize: "0.9rem" }}
                        >
                          <span className={`truncate ${form.state ? "text-gray-900" : "text-gray-400"}`}>
                            {form.state || "Select state"}
                          </span>
                          <ChevronDown size={14} className={`text-gray-400 transition-transform shrink-0 ml-2 ${showStateDropdown ? "rotate-180" : ""}`} />
                        </button>

                        {showStateDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden" style={{ minWidth: "200px" }}>
                            {/* Search */}
                            <div className="p-2 border-b border-gray-100">
                              <input
                                type="text"
                                value={stateSearch}
                                onChange={(e) => setStateSearch(e.target.value)}
                                placeholder="Search state..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none"
                                style={{ fontSize: "0.82rem" }}
                                autoFocus
                              />
                            </div>
                            {/* State List */}
                            <div className="max-h-48 overflow-y-auto">
                              {filteredStates.map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    setForm((prev) => ({ ...prev, state: st }));
                                    setShowStateDropdown(false);
                                    setStateSearch("");
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left cursor-pointer ${
                                    form.state === st ? "bg-blue-50/70" : ""
                                  }`}
                                >
                                  <MapPin size={13} className="text-gray-400 shrink-0" />
                                  <span className="text-gray-700 flex-1 truncate" style={{ fontSize: "0.82rem" }}>
                                    {st}
                                  </span>
                                  {form.state === st && (
                                    <Check size={14} className="text-[#0369a1] shrink-0" />
                                  )}
                                </button>
                              ))}
                              {filteredStates.length === 0 && (
                                <p className="text-gray-400 text-center py-3" style={{ fontSize: "0.8rem" }}>
                                  {availableStates.length === 0
                                    ? `No states for ${selectedCountry.name}`
                                    : "No matching states"}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.state && (
                        <p className="text-red-500 mt-1 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                          <CircleAlert size={12} /> {errors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={form.zip}
                        onChange={(e) => setForm({ ...form, zip: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.zip ? "border-red-300 bg-red-50/30" : "border-gray-200"} focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all`}
                        style={{ fontSize: "0.9rem" }}
                        placeholder="33101"
                      />
                      {errors.zip && (
                        <p className="text-red-500 mt-1 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                          <CircleAlert size={12} /> {errors.zip}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Notes */}
                  <div>
                    <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all resize-none"
                      style={{ fontSize: "0.9rem" }}
                      placeholder="Leave at front door, ring bell, etc."
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex items-center justify-between mt-6">
                  <Link
                    to="/cart"
                    className="flex items-center gap-2 text-[#0369a1] hover:text-[#0c4a6e] transition-colors"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <ArrowLeft size={16} />
                    Back to Cart
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToPayment}
                    className="bg-[#0369a1] text-white px-8 py-3 rounded-xl hover:bg-[#0c4a6e] transition-colors cursor-pointer flex items-center gap-2"
                    style={{ fontSize: "0.95rem" }}
                  >
                    Continue to Payment
                    <QrCode size={18} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Payment */}
            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-[#0c4a6e] mb-6" style={{ fontSize: "1.35rem" }}>
                  Payment
                </h2>

                {/* Payment Method Selection */}
                <div className="bg-white border border-blue-50 rounded-2xl p-6 shadow-sm mb-6">
                  <p className="text-gray-600 mb-4" style={{ fontSize: "0.85rem" }}>
                    Select your payment method
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "kbzpay" as PaymentMethod,
                        label: "KBZPay QR",
                        desc: "Scan & pay with KBZ",
                        icon: <Landmark size={22} />,
                      },
                      {
                        id: "ayapay" as PaymentMethod,
                        label: "AYAPay QR",
                        desc: "Scan & pay with AYA",
                        icon: <Landmark size={22} />,
                      },
                      {
                        id: "uabpay" as PaymentMethod,
                        label: "UAB Pay QR",
                        desc: "Scan & pay with UAB",
                        icon: <Smartphone size={22} />,
                      },
                      {
                        id: "citizenpay" as PaymentMethod,
                        label: "Citizen Pay QR",
                        desc: "CB Bank mobile pay",
                        icon: <Wallet size={22} />,
                      },
                      {
                        id: "wavemoney" as PaymentMethod,
                        label: "Wave Money QR",
                        desc: "Pay with Wave wallet",
                        icon: <QrCode size={22} />,
                      },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                          paymentMethod === method.id
                            ? "border-[#0369a1] bg-blue-50/50 shadow-md"
                            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/20"
                        }`}
                      >
                        <span
                          className={`block mb-2 ${paymentMethod === method.id ? "text-[#0369a1]" : "text-gray-400"}`}
                        >
                          {method.icon}
                        </span>
                        <span
                          className={`block ${paymentMethod === method.id ? "text-[#0369a1]" : "text-[#0c4a6e]"}`}
                          style={{ fontSize: "0.9rem" }}
                        >
                          {method.label}
                        </span>
                        <span className="text-gray-400 block" style={{ fontSize: "0.72rem" }}>
                          {method.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* QR Payment Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={paymentMethod}
                  className="bg-white border border-blue-50 rounded-2xl p-6 shadow-sm"
                >
                  <div className="text-center">
                    {/* Selected Method Label */}
                    <p className="text-[#0369a1] mb-3" style={{ fontSize: "0.9rem" }}>
                      Pay with {paymentMethodLabels[paymentMethod]}
                    </p>
                    {/* Timer */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      
                      
                    </div>

                    {/* QR Code */}
                    <div className="inline-block p-5 bg-white rounded-2xl border-2 border-blue-100 shadow-inner mb-4">
                      <QRCodeSVG
                        value={qrPaymentData}
                        size={200}
                        level="H"
                        bgColor="#FFFFFF"
                        fgColor="#0c4a6e"
                        imageSettings={{
                          src: "",
                          height: 0,
                          width: 0,
                          excavate: false,
                        }}
                      />
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                      <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>
                        Amount to pay
                      </p>
                      <p className="text-[#0369a1]" style={{ fontSize: "2rem" }}>
                        ${finalTotal.toFixed(2)}
                      </p>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50/60 rounded-xl px-5 py-4 text-left mb-4 max-w-md mx-auto">
                      <p className="text-[#0c4a6e] mb-3" style={{ fontSize: "0.85rem" }}>
                        How to pay:
                      </p>
                      <ol className="space-y-2">
                        {[
                          "Open your banking or payment app",
                          "Select \"Scan QR Code\" option",
                          "Point your camera at the QR code above",
                          "Verify the amount and confirm payment",
                        ].map((instruction, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span
                              className="w-5 h-5 rounded-full bg-[#0369a1] text-white flex items-center justify-center shrink-0 mt-0.5"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {i + 1}
                            </span>
                            <span className="text-gray-600" style={{ fontSize: "0.82rem" }}>
                              {instruction}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Order Reference */}
                    <div className="flex items-center justify-center gap-2 mb-5">
                      <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>
                        Order Ref:
                      </span>
                      <code
                        className="bg-gray-100 text-[#0c4a6e] px-2 py-0.5 rounded"
                        style={{ fontSize: "0.78rem" }}
                      >
                        {orderId}
                      </code>
                      <button
                        onClick={handleCopyOrderId}
                        className="text-gray-400 hover:text-[#0369a1] transition-colors cursor-pointer"
                      >
                        <Copy size={14} />
                      </button>
                    </div>

                    {/* Transaction Proof Section */}
                    <div className="border-t border-blue-100 pt-5 mt-5 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <FileText size={16} className="text-[#0369a1]" />
                        <p className="text-[#0c4a6e]" style={{ fontSize: "0.9rem" }}>
                          Payment Verification
                        </p>
                      </div>
                      <p className="text-gray-400 mb-4" style={{ fontSize: "0.78rem" }}>
                        After completing the QR payment, please provide your transaction details below for verification.
                      </p>

                      {/* Transaction ID Input */}
                      <div className="text-left mb-4">
                        <label className="flex items-center gap-1.5 text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                          <FileText size={13} />
                          Transaction ID *
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0369a1] focus:ring-2 focus:ring-[#0369a1]/10 outline-none transition-all bg-white"
                          style={{ fontSize: "0.9rem" }}
                          placeholder="e.g. TXN-20260304-XXXXXX"
                        />
                        {!transactionId.trim() && (
                          <p className="text-gray-300 mt-1" style={{ fontSize: "0.72rem" }}>
                            Enter the transaction ID from your payment app
                          </p>
                        )}
                      </div>

                      {/* Screenshot Upload */}
                      <div className="text-left mb-4">
                        <label className="flex items-center gap-1.5 text-gray-600 mb-1.5" style={{ fontSize: "0.82rem" }}>
                          <ImageIcon size={13} />
                          Transaction Screenshot *
                        </label>

                        <AnimatePresence mode="wait">
                          {screenshotPreview ? (
                            <motion.div
                              key="preview"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="relative rounded-xl overflow-hidden border-2 border-green-200 bg-green-50/20"
                            >
                              <img
                                src={screenshotPreview}
                                alt="Transaction Screenshot"
                                className="w-full max-h-48 object-contain bg-gray-50 rounded-t-xl"
                              />
                              <div className="flex items-center justify-between p-3 bg-white border-t border-green-100">
                                <div className="flex items-center gap-2">
                                  <Check size={14} className="text-green-600" />
                                  <span className="text-green-700 truncate max-w-[180px]" style={{ fontSize: "0.78rem" }}>
                                    {screenshotFile?.name}
                                  </span>
                                  <span className="text-gray-300" style={{ fontSize: "0.7rem" }}>
                                    ({((screenshotFile?.size || 0) / 1024).toFixed(0)} KB)
                                  </span>
                                </div>
                                <button
                                  onClick={handleRemoveScreenshot}
                                  className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1 rounded-lg hover:bg-red-50"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.label
                              key="upload"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="block cursor-pointer"
                            >
                              <div className="border-2 border-dashed border-gray-200 hover:border-[#0369a1] rounded-xl p-6 text-center transition-all hover:bg-blue-50/30 group">
                                <Upload size={28} className="mx-auto mb-2 text-gray-300 group-hover:text-[#0369a1] transition-colors" />
                                <p className="text-gray-500 group-hover:text-[#0369a1] transition-colors" style={{ fontSize: "0.85rem" }}>
                                  Click to upload screenshot
                                </p>
                                <p className="text-gray-300 mt-1" style={{ fontSize: "0.72rem" }}>
                                  PNG, JPG, or WebP (max 5MB)
                                </p>
                              </div>
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                onChange={handleScreenshotUpload}
                                className="hidden"
                              />
                            </motion.label>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Status indicators */}
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${transactionId.trim() ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className={`${transactionId.trim() ? "text-green-600" : "text-gray-400"}`} style={{ fontSize: "0.72rem" }}>
                            Transaction ID
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${screenshotFile ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className={`${screenshotFile ? "text-green-600" : "text-gray-400"}`} style={{ fontSize: "0.72rem" }}>
                            Screenshot
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Payment Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmPayment}
                      disabled={paymentVerifying || paymentTimer === 0}
                      className={`w-full max-w-sm mx-auto py-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                        paymentVerifying
                          ? "bg-amber-500 text-white"
                          : paymentTimer === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                      style={{ fontSize: "0.95rem" }}
                    >
                      {paymentVerifying ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Clock size={18} />
                          </motion.div>
                          Verifying Payment...
                        </>
                      ) : paymentTimer === 0 ? (
                        "Payment Expired"
                      ) : (
                        <>
                          <Check size={18} />
                          I've Completed the Payment
                        </>
                      )}
                    </motion.button>

                    {paymentTimer === 0 && (
                      <button
                        onClick={() => setPaymentTimer(900)}
                        className="mt-3 text-[#0369a1] hover:underline cursor-pointer"
                        style={{ fontSize: "0.82rem" }}
                      >
                        Generate new QR code
                      </button>
                    )}
                  </div>
                </motion.div>

                {/* Back */}
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setStep("information");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 text-[#0369a1] hover:text-[#0c4a6e] transition-colors cursor-pointer"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <ArrowLeft size={16} />
                    Back to Information
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Confirmation */}
            {step === "confirmation" && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Check size={44} className="text-green-600" />
                  </motion.div>
                </motion.div>

                <h2 className="text-[#0c4a6e] mb-2" style={{ fontSize: "1.5rem" }}>
                  Order Confirmed!
                </h2>
                <p className="text-gray-500 mb-4 max-w-md mx-auto" style={{ fontSize: "0.9rem" }}>
                  Thank you for your order! Your fresh seafood is being prepared for shipping.
                </p>

                {/* Invoice Email Notification */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="max-w-md mx-auto mb-6"
                >
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    invoiceEmailed
                      ? "bg-green-50 border-green-200"
                      : emailSending
                        ? "bg-amber-50 border-amber-200"
                        : "bg-gray-50 border-gray-200"
                  }`}>
                    {emailSending ? (
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Mail size={18} className="text-amber-500 shrink-0" />
                      </motion.div>
                    ) : invoiceEmailed ? (
                      <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                    ) : (
                      <Mail size={18} className="text-gray-400 shrink-0" />
                    )}
                    <div className="text-left flex-1 min-w-0">
                      <p className={`${invoiceEmailed ? "text-green-700" : emailSending ? "text-amber-700" : "text-gray-600"}`} style={{ fontSize: "0.82rem" }}>
                        {emailSending
                          ? "Sending invoice to your email..."
                          : invoiceEmailed
                            ? "Invoice sent successfully!"
                            : "Invoice will be sent to your email"
                        }
                      </p>
                      <p className="text-gray-400 truncate" style={{ fontSize: "0.72rem" }}>
                        {form.email}
                      </p>
                    </div>
                    {invoiceEmailed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                      >
                        <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded-full" style={{ fontSize: "0.68rem" }}>
                          Delivered
                        </span>
                      </motion.div>
                    )}
                    {emailSending && (
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <span className="text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full" style={{ fontSize: "0.68rem" }}>
                          Sending...
                        </span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Order Details Card */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm max-w-lg mx-auto mb-8 text-left">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500" style={{ fontSize: "0.82rem" }}>
                      Order Number
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="text-[#0369a1] bg-blue-50 px-2 py-0.5 rounded" style={{ fontSize: "0.85rem" }}>
                        {orderId}
                      </code>
                      <button onClick={handleCopyOrderId} className="text-gray-400 hover:text-[#0369a1] cursor-pointer">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500" style={{ fontSize: "0.82rem" }}>
                      Payment Method
                    </span>
                    <span className="text-[#0c4a6e]" style={{ fontSize: "0.85rem" }}>
                      {paymentMethodLabels[paymentMethod]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500" style={{ fontSize: "0.82rem" }}>
                      Shipping To
                    </span>
                    <span className="text-[#0c4a6e] text-right" style={{ fontSize: "0.85rem" }}>
                      {form.firstName} {form.lastName}
                      <br />
                      <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>
                        {form.city}, {form.state} {form.zip}
                      </span>
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="text-gray-500" style={{ fontSize: "0.82rem" }}>
                      Total Paid
                    </span>
                    <span className="text-[#0369a1]" style={{ fontSize: "1.25rem" }}>
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-blue-50/60 rounded-xl px-5 py-4 max-w-lg mx-auto mb-8">
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-[#0369a1] shrink-0" />
                    <div className="text-left">
                      <p className="text-[#0c4a6e]" style={{ fontSize: "0.85rem" }}>
                        Estimated Delivery
                      </p>
                      <p className="text-gray-500" style={{ fontSize: "0.78rem" }}>
                        Your order will be delivered within 1-3 business days in temperature-controlled packaging.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Invoice */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="max-w-lg mx-auto mb-8"
                >
                  {invoiceAutoDownloaded ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-green-600" style={{ fontSize: "0.85rem" }}>
                        <CheckCircle2 size={16} />
                        <span>Invoice PDF downloaded automatically</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownloadInvoice}
                        className="w-full bg-white border-2 border-[#0369a1] text-[#0369a1] py-3.5 rounded-xl hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-3"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <Download size={18} />
                        Download Invoice Again
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-gray-400" style={{ fontSize: "0.82rem" }}>
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Download size={16} />
                        </motion.div>
                        <span>Preparing invoice for download...</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownloadInvoice}
                        className="w-full bg-gradient-to-r from-[#0c4a6e] to-[#0369a1] text-white py-4 rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-200/70 transition-all cursor-pointer flex items-center justify-center gap-3"
                        style={{ fontSize: "0.95rem" }}
                      >
                        <Download size={20} />
                        Download Invoice (PDF)
                      </motion.button>
                    </div>
                  )}
                  <p className="text-gray-400 mt-2" style={{ fontSize: "0.72rem" }}>
                    Company letterhead invoice with full order details
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/"
                    className="bg-[#0369a1] text-white px-8 py-3 rounded-xl hover:bg-[#0c4a6e] transition-colors flex items-center gap-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/all-seafood"
                    className="border border-[#0369a1] text-[#0369a1] px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Browse More Seafood
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        {step !== "confirmation" && (
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm sticky top-28"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#0c4a6e]" style={{ fontSize: "1.1rem" }}>
                  Order Summary
                </h3>
                <button
                  onClick={() => setShowOrderDetails(!showOrderDetails)}
                  className="text-[#0369a1] flex items-center gap-1 cursor-pointer"
                  style={{ fontSize: "0.78rem" }}
                >
                  {showOrderDetails ? "Hide" : "Show"} items
                  {showOrderDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Collapsible Item List */}
              <AnimatePresence>
                {showOrderDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                      {cartItems.map((item) => (
                        <div key={`${item.productId}-${item.size.label}`} className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 rounded-lg object-cover border border-blue-100"
                            />
                            <span
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#0369a1] text-white rounded-full flex items-center justify-center"
                              style={{ fontSize: "0.65rem" }}
                            >
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#0c4a6e] truncate" style={{ fontSize: "0.8rem" }}>
                              {item.title}
                            </p>
                            <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>
                              {item.size.label} · {item.size.weight}
                            </p>
                          </div>
                          <span className="text-[#0c4a6e] shrink-0" style={{ fontSize: "0.82rem" }}>
                            ${(item.size.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Totals */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500" style={{ fontSize: "0.85rem" }}>
                    Subtotal ({cartCount} items)
                  </span>
                  <span className="text-[#0c4a6e]" style={{ fontSize: "0.9rem" }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500" style={{ fontSize: "0.85rem" }}>
                    Shipping
                  </span>
                  <span className={freeShipping ? "text-green-600" : "text-[#0c4a6e]"} style={{ fontSize: "0.9rem" }}>
                    {freeShipping ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span className="text-[#0c4a6e]" style={{ fontSize: "1rem" }}>
                    Total
                  </span>
                  <span className="text-[#0369a1]" style={{ fontSize: "1.25rem" }}>
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
                <Lock size={14} className="text-green-600" />
                <span className="text-gray-400" style={{ fontSize: "0.72rem" }}>
                  256-bit SSL Encrypted Payment
                </span>
              </div>

              {/* Trust Icons */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: <Truck size={16} />, label: "Fast Delivery" },
                  { icon: <Shield size={16} />, label: "Secure Payment" },
                  { icon: <Package size={16} />, label: "Fresh Guaranteed" },
                ].map((badge) => (
                  <div key={badge.label} className="flex flex-col items-center gap-1">
                    <span className="text-[#0369a1]">{badge.icon}</span>
                    <span className="text-gray-500" style={{ fontSize: "0.65rem" }}>
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
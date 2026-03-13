import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Outlet, useOutlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import imgImage from "/Logo.svg";
import {
  LayoutDashboard,
  Users,
  Car,
  MapPin,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Menu,
  X,
  IdCard,
  FileText,
  ScrollText,
  Code,
  Server,
  Database,
  GitBranch,
  ArrowRightLeft,
  Droplets,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { LicenseTypeList } from "./LicenseTypeList";
import { FrontendDev } from "./FrontendDev";
import { BackendDev } from "./BackendDev";
import { DatabaseDiagramAndSchema } from "./DatabaseDiagramAndSchema";
import { BloodTypeList } from "./BloodTypeList";
import { LicensePolicyList } from "./LicensePolicyList";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface UserProfile {
  email: string;
  name: string;
  role: string;
  avatar: string;
  loginAt: string;
  keepSignedIn: boolean;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Drivers", active: false },
  { icon: Users, label: "Passengers", active: false },
  { icon: Car, label: "Vehicles", active: false },
  { icon: MapPin, label: "Rides", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    const stored = sessionStorage.getItem("innotaxi_active_item");
    return stored || "Dashboard";
  });
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
    const stored = sessionStorage.getItem("innotaxi_active_item");
    if (stored === "Diagram and Schema" || stored === "Schema" || stored === "Migration") {
      return { database: true };
    }
    return {};
  });
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notifications] = useState(3);
  const [headerSearch, setHeaderSearch] = useState("");
  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);
  const headerSearchRef = useRef<HTMLDivElement>(null);
  const headerSearchInputRef = useRef<HTMLInputElement>(null);
  const [devUpdateToasts, setDevUpdateToasts] = useState<number[]>([]);

  // Searchable pages & components
  const searchableItems = useMemo(() => [
    // ─── Frontend Pages ───
    { label: "Login Page", section: "Frontend", icon: Code, target: "Frontend", pageId: "login", description: "Authentication page with PrimeUI form components", route: "/" },
    { label: "Driver License Type List", section: "Frontend", icon: Code, target: "Frontend", pageId: "license-list", description: "Data table with charts for driver license type management", route: "/dashboard (Driver License Type)" },
    { label: "License Policy List", section: "Frontend", icon: Code, target: "Frontend", pageId: "policy-list", description: "Data table with charts for license policy management", route: "/dashboard (License Policy)" },
    { label: "Blood Type List", section: "Frontend", icon: Code, target: "Frontend", pageId: "blood-type-list", description: "Data table with charts for blood type management", route: "/dashboard (Blood Type)" },
    { label: "Driver License Type Detail", section: "Frontend", icon: Code, target: "Frontend", pageId: "license-detail", description: "Detail view with update form and monthly statistics chart", route: "/dashboard/license-types/:id" },
    { label: "License Policy Detail", section: "Frontend", icon: Code, target: "Frontend", pageId: "policy-list", description: "Detail view with update form for license policy", route: "/dashboard/license-policy/:id" },
    // ─── Frontend Components ───
    { label: "Login Form", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "login", description: "Complete login form with email/password validation, auto-fill, and demo credentials" },
    { label: "Bar Chart", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-list", description: "Drivers by Driver License Type — Grouped Bar Chart" },
    { label: "Doughnut Chart", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-list", description: "Driver Distribution — Doughnut/Pie Chart" },
    { label: "Data Table (License Type)", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-list", description: "Search, Filter, Export, Columns, Pagination" },
    { label: "Data Table (License Policy)", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "policy-list", description: "Search, Filter, Export, Columns, Pagination" },
    { label: "Add Policy Form", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "policy-list", description: "POST /api/v1/license-policies" },
    { label: "Detail Policy View", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "policy-list", description: "GET /api/v1/license-policies/:id" },
    { label: "Data Table (Blood Type)", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "blood-type-list", description: "Search, Filter, Export, Columns, Pagination" },
    { label: "Detail View", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-detail", description: "GET /api/v1/license-types/:id" },
    { label: "Update Form", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-detail", description: "PUT /api/v1/license-types/:id" },
    { label: "Monthly Driver Chart", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-detail", description: "Monthly driver count line/area chart with year filter" },
    // ─── Backend Pages ───
    { label: "Driver License Type List", section: "Backend", icon: Server, target: "Backend", pageId: "license-list", description: "Statistics endpoints and CRUD API for driver license type management", route: "/api/v1/license-types" },
    { label: "Driver License Type Detail", section: "Backend", icon: Server, target: "Backend", pageId: "license-detail", description: "Single resource endpoints with update and monthly analytics", route: "/api/v1/license-types/:id" },
    { label: "Driver License Policy", section: "Backend", icon: Server, target: "Backend", pageId: "license-policy", description: "Endpoints for managing driver license policies", route: "/api/v1/license-policies" },
    { label: "Driver License Policy Detail", section: "Backend", icon: Server, target: "Backend", pageId: "license-policy-detail", description: "Single resource endpoints with update for license policies", route: "/api/v1/license-policies/:id" },
    { label: "Blood Type", section: "Backend", icon: Server, target: "Backend", pageId: "blood-type", description: "Endpoints for managing blood type master data", route: "/api/v1/blood-types" },
    // ─── Backend Components ───
    { label: "Bar Chart Statistics", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-list", description: "Driver count by driver license type with status breakdown" },
    { label: "Distribution Statistics", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-list", description: "Driver distribution across all license categories" },
    { label: "CRUD Operations", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-list", description: "Full REST API with pagination, search, filter, sort, and soft delete" },
    { label: "Detail Endpoint", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-detail", description: "Retrieve single driver license type with relations and metadata" },
    { label: "Update Endpoint", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-detail", description: "Update driver license type fields with validation and audit logging" },
    { label: "Monthly Analytics", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-detail", description: "Monthly driver registration count with year filter" },
    { label: "License Policy Endpoint", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-policy", description: "Retrieve and manage driver license policies" },
    { label: "Create Policy Endpoint", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-policy", description: "Create new driver license policy" },
    { label: "Detail & Update Policy Endpoint", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-policy-detail", description: "Retrieve and update single license policy with validation" },
    { label: "Blood Type CRUD", section: "Backend Component", icon: Server, target: "Backend", pageId: "blood-type", description: "Full REST API for blood type management with soft delete" },
  ], []);

  const filteredSearchItems = useMemo(() => {
    if (!headerSearch.trim()) return [];
    const lower = headerSearch.toLowerCase();
    return searchableItems.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.section.toLowerCase().includes(lower)
    );
  }, [headerSearch, searchableItems]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headerSearchRef.current && !headerSearchRef.current.contains(e.target as Node)) {
        setHeaderSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setHeaderSearchFocused(true);
        setTimeout(() => headerSearchInputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setHeaderSearchFocused(false);
        setHeaderSearch("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSearchSelect = (target: string, pageId?: string) => {
    setActiveItem(target);
    setHeaderSearch("");
    setHeaderSearchFocused(false);
    if (target === "Diagram and Schema") {
      setExpandedMenus((prev) => ({ ...prev, database: true }));
    }
    // Store the target page ID so FrontendDev/BackendDev can auto-expand it
    if (pageId) {
      sessionStorage.setItem("innotaxi_dev_search_target", pageId);
    }
    if (location.pathname !== "/dashboard") navigate("/dashboard");
  };

  useEffect(() => {
    sessionStorage.setItem("innotaxi_active_item", activeItem);
  }, [activeItem]);

  useEffect(() => {
    const stored = localStorage.getItem("innotaxi_user");
    if (!stored) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  // Sync sidebar active item when navigating to detail route
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard/license-types/")) {
      setActiveItem("Driver License Type");
    }
    if (location.pathname.startsWith("/dashboard/license-policy/")) {
      setActiveItem("License Policy");
    }
    // Handle navigation state (e.g. returning from add page)
    if (location.state?.activeItem) {
      setActiveItem(location.state.activeItem);
    }
  }, [location.pathname, location.state]);

  const handleLogout = () => {
    localStorage.removeItem("innotaxi_user");
    localStorage.removeItem("innotaxi_credentials");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-['Inter',sans-serif] overflow-hidden">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 h-full bg-white border-r border-[#e2e8f0] flex flex-col transition-all duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarOpen ? "w-[260px]" : "w-[72px]"}
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} p-4 border-b border-[#e2e8f0]`}>
          <div className={`flex items-center gap-2.5 ${!sidebarOpen && "hidden"}`}>
            <img
              src={imgImage}
              alt="InnoTaxi"
              className="w-9 h-9 rounded-[12px] object-cover"
            />
            <div>
              <p className="text-[16px] text-[#0f172a]">
                <span className="font-semibold">Inno</span>
                <span className="text-[#94a3b8]">Taxi</span>
              </p>
              <p className="text-[9px] tracking-[1.2px] uppercase text-[#e53935] font-medium">
                Admin
              </p>
            </div>
          </div>
          {!sidebarOpen && (
            <img
              src={imgImage}
              alt="InnoTaxi"
              className="w-9 h-9 rounded-[12px] object-cover"
            />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#94a3b8] hover:text-[#475569] hover:border-[#cbd5e1] transition-all cursor-pointer"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#475569] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {/* Main menu items */}
          <div className="flex flex-col gap-0.5">
            {sidebarItems.map((item) => {
              const isActive = activeItem === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveItem(item.label);
                    setMobileSidebarOpen(false);
                    if (location.pathname !== "/dashboard") navigate("/dashboard");
                  }}
                  className={`
                    flex items-center gap-3 rounded-[10px] transition-all cursor-pointer
                    ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                    ${
                      isActive
                        ? "bg-[#fef2f2] text-[#e53935]"
                        : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                    }
                  `}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#e53935]" : ""}`} />
                  {sidebarOpen && (
                    <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e53935]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Section Header: Master Data and Setup */}
          {sidebarOpen && (
            <div className="px-3 pt-5 pb-1.5">
              <p className="text-[10px] tracking-[1px] uppercase text-[#94a3b8] font-semibold">Master Data Setup</p>
            </div>
          )}
          {!sidebarOpen && <div className="my-3 mx-2 border-t border-[#e2e8f0]" />}

          <div className="flex flex-col gap-0.5">
            {/* Driver License Type (simple item) */}
            {(() => {
              const isActive = activeItem === "Driver License Type";
              return (
                <button
                  onClick={() => {
                    setActiveItem("Driver License Type");
                    setMobileSidebarOpen(false);
                    if (location.pathname !== "/dashboard") navigate("/dashboard");
                  }}
                  className={`
                    flex items-center gap-3 rounded-[10px] transition-all cursor-pointer
                    ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                    ${
                      isActive
                        ? "bg-[#fef2f2] text-[#e53935]"
                        : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                    }
                  `}
                  title={!sidebarOpen ? "Driver License Type" : undefined}
                >
                  <FileText className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#e53935]" : ""}`} />
                  {sidebarOpen && (
                    <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      Driver License Type
                    </span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e53935]" />
                  )}
                </button>
              );
            })()}

            {/* License Policy (simple item) */}
            {(() => {
              const isActive = activeItem === "License Policy";
              return (
                <button
                  onClick={() => {
                    setActiveItem("License Policy");
                    setMobileSidebarOpen(false);
                    if (location.pathname !== "/dashboard") navigate("/dashboard");
                  }}
                  className={`
                    flex items-center gap-3 rounded-[10px] transition-all cursor-pointer
                    ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                    ${
                      isActive
                        ? "bg-[#fef2f2] text-[#e53935]"
                        : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                    }
                  `}
                  title={!sidebarOpen ? "License Policy" : undefined}
                >
                  <ScrollText className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#e53935]" : ""}`} />
                  {sidebarOpen && (
                    <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      License Policy
                    </span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e53935]" />
                  )}
                </button>
              );
            })()}

            {/* Blood Type (simple item, no sub-menu) */}
            {(() => {
              const isActive = activeItem === "Blood Type";
              return (
                <button
                  onClick={() => {
                    setActiveItem("Blood Type");
                    setMobileSidebarOpen(false);
                    if (location.pathname !== "/dashboard") navigate("/dashboard");
                  }}
                  className={`
                    flex items-center gap-3 rounded-[10px] transition-all cursor-pointer
                    ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                    ${
                      isActive
                        ? "bg-[#fef2f2] text-[#e53935]"
                        : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                    }
                  `}
                  title={!sidebarOpen ? "Blood Type" : undefined}
                >
                  <Droplets className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#e53935]" : ""}`} />
                  {sidebarOpen && (
                    <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      Blood Type
                    </span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e53935]" />
                  )}
                </button>
              );
            })()}
          </div>

          {/* Section Header: Development */}
          {sidebarOpen && (
            <div className="px-3 pt-5 pb-1.5 flex items-center justify-between">
              <p className="text-[10px] tracking-[1px] uppercase text-[#94a3b8] font-semibold">
                Development
              </p>
              <button
                onClick={() => {
                  // Navigate to Diagram and Schema + expand Database menu
                  setActiveItem("Diagram and Schema");
                  setExpandedMenus((prev) => ({ ...prev, database: true }));
                  setMobileSidebarOpen(false);
                  if (location.pathname !== "/dashboard") navigate("/dashboard");
                  // Set sync flag so DatabaseDiagramAndSchema can pick it up
                  sessionStorage.setItem("innotaxi_dev_sync_trigger", Date.now().toString());
                  // Trigger update notification
                  const id = Date.now();
                  setDevUpdateToasts((prev) => [...prev, id]);
                  setTimeout(() => setDevUpdateToasts((prev) => prev.filter((t) => t !== id)), 3500);
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] text-[#94a3b8] hover:text-[#e53935] hover:bg-[#fef2f2] transition-all cursor-pointer border border-transparent hover:border-[#fecaca]"
                title="Sync development — scan all pages and update preview codes"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          )}
          {!sidebarOpen && <div className="my-3 mx-2 border-t border-[#e2e8f0]" />}

          <div className="flex flex-col gap-0.5">
            {/* Database (expandable with sub-items) */}
            <button
              onClick={() => {
                if (sidebarOpen) {
                  setExpandedMenus((prev) => ({ ...prev, database: !prev.database }));
                } else {
                  setActiveItem("Diagram and Schema");
                  setMobileSidebarOpen(false);
                }
              }}
              className={`
                flex items-center gap-3 rounded-[10px] transition-all cursor-pointer
                ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                ${
                  activeItem === "Diagram and Schema" || activeItem === "Schema" || activeItem === "Migration"
                    ? "bg-[#fef2f2] text-[#e53935]"
                    : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                }
              `}
              title={!sidebarOpen ? "Database" : undefined}
            >
              <Database className={`w-[18px] h-[18px] shrink-0 ${
                activeItem === "Diagram and Schema" || activeItem === "Schema" || activeItem === "Migration" ? "text-[#e53935]" : ""
              }`} />
              {sidebarOpen && (
                <>
                  <span className={`text-[13px] flex-1 text-left ${
                    activeItem === "Diagram and Schema" || activeItem === "Schema" || activeItem === "Migration" ? "font-semibold" : "font-medium"
                  }`}>
                    Database
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      expandedMenus.database ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {/* Database sub-menu items */}
            {sidebarOpen && expandedMenus.database && (
              <div className="flex flex-col gap-0.5 ml-4 pl-3 border-l-[2px] border-[#e2e8f0]">
                {[
                  { icon: GitBranch, label: "Diagram and Schema", key: "Diagram and Schema" },
                ].map((sub) => {
                  const isSubActive = activeItem === sub.key;
                  return (
                    <button
                      key={sub.key}
                      onClick={() => {
                        setActiveItem(sub.key);
                        setMobileSidebarOpen(false);
                        if (location.pathname !== "/dashboard") navigate("/dashboard");
                      }}
                      className={`
                        flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 transition-all cursor-pointer
                        ${
                          isSubActive
                            ? "bg-[#fef2f2] text-[#e53935]"
                            : "text-[#94a3b8] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                        }
                      `}
                    >
                      <sub.icon className={`w-[15px] h-[15px] shrink-0 ${isSubActive ? "text-[#e53935]" : ""}`} />
                      <span className={`text-[12px] ${isSubActive ? "font-semibold" : "font-medium"}`}>
                        {sub.label}
                      </span>
                      {isSubActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e53935]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Frontend & Backend (simple items) */}
            {[
              { icon: Code, label: "Frontend" },
              { icon: Server, label: "Backend" },
            ].map((item) => {
              const isActive = activeItem === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveItem(item.label);
                    setMobileSidebarOpen(false);
                    if (location.pathname !== "/dashboard") navigate("/dashboard");
                  }}
                  className={`
                    flex items-center gap-3 rounded-[10px] transition-all cursor-pointer
                    ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                    ${
                      isActive
                        ? "bg-[#fef2f2] text-[#e53935]"
                        : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                    }
                  `}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#e53935]" : ""}`} />
                  {sidebarOpen && (
                    <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e53935]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-[#e2e8f0] px-4 lg:px-6 h-[60px] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f8fafc] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Pages & Components */}
            <div className="relative" ref={headerSearchRef}>
              <div className={`flex items-center gap-2 rounded-[10px] border transition-all ${
                headerSearchFocused
                  ? "border-[#e53935] bg-white shadow-[0_0_0_3px_rgba(229,57,53,0.08)]"
                  : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#cbd5e1]"
              }`}>
                <Search className="w-4 h-4 text-[#94a3b8] ml-3 shrink-0" />
                <input
                  ref={headerSearchInputRef}
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  onFocus={() => setHeaderSearchFocused(true)}
                  placeholder="Search dev pages & components..."
                  className="bg-transparent border-none outline-none text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] w-[180px] sm:w-[260px] py-2 pr-2"
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-[#94a3b8] bg-[#f1f5f9] border border-[#e2e8f0] rounded px-1.5 py-0.5 mr-2 font-mono">
                  {navigator.platform?.includes("Mac") ? "\u2318" : "Ctrl"}K
                </kbd>
              </div>

              {/* Search Results Dropdown */}
              {headerSearchFocused && headerSearch.trim() && (
                <div className="absolute left-0 top-full mt-2 w-[360px] max-h-[420px] overflow-y-auto bg-white rounded-[12px] border border-[#e2e8f0] shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50">
                  {filteredSearchItems.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Search className="w-8 h-8 text-[#cbd5e1] mx-auto mb-2" />
                      <p className="text-[13px] text-[#64748b] font-medium">No results found</p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">Try searching for a page name or component</p>
                    </div>
                  ) : (
                    <>
                      {/* Group by section */}
                      {(["Frontend", "Frontend Component", "Backend", "Backend Component"] as const)
                        .filter((sec) => filteredSearchItems.some((item) => item.section === sec))
                        .map((section) => (
                          <div key={section}>
                            <div className="px-3.5 pt-3 pb-1.5 sticky top-0 bg-white/95 backdrop-blur-sm">
                              <p className="text-[10px] text-[#94a3b8] uppercase tracking-[1px] font-semibold">
                                {section === "Frontend" ? "Frontend Pages" : section === "Backend" ? "Backend Pages" : section === "Frontend Component" ? "Frontend Components" : "Backend Components"}
                              </p>
                            </div>
                            {filteredSearchItems
                              .filter((item) => item.section === section)
                              .map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                  <button
                                    key={`${item.label}-${idx}`}
                                    onClick={() => handleSearchSelect(item.target, item.pageId)}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] group-hover:bg-[#fef2f2] flex items-center justify-center shrink-0 transition-colors">
                                      <Icon className="w-4 h-4 text-[#64748b] group-hover:text-[#e53935] transition-colors" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                      <p className="text-[12px] text-[#0f172a] font-medium truncate">{item.label}</p>
                                      <p className="text-[10px] text-[#94a3b8] truncate">{item.description}</p>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-[#cbd5e1] group-hover:text-[#e53935] shrink-0 transition-colors" />
                                  </button>
                                );
                              })}
                          </div>
                        ))}
                      <div className="px-3.5 py-2 border-t border-[#f1f5f9] bg-[#fafbfc] rounded-b-[12px]">
                        <p className="text-[10px] text-[#94a3b8]">
                          {filteredSearchItems.length} result{filteredSearchItems.length !== 1 ? "s" : ""} &middot; Press <kbd className="inline-flex px-1 py-0.5 rounded bg-[#f1f5f9] text-[9px] font-mono border border-[#e2e8f0]">Esc</kbd> to close
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-all cursor-pointer">
              <Bell className="w-[18px] h-[18px]" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#e53935] rounded-full text-white text-[9px] font-semibold flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="w-px h-7 bg-[#e2e8f0] mx-1 hidden sm:block" />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-[10px] hover:bg-[#f8fafc] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#e53935] flex items-center justify-center text-white text-[11px] font-semibold">
                  {user.avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[12px] text-[#0f172a] font-medium">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-[#94a3b8]">{user.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] hidden sm:block" />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-[220px] bg-white rounded-[12px] border border-[#e2e8f0] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#e2e8f0]">
                      <p className="text-[13px] text-[#0f172a] font-medium">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                        <span className="text-[10px] text-[#64748b]">{user.role}</span>
                      </div>
                    </div>
                    <div className="py-1">
                      <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors cursor-pointer">
                        <Settings className="w-3.5 h-3.5" />
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] text-[#e53935] hover:bg-[#fef2f2] transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {outlet ? (
              <Outlet />
            ) : activeItem === "Driver License Type" ? (
              <LicenseTypeList />
            ) : activeItem === "Frontend" ? (
              <FrontendDev />
            ) : activeItem === "Backend" ? (
              <BackendDev />
            ) : activeItem === "Diagram and Schema" ? (
              <DatabaseDiagramAndSchema />
            ) : activeItem === "Blood Type" ? (
              <BloodTypeList />
            ) : activeItem === "License Policy" ? (
              <LicensePolicyList />
            ) : (
              <>
                {/* Welcome Section */}
                <div className="mb-6">
                  <h1 className="text-[22px] text-[#0f172a] font-semibold tracking-[-0.22px]">
                    Welcome back, {user.name}
                  </h1>
                  <p className="text-[13px] text-[#64748b] mt-1">
                    Here's what's happening with InnoTaxi today.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total Rides", value: "12,847", change: "+12.5%", color: "#e53935" },
                    { label: "Active Drivers", value: "342", change: "+3.2%", color: "#42b883" },
                    { label: "Revenue", value: "$48,290", change: "+8.1%", color: "#61dafb" },
                    { label: "Passengers", value: "8,421", change: "+5.7%", color: "#f59e0b" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-[12px] border border-[#e2e8f0] p-5 hover:shadow-sm transition-shadow"
                    >
                      <p className="text-[11px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">
                        {stat.label}
                      </p>
                      <div className="flex items-end justify-between mt-2">
                        <p className="text-[24px] text-[#0f172a] font-semibold tracking-[-0.48px]">
                          {stat.value}
                        </p>
                        <span
                          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            color: stat.color,
                            backgroundColor: `${stat.color}15`,
                          }}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Drivers by Driver License Type Bar Chart */}
                <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-5 mb-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-[15px] text-[#0f172a] font-semibold">Drivers by Driver License Type</h3>
                      <p className="text-[12px] text-[#94a3b8] mt-0.5">Active driver distribution across license categories</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-[3px] bg-[#e53935]" />
                        <span className="text-[11px] text-[#64748b]">Active</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-[3px] bg-[#94a3b8]" />
                        <span className="text-[11px] text-[#64748b]">Inactive</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        id="dashboard-bar-chart"
                        data={[
                          { code: "THA", name: "သ (Learner)", active: 28, inactive: 5 },
                          { code: "KA", name: "က (Motorcycle)", active: 67, inactive: 12 },
                          { code: "KHA", name: "ခ (Private)", active: 89, inactive: 8 },
                          { code: "GA", name: "ဂ (Machinery)", active: 15, inactive: 3 },
                          { code: "GHA", name: "ဃ (Taxi)", active: 72, inactive: 10 },
                          { code: "NGA", name: "င (All Vehicles)", active: 34, inactive: 6 },
                          { code: "ZA", name: "ဈ (Trailer)", active: 18, inactive: 4 },
                          { code: "HA", name: "ဟ (Motorcycle/3W)", active: 42, inactive: 7 },
                          { code: "SA", name: "စ (Assistant)", active: 11, inactive: 2 },
                          { code: "INT", name: "International", active: 8, inactive: 1 },
                          { code: "TMP", name: "Temporary", active: 6, inactive: 3 },
                        ]}
                        margin={{ top: 8, right: 8, left: -12, bottom: 4 }}
                        barGap={2}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                          dataKey="code"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "#64748b" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                          itemStyle={{ color: "#e2e8f0", fontSize: "12px" }}
                          labelStyle={{ color: "#fff", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}
                          labelFormatter={(label: string, payload: Array<{ payload?: { name?: string } }>) => {
                            const item = payload?.[0]?.payload;
                            return item?.name ? `${label} — ${item.name}` : label;
                          }}
                          cursor={{ fill: "rgba(229, 57, 53, 0.04)" }}
                        />
                        <Bar dataKey="active" name="Active" fill="#e53935" radius={[4, 4, 0, 0]} maxBarSize={32} />
                        <Bar dataKey="inactive" name="Inactive" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f1f5f9]">
                    <span className="text-[11px] text-[#94a3b8]">Total: 342 active drivers across 11 driver license types</span>
                    <span className="text-[11px] text-[#e53935] font-medium">Top: KHA (89 drivers)</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Dev Update Toast Notifications */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {devUpdateToasts.map((id) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="pointer-events-auto w-[340px] bg-white rounded-[12px] border border-[#e2e8f0] shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#0f172a] font-semibold">Development Updated</p>
                  <p className="text-[11px] text-[#64748b] mt-0.5">Frontend, Backend, and Database sections have been synced successfully.</p>
                </div>
                <button
                  onClick={() => setDevUpdateToasts((prev) => prev.filter((t) => t !== id))}
                  className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Green gradient progress bar */}
              <div className="h-[3px] w-full bg-[#f1f5f9]">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 3.5, ease: "linear" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #16a34a, #4ade80)" }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
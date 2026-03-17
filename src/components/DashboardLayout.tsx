import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Fuel,
  RefreshCw,
  CheckCircle2,
  User,
  Shield,
  CreditCard,
  Star,
  Phone,
  Smartphone,
  Zap,
  ArrowRight,
} from "lucide-react";
import { LicenseTypeList } from "./LicenseTypeList";
import { FrontendDev } from "./FrontendDev";
import { BackendDev } from "./BackendDev";
import { DatabaseDiagramAndSchema } from "./DatabaseDiagramAndSchema";
import { BloodTypeList } from "./BloodTypeList";
import { LicensePolicyList } from "./LicensePolicyList";
import { DriverList } from "./DriverList";
import { DriverProfileList } from "./DriverProfileList";
import { SystemFlow } from "./SystemFlow";
import { MobileApp } from "./MobileApp";
import { DriverLicenseProfile } from "./DriverLicenseProfile";
import { VehicleProfile } from "./VehicleProfile";
import { FuelTypeList } from "./FuelTypeList";
import { FuelStationList } from "./FuelStationList";
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
  { icon: User, label: "Driver Profile", active: false },
  { icon: IdCard, label: "Driver License Profile", active: false },
  { icon: Car, label: "Vehicle Profile", active: false },
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
    const result: Record<string, boolean> = {};
    if (stored === "Diagram and Schema" || stored === "Schema" || stored === "Migration") {
      result.database = true;
    }
    if (stored === "Frontend" || stored === "Backend" || stored === "Mobile App") {
      result.code = true;
    }
    return result;
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
    { label: "Policies List", section: "Frontend", icon: Code, target: "Frontend", pageId: "policy-list", description: "Data table with charts for policies management", route: "/dashboard (Policies)" },
    { label: "Blood Type List", section: "Frontend", icon: Code, target: "Frontend", pageId: "blood-type-list", description: "Data table with charts for blood type management", route: "/dashboard (Blood Type)" },
    { label: "Driver List", section: "Frontend", icon: Code, target: "Frontend", pageId: "driver-list", description: "Data table for driver management with CRUD operations", route: "/dashboard (Drivers)" },
    { label: "Driver License Type Detail", section: "Frontend", icon: Code, target: "Frontend", pageId: "license-detail", description: "Detail view with update form and monthly statistics chart", route: "/dashboard/license-types/:id" },
    { label: "Policies Detail", section: "Frontend", icon: Code, target: "Frontend", pageId: "policy-list", description: "Detail view with update form for policies", route: "/dashboard/license-policies/:id" },
    { label: "Emergency Profiles", section: "Frontend", icon: Code, target: "Frontend", pageId: "emergency-profiles", description: "Emergency contact management for drivers/customers with nullable driver_id/customer_id, relationship, and review status", route: "/dashboard (Emergency Profiles)" },
    // ─── Frontend Components ───
    { label: "Login Form", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "login", description: "Complete login form with email/password validation, auto-fill, and demo credentials" },
    { label: "Bar Chart", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-list", description: "Drivers by Driver License Type — Grouped Bar Chart" },
    { label: "Doughnut Chart", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-list", description: "Driver Distribution — Doughnut/Pie Chart" },
    { label: "Data Table (License Type)", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-list", description: "Search, Filter, Export, Columns, Pagination" },
    { label: "Data Table (Policies)", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "policy-list", description: "Search, Filter, Export, Columns, Pagination" },
    { label: "Add Policy Form", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "policy-list", description: "POST /api/v1/policies" },
    { label: "Detail Policy View", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "policy-list", description: "GET /api/v1/policies/:id" },
    { label: "Data Table (Blood Type)", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "blood-type-list", description: "Search, Filter, Export, Columns, Pagination" },
    { label: "Data Table (Drivers)", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "driver-list", description: "Search, Filter, Export, Columns, Pagination for drivers" },
    { label: "Detail View", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-detail", description: "GET /api/v1/license-types/:id" },
    { label: "Update Form", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-detail", description: "PUT /api/v1/license-types/:id" },
    { label: "Monthly Driver Chart", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "license-detail", description: "Monthly driver count line/area chart with year filter" },
    { label: "Data Table (Emergency Profiles)", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "emergency-profiles", description: "Search, Filter, Pagination for emergency contacts" },
    { label: "Add Emergency Contact Form", section: "Frontend Component", icon: Code, target: "Frontend", pageId: "emergency-profiles", description: "POST /api/v1/emergency-profiles — contact_name, relationship, prefix + phone_number" },
    // ─── Backend Pages ───
    { label: "Driver License Type List", section: "Backend", icon: Server, target: "Backend", pageId: "license-list", description: "Statistics endpoints and CRUD API for driver license type management", route: "/api/v1/license-types" },
    { label: "Driver License Type Detail", section: "Backend", icon: Server, target: "Backend", pageId: "license-detail", description: "Single resource endpoints with update and monthly analytics", route: "/api/v1/license-types/:id" },
    { label: "Policy", section: "Backend", icon: Server, target: "Backend", pageId: "license-policy", description: "Endpoints for managing policies", route: "/api/v1/policies" },
    { label: "Policy Detail", section: "Backend", icon: Server, target: "Backend", pageId: "license-policy-detail", description: "Single resource endpoints with update for policies", route: "/api/v1/policies/:id" },
    { label: "Blood Type", section: "Backend", icon: Server, target: "Backend", pageId: "blood-type", description: "Endpoints for managing blood type master data", route: "/api/v1/blood-types" },
    { label: "Drivers", section: "Backend", icon: Server, target: "Backend", pageId: "driver-list", description: "CRUD API endpoints for driver management", route: "/api/v1/drivers" },
    { label: "Emergency Profiles", section: "Backend", icon: Server, target: "Backend", pageId: "emergency-profiles", description: "CRUD API for emergency contact management (nullable driver_id/customer_id, max 3 per owner, UNDER_REVIEW/REJECT/APPROVE status)", route: "/api/v1/emergency-profiles" },
    // ─── Backend Components ───
    { label: "Bar Chart Statistics", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-list", description: "Driver count by driver license type with status breakdown" },
    { label: "Distribution Statistics", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-list", description: "Driver distribution across all license categories" },
    { label: "CRUD Operations", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-list", description: "Full REST API with pagination, search, filter, sort, and soft delete" },
    { label: "Detail Endpoint", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-detail", description: "Retrieve single driver license type with relations and metadata" },
    { label: "Update Endpoint", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-detail", description: "Update driver license type fields with validation and audit logging" },
    { label: "Monthly Analytics", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-detail", description: "Monthly driver registration count with year filter" },
    { label: "Policy Endpoint", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-policy", description: "Retrieve and manage policies" },
    { label: "Create Policy Endpoint", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-policy", description: "Create new policy" },
    { label: "Detail & Update Policy Endpoint", section: "Backend Component", icon: Server, target: "Backend", pageId: "license-policy-detail", description: "Retrieve and update single policy with validation" },
    { label: "Blood Type CRUD", section: "Backend Component", icon: Server, target: "Backend", pageId: "blood-type", description: "Full REST API for blood type management with soft delete" },
    { label: "Driver CRUD", section: "Backend Component", icon: Server, target: "Backend", pageId: "driver-list", description: "Full REST API for driver management with validation and soft delete" },
    { label: "Emergency Profiles CRUD", section: "Backend Component", icon: Server, target: "Backend", pageId: "emergency-profiles", description: "Full REST API for emergency contact management with nullable driver_id/customer_id and review status flow" },
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
    if (location.pathname.startsWith("/dashboard/license-policies/")) {
      setActiveItem("Policies");
    }
    if (location.pathname.startsWith("/dashboard/license-profiles/")) {
      setActiveItem("Driver License Profile");
    }
    if (location.pathname.startsWith("/dashboard/fuel-stations/")) {
      setActiveItem("Fuel Station");
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
                <div key={item.label}>
                  {item.label === "Drivers" && sidebarOpen && (
                    <div className="px-3 pt-5 pb-1.5">
                      <p className="text-[10px] tracking-[1px] uppercase text-[#94a3b8] font-semibold">Driver Management</p>
                    </div>
                  )}
                  {item.label === "Drivers" && !sidebarOpen && (
                    <div className="my-3 mx-2 border-t border-[#e2e8f0]" />
                  )}
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
                </div>
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

            {/* License Policies (simple item) */}
            {(() => {
              const isActive = activeItem === "Policies";
              return (
                <button
                  onClick={() => {
                    setActiveItem("Policies");
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
                  title={!sidebarOpen ? "Policies" : undefined}
                >
                  <ScrollText className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#e53935]" : ""}`} />
                  {sidebarOpen && (
                    <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      Policies
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
                    <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>Blood</span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e53935]" />
                  )}
                </button>
              );
            })()}

            {/* Fuel Type (simple item, no sub-menu) */}
            {(() => {
              const isActive = activeItem === "Fuel Type";
              return (
                <button
                  onClick={() => {
                    setActiveItem("Fuel Type");
                    setMobileSidebarOpen(false);
                    if (location.pathname !== "/dashboard") navigate("/dashboard");
                  }}
                  className={`
                    flex items-center gap-3 rounded-[10px] transition-all cursor-pointer
                    ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                    ${
                      isActive
                        ? "bg-[#fff7ed] text-[#ea580c]"
                        : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                    }
                  `}
                  title={!sidebarOpen ? "Fuel Type" : undefined}
                >
                  <Fuel className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#ea580c]" : ""}`} />
                  {sidebarOpen && (
                    <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>Fuel</span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                  )}
                </button>
              );
            })()}

            {/* Fuel Station (simple item, no sub-menu) */}
            {(() => {
              const isActive = activeItem === "Fuel Station";
              return (
                <button
                  onClick={() => {
                    setActiveItem("Fuel Station");
                    setMobileSidebarOpen(false);
                    if (location.pathname !== "/dashboard") navigate("/dashboard");
                  }}
                  className={`
                    flex items-center gap-3 rounded-[10px] transition-all cursor-pointer
                    ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                    ${
                      isActive
                        ? "bg-[#ecfdf5] text-[#10b981]"
                        : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                    }
                  `}
                  title={!sidebarOpen ? "Fuel Station" : undefined}
                >
                  <MapPin className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#10b981]" : ""}`} />
                  {sidebarOpen && (
                    <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      Station
                    </span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#10b981]" />
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
                <span className="contents">
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
                </span>
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

            {/* Code (expandable with Frontend & Backend sub-items) */}
            <button
              onClick={() => {
                if (sidebarOpen) {
                  setExpandedMenus((prev) => ({ ...prev, code: !prev.code }));
                } else {
                  setActiveItem("Frontend");
                  setMobileSidebarOpen(false);
                }
              }}
              className={`
                flex items-center gap-3 rounded-[10px] transition-all cursor-pointer
                ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                ${
                  activeItem === "Frontend" || activeItem === "Backend" || activeItem === "Mobile App"
                    ? "bg-[#fef2f2] text-[#e53935]"
                    : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                }
              `}
              title={!sidebarOpen ? "Code" : undefined}
            >
              <Code className={`w-[18px] h-[18px] shrink-0 ${
                activeItem === "Frontend" || activeItem === "Backend" || activeItem === "Mobile App" ? "text-[#e53935]" : ""
              }`} />
              {sidebarOpen && (
                <span className="contents">
                  <span className={`text-[13px] flex-1 text-left ${
                    activeItem === "Frontend" || activeItem === "Backend" || activeItem === "Mobile App" ? "font-semibold" : "font-medium"
                  }`}>
                    Code
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      expandedMenus.code ? "rotate-180" : ""
                    }`}
                  />
                </span>
              )}
            </button>

            {/* Code sub-menu items */}
            {sidebarOpen && expandedMenus.code && (
              <div className="flex flex-col gap-0.5 ml-4 pl-3 border-l-[2px] border-[#e2e8f0]">
                {[
                  { icon: Code, label: "Frontend", key: "Frontend" },
                  { icon: Server, label: "Backend", key: "Backend" },
                  { icon: Smartphone, label: "Mobile App", key: "Mobile App" },
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

            {/* System Flow (standalone item) */}
            {(() => {
              const isActive = activeItem === "System Flow";
              return (
                <button
                  onClick={() => {
                    setActiveItem("System Flow");
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
                  title={!sidebarOpen ? "System Flow" : undefined}
                >
                  <ArrowRightLeft className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#e53935]" : ""}`} />
                  {sidebarOpen && (
                    <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      System Flow
                    </span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e53935]" />
                  )}
                </button>
              );
            })()}
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
                    <div>
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
                    </div>
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
                <div className="contents">
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
                </div>
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
            ) : activeItem === "Fuel Type" ? (
              <FuelTypeList />
            ) : activeItem === "Fuel Station" ? (
              <FuelStationList />
            ) : activeItem === "Policies" ? (
              <LicensePolicyList />
            ) : activeItem === "Drivers" ? (
              <DriverList />
            ) : activeItem === "Driver Profile" ? (
              <DriverProfileList />
            ) : activeItem === "Driver License Profile" ? (
              <DriverLicenseProfile />
            ) : activeItem === "Vehicle Profile" ? (
              <VehicleProfile />
            ) : activeItem === "System Flow" ? (
              <SystemFlow />
            ) : activeItem === "Mobile App" ? (
              <MobileApp />
            ) : (
              <div>
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
                        <Bar key="active" dataKey="active" name="Active" fill="#e53935" radius={[4, 4, 0, 0]} maxBarSize={32} />
                        <Bar key="inactive" dataKey="inactive" name="Inactive" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f1f5f9]">
                    <span className="text-[11px] text-[#94a3b8]">Total: 342 active drivers across 11 driver license types</span>
                    <span className="text-[11px] text-[#e53935] font-medium">Top: KHA (89 drivers)</span>
                  </div>
                </div>

                {/* System Flow Diagram Card */}
                <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-5 mb-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                        <ArrowRightLeft className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[15px] text-[#0f172a] font-semibold">System Flow Diagram</h3>
                        <p className="text-[12px] text-[#94a3b8] mt-0.5">End-to-end architecture overview — 7 core flows across InnoTaxi</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveItem("System Flow");
                        if (location.pathname !== "/dashboard") navigate("/dashboard");
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-[12px] font-medium text-[#6366f1] bg-[#eef2ff] hover:bg-[#e0e7ff] transition-colors cursor-pointer"
                    >
                      View All Flows
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Architecture Diagram */}
                  <div className="relative bg-[#fafbfc] rounded-[10px] border border-[#e2e8f0] p-6 overflow-hidden">
                    {/* Background grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #0f172a 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

                    {/* Top Layer: Client Apps */}
                    <div className="relative flex items-center justify-center gap-6 mb-4">
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-[10px] border border-[#e2e8f0] shadow-sm">
                        <Smartphone className="w-4 h-4 text-[#e53935]" />
                        <span className="text-[12px] text-[#334155] font-medium">Driver App</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-[10px] border border-[#e2e8f0] shadow-sm">
                        <Smartphone className="w-4 h-4 text-[#3b82f6]" />
                        <span className="text-[12px] text-[#334155] font-medium">Passenger App</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-[10px] border border-[#e2e8f0] shadow-sm">
                        <LayoutDashboard className="w-4 h-4 text-[#8b5cf6]" />
                        <span className="text-[12px] text-[#334155] font-medium">Admin Panel</span>
                      </div>
                    </div>

                    {/* Connector arrows down */}
                    <div className="flex justify-center mb-4">
                      <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-6 bg-[#cbd5e1]" />
                          <ChevronDown className="w-3 h-3 text-[#cbd5e1] -mt-0.5" />
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-px h-6 bg-[#cbd5e1]" />
                          <ChevronDown className="w-3 h-3 text-[#cbd5e1] -mt-0.5" />
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-px h-6 bg-[#cbd5e1]" />
                          <ChevronDown className="w-3 h-3 text-[#cbd5e1] -mt-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Middle Layer: API Gateway */}
                    <div className="relative flex items-center justify-center mb-4">
                      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-[10px] shadow-md">
                        <Shield className="w-4 h-4 text-[#fbbf24]" />
                        <span className="text-[12px] text-white font-medium">API Gateway</span>
                        <div className="w-px h-4 bg-[#334155]" />
                        <Zap className="w-3.5 h-3.5 text-[#4ade80]" />
                        <span className="text-[11px] text-[#94a3b8]">Auth &amp; Rate Limiting</span>
                      </div>
                    </div>

                    {/* Connector arrows down */}
                    <div className="flex justify-center mb-4">
                      <div className="flex flex-col items-center">
                        <div className="w-px h-6 bg-[#cbd5e1]" />
                        <ChevronDown className="w-3 h-3 text-[#cbd5e1] -mt-0.5" />
                      </div>
                    </div>

                    {/* Flow Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                      {[
                        { icon: Users, label: "Driver Registration", color: "#e53935", steps: 10 },
                        { icon: Car, label: "Ride Booking", color: "#3b82f6", steps: 12 },
                        { icon: CreditCard, label: "Payment Processing", color: "#16a34a", steps: 8 },
                        { icon: Shield, label: "License Verification", color: "#f59e0b", steps: 9 },
                        { icon: Bell, label: "Notification System", color: "#8b5cf6", steps: 7 },
                        { icon: Star, label: "Rating & Review", color: "#ec4899", steps: 8 },
                        { icon: Phone, label: "Emergency Contact", color: "#06b6d4", steps: 6 },
                      ].map((flow) => (
                        <button
                          key={flow.label}
                          onClick={() => {
                            setActiveItem("System Flow");
                            if (location.pathname !== "/dashboard") navigate("/dashboard");
                          }}
                          className="group flex flex-col gap-2.5 p-3.5 bg-white rounded-[10px] border border-[#e2e8f0] hover:border-[#cbd5e1] hover:shadow-sm transition-all cursor-pointer text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                              style={{ backgroundColor: `${flow.color}12` }}
                            >
                              <flow.icon className="w-4 h-4" style={{ color: flow.color }} />
                            </div>
                            <ArrowRight className="w-3 h-3 text-[#cbd5e1] group-hover:text-[#64748b] transition-colors" />
                          </div>
                          <div>
                            <p className="text-[12px] text-[#0f172a] font-medium">{flow.label}</p>
                            <p className="text-[10px] text-[#94a3b8] mt-0.5">{flow.steps} steps</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Connector arrows down */}
                    <div className="flex justify-center mb-4">
                      <div className="flex flex-col items-center">
                        <div className="w-px h-6 bg-[#cbd5e1]" />
                        <ChevronDown className="w-3 h-3 text-[#cbd5e1] -mt-0.5" />
                      </div>
                    </div>

                    {/* Bottom Layer: Database & Services */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-[10px] border border-[#e2e8f0] shadow-sm">
                        <Database className="w-4 h-4 text-[#6366f1]" />
                        <span className="text-[12px] text-[#334155] font-medium">PostgreSQL</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-[10px] border border-[#e2e8f0] shadow-sm">
                        <Zap className="w-4 h-4 text-[#f59e0b]" />
                        <span className="text-[12px] text-[#334155] font-medium">Redis Cache</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-[10px] border border-[#e2e8f0] shadow-sm">
                        <Server className="w-4 h-4 text-[#22c55e]" />
                        <span className="text-[12px] text-[#334155] font-medium">Push Service</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Summary */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f1f5f9]">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-[#94a3b8]">7 system flows</span>
                      <div className="w-px h-3 bg-[#e2e8f0]" />
                      <span className="text-[11px] text-[#94a3b8]">60+ steps</span>
                      <div className="w-px h-3 bg-[#e2e8f0]" />
                      <span className="text-[11px] text-[#94a3b8]">5 actors</span>
                    </div>
                    <span className="text-[11px] text-[#6366f1] font-medium">Mermaid sequence diagrams available</span>
                  </div>
                </div>
              </div>
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
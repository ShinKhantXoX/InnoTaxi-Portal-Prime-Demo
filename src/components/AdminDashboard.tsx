import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Inbox,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  ChevronDown,
  X,
  Mail,
  Phone,
  Building2,
  User,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Waves,
  StickyNote,
  Send,
  Archive,
  Circle,
  BarChart3,
  Calendar,
  LogOut,
  Shield,
  KeyRound,
  EyeOff,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: string;
  subject: string;
  message: string;
  status: string;
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
}

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  { value: "in-progress", label: "In Progress", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
];

const INQUIRY_TYPE_COLORS: Record<string, string> = {
  "General Inquiry": "bg-sky-50 text-sky-700",
  "Product Information": "bg-purple-50 text-purple-700",
  "Wholesale / Bulk Order": "bg-emerald-50 text-emerald-700",
  "Shipping & Delivery": "bg-orange-50 text-orange-700",
  "Return & Refund": "bg-red-50 text-red-700",
  "Partnership / Collaboration": "bg-indigo-50 text-indigo-700",
  "Feedback / Suggestion": "bg-teal-50 text-teal-700",
  Other: "bg-gray-50 text-gray-600",
};

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-55db73c3`;

interface AdminDashboardProps {
  adminToken: string;
  adminUsername: string;
  onLogout: () => void;
}

export function AdminDashboard({ adminToken, adminUsername, onLogout }: AdminDashboardProps) {
  const safeUsername = adminUsername || "Admin";
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${publicAnonKey}`,
    "X-Admin-Token": adminToken,
  };

  // Fetch inquiries
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/inquiries`, { headers });
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
      } else {
        console.error("Error fetching inquiries:", data.error);
        toast.error("Failed to load inquiries");
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Click outside status dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setShowStatusDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Click outside user menu
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Update status
  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status, updatedAt: new Date().toISOString() } : inq))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => prev ? { ...prev, status, updatedAt: new Date().toISOString() } : null);
        }
        toast.success(`Status updated to "${STATUS_OPTIONS.find((s) => s.value === status)?.label}"`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      toast.error("Failed to update status");
    }
    setShowStatusDropdown(null);
  };

  // Save admin note
  const saveAdminNote = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, adminNote } : inq))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => prev ? { ...prev, adminNote } : null);
        }
        toast.success("Admin note saved");
      }
    } catch (error) {
      console.error("Error saving admin note:", error);
      toast.error("Failed to save note");
    }
  };

  // Delete inquiry
  const deleteInquiry = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        toast.success("Inquiry deleted");
      } else {
        toast.error("Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete");
    }
    setShowDeleteConfirm(null);
  };

  // Filtering & sorting
  const filtered = inquiries
    .filter((inq) => {
      if (statusFilter !== "all" && inq.status !== statusFilter) return false;
      if (typeFilter !== "all" && inq.inquiryType !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          (inq.name || "").toLowerCase().includes(q) ||
          (inq.email || "").toLowerCase().includes(q) ||
          (inq.subject || "").toLowerCase().includes(q) ||
          (inq.message || "").toLowerCase().includes(q) ||
          (inq.company || "").toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  // Stats
  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    inProgress: inquiries.filter((i) => i.status === "in-progress").length,
    resolved: inquiries.filter((i) => i.status === "resolved").length,
  };

  const uniqueTypes = [...new Set(inquiries.map((i) => i.inquiryType))];

  const getStatusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${opt.color}`} style={{ fontSize: "0.75rem" }}>
        <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />
        {opt.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const timeAgo = (dateStr: string) => {
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(dateStr);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0284c7] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-[8%] opacity-10">
            <Waves size={100} />
          </div>
          <div className="absolute bottom-2 right-[12%] opacity-10 rotate-12">
            <Waves size={70} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center gap-2 mb-5" style={{ fontSize: "0.85rem" }}>
            <Link to="/" className="text-white/70 hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white">Admin Dashboard</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-1">
                <LayoutDashboard size={26} className="text-white/80" />
                <h1 className="text-white" style={{ fontSize: "1.8rem" }}>
                  Inquiry Dashboard
                </h1>
              </div>
              <p className="text-white/60 ml-10" style={{ fontSize: "0.9rem" }}>
                Manage and respond to customer inquiries
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={fetchInquiries}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl transition-colors cursor-pointer self-start"
              style={{ fontSize: "0.85rem" }}
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </motion.button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40V20C360 0 720 0 1080 20C1260 30 1350 35 1440 40H0Z" fill="#f9fafb" fillOpacity="0.5" />
            <path d="M0 40V25C240 5 480 5 720 25C960 45 1200 45 1440 25V40H0Z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-2 pb-12">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {[
            { label: "Total", value: stats.total, icon: <Inbox size={18} />, bg: "bg-blue-50", iconColor: "text-[#0369a1]" },
            { label: "New", value: stats.new, icon: <Circle size={18} />, bg: "bg-sky-50", iconColor: "text-sky-600" },
            { label: "In Progress", value: stats.inProgress, icon: <Clock size={18} />, bg: "bg-amber-50", iconColor: "text-amber-600" },
            { label: "Resolved", value: stats.resolved, icon: <CheckCircle size={18} />, bg: "bg-green-50", iconColor: "text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center ${stat.iconColor}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{stat.label}</p>
                  <p className="text-[#0c4a6e]" style={{ fontSize: "1.3rem" }}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search & Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5"
        >
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, subject, or message..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all"
                style={{ fontSize: "0.85rem" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggles */}
            <div className="flex gap-2 flex-wrap">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#0369a1] outline-none cursor-pointer"
                style={{ fontSize: "0.82rem" }}
              >
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#0369a1] outline-none cursor-pointer"
                style={{ fontSize: "0.82rem" }}
              >
                <option value="all">All Types</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#0369a1] outline-none cursor-pointer"
                style={{ fontSize: "0.82rem" }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Active filter indicators */}
          {(statusFilter !== "all" || typeFilter !== "all" || searchQuery) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-gray-400" style={{ fontSize: "0.75rem" }}>Active filters:</span>
              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#0369a1] rounded-full cursor-pointer hover:bg-blue-100 transition-colors"
                  style={{ fontSize: "0.72rem" }}
                >
                  Status: {STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label}
                  <X size={11} />
                </button>
              )}
              {typeFilter !== "all" && (
                <button
                  onClick={() => setTypeFilter("all")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#0369a1] rounded-full cursor-pointer hover:bg-blue-100 transition-colors"
                  style={{ fontSize: "0.72rem" }}
                >
                  Type: {typeFilter}
                  <X size={11} />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#0369a1] rounded-full cursor-pointer hover:bg-blue-100 transition-colors"
                  style={{ fontSize: "0.72rem" }}
                >
                  Search: "{searchQuery}"
                  <X size={11} />
                </button>
              )}
              <button
                onClick={() => { setStatusFilter("all"); setTypeFilter("all"); setSearchQuery(""); }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer ml-1"
                style={{ fontSize: "0.72rem" }}
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>
            Showing {filtered.length} of {inquiries.length} inquiries
          </p>
        </div>

        {/* Inquiry List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <RefreshCw size={28} className="text-[#0369a1]/40" />
            </motion.div>
            <p className="text-gray-400 mt-3" style={{ fontSize: "0.9rem" }}>Loading inquiries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center"
          >
            <Inbox size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 mb-1" style={{ fontSize: "1rem" }}>No inquiries found</p>
            <p className="text-gray-400" style={{ fontSize: "0.85rem" }}>
              {inquiries.length === 0
                ? "When customers submit inquiries, they'll appear here."
                : "Try adjusting your search or filters."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inq, i) => (
              <motion.div
                key={inq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all group ${
                  inq.status === "new" ? "border-blue-100 border-l-[3px] border-l-blue-500" : "border-gray-100"
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0369a1] to-[#0284c7] flex items-center justify-center text-white shrink-0" style={{ fontSize: "0.85rem" }}>
                          {(inq.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-[#0c4a6e] truncate" style={{ fontSize: "0.95rem" }}>
                              {inq.subject}
                            </h3>
                            {getStatusBadge(inq.status)}
                            <span className={`px-2 py-0.5 rounded-full ${INQUIRY_TYPE_COLORS[inq.inquiryType] || "bg-gray-50 text-gray-600"}`} style={{ fontSize: "0.7rem" }}>
                              {inq.inquiryType}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                            <span className="text-gray-600 flex items-center gap-1" style={{ fontSize: "0.82rem" }}>
                              <User size={12} className="text-gray-400" /> {inq.name}
                            </span>
                            <span className="text-gray-400 flex items-center gap-1" style={{ fontSize: "0.78rem" }}>
                              <Mail size={11} /> {inq.email}
                            </span>
                            {inq.company && (
                              <span className="text-gray-400 flex items-center gap-1" style={{ fontSize: "0.78rem" }}>
                                <Building2 size={11} /> {inq.company}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 line-clamp-2" style={{ fontSize: "0.82rem" }}>
                            {inq.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: actions & time */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-3 shrink-0 ml-0 sm:ml-4">
                      <span className="text-gray-400 flex items-center gap-1" style={{ fontSize: "0.72rem" }}>
                        <Clock size={11} /> {timeAgo(inq.createdAt)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* View Detail */}
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setAdminNote(inq.adminNote || "");
                          }}
                          className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#0369a1] transition-colors cursor-pointer"
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Status change */}
                        <div className="relative" ref={showStatusDropdown === inq.id ? statusDropdownRef : undefined}>
                          <button
                            onClick={() => setShowStatusDropdown(showStatusDropdown === inq.id ? null : inq.id)}
                            className="p-2 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors cursor-pointer"
                            title="Change status"
                          >
                            <CheckCircle size={15} />
                          </button>
                          <AnimatePresence>
                            {showStatusDropdown === inq.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-1 w-40"
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <button
                                    key={s.value}
                                    onClick={() => updateStatus(inq.id, s.value)}
                                    className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-2 ${
                                      inq.status === s.value ? "bg-blue-50/50" : ""
                                    }`}
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                                    {s.label}
                                    {inq.status === s.value && <CheckCircle size={12} className="text-[#0369a1] ml-auto" />}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => setShowDeleteConfirm(inq.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Admin note indicator */}
                  {inq.adminNote && (
                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-start gap-2">
                      <StickyNote size={13} className="text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-gray-400 line-clamp-1" style={{ fontSize: "0.75rem" }}>
                        Note: {inq.adminNote}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedInquiry(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0369a1] to-[#0284c7] flex items-center justify-center text-white" style={{ fontSize: "0.9rem" }}>
                    {(selectedInquiry.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-[#0c4a6e]" style={{ fontSize: "1.1rem" }}>
                      Inquiry Details
                    </h2>
                    <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                      ID: {(selectedInquiry.id || "").slice(0, 25)}...
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status & Type */}
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(selectedInquiry.status)}
                  <span className={`px-2.5 py-1 rounded-full ${INQUIRY_TYPE_COLORS[selectedInquiry.inquiryType] || "bg-gray-50 text-gray-600"}`} style={{ fontSize: "0.75rem" }}>
                    {selectedInquiry.inquiryType}
                  </span>
                  <span className="text-gray-400 ml-auto flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                    <Calendar size={12} /> {formatDate(selectedInquiry.createdAt)} at {formatTime(selectedInquiry.createdAt)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50/80 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5">
                      <User size={15} className="text-[#0369a1]" />
                      <div>
                        <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>Name</p>
                        <p className="text-gray-800" style={{ fontSize: "0.88rem" }}>{selectedInquiry.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail size={15} className="text-[#0369a1]" />
                      <div>
                        <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>Email</p>
                        <a href={`mailto:${selectedInquiry.email}`} className="text-[#0369a1] hover:underline" style={{ fontSize: "0.88rem" }}>
                          {selectedInquiry.email}
                        </a>
                      </div>
                    </div>
                    {selectedInquiry.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone size={15} className="text-[#0369a1]" />
                        <div>
                          <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>Phone</p>
                          <p className="text-gray-800" style={{ fontSize: "0.88rem" }}>{selectedInquiry.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedInquiry.company && (
                      <div className="flex items-center gap-2.5">
                        <Building2 size={15} className="text-[#0369a1]" />
                        <div>
                          <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>Company</p>
                          <p className="text-gray-800" style={{ fontSize: "0.88rem" }}>{selectedInquiry.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject & Message */}
                <div>
                  <h3 className="text-[#0c4a6e] mb-2" style={{ fontSize: "0.95rem" }}>
                    {selectedInquiry.subject}
                  </h3>
                  <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-4">
                    <p className="text-gray-600 whitespace-pre-wrap leading-relaxed" style={{ fontSize: "0.88rem" }}>
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>

                {/* Change Status */}
                <div>
                  <p className="text-gray-500 mb-2" style={{ fontSize: "0.82rem" }}>Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => updateStatus(selectedInquiry.id, s.value)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                          selectedInquiry.status === s.value
                            ? "border-[#0369a1] bg-blue-50 text-[#0369a1] ring-1 ring-[#0369a1]/20"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                        style={{ fontSize: "0.8rem" }}
                      >
                        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Note */}
                <div>
                  <p className="text-gray-500 mb-2 flex items-center gap-1.5" style={{ fontSize: "0.82rem" }}>
                    <StickyNote size={14} className="text-amber-400" />
                    Admin Note
                  </p>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all resize-none"
                    style={{ fontSize: "0.85rem" }}
                    placeholder="Add an internal note about this inquiry..."
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => saveAdminNote(selectedInquiry.id)}
                      className="px-4 py-2 bg-[#0369a1] text-white rounded-lg hover:bg-[#0c4a6e] transition-colors cursor-pointer flex items-center gap-1.5"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <Send size={13} />
                      Save Note
                    </button>
                  </div>
                </div>

                {/* Timestamps */}
                {selectedInquiry.updatedAt && (
                  <p className="text-gray-300 text-center" style={{ fontSize: "0.72rem" }}>
                    Last updated: {formatDate(selectedInquiry.updatedAt)} at {formatTime(selectedInquiry.updatedAt)}
                  </p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex items-center justify-between">
                <button
                  onClick={() => setShowDeleteConfirm(selectedInquiry.id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  style={{ fontSize: "0.82rem" }}
                >
                  <Trash2 size={14} />
                  Delete Inquiry
                </button>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                  style={{ fontSize: "0.85rem" }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowDeleteConfirm(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle size={28} className="text-red-500" />
              </div>
              <h3 className="text-[#0c4a6e] mb-2" style={{ fontSize: "1.1rem" }}>
                Delete Inquiry?
              </h3>
              <p className="text-gray-500 mb-6" style={{ fontSize: "0.85rem" }}>
                This action cannot be undone. The inquiry will be permanently removed from the system.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteInquiry(showDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ fontSize: "0.85rem" }}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Menu */}
      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="fixed top-16 right-4 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[70] w-56"
            ref={userMenuRef}
          >
            {/* User info */}
            <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0369a1] to-[#0284c7] flex items-center justify-center text-white" style={{ fontSize: "0.75rem" }}>
                  {safeUsername.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[#0c4a6e]" style={{ fontSize: "0.85rem" }}>{safeUsername}</p>
                  <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>Administrator</p>
                </div>
              </div>
            </div>
            <div className="p-1.5">
              <button
                onClick={() => { setShowPasswordModal(true); setShowUserMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-[#0369a1] transition-colors cursor-pointer"
                style={{ fontSize: "0.82rem" }}
              >
                <KeyRound size={15} />
                Change Password
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={() => { setShowUserMenu(false); onLogout(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
                style={{ fontSize: "0.82rem" }}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <ChangePasswordModal
            adminToken={adminToken}
            onClose={() => setShowPasswordModal(false)}
          />
        )}
      </AnimatePresence>

      {/* User Button (floating) */}
      <div
        className="fixed top-4 right-4 z-[70] flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 pl-3.5 pr-2 py-1.5 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => setShowUserMenu(!showUserMenu)}
        ref={showUserMenu ? undefined : userMenuRef}
      >
        <span className="text-gray-600 hidden sm:block" style={{ fontSize: "0.78rem" }}>{safeUsername}</span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0369a1] to-[#0284c7] flex items-center justify-center text-white" style={{ fontSize: "0.75rem" }}>
          {safeUsername.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

// ---- Change Password Modal ----

function ChangePasswordModal({
  adminToken,
  onClose,
}: {
  adminToken: string;
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
          "X-Admin-Token": adminToken,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to change password");
        setLoading(false);
        return;
      }
      toast.success("Password changed successfully!");
      onClose();
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-[#0369a1]" />
            <h2 className="text-[#0c4a6e]" style={{ fontSize: "1.05rem" }}>Change Password</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 400 }}>
              Current Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setError(""); }}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all"
                style={{ fontSize: "0.88rem" }}
                placeholder="Enter current password"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 400 }}>
              New Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all"
                style={{ fontSize: "0.88rem" }}
                placeholder="Min. 6 characters"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 400 }}>
              Confirm New Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1]/20 outline-none transition-all"
                style={{ fontSize: "0.88rem" }}
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100"
              >
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-red-600" style={{ fontSize: "0.8rem" }}>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              style={{ fontSize: "0.85rem" }}
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                loading ? "bg-[#0369a1]/70 text-white/70" : "bg-[#0369a1] text-white hover:bg-[#0c4a6e]"
              }`}
              style={{ fontSize: "0.85rem" }}
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                    <Shield size={14} />
                  </motion.div>
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  Update Password
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
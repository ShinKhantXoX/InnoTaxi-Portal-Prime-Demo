import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Highlight, themes } from "prism-react-renderer";
import { FileText, ArrowLeft, Code2, Copy, Check, X, ChevronDown, Clock, Info, List, Pencil, Trash2, CheckCircle2, BarChart3, TrendingUp, Download, Calendar } from "lucide-react";
import { mockData, type LicenseType } from "./LicenseTypeList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";
import { getDetailBackendCode, detailBackendFileConfig, detailReactCode, detailVueCode, detailAngularCode } from "./detailBackendCodes";
import { getUpdateBackendCode, updateBackendFileConfig, updateReactCode, updateVueCode, updateAngularCode } from "./updateBackendCodes";
import { getMonthlyChartBackendCode, monthlyChartBackendFileConfig, monthlyChartReactCode, monthlyChartVueCode, monthlyChartAngularCode } from "./chartMonthlyBackendCodes";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";

// ── API sample response builder ──
const sampleApiResponse = (item: LicenseType) => `// GET /api/v1/license-types/${item.id}
// Authorization: Bearer <token>

// Response — 200 OK
{
  "success": true,
  "data": {
    "id": ${item.id},
    "code": "${item.code}",
    "name": "${item.name}",
    "category": "${item.category}",
    "vehicle_class": "${item.vehicleClass}",
    "validity_years": ${item.validityYears},
    "status": "${item.status}",
    "created_at": "${item.createdAt}T00:00:00.000Z",
    "updated_at": "${item.updatedAt}T12:00:00.000Z",
    "deleted_at": ${item.deletedAt ? `"${item.deletedAt}T00:00:00.000Z"` : "null"}
  }
}`;

export function LicenseTypeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  // Code preview state
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);
  const [codeCategory, setCodeCategory] = useState<"frontend" | "backend">("frontend");
  const [codeFramework, setCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [backendLang, setBackendLang] = useState<BackendLang>("nestjs");
  const [backendLangOpen, setBackendLangOpen] = useState(false);
  const backendLangRef = useRef<HTMLDivElement>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Form state for editable fields
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formVehicleClass, setFormVehicleClass] = useState("");
  const [formValidityYears, setFormValidityYears] = useState("");
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // Update notification state
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [updateCountdown, setUpdateCountdown] = useState(3);

  // Chart download state
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);

  // Chart year filter state
  const chartYearOptions = [2026, 2027, 2028, 2029, 2030];
  const [chartYear, setChartYear] = useState(2026);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  // Chart code preview state
  const [chartCodePreviewOpen, setChartCodePreviewOpen] = useState(false);
  const [chartCodeCategory, setChartCodeCategory] = useState<"frontend" | "backend">("frontend");
  const [chartCodeFramework, setChartCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [chartBackendLang, setChartBackendLang] = useState<BackendLang>("nestjs");
  const [chartBackendLangOpen, setChartBackendLangOpen] = useState(false);
  const chartBackendLangRef = useRef<HTMLDivElement>(null);
  const [chartCodeCopied, setChartCodeCopied] = useState(false);

  const item = mockData.find((lt) => lt.id === Number(id));
  const otherTypes = mockData.filter((lt) => lt.id !== Number(id));

  // Initialize form state when item loads
  useEffect(() => {
    if (item) {
      setFormCode(item.code);
      setFormName(item.name);
      setFormCategory(item.category);
      setFormVehicleClass(item.vehicleClass);
      setFormValidityYears(String(item.validityYears));
      setFormStatus(item.status as "ACTIVE" | "INACTIVE");
    }
  }, [item]);

  // Close backend lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backendLangRef.current && !backendLangRef.current.contains(e.target as Node)) {
        setBackendLangOpen(false);
      }
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(e.target as Node)) {
        setDownloadDropdownOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target as Node)) {
        setYearDropdownOpen(false);
      }
      if (chartBackendLangRef.current && !chartBackendLangRef.current.contains(e.target as Node)) {
        setChartBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Not found state
  if (!item) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-[#e53935]" />
          </div>
          <h2 className="text-[18px] text-[#0f172a] font-semibold mb-1.5">License Type Not Found</h2>
          <p className="text-[13px] text-[#94a3b8] mb-5">The requested license type does not exist or has been deleted.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] text-[#64748b] hover:text-[#0f172a] bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#cbd5e1] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const infoFields = [
    { label: "Code", value: item.code },
    { label: "License Name", value: item.name },
    { label: "Category", value: item.category },
    { label: "Vehicle Class", value: item.vehicleClass },
    { label: "Validity Period", value: `${item.validityYears} ${item.validityYears === 1 ? "Year" : "Years"}` },
    { label: "Status", value: item.status, isStatus: true },
  ];

  const timestampFields = [
    { label: "Created At", value: item.createdAt, icon: "+", bg: "bg-[#f0fdf4]", text: "text-[#22c55e]" },
    { label: "Updated At", value: item.updatedAt, icon: "~", bg: "bg-[#eff6ff]", text: "text-[#3b82f6]" },
    { label: "Deleted At", value: item.deletedAt ?? "\u2014", icon: "\u00D7", bg: "bg-[#fef2f2]", text: "text-[#ef4444]", isNull: !item.deletedAt },
  ];

  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: updateReactCode, vue: updateVueCode, angular: updateAngularCode }[codeFramework];
    }
    return getUpdateBackendCode(backendLang);
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "LicenseTypeUpdate.tsx", vue: "LicenseTypeUpdate.vue", angular: "license-type-update.component.ts" }[codeFramework];
    }
    return updateBackendFileConfig[backendLang].file;
  };

  const handleCopy = () => {
    const text = getCode();
    const fallbackCopy = (t: string) => {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const resetCodePreview = () => {
    setCodePreviewOpen(false);
    setCodeCopied(false);
    setCodeCategory("frontend");
    setCodeFramework("react");
    setBackendLang("nestjs");
    setBackendLangOpen(false);
  };

  // Chart code preview helpers
  const getChartCode = () => {
    if (chartCodeCategory === "frontend") {
      return { react: monthlyChartReactCode, vue: monthlyChartVueCode, angular: monthlyChartAngularCode }[chartCodeFramework];
    }
    return getMonthlyChartBackendCode(chartBackendLang);
  };

  const getChartFilename = () => {
    if (chartCodeCategory === "frontend") {
      return { react: "MonthlyDriverChart.tsx", vue: "MonthlyDriverChart.vue", angular: "monthly-driver-chart.component.ts" }[chartCodeFramework];
    }
    return monthlyChartBackendFileConfig[chartBackendLang].file;
  };

  const handleChartCodeCopy = () => {
    const text = getChartCode();
    const fallbackCopy = (t: string) => {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }
    setChartCodeCopied(true);
    setTimeout(() => setChartCodeCopied(false), 2000);
  };

  const resetChartCodePreview = () => {
    setChartCodePreviewOpen(false);
    setChartCodeCopied(false);
    setChartCodeCategory("frontend");
    setChartCodeFramework("react");
    setChartBackendLang("nestjs");
    setChartBackendLangOpen(false);
  };

  // Handle update action
  const handleUpdate = () => {
    setShowUpdateNotification(true);
    setUpdateCountdown(3);
  };

  // Handle chart download
  const handleChartDownload = async (format: "png" | "jpg") => {
    if (!chartRef.current) return;
    setDownloadDropdownOpen(false);
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        onclone: (clonedDoc: Document) => {
          // Override oklch CSS custom properties that html2canvas cannot parse
          const root = clonedDoc.documentElement;
          root.style.setProperty("--foreground", "#1b1b1f");
          root.style.setProperty("--card-foreground", "#1b1b1f");
          root.style.setProperty("--popover", "#ffffff");
          root.style.setProperty("--popover-foreground", "#1b1b1f");
          root.style.setProperty("--primary-foreground", "#ffffff");
          root.style.setProperty("--secondary", "#ededf1");
          root.style.setProperty("--ring", "#a1a1a1");
          root.style.setProperty("--chart-1", "#e76f51");
          root.style.setProperty("--chart-2", "#2a9d8f");
          root.style.setProperty("--chart-3", "#264653");
          root.style.setProperty("--chart-4", "#e9c46a");
          root.style.setProperty("--chart-5", "#f4a261");
        },
      });
      const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      const link = document.createElement("a");
      link.download = `monthly-driver-count-${item?.code?.toLowerCase() ?? "chart"}-${chartYear}.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Chart download failed:", err);
    }
  };

  // Countdown timer for update notification
  useEffect(() => {
    if (!showUpdateNotification) return;
    if (updateCountdown <= 0) {
      setShowUpdateNotification(false);
      return;
    }
    const timer = setTimeout(() => setUpdateCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showUpdateNotification, updateCountdown]);

  // Generate monthly driver count data relative to this license type
  const generateMonthlyData = (code: string, year: number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const seed = code.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const yearOffset = year - 2026;
    const baseDrivers: Record<string, number> = {
      THA: 24, KA: 58, KHA: 82, GA: 12, GHA: 65, NGA: 30, ZA: 15, HA: 38, SA: 9, INT: 6, TMP: 4,
    };
    const base = (baseDrivers[code] ?? 20) + yearOffset * 3;
    return months.map((month, i) => {
      const seasonal = Math.sin((i + 2) * 0.5) * (base * 0.18);
      const growth = i * (base * 0.025) + yearOffset * 1.5;
      const active = Math.max(2, Math.round(base + seasonal + growth));
      const pending = Math.max(1, Math.round(base * 0.15 + Math.sin((i + seed + yearOffset) * 0.7) * (base * 0.06)));
      const suspended = Math.max(0, Math.round(base * 0.06 + Math.cos((i + seed + yearOffset) * 0.9) * (base * 0.03)));
      const inactive = Math.max(0, Math.round(base * 0.04 + Math.sin((i + seed + yearOffset + 2) * 0.5) * (base * 0.02)));
      return { month, active, pending, suspended, inactive };
    });
  };

  const monthlyData = generateMonthlyData(item.code, chartYear);
  const totalActive = monthlyData.reduce((s, d) => s + d.active, 0);
  const totalPending = monthlyData.reduce((s, d) => s + d.pending, 0);
  const peakMonth = monthlyData.reduce((max, d) => (d.active > max.active ? d : max), monthlyData[0]);

  return (
    <div>
      <Toast ref={toast} />

      {/* ═══ Page Header ═══ */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#fef2f2] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#e53935]" />
            </div>
            <div>
              <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">
                Driver License Type Detail
              </h1>
              <p className="text-[12px] text-[#94a3b8]">
                <span className="text-[12px]">Master Data Setup</span>
                <span className="mx-0.5">&rsaquo;</span>
                <button onClick={() => { sessionStorage.setItem("innotaxi_active_item", "License Type"); navigate("/dashboard"); }} className="text-[12px] font-inherit hover:text-[#64748b] transition-colors cursor-pointer">Driver License Type</button>
                <span className="mx-0.5">&rsaquo;</span>
                <span className="text-[#64748b] font-medium">{item.code}</span>
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* ═══ Stats Row ═══ */}
      

      {/* ═══ Monthly Driver Count Bar Chart ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-[12px] border border-[#e2e8f0] p-5 mb-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fef2f2] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#e53935]" />
            </div>
            <div>
              <h3 className="text-[15px] text-[#0f172a] font-semibold">Monthly Driver Count</h3>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">
                {chartYear} driver statistics for <span className="text-[#64748b] font-medium">{item.code} — {item.name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#22c55e]" />
              <span className="text-[11px] text-[#64748b]">ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#f59e0b]" />
              <span className="text-[11px] text-[#64748b]">PENDING</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#e53935]" />
              <span className="text-[11px] text-[#64748b]">SUSPENDED</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#94a3b8]" />
              <span className="text-[11px] text-[#64748b]">INACTIVE</span>
            </div>
            {/* Download Dropdown */}
            <div className="relative" ref={downloadDropdownRef}>
              <button
                onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#cbd5e1]"
                title="Download Chart"
              >
                <Download className="w-3.5 h-3.5" />
                <ChevronDown className={`w-3 h-3 transition-transform ${downloadDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {downloadDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50 min-w-[140px]">
                  <button
                    onClick={() => handleChartDownload("png")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-[#475569] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded bg-[#eef2ff] flex items-center justify-center text-[9px] text-[#6366f1] font-semibold">PNG</span>
                    Download PNG
                  </button>
                  <button
                    onClick={() => handleChartDownload("jpg")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-[#475569] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded bg-[#fef2f2] flex items-center justify-center text-[9px] text-[#e53935] font-semibold">JPG</span>
                    Download JPG
                  </button>
                </div>
              )}
            </div>
            {/* Year Dropdown */}
            <div className="relative" ref={yearDropdownRef}>
              <button
                onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#cbd5e1]"
                title="Select Year"
              >
                <Calendar className="w-3.5 h-3.5" />
                <ChevronDown className={`w-3 h-3 transition-transform ${yearDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {yearDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50 min-w-[140px]">
                  {chartYearOptions.map((year) => (
                    <button
                      key={year}
                      onClick={() => { setChartYear(year); setYearDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] transition-colors cursor-pointer ${
                        chartYear === year
                          ? "bg-[#fef3c7] text-[#92400e] font-medium"
                          : "text-[#475569] hover:bg-[#f8fafc]"
                      }`}
                    >
                      {year}
                      {chartYear === year && <Check className="w-3 h-3 ml-auto text-[#92400e]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Code Preview Button */}
            <button
              onClick={() => setChartCodePreviewOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#c7d2fe]"
              title="View Chart API Code"
            >
              
              <span>&lt;/&gt;</span>
            </button>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="bg-[#f0fdf4] rounded-lg px-3.5 py-2.5">
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">Avg. Active / Month</p>
            <p className="text-[18px] text-[#22c55e] font-semibold tracking-[-0.3px] mt-0.5">{Math.round(totalActive / 12)}</p>
          </div>
          <div className="bg-[#fffbeb] rounded-lg px-3.5 py-2.5">
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">Total Pending</p>
            <p className="text-[18px] text-[#f59e0b] font-semibold tracking-[-0.3px] mt-0.5">{totalPending}</p>
          </div>
          <div className="bg-[#fef2f2] rounded-lg px-3.5 py-2.5">
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">Total Suspended</p>
            <p className="text-[18px] text-[#e53935] font-semibold tracking-[-0.3px] mt-0.5">{monthlyData.reduce((s, d) => s + d.suspended, 0)}</p>
          </div>
          <div className="bg-[#f8fafc] rounded-lg px-3.5 py-2.5">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#22c55e]" />
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">Peak Month</p>
            </div>
            <p className="text-[18px] text-[#0f172a] font-semibold tracking-[-0.3px] mt-0.5">{peakMonth.month} <span className="text-[12px] text-[#64748b] font-normal">({peakMonth.active})</span></p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px]" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart key={`${item.code}-${chartYear}`} data={monthlyData} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
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
                labelFormatter={(label: string) => `${label} ${chartYear} — ${item.code}`}
                cursor={{ fill: "rgba(229, 57, 53, 0.04)" }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ top: 10, right: 10 }}
                iconType="circle"
                iconSize={8}
                itemStyle={{ fontSize: "11px", color: "#64748b" }}
              />
              <Line type="monotone" dataKey="active" name="ACTIVE" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="pending" name="PENDING" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="suspended" name="SUSPENDED" stroke="#e53935" strokeWidth={2} dot={{ r: 3, fill: "#e53935" }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="inactive" name="INACTIVE" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3, fill: "#94a3b8" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f1f5f9]">
          <span className="text-[11px] text-[#94a3b8]">Data period: Jan — Dec {chartYear} &middot; License type: {item.code}</span>
          <span className="text-[11px] text-[#e53935] font-medium">Peak: {peakMonth.month} ({peakMonth.active} active drivers)</span>
        </div>
      </motion.div>

      {/* ═══ Info + Timestamps Cards ═══ */}
      <div className="grid grid-cols-1 gap-5 mb-5">
        {/* License Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="bg-white rounded-[12px] border border-[#e2e8f0] p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                <Info className="w-4 h-4 text-[#6366f1]" />
              </div>
              <div>
                <h3 className="text-[15px] text-[#0f172a] font-semibold">License Information</h3>
                <p className="text-[12px] text-[#94a3b8] mt-0.5"><span className="text-[#64748b] font-medium">{item.name}</span></p>
              </div>
            </div>
            <button
              onClick={() => setCodePreviewOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#c7d2fe]"
              title="View Update Code"
            >
              
              <span>&lt;/&gt;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-4">
            {/* ID */}
            

            {/* Code */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Code</label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
              />
            </div>

            {/* License Name */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">License Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Category</label>
              <input
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
              />
            </div>

            {/* Validity Period */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Validity Period (Years)</label>
              <input
                type="number"
                min="1"
                value={formValidityYears}
                onChange={(e) => setFormValidityYears(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Status</label>
              <div className="relative">
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                  className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all appearance-none cursor-pointer pr-8"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Vehicle Class - Full Width, Last Field */}
            <div className="col-span-full">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Vehicle Class</label>
              <input
                type="text"
                value={formVehicleClass}
                onChange={(e) => setFormVehicleClass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
              />
            </div>

            {/* Created At */}
            

            {/* Updated At */}
            

            {/* Deleted At */}
            
          </div>

          {/* Update Button */}
          <div className="flex justify-end mt-5 pt-4 border-t border-[#f1f5f9]">
            <button
              onClick={handleUpdate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-medium text-white bg-[#e53935] hover:bg-[#d32f2f] active:bg-[#c62828] transition-all cursor-pointer shadow-[0_1px_3px_rgba(229,57,53,0.3)] hover:shadow-[0_4px_12px_rgba(229,57,53,0.35)]"
            >
              <Pencil className="w-3.5 h-3.5" />
              Update
            </button>
          </div>
        </motion.div>

        {/* Timestamps Card */}
        
      </div>

      {/* ═══ Other License Types ═══ */}
      

      {/* ═══ Code Preview Dialog ═══ */}
      <Dialog
        visible={codePreviewOpen}
        onHide={resetCodePreview}
        modal
        dismissableMask
        draggable={false}
        resizable={false}
        className="!border-none !shadow-none"
        contentClassName="!p-0 !bg-transparent"
        headerClassName="!hidden"
        maskClassName="!bg-black/50 !backdrop-blur-sm"
        style={{ width: "780px", maxWidth: "92vw" }}
        pt={{ root: { className: "!bg-transparent !border-none !shadow-none" } }}
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#e2e8f0]">
          {/* Dialog Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#e2e8f0]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-[#4f46e5]" />
              </div>
              <div>
                <h3 className="text-[13px] text-[#0f172a] font-semibold">Update License Type Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">PUT /api/v1/license-types/:id</p>
              </div>
            </div>
            <button
              onClick={resetCodePreview}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#fee2e2] hover:text-[#ef4444] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-0 px-5 pt-3 pb-0 bg-white border-b border-[#e2e8f0]">
            {([
              { key: "frontend" as const, label: "Frontend", icon: "\uD83D\uDDA5\uFE0F", color: "#6366f1" },
              { key: "backend" as const, label: "Backend", icon: "\u2699\uFE0F", color: "#f59e0b" },
            ]).map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setCodeCategory(cat.key); setCodeCopied(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] transition-all cursor-pointer relative ${
                  codeCategory === cat.key
                    ? "text-[#0f172a] font-semibold"
                    : "text-[#94a3b8] hover:text-[#64748b]"
                }`}
              >
                <span className="text-[12px]">{cat.icon}</span>
                {cat.label}
                {codeCategory === cat.key && (
                  <div className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full" style={{ backgroundColor: cat.color }} />
                )}
              </button>
            ))}
          </div>

          {/* Sub-tabs & Copy */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
            <div className="flex items-center gap-1">
              {codeCategory === "frontend" ? (
                <div className="flex items-center gap-1 bg-[#f1f5f9] rounded-lg p-0.5">
                  {(["react", "vue", "angular"] as const).map((fw) => {
                    const fwConfig: Record<string, { label: string; icon: React.ReactNode }> = {
                      react: { label: "PrimeReact", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="3" fill="#61DAFB"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)"/></svg> },
                      vue: { label: "PrimeVue", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M2 4h5.6L16 18.4 24.4 4H30L16 28 2 4z" fill="#41B883"/><path d="M6.8 4H12l4 7.2L20 4h5.2L16 20 6.8 4z" fill="#34495E"/></svg> },
                      angular: { label: "PrimeAngular", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M16 2L3 7l2 18L16 30l11-5 2-18L16 2z" fill="#DD0031"/><path d="M16 2v28l11-5 2-18L16 2z" fill="#C3002F"/><path d="M16 5.7L8.8 22h2.7l1.4-3.6h6.2L20.5 22h2.7L16 5.7zm2.2 10.7h-4.4L16 11l2.2 5.4z" fill="#fff"/></svg> },
                    };
                    const cfg = fwConfig[fw];
                    return (
                      <button
                        key={fw}
                        onClick={() => { setCodeFramework(fw); setCodeCopied(false); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] transition-all cursor-pointer ${
                          codeFramework === fw
                            ? "bg-white text-[#0f172a] shadow-sm font-medium"
                            : "text-[#64748b] hover:text-[#334155]"
                        }`}
                      >
                        <span className="flex items-center">{cfg.icon}</span>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative" ref={backendLangRef}>
                    <button
                      onClick={() => setBackendLangOpen(!backendLangOpen)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a] transition-colors cursor-pointer"
                    >
                      <span>{backendLangConfig[backendLang].icon}</span>
                      {backendLangConfig[backendLang].label}
                      <ChevronDown className={`w-3 h-3 transition-transform ${backendLangOpen ? "rotate-180" : ""}`} />
                    </button>
                    {backendLangOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50 min-w-[180px]">
                        {backendLangOptions.map((lang) => {
                          const cfg = backendLangConfig[lang];
                          return (
                            <button
                              key={lang}
                              onClick={() => { setBackendLang(lang); setBackendLangOpen(false); setCodeCopied(false); }}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors cursor-pointer ${
                                backendLang === lang
                                  ? "bg-[#fef3c7] text-[#92400e] font-medium"
                                  : "text-[#475569] hover:bg-[#f8fafc]"
                              }`}
                            >
                              <span className="text-[12px]">{cfg.icon}</span>
                              {cfg.label}
                              {backendLang === lang && <Check className="w-3 h-3 ml-auto text-[#92400e]" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer border ${
                codeCopied
                  ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
                  : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] border-[#e2e8f0]"
              }`}
            >
              {codeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {codeCopied ? "Copied!" : "Copy Code"}
            </button>
          </div>

          {/* Code Block */}
          <div className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] border-b border-[#1e293b]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
              </div>
              <span className="text-[10px] text-[#64748b] ml-2">{getFilename()}</span>
            </div>
            <Highlight
              theme={codeCategory === "frontend" ? themes.nightOwl : themes.vsDark}
              code={getCode()}
              language={codeCategory === "frontend" ? (codeFramework === "angular" ? "typescript" : codeFramework === "vue" ? "markup" : "tsx") : "typescript"}
            >
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre style={{ ...style, margin: 0, padding: "16px", fontSize: "12px", lineHeight: "1.6", maxHeight: "460px", overflow: "auto" }}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      <span className="inline-block w-8 text-right mr-4 text-[#475569] select-none text-[11px]">{i + 1}</span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      </Dialog>

      {/* Chart Code Preview Dialog */}
      <Dialog
        visible={chartCodePreviewOpen}
        onHide={resetChartCodePreview}
        modal
        dismissableMask
        draggable={false}
        resizable={false}
        className="!border-none !shadow-none"
        contentClassName="!p-0 !bg-transparent"
        headerClassName="!hidden"
        maskClassName="!bg-black/50 !backdrop-blur-sm"
        style={{ width: "780px", maxWidth: "92vw" }}
        pt={{ root: { className: "!bg-transparent !border-none !shadow-none" } }}
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#e2e8f0]">
          {/* Dialog Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#e2e8f0]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-[#4f46e5]" />
              </div>
              <div>
                <h3 className="text-[13px] text-[#0f172a] font-semibold">Monthly Driver Count Chart Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">GET /api/v1/license-types/:id/monthly-driver-count</p>
              </div>
            </div>
            <button
              onClick={resetChartCodePreview}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#fee2e2] hover:text-[#ef4444] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-0 px-5 pt-3 pb-0 bg-white border-b border-[#e2e8f0]">
            {([
              { key: "frontend" as const, label: "Frontend", icon: "\uD83D\uDDA5\uFE0F", color: "#6366f1" },
              { key: "backend" as const, label: "Backend", icon: "\u2699\uFE0F", color: "#f59e0b" },
            ]).map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setChartCodeCategory(cat.key); setChartCodeCopied(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] transition-all cursor-pointer relative ${
                  chartCodeCategory === cat.key
                    ? "text-[#0f172a] font-semibold"
                    : "text-[#94a3b8] hover:text-[#64748b]"
                }`}
              >
                <span className="text-[12px]">{cat.icon}</span>
                {cat.label}
                {chartCodeCategory === cat.key && (
                  <div className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full" style={{ backgroundColor: cat.color }} />
                )}
              </button>
            ))}
          </div>

          {/* Sub-tabs & Copy */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
            <div className="flex items-center gap-1">
              {chartCodeCategory === "frontend" ? (
                <div className="flex items-center gap-1 bg-[#f1f5f9] rounded-lg p-0.5">
                  {(["react", "vue", "angular"] as const).map((fw) => {
                    const fwConfig: Record<string, { label: string; icon: React.ReactNode }> = {
                      react: { label: "PrimeReact", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="3" fill="#61DAFB"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)"/></svg> },
                      vue: { label: "PrimeVue", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M2 4h5.6L16 18.4 24.4 4H30L16 28 2 4z" fill="#41B883"/><path d="M6.8 4H12l4 7.2L20 4h5.2L16 20 6.8 4z" fill="#34495E"/></svg> },
                      angular: { label: "PrimeAngular", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M16 2L3 7l2 18L16 30l11-5 2-18L16 2z" fill="#DD0031"/><path d="M16 2v28l11-5 2-18L16 2z" fill="#C3002F"/><path d="M16 5.7L8.8 22h2.7l1.4-3.6h6.2L20.5 22h2.7L16 5.7zm2.2 10.7h-4.4L16 11l2.2 5.4z" fill="#fff"/></svg> },
                    };
                    const cfg = fwConfig[fw];
                    return (
                      <button
                        key={fw}
                        onClick={() => { setChartCodeFramework(fw); setChartCodeCopied(false); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] transition-all cursor-pointer ${
                          chartCodeFramework === fw
                            ? "bg-white text-[#0f172a] shadow-sm font-medium"
                            : "text-[#64748b] hover:text-[#334155]"
                        }`}
                      >
                        <span className="flex items-center">{cfg.icon}</span>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative" ref={chartBackendLangRef}>
                    <button
                      onClick={() => setChartBackendLangOpen(!chartBackendLangOpen)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a] transition-colors cursor-pointer"
                    >
                      <span>{backendLangConfig[chartBackendLang].icon}</span>
                      {backendLangConfig[chartBackendLang].label}
                      <ChevronDown className={`w-3 h-3 transition-transform ${chartBackendLangOpen ? "rotate-180" : ""}`} />
                    </button>
                    {chartBackendLangOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50 min-w-[180px]">
                        {backendLangOptions.map((lang) => {
                          const cfg = backendLangConfig[lang];
                          return (
                            <button
                              key={lang}
                              onClick={() => { setChartBackendLang(lang); setChartBackendLangOpen(false); setChartCodeCopied(false); }}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors cursor-pointer ${
                                chartBackendLang === lang
                                  ? "bg-[#fef3c7] text-[#92400e] font-medium"
                                  : "text-[#475569] hover:bg-[#f8fafc]"
                              }`}
                            >
                              <span className="text-[12px]">{cfg.icon}</span>
                              {cfg.label}
                              {chartBackendLang === lang && <Check className="w-3 h-3 ml-auto text-[#92400e]" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleChartCodeCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer border ${
                chartCodeCopied
                  ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
                  : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] border-[#e2e8f0]"
              }`}
            >
              {chartCodeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {chartCodeCopied ? "Copied!" : "Copy Code"}
            </button>
          </div>

          {/* Code Block */}
          <div className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] border-b border-[#1e293b]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
              </div>
              <span className="text-[10px] text-[#64748b] ml-2">{getChartFilename()}</span>
            </div>
            <Highlight
              theme={chartCodeCategory === "frontend" ? themes.nightOwl : themes.vsDark}
              code={getChartCode()}
              language={chartCodeCategory === "frontend" ? (chartCodeFramework === "angular" ? "typescript" : chartCodeFramework === "vue" ? "markup" : "tsx") : "typescript"}
            >
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre style={{ ...style, margin: 0, padding: "16px", fontSize: "12px", lineHeight: "1.6", maxHeight: "460px", overflow: "auto" }}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      <span className="inline-block w-8 text-right mr-4 text-[#475569] select-none text-[11px]">{i + 1}</span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      </Dialog>

      {/* Update Notification */}
      {showUpdateNotification && (
        <motion.div
          initial={{ opacity: 0, x: 60, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed top-5 right-5 z-[9999] w-[340px]"
        >
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#dcfce7] overflow-hidden">
            {/* Green progress bar */}
            <div className="h-[3px] bg-[#e2e8f0] w-full">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#0f172a] font-semibold tracking-[-0.1px]">Updated Successfully</p>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">License type <span className="text-[#64748b] font-medium">{formCode}</span> has been updated.</p>
              </div>
              <button
                onClick={() => setShowUpdateNotification(false)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[#cbd5e1] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
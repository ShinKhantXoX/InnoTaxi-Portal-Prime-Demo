import { useState, useRef, useEffect, type ReactNode } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Server, Code2, FileCode2, BarChart3, PieChart, Table, Pencil, Eye, LineChart, Droplets, Search, X } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import {
  backendLangConfig,
  backendLangOptions,
  getChartBackendCode,
  getPieBackendCode,
  tableBackendFileConfig,
  type BackendLang,
} from "./chartBackendCodes";
import { getTableBackendCode } from "./tableBackendCodes";
import { getDetailBackendCode, detailBackendFileConfig } from "./detailBackendCodes";
import { getUpdateBackendCode, updateBackendFileConfig } from "./updateBackendCodes";
import { getMonthlyChartBackendCode, monthlyChartBackendFileConfig } from "./chartMonthlyBackendCodes";
import { chartBackendCode, pieBackendCode, tableBackendCode } from "./LicenseTypeList";
import { licensePolicyBackendCode, licensePolicyBackendFileConfig, getCreatePolicyBackendCode, createPolicyBackendFileConfig } from "./licensePolicyBackendCodes";
import { bloodTypeBackendCode } from "./BloodTypeList";

// ─── Types ───
interface BackendSnippet {
  id: string;
  label: string;
  description: string;
  icon: typeof Server;
  endpoint: string;
  getCode: (lang: BackendLang) => string;
  getFile: (lang: BackendLang) => string;
}

interface PageSection {
  id: string;
  label: string;
  description: string;
  route: string;
  snippets: BackendSnippet[];
}

// ─── Copy helper ───
function copyToClipboard(text: string) {
  const fallbackCopy = (t: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = t;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
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
}

// ─── Page Data ───
const pages: PageSection[] = [
  {
    id: "license-list",
    label: "Driver License Type List",
    description: "Statistics endpoints and CRUD API for driver license type management",
    route: "/api/v1/license-types",
    snippets: [
      {
        id: "bar-chart-backend",
        label: "Bar Chart Statistics",
        description: "Driver count by driver license type with status breakdown",
        icon: BarChart3,
        endpoint: "GET /api/v1/license-types/driver-stats",
        getCode: (lang) => getChartBackendCode(lang, chartBackendCode),
        getFile: (lang) => backendLangConfig[lang].file.replace("Stats", "Stats"),
      },
      {
        id: "pie-chart-backend",
        label: "Distribution Statistics",
        description: "Driver distribution across all license categories",
        icon: PieChart,
        endpoint: "GET /api/v1/license-types/distribution",
        getCode: (lang) => getPieBackendCode(lang, pieBackendCode),
        getFile: (lang) => backendLangConfig[lang].file,
      },
      {
        id: "data-table-backend",
        label: "CRUD Operations",
        description: "Full REST API with pagination, search, filter, sort, and soft delete",
        icon: Table,
        endpoint: "GET|POST|PUT|DELETE /api/v1/license-types",
        getCode: (lang) => getTableBackendCode(lang, tableBackendCode),
        getFile: (lang) => tableBackendFileConfig[lang],
      },
    ],
  },
  {
    id: "license-detail",
    label: "Driver License Type Detail",
    description: "Single resource endpoints with update and monthly analytics",
    route: "/api/v1/license-types/:id",
    snippets: [
      {
        id: "detail-backend",
        label: "Detail Endpoint",
        description: "Retrieve single driver license type with relations and metadata",
        icon: Eye,
        endpoint: "GET /api/v1/license-types/:id",
        getCode: (lang) => getDetailBackendCode(lang),
        getFile: (lang) => detailBackendFileConfig[lang].file,
      },
      {
        id: "update-backend",
        label: "Update Endpoint",
        description: "Update driver license type fields with validation and audit logging",
        icon: Pencil,
        endpoint: "PUT /api/v1/license-types/:id",
        getCode: (lang) => getUpdateBackendCode(lang),
        getFile: (lang) => updateBackendFileConfig[lang].file,
      },
      {
        id: "monthly-chart-backend",
        label: "Monthly Analytics",
        description: "Monthly driver registration count with year filter",
        icon: LineChart,
        endpoint: "GET /api/v1/license-types/:id/monthly-drivers",
        getCode: (lang) => getMonthlyChartBackendCode(lang),
        getFile: (lang) => monthlyChartBackendFileConfig[lang].file,
      },
    ],
  },
  {
    id: "license-policy",
    label: "Driver License Policy",
    description: "Endpoints for managing driver license policies",
    route: "/api/v1/license-policies",
    snippets: [
      {
        id: "license-policy-backend",
        label: "License Policy Endpoint",
        description: "Retrieve and manage driver license policies",
        icon: FileCode2,
        endpoint: "GET|POST|PUT|DELETE /api/v1/license-policies",
        getCode: (lang) => licensePolicyBackendCode,
        getFile: (lang) => licensePolicyBackendFileConfig[lang] || backendLangConfig[lang].file,
      },
      {
        id: "create-policy-backend",
        label: "Create Policy Endpoint",
        description: "Create new driver license policy",
        icon: FileCode2,
        endpoint: "POST /api/v1/license-policies",
        getCode: (lang) => getCreatePolicyBackendCode(lang),
        getFile: (lang) => (createPolicyBackendFileConfig[lang] as any)?.file || backendLangConfig[lang].file,
      },
    ],
  },
  {
    id: "license-policy-detail",
    label: "Driver License Policy Detail",
    description: "Single resource endpoints with update for license policies",
    route: "/api/v1/license-policies/:id",
    snippets: [
      {
        id: "detail-policy-backend",
        label: "Detail & Update Endpoint",
        description: "Retrieve and update single license policy with validation",
        icon: FileCode2,
        endpoint: "GET|PUT /api/v1/license-policies/:id",
        getCode: (lang) => licensePolicyBackendCode,
        getFile: (lang) => licensePolicyBackendFileConfig[lang] || backendLangConfig[lang].file,
      },
    ],
  },
  {
    id: "blood-type",
    label: "Blood Type",
    description: "Endpoints for managing blood type master data",
    route: "/api/v1/blood-types",
    snippets: [
      {
        id: "blood-type-backend",
        label: "Blood Type CRUD",
        description: "Full REST API for blood type management with soft delete",
        icon: Droplets,
        endpoint: "GET|POST|PUT|DELETE /api/v1/blood-types",
        getCode: (lang) => bloodTypeBackendCode,
        getFile: (lang) => backendLangConfig[lang].file.replace("license-type", "blood-type").replace("LicenseType", "BloodType"),
      },
    ],
  },
];

// ─── API endpoints summary table data ───
const endpointRows = [
  { method: "GET", path: "/api/v1/license-types", description: "List all driver license types (paginated, searchable)", page: "Driver License Type List", category: "CRUD" },
  { method: "GET", path: "/api/v1/license-types/:id", description: "Get single driver license type by ID", page: "Driver License Type Detail", category: "CRUD" },
  { method: "POST", path: "/api/v1/license-types", description: "Create new driver license type", page: "Driver License Type List", category: "CRUD" },
  { method: "PUT", path: "/api/v1/license-types/:id", description: "Update driver license type fields", page: "Driver License Type Detail", category: "CRUD" },
  { method: "DELETE", path: "/api/v1/license-types/:id", description: "Soft delete driver license type", page: "Driver License Type List", category: "CRUD" },
  { method: "GET", path: "/api/v1/license-types/driver-stats", description: "Driver count by driver license type with status breakdown", page: "Driver License Type List", category: "Statistics" },
  { method: "GET", path: "/api/v1/license-types/driver-stats/summary", description: "Summary statistics for top driver license type", page: "Driver License Type List", category: "Statistics" },
  { method: "GET", path: "/api/v1/license-types/distribution", description: "Driver distribution across all categories", page: "Driver License Type List", category: "Statistics" },
  { method: "GET", path: "/api/v1/license-types/distribution/top", description: "Top 5 driver license types by driver count", page: "Driver License Type List", category: "Statistics" },
  { method: "GET", path: "/api/v1/license-types/:id/monthly-drivers", description: "Monthly driver registration count by year", page: "Driver License Type Detail", category: "Analytics" },
  { method: "GET", path: "/api/v1/license-policies", description: "List all driver license policies (paginated, searchable)", page: "Driver License Policy", category: "CRUD" },
  { method: "GET", path: "/api/v1/license-policies/:id", description: "Get single driver license policy by ID", page: "Driver License Policy", category: "CRUD" },
  { method: "POST", path: "/api/v1/license-policies", description: "Create new driver license policy", page: "Driver License Policy", category: "CRUD" },
  { method: "PUT", path: "/api/v1/license-policies/:id", description: "Update driver license policy fields", page: "Driver License Policy", category: "CRUD" },
  { method: "DELETE", path: "/api/v1/license-policies/:id", description: "Soft delete driver license policy", page: "Driver License Policy", category: "CRUD" },
  { method: "GET", path: "/api/v1/blood-types", description: "List all blood types (paginated, searchable)", page: "Blood Type", category: "CRUD" },
  { method: "GET", path: "/api/v1/blood-types/:id", description: "Get single blood type by ID", page: "Blood Type", category: "CRUD" },
  { method: "POST", path: "/api/v1/blood-types", description: "Create new blood type", page: "Blood Type", category: "CRUD" },
  { method: "PUT", path: "/api/v1/blood-types/:id", description: "Update blood type fields", page: "Blood Type", category: "CRUD" },
  { method: "DELETE", path: "/api/v1/blood-types/:id", description: "Soft delete blood type", page: "Blood Type", category: "CRUD" },
];

const methodColors: Record<string, { text: string; bg: string }> = {
  GET: { text: "#16a34a", bg: "#f0fdf4" },
  POST: { text: "#2563eb", bg: "#eff6ff" },
  PUT: { text: "#d97706", bg: "#fffbeb" },
  DELETE: { text: "#dc2626", bg: "#fef2f2" },
};

const categoryColors: Record<string, { text: string; bg: string }> = {
  CRUD: { text: "#6366f1", bg: "#eef2ff" },
  Statistics: { text: "#0891b2", bg: "#ecfeff" },
  Analytics: { text: "#7c3aed", bg: "#f5f3ff" },
};

// ─── Code Block Component ───
function BackendCodeBlock({ snippet }: { snippet: BackendSnippet }) {
  const [lang, setLang] = useState<BackendLang>("nestjs");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langDropdownOpen]);

  const code = snippet.getCode(lang);
  const filename = snippet.getFile(lang);
  const cfg = backendLangConfig[lang];

  const handleCopy = () => {
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e2e8f0]">
      {/* Header — matching driver license type dialog header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#eef2ff] flex items-center justify-center">
            <snippet.icon className="w-3.5 h-3.5 text-[#4f46e5]" />
          </div>
          <div>
            <h3 className="text-[13px] text-[#0f172a] font-semibold">{snippet.label}</h3>
            <p className="text-[10px] text-[#94a3b8]">{snippet.description}</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]">
          {snippet.endpoint}
        </span>
      </div>

      {/* Backend language dropdown + Copy Code — matching driver license type backend tab style */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a] transition-colors cursor-pointer"
            >
              <span>{cfg.icon}</span>
              {cfg.label}
              <ChevronDown className={`w-3 h-3 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {langDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50 min-w-[180px]">
                {backendLangOptions.map((l) => {
                  const lCfg = backendLangConfig[l];
                  return (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangDropdownOpen(false); setCopied(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors cursor-pointer ${
                        lang === l
                          ? "bg-[#fef3c7] text-[#92400e] font-medium"
                          : "text-[#475569] hover:bg-[#f8fafc]"
                      }`}
                    >
                      <span className="text-[12px]">{lCfg.icon}</span>
                      {lCfg.label}
                      {lang === l && <Check className="w-3 h-3 ml-auto text-[#92400e]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer border ${
            copied
              ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
              : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] border-[#e2e8f0]"
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>

      {/* Code Block — syntax highlighted */}
      <div className="overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] border-b border-[#1e293b]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
          </div>
          <span className="text-[10px] text-[#64748b] ml-2">{filename}</span>
        </div>
        <Highlight
          theme={themes.vsDark}
          code={code}
          language="typescript"
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                ...style,
                margin: 0,
                padding: "16px",
                fontSize: "12px",
                lineHeight: "1.6",
                maxHeight: "460px",
                overflow: "auto",
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-8 text-right mr-4 text-[#475569] select-none text-[11px]">
                    {i + 1}
                  </span>
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
  );
}

// ─── Main Page ───
export function BackendDev() {
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>(() => {
    const target = sessionStorage.getItem("innotaxi_dev_search_target");
    if (target) {
      sessionStorage.removeItem("innotaxi_dev_search_target");
      return Object.fromEntries(pages.map((p) => [p.id, p.id === target]));
    }
    return Object.fromEntries(pages.map((p) => [p.id, false]));
  });
  const [endpointsExpanded, setEndpointsExpanded] = useState(true);
  const [endpointSearch, setEndpointSearch] = useState("");

  const filteredEndpointRows = endpointRows.filter((row) => {
    if (!endpointSearch.trim()) return true;
    const q = endpointSearch.toLowerCase();
    return (
      row.method.toLowerCase().includes(q) ||
      row.path.toLowerCase().includes(q) ||
      row.description.toLowerCase().includes(q) ||
      row.page.toLowerCase().includes(q) ||
      row.category.toLowerCase().includes(q)
    );
  });

  // Listen for search navigation
  useEffect(() => {
    const handler = () => {
      const target = sessionStorage.getItem("innotaxi_dev_search_target");
      if (target) {
        sessionStorage.removeItem("innotaxi_dev_search_target");
        setExpandedPages(Object.fromEntries(pages.map((p) => [p.id, p.id === target])));
        setTimeout(() => {
          const el = document.getElementById(`backend-page-${target}`);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    };
    window.addEventListener("storage", handler);
    handler();
    return () => window.removeEventListener("storage", handler);
  }, []);

  const togglePage = (pageId: string) => {
    setExpandedPages((prev) => ({ ...prev, [pageId]: !prev[pageId] }));
  };

  const totalSnippets = pages.reduce((sum, p) => sum + p.snippets.length, 0);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center">
            <Server className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <h1 className="text-[22px] text-[#0f172a] font-semibold tracking-[-0.22px]">
              Backend Development
            </h1>
            <p className="text-[13px] text-[#64748b]">
              All backend API code across {pages.length} pages &middot; {totalSnippets} endpoints &middot; 8 language variants each
            </p>
          </div>
        </div>
      </div>

      {/* Language summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {([
          { lang: "nestjs" as BackendLang, color: "#e53935" },
          { lang: "nodejs" as BackendLang, color: "#68a063" },
          { lang: "java" as BackendLang, color: "#f89820" },
          { lang: "python" as BackendLang, color: "#306998" },
          { lang: "laravel" as BackendLang, color: "#ff2d20" },
          { lang: "csharp" as BackendLang, color: "#68217a" },
          { lang: "golang" as BackendLang, color: "#00ADD8" },
          { lang: "ruby" as BackendLang, color: "#CC342D" },
        ]).map(({ lang, color }) => {
          const cfg = backendLangConfig[lang];
          return (
            <div
              key={lang}
              className="rounded-xl border px-3 py-2.5"
              style={{ borderColor: `${color}25`, backgroundColor: `${color}08` }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[13px]">{cfg.icon}</span>
                <span className="text-[11px] font-semibold" style={{ color }}>{cfg.label}</span>
              </div>
              <p className="text-[10px] text-[#94a3b8] mt-0.5">{totalSnippets} endpoints</p>
            </div>
          );
        })}
      </div>

      {/* API Endpoints Summary Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden mb-4">
        <div className="flex items-center gap-3 px-5 py-4">
          <button
            onClick={() => setEndpointsExpanded(!endpointsExpanded)}
            className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#fef3c7] flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4 text-[#d97706]" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[14px] text-[#0f172a] font-semibold">API Endpoints Overview</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[10px] text-[#64748b] font-medium">
                  {endpointSearch.trim() ? `${filteredEndpointRows.length}/${endpointRows.length}` : `${endpointRows.length} endpoints`}
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">All REST API routes across the application</p>
            </div>
          </button>

          {/* Search box */}
          <div className="relative hidden sm:flex items-center">
            <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={endpointSearch}
              onChange={(e) => {
                setEndpointSearch(e.target.value);
                if (!endpointsExpanded) setEndpointsExpanded(true);
              }}
              placeholder="Search routes..."
              className="w-[180px] pl-8 pr-7 py-1.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[11px] text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#d97706] focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,119,6,0.08)] transition-all"
            />
            {endpointSearch && (
              <button
                onClick={() => setEndpointSearch("")}
                className="absolute right-2 w-4 h-4 flex items-center justify-center rounded-full text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setEndpointsExpanded(!endpointsExpanded)}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f1f5f9] transition-colors cursor-pointer"
          >
            {endpointsExpanded ? (
              <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
            )}
          </button>
        </div>

        {endpointsExpanded && (
          <div className="px-5 pb-5">
            {/* Mobile search — visible on small screens */}
            <div className="relative flex sm:hidden items-center mb-3">
              <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={endpointSearch}
                onChange={(e) => setEndpointSearch(e.target.value)}
                placeholder="Search routes..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[11px] text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#d97706] focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,119,6,0.08)] transition-all"
              />
              {endpointSearch && (
                <button
                  onClick={() => setEndpointSearch("")}
                  className="absolute right-2 w-4 h-4 flex items-center justify-center rounded-full text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold">Method</th>
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold">Endpoint</th>
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold hidden md:table-cell">Description</th>
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold hidden lg:table-cell">Page</th>
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEndpointRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center">
                        <Search className="w-6 h-6 text-[#cbd5e1] mx-auto mb-2" />
                        <p className="text-[12px] text-[#64748b]">No endpoints match "<span className="font-medium">{endpointSearch}</span>"</p>
                        <p className="text-[10px] text-[#94a3b8] mt-0.5">Try searching by method, path, or category</p>
                      </td>
                    </tr>
                  ) : (
                    filteredEndpointRows.map((row, idx) => {
                      const mc = methodColors[row.method] ?? { text: "#64748b", bg: "#f1f5f9" };
                      const cc = categoryColors[row.category] ?? { text: "#64748b", bg: "#f1f5f9" };
                      return (
                        <tr
                          key={idx}
                          className={`border-b border-[#f1f5f9] last:border-0 ${idx % 2 === 0 ? "" : "bg-[#fafbfc]"}`}
                        >
                          <td className="px-3 py-2">
                            <span
                              className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wide"
                              style={{ color: mc.text, backgroundColor: mc.bg }}
                            >
                              {row.method}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <code className="text-[11px] text-[#0f172a] font-mono">{row.path}</code>
                          </td>
                          <td className="px-3 py-2 hidden md:table-cell">
                            <span className="text-[11px] text-[#64748b]">{row.description}</span>
                          </td>
                          <td className="px-3 py-2 hidden lg:table-cell">
                            <span className="text-[10px] text-[#94a3b8] font-medium">{row.page}</span>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold"
                              style={{ color: cc.text, backgroundColor: cc.bg }}
                            >
                              {row.category}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pages with code previews */}
      <div className="flex flex-col gap-4">
        {pages.map((page) => {
          const isExpanded = expandedPages[page.id] ?? false;
          return (
            <div
              key={page.id}
              id={`backend-page-${page.id}`}
              className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden"
            >
              {/* Page header */}
              <button
                onClick={() => togglePage(page.id)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                  <FileCode2 className="w-4 h-4 text-[#64748b]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[14px] text-[#0f172a] font-semibold">{page.label}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[10px] text-[#64748b] font-medium">
                      {page.snippets.length} endpoint{page.snippets.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8]">{page.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#94a3b8] font-mono hidden sm:block">{page.route}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
                  )}
                </div>
              </button>

              {/* Snippet cards */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0">
                  <div className="flex flex-col gap-4">
                    {page.snippets.map((snippet) => (
                      <BackendCodeBlock key={snippet.id} snippet={snippet} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
import { useState, useEffect, type ReactNode } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Code, Code2, FileCode2, BarChart3, PieChart, Table, Pencil, Eye, LineChart, LogIn, Plus, Droplets, ShieldAlert, UserPlus } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

// Login page codes
import {
  vueTemplate, vueScript, vueSetup,
  reactComponent, reactSetup,
  angularTemplate, angularComponent, angularSetup,
} from "./CodePreviewDialog";

// Driver License Type List codes
import {
  primeReactChartCode, primeVueChartCode, primeAngularChartCode,
  pieReactCode, pieVueCode, pieAngularCode,
  primeReactTableCode, primeVueTableCode, primeAngularTableCode,
} from "./LicenseTypeList";

// Policies List codes
import {
  policyReactTableCode, policyVueTableCode, policyAngularTableCode,
} from "./LicensePolicyList";

// Policies Add codes
import {
  createPolicyReactCode, createPolicyVueCode, createPolicyAngularCode,
} from "./licensePolicyBackendCodes";

// Policies Detail codes
import {
  detailReactCode as policyDetailReactCode,
  detailVueCode as policyDetailVueCode,
  detailAngularCode as policyDetailAngularCode,
} from "./LicensePolicyDetail";

// Blood Type List codes
import {
  bloodTypeReactTableCode, bloodTypeVueTableCode, bloodTypeAngularTableCode,
} from "./BloodTypeList";

// Emergency Profile codes
import {
  emergencyReactTableCode, emergencyVueTableCode, emergencyAngularTableCode,
  emergencyReactFormCode, emergencyVueFormCode, emergencyAngularFormCode,
} from "./emergencyProfileCodes";

// Driver License Type Detail codes
import { detailReactCode, detailVueCode, detailAngularCode } from "./detailBackendCodes";
import { updateReactCode, updateVueCode, updateAngularCode } from "./updateBackendCodes";
import { monthlyChartReactCode, monthlyChartVueCode, monthlyChartAngularCode } from "./chartMonthlyBackendCodes";

// ─── Types ───
type FrameworkKey = "react" | "vue" | "angular";

interface CodeTab {
  key: string;
  label: string;
  fileName: string;
  code: string;
  language: string;
}

interface CodeSnippet {
  id: string;
  label: string;
  description: string;
  icon: typeof Code;
  frameworks: Record<FrameworkKey, CodeTab[]>;
}

interface PageSection {
  id: string;
  label: string;
  description: string;
  route: string;
  snippets: CodeSnippet[];
}

// ─── Framework SVG Icons (matching driver license type page) ───
const fwConfig: Record<FrameworkKey, { label: string; icon: ReactNode }> = {
  react: {
    label: "PrimeReact",
    icon: (
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="3" fill="#61DAFB" />
        <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" />
        <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)" />
      </svg>
    ),
  },
  vue: {
    label: "PrimeVue",
    icon: (
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
        <path d="M2 4h5.6L16 18.4 24.4 4H30L16 28 2 4z" fill="#41B883" />
        <path d="M6.8 4H12l4 7.2L20 4h5.2L16 20 6.8 4z" fill="#34495E" />
      </svg>
    ),
  },
  angular: {
    label: "PrimeAngular",
    icon: (
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L3 7l2 18L16 30l11-5 2-18L16 2z" fill="#DD0031" />
        <path d="M16 2v28l11-5 2-18L16 2z" fill="#C3002F" />
        <path d="M16 5.7L8.8 22h2.7l1.4-3.6h6.2L20.5 22h2.7L16 5.7zm2.2 10.7h-4.4L16 11l2.2 5.4z" fill="#fff" />
      </svg>
    ),
  },
};

// ─── Page Data ───
const pages: PageSection[] = [
  {
    id: "login",
    label: "Login Page",
    description: "Authentication page with PrimeUI form components",
    route: "/",
    snippets: [
      {
        id: "login-form",
        label: "Login Form",
        description: "Complete login form with email/password validation, auto-fill, and demo credentials",
        icon: LogIn,
        frameworks: {
          vue: [
            { key: "template", label: "Template", fileName: "LoginPage.vue", code: vueTemplate, language: "markup" },
            { key: "script", label: "Script", fileName: "LoginPage.vue", code: vueScript, language: "markup" },
            { key: "setup", label: "Setup", fileName: "main.js", code: vueSetup, language: "javascript" },
          ],
          react: [
            { key: "component", label: "Component", fileName: "LoginForm.tsx", code: reactComponent, language: "tsx" },
            { key: "setup", label: "Setup", fileName: "App.tsx", code: reactSetup, language: "tsx" },
          ],
          angular: [
            { key: "template", label: "Template", fileName: "login-page.component.html", code: angularTemplate, language: "markup" },
            { key: "component", label: "Component", fileName: "login-page.component.ts", code: angularComponent, language: "typescript" },
            { key: "setup", label: "Setup", fileName: "app.config.ts", code: angularSetup, language: "typescript" },
          ],
        },
      },
    ],
  },
  {
    id: "license-list",
    label: "Driver License Type List",
    description: "Data table with charts for driver license type management",
    route: "/dashboard (Driver License Type)",
    snippets: [
      {
        id: "bar-chart",
        label: "Bar Chart",
        description: "Drivers by Driver License Type — Grouped Bar Chart",
        icon: BarChart3,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "DriversByDriverLicenseType.vue", code: primeVueChartCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "DriversByDriverLicenseType.tsx", code: primeReactChartCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "drivers-by-driver-license-type.component.ts", code: primeAngularChartCode, language: "typescript" }],
        },
      },
      {
        id: "pie-chart",
        label: "Doughnut Chart",
        description: "Driver Distribution — Doughnut/Pie Chart",
        icon: PieChart,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "DriverDistribution.vue", code: pieVueCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "DriverDistribution.tsx", code: pieReactCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "driver-distribution.component.ts", code: pieAngularCode, language: "typescript" }],
        },
      },
      {
        id: "data-table",
        label: "Data Table",
        description: "Search, Filter, Export, Columns, Pagination",
        icon: Table,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "DriverLicenseTypeTable.vue", code: primeVueTableCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "DriverLicenseTypeTable.tsx", code: primeReactTableCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "driver-license-type-table.component.ts", code: primeAngularTableCode, language: "typescript" }],
        },
      },
    ],
  },
  {
    id: "policy-list",
    label: "Policies List",
    description: "Data table with charts for license policies management",
    route: "/dashboard (Policies)",
    snippets: [
      {
        id: "data-table",
        label: "Data Table",
        description: "Search, Filter, Export, Columns, Pagination",
        icon: Table,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "LicensePolicyTable.vue", code: policyVueTableCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "LicensePolicyTable.tsx", code: policyReactTableCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "license-policy-table.component.ts", code: policyAngularTableCode, language: "typescript" }],
        },
      },
      {
        id: "add-policy",
        label: "Add Policy",
        description: "POST /api/v1/license-policies",
        icon: Plus,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "LicensePolicyAdd.vue", code: createPolicyVueCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "LicensePolicyAdd.tsx", code: createPolicyReactCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "license-policy-add.component.ts", code: createPolicyAngularCode, language: "typescript" }],
        },
      },
      {
        id: "detail-policy",
        label: "Detail Policy",
        description: "GET /api/v1/license-policies/:id",
        icon: Eye,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "LicensePolicyDetail.vue", code: policyDetailVueCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "LicensePolicyDetail.tsx", code: policyDetailReactCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "license-policy-detail.component.ts", code: policyDetailAngularCode, language: "typescript" }],
        },
      },
    ],
  },
  {
    id: "blood-type-list",
    label: "Blood Type List",
    description: "Data table with charts for blood type management",
    route: "/dashboard (Blood Type)",
    snippets: [
      {
        id: "data-table",
        label: "Data Table",
        description: "Search, Filter, Export, Columns, Pagination",
        icon: Table,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "BloodTypeTable.vue", code: bloodTypeVueTableCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "BloodTypeTable.tsx", code: bloodTypeReactTableCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "blood-type-table.component.ts", code: bloodTypeAngularTableCode, language: "typescript" }],
        },
      },
    ],
  },
  {
    id: "license-detail",
    label: "Driver License Type Detail",
    description: "Detail view with update form and monthly statistics chart",
    route: "/dashboard/license-types/:id",
    snippets: [
      {
        id: "detail-view",
        label: "Detail View",
        description: "GET /api/v1/license-types/:id",
        icon: Eye,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "DriverLicenseTypeDetail.vue", code: detailVueCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "DriverLicenseTypeDetail.tsx", code: detailReactCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "driver-license-type-detail.component.ts", code: detailAngularCode, language: "typescript" }],
        },
      },
      {
        id: "update-form",
        label: "Update Form",
        description: "PUT /api/v1/license-types/:id",
        icon: Pencil,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "DriverLicenseTypeUpdate.vue", code: updateVueCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "DriverLicenseTypeUpdate.tsx", code: updateReactCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "driver-license-type-update.component.ts", code: updateAngularCode, language: "typescript" }],
        },
      },
      {
        id: "monthly-chart",
        label: "Monthly Driver Chart",
        description: "Monthly driver count line/area chart with year filter",
        icon: LineChart,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "MonthlyDriverChart.vue", code: monthlyChartVueCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "MonthlyDriverChart.tsx", code: monthlyChartReactCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "monthly-driver-chart.component.ts", code: monthlyChartAngularCode, language: "typescript" }],
        },
      },
    ],
  },
  {
    id: "emergency-profiles",
    label: "Emergency Profiles",
    description: "Emergency contact management for drivers/customers with nullable driver_id/customer_id, relationship, and review status (UNDER_REVIEW/REJECT/APPROVE)",
    route: "/dashboard (Emergency Profiles)",
    snippets: [
      {
        id: "emergency-table",
        label: "Data Table",
        description: "Search, Filter, Pagination for emergency contacts",
        icon: ShieldAlert,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "EmergencyProfileTable.vue", code: emergencyVueTableCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "EmergencyProfileTable.tsx", code: emergencyReactTableCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "emergency-profile-table.component.ts", code: emergencyAngularTableCode, language: "typescript" }],
        },
      },
      {
        id: "emergency-form",
        label: "Add Emergency Contact",
        description: "POST /api/v1/emergency-profiles — nullable driver_id/customer_id, contact_name, relationship, prefix + phone_number",
        icon: UserPlus,
        frameworks: {
          vue: [{ key: "component", label: "Component", fileName: "EmergencyProfileForm.vue", code: emergencyVueFormCode, language: "markup" }],
          react: [{ key: "component", label: "Component", fileName: "EmergencyProfileForm.tsx", code: emergencyReactFormCode, language: "tsx" }],
          angular: [{ key: "component", label: "Component", fileName: "emergency-profile-form.component.ts", code: emergencyAngularFormCode, language: "typescript" }],
        },
      },
    ],
  },
];

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

// ─── Code Block Component (matching driver license type preview style) ───
function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const [framework, setFramework] = useState<FrameworkKey>("react");
  const [activeTabKey, setActiveTabKey] = useState<string>(() => snippet.frameworks["react"][0].key);
  const [copied, setCopied] = useState(false);

  const tabs = snippet.frameworks[framework];
  const activeTab = tabs.find((t) => t.key === activeTabKey) ?? tabs[0];

  const switchFramework = (key: FrameworkKey) => {
    setFramework(key);
    setActiveTabKey(snippet.frameworks[key][0].key);
    setCopied(false);
  };

  const handleCopy = () => {
    copyToClipboard(activeTab.code);
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
      </div>

      {/* Framework switcher + sub-tabs + Copy Code — matching driver license type style */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
        <div className="flex items-center gap-3">
          {/* Framework pill tabs with inline SVG logos */}
          <div className="flex items-center gap-1 bg-[#f1f5f9] rounded-lg p-0.5">
            {(["react", "vue", "angular"] as const).map((fw) => {
              const cfg = fwConfig[fw];
              return (
                <button
                  key={fw}
                  onClick={() => switchFramework(fw)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] transition-all cursor-pointer ${
                    framework === fw
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

          {/* Sub-tabs (only show if more than 1 tab) */}
          {tabs.length > 1 && (
            <div className="contents">
              <div className="w-px h-5 bg-[#e2e8f0]" />
              <div className="flex items-center gap-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTabKey(tab.key); setCopied(false); }}
                    className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${
                      activeTab.key === tab.key
                        ? "bg-[#eef2ff] text-[#4f46e5] font-semibold"
                        : "text-[#94a3b8] hover:text-[#64748b] hover:bg-[#f1f5f9]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copy Code button */}
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

      {/* Code Block — syntax highlighted matching driver license type style */}
      <div className="overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] border-b border-[#1e293b]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
          </div>
          <span className="text-[10px] text-[#64748b] ml-2">{activeTab.fileName}</span>
        </div>
        <Highlight
          theme={themes.nightOwl}
          code={activeTab.code}
          language={activeTab.language}
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
export function FrontendDev() {
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>(() => {
    const target = sessionStorage.getItem("innotaxi_dev_search_target");
    if (target) {
      sessionStorage.removeItem("innotaxi_dev_search_target");
      return Object.fromEntries(pages.map((p) => [p.id, p.id === target]));
    }
    return Object.fromEntries(pages.map((p) => [p.id, false]));
  });

  // Listen for search navigation
  useEffect(() => {
    const handler = () => {
      const target = sessionStorage.getItem("innotaxi_dev_search_target");
      if (target) {
        sessionStorage.removeItem("innotaxi_dev_search_target");
        setExpandedPages(Object.fromEntries(pages.map((p) => [p.id, p.id === target])));
        // Scroll to the target page section
        setTimeout(() => {
          const el = document.getElementById(`frontend-page-${target}`);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    };
    window.addEventListener("storage", handler);
    // Also check on mount
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
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
            <Code className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <h1 className="text-[22px] text-[#0f172a] font-semibold tracking-[-0.22px]">
              Frontend Development
            </h1>
            <p className="text-[13px] text-[#64748b]">
              All frontend code previews across {pages.length} pages &middot; {totalSnippets} components
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {(["react", "vue", "angular"] as const).map((fw) => {
          const cfg = fwConfig[fw];
          const colors: Record<FrameworkKey, { border: string; bg: string; text: string }> = {
            react: { border: "#61dafb33", bg: "#f0f9ff", text: "#61dafb" },
            vue: { border: "#42b88333", bg: "#f0fdf4", text: "#42b883" },
            angular: { border: "#DD003133", bg: "#fef2f2", text: "#DD0031" },
          };
          const c = colors[fw];
          return (
            <div
              key={fw}
              className="rounded-xl border p-4"
              style={{ borderColor: c.border, backgroundColor: c.bg }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center">{cfg.icon}</span>
                <span className="text-[13px] font-semibold" style={{ color: c.text }}>{cfg.label}</span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                {totalSnippets} component{totalSnippets !== 1 ? "s" : ""} available across all pages
              </p>
            </div>
          );
        })}
      </div>

      {/* Pages */}
      <div className="flex flex-col gap-4">
        {pages.map((page) => {
          const isExpanded = expandedPages[page.id] ?? false;
          return (
            <div
              key={page.id}
              id={`frontend-page-${page.id}`}
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
                      {page.snippets.length} component{page.snippets.length !== 1 ? "s" : ""}
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
                      <CodeBlock key={snippet.id} snippet={snippet} />
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
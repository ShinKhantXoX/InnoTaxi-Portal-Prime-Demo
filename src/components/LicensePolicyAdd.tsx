import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Highlight, themes } from "prism-react-renderer";
import { ArrowLeft, Save, X, ScrollText, AlertCircle, ChevronDown, CheckCircle2, Code2, Copy, Check, Database } from "lucide-react";
import { motion } from "motion/react";
import type { LicensePolicy, PolicyType } from "./LicensePolicyList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";
import {
  getCreatePolicyBackendCode,
  createPolicyBackendFileConfig,
  createPolicyReactCode,
  createPolicyVueCode,
  createPolicyAngularCode,
  policyDatabaseSchema,
} from "./licensePolicyBackendCodes";

const policyTypeOptions: { label: string; value: PolicyType }[] = [
  { label: "Driver License", value: "DRIVER_LICENSE" },
  { label: "Vehicle License", value: "VEHICEL_LICENSE" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

export function LicensePolicyAdd() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [savedLabel, setSavedLabel] = useState("");

  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [policyType, setPolicyType] = useState<PolicyType>("DRIVER_LICENSE");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // Code preview state
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);
  const [codeCategory, setCodeCategory] = useState<"frontend" | "backend" | "database">("frontend");
  const [codeFramework, setCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [backendLang, setBackendLang] = useState<BackendLang>("nestjs");
  const [backendLangOpen, setBackendLangOpen] = useState(false);
  const backendLangRef = useRef<HTMLDivElement>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Close backend lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backendLangRef.current && !backendLangRef.current.contains(e.target as Node)) {
        setBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: createPolicyReactCode, vue: createPolicyVueCode, angular: createPolicyAngularCode }[codeFramework];
    }
    if (codeCategory === "database") {
      return policyDatabaseSchema;
    }
    return getCreatePolicyBackendCode(backendLang);
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "LicensePolicyAdd.tsx", vue: "LicensePolicyAdd.vue", angular: "license-policy-add.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") {
      return "policies.sql";
    }
    return createPolicyBackendFileConfig[backendLang].file;
  };

  const getLanguage = (): string => {
    if (codeCategory === "frontend") {
      return codeFramework === "angular" ? "typescript" : codeFramework === "vue" ? "markup" : "tsx";
    }
    if (codeCategory === "database") {
      return "sql";
    }
    return "typescript";
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

  const handleSave = () => {
    setSubmitted(true);
    if (!label.trim()) return;

    const now = new Date().toISOString().split("T")[0];
    const newPolicy: LicensePolicy = {
      id: Date.now(),
      label: label.trim(),
      description: description.trim(),
      policyType,
      status,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    // Store in sessionStorage so the list page picks it up
    const existing = sessionStorage.getItem("newLicensePolicy");
    const queue: LicensePolicy[] = existing ? JSON.parse(existing) : [];
    queue.push(newPolicy);
    sessionStorage.setItem("newLicensePolicy", JSON.stringify(queue));

    setSavedLabel(newPolicy.label);
    setShowCreateNotification(true);

    setTimeout(() => {
      navigate("/dashboard", { state: { activeItem: "Policies" } });
    }, 600);
  };

  const handleCancel = () => {
    navigate("/dashboard", { state: { activeItem: "Policies" } });
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Policies
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center">
            <ScrollText className="w-5 h-5 text-[#e53935]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold">
              New Policies
            </h1>
            <p className="text-[12px] text-[#94a3b8]">
              Create a new policy record
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[12px] border border-[#e2e8f0] overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
          <div>
            <h2 className="text-[14px] text-[#0f172a] font-semibold">
              Policy Information
            </h2>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              Fill in the details below to create a new license policy
            </p>
          </div>
          <button
            onClick={() => setCodePreviewOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#c7d2fe]"
            title="View Create Code"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>View Code</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-x-6 gap-y-4">
            {/* Label */}
            <div className="col-span-12 md:col-span-6">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Label <span className="text-[#e53935]">*</span>
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all ${
                  submitted && !label.trim()
                    ? "border-[#e53935] focus:border-[#e53935] focus:ring-[#e53935]/20"
                    : "border-[#e2e8f0]"
                }`}
                placeholder="Policy Name"
              />
              {submitted && !label.trim() && (
                <small className="flex items-center gap-1 text-[#e53935] text-[11px] mt-1">
                  <AlertCircle className="w-3 h-3" />
                  Label is required
                </small>
              )}
            </div>

            {/* Policy Type */}
            <div className="col-span-12 md:col-span-6">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Policy Type <span className="text-[#e53935]">*</span>
              </label>
              <div className="relative">
                <select
                  value={policyType}
                  onChange={(e) => setPolicyType(e.target.value as PolicyType)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all appearance-none cursor-pointer pr-8"
                >
                  {policyTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            

            {/* Description — Full Width */}
            <div className="col-span-12">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">
                  Description
                </label>
                <span className="text-[11px] text-[#94a3b8] tabular-nums">
                  {description.replace(/<[^>]*>/g, "").length} / 500
                </span>
              </div>
              <Editor
                value={description}
                onTextChange={(e) => {
                  const plainText = e.textValue || "";
                  if (plainText.length <= 500) {
                    setDescription(e.htmlValue || "");
                  }
                }}
                style={{ height: "140px" }}
                className="[&_.ql-editor]:text-[13px]"
                placeholder="Describe this license policy — purpose, scope, or special conditions..."
              />
              {description.replace(/<[^>]*>/g, "").length >= 450 && (
                <span className={`text-[11px] font-medium mt-1 block text-right ${description.replace(/<[^>]*>/g, "").length >= 500 ? "text-[#e53935]" : "text-[#f59e0b]"}`}>
                  {500 - description.replace(/<[^>]*>/g, "").length} characters remaining
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-end gap-2">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#e2e8f0] text-[#475569] rounded-[8px] text-[13px] font-medium hover:bg-white hover:text-[#0f172a] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Create Policy
          </button>
        </div>
      </div>

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
                <h3 className="text-[13px] text-[#0f172a] font-semibold">Create Policies Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">POST /api/v1/license-policies</p>
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
              { key: "database" as const, label: "Database", icon: "\uD83D\uDDC4\uFE0F", color: "#22c55e" },
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
              ) : codeCategory === "backend" ? (
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
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#dcfce7] text-[#166534]">
                    <Database className="w-3 h-3" />
                    PostgreSQL Schema
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
              theme={codeCategory === "database" ? themes.vsDark : codeCategory === "frontend" ? themes.nightOwl : themes.vsDark}
              code={getCode()}
              language={getLanguage()}
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

      {/* Create Notification */}
      {showCreateNotification && (
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
                <p className="text-[13px] text-[#0f172a] font-semibold tracking-[-0.1px]">Created Successfully</p>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">License policy <span className="text-[#64748b] font-medium">{savedLabel}</span> has been created.</p>
              </div>
              <button
                onClick={() => setShowCreateNotification(false)}
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
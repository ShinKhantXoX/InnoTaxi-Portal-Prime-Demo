import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Highlight, themes } from "prism-react-renderer";
import { ScrollText, ArrowLeft, Code2, Copy, Check, X, ChevronDown, Clock, Info, Pencil, CheckCircle2, Database } from "lucide-react";
import { motion } from "motion/react";
import { licensePolicyMockData, type LicensePolicy, type PolicyType } from "./LicensePolicyList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";
import {
  licensePolicyBackendCode,
  licensePolicyBackendFileConfig,
  policyDatabaseSchema,
  createPolicyReactCode,
  createPolicyVueCode,
  createPolicyAngularCode,
} from "./licensePolicyBackendCodes";

// ── Policy Type Display ──
const policyTypeOptions: { label: string; value: PolicyType }[] = [
  { label: "Driver License", value: "DRIVER_LICENSE" },
  { label: "Vehicle License", value: "VEHICEL_LICENSE" },
];

const policyTypeStyles: Record<PolicyType, { text: string; bg: string; dot: string }> = {
  DRIVER_LICENSE: { text: "#7c3aed", bg: "#f5f3ff", dot: "#8b5cf6" },
  VEHICEL_LICENSE: { text: "#0369a1", bg: "#f0f9ff", dot: "#0ea5e9" },
};

// ── API sample response builder ──
const sampleApiResponse = (item: LicensePolicy) => `// GET /api/v1/license-policies/${item.id}
// Authorization: Bearer <token>

// Response — 200 OK
{
  "success": true,
  "data": {
    "id": ${item.id},
    "label": "${item.label}",
    "description": "${item.description.replace(/\n/g, "\\n").replace(/"/g, '\\"')}",
    "policy_type": "${item.policyType}",
    "status": "${item.status}",
    "created_at": "${item.createdAt}T00:00:00.000Z",
    "updated_at": "${item.updatedAt}T12:00:00.000Z",
    "deleted_at": ${item.deletedAt ? `"${item.deletedAt}T00:00:00.000Z"` : "null"}
  }
}`;

// ── Detail frontend code templates ──
export const detailReactCode = `// LicensePolicyDetail.tsx — PrimeReact + React Router
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Editor } from "primereact/editor";
import { ScrollText, ArrowLeft, Pencil, Save, X, ChevronDown } from "lucide-react";

const policyTypeOptions = [
  { label: "Driver License", value: "DRIVER_LICENSE" },
  { label: "Vehicle License", value: "VEHICEL_LICENSE" },
];

export function LicensePolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [formLabel, setFormLabel] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPolicyType, setFormPolicyType] = useState("DRIVER_LICENSE");
  const [formStatus, setFormStatus] = useState("ACTIVE");

  useEffect(() => {
    fetch(\`/api/v1/license-policies/\${id}\`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data.data);
        setFormLabel(data.data.label);
        setFormDescription(data.data.description || "");
        setFormPolicyType(data.data.policy_type);
        setFormStatus(data.data.status);
      });
  }, [id]);

  const handleUpdate = async () => {
    await fetch(\`/api/v1/license-policies/\${id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: formLabel.trim(),
        description: formDescription.trim(),
        policy_type: formPolicyType,
        status: formStatus,
      }),
    });
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="min-h-full">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft /> Back to License Policy
      </button>
      <h1>License Policy Detail</h1>
      <div className="bg-white rounded-xl border p-6">
        <input value={formLabel} onChange={(e) => setFormLabel(e.target.value)} />
        <select value={formPolicyType} onChange={(e) => setFormPolicyType(e.target.value)}>
          {policyTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <Editor value={formDescription} onTextChange={(e) => setFormDescription(e.htmlValue || "")} />
        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
}`;

export const detailVueCode = `<!-- LicensePolicyDetail.vue — PrimeVue + Vue Router -->
<template>
  <div class="min-h-full">
    <button @click="router.back()">
      Back to License Policy
    </button>
    <h1>License Policy Detail</h1>
    <div class="bg-white rounded-xl border p-6" v-if="item">
      <InputText v-model="formLabel" placeholder="Label" />
      <Dropdown
        v-model="formPolicyType"
        :options="policyTypeOptions"
        optionLabel="label"
        optionValue="value"
      />
      <Dropdown
        v-model="formStatus"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
      />
      <Editor v-model="formDescription" editorStyle="height: 140px" />
      <Button label="Update" severity="danger" @click="handleUpdate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Editor from "primevue/editor";
import Button from "primevue/button";

const route = useRoute();
const router = useRouter();
const item = ref(null);
const formLabel = ref("");
const formDescription = ref("");
const formPolicyType = ref("DRIVER_LICENSE");
const formStatus = ref("ACTIVE");

const policyTypeOptions = [
  { label: "Driver License", value: "DRIVER_LICENSE" },
  { label: "Vehicle License", value: "VEHICEL_LICENSE" },
];
const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

onMounted(async () => {
  const res = await fetch(\`/api/v1/license-policies/\${route.params.id}\`);
  const data = await res.json();
  item.value = data.data;
  formLabel.value = data.data.label;
  formDescription.value = data.data.description || "";
  formPolicyType.value = data.data.policy_type;
  formStatus.value = data.data.status;
});

async function handleUpdate() {
  await fetch(\`/api/v1/license-policies/\${route.params.id}\`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      label: formLabel.value.trim(),
      description: formDescription.value.trim(),
      policy_type: formPolicyType.value,
      status: formStatus.value,
    }),
  });
}
</script>`;

export const detailAngularCode = `// license-policy-detail.component.ts — PrimeNG + Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface PolicyTypeOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-license-policy-detail',
  template: \`
    <div class="min-h-full" *ngIf="item">
      <button (click)="goBack()">Back to License Policy</button>
      <h1>License Policy Detail</h1>
      <div class="bg-white rounded-xl border p-6">
        <input pInputText [(ngModel)]="formLabel" placeholder="Label" />
        <p-dropdown
          [(ngModel)]="formPolicyType"
          [options]="policyTypeOptions"
          optionLabel="label"
          optionValue="value"
        ></p-dropdown>
        <p-dropdown
          [(ngModel)]="formStatus"
          [options]="statusOptions"
          optionLabel="label"
          optionValue="value"
        ></p-dropdown>
        <p-editor
          [(ngModel)]="formDescription"
          [style]="{ height: '140px' }"
        ></p-editor>
        <button pButton label="Update" (click)="handleUpdate()"></button>
      </div>
    </div>
  \`,
})
export class LicensePolicyDetailComponent implements OnInit {
  item: any = null;
  formLabel = '';
  formDescription = '';
  formPolicyType = 'DRIVER_LICENSE';
  formStatus = 'ACTIVE';

  policyTypeOptions: PolicyTypeOption[] = [
    { label: 'Driver License', value: 'DRIVER_LICENSE' },
    { label: 'Vehicle License', value: 'VEHICEL_LICENSE' },
  ];
  statusOptions: PolicyTypeOption[] = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(\`/api/v1/license-policies/\${id}\`).subscribe({
      next: (res) => {
        this.item = res.data;
        this.formLabel = res.data.label;
        this.formDescription = res.data.description || '';
        this.formPolicyType = res.data.policy_type;
        this.formStatus = res.data.status;
      },
    });
  }

  handleUpdate(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http
      .put(\`/api/v1/license-policies/\${id}\`, {
        label: this.formLabel.trim(),
        description: this.formDescription.trim(),
        policy_type: this.formPolicyType,
        status: this.formStatus,
      })
      .subscribe();
  }

  goBack(): void {
    this.router.navigate(['/dashboard'], {
      state: { activeItem: 'License Policy' },
    });
  }
}`;

// ── Copy helper ──
function copyToClipboard(text: string) {
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
}

export function LicensePolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Code preview state
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);
  const [codeCategory, setCodeCategory] = useState<"frontend" | "backend" | "database">("frontend");
  const [codeFramework, setCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [backendLang, setBackendLang] = useState<BackendLang>("nestjs");
  const [backendLangOpen, setBackendLangOpen] = useState(false);
  const backendLangRef = useRef<HTMLDivElement>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Form state
  const [formLabel, setFormLabel] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPolicyType, setFormPolicyType] = useState<PolicyType>("DRIVER_LICENSE");
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // Update notification
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [updateCountdown, setUpdateCountdown] = useState(3);

  // Also check sessionStorage for dynamically created policies
  const allPolicies = (() => {
    const extra = sessionStorage.getItem("newLicensePolicy");
    const extraPolicies: LicensePolicy[] = extra ? JSON.parse(extra) : [];
    return [...licensePolicyMockData, ...extraPolicies];
  })();

  const item = allPolicies.find((p) => p.id === Number(id));

  // Initialize form
  useEffect(() => {
    if (item) {
      setFormLabel(item.label);
      setFormDescription(item.description);
      setFormPolicyType(item.policyType);
      setFormStatus(item.status);
    }
  }, [item]);

  // Close backend lang dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backendLangRef.current && !backendLangRef.current.contains(e.target as Node)) {
        setBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!showUpdateNotification) return;
    if (updateCountdown <= 0) {
      setShowUpdateNotification(false);
      return;
    }
    const timer = setTimeout(() => setUpdateCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showUpdateNotification, updateCountdown]);

  // Not found
  if (!item) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-4">
            <ScrollText className="w-6 h-6 text-[#e53935]" />
          </div>
          <h2 className="text-[18px] text-[#0f172a] font-semibold mb-1.5">License Policy Not Found</h2>
          <p className="text-[13px] text-[#94a3b8] mb-5">The requested license policy does not exist or has been deleted.</p>
          <button
            onClick={() => navigate("/dashboard", { state: { activeItem: "License Policy" } })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] text-[#64748b] hover:text-[#0f172a] bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#cbd5e1] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const policyTypeLabel = policyTypeOptions.find((o) => o.value === item.policyType)?.label ?? item.policyType;
  const ptStyle = policyTypeStyles[item.policyType] ?? { text: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "\u2014";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const timestampFields = [
    { label: "Created At", value: item.createdAt, icon: "+", bg: "bg-[#f0fdf4]", text: "text-[#22c55e]" },
    { label: "Updated At", value: item.updatedAt, icon: "~", bg: "bg-[#eff6ff]", text: "text-[#3b82f6]" },
    { label: "Deleted At", value: item.deletedAt ?? "\u2014", icon: "\u00D7", bg: "bg-[#fef2f2]", text: "text-[#ef4444]", isNull: !item.deletedAt },
  ];

  // Code preview helpers
  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: detailReactCode, vue: detailVueCode, angular: detailAngularCode }[codeFramework];
    }
    if (codeCategory === "database") {
      return policyDatabaseSchema;
    }
    return licensePolicyBackendCode;
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "LicensePolicyDetail.tsx", vue: "LicensePolicyDetail.vue", angular: "license-policy-detail.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") {
      return "license_policies.sql";
    }
    return licensePolicyBackendFileConfig[backendLang];
  };

  const getLanguage = (): string => {
    if (codeCategory === "frontend") {
      return codeFramework === "angular" ? "typescript" : codeFramework === "vue" ? "markup" : "tsx";
    }
    if (codeCategory === "database") return "sql";
    return "typescript";
  };

  const handleCopy = () => {
    copyToClipboard(getCode());
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

  const handleUpdate = () => {
    setShowUpdateNotification(true);
    setUpdateCountdown(3);
  };

  return (
    <div>
      {/* ═══ Page Header ═══ */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#fef2f2] flex items-center justify-center">
              <ScrollText className="w-4 h-4 text-[#e53935]" />
            </div>
            <div>
              <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">
                License Policy Detail
              </h1>
              <p className="text-[12px] text-[#94a3b8]">
                <span className="text-[12px]">Master Data Setup</span>
                <span className="mx-0.5">&rsaquo;</span>
                <button onClick={() => { sessionStorage.setItem("innotaxi_active_item", "License Policy"); navigate("/dashboard"); }} className="text-[12px] font-inherit hover:text-[#64748b] transition-colors cursor-pointer">License Policy</button>
                <span className="mx-0.5">&rsaquo;</span>
                <span className="text-[#64748b] font-medium">#{item.id}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Status + Type Badges ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-2.5 mb-5 flex-wrap"
      >
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{
            color: item.status === "ACTIVE" ? "#16a34a" : "#dc2626",
            backgroundColor: item.status === "ACTIVE" ? "#f0fdf4" : "#fef2f2",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: item.status === "ACTIVE" ? "#22c55e" : "#ef4444" }}
          />
          {item.status}
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
          style={{ color: ptStyle.text, backgroundColor: ptStyle.bg }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ptStyle.dot }} />
          {policyTypeLabel}
        </span>
        <span className="text-[11px] text-[#94a3b8]">ID: {item.id}</span>
        <span className="w-px h-3.5 bg-[#e2e8f0]" />
        <span className="inline-flex items-center gap-1 text-[11px] text-[#94a3b8]">
          <span className="w-4 h-4 rounded bg-[#f0fdf4] flex items-center justify-center text-[9px] text-[#22c55e] font-semibold">+</span>
          {formatDate(item.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-[#94a3b8]">
          <span className="w-4 h-4 rounded bg-[#eff6ff] flex items-center justify-center text-[9px] text-[#3b82f6] font-semibold">~</span>
          {formatDate(item.updatedAt)}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-[#94a3b8]">
          <span className="w-4 h-4 rounded bg-[#fef2f2] flex items-center justify-center text-[9px] text-[#ef4444] font-semibold">&times;</span>
          {item.deletedAt ? formatDate(item.deletedAt) : "\u2014"}
        </span>
      </motion.div>

      {/* ═══ Policy Information Card ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-white rounded-[12px] border border-[#e2e8f0] overflow-hidden mb-5"
      >
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center">
              <Info className="w-4 h-4 text-[#6366f1]" />
            </div>
            <div>
              <h3 className="text-[15px] text-[#0f172a] font-semibold">Policy Information</h3>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">
                <span className="text-[#64748b] font-medium">{item.label}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setCodePreviewOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#c7d2fe]"
            title="View Detail Code"
          >
            <span>&lt;/&gt;</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-x-6 gap-y-4">
            {/* Label */}
            <div className="col-span-12 md:col-span-6">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Label
              </label>
              <input
                type="text"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
              />
            </div>

            {/* Policy Type */}
            <div className="col-span-12 md:col-span-3">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Policy Type
              </label>
              <div className="relative">
                <select
                  value={formPolicyType}
                  onChange={(e) => setFormPolicyType(e.target.value as PolicyType)}
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
            <div className="col-span-12 md:col-span-3">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                  className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all appearance-none cursor-pointer pr-8"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div className="col-span-12">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">
                  Description
                </label>
                <span className="text-[11px] text-[#94a3b8] tabular-nums">
                  {formDescription.replace(/<[^>]*>/g, "").length} / 500
                </span>
              </div>
              <Editor
                value={formDescription}
                onTextChange={(e) => {
                  const plainText = e.textValue || "";
                  if (plainText.length <= 500) {
                    setFormDescription(e.htmlValue || "");
                  }
                }}
                style={{ height: "140px" }}
                className="[&_.ql-editor]:text-[13px]"
                placeholder="Describe this license policy..."
              />
            </div>
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
        </div>
      </motion.div>

      {/* ═══ API Sample Response ═══ */}
      

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
                <h3 className="text-[13px] text-[#0f172a] font-semibold">License Policy Detail Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">GET|PUT /api/v1/license-policies/:id</p>
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
                <p className="text-[11px] text-[#94a3b8] mt-0.5">License policy <span className="text-[#64748b] font-medium">#{item.id}</span> has been updated.</p>
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
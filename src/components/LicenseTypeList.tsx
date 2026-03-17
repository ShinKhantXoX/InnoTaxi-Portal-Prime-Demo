import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Menu } from "primereact/menu";
import { Checkbox } from "primereact/checkbox";
import { FileText, FileSpreadsheet, Plus, Pencil, Trash2, Download, RefreshCw, Search, EllipsisVertical, Check, X, Filter, ChevronDown, Columns3, Eye, EyeOff, TrendingUp, FileBarChart, ImageDown, Code2, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { backendLangConfig, backendLangOptions, getChartBackendCode, getPieBackendCode, tableBackendFileConfig, type BackendLang } from "./chartBackendCodes";
import { getTableBackendCode } from "./tableBackendCodes";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "motion/react";
import * as htmlToImage from "html-to-image";
import { licensePolicyMockData } from "./LicensePolicyList";

export interface LicenseType {
  id: number;
  code: string;
  name: string;
  category: string;
  vehicleClass: string;
  validityYears: number;
  status: "ACTIVE" | "INACTIVE";
  policyType: "DRIVER_LICENSE";
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const emptyLicenseType: LicenseType = {
  id: 0,
  code: "",
  name: "",
  category: "",
  vehicleClass: "",
  validityYears: 1,
  status: "ACTIVE",
  policyType: "DRIVER_LICENSE",
  description: "",
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
};

export const mockData: LicenseType[] = [
  {
    id: 1,
    code: "THA",
    name: "\"သ\" ယာဉ်မောင်းလိုင်စင်",
    category: "သင်ယာဉ်",
    vehicleClass: "မော်တော်ယာဉ်အမောင်းသင်ရန်",
    validityYears: 1,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "မော်တော်ယာဉ်အမောင်းသင်ယူသူများအတွက် ထုတ်ပေးသော ယာဉ်မောင်းလိုင်စင်",
    createdAt: "2024-01-15",
    updatedAt: "2025-11-20",
    deletedAt: null,
  },
  {
    id: 2,
    code: "KA",
    name: "\"က\" ယာဉ်မောင်းလိုင်စင်",
    category: "မော်တော်ဆိုင်ကယ်",
    vehicleClass: "မော်တော်ဆိုင်ကယ်",
    validityYears: 5,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "မော်တော်ဆိုင်ကယ်မောင်းနှင်ခွင့်ရှိသော ယာဉ်မောင်းလိုင်စင်",
    createdAt: "2024-01-15",
    updatedAt: "2025-12-01",
    deletedAt: null,
  },
  {
    id: 3,
    code: "KHA",
    name: "\"ခ\" ယာဉ်မောင်းလိုင်စင်",
    category: "ကိုယ်ပိုင်ယာဉ်",
    vehicleClass: "သုံးတန်အထိတင်ဆောင်နိုင်သော ကိုယ်ပိုင်မော်တော်ယာဉ်နှင့် လူ ၁၅ ဦးအထိ တင်ဆောင်နိုင်သော ကိုယ်ပိုင်မော်တော်ယာဉ်",
    validityYears: 5,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "မော်တော်ကယ်တင်အားသုံးတန်အထိတင်ဆောင်နိုင်သော ကိုယ်ပိုင်မော်တော်ယာဉ်နှင့် လူ ၁၅ ဦးအထိ တင်ဆောင်နိုင်သော ကိုယ်ပိုင်မော်တော်ယာဉ်",
    createdAt: "2024-02-10",
    updatedAt: "2025-10-15",
    deletedAt: null,
  },
  {
    id: 4,
    code: "GA",
    name: "\"ဂ\" ယာဉ်မောင်းလိုင်စင်",
    category: "စက်ယန္တရား",
    vehicleClass: "စက်ယန္တရား",
    validityYears: 5,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "စက်ယန္တရားမောင်းနှင်ခွင့်ရှိသော ယာဉ်မောင်းလိုင်စင်",
    createdAt: "2024-03-01",
    updatedAt: "2026-01-10",
    deletedAt: null,
  },
  {
    id: 5,
    code: "GHA",
    name: "\"ဃ\" ယာဉ်မောင်းလိုင်စင်",
    category: "တက္ကစီ/စီးပွား",
    vehicleClass: "တက္ကစီယာဉ်နှင့် \"ခ\" ယာဉ်မောင်းလိုင်စင်၊ \"ဈ\" ယာဉ်မောင်းလိုင်စင်တို့ဖြင့် မောင်းနှင်ခွင့်ရှိသော မော်တော်ယာဉ်များ",
    validityYears: 3,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "တက္ကစီယာဉ်နှင့် \"ခ\"၊ \"ဈ\" လိုင်စင်ဖြင့် မောင်းနှင်ခွင့်ရှိသော မော်တော်ယာဉ်များအတွက် ထုတ်ပေးသော လိုင်စင်",
    createdAt: "2025-06-01",
    updatedAt: "2026-02-28",
    deletedAt: null,
  },
  {
    id: 6,
    code: "NGA",
    name: "\"င\" ယာဉ်မောင်းလိုင်စင်",
    category: "ယာဉ်အားလုံး",
    vehicleClass: "စက်ယန္တရားမှအပ ဥပဒေနှင့်အညီ မှတ်ပုံတင်ထားသော မည်သည့်မော်တော်ယာဉ်ကိုမဆို",
    validityYears: 3,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "စက်ယန္တရားမှအပ ဥပဒေနှင့်အညီ မှတ်ပုံတင်ထားသော မည်သည့်မော်တော်ယာဉ်ကိုမဆို မောင်းနှင်ခွင့်ရှိသော လိုင်စင်",
    createdAt: "2024-05-20",
    updatedAt: "2025-09-30",
    deletedAt: null,
  },
  {
    id: 7,
    code: "ZA",
    name: "\"ဈ\" ယာဉ်မောင်းလိုင်စင်",
    category: "ထရေ့လာ",
    vehicleClass: "ထရေ့လာကြီး",
    validityYears: 5,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "ထရေ့လာကြီးမောင်းနှင်ခွင့်ရှိသော ယာဉ်မောင်းလိုင်စင်",
    createdAt: "2024-04-12",
    updatedAt: "2025-08-15",
    deletedAt: null,
  },
  {
    id: 8,
    code: "HA",
    name: "\"ဟ\" ယာဉ်မောင်းလိုင်စင်",
    category: "မော်တော်ဆိုင်ကယ်/သုံးဘီး",
    vehicleClass: "မော်တော်ဆိုင်ကယ်နှင့် သုံးဘီးတပ်ယာဉ်",
    validityYears: 5,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "မော်တော်ဆိုင်ကယ်နှင့် သုံးဘီးတပ်ယာဉ်မောင်းနှင်ခွင့်ရှိသော ယာဉ်မောင်းလိုင်စင်",
    createdAt: "2024-07-01",
    updatedAt: "2026-01-20",
    deletedAt: null,
  },
  {
    id: 9,
    code: "SA",
    name: "\"စ\" ယာဉ်အကူလိုင်စင်",
    category: "ယာဉ်အကူ",
    vehicleClass: "ယာဉ်အကူနှင့် လက်မှတ်ရောင်း",
    validityYears: 5,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "ယာဉ်အကူနှင့် လက်မှတ်ရောင်းအတွက် ထုတ်ပေးသော လိုင်စင်",
    createdAt: "2025-09-01",
    updatedAt: "2026-03-01",
    deletedAt: null,
  },
  {
    id: 10,
    code: "INT",
    name: "အပြည်ပြည်ဆိုင်ရာ ယာဉ်မောင်းလိုင်စင်",
    category: "အပြည်ပြည်ဆိုင်ရာ",
    vehicleClass: "ပြည်တွင်းယာဉ်မောင်းလိုင်စင်အရ မောင်းနှင်ခွင့်ရှိသည့် မော်တော်ယာဉ်အမျိုးအစား",
    validityYears: 1,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "ပြည်တွင်းယာဉ်မောင်းလိုင်စင်အရ မောင်းနှင်ခွင့်ရှိသည့် မော်တော်ယာဉ်အမျိုးအစားအတွက် ထုတ်ပေးသော အပြည်ပြည်ဆိုင်ရာ လိုင်စင်",
    createdAt: "2024-08-15",
    updatedAt: "2025-07-20",
    deletedAt: null,
  },
  {
    id: 11,
    code: "TMP",
    name: "ယာယီယာဉ်မောင်းနှင်ခွင့်လက်မှတ်",
    category: "ယာယီ",
    vehicleClass: "သက်ဆိုင်ရာနိုင်ငံကထုတ်ပေးသည့် ယာဉ်မောင်းလိုင်စင်အမျိုးအစားအလိုက် မောင်းနှင်ခွင့်ပြုသည့် မော်တော်ယာဉ်အမျိုးအစား",
    validityYears: 1,
    status: "ACTIVE",
    policyType: "DRIVER_LICENSE",
    description: "သက်ဆိုင်ရာနိုင်ငံကထုတ်ပေးသည့် ယာဉ်မောင်းလိုင်စင်အမျိုးအစားအလိုက် မောင်းနှင်ခွင့်ပြုသည့် ယာယီလက်မှတ်",
    createdAt: "2025-09-01",
    updatedAt: "2026-03-01",
    deletedAt: null,
  },
];

const categoryOptions = [
  { label: "သင်ယာဉ်", value: "သင်ယာဉ်" },
  { label: "မော်တော်ဆိုင်ကယ်", value: "မော်တော်ဆိုင်ကယ်" },
  { label: "ကိုယ်ပိုင်ယာဉ်", value: "ကိုယ်ပိုင်ယာဉ်" },
  { label: "စက်ယန္တရား", value: "စက်ယန္တရား" },
  { label: "တက္ကစီ/စီးပွား", value: "တက္ကစီ/စီးပွား" },
  { label: "ယာဉ်အားလုံး", value: "ယာဉ်အားလုံး" },
  { label: "ထရေ့လာ", value: "ထရေ့လာ" },
  { label: "မော်တော်ဆိုင်ကယ်/သုံးဘီး", value: "မော်တော်ဆိုင်ကယ်/သုံးဘီး" },
  { label: "ယာဉ်အကူ", value: "ယာဉ်အကူ" },
  { label: "အပြည်ပြည်ဆိုင်ရာ", value: "အပြည်ပြည်ဆိုင်ရာ" },
  { label: "ယာယီ", value: "ယာယီ" },
];

const driverBarData = [
  { code: "THA", label: "သ (Learner)", active: 28, inactive: 5, color: "#06b6d4" },
  { code: "KA", label: "က (Motorcycle)", active: 67, inactive: 12, color: "#6366f1" },
  { code: "KHA", label: "ခ (Private)", active: 89, inactive: 8, color: "#e53935" },
  { code: "GA", label: "ဂ (Machinery)", active: 15, inactive: 3, color: "#8b5cf6" },
  { code: "GHA", label: "ဃ (Taxi)", active: 72, inactive: 10, color: "#f59e0b" },
  { code: "NGA", label: "င (All Vehicles)", active: 34, inactive: 6, color: "#22c55e" },
  { code: "ZA", label: "ဈ (Trailer)", active: 18, inactive: 4, color: "#ec4899" },
  { code: "HA", label: "ဟ (Motorcycle/3W)", active: 42, inactive: 7, color: "#14b8a6" },
  { code: "SA", label: "စ (Assistant)", active: 11, inactive: 2, color: "#f97316" },
  { code: "INT", label: "International", active: 8, inactive: 1, color: "#3b82f6" },
  { code: "TMP", label: "Temporary", active: 6, inactive: 3, color: "#94a3b8" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

export const primeReactChartCode = `import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';

export default function DriversByDriverLicenseType() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const data = {
      labels: [
        'THA — သ (Learner)', 'KA — က (Motorcycle)',
        'KHA — ခ (Private)', 'GA — ဂ (Machinery)',
        'GHA — ဃ (Taxi)', 'NGA — င (All Vehicles)',
        'ZA — ဈ (Trailer)', 'HA — ဟ (Motorcycle/3W)',
        'SA — စ (Assistant)', 'INT — International',
        'TMP — Temporary'
      ],
      datasets: [
        {
          label: 'ACTIVE',
          data: [28, 67, 89, 15, 72, 34, 18, 42, 11, 8, 6],
          backgroundColor: '#22c55e',
          borderRadius: 4,
          maxBarThickness: 28,
        },
        {
          label: 'INACTIVE',
          data: [5, 12, 8, 3, 10, 6, 4, 7, 2, 1, 3],
          backgroundColor: '#94a3b8',
          borderRadius: 4,
          maxBarThickness: 28,
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          cornerRadius: 10,
          padding: { x: 14, y: 10 },
          callbacks: {
            label: (ctx) => \`\${ctx.parsed.y} drivers\`
          }
        }
      },
      scales: {
        x: { grid: { display: false }, border: { display: false } },
        y: { grid: { color: '#f1f5f9' }, border: { display: false } }
      }
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-[15px] font-semibold text-slate-900">
        Drivers by Driver License Type
      </h3>
      <p className="text-xs text-slate-400 mt-0.5 mb-5">
        Active & inactive driver count per license category
      </p>
      <Chart type="bar" data={chartData} options={chartOptions}
        style={{ height: '320px' }} />
    </div>
  );
}`;

export const primeVueChartCode = `<template>
  <div class="bg-white rounded-xl border border-slate-200 p-5">
    <h3 class="text-[15px] font-semibold text-slate-900">
      Drivers by Driver License Type
    </h3>
    <p class="text-xs text-slate-400 mt-0.5 mb-5">
      Active &amp; inactive driver count per license category
    </p>
    <Chart type="bar" :data="chartData" :options="chartOptions"
      style="height: 320px" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'primevue/chart';

const chartData = ref({});
const chartOptions = ref({});

onMounted(() => {
  chartData.value = {
    labels: [
      'THA — သ (Learner)', 'KA — က (Motorcycle)',
      'KHA — ခ (Private)', 'GA — ဂ (Machinery)',
      'GHA — ဃ (Taxi)', 'NGA — င (All Vehicles)',
      'ZA �� ဈ (Trailer)', 'HA — ဟ (Motorcycle/3W)',
      'SA — စ (Assistant)', 'INT — International',
      'TMP — Temporary'
    ],
    datasets: [
      {
        label: 'ACTIVE',
        data: [28, 67, 89, 15, 72, 34, 18, 42, 11, 8, 6],
        backgroundColor: '#22c55e',
        borderRadius: 4,
        maxBarThickness: 28,
      },
      {
        label: 'INACTIVE',
        data: [5, 12, 8, 3, 10, 6, 4, 7, 2, 1, 3],
        backgroundColor: '#94a3b8',
        borderRadius: 4,
        maxBarThickness: 28,
      }
    ]
  };

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 13, weight: '600' },
        bodyFont: { size: 12 },
        cornerRadius: 10,
        padding: { x: 14, y: 10 },
        callbacks: {
          label: (ctx: any) => \`\${ctx.parsed.y} drivers\`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { grid: { color: '#f1f5f9' }, border: { display: false } }
    }
  };
});
</script>`;

export const primeAngularChartCode = `import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-drivers-by-driver-license-type',
  standalone: true,
  imports: [ChartModule],
  template: \`
    <div class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-[15px] font-semibold text-slate-900">
        Drivers by Driver License Type
      </h3>
      <p class="text-xs text-slate-400 mt-0.5 mb-5">
        Active &amp; inactive driver count per license category
      </p>
      <p-chart type="bar" [data]="chartData" [options]="chartOptions"
        [style]="{ height: '320px' }" />
    </div>
  \`
})
export class DriversByDriverLicenseTypeComponent implements OnInit {
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.chartData = {
      labels: [
        'THA — သ (Learner)', 'KA — က (Motorcycle)',
        'KHA — ခ (Private)', 'GA — ဂ (Machinery)',
        'GHA — ဃ (Taxi)', 'NGA — င (All Vehicles)',
        'ZA — ဈ (Trailer)', 'HA — ဟ (Motorcycle/3W)',
        'SA — စ (Assistant)', 'INT — International',
        'TMP — Temporary'
      ],
      datasets: [
        {
          label: 'ACTIVE',
          data: [28, 67, 89, 15, 72, 34, 18, 42, 11, 8, 6],
          backgroundColor: '#22c55e',
          borderRadius: 4,
          maxBarThickness: 28,
        },
        {
          label: 'INACTIVE',
          data: [5, 12, 8, 3, 10, 6, 4, 7, 2, 1, 3],
          backgroundColor: '#94a3b8',
          borderRadius: 4,
          maxBarThickness: 28,
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          cornerRadius: 10,
          padding: { x: 14, y: 10 },
          callbacks: {
            label: (ctx: any) => \`\${ctx.parsed.y} drivers\`
          }
        }
      },
      scales: {
        x: { grid: { display: false }, border: { display: false } },
        y: { grid: { color: '#f1f5f9' }, border: { display: false } }
      }
    };
  }
}`;

export const pieReactCode = "import { Chart } from 'primereact/chart';\nimport { useEffect, useState } from 'react';\n\nexport default function DriverDistribution() {\n  const [chartData, setChartData] = useState({});\n  const [chartOptions, setChartOptions] = useState({});\n\n  useEffect(() => {\n    const licenseTypes = [\n      { code: 'THA', label: '\u101E (Learner)', drivers: 33, color: '#6366f1' },\n      { code: 'KA', label: '\u1000 (Motorcycle)', drivers: 79, color: '#8b5cf6' },\n      { code: 'KHA', label: '\u1001 (Private)', drivers: 97, color: '#3b82f6' },\n      { code: 'GA', label: '\u1002 (Machinery)', drivers: 18, color: '#06b6d4' },\n      { code: 'GHA', label: '\u1003 (Taxi)', drivers: 82, color: '#10b981' },\n      { code: 'NGA', label: '\u1004 (All Vehicles)', drivers: 40, color: '#f59e0b' },\n      { code: 'ZA', label: '\u1008 (Trailer)', drivers: 22, color: '#ef4444' },\n      { code: 'HA', label: '\u101F (Motorcycle/3W)', drivers: 49, color: '#ec4899' },\n      { code: 'SA', label: '\u1005 (Assistant)', drivers: 13, color: '#14b8a6' },\n      { code: 'INT', label: 'International', drivers: 9, color: '#f97316' },\n      { code: 'TMP', label: 'Temporary', drivers: 10, color: '#64748b' },\n    ];\n\n    const data = {\n      labels: licenseTypes.map(lt => `${lt.code} \u2014 ${lt.label}`),\n      datasets: [{\n        data: licenseTypes.map(lt => lt.drivers),\n        backgroundColor: licenseTypes.map(lt => lt.color),\n        borderColor: '#ffffff',\n        borderWidth: 2,\n        hoverOffset: 8,\n      }]\n    };\n\n    const options = {\n      responsive: true,\n      maintainAspectRatio: false,\n      cutout: '58%',\n      plugins: {\n        legend: { display: false },\n        tooltip: {\n          backgroundColor: '#0f172a',\n          titleFont: { size: 13, weight: '600' },\n          bodyFont: { size: 12 },\n          cornerRadius: 10,\n          padding: { x: 14, y: 10 },\n          callbacks: {\n            label: (ctx) => {\n              const total = ctx.dataset.data.reduce(\n                (a, b) => a + b, 0\n              );\n              const pct = ((ctx.parsed / total) * 100).toFixed(1);\n              return `${ctx.parsed} drivers (${pct}%)`;\n            }\n          }\n        }\n      }\n    };\n\n    setChartData(data);\n    setChartOptions(options);\n  }, []);\n\n  const total = 452;\n\n  return (\n    <div className=\"bg-white rounded-xl border border-slate-200 p-5\">\n      <h3 className=\"text-[15px] font-semibold text-slate-900\">\n        Driver Distribution\n      </h3>\n      <p className=\"text-xs text-slate-400 mt-0.5 mb-5\">\n        Total drivers per license type\n      </p>\n      <div className=\"relative\" style={{ height: '200px' }}>\n        <Chart type=\"doughnut\" data={chartData} options={chartOptions}\n          style={{ height: '200px' }} />\n        <div className=\"absolute inset-0 flex items-center justify-center\n          pointer-events-none\">\n          <div className=\"text-center\">\n            <div className=\"text-xl font-bold text-slate-900\">{total}</div>\n            <div className=\"text-[10px] text-slate-400 uppercase tracking-wider\">\n              Drivers\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}";

export const pieVueCode = "<template>\n  <div class=\"bg-white rounded-xl border border-slate-200 p-5\">\n    <h3 class=\"text-[15px] font-semibold text-slate-900\">\n      Driver Distribution\n    </h3>\n    <p class=\"text-xs text-slate-400 mt-0.5 mb-5\">\n      Total drivers per license type\n    </p>\n    <div class=\"relative\" style=\"height: 200px\">\n      <Chart type=\"doughnut\" :data=\"chartData\" :options=\"chartOptions\"\n        style=\"height: 200px\" />\n      <div class=\"absolute inset-0 flex items-center justify-center\n        pointer-events-none\">\n        <div class=\"text-center\">\n          <div class=\"text-xl font-bold text-slate-900\">{{ total }}</div>\n          <div class=\"text-[10px] text-slate-400 uppercase tracking-wider\">\n            Drivers\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</template>\n\n<script setup lang=\"ts\">\nimport { ref, onMounted, computed } from 'vue';\nimport Chart from 'primevue/chart';\n\nconst chartData = ref({});\nconst chartOptions = ref({});\n\nconst licenseTypes = [\n  { code: 'THA', label: '\u101E (Learner)', drivers: 33, color: '#6366f1' },\n  { code: 'KA', label: '\u1000 (Motorcycle)', drivers: 79, color: '#8b5cf6' },\n  { code: 'KHA', label: '\u1001 (Private)', drivers: 97, color: '#3b82f6' },\n  { code: 'GA', label: '\u1002 (Machinery)', drivers: 18, color: '#06b6d4' },\n  { code: 'GHA', label: '\u1003 (Taxi)', drivers: 82, color: '#10b981' },\n  { code: 'NGA', label: '\u1004 (All Vehicles)', drivers: 40, color: '#f59e0b' },\n  { code: 'ZA', label: '\u1008 (Trailer)', drivers: 22, color: '#ef4444' },\n  { code: 'HA', label: '\u101F (Motorcycle/3W)', drivers: 49, color: '#ec4899' },\n  { code: 'SA', label: '\u1005 (Assistant)', drivers: 13, color: '#14b8a6' },\n  { code: 'INT', label: 'International', drivers: 9, color: '#f97316' },\n  { code: 'TMP', label: 'Temporary', drivers: 10, color: '#64748b' },\n];\n\nconst total = computed(() =>\n  licenseTypes.reduce((s, lt) => s + lt.drivers, 0)\n);\n\nonMounted(() => {\n  chartData.value = {\n    labels: licenseTypes.map(lt => `${lt.code} \u2014 ${lt.label}`),\n    datasets: [{\n      data: licenseTypes.map(lt => lt.drivers),\n      backgroundColor: licenseTypes.map(lt => lt.color),\n      borderColor: '#ffffff',\n      borderWidth: 2,\n      hoverOffset: 8,\n    }]\n  };\n\n  chartOptions.value = {\n    responsive: true,\n    maintainAspectRatio: false,\n    cutout: '58%',\n    plugins: {\n      legend: { display: false },\n      tooltip: {\n        backgroundColor: '#0f172a',\n        titleFont: { size: 13, weight: '600' },\n        bodyFont: { size: 12 },\n        cornerRadius: 10,\n        padding: { x: 14, y: 10 },\n        callbacks: {\n          label: (ctx) => {\n            const sum = ctx.dataset.data.reduce(\n              (a, b) => a + b, 0\n            );\n            const pct = ((ctx.parsed / sum) * 100).toFixed(1);\n            return `${ctx.parsed} drivers (${pct}%)`;\n          }\n        }\n      }\n    }\n  };\n});\n</script>";

export const pieAngularCode = "import { Component, OnInit } from '@angular/core';\nimport { ChartModule } from 'primeng/chart';\n\n@Component({\n  selector: 'app-driver-distribution',\n  standalone: true,\n  imports: [ChartModule],\n  template: `\n    <div class=\"bg-white rounded-xl border border-slate-200 p-5\">\n      <h3 class=\"text-[15px] font-semibold text-slate-900\">\n        Driver Distribution\n      </h3>\n      <p class=\"text-xs text-slate-400 mt-0.5 mb-5\">\n        Total drivers per license type\n      </p>\n      <div class=\"relative\" style=\"height: 200px\">\n        <p-chart type=\"doughnut\" [data]=\"chartData\" [options]=\"chartOptions\"\n          [style]=\"{ height: '200px' }\" />\n        <div class=\"absolute inset-0 flex items-center justify-center\n          pointer-events-none\">\n          <div class=\"text-center\">\n            <div class=\"text-xl font-bold text-slate-900\">{{ total }}</div>\n            <div class=\"text-[10px] text-slate-400 uppercase tracking-wider\">\n              Drivers\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  `\n})\nexport class DriverDistributionComponent implements OnInit {\n  chartData: any;\n  chartOptions: any;\n  total = 452;\n\n  licenseTypes = [\n    { code: 'THA', label: '\u101E (Learner)', drivers: 33, color: '#6366f1' },\n    { code: 'KA', label: '\u1000 (Motorcycle)', drivers: 79, color: '#8b5cf6' },\n    { code: 'KHA', label: '\u1001 (Private)', drivers: 97, color: '#3b82f6' },\n    { code: 'GA', label: '\u1002 (Machinery)', drivers: 18, color: '#06b6d4' },\n    { code: 'GHA', label: '\u1003 (Taxi)', drivers: 82, color: '#10b981' },\n    { code: 'NGA', label: '\u1004 (All Vehicles)', drivers: 40, color: '#f59e0b' },\n    { code: 'ZA', label: '\u1008 (Trailer)', drivers: 22, color: '#ef4444' },\n    { code: 'HA', label: '\u101F (Motorcycle/3W)', drivers: 49, color: '#ec4899' },\n    { code: 'SA', label: '\u1005 (Assistant)', drivers: 13, color: '#14b8a6' },\n    { code: 'INT', label: 'International', drivers: 9, color: '#f97316' },\n    { code: 'TMP', label: 'Temporary', drivers: 10, color: '#64748b' },\n  ];\n\n  ngOnInit() {\n    this.chartData = {\n      labels: this.licenseTypes.map(\n        lt => `${lt.code} \u2014 ${lt.label}`\n      ),\n      datasets: [{\n        data: this.licenseTypes.map(lt => lt.drivers),\n        backgroundColor: this.licenseTypes.map(lt => lt.color),\n        borderColor: '#ffffff',\n        borderWidth: 2,\n        hoverOffset: 8,\n      }]\n    };\n\n    this.chartOptions = {\n      responsive: true,\n      maintainAspectRatio: false,\n      cutout: '58%',\n      plugins: {\n        legend: { display: false },\n        tooltip: {\n          backgroundColor: '#0f172a',\n          titleFont: { size: 13, weight: '600' },\n          bodyFont: { size: 12 },\n          cornerRadius: 10,\n          padding: { x: 14, y: 10 },\n          callbacks: {\n            label: (ctx) => {\n              const sum = ctx.dataset.data.reduce(\n                (a, b) => a + b, 0\n              );\n              const pct = ((ctx.parsed / sum) * 100).toFixed(1);\n              return `${ctx.parsed} drivers (${pct}%)`;\n            }\n          }\n        }\n      }\n    };\n  }\n}";

export const chartBackendCode = `// license-type-stats.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { LicenseTypeStatsService } from './license-type-stats.service';

@Controller('api/v1/license-types')
export class LicenseTypeStatsController {
  constructor(
    private readonly statsService: LicenseTypeStatsService,
  ) {}

  @Get('driver-stats')
  async getDriverStats(
    @Query('months') months = 6,
  ) {
    return this.statsService.getDriverCountByLicenseType(months);
  }

  @Get('driver-stats/summary')
  async getDriverStatsSummary() {
    return this.statsService.getDriverStatsSummary();
  }
}

// license-type-stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../drivers/entities/driver.entity';
import { LicenseType } from './entities/license-type.entity';

@Injectable()
export class LicenseTypeStatsService {
  constructor(
    @InjectRepository(Driver)
    private driverRepo: Repository<Driver>,
    @InjectRepository(LicenseType)
    private licenseTypeRepo: Repository<LicenseType>,
  ) {}

  async getDriverCountByLicenseType(months: number) {
    const results = await this.driverRepo
      .createQueryBuilder('d')
      .select('lt.code', 'code')
      .addSelect('lt.name', 'name')
      .addSelect('lt.category', 'category')
      .addSelect(
        \`SUM(CASE WHEN d.status = 'ACTIVE' THEN 1 ELSE 0 END)\`,
        'active',
      )
      .addSelect(
        \`SUM(CASE WHEN d.status = 'PENDING' THEN 1 ELSE 0 END)\`,
        'pending',
      )
      .addSelect(
        \`SUM(CASE WHEN d.status = 'SUSPENDED' THEN 1 ELSE 0 END)\`,
        'suspended',
      )
      .addSelect(
        \`SUM(CASE WHEN d.status = 'INACTIVE' THEN 1 ELSE 0 END)\`,
        'inactive',
      )
      .innerJoin('d.licenseType', 'lt')
      .where('d.createdAt >= NOW() - INTERVAL :months MONTH', {
        months,
      })
      .andWhere('d.deletedAt IS NULL')
      .groupBy('lt.code')
      .addGroupBy('lt.name')
      .addGroupBy('lt.category')
      .orderBy('active', 'DESC')
      .getRawMany();

    return {
      success: true,
      data: results.map((r) => ({
        code: r.code,
        name: r.name,
        category: r.category,
        active: parseInt(r.active, 10),
        pending: parseInt(r.pending, 10),
        suspended: parseInt(r.suspended, 10),
        inactive: parseInt(r.inactive, 10),
        total:
          parseInt(r.active, 10) +
          parseInt(r.pending, 10) +
          parseInt(r.suspended, 10) +
          parseInt(r.inactive, 10),
      })),
      meta: {
        period: \`Last \${months} months\`,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  async getDriverStatsSummary() {
    const totalActive = await this.driverRepo.count({
      where: { status: 'ACTIVE', deletedAt: null },
    });
    const totalLicenseTypes = await this.licenseTypeRepo.count({
      where: { status: 'ACTIVE', deletedAt: null },
    });

    const topType = await this.driverRepo
      .createQueryBuilder('d')
      .select('lt.code', 'code')
      .addSelect('lt.name', 'name')
      .addSelect('COUNT(d.id)', 'count')
      .innerJoin('d.licenseType', 'lt')
      .where(\`d.status = 'ACTIVE'\`)
      .andWhere('d.deletedAt IS NULL')
      .groupBy('lt.code')
      .addGroupBy('lt.name')
      .orderBy('count', 'DESC')
      .limit(1)
      .getRawOne();

    return {
      success: true,
      data: {
        totalActiveDrivers: totalActive,
        totalLicenseTypes,
        topLicenseType: topType
          ? { code: topType.code, name: topType.name,
              activeDrivers: parseInt(topType.count, 10) }
          : null,
      },
    };
  }
}`;

// ── Pie/Donut Chart: Backend code string ──

export const pieBackendCode = `// driver-distribution.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import { LicenseType } from '../entities/license-type.entity';

@Controller('api/v1/license-types')
export class DriverDistributionController {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
    @InjectRepository(LicenseType)
    private readonly licenseTypeRepo: Repository<LicenseType>,
  ) {}

  // GET /api/v1/license-types/distribution
  @Get('distribution')
  async getDistribution() {
    const results = await this.driverRepo
      .createQueryBuilder('d')
      .innerJoin('d.licenseType', 'lt')
      .select([
        'lt.code     AS code',
        'lt.name     AS name',
        'lt.category AS category',
        'COUNT(d.id) AS drivers',
      ])
      .where('d.deleted_at IS NULL')
      .andWhere('lt.status = :status', { status: 'ACTIVE' })
      .groupBy('lt.code')
      .addGroupBy('lt.name')
      .addGroupBy('lt.category')
      .orderBy('drivers', 'DESC')
      .getRawMany();

    const total = results.reduce(
      (sum, r) => sum + Number(r.drivers), 0,
    );

    return {
      success: true,
      data: {
        distribution: results.map((r) => ({
          code: r.code,
          name: r.name,
          category: r.category,
          drivers: Number(r.drivers),
          percentage: total > 0
            ? Number(((Number(r.drivers) / total) * 100).toFixed(1))
            : 0,
        })),
        total,
      },
      meta: {
        generatedAt: new Date().toISOString(),
      },
    };
  }

  // GET /api/v1/license-types/distribution/top
  @Get('distribution/top')
  async getTopDistribution() {
    const top5 = await this.driverRepo
      .createQueryBuilder('d')
      .innerJoin('d.licenseType', 'lt')
      .select([
        'lt.code     AS code',
        'lt.name     AS name',
        'COUNT(d.id) AS drivers',
      ])
      .where('d.deleted_at IS NULL')
      .andWhere('lt.status = :status', { status: 'ACTIVE' })
      .groupBy('lt.code')
      .addGroupBy('lt.name')
      .orderBy('drivers', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      success: true,
      data: top5.map((r) => ({
        code: r.code,
        name: r.name,
        drivers: Number(r.drivers),
      })),
    };
  }
}`;

// ── DataTable: Backend code string (NestJS — passed to getTableBackendCode) ──

export const tableBackendCode = [
  "// license-type.controller.ts",
  "import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';",
  "import { LicenseTypeService } from './license-type.service';",
  "import { CreateLicenseTypeDto } from './dto/create-license-type.dto';",
  "import { UpdateLicenseTypeDto } from './dto/update-license-type.dto';",
  "",
  "@Controller('api/v1/license-types')",
  "export class LicenseTypeController {",
  "  constructor(",
  "    private readonly licenseTypeService: LicenseTypeService,",
  "  ) {}",
  "",
  "  // GET /api/v1/license-types?page=1&limit=10&search=&status=",
  "  @Get()",
  "  async findAll(",
  "    @Query('page') page = 1,",
  "    @Query('limit') limit = 10,",
  "    @Query('search') search?: string,",
  "    @Query('status') status?: string,",
  "    @Query('sortField') sortField = 'code',",
  "    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',",
  "  ) {",
  "    return this.licenseTypeService.findAll({",
  "      page: Number(page),",
  "      limit: Number(limit),",
  "      search, status, sortField, sortOrder,",
  "    });",
  "  }",
  "",
  "  // GET /api/v1/license-types/:id",
  "  @Get(':id')",
  "  async findOne(@Param('id') id: number) {",
  "    return this.licenseTypeService.findOne(id);",
  "  }",
  "",
  "  // POST /api/v1/license-types",
  "  @Post()",
  "  async create(@Body() dto: CreateLicenseTypeDto) {",
  "    return this.licenseTypeService.create(dto);",
  "  }",
  "",
  "  // PUT /api/v1/license-types/:id",
  "  @Put(':id')",
  "  async update(",
  "    @Param('id') id: number,",
  "    @Body() dto: UpdateLicenseTypeDto,",
  "  ) {",
  "    return this.licenseTypeService.update(id, dto);",
  "  }",
  "",
  "  // DELETE /api/v1/license-types/:id  (soft delete)",
  "  @Delete(':id')",
  "  async remove(@Param('id') id: number) {",
  "    return this.licenseTypeService.softDelete(id);",
  "  }",
  "}",
  "",
  "// license-type.service.ts",
  "import { Injectable, NotFoundException } from '@nestjs/common';",
  "import { InjectRepository } from '@nestjs/typeorm';",
  "import { Repository, Like, IsNull } from 'typeorm';",
  "import { LicenseType } from '../entities/license-type.entity';",
  "",
  "@Injectable()",
  "export class LicenseTypeService {",
  "  constructor(",
  "    @InjectRepository(LicenseType)",
  "    private readonly repo: Repository<LicenseType>,",
  "  ) {}",
  "",
  "  async findAll(opts: {",
  "    page: number; limit: number;",
  "    search?: string; status?: string;",
  "    sortField: string; sortOrder: 'ASC' | 'DESC';",
  "  }) {",
  "    const { page, limit, search, status, sortField, sortOrder } = opts;",
  "    const qb = this.repo.createQueryBuilder('lt')",
  "      .where('lt.deleted_at IS NULL');",
  "",
  "    if (search) {",
  "      qb.andWhere(",
  "        '(lt.code LIKE :s OR lt.name LIKE :s OR lt.vehicle_class LIKE :s)',",
  "        { s: `%${search}%` },",
  "      );",
  "    }",
  "    if (status) {",
  "      qb.andWhere('lt.status = :status', { status });",
  "    }",
  "",
  "    qb.orderBy(`lt.${sortField}`, sortOrder)",
  "      .skip((page - 1) * limit)",
  "      .take(limit);",
  "",
  "    const [data, total] = await qb.getManyAndCount();",
  "",
  "    return {",
  "      success: true,",
  "      data,",
  "      meta: {",
  "        total, page, limit,",
  "        totalPages: Math.ceil(total / limit),",
  "      },",
  "    };",
  "  }",
  "",
  "  async findOne(id: number) {",
  "    const item = await this.repo.findOne({",
  "      where: { id, deleted_at: IsNull() },",
  "    });",
  "    if (!item) throw new NotFoundException('License type not found');",
  "    return { success: true, data: item };",
  "  }",
  "",
  "  async create(dto: any) {",
  "    const entity = this.repo.create(dto);",
  "    const saved = await this.repo.save(entity);",
  "    return { success: true, data: saved, message: 'Created successfully' };",
  "  }",
  "",
  "  async update(id: number, dto: any) {",
  "    const item = await this.findOne(id);",
  "    Object.assign(item.data, dto);",
  "    const saved = await this.repo.save(item.data);",
  "    return { success: true, data: saved, message: 'Updated successfully' };",
  "  }",
  "",
  "  async softDelete(id: number) {",
  "    await this.findOne(id);",
  "    await this.repo.update(id, { deleted_at: new Date() } as any);",
  "    return { success: true, message: 'Deleted successfully' };",
  "  }",
  "}",
].join("\n");

export const primeReactTableCode = `import { useState, useRef, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface LicenseType {
  id: number;
  code: string;
  name: string;
  category: string;
  vehicleClass: string;
  validityYears: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function LicenseTypeTable() {
  const toast = useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ACTIVE' | 'INACTIVE'
  >('ALL');
  const [visibleColumns, setVisibleColumns] = useState([
    'code','name','category','vehicleClass',
    'validityYears','status'
  ]);

  // Filtered data
  const filteredData = useMemo(() => {
    let data = licenseTypes; // your data source
    if (statusFilter !== 'ALL') {
      data = data.filter(lt => lt.status === statusFilter);
    }
    if (globalFilter.trim()) {
      const lower = globalFilter.toLowerCase();
      data = data.filter(lt =>
        lt.code.toLowerCase().includes(lower) ||
        lt.name.toLowerCase().includes(lower)
      );
    }
    return data;
  }, [statusFilter, globalFilter]);

  // Reset all filters
  const resetFilters = () => {
    setGlobalFilter('');
    setStatusFilter('ALL');
  };

  // Export CSV
  const exportCSV = () => {
    const csv = filteredData
      .map(row => visibleColumns.map(col => row[col]).join(','))
      .join('\\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'license-types.csv';
    a.click();
    toast.current?.show({
      severity: 'success',
      summary: 'Exported',
      detail: 'CSV downloaded',
      life: 2000
    });
  };

  // Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'License Types');
    XLSX.writeFile(wb, 'license-types.xlsx');
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [visibleColumns],
      body: filteredData.map(row =>
        visibleColumns.map(col => String(row[col] ?? ''))
      ),
    });
    doc.save('license-types.pdf');
  };

  // Status badge
  const statusTemplate = (rowData: LicenseType) => {
    const color = rowData.status === 'ACTIVE'
      ? 'success' : 'danger';
    return <Tag value={rowData.status} severity={color} />;
  };

  // Toolbar — Left
  const leftToolbar = () => (
    <div className="flex items-center gap-2">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search license types..."
        />
      </span>
      <button onClick={resetFilters}>
        <i className="pi pi-refresh" /> Refresh
      </button>
    </div>
  );

  // Toolbar — Right
  const rightToolbar = () => (
    <div className="flex items-center gap-2">
      <Dropdown
        value={statusFilter}
        options={[
          { label: 'All', value: 'ALL' },
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' }
        ]}
        onChange={e => setStatusFilter(e.value)}
        placeholder="Filter by Status"
      />
      <button onClick={exportCSV}>Export CSV</button>
      <button onClick={exportExcel}>Export Excel</button>
      <button onClick={exportPDF}>Export PDF</button>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar left={leftToolbar} right={rightToolbar} />
      <DataTable
        value={filteredData}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[10, 50, 100]}
        globalFilter={globalFilter}
        emptyMessage="No license types found."
        stripedRows
        removableSort
        scrollable
        rowHover
        size="small"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks
          NextPageLink LastPageLink CurrentPageReport
          RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last}
          of {totalRecords} entries"
      >
        <Column field="code" header="Code" sortable />
        <Column field="name" header="License Name" sortable />
        <Column field="category" header="Category" sortable />
        <Column
          field="vehicleClass"
          header="Vehicle Class"
          sortable
        />
        <Column
          field="validityYears"
          header="Validity (Years)"
          sortable
        />
        <Column
          field="status"
          header="Status"
          body={statusTemplate}
          sortable
        />
      </DataTable>
    </div>
  );
}`;

export const primeVueTableCode = `<template>
  <Toast ref="toast" />
  <Toolbar>
    <template #start>
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText
          v-model="globalFilter"
          placeholder="Search license types..."
        />
      </span>
      <Button
        icon="pi pi-refresh"
        label="Refresh"
        @click="resetFilters"
        class="ml-2"
      />
    </template>
    <template #end>
      <Dropdown
        v-model="statusFilter"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Filter by Status"
      />
      <Button label="CSV" icon="pi pi-file"
        @click="exportCSV" class="ml-2" />
      <Button label="Excel" icon="pi pi-file-excel"
        @click="exportExcel" class="ml-2" />
      <Button label="PDF" icon="pi pi-file-pdf"
        @click="exportPDF" class="ml-2" />
    </template>
  </Toolbar>
  <DataTable
    :value="filteredData"
    dataKey="id"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[10, 50, 100]"
    :globalFilterFields="['code', 'name', 'category']"
    stripedRows
    removableSort
    scrollable
    rowHover
    size="small"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks
      NextPageLink LastPageLink CurrentPageReport
      RowsPerPageDropdown"
    currentPageReportTemplate="Showing {first} to {last}
      of {totalRecords} entries"
  >
    <Column field="code" header="Code" sortable />
    <Column field="name" header="License Name" sortable />
    <Column field="category" header="Category" sortable />
    <Column field="vehicleClass" header="Vehicle Class"
      sortable />
    <Column field="validityYears" header="Validity (Years)"
      sortable />
    <Column field="status" header="Status" sortable>
      <template #body="{ data }">
        <Tag :value="data.status"
          :severity="data.status === 'ACTIVE'
            ? 'success' : 'danger'" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import Toolbar from 'primevue/toolbar';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const toast = useToast();
const globalFilter = ref('');
const statusFilter = ref('ALL');

const statusOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

const licenseTypes = ref([/* your data */]);

const filteredData = computed(() => {
  let data = licenseTypes.value;
  if (statusFilter.value !== 'ALL') {
    data = data.filter(
      lt => lt.status === statusFilter.value
    );
  }
  if (globalFilter.value.trim()) {
    const lower = globalFilter.value.toLowerCase();
    data = data.filter(lt =>
      lt.code.toLowerCase().includes(lower) ||
      lt.name.toLowerCase().includes(lower)
    );
  }
  return data;
});

const resetFilters = () => {
  globalFilter.value = '';
  statusFilter.value = 'ALL';
};

const exportCSV = () => {
  // CSV export logic
  toast.add({
    severity: 'success',
    summary: 'Exported',
    detail: 'CSV downloaded',
    life: 2000
  });
};

const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(filteredData.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'License Types');
  XLSX.writeFile(wb, 'license-types.xlsx');
};

const exportPDF = () => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [['Code','Name','Category','Vehicle Class',
      'Validity','Status']],
    body: filteredData.value.map(row => [
      row.code, row.name, row.category,
      row.vehicleClass, row.validityYears, row.status
    ]),
  });
  doc.save('license-types.pdf');
};
</script>`;

export const primeAngularTableCode = `import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface LicenseType {
  id: number;
  code: string;
  name: string;
  category: string;
  vehicleClass: string;
  validityYears: number;
  status: 'ACTIVE' | 'INACTIVE';
}

@Component({
  selector: 'app-license-type-table',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule,
    ToolbarModule, InputTextModule, DropdownModule,
    TagModule, ButtonModule, ToastModule
  ],
  providers: [MessageService],
  template: \`
    <p-toast />
    <p-toolbar>
      <ng-template pTemplate="left">
        <span class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <input pInputText type="text"
            [(ngModel)]="globalFilter"
            placeholder="Search license types..."
            (input)="onFilter()" />
        </span>
        <button pButton icon="pi pi-refresh"
          label="Refresh" (click)="resetFilters()"
          class="ml-2"></button>
      </ng-template>
      <ng-template pTemplate="right">
        <p-dropdown [options]="statusOptions"
          [(ngModel)]="statusFilter"
          optionLabel="label" optionValue="value"
          (onChange)="onFilter()"
          placeholder="Filter by Status">
        </p-dropdown>
        <button pButton label="CSV" icon="pi pi-file"
          (click)="exportCSV()" class="ml-2"></button>
        <button pButton label="Excel"
          icon="pi pi-file-excel"
          (click)="exportExcel()" class="ml-2"></button>
        <button pButton label="PDF" icon="pi pi-file-pdf"
          (click)="exportPDF()" class="ml-2"></button>
      </ng-template>
    </p-toolbar>

    <p-table
      [value]="filteredData"
      dataKey="id"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 50, 100]"
      [globalFilterFields]="['code','name','category']"
      [stripedRows]="true"
      [rowHover]="true"
      [scrollable]="true"
      sortMode="single"
      [removableSort]="true"
      currentPageReportTemplate="Showing {first} to {last}
        of {totalRecords} entries"
      [showCurrentPageReport]="true"
    >
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="code">Code
            <p-sortIcon field="code" /></th>
          <th pSortableColumn="name">License Name
            <p-sortIcon field="name" /></th>
          <th pSortableColumn="category">Category
            <p-sortIcon field="category" /></th>
          <th pSortableColumn="vehicleClass">Vehicle Class
            <p-sortIcon field="vehicleClass" /></th>
          <th pSortableColumn="validityYears">Validity
            <p-sortIcon field="validityYears" /></th>
          <th pSortableColumn="status">Status
            <p-sortIcon field="status" /></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row>
        <tr>
          <td>{{ row.code }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.category }}</td>
          <td>{{ row.vehicleClass }}</td>
          <td>{{ row.validityYears }} yrs</td>
          <td>
            <p-tag [value]="row.status"
              [severity]="row.status === 'ACTIVE'
                ? 'success' : 'danger'" />
          </td>
        </tr>
      </ng-template>
    </p-table>
  \`
})
export class LicenseTypeTableComponent implements OnInit {
  licenseTypes: LicenseType[] = [];
  filteredData: LicenseType[] = [];
  globalFilter = '';
  statusFilter = 'ALL';

  statusOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.licenseTypes = [/* your data */];
    this.filteredData = [...this.licenseTypes];
  }

  onFilter() {
    let data = this.licenseTypes;
    if (this.statusFilter !== 'ALL') {
      data = data.filter(
        lt => lt.status === this.statusFilter
      );
    }
    if (this.globalFilter.trim()) {
      const lower = this.globalFilter.toLowerCase();
      data = data.filter(lt =>
        lt.code.toLowerCase().includes(lower) ||
        lt.name.toLowerCase().includes(lower)
      );
    }
    this.filteredData = data;
  }

  resetFilters() {
    this.globalFilter = '';
    this.statusFilter = 'ALL';
    this.onFilter();
  }

  exportCSV() {
    // CSV export logic
    this.messageService.add({
      severity: 'success',
      summary: 'Exported',
      detail: 'CSV downloaded'
    });
  }

  exportExcel() {
    const ws = XLSX.utils.json_to_sheet(this.filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'License Types');
    XLSX.writeFile(wb, 'license-types.xlsx');
  }

  exportPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Code','Name','Category','Vehicle Class',
        'Validity','Status']],
      body: this.filteredData.map(row => [
        row.code, row.name, row.category,
        row.vehicleClass, row.validityYears, row.status
      ]),
    });
    doc.save('license-types.pdf');
  }
}`;

export function LicenseTypeList() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>(mockData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState<LicenseType[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<LicenseType>(emptyLicenseType);
  const [submitted, setSubmitted] = useState(false);
  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [detailItem, setDetailItem] = useState<LicenseType | null>(null);
  const actionMenuRef = useRef<Menu>(null);
  const activeRowRef = useRef<LicenseType | null>(null);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const columnsDropdownRef = useRef<HTMLDivElement>(null);
  const [chartDownloadOpen, setChartDownloadOpen] = useState(false);
  const chartDownloadRef = useRef<HTMLDivElement>(null);
  const [chartCodePreviewOpen, setChartCodePreviewOpen] = useState(false);
  const [chartCodeCategory, setChartCodeCategory] = useState<"frontend" | "backend">("frontend");
  const [chartCodeFramework, setChartCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [chartBackendLang, setChartBackendLang] = useState<BackendLang>("nestjs");
  const [chartBackendLangOpen, setChartBackendLangOpen] = useState(false);
  const chartBackendLangRef = useRef<HTMLDivElement>(null);
  const [chartCodeCopied, setChartCodeCopied] = useState(false);
  const [pieCodePreviewOpen, setPieCodePreviewOpen] = useState(false);
  const [pieCodeCategory, setPieCodeCategory] = useState<"frontend" | "backend">("frontend");
  const [pieCodeFramework, setPieCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [pieBackendLang, setPieBackendLang] = useState<BackendLang>("nestjs");
  const [pieBackendLangOpen, setPieBackendLangOpen] = useState(false);
  const pieBackendLangRef = useRef<HTMLDivElement>(null);
  const [pieCodeCopied, setPieCodeCopied] = useState(false);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const pieDownloadRef = useRef<HTMLDivElement>(null);
  const [pieDownloadOpen, setPieDownloadOpen] = useState(false);
  const [tableCodePreviewOpen, setTableCodePreviewOpen] = useState(false);
  const [tableCodeCategory, setTableCodeCategory] = useState<"frontend" | "backend">("frontend");
  const [tableCodeFramework, setTableCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [tableBackendLang, setTableBackendLang] = useState<BackendLang>("nestjs");
  const [tableBackendLangOpen, setTableBackendLangOpen] = useState(false);
  const tableBackendLangRef = useRef<HTMLDivElement>(null);
  const [tableCodeCopied, setTableCodeCopied] = useState(false);

  const exportColumns = [
    { field: "code" as keyof LicenseType, label: "Code" },
    { field: "name" as keyof LicenseType, label: "License Name" },
    { field: "category" as keyof LicenseType, label: "Category" },
    { field: "vehicleClass" as keyof LicenseType, label: "Vehicle Class" },
    { field: "validityYears" as keyof LicenseType, label: "Validity (Years)" },
    { field: "status" as keyof LicenseType, label: "Status" },
    { field: "description" as keyof LicenseType, label: "Description" },
    { field: "createdAt" as keyof LicenseType, label: "Created At" },
    { field: "updatedAt" as keyof LicenseType, label: "Updated" },
    { field: "deletedAt" as keyof LicenseType, label: "Deleted At" },
  ];

  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    exportColumns.map((c) => c.field)
  );

  const tableColumns = [
    { field: "code", label: "Code", default: true },
    { field: "name", label: "License Name", default: true },
    { field: "category", label: "Category", default: true },
    { field: "vehicleClass", label: "Vehicle Class", default: true },
    { field: "validityYears", label: "Validity", default: true },
    { field: "description", label: "Description", default: true },
    { field: "status", label: "Status", default: true },
    { field: "policyType", label: "Policy Type", default: true },
    { field: "createdAt", label: "Created At", default: false },
    { field: "updatedAt", label: "Updated", default: true },
    { field: "deletedAt", label: "Deleted At", default: false },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.filter((c) => c.default).map((c) => c.field)
  );

  const downloadChartAsImage = async (format: "png" | "jpg") => {
    if (!barChartRef.current) return;
    try {
      const fn = format === "png" ? htmlToImage.toPng : htmlToImage.toJpeg;
      const dataUrl = await fn(barChartRef.current, {
        backgroundColor: "#ffffff",
        quality: 1,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `drivers-by-license-type.${format === "jpg" ? "jpg" : "png"}`;
      link.href = dataUrl;
      link.click();
      toast.current?.show({ severity: "success", summary: "Downloaded", detail: `Chart saved as ${format.toUpperCase()}`, life: 2000 });
    } catch {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to download chart", life: 3000 });
    }
  };

  const downloadPieChartAsImage = async (format: "png" | "jpg") => {
    if (!pieChartRef.current) return;
    try {
      const fn = format === "png" ? htmlToImage.toPng : htmlToImage.toJpeg;
      const dataUrl = await fn(pieChartRef.current, {
        backgroundColor: "#ffffff",
        quality: 1,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `driver-distribution.${format === "jpg" ? "jpg" : "png"}`;
      link.href = dataUrl;
      link.click();
      toast.current?.show({ severity: "success", summary: "Downloaded", detail: `Chart saved as ${format.toUpperCase()}`, life: 2000 });
    } catch {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to download chart", life: 3000 });
    }
  };

  const filteredData = useMemo(() => {
    let data = licenseTypes;
    if (statusFilter !== "ALL") {
      data = data.filter((lt) => lt.status === statusFilter);
    }
    if (globalFilter.trim()) {
      const lower = globalFilter.toLowerCase();
      data = data.filter((lt) =>
        Object.values(lt).some((val) =>
          String(val).toLowerCase().includes(lower)
        )
      );
    }
    return data;
  }, [licenseTypes, globalFilter, statusFilter]);

  // Close backend lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chartBackendLangRef.current && !chartBackendLangRef.current.contains(e.target as Node)) {
        setChartBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close pie backend lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pieBackendLangRef.current && !pieBackendLangRef.current.contains(e.target as Node)) {
        setPieBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close table backend lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tableBackendLangRef.current && !tableBackendLangRef.current.contains(e.target as Node)) {
        setTableBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close status filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusFilterRef.current && !statusFilterRef.current.contains(e.target as Node)) {
        setStatusFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close columns dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (columnsDropdownRef.current && !columnsDropdownRef.current.contains(e.target as Node)) {
        setColumnsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close chart download dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chartDownloadRef.current && !chartDownloadRef.current.contains(e.target as Node)) {
        setChartDownloadOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close pie download dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pieDownloadRef.current && !pieDownloadRef.current.contains(e.target as Node)) {
        setPieDownloadOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getActionMenuItems = () => [
    {
      template: (item: any, options: any) => (
        <button
          onClick={(e) => {
            options.onClick(e);
          }}
          className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span className="text-[12px] text-[#334155]">View Details</span>
        </button>
      ),
      command: () => {
        if (activeRowRef.current) navigate(`/dashboard/license-types/${activeRowRef.current.id}`);
      },
    },
    {
      template: (item: any, options: any) => (
        <button
          onClick={(e) => {
            options.onClick(e);
          }}
          className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <FileBarChart className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span className="text-[12px] text-[#334155]">Report</span>
        </button>
      ),
      command: () => {
        if (activeRowRef.current) {
          // Report action placeholder
          toast.current?.show({ severity: "info", summary: "Report", detail: `Generating report for ${activeRowRef.current.code}...`, life: 3000 });
        }
      },
    },
  ];

  const openNew = () => {
    setFormData({ ...emptyLicenseType, id: Date.now(), createdAt: new Date().toISOString().split("T")[0], updatedAt: new Date().toISOString().split("T")[0], deletedAt: null });
    setEditMode(false);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openEdit = (item: LicenseType) => {
    setFormData({ ...item });
    setEditMode(true);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openDetail = (item: LicenseType) => {
    setDetailItem(item);
    setDetailDialogVisible(true);
  };

  const saveItem = () => {
    setSubmitted(true);
    if (!formData.code.trim() || !formData.name.trim() || !formData.category) return;

    const updated = { ...formData, updatedAt: new Date().toISOString().split("T")[0] };

    if (editMode) {
      setLicenseTypes((prev) => prev.map((lt) => (lt.id === updated.id ? updated : lt)));
      toast.current?.show({ severity: "success", summary: "Updated", detail: `${updated.name} has been updated`, life: 3000 });
    } else {
      setLicenseTypes((prev) => [...prev, updated]);
      toast.current?.show({ severity: "success", summary: "Created", detail: `${updated.name} has been created`, life: 3000 });
    }

    setDialogVisible(false);
    setFormData(emptyLicenseType);
  };

  const confirmDelete = (item: LicenseType) => {
    confirmDialog({
      message: `Are you sure you want to delete "${item.name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setLicenseTypes((prev) => prev.filter((lt) => lt.id !== item.id));
        toast.current?.show({ severity: "warn", summary: "Deleted", detail: `${item.name} has been removed`, life: 3000 });
      },
    });
  };

  const confirmDeleteSelected = () => {
    confirmDialog({
      message: `Delete ${selectedItems.length} selected item(s)?`,
      header: "Bulk Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        const ids = new Set(selectedItems.map((s) => s.id));
        setLicenseTypes((prev) => prev.filter((lt) => !ids.has(lt.id)));
        setSelectedItems([]);
        toast.current?.show({ severity: "warn", summary: "Deleted", detail: `${ids.size} items removed`, life: 3000 });
      },
    });
  };

  const exportCSV = () => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) {
      toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column to export", life: 3000 });
      return;
    }
    const headers = cols.map((c) => c.label);
    const dataToExport = filteredData;
    const escapeCSV = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };
    const rows = dataToExport.map((lt) =>
      cols.map((c) => escapeCSV(String(lt[c.field])))
    );
    const csv = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "driver_license_types.csv";
    a.click();
    URL.revokeObjectURL(url);
    setExportDialogVisible(false);
    toast.current?.show({
      severity: "info",
      summary: "Exported",
      detail: `${dataToExport.length} row(s) with ${cols.length} column(s) exported`,
      life: 3000,
    });
  };

  const exportExcel = () => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) {
      toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column to export", life: 3000 });
      return;
    }
    const headers = cols.map((c) => c.label);
    const dataToExport = filteredData;
    const worksheetData = [headers, ...dataToExport.map((lt) => cols.map((c) => String(lt[c.field])))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Driver License Types");
    XLSX.writeFile(workbook, "driver_license_types.xlsx");
    setExportDialogVisible(false);
    toast.current?.show({
      severity: "info",
      summary: "Exported",
      detail: `${dataToExport.length} row(s) with ${cols.length} column(s) exported`,
      life: 3000,
    });
  };

  const exportPDF = () => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) {
      toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column to export", life: 3000 });
      return;
    }
    const headers = cols.map((c) => c.label);
    const dataToExport = filteredData;
    const doc = new jsPDF();
    autoTable(doc, {
      head: [headers],
      body: dataToExport.map((lt) => cols.map((c) => String(lt[c.field]))),
      startY: 20,
      margin: { top: 10, bottom: 10, left: 10, right: 10 },
      headStyles: { fillColor: [240, 249, 255], textColor: [59, 130, 246], fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      tableWidth: "auto",
      columnStyles: cols.reduce((acc, col) => {
        acc[col.field] = { cellWidth: "wrap" };
        return acc;
      }, {} as { [key: string]: { cellWidth: "wrap" } }),
    });
    doc.save("driver_license_types.pdf");
    setExportDialogVisible(false);
    toast.current?.show({
      severity: "info",
      summary: "Exported",
      detail: `${dataToExport.length} row(s) with ${cols.length} column(s) exported`,
      life: 3000,
    });
  };

  const statusBodyTemplate = (rowData: LicenseType) => {
    if (rowData.status === "ACTIVE") return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f0fdf4] text-[#16a34a]">
        <Check className="w-3 h-3" />
        Active
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#94a3b8]">
        <X className="w-3 h-3" />
        Inactive
      </span>
    );
  };

  const validityBodyTemplate = (rowData: LicenseType) => (
    <span className="text-[12px] text-[#334155]">
      {rowData.validityYears} {rowData.validityYears === 1 ? "Year" : "Years"}
    </span>
  );

  const actionBodyTemplate = (rowData: LicenseType) => (
    <div className="flex justify-center">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#eef2ff] transition-colors cursor-pointer text-[#6366f1] hover:bg-[#e0e7ff]"
        title="Edit"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/license-types/${rowData.id}`);
        }}
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const codeBodyTemplate = (rowData: LicenseType) => (
    <span className="text-[12px] text-[#0f172a] font-semibold">{rowData.code}</span>
  );

  const descriptionBodyTemplate = (rowData: LicenseType) => (
    <span className="text-[12px] text-[#64748b] line-clamp-1 max-w-[220px]" title={rowData.description}>
      {rowData.description}
    </span>
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const updatedBodyTemplate = (rowData: LicenseType) => (
    <span className="text-[12px] text-[#64748b]">{formatDate(rowData.updatedAt)}</span>
  );

  const categoryBodyTemplate = (rowData: LicenseType) => (
    <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f5f3ff] text-[#7c3aed]">
      {rowData.category}
    </span>
  );

  const leftToolbarTemplate = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate("/dashboard/license-types/add")}
        className="flex items-center gap-1.5 bg-[#e53935] hover:bg-[#c62828] text-white px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        New
      </button>
      
    </div>
  );

  const rightToolbarTemplate = () => (
    <div className="flex items-center gap-2">
      {/* Status Filter Dropdown */}
      <div className="relative" ref={statusFilterRef}>
        <button
          onClick={() => setStatusFilterOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer border ${
            statusFilter !== "ALL"
              ? "border-[#e53935] bg-[#fef2f2] text-[#e53935]"
              : "border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]"
          }`}
        >
          <Filter className="w-4 h-4" />
          {statusFilter === "ALL" ? "Status" : statusFilter === "ACTIVE" ? "Active" : "Inactive"}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${statusFilterOpen ? "rotate-180" : ""}`} />
        </button>
        {statusFilterOpen && (
          <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#e2e8f0] rounded-[10px] shadow-lg z-50 min-w-[160px] py-1.5 overflow-hidden">
            {([
              { key: "ALL" as const, label: "All Statuses", count: licenseTypes.length },
              { key: "ACTIVE" as const, label: "Active", count: licenseTypes.filter((lt) => lt.status === "ACTIVE").length },
              { key: "INACTIVE" as const, label: "Inactive", count: licenseTypes.filter((lt) => lt.status === "INACTIVE").length },
            ]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setStatusFilter(opt.key);
                  setStatusFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-[12px] transition-colors cursor-pointer ${
                  statusFilter === opt.key
                    ? "bg-[#fef2f2] text-[#e53935] font-medium"
                    : "text-[#475569] hover:bg-[#f8fafc]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {statusFilter === opt.key && <Check className="w-3.5 h-3.5" />}
                  <span className={statusFilter === opt.key ? "" : "ml-5.5"}>{opt.label}</span>
                </div>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  statusFilter === opt.key
                    ? "bg-[#e53935] text-white"
                    : "bg-[#f1f5f9] text-[#94a3b8]"
                }`}>
                  {opt.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="w-px h-6 bg-[#e2e8f0]" />
      <button
        onClick={() => setExportDialogVisible(true)}
        className="flex items-center gap-1.5 border border-[#e2e8f0] text-[#475569] px-3.5 py-2 rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors cursor-pointer"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
      {/* Show Columns Dropdown */}
      <div className="relative" ref={columnsDropdownRef}>
        <button
          onClick={() => setColumnsDropdownOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer border ${
            visibleColumns.length < tableColumns.length
              ? "border-[#6366f1] bg-[#eef2ff] text-[#6366f1]"
              : "border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]"
          }`}
        >
          <Columns3 className="w-4 h-4" />
          Columns
          {visibleColumns.length < tableColumns.length && (
            null
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${columnsDropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {columnsDropdownOpen && (
          <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#e2e8f0] rounded-[10px] shadow-lg z-50 min-w-[200px] py-1.5 overflow-hidden">
            {/* Header */}
            <div className="px-3.5 py-2 border-b border-[#f1f5f9]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">
                  Toggle columns
                </span>
                
              </div>
            </div>
            {/* Column toggles */}
            {tableColumns.map((col) => {
              const isVisible = visibleColumns.includes(col.field);
              return (
                <button
                  key={col.field}
                  onClick={() => {
                    setVisibleColumns((prev) =>
                      prev.includes(col.field)
                        ? prev.filter((f) => f !== col.field)
                        : [...prev, col.field]
                    );
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-[12px] transition-colors cursor-pointer ${
                    isVisible
                      ? "text-[#0f172a] hover:bg-[#f8fafc]"
                      : "text-[#94a3b8] hover:bg-[#f8fafc]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isVisible ? (
                      <Eye className="w-3.5 h-3.5 text-[#6366f1]" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-[#cbd5e1]" />
                    )}
                    <span className={isVisible ? "font-medium" : ""}>{col.label}</span>
                  </div>
                  <div
                    className={`w-7 h-4 rounded-full transition-colors relative ${
                      isVisible ? "bg-[#6366f1]" : "bg-[#e2e8f0]"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                        isVisible ? "left-3.5" : "left-0.5"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
            {/* Footer actions */}
            <div className="px-3.5 py-2 border-t border-[#f1f5f9] flex items-center justify-between">
              <button
                onClick={() => setVisibleColumns(tableColumns.map((c) => c.field))}
                className="text-[11px] text-[#6366f1] hover:text-[#4338ca] font-medium px-2 py-1 rounded hover:bg-[#eef2ff] transition-colors cursor-pointer"
              >
                Show All
              </button>
              <button
                onClick={() => setColumnsDropdownOpen(false)}
                className="text-[11px] text-[#64748b] hover:text-[#334155] font-medium px-2 py-1 rounded hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="w-px h-6 bg-[#e2e8f0]" />
      <button
        onClick={() => setTableCodePreviewOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-[8px] text-[11px] text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#c7d2fe]"
        title="View Table Code"
      >
        
        <span>&lt;/&gt;</span>
      </button>
    </div>
  );

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-[15px] text-[#0f172a] font-semibold m-0">License Types</h2>
        
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search license types..."
            className="!text-[13px] !py-2.5 !pl-10 !pr-4 !rounded-[10px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none !bg-[#f8fafc] !w-[280px]"
          />
          {globalFilter && (
            <button
              onClick={() => setGlobalFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] cursor-pointer"
            >
              <span className="text-[14px]">×</span>
            </button>
          )}
        </div>
        <button
          className="flex items-center justify-center w-9 h-9 border border-[#e2e8f0] rounded-[8px] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors cursor-pointer"
          title="Refresh"
          onClick={() => {
            setLicenseTypes([...mockData]);
            setSelectedItems([]);
            setStatusFilter("ALL");
            toast.current?.show({ severity: "info", summary: "Refreshed", detail: "Data has been reset", life: 2000 });
          }}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-end gap-2 pt-2">
      <button
        onClick={() => setDialogVisible(false)}
        className="px-4 py-2 border border-[#e2e8f0] text-[#475569] rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={saveItem}
        className="px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
      >
        {editMode ? "Update" : "Create"}
      </button>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Menu
        model={getActionMenuItems()}
        popup
        ref={actionMenuRef}
        className="!rounded-[10px] !border-[#e2e8f0] !shadow-lg !min-w-[160px] !py-1 [&_.p-menuitem]:!p-0 [&_.p-menuitem-content]:!p-0 [&_.p-menuitem-link]:!p-0"
      />

      {/* Page Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#fef2f2] flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#e53935]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">Driver License Type Management</h1>
            <p className="text-[12px] text-[#94a3b8]">
              Master Data Setup › Driver License Type › List
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Types", value: licenseTypes.length, color: "#e53935" },
          { label: "Active", value: licenseTypes.filter((lt) => lt.status === "ACTIVE").length, color: "#22c55e" },
          { label: "Inactive", value: licenseTypes.filter((lt) => lt.status === "INACTIVE").length, color: "#94a3b8" },
        ].map((stat) => (
          null
        ))}
      </div>

      {/* Drivers by Driver License Type — Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mb-5">
        {/* Bar Chart Column */}
        

        {/* Pie Chart Column */}
        
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-t-[12px] border border-b-0 border-[#e2e8f0]">
        <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate} className="!border-none !rounded-t-[12px] !bg-transparent !px-4 !py-3" />
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-b-[12px] border border-[#e2e8f0] overflow-hidden">
        <DataTable
          value={filteredData}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[10, 50, 100]}
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No license types found."
          stripedRows
          removableSort
          scrollable
          scrollHeight="calc(100vh - 430px)"
          className="text-[12px] [&_.p-datatable-thead>tr>th]:!text-[11px] [&_.p-datatable-thead>tr>th]:!font-semibold [&_.p-datatable-thead>tr>th]:!text-[#64748b] [&_.p-datatable-thead>tr>th]:!uppercase [&_.p-datatable-thead>tr>th]:!tracking-[0.3px] [&_.p-datatable-tbody>tr>td]:!text-[12px] [&_.p-datatable-tbody>tr>td]:!font-normal [&_.p-datatable-tbody>tr>td]:!text-[#334155] [&_.p-datatable-tbody>tr>td]:!py-2.5 [&_.p-paginator]:!text-[11px] [&_.p-paginator]:!py-2.5 [&_.p-paginator]:!px-4 [&_.p-paginator]:!border-t [&_.p-paginator]:!border-[#e2e8f0] [&_.p-paginator_.p-dropdown]:!border-[#cbd5e1] [&_.p-paginator_.p-dropdown]:!rounded-lg [&_.p-paginator_.p-dropdown]:!min-w-[72px] [&_.p-paginator_.p-dropdown]:!h-8 [&_.p-paginator_.p-dropdown]:!shadow-sm [&_.p-paginator_.p-dropdown_.p-dropdown-label]:!text-[11px] [&_.p-paginator_.p-dropdown_.p-dropdown-label]:!py-1 [&_.p-paginator_.p-dropdown_.p-dropdown-label]:!px-2.5 [&_.p-paginator_.p-dropdown_.p-dropdown-label]:!text-[#334155] [&_.p-paginator_.p-dropdown_.p-dropdown-trigger]:!w-7 [&_.p-paginator_.p-dropdown:hover]:!border-[#94a3b8] [&_.p-paginator_.p-dropdown:focus-within]:!border-[#6366f1] [&_.p-paginator_.p-dropdown:focus-within]:!ring-2 [&_.p-paginator_.p-dropdown:focus-within]:!ring-[#6366f1]/20 [&_.p-paginator_.p-paginator-current]:!text-[#64748b] [&_.p-paginator_.p-paginator-current]:!mx-2"
          rowHover
          size="small"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          {visibleColumns.includes("code") && (
            <Column field="code" header="Code" sortable style={{ minWidth: "130px" }} body={(rowData: LicenseType) => (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3 h-3 text-[#6366f1]" />
                </div>
                <span className="text-[12px] text-[#0f172a] font-semibold">{rowData.code}</span>
              </div>
            )} />
          )}
          {visibleColumns.includes("name") && (
            <Column field="name" header="License Name" sortable style={{ minWidth: "180px" }} body={(rowData: LicenseType) => (
              <span className="text-[12px] text-[#334155]">{rowData.name}</span>
            )} />
          )}
          {visibleColumns.includes("category") && (
            <Column field="category" header="Category" body={categoryBodyTemplate} sortable style={{ minWidth: "140px" }} />
          )}
          {visibleColumns.includes("vehicleClass") && (
            <Column field="vehicleClass" header="Vehicle Class" sortable style={{ minWidth: "220px" }} body={(rowData: LicenseType) => (
              <span className="text-[12px] text-[#64748b] line-clamp-1 max-w-[200px]" title={rowData.vehicleClass}>{rowData.vehicleClass}</span>
            )} />
          )}
          {visibleColumns.includes("validityYears") && (
            <Column field="validityYears" header="Validity" body={validityBodyTemplate} sortable style={{ minWidth: "85px" }} />
          )}
          {visibleColumns.includes("policyType") && (
            <Column field="policyType" header="Policy Type" sortable style={{ minWidth: "160px" }} body={(rowData: LicenseType) => {
              const policy = licensePolicyMockData.find(p => p.policyType === rowData.policyType);
              return (
                <span className="text-[12px] text-[#334155]">
                  {policy ? policy.label : rowData.policyType}
                </span>
              );
            }} />
          )}
          {visibleColumns.includes("description") && (
            <Column field="description" header="Description" body={descriptionBodyTemplate} sortable style={{ minWidth: "200px" }} />
          )}
          {visibleColumns.includes("updatedAt") && (
            <Column field="updatedAt" header="Updated" body={updatedBodyTemplate} sortable style={{ minWidth: "130px" }} />
          )}
          {visibleColumns.includes("status") && (
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "100px" }} />
          )}
          {visibleColumns.includes("createdAt") && (
            <Column field="createdAt" header="Created At" sortable style={{ minWidth: "120px" }} body={(rowData: LicenseType) => (
              <span className="text-[12px] text-[#64748b]">{formatDate(rowData.createdAt)}</span>
            )} />
          )}
          {visibleColumns.includes("deletedAt") && (
            <Column
              field="deletedAt"
              header="Deleted At"
              sortable
              style={{ minWidth: "120px" }}
              body={(rowData: LicenseType) => (
                <span className={`text-[12px] ${rowData.deletedAt ? "text-[#e53935]" : "text-[#cbd5e1]"}`}>
                  {rowData.deletedAt ? formatDate(rowData.deletedAt) : "—"}
                </span>
              )}
            />
          )}
          <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: "60px" }} frozen alignFrozen="right" />
        </DataTable>
      </div>

      {/* Table Code Preview Dialog */}
      <Dialog
        visible={tableCodePreviewOpen}
        onHide={() => { setTableCodePreviewOpen(false); setTableCodeCopied(false); setTableCodeCategory("frontend"); setTableBackendLang("nestjs"); setTableBackendLangOpen(false); }}
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
                <h3 className="text-[13px] text-[#0f172a] font-semibold">DataTable Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">Search, Filter, Export, Columns, Pagination</p>
              </div>
            </div>
            <button
              onClick={() => { setTableCodePreviewOpen(false); setTableCodeCopied(false); setTableCodeCategory("frontend"); setTableBackendLang("nestjs"); setTableBackendLangOpen(false); }}
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
                onClick={() => { setTableCodeCategory(cat.key); setTableCodeCopied(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] transition-all cursor-pointer relative ${
                  tableCodeCategory === cat.key
                    ? "text-[#0f172a] font-semibold"
                    : "text-[#94a3b8] hover:text-[#64748b]"
                }`}
              >
                <span className="text-[12px]">{cat.icon}</span>
                {cat.label}
                {tableCodeCategory === cat.key && (
                  <div className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full" style={{ backgroundColor: cat.color }} />
                )}
              </button>
            ))}
          </div>

          {/* Sub-tabs (Framework tabs for Frontend / Backend lang dropdown) & Copy Button */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
            <div className="flex items-center gap-1">
              {tableCodeCategory === "frontend" ? (
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
                        onClick={() => { setTableCodeFramework(fw); setTableCodeCopied(false); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] transition-all cursor-pointer ${
                          tableCodeFramework === fw
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
                  <div className="relative" ref={tableBackendLangRef}>
                    <button
                      onClick={() => setTableBackendLangOpen(!tableBackendLangOpen)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a] transition-colors cursor-pointer"
                    >
                      <span>{backendLangConfig[tableBackendLang].icon}</span>
                      {backendLangConfig[tableBackendLang].label}
                      <ChevronDown className={`w-3 h-3 transition-transform ${tableBackendLangOpen ? "rotate-180" : ""}`} />
                    </button>
                    {tableBackendLangOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50 min-w-[180px]">
                        {backendLangOptions.map((lang) => {
                          const cfg = backendLangConfig[lang];
                          return (
                            <button
                              key={lang}
                              onClick={() => { setTableBackendLang(lang); setTableBackendLangOpen(false); setTableCodeCopied(false); }}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors cursor-pointer ${
                                tableBackendLang === lang
                                  ? "bg-[#fef3c7] text-[#92400e] font-medium"
                                  : "text-[#475569] hover:bg-[#f8fafc]"
                              }`}
                            >
                              <span className="text-[12px]">{cfg.icon}</span>
                              {cfg.label}
                              {tableBackendLang === lang && <Check className="w-3 h-3 ml-auto text-[#92400e]" />}
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
              onClick={() => {
                let text = "";
                if (tableCodeCategory === "frontend") {
                  const codeMap: Record<string, string> = { react: primeReactTableCode, vue: primeVueTableCode, angular: primeAngularTableCode };
                  text = codeMap[tableCodeFramework];
                } else {
                  text = getTableBackendCode(tableBackendLang, tableBackendCode);
                }
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
                } catch { fallbackCopy(text); }
                setTableCodeCopied(true);
                setTimeout(() => setTableCodeCopied(false), 2000);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer border ${
                tableCodeCopied
                  ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
                  : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] border-[#e2e8f0]"
              }`}
            >
              {tableCodeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {tableCodeCopied ? "Copied!" : "Copy Code"}
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
              <span className="text-[10px] text-[#64748b] ml-2">
                {tableCodeCategory === "frontend"
                  ? (tableCodeFramework === "react" ? "LicenseTypeTable.tsx" : tableCodeFramework === "vue" ? "LicenseTypeTable.vue" : "license-type-table.component.ts")
                  : tableBackendFileConfig[tableBackendLang]}
              </span>
            </div>
            <Highlight
              theme={tableCodeCategory === "frontend" ? themes.nightOwl : themes.vsDark}
              code={
                tableCodeCategory === "frontend"
                  ? (tableCodeFramework === "react" ? primeReactTableCode : tableCodeFramework === "vue" ? primeVueTableCode : primeAngularTableCode)
                  : getTableBackendCode(tableBackendLang, tableBackendCode)
              }
              language={
                tableCodeCategory === "frontend"
                  ? (tableCodeFramework === "angular" ? "typescript" : tableCodeFramework === "vue" ? "markup" : "tsx")
                  : "typescript"
              }
            >
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  style={{ ...style, margin: 0, padding: "16px", fontSize: "12px", lineHeight: "1.6", maxHeight: "460px", overflow: "auto" }}
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
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editMode ? "Edit License Type" : "New License Type"}
        footer={dialogFooter}
        modal
        style={{ width: "520px" }}
        className="p-fluid"
        draggable={false}
      >
        <div className="flex flex-col gap-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#475569] font-medium">Code *</label>
              <InputText
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className={`!text-[13px] ${submitted && !formData.code.trim() ? "p-invalid" : ""}`}
                placeholder="e.g. LT-011"
              />
              {submitted && !formData.code.trim() && (
                <small className="text-[#e53935] text-[11px]">Code is required</small>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#475569] font-medium">Status *</label>
              <Dropdown
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.value })}
                options={statusOptions}
                className="!text-[13px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#475569] font-medium">License Name *</label>
            <InputText
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`!text-[13px] ${submitted && !formData.name.trim() ? "p-invalid" : ""}`}
              placeholder="e.g. Class K - Special Permit"
            />
            {submitted && !formData.name.trim() && (
              <small className="text-[#e53935] text-[11px]">Name is required</small>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#475569] font-medium">Category *</label>
              <Dropdown
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.value })}
                options={categoryOptions}
                placeholder="Select category"
                className={`!text-[13px] ${submitted && !formData.category ? "p-invalid" : ""}`}
              />
              {submitted && !formData.category && (
                <small className="text-[#e53935] text-[11px]">Category is required</small>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#475569] font-medium">Validity (Years)</label>
              <InputText
                value={String(formData.validityYears)}
                onChange={(e) => setFormData({ ...formData, validityYears: parseInt(e.target.value) || 1 })}
                className="!text-[13px]"
                type="number"
                min={1}
                max={10}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#475569] font-medium">Vehicle Class</label>
            <InputText
              value={formData.vehicleClass}
              onChange={(e) => setFormData({ ...formData, vehicleClass: e.target.value })}
              className="!text-[13px]"
              placeholder="e.g. Sedan / Hatchback"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#475569] font-medium">Description</label>
            <InputTextarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="!text-[13px]"
              placeholder="Describe this license type..."
            />
          </div>
        </div>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        visible={detailDialogVisible}
        onHide={() => setDetailDialogVisible(false)}
        header="License Type Details"
        modal
        style={{ width: "520px" }}
        draggable={false}
      >
        {detailItem && (
          <div className="flex flex-col gap-4 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] bg-[#f1f5f9] text-[#475569] px-2.5 py-1 rounded">
                  {detailItem.code}
                </span>
                <Tag
                  value={detailItem.status}
                  severity={
                    detailItem.status === "ACTIVE" ? "success" : detailItem.status === "INACTIVE" ? "danger" : "warning"
                  }
                  rounded
                />
              </div>
            </div>

            <div>
              <h3 className="text-[16px] text-[#0f172a] font-semibold">{detailItem.name}</h3>
              <p className="text-[13px] text-[#64748b] mt-1">{detailItem.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#f8fafc] rounded-lg p-4">
              {[
                { label: "Category", value: detailItem.category },
                { label: "Vehicle Class", value: detailItem.vehicleClass },
                { label: "Validity", value: `${detailItem.validityYears} Year${detailItem.validityYears > 1 ? "s" : ""}` },
                { label: "Created", value: detailItem.createdAt },
                { label: "Last Updated", value: detailItem.updatedAt },
                { label: "Deleted At", value: detailItem.deletedAt ?? "—" },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">{field.label}</p>
                  <p className="text-[13px] text-[#0f172a] font-medium mt-0.5">{field.value}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setDetailDialogVisible(false);
                  openEdit(detailItem);
                }}
                className="flex items-center gap-1.5 border border-[#22c55e] text-[#22c55e] px-3.5 py-2 rounded-[8px] text-[13px] font-medium hover:bg-[#f0fdf4] transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => setDetailDialogVisible(false)}
                className="px-4 py-2 border border-[#e2e8f0] text-[#475569] rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Export Dialog */}
      <Dialog
        visible={exportDialogVisible}
        onHide={() => setExportDialogVisible(false)}
        header={
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#f0f9ff] flex items-center justify-center">
              <Download className="w-3.5 h-3.5 text-[#3b82f6]" />
            </div>
            <span className="text-[15px] text-[#0f172a]">Export Data</span>
          </div>
        }
        modal
        style={{ width: "500px" }}
        draggable={false}
        className="[&_.p-dialog-header]:!pb-2"
      >
        <div className="flex flex-col gap-4 pt-1">
          {/* Info banner */}
          

          {/* Format selector */}
          <div>
            <p className="text-[12px] text-[#475569] font-medium mb-2">Export format</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: "csv" as const, label: "CSV", desc: "Comma-separated", icon: <Download className="w-4 h-4" />, color: "#3b82f6" },
                { key: "excel" as const, label: "Excel", desc: "Spreadsheet (.xlsx)", icon: <FileSpreadsheet className="w-4 h-4" />, color: "#22c55e" },
                { key: "pdf" as const, label: "PDF", desc: "Document (.pdf)", icon: <FileText className="w-4 h-4" />, color: "#e53935" },
              ]).map((fmt) => (
                <button
                  key={fmt.key}
                  onClick={() => setExportFormat(fmt.key)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-[10px] border-2 transition-all cursor-pointer ${
                    exportFormat === fmt.key
                      ? "border-[color:var(--fmt-color)] bg-[color:var(--fmt-bg)]"
                      : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                  }`}
                  style={{
                    "--fmt-color": fmt.color,
                    "--fmt-bg": fmt.color + "08",
                    borderColor: exportFormat === fmt.key ? fmt.color : undefined,
                    backgroundColor: exportFormat === fmt.key ? fmt.color + "08" : undefined,
                  } as React.CSSProperties}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: exportFormat === fmt.key ? fmt.color + "18" : "#f1f5f9",
                      color: exportFormat === fmt.key ? fmt.color : "#94a3b8",
                    }}
                  >
                    {fmt.icon}
                  </div>
                  <span className={`text-[12px] font-medium ${exportFormat === fmt.key ? "text-[#0f172a]" : "text-[#64748b]"}`}>
                    {fmt.label}
                  </span>
                  <span className="text-[10px] text-[#94a3b8]">{fmt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Column selection header */}
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-[#475569] font-medium">Select columns to export<span className="text-[#94a3b8] ml-1.5">({selectedExportColumns.length} of {exportColumns.length})</span></p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedExportColumns(exportColumns.map((c) => c.field))}
                className="text-[11px] text-[#3b82f6] hover:text-[#1d4ed8] font-medium px-2 py-1 rounded hover:bg-[#eff6ff] transition-colors cursor-pointer"
              >
                Select All
              </button>
              <span className="text-[#e2e8f0]">|</span>
              <button
                onClick={() => setSelectedExportColumns([])}
                className="text-[11px] text-[#64748b] hover:text-[#334155] font-medium px-2 py-1 rounded hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Column checkboxes */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {exportColumns.map((col) => {
              const isChecked = selectedExportColumns.includes(col.field);
              return (
                <label
                  key={col.field}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-[8px] cursor-pointer transition-colors ${
                    isChecked
                      ? "bg-[#f0f9ff] border border-[#bfdbfe]"
                      : "bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0]"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onChange={() => {
                      setSelectedExportColumns((prev) =>
                        prev.includes(col.field)
                          ? prev.filter((f) => f !== col.field)
                          : [...prev, col.field]
                      );
                    }}
                    className="[&_.p-checkbox-box]:!w-4 [&_.p-checkbox-box]:!h-4 [&_.p-checkbox-box]:!rounded [&_.p-checkbox-box.p-highlight]:!bg-[#3b82f6] [&_.p-checkbox-box.p-highlight]:!border-[#3b82f6]"
                  />
                  <span className={`text-[12px] ${isChecked ? "text-[#1e40af] font-medium" : "text-[#64748b]"}`}>
                    {col.label}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
            <p className="text-[11px] text-[#94a3b8]">
              Format: {exportFormat === "csv" ? "CSV (UTF-8)" : exportFormat === "excel" ? "Excel (.xlsx)" : "PDF (.pdf)"}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExportDialogVisible(false)}
                className="px-4 py-2 border border-[#e2e8f0] text-[#475569] rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (exportFormat === "csv") exportCSV();
                  else if (exportFormat === "excel") exportExcel();
                  else exportPDF();
                }}
                disabled={selectedExportColumns.length === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-[13px] font-medium transition-colors ${
                  selectedExportColumns.length === 0
                    ? "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
                    : "text-white cursor-pointer"
                }`}
                style={{
                  backgroundColor: selectedExportColumns.length === 0
                    ? undefined
                    : exportFormat === "csv" ? "#3b82f6" : exportFormat === "excel" ? "#22c55e" : "#e53935",
                }}
              >
                {exportFormat === "csv" ? <Download className="w-3.5 h-3.5" /> : exportFormat === "excel" ? <FileSpreadsheet className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                Export as {exportFormat === "csv" ? "CSV" : exportFormat === "excel" ? "Excel" : "PDF"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
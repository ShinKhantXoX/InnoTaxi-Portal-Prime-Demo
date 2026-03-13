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
import { ScrollText, FileText, FileSpreadsheet, Plus, Pencil, Trash2, Download, RefreshCw, Search, EllipsisVertical, Check, X, Filter, ChevronDown, Columns3, Eye, EyeOff, Code2, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { backendLangConfig, backendLangOptions, tableBackendFileConfig, type BackendLang } from "./chartBackendCodes";
import { getTableBackendCode } from "./tableBackendCodes";
import { licensePolicyBackendCode, licensePolicyBackendFileConfig } from "./licensePolicyBackendCodes";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Types ──
export type PolicyType = "DRIVER_LICENSE" | "VEHICEL_LICENSE";

export interface LicensePolicy {
  id: number;
  label: string;
  description: string;
  policyType: PolicyType;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const policyTypeOptions: { label: string; value: PolicyType }[] = [
  { label: "Driver License", value: "DRIVER_LICENSE" },
  { label: "Vehicle License", value: "VEHICEL_LICENSE" },
];

const policyTypeStyles: Record<PolicyType, { text: string; bg: string; dot: string }> = {
  DRIVER_LICENSE: { text: "#7c3aed", bg: "#f5f3ff", dot: "#8b5cf6" },
  VEHICEL_LICENSE: { text: "#0369a1", bg: "#f0f9ff", dot: "#0ea5e9" },
};

const emptyPolicy: LicensePolicy = {
  id: 0,
  label: "",
  description: "",
  policyType: "DRIVER_LICENSE",
  status: "ACTIVE",
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
};

// ── Mock Data ──
export const licensePolicyMockData: LicensePolicy[] = [
  {
    id: 1,
    label: "ယာဉ်မောင်းလိုင်စင် Policy အရေးကြီးချက်များ",
    description: "၁. အသက်ကန့်သတ်ချက်\nအနည်းဆုံး အသက် ၁၈ နှစ် ပြည့်ရမည်။\n\n၂. စာမေးပွဲစနစ်\nလိုင်စင်ရရှိရန်\n- Theory Test (Traffic Rules)\n- Driving Test (Practical)\nကို ဖြေဆိုအောင်မြင်ရမည်။\n\n၃. Renewal Policy\nလိုင်စင်သက်တမ်းကုန်မတိုင်မီ Renewal ပြုလုပ်ရမည်\nသက်တမ်းကုန်ပြီး အချိန်ကြာလျှင် Penalty Fee ပေးရနိုင်သည်။\n\n၄. Upgrade Policy\nဆိုင်ကယ်လိုင်စင်မှ ကားလိုင်စင်သို့\nPrivate License မှ Commercial License သို့\nUpgrade လုပ်နိုင်ပြီး ထပ်မံ စမ်းသပ်မှုများ ဖြေဆိုရနိုင်သည်။\n\n၅. Cancellation / Suspension\nအောက်ပါအခြေအနေများတွင် လိုင်စင်ပိတ်ပင်နိုင်သည်။\n- မူးယစ်ဆေး သို့မဟုတ် အရက်မူးပြီး မောင်းနှင်ခြင်း\n- ယာဉ်စည်းကမ်း မကြာခဏ ချိုးဖောက်ခြင်း\n- အန္တရာယ်ကြီးသော ယာဉ်တိုက်မှုများ ဖြစ်စေခြင်း",
    policyType: "DRIVER_LICENSE",
    status: "ACTIVE",
    createdAt: "2024-01-15",
    updatedAt: "2026-01-20",
    deletedAt: null,
  },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

// ── Frontend Code Strings ──
export const policyReactTableCode = `import { useState, useRef, useMemo } from 'react';
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

type PolicyType = 'DRIVER_LICENSE';

interface LicensePolicy {
  id: number;
  label: string;
  description: string;
  policyType: PolicyType;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const policies: LicensePolicy[] = [
  { id: 1, label: 'ယာဉ်မောင်းလိုင်စင် Policy အရေးကြီးချက်များ', description: '၁. အသက်ကန့်သတ်ချက်\\nအနည်းဆုံး အသက် ၁၈ နှစ် ပြည့်ရမည်။\\n၂. စာမေးပွဲစနစ်\\n၃. Renewal Policy\\n၄. Upgrade Policy\\n၅. Cancellation / Suspension', policyType: 'DRIVER_LICENSE', status: 'ACTIVE', createdAt: '2024-01-15', updatedAt: '2026-01-20', deletedAt: null },
];

export default function LicensePolicyTable() {
  const toast = useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ACTIVE' | 'INACTIVE'
  >('ALL');

  const filteredData = useMemo(() => {
    let data = policies;
    if (statusFilter !== 'ALL') {
      data = data.filter(p => p.status === statusFilter);
    }
    if (globalFilter.trim()) {
      const lower = globalFilter.toLowerCase();
      data = data.filter(p =>
        p.label.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
      );
    }
    return data;
  }, [statusFilter, globalFilter]);

  const resetFilters = () => {
    setGlobalFilter('');
    setStatusFilter('ALL');
  };

  const statusTemplate = (rowData: LicensePolicy) => {
    const color = rowData.status === 'ACTIVE'
      ? 'success' : 'danger';
    return <Tag value={rowData.status} severity={color} />;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const leftToolbar = () => (
    <div className="flex items-center gap-2">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search policies..."
        />
      </span>
      <button onClick={resetFilters}>
        <i className="pi pi-refresh" /> Refresh
      </button>
    </div>
  );

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
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Toolbar left={leftToolbar} right={rightToolbar} />
      <DataTable
        value={filteredData}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[10, 50, 100]}
        globalFilter={globalFilter}
        emptyMessage="No policies found."
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
        <Column field="label" header="Label" sortable />
        <Column field="description" header="Description" sortable />
        <Column field="policyType" header="Policy Type"
          body={policyTypeTemplate} sortable />
        <Column
          field="status"
          header="Status"
          body={statusTemplate}
          sortable
        />
        <Column field="createdAt" header="Created"
          body={(r) => formatDate(r.createdAt)} sortable />
        <Column field="updatedAt" header="Updated"
          body={(r) => formatDate(r.updatedAt)} sortable />
        <Column field="deletedAt" header="Deleted"
          body={(r) => formatDate(r.deletedAt)} sortable />
      </DataTable>
    </>
  );
}`;

export const policyVueTableCode = `<template>
  <Toast ref="toast" />
  <Toolbar>
    <template #start>
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText
          v-model="globalFilter"
          placeholder="Search policies..."
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
    </template>
  </Toolbar>
  <DataTable
    :value="filteredData"
    dataKey="id"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[10, 50, 100]"
    :globalFilterFields="['label', 'description']"
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
    <Column field="label" header="Label" sortable />
    <Column field="description" header="Description" sortable />
    <Column field="policyType" header="Policy Type" sortable>
      <template #body="{ data }">
        <Tag :value="data.policyType"
          :severity="policyTypeSeverity(data.policyType)" />
      </template>
    </Column>
    <Column field="status" header="Status" sortable>
      <template #body="{ data }">
        <Tag :value="data.status"
          :severity="data.status === 'ACTIVE'
            ? 'success' : 'danger'" />
      </template>
    </Column>
    <Column field="createdAt" header="Created" sortable>
      <template #body="{ data }">
        {{ formatDate(data.createdAt) }}
      </template>
    </Column>
    <Column field="updatedAt" header="Updated" sortable>
      <template #body="{ data }">
        {{ formatDate(data.updatedAt) }}
      </template>
    </Column>
    <Column field="deletedAt" header="Deleted" sortable>
      <template #body="{ data }">
        {{ formatDate(data.deletedAt) }}
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

const globalFilter = ref('');
const statusFilter = ref('ALL');

const statusOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

const policies = ref([
  { id: 1, label: 'ယာဉ်မောင်းလိုင်စင် Policy အရေးကြီးချက်များ', description: '၁. အသက်ကန့်သတ်ချက်\\nအနည်းဆုံး အသက် ၁၈ နှစ် ပြည့်ရမည်။\\n၂. စာမေးပွဲစနစ်\\n၃. Renewal Policy\\n၄. Upgrade Policy\\n၅. Cancellation / Suspension', policyType: 'DRIVER_LICENSE', status: 'ACTIVE', createdAt: '2024-01-15', updatedAt: '2026-01-20', deletedAt: null },
]);

const filteredData = computed(() => {
  let data = policies.value;
  if (statusFilter.value !== 'ALL') {
    data = data.filter(p => p.status === statusFilter.value);
  }
  if (globalFilter.value.trim()) {
    const lower = globalFilter.value.toLowerCase();
    data = data.filter(p =>
      p.label.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
    );
  }
  return data;
});

const resetFilters = () => {
  globalFilter.value = '';
  statusFilter.value = 'ALL';
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '\\u2014';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};
</script>`;

export const policyAngularTableCode = `import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

type PolicyType = 'DRIVER_LICENSE';

interface LicensePolicy {
  id: number;
  label: string;
  description: string;
  policyType: PolicyType;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Component({
  selector: 'app-license-policy-table',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule,
    ToolbarModule, InputTextModule, DropdownModule,
    TagModule, ButtonModule, ToastModule, DatePipe
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
            placeholder="Search policies..."
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
      </ng-template>
    </p-toolbar>

    <p-table
      [value]="filteredData"
      dataKey="id"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 50, 100]"
      [globalFilterFields]="['label','description']"
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
          <th pSortableColumn="label">Label
            <p-sortIcon field="label" /></th>
          <th pSortableColumn="description">Description
            <p-sortIcon field="description" /></th>
          <th pSortableColumn="policyType">Policy Type
            <p-sortIcon field="policyType" /></th>
          <th pSortableColumn="status">Status
            <p-sortIcon field="status" /></th>
          <th pSortableColumn="createdAt">Created
            <p-sortIcon field="createdAt" /></th>
          <th pSortableColumn="updatedAt">Updated
            <p-sortIcon field="updatedAt" /></th>
          <th pSortableColumn="deletedAt">Deleted
            <p-sortIcon field="deletedAt" /></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row>
        <tr>
          <td>{{ row.label }}</td>
          <td>{{ row.description }}</td>
          <td>
            <p-tag [value]="row.policyType"
              [severity]="getPolicyTypeSeverity(row.policyType)" />
          </td>
          <td>
            <p-tag [value]="row.status"
              [severity]="row.status === 'ACTIVE'
                ? 'success' : 'danger'" />
          </td>
          <td>{{ row.createdAt | date:'mediumDate' }}</td>
          <td>{{ row.updatedAt | date:'mediumDate' }}</td>
          <td>{{ row.deletedAt ? (row.deletedAt | date:'mediumDate') : '\\u2014' }}</td>
        </tr>
      </ng-template>
    </p-table>
  \`
})
export class LicensePolicyTableComponent implements OnInit {
  policies: LicensePolicy[] = [];
  filteredData: LicensePolicy[] = [];
  globalFilter = '';
  statusFilter = 'ALL';

  statusOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.policies = [
      { id: 1, label: 'ယာဉ်မောင်းလိုင်စင် Policy အရေးကြီးချက်များ', description: '၁. အသက်ကန့်သတ်ချက်\\nအနည်းဆုံး အသက် ၁၈ နှစ် ပြည့်ရမည်။\\n၂. စာမေးပွဲစနစ်\\n၃. Renewal Policy\\n၄. Upgrade Policy\\n၅. Cancellation / Suspension', policyType: 'DRIVER_LICENSE', status: 'ACTIVE', createdAt: '2024-01-15', updatedAt: '2026-01-20', deletedAt: null },
    ];
    this.filteredData = [...this.policies];
  }

  onFilter() {
    let data = this.policies;
    if (this.statusFilter !== 'ALL') {
      data = data.filter(p => p.status === this.statusFilter);
    }
    if (this.globalFilter.trim()) {
      const lower = this.globalFilter.toLowerCase();
      data = data.filter(p =>
        p.label.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
      );
    }
    this.filteredData = data;
  }

  resetFilters() {
    this.globalFilter = '';
    this.statusFilter = 'ALL';
    this.onFilter();
  }
}`;

// ── Component ──
export function LicensePolicyList() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [policies, setPolicies] = useState<LicensePolicy[]>(licensePolicyMockData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState<LicensePolicy[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<LicensePolicy>(emptyPolicy);
  const [submitted, setSubmitted] = useState(false);
  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [detailItem, setDetailItem] = useState<LicensePolicy | null>(null);
  const actionMenuRef = useRef<Menu>(null);
  const activeRowRef = useRef<LicensePolicy | null>(null);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const columnsDropdownRef = useRef<HTMLDivElement>(null);

  // Table code preview state
  const [tableCodePreviewOpen, setTableCodePreviewOpen] = useState(false);
  const [tableCodeCategory, setTableCodeCategory] = useState<"frontend" | "backend">("frontend");
  const [tableCodeFramework, setTableCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [tableBackendLang, setTableBackendLang] = useState<BackendLang>("nestjs");
  const [tableBackendLangOpen, setTableBackendLangOpen] = useState(false);
  const tableBackendLangRef = useRef<HTMLDivElement>(null);
  const [tableCodeCopied, setTableCodeCopied] = useState(false);

  const exportColumns = [
    { field: "label" as keyof LicensePolicy, label: "Label" },
    { field: "description" as keyof LicensePolicy, label: "Description" },
    { field: "policyType" as keyof LicensePolicy, label: "Policy Type" },
    { field: "status" as keyof LicensePolicy, label: "Status" },
    { field: "createdAt" as keyof LicensePolicy, label: "Created At" },
    { field: "updatedAt" as keyof LicensePolicy, label: "Updated" },
    { field: "deletedAt" as keyof LicensePolicy, label: "Deleted At" },
  ];

  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    exportColumns.map((c) => c.field)
  );

  const tableColumns = [
    { field: "label", label: "Label", default: true },
    { field: "description", label: "Description", default: true },
    { field: "policyType", label: "Policy Type", default: true },
    { field: "status", label: "Status", default: true },
    { field: "createdAt", label: "Created At", default: true },
    { field: "updatedAt", label: "Updated", default: true },
    { field: "deletedAt", label: "Deleted At", default: false },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.filter((c) => c.default).map((c) => c.field)
  );

  const filteredData = useMemo(() => {
    let data = policies;
    if (statusFilter !== "ALL") {
      data = data.filter((p) => p.status === statusFilter);
    }
    if (globalFilter.trim()) {
      const lower = globalFilter.toLowerCase();
      data = data.filter((p) =>
        Object.values(p).some((val) =>
          String(val).toLowerCase().includes(lower)
        )
      );
    }
    return data;
  }, [policies, globalFilter, statusFilter]);

  // Pick up newly created policies from the Add page
  useEffect(() => {
    const stored = sessionStorage.getItem("newLicensePolicy");
    if (stored) {
      try {
        const newItems: LicensePolicy[] = JSON.parse(stored);
        if (newItems.length > 0) {
          setPolicies((prev) => [...prev, ...newItems]);
          toast.current?.show({ severity: "success", summary: "Created", detail: `${newItems.length} new policy(ies) added`, life: 3000 });
        }
      } catch { /* ignore */ }
      sessionStorage.removeItem("newLicensePolicy");
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusFilterRef.current && !statusFilterRef.current.contains(e.target as Node)) setStatusFilterOpen(false);
      if (columnsDropdownRef.current && !columnsDropdownRef.current.contains(e.target as Node)) setColumnsDropdownOpen(false);
      if (tableBackendLangRef.current && !tableBackendLangRef.current.contains(e.target as Node)) setTableBackendLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getActionMenuItems = () => [
    {
      template: (_item: any, options: any) => (
        <button
          onClick={(e) => options.onClick(e)}
          className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span className="text-[12px] text-[#334155]">View Details</span>
        </button>
      ),
      command: () => {
        if (activeRowRef.current) navigate(`/dashboard/license-policy/${activeRowRef.current.id}`);
      },
    },
    {
      template: (_item: any, options: any) => (
        <button
          onClick={(e) => options.onClick(e)}
          className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5 text-[#22c55e]" />
          <span className="text-[12px] text-[#334155]">Edit</span>
        </button>
      ),
      command: () => {
        if (activeRowRef.current) openEdit(activeRowRef.current);
      },
    },
    {
      template: (_item: any, options: any) => (
        <button
          onClick={(e) => options.onClick(e)}
          className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[#fef2f2] transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-[#e53935]" />
          <span className="text-[12px] text-[#e53935]">Delete</span>
        </button>
      ),
      command: () => {
        if (activeRowRef.current) confirmDelete(activeRowRef.current);
      },
    },
  ];

  const openNew = () => {
    setFormData({ ...emptyPolicy, id: Date.now(), createdAt: new Date().toISOString().split("T")[0], updatedAt: new Date().toISOString().split("T")[0], deletedAt: null });
    setEditMode(false);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openEdit = (item: LicensePolicy) => {
    setFormData({ ...item });
    setEditMode(true);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openDetail = (item: LicensePolicy) => {
    setDetailItem(item);
    setDetailDialogVisible(true);
  };

  const saveItem = () => {
    setSubmitted(true);
    if (!formData.label.trim()) return;

    const updated = { ...formData, updatedAt: new Date().toISOString().split("T")[0] };

    if (editMode) {
      setPolicies((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.current?.show({ severity: "success", summary: "Updated", detail: `${updated.label} has been updated`, life: 3000 });
    } else {
      setPolicies((prev) => [...prev, updated]);
      toast.current?.show({ severity: "success", summary: "Created", detail: `${updated.label} has been created`, life: 3000 });
    }

    setDialogVisible(false);
    setFormData(emptyPolicy);
  };

  const confirmDelete = (item: LicensePolicy) => {
    confirmDialog({
      message: `Are you sure you want to delete "${item.label}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setPolicies((prev) => prev.filter((p) => p.id !== item.id));
        toast.current?.show({ severity: "warn", summary: "Deleted", detail: `${item.label} has been removed`, life: 3000 });
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
        setPolicies((prev) => prev.filter((p) => !ids.has(p.id)));
        setSelectedItems([]);
        toast.current?.show({ severity: "warn", summary: "Deleted", detail: `${ids.size} items removed`, life: 3000 });
      },
    });
  };

  // Copy helper
  const copyToClipboard = (text: string) => {
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
  };

  // Export functions
  const doExport = (fmt: "csv" | "excel" | "pdf") => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) {
      toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column", life: 3000 });
      return;
    }
    const headers = cols.map((c) => c.label);
    const dataToExport = filteredData;

    if (fmt === "csv") {
      const escapeCSV = (val: string) => val.includes(",") || val.includes('"') || val.includes("\n") ? `"${val.replace(/"/g, '""')}"` : val;
      const rows = dataToExport.map((p) => cols.map((c) => escapeCSV(String(p[c.field] ?? "—"))));
      const csv = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "license_policies.csv";
      a.click();
      URL.revokeObjectURL(url);
    } else if (fmt === "excel") {
      const worksheetData = [headers, ...dataToExport.map((p) => cols.map((c) => String(p[c.field] ?? "—")))];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "License Policies");
      XLSX.writeFile(workbook, "license_policies.xlsx");
    } else {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [headers],
        body: dataToExport.map((p) => cols.map((c) => String(p[c.field] ?? "—"))),
        startY: 20,
        headStyles: { fillColor: [240, 249, 255], textColor: [59, 130, 246], fontSize: 10 },
        bodyStyles: { fontSize: 10 },
      });
      doc.save("license_policies.pdf");
    }
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${dataToExport.length} row(s) exported as ${fmt.toUpperCase()}`, life: 3000 });
  };

  // ── Templates ──
  const policyTypeBodyTemplate = (rowData: LicensePolicy) => {
    const style = policyTypeStyles[rowData.policyType] ?? { text: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" };
    const label = policyTypeOptions.find((o) => o.value === rowData.policyType)?.label ?? rowData.policyType ?? "Unknown";
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
        style={{ color: style.text, backgroundColor: style.bg }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
        {label}
      </span>
    );
  };

  const statusBodyTemplate = (rowData: LicensePolicy) => {
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const labelBodyTemplate = (rowData: LicensePolicy) => (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-[#fef2f2] flex items-center justify-center flex-shrink-0">
        <ScrollText className="w-3.5 h-3.5 text-[#e53935]" />
      </div>
      <span className="text-[12px] text-[#0f172a] font-semibold">{rowData.label}</span>
    </div>
  );

  const descriptionBodyTemplate = (rowData: LicensePolicy) => (
    <span className="text-[12px] text-[#64748b] line-clamp-1 max-w-[300px]" title={rowData.description}>
      {rowData.description}
    </span>
  );

  const dateBodyTemplate = (field: "createdAt" | "updatedAt" | "deletedAt") => (rowData: LicensePolicy) => (
    <span className="text-[12px] text-[#64748b]">{formatDate(rowData[field])}</span>
  );

  const actionBodyTemplate = (rowData: LicensePolicy) => (
    <div className="flex justify-center gap-1.5">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#eef2ff] transition-colors cursor-pointer text-[#6366f1] hover:bg-[#e0e7ff]"
        title="View Details"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/license-policy/${rowData.id}`);
        }}
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
      
    </div>
  );

  // ── Toolbars ──
  const leftToolbarTemplate = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate("/dashboard/license-policy/add")}
        className="flex items-center gap-1.5 bg-[#e53935] hover:bg-[#c62828] text-white px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        New
      </button>
    </div>
  );

  const rightToolbarTemplate = () => (
    <div className="flex items-center gap-2">
      {/* Status Filter */}
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
              { key: "ALL" as const, label: "All Statuses", count: policies.length },
              { key: "ACTIVE" as const, label: "Active", count: policies.filter((p) => p.status === "ACTIVE").length },
              { key: "INACTIVE" as const, label: "Inactive", count: policies.filter((p) => p.status === "INACTIVE").length },
            ]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => { setStatusFilter(opt.key); setStatusFilterOpen(false); }}
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
                  statusFilter === opt.key ? "bg-[#e53935] text-white" : "bg-[#f1f5f9] text-[#94a3b8]"
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
      {/* Columns Dropdown */}
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
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${columnsDropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {columnsDropdownOpen && (
          <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#e2e8f0] rounded-[10px] shadow-lg z-50 min-w-[200px] py-1.5 overflow-hidden">
            <div className="px-3.5 py-2 border-b border-[#f1f5f9]">
              <span className="text-[11px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">Toggle columns</span>
            </div>
            {tableColumns.map((col) => {
              const isVisible = visibleColumns.includes(col.field);
              return (
                <button
                  key={col.field}
                  onClick={() => {
                    setVisibleColumns((prev) =>
                      prev.includes(col.field) ? prev.filter((f) => f !== col.field) : [...prev, col.field]
                    );
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-[12px] transition-colors cursor-pointer ${
                    isVisible ? "text-[#0f172a] hover:bg-[#f8fafc]" : "text-[#94a3b8] hover:bg-[#f8fafc]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isVisible ? <Eye className="w-3.5 h-3.5 text-[#6366f1]" /> : <EyeOff className="w-3.5 h-3.5 text-[#cbd5e1]" />}
                    <span className={isVisible ? "font-medium" : ""}>{col.label}</span>
                  </div>
                  <div className={`w-7 h-4 rounded-full transition-colors relative ${isVisible ? "bg-[#6366f1]" : "bg-[#e2e8f0]"}`}>
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${isVisible ? "left-3.5" : "left-0.5"}`} />
                  </div>
                </button>
              );
            })}
            <div className="px-3.5 py-2 border-t border-[#f1f5f9] flex items-center justify-between">
              <button onClick={() => setVisibleColumns(tableColumns.map((c) => c.field))} className="text-[11px] text-[#6366f1] hover:text-[#4338ca] font-medium px-2 py-1 rounded hover:bg-[#eef2ff] transition-colors cursor-pointer">Show All</button>
              <button onClick={() => setColumnsDropdownOpen(false)} className="text-[11px] text-[#64748b] hover:text-[#334155] font-medium px-2 py-1 rounded hover:bg-[#f8fafc] transition-colors cursor-pointer">Done</button>
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
        <h2 className="text-[15px] text-[#0f172a] font-semibold m-0">License Policies</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search policies..."
            className="!text-[13px] !py-2.5 !pl-10 !pr-4 !rounded-[10px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none !bg-[#f8fafc] !w-[280px]"
          />
          {globalFilter && (
            <button onClick={() => setGlobalFilter("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] cursor-pointer">
              <span className="text-[14px]">&times;</span>
            </button>
          )}
        </div>
        <button
          className="flex items-center justify-center w-9 h-9 border border-[#e2e8f0] rounded-[8px] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors cursor-pointer"
          title="Refresh"
          onClick={() => {
            setPolicies([...licensePolicyMockData]);
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
      <button onClick={() => setDialogVisible(false)} className="px-4 py-2 border border-[#e2e8f0] text-[#475569] rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] transition-colors cursor-pointer">Cancel</button>
      <button onClick={saveItem} className="px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer">{editMode ? "Update" : "Create"}</button>
    </div>
  );

  // Framework SVG pill tab config (matching Driver License Type pattern)
  const fwConfig: Record<string, { label: string; icon: React.ReactNode }> = {
    react: { label: "PrimeReact", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="3" fill="#61DAFB"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)"/></svg> },
    vue: { label: "PrimeVue", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M2 4h5.6L16 18.4 24.4 4H30L16 28 2 4z" fill="#41B883"/><path d="M6.8 4H12l4 7.2L20 4h5.2L16 20 6.8 4z" fill="#34495E"/></svg> },
    angular: { label: "PrimeAngular", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M16 2L3 7l2 18L16 30l11-5 2-18L16 2z" fill="#DD0031"/><path d="M16 2v28l11-5 2-18L16 2z" fill="#C3002F"/><path d="M16 5.7L8.8 22h2.7l1.4-3.6h6.2L20.5 22h2.7L16 5.7zm2.2 10.7h-4.4L16 11l2.2 5.4z" fill="#fff"/></svg> },
  };

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
            <ScrollText className="w-4 h-4 text-[#e53935]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">
              License Policy Management
            </h1>
            <p className="text-[12px] text-[#94a3b8]">
              Master Data Setup &rsaquo; License Policy &rsaquo; List
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Policies", value: policies.length, color: "#e53935" },
          { label: "Active", value: policies.filter((p) => p.status === "ACTIVE").length, color: "#22c55e" },
          { label: "Inactive", value: policies.filter((p) => p.status === "INACTIVE").length, color: "#94a3b8" },
        ].map((stat) => (
          null
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[12px] border border-[#e2e8f0] overflow-hidden">
        <Toolbar
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
          className="!border-b !border-[#e2e8f0] !bg-[#fafbfc] !rounded-none !px-4 !py-2.5"
        />

        <DataTable
          value={filteredData}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[10, 50, 100]}
          header={header}
          emptyMessage="No license policies found."
          stripedRows
          removableSort
          scrollable
          rowHover
          size="small"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          className="[&_.p-datatable-header]:!bg-white [&_.p-datatable-header]:!border-b [&_.p-datatable-header]:!border-[#e2e8f0] [&_.p-datatable-header]:!px-4 [&_.p-datatable-header]:!py-3 [&_.p-datatable-thead>tr>th]:!bg-[#f8fafc] [&_.p-datatable-thead>tr>th]:!text-[#64748b] [&_.p-datatable-thead>tr>th]:!text-[11px] [&_.p-datatable-thead>tr>th]:!font-semibold [&_.p-datatable-thead>tr>th]:!uppercase [&_.p-datatable-thead>tr>th]:!tracking-[0.5px] [&_.p-datatable-thead>tr>th]:!border-[#e2e8f0] [&_.p-datatable-tbody>tr>td]:!border-[#f1f5f9] [&_.p-datatable-tbody>tr>td]:!py-3 [&_.p-datatable-tbody>tr>td]:!text-[12px] [&_.p-paginator]:!text-[11px] [&_.p-paginator]:!py-2.5 [&_.p-paginator]:!px-4 [&_.p-paginator]:!border-t [&_.p-paginator]:!border-[#e2e8f0] [&_.p-paginator_.p-dropdown]:!border-[#cbd5e1] [&_.p-paginator_.p-dropdown]:!rounded-lg [&_.p-paginator_.p-dropdown]:!min-w-[72px] [&_.p-paginator_.p-dropdown]:!h-8 [&_.p-paginator_.p-dropdown]:!shadow-sm [&_.p-paginator_.p-dropdown_.p-dropdown-label]:!text-[11px] [&_.p-paginator_.p-dropdown_.p-dropdown-label]:!py-1 [&_.p-paginator_.p-dropdown_.p-dropdown-label]:!px-2.5 [&_.p-paginator_.p-dropdown_.p-dropdown-label]:!text-[#334155] [&_.p-paginator_.p-dropdown_.p-dropdown-trigger]:!w-7 [&_.p-paginator_.p-dropdown:hover]:!border-[#94a3b8] [&_.p-paginator_.p-dropdown:focus-within]:!border-[#6366f1] [&_.p-paginator_.p-dropdown:focus-within]:!ring-2 [&_.p-paginator_.p-dropdown:focus-within]:!ring-[#6366f1]/20 [&_.p-paginator_.p-paginator-current]:!text-[#64748b] [&_.p-paginator_.p-paginator-current]:!mx-2"
        >
          {visibleColumns.includes("label") && (
            <Column field="label" header="Label" sortable style={{ minWidth: "220px" }} />
          )}
          {visibleColumns.includes("description") && (
            <Column field="description" header="Description" sortable body={descriptionBodyTemplate} style={{ minWidth: "280px" }} />
          )}
          {visibleColumns.includes("policyType") && (
            <Column field="policyType" header="Policy Type" sortable body={policyTypeBodyTemplate} style={{ minWidth: "140px" }} />
          )}
          {visibleColumns.includes("status") && (
            <Column field="status" header="Status" sortable body={statusBodyTemplate} style={{ minWidth: "110px" }} />
          )}
          {visibleColumns.includes("createdAt") && (
            <Column field="createdAt" header="Created At" sortable body={dateBodyTemplate("createdAt")} style={{ minWidth: "130px" }} />
          )}
          {visibleColumns.includes("updatedAt") && (
            <Column field="updatedAt" header="Updated" sortable body={dateBodyTemplate("updatedAt")} style={{ minWidth: "130px" }} />
          )}
          {visibleColumns.includes("deletedAt") && (
            <Column field="deletedAt" header="Deleted At" sortable body={dateBodyTemplate("deletedAt")} style={{ minWidth: "130px" }} />
          )}
          <Column body={actionBodyTemplate} headerStyle={{ width: "4rem" }} bodyStyle={{ textAlign: "center" }} />
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
                <p className="text-[10px] text-[#94a3b8]">License Policy &mdash; Search, Filter, Export, Pagination</p>
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
                  tableCodeCategory === cat.key ? "text-[#0f172a] font-semibold" : "text-[#94a3b8] hover:text-[#64748b]"
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

          {/* Sub-tabs & Copy */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
            <div className="flex items-center gap-1">
              {tableCodeCategory === "frontend" ? (
                <div className="flex items-center gap-1 bg-[#f1f5f9] rounded-lg p-0.5">
                  {(["react", "vue", "angular"] as const).map((fw) => {
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
                                tableBackendLang === lang ? "bg-[#fef3c7] text-[#92400e] font-medium" : "text-[#475569] hover:bg-[#f8fafc]"
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
                  const codeMap: Record<string, string> = { react: policyReactTableCode, vue: policyVueTableCode, angular: policyAngularTableCode };
                  text = codeMap[tableCodeFramework];
                } else {
                  text = getTableBackendCode(tableBackendLang, licensePolicyBackendCode);
                }
                copyToClipboard(text);
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
                  ? (tableCodeFramework === "react" ? "LicensePolicyTable.tsx" : tableCodeFramework === "vue" ? "LicensePolicyTable.vue" : "license-policy-table.component.ts")
                  : licensePolicyBackendFileConfig[tableBackendLang] || backendLangConfig[tableBackendLang].file}
              </span>
            </div>
            <Highlight
              theme={tableCodeCategory === "frontend" ? themes.nightOwl : themes.vsDark}
              code={
                tableCodeCategory === "frontend"
                  ? (tableCodeFramework === "react" ? policyReactTableCode : tableCodeFramework === "vue" ? policyVueTableCode : policyAngularTableCode)
                  : getTableBackendCode(tableBackendLang, licensePolicyBackendCode)
              }
              language={
                tableCodeCategory === "frontend"
                  ? (tableCodeFramework === "angular" ? "typescript" : tableCodeFramework === "vue" ? "markup" : "tsx")
                  : "typescript"
              }
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

      {/* Create / Edit Dialog */}
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editMode ? "Edit License Policy" : "New License Policy"}
        footer={dialogFooter}
        modal
        style={{ width: "520px" }}
        className="p-fluid"
        draggable={false}
      >
        <div className="flex flex-col gap-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#475569] font-medium">Label *</label>
              <InputText
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className={`!text-[13px] ${submitted && !formData.label.trim() ? "p-invalid" : ""}`}
                placeholder="e.g. ယာဉ်မောင်းလိုင်စင် Policy အရေးကြီးချက်များ"
              />
              {submitted && !formData.label.trim() && (
                <small className="text-[#e53935] text-[11px]">Label is required</small>
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
            <label className="text-[12px] text-[#475569] font-medium">Policy Type *</label>
            <Dropdown
              value={formData.policyType}
              onChange={(e) => setFormData({ ...formData, policyType: e.value })}
              options={policyTypeOptions}
              className="!text-[13px]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#475569] font-medium">Description</label>
            <InputTextarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="!text-[13px]"
              placeholder="Describe this license policy..."
            />
          </div>
        </div>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        visible={detailDialogVisible}
        onHide={() => setDetailDialogVisible(false)}
        header="License Policy Details"
        modal
        style={{ width: "520px" }}
        draggable={false}
      >
        {detailItem && (
          <div className="flex flex-col gap-4 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag
                  value={detailItem.status}
                  severity={detailItem.status === "ACTIVE" ? "success" : "danger"}
                  rounded
                />
                {policyTypeBodyTemplate(detailItem)}
              </div>
            </div>
            <div>
              <h3 className="text-[16px] text-[#0f172a] font-semibold">{detailItem.label}</h3>
              <p className="text-[13px] text-[#64748b] mt-1">{detailItem.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-[#f8fafc] rounded-lg p-4">
              {[
                { label: "Created", value: formatDate(detailItem.createdAt) },
                { label: "Last Updated", value: formatDate(detailItem.updatedAt) },
                { label: "Deleted At", value: detailItem.deletedAt ? formatDate(detailItem.deletedAt) : "—" },
                { label: "Policy Type", value: policyTypeOptions.find((o) => o.value === detailItem.policyType)?.label ?? detailItem.policyType },
                { label: "Status", value: detailItem.status },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">{field.label}</p>
                  <p className="text-[13px] text-[#0f172a] font-medium mt-0.5">{field.value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setDetailDialogVisible(false); openEdit(detailItem); }}
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
                    exportFormat === fmt.key ? "border-current bg-opacity-5" : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
                  style={exportFormat === fmt.key ? { borderColor: fmt.color, backgroundColor: `${fmt.color}08` } : undefined}
                >
                  <span style={{ color: fmt.color }}>{fmt.icon}</span>
                  <span className="text-[12px] font-medium text-[#0f172a]">{fmt.label}</span>
                  <span className="text-[10px] text-[#94a3b8]">{fmt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Column selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] text-[#475569] font-medium">Columns to export</p>
              <button
                onClick={() =>
                  setSelectedExportColumns((prev) =>
                    prev.length === exportColumns.length ? [] : exportColumns.map((c) => c.field)
                  )
                }
                className="text-[11px] text-[#6366f1] hover:text-[#4338ca] font-medium cursor-pointer"
              >
                {selectedExportColumns.length === exportColumns.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {exportColumns.map((col) => (
                <label
                  key={col.field}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors cursor-pointer"
                >
                  <Checkbox
                    checked={selectedExportColumns.includes(col.field)}
                    onChange={() =>
                      setSelectedExportColumns((prev) =>
                        prev.includes(col.field) ? prev.filter((f) => f !== col.field) : [...prev, col.field]
                      )
                    }
                    className="[&_.p-checkbox-box]:!w-4 [&_.p-checkbox-box]:!h-4 [&_.p-checkbox-box]:!rounded-[4px]"
                  />
                  <span className="text-[12px] text-[#334155]">{col.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export button */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setExportDialogVisible(false)}
              className="px-4 py-2 border border-[#e2e8f0] text-[#475569] rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => doExport(exportFormat)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

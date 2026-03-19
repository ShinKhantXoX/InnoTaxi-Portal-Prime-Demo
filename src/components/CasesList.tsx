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
import { Menu } from "primereact/menu";
import { Checkbox } from "primereact/checkbox";
import { Briefcase, Plus, Pencil, Trash2, Download, RefreshCw, Search, EllipsisVertical, Check, X, ChevronDown, Columns3, Eye, EyeOff, Code2, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const GOOGLE_SHEET_ID = "1lWGqBKxLaBbSaMPB0CH21I76BzJKxxtNBszoe3adPfM";
const GOOGLE_SHEET_CSV_URL =
  `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;
const GOOGLE_SHEET_VIEW_URL =
  `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit?gid=0#gid=0`;

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];
  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (inQuotes) {
      if (ch === '"' && csv[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(current.trim());
        current = "";
      } else if (ch === "\n" || (ch === "\r" && csv[i + 1] === "\n")) {
        row.push(current.trim());
        current = "";
        if (row.some((c) => c !== "")) rows.push(row);
        row = [];
        if (ch === "\r") i++;
      } else {
        current += ch;
      }
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.some((c) => c !== "")) rows.push(row);
  }
  return rows;
}

function mapSheetRowToCaseItem(headers: string[], row: string[], index: number): CaseItem {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const get = (key: string) => {
    const nk = normalize(key);
    const idx = headers.findIndex((h) => normalize(h) === nk);
    return idx >= 0 && idx < row.length ? row[idx] || "" : "";
  };
  return {
    id: parseInt(get("id") || get("no")) || index + 1,
    casecode: get("casecode") || get("case_code") || get("code") || `CAS-${String(index + 1).padStart(3, "0")}`,
    title: get("title") || get("name") || "",
    description: get("description") || get("desc") || "",
    resolution: get("resolution") || "",
    category: (get("category") || get("cat") || "REQUEST").toUpperCase(),
    applicationFor: (get("applicationfor") || get("application_for") || get("applicationFor") || get("appfor") || "BOTH").toUpperCase(),
    status: ((get("status") || "ACTIVE").toUpperCase()) as "ACTIVE" | "INACTIVE",
    createdAt: get("createdat") || get("created_at") || new Date().toISOString().split("T")[0],
    updatedAt: get("updatedat") || get("updated_at") || new Date().toISOString().split("T")[0],
    deletedAt: null,
  };
}

async function fetchGoogleSheetData(): Promise<CaseItem[]> {
  const res = await fetch(GOOGLE_SHEET_CSV_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const csv = await res.text();
  const parsed = parseCSV(csv);
  if (parsed.length < 2) throw new Error("Empty sheet");
  const headers = parsed[0];
  return parsed.slice(1).map((row, i) => mapSheetRowToCaseItem(headers, row, i));
}

export interface CaseItem {
  id: number;
  casecode: string;
  title: string;
  description: string;
  resolution: string;
  category: string;
  applicationFor: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const emptyCaseItem: CaseItem = {
  id: 0,
  casecode: "",
  title: "",
  description: "",
  resolution: "",
  category: "",
  applicationFor: "",
  status: "ACTIVE",
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
};

export const casesMockData: CaseItem[] = [
  { id: 1, casecode: "CAS-001", title: "Accident Report", description: "Traffic accident report and damage assessment for drivers", resolution: "Investigate and file insurance claim within 48 hours", category: "INCIDENT", applicationFor: "DRIVER", status: "ACTIVE", createdAt: "2024-01-10T09:15:00Z", updatedAt: "2026-01-15T14:30:00Z", deletedAt: null },
  { id: 2, casecode: "CAS-002", title: "Fare Dispute", description: "Customer complaint regarding incorrect fare calculation", resolution: "Review trip route and recalculate fare based on GPS data", category: "COMPLAINT", applicationFor: "CUSTOMER", status: "ACTIVE", createdAt: "2024-02-05T11:22:00Z", updatedAt: "2026-02-08T16:45:00Z", deletedAt: null },
  { id: 3, casecode: "CAS-003", title: "Vehicle Breakdown", description: "Driver vehicle breakdown during active trip requiring tow service", resolution: "Dispatch replacement vehicle and arrange towing service", category: "INCIDENT", applicationFor: "DRIVER", status: "ACTIVE", createdAt: "2024-02-20T08:05:00Z", updatedAt: "2026-01-22T10:12:00Z", deletedAt: null },
  { id: 4, casecode: "CAS-004", title: "Lost Item", description: "Passenger left personal belongings in vehicle after trip completion", resolution: "Contact driver to retrieve item and coordinate return", category: "REQUEST", applicationFor: "CUSTOMER", status: "ACTIVE", createdAt: "2024-03-12T13:40:00Z", updatedAt: "2026-02-14T09:55:00Z", deletedAt: null },
  { id: 5, casecode: "CAS-005", title: "Driver Misconduct", description: "Report of unprofessional driver behavior during ride", resolution: "Issue warning and schedule mandatory retraining session", category: "COMPLAINT", applicationFor: "BOTH", status: "ACTIVE", createdAt: "2024-03-25T15:18:00Z", updatedAt: "2026-01-30T11:33:00Z", deletedAt: null },
  { id: 6, casecode: "CAS-006", title: "Insurance Claim", description: "Insurance claim processing for vehicle damage or injury", resolution: "Submit documentation to insurance provider for processing", category: "CLAIM", applicationFor: "DRIVER", status: "INACTIVE", createdAt: "2024-04-08T10:50:00Z", updatedAt: "2026-02-05T17:20:00Z", deletedAt: "2026-02-28T08:00:00Z" },
  { id: 7, casecode: "CAS-007", title: "Route Deviation", description: "Driver took longer route resulting in higher fare charged", resolution: "Adjust fare to match optimal route distance calculation", category: "COMPLAINT", applicationFor: "CUSTOMER", status: "ACTIVE", createdAt: "2024-05-15T07:30:00Z", updatedAt: "2026-02-18T13:10:00Z", deletedAt: null },
  { id: 8, casecode: "CAS-008", title: "Payment Failure", description: "Digital payment processing failure requiring manual resolution", resolution: "Retry payment or issue credit to customer wallet balance", category: "REQUEST", applicationFor: "BOTH", status: "ACTIVE", createdAt: "2024-06-02T16:05:00Z", updatedAt: "2026-03-01T12:48:00Z", deletedAt: null },
  { id: 9, casecode: "CAS-009", title: "License Suspension", description: "Driver license suspension due to repeated traffic violations", resolution: "Suspend driver account pending license reinstatement proof", category: "ENFORCEMENT", applicationFor: "DRIVER", status: "ACTIVE", createdAt: "2024-06-20T09:25:00Z", updatedAt: "2026-03-05T15:02:00Z", deletedAt: null },
  { id: 10, casecode: "CAS-010", title: "Refund Request", description: "Customer requesting refund for cancelled or incomplete trip", resolution: "Process full or partial refund based on trip completion", category: "REQUEST", applicationFor: "CUSTOMER", status: "INACTIVE", createdAt: "2024-07-10T14:35:00Z", updatedAt: "2026-03-10T10:15:00Z", deletedAt: "2026-03-12T09:00:00Z" },
];

const categoryOptions = [
  { label: "Incident", value: "INCIDENT" },
  { label: "Complaint", value: "COMPLAINT" },
  { label: "Request", value: "REQUEST" },
  { label: "Claim", value: "CLAIM" },
  { label: "Enforcement", value: "ENFORCEMENT" },
];

const applicationForOptions = [
  { label: "Driver", value: "DRIVER" },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Both", value: "BOTH" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

// ── Table Code Strings ──
export const casesReactTableCode = `import { useState, useRef, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';

const cases = [
  { id: 1, casecode: 'CAS-001', title: 'Accident Report', description: 'Traffic accident report and damage assessment', resolution: 'Investigate and file insurance claim', category: 'INCIDENT', applicationFor: 'DRIVER', status: 'ACTIVE' },
  { id: 2, casecode: 'CAS-002', title: 'Fare Dispute', description: 'Customer complaint regarding incorrect fare', resolution: 'Review trip route and recalculate fare', category: 'COMPLAINT', applicationFor: 'CUSTOMER', status: 'ACTIVE' },
  { id: 3, casecode: 'CAS-003', title: 'Vehicle Breakdown', description: 'Driver vehicle breakdown during active trip', resolution: 'Dispatch replacement vehicle', category: 'INCIDENT', applicationFor: 'DRIVER', status: 'ACTIVE' },
  { id: 4, casecode: 'CAS-004', title: 'Lost Item', description: 'Passenger left personal belongings in vehicle', resolution: 'Contact driver to retrieve item', category: 'REQUEST', applicationFor: 'CUSTOMER', status: 'ACTIVE' },
  { id: 5, casecode: 'CAS-005', title: 'Driver Misconduct', description: 'Report of unprofessional driver behavior', resolution: 'Issue warning and schedule retraining', category: 'COMPLAINT', applicationFor: 'BOTH', status: 'ACTIVE' },
  { id: 6, casecode: 'CAS-006', title: 'Insurance Claim', description: 'Insurance claim for vehicle damage', resolution: 'Submit documentation to insurance', category: 'CLAIM', applicationFor: 'DRIVER', status: 'INACTIVE' },
];

export default function CasesList() {
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data] = useState(cases);

  const filteredData = useMemo(() => {
    if (!globalFilter.trim()) return data;
    const lower = globalFilter.toLowerCase();
    return data.filter(c =>
      Object.values(c).some(val =>
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [data, globalFilter]);

  const statusTemplate = (rowData) => (
    <span className={\`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full \${
      rowData.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
    }\`}>
      {rowData.status === 'ACTIVE' ? '\\u2713' : '\\u2715'} {rowData.status === 'ACTIVE' ? 'Active' : 'Inactive'}
    </span>
  );

  const categoryTemplate = (rowData) => (
    <span className={\`text-xs font-medium px-2.5 py-1 rounded-full \${
      rowData.category === 'INCIDENT' ? 'bg-red-50 text-red-600' :
      rowData.category === 'COMPLAINT' ? 'bg-amber-50 text-amber-600' :
      rowData.category === 'CLAIM' ? 'bg-purple-50 text-purple-600' :
      rowData.category === 'ENFORCEMENT' ? 'bg-blue-50 text-blue-600' :
      'bg-cyan-50 text-cyan-600'
    }\`}>
      {rowData.category}
    </span>
  );

  const applicationForTemplate = (rowData) => (
    <span className={\`text-xs font-medium px-2.5 py-1 rounded-full \${
      rowData.applicationFor === 'DRIVER' ? 'bg-indigo-50 text-indigo-600' :
      rowData.applicationFor === 'CUSTOMER' ? 'bg-teal-50 text-teal-600' :
      'bg-orange-50 text-orange-600'
    }\`}>
      {rowData.applicationFor}
    </span>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar left={() => <h3>Cases</h3>} />
      <DataTable
        value={filteredData}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[10, 50, 100]}
        globalFilter={globalFilter}
        emptyMessage="No cases found."
        stripedRows
        removableSort
        rowHover
        size="small"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column field="casecode" header="Case Code" sortable />
        <Column field="title" header="Title" sortable />
        <Column field="description" header="Description" sortable />
        <Column field="resolution" header="Resolution" sortable />
        <Column field="category" header="Category" body={categoryTemplate} sortable />
        <Column field="applicationFor" header="Application For" body={applicationForTemplate} sortable />
        <Column field="status" header="Status" body={statusTemplate} sortable />
      </DataTable>
    </div>
  );
}`;

export const casesVueTableCode = `<template>
  <div>
    <Toast ref="toast" />
    <Toolbar>
      <template #start>
        <h3>Cases</h3>
      </template>
    </Toolbar>
    <DataTable
      :value="filteredData"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[10, 50, 100]"
      :globalFilterFields="['casecode', 'title', 'description', 'resolution', 'category', 'applicationFor', 'status']"
      stripedRows
      removableSort
      rowHover
      size="small"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
    >
      <Column field="casecode" header="Case Code" sortable />
      <Column field="title" header="Title" sortable />
      <Column field="description" header="Description" sortable />
      <Column field="resolution" header="Resolution" sortable />
      <Column field="category" header="Category" sortable>
        <template #body="{ data }">
          <Tag :value="data.category"
            :severity="data.category === 'INCIDENT' ? 'danger' : data.category === 'COMPLAINT' ? 'warning' : 'info'"
            rounded />
        </template>
      </Column>
      <Column field="applicationFor" header="Application For" sortable>
        <template #body="{ data }">
          <Tag :value="data.applicationFor"
            :severity="data.applicationFor === 'DRIVER' ? 'info' : data.applicationFor === 'CUSTOMER' ? 'success' : 'warning'"
            rounded />
        </template>
      </Column>
      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag :value="data.status === 'ACTIVE' ? 'Active' : 'Inactive'"
            :severity="data.status === 'ACTIVE' ? 'success' : 'danger'"
            rounded />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';

const cases = ref([
  { id: 1, casecode: 'CAS-001', title: 'Accident Report', description: 'Traffic accident report', resolution: 'Investigate and file claim', category: 'INCIDENT', applicationFor: 'DRIVER', status: 'ACTIVE' },
  { id: 2, casecode: 'CAS-002', title: 'Fare Dispute', description: 'Incorrect fare complaint', resolution: 'Review and recalculate', category: 'COMPLAINT', applicationFor: 'CUSTOMER', status: 'ACTIVE' },
  { id: 3, casecode: 'CAS-003', title: 'Vehicle Breakdown', description: 'Vehicle breakdown during trip', resolution: 'Dispatch replacement', category: 'INCIDENT', applicationFor: 'DRIVER', status: 'ACTIVE' },
  { id: 4, casecode: 'CAS-004', title: 'Lost Item', description: 'Belongings left in vehicle', resolution: 'Contact driver', category: 'REQUEST', applicationFor: 'CUSTOMER', status: 'ACTIVE' },
]);

const globalFilter = ref('');

const filteredData = computed(() => {
  if (!globalFilter.value.trim()) return cases.value;
  const lower = globalFilter.value.toLowerCase();
  return cases.value.filter(c =>
    Object.values(c).some(val =>
      String(val).toLowerCase().includes(lower)
    )
  );
});
</script>`;

export const casesAngularTableCode = `import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface CaseItem {
  id: number;
  casecode: string;
  title: string;
  description: string;
  resolution: string;
  category: string;
  applicationFor: string;
  status: string;
}

@Component({
  selector: 'app-cases-list',
  standalone: true,
  imports: [TableModule, TagModule, ToolbarModule, ToastModule],
  providers: [MessageService],
  template: \`
    <p-toast />
    <p-toolbar>
      <ng-template pTemplate="left">
        <h3>Cases</h3>
      </ng-template>
    </p-toolbar>
    <p-table
      [value]="filteredData"
      dataKey="id"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 50, 100]"
      [globalFilterFields]="['casecode','title','description','resolution','category','applicationFor','status']"
      stripedRows
      [rowHover]="true"
      size="small"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
    >
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="casecode">Case Code <p-sortIcon field="casecode" /></th>
          <th pSortableColumn="title">Title <p-sortIcon field="title" /></th>
          <th pSortableColumn="description">Description <p-sortIcon field="description" /></th>
          <th pSortableColumn="resolution">Resolution <p-sortIcon field="resolution" /></th>
          <th pSortableColumn="category">Category <p-sortIcon field="category" /></th>
          <th pSortableColumn="applicationFor">Application For <p-sortIcon field="applicationFor" /></th>
          <th pSortableColumn="status">Status <p-sortIcon field="status" /></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-c>
        <tr>
          <td>{{ c.casecode }}</td>
          <td>{{ c.title }}</td>
          <td>{{ c.description }}</td>
          <td>{{ c.resolution }}</td>
          <td><p-tag [value]="c.category" [severity]="c.category === 'INCIDENT' ? 'danger' : c.category === 'COMPLAINT' ? 'warning' : 'info'" [rounded]="true" /></td>
          <td><p-tag [value]="c.applicationFor" [severity]="c.applicationFor === 'DRIVER' ? 'info' : c.applicationFor === 'CUSTOMER' ? 'success' : 'warning'" [rounded]="true" /></td>
          <td><p-tag [value]="c.status === 'ACTIVE' ? 'Active' : 'Inactive'" [severity]="c.status === 'ACTIVE' ? 'success' : 'danger'" [rounded]="true" /></td>
        </tr>
      </ng-template>
    </p-table>
  \`
})
export class CasesListComponent implements OnInit {
  cases: CaseItem[] = [
    { id: 1, casecode: 'CAS-001', title: 'Accident Report', description: 'Traffic accident report', resolution: 'Investigate and file claim', category: 'INCIDENT', applicationFor: 'DRIVER', status: 'ACTIVE' },
    { id: 2, casecode: 'CAS-002', title: 'Fare Dispute', description: 'Incorrect fare complaint', resolution: 'Review and recalculate', category: 'COMPLAINT', applicationFor: 'CUSTOMER', status: 'ACTIVE' },
    { id: 3, casecode: 'CAS-003', title: 'Vehicle Breakdown', description: 'Vehicle breakdown during trip', resolution: 'Dispatch replacement', category: 'INCIDENT', applicationFor: 'DRIVER', status: 'ACTIVE' },
    { id: 4, casecode: 'CAS-004', title: 'Lost Item', description: 'Belongings left in vehicle', resolution: 'Contact driver', category: 'REQUEST', applicationFor: 'CUSTOMER', status: 'ACTIVE' },
  ];
  globalFilter = '';
  filteredData: CaseItem[] = [];

  ngOnInit() {
    this.filteredData = [...this.cases];
  }
}`;

export const casesBackendCode = `// cases.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto, UpdateCaseDto } from './cases.dto';

@Controller('api/v1/cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('applicationFor') applicationFor?: string,
    @Query('sortBy') sortBy = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.casesService.findAll({
      page, limit, search, status, category, applicationFor, sortBy, sortOrder,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.casesService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateCaseDto) {
    return this.casesService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateCaseDto) {
    return this.casesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.casesService.remove(id);
  }
}

// cases.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Case } from './entities/case.entity';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private repo: Repository<Case>,
  ) {}

  async findAll(params: {
    page: number; limit: number; search?: string;
    status?: string; category?: string; applicationFor?: string;
    sortBy: string; sortOrder: 'ASC' | 'DESC';
  }) {
    const { page, limit, search, status, category, applicationFor, sortBy, sortOrder } = params;
    const where: FindOptionsWhere<Case>[] = [];
    const baseWhere: any = { deletedAt: null };

    if (status) baseWhere.status = status;
    if (category) baseWhere.category = category;
    if (applicationFor) baseWhere.applicationFor = applicationFor;

    if (search) {
      where.push(
        { ...baseWhere, title: Like(\`%\${search}%\`) },
        { ...baseWhere, casecode: Like(\`%\${search}%\`) },
        { ...baseWhere, description: Like(\`%\${search}%\`) },
      );
    } else {
      where.push(baseWhere);
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data,
      meta: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Case not found');
    return { success: true, data: item };
  }

  async create(dto: any) {
    const item = this.repo.create(dto);
    const saved = await this.repo.save(item);
    return { success: true, data: saved };
  }

  async update(id: number, dto: any) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    return { success: true, data: updated };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.update(id, { deletedAt: new Date() });
    return { success: true, message: 'Case soft-deleted' };
  }
}`;

export function CasesList() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [cases, setCases] = useState<CaseItem[]>(casesMockData);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetSource, setSheetSource] = useState<"google" | "mock">("mock");
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<CaseItem>(emptyCaseItem);
  const [submitted, setSubmitted] = useState(false);
  const actionMenuRef = useRef<Menu>(null);
  const activeRowRef = useRef<CaseItem | null>(null);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const columnsDropdownRef = useRef<HTMLDivElement>(null);
  const [tableCodePreviewOpen, setTableCodePreviewOpen] = useState(false);
  const [tableCodeCategory, setTableCodeCategory] = useState<"frontend" | "backend">("frontend");
  const [tableCodeFramework, setTableCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [tableCodeCopied, setTableCodeCopied] = useState(false);

  const exportColumns = [
    { field: "casecode" as keyof CaseItem, label: "Case Code" },
    { field: "title" as keyof CaseItem, label: "Title" },
    { field: "description" as keyof CaseItem, label: "Description" },
    { field: "resolution" as keyof CaseItem, label: "Resolution" },
    { field: "category" as keyof CaseItem, label: "Category" },
    { field: "applicationFor" as keyof CaseItem, label: "Application For" },
    { field: "status" as keyof CaseItem, label: "Status" },
    { field: "createdAt" as keyof CaseItem, label: "Created At" },
    { field: "updatedAt" as keyof CaseItem, label: "Updated At" },
    { field: "deletedAt" as keyof CaseItem, label: "Deleted At" },
  ];

  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    exportColumns.map((c) => c.field)
  );

  const tableColumns = [
    { field: "casecode", label: "Case Code", default: true },
    { field: "title", label: "Title", default: true },
    { field: "description", label: "Description", default: true },
    { field: "resolution", label: "Resolution", default: true },
    { field: "category", label: "Category", default: true },
    { field: "applicationFor", label: "Application For", default: true },
    { field: "status", label: "Status", default: true },
    { field: "createdAt", label: "Created At", default: true },
    { field: "updatedAt", label: "Updated At", default: true },
    { field: "deletedAt", label: "Deleted At", default: false },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.filter((c) => c.default).map((c) => c.field)
  );

  const filteredData = useMemo(() => {
    let data = cases;
    if (globalFilter.trim()) {
      const lower = globalFilter.toLowerCase();
      data = data.filter((c) =>
        Object.values(c).some((val) =>
          String(val).toLowerCase().includes(lower)
        )
      );
    }
    return data;
  }, [cases, globalFilter]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (columnsDropdownRef.current && !columnsDropdownRef.current.contains(e.target as Node)) setColumnsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data from Google Sheet on mount
  const loadFromSheet = () => {
    setSheetLoading(true);
    fetchGoogleSheetData()
      .then((data) => {
        setCases(data);
        setSheetSource("google");
        toast.current?.show({ severity: "success", summary: "Google Sheet Loaded", detail: `${data.length} row(s) fetched from Google Sheets`, life: 3000 });
      })
      .catch(() => {
        setCases([...casesMockData]);
        setSheetSource("mock");
        toast.current?.show({ severity: "warn", summary: "Sheet Unavailable", detail: "Using local mock data (make sure the sheet is published to web)", life: 4000 });
      })
      .finally(() => setSheetLoading(false));
  };

  useEffect(() => {
    loadFromSheet();
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
        if (activeRowRef.current) {
          navigate(`/dashboard/cases/${activeRowRef.current.id}`);
        }
      },
    },
    {
      template: (_item: any, options: any) => (
        <button
          onClick={(e) => options.onClick(e)}
          className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span className="text-[12px] text-[#334155]">Edit</span>
        </button>
      ),
      command: () => {
        if (activeRowRef.current) openEdit(activeRowRef.current);
      },
    },
    { separator: true },
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
    setFormData({ ...emptyCaseItem, id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setEditMode(false);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openEdit = (item: CaseItem) => {
    setFormData({ ...item });
    setEditMode(true);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const saveItem = () => {
    setSubmitted(true);
    if (!formData.casecode.trim() || !formData.title.trim() || !formData.category) return;

    const updated = { ...formData, updatedAt: new Date().toISOString() };

    if (editMode) {
      setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      toast.current?.show({ severity: "success", summary: "Updated", detail: `${updated.title} has been updated`, life: 3000 });
    } else {
      setCases((prev) => [...prev, updated]);
      toast.current?.show({ severity: "success", summary: "Created", detail: `${updated.title} has been created`, life: 3000 });
    }
    setDialogVisible(false);
    setFormData(emptyCaseItem);
  };

  const confirmDelete = (item: CaseItem) => {
    confirmDialog({
      message: `Are you sure you want to delete "${item.title}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setCases((prev) => prev.filter((c) => c.id !== item.id));
        toast.current?.show({ severity: "warn", summary: "Deleted", detail: `${item.title} has been removed`, life: 3000 });
      },
    });
  };

  const exportCSV = () => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) {
      toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column", life: 3000 });
      return;
    }
    const headers = cols.map((c) => c.label);
    const escapeCSV = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) return `"${val.replace(/"/g, '""')}"`;
      return val;
    };
    const rows = filteredData.map((c) => cols.map((col) => escapeCSV(String(c[col.field]))));
    const csv = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cases.csv";
    a.click();
    URL.revokeObjectURL(url);
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  const exportExcel = () => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) {
      toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column", life: 3000 });
      return;
    }
    const headers = cols.map((c) => c.label);
    const worksheetData = [headers, ...filteredData.map((c) => cols.map((col) => String(c[col.field])))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cases");
    XLSX.writeFile(workbook, "cases.xlsx");
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  const exportPDF = () => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) {
      toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column", life: 3000 });
      return;
    }
    const headers = cols.map((c) => c.label);
    const doc = new jsPDF();
    autoTable(doc, {
      head: [headers],
      body: filteredData.map((c) => cols.map((col) => String(c[col.field]))),
      startY: 20,
      headStyles: { fillColor: [240, 249, 255], textColor: [59, 130, 246], fontSize: 10 },
      bodyStyles: { fontSize: 10 },
    });
    doc.save("cases.pdf");
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  const categoryColors: Record<string, { bg: string; text: string }> = {
    INCIDENT: { bg: "#fef2f2", text: "#dc2626" },
    COMPLAINT: { bg: "#fffbeb", text: "#d97706" },
    REQUEST: { bg: "#ecfdf5", text: "#059669" },
    CLAIM: { bg: "#f5f3ff", text: "#7c3aed" },
    ENFORCEMENT: { bg: "#eff6ff", text: "#2563eb" },
  };

  const appForColors: Record<string, { bg: string; text: string }> = {
    DRIVER: { bg: "#eef2ff", text: "#4f46e5" },
    CUSTOMER: { bg: "#f0fdfa", text: "#0d9488" },
    BOTH: { bg: "#fff7ed", text: "#ea580c" },
  };

  const casecodeBodyTemplate = (rowData: CaseItem) => (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
        <Briefcase className="w-3.5 h-3.5 text-[#6366f1]" />
      </div>
      <span className="text-[12px] text-[#0f172a] font-semibold">{rowData.casecode}</span>
    </div>
  );

  const titleBodyTemplate = (rowData: CaseItem) => (
    <span className="text-[12px] text-[#334155]">{rowData.title}</span>
  );

  const descriptionBodyTemplate = (rowData: CaseItem) => (
    <span className="text-[12px] text-[#64748b] line-clamp-1 max-w-[200px]" title={rowData.description}>
      {rowData.description}
    </span>
  );

  const resolutionBodyTemplate = (rowData: CaseItem) => (
    <span className="text-[12px] text-[#64748b] line-clamp-1 max-w-[200px]" title={rowData.resolution}>
      {rowData.resolution}
    </span>
  );

  const categoryBodyTemplate = (rowData: CaseItem) => {
    const color = categoryColors[rowData.category] || { bg: "#f1f5f9", text: "#64748b" };
    return (
      <span
        className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        {rowData.category}
      </span>
    );
  };

  const applicationForBodyTemplate = (rowData: CaseItem) => {
    const color = appForColors[rowData.applicationFor] || { bg: "#f1f5f9", text: "#64748b" };
    return (
      <span
        className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        {rowData.applicationFor}
      </span>
    );
  };

  const statusBodyTemplate = (rowData: CaseItem) => (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${
      rowData.status === "ACTIVE" ? "bg-[#f0fdf4] text-[#16a34a]" : "bg-[#f1f5f9] text-[#94a3b8]"
    }`}>
      {rowData.status === "ACTIVE" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {rowData.status === "ACTIVE" ? "Active" : "Inactive"}
    </span>
  );

  const formatDateTime = (val: string | null) => {
    if (!val) return <span className="text-[11px] text-[#cbd5e1] italic">—</span>;
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return <span className="text-[12px] text-[#334155]">{val}</span>;
      return (
        <span className="text-[12px] text-[#334155] tabular-nums">
          {d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })}
          <span className="text-[10px] text-[#94a3b8] ml-1">
            {d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
          </span>
        </span>
      );
    } catch {
      return <span className="text-[12px] text-[#334155]">{val}</span>;
    }
  };

  const createdAtBodyTemplate = (rowData: CaseItem) => formatDateTime(rowData.createdAt);
  const updatedAtBodyTemplate = (rowData: CaseItem) => formatDateTime(rowData.updatedAt);
  const deletedAtBodyTemplate = (rowData: CaseItem) => formatDateTime(rowData.deletedAt);

  const actionBodyTemplate = (rowData: CaseItem) => (
    <div className="flex justify-center">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#eef2ff] transition-colors cursor-pointer text-[#6366f1] hover:bg-[#e0e7ff]"
        title="View"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/cases/${rowData.id}`);
        }}
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const leftToolbarTemplate = () => (
    <div className="flex items-center gap-2">
    </div>
  );

  const rightToolbarTemplate = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setExportDialogVisible(true)}
        className="flex items-center gap-1.5 border border-[#e2e8f0] text-[#475569] px-3.5 py-2 rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors cursor-pointer"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
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
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] text-[#0f172a] font-semibold m-0">Cases</h2>
          {sheetSource === "google" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] text-[10px] font-medium border border-[#bbf7d0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
              Live
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search cases..."
            className="!text-[13px] !py-2.5 !pl-10 !pr-4 !rounded-[10px] !border-[#e2e8f0] focus:!border-[#6366f1] focus:!shadow-none !bg-[#f8fafc] !w-[280px]"
          />
          {globalFilter && (
            <button
              onClick={() => setGlobalFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] cursor-pointer"
            >
              <span className="text-[14px]">&times;</span>
            </button>
          )}
        </div>
        <button
          className="flex items-center justify-center w-9 h-9 border border-[#e2e8f0] rounded-[8px] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors cursor-pointer"
          title="Refresh"
          onClick={() => loadFromSheet()}
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
        className="px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
      >
        {editMode ? "Update" : "Create"}
      </button>
    </div>
  );

  const getCodeText = () => {
    if (tableCodeCategory === "frontend") {
      const codeMap: Record<string, string> = { react: casesReactTableCode, vue: casesVueTableCode, angular: casesAngularTableCode };
      return codeMap[tableCodeFramework];
    }
    return casesBackendCode;
  };

  const getCodeLang = () => {
    if (tableCodeCategory === "frontend") {
      if (tableCodeFramework === "angular") return "typescript";
      if (tableCodeFramework === "vue") return "markup";
      return "tsx";
    }
    return "typescript";
  };

  const getFileName = () => {
    if (tableCodeCategory === "frontend") {
      if (tableCodeFramework === "react") return "CasesList.tsx";
      if (tableCodeFramework === "vue") return "CasesList.vue";
      return "cases-list.component.ts";
    }
    return "cases.controller.ts";
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
          <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-[#6366f1]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">Cases Management</h1>
            <p className="text-[12px] text-[#94a3b8]">
              Master Data and Setup &rsaquo; Cases &rsaquo; List
            </p>
          </div>
          {/* Google Sheet Source Indicator */}
          <div className="ml-auto flex items-center gap-2">
            {sheetLoading && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0f9ff] border border-[#bae6fd] text-[#0284c7]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="text-[11px] font-medium">Loading from Google Sheet...</span>
              </div>
            )}
            {!sheetLoading && (
              <a
                href={GOOGLE_SHEET_VIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors border cursor-pointer ${
                  sheetSource === "google"
                    ? "bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a] hover:bg-[#dcfce7]"
                    : "bg-[#fffbeb] border-[#fde68a] text-[#d97706] hover:bg-[#fef3c7]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
                  <path d="M11 4C8.79 4 7 5.79 7 8v32c0 2.21 1.79 4 4 4h26c2.21 0 4-1.79 4-4V16L29 4H11z" fill="#4CAF50"/>
                  <path d="M29 4l12 12h-8c-2.21 0-4-1.79-4-4V4z" fill="#A5D6A7"/>
                  <path d="M13 24h22v2H13v-2zm0 4h22v2H13v-2zm0 4h22v2H13v-2zm0-12h22v2H13v-2z" fill="#fff"/>
                </svg>
                {sheetSource === "google" ? "Google Sheet Connected" : "Sheet Unavailable (Mock)"}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
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
          emptyMessage="No cases found."
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
          {visibleColumns.includes("casecode") && (
            <Column field="casecode" header="Case Code" body={casecodeBodyTemplate} sortable style={{ minWidth: "140px" }} />
          )}
          {visibleColumns.includes("title") && (
            <Column field="title" header="Title" body={titleBodyTemplate} sortable style={{ minWidth: "150px" }} />
          )}
          {visibleColumns.includes("description") && (
            <Column field="description" header="Description" body={descriptionBodyTemplate} sortable style={{ minWidth: "200px" }} />
          )}
          {visibleColumns.includes("resolution") && (
            <Column field="resolution" header="Resolution" body={resolutionBodyTemplate} sortable style={{ minWidth: "200px" }} />
          )}
          {visibleColumns.includes("category") && (
            <Column field="category" header="Category" body={categoryBodyTemplate} sortable style={{ minWidth: "130px" }} />
          )}
          {visibleColumns.includes("applicationFor") && (
            <Column field="applicationFor" header="Application For" body={applicationForBodyTemplate} sortable style={{ minWidth: "140px" }} />
          )}
          {visibleColumns.includes("status") && (
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "110px" }} />
          )}
          {visibleColumns.includes("createdAt") && (
            <Column field="createdAt" header="Created At" body={createdAtBodyTemplate} sortable style={{ minWidth: "170px" }} />
          )}
          {visibleColumns.includes("updatedAt") && (
            <Column field="updatedAt" header="Updated At" body={updatedAtBodyTemplate} sortable style={{ minWidth: "170px" }} />
          )}
          {visibleColumns.includes("deletedAt") && (
            <Column field="deletedAt" header="Deleted At" body={deletedAtBodyTemplate} sortable style={{ minWidth: "170px" }} />
          )}
          <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: "60px" }} frozen alignFrozen="right" />
        </DataTable>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editMode ? "Edit Case" : "New Case"}
        footer={dialogFooter}
        modal
        dismissableMask
        draggable={false}
        className="!w-[540px] !rounded-[12px]"
        contentClassName="!px-6 !py-4"
        headerClassName="!px-6 !py-4 !border-b !border-[#e2e8f0]"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Case Code *</label>
              <InputText
                value={formData.casecode}
                onChange={(e) => setFormData({ ...formData, casecode: e.target.value })}
                className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#6366f1] focus:!shadow-none ${submitted && !formData.casecode.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="e.g. CAS-011"
              />
              {submitted && !formData.casecode.trim() && <small className="text-[11px] text-[#e53935] mt-1">Case code is required</small>}
            </div>
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Title *</label>
              <InputText
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#6366f1] focus:!shadow-none ${submitted && !formData.title.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="e.g. Accident Report"
              />
              {submitted && !formData.title.trim() && <small className="text-[11px] text-[#e53935] mt-1">Title is required</small>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Category *</label>
              <Dropdown
                value={formData.category}
                options={categoryOptions}
                onChange={(e) => setFormData({ ...formData, category: e.value })}
                placeholder="Select"
                className={`!w-full !text-[13px] !rounded-[8px] !border-[#e2e8f0] ${submitted && !formData.category ? "!border-[#e53935]" : ""}`}
              />
              {submitted && !formData.category && <small className="text-[11px] text-[#e53935] mt-1">Required</small>}
            </div>
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Application For</label>
              <Dropdown
                value={formData.applicationFor}
                options={applicationForOptions}
                onChange={(e) => setFormData({ ...formData, applicationFor: e.value })}
                placeholder="Select"
                className="!w-full !text-[13px] !rounded-[8px] !border-[#e2e8f0]"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Status</label>
              <Dropdown
                value={formData.status}
                options={statusOptions}
                onChange={(e) => setFormData({ ...formData, status: e.value })}
                className="!w-full !text-[13px] !rounded-[8px] !border-[#e2e8f0]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Description</label>
            <InputText
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#6366f1] focus:!shadow-none"
              placeholder="Case description"
            />
          </div>
          <div>
            <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Resolution</label>
            <InputText
              value={formData.resolution}
              onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
              className="!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#6366f1] focus:!shadow-none"
              placeholder="Resolution steps"
            />
          </div>
        </div>
      </Dialog>

      {/* Export Dialog */}
      <Dialog
        visible={exportDialogVisible}
        onHide={() => setExportDialogVisible(false)}
        header="Export Cases"
        modal
        dismissableMask
        draggable={false}
        className="!w-[460px] !rounded-[12px]"
        contentClassName="!px-6 !py-4"
        headerClassName="!px-6 !py-4 !border-b !border-[#e2e8f0]"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] text-[#64748b] font-medium mb-2">Select Columns</label>
            <div className="grid grid-cols-2 gap-2">
              {exportColumns.map((col) => (
                <label key={col.field} className="flex items-center gap-2 cursor-pointer text-[12px] text-[#334155]">
                  <Checkbox
                    checked={selectedExportColumns.includes(col.field)}
                    onChange={(e) => {
                      setSelectedExportColumns((prev) =>
                        e.checked ? [...prev, col.field] : prev.filter((f) => f !== col.field)
                      );
                    }}
                    className="!w-4 !h-4"
                  />
                  {col.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
            <span className="text-[11px] text-[#94a3b8]">{filteredData.length} rows &middot; {selectedExportColumns.length} columns</span>
            <div className="flex items-center gap-2">
              <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e2e8f0] rounded-[8px] text-[12px] text-[#475569] hover:bg-[#f8fafc] transition-colors cursor-pointer">
                CSV
              </button>
              <button onClick={exportExcel} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e2e8f0] rounded-[8px] text-[12px] text-[#475569] hover:bg-[#f8fafc] transition-colors cursor-pointer">
                Excel
              </button>
              <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e2e8f0] rounded-[8px] text-[12px] text-[#475569] hover:bg-[#f8fafc] transition-colors cursor-pointer">
                PDF
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Table Code Preview Dialog */}
      <Dialog
        visible={tableCodePreviewOpen}
        onHide={() => { setTableCodePreviewOpen(false); setTableCodeCopied(false); setTableCodeCategory("frontend"); }}
        modal
        dismissableMask
        draggable={false}
        resizable={false}
        className="!border-none !shadow-none"
        contentClassName="!p-0 !bg-transparent"
        headerClassName="!hidden"
        style={{ width: "720px", maxWidth: "90vw" }}
      >
        <div className="bg-white rounded-[16px] border border-[#e2e8f0] overflow-hidden shadow-[0px_8px_32px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-[#4f46e5]" />
              </div>
              <div>
                <h3 className="text-[13px] text-[#0f172a] font-semibold">DataTable Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">Search, Filter, Export, Columns, Pagination</p>
              </div>
            </div>
            <button
              onClick={() => { setTableCodePreviewOpen(false); setTableCodeCopied(false); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-b border-[#f1f5f9] bg-[#fafbfc]">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#f1f5f9] rounded-lg p-0.5">
                {(["frontend", "backend"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setTableCodeCategory(cat); setTableCodeCopied(false); }}
                    className={`px-3 py-1.5 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer ${
                      tableCodeCategory === cat ? "bg-white text-[#0f172a] shadow-sm" : "text-[#64748b] hover:text-[#334155]"
                    }`}
                  >
                    {cat === "frontend" ? "Frontend" : "Backend"}
                  </button>
                ))}
              </div>
              {tableCodeCategory === "frontend" && (
                <div className="flex items-center gap-1">
                  {(["react", "vue", "angular"] as const).map((fw) => {
                    const icons: Record<string, string> = { react: "\u269B\uFE0F", vue: "\uD83D\uDC9A", angular: "\uD83C\uDD70\uFE0F" };
                    const labels: Record<string, string> = { react: "React", vue: "Vue", angular: "Angular" };
                    return (
                      <button
                        key={fw}
                        onClick={() => { setTableCodeFramework(fw); setTableCodeCopied(false); }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                          tableCodeFramework === fw
                            ? "bg-white border-[#e2e8f0] text-[#0f172a] shadow-sm"
                            : "border-transparent text-[#94a3b8] hover:text-[#64748b]"
                        }`}
                      >
                        <span className="text-[12px]">{icons[fw]}</span>
                        {labels[fw]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                const text = getCodeText();
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

          <div className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] border-b border-[#1e293b]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
              </div>
              <span className="text-[10px] text-[#64748b] ml-2">{getFileName()}</span>
            </div>
            <Highlight
              theme={tableCodeCategory === "frontend" ? themes.nightOwl : themes.vsDark}
              code={getCodeText()}
              language={getCodeLang()}
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
    </div>
  );
}

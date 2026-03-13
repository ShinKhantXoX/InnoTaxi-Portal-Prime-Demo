import { useState, useRef, useMemo, useEffect } from "react";
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
import { Droplets, Plus, Pencil, Trash2, Download, RefreshCw, Search, EllipsisVertical, Check, X, Filter, ChevronDown, Columns3, Eye, EyeOff, Code2, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface BloodType {
  id: number;
  code: string;
  name: string;
  group: string;
  rhFactor: "Positive" | "Negative";
  drivers: number;
  customers: number;
  status: "ACTIVE" | "INACTIVE";
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const emptyBloodType: BloodType = {
  id: 0,
  code: "",
  name: "",
  group: "",
  rhFactor: "Positive",
  drivers: 0,
  customers: 0,
  status: "ACTIVE",
  description: "",
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
};

export const bloodTypeMockData: BloodType[] = [
  { id: 1, code: "A+", name: "A Positive", group: "A", rhFactor: "Positive", drivers: 87, customers: 1243, status: "ACTIVE", description: "Most common blood type with Rh positive antigen on red blood cells", createdAt: "2024-01-15", updatedAt: "2026-01-15", deletedAt: null },
  { id: 2, code: "A-", name: "A Negative", group: "A", rhFactor: "Negative", drivers: 18, customers: 256, status: "ACTIVE", description: "Type A without Rh factor, compatible with A and AB recipients", createdAt: "2024-01-15", updatedAt: "2026-02-08", deletedAt: null },
  { id: 3, code: "B+", name: "B Positive", group: "B", rhFactor: "Positive", drivers: 72, customers: 1028, status: "ACTIVE", description: "Contains B antigens with Rh positive factor on red blood cells", createdAt: "2024-02-10", updatedAt: "2026-01-22", deletedAt: null },
  { id: 4, code: "B-", name: "B Negative", group: "B", rhFactor: "Negative", drivers: 15, customers: 198, status: "ACTIVE", description: "Rare blood type with B antigens and no Rh factor present", createdAt: "2024-02-10", updatedAt: "2026-02-14", deletedAt: null },
  { id: 5, code: "AB+", name: "AB Positive", group: "AB", rhFactor: "Positive", drivers: 28, customers: 412, status: "ACTIVE", description: "Universal plasma donor with both A and B antigens present", createdAt: "2024-03-01", updatedAt: "2026-01-30", deletedAt: null },
  { id: 6, code: "AB-", name: "AB Negative", group: "AB", rhFactor: "Negative", drivers: 5, customers: 67, status: "ACTIVE", description: "Rarest blood type, universal plasma donor without Rh factor", createdAt: "2024-03-01", updatedAt: "2026-02-05", deletedAt: null },
  { id: 7, code: "O+", name: "O Positive", group: "O", rhFactor: "Positive", drivers: 98, customers: 1456, status: "ACTIVE", description: "Most common type globally, universal red cell donor for Rh+ recipients", createdAt: "2024-04-12", updatedAt: "2026-02-18", deletedAt: null },
  { id: 8, code: "O-", name: "O Negative", group: "O", rhFactor: "Negative", drivers: 19, customers: 274, status: "ACTIVE", description: "Universal red cell donor, compatible with all blood types", createdAt: "2024-04-12", updatedAt: "2026-03-01", deletedAt: null },
];

const groupOptions = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "AB", value: "AB" },
  { label: "O", value: "O" },
];

const rhOptions = [
  { label: "Positive", value: "Positive" },
  { label: "Negative", value: "Negative" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

// ── Table Code Strings ──
export const bloodTypeReactTableCode = `import { useState, useRef, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';

const bloodTypes = [
  { id: 1, code: 'A+', name: 'A Positive', group: 'A', rhFactor: 'Positive', drivers: 87, description: 'Most common blood type with Rh positive antigen', updatedAt: '2026-01-15', status: 'ACTIVE' },
  { id: 2, code: 'A-', name: 'A Negative', group: 'A', rhFactor: 'Negative', drivers: 18, description: 'Type A without Rh factor, compatible with A and AB', updatedAt: '2026-02-08', status: 'ACTIVE' },
  { id: 3, code: 'B+', name: 'B Positive', group: 'B', rhFactor: 'Positive', drivers: 72, description: 'Contains B antigens with Rh positive factor', updatedAt: '2026-01-22', status: 'ACTIVE' },
  { id: 4, code: 'B-', name: 'B Negative', group: 'B', rhFactor: 'Negative', drivers: 15, description: 'Rare blood type with B antigens and no Rh factor', updatedAt: '2026-02-14', status: 'ACTIVE' },
  { id: 5, code: 'AB+', name: 'AB Positive', group: 'AB', rhFactor: 'Positive', drivers: 28, description: 'Universal plasma donor with both A and B antigens', updatedAt: '2026-01-30', status: 'ACTIVE' },
  { id: 6, code: 'AB-', name: 'AB Negative', group: 'AB', rhFactor: 'Negative', drivers: 5, description: 'Rarest blood type, universal plasma donor', updatedAt: '2026-02-05', status: 'ACTIVE' },
  { id: 7, code: 'O+', name: 'O Positive', group: 'O', rhFactor: 'Positive', drivers: 98, description: 'Most common type globally, universal red cell donor', updatedAt: '2026-02-18', status: 'ACTIVE' },
  { id: 8, code: 'O-', name: 'O Negative', group: 'O', rhFactor: 'Negative', drivers: 19, description: 'Universal red cell donor, compatible with all types', updatedAt: '2026-03-01', status: 'ACTIVE' },
];

export default function BloodTypeList() {
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data] = useState(bloodTypes);

  const filteredData = useMemo(() => {
    if (!globalFilter.trim()) return data;
    const lower = globalFilter.toLowerCase();
    return data.filter(bt =>
      Object.values(bt).some(val =>
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [data, globalFilter]);

  const statusTemplate = (rowData) => (
    <span className={\`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full \${
      rowData.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
    }\`}>
      {rowData.status === 'ACTIVE' ? '✓' : '✕'} {rowData.status === 'ACTIVE' ? 'Active' : 'Inactive'}
    </span>
  );

  const rhTemplate = (rowData) => (
    <span className={\`text-xs font-medium px-2.5 py-1 rounded-full \${
      rowData.rhFactor === 'Positive' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
    }\`}>
      {rowData.rhFactor}
    </span>
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Toast ref={toast} />
      <Toolbar left={() => <h3>Blood Types</h3>} />
      <DataTable
        value={filteredData}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[10, 50, 100]}
        globalFilter={globalFilter}
        emptyMessage="No blood types found."
        stripedRows
        removableSort
        rowHover
        size="small"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column field="code" header="Code" sortable />
        <Column field="name" header="Label" sortable />
        <Column field="rhFactor" header="Rh Factor" body={rhTemplate} sortable />
        <Column field="description" header="Description" sortable />
        <Column field="drivers" header="Drivers" sortable />
        <Column field="updatedAt" header="Updated" sortable body={(rowData) => formatDate(rowData.updatedAt)} />
        <Column field="status" header="Status" body={statusTemplate} sortable />
      </DataTable>
    </>
  );
}`;

export const bloodTypeVueTableCode = `<template>
  <div>
    <Toast ref="toast" />
    <Toolbar>
      <template #start>
        <h3>Blood Types</h3>
      </template>
    </Toolbar>
    <DataTable
      :value="filteredData"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[10, 50, 100]"
      :globalFilterFields="['code', 'name', 'group', 'rhFactor', 'status']"
      stripedRows
      removableSort
      rowHover
      size="small"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
    >
      <Column field="code" header="Code" sortable />
      <Column field="name" header="Label" sortable />
      <Column field="rhFactor" header="Rh Factor" sortable>
        <template #body="{ data }">
          <Tag :value="data.rhFactor"
            :severity="data.rhFactor === 'Positive' ? 'success' : 'danger'"
            rounded />
        </template>
      </Column>
      <Column field="description" header="Description" sortable />
      <Column field="drivers" header="Drivers" sortable />
      <Column field="updatedAt" header="Updated" sortable>
        <template #body="{ data }">
          {{ formatDate(data.updatedAt) }}
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

const bloodTypes = ref([
  { id: 1, code: 'A+', name: 'A Positive', rhFactor: 'Positive', drivers: 87, description: 'Most common blood type with Rh positive antigen', updatedAt: '2026-01-15', status: 'ACTIVE' },
  { id: 2, code: 'A-', name: 'A Negative', rhFactor: 'Negative', drivers: 18, description: 'Type A without Rh factor, compatible with A and AB', updatedAt: '2026-02-08', status: 'ACTIVE' },
  { id: 3, code: 'B+', name: 'B Positive', rhFactor: 'Positive', drivers: 72, description: 'Contains B antigens with Rh positive factor', updatedAt: '2026-01-22', status: 'ACTIVE' },
  { id: 4, code: 'B-', name: 'B Negative', rhFactor: 'Negative', drivers: 15, description: 'Rare blood type with B antigens and no Rh factor', updatedAt: '2026-02-14', status: 'ACTIVE' },
  { id: 5, code: 'AB+', name: 'AB Positive', rhFactor: 'Positive', drivers: 28, description: 'Universal plasma donor with both A and B antigens', updatedAt: '2026-01-30', status: 'ACTIVE' },
  { id: 6, code: 'AB-', name: 'AB Negative', rhFactor: 'Negative', drivers: 5, description: 'Rarest blood type, universal plasma donor', updatedAt: '2026-02-05', status: 'ACTIVE' },
  { id: 7, code: 'O+', name: 'O Positive', rhFactor: 'Positive', drivers: 98, description: 'Most common type globally, universal red cell donor', updatedAt: '2026-02-18', status: 'ACTIVE' },
  { id: 8, code: 'O-', name: 'O Negative', rhFactor: 'Negative', drivers: 19, description: 'Universal red cell donor, compatible with all types', updatedAt: '2026-03-01', status: 'ACTIVE' },
]);

const globalFilter = ref('');

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const filteredData = computed(() => {
  if (!globalFilter.value.trim()) return bloodTypes.value;
  const lower = globalFilter.value.toLowerCase();
  return bloodTypes.value.filter(bt =>
    Object.values(bt).some(val =>
      String(val).toLowerCase().includes(lower)
    )
  );
});
</script>`;

export const bloodTypeAngularTableCode = `import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface BloodType {
  id: number;
  code: string;
  name: string;
  rhFactor: string;
  description: string;
  drivers: number;
  updatedAt: string;
  status: string;
}

@Component({
  selector: 'app-blood-type-list',
  standalone: true,
  imports: [TableModule, TagModule, ToolbarModule, ToastModule, DatePipe],
  providers: [MessageService],
  template: \`
    <p-toast />
    <p-toolbar>
      <ng-template pTemplate="left">
        <h3>Blood Types</h3>
      </ng-template>
    </p-toolbar>
    <p-table
      [value]="filteredData"
      dataKey="id"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 50, 100]"
      [globalFilterFields]="['code','name','rhFactor','description','status']"
      stripedRows
      [rowHover]="true"
      size="small"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
    >
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="code">Code <p-sortIcon field="code" /></th>
          <th pSortableColumn="name">Label <p-sortIcon field="name" /></th>
          <th pSortableColumn="rhFactor">Rh Factor <p-sortIcon field="rhFactor" /></th>
          <th pSortableColumn="description">Description <p-sortIcon field="description" /></th>
          <th pSortableColumn="drivers">Drivers <p-sortIcon field="drivers" /></th>
          <th pSortableColumn="updatedAt">Updated <p-sortIcon field="updatedAt" /></th>
          <th pSortableColumn="status">Status <p-sortIcon field="status" /></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-bt>
        <tr>
          <td>{{ bt.code }}</td>
          <td>{{ bt.name }}</td>
          <td><p-tag [value]="bt.rhFactor" [severity]="bt.rhFactor === 'Positive' ? 'success' : 'danger'" [rounded]="true" /></td>
          <td>{{ bt.description }}</td>
          <td>{{ bt.drivers }}</td>
          <td>{{ bt.updatedAt | date:'MMM d, yyyy' }}</td>
          <td><p-tag [value]="bt.status === 'ACTIVE' ? 'Active' : 'Inactive'" [severity]="bt.status === 'ACTIVE' ? 'success' : 'danger'" [rounded]="true" /></td>
        </tr>
      </ng-template>
    </p-table>
  \`
})
export class BloodTypeListComponent implements OnInit {
  bloodTypes: BloodType[] = [
    { id: 1, code: 'A+', name: 'A Positive', rhFactor: 'Positive', drivers: 87, description: 'Most common blood type with Rh positive antigen', updatedAt: '2026-01-15', status: 'ACTIVE' },
    { id: 2, code: 'A-', name: 'A Negative', rhFactor: 'Negative', drivers: 18, description: 'Type A without Rh factor, compatible with A and AB', updatedAt: '2026-02-08', status: 'ACTIVE' },
    { id: 3, code: 'B+', name: 'B Positive', rhFactor: 'Positive', drivers: 72, description: 'Contains B antigens with Rh positive factor', updatedAt: '2026-01-22', status: 'ACTIVE' },
    { id: 4, code: 'B-', name: 'B Negative', rhFactor: 'Negative', drivers: 15, description: 'Rare blood type with B antigens and no Rh factor', updatedAt: '2026-02-14', status: 'ACTIVE' },
    { id: 5, code: 'AB+', name: 'AB Positive', rhFactor: 'Positive', drivers: 28, description: 'Universal plasma donor with both A and B antigens', updatedAt: '2026-01-30', status: 'ACTIVE' },
    { id: 6, code: 'AB-', name: 'AB Negative', rhFactor: 'Negative', drivers: 5, description: 'Rarest blood type, universal plasma donor', updatedAt: '2026-02-05', status: 'ACTIVE' },
    { id: 7, code: 'O+', name: 'O Positive', rhFactor: 'Positive', drivers: 98, description: 'Most common type globally, universal red cell donor', updatedAt: '2026-02-18', status: 'ACTIVE' },
    { id: 8, code: 'O-', name: 'O Negative', rhFactor: 'Negative', drivers: 19, description: 'Universal red cell donor, compatible with all types', updatedAt: '2026-03-01', status: 'ACTIVE' },
  ];
  globalFilter = '';
  filteredData: BloodType[] = [];

  ngOnInit() {
    this.filteredData = [...this.bloodTypes];
  }
}`;

export const bloodTypeBackendCode = `// blood-type.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { BloodTypeService } from './blood-type.service';
import { CreateBloodTypeDto, UpdateBloodTypeDto } from './blood-type.dto';

@Controller('api/v1/blood-types')
export class BloodTypeController {
  constructor(private readonly bloodTypeService: BloodTypeService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('group') group?: string,
    @Query('sortBy') sortBy = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.bloodTypeService.findAll({
      page, limit, search, status, group, sortBy, sortOrder,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.bloodTypeService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateBloodTypeDto) {
    return this.bloodTypeService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateBloodTypeDto) {
    return this.bloodTypeService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.bloodTypeService.remove(id);
  }
}

// blood-type.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { BloodType } from './entities/blood-type.entity';

@Injectable()
export class BloodTypeService {
  constructor(
    @InjectRepository(BloodType)
    private repo: Repository<BloodType>,
  ) {}

  async findAll(params: {
    page: number; limit: number; search?: string;
    status?: string; group?: string;
    sortBy: string; sortOrder: 'ASC' | 'DESC';
  }) {
    const { page, limit, search, status, group, sortBy, sortOrder } = params;
    const where: FindOptionsWhere<BloodType>[] = [];
    const baseWhere: any = { deletedAt: null };

    if (status) baseWhere.status = status;
    if (group) baseWhere.group = group;

    if (search) {
      where.push(
        { ...baseWhere, name: Like(\`%\${search}%\`) },
        { ...baseWhere, code: Like(\`%\${search}%\`) },
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
    if (!item) throw new NotFoundException('Blood type not found');
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
    return { success: true, message: 'Blood type soft-deleted' };
  }
}`;

export function BloodTypeList() {
  const toast = useRef<Toast>(null);
  const [bloodTypes, setBloodTypes] = useState<BloodType[]>(bloodTypeMockData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<BloodType>(emptyBloodType);
  const [submitted, setSubmitted] = useState(false);
  const actionMenuRef = useRef<Menu>(null);
  const activeRowRef = useRef<BloodType | null>(null);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const columnsDropdownRef = useRef<HTMLDivElement>(null);
  const [tableCodePreviewOpen, setTableCodePreviewOpen] = useState(false);
  const [tableCodeCategory, setTableCodeCategory] = useState<"frontend" | "backend">("frontend");
  const [tableCodeFramework, setTableCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [tableCodeCopied, setTableCodeCopied] = useState(false);

  const exportColumns = [
    { field: "code" as keyof BloodType, label: "Code" },
    { field: "name" as keyof BloodType, label: "Label" },
    { field: "group" as keyof BloodType, label: "Group" },
    { field: "rhFactor" as keyof BloodType, label: "Rh Factor" },
    { field: "description" as keyof BloodType, label: "Description" },
    { field: "drivers" as keyof BloodType, label: "Drivers" },
    { field: "customers" as keyof BloodType, label: "Customers" },
    { field: "status" as keyof BloodType, label: "Status" },
    { field: "createdAt" as keyof BloodType, label: "Created At" },
    { field: "updatedAt" as keyof BloodType, label: "Updated" },
    { field: "deletedAt" as keyof BloodType, label: "Deleted At" },
  ];

  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    exportColumns.map((c) => c.field)
  );

  const tableColumns = [
    { field: "code", label: "Code", default: true },
    { field: "name", label: "Label", default: true },
    { field: "group", label: "Group", default: false },
    { field: "rhFactor", label: "Rh Factor", default: true },
    { field: "description", label: "Description", default: true },
    { field: "drivers", label: "Drivers", default: true },
    { field: "customers", label: "Customers", default: false },
    { field: "status", label: "Status", default: true },
    { field: "createdAt", label: "Created At", default: false },
    { field: "updatedAt", label: "Updated", default: true },
    { field: "deletedAt", label: "Deleted At", default: false },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.filter((c) => c.default).map((c) => c.field)
  );

  const filteredData = useMemo(() => {
    let data = bloodTypes;
    if (statusFilter !== "ALL") {
      data = data.filter((bt) => bt.status === statusFilter);
    }
    if (globalFilter.trim()) {
      const lower = globalFilter.toLowerCase();
      data = data.filter((bt) =>
        Object.values(bt).some((val) =>
          String(val).toLowerCase().includes(lower)
        )
      );
    }
    return data;
  }, [bloodTypes, globalFilter, statusFilter]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusFilterRef.current && !statusFilterRef.current.contains(e.target as Node)) setStatusFilterOpen(false);
      if (columnsDropdownRef.current && !columnsDropdownRef.current.contains(e.target as Node)) setColumnsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          toast.current?.show({ severity: "info", summary: "View", detail: `Viewing ${activeRowRef.current.name}`, life: 2000 });
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
    {
      separator: true,
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
    setFormData({ ...emptyBloodType, id: Date.now(), createdAt: new Date().toISOString().split("T")[0], updatedAt: new Date().toISOString().split("T")[0] });
    setEditMode(false);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openEdit = (item: BloodType) => {
    setFormData({ ...item });
    setEditMode(true);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const saveItem = () => {
    setSubmitted(true);
    if (!formData.code.trim() || !formData.name.trim() || !formData.group) return;

    const updated = { ...formData, updatedAt: new Date().toISOString().split("T")[0] };

    if (editMode) {
      setBloodTypes((prev) => prev.map((bt) => (bt.id === updated.id ? updated : bt)));
      toast.current?.show({ severity: "success", summary: "Updated", detail: `${updated.name} has been updated`, life: 3000 });
    } else {
      setBloodTypes((prev) => [...prev, updated]);
      toast.current?.show({ severity: "success", summary: "Created", detail: `${updated.name} has been created`, life: 3000 });
    }
    setDialogVisible(false);
    setFormData(emptyBloodType);
  };

  const confirmDelete = (item: BloodType) => {
    confirmDialog({
      message: `Are you sure you want to delete "${item.name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setBloodTypes((prev) => prev.filter((bt) => bt.id !== item.id));
        toast.current?.show({ severity: "warn", summary: "Deleted", detail: `${item.name} has been removed`, life: 3000 });
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
    const rows = filteredData.map((bt) => cols.map((c) => escapeCSV(String(bt[c.field]))));
    const csv = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blood_types.csv";
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
    const worksheetData = [headers, ...filteredData.map((bt) => cols.map((c) => String(bt[c.field])))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Blood Types");
    XLSX.writeFile(workbook, "blood_types.xlsx");
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
      body: filteredData.map((bt) => cols.map((c) => String(bt[c.field]))),
      startY: 20,
      headStyles: { fillColor: [240, 249, 255], textColor: [59, 130, 246], fontSize: 10 },
      bodyStyles: { fontSize: 10 },
    });
    doc.save("blood_types.pdf");
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  const statusBodyTemplate = (rowData: BloodType) => {
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

  const rhBodyTemplate = (rowData: BloodType) => (
    <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full ${
      rowData.rhFactor === "Positive" ? "bg-[#f0fdf4] text-[#16a34a]" : "bg-[#fef2f2] text-[#e53935]"
    }`}>
      {rowData.rhFactor}
    </span>
  );

  const codeBodyTemplate = (rowData: BloodType) => (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-[#fef2f2] flex items-center justify-center flex-shrink-0">
        <Droplets className="w-3.5 h-3.5 text-[#e53935]" />
      </div>
      <span className="text-[12px] text-[#0f172a] font-semibold">{rowData.code}</span>
    </div>
  );

  const nameBodyTemplate = (rowData: BloodType) => (
    <span className="text-[12px] text-[#334155]">{rowData.name}</span>
  );

  const descriptionBodyTemplate = (rowData: BloodType) => (
    <span className="text-[12px] text-[#64748b] line-clamp-1 max-w-[220px]" title={rowData.description}>
      {rowData.description}
    </span>
  );

  const driversBodyTemplate = (rowData: BloodType) => (
    <span className="text-[12px] text-[#0f172a] font-medium">{rowData.drivers}</span>
  );

  const customersBodyTemplate = (rowData: BloodType) => (
    <span className="text-[12px] text-[#0f172a] font-medium">{rowData.customers.toLocaleString()}</span>
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const updatedBodyTemplate = (rowData: BloodType) => (
    <span className="text-[12px] text-[#64748b]">{formatDate(rowData.updatedAt)}</span>
  );

  const actionBodyTemplate = (rowData: BloodType) => (
    <div className="flex justify-center">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#fef2f2] transition-colors cursor-pointer text-[#e53935] hover:bg-[#fee2e2]"
        title="Actions"
        onClick={(e) => {
          e.stopPropagation();
          activeRowRef.current = rowData;
          actionMenuRef.current?.toggle(e);
        }}
      >
        <EllipsisVertical className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const leftToolbarTemplate = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={openNew}
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
              { key: "ALL" as const, label: "All Statuses", count: bloodTypes.length },
              { key: "ACTIVE" as const, label: "Active", count: bloodTypes.filter((bt) => bt.status === "ACTIVE").length },
              { key: "INACTIVE" as const, label: "Inactive", count: bloodTypes.filter((bt) => bt.status === "INACTIVE").length },
            ]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => { setStatusFilter(opt.key); setStatusFilterOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-[12px] transition-colors cursor-pointer ${
                  statusFilter === opt.key ? "bg-[#fef2f2] text-[#e53935] font-medium" : "text-[#475569] hover:bg-[#f8fafc]"
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
      {/* Export */}
      <button
        onClick={() => setExportDialogVisible(true)}
        className="flex items-center gap-1.5 border border-[#e2e8f0] text-[#475569] px-3.5 py-2 rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors cursor-pointer"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
      {/* Columns Toggle */}
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
      {/* Code Preview */}
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
        <h2 className="text-[15px] text-[#0f172a] font-semibold m-0">Blood Types</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search blood types..."
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
            setBloodTypes([...bloodTypeMockData]);
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

  const getCodeText = () => {
    if (tableCodeCategory === "frontend") {
      const codeMap: Record<string, string> = { react: bloodTypeReactTableCode, vue: bloodTypeVueTableCode, angular: bloodTypeAngularTableCode };
      return codeMap[tableCodeFramework];
    }
    return bloodTypeBackendCode;
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
      if (tableCodeFramework === "react") return "BloodTypeList.tsx";
      if (tableCodeFramework === "vue") return "BloodTypeList.vue";
      return "blood-type-list.component.ts";
    }
    return "blood-type.controller.ts";
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
            <Droplets className="w-4 h-4 text-[#e53935]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">
              Blood Type Management
            </h1>
            <p className="text-[12px] text-[#94a3b8]">
              Master Data and Setup &rsaquo; Blood Type &rsaquo; List
            </p>
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
          emptyMessage="No blood types found."
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
            <Column field="code" header="Code" body={codeBodyTemplate} sortable style={{ minWidth: "130px" }} />
          )}
          {visibleColumns.includes("name") && (
            <Column field="name" header="Label" body={nameBodyTemplate} sortable style={{ minWidth: "120px" }} />
          )}
          {visibleColumns.includes("group") && (
            <Column field="group" header="Group" sortable style={{ minWidth: "90px" }} />
          )}
          {visibleColumns.includes("rhFactor") && (
            <Column field="rhFactor" header="Rh Factor" body={rhBodyTemplate} sortable style={{ minWidth: "110px" }} />
          )}
          {visibleColumns.includes("description") && (
            <Column field="description" header="Description" body={descriptionBodyTemplate} sortable style={{ minWidth: "200px" }} />
          )}
          {visibleColumns.includes("drivers") && (
            <Column field="drivers" header="Drivers" body={driversBodyTemplate} sortable style={{ minWidth: "90px" }} />
          )}
          {visibleColumns.includes("customers") && (
            <Column field="customers" header="Customers" body={customersBodyTemplate} sortable style={{ minWidth: "110px" }} />
          )}
          {visibleColumns.includes("updatedAt") && (
            <Column field="updatedAt" header="Updated" body={updatedBodyTemplate} sortable style={{ minWidth: "130px" }} />
          )}
          {visibleColumns.includes("status") && (
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "100px" }} />
          )}
          {visibleColumns.includes("createdAt") && (
            <Column field="createdAt" header="Created At" sortable style={{ minWidth: "120px" }} body={(rowData: BloodType) => (
              <span className="text-[12px] text-[#64748b]">{formatDate(rowData.createdAt)}</span>
            )} />
          )}
          {visibleColumns.includes("deletedAt") && (
            <Column
              field="deletedAt"
              header="Deleted At"
              sortable
              style={{ minWidth: "120px" }}
              body={(rowData: BloodType) => (
                <span className={`text-[12px] ${rowData.deletedAt ? "text-[#e53935]" : "text-[#cbd5e1]"}`}>
                  {rowData.deletedAt ? formatDate(rowData.deletedAt) : "—"}
                </span>
              )}
            />
          )}
          <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: "60px" }} frozen alignFrozen="right" />
        </DataTable>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editMode ? "Edit Blood Type" : "New Blood Type"}
        footer={dialogFooter}
        modal
        dismissableMask
        draggable={false}
        className="!w-[500px] !rounded-[12px]"
        contentClassName="!px-6 !py-4"
        headerClassName="!px-6 !py-4 !border-b !border-[#e2e8f0]"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Code *</label>
            <InputText
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !formData.code.trim() ? "!border-[#e53935]" : ""}`}
              placeholder="e.g. A_POS"
            />
            {submitted && !formData.code.trim() && <small className="text-[11px] text-[#e53935] mt-1">Code is required</small>}
          </div>
          <div>
            <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Name *</label>
            <InputText
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !formData.name.trim() ? "!border-[#e53935]" : ""}`}
              placeholder="e.g. A+"
            />
            {submitted && !formData.name.trim() && <small className="text-[11px] text-[#e53935] mt-1">Name is required</small>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Group *</label>
              <Dropdown
                value={formData.group}
                options={groupOptions}
                onChange={(e) => setFormData({ ...formData, group: e.value })}
                placeholder="Select group"
                className={`!w-full !text-[13px] !rounded-[8px] !border-[#e2e8f0] ${submitted && !formData.group ? "!border-[#e53935]" : ""}`}
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Rh Factor</label>
              <Dropdown
                value={formData.rhFactor}
                options={rhOptions}
                onChange={(e) => setFormData({ ...formData, rhFactor: e.value })}
                className="!w-full !text-[13px] !rounded-[8px] !border-[#e2e8f0]"
              />
            </div>
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
          <div>
            <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Description</label>
            <InputText
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none"
              placeholder="Description"
            />
          </div>
        </div>
      </Dialog>

      {/* Export Dialog */}
      <Dialog
        visible={exportDialogVisible}
        onHide={() => setExportDialogVisible(false)}
        header="Export Blood Types"
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
            <span className="text-[11px] text-[#94a3b8]">{filteredData.length} rows · {selectedExportColumns.length} columns</span>
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
          {/* Header */}
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

          {/* Category + Framework Tabs + Copy */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#f1f5f9] bg-[#fafbfc]">
            <div className="flex items-center gap-3">
              {/* Category Tabs */}
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
              {/* Framework Tabs (frontend only) */}
              {tableCodeCategory === "frontend" && (
                <div className="flex items-center gap-1">
                  {(["react", "vue", "angular"] as const).map((fw) => {
                    const icons: Record<string, string> = { react: "⚛️", vue: "💚", angular: "🅰️" };
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

          {/* Code Block */}
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

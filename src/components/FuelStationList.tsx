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
import { Fuel, Plus, Pencil, Trash2, Download, RefreshCw, Search, EllipsisVertical, Check, X, ChevronDown, Columns3, Eye, EyeOff, Code2, Copy, MapPin, Filter } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface FuelStation {
  id: number;
  label: string;
  brand: string;
  availableFuelType: string[];
  stationType: "GAS" | "PETROL" | "EV" | "GAS_PETROL" | "GAS_EV" | "PETROL_EV" | "GAS_PETROL_EV";
  city: string;
  township: string;
  latitude: number;
  longitude: number;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const emptyFuelStation: FuelStation = {
  id: 0,
  label: "",
  brand: "",
  availableFuelType: [],
  stationType: "PETROL",
  city: "",
  township: "",
  latitude: 0,
  longitude: 0,
  description: "",
  status: "ACTIVE",
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
};

export const fuelStationMockData: FuelStation[] = [
  { id: 1, label: "Shwe Taung Fuel Hub", brand: "PTTEP", availableFuelType: ["Octane 92", "Octane 95", "Standard Diesel"], stationType: "PETROL", city: "Yangon", township: "Hlaing", latitude: 16.84527, longitude: 96.12348, description: "Main petrol fuel hub on Pyay Road serving Hlaing township with 24/7 operations", status: "ACTIVE", createdAt: "2024-01-10", updatedAt: "2026-01-15", deletedAt: null },
  { id: 2, label: "Golden Eagle EV Station", brand: "Tesla Supercharger", availableFuelType: ["EV DC Fast 150kW", "EV DC Ultra 350kW", "EV AC Level 2"], stationType: "EV", city: "Yangon", township: "Bahan", latitude: 16.82714, longitude: 96.14893, description: "Premium EV charging station near Inya Lake with fast charging capabilities", status: "ACTIVE", createdAt: "2024-02-05", updatedAt: "2026-02-10", deletedAt: null },
  { id: 3, label: "Mingalar Fuel Point", brand: "PTTEP", availableFuelType: ["Octane 92", "Octane 95", "Octane 97", "Standard Diesel", "Premium Diesel", "CNG Type 1"], stationType: "GAS_PETROL", city: "Mandalay", township: "Chanayethazan", latitude: 21.95624, longitude: 96.08352, description: "Gas and petrol station on 78th Street near Mandalay Palace with CNG and petrol availability", status: "ACTIVE", createdAt: "2024-02-20", updatedAt: "2026-01-28", deletedAt: null },
  { id: 4, label: "Star Energy Complex", brand: "Shell", availableFuelType: ["Octane 92", "Octane 95", "Premium Diesel", "EV DC Fast 50kW", "EV AC Level 2"], stationType: "PETROL_EV", city: "Yangon", township: "Mayangone", latitude: 16.85198, longitude: 96.13072, description: "Petrol and EV station on Pyay Road near Hledan Junction offering fuel and EV charging", status: "ACTIVE", createdAt: "2024-03-15", updatedAt: "2026-02-14", deletedAt: null },
  { id: 5, label: "Aung Yadana Gas Stop", brand: "Max Energy", availableFuelType: ["CNG Type 1", "CNG Type 2", "LPG Autogas"], stationType: "GAS", city: "Naypyidaw", township: "Zabuthiri", latitude: 19.76831, longitude: 96.07215, description: "Government district gas station on Taw Win Yadanar Road serving Naypyidaw with CNG and LPG", status: "ACTIVE", createdAt: "2024-04-01", updatedAt: "2026-01-20", deletedAt: null },
  { id: 6, label: "Green Power Charge Point", brand: "ChargePoint", availableFuelType: ["EV DC Fast 50kW", "EV DC Fast 150kW", "EV AC Level 2"], stationType: "EV", city: "Yangon", township: "Kamayut", latitude: 16.83124, longitude: 96.12916, description: "EV charging point near Hledan Junction and Yangon University area with student discounts", status: "ACTIVE", createdAt: "2024-04-18", updatedAt: "2026-02-22", deletedAt: null },
  { id: 7, label: "Pyay Road Fuel Center", brand: "Total Energies", availableFuelType: ["Octane 92", "Octane 95", "Octane 97", "Standard Diesel", "LPG Autogas", "EV DC Fast 50kW", "EV AC Level 2"], stationType: "GAS_PETROL_EV", city: "Yangon", township: "Insein", latitude: 16.90482, longitude: 96.09537, description: "Full-service fuel center on Pyay Road near Insein with petrol, gas and EV charging", status: "ACTIVE", createdAt: "2024-05-10", updatedAt: "2026-03-01", deletedAt: null },
  { id: 8, label: "Diamond Petrol Station", brand: "PTTEP", availableFuelType: ["Octane 92", "Octane 95", "Standard Diesel", "Premium Diesel"], stationType: "PETROL", city: "Mandalay", township: "Aungmyethazan", latitude: 21.97461, longitude: 96.10028, description: "Premium petrol station on 62nd Street near Mandalay Hill with car wash services", status: "INACTIVE", createdAt: "2024-06-01", updatedAt: "2026-02-05", deletedAt: null },
  { id: 9, label: "SunCharge Multi Hub", brand: "BP", availableFuelType: ["Octane 92", "Octane 95", "Standard Diesel", "CNG Type 1", "CNG Type 2", "EV DC Fast 150kW", "EV AC Level 2"], stationType: "GAS_PETROL_EV", city: "Yangon", township: "Thingangyun", latitude: 16.83975, longitude: 96.18462, description: "Full-service multi-fuel station on Waizayantar Road with petrol, gas and solar-powered EV chargers", status: "ACTIVE", createdAt: "2024-06-20", updatedAt: "2026-03-05", deletedAt: null },
  { id: 10, label: "Bay View Gas & EV Depot", brand: "Max Energy", availableFuelType: ["CNG Type 1", "LPG Autogas", "EV AC Level 2"], stationType: "GAS_EV", city: "Pathein", township: "Pathein", latitude: 16.78136, longitude: 94.73284, description: "Coastal gas and EV depot on Strand Road serving Ayeyarwady region with CNG and charging", status: "INACTIVE", createdAt: "2024-07-15", updatedAt: "2026-01-30", deletedAt: null },
];

const stationTypeOptions = [
  { label: "Gas", value: "GAS" },
  { label: "Petrol", value: "PETROL" },
  { label: "EV", value: "EV" },
  { label: "Gas + Petrol", value: "GAS_PETROL" },
  { label: "Gas + EV", value: "GAS_EV" },
  { label: "Petrol + EV", value: "PETROL_EV" },
  { label: "Gas + Petrol + EV", value: "GAS_PETROL_EV" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const stationTypeLabels: Record<string, string> = {
  GAS: "Gas",
  PETROL: "Petrol",
  EV: "EV",
  GAS_PETROL: "Gas + Petrol",
  GAS_EV: "Gas + EV",
  PETROL_EV: "Petrol + EV",
  GAS_PETROL_EV: "Gas + Petrol + EV",
};

// ── Table Code Strings ──
export const fuelStationReactTableCode = `import { useState, useRef, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';

const fuelStations = [
  { id: 1, label: 'Shwe Taung Fuel Hub', brand: 'PTTEP', availableFuelType: ['Octane 92', 'Octane 95', 'Standard Diesel'], stationType: 'PETROL', city: 'Yangon', township: 'Hlaing', latitude: 16.84527, longitude: 96.12348, description: 'Main petrol fuel hub', status: 'ACTIVE' },
  { id: 2, label: 'Golden Eagle EV Station', brand: 'Tesla Supercharger', availableFuelType: ['EV DC Fast 150kW', 'EV DC Ultra 350kW', 'EV AC Level 2'], stationType: 'EV', city: 'Yangon', township: 'Bahan', latitude: 16.82714, longitude: 96.14893, description: 'Premium EV charging', status: 'ACTIVE' },
  { id: 3, label: 'Star Energy Complex', brand: 'Shell', availableFuelType: ['Octane 92', 'Octane 95', 'Premium Diesel', 'EV DC Fast 50kW', 'EV AC Level 2'], stationType: 'PETROL_EV', city: 'Yangon', township: 'Mayangone', latitude: 16.85198, longitude: 96.13072, description: 'Petrol and EV station', status: 'ACTIVE' },
];

export default function FuelStationList() {
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data] = useState(fuelStations);

  const filteredData = useMemo(() => {
    if (!globalFilter.trim()) return data;
    const lower = globalFilter.toLowerCase();
    return data.filter(fs =>
      Object.values(fs).some(val =>
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [data, globalFilter]);

  const statusTemplate = (rowData) => (
    <span className={\`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full \${
      rowData.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
    }\`}>
      {rowData.status === 'ACTIVE' ? 'Active' : 'Inactive'}
    </span>
  );

  const fuelTypeTemplate = (rowData) => (
    <div className="flex flex-wrap gap-1">
      {rowData.availableFuelType.map(ft => (
        <span key={ft} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{ft}</span>
      ))}
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar left={() => <h3>Fuel Stations</h3>} />
      <DataTable
        value={filteredData}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[10, 50, 100]}
        globalFilter={globalFilter}
        emptyMessage="No fuel stations found."
        stripedRows
        removableSort
        rowHover
        size="small"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column field="label" header="Label" sortable />
        <Column field="brand" header="Brand" sortable />
        <Column field="availableFuelType" header="Fuel Types" body={fuelTypeTemplate} />
        <Column field="stationType" header="Station Type" sortable />
        <Column field="city" header="City" sortable />
        <Column field="township" header="Township" sortable />
        <Column field="description" header="Description" sortable />
        <Column field="status" header="Status" body={statusTemplate} sortable />
      </DataTable>
    </div>
  );
}`;

export const fuelStationVueTableCode = `<template>
  <div>
    <Toast ref="toast" />
    <Toolbar>
      <template #start>
        <h3>Fuel Stations</h3>
      </template>
    </Toolbar>
    <DataTable
      :value="filteredData"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[10, 50, 100]"
      stripedRows
      removableSort
      rowHover
      size="small"
    >
      <Column field="label" header="Label" sortable />
      <Column field="brand" header="Brand" sortable />
      <Column field="availableFuelType" header="Fuel Types">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <Tag v-for="ft in data.availableFuelType" :key="ft" :value="ft" severity="info" rounded />
          </div>
        </template>
      </Column>
      <Column field="stationType" header="Station Type" sortable />
      <Column field="city" header="City" sortable />
      <Column field="township" header="Township" sortable />
      <Column field="description" header="Description" sortable />
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

const fuelStations = ref([
  { id: 1, label: 'Shwe Taung Fuel Hub', brand: 'PTTEP', availableFuelType: ['Octane 92', 'Octane 95', 'Standard Diesel'], stationType: 'PETROL', city: 'Yangon', township: 'Hlaing', description: 'Main petrol fuel hub', status: 'ACTIVE' },
  { id: 2, label: 'Golden Eagle EV Station', brand: 'Tesla Supercharger', availableFuelType: ['EV DC Fast 150kW', 'EV DC Ultra 350kW', 'EV AC Level 2'], stationType: 'EV', city: 'Yangon', township: 'Bahan', description: 'Premium EV charging', status: 'ACTIVE' },
  { id: 3, label: 'Star Energy Complex', brand: 'Shell', availableFuelType: ['Octane 92', 'Octane 95', 'Premium Diesel', 'EV DC Fast 50kW', 'EV AC Level 2'], stationType: 'PETROL_EV', city: 'Yangon', township: 'Mayangone', description: 'Petrol and EV station', status: 'ACTIVE' },
]);

const globalFilter = ref('');

const filteredData = computed(() => {
  if (!globalFilter.value.trim()) return fuelStations.value;
  const lower = globalFilter.value.toLowerCase();
  return fuelStations.value.filter(fs =>
    Object.values(fs).some(val =>
      String(val).toLowerCase().includes(lower)
    )
  );
});
</script>`;

export const fuelStationAngularTableCode = `import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';

interface FuelStation {
  id: number;
  label: string;
  brand: string;
  availableFuelType: string[];
  stationType: string;
  city: string;
  township: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-fuel-station-list',
  standalone: true,
  imports: [TableModule, TagModule, ToolbarModule, ToastModule],
  template: \`
    <p-toast />
    <p-toolbar>
      <ng-template pTemplate="left">
        <h3>Fuel Stations</h3>
      </ng-template>
    </p-toolbar>
    <p-table
      [value]="filteredData"
      dataKey="id"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 50, 100]"
      stripedRows
      [rowHover]="true"
      size="small"
    >
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="label">Label <p-sortIcon field="label" /></th>
          <th pSortableColumn="brand">Brand <p-sortIcon field="brand" /></th>
          <th>Fuel Types</th>
          <th pSortableColumn="stationType">Station Type <p-sortIcon field="stationType" /></th>
          <th pSortableColumn="city">City <p-sortIcon field="city" /></th>
          <th pSortableColumn="township">Township <p-sortIcon field="township" /></th>
          <th pSortableColumn="description">Description <p-sortIcon field="description" /></th>
          <th pSortableColumn="status">Status <p-sortIcon field="status" /></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-fs>
        <tr>
          <td>{{ fs.label }}</td>
          <td>{{ fs.brand }}</td>
          <td>
            <p-tag *ngFor="let ft of fs.availableFuelType" [value]="ft" severity="info" [rounded]="true" />
          </td>
          <td>{{ fs.stationType }}</td>
          <td>{{ fs.city }}</td>
          <td>{{ fs.township }}</td>
          <td>{{ fs.description }}</td>
          <td><p-tag [value]="fs.status === 'ACTIVE' ? 'Active' : 'Inactive'"
            [severity]="fs.status === 'ACTIVE' ? 'success' : 'danger'" [rounded]="true" /></td>
        </tr>
      </ng-template>
    </p-table>
  \`
})
export class FuelStationListComponent implements OnInit {
  fuelStations: FuelStation[] = [
    { id: 1, label: 'Shwe Taung Fuel Hub', brand: 'PTTEP', availableFuelType: ['Octane 92', 'Octane 95', 'Standard Diesel'], stationType: 'PETROL', city: 'Yangon', township: 'Hlaing', description: 'Main petrol fuel hub', status: 'ACTIVE' },
    { id: 2, label: 'Golden Eagle EV Station', brand: 'Tesla Supercharger', availableFuelType: ['EV DC Fast 150kW', 'EV DC Ultra 350kW', 'EV AC Level 2'], stationType: 'EV', city: 'Yangon', township: 'Bahan', description: 'Premium EV charging', status: 'ACTIVE' },
    { id: 3, label: 'Star Energy Complex', brand: 'Shell', availableFuelType: ['Octane 92', 'Octane 95', 'Premium Diesel', 'EV DC Fast 50kW', 'EV AC Level 2'], stationType: 'PETROL_EV', city: 'Yangon', township: 'Mayangone', description: 'Petrol and EV station', status: 'ACTIVE' },
  ];
  globalFilter = '';
  filteredData: FuelStation[] = [];

  ngOnInit() {
    this.filteredData = [...this.fuelStations];
  }
}`;

export const fuelStationBackendCode = `// fuel-station.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { FuelStationService } from './fuel-station.service';
import { CreateFuelStationDto, UpdateFuelStationDto } from './fuel-station.dto';

@Controller('api/v1/fuel-stations')
export class FuelStationController {
  constructor(private readonly fuelStationService: FuelStationService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('stationType') stationType?: string,
    @Query('city') city?: string,
    @Query('sortBy') sortBy = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.fuelStationService.findAll({
      page, limit, search, status, stationType, city, sortBy, sortOrder,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.fuelStationService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateFuelStationDto) {
    return this.fuelStationService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateFuelStationDto) {
    return this.fuelStationService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.fuelStationService.remove(id);
  }
}

// fuel-station.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { FuelStation } from './entities/fuel-station.entity';

@Injectable()
export class FuelStationService {
  constructor(
    @InjectRepository(FuelStation)
    private repo: Repository<FuelStation>,
  ) {}

  async findAll(params: {
    page: number; limit: number; search?: string;
    status?: string; stationType?: string; city?: string;
    sortBy: string; sortOrder: 'ASC' | 'DESC';
  }) {
    const { page, limit, search, status, stationType, city, sortBy, sortOrder } = params;
    const where: FindOptionsWhere<FuelStation>[] = [];
    const baseWhere: any = { deletedAt: null };

    if (status) baseWhere.status = status;
    if (stationType) baseWhere.stationType = stationType;
    if (city) baseWhere.city = city;

    if (search) {
      where.push(
        { ...baseWhere, label: Like(\`%\${search}%\`) },
        { ...baseWhere, brand: Like(\`%\${search}%\`) },
        { ...baseWhere, city: Like(\`%\${search}%\`) },
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
    if (!item) throw new NotFoundException('Fuel station not found');
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
    return { success: true, message: 'Fuel station soft-deleted' };
  }
}`;

export function FuelStationList() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [fuelStations, setFuelStations] = useState<FuelStation[]>(fuelStationMockData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<FuelStation>(emptyFuelStation);
  const [submitted, setSubmitted] = useState(false);
  const actionMenuRef = useRef<Menu>(null);
  const activeRowRef = useRef<FuelStation | null>(null);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const columnsDropdownRef = useRef<HTMLDivElement>(null);
  const [tableCodePreviewOpen, setTableCodePreviewOpen] = useState(false);
  const [tableCodeCategory, setTableCodeCategory] = useState<"frontend" | "backend">("frontend");
  const [tableCodeFramework, setTableCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [tableCodeCopied, setTableCodeCopied] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  const exportColumns = [
    { field: "label" as keyof FuelStation, label: "Label" },
    { field: "brand" as keyof FuelStation, label: "Brand" },
    { field: "availableFuelType" as keyof FuelStation, label: "Fuel Types" },
    { field: "stationType" as keyof FuelStation, label: "Station Type" },
    { field: "city" as keyof FuelStation, label: "City" },
    { field: "township" as keyof FuelStation, label: "Township" },
    { field: "latitude" as keyof FuelStation, label: "Latitude" },
    { field: "longitude" as keyof FuelStation, label: "Longitude" },
    { field: "description" as keyof FuelStation, label: "Description" },
  ];

  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    exportColumns.map((c) => c.field)
  );

  const tableColumns = [
    { field: "label", label: "Label", default: true },
    { field: "brand", label: "Brand", default: true },
    { field: "availableFuelType", label: "Fuel Types", default: true },
    { field: "stationType", label: "Station Type", default: true },
    { field: "city", label: "City", default: true },
    { field: "township", label: "Township", default: true },
    { field: "geolocation", label: "Geolocation", default: false },
    { field: "description", label: "Description", default: true },
    { field: "status", label: "Status", default: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.filter((c) => c.default).map((c) => c.field)
  );

  const filteredData = useMemo(() => {
    let data = fuelStations;
    if (statusFilter !== "ALL") {
      data = data.filter((fs) => fs.status === statusFilter);
    }
    if (globalFilter.trim()) {
      const lower = globalFilter.toLowerCase();
      data = data.filter((fs) =>
        Object.values(fs).some((val) =>
          String(val).toLowerCase().includes(lower)
        )
      );
    }
    return data;
  }, [fuelStations, globalFilter, statusFilter]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (columnsDropdownRef.current && !columnsDropdownRef.current.contains(e.target as Node)) setColumnsDropdownOpen(false);
      if (statusFilterRef.current && !statusFilterRef.current.contains(e.target as Node)) setStatusFilterOpen(false);
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
          navigate(`/dashboard/fuel-stations/${activeRowRef.current.id}`);
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
    setFormData({ ...emptyFuelStation, id: Date.now(), createdAt: new Date().toISOString().split("T")[0], updatedAt: new Date().toISOString().split("T")[0] });
    setEditMode(false);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openEdit = (item: FuelStation) => {
    setFormData({ ...item });
    setEditMode(true);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const saveItem = () => {
    setSubmitted(true);
    if (!formData.label.trim() || !formData.brand.trim()) return;

    const updated = { ...formData, updatedAt: new Date().toISOString().split("T")[0] };

    if (editMode) {
      setFuelStations((prev) => prev.map((fs) => (fs.id === updated.id ? updated : fs)));
      toast.current?.show({ severity: "success", summary: "Updated", detail: `${updated.label} has been updated`, life: 3000 });
    } else {
      setFuelStations((prev) => [...prev, updated]);
      toast.current?.show({ severity: "success", summary: "Created", detail: `${updated.label} has been created`, life: 3000 });
    }
    setDialogVisible(false);
    setFormData(emptyFuelStation);
  };

  const confirmDelete = (item: FuelStation) => {
    confirmDialog({
      message: `Are you sure you want to delete "${item.label}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setFuelStations((prev) => prev.filter((fs) => fs.id !== item.id));
        toast.current?.show({ severity: "warn", summary: "Deleted", detail: `${item.label} has been removed`, life: 3000 });
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
    const rows = filteredData.map((fs) => cols.map((c) => escapeCSV(String(fs[c.field]))));
    const csv = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fuel_stations.csv";
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
    const worksheetData = [headers, ...filteredData.map((fs) => cols.map((c) => String(fs[c.field])))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fuel Stations");
    XLSX.writeFile(workbook, "fuel_stations.xlsx");
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
      body: filteredData.map((fs) => cols.map((c) => String(fs[c.field]))),
      startY: 20,
      headStyles: { fillColor: [240, 249, 255], textColor: [59, 130, 246], fontSize: 10 },
      bodyStyles: { fontSize: 10 },
    });
    doc.save("fuel_stations.pdf");
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  // ── Column Templates ──
  const labelBodyTemplate = (rowData: FuelStation) => (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-[#ecfdf5] flex items-center justify-center flex-shrink-0">
        <Fuel className="w-3.5 h-3.5 text-[#10b981]" />
      </div>
      <span className="text-[12px] text-[#0f172a] font-semibold">{rowData.label}</span>
    </div>
  );

  const brandBodyTemplate = (rowData: FuelStation) => (
    <span className="text-[12px] text-[#334155] font-medium">{rowData.brand}</span>
  );

  const fuelTypeBodyTemplate = (rowData: FuelStation) => (
    <div className="flex flex-wrap gap-1">
      {rowData.availableFuelType.map((ft) => (
        <span key={ft} className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#3b82f6]">
          {ft}
        </span>
      ))}
    </div>
  );

  const stationTypeBodyTemplate = (rowData: FuelStation) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      GAS: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]" },
      PETROL: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
      EV: { bg: "bg-[#ecfdf5]", text: "text-[#065f46]" },
      GAS_PETROL: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
      GAS_EV: { bg: "bg-[#f0fdfa]", text: "text-[#115e59]" },
      PETROL_EV: { bg: "bg-[#eef2ff]", text: "text-[#3730a3]" },
      GAS_PETROL_EV: { bg: "bg-[#faf5ff]", text: "text-[#6b21a8]" },
    };
    const color = colorMap[rowData.stationType] || colorMap.PETROL;
    return (
      <span className={`inline-flex items-center text-[10px] font-medium px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}>
        {stationTypeLabels[rowData.stationType]}
      </span>
    );
  };

  const cityBodyTemplate = (rowData: FuelStation) => (
    <span className="text-[12px] text-[#334155]">{rowData.city}</span>
  );

  const townshipBodyTemplate = (rowData: FuelStation) => (
    <span className="text-[12px] text-[#64748b]">{rowData.township}</span>
  );

  const geoBodyTemplate = (rowData: FuelStation) => (
    <div className="flex items-center gap-1.5">
      <MapPin className="w-3 h-3 text-[#e53935]" />
      <span className="text-[11px] text-[#64748b] font-mono">{rowData.latitude.toFixed(4)}, {rowData.longitude.toFixed(4)}</span>
    </div>
  );

  const descriptionBodyTemplate = (rowData: FuelStation) => (
    <span className="text-[12px] text-[#64748b] line-clamp-1 max-w-[220px]" title={rowData.description}>
      {rowData.description}
    </span>
  );

  const statusBodyTemplate = (rowData: FuelStation) => (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${
      rowData.status === "ACTIVE" ? "bg-[#f0fdf4] text-[#16a34a]" : "bg-[#f1f5f9] text-[#94a3b8]"
    }`}>
      {rowData.status === "ACTIVE" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {rowData.status === "ACTIVE" ? "Active" : "Inactive"}
    </span>
  );

  const actionBodyTemplate = (rowData: FuelStation) => (
    <div className="flex justify-center gap-1.5">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#eef2ff] transition-colors cursor-pointer text-[#6366f1] hover:bg-[#e0e7ff]"
        title="View"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/fuel-stations/${rowData.id}`);
        }}
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#fff7ed] transition-colors cursor-pointer text-[#f59e0b] hover:bg-[#ffedd5]"
        title="Edit"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/fuel-stations/${rowData.id}/edit`);
        }}
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const leftToolbarTemplate = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate("/dashboard/fuel-stations/add")}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-[13px] font-medium text-white bg-[#e53935] hover:bg-[#d32f2f] active:bg-[#c62828] transition-all cursor-pointer shadow-[0_1px_3px_rgba(229,57,53,0.3)] hover:shadow-[0_4px_12px_rgba(229,57,53,0.35)]"
      >
        <Plus className="w-4 h-4" />
        Add Fuel Station
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
              { key: "ALL" as const, label: "All Statuses", count: fuelStations.length },
              { key: "ACTIVE" as const, label: "Active", count: fuelStations.filter((fs) => fs.status === "ACTIVE").length },
              { key: "INACTIVE" as const, label: "Inactive", count: fuelStations.filter((fs) => fs.status === "INACTIVE").length },
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
        <h2 className="text-[15px] text-[#0f172a] font-semibold m-0">Fuel Stations</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search fuel stations..."
            className="!text-[13px] !py-2.5 !pl-10 !pr-4 !rounded-[10px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none !bg-[#f8fafc] !w-[280px]"
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
          onClick={() => {
            setFuelStations([...fuelStationMockData]);
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
      const codeMap: Record<string, string> = { react: fuelStationReactTableCode, vue: fuelStationVueTableCode, angular: fuelStationAngularTableCode };
      return codeMap[tableCodeFramework];
    }
    return fuelStationBackendCode;
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
      if (tableCodeFramework === "react") return "FuelStationList.tsx";
      if (tableCodeFramework === "vue") return "FuelStationList.vue";
      return "fuel-station-list.component.ts";
    }
    return "fuel-station.controller.ts";
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
          <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] flex items-center justify-center">
            <Fuel className="w-4 h-4 text-[#10b981]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">Station Management</h1>
            <p className="text-[12px] text-[#94a3b8]">Master Data and Setup › Fuel Station › List</p>
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
          emptyMessage="No fuel stations found."
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
          {visibleColumns.includes("label") && (
            <Column field="label" header="Label" body={labelBodyTemplate} sortable style={{ minWidth: "200px" }} />
          )}
          {visibleColumns.includes("brand") && (
            <Column field="brand" header="Brand" body={brandBodyTemplate} sortable style={{ minWidth: "150px" }} />
          )}
          {visibleColumns.includes("availableFuelType") && (
            <Column field="availableFuelType" header="Fuel Types" body={fuelTypeBodyTemplate} style={{ minWidth: "200px" }} />
          )}
          {visibleColumns.includes("stationType") && (
            <Column field="stationType" header="Station Type" body={stationTypeBodyTemplate} sortable style={{ minWidth: "140px" }} />
          )}
          {visibleColumns.includes("city") && (
            <Column field="city" header="City" body={cityBodyTemplate} sortable style={{ minWidth: "110px" }} />
          )}
          {visibleColumns.includes("township") && (
            <Column field="township" header="Township" body={townshipBodyTemplate} sortable style={{ minWidth: "130px" }} />
          )}
          {visibleColumns.includes("geolocation") && (
            <Column header="Geolocation" body={geoBodyTemplate} style={{ minWidth: "180px" }} />
          )}
          {visibleColumns.includes("description") && (
            <Column field="description" header="Description" body={descriptionBodyTemplate} sortable style={{ minWidth: "200px" }} />
          )}
          {visibleColumns.includes("status") && (
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "110px" }} />
          )}
          <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: "90px" }} frozen alignFrozen="right" />
        </DataTable>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editMode ? "Edit Fuel Station" : "New Fuel Station"}
        footer={dialogFooter}
        modal
        dismissableMask
        draggable={false}
        className="!w-[560px] !rounded-[12px]"
        contentClassName="!px-6 !py-4"
        headerClassName="!px-6 !py-4 !border-b !border-[#e2e8f0]"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Label *</label>
            <InputText
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !formData.label.trim() ? "!border-[#e53935]" : ""}`}
              placeholder="e.g. Shwe Taung Fuel Hub"
            />
            {submitted && !formData.label.trim() && <small className="text-[11px] text-[#e53935] mt-1">Label is required</small>}
          </div>
          <div>
            <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Brand *</label>
            <InputText
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !formData.brand.trim() ? "!border-[#e53935]" : ""}`}
              placeholder="e.g. PTTEP"
            />
            {submitted && !formData.brand.trim() && <small className="text-[11px] text-[#e53935] mt-1">Brand is required</small>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Station Type</label>
              <Dropdown
                value={formData.stationType}
                options={stationTypeOptions}
                onChange={(e) => setFormData({ ...formData, stationType: e.value })}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">City</label>
              <InputText
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none"
                placeholder="e.g. Yangon"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Township</label>
              <InputText
                value={formData.township}
                onChange={(e) => setFormData({ ...formData, township: e.target.value })}
                className="!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none"
                placeholder="e.g. Hlaing"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Latitude</label>
              <InputText
                value={String(formData.latitude)}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none"
                placeholder="e.g. 16.8409"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Longitude</label>
              <InputText
                value={String(formData.longitude)}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none"
                placeholder="e.g. 96.1285"
              />
            </div>
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
        header="Export Fuel Stations"
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

import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Checkbox } from "primereact/checkbox";
import { Menu } from "primereact/menu";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { User, Download, RefreshCw, Search, Check, X, ChevronDown, Columns3, Eye, EyeOff, Filter, FileSpreadsheet, FileText, Pencil, Trash2, EllipsisVertical, MapPin, Hash, ImageIcon, Plus } from "lucide-react";
import { motion } from "motion/react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Types ──
export type ProfileStatus = "UNDER_REVIEW" | "REJECT" | "APPROVE";

export interface DriverProfile {
  id: number;
  driverId: string;
  profileImage: string;
  name: string;
  currentAddress: string;
  regionAndState: string;
  city: string;
  township: string;
  postalCode: string;
  status: ProfileStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ── Mock Data ──
const mockData: DriverProfile[] = [
  { id: 1, driverId: "DRV-001", profileImage: "https://images.unsplash.com/photo-1551917594-c1080fdeceae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Aung Min Htut", currentAddress: "No. 45, Pyay Road, Kamayut", regionAndState: "Yangon Region", city: "Yangon", township: "Kamayut", postalCode: "11041", status: "APPROVE", createdAt: "2024-01-15", updatedAt: "2026-02-20", deletedAt: null },
  { id: 2, driverId: "DRV-002", profileImage: "https://images.unsplash.com/photo-1768017092992-4c2045cd668b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Thida Myint", currentAddress: "No. 12, Bo Aung Kyaw St", regionAndState: "Yangon Region", city: "Yangon", township: "Botahtaung", postalCode: "11161", status: "APPROVE", createdAt: "2024-02-10", updatedAt: "2026-01-18", deletedAt: null },
  { id: 3, driverId: "DRV-003", profileImage: "https://images.unsplash.com/photo-1749003659356-1d1a4451a49d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Kyaw Zin Htet", currentAddress: "No. 78, 66th Street", regionAndState: "Mandalay Region", city: "Mandalay", township: "Chan Aye Thar Zan", postalCode: "05011", status: "UNDER_REVIEW", createdAt: "2024-03-05", updatedAt: "2026-03-01", deletedAt: null },
  { id: 4, driverId: "DRV-004", profileImage: "https://images.unsplash.com/photo-1770576934845-759db89fcd3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Su Su Lwin", currentAddress: "No. 23, Strand Road", regionAndState: "Yangon Region", city: "Yangon", township: "Kyauktada", postalCode: "11182", status: "APPROVE", createdAt: "2024-04-18", updatedAt: "2026-02-14", deletedAt: null },
  { id: 5, driverId: "DRV-005", profileImage: "https://images.unsplash.com/photo-1771924369256-fdd856822db3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Min Thu Aung", currentAddress: "No. 56, Bogyoke Aung San Road", regionAndState: "Yangon Region", city: "Yangon", township: "Pabedan", postalCode: "11143", status: "REJECT", createdAt: "2024-05-22", updatedAt: "2026-01-30", deletedAt: null },
  { id: 6, driverId: "DRV-006", profileImage: "https://images.unsplash.com/photo-1625900172227-99d357eea494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Hnin Ei Phyu", currentAddress: "No. 9, University Avenue", regionAndState: "Yangon Region", city: "Yangon", township: "Bahan", postalCode: "11201", status: "APPROVE", createdAt: "2024-06-08", updatedAt: "2026-02-28", deletedAt: null },
  { id: 7, driverId: "DRV-007", profileImage: "https://images.unsplash.com/photo-1751842839301-8a57a05f9904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Ye Yint Aung", currentAddress: "No. 34, Anawrahta Road", regionAndState: "Yangon Region", city: "Yangon", township: "Lanmadaw", postalCode: "11131", status: "REJECT", createdAt: "2024-07-14", updatedAt: "2026-01-10", deletedAt: "2026-01-10" },
  { id: 8, driverId: "DRV-008", profileImage: "https://images.unsplash.com/photo-1708491191986-f7a710ee4675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Thin Thin Aye", currentAddress: "No. 67, Bayint Naung Road", regionAndState: "Yangon Region", city: "Yangon", township: "Hlaing", postalCode: "11051", status: "APPROVE", createdAt: "2024-08-20", updatedAt: "2026-03-05", deletedAt: null },
  { id: 9, driverId: "DRV-009", profileImage: "https://images.unsplash.com/photo-1745240261519-0b988d54d098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Hla Myo Win", currentAddress: "No. 15, 78th Street", regionAndState: "Mandalay Region", city: "Mandalay", township: "Maha Aung Myay", postalCode: "05012", status: "UNDER_REVIEW", createdAt: "2024-09-01", updatedAt: "2026-02-22", deletedAt: null },
  { id: 10, driverId: "DRV-010", profileImage: "https://images.unsplash.com/photo-1695800998493-ccff5ea292ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Wai Yan Phyo", currentAddress: "No. 88, Kaba Aye Pagoda Road", regionAndState: "Yangon Region", city: "Yangon", township: "Mayangone", postalCode: "11061", status: "APPROVE", createdAt: "2024-10-12", updatedAt: "2026-03-10", deletedAt: null },
  { id: 11, driverId: "DRV-011", profileImage: "https://images.unsplash.com/photo-1770364017468-e755d33941e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Nwe Nwe Htun", currentAddress: "No. 42, Merchant Street", regionAndState: "Yangon Region", city: "Yangon", township: "Pabedan", postalCode: "11143", status: "APPROVE", createdAt: "2024-11-05", updatedAt: "2026-02-15", deletedAt: null },
  { id: 12, driverId: "DRV-012", profileImage: "https://images.unsplash.com/photo-1770392988936-dc3d8581e0c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Zaw Min Oo", currentAddress: "No. 31, Sagaing-Mandalay Road", regionAndState: "Sagaing Region", city: "Sagaing", township: "Sagaing", postalCode: "02011", status: "REJECT", createdAt: "2024-12-01", updatedAt: "2026-01-25", deletedAt: null },
  { id: 13, driverId: "DRV-013", profileImage: "https://images.unsplash.com/photo-1745869482293-902065d1ad5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "May Thu Zar", currentAddress: "No. 19, Lower Pazundaung Road", regionAndState: "Yangon Region", city: "Yangon", township: "Pazundaung", postalCode: "11171", status: "UNDER_REVIEW", createdAt: "2025-01-08", updatedAt: "2026-03-08", deletedAt: null },
  { id: 14, driverId: "DRV-014", profileImage: "https://images.unsplash.com/photo-1535213679542-f42b6f164647?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Kaung Myat Thu", currentAddress: "No. 55, Naypyidaw-Mandalay Road", regionAndState: "Naypyidaw Union Territory", city: "Naypyidaw", township: "Zabuthiri", postalCode: "15011", status: "APPROVE", createdAt: "2025-02-14", updatedAt: "2026-02-10", deletedAt: null },
  { id: 15, driverId: "DRV-015", profileImage: "https://images.unsplash.com/photo-1619671030981-df6d493354bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", name: "Ei Mon Kyaw", currentAddress: "No. 7, Thanlwin Road", regionAndState: "Yangon Region", city: "Yangon", township: "Bahan", postalCode: "11201", status: "APPROVE", createdAt: "2025-03-20", updatedAt: "2026-03-12", deletedAt: null },
];

const statusStyles: Record<ProfileStatus, { text: string; bg: string; dot: string }> = {
  UNDER_REVIEW: { text: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
  REJECT: { text: "#e53935", bg: "#fef2f2", dot: "#ef4444" },
  APPROVE: { text: "#16a34a", bg: "#f0fdf4", dot: "#22c55e" },
};

const statusLabels: Record<ProfileStatus, string> = {
  UNDER_REVIEW: "Under Review",
  REJECT: "Rejected",
  APPROVE: "Approved",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function DriverProfileList() {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [data, setData] = useState<DriverProfile[]>(mockData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const columnsDropdownRef = useRef<HTMLDivElement>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProfileStatus>("ALL");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<Menu>(null);
  const activeRowRef = useRef<DriverProfile | null>(null);
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [regionFilterOpen, setRegionFilterOpen] = useState(false);
  const regionFilterRef = useRef<HTMLDivElement>(null);

  // Pick up new profiles from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem("newDriverProfile");
    if (stored) {
      try {
        const newProfiles: DriverProfile[] = JSON.parse(stored);
        if (newProfiles.length > 0) {
          setData((prev) => [...newProfiles, ...prev]);
          sessionStorage.removeItem("newDriverProfile");
        }
      } catch { /* ignore */ }
    }
  }, []);

  // Get unique regions from data
  const uniqueRegions = useMemo(() => {
    const regions = [...new Set(data.map((d) => d.regionAndState))];
    return regions.sort();
  }, [data]);

  // Animated toast state
  const [successToasts, setSuccessToasts] = useState<{ id: number; title: string; description: string }[]>([]);

  const showSuccessToast = (title: string, description: string) => {
    const id = Date.now();
    setSuccessToasts((prev) => [...prev, { id, title, description }]);
    setTimeout(() => setSuccessToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const exportColumns = [
    { field: "driverId" as keyof DriverProfile, label: "Driver ID" },
    { field: "name" as keyof DriverProfile, label: "Name" },
    { field: "currentAddress" as keyof DriverProfile, label: "Current Address" },
    { field: "regionAndState" as keyof DriverProfile, label: "Region & State" },
    { field: "city" as keyof DriverProfile, label: "City" },
    { field: "township" as keyof DriverProfile, label: "Township" },
    { field: "postalCode" as keyof DriverProfile, label: "Postal Code" },
    { field: "status" as keyof DriverProfile, label: "Status" },
    { field: "createdAt" as keyof DriverProfile, label: "Created At" },
    { field: "updatedAt" as keyof DriverProfile, label: "Updated At" },
    { field: "deletedAt" as keyof DriverProfile, label: "Deleted At" },
  ];

  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    exportColumns.map((c) => c.field)
  );

  const tableColumns = [
    { field: "driverId", label: "Driver ID", default: true },
    { field: "name", label: "Name", default: true },
    { field: "currentAddress", label: "Current Address", default: true },
    { field: "regionAndState", label: "Region & State", default: true },
    { field: "city", label: "City", default: true },
    { field: "township", label: "Township", default: true },
    { field: "postalCode", label: "Postal Code", default: true },
    { field: "status", label: "Status", default: true },
    { field: "createdAt", label: "Created At", default: false },
    { field: "updatedAt", label: "Updated", default: true },
    { field: "deletedAt", label: "Deleted At", default: false },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.map((c) => c.field)
  );

  const filteredData = useMemo(() => {
    let result = data;
    if (globalFilter.trim()) {
      const lower = globalFilter.toLowerCase();
      result = result.filter((d) =>
        Object.values(d).some((val) =>
          String(val).toLowerCase().includes(lower)
        )
      );
    }
    if (statusFilter !== "ALL") {
      result = result.filter((d) => d.status === statusFilter);
    }
    if (regionFilter !== "ALL") {
      result = result.filter((d) => d.regionAndState === regionFilter);
    }
    return result;
  }, [data, globalFilter, statusFilter, regionFilter]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (columnsDropdownRef.current && !columnsDropdownRef.current.contains(e.target as Node)) setColumnsDropdownOpen(false);
      if (statusFilterRef.current && !statusFilterRef.current.contains(e.target as Node)) setStatusFilterOpen(false);
      if (regionFilterRef.current && !regionFilterRef.current.contains(e.target as Node)) setRegionFilterOpen(false);
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
          navigate(`/dashboard/driver-profiles/${activeRowRef.current.id}`);
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
        if (activeRowRef.current) {
          showSuccessToast("Edit Profile", `Editing profile for ${activeRowRef.current.name}`);
        }
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

  const confirmDelete = (item: DriverProfile) => {
    confirmDialog({
      message: `Are you sure you want to delete the profile for "${item.name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setData((prev) => prev.filter((d) => d.id !== item.id));
        toast.current?.show({ severity: "warn", summary: "Deleted", detail: `${item.name} profile has been removed`, life: 3000 });
      },
    });
  };

  // ── Export Functions ──
  const exportCSV = () => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) { toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column", life: 3000 }); return; }
    const headers = cols.map((c) => c.label);
    const escapeCSV = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) return `"${val.replace(/"/g, '""')}"`;
      return val;
    };
    const rows = filteredData.map((d) => cols.map((c) => escapeCSV(String(d[c.field]))));
    const csv = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "driver_profiles.csv"; a.click();
    URL.revokeObjectURL(url);
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  const exportExcel = () => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) { toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column", life: 3000 }); return; }
    const headers = cols.map((c) => c.label);
    const worksheetData = [headers, ...filteredData.map((d) => cols.map((c) => String(d[c.field])))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Driver Profiles");
    XLSX.writeFile(workbook, "driver_profiles.xlsx");
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  const exportPDF = () => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) { toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column", life: 3000 }); return; }
    const headers = cols.map((c) => c.label);
    const doc = new jsPDF();
    autoTable(doc, {
      head: [headers],
      body: filteredData.map((d) => cols.map((c) => String(d[c.field]))),
      startY: 20,
      headStyles: { fillColor: [239, 246, 255], textColor: [37, 99, 235], fontSize: 10 },
      bodyStyles: { fontSize: 10 },
    });
    doc.save("driver_profiles.pdf");
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  // ── Body Templates ──
  const profileBodyTemplate = (rowData: DriverProfile) => (
    <div className="flex items-center gap-2">
      <img
        src={rowData.profileImage}
        alt={rowData.name}
        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
      />
      <span className="text-[12px] text-[#0f172a] font-semibold">{rowData.name}</span>
    </div>
  );

  const addressBodyTemplate = (rowData: DriverProfile) => (
    <div className="flex items-center gap-1.5">
      <MapPin className="w-3 h-3 text-[#94a3b8] shrink-0" />
      <span className="text-[12px] text-[#334155] truncate max-w-[200px]" title={rowData.currentAddress}>{rowData.currentAddress}</span>
    </div>
  );

  const statusBodyTemplate = (rowData: DriverProfile) => {
    const s = statusStyles[rowData.status];
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
        style={{ color: s.text, backgroundColor: s.bg }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
        {statusLabels[rowData.status]}
      </span>
    );
  };

  const actionBodyTemplate = (rowData: DriverProfile) => (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#eef2ff] transition-colors cursor-pointer text-[#6366f1] hover:bg-[#e0e7ff]"
        title="View"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/driver-profiles/${rowData.id}`);
        }}
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
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
      
    </div>
  );

  const rightToolbarTemplate = () => (
    <div className="flex items-center gap-2">
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
          {statusFilter === "ALL" ? "Status" : statusLabels[statusFilter]}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${statusFilterOpen ? "rotate-180" : ""}`} />
        </button>
        {statusFilterOpen && (
          <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#e2e8f0] rounded-[10px] shadow-lg z-50 min-w-[160px] py-1.5 overflow-hidden">
            {([
              { key: "ALL" as const, label: "All Statuses", count: data.length },
              { key: "UNDER_REVIEW" as const, label: "Under Review", count: data.filter((d) => d.status === "UNDER_REVIEW").length },
              { key: "APPROVE" as const, label: "Approved", count: data.filter((d) => d.status === "APPROVE").length },
              { key: "REJECT" as const, label: "Rejected", count: data.filter((d) => d.status === "REJECT").length },
            ] as { key: "ALL" | ProfileStatus; label: string; count: number }[]).map((opt) => (
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
      {/* Region Filter */}
      <div className="relative" ref={regionFilterRef}>
        <button
          onClick={() => setRegionFilterOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer border ${
            regionFilter !== "ALL"
              ? "border-[#6366f1] bg-[#eef2ff] text-[#6366f1]"
              : "border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]"
          }`}
        >
          <MapPin className="w-4 h-4" />
          {regionFilter === "ALL" ? "Region" : regionFilter}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${regionFilterOpen ? "rotate-180" : ""}`} />
        </button>
        {regionFilterOpen && (
          <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#e2e8f0] rounded-[10px] shadow-lg z-50 min-w-[160px] py-1.5 overflow-hidden">
            {([
              { key: "ALL" as const, label: "All Regions", count: data.length },
              ...uniqueRegions.map((region) => ({ key: region, label: region, count: data.filter((d) => d.regionAndState === region).length })),
            ] as { key: "ALL" | string; label: string; count: number }[]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setRegionFilter(opt.key);
                  setRegionFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-[12px] transition-colors cursor-pointer ${
                  regionFilter === opt.key
                    ? "bg-[#eef2ff] text-[#6366f1] font-medium"
                    : "text-[#475569] hover:bg-[#f8fafc]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {regionFilter === opt.key && <Check className="w-3.5 h-3.5" />}
                  <span className={regionFilter === opt.key ? "" : "ml-5.5"}>{opt.label}</span>
                </div>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  regionFilter === opt.key
                    ? "bg-[#6366f1] text-white"
                    : "bg-[#f1f5f9] text-[#94a3b8]"
                }`}>
                  {opt.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-[15px] text-[#0f172a] font-semibold m-0">Driver Profiles</h2>
        <span className="text-[11px] text-[#94a3b8]">{filteredData.length} total profiles</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search profiles..."
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
            setData([...mockData]);
            toast.current?.show({ severity: "info", summary: "Refreshed", detail: "Data has been reset", life: 2000 });
          }}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
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
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center">
              <User className="w-4 h-4 text-[#2563eb]" />
            </div>
            <div>
              <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">
                Driver Profile
              </h1>
              <p className="text-[12px] text-[#94a3b8]">
                Manage driver address and location profiles
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/driver-profiles/add")}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Profile
          </button>
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
          emptyMessage="No driver profiles found."
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
          {visibleColumns.includes("driverId") && (
            <Column field="driverId" header="Driver ID" sortable style={{ minWidth: "120px" }} body={(rowData: DriverProfile) => (
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#6366f1] font-mono font-medium px-2 py-0.5 rounded-md bg-[#eef2ff]">
                <Hash className="w-3 h-3" />
                {rowData.driverId}
              </span>
            )} />
          )}
          {/* Remove profileImage column */}
          {visibleColumns.includes("name") && (
            <Column field="name" header="Name" body={profileBodyTemplate} sortable style={{ minWidth: "180px" }} />
          )}
          {visibleColumns.includes("currentAddress") && (
            <Column field="currentAddress" header="Current Address" body={addressBodyTemplate} sortable style={{ minWidth: "220px" }} />
          )}
          {visibleColumns.includes("regionAndState") && (
            <Column field="regionAndState" header="Region & State" sortable style={{ minWidth: "170px" }} body={(rowData: DriverProfile) => (
              <span className="text-[12px] text-[#334155]">{rowData.regionAndState}</span>
            )} />
          )}
          {visibleColumns.includes("city") && (
            <Column field="city" header="City" sortable style={{ minWidth: "120px" }} body={(rowData: DriverProfile) => (
              <span className="text-[12px] text-[#334155]">{rowData.city}</span>
            )} />
          )}
          {visibleColumns.includes("township") && (
            <Column field="township" header="Township" sortable style={{ minWidth: "160px" }} body={(rowData: DriverProfile) => (
              <span className="text-[12px] text-[#64748b]">{rowData.township}</span>
            )} />
          )}
          {visibleColumns.includes("postalCode") && (
            <Column field="postalCode" header="Postal Code" sortable style={{ minWidth: "120px" }} body={(rowData: DriverProfile) => (
              <span className="text-[12px] text-[#334155] font-mono">{rowData.postalCode}</span>
            )} />
          )}
          {visibleColumns.includes("status") && (
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "130px" }} />
          )}
          {visibleColumns.includes("createdAt") && (
            <Column field="createdAt" header="Created At" sortable style={{ minWidth: "130px" }} body={(rowData: DriverProfile) => (
              <span className="text-[12px] text-[#64748b]">{formatDate(rowData.createdAt)}</span>
            )} />
          )}
          {visibleColumns.includes("updatedAt") && (
            <Column field="updatedAt" header="Updated" sortable style={{ minWidth: "130px" }} body={(rowData: DriverProfile) => (
              <span className="text-[12px] text-[#64748b]">{formatDate(rowData.updatedAt)}</span>
            )} />
          )}
          {visibleColumns.includes("deletedAt") && (
            <Column field="deletedAt" header="Deleted At" sortable style={{ minWidth: "130px" }} body={(rowData: DriverProfile) => (
              <span className={`text-[12px] ${rowData.deletedAt ? "text-[#e53935]" : "text-[#cbd5e1]"}`}>
                {rowData.deletedAt ? formatDate(rowData.deletedAt) : "\u2014"}
              </span>
            )} />
          )}
          <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: "100px" }} frozen alignFrozen="right" />
        </DataTable>
      </div>

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
                    exportFormat === fmt.key
                      ? ""
                      : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                  }`}
                  style={{
                    borderColor: exportFormat === fmt.key ? fmt.color : undefined,
                    backgroundColor: exportFormat === fmt.key ? fmt.color + "08" : undefined,
                  }}
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

      {/* Animated Success Toast Notifications */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {successToasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="bg-white rounded-[12px] border border-[#e2e8f0] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4 min-w-[340px] pointer-events-auto overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-[#16a34a]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#0f172a] font-semibold">{t.title}</p>
                <p className="text-[11px] text-[#64748b] mt-0.5">{t.description}</p>
              </div>
              <button
                onClick={() => setSuccessToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Green gradient progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              className="h-[3px] bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full mt-3"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
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
import { Car, Download, RefreshCw, Search, Check, X, ChevronDown, Columns3, Eye, EyeOff, Filter, FileSpreadsheet, FileText, Pencil, Trash2, EllipsisVertical, Hash, Phone, UserCheck, UserX } from "lucide-react";
import { motion } from "motion/react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Types ──
export type VehicleStatus = "UNDER_REVIEW" | "REJECT" | "APPROVED";

export interface VehicleProfileData {
  id: number;
  driverId: string;
  vehicleId: string;
  driverName: string;
  driverGender: "MALE" | "FEMALE";
  driverProfileImage: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleColor: string;
  vehiclePlateNumber: string;
  fuelType: string;
  isOwner: boolean;
  ownerName: string | null;
  ownerContactNumber: string | null;
  vehicleRegistrationIssueDate: string;
  vehicleRegistrationExpiryDate: string;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ── Mock Data ──
const mockData: VehicleProfileData[] = [
  { id: 1, driverId: "DRV-001", vehicleId: "VEH-001", driverName: "Aung Min Htut", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1615524376009-e7f29add6ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Sedan", vehicleBrand: "Toyota", vehicleModel: "Vios", vehicleYear: 2022, vehicleColor: "White", vehiclePlateNumber: "7G/3456", fuelType: "Petrol", isOwner: true, ownerName: null, ownerContactNumber: null, vehicleRegistrationIssueDate: "2022-03-15", vehicleRegistrationExpiryDate: "2027-03-14", status: "APPROVED", createdAt: "2024-01-10", updatedAt: "2025-01-15", deletedAt: null },
  { id: 2, driverId: "DRV-002", vehicleId: "VEH-002", driverName: "Kyaw Zin Oo", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1729824186698-72333f7e92da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Sedan", vehicleBrand: "Suzuki", vehicleModel: "Ciaz", vehicleYear: 2021, vehicleColor: "Silver", vehiclePlateNumber: "5B/7891", fuelType: "Petrol", isOwner: true, ownerName: null, ownerContactNumber: null, vehicleRegistrationIssueDate: "2021-07-20", vehicleRegistrationExpiryDate: "2026-07-19", status: "APPROVED", createdAt: "2023-06-15", updatedAt: "2024-12-20", deletedAt: null },
  { id: 3, driverId: "DRV-003", vehicleId: "VEH-003", driverName: "Thiha Zaw", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1488820098099-8d4a4723a490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Sedan", vehicleBrand: "Honda", vehicleModel: "City", vehicleYear: 2023, vehicleColor: "Red", vehiclePlateNumber: "9A/2345", fuelType: "Petrol", isOwner: false, ownerName: "U Tin Aung", ownerContactNumber: "09-789456123", vehicleRegistrationIssueDate: "2023-02-10", vehicleRegistrationExpiryDate: "2028-02-09", status: "UNDER_REVIEW", createdAt: "2023-01-05", updatedAt: "2025-03-11", deletedAt: null },
  { id: 4, driverId: "DRV-004", vehicleId: "VEH-004", driverName: "Myo Win Aung", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1640658506905-351be27a1c14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Pickup", vehicleBrand: "Toyota", vehicleModel: "Hilux", vehicleYear: 2020, vehicleColor: "Black", vehiclePlateNumber: "3D/6789", fuelType: "Diesel", isOwner: true, ownerName: null, ownerContactNumber: null, vehicleRegistrationIssueDate: "2020-11-05", vehicleRegistrationExpiryDate: "2025-11-04", status: "APPROVED", createdAt: "2020-10-28", updatedAt: "2024-08-10", deletedAt: null },
  { id: 5, driverId: "DRV-005", vehicleId: "VEH-005", driverName: "Htet Aung Shine", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1615524376009-e7f29add6ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Sedan", vehicleBrand: "Hyundai", vehicleModel: "Accent", vehicleYear: 2023, vehicleColor: "Blue", vehiclePlateNumber: "7C/1122", fuelType: "CNG", isOwner: true, ownerName: null, ownerContactNumber: null, vehicleRegistrationIssueDate: "2023-04-18", vehicleRegistrationExpiryDate: "2028-04-17", status: "APPROVED", createdAt: "2023-02-20", updatedAt: "2025-02-28", deletedAt: null },
  { id: 6, driverId: "DRV-006", vehicleId: "VEH-006", driverName: "Zaw Min Tun", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1729824186698-72333f7e92da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Sedan", vehicleBrand: "Nissan", vehicleModel: "Almera", vehicleYear: 2019, vehicleColor: "Gray", vehiclePlateNumber: "4A/3344", fuelType: "Petrol", isOwner: false, ownerName: "Daw Khin Mar", ownerContactNumber: "09-456789012", vehicleRegistrationIssueDate: "2019-10-12", vehicleRegistrationExpiryDate: "2024-10-11", status: "REJECT", createdAt: "2019-09-05", updatedAt: "2024-01-18", deletedAt: null },
  { id: 7, driverId: "DRV-007", vehicleId: "VEH-007", driverName: "Naing Lin Aung", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1488820098099-8d4a4723a490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Van", vehicleBrand: "Toyota", vehicleModel: "Probox", vehicleYear: 2018, vehicleColor: "White", vehiclePlateNumber: "8B/5566", fuelType: "Petrol", isOwner: false, ownerName: "U Kyaw Soe", ownerContactNumber: "09-112233445", vehicleRegistrationIssueDate: "2018-08-01", vehicleRegistrationExpiryDate: "2023-07-31", status: "REJECT", createdAt: "2018-06-25", updatedAt: "2024-07-01", deletedAt: "2024-08-15" },
  { id: 8, driverId: "DRV-008", vehicleId: "VEH-008", driverName: "Phyo Wai Lin", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1640658506905-351be27a1c14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Hatchback", vehicleBrand: "Honda", vehicleModel: "Fit", vehicleYear: 2022, vehicleColor: "Green", vehiclePlateNumber: "6C/7788", fuelType: "Hybrid", isOwner: true, ownerName: null, ownerContactNumber: null, vehicleRegistrationIssueDate: "2022-05-22", vehicleRegistrationExpiryDate: "2027-05-21", status: "APPROVED", createdAt: "2022-04-01", updatedAt: "2025-04-10", deletedAt: null },
  { id: 9, driverId: "DRV-009", vehicleId: "VEH-009", driverName: "Than Htun Oo", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1615524376009-e7f29add6ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Hatchback", vehicleBrand: "Suzuki", vehicleModel: "Swift", vehicleYear: 2021, vehicleColor: "Yellow", vehiclePlateNumber: "2A/9900", fuelType: "LPG", isOwner: true, ownerName: null, ownerContactNumber: null, vehicleRegistrationIssueDate: "2021-06-10", vehicleRegistrationExpiryDate: "2026-06-09", status: "UNDER_REVIEW", createdAt: "2021-04-28", updatedAt: "2025-06-01", deletedAt: null },
  { id: 10, driverId: "DRV-010", vehicleId: "VEH-010", driverName: "Wai Yan Hein", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1729824186698-72333f7e92da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Hatchback", vehicleBrand: "Toyota", vehicleModel: "Aqua", vehicleYear: 2020, vehicleColor: "White", vehiclePlateNumber: "5D/1234", fuelType: "Hybrid", isOwner: true, ownerName: null, ownerContactNumber: null, vehicleRegistrationIssueDate: "2021-01-15", vehicleRegistrationExpiryDate: "2026-01-14", status: "APPROVED", createdAt: "2020-12-10", updatedAt: "2025-05-22", deletedAt: null },
  { id: 11, driverId: "DRV-011", vehicleId: "VEH-011", driverName: "Su Su Lwin", driverGender: "FEMALE", driverProfileImage: "https://images.unsplash.com/photo-1622757678076-b926a4295f29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Hatchback", vehicleBrand: "Kia", vehicleModel: "Picanto", vehicleYear: 2023, vehicleColor: "Pink", vehiclePlateNumber: "9B/5678", fuelType: "Petrol", isOwner: false, ownerName: "U Thein Win", ownerContactNumber: "09-998877665", vehicleRegistrationIssueDate: "2023-07-01", vehicleRegistrationExpiryDate: "2028-06-30", status: "APPROVED", createdAt: "2023-05-28", updatedAt: "2025-06-01", deletedAt: null },
  { id: 12, driverId: "DRV-012", vehicleId: "VEH-012", driverName: "Ye Yint Aung", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1488820098099-8d4a4723a490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Sedan", vehicleBrand: "Mitsubishi", vehicleModel: "Attrage", vehicleYear: 2022, vehicleColor: "Brown", vehiclePlateNumber: "3C/9012", fuelType: "Petrol", isOwner: true, ownerName: null, ownerContactNumber: null, vehicleRegistrationIssueDate: "2022-08-20", vehicleRegistrationExpiryDate: "2027-08-19", status: "APPROVED", createdAt: "2022-07-15", updatedAt: "2025-07-20", deletedAt: null },
  { id: 13, driverId: "DRV-013", vehicleId: "VEH-013", driverName: "May Thu Zar", driverGender: "FEMALE", driverProfileImage: "https://images.unsplash.com/photo-1697510364485-e900c2fe7524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Sedan", vehicleBrand: "Toyota", vehicleModel: "Yaris", vehicleYear: 2024, vehicleColor: "Red", vehiclePlateNumber: "7A/3456", fuelType: "Petrol", isOwner: true, ownerName: null, ownerContactNumber: null, vehicleRegistrationIssueDate: "2024-09-05", vehicleRegistrationExpiryDate: "2029-09-04", status: "APPROVED", createdAt: "2024-08-01", updatedAt: "2025-08-05", deletedAt: null },
  { id: 14, driverId: "DRV-014", vehicleId: "VEH-014", driverName: "Kaung Myat Thu", driverGender: "MALE", driverProfileImage: "https://images.unsplash.com/photo-1640658506905-351be27a1c14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Hatchback", vehicleBrand: "Nissan", vehicleModel: "March", vehicleYear: 2019, vehicleColor: "Orange", vehiclePlateNumber: "4B/7890", fuelType: "Electric", isOwner: false, ownerName: "Daw Aye Aye", ownerContactNumber: "09-334455667", vehicleRegistrationIssueDate: "2019-10-20", vehicleRegistrationExpiryDate: "2024-10-19", status: "UNDER_REVIEW", createdAt: "2019-09-05", updatedAt: "2024-09-10", deletedAt: null },
  { id: 15, driverId: "DRV-015", vehicleId: "VEH-015", driverName: "Ei Mon Kyaw", driverGender: "FEMALE", driverProfileImage: "https://images.unsplash.com/photo-1627839134971-162a787bf754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", vehicleType: "Hatchback", vehicleBrand: "Honda", vehicleModel: "Jazz", vehicleYear: 2023, vehicleColor: "White", vehiclePlateNumber: "6A/2345", fuelType: "Hybrid", isOwner: true, ownerName: null, ownerContactNumber: null, vehicleRegistrationIssueDate: "2023-11-01", vehicleRegistrationExpiryDate: "2028-10-31", status: "APPROVED", createdAt: "2023-09-28", updatedAt: "2025-10-01", deletedAt: null },
];

const statusStyles: Record<VehicleStatus, { text: string; bg: string; dot: string }> = {
  UNDER_REVIEW: { text: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
  REJECT: { text: "#e53935", bg: "#fef2f2", dot: "#ef4444" },
  APPROVED: { text: "#16a34a", bg: "#f0fdf4", dot: "#22c55e" },
};

const statusLabels: Record<VehicleStatus, string> = {
  UNDER_REVIEW: "Under Review",
  REJECT: "Rejected",
  APPROVED: "Approved",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const colorDot: Record<string, string> = {
  White: "#e2e8f0", Silver: "#cbd5e1", Black: "#1e293b", Red: "#ef4444",
  Blue: "#3b82f6", Gray: "#94a3b8", Green: "#22c55e", Yellow: "#eab308",
  Brown: "#92400e", Pink: "#ec4899", Orange: "#f97316",
};

export function VehicleProfile() {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [data, setData] = useState<VehicleProfileData[]>(mockData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const columnsDropdownRef = useRef<HTMLDivElement>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | VehicleStatus>("ALL");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<Menu>(null);
  const activeRowRef = useRef<VehicleProfileData | null>(null);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>("ALL");
  const [vehicleTypeFilterOpen, setVehicleTypeFilterOpen] = useState(false);
  const vehicleTypeFilterRef = useRef<HTMLDivElement>(null);

  const uniqueVehicleTypes = useMemo(() => {
    const types = [...new Set(data.map((d) => d.vehicleType))];
    return types.sort();
  }, [data]);

  // Animated toast state
  const [successToasts, setSuccessToasts] = useState<{ id: number; title: string; description: string }[]>([]);

  const showSuccessToast = (title: string, description: string) => {
    const id = Date.now();
    setSuccessToasts((prev) => [...prev, { id, title, description }]);
    setTimeout(() => setSuccessToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const exportColumns = [
    { field: "driverId" as keyof VehicleProfileData, label: "Driver ID" },
    { field: "vehicleId" as keyof VehicleProfileData, label: "Vehicle ID" },
    { field: "driverName" as keyof VehicleProfileData, label: "Driver" },
    { field: "vehicleType" as keyof VehicleProfileData, label: "Vehicle Type" },
    { field: "vehicleBrand" as keyof VehicleProfileData, label: "Vehicle Brand" },
    { field: "vehicleModel" as keyof VehicleProfileData, label: "Vehicle Model" },
    { field: "vehicleYear" as keyof VehicleProfileData, label: "Vehicle Year" },
    { field: "vehicleColor" as keyof VehicleProfileData, label: "Vehicle Color" },
    { field: "vehiclePlateNumber" as keyof VehicleProfileData, label: "Plate Number" },
    { field: "vehicleRegistrationIssueDate" as keyof VehicleProfileData, label: "Issue Date" },
    { field: "vehicleRegistrationExpiryDate" as keyof VehicleProfileData, label: "Expiry Date" },
    { field: "fuelType" as keyof VehicleProfileData, label: "Fuel Type" },
    { field: "isOwner" as keyof VehicleProfileData, label: "Is Owner" },
    { field: "ownerName" as keyof VehicleProfileData, label: "Owner Name" },
    { field: "ownerContactNumber" as keyof VehicleProfileData, label: "Owner Contact" },
    { field: "status" as keyof VehicleProfileData, label: "Status" },
    { field: "createdAt" as keyof VehicleProfileData, label: "Created At" },
    { field: "updatedAt" as keyof VehicleProfileData, label: "Updated At" },
    { field: "deletedAt" as keyof VehicleProfileData, label: "Deleted At" },
  ];

  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    exportColumns.map((c) => c.field)
  );

  const tableColumns = [
    { field: "driverId", label: "Driver ID", default: true },
    { field: "vehicleId", label: "Vehicle ID", default: true },
    { field: "driverName", label: "Driver", default: true },
    { field: "vehicleType", label: "Vehicle Type", default: true },
    { field: "vehicleBrand", label: "Vehicle Brand", default: true },
    { field: "vehicleModel", label: "Vehicle Model", default: true },
    { field: "vehicleYear", label: "Vehicle Year", default: true },
    { field: "vehicleColor", label: "Vehicle Color", default: true },
    { field: "vehiclePlateNumber", label: "Plate Number", default: true },
    { field: "vehicleRegistrationIssueDate", label: "Issue Date", default: true },
    { field: "vehicleRegistrationExpiryDate", label: "Expiry Date", default: true },
    { field: "fuelType", label: "Fuel Type", default: true },
    { field: "isOwner", label: "Is Owner", default: true },
    { field: "ownerName", label: "Owner Name", default: true },
    { field: "ownerContactNumber", label: "Owner Contact", default: true },
    { field: "status", label: "Status", default: true },
    { field: "createdAt", label: "Created At", default: false },
    { field: "updatedAt", label: "Updated", default: true },
    { field: "deletedAt", label: "Deleted At", default: false },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.filter((c) => c.default).map((c) => c.field)
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
    if (vehicleTypeFilter !== "ALL") {
      result = result.filter((d) => d.vehicleType === vehicleTypeFilter);
    }
    return result;
  }, [data, globalFilter, statusFilter, vehicleTypeFilter]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (columnsDropdownRef.current && !columnsDropdownRef.current.contains(e.target as Node)) setColumnsDropdownOpen(false);
      if (statusFilterRef.current && !statusFilterRef.current.contains(e.target as Node)) setStatusFilterOpen(false);
      if (vehicleTypeFilterRef.current && !vehicleTypeFilterRef.current.contains(e.target as Node)) setVehicleTypeFilterOpen(false);
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
          showSuccessToast("View Vehicle", `Viewing details for ${activeRowRef.current.vehicleBrand} ${activeRowRef.current.vehicleModel}`);
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
          showSuccessToast("Edit Vehicle", `Editing vehicle profile for ${activeRowRef.current.vehicleBrand} ${activeRowRef.current.vehicleModel}`);
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

  const confirmDelete = (item: VehicleProfileData) => {
    confirmDialog({
      message: `Are you sure you want to delete the vehicle profile for "${item.vehicleBrand} ${item.vehicleModel}" (${item.vehiclePlateNumber})?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setData((prev) => prev.filter((d) => d.id !== item.id));
        toast.current?.show({ severity: "warn", summary: "Deleted", detail: `${item.vehicleBrand} ${item.vehicleModel} has been removed`, life: 3000 });
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
    a.href = url; a.download = "vehicle_profiles.csv"; a.click();
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicle Profiles");
    XLSX.writeFile(workbook, "vehicle_profiles.xlsx");
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  const exportPDF = () => {
    const cols = exportColumns.filter((c) => selectedExportColumns.includes(c.field));
    if (cols.length === 0) { toast.current?.show({ severity: "warn", summary: "No Columns", detail: "Please select at least one column", life: 3000 }); return; }
    const headers = cols.map((c) => c.label);
    const doc = new jsPDF({ orientation: "landscape" });
    autoTable(doc, {
      head: [headers],
      body: filteredData.map((d) => cols.map((c) => String(d[c.field]))),
      startY: 20,
      headStyles: { fillColor: [239, 246, 255], textColor: [37, 99, 235], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
    });
    doc.save("vehicle_profiles.pdf");
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  // ── Body Templates ──
  const driverBodyTemplate = (rowData: VehicleProfileData) => (
    <div className="flex items-center gap-2">
      <img
        src={rowData.driverProfileImage}
        alt={rowData.driverName}
        className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#e2e8f0]"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          const fallback = (e.target as HTMLImageElement).nextElementSibling;
          if (fallback) (fallback as HTMLElement).style.display = "flex";
        }}
      />
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
        style={{
          display: "none",
          background: rowData.driverGender === "FEMALE" ? "linear-gradient(135deg, #fce7f3, #fdf2f8)" : "linear-gradient(135deg, #dbeafe, #eff6ff)",
          color: rowData.driverGender === "FEMALE" ? "#db2777" : "#2563eb",
        }}
      >
        {rowData.driverName.split(" ").map(n => n[0]).join("").slice(0, 2)}
      </div>
      <span className="text-[12px] text-[#0f172a] font-semibold">{rowData.driverName}</span>
    </div>
  );

  const colorBodyTemplate = (rowData: VehicleProfileData) => (
    <div className="flex items-center gap-1.5">
      <div
        className="w-3.5 h-3.5 rounded-full border border-[#e2e8f0] shrink-0"
        style={{ backgroundColor: colorDot[rowData.vehicleColor] || "#94a3b8" }}
      />
      <span className="text-[12px] text-[#334155]">{rowData.vehicleColor}</span>
    </div>
  );

  const plateBodyTemplate = (rowData: VehicleProfileData) => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[12px] text-[#0f172a] font-mono font-semibold border border-[#e2e8f0]">
      {rowData.vehiclePlateNumber}
    </span>
  );

  const fuelBodyTemplate = (rowData: VehicleProfileData) => {
    const fuelColors: Record<string, { text: string; bg: string }> = {
      Petrol: { text: "#d97706", bg: "#fffbeb" },
      Diesel: { text: "#475569", bg: "#f1f5f9" },
      Hybrid: { text: "#16a34a", bg: "#f0fdf4" },
      Electric: { text: "#3b82f6", bg: "#eff6ff" },
      CNG: { text: "#7c3aed", bg: "#f5f3ff" },
      LPG: { text: "#0891b2", bg: "#ecfeff" },
    };
    const c = fuelColors[rowData.fuelType] || fuelColors.Petrol;
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
        style={{ color: c.text, backgroundColor: c.bg }}
      >
        {rowData.fuelType}
      </span>
    );
  };

  const isOwnerBodyTemplate = (rowData: VehicleProfileData) => (
    rowData.isOwner ? (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full text-[#16a34a] bg-[#f0fdf4]">
        <UserCheck className="w-3 h-3" />
        Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full text-[#d97706] bg-[#fffbeb]">
        <UserX className="w-3 h-3" />
        No
      </span>
    )
  );

  const ownerContactBodyTemplate = (rowData: VehicleProfileData) => (
    rowData.ownerContactNumber ? (
      <span className="inline-flex items-center gap-1 text-[12px] text-[#334155] font-mono">
        <Phone className="w-3 h-3 text-[#64748b]" />
        {rowData.ownerContactNumber}
      </span>
    ) : (
      <span className="text-[12px] text-[#cbd5e1]">{"\u2014"}</span>
    )
  );

  const statusBodyTemplate = (rowData: VehicleProfileData) => {
    const s = statusStyles[rowData.status] || { text: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" };
    const label = statusLabels[rowData.status] || rowData.status;
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
        style={{ color: s.text, backgroundColor: s.bg }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
        {label}
      </span>
    );
  };

  const actionBodyTemplate = (rowData: VehicleProfileData) => (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#eef2ff] transition-colors cursor-pointer text-[#6366f1] hover:bg-[#e0e7ff]"
        title="View"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/vehicle-profiles/${rowData.id}`);
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
          <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#e2e8f0] rounded-[10px] shadow-lg z-50 min-w-[180px] py-1.5 overflow-hidden">
            {([
              { key: "ALL" as const, label: "All Statuses", count: data.length },
              { key: "UNDER_REVIEW" as const, label: "Under Review", count: data.filter((d) => d.status === "UNDER_REVIEW").length },
              { key: "APPROVED" as const, label: "Approved", count: data.filter((d) => d.status === "APPROVED").length },
              { key: "REJECT" as const, label: "Rejected", count: data.filter((d) => d.status === "REJECT").length },
            ] as { key: "ALL" | VehicleStatus; label: string; count: number }[]).map((opt) => (
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
      {/* Vehicle Type Filter */}
      <div className="relative" ref={vehicleTypeFilterRef}>
        
        {vehicleTypeFilterOpen && (
          <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#e2e8f0] rounded-[10px] shadow-lg z-50 min-w-[160px] py-1.5 overflow-hidden max-h-[300px] overflow-y-auto">
            {([
              { key: "ALL" as const, label: "All Types", count: data.length },
              ...uniqueVehicleTypes.map((type) => ({ key: type, label: type, count: data.filter((d) => d.vehicleType === type).length })),
            ] as { key: string; label: string; count: number }[]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setVehicleTypeFilter(opt.key);
                  setVehicleTypeFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-[12px] transition-colors cursor-pointer ${
                  vehicleTypeFilter === opt.key
                    ? "bg-[#eef2ff] text-[#6366f1] font-medium"
                    : "text-[#475569] hover:bg-[#f8fafc]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {vehicleTypeFilter === opt.key && <Check className="w-3.5 h-3.5" />}
                  <span className={vehicleTypeFilter === opt.key ? "" : "ml-5.5"}>{opt.label}</span>
                </div>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  vehicleTypeFilter === opt.key
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
        <h2 className="text-[15px] text-[#0f172a] font-semibold m-0">Vehicle Profiles</h2>
        <span className="text-[11px] text-[#94a3b8]">{filteredData.length} total vehicle profiles</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search vehicles..."
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
              <Car className="w-4 h-4 text-[#3b82f6]" />
            </div>
            <div>
              <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">
                Vehicle Profile
              </h1>
              <p className="text-[12px] text-[#94a3b8]">
                Manage registered vehicle information and verification
              </p>
            </div>
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
          emptyMessage="No vehicle profiles found."
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
            <Column field="driverId" header="Driver ID" sortable style={{ minWidth: "120px" }} body={(rowData: VehicleProfileData) => (
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#6366f1] font-mono font-medium px-2 py-0.5 rounded-md bg-[#eef2ff]">
                <Hash className="w-3 h-3" />
                {rowData.driverId}
              </span>
            )} />
          )}
          {visibleColumns.includes("vehicleId") && (
            <Column field="vehicleId" header="Vehicle ID" sortable style={{ minWidth: "120px" }} body={(rowData: VehicleProfileData) => (
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#3b82f6] font-mono font-medium px-2 py-0.5 rounded-md bg-[#eff6ff]">
                <Hash className="w-3 h-3" />
                {rowData.vehicleId}
              </span>
            )} />
          )}
          {visibleColumns.includes("driverName") && (
            <Column field="driverName" header="Driver" body={driverBodyTemplate} sortable style={{ minWidth: "180px" }} />
          )}
          {visibleColumns.includes("vehicleType") && (
            <Column field="vehicleType" header="Vehicle Type" sortable style={{ minWidth: "120px" }} body={(rowData: VehicleProfileData) => (
              <span className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[11px] text-[#475569] font-medium">{rowData.vehicleType}</span>
            )} />
          )}
          {visibleColumns.includes("vehicleBrand") && (
            <Column field="vehicleBrand" header="Vehicle Brand" sortable style={{ minWidth: "130px" }} body={(rowData: VehicleProfileData) => (
              <div className="flex items-center gap-2">
                
                <span className="text-[12px] text-[#0f172a] font-semibold">{rowData.vehicleBrand}</span>
              </div>
            )} />
          )}
          {visibleColumns.includes("vehicleModel") && (
            <Column field="vehicleModel" header="Vehicle Model" sortable style={{ minWidth: "120px" }} body={(rowData: VehicleProfileData) => (
              <span className="text-[12px] text-[#334155] font-medium">{rowData.vehicleModel}</span>
            )} />
          )}
          {visibleColumns.includes("vehicleYear") && (
            <Column field="vehicleYear" header="Vehicle Year" sortable style={{ minWidth: "100px" }} body={(rowData: VehicleProfileData) => (
              <span className="text-[12px] text-[#64748b] font-mono">{rowData.vehicleYear}</span>
            )} />
          )}
          {visibleColumns.includes("vehicleColor") && (
            <Column field="vehicleColor" header="Vehicle Color" sortable style={{ minWidth: "110px" }} body={colorBodyTemplate} />
          )}
          {visibleColumns.includes("vehiclePlateNumber") && (
            <Column field="vehiclePlateNumber" header="Plate Number" sortable style={{ minWidth: "130px" }} body={plateBodyTemplate} />
          )}
          {visibleColumns.includes("vehicleRegistrationIssueDate") && (
            <Column field="vehicleRegistrationIssueDate" header="Issue Date" sortable style={{ minWidth: "130px" }} body={(rowData: VehicleProfileData) => (
              <span className="text-[12px] text-[#64748b]">{formatDate(rowData.vehicleRegistrationIssueDate)}</span>
            )} />
          )}
          {visibleColumns.includes("vehicleRegistrationExpiryDate") && (
            <Column field="vehicleRegistrationExpiryDate" header="Expiry Date" sortable style={{ minWidth: "130px" }} body={(rowData: VehicleProfileData) => {
              const expiry = new Date(rowData.vehicleRegistrationExpiryDate);
              const now = new Date();
              const isExpired = expiry < now;
              const isExpiringSoon = !isExpired && expiry.getTime() - now.getTime() < 90 * 24 * 60 * 60 * 1000;
              return (
                <span className={`text-[12px] ${isExpired ? "text-[#e53935] font-medium" : isExpiringSoon ? "text-[#f59e0b] font-medium" : "text-[#64748b]"}`}>
                  {formatDate(rowData.vehicleRegistrationExpiryDate)}
                </span>
              );
            }} />
          )}
          {visibleColumns.includes("fuelType") && (
            <Column field="fuelType" header="Fuel Type" sortable style={{ minWidth: "110px" }} body={fuelBodyTemplate} />
          )}
          {visibleColumns.includes("isOwner") && (
            <Column field="isOwner" header="Is Owner" sortable style={{ minWidth: "100px" }} body={isOwnerBodyTemplate} />
          )}
          {visibleColumns.includes("ownerName") && (
            <Column field="ownerName" header="Owner Name" sortable style={{ minWidth: "140px" }} body={(rowData: VehicleProfileData) => (
              <span className={`text-[12px] ${rowData.ownerName ? "text-[#334155] font-medium" : "text-[#cbd5e1]"}`}>
                {rowData.ownerName || "\u2014"}
              </span>
            )} />
          )}
          {visibleColumns.includes("ownerContactNumber") && (
            <Column field="ownerContactNumber" header="Owner Contact" sortable style={{ minWidth: "150px" }} body={ownerContactBodyTemplate} />
          )}
          {visibleColumns.includes("status") && (
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "130px" }} />
          )}
          {visibleColumns.includes("createdAt") && (
            <Column field="createdAt" header="Created At" sortable style={{ minWidth: "130px" }} body={(rowData: VehicleProfileData) => (
              <span className="text-[12px] text-[#64748b]">{formatDate(rowData.createdAt)}</span>
            )} />
          )}
          {visibleColumns.includes("updatedAt") && (
            <Column field="updatedAt" header="Updated" sortable style={{ minWidth: "130px" }} body={(rowData: VehicleProfileData) => (
              <span className="text-[12px] text-[#64748b]">{formatDate(rowData.updatedAt)}</span>
            )} />
          )}
          {visibleColumns.includes("deletedAt") && (
            <Column field="deletedAt" header="Deleted At" sortable style={{ minWidth: "130px" }} body={(rowData: VehicleProfileData) => (
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

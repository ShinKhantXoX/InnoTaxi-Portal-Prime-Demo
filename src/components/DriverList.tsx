import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import { Checkbox } from "primereact/checkbox";
import { Users, Pencil, Trash2, Download, RefreshCw, Search, EllipsisVertical, Check, X, ChevronDown, Columns3, Eye, EyeOff, UserCircle, Filter, Bell, FileSpreadsheet, FileText, Plus, Hash, Mail, Send, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Types ──
export type Gender = "MALE" | "FEMALE";
export type DriverStatus = "ACTIVE" | "PENDING" | "INACTIVE" | "SUSPENDED";

export interface Driver {
  id: number;
  profileImage: string;
  fullName: string;
  gender: Gender;
  dob: string;
  prefix: string;
  phoneNumber: string;
  email: string;
  password: string;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const emptyDriver: Driver = {
  id: 0,
  profileImage: "",
  fullName: "",
  gender: "MALE",
  dob: "",
  prefix: "Mr.",
  phoneNumber: "",
  email: "",
  password: "",
  status: "PENDING",
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
};

// ── Mock Data ──
export const driverMockData: Driver[] = [
  { id: 1, profileImage: "https://images.unsplash.com/photo-1551917594-c1080fdeceae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Aung Min Htut", gender: "MALE", dob: "1990-05-12", prefix: "Mr.", phoneNumber: "+95 9 123 456 789", email: "aungmin@innotaxi.com", password: "********", status: "ACTIVE", createdAt: "2024-01-15", updatedAt: "2026-02-20", deletedAt: null },
  { id: 2, profileImage: "https://images.unsplash.com/photo-1768017092992-4c2045cd668b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Thida Myint", gender: "FEMALE", dob: "1992-08-24", prefix: "Ms.", phoneNumber: "+95 9 987 654 321", email: "thida@innotaxi.com", password: "********", status: "ACTIVE", createdAt: "2024-02-10", updatedAt: "2026-01-18", deletedAt: null },
  { id: 3, profileImage: "https://images.unsplash.com/photo-1749003659356-1d1a4451a49d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Kyaw Zin Htet", gender: "MALE", dob: "1988-03-07", prefix: "Mr.", phoneNumber: "+95 9 456 789 012", email: "kyawzin@innotaxi.com", password: "********", status: "PENDING", createdAt: "2024-03-05", updatedAt: "2026-03-01", deletedAt: null },
  { id: 4, profileImage: "https://images.unsplash.com/photo-1770576934845-759db89fcd3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Su Su Lwin", gender: "FEMALE", dob: "1995-11-30", prefix: "Ms.", phoneNumber: "+95 9 321 654 987", email: "susu@innotaxi.com", password: "********", status: "ACTIVE", createdAt: "2024-04-18", updatedAt: "2026-02-14", deletedAt: null },
  { id: 5, profileImage: "https://images.unsplash.com/photo-1771924369256-fdd856822db3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Min Thu Aung", gender: "MALE", dob: "1985-07-19", prefix: "Mr.", phoneNumber: "+95 9 111 222 333", email: "minthu@innotaxi.com", password: "********", status: "SUSPENDED", createdAt: "2024-05-22", updatedAt: "2026-01-30", deletedAt: null },
  { id: 6, profileImage: "https://images.unsplash.com/photo-1625900172227-99d357eea494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Hnin Ei Phyu", gender: "FEMALE", dob: "1993-02-14", prefix: "Ms.", phoneNumber: "+95 9 444 555 666", email: "hninei@innotaxi.com", password: "********", status: "ACTIVE", createdAt: "2024-06-08", updatedAt: "2026-02-28", deletedAt: null },
  { id: 7, profileImage: "https://images.unsplash.com/photo-1751842839301-8a57a05f9904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Ye Yint Aung", gender: "MALE", dob: "1991-09-03", prefix: "Mr.", phoneNumber: "+95 9 777 888 999", email: "yeyint@innotaxi.com", password: "********", status: "INACTIVE", createdAt: "2024-07-14", updatedAt: "2026-01-10", deletedAt: "2026-01-10" },
  { id: 8, profileImage: "https://images.unsplash.com/photo-1708491191986-f7a710ee4675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Thin Thin Aye", gender: "FEMALE", dob: "1997-12-25", prefix: "Ms.", phoneNumber: "+95 9 222 333 444", email: "thinthin@innotaxi.com", password: "********", status: "ACTIVE", createdAt: "2024-08-20", updatedAt: "2026-03-05", deletedAt: null },
  { id: 9, profileImage: "https://images.unsplash.com/photo-1745240261519-0b988d54d098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Hla Myo Win", gender: "MALE", dob: "1987-04-16", prefix: "Mr.", phoneNumber: "+95 9 555 666 777", email: "hlamyo@innotaxi.com", password: "********", status: "PENDING", createdAt: "2024-09-01", updatedAt: "2026-02-22", deletedAt: null },
  { id: 10, profileImage: "https://images.unsplash.com/photo-1695800998493-ccff5ea292ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Wai Yan Phyo", gender: "MALE", dob: "1994-06-28", prefix: "Mr.", phoneNumber: "+95 9 888 999 000", email: "waiyan@innotaxi.com", password: "********", status: "ACTIVE", createdAt: "2024-10-12", updatedAt: "2026-03-10", deletedAt: null },
  { id: 11, profileImage: "https://images.unsplash.com/photo-1770364017468-e755d33941e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Nwe Nwe Htun", gender: "FEMALE", dob: "1996-01-08", prefix: "Ms.", phoneNumber: "+95 9 333 222 111", email: "nwenwe@innotaxi.com", password: "********", status: "ACTIVE", createdAt: "2024-11-05", updatedAt: "2026-02-15", deletedAt: null },
  { id: 12, profileImage: "https://images.unsplash.com/photo-1770392988936-dc3d8581e0c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Zaw Min Oo", gender: "MALE", dob: "1989-10-21", prefix: "Mr.", phoneNumber: "+95 9 666 555 444", email: "zawmin@innotaxi.com", password: "********", status: "SUSPENDED", createdAt: "2024-12-01", updatedAt: "2026-01-25", deletedAt: null },
  { id: 13, profileImage: "https://images.unsplash.com/photo-1745869482293-902065d1ad5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "May Thu Zar", gender: "FEMALE", dob: "1998-07-04", prefix: "Ms.", phoneNumber: "+95 9 999 888 777", email: "maythu@innotaxi.com", password: "********", status: "PENDING", createdAt: "2025-01-08", updatedAt: "2026-03-08", deletedAt: null },
  { id: 14, profileImage: "https://images.unsplash.com/photo-1535213679542-f42b6f164647?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Kaung Myat Thu", gender: "MALE", dob: "1986-11-15", prefix: "Mr.", phoneNumber: "+95 9 112 233 445", email: "kaungmyat@innotaxi.com", password: "********", status: "ACTIVE", createdAt: "2025-02-14", updatedAt: "2026-02-10", deletedAt: null },
  { id: 15, profileImage: "https://images.unsplash.com/photo-1619671030981-df6d493354bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", fullName: "Ei Mon Kyaw", gender: "FEMALE", dob: "2000-03-22", prefix: "Ms.", phoneNumber: "+95 9 556 677 889", email: "eimon@innotaxi.com", password: "********", status: "ACTIVE", createdAt: "2025-03-20", updatedAt: "2026-03-12", deletedAt: null },
];

const genderOptions: { label: string; value: Gender }[] = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

const statusOptions: { label: string; value: DriverStatus }[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

const prefixOptions = [
  { label: "Mr.", value: "Mr." },
  { label: "Ms.", value: "Ms." },
  { label: "Mrs.", value: "Mrs." },
  { label: "Dr.", value: "Dr." },
];

const statusStyles: Record<DriverStatus, { text: string; bg: string; dot: string }> = {
  ACTIVE: { text: "#16a34a", bg: "#f0fdf4", dot: "#22c55e" },
  PENDING: { text: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
  INACTIVE: { text: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" },
  SUSPENDED: { text: "#e53935", bg: "#fef2f2", dot: "#ef4444" },
};

const genderStyles: Record<Gender, { text: string; bg: string }> = {
  MALE: { text: "#2563eb", bg: "#eff6ff" },
  FEMALE: { text: "#db2777", bg: "#fdf2f8" },
};

type NotificationType = "push" | "email";

const statusNotificationMessages: Record<DriverStatus, (name: string) => string> = {
  ACTIVE: (name) => `Dear ${name},\n\nYour InnoTaxi driver account is active and in good standing. You are cleared to accept ride requests. Drive safely and maintain your excellent service rating!\n\nBest regards,\nInnoTaxi Admin Team`,
  PENDING: (name) => `Dear ${name},\n\nYour InnoTaxi driver registration is currently under review. Please ensure all required documents (license, vehicle registration, insurance) have been submitted. We will notify you once your account is approved.\n\nBest regards,\nInnoTaxi Admin Team`,
  INACTIVE: (name) => `Dear ${name},\n\nYour InnoTaxi driver account is currently inactive. If you wish to resume driving, please log in to the driver app and update your availability status. We'd love to have you back on the road!\n\nBest regards,\nInnoTaxi Admin Team`,
  SUSPENDED: (name) => `Dear ${name},\n\nYour InnoTaxi driver account has been temporarily suspended due to a policy review. Please contact our support team at support@innotaxi.com or visit the nearest InnoTaxi office to resolve this matter.\n\nBest regards,\nInnoTaxi Admin Team`,
};

// ── Helper: validate DOB ──
function isAbove18(dob: string): boolean {
  if (!dob) return false;
  const birthDate = new Date(dob);
  const today = new Date("2026-03-14");
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age >= 18;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function calculateAge(dob: string): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date("2026-03-14");
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export function DriverList() {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>(driverMockData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Driver>(emptyDriver);
  const [submitted, setSubmitted] = useState(false);
  const actionMenuRef = useRef<Menu>(null);
  const activeRowRef = useRef<Driver | null>(null);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const columnsDropdownRef = useRef<HTMLDivElement>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | DriverStatus>("ALL");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  // Notification dialog state
  const [notifDialogVisible, setNotifDialogVisible] = useState(false);
  const [notifDriver, setNotifDriver] = useState<Driver | null>(null);
  const [notifTypes, setNotifTypes] = useState<NotificationType[]>(["push"]);
  const [notifMessage, setNotifMessage] = useState("");

  const toggleNotifType = (type: NotificationType) => {
    setNotifTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const openNotifDialog = (driver: Driver) => {
    setNotifDriver(driver);
    setNotifTypes(["push"]);
    setNotifMessage(statusNotificationMessages[driver.status](driver.fullName));
    setNotifDialogVisible(true);
  };

  const handleSendNotification = () => {
    if (!notifDriver || !notifMessage.trim() || notifTypes.length === 0) return;
    const channels = notifTypes.map((t) => t === "push" ? "Push notification" : "Email");
    const channelLabel = channels.join(" & ");
    showSuccessToast(
      "Notification Sent",
      `${channelLabel} has been sent to ${notifDriver.fullName}.`
    );
    setNotifDialogVisible(false);
  };

  // Animated toast state
  const [successToasts, setSuccessToasts] = useState<{ id: number; title: string; description: string }[]>([]);

  const showSuccessToast = (title: string, description: string) => {
    const id = Date.now();
    setSuccessToasts((prev) => [...prev, { id, title, description }]);
    setTimeout(() => setSuccessToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const exportColumns = [
    { field: "id" as keyof Driver, label: "Driver ID" },
    { field: "fullName" as keyof Driver, label: "Full Name" },
    { field: "gender" as keyof Driver, label: "Gender" },
    { field: "dob" as keyof Driver, label: "Date of Birth" },
    { field: "phoneNumber" as keyof Driver, label: "Phone Number" },
    { field: "email" as keyof Driver, label: "Email" },
    { field: "status" as keyof Driver, label: "Status" },
    { field: "createdAt" as keyof Driver, label: "Created At" },
    { field: "updatedAt" as keyof Driver, label: "Updated At" },
    { field: "deletedAt" as keyof Driver, label: "Deleted At" },
  ];

  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    exportColumns.map((c) => c.field)
  );

  const tableColumns = [
    { field: "id", label: "Driver ID", default: true },
    { field: "fullName", label: "Full Name", default: true },
    { field: "gender", label: "Gender", default: true },
    { field: "dob", label: "Date of Birth", default: true },
    { field: "phoneNumber", label: "Phone", default: true },
    { field: "email", label: "Email", default: true },
    { field: "status", label: "Status", default: true },
    { field: "createdAt", label: "Created At", default: false },
    { field: "updatedAt", label: "Updated", default: true },
    { field: "deletedAt", label: "Deleted At", default: false },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.map((c) => c.field)
  );

  const filteredData = useMemo(() => {
    let data = drivers;
    if (globalFilter.trim()) {
      const lower = globalFilter.toLowerCase();
      data = data.filter((d) =>
        Object.values(d).some((val) =>
          String(val).toLowerCase().includes(lower)
        )
      );
    }
    if (statusFilter !== "ALL") {
      data = data.filter((d) => d.status === statusFilter);
    }
    return data;
  }, [drivers, globalFilter, statusFilter]);

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
          toast.current?.show({ severity: "info", summary: "View", detail: `Viewing ${activeRowRef.current.fullName}`, life: 2000 });
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
    setFormData({ ...emptyDriver, id: Date.now(), createdAt: new Date().toISOString().split("T")[0], updatedAt: new Date().toISOString().split("T")[0] });
    setEditMode(false);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openEdit = (item: Driver) => {
    setFormData({ ...item });
    setEditMode(true);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const saveItem = () => {
    setSubmitted(true);
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || !formData.dob) return;
    if (!isAbove18(formData.dob)) return;
    if (!editMode && !formData.password.trim()) return;

    const updated = { ...formData, updatedAt: new Date().toISOString().split("T")[0] };

    if (editMode) {
      setDrivers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      showSuccessToast("Driver Updated", `${updated.fullName} has been updated successfully.`);
    } else {
      setDrivers((prev) => [...prev, updated]);
      showSuccessToast("Driver Created", `${updated.fullName} has been created successfully.`);
    }
    setDialogVisible(false);
    setFormData(emptyDriver);
  };

  const confirmDelete = (item: Driver) => {
    confirmDialog({
      message: `Are you sure you want to delete "${item.fullName}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setDrivers((prev) => prev.filter((d) => d.id !== item.id));
        toast.current?.show({ severity: "warn", summary: "Deleted", detail: `${item.fullName} has been removed`, life: 3000 });
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
    const rows = filteredData.map((d) => cols.map((c) => escapeCSV(String(d[c.field]))));
    const csv = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drivers.csv";
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
    const worksheetData = [headers, ...filteredData.map((d) => cols.map((c) => String(d[c.field])))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");
    XLSX.writeFile(workbook, "drivers.xlsx");
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
      body: filteredData.map((d) => cols.map((c) => String(d[c.field]))),
      startY: 20,
      headStyles: { fillColor: [239, 246, 255], textColor: [37, 99, 235], fontSize: 10 },
      bodyStyles: { fontSize: 10 },
    });
    doc.save("drivers.pdf");
    setExportDialogVisible(false);
    toast.current?.show({ severity: "info", summary: "Exported", detail: `${filteredData.length} row(s) exported`, life: 3000 });
  };

  // ── Body Templates ──
  const fullNameBodyTemplate = (rowData: Driver) => (
    <div className="flex items-center gap-2">
      <img
        src={rowData.profileImage}
        alt={rowData.fullName}
        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
      />
      <div>
        <span className="text-[12px] text-[#0f172a] font-semibold">{rowData.fullName}</span>
      </div>
    </div>
  );

  const genderBodyTemplate = (rowData: Driver) => (
    <span
      className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full"
      style={{ color: genderStyles[rowData.gender].text, backgroundColor: genderStyles[rowData.gender].bg }}
    >
      {rowData.gender === "MALE" ? "Male" : "Female"}
    </span>
  );

  const dobBodyTemplate = (rowData: Driver) => {
    const age = calculateAge(rowData.dob);
    return (
      <div className="flex flex-col">
        <span className="text-[12px] text-[#334155]">{formatDate(rowData.dob)}</span>
        <span className="text-[10px] text-[#94a3b8]">{age} years old</span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData: Driver) => {
    const s = statusStyles[rowData.status];
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
        style={{ color: s.text, backgroundColor: s.bg }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
        {rowData.status.charAt(0) + rowData.status.slice(1).toLowerCase()}
      </span>
    );
  };

  const actionBodyTemplate = (rowData: Driver) => (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#eef2ff] transition-colors cursor-pointer text-[#6366f1] hover:bg-[#e0e7ff]"
        title="View"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/drivers/${rowData.id}`);
        }}
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#fffbeb] transition-colors cursor-pointer text-[#d97706] hover:bg-[#fef3c7]"
        title="Send Notification"
        onClick={(e) => {
          e.stopPropagation();
          openNotifDialog(rowData);
        }}
      >
        <Bell className="w-3.5 h-3.5" />
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
          {statusFilter === "ALL" ? "Status" : statusFilter === "ACTIVE" ? "Active" : statusFilter === "PENDING" ? "Pending" : statusFilter === "INACTIVE" ? "Inactive" : "Suspended"}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${statusFilterOpen ? "rotate-180" : ""}`} />
        </button>
        {statusFilterOpen && (
          <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#e2e8f0] rounded-[10px] shadow-lg z-50 min-w-[160px] py-1.5 overflow-hidden">
            {([
              { key: "ALL" as const, label: "All Statuses", count: drivers.length },
              { key: "ACTIVE" as const, label: "Active", count: drivers.filter((d) => d.status === "ACTIVE").length },
              { key: "PENDING" as const, label: "Pending", count: drivers.filter((d) => d.status === "PENDING").length },
              { key: "INACTIVE" as const, label: "Inactive", count: drivers.filter((d) => d.status === "INACTIVE").length },
              { key: "SUSPENDED" as const, label: "Suspended", count: drivers.filter((d) => d.status === "SUSPENDED").length },
            ] as { key: "ALL" | DriverStatus; label: string; count: number }[]).map((opt) => (
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
    </div>
  );

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-[15px] text-[#0f172a] font-semibold m-0">Drivers</h2>
        <span className="text-[11px] text-[#94a3b8]">{filteredData.length} total drivers</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search drivers..."
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
            setDrivers([...driverMockData]);
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
          <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center">
            <Users className="w-4 h-4 text-[#2563eb]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">
              Drivers
            </h1>
            <p className="text-[12px] text-[#94a3b8]">
              Manage all registered drivers
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
          emptyMessage="No drivers found."
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
          {visibleColumns.includes("id") && (
            <Column field="id" header="Driver ID" sortable style={{ minWidth: "120px" }} body={(rowData: Driver) => (
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#6366f1] font-mono font-medium px-2 py-0.5 rounded-md bg-[#eef2ff]">
                <Hash className="w-3 h-3" />
                {`DRV-${String(rowData.id).padStart(3, "0")}`}
              </span>
            )} />
          )}
          {visibleColumns.includes("fullName") && (
            <Column field="fullName" header="Full Name" body={fullNameBodyTemplate} sortable style={{ minWidth: "200px" }} />
          )}
          {visibleColumns.includes("gender") && (
            <Column field="gender" header="Gender" body={genderBodyTemplate} sortable style={{ minWidth: "100px" }} />
          )}
          {visibleColumns.includes("dob") && (
            <Column field="dob" header="Date of Birth" body={dobBodyTemplate} sortable style={{ minWidth: "150px" }} />
          )}
          {visibleColumns.includes("phoneNumber") && (
            <Column field="phoneNumber" header="Phone" sortable style={{ minWidth: "170px" }} body={(rowData: Driver) => (
              <span className="text-[12px] text-[#334155] font-mono">{rowData.phoneNumber}</span>
            )} />
          )}
          {visibleColumns.includes("email") && (
            <Column field="email" header="Email" sortable style={{ minWidth: "200px" }} body={(rowData: Driver) => (
              <span className="text-[12px] text-[#64748b]">{rowData.email}</span>
            )} />
          )}
          {visibleColumns.includes("status") && (
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "130px" }} />
          )}
          {visibleColumns.includes("createdAt") && (
            <Column field="createdAt" header="Created At" sortable style={{ minWidth: "130px" }} body={(rowData: Driver) => (
              <span className="text-[12px] text-[#64748b]">{formatDate(rowData.createdAt)}</span>
            )} />
          )}
          {visibleColumns.includes("updatedAt") && (
            <Column field="updatedAt" header="Updated" sortable style={{ minWidth: "130px" }} body={(rowData: Driver) => (
              <span className="text-[12px] text-[#64748b]">{formatDate(rowData.updatedAt)}</span>
            )} />
          )}
          {visibleColumns.includes("deletedAt") && (
            <Column field="deletedAt" header="Deleted At" sortable style={{ minWidth: "130px" }} body={(rowData: Driver) => (
              <span className={`text-[12px] ${rowData.deletedAt ? "text-[#e53935]" : "text-[#cbd5e1]"}`}>
                {rowData.deletedAt ? formatDate(rowData.deletedAt) : "\u2014"}
              </span>
            )} />
          )}
          <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: "130px" }} frozen alignFrozen="right" />
        </DataTable>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={editMode ? "Edit Driver" : "New Driver"}
        footer={dialogFooter}
        modal
        dismissableMask
        draggable={false}
        className="!w-[600px] !rounded-[12px]"
        contentClassName="!px-6 !py-4"
        headerClassName="!px-6 !py-4 !border-b !border-[#e2e8f0]"
      >
        <div className="flex flex-col gap-4">
          {/* Row 1: Prefix + Full Name */}
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Prefix</label>
              <Dropdown
                value={formData.prefix}
                options={prefixOptions}
                onChange={(e) => setFormData({ ...formData, prefix: e.value })}
                className="!w-full !text-[13px] [&_.p-dropdown-label]:!py-2.5 [&_.p-dropdown-label]:!px-3 !rounded-[8px] !border-[#e2e8f0]"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Full Name *</label>
              <InputText
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !formData.fullName.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="e.g. Aung Min Htut"
              />
              {submitted && !formData.fullName.trim() && <small className="text-[11px] text-[#e53935] mt-1">Full name is required</small>}
            </div>
          </div>

          {/* Row 2: Gender + DOB */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Gender *</label>
              <Dropdown
                value={formData.gender}
                options={genderOptions}
                onChange={(e) => setFormData({ ...formData, gender: e.value })}
                className="!w-full !text-[13px] [&_.p-dropdown-label]:!py-2.5 [&_.p-dropdown-label]:!px-3 !rounded-[8px] !border-[#e2e8f0]"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Date of Birth *</label>
              <InputText
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && (!formData.dob || !isAbove18(formData.dob)) ? "!border-[#e53935]" : ""}`}
                max="2008-03-14"
              />
              {submitted && !formData.dob && <small className="text-[11px] text-[#e53935] mt-1">Date of birth is required</small>}
              {submitted && formData.dob && !isAbove18(formData.dob) && <small className="text-[11px] text-[#e53935] mt-1">Driver must be at least 18 years old</small>}
            </div>
          </div>

          {/* Row 3: Phone + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Phone Number *</label>
              <InputText
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !formData.phoneNumber.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="+95 9 xxx xxx xxx"
              />
              {submitted && !formData.phoneNumber.trim() && <small className="text-[11px] text-[#e53935] mt-1">Phone number is required</small>}
            </div>
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Email *</label>
              <InputText
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !formData.email.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="driver@innotaxi.com"
              />
              {submitted && !formData.email.trim() && <small className="text-[11px] text-[#e53935] mt-1">Email is required</small>}
            </div>
          </div>

          {/* Row 4: Password + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">
                Password {!editMode && "*"}
              </label>
              <InputText
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`!w-full !text-[13px] !py-2.5 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !editMode && !formData.password.trim() ? "!border-[#e53935]" : ""}`}
                placeholder={editMode ? "Leave blank to keep" : "Enter password"}
              />
              {submitted && !editMode && !formData.password.trim() && <small className="text-[11px] text-[#e53935] mt-1">Password is required</small>}
            </div>
            <div>
              <label className="block text-[12px] text-[#64748b] font-medium mb-1.5">Status</label>
              <Dropdown
                value={formData.status}
                options={statusOptions}
                onChange={(e) => setFormData({ ...formData, status: e.value })}
                className="!w-full !text-[13px] [&_.p-dropdown-label]:!py-2.5 [&_.p-dropdown-label]:!px-3 !rounded-[8px] !border-[#e2e8f0]"
              />
            </div>
          </div>
        </div>
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

      {/* Send Notification Dialog */}
      {(() => {
        const sColor = notifDriver ? statusStyles[notifDriver.status] : { text: "#d97706", bg: "#fffbeb", dot: "#f59e0b" };
        return (
      <Dialog
        visible={notifDialogVisible}
        onHide={() => setNotifDialogVisible(false)}
        header={
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: sColor.bg }}
            >
              <Bell className="w-4.5 h-4.5" style={{ color: sColor.text }} />
            </div>
            <div>
              <span className="text-[15px] text-[#0f172a] font-semibold">Send Notification</span>
              {notifDriver && (
                <p className="text-[11px] text-[#64748b] font-normal mt-0.5">
                  To: <span className="text-[#334155] font-medium">{notifDriver.fullName}</span>
                  <span className="mx-1.5 text-[#e2e8f0]">•</span>
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                    style={{
                      color: sColor.text,
                      backgroundColor: sColor.bg,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: sColor.dot }}
                    />
                    {notifDriver.status}
                  </span>
                </p>
              )}
            </div>
          </div>
        }
        modal
        dismissableMask
        draggable={false}
        className="!w-[520px] !rounded-[12px] overflow-hidden"
        contentClassName="!px-6 !py-5"
        headerClassName="!px-6 !py-4 !border-b-2"
        pt={{ headerActions: { style: { alignSelf: "flex-start", paddingTop: 4 } } }}
      >
        {/* Status-colored top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: sColor.dot }} />

        <div className="flex flex-col gap-5">
          {/* Notification Type Toggle */}
          <div>
            <label className="block text-[12px] text-[#64748b] font-medium mb-2">Notification Channel</label>
            <div className="grid grid-cols-2 gap-2.5">
              {([
                { key: "push" as NotificationType, label: "Push Notification", desc: "Send to driver app", icon: <Smartphone className="w-4 h-4" />, color: "#d97706" },
                { key: "email" as NotificationType, label: "Email", desc: "Send to inbox", icon: <Mail className="w-4 h-4" />, color: "#6366f1" },
              ]).map((ch) => {
                const isSelected = notifTypes.includes(ch.key);
                return (
                  <button
                    key={ch.key}
                    type="button"
                    onClick={() => toggleNotifType(ch.key)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-[10px] border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? ""
                        : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                    }`}
                    style={{
                      borderColor: isSelected ? ch.color : undefined,
                      backgroundColor: isSelected ? ch.color + "08" : undefined,
                    }}
                  >
                    {/* Checkmark badge */}
                    {isSelected && (
                      <div
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: ch.color }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isSelected ? ch.color + "18" : "#f1f5f9",
                        color: isSelected ? ch.color : "#94a3b8",
                      }}
                    >
                      {ch.icon}
                    </div>
                    <div>
                      <span className={`block text-[13px] font-medium ${isSelected ? "text-[#0f172a]" : "text-[#64748b]"}`}>
                        {ch.label}
                      </span>
                      <span className="block text-[10px] text-[#94a3b8] mt-0.5">{ch.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] text-[#64748b] font-medium">Message</label>
              <span className="text-[10px] text-[#94a3b8]">{notifMessage.length} characters</span>
            </div>
            <textarea
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              rows={8}
              className="w-full text-[13px] text-[#334155] py-3 px-3.5 rounded-[10px] border border-[#e2e8f0] resize-none focus:outline-none transition-all placeholder:text-[#cbd5e1]"
              onFocus={(e) => {
                e.target.style.borderColor = sColor.text;
                e.target.style.boxShadow = `0 0 0 3px ${sColor.text}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
              }}
              placeholder="Type your notification message..."
            />
            {notifDriver && (
              <button
                type="button"
                onClick={() => setNotifMessage(statusNotificationMessages[notifDriver.status](notifDriver.fullName))}
                className="mt-1.5 text-[11px] font-medium px-2 py-1 rounded transition-colors cursor-pointer"
                style={{ color: sColor.text }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sColor.bg; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                Reset to default message
              </button>
            )}
          </div>

          {/* Preview Info */}
          {notifDriver && notifTypes.length > 0 && (
            <div className="flex flex-col gap-2">
              {notifTypes.includes("push") && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-[10px] border border-[#fde68a] bg-[#fffbeb]">
                  <div className="shrink-0 mt-0.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#d97706]" />
                  </div>
                  <div className="text-[11px]">
                    <p className="text-[#475569] font-medium">Push notification will be sent to:</p>
                    <p className="text-[#64748b] mt-0.5">{notifDriver.fullName}'s InnoTaxi Driver App</p>
                  </div>
                </div>
              )}
              {notifTypes.includes("email") && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-[10px] border border-[#c7d2fe] bg-[#eef2ff]">
                  <div className="shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-[#6366f1]" />
                  </div>
                  <div className="text-[11px]">
                    <p className="text-[#475569] font-medium">Email will be sent to:</p>
                    <p className="text-[#64748b] mt-0.5">{notifDriver.email}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {notifTypes.length === 0 && (
            <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-[10px] border border-[#fecaca] bg-[#fef2f2]">
              <div className="shrink-0">
                <X className="w-3.5 h-3.5 text-[#e53935]" />
              </div>
              <p className="text-[11px] text-[#e53935] font-medium">Please select at least one notification channel.</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: sColor.bg }}>
            <p className="text-[11px] text-[#94a3b8]">
              {notifTypes.length === 0
                ? "No channel selected"
                : `Channel: ${notifTypes.map((t) => t === "push" ? "Push Notification" : "Email").join(" & ")}`}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNotifDialogVisible(false)}
                className="px-4 py-2 border border-[#e2e8f0] text-[#475569] rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendNotification}
                disabled={!notifMessage.trim() || notifTypes.length === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-[13px] font-medium transition-colors ${
                  !notifMessage.trim() || notifTypes.length === 0
                    ? "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
                    : "text-white cursor-pointer"
                }`}
                style={{
                  backgroundColor: (!notifMessage.trim() || notifTypes.length === 0)
                    ? undefined
                    : sColor.text,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                {notifTypes.length === 2
                  ? "Send Both"
                  : notifTypes.includes("push")
                    ? "Send Push"
                    : notifTypes.includes("email")
                      ? "Send Email"
                      : "Send"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
        );
      })()}

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
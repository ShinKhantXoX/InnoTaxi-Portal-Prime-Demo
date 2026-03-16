import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Highlight, themes } from "prism-react-renderer";
import { IdCard, ArrowLeft, Code2, Copy, Check, X, ChevronDown, Info, Database, Hash, ShieldCheck, ShieldX, Clock, FileText, Pencil, AlertCircle, CheckCircle, XCircle, AlertTriangle, Calendar, Droplets, ScrollText, ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import { type DriverLicenseProfileData, type LicenseProfileStatus } from "./DriverLicenseProfile";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";

// ── Mock Data ──
const mockData: DriverLicenseProfileData[] = [
  { id: 1, driverId: "DRV-001", name: "Aung Min Htut", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1615524376009-e7f29add6ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "THA", licenseNumber: "DL-2024-001", dateOfBirth: "1990-05-12", nrc: "12/ThaGaKa(N)000001", bloodType: "O+", licenseTerms: "5 Years", issueDate: "2024-01-15", expiredAt: "2029-01-15", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "REJECT", createdAt: "2024-01-10", updatedAt: "2024-06-15", deletedAt: null },
  { id: 2, driverId: "DRV-002", name: "Kyaw Zin Oo", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1729824186698-72333f7e92da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "KA", licenseNumber: "DL-2024-002", dateOfBirth: "1988-11-23", nrc: "5/MaRaNa(N)098765", bloodType: "A+", licenseTerms: "5 Years", issueDate: "2023-06-20", expiredAt: "2028-06-20", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "APPROVE", createdAt: "2023-06-15", updatedAt: "2024-03-20", deletedAt: null },
  { id: 3, driverId: "DRV-003", name: "Thiha Zaw", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1488820098099-8d4a4723a490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "KHA", licenseNumber: "DL-2024-003", dateOfBirth: "1995-03-08", nrc: "12/BaHaNa(N)567890", bloodType: "B+", licenseTerms: "3 Years", issueDate: "2022-03-10", expiredAt: "2025-03-10", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "UNDER_REVIEW", createdAt: "2022-03-01", updatedAt: "2025-03-11", deletedAt: null },
  { id: 4, driverId: "DRV-004", name: "Myo Win Aung", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1640658506905-351be27a1c14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "GA", licenseNumber: "DL-2024-004", dateOfBirth: "1992-07-19", nrc: "9/NaPaTa(N)345678", bloodType: "AB+", licenseTerms: "5 Years", issueDate: "2021-11-05", expiredAt: "2026-11-05", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "APPROVE", createdAt: "2021-10-28", updatedAt: "2024-08-10", deletedAt: null },
  { id: 5, driverId: "DRV-005", name: "Htet Aung Shine", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1615524376009-e7f29add6ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "GHA", licenseNumber: "DL-2024-005", dateOfBirth: "1997-01-30", nrc: "12/AuZaNa(N)123789", bloodType: "O-", licenseTerms: "5 Years", issueDate: "2024-02-28", expiredAt: "2029-02-28", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "APPROVE", createdAt: "2024-02-20", updatedAt: "2024-02-28", deletedAt: null },
  { id: 6, driverId: "DRV-006", name: "Zaw Min Tun", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1729824186698-72333f7e92da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "NGA", licenseNumber: "DL-2024-006", dateOfBirth: "1991-09-14", nrc: "5/KaBaLa(N)456123", bloodType: "A-", licenseTerms: "3 Years", issueDate: "2023-09-12", expiredAt: "2026-09-12", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "APPROVE", createdAt: "2023-09-05", updatedAt: "2024-01-18", deletedAt: null },
  { id: 7, driverId: "DRV-007", name: "Naing Lin Aung", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1488820098099-8d4a4723a490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "ZA", licenseNumber: "DL-2024-007", dateOfBirth: "1993-12-02", nrc: "12/TaMaNa(N)789456", bloodType: "B-", licenseTerms: "5 Years", issueDate: "2022-07-01", expiredAt: "2027-07-01", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "REJECT", createdAt: "2022-06-25", updatedAt: "2024-07-01", deletedAt: "2024-08-15" },
  { id: 8, driverId: "DRV-008", name: "Phyo Wai Lin", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1640658506905-351be27a1c14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "INT", licenseNumber: "DL-2024-008", dateOfBirth: "1994-06-25", nrc: "12/LaThaNa(N)321654", bloodType: "O+", licenseTerms: "3 Years", issueDate: "2024-04-10", expiredAt: "2027-04-10", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "APPROVE", createdAt: "2024-04-01", updatedAt: "2024-04-10", deletedAt: null },
  { id: 9, driverId: "DRV-009", name: "Than Htun Oo", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1615524376009-e7f29add6ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "TMP", licenseNumber: "DL-2024-009", dateOfBirth: "1989-04-17", nrc: "9/MaKhaNa(N)654987", bloodType: "AB-", licenseTerms: "1 Year", issueDate: "2024-05-01", expiredAt: "2025-05-01", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "REJECT", createdAt: "2024-04-28", updatedAt: "2024-06-01", deletedAt: "2024-07-15" },
  { id: 10, driverId: "DRV-010", name: "Wai Yan Hein", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1729824186698-72333f7e92da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "HA", licenseNumber: "DL-2024-010", dateOfBirth: "1996-10-05", nrc: "5/SaKhaNa(N)987321", bloodType: "A+", licenseTerms: "5 Years", issueDate: "2023-12-15", expiredAt: "2028-12-15", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "APPROVE", createdAt: "2023-12-10", updatedAt: "2024-05-22", deletedAt: null },
  { id: 11, driverId: "DRV-011", name: "Su Su Lwin", gender: "FEMALE", profileImage: "https://images.unsplash.com/photo-1622757678076-b926a4295f29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "SA", licenseNumber: "DL-2024-011", dateOfBirth: "1987-02-14", nrc: "12/MaBaNa(N)112233", bloodType: "B+", licenseTerms: "5 Years", issueDate: "2024-06-01", expiredAt: "2029-06-01", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "UNDER_REVIEW", createdAt: "2024-05-28", updatedAt: "2024-06-01", deletedAt: null },
  { id: 12, driverId: "DRV-012", name: "Ye Yint Aung", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1488820098099-8d4a4723a490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "KA", licenseNumber: "DL-2024-012", dateOfBirth: "1998-08-30", nrc: "7/PaKhaNa(N)998877", bloodType: "O+", licenseTerms: "3 Years", issueDate: "2024-07-20", expiredAt: "2027-07-20", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "APPROVE", createdAt: "2024-07-15", updatedAt: "2024-07-20", deletedAt: null },
  { id: 13, driverId: "DRV-013", name: "May Thu Zar", gender: "FEMALE", profileImage: "https://images.unsplash.com/photo-1697510364485-e900c2fe7524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "THA", licenseNumber: "DL-2024-013", dateOfBirth: "1993-11-18", nrc: "12/DaGaMa(N)445566", bloodType: "A-", licenseTerms: "5 Years", issueDate: "2024-08-05", expiredAt: "2029-08-05", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "APPROVE", createdAt: "2024-08-01", updatedAt: "2024-08-05", deletedAt: null },
  { id: 14, driverId: "DRV-014", name: "Kaung Myat Thu", gender: "MALE", profileImage: "https://images.unsplash.com/photo-1640658506905-351be27a1c14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "GHA", licenseNumber: "DL-2024-014", dateOfBirth: "1990-04-22", nrc: "14/MaMaNa(N)667788", bloodType: "AB+", licenseTerms: "5 Years", issueDate: "2024-09-10", expiredAt: "2029-09-10", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "UNDER_REVIEW", createdAt: "2024-09-05", updatedAt: "2024-09-10", deletedAt: null },
  { id: 15, driverId: "DRV-015", name: "Ei Mon Kyaw", gender: "FEMALE", profileImage: "https://images.unsplash.com/photo-1627839134971-162a787bf754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", licenseType: "INT", licenseNumber: "DL-2024-015", dateOfBirth: "1995-07-07", nrc: "12/ThaLaNa(N)223344", bloodType: "B-", licenseTerms: "3 Years", issueDate: "2024-10-01", expiredAt: "2027-10-01", licenseFrontImage: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?w=400", licenseBackImage: "https://images.unsplash.com/photo-1600373633615-9b045feaa299?w=400", status: "APPROVE", createdAt: "2024-09-28", updatedAt: "2024-10-01", deletedAt: null },
];

const statusStyles: Record<LicenseProfileStatus, { text: string; bg: string; dot: string; label: string }> = {
  UNDER_REVIEW: { text: "#d97706", bg: "#fffbeb", dot: "#f59e0b", label: "Under Review" },
  REJECT: { text: "#e53935", bg: "#fef2f2", dot: "#ef4444", label: "Rejected" },
  APPROVE: { text: "#16a34a", bg: "#f0fdf4", dot: "#22c55e", label: "Approved" },
};

function formatDate(dateStr: string) {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function DriverLicenseProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = mockData.find((d) => d.id === Number(id));
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-[#e53935]" />
        </div>
        <h2 className="text-[18px] text-[#0f172a] font-semibold">License Profile Not Found</h2>
        <p className="text-[13px] text-[#64748b]">The requested license profile does not exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#e53935] text-white rounded-lg text-[13px] font-medium hover:bg-[#d32f2f] transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const s = statusStyles[item.status];

  const fields: { label: string; value: string; icon: typeof IdCard; mono?: boolean }[] = [
    { label: "Status", value: statusStyles[item.status].label, icon: ShieldCheck },
    { label: "Name", value: item.name, icon: IdCard },
    { label: "License Type", value: item.licenseType, icon: FileText },
    { label: "License Number", value: item.licenseNumber, icon: Hash, mono: true },
    { label: "Date of Birth", value: formatDate(item.dateOfBirth), icon: Calendar },
    { label: "NRC", value: item.nrc, icon: FileText, mono: true },
    { label: "Blood Type", value: item.bloodType, icon: Droplets },
    { label: "License Terms", value: item.licenseTerms, icon: ScrollText },
    { label: "Issue Date", value: formatDate(item.issueDate), icon: Calendar },
    { label: "Expired At", value: formatDate(item.expiredAt), icon: Clock },
  ];

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] text-[#64748b] hover:text-[#0f172a] font-medium transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to License Profiles
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#94a3b8] font-mono">ID: {item.id}</span>
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ color: s.text, backgroundColor: s.bg }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
            {s.label}
          </span>
        </div>
      </div>

      {/* Detail Card — matches Figma image layout */}
      <div className="bg-white rounded-[12px] border border-[#e2e8f0] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fecaca] to-[#fef2f2] flex items-center justify-center text-[14px] text-[#e53935] font-bold">
              {item.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="text-[17px] text-[#0f172a] font-semibold">{item.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-[#6366f1] font-mono font-medium px-1.5 py-0.5 rounded bg-[#eef2ff]">{item.driverId}</span>
                <span className="text-[11px] text-[#94a3b8]">{item.licenseNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fields grid — matching image layout */}
        <div className="p-6 space-y-5">
          {/* STATUS */}
          <div>
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-[1px] font-semibold mb-2">Status</p>
            <span
              className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full"
              style={{ color: s.text, backgroundColor: s.bg }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.dot }} />
              {s.label.toUpperCase()}
            </span>
          </div>

          {/* Row 1: NAME, LICENSE TYPE, LICENSE NUMBER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailField label="Name" value={item.name} />
            <DetailField label="License Type" value={item.licenseType} />
            <DetailField label="License Number" value={item.licenseNumber} mono />
          </div>

          {/* Row 2: DATE OF BIRTH, NRC, BLOOD TYPE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailField label="Date of Birth" value={formatDate(item.dateOfBirth)} />
            <DetailField label="NRC" value={item.nrc} mono />
            <DetailField label="Blood Type" value={item.bloodType} />
          </div>

          {/* Row 3: LICENSE TERMS, ISSUE DATE, EXPIRED AT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailField label="License Terms" value={item.licenseTerms} />
            <DetailField label="Issue Date" value={formatDate(item.issueDate)} />
            <DetailField label="Expired At" value={formatDate(item.expiredAt)} />
          </div>

          {/* Row 4: LICENSE FRONT IMAGE, LICENSE BACK IMAGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-[1px] font-semibold mb-2">License Front Image</p>
              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden aspect-[16/10]">
                <img
                  src={item.licenseFrontImage}
                  alt="License Front"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-[1px] font-semibold mb-2">License Back Image</p>
              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden aspect-[16/10]">
                <img
                  src={item.licenseBackImage}
                  alt="License Back"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-[#e2e8f0] pt-5">
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-[1px] font-semibold mb-3">Record Metadata</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailField label="Driver ID" value={item.driverId} mono />
              <DetailField label="Created At" value={formatDate(item.createdAt)} />
              <DetailField label="Updated At" value={formatDate(item.updatedAt)} />
              <DetailField label="Deleted At" value={item.deletedAt ? formatDate(item.deletedAt) : "\u2014"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-[#94a3b8] uppercase tracking-[1px] font-semibold mb-1.5">{label}</p>
      <div className="px-3 py-2.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc]">
        <p className={`text-[13px] text-[#0f172a] font-medium ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
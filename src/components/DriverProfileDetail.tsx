import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Highlight, themes } from "prism-react-renderer";
import { User, ArrowLeft, Code2, Copy, Check, X, ChevronDown, Info, Database, MapPin, Hash, ShieldCheck, ShieldX, Clock, FileText, Pencil, AlertCircle, CheckCircle, XCircle, AlertTriangle, Send, Smartphone, Mail } from "lucide-react";
import { motion } from "motion/react";
import { type DriverProfile, type ProfileStatus } from "./DriverProfileList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";

// ── Mock Data (imported separately to avoid circular dep in real app) ──
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

const statusStyles: Record<ProfileStatus, { text: string; bg: string; dot: string; label: string }> = {
  UNDER_REVIEW: { text: "#d97706", bg: "#fffbeb", dot: "#f59e0b", label: "Under Review" },
  REJECT: { text: "#e53935", bg: "#fef2f2", dot: "#ef4444", label: "Rejected" },
  APPROVE: { text: "#16a34a", bg: "#f0fdf4", dot: "#22c55e", label: "Approved" },
};

function formatDate(dateStr: string) {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ── Frontend code templates ──
const detailReactCode = `// DriverProfileDetail.tsx - PrimeReact + React Router
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export function DriverProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(\\\`/api/v1/driver-profiles/\\\${id}\\\`)
      .then((res) => res.json())
      .then((data) => setItem(data.data));
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="min-h-full">
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>Driver Profile Detail</h1>
      <div className="bg-white rounded-xl border p-6">
        <div><label>Name</label><span>{item.name}</span></div>
        <div><label>Address</label><span>{item.currentAddress}</span></div>
        <div><label>Region</label><span>{item.regionAndState}</span></div>
        <div><label>City</label><span>{item.city}</span></div>
        <div><label>Township</label><span>{item.township}</span></div>
        <div><label>Status</label><span>{item.status}</span></div>
      </div>
    </div>
  );
}`;

const detailVueCode = `<!-- DriverProfileDetail.vue - PrimeVue + Vue Router -->
<template>
  <div class="min-h-full">
    <button @click="router.back()">Back</button>
    <h1>Driver Profile Detail</h1>
    <div class="bg-white rounded-xl border p-6" v-if="item">
      <div><label>Name</label><span>{{ item.name }}</span></div>
      <div><label>Address</label><span>{{ item.currentAddress }}</span></div>
      <div><label>Region</label><span>{{ item.regionAndState }}</span></div>
      <div><label>City</label><span>{{ item.city }}</span></div>
      <div><label>Township</label><span>{{ item.township }}</span></div>
      <div><label>Status</label><span>{{ item.status }}</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const item = ref(null);

onMounted(async () => {
  const res = await fetch(\\\`/api/v1/driver-profiles/\\\${route.params.id}\\\`);
  const data = await res.json();
  item.value = data.data;
});
</script>`;

const detailAngularCode = `// driver-profile-detail.component.ts - PrimeNG + Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-driver-profile-detail',
  standalone: true,
  template: \\\`
    <div class="min-h-full">
      <button (click)="goBack()">Back</button>
      <h1>Driver Profile Detail</h1>
      <div *ngIf="item" class="bg-white rounded-xl border p-6">
        <div><label>Name</label><span>{{ item.name }}</span></div>
        <div><label>Address</label><span>{{ item.currentAddress }}</span></div>
        <div><label>Region</label><span>{{ item.regionAndState }}</span></div>
      </div>
    </div>
  \\\`,
})
export class DriverProfileDetailComponent implements OnInit {
  item: any = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(\\\`/api/v1/driver-profiles/\\\${id}\\\`)
      .subscribe((res: any) => this.item = res.data);
  }

  goBack() { this.router.navigate(['/dashboard']); }
}`;

// ── Backend code templates ──
const detailBackendCode: Record<string, string> = {
  nestjs: `// driver-profiles.controller.ts - NestJS
@Get(':id')
async findOne(@Param('id') id: string) {
  const data = await this.driverProfilesService.findOne(+id);
  if (!data) throw new NotFoundException('Driver profile not found');
  return { success: true, data };
}`,
  nodejs: `// driver-profiles.routes.ts - Express
router.get('/api/v1/driver-profiles/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'SELECT * FROM driver_profiles WHERE id = $1 AND deleted_at IS NULL', [id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  res.json({ success: true, data: result.rows[0] });
});`,
  java: `// DriverProfileController.java - Spring Boot
@GetMapping("/{id}")
public ResponseEntity<Map<String, Object>> findOne(@PathVariable Long id) {
    DriverProfile profile = service.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
    return ResponseEntity.ok(Map.of("success", true, "data", profile));
}`,
  laravel: `<?php
public function show($id)
{
    $profile = DriverProfile::findOrFail($id);
    return response()->json(['success' => true, 'data' => $profile]);
}`,
  python: `# views.py - Django REST Framework
@api_view(['GET'])
def driver_profile_detail(request, pk):
    profile = get_object_or_404(DriverProfile, pk=pk)
    serializer = DriverProfileSerializer(profile)
    return Response({'success': True, 'data': serializer.data})`,
  csharp: `// DriverProfilesController.cs - ASP.NET Core
[HttpGet("{id}")]
public async Task<IActionResult> FindOne(int id)
{
    var profile = await _context.DriverProfiles.FindAsync(id);
    if (profile == null) return NotFound(new { success = false });
    return Ok(new { success = true, data = profile });
}`,
  golang: `// driver_profiles_handler.go - Go + Gin
func GetDriverProfile(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        id := c.Param("id")
        var profile DriverProfile
        if err := db.First(&profile, id).Error; err != nil {
            c.JSON(404, gin.H{"success": false, "message": "Not found"})
            return
        }
        c.JSON(200, gin.H{"success": true, "data": profile})
    }
}`,
  ruby: `# driver_profiles_controller.rb - Ruby on Rails
def show
  profile = DriverProfile.find(params[:id])
  render json: { success: true, data: profile }
rescue ActiveRecord::RecordNotFound
  render json: { success: false, message: 'Not found' }, status: :not_found
end`,
};

const detailBackendFileConfig: Record<string, string> = {
  nestjs: "driver-profiles.controller.ts",
  nodejs: "driver-profiles.routes.ts",
  java: "DriverProfileController.java",
  laravel: "DriverProfileController.php",
  python: "views.py",
  csharp: "DriverProfilesController.cs",
  golang: "driver_profiles_handler.go",
  ruby: "driver_profiles_controller.rb",
};

const databaseSchema = `-- driver_profiles table schema (PostgreSQL)
-- Database: innotaxi

CREATE TABLE IF NOT EXISTS driver_profiles (
    id               SERIAL PRIMARY KEY,
    driver_id        VARCHAR(20)   NOT NULL UNIQUE,
    profile_image    VARCHAR(500),
    name             VARCHAR(200)  NOT NULL,
    current_address  TEXT          NOT NULL,
    region_and_state VARCHAR(100)  NOT NULL,
    city             VARCHAR(100)  NOT NULL,
    township         VARCHAR(100)  NOT NULL,
    postal_code      VARCHAR(20)   NOT NULL,
    status           VARCHAR(20)   NOT NULL DEFAULT 'UNDER_REVIEW',
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_driver_profiles_driver_id ON driver_profiles(driver_id);
CREATE INDEX idx_driver_profiles_status ON driver_profiles(status);
CREATE INDEX idx_driver_profiles_region ON driver_profiles(region_and_state);`;

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

export function DriverProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<DriverProfile | null>(null);

  // Code preview state
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);
  const [codeCategory, setCodeCategory] = useState<"frontend" | "backend" | "database">("frontend");
  const [codeFramework, setCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [backendLang, setBackendLang] = useState<BackendLang>("nestjs");
  const [backendLangOpen, setBackendLangOpen] = useState(false);
  const backendLangRef = useRef<HTMLDivElement>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Confirm status dialog state
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: string | null }>({ open: false, action: null });
  const [notificationMessage, setNotificationMessage] = useState("");
  const [deliverViaNoti, setDeliverViaNoti] = useState(true);
  const [deliverViaEmail, setDeliverViaEmail] = useState(true);
  const [successToasts, setSuccessToasts] = useState<{ id: number; title: string; description: string; color: string; bg: string }[]>([]);

  useEffect(() => {
    const numId = parseInt(id || "0");
    const found = mockData.find((d) => d.id === numId);
    setItem(found || null);
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backendLangRef.current && !backendLangRef.current.contains(e.target as Node)) {
        setBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBack = () => {
    sessionStorage.setItem("innotaxi_active_item", "Driver Profile");
    navigate("/dashboard");
  };

  // Code preview helpers
  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: detailReactCode, vue: detailVueCode, angular: detailAngularCode }[codeFramework];
    }
    if (codeCategory === "database") return databaseSchema;
    return detailBackendCode[backendLang] || detailBackendCode.nestjs;
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "DriverProfileDetail.tsx", vue: "DriverProfileDetail.vue", angular: "driver-profile-detail.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") return "driver_profiles.sql";
    return detailBackendFileConfig[backendLang] || detailBackendFileConfig.nestjs;
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

  if (!item) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto mb-3">
            <X className="w-6 h-6 text-[#e53935]" />
          </div>
          <h2 className="text-[16px] text-[#0f172a] font-semibold mb-1">Profile Not Found</h2>
          <p className="text-[12px] text-[#94a3b8] mb-4">The driver profile you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
          >
            Back to Driver Profiles
          </button>
        </div>
      </div>
    );
  }

  const s = statusStyles[item.status];

  const infoRows: { label: string; value: string; icon: React.ReactNode; mono?: boolean }[] = [
    { label: "Driver ID", value: item.driverId, icon: <Hash className="w-3.5 h-3.5" />, mono: true },
    { label: "Name", value: item.name, icon: <User className="w-3.5 h-3.5" /> },
    { label: "Current Address", value: item.currentAddress, icon: <MapPin className="w-3.5 h-3.5" /> },
    { label: "Region & State", value: item.regionAndState, icon: <MapPin className="w-3.5 h-3.5" /> },
    { label: "City", value: item.city, icon: <MapPin className="w-3.5 h-3.5" /> },
    { label: "Township", value: item.township, icon: <MapPin className="w-3.5 h-3.5" /> },
    { label: "Postal Code", value: item.postalCode, icon: <FileText className="w-3.5 h-3.5" />, mono: true },
    { label: "Created At", value: formatDate(item.createdAt), icon: <Clock className="w-3.5 h-3.5" /> },
    { label: "Updated At", value: formatDate(item.updatedAt), icon: <Clock className="w-3.5 h-3.5" /> },
    { label: "Deleted At", value: item.deletedAt ? formatDate(item.deletedAt) : "\u2014", icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Driver Profiles
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center">
              <User className="w-5 h-5 text-[#2563eb]" />
            </div>
            <div>
              <h1 className="text-[20px] text-[#0f172a] font-semibold">
                Driver Profile Detail
              </h1>
              <p className="text-[12px] text-[#94a3b8]">
                Viewing profile for {item.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCodePreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[12px] text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#c7d2fe]"
          >
            <Code2 className="w-3.5 h-3.5" />
            View Code
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-[12px] border border-[#e2e8f0] overflow-hidden">
        {/* Card Header with Avatar */}
        <div className="px-6 py-5 border-b border-[#f1f5f9] bg-gradient-to-r from-[#f8fafc] to-white flex items-center gap-4">
          <img
            src={item.profileImage}
            alt={item.name}
            className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1">
              <h2 className="text-[16px] text-[#0f172a] font-semibold">{item.name}</h2>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ color: s.text, backgroundColor: s.bg }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                {s.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-[#64748b]">
              <span className="font-mono text-[#6366f1] bg-[#eef2ff] px-2 py-0.5 rounded">{item.driverId}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.city}, {item.regionAndState}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoRows.map((row, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-[8px] bg-[#f8fafc] border border-[#f1f5f9]">
                
                <div className="min-w-0">
                  <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">{row.label}</p>
                  <p className={`text-[13px] text-[#0f172a] mt-0.5 ${row.mono ? "font-mono" : ""}`}>{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-end gap-2.5">
          <button
            onClick={() => setConfirmDialog({ open: true, action: "UNDER_REVIEW" })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-[#92400e] bg-[#fffbeb] border border-[#fde68a] hover:bg-[#fef3c7] transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            Under Review
          </button>
          <button
            onClick={() => setConfirmDialog({ open: true, action: "REJECT" })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] hover:bg-[#fee2e2] transition-colors cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
          <button
            onClick={() => setConfirmDialog({ open: true, action: "APPROVE" })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-[#16a34a] border border-[#15803d] hover:bg-[#15803d] transition-colors cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Approve
          </button>
        </div>
      </div>

      {/* Confirm Status Dialog */}
      <Dialog
        visible={confirmDialog.open}
        onHide={() => { setConfirmDialog({ open: false, action: null }); setNotificationMessage(""); }}
        modal
        dismissableMask
        draggable={false}
        resizable={false}
        className="!border-none !shadow-none"
        contentClassName="!p-0 !bg-transparent"
        headerClassName="!hidden"
        maskClassName="!bg-black/50 !backdrop-blur-sm"
        style={{ width: "480px", maxWidth: "92vw" }}
        pt={{ root: { className: "!bg-transparent !border-none !shadow-none" } }}
      >
        {(() => {
          const actionConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string; hoverBg: string; iconBg: string; headerBg: string }> = {
            UNDER_REVIEW: {
              label: "Under Review",
              icon: <Clock className="w-5 h-5 text-[#d97706]" />,
              color: "#92400e",
              bg: "#fffbeb",
              border: "#fde68a",
              hoverBg: "#fef3c7",
              iconBg: "#fef3c7",
              headerBg: "from-[#fffbeb] to-[#fef3c7]",
            },
            REJECT: {
              label: "Reject",
              icon: <XCircle className="w-5 h-5 text-[#dc2626]" />,
              color: "#dc2626",
              bg: "#fef2f2",
              border: "#fecaca",
              hoverBg: "#fee2e2",
              iconBg: "#fee2e2",
              headerBg: "from-[#fef2f2] to-[#fee2e2]",
            },
            APPROVE: {
              label: "Approve",
              icon: <CheckCircle className="w-5 h-5 text-[#16a34a]" />,
              color: "#16a34a",
              bg: "#f0fdf4",
              border: "#bbf7d0",
              hoverBg: "#dcfce7",
              iconBg: "#dcfce7",
              headerBg: "from-[#f0fdf4] to-[#dcfce7]",
            },
          };
          const cfg = actionConfig[confirmDialog.action || "UNDER_REVIEW"];

          return (
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#e2e8f0]">
              {/* Dialog Header */}
              <div className={`flex items-center justify-between px-5 py-4 bg-gradient-to-r ${cfg.headerBg} border-b border-[#e2e8f0]`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.iconBg }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <h3 className="text-[14px] text-[#0f172a] font-semibold">Confirm {cfg.label}</h3>
                    <p className="text-[11px] text-[#64748b] mt-0.5">
                      Profile section &middot; Driver #{item.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setConfirmDialog({ open: false, action: null }); setNotificationMessage(""); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#fee2e2] hover:text-[#ef4444] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dialog Body */}
              <div className="px-5 py-4">
                {/* Confirmation Message */}
                <div className="flex items-start gap-2.5 mb-4 p-3 rounded-lg" style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: cfg.color }} />
                  <p className="text-[12px] text-[#475569]">
                    {confirmDialog.action === "APPROVE"
                      ? `Are you sure you want to approve the Profile section for ${item.name}?`
                      : confirmDialog.action === "REJECT"
                      ? `Are you sure you want to reject the Profile section for ${item.name}? The driver will be notified.`
                      : `Are you sure you want to set the Profile section for ${item.name} to Under Review?`}
                  </p>
                </div>

                {/* Notification Message Textarea */}
                <div className="mb-4">
                  <label className="flex items-center gap-1.5 text-[11px] text-[#64748b] uppercase tracking-[0.3px] font-medium mb-2">
                    <Send className="w-3 h-3" />
                    Notification Message
                  </label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder={
                      confirmDialog.action === "APPROVE"
                        ? `Dear ${item.name},\n\nYour Profile section has been approved. You are now cleared to proceed.\n\nThank you,\nInnoTaxi Admin Team`
                        : confirmDialog.action === "REJECT"
                        ? `Dear ${item.name},\n\nYour Profile section has been rejected. Please review the following issues and resubmit:\n\n- [Reason for rejection]\n\nPlease update your information at your earliest convenience.\n\nThank you,\nInnoTaxi Admin Team`
                        : `Dear ${item.name},\n\nYour Profile section is currently under review. Our team is verifying your submitted information.\n\nYou will be notified once the review is complete.\n\nThank you,\nInnoTaxi Admin Team`
                    }
                    rows={5}
                    className="w-full px-3 py-2.5 rounded-lg text-[12px] text-[#0f172a] placeholder:text-[#94a3b8] border transition-colors resize-none focus:outline-none focus:ring-2"
                    style={{
                      borderColor: cfg.border,
                    }}
                    onFocus={(e) => { e.target.style.borderColor = cfg.color; e.target.style.boxShadow = `0 0 0 2px ${cfg.border}`; }}
                    onBlur={(e) => { e.target.style.borderColor = cfg.border; e.target.style.boxShadow = "none"; }}
                  />
                  {/* Delivery Channel Indicator */}
                  <div className="flex items-center gap-3 mt-2.5 px-1">
                    <span className="text-[10px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">Deliver via</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliverViaNoti(!deliverViaNoti)}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all cursor-pointer ${
                          deliverViaNoti
                            ? "bg-[#f0fdf4] border-[#bbf7d0]"
                            : "bg-[#f8fafc] border-[#e2e8f0] opacity-50"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors ${
                            deliverViaNoti
                              ? "bg-[#16a34a] border-[#15803d]"
                              : "bg-white border-[#cbd5e1]"
                          }`}
                        >
                          {deliverViaNoti && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <Smartphone className={`w-3 h-3 ${deliverViaNoti ? "text-[#16a34a]" : "text-[#94a3b8]"}`} />
                        <span className={`text-[10px] font-medium ${deliverViaNoti ? "text-[#16a34a]" : "text-[#94a3b8]"}`}>Push Notification</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliverViaEmail(!deliverViaEmail)}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all cursor-pointer ${
                          deliverViaEmail
                            ? "bg-[#eff6ff] border-[#bfdbfe]"
                            : "bg-[#f8fafc] border-[#e2e8f0] opacity-50"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors ${
                            deliverViaEmail
                              ? "bg-[#3b82f6] border-[#2563eb]"
                              : "bg-white border-[#cbd5e1]"
                          }`}
                        >
                          {deliverViaEmail && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <Mail className={`w-3 h-3 ${deliverViaEmail ? "text-[#3b82f6]" : "text-[#94a3b8]"}`} />
                        <span className={`text-[10px] font-medium ${deliverViaEmail ? "text-[#3b82f6]" : "text-[#94a3b8]"}`}>Email</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="px-5 py-3.5 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-end gap-2">
                <button
                  onClick={() => { setConfirmDialog({ open: false, action: null }); setNotificationMessage(""); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-[#64748b] bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const action = confirmDialog.action || "UNDER_REVIEW";
                    const actionLabels: Record<string, string> = { APPROVE: "Approved", REJECT: "Rejected", UNDER_REVIEW: "Set to Under Review" };
                    const toastColors: Record<string, string> = { APPROVE: "#16a34a", REJECT: "#dc2626", UNDER_REVIEW: "#d97706" };
                    const toastBgs: Record<string, string> = { APPROVE: "#f0fdf4", REJECT: "#fef2f2", UNDER_REVIEW: "#fffbeb" };
                    setItem({ ...item, status: action as ProfileStatus, updatedAt: new Date().toISOString().split("T")[0] });
                    const newToast = {
                      id: Date.now(),
                      title: `${actionLabels[action]}`,
                      description: `${item.name}'s Profile has been ${actionLabels[action].toLowerCase()}.${notificationMessage ? " Notification sent." : ""}`,
                      color: toastColors[action],
                      bg: toastBgs[action],
                    };
                    setSuccessToasts((prev) => [...prev, newToast]);
                    setTimeout(() => setSuccessToasts((prev) => prev.filter((t) => t.id !== newToast.id)), 4000);
                    setConfirmDialog({ open: false, action: null });
                    setNotificationMessage("");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
                  style={{
                    color: confirmDialog.action === "APPROVE" ? "#fff" : cfg.color,
                    backgroundColor: confirmDialog.action === "APPROVE" ? "#16a34a" : cfg.bg,
                    border: `1px solid ${confirmDialog.action === "APPROVE" ? "#15803d" : cfg.border}`,
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Confirm & Notify
                </button>
              </div>
            </div>
          );
        })()}
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
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: t.color === "#16a34a" ? "#f0fdf4" : t.color === "#dc2626" ? "#fef2f2" : "#fffbeb" }}>
                {t.color === "#16a34a" ? <CheckCircle className="w-4 h-4 text-[#16a34a]" /> : t.color === "#dc2626" ? <XCircle className="w-4 h-4 text-[#dc2626]" /> : <Clock className="w-4 h-4 text-[#d97706]" />}
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
            {/* Gradient progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              className="h-[3px] rounded-full mt-3"
              style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}dd)` }}
            />
          </motion.div>
        ))}
      </div>

      {/* Code Preview Dialog */}
      <Dialog
        visible={codePreviewOpen}
        onHide={() => { setCodePreviewOpen(false); setCodeCopied(false); }}
        header={
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#eef2ff] flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-[#6366f1]" />
            </div>
            <span className="text-[15px] text-[#0f172a]">Code Preview</span>
          </div>
        }
        modal
        dismissableMask
        draggable={false}
        className="!w-[720px] !rounded-[12px]"
        contentClassName="!p-0"
        headerClassName="!px-5 !py-3.5 !border-b !border-[#e2e8f0]"
      >
        <div className="flex flex-col">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 px-5 pt-4 pb-2">
            {(["frontend", "backend", "database"] as const).map((cat) => {
              const icons = { frontend: <Code2 className="w-3.5 h-3.5" />, backend: <Database className="w-3.5 h-3.5" />, database: <Database className="w-3.5 h-3.5" /> };
              const labels = { frontend: "Frontend", backend: "Backend", database: "Database" };
              return (
                <button
                  key={cat}
                  onClick={() => setCodeCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                    codeCategory === cat
                      ? "bg-[#eef2ff] text-[#6366f1] border border-[#c7d2fe]"
                      : "text-[#64748b] hover:bg-[#f8fafc] border border-transparent"
                  }`}
                >
                  {icons[cat]}
                  {labels[cat]}
                </button>
              );
            })}
          </div>

          {/* Framework / Language selector */}
          <div className="px-5 pb-3">
            {codeCategory === "frontend" && (
              <div className="flex items-center gap-1">
                {(["react", "vue", "angular"] as const).map((fw) => {
                  const fwLabels = { react: "React", vue: "Vue", angular: "Angular" };
                  return (
                    <button
                      key={fw}
                      onClick={() => setCodeFramework(fw)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                        codeFramework === fw
                          ? "bg-[#0f172a] text-white"
                          : "text-[#64748b] hover:bg-[#f1f5f9]"
                      }`}
                    >
                      {fwLabels[fw]}
                    </button>
                  );
                })}
              </div>
            )}
            {codeCategory === "backend" && (
              <div className="relative" ref={backendLangRef}>
                <button
                  onClick={() => setBackendLangOpen(!backendLangOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium bg-[#0f172a] text-white cursor-pointer"
                >
                  {backendLangConfig[backendLang]?.icon && (
                    <img src={backendLangConfig[backendLang].icon} alt="" className="w-3.5 h-3.5" />
                  )}
                  {backendLangConfig[backendLang]?.label || backendLang}
                  <ChevronDown className={`w-3 h-3 transition-transform ${backendLangOpen ? "rotate-180" : ""}`} />
                </button>
                {backendLangOpen && (
                  <div className="absolute left-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-lg shadow-lg z-50 min-w-[180px] py-1 overflow-hidden">
                    {backendLangOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setBackendLang(opt.value as BackendLang); setBackendLangOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-[12px] transition-colors cursor-pointer ${
                          backendLang === opt.value ? "bg-[#eef2ff] text-[#6366f1] font-medium" : "text-[#475569] hover:bg-[#f8fafc]"
                        }`}
                      >
                        {opt.icon && <img src={opt.icon} alt="" className="w-4 h-4" />}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filename + Copy */}
          <div className="flex items-center justify-between px-5 py-2 bg-[#0f172a] border-t border-[#1e293b]">
            <span className="text-[11px] text-[#94a3b8] font-mono">{getFilename()}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
            >
              {codeCopied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
              {codeCopied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Code Block */}
          <div className="max-h-[400px] overflow-auto bg-[#0f172a]">
            <Highlight theme={themes.nightOwl} code={getCode()} language={getLanguage()}>
              {({ tokens, getLineProps, getTokenProps }) => (
                <pre className="!m-0 !p-4 !bg-transparent text-[12px] leading-[1.7]">
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })} className="table-row">
                      <span className="table-cell text-right pr-4 select-none text-[#475569] text-[11px] w-8">{i + 1}</span>
                      <span className="table-cell">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
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
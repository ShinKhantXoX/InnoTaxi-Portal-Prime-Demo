import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Highlight, themes } from "prism-react-renderer";
import { Car, ArrowLeft, Code2, Copy, Check, X, ChevronDown, Database, Hash, Clock, FileText, CheckCircle, XCircle, AlertTriangle, Send, Smartphone, Mail, User, Fuel, Palette, CalendarDays, Camera } from "lucide-react";
import { motion } from "motion/react";
import { type VehicleProfileData, type VehicleStatus } from "./VehicleProfile";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";

// ── Mock Data (synced with VehicleProfile list) ──
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

const statusStyles: Record<VehicleStatus, { text: string; bg: string; dot: string; label: string }> = {
  UNDER_REVIEW: { text: "#d97706", bg: "#fffbeb", dot: "#f59e0b", label: "Under Review" },
  REJECT: { text: "#e53935", bg: "#fef2f2", dot: "#ef4444", label: "Rejected" },
  APPROVED: { text: "#16a34a", bg: "#f0fdf4", dot: "#22c55e", label: "Approved" },
};

function formatDate(dateStr: string) {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ── Frontend code templates ──
const detailReactCode = `// VehicleProfileDetail.tsx - PrimeReact + React Router
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export function VehicleProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(\\\`/api/v1/vehicle-profiles/\\\${id}\\\`)
      .then((res) => res.json())
      .then((data) => setItem(data.data));
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="min-h-full">
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>Vehicle Profile Detail</h1>
      <div className="bg-white rounded-xl border p-6">
        <div><label>Vehicle ID</label><span>{item.vehicleId}</span></div>
        <div><label>Brand</label><span>{item.vehicleBrand}</span></div>
        <div><label>Model</label><span>{item.vehicleModel}</span></div>
        <div><label>Plate Number</label><span>{item.vehiclePlateNumber}</span></div>
        <div><label>Status</label><span>{item.status}</span></div>
      </div>
    </div>
  );
}`;

const detailVueCode = `<!-- VehicleProfileDetail.vue - PrimeVue + Vue Router -->
<template>
  <div class="min-h-full">
    <button @click="router.back()">Back</button>
    <h1>Vehicle Profile Detail</h1>
    <div class="bg-white rounded-xl border p-6" v-if="item">
      <div><label>Vehicle ID</label><span>{{ item.vehicleId }}</span></div>
      <div><label>Brand</label><span>{{ item.vehicleBrand }}</span></div>
      <div><label>Model</label><span>{{ item.vehicleModel }}</span></div>
      <div><label>Plate Number</label><span>{{ item.vehiclePlateNumber }}</span></div>
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
  const res = await fetch(\\\`/api/v1/vehicle-profiles/\\\${route.params.id}\\\`);
  const data = await res.json();
  item.value = data.data;
});
</script>`;

const detailAngularCode = `// vehicle-profile-detail.component.ts - PrimeNG + Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vehicle-profile-detail',
  standalone: true,
  template: \\\`
    <div class="min-h-full">
      <button (click)="goBack()">Back</button>
      <h1>Vehicle Profile Detail</h1>
      <div *ngIf="item" class="bg-white rounded-xl border p-6">
        <div><label>Vehicle ID</label><span>{{ item.vehicleId }}</span></div>
        <div><label>Brand</label><span>{{ item.vehicleBrand }}</span></div>
        <div><label>Plate Number</label><span>{{ item.vehiclePlateNumber }}</span></div>
      </div>
    </div>
  \\\`,
})
export class VehicleProfileDetailComponent implements OnInit {
  item: any = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(\\\`/api/v1/vehicle-profiles/\\\${id}\\\`)
      .subscribe((res: any) => this.item = res.data);
  }

  goBack() { this.router.navigate(['/dashboard']); }
}`;

// ── Backend code templates ──
const detailBackendCode: Record<string, string> = {
  nestjs: `// vehicle-profiles.controller.ts - NestJS
@Get(':id')
async findOne(@Param('id') id: string) {
  const data = await this.vehicleProfilesService.findOne(+id);
  if (!data) throw new NotFoundException('Vehicle profile not found');
  return { success: true, data };
}`,
  nodejs: `// vehicle-profiles.routes.ts - Express
router.get('/api/v1/vehicle-profiles/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'SELECT * FROM vehicle_profiles WHERE id = $1 AND deleted_at IS NULL', [id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  res.json({ success: true, data: result.rows[0] });
});`,
  java: `// VehicleProfileController.java - Spring Boot
@GetMapping("/{id}")
public ResponseEntity<Map<String, Object>> findOne(@PathVariable Long id) {
    VehicleProfile profile = service.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Vehicle profile not found"));
    return ResponseEntity.ok(Map.of("success", true, "data", profile));
}`,
  laravel: `<?php
public function show($id)
{
    $profile = VehicleProfile::findOrFail($id);
    return response()->json(['success' => true, 'data' => $profile]);
}`,
  python: `# views.py - Django REST Framework
@api_view(['GET'])
def vehicle_profile_detail(request, pk):
    profile = get_object_or_404(VehicleProfile, pk=pk)
    serializer = VehicleProfileSerializer(profile)
    return Response({'success': True, 'data': serializer.data})`,
  csharp: `// VehicleProfilesController.cs - ASP.NET Core
[HttpGet("{id}")]
public async Task<IActionResult> FindOne(int id)
{
    var profile = await _context.VehicleProfiles.FindAsync(id);
    if (profile == null) return NotFound(new { success = false });
    return Ok(new { success = true, data = profile });
}`,
  golang: `// vehicle_profiles_handler.go - Go + Gin
func GetVehicleProfile(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        id := c.Param("id")
        var profile VehicleProfile
        if err := db.First(&profile, id).Error; err != nil {
            c.JSON(404, gin.H{"success": false, "message": "Not found"})
            return
        }
        c.JSON(200, gin.H{"success": true, "data": profile})
    }
}`,
  ruby: `# vehicle_profiles_controller.rb - Ruby on Rails
def show
  profile = VehicleProfile.find(params[:id])
  render json: { success: true, data: profile }
rescue ActiveRecord::RecordNotFound
  render json: { success: false, message: 'Not found' }, status: :not_found
end`,
};

const detailBackendFileConfig: Record<string, string> = {
  nestjs: "vehicle-profiles.controller.ts",
  nodejs: "vehicle-profiles.routes.ts",
  java: "VehicleProfileController.java",
  laravel: "VehicleProfileController.php",
  python: "views.py",
  csharp: "VehicleProfilesController.cs",
  golang: "vehicle_profiles_handler.go",
  ruby: "vehicle_profiles_controller.rb",
};

const databaseSchema = `-- vehicle_profiles table schema (PostgreSQL)
-- Database: innotaxi

CREATE TABLE IF NOT EXISTS vehicle_profiles (
    id                   SERIAL PRIMARY KEY,
    driver_id            VARCHAR(20)   NOT NULL,
    vehicle_id           VARCHAR(20)   NOT NULL UNIQUE,
    driver_name          VARCHAR(200)  NOT NULL,
    driver_gender        VARCHAR(10)   NOT NULL,
    driver_profile_image VARCHAR(500),
    vehicle_type         VARCHAR(50)   NOT NULL,
    vehicle_brand        VARCHAR(100)  NOT NULL,
    vehicle_model        VARCHAR(100)  NOT NULL,
    vehicle_year         INTEGER       NOT NULL,
    vehicle_color        VARCHAR(50)   NOT NULL,
    vehicle_plate_number VARCHAR(30)   NOT NULL UNIQUE,
    fuel_type            VARCHAR(20)   NOT NULL,
    is_owner             BOOLEAN       NOT NULL DEFAULT TRUE,
    owner_name           VARCHAR(200),
    owner_contact_number VARCHAR(30),
    status               VARCHAR(20)   NOT NULL DEFAULT 'UNDER_REVIEW',
    created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    deleted_at           TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_vehicle_profiles_driver_id ON vehicle_profiles(driver_id);
CREATE INDEX idx_vehicle_profiles_vehicle_id ON vehicle_profiles(vehicle_id);
CREATE INDEX idx_vehicle_profiles_status ON vehicle_profiles(status);
CREATE INDEX idx_vehicle_profiles_plate ON vehicle_profiles(vehicle_plate_number);`;

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

export function VehicleProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<VehicleProfileData | null>(null);

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
  const [lightboxImage, setLightboxImage] = useState<{ label: string; src: string } | null>(null);

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
    sessionStorage.setItem("innotaxi_active_item", "Vehicle Profile");
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
      return { react: "VehicleProfileDetail.tsx", vue: "VehicleProfileDetail.vue", angular: "vehicle-profile-detail.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") return "vehicle_profiles.sql";
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
          <h2 className="text-[16px] text-[#0f172a] font-semibold mb-1">Vehicle Profile Not Found</h2>
          <p className="text-[12px] text-[#94a3b8] mb-4">The vehicle profile you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
          >
            Back to Vehicle Profiles
          </button>
        </div>
      </div>
    );
  }

  const s = statusStyles[item.status];

  const infoRows: { label: string; value: string; icon: React.ReactNode; mono?: boolean }[] = [
    { label: "Vehicle ID", value: item.vehicleId, icon: <Hash className="w-3.5 h-3.5" />, mono: true },
    { label: "Driver ID", value: item.driverId, icon: <Hash className="w-3.5 h-3.5" />, mono: true },
    { label: "Driver Name", value: item.driverName, icon: <User className="w-3.5 h-3.5" /> },
    { label: "Vehicle Type", value: item.vehicleType, icon: <Car className="w-3.5 h-3.5" /> },
    { label: "Brand", value: item.vehicleBrand, icon: <Car className="w-3.5 h-3.5" /> },
    { label: "Model", value: item.vehicleModel, icon: <Car className="w-3.5 h-3.5" /> },
    { label: "Year", value: String(item.vehicleYear), icon: <CalendarDays className="w-3.5 h-3.5" /> },
    { label: "Color", value: item.vehicleColor, icon: <Palette className="w-3.5 h-3.5" /> },
    { label: "Plate Number", value: item.vehiclePlateNumber, icon: <FileText className="w-3.5 h-3.5" />, mono: true },
    { label: "Fuel Type", value: item.fuelType, icon: <Fuel className="w-3.5 h-3.5" /> },
    { label: "Is Owner", value: item.isOwner ? "Yes" : "No", icon: <User className="w-3.5 h-3.5" /> },
    { label: "Owner Name", value: item.ownerName || "\u2014", icon: <User className="w-3.5 h-3.5" /> },
    { label: "Owner Contact", value: item.ownerContactNumber || "\u2014", icon: <Smartphone className="w-3.5 h-3.5" /> },
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
          Back to Vehicle Profiles
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#fef7ed] border border-[#fed7aa] flex items-center justify-center">
              <Car className="w-5 h-5 text-[#ea580c]" />
            </div>
            <div>
              <h1 className="text-[20px] text-[#0f172a] font-semibold">
                Vehicle Profile Detail
              </h1>
              <p className="text-[12px] text-[#94a3b8]">
                Viewing vehicle profile for {item.driverName}
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
            src={item.driverProfileImage}
            alt={item.driverName}
            className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1">
              <h2 className="text-[16px] text-[#0f172a] font-semibold">{item.driverName}</h2>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ color: s.text, backgroundColor: s.bg }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                {s.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-[#64748b]">
              <span className="font-mono text-[#6366f1] bg-[#eef2ff] px-2 py-0.5 rounded">{item.vehicleId}</span>
              <span className="flex items-center gap-1"><Car className="w-3 h-3" />{item.vehicleBrand} {item.vehicleModel} &middot; {item.vehicleType}</span>
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

          {/* Vehicle Images */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[#eef2ff] flex items-center justify-center">
                <Camera className="w-3 h-3 text-[#6366f1]" />
              </div>
              <h4 className="text-[13px] text-[#0f172a] font-semibold">Vehicle Photos</h4>
              <span className="text-[10px] text-[#94a3b8] ml-1">5 images</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Front", src: "https://images.unsplash.com/photo-1758411898245-c2edbc1a1df8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhciUyMGZyb250JTIwZ3JpbGxlJTIwaGVhZGxpZ2h0c3xlbnwxfHx8fDE3NzM2OTMwNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
                { label: "Back", src: "https://images.unsplash.com/photo-1704966784696-60d8c567f731?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjByZWFyJTIwYnVtcGVyJTIwdGFpbGxpZ2h0fGVufDF8fHx8MTc3MzY5MzA2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
                { label: "Right Side", src: "https://images.unsplash.com/photo-1730302551882-99cb98b4adc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzaWRlJTIwcHJvZmlsZSUyMHZpZXd8ZW58MXx8fHwxNzczNjkzMDU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
                { label: "Left Side", src: "https://images.unsplash.com/photo-1747573235085-aa6b21b92e07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBsZWZ0JTIwc2lkZSUyMHZpZXclMjBwYXJrZWR8ZW58MXx8fHwxNzczNjkzMDU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
                { label: "Interior", src: "https://images.unsplash.com/photo-1648799834332-e8ed22e99099?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMGRhc2hib2FyZCUyMHN0ZWVyaW5nJTIwd2hlZWx8ZW58MXx8fHwxNzczNTk1NTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
              ].map((photo) => (
                <div key={photo.label} className="group relative rounded-[8px] overflow-hidden border border-[#e2e8f0] bg-[#f1f5f9] aspect-[4/3] cursor-pointer" onClick={() => setLightboxImage(photo)}>
                  <img src={photo.src} alt={photo.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-[10px] font-medium text-white bg-gradient-to-t from-black/60 to-transparent text-center uppercase tracking-[0.5px]">
                    {photo.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Registration Dates */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[#fef7ed] flex items-center justify-center">
                <FileText className="w-3 h-3 text-[#ea580c]" />
              </div>
              <h4 className="text-[13px] text-[#0f172a] font-semibold">Vehicle Registration</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-[8px] bg-[#f8fafc] border border-[#f1f5f9]">
                <div className="min-w-0">
                  <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">Registration Issue Date</p>
                  <p className="text-[13px] text-[#0f172a] mt-0.5">{formatDate(item.vehicleRegistrationIssueDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-[8px] bg-[#f8fafc] border border-[#f1f5f9]">
                <div className="min-w-0">
                  <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">Registration Expiry Date</p>
                  <p className="text-[13px] text-[#0f172a] mt-0.5">{formatDate(item.vehicleRegistrationExpiryDate)}</p>
                </div>
              </div>
              {/* Vehicle License Front */}
              <div className="flex flex-col gap-1.5 p-3 rounded-[8px] bg-[#f8fafc] border border-[#f1f5f9]">
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">Vehicle License (Front)</p>
                <div className="group relative rounded-[6px] overflow-hidden border border-[#e2e8f0] bg-[#f1f5f9] aspect-[4/3] cursor-pointer" onClick={() => setLightboxImage({ label: "Vehicle License (Front)", src: "https://images.unsplash.com/photo-1613826488523-b537c0cab318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2lhbCUyMGRvY3VtZW50JTIwbGljZW5zZSUyMGNhcmQlMjBmcm9udHxlbnwxfHx8fDE3NzM2OTQ2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" })}>
                  <img src="https://images.unsplash.com/photo-1613826488523-b537c0cab318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2lhbCUyMGRvY3VtZW50JTIwbGljZW5zZSUyMGNhcmQlMjBmcm9udHxlbnwxfHx8fDE3NzM2OTQ2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Vehicle License Front" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-[10px] font-medium text-white bg-gradient-to-t from-black/60 to-transparent text-center uppercase tracking-[0.5px]">Front</span>
                </div>
              </div>
              {/* Vehicle License Back */}
              <div className="flex flex-col gap-1.5 p-3 rounded-[8px] bg-[#f8fafc] border border-[#f1f5f9]">
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">Vehicle License (Back)</p>
                <div className="group relative rounded-[6px] overflow-hidden border border-[#e2e8f0] bg-[#f1f5f9] aspect-[4/3] cursor-pointer" onClick={() => setLightboxImage({ label: "Vehicle License (Back)", src: "https://images.unsplash.com/photo-1620887110499-d54ecf17cefb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcmVnaXN0cmF0aW9uJTIwY2FyZCUyMGJhY2slMjBkb2N1bWVudHxlbnwxfHx8fDE3NzM2OTQ2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" })}>
                  <img src="https://images.unsplash.com/photo-1620887110499-d54ecf17cefb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcmVnaXN0cmF0aW9uJTIwY2FyZCUyMGJhY2slMjBkb2N1bWVudHxlbnwxfHx8fDE3NzM2OTQ2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Vehicle License Back" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-[10px] font-medium text-white bg-gradient-to-t from-black/60 to-transparent text-center uppercase tracking-[0.5px]">Back</span>
                </div>
              </div>
            </div>
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
            onClick={() => setConfirmDialog({ open: true, action: "APPROVED" })}
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
          const actionConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string; iconBg: string; headerBg: string }> = {
            UNDER_REVIEW: {
              label: "Under Review",
              icon: <Clock className="w-5 h-5 text-[#d97706]" />,
              color: "#92400e",
              bg: "#fffbeb",
              border: "#fde68a",
              iconBg: "#fef3c7",
              headerBg: "from-[#fffbeb] to-[#fef3c7]",
            },
            REJECT: {
              label: "Reject",
              icon: <XCircle className="w-5 h-5 text-[#dc2626]" />,
              color: "#dc2626",
              bg: "#fef2f2",
              border: "#fecaca",
              iconBg: "#fee2e2",
              headerBg: "from-[#fef2f2] to-[#fee2e2]",
            },
            APPROVED: {
              label: "Approve",
              icon: <CheckCircle className="w-5 h-5 text-[#16a34a]" />,
              color: "#16a34a",
              bg: "#f0fdf4",
              border: "#bbf7d0",
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
                      Vehicle Profile section &middot; {item.vehicleBrand} {item.vehicleModel}
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
                    {confirmDialog.action === "APPROVED"
                      ? `Are you sure you want to approve the Vehicle Profile for ${item.driverName}'s ${item.vehicleBrand} ${item.vehicleModel}?`
                      : confirmDialog.action === "REJECT"
                      ? `Are you sure you want to reject the Vehicle Profile for ${item.driverName}'s ${item.vehicleBrand} ${item.vehicleModel}? The driver will be notified.`
                      : `Are you sure you want to set the Vehicle Profile for ${item.driverName}'s ${item.vehicleBrand} ${item.vehicleModel} to Under Review?`}
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
                      confirmDialog.action === "APPROVED"
                        ? `Dear ${item.driverName},\n\nYour Vehicle Profile (${item.vehicleBrand} ${item.vehicleModel}) has been approved. You are now cleared to proceed.\n\nThank you,\nInnoTaxi Admin Team`
                        : confirmDialog.action === "REJECT"
                        ? `Dear ${item.driverName},\n\nYour Vehicle Profile (${item.vehicleBrand} ${item.vehicleModel}) has been rejected. Please review the following issues and resubmit:\n\n- [Reason for rejection]\n\nPlease update your information at your earliest convenience.\n\nThank you,\nInnoTaxi Admin Team`
                        : `Dear ${item.driverName},\n\nYour Vehicle Profile (${item.vehicleBrand} ${item.vehicleModel}) is currently under review. Our team is verifying your submitted information.\n\nYou will be notified once the review is complete.\n\nThank you,\nInnoTaxi Admin Team`
                    }
                    rows={5}
                    className="w-full px-3 py-2.5 rounded-lg text-[12px] text-[#0f172a] placeholder:text-[#94a3b8] border transition-colors resize-none focus:outline-none focus:ring-2"
                    style={{ borderColor: cfg.border }}
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
                    const actionLabels: Record<string, string> = { APPROVED: "Approved", REJECT: "Rejected", UNDER_REVIEW: "Set to Under Review" };
                    const toastColors: Record<string, string> = { APPROVED: "#16a34a", REJECT: "#dc2626", UNDER_REVIEW: "#d97706" };
                    const toastBgs: Record<string, string> = { APPROVED: "#f0fdf4", REJECT: "#fef2f2", UNDER_REVIEW: "#fffbeb" };
                    setItem({ ...item, status: action as VehicleStatus, updatedAt: new Date().toISOString().split("T")[0] });
                    const newToast = {
                      id: Date.now(),
                      title: `${actionLabels[action]}`,
                      description: `${item.driverName}'s ${item.vehicleBrand} ${item.vehicleModel} has been ${actionLabels[action].toLowerCase()}.${notificationMessage ? " Notification sent." : ""}`,
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
                    color: confirmDialog.action === "APPROVED" ? "#fff" : cfg.color,
                    backgroundColor: confirmDialog.action === "APPROVED" ? "#16a34a" : cfg.bg,
                    border: `1px solid ${confirmDialog.action === "APPROVED" ? "#15803d" : cfg.border}`,
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

      {/* Image Lightbox Dialog */}
      <Dialog
        visible={!!lightboxImage}
        onHide={() => setLightboxImage(null)}
        modal
        dismissableMask
        draggable={false}
        resizable={false}
        className="!border-none !shadow-none"
        contentClassName="!p-0 !bg-transparent"
        headerClassName="!hidden"
        maskClassName="!bg-black/80 !backdrop-blur-sm"
        style={{ width: "auto", maxWidth: "92vw" }}
        pt={{ root: { className: "!bg-transparent !border-none !shadow-none" } }}
      >
        {lightboxImage && (
          <div className="relative">
            <img
              src={lightboxImage.src}
              alt={lightboxImage.label}
              className="max-w-[80vw] max-h-[80vh] rounded-xl object-contain shadow-2xl"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-black/60 text-white text-[12px] font-medium backdrop-blur-sm">
                {lightboxImage.label}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Highlight, themes } from "prism-react-renderer";
import { User, ArrowLeft, Save, X, Code2, Copy, Check, ChevronDown, Database, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { type DriverProfile, type ProfileStatus } from "./DriverProfileList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";

const statusOptions: { label: string; value: ProfileStatus }[] = [
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Approved", value: "APPROVE" },
  { label: "Rejected", value: "REJECT" },
];

const regionOptions = [
  { label: "Yangon Region", value: "Yangon Region" },
  { label: "Mandalay Region", value: "Mandalay Region" },
  { label: "Sagaing Region", value: "Sagaing Region" },
  { label: "Naypyidaw Union Territory", value: "Naypyidaw Union Territory" },
  { label: "Bago Region", value: "Bago Region" },
  { label: "Magway Region", value: "Magway Region" },
  { label: "Tanintharyi Region", value: "Tanintharyi Region" },
  { label: "Ayeyarwady Region", value: "Ayeyarwady Region" },
  { label: "Kachin State", value: "Kachin State" },
  { label: "Kayah State", value: "Kayah State" },
  { label: "Kayin State", value: "Kayin State" },
  { label: "Chin State", value: "Chin State" },
  { label: "Mon State", value: "Mon State" },
  { label: "Rakhine State", value: "Rakhine State" },
  { label: "Shan State", value: "Shan State" },
];

// ── Frontend code templates ──
const createReactCode = `// DriverProfileAdd.tsx - PrimeReact + React Router
import { useState } from "react";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export function DriverProfileAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [regionAndState, setRegionAndState] = useState("");
  const [city, setCity] = useState("");
  const [township, setTownship] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [status, setStatus] = useState("UNDER_REVIEW");
  const [submitted, setSubmitted] = useState(false);

  const handleSave = async () => {
    setSubmitted(true);
    if (!name.trim() || !currentAddress.trim()) return;

    const res = await fetch("/api/v1/driver-profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, currentAddress, regionAndState,
        city, township, postalCode, status,
      }),
    });

    if (res.ok) {
      navigate("/dashboard", { state: { activeItem: "Driver Profile" } });
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>New Driver Profile</h1>
      <form>
        <InputText value={name} onChange={(e) => setName(e.target.value)} />
        {/* ... more fields */}
        <button onClick={handleSave}>Save</button>
      </form>
    </div>
  );
}`;

const createVueCode = `<!-- DriverProfileAdd.vue - PrimeVue + Vue Router -->
<template>
  <div>
    <button @click="router.back()">Back</button>
    <h1>New Driver Profile</h1>
    <form @submit.prevent="handleSave">
      <InputText v-model="name" />
      <InputText v-model="currentAddress" />
      <Dropdown v-model="regionAndState" :options="regionOptions" />
      <InputText v-model="city" />
      <InputText v-model="township" />
      <InputText v-model="postalCode" />
      <Dropdown v-model="status" :options="statusOptions" />
      <Button label="Save" type="submit" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const currentAddress = ref("");
const regionAndState = ref("");
const city = ref("");
const township = ref("");
const postalCode = ref("");
const status = ref("UNDER_REVIEW");

const handleSave = async () => {
  const res = await fetch("/api/v1/driver-profiles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value, currentAddress: currentAddress.value,
      regionAndState: regionAndState.value, city: city.value,
      township: township.value, postalCode: postalCode.value,
      status: status.value,
    }),
  });
  if (res.ok) router.push("/dashboard");
};
</script>`;

const createAngularCode = `// driver-profile-add.component.ts - PrimeNG + Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-profile-add',
  standalone: true,
  imports: [FormsModule],
  template: \\\`
    <div>
      <button (click)="goBack()">Back</button>
      <h1>New Driver Profile</h1>
      <form (ngSubmit)="handleSave()">
        <input [(ngModel)]="name" name="name" />
        <textarea [(ngModel)]="currentAddress" name="currentAddress"></textarea>
        <select [(ngModel)]="regionAndState" name="regionAndState">
          <option *ngFor="let r of regions" [value]="r">{{ r }}</option>
        </select>
        <input [(ngModel)]="city" name="city" />
        <input [(ngModel)]="township" name="township" />
        <input [(ngModel)]="postalCode" name="postalCode" />
        <button type="submit">Save</button>
      </form>
    </div>
  \\\`,
})
export class DriverProfileAddComponent {
  name = ''; currentAddress = ''; regionAndState = '';
  city = ''; township = ''; postalCode = '';
  status = 'UNDER_REVIEW';

  constructor(private http: HttpClient, private router: Router) {}

  handleSave() {
    this.http.post('/api/v1/driver-profiles', {
      name: this.name, currentAddress: this.currentAddress,
      regionAndState: this.regionAndState, city: this.city,
      township: this.township, postalCode: this.postalCode,
      status: this.status,
    }).subscribe(() => this.router.navigate(['/dashboard']));
  }

  goBack() { this.router.navigate(['/dashboard']); }
}`;

// ── Backend code templates ──
const createBackendCode: Record<string, string> = {
  nestjs: `// driver-profiles.controller.ts - NestJS
@Post()
@HttpCode(201)
async create(@Body() createDto: CreateDriverProfileDto) {
  const data = await this.driverProfilesService.create(createDto);
  return { success: true, data, message: 'Driver profile created successfully' };
}`,
  nodejs: `// driver-profiles.routes.ts - Express
router.post('/api/v1/driver-profiles', async (req, res) => {
  const { name, currentAddress, regionAndState, city, township, postalCode, status } = req.body;
  const driverId = 'DRV-' + String(Date.now()).slice(-3).padStart(3, '0');
  const result = await pool.query(
    'INSERT INTO driver_profiles (driver_id, name, current_address, region_and_state, city, township, postal_code, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
    [driverId, name, currentAddress, regionAndState, city, township, postalCode, status || 'UNDER_REVIEW']
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});`,
  java: `// DriverProfileController.java - Spring Boot
@PostMapping
public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody CreateDriverProfileDto dto) {
    DriverProfile profile = service.create(dto);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(Map.of("success", true, "data", profile, "message", "Profile created successfully"));
}`,
  laravel: `<?php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:200',
        'currentAddress' => 'required|string',
        'regionAndState' => 'required|string',
        'city' => 'required|string|max:100',
        'township' => 'required|string|max:100',
        'postalCode' => 'required|string|max:20',
    ]);
    $profile = DriverProfile::create($validated);
    return response()->json(['success' => true, 'data' => $profile], 201);
}`,
  python: `# views.py - Django REST Framework
@api_view(['POST'])
def driver_profile_create(request):
    serializer = DriverProfileSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({'success': True, 'data': serializer.data}, status=201)`,
  csharp: `// DriverProfilesController.cs - ASP.NET Core
[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateDriverProfileDto dto)
{
    var profile = new DriverProfile {
        Name = dto.Name, CurrentAddress = dto.CurrentAddress,
        RegionAndState = dto.RegionAndState, City = dto.City,
        Township = dto.Township, PostalCode = dto.PostalCode,
        Status = "UNDER_REVIEW"
    };
    _context.DriverProfiles.Add(profile);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(FindOne), new { id = profile.Id },
        new { success = true, data = profile });
}`,
  golang: `// driver_profiles_handler.go - Go + Gin
func CreateDriverProfile(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var profile DriverProfile
        if err := c.ShouldBindJSON(&profile); err != nil {
            c.JSON(400, gin.H{"success": false, "message": err.Error()})
            return
        }
        profile.Status = "UNDER_REVIEW"
        if err := db.Create(&profile).Error; err != nil {
            c.JSON(500, gin.H{"success": false, "message": "Failed to create"})
            return
        }
        c.JSON(201, gin.H{"success": true, "data": profile})
    }
}`,
  ruby: `# driver_profiles_controller.rb - Ruby on Rails
def create
  profile = DriverProfile.new(profile_params)
  if profile.save
    render json: { success: true, data: profile }, status: :created
  else
    render json: { success: false, errors: profile.errors.full_messages }, status: :unprocessable_entity
  end
end

private
def profile_params
  params.require(:driver_profile).permit(:name, :current_address, :region_and_state, :city, :township, :postal_code, :status)
end`,
};

const createBackendFileConfig: Record<string, string> = {
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

export function DriverProfileAdd() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [regionAndState, setRegionAndState] = useState("Yangon Region");
  const [city, setCity] = useState("");
  const [township, setTownship] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [status, setStatus] = useState<ProfileStatus>("UNDER_REVIEW");
  const [submitted, setSubmitted] = useState(false);

  // Code preview state
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);
  const [codeCategory, setCodeCategory] = useState<"frontend" | "backend" | "database">("frontend");
  const [codeFramework, setCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [backendLang, setBackendLang] = useState<BackendLang>("nestjs");
  const [backendLangOpen, setBackendLangOpen] = useState(false);
  const backendLangRef = useRef<HTMLDivElement>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Animated toast
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [savedLabel, setSavedLabel] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backendLangRef.current && !backendLangRef.current.contains(e.target as Node)) {
        setBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCancel = () => {
    sessionStorage.setItem("innotaxi_active_item", "Driver Profile");
    navigate("/dashboard");
  };

  const handleSave = () => {
    setSubmitted(true);
    if (!name.trim() || !currentAddress.trim() || !city.trim() || !township.trim() || !postalCode.trim()) return;

    const nextId = Date.now();
    const driverIdNum = String(nextId).slice(-3).padStart(3, "0");
    const newProfile: DriverProfile = {
      id: nextId,
      driverId: `DRV-${driverIdNum}`,
      profileImage: `https://i.pravatar.cc/150?u=${name.toLowerCase().replace(/\s/g, "")}`,
      name,
      currentAddress,
      regionAndState,
      city,
      township,
      postalCode,
      status,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      deletedAt: null,
    };

    const existing = sessionStorage.getItem("newDriverProfile");
    const queue: DriverProfile[] = existing ? JSON.parse(existing) : [];
    queue.push(newProfile);
    sessionStorage.setItem("newDriverProfile", JSON.stringify(queue));

    setSavedLabel(newProfile.name);
    setShowCreateNotification(true);

    setTimeout(() => {
      sessionStorage.setItem("innotaxi_active_item", "Driver Profile");
      navigate("/dashboard");
    }, 600);
  };

  // Code preview helpers
  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: createReactCode, vue: createVueCode, angular: createAngularCode }[codeFramework];
    }
    if (codeCategory === "database") return databaseSchema;
    return createBackendCode[backendLang] || createBackendCode.nestjs;
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "DriverProfileAdd.tsx", vue: "DriverProfileAdd.vue", angular: "driver-profile-add.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") return "driver_profiles.sql";
    return createBackendFileConfig[backendLang] || createBackendFileConfig.nestjs;
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

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Driver Profiles
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center">
            <User className="w-5 h-5 text-[#e53935]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold">
              New Driver Profile
            </h1>
            <p className="text-[12px] text-[#94a3b8]">
              Create a new driver profile record
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[12px] border border-[#e2e8f0] overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
          <div>
            <h2 className="text-[14px] text-[#0f172a] font-semibold">
              Profile Information
            </h2>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">Fill in the driver profile details below</p>
          </div>
          <button
            onClick={() => setCodePreviewOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#c7d2fe]"
            title="View Create Code"
          >
            <span>&lt;/&gt;</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Name *
              </label>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`!w-full !text-[13px] !py-2 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !name.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="e.g. Aung Min Htut"
              />
              {submitted && !name.trim() && <small className="text-[11px] text-[#e53935] mt-1">Name is required</small>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Status
              </label>
              <Dropdown
                value={status}
                options={statusOptions}
                onChange={(e) => setStatus(e.value)}
                className="!w-full !text-[13px] [&_.p-dropdown-label]:!py-2 [&_.p-dropdown-label]:!px-3 !rounded-[8px] !border-[#e2e8f0]"
              />
            </div>

            {/* Current Address */}
            <div className="md:col-span-3">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Current Address *
              </label>
              <InputTextarea
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                rows={2}
                className={`!w-full !text-[13px] !py-2 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none !resize-none ${submitted && !currentAddress.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="e.g. No. 45, Pyay Road, Kamayut"
              />
              {submitted && !currentAddress.trim() && <small className="text-[11px] text-[#e53935] mt-1">Address is required</small>}
            </div>

            {/* Region & State */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Region & State *
              </label>
              <Dropdown
                value={regionAndState}
                options={regionOptions}
                onChange={(e) => setRegionAndState(e.value)}
                className="!w-full !text-[13px] [&_.p-dropdown-label]:!py-2 [&_.p-dropdown-label]:!px-3 !rounded-[8px] !border-[#e2e8f0]"
                filter
                filterPlaceholder="Search region..."
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                City *
              </label>
              <InputText
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`!w-full !text-[13px] !py-2 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !city.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="e.g. Yangon"
              />
              {submitted && !city.trim() && <small className="text-[11px] text-[#e53935] mt-1">City is required</small>}
            </div>

            {/* Township */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Township *
              </label>
              <InputText
                value={township}
                onChange={(e) => setTownship(e.target.value)}
                className={`!w-full !text-[13px] !py-2 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !township.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="e.g. Kamayut"
              />
              {submitted && !township.trim() && <small className="text-[11px] text-[#e53935] mt-1">Township is required</small>}
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Postal Code *
              </label>
              <InputText
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={`!w-full !text-[13px] !py-2 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !postalCode.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="e.g. 11041"
              />
              {submitted && !postalCode.trim() && <small className="text-[11px] text-[#e53935] mt-1">Postal code is required</small>}
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="px-6 py-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
          <p className="text-[11px] text-[#94a3b8]">* Required fields</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#e2e8f0] text-[#475569] rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Create Profile
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showCreateNotification && (
        <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="bg-white rounded-[12px] border border-[#e2e8f0] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4 min-w-[340px] pointer-events-auto overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-[#16a34a]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#0f172a] font-semibold">Profile Created</p>
                <p className="text-[11px] text-[#64748b] mt-0.5">{savedLabel} has been created successfully.</p>
              </div>
            </div>
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              className="h-[3px] bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full mt-3"
            />
          </motion.div>
        </div>
      )}

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

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Highlight, themes } from "prism-react-renderer";
import { Users, ArrowLeft, Save, X, Code2, Copy, Check, ChevronDown, Database } from "lucide-react";
import { motion } from "motion/react";
import { driverMockData, type Driver, type Gender, type DriverStatus } from "./DriverList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";

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

// ── Frontend code templates ──
const createReactCode = `// DriverAdd.tsx - PrimeReact + React Router
import { useState } from "react";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export function DriverAdd() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("MALE");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [submitted, setSubmitted] = useState(false);

  const handleSave = async () => {
    setSubmitted(true);
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) return;

    const res = await fetch("/api/v1/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName, gender, dob, phoneNumber,
        email, password, status,
      }),
    });

    if (res.ok) {
      navigate("/dashboard", { state: { activeItem: "Drivers" } });
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back to Drivers</button>
      <h1>New Driver</h1>
      <form>
        <InputText value={fullName} onChange={(e) => setFullName(e.target.value)} />
        {/* ... more fields */}
        <button onClick={handleSave}>Save</button>
      </form>
    </div>
  );
}`;

const createVueCode = `<!-- DriverAdd.vue - PrimeVue + Vue Router -->
<template>
  <div>
    <button @click="router.back()">Back to Drivers</button>
    <h1>New Driver</h1>
    <form @submit.prevent="handleSave">
      <InputText v-model="fullName" />
      <Dropdown v-model="gender" :options="genderOptions" />
      <InputText type="date" v-model="dob" />
      <InputText v-model="phoneNumber" />
      <InputText v-model="email" />
      <InputText type="password" v-model="password" />
      <Dropdown v-model="status" :options="statusOptions" />
      <Button label="Save" type="submit" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const fullName = ref("");
const gender = ref("MALE");
const dob = ref("");
const phoneNumber = ref("");
const email = ref("");
const password = ref("");
const status = ref("PENDING");

const handleSave = async () => {
  const res = await fetch("/api/v1/drivers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: fullName.value, gender: gender.value,
      dob: dob.value, phoneNumber: phoneNumber.value,
      email: email.value, password: password.value,
      status: status.value,
    }),
  });
  if (res.ok) router.push("/dashboard");
};
</script>`;

const createAngularCode = `// driver-add.component.ts - PrimeNG + Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-add',
  standalone: true,
  imports: [FormsModule],
  template: \\\`
    <div>
      <button (click)="goBack()">Back to Drivers</button>
      <h1>New Driver</h1>
      <form (ngSubmit)="handleSave()">
        <input [(ngModel)]="fullName" name="fullName" />
        <select [(ngModel)]="gender" name="gender">
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
        <input type="date" [(ngModel)]="dob" name="dob" />
        <input [(ngModel)]="phoneNumber" name="phoneNumber" />
        <input [(ngModel)]="email" name="email" />
        <input type="password" [(ngModel)]="password" name="password" />
        <button type="submit">Save</button>
      </form>
    </div>
  \\\`,
})
export class DriverAddComponent {
  fullName = ''; gender = 'MALE'; dob = '';
  phoneNumber = ''; email = ''; password = '';
  status = 'PENDING';

  constructor(private http: HttpClient, private router: Router) {}

  handleSave() {
    this.http.post('/api/v1/drivers', {
      fullName: this.fullName, gender: this.gender,
      dob: this.dob, phoneNumber: this.phoneNumber,
      email: this.email, password: this.password,
      status: this.status,
    }).subscribe(() => this.router.navigate(['/dashboard']));
  }

  goBack() { this.router.navigate(['/dashboard']); }
}`;

// ── Backend code templates ──
const driverCreateBackendCode: Record<string, string> = {
  nestjs: `// drivers.controller.ts - NestJS
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';

@Controller('api/v1/drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createDriverDto: CreateDriverDto) {
    const data = await this.driversService.create(createDriverDto);
    return { success: true, data, message: 'Driver created successfully' };
  }
}`,
  nodejs: `// drivers.routes.ts - Express
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

router.post('/api/v1/drivers', async (req: Request, res: Response) => {
  const { fullName, gender, dob, phoneNumber, email, password, status } = req.body;
  const result = await pool.query(
    'INSERT INTO drivers (full_name, gender, dob, phone_number, email, password, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
    [fullName, gender, dob, phoneNumber, email, password, status || 'PENDING']
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

export default router;`,
  java: `// DriverController.java - Spring Boot
@PostMapping
public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody CreateDriverDto dto) {
    Driver driver = service.create(dto);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(Map.of("success", true, "data", driver, "message", "Driver created successfully"));
}`,
  laravel: `<?php
public function store(Request $request)
{
    $validated = $request->validate([
        'fullName' => 'required|string|max:200',
        'gender' => 'required|in:MALE,FEMALE',
        'dob' => 'required|date|before:-18 years',
        'phoneNumber' => 'required|string|unique:drivers,phone_number',
        'email' => 'required|email|unique:drivers',
        'password' => 'required|string|min:8',
    ]);
    $driver = Driver::create($validated);
    return response()->json(['success' => true, 'data' => $driver], 201);
}`,
  python: `# views.py - Django REST Framework
@api_view(['POST'])
def driver_create(request):
    serializer = DriverSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({'success': True, 'data': serializer.data}, status=201)`,
  csharp: `// DriversController.cs - ASP.NET Core
[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateDriverDto dto)
{
    var driver = new Driver {
        FullName = dto.FullName, Gender = dto.Gender,
        Dob = dto.Dob, PhoneNumber = dto.PhoneNumber,
        Email = dto.Email, Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        Status = "PENDING"
    };
    _context.Drivers.Add(driver);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(FindOne), new { id = driver.Id },
        new { success = true, data = driver });
}`,
  golang: `// drivers_handler.go - Go + Gin + GORM
func CreateDriver(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var driver Driver
        if err := c.ShouldBindJSON(&driver); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
            return
        }
        driver.Status = "PENDING"
        if err := db.Create(&driver).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create"})
            return
        }
        c.JSON(http.StatusCreated, gin.H{"success": true, "data": driver})
    }
}`,
  ruby: `# drivers_controller.rb - Ruby on Rails
def create
  driver = Driver.new(driver_params)
  if driver.save
    render json: { success: true, data: driver }, status: :created
  else
    render json: { success: false, errors: driver.errors.full_messages }, status: :unprocessable_entity
  end
end

private
def driver_params
  params.require(:driver).permit(:full_name, :gender, :dob, :phone_number, :email, :password, :status)
end`,
};

const driverCreateBackendFileConfig: Record<string, string> = {
  nestjs: "drivers.controller.ts",
  nodejs: "drivers.routes.ts",
  java: "DriverController.java",
  laravel: "DriverController.php",
  python: "views.py",
  csharp: "DriversController.cs",
  golang: "drivers_handler.go",
  ruby: "drivers_controller.rb",
};

const driverDatabaseSchema = `-- drivers table schema (PostgreSQL)
-- Database: innotaxi

CREATE TABLE IF NOT EXISTS drivers (
    id            SERIAL PRIMARY KEY,
    full_name     VARCHAR(200)  NOT NULL,
    gender        VARCHAR(10)   NOT NULL,
    dob           DATE          NOT NULL,
    prefix        VARCHAR(10)   NOT NULL DEFAULT 'Mr.',
    phone_number  VARCHAR(30)   NOT NULL UNIQUE,
    email         VARCHAR(200)  NOT NULL UNIQUE,
    password      VARCHAR(255)  NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_drivers_email ON drivers(email);
CREATE INDEX idx_drivers_phone ON drivers(phone_number);
CREATE INDEX idx_drivers_status ON drivers(status);`;

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

export function DriverAdd() {
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<Gender>("MALE");
  const [dob, setDob] = useState("");
  const [prefix, setPrefix] = useState("Mr.");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<DriverStatus>("PENDING");
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

  // Close backend lang dropdown
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
    sessionStorage.setItem("innotaxi_active_item", "Drivers");
    navigate("/dashboard");
  };

  const handleSave = () => {
    setSubmitted(true);
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !dob || !password.trim()) return;
    if (!isAbove18(dob)) return;

    const newDriver: Driver = {
      id: Date.now(),
      fullName,
      gender,
      dob,
      prefix,
      phoneNumber,
      email,
      password: "********",
      status,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      deletedAt: null,
    };

    // Store in session for the list page to pick up
    const existing = sessionStorage.getItem("newDriver");
    const queue: Driver[] = existing ? JSON.parse(existing) : [];
    queue.push(newDriver);
    sessionStorage.setItem("newDriver", JSON.stringify(queue));

    setSavedLabel(newDriver.fullName);
    setShowCreateNotification(true);

    setTimeout(() => {
      sessionStorage.setItem("innotaxi_active_item", "Drivers");
      navigate("/dashboard");
    }, 600);
  };

  // Code preview helpers
  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: createReactCode, vue: createVueCode, angular: createAngularCode }[codeFramework];
    }
    if (codeCategory === "database") {
      return driverDatabaseSchema;
    }
    return driverCreateBackendCode[backendLang] || driverCreateBackendCode.nestjs;
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "DriverAdd.tsx", vue: "DriverAdd.vue", angular: "driver-add.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") {
      return "drivers.sql";
    }
    return driverCreateBackendFileConfig[backendLang] || driverCreateBackendFileConfig.nestjs;
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

  const resetCodePreview = () => {
    setCodePreviewOpen(false);
    setCodeCopied(false);
    setCodeCategory("frontend");
    setCodeFramework("react");
    setBackendLang("nestjs");
    setBackendLangOpen(false);
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
          Back to Drivers
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#e53935]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold">
              New Driver
            </h1>
            <p className="text-[12px] text-[#94a3b8]">
              Create a new driver record
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
              Driver Information
            </h2>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">Fill in the driver details below</p>
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
            {/* Prefix */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Prefix
              </label>
              <Dropdown
                value={prefix}
                options={prefixOptions}
                onChange={(e) => setPrefix(e.value)}
                className="!w-full !text-[13px] [&_.p-dropdown-label]:!py-2 [&_.p-dropdown-label]:!px-3 !rounded-[8px] !border-[#e2e8f0]"
              />
            </div>

            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Full Name *
              </label>
              <InputText
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`!w-full !text-[13px] !py-2 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !fullName.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="e.g. Aung Min Htut"
              />
              {submitted && !fullName.trim() && <small className="text-[11px] text-[#e53935] mt-1">Full name is required</small>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Gender *
              </label>
              <Dropdown
                value={gender}
                options={genderOptions}
                onChange={(e) => setGender(e.value)}
                className="!w-full !text-[13px] [&_.p-dropdown-label]:!py-2 [&_.p-dropdown-label]:!px-3 !rounded-[8px] !border-[#e2e8f0]"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Date of Birth *
              </label>
              <InputText
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`!w-full !text-[13px] !py-2 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && (!dob || !isAbove18(dob)) ? "!border-[#e53935]" : ""}`}
                max="2008-03-14"
              />
              {submitted && !dob && <small className="text-[11px] text-[#e53935] mt-1">Date of birth is required</small>}
              {submitted && dob && !isAbove18(dob) && <small className="text-[11px] text-[#e53935] mt-1">Must be at least 18 years old</small>}
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

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Phone Number *
              </label>
              <InputText
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`!w-full !text-[13px] !py-2 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !phoneNumber.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="+95 9 xxx xxx xxx"
              />
              {submitted && !phoneNumber.trim() && <small className="text-[11px] text-[#e53935] mt-1">Phone number is required</small>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Email *
              </label>
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`!w-full !text-[13px] !py-2 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !email.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="driver@innotaxi.com"
              />
              {submitted && !email.trim() && <small className="text-[11px] text-[#e53935] mt-1">Email is required</small>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Password *
              </label>
              <InputText
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`!w-full !text-[13px] !py-2 !px-3 !rounded-[8px] !border-[#e2e8f0] focus:!border-[#e53935] focus:!shadow-none ${submitted && !password.trim() ? "!border-[#e53935]" : ""}`}
                placeholder="Enter password"
              />
              {submitted && !password.trim() && <small className="text-[11px] text-[#e53935] mt-1">Password is required</small>}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-[#e2e8f0] text-[#475569] rounded-[8px] text-[13px] font-medium hover:bg-[#f8fafc] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Create Driver
          </button>
        </div>
      </div>

      {/* Code Preview Dialog */}
      <Dialog
        visible={codePreviewOpen}
        onHide={resetCodePreview}
        modal
        dismissableMask
        draggable={false}
        resizable={false}
        className="!border-none !shadow-none"
        contentClassName="!p-0 !bg-transparent"
        headerClassName="!hidden"
        maskClassName="!bg-black/50 !backdrop-blur-sm"
        style={{ width: "780px", maxWidth: "92vw" }}
        pt={{ root: { className: "!bg-transparent !border-none !shadow-none" } }}
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#e2e8f0]">
          {/* Dialog Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#e2e8f0]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-[#4f46e5]" />
              </div>
              <div>
                <h3 className="text-[13px] text-[#0f172a] font-semibold">Driver Create Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">POST /api/v1/drivers</p>
              </div>
            </div>
            <button
              onClick={resetCodePreview}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#fee2e2] hover:text-[#ef4444] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-0 px-5 pt-3 pb-0 bg-white border-b border-[#e2e8f0]">
            {([
              { key: "frontend" as const, label: "Frontend", icon: "\uD83D\uDDA5\uFE0F", color: "#6366f1" },
              { key: "backend" as const, label: "Backend", icon: "\u2699\uFE0F", color: "#f59e0b" },
              { key: "database" as const, label: "Database", icon: "\uD83D\uDDC4\uFE0F", color: "#22c55e" },
            ]).map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setCodeCategory(cat.key); setCodeCopied(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] transition-all cursor-pointer relative ${
                  codeCategory === cat.key
                    ? "text-[#0f172a] font-semibold"
                    : "text-[#94a3b8] hover:text-[#64748b]"
                }`}
              >
                <span className="text-[12px]">{cat.icon}</span>
                {cat.label}
                {codeCategory === cat.key && (
                  <div className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full" style={{ backgroundColor: cat.color }} />
                )}
              </button>
            ))}
          </div>

          {/* Sub-tabs & Copy */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
            <div className="flex items-center gap-1">
              {codeCategory === "frontend" ? (
                <div className="flex items-center gap-1 bg-[#f1f5f9] rounded-lg p-0.5">
                  {(["react", "vue", "angular"] as const).map((fw) => {
                    const fwConfig: Record<string, { label: string; icon: React.ReactNode }> = {
                      react: { label: "PrimeReact", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="3" fill="#61DAFB"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)"/></svg> },
                      vue: { label: "PrimeVue", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M2 4h5.6L16 18.4 24.4 4H30L16 28 2 4z" fill="#41B883"/><path d="M6.8 4H12l4 7.2L20 4h5.2L16 20 6.8 4z" fill="#34495E"/></svg> },
                      angular: { label: "PrimeAngular", icon: <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M16 2L3 7l2 18L16 30l11-5 2-18L16 2z" fill="#DD0031"/><path d="M16 2v28l11-5 2-18L16 2z" fill="#C3002F"/><path d="M16 5.7L8.8 22h2.7l1.4-3.6h6.2L20.5 22h2.7L16 5.7zm2.2 10.7h-4.4L16 11l2.2 5.4z" fill="#fff"/></svg> },
                    };
                    const cfg = fwConfig[fw];
                    return (
                      <button
                        key={fw}
                        onClick={() => { setCodeFramework(fw); setCodeCopied(false); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] transition-all cursor-pointer ${
                          codeFramework === fw
                            ? "bg-white text-[#0f172a] shadow-sm font-medium"
                            : "text-[#64748b] hover:text-[#334155]"
                        }`}
                      >
                        <span className="flex items-center">{cfg.icon}</span>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              ) : codeCategory === "backend" ? (
                <div className="flex items-center gap-2">
                  <div className="relative" ref={backendLangRef}>
                    <button
                      onClick={() => setBackendLangOpen(!backendLangOpen)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a] transition-colors cursor-pointer"
                    >
                      <span>{backendLangConfig[backendLang].icon}</span>
                      {backendLangConfig[backendLang].label}
                      <ChevronDown className={`w-3 h-3 transition-transform ${backendLangOpen ? "rotate-180" : ""}`} />
                    </button>
                    {backendLangOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50 min-w-[180px]">
                        {backendLangOptions.map((lang) => {
                          const cfg = backendLangConfig[lang];
                          return (
                            <button
                              key={lang}
                              onClick={() => { setBackendLang(lang); setBackendLangOpen(false); setCodeCopied(false); }}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors cursor-pointer ${
                                backendLang === lang
                                  ? "bg-[#fef3c7] text-[#92400e] font-medium"
                                  : "text-[#475569] hover:bg-[#f8fafc]"
                              }`}
                            >
                              <span className="text-[12px]">{cfg.icon}</span>
                              {cfg.label}
                              {backendLang === lang && <Check className="w-3 h-3 ml-auto text-[#92400e]" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#dcfce7] text-[#166534]">
                    <Database className="w-3 h-3" />
                    PostgreSQL Schema
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer border ${
                codeCopied
                  ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
                  : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] border-[#e2e8f0]"
              }`}
            >
              {codeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {codeCopied ? "Copied!" : "Copy Code"}
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
              <span className="text-[10px] text-[#64748b] ml-2">{getFilename()}</span>
            </div>
            <Highlight
              theme={codeCategory === "database" ? themes.vsDark : codeCategory === "frontend" ? themes.nightOwl : themes.vsDark}
              code={getCode()}
              language={getLanguage()}
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

      {/* Animated Success Toast */}
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
                <p className="text-[13px] text-[#0f172a] font-semibold">Driver Created</p>
                <p className="text-[11px] text-[#64748b] mt-0.5">{savedLabel} has been created successfully.</p>
              </div>
              <button
                onClick={() => setShowCreateNotification(false)}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
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
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Highlight, themes } from "prism-react-renderer";
import { ArrowLeft, Save, X, FileText, AlertCircle, ChevronDown, CheckCircle2, Code2, Copy, Check, Database } from "lucide-react";
import { motion } from "motion/react";
import { type LicenseType, mockData } from "./LicenseTypeList";
import { licensePolicyMockData } from "./LicensePolicyList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";

const categoryOptions = [
  { label: "\u101E\u1004\u103A\u101A\u102C\u1009\u103A", value: "\u101E\u1004\u103A\u101A\u102C\u1009\u103A" },
  { label: "\u1019\u1031\u102C\u103A\u1010\u1031\u102C\u103A\u1006\u102D\u102F\u1004\u103A\u1000\u101A\u103A", value: "\u1019\u1031\u102C\u103A\u1010\u1031\u102C\u103A\u1006\u102D\u102F\u1004\u103A\u1000\u101A\u103A" },
  { label: "\u1000\u102D\u102F\u101A\u103A\u1015\u102D\u102F\u1004\u103A\u101A\u102C\u1009\u103A", value: "\u1000\u102D\u102F\u101A\u103A\u1015\u102D\u102F\u1004\u103A\u101A\u102C\u1009\u103A" },
  { label: "\u1005\u1000\u103A\u101A\u1014\u103A\u1010\u101B\u102C\u1038", value: "\u1005\u1000\u103A\u101A\u1014\u103A\u1010\u101B\u102C\u1038" },
  { label: "\u1010\u1000\u103A\u1000\u1005\u102E/\u1005\u102E\u1038\u1015\u103D\u102C\u1038", value: "\u1010\u1000\u103A\u1000\u1005\u102E/\u1005\u102E\u1038\u1015\u103D\u102C\u1038" },
  { label: "\u101A\u102C\u1009\u103A\u1021\u102C\u1038\u101C\u102F\u1036\u1038", value: "\u101A\u102C\u1009\u103A\u1021\u102C\u1038\u101C\u102F\u1036\u1038" },
  { label: "\u1011\u101B\u1031\u1037\u101C\u102C", value: "\u1011\u101B\u1031\u1037\u101C\u102C" },
  { label: "\u1019\u1031\u102C\u103A\u1010\u1031\u102C\u103A\u1006\u102D\u102F\u1004\u103A\u1000\u101A\u103A/\u101E\u102F\u1036\u1038\u1018\u102E\u1038", value: "\u1019\u1031\u102C\u103A\u1010\u1031\u102C\u103A\u1006\u102D\u102F\u1004\u103A\u1000\u101A\u103A/\u101E\u102F\u1036\u1038\u1018\u102E\u1038" },
  { label: "\u101A\u102C\u1009\u103A\u1021\u1000\u1030", value: "\u101A\u102C\u1009\u103A\u1021\u1000\u1030" },
  { label: "\u1021\u1015\u103C\u100A\u103A\u1015\u103C\u100A\u103A\u1006\u102D\u102F\u1004\u103A\u101B\u102C", value: "\u1021\u1015\u103C\u100A\u103A\u1015\u103C\u100A\u103A\u1006\u102D\u102F\u1004\u103A\u101B\u102C" },
  { label: "\u101A\u102C\u101A\u102E", value: "\u101A\u102C\u101A\u102E" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

// ── Inline code samples for create ──
const createReactCode = `// LicenseTypeAdd.tsx — PrimeReact + React Router
import { useState } from "react";
import { useNavigate } from "react-router";
import { Editor } from "primereact/editor";

interface LicenseType {
  id: number;
  code: string;
  name: string;
  category: string;
  vehicleClass: string;
  validityYears: number;
  status: "ACTIVE" | "INACTIVE";
  policyType: string;
  description: string;
}

export function LicenseTypeAdd() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");
  const [validityYears, setValidityYears] = useState(1);
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [policyType, setPolicyType] = useState("DRIVER_LICENSE");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSave = async () => {
    setSubmitted(true);
    if (!code.trim() || !name.trim() || !category) return;

    const res = await fetch("/api/v1/license-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code, name, category, vehicleClass,
        validityYears, status, policyType, description,
      }),
    });

    if (res.ok) {
      navigate("/dashboard", { state: { activeItem: "Driver License Type" } });
    }
  };

  return (
    <div>
      <h1>Create New License Type</h1>
      {/* Form fields... */}
      <button onClick={handleSave}>Create</button>
    </div>
  );
}`;

const createVueCode = `<!-- LicenseTypeAdd.vue — PrimeVue + Vue Router -->
<template>
  <div class="min-h-full">
    <h1>Create New License Type</h1>
    <form @submit.prevent="handleSave">
      <InputText v-model="code" placeholder="Code" />
      <InputText v-model="name" placeholder="Name" />
      <Dropdown v-model="category" :options="categoryOptions" />
      <InputText v-model="vehicleClass" placeholder="Vehicle Class" />
      <InputNumber v-model="validityYears" :min="1" :max="10" />
      <Dropdown v-model="status" :options="statusOptions" />
      <Editor v-model="description" />
      <Button label="Create" @click="handleSave" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const code = ref("");
const name = ref("");
const category = ref("");
const vehicleClass = ref("");
const validityYears = ref(1);
const status = ref("ACTIVE");
const description = ref("");

const handleSave = async () => {
  const res = await fetch("/api/v1/license-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: code.value, name: name.value,
      category: category.value, vehicleClass: vehicleClass.value,
      validityYears: validityYears.value, status: status.value,
      description: description.value,
    }),
  });
  if (res.ok) router.push({ name: "LicenseTypes" });
};
</script>`;

const createAngularCode = `// license-type-add.component.ts — PrimeNG + Angular
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-license-type-add",
  template: \`
    <div class="min-h-full">
      <h1>Create New License Type</h1>
      <input [(ngModel)]="code" placeholder="Code" />
      <input [(ngModel)]="name" placeholder="Name" />
      <p-dropdown [(ngModel)]="category" [options]="categoryOptions"></p-dropdown>
      <input [(ngModel)]="vehicleClass" placeholder="Vehicle Class" />
      <p-inputNumber [(ngModel)]="validityYears" [min]="1" [max]="10"></p-inputNumber>
      <p-dropdown [(ngModel)]="status" [options]="statusOptions"></p-dropdown>
      <p-editor [(ngModel)]="description"></p-editor>
      <button (click)="handleSave()">Create</button>
    </div>
  \`,
})
export class LicenseTypeAddComponent {
  code = "";
  name = "";
  category = "";
  vehicleClass = "";
  validityYears = 1;
  status = "ACTIVE";
  description = "";
  submitted = false;

  categoryOptions = [
    { label: "Learner", value: "learner" },
    { label: "Motorcycle", value: "motorcycle" },
    { label: "Private", value: "private" },
  ];

  statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  constructor(private http: HttpClient, private router: Router) {}

  handleSave() {
    this.submitted = true;
    if (!this.code || !this.name || !this.category) return;

    this.http.post("/api/v1/license-types", {
      code: this.code, name: this.name,
      category: this.category, vehicleClass: this.vehicleClass,
      validityYears: this.validityYears, status: this.status,
      description: this.description,
    }).subscribe(() => {
      this.router.navigate(["/license-types"]);
    });
  }
}`;

const databaseSchema = `-- ══════════════════════════════════════════════
-- license_types table  —  PostgreSQL 15+
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS license_types (
  id            BIGSERIAL     PRIMARY KEY,
  code          VARCHAR(10)   NOT NULL UNIQUE,
  name          VARCHAR(255)  NOT NULL,
  category      VARCHAR(100)  NOT NULL,
  vehicle_class VARCHAR(255),
  validity_years INTEGER      NOT NULL DEFAULT 1
                              CHECK (validity_years BETWEEN 1 AND 10),
  status        VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE'
                              CHECK (status IN ('ACTIVE','INACTIVE')),
  policy_type   VARCHAR(50)   NOT NULL DEFAULT 'DRIVER_LICENSE',
  description   TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_license_types_code
  ON license_types (code)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_license_types_status
  ON license_types (status)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_license_types_category
  ON license_types (category)
  WHERE deleted_at IS NULL;

-- Insert trigger for updated_at
CREATE OR REPLACE FUNCTION update_license_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_license_types_updated_at
  BEFORE UPDATE ON license_types
  FOR EACH ROW
  EXECUTE FUNCTION update_license_types_updated_at();`;

function getCreateBackendCode(lang: BackendLang): string {
  const BT = String.fromCharCode(96);
  const codes: Record<BackendLang, string> = {
    nestjs: `// license-type.controller.ts — NestJS + TypeORM (Create)
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicenseType } from './entities/license-type.entity';
import { CreateLicenseTypeDto } from './dto/create-license-type.dto';

@Controller('api/v1/license-types')
export class LicenseTypeController {
  constructor(
    @InjectRepository(LicenseType)
    private readonly repo: Repository<LicenseType>,
  ) {}

  @Post()
  async create(@Body() dto: CreateLicenseTypeDto) {
    const exists = await this.repo.findOne({ where: { code: dto.code } });
    if (exists) throw new BadRequestException('Code already exists');

    const item = this.repo.create(dto);
    const saved = await this.repo.save(item);
    return { success: true, data: saved };
  }
}`,
    nodejs: `// licenseType.js — Express.js (Create)
const express = require('express');
const router = express.Router();
const { LicenseType } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { code, name, category, vehicleClass, validityYears, status, policyType, description } = req.body;
    if (!code || !name || !category) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const item = await LicenseType.create({
      code, name, category, vehicleClass,
      validityYears, status, policyType, description,
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;`,
    java: `// LicenseTypeController.java — Spring Boot (Create)
@RestController
@RequestMapping("/api/v1/license-types")
public class LicenseTypeController {

    @Autowired
    private LicenseTypeRepository repo;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateLicenseTypeDto dto) {
        if (repo.existsByCode(dto.getCode())) {
            throw new BadRequestException("Code already exists");
        }
        LicenseType entity = new LicenseType();
        entity.setCode(dto.getCode());
        entity.setName(dto.getName());
        entity.setCategory(dto.getCategory());
        entity.setVehicleClass(dto.getVehicleClass());
        entity.setValidityYears(dto.getValidityYears());
        entity.setStatus(dto.getStatus());
        entity.setPolicyType(dto.getPolicyType());
        entity.setDescription(dto.getDescription());
        LicenseType saved = repo.save(entity);
        return ResponseEntity.status(201).body(Map.of("success", true, "data", saved));
    }
}`,
    laravel: `<?php
// LicenseTypeController.php — Laravel (Create)
namespace App\\Http\\Controllers;

use App\\Models\\LicenseType;
use Illuminate\\Http\\Request;

class LicenseTypeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'           => 'required|string|max:10|unique:license_types',
            'name'           => 'required|string|max:255',
            'category'       => 'required|string|max:100',
            'vehicle_class'  => 'nullable|string|max:255',
            'validity_years' => 'integer|min:1|max:10',
            'status'         => 'in:ACTIVE,INACTIVE',
            'policy_type'    => 'string|max:50',
            'description'    => 'nullable|string',
        ]);

        $item = LicenseType::create($validated);
        return response()->json(['success' => true, 'data' => $item], 201);
    }
}`,
    csharp: `// LicenseTypeController.cs — ASP.NET Core (Create)
[ApiController]
[Route("api/v1/license-types")]
public class LicenseTypeController : ControllerBase
{
    private readonly AppDbContext _ctx;
    public LicenseTypeController(AppDbContext ctx) => _ctx = ctx;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLicenseTypeDto dto)
    {
        if (await _ctx.LicenseTypes.AnyAsync(x => x.Code == dto.Code))
            return BadRequest(new { success = false, message = "Code exists" });

        var entity = new LicenseType
        {
            Code = dto.Code, Name = dto.Name,
            Category = dto.Category, VehicleClass = dto.VehicleClass,
            ValidityYears = dto.ValidityYears, Status = dto.Status,
            PolicyType = dto.PolicyType, Description = dto.Description,
        };
        _ctx.LicenseTypes.Add(entity);
        await _ctx.SaveChangesAsync();
        return Created("", new { success = true, data = entity });
    }
}`,
    python: `# license_type.py — FastAPI (Create)
from fastapi import APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import LicenseType
from app.schemas import CreateLicenseTypeSchema

router = APIRouter(prefix="/api/v1/license-types", tags=["License Types"])

@router.post("", status_code=201)
async def create(dto: CreateLicenseTypeSchema, db: AsyncSession = Depends(get_db)):
    exists = await db.execute(
        select(LicenseType).where(LicenseType.code == dto.code)
    )
    if exists.scalar():
        raise HTTPException(400, "Code already exists")

    item = LicenseType(**dto.dict())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return {"success": True, "data": item}`,
    golang: `// license_type_handler.go — Gin (Create)
package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func CreateLicenseType(c *gin.Context) {
    var dto CreateLicenseTypeDTO
    if err := c.ShouldBindJSON(&dto); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
        return
    }

    var exists LicenseType
    if err := db.Where("code = ?", dto.Code).First(&exists).Error; err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Code exists"})
        return
    }

    item := LicenseType{
        Code: dto.Code, Name: dto.Name,
        Category: dto.Category, VehicleClass: dto.VehicleClass,
        ValidityYears: dto.ValidityYears, Status: dto.Status,
        PolicyType: dto.PolicyType, Description: dto.Description,
    }
    db.Create(&item)
    c.JSON(http.StatusCreated, gin.H{"success": true, "data": item})
}`,
    ruby: `# license_types_controller.rb — Rails (Create)
class Api::V1::LicenseTypesController < ApplicationController
  def create
    if LicenseType.exists?(code: params[:code])
      return render json: { success: false, message: "Code exists" }, status: :bad_request
    end

    item = LicenseType.new(license_type_params)
    if item.save
      render json: { success: true, data: item }, status: :created
    else
      render json: { success: false, errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def license_type_params
    params.require(:license_type).permit(
      :code, :name, :category, :vehicle_class,
      :validity_years, :status, :policy_type, :description
    )
  end
end`,
  };
  return codes[lang];
}

const createBackendFileConfig: Record<BackendLang, { file: string; language: string }> = {
  nestjs: { file: "license-type.controller.ts", language: "typescript" },
  nodejs: { file: "licenseType.js", language: "javascript" },
  java: { file: "LicenseTypeController.java", language: "java" },
  laravel: { file: "LicenseTypeController.php", language: "php" },
  csharp: { file: "LicenseTypeController.cs", language: "csharp" },
  python: { file: "license_type.py", language: "python" },
  golang: { file: "license_type_handler.go", language: "go" },
  ruby: { file: "license_types_controller.rb", language: "ruby" },
};

export function LicenseTypeAdd() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [savedLabel, setSavedLabel] = useState("");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");
  const [validityYears, setValidityYears] = useState(1);
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [policyType, setPolicyType] = useState("DRIVER_LICENSE");
  const [description, setDescription] = useState("");

  // Code preview state
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);
  const [codeCategory, setCodeCategory] = useState<"frontend" | "backend" | "database">("frontend");
  const [codeFramework, setCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [backendLang, setBackendLang] = useState<BackendLang>("nestjs");
  const [backendLangOpen, setBackendLangOpen] = useState(false);
  const backendLangRef = useRef<HTMLDivElement>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Policy type options from licensePolicyMockData
  const policyTypeOptions = [...new Map(licensePolicyMockData.map(p => [p.policyType, p])).values()].map((policy) => ({
    label: policy.label,
    value: policy.policyType,
  }));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backendLangRef.current && !backendLangRef.current.contains(e.target as Node)) {
        setBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: createReactCode, vue: createVueCode, angular: createAngularCode }[codeFramework];
    }
    if (codeCategory === "database") {
      return databaseSchema;
    }
    return getCreateBackendCode(backendLang);
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "LicenseTypeAdd.tsx", vue: "LicenseTypeAdd.vue", angular: "license-type-add.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") {
      return "license_types.sql";
    }
    return createBackendFileConfig[backendLang].file;
  };

  const getLanguage = (): string => {
    if (codeCategory === "frontend") {
      return codeFramework === "angular" ? "typescript" : codeFramework === "vue" ? "markup" : "tsx";
    }
    if (codeCategory === "database") {
      return "sql";
    }
    return "typescript";
  };

  const handleCopy = () => {
    const text = getCode();
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

  const handleSave = () => {
    setSubmitted(true);
    if (!code.trim() || !name.trim() || !category) return;

    const now = new Date().toISOString().split("T")[0];
    const newItem: LicenseType = {
      id: Date.now(),
      code: code.trim(),
      name: name.trim(),
      category,
      vehicleClass: vehicleClass.trim(),
      validityYears,
      status,
      policyType: "DRIVER_LICENSE",
      description: description.replace(/<[^>]*>/g, "").trim(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    // Store in sessionStorage so the list page picks it up
    const existing = sessionStorage.getItem("newLicenseType");
    const queue: LicenseType[] = existing ? JSON.parse(existing) : [];
    queue.push(newItem);
    sessionStorage.setItem("newLicenseType", JSON.stringify(queue));

    setSavedLabel(newItem.name);
    setShowCreateNotification(true);

    setTimeout(() => {
      navigate("/dashboard", { state: { activeItem: "Driver License Type" } });
    }, 600);
  };

  const handleCancel = () => {
    navigate("/dashboard", { state: { activeItem: "Driver License Type" } });
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
          Back to License Types
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#e53935]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold">
              New License Type
            </h1>
            <p className="text-[12px] text-[#94a3b8]">
              Create a new license type record
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
              License Type Information
            </h2>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              Fill in the details below to create a new driver license type
            </p>
          </div>
          <button
            onClick={() => setCodePreviewOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#c7d2fe]"
            title="View Create Code"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>View Code</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-x-6 gap-y-4">
            {/* Code */}
            <div className="col-span-12 md:col-span-4">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Code <span className="text-[#e53935]">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all ${
                  submitted && !code.trim()
                    ? "border-[#e53935] focus:border-[#e53935] focus:ring-[#e53935]/20"
                    : "border-[#e2e8f0]"
                }`}
                placeholder="e.g. THA, KA, KHA"
              />
              {submitted && !code.trim() && (
                <small className="flex items-center gap-1 text-[#e53935] text-[11px] mt-1">
                  <AlertCircle className="w-3 h-3" />
                  Code is required
                </small>
              )}
            </div>

            {/* Name */}
            <div className="col-span-12 md:col-span-4">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                License Name <span className="text-[#e53935]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all ${
                  submitted && !name.trim()
                    ? "border-[#e53935] focus:border-[#e53935] focus:ring-[#e53935]/20"
                    : "border-[#e2e8f0]"
                }`}
                placeholder='e.g. "သ" ယာဉ်မောင်းလိုင်စင်'
              />
              {submitted && !name.trim() && (
                <small className="flex items-center gap-1 text-[#e53935] text-[11px] mt-1">
                  <AlertCircle className="w-3 h-3" />
                  Name is required
                </small>
              )}
            </div>

            {/* Status */}
            

            {/* Category */}
            <div className="col-span-12 md:col-span-4">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Category <span className="text-[#e53935]">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all appearance-none cursor-pointer pr-8 ${
                    submitted && !category
                      ? "border-[#e53935] focus:border-[#e53935] focus:ring-[#e53935]/20"
                      : "border-[#e2e8f0]"
                  }`}
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {submitted && !category && (
                <small className="flex items-center gap-1 text-[#e53935] text-[11px] mt-1">
                  <AlertCircle className="w-3 h-3" />
                  Category is required
                </small>
              )}
            </div>

            {/* Vehicle Class */}
            <div className="col-span-12 md:col-span-4">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Vehicle Class
              </label>
              <input
                type="text"
                value={vehicleClass}
                onChange={(e) => setVehicleClass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
                placeholder="e.g. Sedan / Hatchback"
              />
            </div>

            {/* Validity Years */}
            <div className="col-span-12 md:col-span-4">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Validity (Years)
              </label>
              <input
                type="number"
                value={validityYears}
                onChange={(e) => setValidityYears(parseInt(e.target.value) || 1)}
                min={1}
                max={10}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
              />
            </div>

            {/* Policy Type */}
            <div className="col-span-12 md:col-span-4">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Policy Type
              </label>
              <div className="relative">
                <select
                  value={policyType}
                  onChange={(e) => setPolicyType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all appearance-none cursor-pointer pr-8"
                >
                  {policyTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div className="col-span-12">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">
                  Description
                </label>
                <span className="text-[11px] text-[#94a3b8] tabular-nums">
                  {description.replace(/<[^>]*>/g, "").length} / 500
                </span>
              </div>
              <Editor
                value={description}
                onTextChange={(e) => {
                  const plainText = e.textValue || "";
                  if (plainText.length <= 500) {
                    setDescription(e.htmlValue || "");
                  }
                }}
                style={{ height: "140px" }}
                className="[&_.ql-editor]:text-[13px]"
                placeholder="Describe this license type — purpose, scope, or special conditions..."
              />
              {description.replace(/<[^>]*>/g, "").length >= 450 && (
                <span className={`text-[11px] font-medium mt-1 block text-right ${description.replace(/<[^>]*>/g, "").length >= 500 ? "text-[#e53935]" : "text-[#f59e0b]"}`}>
                  {500 - description.replace(/<[^>]*>/g, "").length} characters remaining
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-end gap-2">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#e2e8f0] text-[#475569] rounded-[8px] text-[13px] font-medium hover:bg-white hover:text-[#0f172a] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Create License Type
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
                <h3 className="text-[13px] text-[#0f172a] font-semibold">Create License Type Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">POST /api/v1/license-types</p>
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

      {/* Create Notification */}
      {showCreateNotification && (
        <motion.div
          initial={{ opacity: 0, x: 60, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed top-5 right-5 z-[9999] w-[340px]"
        >
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#dcfce7] overflow-hidden">
            {/* Green progress bar */}
            <div className="h-[3px] bg-[#e2e8f0] w-full">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#0f172a] font-semibold tracking-[-0.1px]">Created Successfully</p>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">License type <span className="text-[#64748b] font-medium">{savedLabel}</span> has been created.</p>
              </div>
              <button
                onClick={() => setShowCreateNotification(false)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[#cbd5e1] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
// Backend & frontend code samples for Create License Policy code preview
import type { BackendLang } from "./chartBackendCodes";

// ── Exports consumed by BackendDev.tsx & LicensePolicyList.tsx ──
export const licensePolicyBackendFileConfig: Record<BackendLang, string> = {
  nestjs: "license-policy.controller.ts",
  nodejs: "licensePolicy.js",
  java: "LicensePolicyController.java",
  laravel: "LicensePolicyController.php",
  csharp: "LicensePolicyController.cs",
  python: "license_policy.py",
  golang: "license_policy_handler.go",
  ruby: "policies_controller.rb",
};

export const licensePolicyBackendCode = `// license-policy.controller.ts — NestJS + TypeORM
import { Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { LicensePolicy } from './entities/license-policy.entity';
import { CreateLicensePolicyDto } from './dto/create-license-policy.dto';
import { UpdateLicensePolicyDto } from './dto/update-license-policy.dto';

@Controller('api/v1/license-policies')
export class LicensePolicyController {
  constructor(
    @InjectRepository(LicensePolicy)
    private readonly repo: Repository<LicensePolicy>,
  ) {}

  // GET /api/v1/license-policies?page=1&limit=10&search=
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const where: any = { deleted_at: IsNull() };
    if (search) {
      where.label = Like(\`%\${search}%\`);
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { success: true, data, meta: { total, page, limit } };
  }

  // GET /api/v1/license-policies/:id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const item = await this.repo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!item) throw new NotFoundException('License policy not found');
    return { success: true, data: item };
  }

  // POST /api/v1/license-policies
  @Post()
  async create(@Body() dto: CreateLicensePolicyDto) {
    if (!dto.label?.trim()) {
      throw new BadRequestException('Label is required');
    }
    const policy = this.repo.create({
      label: dto.label.trim(),
      description: dto.description?.trim() ?? null,
      policy_type: dto.policy_type,
      status: dto.status ?? 'ACTIVE',
    });
    const saved = await this.repo.save(policy);
    return { success: true, message: 'Created successfully', data: saved };
  }

  // PUT /api/v1/license-policies/:id
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateLicensePolicyDto) {
    const item = await this.repo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!item) throw new NotFoundException('License policy not found');

    item.label = dto.label ?? item.label;
    item.description = dto.description ?? item.description;
    item.policy_type = dto.policy_type ?? item.policy_type;
    item.status = dto.status ?? item.status;

    const updated = await this.repo.save(item);
    return { success: true, message: 'Updated successfully', data: updated };
  }

  // DELETE /api/v1/license-policies/:id  (soft delete)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const item = await this.repo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!item) throw new NotFoundException('License policy not found');

    item.deleted_at = new Date();
    await this.repo.save(item);
    return { success: true, message: 'Deleted successfully' };
  }
}`;

export const createPolicyBackendFileConfig: Record<BackendLang, { file: string; language: string }> = {
  nestjs: { file: "license-policy.controller.ts", language: "typescript" },
  nodejs: { file: "licensePolicy.js", language: "javascript" },
  java: { file: "LicensePolicyController.java", language: "java" },
  laravel: { file: "LicensePolicyController.php", language: "php" },
  csharp: { file: "LicensePolicyController.cs", language: "csharp" },
  python: { file: "license_policy.py", language: "python" },
  golang: { file: "license_policy_handler.go", language: "go" },
  ruby: { file: "policies_controller.rb", language: "ruby" },
};

export function getCreatePolicyBackendCode(lang: BackendLang): string {
  const BT = String.fromCharCode(96);
  const codes: Record<BackendLang, string> = {
    nestjs: `// license-policy.controller.ts — NestJS + TypeORM
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicensePolicy } from './entities/license-policy.entity';
import { CreateLicensePolicyDto } from './dto/create-license-policy.dto';

@Controller('api/v1/license-policies')
export class LicensePolicyController {
  constructor(
    @InjectRepository(LicensePolicy)
    private readonly repo: Repository<LicensePolicy>,
  ) {}

  // POST /api/v1/license-policies
  @Post()
  async create(@Body() dto: CreateLicensePolicyDto) {
    if (!dto.label?.trim()) {
      throw new BadRequestException('Label is required');
    }

    const policy = this.repo.create({
      label: dto.label.trim(),
      description: dto.description?.trim() ?? null,
      policy_type: dto.policy_type,
      status: dto.status ?? 'ACTIVE',
    });

    const saved = await this.repo.save(policy);

    return {
      success: true,
      message: 'License policy created successfully',
      data: {
        id: saved.id,
        label: saved.label,
        description: saved.description,
        policy_type: saved.policy_type,
        status: saved.status,
        created_at: saved.created_at,
        updated_at: saved.updated_at,
        deleted_at: null,
      },
    };
  }
}`,

    nodejs: `// licensePolicy.js — Node.js + Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/v1/license-policies
async function createLicensePolicy(req, res) {
  const { label, description, policy_type, status } = req.body;

  if (!label?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Label is required',
    });
  }

  const policy = await prisma.licensePolicy.create({
    data: {
      label: label.trim(),
      description: description?.trim() ?? null,
      policy_type: policy_type || 'DRIVER_LICENSE',
      status: status || 'ACTIVE',
    },
  });

  res.status(201).json({
    success: true,
    message: 'License policy created successfully',
    data: policy,
  });
}

module.exports = { createLicensePolicy };`,

    java: `// LicensePolicyController.java — Spring Boot + JPA
@RestController
@RequestMapping("/api/v1/license-policies")
public class LicensePolicyController {

    @Autowired
    private LicensePolicyRepository repository;

    // POST /api/v1/license-policies
    @PostMapping
    public ResponseEntity<?> create(
        @Valid @RequestBody CreateLicensePolicyDto dto
    ) {
        LicensePolicy policy = new LicensePolicy();
        policy.setLabel(dto.getLabel().trim());
        policy.setDescription(
            dto.getDescription() != null
                ? dto.getDescription().trim() : null
        );
        policy.setPolicyType(dto.getPolicyType());
        policy.setStatus(
            dto.getStatus() != null ? dto.getStatus() : "ACTIVE"
        );

        LicensePolicy saved = repository.save(policy);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(Map.of(
                "success", true,
                "message", "License policy created successfully",
                "data", saved
            ));
    }
}`,

    laravel: `<?php
// LicensePolicyController.php — Laravel + Eloquent

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Models\\LicensePolicy;
use Illuminate\\Http\\Request;

class LicensePolicyController extends Controller
{
    // POST /api/v1/license-policies
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label'       => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'policy_type' => 'required|in:DRIVER_LICENSE,VEHICEL_LICENSE',
            'status'      => 'nullable|in:ACTIVE,INACTIVE',
        ]);

        $policy = LicensePolicy::create([
            'label'       => trim($validated['label']),
            'description' => isset($validated['description'])
                ? trim($validated['description']) : null,
            'policy_type' => $validated['policy_type'],
            'status'      => $validated['status'] ?? 'ACTIVE',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'License policy created successfully',
            'data'    => $policy,
        ], 201);
    }
}`,

    csharp: `// LicensePolicyController.cs — ASP.NET Core + EF Core
[ApiController]
[Route("api/v1/license-policies")]
public class LicensePolicyController : ControllerBase
{
    private readonly AppDbContext _db;

    public LicensePolicyController(AppDbContext db) => _db = db;

    // POST /api/v1/license-policies
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateLicensePolicyDto dto
    )
    {
        if (string.IsNullOrWhiteSpace(dto.Label))
            return BadRequest(new { success = false,
                message = "Label is required" });

        var policy = new LicensePolicy
        {
            Label = dto.Label.Trim(),
            Description = dto.Description?.Trim(),
            PolicyType = dto.PolicyType,
            Status = dto.Status ?? "ACTIVE",
        };

        _db.LicensePolicies.Add(policy);
        await _db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = policy.Id },
            new { success = true,
                message = "License policy created successfully",
                data = policy }
        );
    }
}`,

    python: `# license_policy.py — FastAPI + SQLAlchemy
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from models import LicensePolicy
from schemas import CreateLicensePolicyDto

router = APIRouter(prefix="/api/v1/license-policies")

# POST /api/v1/license-policies
@router.post("/", status_code=201)
async def create_license_policy(
    dto: CreateLicensePolicyDto,
    db: Session = Depends(get_db),
):
    if not dto.label or not dto.label.strip():
        raise HTTPException(
            status_code=400,
            detail="Label is required",
        )

    policy = LicensePolicy(
        label=dto.label.strip(),
        description=(
            dto.description.strip()
            if dto.description else None
        ),
        policy_type=dto.policy_type,
        status=dto.status or "ACTIVE",
    )

    db.add(policy)
    db.commit()
    db.refresh(policy)

    return {
        "success": True,
        "message": "License policy created successfully",
        "data": {
            "id": policy.id,
            "label": policy.label,
            "description": policy.description,
            "policy_type": policy.policy_type,
            "status": policy.status,
            "created_at": str(policy.created_at),
            "updated_at": str(policy.updated_at),
            "deleted_at": None,
        },
    }`,

    golang: `// license_policy_handler.go — Go + GORM
package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type LicensePolicyHandler struct {
	DB *gorm.DB
}

type CreatePolicyRequest struct {
	Label       string ${BT}json:"label" binding:"required"${BT}
	Description string ${BT}json:"description"${BT}
	PolicyType  string ${BT}json:"policy_type" binding:"required"${BT}
	Status      string ${BT}json:"status"${BT}
}

// POST /api/v1/license-policies
func (h *LicensePolicyHandler) Create(c *gin.Context) {
	var req CreatePolicyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Label is required",
		})
		return
	}

	status := req.Status
	if status == "" {
		status = "ACTIVE"
	}

	policy := LicensePolicy{
		Label:       strings.TrimSpace(req.Label),
		Description: strings.TrimSpace(req.Description),
		PolicyType:  req.PolicyType,
		Status:      status,
	}

	if err := h.DB.Create(&policy).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create policy",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "License policy created successfully",
		"data":    policy,
	})
}`,

    ruby: `# policies_controller.rb — Ruby on Rails
class Api::V1::LicensePoliciesController < ApplicationController
  # POST /api/v1/license-policies
  def create
    policy = LicensePolicy.new(policy_params)
    policy.status ||= 'ACTIVE'

    if policy.label.blank?
      render json: {
        success: false,
        message: 'Label is required'
      }, status: :bad_request
      return
    end

    policy.label = policy.label.strip
    policy.description = policy.description&.strip

    if policy.save
      render json: {
        success: true,
        message: 'License policy created successfully',
        data: policy.as_json(
          only: %i[id label description policy_type
                   status created_at updated_at deleted_at]
        )
      }, status: :created
    else
      render json: {
        success: false,
        message: 'Validation failed',
        errors: policy.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def policy_params
    params.require(:license_policy).permit(
      :label, :description, :policy_type, :status
    )
  end
end`,
  };
  return codes[lang];
}

// ── Frontend code samples ──

export const createPolicyReactCode = `// LicensePolicyAdd.tsx — PrimeReact + React Router
import { useState } from "react";
import { useNavigate } from "react-router";
import { Editor } from "primereact/editor";
import { ScrollText, Save, X, AlertCircle, ChevronDown } from "lucide-react";

const policyTypeOptions = [
  { label: "Driver License", value: "DRIVER_LICENSE" },
  { label: "Vehicle License", value: "VEHICEL_LICENSE" },
];

export function LicensePolicyAdd() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [policyType, setPolicyType] = useState("DRIVER_LICENSE");
  const [status, setStatus] = useState("ACTIVE");

  const handleSave = async () => {
    setSubmitted(true);
    if (!label.trim()) return;

    const res = await fetch("/api/v1/license-policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: label.trim(),
        description: description.trim(),
        policy_type: policyType,
        status,
      }),
    });

    if (res.ok) {
      navigate("/dashboard", { state: { activeItem: "License Policy" } });
    }
  };

  return (
    <div className="min-h-full">
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6">
              <label>Label *</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Driver License Policy"
              />
              {submitted && !label.trim() && (
                <small className="text-red-500">Label is required</small>
              )}
            </div>
            <div className="col-span-6">
              <label>Policy Type *</label>
              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value)}
              >
                {policyTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12">
              <label>Description</label>
              <Editor
                value={description}
                onTextChange={(e) => setDescription(e.htmlValue || "")}
                style={{ height: "140px" }}
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button onClick={() => navigate(-1)}>Cancel</button>
          <button onClick={handleSave}>Create Policy</button>
        </div>
      </div>
    </div>
  );
}`;

export const createPolicyVueCode = `<!-- LicensePolicyAdd.vue — PrimeVue + Vue Router -->
<template>
  <div class="min-h-full">
    <div class="bg-white rounded-xl border border-slate-200">
      <div class="p-6">
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-6">
            <label>Label *</label>
            <InputText v-model="label" placeholder="e.g. Driver License Policy" />
            <small v-if="submitted && !label.trim()" class="text-red-500">
              Label is required
            </small>
          </div>
          <div class="col-span-6">
            <label>Policy Type *</label>
            <Dropdown
              v-model="policyType"
              :options="policyTypeOptions"
              optionLabel="label"
              optionValue="value"
            />
          </div>
          <div class="col-span-12">
            <label>Description</label>
            <Editor
              v-model="description"
              editorStyle="height: 140px"
            />
          </div>
        </div>
      </div>
      <div class="px-6 py-4 border-t flex justify-end gap-2">
        <Button label="Cancel" severity="secondary" @click="router.back()" />
        <Button label="Create Policy" severity="danger" @click="handleSave" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Editor from "primevue/editor";
import Button from "primevue/button";

const router = useRouter();
const submitted = ref(false);
const label = ref("");
const description = ref("");
const policyType = ref("DRIVER_LICENSE");

const policyTypeOptions = [
  { label: "Driver License", value: "DRIVER_LICENSE" },
  { label: "Vehicle License", value: "VEHICEL_LICENSE" },
];

async function handleSave() {
  submitted.value = true;
  if (!label.value.trim()) return;

  const res = await fetch("/api/v1/license-policies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      label: label.value.trim(),
      description: description.value.trim(),
      policy_type: policyType.value,
      status: "ACTIVE",
    }),
  });

  if (res.ok) {
    router.push({ name: "LicensePolicy" });
  }
}
</script>`;

export const createPolicyAngularCode = `// license-policy-add.component.ts — PrimeNG + Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface PolicyTypeOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-license-policy-add',
  template: \`
    <div class="min-h-full">
      <div class="bg-white rounded-xl border border-slate-200">
        <div class="p-6">
          <div class="grid grid-cols-12 gap-6">
            <div class="col-span-6">
              <label>Label *</label>
              <input
                pInputText
                [(ngModel)]="label"
                placeholder="e.g. Driver License Policy"
              />
              <small *ngIf="submitted && !label.trim()" class="text-red-500">
                Label is required
              </small>
            </div>
            <div class="col-span-6">
              <label>Policy Type *</label>
              <p-dropdown
                [(ngModel)]="policyType"
                [options]="policyTypeOptions"
                optionLabel="label"
                optionValue="value"
              ></p-dropdown>
            </div>
            <div class="col-span-12">
              <label>Description</label>
              <p-editor
                [(ngModel)]="description"
                [style]="{ height: '140px' }"
              ></p-editor>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-2">
          <button pButton label="Cancel" (click)="cancel()"></button>
          <button pButton label="Create Policy" (click)="handleSave()"></button>
        </div>
      </div>
    </div>
  \`,
})
export class LicensePolicyAddComponent {
  submitted = false;
  label = '';
  description = '';
  policyType = 'DRIVER_LICENSE';

  policyTypeOptions: PolicyTypeOption[] = [
    { label: 'Driver License', value: 'DRIVER_LICENSE' },
    { label: 'Vehicle License', value: 'VEHICEL_LICENSE' },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  handleSave(): void {
    this.submitted = true;
    if (!this.label.trim()) return;

    this.http
      .post('/api/v1/license-policies', {
        label: this.label.trim(),
        description: this.description.trim(),
        policy_type: this.policyType,
        status: 'ACTIVE',
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard'], {
            state: { activeItem: 'License Policy' },
          });
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}`;

// ── Database Schema ──

export const policyDatabaseSchema = `-- ═══════════════════════════════════════════════════════════
-- policies — Database Schema (PostgreSQL)
-- ═══════════════════════════════════════════════════════════

-- Enum types
CREATE TYPE policy_type_enum AS ENUM (
  'DRIVER_LICENSE',
  'VEHICEL_LICENSE'
);

CREATE TYPE policy_status_enum AS ENUM (
  'ACTIVE',
  'INACTIVE'
);

-- Main table
CREATE TABLE policies (
  id            SERIAL          PRIMARY KEY,
  label         VARCHAR(255)    NOT NULL,
  description   TEXT            NULL,
  policy_type   policy_type_enum NOT NULL DEFAULT 'DRIVER_LICENSE',
  status        policy_status_enum NOT NULL DEFAULT 'ACTIVE',
  created_at    TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP       NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMP       NULL
);

-- Indexes
CREATE INDEX idx_policies_status
  ON policies (status)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_policies_policy_type
  ON policies (policy_type)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_policies_label
  ON policies USING gin (label gin_trgm_ops);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_policies_updated_at
  BEFORE UPDATE ON policies
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- Soft delete helper view
CREATE VIEW active_policies AS
  SELECT *
  FROM policies
  WHERE deleted_at IS NULL;

-- ═══════════════════════════════════════════════════════════
-- Sample seed data
-- ═══════════════════════════════════════════════════════════
INSERT INTO policies (label, description, policy_type, status)
VALUES
  ('Standard Driver License Policy',
   'Default policy for driver license issuance and renewal.',
   'DRIVER_LICENSE', 'ACTIVE'),
  ('Commercial Vehicle License Policy',
   'Policy governing commercial vehicle licensing requirements.',
   'VEHICEL_LICENSE', 'ACTIVE'),
  ('Temporary License Policy',
   'Short-term temporary license policy for special cases.',
   'DRIVER_LICENSE', 'INACTIVE');

-- ═══════════════════════════════════════════════════════════
-- Relationships (referenced by other tables)
-- ═══════════════════════════════════════════════════════════
-- license_policy_rules.policy_id → policies.id
-- driver_licenses.policy_id     → policies.id
-- vehicle_licenses.policy_id    → policies.id`;
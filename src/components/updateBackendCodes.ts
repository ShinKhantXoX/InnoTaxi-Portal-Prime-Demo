// Backend & frontend code samples for Update license type code preview
import type { BackendLang } from "./chartBackendCodes";

const BT = String.fromCharCode(96);

export const updateBackendFileConfig: Record<BackendLang, { file: string; language: string }> = {
  nestjs: { file: "license-type.controller.ts", language: "typescript" },
  nodejs: { file: "licenseType.js", language: "javascript" },
  java: { file: "LicenseTypeController.java", language: "java" },
  laravel: { file: "LicenseTypeController.php", language: "php" },
  csharp: { file: "LicenseTypeController.cs", language: "csharp" },
  python: { file: "license_type.py", language: "python" },
  golang: { file: "license_type_handler.go", language: "go" },
  ruby: { file: "license_types_controller.rb", language: "ruby" },
};

export function getUpdateBackendCode(lang: BackendLang): string {
  const codes: Record<BackendLang, string> = {
    nestjs: `// license-type.controller.ts — NestJS + TypeORM
import { Controller, Put, Param, Body, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { LicenseType } from './entities/license-type.entity';
import { UpdateLicenseTypeDto } from './dto/update-license-type.dto';

@Controller('api/v1/license-types')
export class LicenseTypeController {
  constructor(
    @InjectRepository(LicenseType)
    private readonly repo: Repository<LicenseType>,
  ) {}

  // PUT /api/v1/license-types/:id
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateLicenseTypeDto,
  ) {
    const item = await this.repo.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!item) {
      throw new NotFoundException('License type not found');
    }

    // Update fields
    item.code = dto.code ?? item.code;
    item.name = dto.name ?? item.name;
    item.category = dto.category ?? item.category;
    item.vehicle_class = dto.vehicle_class ?? item.vehicle_class;
    item.validity_years = dto.validity_years ?? item.validity_years;
    item.status = dto.status ?? item.status;

    const updated = await this.repo.save(item);

    return {
      success: true,
      message: 'License type updated successfully',
      data: {
        id: updated.id,
        code: updated.code,
        name: updated.name,
        category: updated.category,
        vehicle_class: updated.vehicle_class,
        validity_years: updated.validity_years,
        status: updated.status,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
        deleted_at: updated.deleted_at,
      },
    };
  }
}`,

    nodejs: `// licenseType.js — Node.js + Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// PUT /api/v1/license-types/:id
async function update(req, res) {
  const { id } = req.params;
  const { code, name, category, vehicle_class, validity_years, status } = req.body;

  const existing = await prisma.licenseType.findFirst({
    where: {
      id: parseInt(id),
      deleted_at: null,
    },
  });

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'License type not found',
    });
  }

  const updated = await prisma.licenseType.update({
    where: { id: parseInt(id) },
    data: {
      code: code ?? existing.code,
      name: name ?? existing.name,
      category: category ?? existing.category,
      vehicle_class: vehicle_class ?? existing.vehicle_class,
      validity_years: validity_years ?? existing.validity_years,
      status: status ?? existing.status,
    },
  });

  res.json({
    success: true,
    message: 'License type updated successfully',
    data: {
      id: updated.id,
      code: updated.code,
      name: updated.name,
      category: updated.category,
      vehicle_class: updated.vehicle_class,
      validity_years: updated.validity_years,
      status: updated.status,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
      deleted_at: updated.deleted_at,
    },
  });
}

module.exports = { update };`,

    java: `// LicenseTypeController.java — Spring Boot + JPA
package com.innotaxi.controller;

import com.innotaxi.dto.UpdateLicenseTypeRequest;
import com.innotaxi.entity.LicenseType;
import com.innotaxi.repository.LicenseTypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/license-types")
public class LicenseTypeController {

    private final LicenseTypeRepository repository;

    public LicenseTypeController(LicenseTypeRepository repository) {
        this.repository = repository;
    }

    // PUT /api/v1/license-types/:id
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
        @PathVariable Long id,
        @RequestBody UpdateLicenseTypeRequest request
    ) {
        LicenseType item = repository
            .findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new RuntimeException("License type not found"));

        if (request.getCode() != null) item.setCode(request.getCode());
        if (request.getName() != null) item.setName(request.getName());
        if (request.getCategory() != null) item.setCategory(request.getCategory());
        if (request.getVehicleClass() != null) item.setVehicleClass(request.getVehicleClass());
        if (request.getValidityYears() != null) item.setValidityYears(request.getValidityYears());
        if (request.getStatus() != null) item.setStatus(request.getStatus());

        LicenseType updated = repository.save(item);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "License type updated successfully",
            "data", Map.of(
                "id", updated.getId(),
                "code", updated.getCode(),
                "name", updated.getName(),
                "category", updated.getCategory(),
                "vehicle_class", updated.getVehicleClass(),
                "validity_years", updated.getValidityYears(),
                "status", updated.getStatus(),
                "created_at", updated.getCreatedAt(),
                "updated_at", updated.getUpdatedAt(),
                "deleted_at", updated.getDeletedAt()
            )
        ));
    }
}`,

    laravel: `<?php
// LicenseTypeController.php — Laravel + Eloquent

namespace App\\Http\\Controllers;

use App\\Models\\LicenseType;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class LicenseTypeController extends Controller
{
    // PUT /api/v1/license-types/{id}
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'code'           => 'sometimes|string|max:10',
            'name'           => 'sometimes|string|max:100',
            'category'       => 'sometimes|string|max:50',
            'vehicle_class'  => 'sometimes|string|max:255',
            'validity_years' => 'sometimes|integer|min:1',
            'status'         => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        $item = LicenseType::whereNull('deleted_at')
            ->findOrFail($id);

        $item->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'License type updated successfully',
            'data' => [
                'id'             => $item->id,
                'code'           => $item->code,
                'name'           => $item->name,
                'category'       => $item->category,
                'vehicle_class'  => $item->vehicle_class,
                'validity_years' => $item->validity_years,
                'status'         => $item->status,
                'created_at'     => $item->created_at,
                'updated_at'     => $item->updated_at,
                'deleted_at'     => $item->deleted_at,
            ],
        ]);
    }
}`,

    csharp: `// LicenseTypeController.cs — C# + EF Core
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InnoTaxi.Controllers;

public record UpdateLicenseTypeDto(
    string? Code, string? Name, string? Category,
    string? VehicleClass, int? ValidityYears, string? Status
);

[ApiController]
[Route("api/v1/license-types")]
public class LicenseTypeController : ControllerBase
{
    private readonly AppDbContext _context;

    public LicenseTypeController(AppDbContext context)
    {
        _context = context;
    }

    // PUT /api/v1/license-types/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateLicenseTypeDto dto)
    {
        var item = await _context.LicenseTypes
            .Where(lt => lt.Id == id && lt.DeletedAt == null)
            .FirstOrDefaultAsync();

        if (item == null)
            return NotFound(new { success = false, message = "License type not found" });

        if (dto.Code != null) item.Code = dto.Code;
        if (dto.Name != null) item.Name = dto.Name;
        if (dto.Category != null) item.Category = dto.Category;
        if (dto.VehicleClass != null) item.VehicleClass = dto.VehicleClass;
        if (dto.ValidityYears.HasValue) item.ValidityYears = dto.ValidityYears.Value;
        if (dto.Status != null) item.Status = dto.Status;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "License type updated successfully",
            data = new
            {
                item.Id, item.Code, item.Name,
                item.Category, item.VehicleClass,
                item.ValidityYears, item.Status,
                item.CreatedAt, item.UpdatedAt, item.DeletedAt,
            }
        });
    }
}`,

    python: `# license_type.py — Python + FastAPI + SQLAlchemy
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import and_
from pydantic import BaseModel
from typing import Optional

from models import LicenseType
from database import get_db

router = APIRouter(prefix="/api/v1/license-types")

class UpdateLicenseTypeDto(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    vehicle_class: Optional[str] = None
    validity_years: Optional[int] = None
    status: Optional[str] = None

# PUT /api/v1/license-types/{id}
@router.put("/{id}")
async def update(id: int, dto: UpdateLicenseTypeDto, db: Session = Depends(get_db)):
    item = db.query(LicenseType).filter(
        and_(
            LicenseType.id == id,
            LicenseType.deleted_at.is_(None),
        )
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="License type not found",
        )

    if dto.code is not None: item.code = dto.code
    if dto.name is not None: item.name = dto.name
    if dto.category is not None: item.category = dto.category
    if dto.vehicle_class is not None: item.vehicle_class = dto.vehicle_class
    if dto.validity_years is not None: item.validity_years = dto.validity_years
    if dto.status is not None: item.status = dto.status

    db.commit()
    db.refresh(item)

    return {
        "success": True,
        "message": "License type updated successfully",
        "data": {
            "id": item.id,
            "code": item.code,
            "name": item.name,
            "category": item.category,
            "vehicle_class": item.vehicle_class,
            "validity_years": item.validity_years,
            "status": item.status,
            "created_at": item.created_at,
            "updated_at": item.updated_at,
            "deleted_at": item.deleted_at,
        },
    }`,

    golang: `// license_type_handler.go — Go + GORM
package handlers

import (
${BT}net/http${BT}
${BT}strconv${BT}

${BT}github.com/gin-gonic/gin${BT}
${BT}gorm.io/gorm${BT}
)

type LicenseType struct {
gorm.Model
Code          string ${BT}json:"code"${BT}
Name          string ${BT}json:"name"${BT}
Category      string ${BT}json:"category"${BT}
VehicleClass  string ${BT}json:"vehicle_class"${BT}
ValidityYears int    ${BT}json:"validity_years"${BT}
Status        string ${BT}json:"status"${BT}
}

type UpdateLicenseTypeInput struct {
Code          *string ${BT}json:"code"${BT}
Name          *string ${BT}json:"name"${BT}
Category      *string ${BT}json:"category"${BT}
VehicleClass  *string ${BT}json:"vehicle_class"${BT}
ValidityYears *int    ${BT}json:"validity_years"${BT}
Status        *string ${BT}json:"status"${BT}
}

// PUT /api/v1/license-types/:id
func Update(db *gorm.DB) gin.HandlerFunc {
return func(c *gin.Context) {
  id, _ := strconv.Atoi(c.Param("id"))

  var item LicenseType
  result := db.Where("id = ? AND deleted_at IS NULL", id).First(&item)
  if result.Error != nil {
    c.JSON(http.StatusNotFound, gin.H{
      "success": false,
      "message": "License type not found",
    })
    return
  }

  var input UpdateLicenseTypeInput
  if err := c.ShouldBindJSON(&input); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{
      "success": false,
      "message": err.Error(),
    })
    return
  }

  db.Model(&item).Updates(input)

  c.JSON(http.StatusOK, gin.H{
    "success": true,
    "message": "License type updated successfully",
    "data":    item,
  })
}
}`,

    ruby: `# license_types_controller.rb — Ruby on Rails
class Api::V1::LicenseTypesController < ApplicationController
  # PUT /api/v1/license-types/:id
  def update
    item = LicenseType
      .where(deleted_at: nil)
      .find_by(id: params[:id])

    if item.nil?
      render json: {
        success: false,
        message: 'License type not found'
      }, status: :not_found
      return
    end

    permitted = params.permit(
      :code, :name, :category,
      :vehicle_class, :validity_years, :status
    )

    unless item.update(permitted)
      render json: {
        success: false,
        message: item.errors.full_messages.join(', ')
      }, status: :unprocessable_entity
      return
    end

    render json: {
      success: true,
      message: 'License type updated successfully',
      data: {
        id: item.id,
        code: item.code,
        name: item.name,
        category: item.category,
        vehicle_class: item.vehicle_class,
        validity_years: item.validity_years,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        deleted_at: item.deleted_at
      }
    }
  end
end`,
  };

  return codes[lang];
}

// ── Frontend update code strings ──

export const updateReactCode = `import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

interface LicenseType {
  id: number;
  code: string;
  name: string;
  category: string;
  vehicleClass: string;
  validityYears: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function LicenseTypeUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '', name: '', category: '',
    vehicleClass: '', validityYears: 1, status: 'ACTIVE',
  });

  useEffect(() => {
    fetch(\\\`/api/v1/license-types/\\\${id}\\\`, {
      headers: { Authorization: \\\`Bearer \\\${localStorage.getItem('token')}\\\` },
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          code: data.data.code,
          name: data.data.name,
          category: data.data.category,
          vehicleClass: data.data.vehicle_class,
          validityYears: data.data.validity_years,
          status: data.data.status,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(\\\`/api/v1/license-types/\\\${id}\\\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \\\`Bearer \\\${localStorage.getItem('token')}\\\`,
        },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          category: formData.category,
          vehicle_class: formData.vehicleClass,
          validity_years: formData.validityYears,
          status: formData.status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: data.message,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <h1 className="text-xl font-semibold mb-6">
        Update License Type
      </h1>
      <div className="grid grid-cols-5 gap-4 mb-4">
        <div>
          <label>Code</label>
          <InputText value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
        </div>
        <div>
          <label>License Name</label>
          <InputText value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div>
          <label>Category</label>
          <InputText value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
        </div>
        <div>
          <label>Validity (Years)</label>
          <InputNumber value={formData.validityYears} min={1}
            onValueChange={(e) => setFormData({ ...formData, validityYears: e.value ?? 1 })} />
        </div>
        <div>
          <label>Status</label>
          <Dropdown value={formData.status}
            options={[{ label: 'ACTIVE', value: 'ACTIVE' }, { label: 'INACTIVE', value: 'INACTIVE' }]}
            onChange={(e) => setFormData({ ...formData, status: e.value })} />
        </div>
      </div>
      <div className="mb-6">
        <label>Vehicle Class</label>
        <InputText value={formData.vehicleClass} className="w-full"
          onChange={(e) => setFormData({ ...formData, vehicleClass: e.target.value })} />
      </div>
      <div className="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary"
          onClick={() => navigate(-1)} />
        <Button label="Update License Type" icon="pi pi-check"
          loading={submitting} onClick={handleSubmit} />
      </div>
    </div>
  );
}`;

export const updateVueCode = `<template>
  <div class="p-6">
    <Toast ref="toast" />
    <h1 class="text-xl font-semibold mb-6">Update License Type</h1>
    <div v-if="loading" class="text-center py-12">Loading...</div>
    <template v-else>
      <div class="grid grid-cols-5 gap-4 mb-4">
        <div>
          <label>Code</label>
          <InputText v-model="formData.code" />
        </div>
        <div>
          <label>License Name</label>
          <InputText v-model="formData.name" />
        </div>
        <div>
          <label>Category</label>
          <InputText v-model="formData.category" />
        </div>
        <div>
          <label>Validity (Years)</label>
          <InputNumber v-model="formData.validityYears" :min="1" />
        </div>
        <div>
          <label>Status</label>
          <Dropdown v-model="formData.status"
            :options="statusOptions" optionLabel="label" optionValue="value" />
        </div>
      </div>
      <div class="mb-6">
        <label>Vehicle Class</label>
        <InputText v-model="formData.vehicleClass" class="w-full" />
      </div>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary"
          @click="$router.back()" />
        <Button label="Update License Type" icon="pi pi-check"
          :loading="submitting" @click="handleSubmit" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const route = useRoute();
const toastService = useToast();
const loading = ref(true);
const submitting = ref(false);
const statusOptions = [
  { label: 'ACTIVE', value: 'ACTIVE' },
  { label: 'INACTIVE', value: 'INACTIVE' },
];

const formData = ref({
  code: '', name: '', category: '',
  vehicleClass: '', validityYears: 1, status: 'ACTIVE',
});

onMounted(async () => {
  try {
    const res = await fetch(
      \\\`/api/v1/license-types/\\\${route.params.id}\\\`,
      { headers: { Authorization: \\\`Bearer \\\${localStorage.getItem('token')}\\\` } }
    );
    const data = await res.json();
    formData.value = {
      code: data.data.code,
      name: data.data.name,
      category: data.data.category,
      vehicleClass: data.data.vehicle_class,
      validityYears: data.data.validity_years,
      status: data.data.status,
    };
  } finally {
    loading.value = false;
  }
});

async function handleSubmit() {
  submitting.value = true;
  try {
    const res = await fetch(
      \\\`/api/v1/license-types/\\\${route.params.id}\\\`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \\\`Bearer \\\${localStorage.getItem('token')}\\\`,
        },
        body: JSON.stringify({
          code: formData.value.code,
          name: formData.value.name,
          category: formData.value.category,
          vehicle_class: formData.value.vehicleClass,
          validity_years: formData.value.validityYears,
          status: formData.value.status,
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      toastService.add({
        severity: 'success',
        summary: 'Updated',
        detail: data.message,
        life: 3000,
      });
    }
  } finally {
    submitting.value = false;
  }
}
</script>`;

export const updateAngularCode = `import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface FormData {
  code: string;
  name: string;
  category: string;
  vehicleClass: string;
  validityYears: number;
  status: string;
}

@Component({
  selector: 'app-license-type-update',
  standalone: true,
  imports: [
    CommonModule, FormsModule, InputTextModule,
    InputNumberModule, DropdownModule, ButtonModule, ToastModule,
  ],
  providers: [MessageService],
  template: \\\`
    <div class="p-6">
      <p-toast />
      <h1 class="text-xl font-semibold mb-6">Update License Type</h1>
      <div *ngIf="!loading">
        <div class="grid grid-cols-5 gap-4 mb-4">
          <div>
            <label>Code</label>
            <input pInputText [(ngModel)]="formData.code" />
          </div>
          <div>
            <label>License Name</label>
            <input pInputText [(ngModel)]="formData.name" />
          </div>
          <div>
            <label>Category</label>
            <input pInputText [(ngModel)]="formData.category" />
          </div>
          <div>
            <label>Validity (Years)</label>
            <p-inputNumber [(ngModel)]="formData.validityYears" [min]="1" />
          </div>
          <div>
            <label>Status</label>
            <p-dropdown [(ngModel)]="formData.status"
              [options]="statusOptions" optionLabel="label" optionValue="value" />
          </div>
        </div>
        <div class="mb-6">
          <label>Vehicle Class</label>
          <input pInputText [(ngModel)]="formData.vehicleClass" class="w-full" />
        </div>
        <div class="flex justify-end gap-2">
          <p-button label="Cancel" severity="secondary"
            (onClick)="goBack()" />
          <p-button label="Update License Type" icon="pi pi-check"
            [loading]="submitting" (onClick)="handleSubmit()" />
        </div>
      </div>
    </div>
  \\\`
})
export class LicenseTypeUpdateComponent implements OnInit {
  loading = true;
  submitting = false;
  statusOptions = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
  ];

  formData: FormData = {
    code: '', name: '', category: '',
    vehicleClass: '', validityYears: 1, status: 'ACTIVE',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const headers = new HttpHeaders({
      Authorization: \\\`Bearer \\\${localStorage.getItem('token')}\\\`,
    });
    this.http.get<any>(\\\`/api/v1/license-types/\\\${id}\\\`, { headers })
      .subscribe({
        next: (res) => {
          this.formData = {
            code: res.data.code,
            name: res.data.name,
            category: res.data.category,
            vehicleClass: res.data.vehicle_class,
            validityYears: res.data.validity_years,
            status: res.data.status,
          };
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
  }

  handleSubmit() {
    this.submitting = true;
    const id = this.route.snapshot.paramMap.get('id');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: \\\`Bearer \\\${localStorage.getItem('token')}\\\`,
    });
    this.http.put<any>(\\\`/api/v1/license-types/\\\${id}\\\`, {
      code: this.formData.code,
      name: this.formData.name,
      category: this.formData.category,
      vehicle_class: this.formData.vehicleClass,
      validity_years: this.formData.validityYears,
      status: this.formData.status,
    }, { headers }).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: res.message,
        });
        this.submitting = false;
      },
      error: () => { this.submitting = false; },
    });
  }

  goBack() { this.router.navigate(['/dashboard']); }
}`;

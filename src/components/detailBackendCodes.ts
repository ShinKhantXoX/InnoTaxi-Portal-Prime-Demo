// Backend language code samples for Detail page code preview
import type { BackendLang } from "./chartBackendCodes";

const BT = String.fromCharCode(96);

export const detailBackendFileConfig: Record<BackendLang, { file: string; language: string }> = {
  nestjs: { file: "license-type.controller.ts", language: "typescript" },
  nodejs: { file: "licenseType.js", language: "javascript" },
  java: { file: "LicenseTypeController.java", language: "java" },
  laravel: { file: "LicenseTypeController.php", language: "php" },
  csharp: { file: "LicenseTypeController.cs", language: "csharp" },
  python: { file: "license_type.py", language: "python" },
  golang: { file: "license_type_handler.go", language: "go" },
  ruby: { file: "license_types_controller.rb", language: "ruby" },
};

export function getDetailBackendCode(lang: BackendLang): string {
  const codes: Record<BackendLang, string> = {
    nestjs: `// license-type.controller.ts — NestJS + TypeORM
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { LicenseType } from './entities/license-type.entity';

@Controller('api/v1/license-types')
export class LicenseTypeController {
  constructor(
    @InjectRepository(LicenseType)
    private readonly repo: Repository<LicenseType>,
  ) {}

  // GET /api/v1/license-types/:id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const item = await this.repo.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!item) {
      throw new NotFoundException('License type not found');
    }

    return {
      success: true,
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
        deleted_at: item.deleted_at,
      },
    };
  }
}`,

    nodejs: `// licenseType.js — Node.js + Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/v1/license-types/:id
async function findOne(req, res) {
  const { id } = req.params;

  const item = await prisma.licenseType.findFirst({
    where: {
      id: parseInt(id),
      deleted_at: null,
    },
  });

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'License type not found',
    });
  }

  res.json({
    success: true,
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
      deleted_at: item.deleted_at,
    },
  });
}

module.exports = { findOne };`,

    java: `// LicenseTypeController.java — Spring Boot + JPA
package com.innotaxi.controller;

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

    // GET /api/v1/license-types/:id
    @GetMapping("/{id}")
    public ResponseEntity<?> findOne(@PathVariable Long id) {
        LicenseType item = repository
            .findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new RuntimeException("License type not found"));

        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", Map.of(
                "id", item.getId(),
                "code", item.getCode(),
                "name", item.getName(),
                "category", item.getCategory(),
                "vehicle_class", item.getVehicleClass(),
                "validity_years", item.getValidityYears(),
                "status", item.getStatus(),
                "created_at", item.getCreatedAt(),
                "updated_at", item.getUpdatedAt(),
                "deleted_at", item.getDeletedAt()
            )
        ));
    }
}`,

    laravel: `<?php
// LicenseTypeController.php — Laravel + Eloquent

namespace App\\Http\\Controllers;

use App\\Models\\LicenseType;
use Illuminate\\Http\\JsonResponse;

class LicenseTypeController extends Controller
{
    // GET /api/v1/license-types/{id}
    public function show(int $id): JsonResponse
    {
        $item = LicenseType::whereNull('deleted_at')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
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

[ApiController]
[Route("api/v1/license-types")]
public class LicenseTypeController : ControllerBase
{
    private readonly AppDbContext _context;

    public LicenseTypeController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/v1/license-types/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> FindOne(int id)
    {
        var item = await _context.LicenseTypes
            .Where(lt => lt.Id == id && lt.DeletedAt == null)
            .FirstOrDefaultAsync();

        if (item == null)
            return NotFound(new { success = false, message = "License type not found" });

        return Ok(new
        {
            success = true,
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

from models import LicenseType
from database import get_db

router = APIRouter(prefix="/api/v1/license-types")

# GET /api/v1/license-types/{id}
@router.get("/{id}")
async def find_one(id: int, db: Session = Depends(get_db)):
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

    return {
        "success": True,
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

// GET /api/v1/license-types/:id
func FindOne(db *gorm.DB) gin.HandlerFunc {
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

  c.JSON(http.StatusOK, gin.H{
    "success": true,
    "data": item,
  })
}
}`,

    ruby: `# license_types_controller.rb — Ruby on Rails
class Api::V1::LicenseTypesController < ApplicationController
  # GET /api/v1/license-types/:id
  def show
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

    render json: {
      success: true,
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

// ── Frontend detail code strings ──

export const detailReactCode = `import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag } from 'primereact/tag';

interface LicenseType {
  id: number;
  code: string;
  name: string;
  category: string;
  vehicleClass: string;
  validityYears: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function LicenseTypeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<LicenseType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\\\`/api/v1/license-types/\\\${id}\\\`, {
      headers: { Authorization: \\\`Bearer \\\${localStorage.getItem('token')}\\\` },
    })
      .then(res => res.json())
      .then(data => { setItem(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!item) return <div>Not found</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">
          {item.code} - {item.name}
        </h1>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl border p-5">
          <h2>License Information</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div><label>Code</label><p>{item.code}</p></div>
            <div><label>Name</label><p>{item.name}</p></div>
            <div><label>Category</label><p>{item.category}</p></div>
            <div><label>Vehicle Class</label><p>{item.vehicleClass}</p></div>
            <div><label>Validity</label><p>{item.validityYears} years</p></div>
            <div>
              <label>Status</label>
              <Tag value={item.status}
                severity={item.status === 'ACTIVE' ? 'success' : 'danger'} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h2>Timestamps</h2>
          <div className="mt-4 space-y-3">
            <div><label>Created At</label><p>{item.createdAt}</p></div>
            <div><label>Updated At</label><p>{item.updatedAt}</p></div>
            <div><label>Deleted At</label><p>{item.deletedAt ?? '\\u2014'}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

export const detailVueCode = `<template>
  <div class="p-6">
    <div v-if="loading" class="text-center py-12">Loading...</div>
    <div v-else-if="!item" class="text-center py-12">Not found</div>
    <template v-else>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-semibold">
          {{ item.code }} - {{ item.name }}
        </h1>
        <button @click="$router.back()">Back</button>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2 bg-white rounded-xl border p-5">
          <h2>License Information</h2>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div><label>Code</label><p>{{ item.code }}</p></div>
            <div><label>Name</label><p>{{ item.name }}</p></div>
            <div><label>Category</label><p>{{ item.category }}</p></div>
            <div><label>Vehicle Class</label><p>{{ item.vehicleClass }}</p></div>
            <div><label>Validity</label><p>{{ item.validityYears }} years</p></div>
            <div>
              <label>Status</label>
              <Tag :value="item.status"
                :severity="item.status === 'ACTIVE' ? 'success' : 'danger'" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border p-5">
          <h2>Timestamps</h2>
          <div class="mt-4 space-y-3">
            <div><label>Created At</label><p>{{ item.createdAt }}</p></div>
            <div><label>Updated At</label><p>{{ item.updatedAt }}</p></div>
            <div><label>Deleted At</label><p>{{ item.deletedAt ?? '\\u2014' }}</p></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Tag from 'primevue/tag';

const route = useRoute();
const item = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch(
      \\\`/api/v1/license-types/\\\${route.params.id}\\\`,
      { headers: { Authorization: \\\`Bearer \\\${localStorage.getItem('token')}\\\` } }
    );
    const data = await res.json();
    item.value = data.data;
  } finally {
    loading.value = false;
  }
});
</script>`;

export const detailAngularCode = `import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

interface LicenseType {
  id: number; code: string; name: string;
  category: string; vehicleClass: string;
  validityYears: number; status: 'ACTIVE' | 'INACTIVE';
  createdAt: string; updatedAt: string;
  deletedAt: string | null;
}

@Component({
  selector: 'app-license-type-detail',
  standalone: true,
  imports: [CommonModule, TagModule],
  template: \\\`
    <div class="p-6" *ngIf="!loading && item">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-semibold">
          {{ item.code }} - {{ item.name }}
        </h1>
        <button (click)="goBack()">Back</button>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2 bg-white rounded-xl border p-5">
          <h2>License Information</h2>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div><label>Code</label><p>{{ item.code }}</p></div>
            <div><label>Name</label><p>{{ item.name }}</p></div>
            <div><label>Category</label><p>{{ item.category }}</p></div>
            <div><label>Vehicle Class</label><p>{{ item.vehicleClass }}</p></div>
            <div><label>Validity</label><p>{{ item.validityYears }} years</p></div>
            <div>
              <label>Status</label>
              <p-tag [value]="item.status"
                [severity]="item.status === 'ACTIVE' ? 'success' : 'danger'" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border p-5">
          <h2>Timestamps</h2>
          <div class="mt-4 space-y-3">
            <div><label>Created At</label><p>{{ item.createdAt }}</p></div>
            <div><label>Updated At</label><p>{{ item.updatedAt }}</p></div>
            <div><label>Deleted At</label><p>{{ item.deletedAt ?? '\\u2014' }}</p></div>
          </div>
        </div>
      </div>
    </div>
  \\\`
})
export class LicenseTypeDetailComponent implements OnInit {
  item: LicenseType | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const headers = new HttpHeaders({
      Authorization: \\\`Bearer \\\${localStorage.getItem('token')}\\\`,
    });
    this.http.get<any>(\\\`/api/v1/license-types/\\\${id}\\\`, { headers })
      .subscribe({
        next: (res) => { this.item = res.data; this.loading = false; },
        error: () => { this.loading = false; },
      });
  }

  goBack() { this.router.navigate(['/dashboard']); }
}`;

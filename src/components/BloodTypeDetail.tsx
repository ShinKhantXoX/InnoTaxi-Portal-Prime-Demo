import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Highlight, themes } from "prism-react-renderer";
import { Droplets, ArrowLeft, Code2, Copy, Check, X, ChevronDown, Info, Database } from "lucide-react";
import { motion } from "motion/react";
import { bloodTypeMockData } from "./BloodTypeList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";

// ── Frontend code templates ──
const detailReactCode = `// BloodTypeDetail.tsx - PrimeReact + React Router
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Droplets, ArrowLeft } from "lucide-react";

export function BloodTypeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(\`/api/v1/blood-types/\${id}\`)
      .then((res) => res.json())
      .then((data) => setItem(data.data));
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="min-h-full">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft /> Back to Blood Types
      </button>
      <h1>Blood Type Detail</h1>
      <div className="bg-white rounded-xl border p-6">
        <div><label>Code</label><span>{item.code}</span></div>
        <div><label>Name</label><span>{item.name}</span></div>
        <div><label>Group</label><span>{item.group}</span></div>
        <div><label>Rh Factor</label><span>{item.rh_factor}</span></div>
        <div><label>Drivers</label><span>{item.drivers}</span></div>
        <div><label>Customers</label><span>{item.customers}</span></div>
        <div><label>Status</label><span>{item.status}</span></div>
        <div><label>Description</label><p>{item.description}</p></div>
      </div>
    </div>
  );
}`;

const detailVueCode = `<!-- BloodTypeDetail.vue - PrimeVue + Vue Router -->
<template>
  <div class="min-h-full">
    <button @click="router.back()">Back to Blood Types</button>
    <h1>Blood Type Detail</h1>
    <div class="bg-white rounded-xl border p-6" v-if="item">
      <div><label>Code</label><span>{{ item.code }}</span></div>
      <div><label>Name</label><span>{{ item.name }}</span></div>
      <div><label>Group</label><span>{{ item.group }}</span></div>
      <div><label>Rh Factor</label><span>{{ item.rh_factor }}</span></div>
      <div><label>Drivers</label><span>{{ item.drivers }}</span></div>
      <div><label>Customers</label><span>{{ item.customers }}</span></div>
      <div><label>Status</label><span>{{ item.status }}</span></div>
      <div><label>Description</label><p>{{ item.description }}</p></div>
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
  const res = await fetch(\`/api/v1/blood-types/\${route.params.id}\`);
  const data = await res.json();
  item.value = data.data;
});
</script>`;

const detailAngularCode = `// blood-type-detail.component.ts - PrimeNG + Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blood-type-detail',
  template: \`
    <div class="min-h-full" *ngIf="item">
      <button (click)="goBack()">Back to Blood Types</button>
      <h1>Blood Type Detail</h1>
      <div class="bg-white rounded-xl border p-6">
        <div><label>Code</label><span>{{ item.code }}</span></div>
        <div><label>Name</label><span>{{ item.name }}</span></div>
        <div><label>Group</label><span>{{ item.group }}</span></div>
        <div><label>Rh Factor</label><span>{{ item.rh_factor }}</span></div>
        <div><label>Drivers</label><span>{{ item.drivers }}</span></div>
        <div><label>Customers</label><span>{{ item.customers }}</span></div>
        <div><label>Status</label><span>{{ item.status }}</span></div>
        <div><label>Description</label><p>{{ item.description }}</p></div>
      </div>
    </div>
  \`,
})
export class BloodTypeDetailComponent implements OnInit {
  item: any = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(\`/api/v1/blood-types/\${id}\`).subscribe({
      next: (res) => { this.item = res.data; },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard'], {
      state: { activeItem: 'Blood Type' },
    });
  }
}`;

// ── Backend code templates ──
const bloodTypeBackendCode: Record<BackendLang, string> = {
  nestjs: `// blood-types.controller.ts - NestJS
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BloodTypesService } from './blood-types.service';

@Controller('api/v1/blood-types')
export class BloodTypesController {
  constructor(private readonly bloodTypesService: BloodTypesService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.bloodTypesService.findOne(id);
    return { success: true, data };
  }
}`,
  express: `// blood-types.routes.ts - Express
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/api/v1/blood-types/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM blood_types WHERE id = $1', [id]);
  if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: result.rows[0] });
});

export default router;`,
  fastapi: `# blood_types.py - FastAPI
from fastapi import APIRouter, HTTPException
from db import database

router = APIRouter(prefix="/api/v1/blood-types")

@router.get("/{id}")
async def get_blood_type(id: int):
    query = "SELECT * FROM blood_types WHERE id = :id"
    row = await database.fetch_one(query, {"id": id})
    if not row:
        raise HTTPException(status_code=404, detail="Blood type not found")
    return {"success": True, "data": dict(row)}`,
  gin: `// blood_types.go - Gin
package handlers

import (
  "net/http"
  "strconv"
  "github.com/gin-gonic/gin"
  "your-app/db"
)

func GetBloodType(c *gin.Context) {
  id, _ := strconv.Atoi(c.Param("id"))
  var bt BloodType
  if err := db.DB.First(&bt, id).Error; err != nil {
    c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Not found"})
    return
  }
  c.JSON(http.StatusOK, gin.H{"success": true, "data": bt})
}`,
  springboot: `// BloodTypeController.java - Spring Boot
package com.innotaxi.controller;

import com.innotaxi.model.BloodType;
import com.innotaxi.service.BloodTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/blood-types")
public class BloodTypeController {

    private final BloodTypeService service;

    public BloodTypeController(BloodTypeService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> findOne(@PathVariable Long id) {
        BloodType bt = service.findById(id);
        return ResponseEntity.ok(Map.of("success", true, "data", bt));
    }
}`,
  laravel: `<?php
// BloodTypeController.php - Laravel
namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Models\\BloodType;

class BloodTypeController extends Controller
{
    public function show($id)
    {
        $bt = BloodType::findOrFail($id);
        return response()->json(['success' => true, 'data' => $bt]);
    }
}`,
  django: `# views.py - Django REST Framework
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import BloodType
from .serializers import BloodTypeSerializer

@api_view(['GET'])
def blood_type_detail(request, pk):
    try:
        bt = BloodType.objects.get(pk=pk)
    except BloodType.DoesNotExist:
        return Response({'success': False, 'message': 'Not found'}, status=404)
    serializer = BloodTypeSerializer(bt)
    return Response({'success': True, 'data': serializer.data})`,
};

const bloodTypeBackendFileConfig: Record<BackendLang, string> = {
  nestjs: "blood-types.controller.ts",
  express: "blood-types.routes.ts",
  fastapi: "blood_types.py",
  gin: "blood_types.go",
  springboot: "BloodTypeController.java",
  laravel: "BloodTypeController.php",
  django: "views.py",
};

const bloodTypeDatabaseSchema = `-- blood_types table schema (PostgreSQL)
-- Database: innotaxi

CREATE TABLE IF NOT EXISTS blood_types (
    id            SERIAL PRIMARY KEY,
    code          VARCHAR(10)   NOT NULL UNIQUE,       -- e.g. "A+", "O-", "AB+"
    name          VARCHAR(100)  NOT NULL,               -- e.g. "A Positive"
    "group"       VARCHAR(5)    NOT NULL,               -- A, B, AB, O
    rh_factor     VARCHAR(10)   NOT NULL DEFAULT 'Positive',  -- Positive / Negative
    description   TEXT,
    drivers       INTEGER       NOT NULL DEFAULT 0,
    customers     INTEGER       NOT NULL DEFAULT 0,
    status        VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_blood_types_code ON blood_types(code);
CREATE INDEX idx_blood_types_group ON blood_types("group");
CREATE INDEX idx_blood_types_status ON blood_types(status);
CREATE INDEX idx_blood_types_rh_factor ON blood_types(rh_factor);

-- Seed data
INSERT INTO blood_types (code, name, "group", rh_factor, drivers, customers, description, status) VALUES
  ('A+',  'A Positive',  'A',  'Positive', 87, 1243, 'Most common blood type with Rh positive antigen on red blood cells', 'ACTIVE'),
  ('A-',  'A Negative',  'A',  'Negative', 18, 256,  'Type A without Rh factor, compatible with A and AB recipients', 'ACTIVE'),
  ('B+',  'B Positive',  'B',  'Positive', 72, 1028, 'Contains B antigens with Rh positive factor on red blood cells', 'ACTIVE'),
  ('B-',  'B Negative',  'B',  'Negative', 15, 198,  'Rare blood type with B antigens and no Rh factor present', 'ACTIVE'),
  ('AB+', 'AB Positive', 'AB', 'Positive', 28, 412,  'Universal plasma donor with both A and B antigens present', 'ACTIVE'),
  ('AB-', 'AB Negative', 'AB', 'Negative', 5,  67,   'Rarest blood type, universal plasma donor without Rh factor', 'ACTIVE'),
  ('O+',  'O Positive',  'O',  'Positive', 98, 1456, 'Most common type globally, universal red cell donor for Rh+ recipients', 'ACTIVE'),
  ('O-',  'O Negative',  'O',  'Negative', 19, 274,  'Universal red cell donor, compatible with all blood types', 'ACTIVE');`;

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

export function BloodTypeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Code preview state
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);
  const [codeCategory, setCodeCategory] = useState<"frontend" | "backend" | "database">("frontend");
  const [codeFramework, setCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [backendLang, setBackendLang] = useState<BackendLang>("nestjs");
  const [backendLangOpen, setBackendLangOpen] = useState(false);
  const backendLangRef = useRef<HTMLDivElement>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const item = bloodTypeMockData.find((bt) => bt.id === Number(id));

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

  // Not found
  if (!item) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-6 h-6 text-[#e53935]" />
          </div>
          <h2 className="text-[18px] text-[#0f172a] font-semibold mb-1.5">Blood Type Not Found</h2>
          <p className="text-[13px] text-[#94a3b8] mb-5">The requested blood type does not exist or has been deleted.</p>
          <button
            onClick={() => { sessionStorage.setItem("innotaxi_active_item", "Blood Type"); navigate("/dashboard"); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] text-[#64748b] hover:text-[#0f172a] bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#cbd5e1] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to List
          </button>
        </div>
      </div>
    );
  }



  // Code preview helpers
  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: detailReactCode, vue: detailVueCode, angular: detailAngularCode }[codeFramework];
    }
    if (codeCategory === "database") {
      return bloodTypeDatabaseSchema;
    }
    return bloodTypeBackendCode[backendLang];
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "BloodTypeDetail.tsx", vue: "BloodTypeDetail.vue", angular: "blood-type-detail.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") {
      return "blood_types.sql";
    }
    return bloodTypeBackendFileConfig[backendLang];
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

  // Read-only info fields
  const infoFields = [
    { label: "Code", value: item.code, span: "col-span-12 md:col-span-3" },
    { label: "Name", value: item.name, span: "col-span-12 md:col-span-5" },
    { label: "Group", value: item.group, span: "col-span-12 md:col-span-2" },
    { label: "Rh Factor", value: item.rhFactor, span: "col-span-12 md:col-span-2" },
    { label: "Drivers", value: String(item.drivers), span: "col-span-12 md:col-span-3" },
    { label: "Customers", value: String(item.customers), span: "col-span-12 md:col-span-3" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-5">
        <button
          onClick={() => { sessionStorage.setItem("innotaxi_active_item", "Blood Type"); navigate("/dashboard"); }}
          className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blood Types
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center">
            <Droplets className="w-5 h-5 text-[#e53935]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold">
              Blood Type Detail
            </h1>
            <p className="text-[12px] text-[#94a3b8]">
              View blood type record <span className="text-[#64748b] font-medium">#{item.id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Status + Type Badges */}
      

      {/* Blood Type Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-white rounded-[12px] border border-[#e2e8f0] overflow-hidden mb-5"
      >
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center">
              <Info className="w-4 h-4 text-[#6366f1]" />
            </div>
            <div>
              <h3 className="text-[15px] text-[#0f172a] font-semibold">Blood Type Information</h3>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">
                <span className="text-[#64748b] font-medium">{item.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setCodePreviewOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#c7d2fe]"
            title="View Detail Code"
          >
            <span>&lt;/&gt;</span>
          </button>
        </div>

        {/* Read-Only Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            {infoFields.map((field) => (
              <div key={field.label}>
                <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                  {field.label}
                </label>
                <div className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#f1f5f9] text-[13px] text-[#0f172a]">
                  {field.value}
                </div>
              </div>
            ))}

            {/* Description - Full Width */}
            <div className="col-span-1 md:col-span-3">
              <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                Description
              </label>
              <div className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#f1f5f9] text-[13px] text-[#0f172a] min-h-[60px]">
                {item.description}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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
                <h3 className="text-[13px] text-[#0f172a] font-semibold">Blood Type Detail Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">GET /api/v1/blood-types/:id</p>
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
    </div>
  );
}
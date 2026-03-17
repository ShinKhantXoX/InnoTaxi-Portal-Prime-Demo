import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Highlight, themes } from "prism-react-renderer";
import { Fuel, ArrowLeft, Code2, Copy, Check, X, ChevronDown, Info, Database } from "lucide-react";
import { motion } from "motion/react";
import { fuelTypeMockData } from "./FuelTypeList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";

// ── Frontend code templates ──
const detailReactCode = `// FuelTypeDetail.tsx - PrimeReact + React Router
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Fuel, ArrowLeft } from "lucide-react";

export function FuelTypeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(\\\`/api/v1/fuel-types/\\\${id}\\\`)
      .then((res) => res.json())
      .then((data) => setItem(data.data));
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="min-h-full">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft /> Back to Fuel Types
      </button>
      <h1>Fuel Type Detail</h1>
      <div className="bg-white rounded-xl border p-6">
        <div><label>Fuel Type</label><span>{item.fuelType}</span></div>
        <div><label>Description</label><p>{item.description}</p></div>
        <div><label>Status</label><span>{item.status}</span></div>
      </div>
    </div>
  );
}`;

const detailVueCode = `<!-- FuelTypeDetail.vue - PrimeVue + Vue Router -->
<template>
  <div class="min-h-full">
    <button @click="router.back()">Back to Fuel Types</button>
    <h1>Fuel Type Detail</h1>
    <div class="bg-white rounded-xl border p-6" v-if="item">
      <div><label>Fuel Type</label><span>{{ item.fuelType }}</span></div>
      <div><label>Description</label><p>{{ item.description }}</p></div>
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
  const res = await fetch(\\\`/api/v1/fuel-types/\\\${route.params.id}\\\`);
  const data = await res.json();
  item.value = data.data;
});
</script>`;

const detailAngularCode = `// fuel-type-detail.component.ts - PrimeNG + Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fuel-type-detail',
  template: \\\`
    <div class="min-h-full" *ngIf="item">
      <button (click)="goBack()">Back to Fuel Types</button>
      <h1>Fuel Type Detail</h1>
      <div class="bg-white rounded-xl border p-6">
        <div><label>Fuel Type</label><span>{{ item.fuelType }}</span></div>
        <div><label>Description</label><p>{{ item.description }}</p></div>
        <div><label>Status</label><span>{{ item.status }}</span></div>
      </div>
    </div>
  \\\`,
})
export class FuelTypeDetailComponent implements OnInit {
  item: any = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(\\\`/api/v1/fuel-types/\\\${id}\\\`).subscribe({
      next: (res) => { this.item = res.data; },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard'], {
      state: { activeItem: 'Fuel Type' },
    });
  }
}`;

// ── Backend code templates ──
const fuelTypeBackendCode: Record<string, string> = {
  nestjs: `// fuel-types.controller.ts - NestJS
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FuelTypesService } from './fuel-types.service';

@Controller('api/v1/fuel-types')
export class FuelTypesController {
  constructor(private readonly fuelTypesService: FuelTypesService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.fuelTypesService.findOne(id);
    return { success: true, data };
  }
}`,
  nodejs: `// fuel-types.routes.ts - Express
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/api/v1/fuel-types/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM fuel_types WHERE id = $1', [id]);
  if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: result.rows[0] });
});

export default router;`,
  java: `// FuelTypeController.java - Spring Boot
package com.innotaxi.controller;

import com.innotaxi.model.FuelType;
import com.innotaxi.service.FuelTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/fuel-types")
public class FuelTypeController {

    private final FuelTypeService service;

    public FuelTypeController(FuelTypeService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> findOne(@PathVariable Long id) {
        FuelType ft = service.findById(id);
        return ResponseEntity.ok(Map.of("success", true, "data", ft));
    }
}`,
  laravel: `<?php
// FuelTypeController.php - Laravel
namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Models\\FuelType;

class FuelTypeController extends Controller
{
    public function show($id)
    {
        $ft = FuelType::findOrFail($id);
        return response()->json(['success' => true, 'data' => $ft]);
    }
}`,
  python: `# views.py - Django REST Framework
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FuelType
from .serializers import FuelTypeSerializer

@api_view(['GET'])
def fuel_type_detail(request, pk):
    try:
        ft = FuelType.objects.get(pk=pk)
    except FuelType.DoesNotExist:
        return Response({'success': False, 'message': 'Not found'}, status=404)
    serializer = FuelTypeSerializer(ft)
    return Response({'success': True, 'data': serializer.data})`,
  golang: `// fuel_types.go - Gin
package handlers

import (
  "net/http"
  "strconv"
  "github.com/gin-gonic/gin"
  "your-app/db"
)

func GetFuelType(c *gin.Context) {
  id, _ := strconv.Atoi(c.Param("id"))
  var ft FuelType
  if err := db.DB.First(&ft, id).Error; err != nil {
    c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Not found"})
    return
  }
  c.JSON(http.StatusOK, gin.H{"success": true, "data": ft})
}`,
  csharp: `// FuelTypesController.cs - ASP.NET Core
[HttpGet("{id}")]
public async Task<IActionResult> FindOne(int id)
{
    var ft = await _context.FuelTypes.FindAsync(id);
    if (ft == null) return NotFound(new { success = false });
    return Ok(new { success = true, data = ft });
}`,
  ruby: `# fuel_types_controller.rb - Ruby on Rails
def show
  ft = FuelType.find(params[:id])
  render json: { success: true, data: ft }
rescue ActiveRecord::RecordNotFound
  render json: { success: false, message: 'Not found' }, status: :not_found
end`,
};

const fuelTypeBackendFileConfig: Record<string, string> = {
  nestjs: "fuel-types.controller.ts",
  nodejs: "fuel-types.routes.ts",
  java: "FuelTypeController.java",
  laravel: "FuelTypeController.php",
  python: "views.py",
  golang: "fuel_types.go",
  csharp: "FuelTypesController.cs",
  ruby: "fuel_types_controller.rb",
};

const fuelTypeDatabaseSchema = `-- fuel_types table schema (PostgreSQL)
-- Database: innotaxi

CREATE TABLE IF NOT EXISTS fuel_types (
    id            SERIAL PRIMARY KEY,
    fuel_type     VARCHAR(50)   NOT NULL UNIQUE,
    description   TEXT,
    status        VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_fuel_types_fuel_type ON fuel_types(fuel_type);
CREATE INDEX idx_fuel_types_status ON fuel_types(status);

-- Seed data
INSERT INTO fuel_types (fuel_type, description, status) VALUES
  ('Petrol',   'Standard gasoline fuel used in most internal combustion engines', 'ACTIVE'),
  ('Diesel',   'Compression-ignition fuel for heavy-duty and commercial vehicles', 'ACTIVE'),
  ('CNG',      'Compressed Natural Gas, a cleaner alternative to petrol and diesel', 'ACTIVE'),
  ('LPG',      'Liquefied Petroleum Gas, commonly used as an automotive fuel alternative', 'ACTIVE'),
  ('Hybrid',   'Combination of internal combustion engine with electric motor propulsion', 'ACTIVE'),
  ('Electric', 'Battery-powered electric vehicle with zero direct emissions', 'ACTIVE'),
  ('Ethanol',  'Renewable biofuel derived from plant materials, often blended with petrol', 'INACTIVE'),
  ('Hydrogen', 'Fuel cell technology using hydrogen gas for zero-emission power generation', 'INACTIVE');`;

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

export function FuelTypeDetail() {
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

  const item = fuelTypeMockData.find((ft) => ft.id === Number(id));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backendLangRef.current && !backendLangRef.current.contains(e.target as Node)) {
        setBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!item) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#fff7ed] flex items-center justify-center mx-auto mb-4">
            <Fuel className="w-6 h-6 text-[#ea580c]" />
          </div>
          <h2 className="text-[18px] text-[#0f172a] font-semibold mb-1.5">Fuel Type Not Found</h2>
          <p className="text-[13px] text-[#94a3b8] mb-5">The requested fuel type does not exist or has been deleted.</p>
          <button
            onClick={() => { sessionStorage.setItem("innotaxi_active_item", "Fuel Type"); navigate("/dashboard"); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] text-[#64748b] hover:text-[#0f172a] bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#cbd5e1] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: detailReactCode, vue: detailVueCode, angular: detailAngularCode }[codeFramework];
    }
    if (codeCategory === "database") return fuelTypeDatabaseSchema;
    return fuelTypeBackendCode[backendLang] || fuelTypeBackendCode.nestjs;
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "FuelTypeDetail.tsx", vue: "FuelTypeDetail.vue", angular: "fuel-type-detail.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") return "fuel_types.sql";
    return fuelTypeBackendFileConfig[backendLang] || fuelTypeBackendFileConfig.nestjs;
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

  const infoFields = [
    { label: "Fuel Type", value: item.fuelType, span: "col-span-12 md:col-span-4" },
    { label: "Status", value: item.status === "ACTIVE" ? "Active" : "Inactive", span: "col-span-12 md:col-span-4" },
    { label: "Created At", value: new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), span: "col-span-12 md:col-span-4" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-5">
        <button
          onClick={() => { sessionStorage.setItem("innotaxi_active_item", "Fuel Type"); navigate("/dashboard"); }}
          className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fuel Types
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#fff7ed] border border-[#fed7aa] flex items-center justify-center">
            <Fuel className="w-5 h-5 text-[#ea580c]" />
          </div>
          <div>
            <h1 className="text-[20px] text-[#0f172a] font-semibold">
              Fuel Type Detail
            </h1>
            <p className="text-[12px] text-[#94a3b8]">
              View fuel type record <span className="text-[#64748b] font-medium">#{item.id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Fuel Type Information Card */}
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
              <h3 className="text-[15px] text-[#0f172a] font-semibold">Fuel Type Information</h3>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">
                <span className="text-[#64748b] font-medium">{item.fuelType}</span>
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
                <h3 className="text-[13px] text-[#0f172a] font-semibold">Fuel Type Detail Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">GET /api/v1/fuel-types/:id</p>
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

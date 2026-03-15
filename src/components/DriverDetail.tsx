import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Highlight, themes } from "prism-react-renderer";
import { Users, ArrowLeft, Code2, Copy, Check, X, ChevronDown, Info, Database, KeyRound, UserCircle, CreditCard, ShieldAlert, CheckCircle, XCircle, Clock, AlertTriangle, Send, Layers, Smartphone, Mail } from "lucide-react";
import { motion } from "motion/react";
import { driverMockData, type Driver, type DriverStatus } from "./DriverList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";

// ── Frontend code templates ──
const detailReactCode = `// DriverDetail.tsx - PrimeReact + React Router
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Users, ArrowLeft } from "lucide-react";

export function DriverDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(\\\`/api/v1/drivers/\\\${id}\\\`)
      .then((res) => res.json())
      .then((data) => setItem(data.data));
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="min-h-full">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft /> Back to Drivers
      </button>
      <h1>Driver Detail</h1>
      <div className="bg-white rounded-xl border p-6">
        <div><label>Full Name</label><span>{item.fullName}</span></div>
        <div><label>Gender</label><span>{item.gender}</span></div>
        <div><label>Date of Birth</label><span>{item.dob}</span></div>
        <div><label>Phone</label><span>{item.phoneNumber}</span></div>
        <div><label>Email</label><span>{item.email}</span></div>
        <div><label>Status</label><span>{item.status}</span></div>
      </div>
    </div>
  );
}`;

const detailVueCode = `<!-- DriverDetail.vue - PrimeVue + Vue Router -->
<template>
  <div class="min-h-full">
    <button @click="router.back()">Back to Drivers</button>
    <h1>Driver Detail</h1>
    <div class="bg-white rounded-xl border p-6" v-if="item">
      <div><label>Full Name</label><span>{{ item.fullName }}</span></div>
      <div><label>Gender</label><span>{{ item.gender }}</span></div>
      <div><label>Date of Birth</label><span>{{ item.dob }}</span></div>
      <div><label>Phone</label><span>{{ item.phoneNumber }}</span></div>
      <div><label>Email</label><span>{{ item.email }}</span></div>
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
  const res = await fetch(\\\`/api/v1/drivers/\\\${route.params.id}\\\`);
  const data = await res.json();
  item.value = data.data;
});
</script>`;

const detailAngularCode = `// driver-detail.component.ts - PrimeNG + Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-driver-detail',
  template: \\\`
    <div class="min-h-full" *ngIf="item">
      <button (click)="goBack()">Back to Drivers</button>
      <h1>Driver Detail</h1>
      <div class="bg-white rounded-xl border p-6">
        <div><label>Full Name</label><span>{{ item.fullName }}</span></div>
        <div><label>Gender</label><span>{{ item.gender }}</span></div>
        <div><label>Date of Birth</label><span>{{ item.dob }}</span></div>
        <div><label>Phone</label><span>{{ item.phoneNumber }}</span></div>
        <div><label>Email</label><span>{{ item.email }}</span></div>
        <div><label>Status</label><span>{{ item.status }}</span></div>
      </div>
    </div>
  \\\`,
})
export class DriverDetailComponent implements OnInit {
  item: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(\\\`/api/v1/drivers/\\\${id}\\\`).subscribe((res: any) => {
      this.item = res.data;
    });
  }
  goBack() { this.router.navigate(['/dashboard']); }
}`;

// ── Backend code templates ──
const driverBackendCode: Record<string, string> = {
  nestjs: `// drivers.controller.ts - NestJS
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DriversService } from './drivers.service';

@Controller('api/v1/drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.driversService.findOne(id);
    return { success: true, data };
  }
}`,
  nodejs: `// drivers.routes.ts - Express
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/api/v1/drivers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM drivers WHERE id = $1', [id]);
  if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: result.rows[0] });
});

export default router;`,
  java: `// DriverController.java - Spring Boot
package com.innotaxi.controller;

import com.innotaxi.model.Driver;
import com.innotaxi.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/drivers")
public class DriverController {

    private final DriverService service;

    public DriverController(DriverService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> findOne(@PathVariable Long id) {
        Driver driver = service.findById(id);
        return ResponseEntity.ok(Map.of("success", true, "data", driver));
    }
}`,
  laravel: `<?php
// DriverController.php - Laravel
namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Driver;

class DriverController extends Controller
{
    public function show($id)
    {
        $driver = Driver::findOrFail($id);
        return response()->json(['success' => true, 'data' => $driver]);
    }
}`,
  python: `# views.py - Django REST Framework
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Driver
from .serializers import DriverSerializer

@api_view(['GET'])
def driver_detail(request, pk):
    try:
        driver = Driver.objects.get(pk=pk)
    except Driver.DoesNotExist:
        return Response({'success': False, 'message': 'Not found'}, status=404)
    serializer = DriverSerializer(driver)
    return Response({'success': True, 'data': serializer.data})`,
  csharp: `// DriversController.cs - ASP.NET Core
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/v1/drivers")]
public class DriversController : ControllerBase
{
    private readonly AppDbContext _context;

    public DriversController(AppDbContext context) => _context = context;

    [HttpGet("{id}")]
    public async Task<IActionResult> FindOne(int id)
    {
        var driver = await _context.Drivers.FindAsync(id);
        if (driver == null) return NotFound(new { success = false, message = "Not found" });
        return Ok(new { success = true, data = driver });
    }
}`,
  golang: `// drivers_handler.go - Go + Gin + GORM
package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type Driver struct {
    gorm.Model
    FullName    string
    Gender      string
    DOB         string
    PhoneNumber string
    Email       string
    Status      string
}

func GetDriver(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var driver Driver
        if err := db.First(&driver, c.Param("id")).Error; err != nil {
            c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Not found"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"success": true, "data": driver})
    }
}`,
  ruby: `# drivers_controller.rb - Ruby on Rails
class Api::V1::DriversController < ApplicationController
  def show
    driver = Driver.find(params[:id])
    render json: { success: true, data: driver }
  rescue ActiveRecord::RecordNotFound
    render json: { success: false, message: 'Not found' }, status: :not_found
  end
end`,
};

const driverBackendFileConfig: Record<string, string> = {
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
    gender        VARCHAR(10)   NOT NULL,                 -- MALE / FEMALE
    dob           DATE          NOT NULL,
    prefix        VARCHAR(10)   NOT NULL DEFAULT 'Mr.',
    phone_number  VARCHAR(30)   NOT NULL UNIQUE,
    email         VARCHAR(200)  NOT NULL UNIQUE,
    password      VARCHAR(255)  NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING',  -- ACTIVE / PENDING / INACTIVE / SUSPENDED
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_drivers_email ON drivers(email);
CREATE INDEX idx_drivers_phone ON drivers(phone_number);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_gender ON drivers(gender);

-- Check constraint for age >= 18
ALTER TABLE drivers ADD CONSTRAINT chk_driver_age
  CHECK (dob <= CURRENT_DATE - INTERVAL '18 years');`;

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

function formatDate(dateStr: string | null) {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function calculateAge(dob: string): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date("2026-03-14");
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

const statusStyles: Record<DriverStatus, { text: string; bg: string; dot: string }> = {
  ACTIVE: { text: "#16a34a", bg: "#f0fdf4", dot: "#22c55e" },
  PENDING: { text: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
  INACTIVE: { text: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" },
  SUSPENDED: { text: "#e53935", bg: "#fef2f2", dot: "#ef4444" },
};

const driverPhotoMale = "https://images.unsplash.com/photo-1615524376009-e7f29add6ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteWFubWFyJTIwYnVybWVzZSUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzczNTE3MDA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const driverPhotoFemale = "https://images.unsplash.com/photo-1516528033258-6d7a55bd7364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteWFubWFyJTIwYnVybWVzZSUyMHdvbWFuJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM1MTcwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function DriverDetail() {
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
  const [activeTab, setActiveTab] = useState<"account" | "profile" | "license" | "emergency">("account");
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: "APPROVE" | "REJECT" | "UNDER_REVIEW" | null }>({ open: false, action: null });
  const [notificationMessage, setNotificationMessage] = useState("");
  const [applyToAll, setApplyToAll] = useState(false);
  const [successToasts, setSuccessToasts] = useState<{ id: number; title: string; description: string; color: string }[]>([]);
  const [deliverViaNoti, setDeliverViaNoti] = useState(true);
  const [deliverViaEmail, setDeliverViaEmail] = useState(true);

  const item = driverMockData.find((d) => d.id === Number(id));

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
            <Users className="w-6 h-6 text-[#e53935]" />
          </div>
          <h2 className="text-[18px] text-[#0f172a] font-semibold mb-1.5">Driver Not Found</h2>
          <p className="text-[13px] text-[#94a3b8] mb-5">The requested driver does not exist or has been deleted.</p>
          <button
            onClick={() => { sessionStorage.setItem("innotaxi_active_item", "Drivers"); navigate("/dashboard"); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] text-[#64748b] hover:text-[#0f172a] bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#cbd5e1] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const s = statusStyles[item.status];

  // Code preview helpers
  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: detailReactCode, vue: detailVueCode, angular: detailAngularCode }[codeFramework];
    }
    if (codeCategory === "database") {
      return driverDatabaseSchema;
    }
    return driverBackendCode[backendLang] || driverBackendCode.nestjs;
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "DriverDetail.tsx", vue: "DriverDetail.vue", angular: "driver-detail.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") {
      return "drivers.sql";
    }
    return driverBackendFileConfig[backendLang] || driverBackendFileConfig.nestjs;
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

  // Read-only info fields - 3 column layout like Blood Type
  const infoFields = [
    { label: "Full Name", value: item.fullName },
    { label: "Gender", value: item.gender === "MALE" ? "Male" : "Female" },
    { label: "Date of Birth", value: `${formatDate(item.dob)} (${calculateAge(item.dob)} yrs)` },
    { label: "Phone Number", value: item.phoneNumber },
    { label: "Email", value: item.email },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-5">
        <button
          onClick={() => { sessionStorage.setItem("innotaxi_active_item", "Drivers"); navigate("/dashboard"); }}
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
              Driver Detail
            </h1>
            <p className="text-[12px] text-[#94a3b8]">
              View driver record <span className="text-[#64748b] font-medium">#{item.id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-5 flex items-center gap-2.5 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ color: s.text, backgroundColor: s.bg }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
          {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
        </span>
        <span className="text-[11px] text-[#94a3b8]">ID: {item.id}</span>
        <span className="w-px h-3.5 bg-[#e2e8f0]" />
        <span className="inline-flex items-center gap-1 text-[11px] text-[#94a3b8]">
          <span className="w-4 h-4 rounded bg-[#f0fdf4] flex items-center justify-center text-[9px] text-[#22c55e] font-semibold">+</span>
          {formatDate(item.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-[#94a3b8]">
          <span className="w-4 h-4 rounded bg-[#eff6ff] flex items-center justify-center text-[9px] text-[#3b82f6] font-semibold">~</span>
          {formatDate(item.updatedAt)}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-[#94a3b8]">
          <span className="w-4 h-4 rounded bg-[#fef2f2] flex items-center justify-center text-[9px] text-[#ef4444] font-semibold">&times;</span>
          {item.deletedAt ? formatDate(item.deletedAt) : "\u2014"}
        </span>
      </div>

      {/* Driver Information Card */}
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
              <h3 className="text-[15px] text-[#0f172a] font-semibold">Driver Information</h3>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">
                <span className="text-[#64748b] font-medium">{item.fullName}</span>
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

        {/* Segment Tabs */}
        <div className="px-6 border-b border-[#e2e8f0] bg-white">
          <div className="flex items-center gap-0">
            {([
              { key: "account" as const, label: "Driver Account", icon: KeyRound, color: "#6366f1" },
              { key: "profile" as const, label: "Profile", icon: UserCircle, color: "#3b82f6" },
              { key: "license" as const, label: "Driver License", icon: CreditCard, color: "#f59e0b" },
              { key: "emergency" as const, label: "Emergency", icon: ShieldAlert, color: "#ef4444" },
            ]).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-[12px] transition-all cursor-pointer relative ${
                    isActive
                      ? "text-[#0f172a] font-semibold"
                      : "text-[#94a3b8] hover:text-[#64748b]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isActive ? tab.color : undefined }} />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full" style={{ backgroundColor: tab.color }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "account" && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <label className="text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">Status</label>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#f0fdf4] text-[#16a34a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  APPROVE
                </span>
              </div>
              <div className="flex gap-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="w-[120px] h-[120px] rounded-xl overflow-hidden border-2 border-[#e2e8f0] shadow-sm">
                    <img
                      src={item.gender === "FEMALE" ? driverPhotoFemale : driverPhotoMale}
                      alt={item.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Info Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
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
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <label className="text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">Status</label>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#fffbeb] text-[#d97706]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                  UNDER_REVIEW
                </span>
              </div>
              <div className="flex gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-[120px] h-[120px] rounded-xl overflow-hidden border-2 border-[#e2e8f0] shadow-sm">
                    <img
                      src={item.gender === "FEMALE" ? driverPhotoFemale : driverPhotoMale}
                      alt={item.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                </div>
                {/* Info Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  {[
                    { label: "Current Address", value: "No. 45, Pyay Road, Kamayut Township" },
                    { label: "Region / State", value: "Yangon Region" },
                    { label: "City", value: "Yangon" },
                    { label: "Township", value: "Kamayut" },
                    { label: "Postal Code", value: "11041" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                        {field.label}
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#f1f5f9] text-[13px] text-[#0f172a]">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "license" && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <label className="text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">Status</label>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#fef2f2] text-[#e53935]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                  REJECT
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                {[
                  { label: "Name", value: item.fullName },
                  { label: "License Type", value: "THA" },
                  { label: "License Number", value: "DL-2024-00" + item.id },
                  { label: "Date of Birth", value: item.dob },
                  { label: "NRC", value: "12/ThaGaKa(N)" + String(item.id).padStart(6, "0") },
                  { label: "Blood Type", value: "O+" },
                  { label: "License Terms", value: "5 Years" },
                  { label: "Issue Date", value: "2024-01-15" },
                  { label: "Expired At", value: "2029-01-15" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                      {field.label}
                    </label>
                    <div className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#f1f5f9] text-[13px] text-[#0f172a]">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
              {/* License Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-2">
                    License Front Image
                  </label>
                  <div className="rounded-xl overflow-hidden border-2 border-[#e2e8f0] shadow-sm aspect-[16/10] bg-[#f8fafc]">
                    <img
                      src="https://images.unsplash.com/photo-1613826488523-b537c0cab318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcml2ZXIlMjBsaWNlbnNlJTIwY2FyZCUyMGZyb250JTIwZG9jdW1lbnR8ZW58MXx8fHwxNzczNTMyMDA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="License Front"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-2">
                    License Back Image
                  </label>
                  <div className="rounded-xl overflow-hidden border-2 border-[#e2e8f0] shadow-sm aspect-[16/10] bg-[#f8fafc]">
                    <img
                      src="https://images.unsplash.com/photo-1609863528474-be5232027f63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGVudGlmaWNhdGlvbiUyMGNhcmQlMjBiYWNrJTIwYmFyY29kZSUyMGRvY3VtZW50fGVufDF8fHx8MTc3MzUzMjAwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="License Back"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "emergency" && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <label className="text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium">Status</label>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#f0fdf4] text-[#16a34a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  APPROVE
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                {[
                  { label: "Contact Name", value: "Daw Khin Mar" },
                  { label: "Relationship", value: "Mother" },
                  { label: "Contact Phone", value: "+95 9 876 543 210" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
                      {field.label}
                    </label>
                    <div className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#f1f5f9] text-[13px] text-[#0f172a]">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        {activeTab !== "account" && (
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
        )}
      </motion.div>

      {/* Confirm Status Dialog */}
      <Dialog
        visible={confirmDialog.open}
        onHide={() => { setConfirmDialog({ open: false, action: null }); setNotificationMessage(""); setApplyToAll(false); }}
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
          const actionConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string; hoverBg: string; iconBg: string; headerBg: string; placeholder: string }> = {
            UNDER_REVIEW: {
              label: "Under Review",
              icon: <Clock className="w-5 h-5 text-[#d97706]" />,
              color: "#92400e",
              bg: "#fffbeb",
              border: "#fde68a",
              hoverBg: "#fef3c7",
              iconBg: "#fef3c7",
              headerBg: "from-[#fffbeb] to-[#fef3c7]",
              placeholder: "Add a note about why this section is under review...",
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
              placeholder: "Explain the reason for rejection...",
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
              placeholder: "Add an optional approval note...",
            },
          };
          const cfg = actionConfig[confirmDialog.action || "UNDER_REVIEW"];
          const tabLabels: Record<string, string> = {
            profile: "Profile",
            license: "Driver License",
            emergency: "Emergency",
          };
          const currentTabLabel = tabLabels[activeTab] || activeTab;

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
                      {currentTabLabel} section &middot; Driver #{item.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setConfirmDialog({ open: false, action: null }); setNotificationMessage(""); setApplyToAll(false); }}
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
                      ? `Are you sure you want to approve the ${currentTabLabel} section for ${item.fullName}?`
                      : confirmDialog.action === "REJECT"
                      ? `Are you sure you want to reject the ${currentTabLabel} section for ${item.fullName}? The driver will be notified.`
                      : `Are you sure you want to set the ${currentTabLabel} section for ${item.fullName} to Under Review?`}
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
                        ? `Dear ${item.fullName},\n\nYour ${currentTabLabel} section has been approved. You are now cleared to proceed.\n\nThank you,\nInnoTaxi Admin Team`
                        : confirmDialog.action === "REJECT"
                        ? `Dear ${item.fullName},\n\nYour ${currentTabLabel} section has been rejected. Please review the following issues and resubmit:\n\n- [Reason for rejection]\n\nPlease update your information at your earliest convenience.\n\nThank you,\nInnoTaxi Admin Team`
                        : `Dear ${item.fullName},\n\nYour ${currentTabLabel} section is currently under review. Our team is verifying your submitted information.\n\nYou will be notified once the review is complete.\n\nThank you,\nInnoTaxi Admin Team`
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
                    <span className="text-[10px] text-[#94a3b8] ml-auto">{item.email}</span>
                  </div>
                </div>

                {/* Apply to All Sections Checkbox */}
                
              </div>

              {/* Dialog Footer */}
              <div className="px-5 py-3.5 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-end gap-2">
                <button
                  onClick={() => { setConfirmDialog({ open: false, action: null }); setNotificationMessage(""); setApplyToAll(false); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-[#64748b] bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const action = confirmDialog.action || "UNDER_REVIEW";
                    const actionLabels: Record<string, string> = { APPROVE: "Approved", REJECT: "Rejected", UNDER_REVIEW: "Set to Under Review" };
                    const scopeLabel = applyToAll ? "all sections" : currentTabLabel;
                    const toastColors: Record<string, string> = { APPROVE: "#16a34a", REJECT: "#dc2626", UNDER_REVIEW: "#d97706" };
                    const toastBgs: Record<string, string> = { APPROVE: "#f0fdf4", REJECT: "#fef2f2", UNDER_REVIEW: "#fffbeb" };
                    const newToast = {
                      id: Date.now(),
                      title: `${actionLabels[action]}`,
                      description: `${item.fullName}'s ${scopeLabel} has been ${actionLabels[action].toLowerCase()}.${notificationMessage ? " Notification sent." : ""}`,
                      color: toastColors[action],
                      bg: toastBgs[action],
                    };
                    setSuccessToasts((prev) => [...prev, newToast]);
                    setTimeout(() => setSuccessToasts((prev) => prev.filter((t) => t.id !== newToast.id)), 4000);
                    setConfirmDialog({ open: false, action: null });
                    setNotificationMessage("");
                    setApplyToAll(false);
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
                <h3 className="text-[13px] text-[#0f172a] font-semibold">Driver Detail Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">GET /api/v1/drivers/:id</p>
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
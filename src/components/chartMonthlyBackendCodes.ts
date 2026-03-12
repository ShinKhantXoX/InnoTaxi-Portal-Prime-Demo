// Backend & frontend code samples for Monthly Driver Count chart code preview
// API: GET /api/v1/license-types/:id/monthly-drivers?year=2026
import type { BackendLang } from "./chartBackendCodes";

const BT = String.fromCharCode(96);

export const monthlyChartBackendFileConfig: Record<BackendLang, { file: string; language: string }> = {
  nestjs: { file: "monthly-driver.controller.ts", language: "typescript" },
  nodejs: { file: "monthlyDriver.js", language: "javascript" },
  java: { file: "MonthlyDriverController.java", language: "java" },
  laravel: { file: "MonthlyDriverController.php", language: "php" },
  csharp: { file: "MonthlyDriverController.cs", language: "csharp" },
  python: { file: "monthly_driver.py", language: "python" },
  golang: { file: "monthly_driver_handler.go", language: "go" },
  ruby: { file: "monthly_drivers_controller.rb", language: "ruby" },
};

export function getMonthlyChartBackendCode(lang: BackendLang): string {
  const codes: Record<BackendLang, string> = {
    nestjs: `// monthly-driver.controller.ts — NestJS + TypeORM (best performance)
import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { LicenseType } from './entities/license-type.entity';
import { Driver } from './entities/driver.entity';

@Controller('api/v1/license-types')
export class MonthlyDriverController {
  constructor(
    @InjectRepository(LicenseType)
    private readonly ltRepo: Repository<LicenseType>,
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
  ) {}

  // GET /api/v1/license-types/:id/monthly-drivers?year=2026
  @Get(':id/monthly-drivers')
  async getMonthlyDrivers(
    @Param('id') id: number,
    @Query('year') year: number = new Date().getFullYear(),
  ) {
    const licenseType = await this.ltRepo.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!licenseType) throw new NotFoundException('License type not found');

    const results = await this.driverRepo.query(\`
      SELECT
        MONTH(d.created_at) AS month_num,
        DATE_FORMAT(d.created_at, '%b') AS month,
        SUM(CASE WHEN d.status = 'ACTIVE' THEN 1 ELSE 0 END)    AS active,
        SUM(CASE WHEN d.status = 'PENDING' THEN 1 ELSE 0 END)   AS pending,
        SUM(CASE WHEN d.status = 'SUSPENDED' THEN 1 ELSE 0 END) AS suspended,
        SUM(CASE WHEN d.status = 'INACTIVE' THEN 1 ELSE 0 END)  AS inactive
      FROM drivers d
      WHERE d.license_type_id = ?
        AND YEAR(d.created_at) = ?
        AND d.deleted_at IS NULL
      GROUP BY month_num, month
      ORDER BY month_num ASC
    \`, [id, year]);

    return {
      success: true,
      data: {
        licenseType: { id: licenseType.id, code: licenseType.code, name: licenseType.name },
        year,
        monthly: results.map((r: any) => ({
          month: r.month,
          active: Number(r.active),
          pending: Number(r.pending),
          suspended: Number(r.suspended),
          inactive: Number(r.inactive),
        })),
      },
      meta: { generatedAt: new Date().toISOString() },
    };
  }
}`,

    nodejs: `// monthlyDriver.js — Node.js + Prisma (best performance)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/v1/license-types/:id/monthly-drivers?year=2026
async function getMonthlyDrivers(req, res) {
  const { id } = req.params;
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const licenseType = await prisma.licenseType.findFirst({
    where: { id: parseInt(id), deletedAt: null },
  });
  if (!licenseType) {
    return res.status(404).json({ success: false, message: 'License type not found' });
  }

  const results = await prisma.$queryRaw\`
    SELECT
      MONTH(d.created_at) AS month_num,
      DATE_FORMAT(d.created_at, '%b') AS month,
      SUM(CASE WHEN d.status = 'ACTIVE' THEN 1 ELSE 0 END)    AS active,
      SUM(CASE WHEN d.status = 'PENDING' THEN 1 ELSE 0 END)   AS pending,
      SUM(CASE WHEN d.status = 'SUSPENDED' THEN 1 ELSE 0 END) AS suspended,
      SUM(CASE WHEN d.status = 'INACTIVE' THEN 1 ELSE 0 END)  AS inactive
    FROM drivers d
    WHERE d.license_type_id = \${parseInt(id)}
      AND YEAR(d.created_at) = \${year}
      AND d.deleted_at IS NULL
    GROUP BY month_num, month
    ORDER BY month_num ASC
  \`;

  res.json({
    success: true,
    data: {
      licenseType: { id: licenseType.id, code: licenseType.code, name: licenseType.name },
      year,
      monthly: results.map((r) => ({
        month: r.month,
        active: Number(r.active),
        pending: Number(r.pending),
        suspended: Number(r.suspended),
        inactive: Number(r.inactive),
      })),
    },
    meta: { generatedAt: new Date().toISOString() },
  });
}

module.exports = { getMonthlyDrivers };`,

    java: `// MonthlyDriverController.java — Spring Boot + JPA (best performance)
package com.innotaxi.api.controller;

import com.innotaxi.api.repository.MonthlyDriverRepository;
import com.innotaxi.api.repository.LicenseTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.*;

@RestController
@RequestMapping("/api/v1/license-types")
@RequiredArgsConstructor
public class MonthlyDriverController {
    private final MonthlyDriverRepository driverRepo;
    private final LicenseTypeRepository ltRepo;

    // GET /api/v1/license-types/{id}/monthly-drivers?year=2026
    @GetMapping("/{id}/monthly-drivers")
    public ResponseEntity<?> getMonthlyDrivers(
            @PathVariable Long id,
            @RequestParam(defaultValue = "") Integer year) {
        if (year == null) year = Year.now().getValue();

        var licenseType = ltRepo.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new RuntimeException("License type not found"));

        var results = driverRepo.findMonthlyDrivers(id, year);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", Map.of(
                "licenseType", Map.of(
                    "id", licenseType.getId(),
                    "code", licenseType.getCode(),
                    "name", licenseType.getName()),
                "year", year,
                "monthly", results),
            "meta", Map.of(
                "generatedAt", java.time.Instant.now().toString())
        ));
    }
}

// MonthlyDriverRepository.java — Native query
package com.innotaxi.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MonthlyDriverRepository
        extends JpaRepository<Driver, Long> {

    @Query(value = """
        SELECT
            MONTH(d.created_at) AS monthNum,
            DATE_FORMAT(d.created_at, '%b') AS month,
            SUM(CASE WHEN d.status = 'ACTIVE' THEN 1 ELSE 0 END)    AS active,
            SUM(CASE WHEN d.status = 'PENDING' THEN 1 ELSE 0 END)   AS pending,
            SUM(CASE WHEN d.status = 'SUSPENDED' THEN 1 ELSE 0 END) AS suspended,
            SUM(CASE WHEN d.status = 'INACTIVE' THEN 1 ELSE 0 END)  AS inactive
        FROM drivers d
        WHERE d.license_type_id = :id
          AND YEAR(d.created_at) = :year
          AND d.deleted_at IS NULL
        GROUP BY monthNum, month
        ORDER BY monthNum ASC
        """, nativeQuery = true)
    List<Object[]> findMonthlyDrivers(
        @Param("id") Long id, @Param("year") int year);
}`,

    laravel: `<?php
// MonthlyDriverController.php — Laravel + Eloquent (best performance)
namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use App\\Models\\LicenseType;

class MonthlyDriverController extends Controller
{
    // GET /api/v1/license-types/{id}/monthly-drivers?year=2026
    public function monthlyDrivers(Request $request, int $id): JsonResponse
    {
        $year = (int) $request->query('year', date('Y'));

        $licenseType = LicenseType::whereNull('deleted_at')
            ->findOrFail($id);

        $results = DB::table('drivers as d')
            ->select(
                DB::raw("MONTH(d.created_at) as month_num"),
                DB::raw("DATE_FORMAT(d.created_at, '%b') as month"),
                DB::raw("SUM(CASE WHEN d.status = 'ACTIVE' THEN 1 ELSE 0 END) as active"),
                DB::raw("SUM(CASE WHEN d.status = 'PENDING' THEN 1 ELSE 0 END) as pending"),
                DB::raw("SUM(CASE WHEN d.status = 'SUSPENDED' THEN 1 ELSE 0 END) as suspended"),
                DB::raw("SUM(CASE WHEN d.status = 'INACTIVE' THEN 1 ELSE 0 END) as inactive")
            )
            ->where('d.license_type_id', $id)
            ->whereRaw('YEAR(d.created_at) = ?', [$year])
            ->whereNull('d.deleted_at')
            ->groupBy('month_num', 'month')
            ->orderBy('month_num')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'licenseType' => [
                    'id' => $licenseType->id,
                    'code' => $licenseType->code,
                    'name' => $licenseType->name,
                ],
                'year' => $year,
                'monthly' => $results->map(fn ($r) => [
                    'month' => $r->month,
                    'active' => (int) $r->active,
                    'pending' => (int) $r->pending,
                    'suspended' => (int) $r->suspended,
                    'inactive' => (int) $r->inactive,
                ]),
            ],
            'meta' => ['generatedAt' => now()->toISOString()],
        ]);
    }
}`,

    csharp: `// MonthlyDriverController.cs — ASP.NET Core + EF Core (best performance)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InnoTaxi.Api.Controllers;

[ApiController]
[Route("api/v1/license-types")]
public class MonthlyDriverController : ControllerBase
{
    private readonly AppDbContext _db;
    public MonthlyDriverController(AppDbContext db) => _db = db;

    // GET /api/v1/license-types/{id}/monthly-drivers?year=2026
    [HttpGet("{id}/monthly-drivers")]
    public async Task<IActionResult> GetMonthlyDrivers(
        int id, [FromQuery] int? year = null)
    {
        var y = year ?? DateTime.UtcNow.Year;

        var licenseType = await _db.LicenseTypes
            .FirstOrDefaultAsync(lt => lt.Id == id && lt.DeletedAt == null);
        if (licenseType == null)
            return NotFound(new { success = false, message = "License type not found" });

        var results = await _db.Drivers
            .Where(d => d.LicenseTypeId == id
                     && d.CreatedAt.Year == y
                     && d.DeletedAt == null)
            .GroupBy(d => new { d.CreatedAt.Month })
            .OrderBy(g => g.Key.Month)
            .Select(g => new {
                MonthNum = g.Key.Month,
                Active    = g.Count(d => d.Status == "ACTIVE"),
                Pending   = g.Count(d => d.Status == "PENDING"),
                Suspended = g.Count(d => d.Status == "SUSPENDED"),
                Inactive  = g.Count(d => d.Status == "INACTIVE"),
            })
            .ToListAsync();

        var monthNames = new[] { "", "Jan", "Feb", "Mar", "Apr", "May",
            "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

        return Ok(new {
            success = true,
            data = new {
                licenseType = new { licenseType.Id, licenseType.Code, licenseType.Name },
                year = y,
                monthly = results.Select(r => new {
                    month = monthNames[r.MonthNum],
                    r.Active, r.Pending, r.Suspended, r.Inactive,
                }),
            },
            meta = new { generatedAt = DateTime.UtcNow.ToString("o") },
        });
    }
}`,

    python: `# monthly_driver.py — FastAPI + SQLAlchemy (best performance)
from datetime import datetime
from fastapi import APIRouter, Path, Query, Depends, HTTPException
from sqlalchemy import func, case, extract, text
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Driver, LicenseType

router = APIRouter(prefix="/api/v1/license-types")


@router.get("/{id}/monthly-drivers")
async def get_monthly_drivers(
    id: int = Path(...),
    year: int = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    if year is None:
        year = datetime.utcnow().year

    license_type = await db.get(LicenseType, id)
    if not license_type or license_type.deleted_at is not None:
        raise HTTPException(404, "License type not found")

    query = (
        db.query(
            extract("month", Driver.created_at).label("month_num"),
            func.date_format(
                Driver.created_at, "%b"
            ).label("month"),
            func.sum(case(
                (Driver.status == "ACTIVE", 1), else_=0
            )).label("active"),
            func.sum(case(
                (Driver.status == "PENDING", 1), else_=0
            )).label("pending"),
            func.sum(case(
                (Driver.status == "SUSPENDED", 1), else_=0
            )).label("suspended"),
            func.sum(case(
                (Driver.status == "INACTIVE", 1), else_=0
            )).label("inactive"),
        )
        .filter(
            Driver.license_type_id == id,
            extract("year", Driver.created_at) == year,
            Driver.deleted_at.is_(None),
        )
        .group_by("month_num", "month")
        .order_by(text("month_num ASC"))
    )

    results = (await db.execute(query)).all()

    return {
        "success": True,
        "data": {
            "licenseType": {
                "id": license_type.id,
                "code": license_type.code,
                "name": license_type.name,
            },
            "year": year,
            "monthly": [
                {
                    "month": r.month,
                    "active": r.active,
                    "pending": r.pending,
                    "suspended": r.suspended,
                    "inactive": r.inactive,
                }
                for r in results
            ],
        },
        "meta": {"generatedAt": datetime.utcnow().isoformat()},
    }`,

    golang: [
      "// monthly_driver_handler.go \u2014 Go + GORM (best performance)",
      "package handler",
      "",
      "import (",
      '    "net/http"',
      '    "strconv"',
      '    "time"',
      "",
      '    "github.com/gin-gonic/gin"',
      '    "gorm.io/gorm"',
      ")",
      "",
      "type MonthlyDriverHandler struct {",
      "    DB *gorm.DB",
      "}",
      "",
      "type MonthlyRow struct {",
      "    Month     string " + BT + 'json:"month"' + BT,
      "    Active    int    " + BT + 'json:"active"' + BT,
      "    Pending   int    " + BT + 'json:"pending"' + BT,
      "    Suspended int    " + BT + 'json:"suspended"' + BT,
      "    Inactive  int    " + BT + 'json:"inactive"' + BT,
      "}",
      "",
      "// GET /api/v1/license-types/:id/monthly-drivers?year=2026",
      "func (h *MonthlyDriverHandler) GetMonthlyDrivers(c *gin.Context) {",
      '    id := c.Param("id")',
      '    yearStr := c.DefaultQuery("year", strconv.Itoa(time.Now().Year()))',
      "    year, _ := strconv.Atoi(yearStr)",
      "",
      "    var lt LicenseType",
      '    if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&lt).Error; err != nil {',
      "        c.JSON(http.StatusNotFound, gin.H{",
      '            "success": false,',
      '            "message": "License type not found",',
      "        })",
      "        return",
      "    }",
      "",
      "    var results []MonthlyRow",
      "    h.DB.Raw(" + BT,
      "        SELECT",
      "            DATE_FORMAT(d.created_at, '%b') AS month,",
      "            SUM(CASE WHEN d.status = 'ACTIVE' THEN 1 ELSE 0 END)    AS active,",
      "            SUM(CASE WHEN d.status = 'PENDING' THEN 1 ELSE 0 END)   AS pending,",
      "            SUM(CASE WHEN d.status = 'SUSPENDED' THEN 1 ELSE 0 END) AS suspended,",
      "            SUM(CASE WHEN d.status = 'INACTIVE' THEN 1 ELSE 0 END)  AS inactive",
      "        FROM drivers d",
      "        WHERE d.license_type_id = ?",
      "          AND YEAR(d.created_at) = ?",
      "          AND d.deleted_at IS NULL",
      "        GROUP BY MONTH(d.created_at), month",
      "        ORDER BY MONTH(d.created_at) ASC",
      "    " + BT + ", id, year).Scan(&results)",
      "",
      "    c.JSON(http.StatusOK, gin.H{",
      '        "success": true,',
      '        "data": gin.H{',
      '            "licenseType": gin.H{',
      '                "id": lt.ID, "code": lt.Code, "name": lt.Name,',
      "            },",
      '            "year":    year,',
      '            "monthly": results,',
      "        },",
      '        "meta": gin.H{',
      '            "generatedAt": time.Now().Format(time.RFC3339),',
      "        },",
      "    })",
      "}",
    ].join("\n"),

    ruby: `# monthly_drivers_controller.rb — Rails (best performance)
class Api::V1::MonthlyDriversController < ApplicationController
  # GET /api/v1/license-types/:id/monthly-drivers?year=2026
  def index
    license_type = LicenseType
      .where(deleted_at: nil)
      .find(params[:id])

    year = (params[:year] || Time.current.year).to_i

    results = Driver
      .where(license_type_id: params[:id])
      .where("YEAR(created_at) = ?", year)
      .where(deleted_at: nil)
      .group("MONTH(created_at)")
      .order("MONTH(created_at) ASC")
      .select(
        "DATE_FORMAT(created_at, '%b') AS month",
        "SUM(CASE WHEN status = 'ACTIVE' " \\
          "THEN 1 ELSE 0 END) AS active",
        "SUM(CASE WHEN status = 'PENDING' " \\
          "THEN 1 ELSE 0 END) AS pending",
        "SUM(CASE WHEN status = 'SUSPENDED' " \\
          "THEN 1 ELSE 0 END) AS suspended",
        "SUM(CASE WHEN status = 'INACTIVE' " \\
          "THEN 1 ELSE 0 END) AS inactive"
      )

    render json: {
      success: true,
      data: {
        license_type: {
          id: license_type.id,
          code: license_type.code,
          name: license_type.name
        },
        year: year,
        monthly: results.map { |r|
          {
            month:     r.month,
            active:    r.active.to_i,
            pending:   r.pending.to_i,
            suspended: r.suspended.to_i,
            inactive:  r.inactive.to_i
          }
        }
      },
      meta: { generated_at: Time.current.iso8601 }
    }
  end
end`,
  };

  return codes[lang];
}

// Frontend code strings for the Monthly Driver Count chart
export const monthlyChartReactCode = `// MonthlyDriverChart.tsx — PrimeReact + Recharts
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  active: number;
  pending: number;
  suspended: number;
  inactive: number;
}

interface Props {
  licenseTypeId: number;
  year?: number;
}

export function MonthlyDriverChart({ licenseTypeId, year = new Date().getFullYear() }: Props) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(\`/api/v1/license-types/\${licenseTypeId}/monthly-drivers?year=\${year}\`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data.monthly);
      })
      .finally(() => setLoading(false));
  }, [licenseTypeId, year]);

  if (loading) return <div className="h-[300px] animate-pulse bg-gray-100 rounded-lg" />;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} />
          <Line type="monotone" dataKey="active" name="ACTIVE" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="pending" name="PENDING" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="suspended" name="SUSPENDED" stroke="#e53935" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="inactive" name="INACTIVE" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}`;

export const monthlyChartVueCode = `<!-- MonthlyDriverChart.vue — PrimeVue + ECharts -->
<template>
  <div class="h-[300px]">
    <div v-if="loading" class="h-full animate-pulse bg-gray-100 rounded-lg" />
    <v-chart v-else :option="chartOption" autoresize class="h-full w-full" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import VChart from 'vue-echarts';

const props = withDefaults(
  defineProps<{ licenseTypeId: number; year?: number }>(),
  { year: () => new Date().getFullYear() }
);

interface MonthlyData {
  month: string;
  active: number;
  pending: number;
  suspended: number;
  inactive: number;
}

const data = ref<MonthlyData[]>([]);
const loading = ref(true);

async function fetchData() {
  loading.value = true;
  try {
    const res = await fetch(
      \`/api/v1/license-types/\${props.licenseTypeId}/monthly-drivers?year=\${props.year}\`
    );
    const json = await res.json();
    if (json.success) data.value = json.data.monthly;
  } finally {
    loading.value = false;
  }
}

const chartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE'], top: 0, right: 0 },
  grid: { top: 40, right: 10, bottom: 20, left: 40 },
  xAxis: { type: 'category', data: data.value.map(d => d.month), axisTick: { show: false } },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
  series: [
    { name: 'ACTIVE', type: 'line', data: data.value.map(d => d.active), smooth: true, itemStyle: { color: '#22c55e' } },
    { name: 'PENDING', type: 'line', data: data.value.map(d => d.pending), smooth: true, itemStyle: { color: '#f59e0b' } },
    { name: 'SUSPENDED', type: 'line', data: data.value.map(d => d.suspended), smooth: true, itemStyle: { color: '#e53935' } },
    { name: 'INACTIVE', type: 'line', data: data.value.map(d => d.inactive), smooth: true, itemStyle: { color: '#94a3b8' } },
  ],
}));

onMounted(fetchData);
watch(() => [props.licenseTypeId, props.year], fetchData);
</script>`;

export const monthlyChartAngularCode = `// monthly-driver-chart.component.ts — PrimeAngular + ngx-charts
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface MonthlyData {
  month: string;
  active: number;
  pending: number;
  suspended: number;
  inactive: number;
}

@Component({
  selector: 'app-monthly-driver-chart',
  template: \`
    <div class="h-[300px]" *ngIf="!loading; else skeleton">
      <ngx-charts-line-chart
        [results]="chartData"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="true"
        [legendTitle]="''"
        [showXAxisLabel]="false"
        [showYAxisLabel]="false"
        [customColors]="customColors"
        [autoScale]="true">
      </ngx-charts-line-chart>
    </div>
    <ng-template #skeleton>
      <div class="h-[300px] animate-pulse bg-gray-100 rounded-lg"></div>
    </ng-template>
  \`,
})
export class MonthlyDriverChartComponent implements OnInit, OnChanges {
  @Input() licenseTypeId!: number;
  @Input() year: number = new Date().getFullYear();

  loading = true;
  chartData: any[] = [];

  customColors = [
    { name: 'ACTIVE', value: '#22c55e' },
    { name: 'PENDING', value: '#f59e0b' },
    { name: 'SUSPENDED', value: '#e53935' },
    { name: 'INACTIVE', value: '#94a3b8' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() { this.fetchData(); }
  ngOnChanges() { this.fetchData(); }

  private fetchData() {
    this.loading = true;
    const url = \`/api/v1/license-types/\${this.licenseTypeId}/monthly-drivers?year=\${this.year}\`;
    this.http.get<any>(url).subscribe({
      next: (json) => {
        if (json.success) this.transformData(json.data.monthly);
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  private transformData(monthly: MonthlyData[]) {
    const series = ['active', 'pending', 'suspended', 'inactive'];
    this.chartData = series.map(key => ({
      name: key.toUpperCase(),
      series: monthly.map(m => ({ name: m.month, value: (m as any)[key] })),
    }));
  }
}`;

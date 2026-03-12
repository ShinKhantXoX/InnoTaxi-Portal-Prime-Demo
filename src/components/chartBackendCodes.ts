// Backend language configurations and code samples for chart code preview
const BT = String.fromCharCode(96); // backtick character for Go code

export type BackendLang = "nestjs" | "nodejs" | "java" | "laravel" | "csharp" | "python" | "golang" | "ruby";

export const backendLangConfig: Record<BackendLang, { label: string; icon: string; file: string; language: string }> = {
  nestjs: { label: "NestJS + TypeORM", icon: "\u2699\uFE0F", file: "license-type-stats.controller.ts", language: "typescript" },
  nodejs: { label: "Node.js + Prisma", icon: "\uD83D\uDFE2", file: "licenseTypeStats.js", language: "javascript" },
  java: { label: "Java + Spring Boot", icon: "\u2615", file: "LicenseTypeStatsController.java", language: "java" },
  laravel: { label: "Laravel + Eloquent", icon: "\uD83D\uDD34", file: "LicenseTypeStatsController.php", language: "php" },
  csharp: { label: "C# + EF Core", icon: "\uD83D\uDFE3", file: "LicenseTypeStatsController.cs", language: "csharp" },
  python: { label: "Python + FastAPI", icon: "\uD83D\uDC0D", file: "license_type_stats.py", language: "python" },
  golang: { label: "Go + GORM", icon: "\uD83D\uDD35", file: "license_type_handler.go", language: "go" },
  ruby: { label: "Ruby on Rails", icon: "\uD83D\uDC8E", file: "license_type_stats_controller.rb", language: "ruby" },
};

export const backendLangOptions: BackendLang[] = ["nestjs", "nodejs", "java", "laravel", "csharp", "python", "golang", "ruby"];

export function getChartBackendCode(lang: BackendLang, nestjsCode: string): string {
  const codes: Record<BackendLang, string> = {
    nestjs: nestjsCode,

    nodejs: `// licenseTypeStats.js — Node.js + Prisma (best performance)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/v1/license-types/driver-stats?months=6
async function getDriverCountByLicenseType(req, res) {
  const months = parseInt(req.query.months) || 6;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);

  const results = await prisma.$queryRaw\`
    SELECT
      lt.code, lt.name, lt.category,
      SUM(CASE WHEN d.status = 'ACTIVE' THEN 1 ELSE 0 END)    AS active,
      SUM(CASE WHEN d.status = 'PENDING' THEN 1 ELSE 0 END)   AS pending,
      SUM(CASE WHEN d.status = 'SUSPENDED' THEN 1 ELSE 0 END) AS suspended,
      SUM(CASE WHEN d.status = 'INACTIVE' THEN 1 ELSE 0 END)  AS inactive
    FROM drivers d
    INNER JOIN license_types lt ON lt.id = d.license_type_id
    WHERE d.created_at >= \${cutoff}
      AND d.deleted_at IS NULL
    GROUP BY lt.code, lt.name, lt.category
    ORDER BY active DESC
  \`;

  res.json({
    success: true,
    data: results.map((r) => ({
      code: r.code, name: r.name, category: r.category,
      active: Number(r.active), pending: Number(r.pending),
      suspended: Number(r.suspended), inactive: Number(r.inactive),
      total: Number(r.active) + Number(r.pending) + Number(r.suspended) + Number(r.inactive),
    })),
    meta: { period: \`Last \${months} months\`, generatedAt: new Date().toISOString() },
  });
}

// GET /api/v1/license-types/driver-stats/summary
async function getDriverStatsSummary(req, res) {
  const [totalActive, totalLicenseTypes, topType] = await Promise.all([
    prisma.driver.count({ where: { status: 'ACTIVE', deletedAt: null } }),
    prisma.licenseType.count({ where: { status: 'ACTIVE', deletedAt: null } }),
    prisma.$queryRaw\`
      SELECT lt.code, lt.name, COUNT(d.id) AS count
      FROM drivers d INNER JOIN license_types lt ON lt.id = d.license_type_id
      WHERE d.status = 'ACTIVE' AND d.deleted_at IS NULL
      GROUP BY lt.code, lt.name ORDER BY count DESC LIMIT 1
    \`,
  ]);

  res.json({
    success: true,
    data: {
      totalActiveDrivers: totalActive, totalLicenseTypes,
      topLicenseType: topType[0]
        ? { code: topType[0].code, name: topType[0].name, activeDrivers: Number(topType[0].count) }
        : null,
    },
  });
}

module.exports = { getDriverCountByLicenseType, getDriverStatsSummary };`,

    java: `// LicenseTypeStatsController.java — Spring Boot + JPA (best performance)
package com.innotaxi.api.controller;

import com.innotaxi.api.service.LicenseTypeStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/license-types")
@RequiredArgsConstructor
public class LicenseTypeStatsController {
    private final LicenseTypeStatsService statsService;

    @GetMapping("/driver-stats")
    public ResponseEntity<?> getDriverStats(
            @RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(
            statsService.getDriverCountByLicenseType(months));
    }

    @GetMapping("/driver-stats/summary")
    public ResponseEntity<?> getSummary() {
        return ResponseEntity.ok(statsService.getDriverStatsSummary());
    }
}

// LicenseTypeStatsRepository.java — Native query for best performance
package com.innotaxi.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface LicenseTypeStatsRepository
        extends JpaRepository<Driver, Long> {

    @Query(value = """
        SELECT lt.code, lt.name, lt.category,
            SUM(CASE WHEN d.status = 'ACTIVE' THEN 1 ELSE 0 END)    AS active,
            SUM(CASE WHEN d.status = 'PENDING' THEN 1 ELSE 0 END)   AS pending,
            SUM(CASE WHEN d.status = 'SUSPENDED' THEN 1 ELSE 0 END) AS suspended,
            SUM(CASE WHEN d.status = 'INACTIVE' THEN 1 ELSE 0 END)  AS inactive
        FROM drivers d
        INNER JOIN license_types lt ON lt.id = d.license_type_id
        WHERE d.created_at >= DATE_SUB(NOW(), INTERVAL :months MONTH)
          AND d.deleted_at IS NULL
        GROUP BY lt.code, lt.name, lt.category
        ORDER BY active DESC
        """, nativeQuery = true)
    List<Object[]> findDriverCountByLicenseType(
        @Param("months") int months);

    @Query(value = """
        SELECT lt.code, lt.name, COUNT(d.id) AS cnt
        FROM drivers d
        INNER JOIN license_types lt ON lt.id = d.license_type_id
        WHERE d.status = 'ACTIVE' AND d.deleted_at IS NULL
        GROUP BY lt.code, lt.name
        ORDER BY cnt DESC LIMIT 1
        """, nativeQuery = true)
    List<Object[]> findTopLicenseType();
}`,

    laravel: `<?php
// LicenseTypeStatsController.php — Laravel + Eloquent (best performance)
namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class LicenseTypeStatsController extends Controller
{
    // GET /api/v1/license-types/driver-stats?months=6
    public function driverStats(Request $request): JsonResponse
    {
        $months = (int) $request->query('months', 6);

        $results = DB::table('drivers as d')
            ->join('license_types as lt', 'lt.id', '=', 'd.license_type_id')
            ->select(
                'lt.code', 'lt.name', 'lt.category',
                DB::raw("SUM(CASE WHEN d.status = 'ACTIVE' THEN 1 ELSE 0 END) as active"),
                DB::raw("SUM(CASE WHEN d.status = 'PENDING' THEN 1 ELSE 0 END) as pending"),
                DB::raw("SUM(CASE WHEN d.status = 'SUSPENDED' THEN 1 ELSE 0 END) as suspended"),
                DB::raw("SUM(CASE WHEN d.status = 'INACTIVE' THEN 1 ELSE 0 END) as inactive")
            )
            ->whereRaw('d.created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)', [$months])
            ->whereNull('d.deleted_at')
            ->groupBy('lt.code', 'lt.name', 'lt.category')
            ->orderByDesc('active')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $results->map(fn ($r) => [
                'code' => $r->code, 'name' => $r->name,
                'category' => $r->category,
                'active' => (int) $r->active, 'pending' => (int) $r->pending,
                'suspended' => (int) $r->suspended,
                'inactive' => (int) $r->inactive,
                'total' => (int) $r->active + (int) $r->pending
                         + (int) $r->suspended + (int) $r->inactive,
            ]),
            'meta' => [
                'period' => "Last {$months} months",
                'generatedAt' => now()->toISOString(),
            ],
        ]);
    }

    // GET /api/v1/license-types/driver-stats/summary
    public function summary(): JsonResponse
    {
        $totalActive = DB::table('drivers')
            ->where('status', 'ACTIVE')
            ->whereNull('deleted_at')->count();

        $totalLicenseTypes = DB::table('license_types')
            ->where('status', 'ACTIVE')
            ->whereNull('deleted_at')->count();

        $topType = DB::table('drivers as d')
            ->join('license_types as lt', 'lt.id', '=', 'd.license_type_id')
            ->select('lt.code', 'lt.name', DB::raw('COUNT(d.id) as count'))
            ->where('d.status', 'ACTIVE')
            ->whereNull('d.deleted_at')
            ->groupBy('lt.code', 'lt.name')
            ->orderByDesc('count')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'totalActiveDrivers' => $totalActive,
                'totalLicenseTypes' => $totalLicenseTypes,
                'topLicenseType' => $topType
                    ? ['code' => $topType->code, 'name' => $topType->name,
                       'activeDrivers' => (int) $topType->count]
                    : null,
            ],
        ]);
    }
}`,

    csharp: `// LicenseTypeStatsController.cs — ASP.NET Core + EF Core (best performance)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InnoTaxi.Api.Controllers;

[ApiController]
[Route("api/v1/license-types")]
public class LicenseTypeStatsController : ControllerBase
{
    private readonly AppDbContext _db;
    public LicenseTypeStatsController(AppDbContext db) => _db = db;

    // GET /api/v1/license-types/driver-stats?months=6
    [HttpGet("driver-stats")]
    public async Task<IActionResult> GetDriverStats(
        [FromQuery] int months = 6)
    {
        var cutoff = DateTime.UtcNow.AddMonths(-months);

        var results = await _db.Drivers
            .Where(d => d.CreatedAt >= cutoff && d.DeletedAt == null)
            .Join(_db.LicenseTypes,
                  d => d.LicenseTypeId, lt => lt.Id,
                  (d, lt) => new { d.Status, lt.Code, lt.Name, lt.Category })
            .GroupBy(x => new { x.Code, x.Name, x.Category })
            .Select(g => new {
                g.Key.Code, g.Key.Name, g.Key.Category,
                Active    = g.Count(x => x.Status == "ACTIVE"),
                Pending   = g.Count(x => x.Status == "PENDING"),
                Suspended = g.Count(x => x.Status == "SUSPENDED"),
                Inactive  = g.Count(x => x.Status == "INACTIVE"),
            })
            .OrderByDescending(x => x.Active)
            .ToListAsync();

        return Ok(new {
            success = true,
            data = results.Select(r => new {
                r.Code, r.Name, r.Category,
                r.Active, r.Pending, r.Suspended, r.Inactive,
                Total = r.Active + r.Pending + r.Suspended + r.Inactive,
            }),
            meta = new {
                period = \$"Last {months} months",
                generatedAt = DateTime.UtcNow.ToString("o"),
            },
        });
    }

    // GET /api/v1/license-types/driver-stats/summary
    [HttpGet("driver-stats/summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalActive = await _db.Drivers
            .CountAsync(d => d.Status == "ACTIVE"
                          && d.DeletedAt == null);

        var totalLicenseTypes = await _db.LicenseTypes
            .CountAsync(lt => lt.Status == "ACTIVE"
                           && lt.DeletedAt == null);

        var topType = await _db.Drivers
            .Where(d => d.Status == "ACTIVE" && d.DeletedAt == null)
            .Join(_db.LicenseTypes,
                  d => d.LicenseTypeId, lt => lt.Id,
                  (d, lt) => new { lt.Code, lt.Name })
            .GroupBy(x => new { x.Code, x.Name })
            .Select(g => new {
                g.Key.Code, g.Key.Name, Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .FirstOrDefaultAsync();

        return Ok(new {
            success = true,
            data = new {
                totalActiveDrivers = totalActive,
                totalLicenseTypes,
                topLicenseType = topType != null
                    ? new { topType.Code, topType.Name,
                            activeDrivers = topType.Count }
                    : null,
            },
        });
    }
}`,

    python: `# license_type_stats.py — FastAPI + SQLAlchemy (best performance)
from datetime import datetime, timedelta
from fastapi import APIRouter, Query, Depends
from sqlalchemy import func, case, text
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Driver, LicenseType

router = APIRouter(prefix="/api/v1/license-types")


@router.get("/driver-stats")
async def get_driver_stats(
    months: int = Query(default=6, ge=1, le=24),
    db: AsyncSession = Depends(get_db),
):
    cutoff = datetime.utcnow() - timedelta(days=months * 30)

    query = (
        db.query(
            LicenseType.code,
            LicenseType.name,
            LicenseType.category,
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
        .join(LicenseType, LicenseType.id == Driver.license_type_id)
        .filter(
            Driver.created_at >= cutoff,
            Driver.deleted_at.is_(None),
        )
        .group_by(
            LicenseType.code,
            LicenseType.name,
            LicenseType.category,
        )
        .order_by(text("active DESC"))
    )

    results = (await db.execute(query)).all()

    return {
        "success": True,
        "data": [
            {
                "code": r.code,
                "name": r.name,
                "category": r.category,
                "active": r.active,
                "pending": r.pending,
                "suspended": r.suspended,
                "inactive": r.inactive,
                "total": r.active + r.pending
                       + r.suspended + r.inactive,
            }
            for r in results
        ],
        "meta": {
            "period": f"Last {months} months",
            "generatedAt": datetime.utcnow().isoformat(),
        },
    }


@router.get("/driver-stats/summary")
async def get_driver_stats_summary(
    db: AsyncSession = Depends(get_db),
):
    total_active = await db.scalar(
        db.query(func.count(Driver.id)).filter(
            Driver.status == "ACTIVE",
            Driver.deleted_at.is_(None),
        )
    )
    total_license_types = await db.scalar(
        db.query(func.count(LicenseType.id)).filter(
            LicenseType.status == "ACTIVE",
            LicenseType.deleted_at.is_(None),
        )
    )

    top_type = (
        await db.execute(
            db.query(
                LicenseType.code,
                LicenseType.name,
                func.count(Driver.id).label("count"),
            )
            .join(LicenseType,
                  LicenseType.id == Driver.license_type_id)
            .filter(
                Driver.status == "ACTIVE",
                Driver.deleted_at.is_(None),
            )
            .group_by(LicenseType.code, LicenseType.name)
            .order_by(text("count DESC"))
            .limit(1)
        )
    ).first()

    return {
        "success": True,
        "data": {
            "totalActiveDrivers": total_active,
            "totalLicenseTypes": total_license_types,
            "topLicenseType": {
                "code": top_type.code,
                "name": top_type.name,
                "activeDrivers": top_type.count,
            }
            if top_type
            else None,
        },
    }`,

    golang: [
      "// license_type_handler.go \u2014 Go + GORM (best performance)",
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
      "type LicenseTypeStatsHandler struct {",
      "    DB *gorm.DB",
      "}",
      "",
      "type DriverStatRow struct {",
      "    Code      string " + BT + 'json:"code"' + BT,
      "    Name      string " + BT + 'json:"name"' + BT,
      "    Category  string " + BT + 'json:"category"' + BT,
      "    Active    int    " + BT + 'json:"active"' + BT,
      "    Pending   int    " + BT + 'json:"pending"' + BT,
      "    Suspended int    " + BT + 'json:"suspended"' + BT,
      "    Inactive  int    " + BT + 'json:"inactive"' + BT,
      "    Total     int    " + BT + 'json:"total"' + BT,
      "}",
      "",
      "// GET /api/v1/license-types/driver-stats?months=6",
      "func (h *LicenseTypeStatsHandler) GetDriverStats(c *gin.Context) {",
      '    months, _ := strconv.Atoi(c.DefaultQuery("months", "6"))',
      "    cutoff := time.Now().AddDate(0, -months, 0)",
      "",
      "    var results []DriverStatRow",
      "    h.DB.Raw(" + BT,
      "        SELECT lt.code, lt.name, lt.category,",
      "            SUM(CASE WHEN d.status = 'ACTIVE' THEN 1 ELSE 0 END)    AS active,",
      "            SUM(CASE WHEN d.status = 'PENDING' THEN 1 ELSE 0 END)   AS pending,",
      "            SUM(CASE WHEN d.status = 'SUSPENDED' THEN 1 ELSE 0 END) AS suspended,",
      "            SUM(CASE WHEN d.status = 'INACTIVE' THEN 1 ELSE 0 END)  AS inactive,",
      "            COUNT(d.id) AS total",
      "        FROM drivers d",
      "        INNER JOIN license_types lt ON lt.id = d.license_type_id",
      "        WHERE d.created_at >= ?",
      "          AND d.deleted_at IS NULL",
      "        GROUP BY lt.code, lt.name, lt.category",
      "        ORDER BY active DESC",
      "    " + BT + ", cutoff).Scan(&results)",
      "",
      "    c.JSON(http.StatusOK, gin.H{",
      '        "success": true,',
      '        "data":    results,',
      '        "meta": gin.H{',
      '            "period":      "Last " + strconv.Itoa(months) + " months",',
      '            "generatedAt": time.Now().Format(time.RFC3339),',
      "        },",
      "    })",
      "}",
      "",
      "// GET /api/v1/license-types/driver-stats/summary",
      "func (h *LicenseTypeStatsHandler) GetSummary(c *gin.Context) {",
      "    var totalActive int64",
      "    h.DB.Model(&Driver{}).",
      '        Where("status = ? AND deleted_at IS NULL", "ACTIVE").',
      "        Count(&totalActive)",
      "",
      "    var totalLicenseTypes int64",
      "    h.DB.Model(&LicenseType{}).",
      '        Where("status = ? AND deleted_at IS NULL", "ACTIVE").',
      "        Count(&totalLicenseTypes)",
      "",
      "    var topType struct {",
      "        Code  string " + BT + 'json:"code"' + BT,
      "        Name  string " + BT + 'json:"name"' + BT,
      "        Count int    " + BT + 'json:"activeDrivers"' + BT,
      "    }",
      "    h.DB.Raw(" + BT,
      "        SELECT lt.code, lt.name, COUNT(d.id) AS count",
      "        FROM drivers d",
      "        INNER JOIN license_types lt ON lt.id = d.license_type_id",
      "        WHERE d.status = 'ACTIVE' AND d.deleted_at IS NULL",
      "        GROUP BY lt.code, lt.name",
      "        ORDER BY count DESC LIMIT 1",
      "    " + BT + ").Scan(&topType)",
      "",
      "    c.JSON(http.StatusOK, gin.H{",
      '        "success": true,',
      '        "data": gin.H{',
      '            "totalActiveDrivers": totalActive,',
      '            "totalLicenseTypes":  totalLicenseTypes,',
      '            "topLicenseType":     topType,',
      "        },",
      "    })",
      "}",
    ].join("\n"),

    ruby: `# license_type_stats_controller.rb — Rails (best performance)
class Api::V1::LicenseTypeStatsController < ApplicationController
  # GET /api/v1/license-types/driver-stats?months=6
  def driver_stats
    months = (params[:months] || 6).to_i
    cutoff = months.months.ago

    results = Driver
      .joins(:license_type)
      .where("drivers.created_at >= ?", cutoff)
      .where(drivers: { deleted_at: nil })
      .group(
        "license_types.code",
        "license_types.name",
        "license_types.category"
      )
      .select(
        "license_types.code",
        "license_types.name",
        "license_types.category",
        "SUM(CASE WHEN drivers.status = 'ACTIVE' "\
          "THEN 1 ELSE 0 END) AS active",
        "SUM(CASE WHEN drivers.status = 'PENDING' "\
          "THEN 1 ELSE 0 END) AS pending",
        "SUM(CASE WHEN drivers.status = 'SUSPENDED' "\
          "THEN 1 ELSE 0 END) AS suspended",
        "SUM(CASE WHEN drivers.status = 'INACTIVE' "\
          "THEN 1 ELSE 0 END) AS inactive"
      )
      .order("active DESC")

    render json: {
      success: true,
      data: results.map { |r|
        {
          code:      r.code,
          name:      r.name,
          category:  r.category,
          active:    r.active.to_i,
          pending:   r.pending.to_i,
          suspended: r.suspended.to_i,
          inactive:  r.inactive.to_i,
          total:     r.active.to_i + r.pending.to_i +
                     r.suspended.to_i + r.inactive.to_i
        }
      },
      meta: {
        period:       "Last #{months} months",
        generated_at: Time.current.iso8601
      }
    }
  end

  # GET /api/v1/license-types/driver-stats/summary
  def summary
    total_active = Driver
      .where(status: "ACTIVE", deleted_at: nil)
      .count

    total_license_types = LicenseType
      .where(status: "ACTIVE", deleted_at: nil)
      .count

    top_type = Driver
      .joins(:license_type)
      .where(status: "ACTIVE", deleted_at: nil)
      .group("license_types.code", "license_types.name")
      .select(
        "license_types.code",
        "license_types.name",
        "COUNT(drivers.id) AS count"
      )
      .order("count DESC")
      .first

    render json: {
      success: true,
      data: {
        total_active_drivers: total_active,
        total_license_types:  total_license_types,
        top_license_type: top_type ? {
          code:           top_type.code,
          name:           top_type.name,
          active_drivers: top_type.count.to_i
        } : nil
      }
    }
  end
end`,
  };

  return codes[lang];
}

export function getPieBackendCode(lang: BackendLang, nestjsCode: string): string {
  const codes: Record<BackendLang, string> = {
    nestjs: nestjsCode,

    nodejs: `// driverDistribution.js — Node.js + Prisma (best performance)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/v1/license-types/distribution
async function getDistribution(req, res) {
  const results = await prisma.$queryRaw\`
    SELECT
      lt.code, lt.name, lt.category,
      COUNT(d.id) AS drivers
    FROM drivers d
    INNER JOIN license_types lt ON lt.id = d.license_type_id
    WHERE d.deleted_at IS NULL
      AND lt.status = 'ACTIVE'
    GROUP BY lt.code, lt.name, lt.category
    ORDER BY drivers DESC
  \`;

  const total = results.reduce(
    (sum, r) => sum + Number(r.drivers), 0,
  );

  res.json({
    success: true,
    data: {
      distribution: results.map((r) => ({
        code: r.code, name: r.name, category: r.category,
        drivers: Number(r.drivers),
        percentage: total > 0
          ? Number(((Number(r.drivers) / total) * 100).toFixed(1))
          : 0,
      })),
      total,
    },
    meta: { generatedAt: new Date().toISOString() },
  });
}

// GET /api/v1/license-types/distribution/top
async function getTopDistribution(req, res) {
  const top5 = await prisma.$queryRaw\`
    SELECT lt.code, lt.name, COUNT(d.id) AS drivers
    FROM drivers d
    INNER JOIN license_types lt ON lt.id = d.license_type_id
    WHERE d.deleted_at IS NULL AND lt.status = 'ACTIVE'
    GROUP BY lt.code, lt.name
    ORDER BY drivers DESC LIMIT 5
  \`;

  res.json({
    success: true,
    data: top5.map((r) => ({
      code: r.code, name: r.name,
      drivers: Number(r.drivers),
    })),
  });
}

module.exports = { getDistribution, getTopDistribution };`,

    java: `// DriverDistributionController.java — Spring Boot + JPA (best performance)
package com.innotaxi.api.controller;

import com.innotaxi.api.service.DriverDistributionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/license-types")
@RequiredArgsConstructor
public class DriverDistributionController {
    private final DriverDistributionService distributionService;

    @GetMapping("/distribution")
    public ResponseEntity<?> getDistribution() {
        return ResponseEntity.ok(
            distributionService.getDistribution());
    }

    @GetMapping("/distribution/top")
    public ResponseEntity<?> getTopDistribution() {
        return ResponseEntity.ok(
            distributionService.getTopDistribution());
    }
}

// DriverDistributionRepository.java — Native query
package com.innotaxi.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DriverDistributionRepository
        extends JpaRepository<Driver, Long> {

    @Query(value = """
        SELECT lt.code, lt.name, lt.category,
            COUNT(d.id) AS drivers
        FROM drivers d
        INNER JOIN license_types lt ON lt.id = d.license_type_id
        WHERE d.deleted_at IS NULL
          AND lt.status = 'ACTIVE'
        GROUP BY lt.code, lt.name, lt.category
        ORDER BY drivers DESC
        """, nativeQuery = true)
    List<Object[]> findDistribution();

    @Query(value = """
        SELECT lt.code, lt.name,
            COUNT(d.id) AS drivers
        FROM drivers d
        INNER JOIN license_types lt ON lt.id = d.license_type_id
        WHERE d.deleted_at IS NULL
          AND lt.status = 'ACTIVE'
        GROUP BY lt.code, lt.name
        ORDER BY drivers DESC LIMIT 5
        """, nativeQuery = true)
    List<Object[]> findTopDistribution();
}`,

    laravel: `<?php
// DriverDistributionController.php — Laravel + Eloquent (best performance)
namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\DB;

class DriverDistributionController extends Controller
{
    // GET /api/v1/license-types/distribution
    public function distribution(): JsonResponse
    {
        $results = DB::table('drivers as d')
            ->join('license_types as lt', 'lt.id', '=', 'd.license_type_id')
            ->select(
                'lt.code', 'lt.name', 'lt.category',
                DB::raw('COUNT(d.id) as drivers')
            )
            ->whereNull('d.deleted_at')
            ->where('lt.status', 'ACTIVE')
            ->groupBy('lt.code', 'lt.name', 'lt.category')
            ->orderByDesc('drivers')
            ->get();

        $total = $results->sum('drivers');

        return response()->json([
            'success' => true,
            'data' => [
                'distribution' => $results->map(fn ($r) => [
                    'code' => $r->code,
                    'name' => $r->name,
                    'category' => $r->category,
                    'drivers' => (int) $r->drivers,
                    'percentage' => $total > 0
                        ? round(((int) $r->drivers / $total) * 100, 1)
                        : 0,
                ]),
                'total' => $total,
            ],
            'meta' => ['generatedAt' => now()->toISOString()],
        ]);
    }

    // GET /api/v1/license-types/distribution/top
    public function topDistribution(): JsonResponse
    {
        $top5 = DB::table('drivers as d')
            ->join('license_types as lt', 'lt.id', '=', 'd.license_type_id')
            ->select('lt.code', 'lt.name', DB::raw('COUNT(d.id) as drivers'))
            ->whereNull('d.deleted_at')
            ->where('lt.status', 'ACTIVE')
            ->groupBy('lt.code', 'lt.name')
            ->orderByDesc('drivers')
            ->limit(5)->get();

        return response()->json([
            'success' => true,
            'data' => $top5->map(fn ($r) => [
                'code' => $r->code, 'name' => $r->name,
                'drivers' => (int) $r->drivers,
            ]),
        ]);
    }
}`,

    csharp: `// DriverDistributionController.cs — ASP.NET Core + EF Core (best performance)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InnoTaxi.Api.Controllers;

[ApiController]
[Route("api/v1/license-types")]
public class DriverDistributionController : ControllerBase
{
    private readonly AppDbContext _db;
    public DriverDistributionController(AppDbContext db) => _db = db;

    // GET /api/v1/license-types/distribution
    [HttpGet("distribution")]
    public async Task<IActionResult> GetDistribution()
    {
        var results = await _db.Drivers
            .Where(d => d.DeletedAt == null)
            .Join(_db.LicenseTypes.Where(lt => lt.Status == "ACTIVE"),
                  d => d.LicenseTypeId, lt => lt.Id,
                  (d, lt) => new { lt.Code, lt.Name, lt.Category })
            .GroupBy(x => new { x.Code, x.Name, x.Category })
            .Select(g => new {
                g.Key.Code, g.Key.Name, g.Key.Category,
                Drivers = g.Count(),
            })
            .OrderByDescending(x => x.Drivers)
            .ToListAsync();

        var total = results.Sum(r => r.Drivers);

        return Ok(new {
            success = true,
            data = new {
                distribution = results.Select(r => new {
                    r.Code, r.Name, r.Category, r.Drivers,
                    Percentage = total > 0
                        ? Math.Round((double)r.Drivers / total * 100, 1)
                        : 0,
                }),
                total,
            },
            meta = new { generatedAt = DateTime.UtcNow.ToString("o") },
        });
    }

    // GET /api/v1/license-types/distribution/top
    [HttpGet("distribution/top")]
    public async Task<IActionResult> GetTopDistribution()
    {
        var top5 = await _db.Drivers
            .Where(d => d.DeletedAt == null)
            .Join(_db.LicenseTypes.Where(lt => lt.Status == "ACTIVE"),
                  d => d.LicenseTypeId, lt => lt.Id,
                  (d, lt) => new { lt.Code, lt.Name })
            .GroupBy(x => new { x.Code, x.Name })
            .Select(g => new {
                g.Key.Code, g.Key.Name,
                Drivers = g.Count(),
            })
            .OrderByDescending(x => x.Drivers)
            .Take(5).ToListAsync();

        return Ok(new { success = true, data = top5 });
    }
}`,

    python: `# driver_distribution.py — FastAPI + SQLAlchemy (best performance)
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy import func, text
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Driver, LicenseType

router = APIRouter(prefix="/api/v1/license-types")


@router.get("/distribution")
async def get_distribution(
    db: AsyncSession = Depends(get_db),
):
    query = (
        db.query(
            LicenseType.code,
            LicenseType.name,
            LicenseType.category,
            func.count(Driver.id).label("drivers"),
        )
        .join(LicenseType, LicenseType.id == Driver.license_type_id)
        .filter(
            Driver.deleted_at.is_(None),
            LicenseType.status == "ACTIVE",
        )
        .group_by(
            LicenseType.code,
            LicenseType.name,
            LicenseType.category,
        )
        .order_by(text("drivers DESC"))
    )

    results = (await db.execute(query)).all()
    total = sum(r.drivers for r in results)

    return {
        "success": True,
        "data": {
            "distribution": [
                {
                    "code": r.code,
                    "name": r.name,
                    "category": r.category,
                    "drivers": r.drivers,
                    "percentage": round(
                        (r.drivers / total) * 100, 1
                    ) if total > 0 else 0,
                }
                for r in results
            ],
            "total": total,
        },
        "meta": {
            "generatedAt": datetime.utcnow().isoformat(),
        },
    }


@router.get("/distribution/top")
async def get_top_distribution(
    db: AsyncSession = Depends(get_db),
):
    query = (
        db.query(
            LicenseType.code,
            LicenseType.name,
            func.count(Driver.id).label("drivers"),
        )
        .join(LicenseType, LicenseType.id == Driver.license_type_id)
        .filter(
            Driver.deleted_at.is_(None),
            LicenseType.status == "ACTIVE",
        )
        .group_by(LicenseType.code, LicenseType.name)
        .order_by(text("drivers DESC"))
        .limit(5)
    )
    results = (await db.execute(query)).all()

    return {
        "success": True,
        "data": [
            {"code": r.code, "name": r.name, "drivers": r.drivers}
            for r in results
        ],
    }`,

    golang: [
      "// driver_distribution_handler.go \u2014 Go + GORM (best performance)",
      "package handler",
      "",
      "import (",
      '    "net/http"',
      '    "time"',
      "",
      '    "github.com/gin-gonic/gin"',
      '    "gorm.io/gorm"',
      ")",
      "",
      "type DriverDistributionHandler struct {",
      "    DB *gorm.DB",
      "}",
      "",
      "type DistributionRow struct {",
      "    Code       string  " + BT + 'json:"code"' + BT,
      "    Name       string  " + BT + 'json:"name"' + BT,
      "    Category   string  " + BT + 'json:"category"' + BT,
      "    Drivers    int     " + BT + 'json:"drivers"' + BT,
      "    Percentage float64 " + BT + 'json:"percentage"' + BT,
      "}",
      "",
      "// GET /api/v1/license-types/distribution",
      "func (h *DriverDistributionHandler) GetDistribution(c *gin.Context) {",
      "    var results []DistributionRow",
      "    h.DB.Raw(" + BT,
      "        SELECT lt.code, lt.name, lt.category,",
      "            COUNT(d.id) AS drivers",
      "        FROM drivers d",
      "        INNER JOIN license_types lt ON lt.id = d.license_type_id",
      "        WHERE d.deleted_at IS NULL",
      "          AND lt.status = 'ACTIVE'",
      "        GROUP BY lt.code, lt.name, lt.category",
      "        ORDER BY drivers DESC",
      "    " + BT + ").Scan(&results)",
      "",
      "    total := 0",
      "    for _, r := range results {",
      "        total += r.Drivers",
      "    }",
      "    for i := range results {",
      "        if total > 0 {",
      "            results[i].Percentage = float64(results[i].Drivers) / float64(total) * 100",
      "        }",
      "    }",
      "",
      '    c.JSON(http.StatusOK, gin.H{',
      '        "success": true,',
      '        "data": gin.H{',
      '            "distribution": results,',
      '            "total":        total,',
      "        },",
      '        "meta": gin.H{',
      '            "generatedAt": time.Now().Format(time.RFC3339),',
      "        },",
      "    })",
      "}",
    ].join("\n"),

    ruby: `# driver_distribution_controller.rb — Rails (best performance)
class Api::V1::DriverDistributionController < ApplicationController
  # GET /api/v1/license-types/distribution
  def index
    results = Driver
      .joins(:license_type)
      .where(deleted_at: nil)
      .where(license_types: { status: "ACTIVE" })
      .group(
        "license_types.code",
        "license_types.name",
        "license_types.category"
      )
      .select(
        "license_types.code",
        "license_types.name",
        "license_types.category",
        "COUNT(drivers.id) AS drivers"
      )
      .order("drivers DESC")

    total = results.sum(&:drivers)

    render json: {
      success: true,
      data: {
        distribution: results.map { |r|
          {
            code: r.code,
            name: r.name,
            category: r.category,
            drivers: r.drivers.to_i,
            percentage: total > 0
              ? (r.drivers.to_f / total * 100).round(1)
              : 0
          }
        },
        total: total
      },
      meta: { generated_at: Time.current.iso8601 }
    }
  end

  # GET /api/v1/license-types/distribution/top
  def top
    top5 = Driver
      .joins(:license_type)
      .where(deleted_at: nil)
      .where(license_types: { status: "ACTIVE" })
      .group("license_types.code", "license_types.name")
      .select(
        "license_types.code",
        "license_types.name",
        "COUNT(drivers.id) AS drivers"
      )
      .order("drivers DESC")
      .limit(5)

    render json: {
      success: true,
      data: top5.map { |r|
        { code: r.code, name: r.name, drivers: r.drivers.to_i }
      }
    }
  end
end`,
  };

  return codes[lang];
}

export const tableBackendFileConfig: Record<BackendLang, string> = {
  nestjs: "license-type.controller.ts",
  nodejs: "licenseType.js",
  java: "LicenseTypeController.java",
  laravel: "LicenseTypeController.php",
  csharp: "LicenseTypeController.cs",
  python: "license_type.py",
  golang: "license_type_handler.go",
  ruby: "license_types_controller.rb",
};
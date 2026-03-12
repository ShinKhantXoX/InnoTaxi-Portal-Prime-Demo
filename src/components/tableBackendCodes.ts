// Backend language code samples for DataTable CRUD code preview
import type { BackendLang } from "./chartBackendCodes";

const BT = String.fromCharCode(96);

export function getTableBackendCode(lang: BackendLang, nestjsCode: string): string {
  const codes: Record<BackendLang, string> = {
    nestjs: nestjsCode,

    nodejs: `// licenseType.js — Node.js + Prisma (CRUD + pagination)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/v1/license-types?page=1&limit=10&search=&status=
async function findAll(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const status = req.query.status || undefined;
  const sortField = req.query.sortField || 'code';
  const sortOrder = req.query.sortOrder === 'DESC' ? 'desc' : 'asc';

  const where = {
    deleted_at: null,
    ...(search && {
      OR: [
        { code: { contains: search } },
        { name: { contains: search } },
        { vehicle_class: { contains: search } },
      ],
    }),
    ...(status && { status }),
  };

  const [data, total] = await Promise.all([
    prisma.licenseType.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.licenseType.count({ where }),
  ]);

  res.json({
    success: true,
    data,
    meta: {
      total, page, limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// GET /api/v1/license-types/:id
async function findOne(req, res) {
  const item = await prisma.licenseType.findFirst({
    where: { id: parseInt(req.params.id), deleted_at: null },
  });
  if (!item) return res.status(404).json({
    success: false, message: 'License type not found',
  });
  res.json({ success: true, data: item });
}

// POST /api/v1/license-types
async function create(req, res) {
  const saved = await prisma.licenseType.create({ data: req.body });
  res.status(201).json({
    success: true, data: saved, message: 'Created successfully',
  });
}

// PUT /api/v1/license-types/:id
async function update(req, res) {
  const item = await prisma.licenseType.findFirst({
    where: { id: parseInt(req.params.id), deleted_at: null },
  });
  if (!item) return res.status(404).json({
    success: false, message: 'License type not found',
  });
  const saved = await prisma.licenseType.update({
    where: { id: item.id }, data: req.body,
  });
  res.json({ success: true, data: saved, message: 'Updated successfully' });
}

// DELETE /api/v1/license-types/:id (soft delete)
async function remove(req, res) {
  await prisma.licenseType.update({
    where: { id: parseInt(req.params.id) },
    data: { deleted_at: new Date() },
  });
  res.json({ success: true, message: 'Deleted successfully' });
}

module.exports = { findAll, findOne, create, update, remove };`,

    java: `// LicenseTypeController.java — Spring Boot + JPA (CRUD + pagination)
package com.innotaxi.api.controller;

import com.innotaxi.api.entity.LicenseType;
import com.innotaxi.api.repository.LicenseTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/license-types")
@RequiredArgsConstructor
public class LicenseTypeController {
    private final LicenseTypeRepository repo;

    // GET /api/v1/license-types?page=0&size=10&search=&status=
    @GetMapping
    public ResponseEntity<?> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "code") String sortField,
            @RequestParam(defaultValue = "ASC") Sort.Direction sortOrder) {

        Pageable pageable = PageRequest.of(page, size,
            Sort.by(sortOrder, sortField));

        Page<LicenseType> result = repo
            .findAllFiltered(search, status, pageable);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", result.getContent(),
            "meta", Map.of(
                "total", result.getTotalElements(),
                "page", page, "limit", size,
                "totalPages", result.getTotalPages()
            )
        ));
    }

    // GET /api/v1/license-types/:id
    @GetMapping("/{id}")
    public ResponseEntity<?> findOne(@PathVariable Long id) {
        return repo.findByIdAndDeletedAtIsNull(id)
            .map(lt -> ResponseEntity.ok(
                Map.of("success", true, "data", lt)))
            .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/v1/license-types
    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody LicenseType dto) {
        LicenseType saved = repo.save(dto);
        return ResponseEntity.status(201).body(Map.of(
            "success", true, "data", saved,
            "message", "Created successfully"
        ));
    }

    // PUT /api/v1/license-types/:id
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody LicenseType dto) {
        return repo.findByIdAndDeletedAtIsNull(id).map(lt -> {
            lt.setCode(dto.getCode());
            lt.setName(dto.getName());
            lt.setVehicleClass(dto.getVehicleClass());
            lt.setStatus(dto.getStatus());
            LicenseType saved = repo.save(lt);
            return ResponseEntity.ok(Map.of(
                "success", true, "data", saved,
                "message", "Updated successfully"
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/v1/license-types/:id (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id) {
        return repo.findByIdAndDeletedAtIsNull(id).map(lt -> {
            lt.setDeletedAt(LocalDateTime.now());
            repo.save(lt);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Deleted successfully"
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}`,

    laravel: `<?php
// LicenseTypeController.php — Laravel + Eloquent (CRUD + pagination)
namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Models\\LicenseType;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class LicenseTypeController extends Controller
{
    // GET /api/v1/license-types?page=1&limit=10&search=&status=
    public function index(Request $request): JsonResponse
    {
        $query = LicenseType::whereNull('deleted_at');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'LIKE', "%{$search}%")
                  ->orWhere('name', 'LIKE', "%{$search}%")
                  ->orWhere('vehicle_class', 'LIKE', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $sortField = $request->query('sortField', 'code');
        $sortOrder = $request->query('sortOrder', 'asc');
        $limit = (int) $request->query('limit', 10);

        $result = $query->orderBy($sortField, $sortOrder)
            ->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $result->items(),
            'meta' => [
                'total' => $result->total(),
                'page' => $result->currentPage(),
                'limit' => $limit,
                'totalPages' => $result->lastPage(),
            ],
        ]);
    }

    // GET /api/v1/license-types/:id
    public function show(int $id): JsonResponse
    {
        $item = LicenseType::whereNull('deleted_at')
            ->findOrFail($id);

        return response()->json([
            'success' => true, 'data' => $item,
        ]);
    }

    // POST /api/v1/license-types
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:license_types,code',
            'name' => 'required|string',
            'vehicle_class' => 'required|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $item = LicenseType::create($validated);

        return response()->json([
            'success' => true, 'data' => $item,
            'message' => 'Created successfully',
        ], 201);
    }

    // PUT /api/v1/license-types/:id
    public function update(Request $request, int $id): JsonResponse
    {
        $item = LicenseType::whereNull('deleted_at')
            ->findOrFail($id);

        $item->update($request->only([
            'code', 'name', 'vehicle_class', 'status',
        ]));

        return response()->json([
            'success' => true, 'data' => $item->fresh(),
            'message' => 'Updated successfully',
        ]);
    }

    // DELETE /api/v1/license-types/:id (soft delete)
    public function destroy(int $id): JsonResponse
    {
        $item = LicenseType::whereNull('deleted_at')
            ->findOrFail($id);
        $item->update(['deleted_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Deleted successfully',
        ]);
    }
}`,

    csharp: `// LicenseTypeController.cs — ASP.NET Core + EF Core (CRUD + pagination)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InnoTaxi.Api.Controllers;

[ApiController]
[Route("api/v1/license-types")]
public class LicenseTypeController : ControllerBase
{
    private readonly AppDbContext _db;
    public LicenseTypeController(AppDbContext db) => _db = db;

    // GET /api/v1/license-types?page=1&limit=10&search=&status=
    [HttpGet]
    public async Task<IActionResult> FindAll(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        [FromQuery] string sortField = "Code",
        [FromQuery] string sortOrder = "ASC")
    {
        var query = _db.LicenseTypes
            .Where(lt => lt.DeletedAt == null);

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(lt =>
                lt.Code.Contains(search) ||
                lt.Name.Contains(search) ||
                lt.VehicleClass.Contains(search));
        }

        if (!string.IsNullOrEmpty(status))
            query = query.Where(lt => lt.Status == status);

        var total = await query.CountAsync();

        var data = await query
            .OrderBy(lt => EF.Property<object>(lt, sortField))
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return Ok(new {
            success = true, data,
            meta = new {
                total, page, limit,
                totalPages = (int)Math.Ceiling((double)total / limit),
            },
        });
    }

    // GET /api/v1/license-types/:id
    [HttpGet("{id}")]
    public async Task<IActionResult> FindOne(int id)
    {
        var item = await _db.LicenseTypes
            .FirstOrDefaultAsync(lt =>
                lt.Id == id && lt.DeletedAt == null);
        if (item == null) return NotFound();
        return Ok(new { success = true, data = item });
    }

    // POST /api/v1/license-types
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] LicenseType dto)
    {
        _db.LicenseTypes.Add(dto);
        await _db.SaveChangesAsync();
        return StatusCode(201, new {
            success = true, data = dto,
            message = "Created successfully",
        });
    }

    // PUT /api/v1/license-types/:id
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id, [FromBody] LicenseType dto)
    {
        var item = await _db.LicenseTypes
            .FirstOrDefaultAsync(lt =>
                lt.Id == id && lt.DeletedAt == null);
        if (item == null) return NotFound();

        item.Code = dto.Code;
        item.Name = dto.Name;
        item.VehicleClass = dto.VehicleClass;
        item.Status = dto.Status;
        await _db.SaveChangesAsync();

        return Ok(new {
            success = true, data = item,
            message = "Updated successfully",
        });
    }

    // DELETE /api/v1/license-types/:id (soft delete)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        var item = await _db.LicenseTypes
            .FirstOrDefaultAsync(lt =>
                lt.Id == id && lt.DeletedAt == null);
        if (item == null) return NotFound();

        item.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new {
            success = true,
            message = "Deleted successfully",
        });
    }
}`,

    python: `# license_type.py — FastAPI + SQLAlchemy (CRUD + pagination)
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy import or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import LicenseType
from app.schemas import (
    CreateLicenseTypeSchema,
    UpdateLicenseTypeSchema,
)

router = APIRouter(prefix="/api/v1/license-types")


@router.get("")
async def find_all(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    sort_field: str = "code",
    sort_order: str = "ASC",
    db: AsyncSession = Depends(get_db),
):
    query = db.query(LicenseType).filter(
        LicenseType.deleted_at.is_(None),
    )

    if search:
        query = query.filter(
            or_(
                LicenseType.code.ilike(f"%{search}%"),
                LicenseType.name.ilike(f"%{search}%"),
                LicenseType.vehicle_class.ilike(f"%{search}%"),
            )
        )

    if status:
        query = query.filter(LicenseType.status == status)

    total = (await db.execute(
        query.with_entities(func.count())
    )).scalar()

    col = getattr(LicenseType, sort_field, LicenseType.code)
    order = col.desc() if sort_order == "DESC" else col.asc()
    data = (await db.execute(
        query.order_by(order)
        .offset((page - 1) * limit)
        .limit(limit)
    )).scalars().all()

    return {
        "success": True,
        "data": [item.to_dict() for item in data],
        "meta": {
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": -(-total // limit),
        },
    }


@router.get("/{id}")
async def find_one(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    item = (await db.execute(
        db.query(LicenseType).filter(
            LicenseType.id == id,
            LicenseType.deleted_at.is_(None),
        )
    )).scalar_one_or_none()

    if not item:
        raise HTTPException(404, "License type not found")
    return {"success": True, "data": item.to_dict()}


@router.post("", status_code=201)
async def create(
    dto: CreateLicenseTypeSchema,
    db: AsyncSession = Depends(get_db),
):
    item = LicenseType(**dto.dict())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return {
        "success": True,
        "data": item.to_dict(),
        "message": "Created successfully",
    }


@router.put("/{id}")
async def update(
    id: int,
    dto: UpdateLicenseTypeSchema,
    db: AsyncSession = Depends(get_db),
):
    item = (await db.execute(
        db.query(LicenseType).filter(
            LicenseType.id == id,
            LicenseType.deleted_at.is_(None),
        )
    )).scalar_one_or_none()

    if not item:
        raise HTTPException(404, "License type not found")

    for key, val in dto.dict(exclude_unset=True).items():
        setattr(item, key, val)

    await db.commit()
    await db.refresh(item)
    return {
        "success": True,
        "data": item.to_dict(),
        "message": "Updated successfully",
    }


@router.delete("/{id}")
async def remove(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    item = (await db.execute(
        db.query(LicenseType).filter(
            LicenseType.id == id,
            LicenseType.deleted_at.is_(None),
        )
    )).scalar_one_or_none()

    if not item:
        raise HTTPException(404, "License type not found")

    item.deleted_at = datetime.utcnow()
    await db.commit()
    return {
        "success": True,
        "message": "Deleted successfully",
    }`,

    golang: [
      "// license_type_handler.go \u2014 Go + GORM (CRUD + pagination)",
      "package handler",
      "",
      "import (",
      '    "math"',
      '    "net/http"',
      '    "strconv"',
      '    "time"',
      "",
      '    "github.com/gin-gonic/gin"',
      '    "gorm.io/gorm"',
      ")",
      "",
      "type LicenseTypeCrudHandler struct {",
      "    DB *gorm.DB",
      "}",
      "",
      "type LicenseType struct {",
      "    ID           uint       " + BT + 'json:"id" gorm:"primaryKey"' + BT,
      "    Code         string     " + BT + 'json:"code"' + BT,
      "    Name         string     " + BT + 'json:"name"' + BT,
      "    VehicleClass string     " + BT + 'json:"vehicle_class"' + BT,
      "    Status       string     " + BT + 'json:"status"' + BT,
      "    CreatedAt    time.Time  " + BT + 'json:"created_at"' + BT,
      "    UpdatedAt    *time.Time " + BT + 'json:"updated_at"' + BT,
      "    DeletedAt    *time.Time " + BT + 'json:"deleted_at"' + BT,
      "}",
      "",
      "// GET /api/v1/license-types",
      "func (h *LicenseTypeCrudHandler) FindAll(c *gin.Context) {",
      '    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))',
      '    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))',
      '    search := c.Query("search")',
      '    status := c.Query("status")',
      '    sortField := c.DefaultQuery("sortField", "code")',
      '    sortOrder := c.DefaultQuery("sortOrder", "ASC")',
      "",
      '    query := h.DB.Where("deleted_at IS NULL")',
      '    if search != "" {',
      '        s := "%" + search + "%"',
      '        query = query.Where(',
      '            "code LIKE ? OR name LIKE ? OR vehicle_class LIKE ?",',
      "            s, s, s,",
      "        )",
      "    }",
      '    if status != "" {',
      '        query = query.Where("status = ?", status)',
      "    }",
      "",
      "    var total int64",
      "    query.Model(&LicenseType{}).Count(&total)",
      "",
      "    var data []LicenseType",
      "    query.Order(sortField + \" \" + sortOrder).",
      "        Offset((page - 1) * limit).",
      "        Limit(limit).",
      "        Find(&data)",
      "",
      "    c.JSON(http.StatusOK, gin.H{",
      '        "success": true,',
      '        "data":    data,',
      '        "meta": gin.H{',
      '            "total":      total,',
      '            "page":       page,',
      '            "limit":      limit,',
      '            "totalPages": int(math.Ceil(',
      "                float64(total) / float64(limit))),",
      "        },",
      "    })",
      "}",
      "",
      "// GET /api/v1/license-types/:id",
      "func (h *LicenseTypeCrudHandler) FindOne(c *gin.Context) {",
      '    id := c.Param("id")',
      "    var item LicenseType",
      '    if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).',
      "        First(&item).Error; err != nil {",
      "        c.JSON(http.StatusNotFound, gin.H{",
      '            "success": false,',
      '            "message": "License type not found",',
      "        })",
      "        return",
      "    }",
      "    c.JSON(http.StatusOK, gin.H{",
      '        "success": true, "data": item,',
      "    })",
      "}",
      "",
      "// POST /api/v1/license-types",
      "func (h *LicenseTypeCrudHandler) Create(c *gin.Context) {",
      "    var dto LicenseType",
      "    if err := c.ShouldBindJSON(&dto); err != nil {",
      "        c.JSON(http.StatusBadRequest, gin.H{",
      '            "success": false, "message": err.Error(),',
      "        })",
      "        return",
      "    }",
      "    h.DB.Create(&dto)",
      "    c.JSON(http.StatusCreated, gin.H{",
      '        "success": true, "data": dto,',
      '        "message": "Created successfully",',
      "    })",
      "}",
      "",
      "// PUT /api/v1/license-types/:id",
      "func (h *LicenseTypeCrudHandler) Update(c *gin.Context) {",
      '    id := c.Param("id")',
      "    var item LicenseType",
      '    if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).',
      "        First(&item).Error; err != nil {",
      "        c.JSON(http.StatusNotFound, gin.H{",
      '            "success": false,',
      '            "message": "License type not found",',
      "        })",
      "        return",
      "    }",
      "    c.ShouldBindJSON(&item)",
      "    h.DB.Save(&item)",
      "    c.JSON(http.StatusOK, gin.H{",
      '        "success": true, "data": item,',
      '        "message": "Updated successfully",',
      "    })",
      "}",
      "",
      "// DELETE /api/v1/license-types/:id (soft delete)",
      "func (h *LicenseTypeCrudHandler) Remove(c *gin.Context) {",
      '    id := c.Param("id")',
      "    now := time.Now()",
      "    result := h.DB.Model(&LicenseType{}).",
      '        Where("id = ? AND deleted_at IS NULL", id).',
      '        Update("deleted_at", &now)',
      "    if result.RowsAffected == 0 {",
      "        c.JSON(http.StatusNotFound, gin.H{",
      '            "success": false,',
      '            "message": "License type not found",',
      "        })",
      "        return",
      "    }",
      "    c.JSON(http.StatusOK, gin.H{",
      '        "success": true,',
      '        "message": "Deleted successfully",',
      "    })",
      "}",
    ].join("\n"),

    ruby: `# license_types_controller.rb — Rails (CRUD + pagination)
class Api::V1::LicenseTypesController < ApplicationController
  before_action :set_license_type, only: %i[show update destroy]

  # GET /api/v1/license-types?page=1&limit=10&search=&status=
  def index
    scope = LicenseType.where(deleted_at: nil)

    if (search = params[:search]).present?
      scope = scope.where(
        "code LIKE :s OR name LIKE :s OR vehicle_class LIKE :s",
        s: "%#{search}%"
      )
    end

    scope = scope.where(status: params[:status]) if params[:status].present?

    sort_field = params[:sortField] || "code"
    sort_order = params[:sortOrder] || "ASC"
    limit = (params[:limit] || 10).to_i
    page = (params[:page] || 1).to_i

    total = scope.count
    data = scope
      .order("#{sort_field} #{sort_order}")
      .offset((page - 1) * limit)
      .limit(limit)

    render json: {
      success: true,
      data: data.as_json,
      meta: {
        total: total,
        page: page,
        limit: limit,
        totalPages: (total.to_f / limit).ceil
      }
    }
  end

  # GET /api/v1/license-types/:id
  def show
    render json: { success: true, data: @license_type }
  end

  # POST /api/v1/license-types
  def create
    item = LicenseType.new(license_type_params)
    if item.save
      render json: {
        success: true, data: item,
        message: "Created successfully"
      }, status: :created
    else
      render json: {
        success: false,
        errors: item.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/license-types/:id
  def update
    if @license_type.update(license_type_params)
      render json: {
        success: true, data: @license_type.reload,
        message: "Updated successfully"
      }
    else
      render json: {
        success: false,
        errors: @license_type.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/license-types/:id (soft delete)
  def destroy
    @license_type.update!(deleted_at: Time.current)
    render json: {
      success: true,
      message: "Deleted successfully"
    }
  end

  private

  def set_license_type
    @license_type = LicenseType
      .where(deleted_at: nil)
      .find(params[:id])
  end

  def license_type_params
    params.require(:license_type).permit(
      :code, :name, :vehicle_class, :status
    )
  end
end`,
  };

  return codes[lang];
}

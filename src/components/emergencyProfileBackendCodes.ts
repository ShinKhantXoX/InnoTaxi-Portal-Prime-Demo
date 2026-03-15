// ─── Emergency Profiles — Backend Preview Codes ───
import { type BackendLang, backendLangConfig } from "./chartBackendCodes";

// ─── Backend file config for emergency profiles ───
export const emergencyProfileBackendFileConfig: Record<BackendLang, string> = {
  nestjs: "emergency-profile.controller.ts",
  nodejs: "emergencyProfile.js",
  java: "EmergencyProfileController.java",
  laravel: "EmergencyProfileController.php",
  csharp: "EmergencyProfileController.cs",
  python: "emergency_profile.py",
  golang: "emergency_profile_handler.go",
  ruby: "emergency_profiles_controller.rb",
};

// ─── CRUD Backend Code ───
export function getEmergencyProfileBackendCode(lang: BackendLang): string {
  const codes: Record<BackendLang, string> = {
    nestjs: `// emergency-profile.controller.ts — NestJS + TypeORM
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { EmergencyProfile } from './entities/emergency-profile.entity';

@Controller('api/v1/emergency-profiles')
export class EmergencyProfileController {
  constructor(
    @InjectRepository(EmergencyProfile)
    private readonly repo: Repository<EmergencyProfile>,
  ) {}

  // GET /api/v1/emergency-profiles?page=1&limit=20&relationship=SPOUSE&driver_id=1&customer_id=1
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('relationship') relationship?: string,
    @Query('driver_id') driverId?: number,
    @Query('customer_id') customerId?: number,
  ) {
    const qb = this.repo.createQueryBuilder('ep')
      .leftJoinAndSelect('ep.driver', 'driver')
      .leftJoinAndSelect('ep.customer', 'customer')
      .where('ep.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(ep.contact_name ILIKE :s OR driver.full_name ILIKE :s OR customer.full_name ILIKE :s)', { s: \`%\${search}%\` });
    }
    if (relationship) qb.andWhere('ep.relationship = :relationship', { relationship });
    if (driverId) qb.andWhere('ep.driver_id = :driverId', { driverId });
    if (customerId) qb.andWhere('ep.customer_id = :customerId', { customerId });

    const [data, total] = await qb
      .orderBy('ep.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { success: true, data, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / limit) } };
  }

  // GET /api/v1/emergency-profiles/:id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const profile = await this.repo.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['driver', 'customer'],
    });
    if (!profile) throw new NotFoundException('Emergency profile not found');
    return { success: true, data: profile };
  }

  // POST /api/v1/emergency-profiles — driver_id (nullable), customer_id (nullable), contact_name, relationship, prefix, phone_number
  @Post()
  async create(@Body() body: {
    driver_id?: number;        // nullable — FK to drivers
    customer_id?: number;      // nullable — FK to passengers
    contact_name: string;      // required
    prefix: string;            // required — e.g. "+95"
    phone_number: string;      // required — e.g. "912345678"
    relationship: string;      // required — SPOUSE|PARENT|SIBLING|CHILD|FRIEND|OTHER
  }) {
    // Validate: at least one of driver_id or customer_id must be provided
    if (!body.driver_id && !body.customer_id) throw new BadRequestException('Either driver_id or customer_id is required');
    if (!body.contact_name?.trim()) throw new BadRequestException('contact_name is required');
    if (!body.prefix?.trim()) throw new BadRequestException('prefix is required');
    if (!body.phone_number?.trim()) throw new BadRequestException('phone_number is required');
    if (!body.relationship?.trim()) throw new BadRequestException('relationship is required');

    // Check max emergency contacts per owner (limit: 3)
    const where: any = { deleted_at: IsNull() };
    if (body.driver_id) where.driver_id = body.driver_id;
    if (body.customer_id) where.customer_id = body.customer_id;
    const count = await this.repo.count({ where });
    if (count >= 3) throw new BadRequestException('Maximum 3 emergency contacts per driver/customer');

    const profile = this.repo.create({
      driver_id: body.driver_id || null,
      customer_id: body.customer_id || null,
      contact_name: body.contact_name.trim(),
      prefix: body.prefix,
      phone_number: body.phone_number.trim(),
      relationship: body.relationship,
      status: 'UNDER_REVIEW',
    });
    const saved = await this.repo.save(profile);
    return { success: true, data: saved, message: 'Emergency contact created' };
  }

  // PUT /api/v1/emergency-profiles/:id
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: Partial<EmergencyProfile>) {
    const profile = await this.repo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!profile) throw new NotFoundException('Emergency profile not found');

    if (body.contact_name) profile.contact_name = body.contact_name.trim();
    if (body.prefix) profile.prefix = body.prefix;
    if (body.phone_number) profile.phone_number = body.phone_number.trim();
    if (body.relationship) profile.relationship = body.relationship;
    if (body.status) profile.status = body.status; // UNDER_REVIEW | REJECT | APPROVE

    const saved = await this.repo.save(profile);
    return { success: true, data: saved, message: 'Emergency contact updated' };
  }

  // DELETE /api/v1/emergency-profiles/:id (soft delete)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const profile = await this.repo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!profile) throw new NotFoundException('Emergency profile not found');
    profile.deleted_at = new Date();
    await this.repo.save(profile);
    return { success: true, message: 'Emergency contact deleted' };
  }
}`,

    nodejs: `// emergencyProfile.js — Node.js + Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/v1/emergency-profiles
async function listEmergencyProfiles(req, res) {
  const { page = 1, limit = 20, search, relationship, driver_id, customer_id } = req.query;
  const where = { deleted_at: null };
  if (search) {
    where.OR = [
      { contact_name: { contains: search, mode: 'insensitive' } },
      { driver: { full_name: { contains: search, mode: 'insensitive' } } },
      { customer: { full_name: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (relationship) where.relationship = relationship;
  if (driver_id) where.driver_id = parseInt(driver_id);
  if (customer_id) where.customer_id = parseInt(customer_id);

  const [data, total] = await Promise.all([
    prisma.emergencyProfile.findMany({
      where,
      include: {
        driver: { select: { id: true, full_name: true } },
        customer: { select: { id: true, full_name: true } },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { created_at: 'desc' },
    }),
    prisma.emergencyProfile.count({ where }),
  ]);

  res.json({ success: true, data, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / limit) } });
}

// POST /api/v1/emergency-profiles — driver_id (nullable), customer_id (nullable), contact_name, relationship, prefix, phone_number
async function createEmergencyProfile(req, res) {
  const { driver_id, customer_id, contact_name, prefix, phone_number, relationship } = req.body;

  // At least one owner required
  if (!driver_id && !customer_id) return res.status(400).json({ error: 'Either driver_id or customer_id is required' });
  if (!contact_name?.trim()) return res.status(400).json({ error: 'contact_name is required' });
  if (!prefix?.trim()) return res.status(400).json({ error: 'prefix is required' });
  if (!phone_number?.trim()) return res.status(400).json({ error: 'phone_number is required' });
  if (!relationship?.trim()) return res.status(400).json({ error: 'relationship is required' });

  // Max 3 per owner
  const ownerWhere = { deleted_at: null };
  if (driver_id) ownerWhere.driver_id = parseInt(driver_id);
  if (customer_id) ownerWhere.customer_id = parseInt(customer_id);
  const count = await prisma.emergencyProfile.count({ where: ownerWhere });
  if (count >= 3) return res.status(400).json({ error: 'Maximum 3 emergency contacts per driver/customer' });

  const profile = await prisma.emergencyProfile.create({
    data: {
      driver_id: driver_id ? parseInt(driver_id) : null,
      customer_id: customer_id ? parseInt(customer_id) : null,
      contact_name: contact_name.trim(), prefix,
      phone_number: phone_number.trim(), relationship,
      status: 'UNDER_REVIEW',
    },
  });
  res.status(201).json({ success: true, data: profile });
}

// PUT /api/v1/emergency-profiles/:id
async function updateEmergencyProfile(req, res) {
  const { id } = req.params;
  const { contact_name, prefix, phone_number, relationship, status } = req.body;
  const profile = await prisma.emergencyProfile.update({
    where: { id: parseInt(id), deleted_at: null },
    data: { ...(contact_name && { contact_name: contact_name.trim() }), ...(prefix && { prefix }), ...(phone_number && { phone_number: phone_number.trim() }), ...(relationship && { relationship }), ...(status && { status }) },
  });
  res.json({ success: true, data: profile });
}

// DELETE /api/v1/emergency-profiles/:id (soft delete)
async function deleteEmergencyProfile(req, res) {
  const { id } = req.params;
  await prisma.emergencyProfile.update({ where: { id: parseInt(id) }, data: { deleted_at: new Date() } });
  res.json({ success: true, message: 'Emergency contact deleted' });
}

module.exports = { listEmergencyProfiles, createEmergencyProfile, updateEmergencyProfile, deleteEmergencyProfile };`,

    java: `// EmergencyProfileController.java — Spring Boot + JPA
@RestController
@RequestMapping("/api/v1/emergency-profiles")
public class EmergencyProfileController {

    @Autowired
    private EmergencyProfileRepository repo;

    // GET /api/v1/emergency-profiles
    @GetMapping
    public ResponseEntity<?> list(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "20") int limit,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String relationship,
        @RequestParam(required = false) Long driverId,
        @RequestParam(required = false) Long customerId
    ) {
        Specification<EmergencyProfile> spec = Specification
            .where(EmergencyProfileSpec.notDeleted());
        if (search != null) spec = spec.and(EmergencyProfileSpec.searchByName(search));
        if (relationship != null) spec = spec.and(EmergencyProfileSpec.byRelationship(relationship));
        if (driverId != null) spec = spec.and(EmergencyProfileSpec.byDriverId(driverId));
        if (customerId != null) spec = spec.and(EmergencyProfileSpec.byCustomerId(customerId));

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<EmergencyProfile> result = repo.findAll(spec, pageable);
        return ResponseEntity.ok(Map.of("success", true, "data", result.getContent(),
            "meta", Map.of("total", result.getTotalElements(), "page", page, "limit", limit)));
    }

    // POST /api/v1/emergency-profiles — driver_id (nullable), customer_id (nullable), contact_name, relationship, prefix, phone_number
    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Valid CreateEmergencyProfileDto dto) {
        if (dto.getDriverId() == null && dto.getCustomerId() == null)
            throw new BadRequestException("Either driver_id or customer_id is required");

        // Count by whichever owner is provided
        long count = dto.getDriverId() != null
            ? repo.countByDriverIdAndDeletedAtIsNull(dto.getDriverId())
            : repo.countByCustomerIdAndDeletedAtIsNull(dto.getCustomerId());
        if (count >= 3) throw new BadRequestException("Maximum 3 emergency contacts per driver/customer");

        EmergencyProfile ep = new EmergencyProfile();
        ep.setDriverId(dto.getDriverId());       // nullable
        ep.setCustomerId(dto.getCustomerId());   // nullable
        ep.setContactName(dto.getContactName().trim());
        ep.setPrefix(dto.getPrefix());
        ep.setPhoneNumber(dto.getPhoneNumber().trim());
        ep.setRelationship(dto.getRelationship());
        ep.setStatus("UNDER_REVIEW");
        return ResponseEntity.status(201).body(Map.of("success", true, "data", repo.save(ep)));
    }

    // PUT /api/v1/emergency-profiles/:id
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateEmergencyProfileDto dto) {
        EmergencyProfile ep = repo.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new NotFoundException("Emergency profile not found"));
        if (dto.getContactName() != null) ep.setContactName(dto.getContactName().trim());
        if (dto.getPrefix() != null) ep.setPrefix(dto.getPrefix());
        if (dto.getPhoneNumber() != null) ep.setPhoneNumber(dto.getPhoneNumber().trim());
        if (dto.getRelationship() != null) ep.setRelationship(dto.getRelationship());
        if (dto.getStatus() != null) ep.setStatus(dto.getStatus()); // UNDER_REVIEW | REJECT | APPROVE
        return ResponseEntity.ok(Map.of("success", true, "data", repo.save(ep)));
    }

    // DELETE /api/v1/emergency-profiles/:id (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        EmergencyProfile ep = repo.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new NotFoundException("Emergency profile not found"));
        ep.setDeletedAt(LocalDateTime.now());
        repo.save(ep);
        return ResponseEntity.ok(Map.of("success", true, "message", "Emergency contact deleted"));
    }
}`,

    laravel: `<?php
// EmergencyProfileController.php — Laravel + Eloquent

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Models\\EmergencyProfile;
use Illuminate\\Http\\Request;

class EmergencyProfileController extends Controller
{
    // GET /api/v1/emergency-profiles
    public function index(Request $request)
    {
        $query = EmergencyProfile::with(['driver:id,full_name', 'customer:id,full_name'])
            ->whereNull('deleted_at');

        if ($search = $request->query('search')) {
            $query->where(fn ($q) =>
                $q->where('contact_name', 'ILIKE', "%{$search}%")
                  ->orWhereHas('driver', fn ($d) => $d->where('full_name', 'ILIKE', "%{$search}%"))
                  ->orWhereHas('customer', fn ($c) => $c->where('full_name', 'ILIKE', "%{$search}%"))
            );
        }
        if ($rel = $request->query('relationship')) $query->where('relationship', $rel);
        if ($driverId = $request->query('driver_id')) $query->where('driver_id', $driverId);
        if ($customerId = $request->query('customer_id')) $query->where('customer_id', $customerId);

        $result = $query->orderBy('created_at', 'desc')
            ->paginate($request->query('limit', 20));

        return response()->json(['success' => true, 'data' => $result->items(), 'meta' => [
            'total' => $result->total(), 'page' => $result->currentPage(), 'limit' => $result->perPage(),
        ]]);
    }

    // POST /api/v1/emergency-profiles — driver_id (nullable), customer_id (nullable), contact_name, relationship, prefix, phone_number
    public function store(Request $request)
    {
        $validated = $request->validate([
            'driver_id' => 'nullable|exists:drivers,id',
            'customer_id' => 'nullable|exists:passengers,id',
            'contact_name' => 'required|string|max:255',
            'prefix' => 'required|string|max:10',
            'phone_number' => 'required|string|max:20',
            'relationship' => 'required|in:SPOUSE,PARENT,SIBLING,CHILD,FRIEND,OTHER',
        ]);

        if (!($validated['driver_id'] ?? null) && !($validated['customer_id'] ?? null)) {
            return response()->json(['error' => 'Either driver_id or customer_id is required'], 400);
        }

        $ownerQuery = EmergencyProfile::whereNull('deleted_at');
        if ($validated['driver_id'] ?? null) $ownerQuery->where('driver_id', $validated['driver_id']);
        if ($validated['customer_id'] ?? null) $ownerQuery->where('customer_id', $validated['customer_id']);
        if ($ownerQuery->count() >= 3) return response()->json(['error' => 'Maximum 3 emergency contacts per driver/customer'], 400);

        $profile = EmergencyProfile::create([...$validated, 'status' => 'UNDER_REVIEW']);
        return response()->json(['success' => true, 'data' => $profile], 201);
    }

    // PUT /api/v1/emergency-profiles/{id}
    public function update(Request $request, int $id)
    {
        $profile = EmergencyProfile::whereNull('deleted_at')->findOrFail($id);
        $profile->update($request->only(['contact_name', 'prefix', 'phone_number', 'relationship', 'status']));
        return response()->json(['success' => true, 'data' => $profile->fresh()]);
    }

    // DELETE /api/v1/emergency-profiles/{id} (soft delete)
    public function destroy(int $id)
    {
        $profile = EmergencyProfile::whereNull('deleted_at')->findOrFail($id);
        $profile->update(['deleted_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Emergency contact deleted']);
    }
}`,

    csharp: `// EmergencyProfileController.cs — ASP.NET Core + EF Core
[ApiController]
[Route("api/v1/emergency-profiles")]
public class EmergencyProfileController : ControllerBase
{
    private readonly AppDbContext _db;
    public EmergencyProfileController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int limit = 20,
        [FromQuery] string? search = null, [FromQuery] string? relationship = null,
        [FromQuery] long? driverId = null, [FromQuery] long? customerId = null)
    {
        var query = _db.EmergencyProfiles
            .Include(e => e.Driver).Include(e => e.Customer)
            .Where(e => e.DeletedAt == null);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(e => e.ContactName.Contains(search) || e.Driver.FullName.Contains(search) || e.Customer.FullName.Contains(search));
        if (!string.IsNullOrEmpty(relationship)) query = query.Where(e => e.Relationship == relationship);
        if (driverId.HasValue) query = query.Where(e => e.DriverId == driverId);
        if (customerId.HasValue) query = query.Where(e => e.CustomerId == customerId);

        var total = await query.CountAsync();
        var data = await query.OrderByDescending(e => e.CreatedAt).Skip((page - 1) * limit).Take(limit).ToListAsync();
        return Ok(new { success = true, data, meta = new { total, page, limit } });
    }

    // POST /api/v1/emergency-profiles — driver_id (nullable), customer_id (nullable), contact_name, relationship, prefix, phone_number
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmergencyProfileDto dto)
    {
        if (dto.DriverId == null && dto.CustomerId == null)
            return BadRequest(new { error = "Either driver_id or customer_id is required" });

        var countQuery = _db.EmergencyProfiles.Where(e => e.DeletedAt == null);
        if (dto.DriverId != null) countQuery = countQuery.Where(e => e.DriverId == dto.DriverId);
        if (dto.CustomerId != null) countQuery = countQuery.Where(e => e.CustomerId == dto.CustomerId);
        if (await countQuery.CountAsync() >= 3) return BadRequest(new { error = "Maximum 3 emergency contacts per driver/customer" });

        var profile = new EmergencyProfile {
            DriverId = dto.DriverId, CustomerId = dto.CustomerId,
            ContactName = dto.ContactName.Trim(), Prefix = dto.Prefix,
            PhoneNumber = dto.PhoneNumber.Trim(), Relationship = dto.Relationship,
            Status = "UNDER_REVIEW"
        };
        _db.EmergencyProfiles.Add(profile);
        await _db.SaveChangesAsync();
        return Created("", new { success = true, data = profile });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateEmergencyProfileDto dto)
    {
        var profile = await _db.EmergencyProfiles.FirstOrDefaultAsync(e => e.Id == id && e.DeletedAt == null);
        if (profile == null) return NotFound();
        if (dto.ContactName != null) profile.ContactName = dto.ContactName.Trim();
        if (dto.Prefix != null) profile.Prefix = dto.Prefix;
        if (dto.PhoneNumber != null) profile.PhoneNumber = dto.PhoneNumber.Trim();
        if (dto.Relationship != null) profile.Relationship = dto.Relationship;
        if (dto.Status != null) profile.Status = dto.Status; // UNDER_REVIEW | REJECT | APPROVE
        await _db.SaveChangesAsync();
        return Ok(new { success = true, data = profile });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var profile = await _db.EmergencyProfiles.FirstOrDefaultAsync(e => e.Id == id && e.DeletedAt == null);
        if (profile == null) return NotFound();
        profile.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(new { success = true, message = "Emergency contact deleted" });
    }
}`,

    python: `# emergency_profile.py — FastAPI + SQLAlchemy
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from models import EmergencyProfile, Driver, Passenger
from database import get_db

router = APIRouter(prefix="/api/v1/emergency-profiles", tags=["Emergency Profiles"])

# GET /api/v1/emergency-profiles
@router.get("/")
async def list_profiles(
    page: int = 1, limit: int = 20,
    search: Optional[str] = None,
    relationship: Optional[str] = None,
    driver_id: Optional[int] = None,
    customer_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(EmergencyProfile).filter(EmergencyProfile.deleted_at.is_(None))
    if search:
        query = query.outerjoin(Driver).outerjoin(Passenger).filter(
            (EmergencyProfile.contact_name.ilike(f"%{search}%")) |
            (Driver.full_name.ilike(f"%{search}%")) |
            (Passenger.full_name.ilike(f"%{search}%"))
        )
    if relationship:
        query = query.filter(EmergencyProfile.relationship == relationship)
    if driver_id:
        query = query.filter(EmergencyProfile.driver_id == driver_id)
    if customer_id:
        query = query.filter(EmergencyProfile.customer_id == customer_id)

    total = query.count()
    data = query.order_by(EmergencyProfile.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    return {"success": True, "data": data, "meta": {"total": total, "page": page, "limit": limit}}

# POST /api/v1/emergency-profiles — driver_id (nullable), customer_id (nullable), contact_name, relationship, prefix, phone_number
@router.post("/", status_code=201)
async def create_profile(body: CreateEmergencyProfileSchema, db: Session = Depends(get_db)):
    if not body.driver_id and not body.customer_id:
        raise HTTPException(400, "Either driver_id or customer_id is required")

    owner_filter = [EmergencyProfile.deleted_at.is_(None)]
    if body.driver_id:
        owner_filter.append(EmergencyProfile.driver_id == body.driver_id)
    if body.customer_id:
        owner_filter.append(EmergencyProfile.customer_id == body.customer_id)
    count = db.query(EmergencyProfile).filter(*owner_filter).count()
    if count >= 3:
        raise HTTPException(400, "Maximum 3 emergency contacts per driver/customer")

    profile = EmergencyProfile(
        driver_id=body.driver_id,          # nullable
        customer_id=body.customer_id,      # nullable
        contact_name=body.contact_name.strip(),
        prefix=body.prefix,
        phone_number=body.phone_number.strip(),
        relationship=body.relationship,
        status="UNDER_REVIEW",
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return {"success": True, "data": profile}

# PUT /api/v1/emergency-profiles/{id}
@router.put("/{id}")
async def update_profile(id: int, body: UpdateEmergencyProfileSchema, db: Session = Depends(get_db)):
    profile = db.query(EmergencyProfile).filter(EmergencyProfile.id == id, EmergencyProfile.deleted_at.is_(None)).first()
    if not profile:
        raise HTTPException(404, "Emergency profile not found")
    for field, value in body.dict(exclude_unset=True).items():
        setattr(profile, field, value.strip() if isinstance(value, str) else value)
    db.commit()
    return {"success": True, "data": profile}

# DELETE /api/v1/emergency-profiles/{id}
@router.delete("/{id}")
async def delete_profile(id: int, db: Session = Depends(get_db)):
    profile = db.query(EmergencyProfile).filter(EmergencyProfile.id == id, EmergencyProfile.deleted_at.is_(None)).first()
    if not profile:
        raise HTTPException(404, "Emergency profile not found")
    profile.deleted_at = datetime.utcnow()
    db.commit()
    return {"success": True, "message": "Emergency contact deleted"}`,

    golang: `// emergency_profile_handler.go — Go + GORM
package handlers

import (
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type EmergencyProfile struct {
	ID           uint       \`json:"id" gorm:"primaryKey"\`
	DriverID     *uint      \`json:"driver_id"\`                              // nullable
	CustomerID   *uint      \`json:"customer_id"\`                            // nullable
	ContactName  string     \`json:"contact_name" gorm:"size:255;not null"\`
	Prefix       string     \`json:"prefix" gorm:"size:10;not null"\`
	PhoneNumber  string     \`json:"phone_number" gorm:"size:20;not null"\`
	Relationship string     \`json:"relationship" gorm:"size:50;not null"\`
	Status       string     \`json:"status" gorm:"size:20;default:'UNDER_REVIEW'"\`
	CreatedAt    time.Time  \`json:"created_at"\`
	UpdatedAt    time.Time  \`json:"updated_at"\`
	DeletedAt    *time.Time \`json:"deleted_at" gorm:"index"\`
}

// GET /api/v1/emergency-profiles
func ListEmergencyProfiles(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
		query := db.Model(&EmergencyProfile{}).Where("deleted_at IS NULL")

		if s := c.Query("search"); s != "" {
			query = query.Where("contact_name ILIKE ?", "%"+s+"%")
		}
		if rel := c.Query("relationship"); rel != "" {
			query = query.Where("relationship = ?", rel)
		}
		if did := c.Query("driver_id"); did != "" {
			query = query.Where("driver_id = ?", did)
		}
		if cid := c.Query("customer_id"); cid != "" {
			query = query.Where("customer_id = ?", cid)
		}

		var total int64
		query.Count(&total)
		var data []EmergencyProfile
		query.Order("created_at DESC").Offset((page - 1) * limit).Limit(limit).Find(&data)
		c.JSON(http.StatusOK, gin.H{"success": true, "data": data, "meta": gin.H{
			"total": total, "page": page, "limit": limit, "pages": math.Ceil(float64(total) / float64(limit)),
		}})
	}
}

// POST /api/v1/emergency-profiles — driver_id (nullable), customer_id (nullable), contact_name, relationship, prefix, phone_number
func CreateEmergencyProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			DriverID     *uint  \`json:"driver_id"\`
			CustomerID   *uint  \`json:"customer_id"\`
			ContactName  string \`json:"contact_name" binding:"required"\`
			Prefix       string \`json:"prefix" binding:"required"\`
			PhoneNumber  string \`json:"phone_number" binding:"required"\`
			Relationship string \`json:"relationship" binding:"required"\`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if body.DriverID == nil && body.CustomerID == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Either driver_id or customer_id is required"})
			return
		}
		var count int64
		q := db.Model(&EmergencyProfile{}).Where("deleted_at IS NULL")
		if body.DriverID != nil { q = q.Where("driver_id = ?", *body.DriverID) }
		if body.CustomerID != nil { q = q.Where("customer_id = ?", *body.CustomerID) }
		q.Count(&count)
		if count >= 3 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Maximum 3 emergency contacts per driver/customer"})
			return
		}
		profile := EmergencyProfile{
			DriverID: body.DriverID, CustomerID: body.CustomerID,
			ContactName: strings.TrimSpace(body.ContactName),
			Prefix: body.Prefix, PhoneNumber: strings.TrimSpace(body.PhoneNumber),
			Relationship: body.Relationship, Status: "UNDER_REVIEW",
		}
		db.Create(&profile)
		c.JSON(http.StatusCreated, gin.H{"success": true, "data": profile})
	}
}`,

    ruby: `# emergency_profiles_controller.rb — Ruby on Rails
class Api::V1::EmergencyProfilesController < ApplicationController
  # GET /api/v1/emergency-profiles
  def index
    profiles = EmergencyProfile.where(deleted_at: nil).includes(:driver, :customer)
    profiles = profiles.where("contact_name ILIKE ?", "%#{params[:search]}%") if params[:search].present?
    profiles = profiles.where(relationship: params[:relationship]) if params[:relationship].present?
    profiles = profiles.where(driver_id: params[:driver_id]) if params[:driver_id].present?
    profiles = profiles.where(customer_id: params[:customer_id]) if params[:customer_id].present?

    page = (params[:page] || 1).to_i
    limit = (params[:limit] || 20).to_i
    total = profiles.count
    data = profiles.order(created_at: :desc).offset((page - 1) * limit).limit(limit)

    render json: { success: true, data: data.as_json(include: [:driver, :customer]), meta: { total:, page:, limit: } }
  end

  # POST /api/v1/emergency-profiles — driver_id (nullable), customer_id (nullable), contact_name, relationship, prefix, phone_number
  def create
    unless params[:driver_id].present? || params[:customer_id].present?
      return render json: { error: "Either driver_id or customer_id is required" }, status: 400
    end

    owner_scope = EmergencyProfile.where(deleted_at: nil)
    owner_scope = owner_scope.where(driver_id: params[:driver_id]) if params[:driver_id].present?
    owner_scope = owner_scope.where(customer_id: params[:customer_id]) if params[:customer_id].present?
    return render json: { error: "Maximum 3 emergency contacts per driver/customer" }, status: 400 if owner_scope.count >= 3

    profile = EmergencyProfile.create!(
      driver_id: params[:driver_id],       # nullable
      customer_id: params[:customer_id],   # nullable
      contact_name: params[:contact_name]&.strip,
      prefix: params[:prefix],
      phone_number: params[:phone_number]&.strip,
      relationship: params[:relationship],
      status: "UNDER_REVIEW"
    )
    render json: { success: true, data: profile }, status: :created
  end

  # PUT /api/v1/emergency-profiles/:id
  def update
    profile = EmergencyProfile.where(deleted_at: nil).find(params[:id])
    profile.update!(profile_params)
    render json: { success: true, data: profile.reload }
  end

  # DELETE /api/v1/emergency-profiles/:id (soft delete)
  def destroy
    profile = EmergencyProfile.where(deleted_at: nil).find(params[:id])
    profile.update!(deleted_at: Time.current)
    render json: { success: true, message: "Emergency contact deleted" }
  end

  private
  def profile_params
    params.permit(:contact_name, :prefix, :phone_number, :relationship, :status)
  end
end`,
  };
  return codes[lang];
}

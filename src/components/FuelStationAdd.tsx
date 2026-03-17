import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Highlight, themes } from "prism-react-renderer";
import { Fuel, ArrowLeft, Code2, Copy, Check, X, ChevronDown, Info, Save, Database, MapPin, Plus } from "lucide-react";
import { motion } from "motion/react";
import { type FuelStation } from "./FuelStationList";
import { backendLangConfig, backendLangOptions, type BackendLang } from "./chartBackendCodes";

// ── Station type labels ──
const stationTypeLabels: Record<string, string> = {
  GAS: "Gas",
  PETROL: "Petrol",
  EV: "EV",
  GAS_PETROL: "Gas + Petrol",
  GAS_EV: "Gas + EV",
  PETROL_EV: "Petrol + EV",
  GAS_PETROL_EV: "Gas + Petrol + EV",
};

// ── Fuel sub types per station type ──
const fuelSubTypes: Record<string, string[]> = {
  GAS: ["CNG Type 1", "CNG Type 2", "CNG Type 3", "CNG Type 4", "LPG Autogas", "LPG HD-5", "LPG Commercial"],
  PETROL: ["Octane 91", "Octane 92", "Octane 95", "Octane 97", "Octane 100", "Standard Diesel", "Premium Diesel", "Bio Diesel B5", "Bio Diesel B20"],
  EV: ["EV DC Fast 50kW", "EV DC Fast 150kW", "EV DC Ultra 350kW", "EV AC Level 2"],
  GAS_PETROL: ["CNG Type 1", "CNG Type 2", "CNG Type 3", "CNG Type 4", "LPG Autogas", "LPG HD-5", "LPG Commercial", "Octane 91", "Octane 92", "Octane 95", "Octane 97", "Octane 100", "Standard Diesel", "Premium Diesel", "Bio Diesel B5", "Bio Diesel B20"],
  GAS_EV: ["CNG Type 1", "CNG Type 2", "CNG Type 3", "CNG Type 4", "LPG Autogas", "LPG HD-5", "LPG Commercial", "EV DC Fast 50kW", "EV DC Fast 150kW", "EV DC Ultra 350kW", "EV AC Level 2"],
  PETROL_EV: ["Octane 91", "Octane 92", "Octane 95", "Octane 97", "Octane 100", "Standard Diesel", "Premium Diesel", "Bio Diesel B5", "Bio Diesel B20", "EV DC Fast 50kW", "EV DC Fast 150kW", "EV DC Ultra 350kW", "EV AC Level 2"],
  GAS_PETROL_EV: ["CNG Type 1", "CNG Type 2", "CNG Type 3", "CNG Type 4", "LPG Autogas", "LPG HD-5", "LPG Commercial", "Octane 91", "Octane 92", "Octane 95", "Octane 97", "Octane 100", "Standard Diesel", "Premium Diesel", "Bio Diesel B5", "Bio Diesel B20", "EV DC Fast 50kW", "EV DC Fast 150kW", "EV DC Ultra 350kW", "EV AC Level 2"],
};

// ── Frontend code templates ──
const createReactCode = `// FuelStationAdd.tsx - PrimeReact + React Router
import { useState } from "react";
import { useNavigate } from "react-router";
import { Fuel, ArrowLeft, Save } from "lucide-react";

export function FuelStationAdd() {
  const navigate = useNavigate();
  const [label, setLabel] = useState("");
  const [brand, setBrand] = useState("");
  const [availableFuelType, setAvailableFuelType] = useState<string[]>([]);
  const [stationType, setStationType] = useState("PETROL");
  const [city, setCity] = useState("");
  const [township, setTownship] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [submitted, setSubmitted] = useState(false);

  const handleSave = async () => {
    setSubmitted(true);
    if (!label.trim() || !brand.trim() || !city.trim()) return;

    const res = await fetch("/api/v1/fuel-stations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label, brand, availableFuelType, stationType,
        city, township, latitude: parseFloat(latitude),
        longitude: parseFloat(longitude), description, status,
      }),
    });

    if (res.ok) {
      navigate("/dashboard", { state: { activeItem: "Fuel Station" } });
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>
        <ArrowLeft /> Back to Fuel Stations
      </button>
      <h1>New Fuel Station</h1>
      <form>
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label" />
        <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Brand" />
        <select value={stationType} onChange={e => setStationType(e.target.value)}>
          <option value="GAS">Gas</option>
          <option value="PETROL">Petrol</option>
          <option value="EV">EV</option>
          <option value="GAS_PETROL">Gas + Petrol</option>
          <option value="GAS_EV">Gas + EV</option>
          <option value="PETROL_EV">Petrol + EV</option>
          <option value="GAS_PETROL_EV">Gas + Petrol + EV</option>
        </select>
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
        <input value={township} onChange={e => setTownship(e.target.value)} placeholder="Township" />
        <input type="number" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Latitude" />
        <input type="number" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Longitude" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button onClick={handleSave}>Save</button>
      </form>
    </div>
  );
}`;

const createVueCode = `<!-- FuelStationAdd.vue - PrimeVue + Vue Router -->
<template>
  <div>
    <button @click="router.back()">Back to Fuel Stations</button>
    <h1>New Fuel Station</h1>
    <form @submit.prevent="handleSave">
      <input v-model="label" placeholder="Label" />
      <input v-model="brand" placeholder="Brand" />
      <select v-model="stationType">
        <option value="GAS">Gas</option>
        <option value="PETROL">Petrol</option>
        <option value="EV">EV</option>
        <option value="GAS_PETROL">Gas + Petrol</option>
        <option value="GAS_EV">Gas + EV</option>
        <option value="PETROL_EV">Petrol + EV</option>
        <option value="GAS_PETROL_EV">Gas + Petrol + EV</option>
      </select>
      <input v-model="city" placeholder="City" />
      <input v-model="township" placeholder="Township" />
      <input type="number" v-model="latitude" placeholder="Latitude" />
      <input type="number" v-model="longitude" placeholder="Longitude" />
      <textarea v-model="description" placeholder="Description" />
      <select v-model="status">
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const label = ref("");
const brand = ref("");
const stationType = ref("PETROL");
const city = ref("");
const township = ref("");
const latitude = ref("");
const longitude = ref("");
const description = ref("");
const status = ref("ACTIVE");

const handleSave = async () => {
  const res = await fetch("/api/v1/fuel-stations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      label: label.value, brand: brand.value,
      stationType: stationType.value, city: city.value,
      township: township.value,
      latitude: parseFloat(latitude.value),
      longitude: parseFloat(longitude.value),
      description: description.value, status: status.value,
    }),
  });
  if (res.ok) router.push("/dashboard");
};
</script>`;

const createAngularCode = `// fuel-station-add.component.ts - PrimeNG + Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fuel-station-add',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div>
      <button (click)="goBack()">Back to Fuel Stations</button>
      <h1>New Fuel Station</h1>
      <form (ngSubmit)="handleSave()">
        <input [(ngModel)]="label" name="label" placeholder="Label" />
        <input [(ngModel)]="brand" name="brand" placeholder="Brand" />
        <select [(ngModel)]="stationType" name="stationType">
          <option value="GAS">Gas</option>
          <option value="PETROL">Petrol</option>
          <option value="EV">EV</option>
          <option value="GAS_PETROL">Gas + Petrol</option>
          <option value="GAS_EV">Gas + EV</option>
          <option value="PETROL_EV">Petrol + EV</option>
          <option value="GAS_PETROL_EV">Gas + Petrol + EV</option>
        </select>
        <input [(ngModel)]="city" name="city" placeholder="City" />
        <input [(ngModel)]="township" name="township" placeholder="Township" />
        <input type="number" [(ngModel)]="latitude" name="latitude" placeholder="Latitude" />
        <input type="number" [(ngModel)]="longitude" name="longitude" placeholder="Longitude" />
        <textarea [(ngModel)]="description" name="description" placeholder="Description"></textarea>
        <select [(ngModel)]="status" name="status">
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button type="submit">Save</button>
      </form>
    </div>
  \`
})
export class FuelStationAddComponent {
  label = '';
  brand = '';
  stationType = 'PETROL';
  city = '';
  township = '';
  latitude = '';
  longitude = '';
  description = '';
  status = 'ACTIVE';

  constructor(private http: HttpClient, private router: Router) {}

  goBack(): void {
    this.router.navigate(['/dashboard'], {
      state: { activeItem: 'Fuel Station' },
    });
  }

  handleSave(): void {
    this.http.post('/api/v1/fuel-stations', {
      label: this.label, brand: this.brand,
      stationType: this.stationType, city: this.city,
      township: this.township,
      latitude: parseFloat(this.latitude),
      longitude: parseFloat(this.longitude),
      description: this.description, status: this.status,
    }).subscribe({
      next: () => this.goBack(),
    });
  }
}`;

// ── Backend code templates ──
const createBackendCode: Record<BackendLang, string> = {
  nestjs: `// fuel-stations.controller.ts - NestJS
import { Controller, Post, Body } from '@nestjs/common';
import { FuelStationsService } from './fuel-stations.service';
import { CreateFuelStationDto } from './dto/create-fuel-station.dto';

@Controller('api/v1/fuel-stations')
export class FuelStationsController {
  constructor(private readonly fuelStationsService: FuelStationsService) {}

  @Post()
  async create(@Body() dto: CreateFuelStationDto) {
    const data = await this.fuelStationsService.create(dto);
    return { success: true, data, message: 'Fuel station created successfully' };
  }
}

// create-fuel-station.dto.ts
import { IsString, IsArray, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateFuelStationDto {
  @IsString() label: string;
  @IsString() brand: string;
  @IsArray() availableFuelType: string[];
  @IsString() stationType: string;
  @IsString() city: string;
  @IsString() township: string;
  @IsNumber() latitude: number;
  @IsNumber() longitude: number;
  @IsOptional() @IsString() description?: string;
  @IsString() status: string;
}`,
  express: `// fuel-stations.routes.ts - Express
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

router.post('/api/v1/fuel-stations', async (req: Request, res: Response) => {
  const { label, brand, availableFuelType, stationType, city, township, latitude, longitude, description, status } = req.body;

  const result = await pool.query(
    \`INSERT INTO fuel_stations (label, brand, available_fuel_type, station_type, city, township, latitude, longitude, description, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *\`,
    [label, brand, availableFuelType, stationType, city, township, latitude, longitude, description, status]
  );

  res.status(201).json({ success: true, data: result.rows[0], message: 'Fuel station created successfully' });
});

export default router;`,
  fastapi: `# fuel_stations.py - FastAPI
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from db import database

router = APIRouter(prefix="/api/v1/fuel-stations")

class CreateFuelStationDto(BaseModel):
    label: str
    brand: str
    available_fuel_type: List[str]
    station_type: str
    city: str
    township: str
    latitude: float
    longitude: float
    description: Optional[str] = None
    status: str = "ACTIVE"

@router.post("")
async def create_fuel_station(body: CreateFuelStationDto):
    query = """
      INSERT INTO fuel_stations (label, brand, available_fuel_type, station_type, city, township, latitude, longitude, description, status)
      VALUES (:label, :brand, :available_fuel_type, :station_type, :city, :township, :latitude, :longitude, :description, :status)
      RETURNING *
    """
    row = await database.fetch_one(query, body.dict())
    return {"success": True, "data": dict(row), "message": "Fuel station created successfully"}`,
  gin: `// fuel_stations.go - Gin
package handlers

import (
  "net/http"
  "github.com/gin-gonic/gin"
  "your-app/db"
)

type CreateFuelStationInput struct {
  Label             string   \`json:"label" binding:"required"\`
  Brand             string   \`json:"brand" binding:"required"\`
  AvailableFuelType []string \`json:"available_fuel_type"\`
  StationType       string   \`json:"station_type"\`
  City              string   \`json:"city" binding:"required"\`
  Township          string   \`json:"township"\`
  Latitude          float64  \`json:"latitude"\`
  Longitude         float64  \`json:"longitude"\`
  Description       string   \`json:"description"\`
  Status            string   \`json:"status"\`
}

func CreateFuelStation(c *gin.Context) {
  var input CreateFuelStationInput
  if err := c.ShouldBindJSON(&input); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
    return
  }
  var fs db.FuelStation
  if err := db.DB.Create(&fs).Error; err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create"})
    return
  }
  c.JSON(http.StatusCreated, gin.H{"success": true, "data": fs, "message": "Fuel station created successfully"})
}`,
  springboot: `// FuelStationController.java - Spring Boot
package com.innotaxi.controller;

import com.innotaxi.dto.CreateFuelStationDto;
import com.innotaxi.model.FuelStation;
import com.innotaxi.service.FuelStationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/fuel-stations")
public class FuelStationController {

    private final FuelStationService service;

    public FuelStationController(FuelStationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody CreateFuelStationDto dto) {
        FuelStation fs = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("success", true, "data", fs, "message", "Fuel station created successfully"));
    }
}`,
  laravel: `<?php
// FuelStationController.php - Laravel
namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Models\\FuelStation;
use Illuminate\\Http\\Request;

class FuelStationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:200',
            'brand' => 'required|string|max:100',
            'available_fuel_type' => 'array',
            'station_type' => 'required|string',
            'city' => 'required|string|max:100',
            'township' => 'string|max:100',
            'latitude' => 'numeric',
            'longitude' => 'numeric',
            'description' => 'nullable|string',
            'status' => 'string|in:ACTIVE,INACTIVE',
        ]);

        $fs = FuelStation::create($validated);

        return response()->json([
            'success' => true,
            'data' => $fs,
            'message' => 'Fuel station created successfully',
        ], 201);
    }
}`,
  django: `# views.py - Django REST Framework
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FuelStation
from .serializers import FuelStationSerializer

@api_view(['POST'])
def create_fuel_station(request):
    serializer = FuelStationSerializer(data=request.data)
    if serializer.is_valid():
        fs = serializer.save()
        return Response({
            'success': True,
            'data': FuelStationSerializer(fs).data,
            'message': 'Fuel station created successfully',
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'errors': serializer.errors,
    }, status=status.HTTP_400_BAD_REQUEST)`,
};

const createBackendFileConfig: Record<BackendLang, string> = {
  nestjs: "fuel-stations.controller.ts",
  express: "fuel-stations.routes.ts",
  fastapi: "fuel_stations.py",
  gin: "fuel_stations.go",
  springboot: "FuelStationController.java",
  laravel: "FuelStationController.php",
  django: "views.py",
};

const fuelStationCreateSchema = `-- fuel_stations table schema (PostgreSQL)
-- Endpoint: POST /api/v1/fuel-stations

CREATE TABLE IF NOT EXISTS fuel_stations (
    id                  SERIAL PRIMARY KEY,
    label               VARCHAR(200)  NOT NULL,
    brand               VARCHAR(100)  NOT NULL,
    available_fuel_type TEXT[]        NOT NULL DEFAULT '{}',
    station_type        VARCHAR(30)   NOT NULL DEFAULT 'PETROL',
    city                VARCHAR(100)  NOT NULL,
    township            VARCHAR(100)  NOT NULL,
    latitude            DECIMAL(10,6) NOT NULL DEFAULT 0,
    longitude           DECIMAL(10,6) NOT NULL DEFAULT 0,
    description         TEXT,
    status              VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_fuel_stations_label ON fuel_stations(label);
CREATE INDEX idx_fuel_stations_brand ON fuel_stations(brand);
CREATE INDEX idx_fuel_stations_station_type ON fuel_stations(station_type);
CREATE INDEX idx_fuel_stations_city ON fuel_stations(city);
CREATE INDEX idx_fuel_stations_township ON fuel_stations(township);
CREATE INDEX idx_fuel_stations_status ON fuel_stations(status);
CREATE INDEX idx_fuel_stations_geo ON fuel_stations(latitude, longitude);

-- Example INSERT
INSERT INTO fuel_stations (label, brand, available_fuel_type, station_type, city, township, latitude, longitude, description, status)
VALUES ('New Station', 'PTTEP', '{Octane 92,Octane 95,Standard Diesel}', 'PETROL', 'Yangon', 'Hlaing', 16.84527, 96.12348, 'New fuel station', 'ACTIVE');`;

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

export function FuelStationAdd() {
  const navigate = useNavigate();

  // Code preview state
  const [codePreviewOpen, setCodePreviewOpen] = useState(false);
  const [codeCategory, setCodeCategory] = useState<"frontend" | "backend" | "database">("frontend");
  const [codeFramework, setCodeFramework] = useState<"react" | "vue" | "angular">("react");
  const [backendLang, setBackendLang] = useState<BackendLang>("nestjs");
  const [backendLangOpen, setBackendLangOpen] = useState(false);
  const backendLangRef = useRef<HTMLDivElement>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Form state
  const [formLabel, setFormLabel] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formFuelTypes, setFormFuelTypes] = useState<string[]>([]);
  const [formStationType, setFormStationType] = useState<FuelStation["stationType"]>("PETROL");
  const [formCity, setFormCity] = useState("");
  const [formTownship, setFormTownship] = useState("");
  const [formLatitude, setFormLatitude] = useState("");
  const [formLongitude, setFormLongitude] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // Validation
  const [submitted, setSubmitted] = useState(false);

  // Create notification state
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [createCountdown, setCreateCountdown] = useState(3);

  // Close backend lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backendLangRef.current && !backendLangRef.current.contains(e.target as Node)) {
        setBackendLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Countdown timer for create notification
  useEffect(() => {
    if (!showCreateNotification) return;
    if (createCountdown <= 0) {
      setShowCreateNotification(false);
      return;
    }
    const timer = setTimeout(() => setCreateCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showCreateNotification, createCountdown]);

  // Reset fuel types when station type changes
  useEffect(() => {
    setFormFuelTypes([]);
  }, [formStationType]);

  // Code preview helpers
  const getCode = () => {
    if (codeCategory === "frontend") {
      return { react: createReactCode, vue: createVueCode, angular: createAngularCode }[codeFramework];
    }
    if (codeCategory === "database") {
      return fuelStationCreateSchema;
    }
    return createBackendCode[backendLang];
  };

  const getFilename = () => {
    if (codeCategory === "frontend") {
      return { react: "FuelStationAdd.tsx", vue: "FuelStationAdd.vue", angular: "fuel-station-add.component.ts" }[codeFramework];
    }
    if (codeCategory === "database") {
      return "fuel_stations.sql";
    }
    return createBackendFileConfig[backendLang];
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

  // Handle create action
  const handleCreate = () => {
    setSubmitted(true);
    if (!formLabel.trim() || !formBrand.trim() || !formCity.trim()) return;

    setShowCreateNotification(true);
    setCreateCountdown(3);
    setTimeout(() => {
      sessionStorage.setItem("innotaxi_active_item", "Fuel Station");
      navigate("/dashboard");
    }, 1500);
  };

  // Toggle fuel type
  const toggleFuelType = (ft: string) => {
    setFormFuelTypes((prev) =>
      prev.includes(ft) ? prev.filter((t) => t !== ft) : [...prev, ft]
    );
  };

  return (
    <div>
      {/* Motion-animated Create Notification */}
      {showCreateNotification && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-6 right-6 z-[9999] w-[360px]"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-[#16a34a]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] text-[#0f172a] font-semibold">Fuel Station Created</h4>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  "{formLabel}" has been created successfully. Redirecting...
                </p>
              </div>
              <button
                onClick={() => setShowCreateNotification(false)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="h-1 w-full bg-[#f1f5f9]">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #22c55e, #16a34a)" }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Page Header */}
      <div className="mb-5">
        <button
          onClick={() => { sessionStorage.setItem("innotaxi_active_item", "Fuel Station"); navigate("/dashboard"); }}
          className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fuel Stations
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-[10px] bg-[#ecfdf5] border border-[#bbf7d0] flex items-center justify-center">
              <Fuel className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <h1 className="text-[20px] text-[#0f172a] font-semibold tracking-[-0.2px]">
                New Fuel Station
              </h1>
              <p className="text-[12px] text-[#94a3b8]">
                Create a new fuel station record
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="bg-white rounded-[12px] border border-[#e2e8f0] p-5 mb-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center">
              <Info className="w-4 h-4 text-[#6366f1]" />
            </div>
            <div>
              <h3 className="text-[15px] text-[#0f172a] font-semibold">Fuel Station Information</h3>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">Fill in all required fields to create a new station</p>
            </div>
          </div>
          <button
            onClick={() => setCodePreviewOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#c7d2fe]"
            title="View Create Code"
          >
            <span>&lt;/&gt;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {/* Label */}
          <div>
            <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Label <span className="text-[#e53935]">*</span></label>
            <input
              type="text"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              placeholder="e.g. Shwe Taung Fuel Hub"
              className={`w-full px-3 py-2 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all ${submitted && !formLabel.trim() ? "border-[#e53935]" : "border-[#e2e8f0]"}`}
            />
            {submitted && !formLabel.trim() && <small className="text-[11px] text-[#e53935] mt-1">Label is required</small>}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Brand <span className="text-[#e53935]">*</span></label>
            <input
              type="text"
              value={formBrand}
              onChange={(e) => setFormBrand(e.target.value)}
              placeholder="e.g. PTTEP"
              className={`w-full px-3 py-2 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all ${submitted && !formBrand.trim() ? "border-[#e53935]" : "border-[#e2e8f0]"}`}
            />
            {submitted && !formBrand.trim() && <small className="text-[11px] text-[#e53935] mt-1">Brand is required</small>}
          </div>

          {/* Station Type */}
          <div>
            <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Station Type</label>
            <div className="relative">
              <select
                value={formStationType}
                onChange={(e) => setFormStationType(e.target.value as FuelStation["stationType"])}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all appearance-none cursor-pointer pr-8"
              >
                {Object.entries(stationTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">City <span className="text-[#e53935]">*</span></label>
            <input
              type="text"
              value={formCity}
              onChange={(e) => setFormCity(e.target.value)}
              placeholder="e.g. Yangon"
              className={`w-full px-3 py-2 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all ${submitted && !formCity.trim() ? "border-[#e53935]" : "border-[#e2e8f0]"}`}
            />
            {submitted && !formCity.trim() && <small className="text-[11px] text-[#e53935] mt-1">City is required</small>}
          </div>

          {/* Township */}
          <div>
            <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Township</label>
            <input
              type="text"
              value={formTownship}
              onChange={(e) => setFormTownship(e.target.value)}
              placeholder="e.g. Hlaing"
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Status</label>
            <div className="relative">
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#e53935]" /> Latitude</span>
            </label>
            <input
              type="number"
              step="0.000001"
              value={formLatitude}
              onChange={(e) => setFormLatitude(e.target.value)}
              placeholder="e.g. 16.84527"
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all font-mono"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#e53935]" /> Longitude</span>
            </label>
            <input
              type="number"
              step="0.000001"
              value={formLongitude}
              onChange={(e) => setFormLongitude(e.target.value)}
              placeholder="e.g. 96.12348"
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all font-mono"
            />
          </div>

          {/* Available Fuel Types - checkboxes */}
          <div>
            <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Available Fuel Types</label>
            <div className="flex flex-wrap gap-1.5 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white min-h-[38px]">
              {(fuelSubTypes[formStationType] || ["Octane 92", "Octane 95", "Standard Diesel", "Premium Diesel"]).map((ft) => {
                const selected = formFuelTypes.includes(ft);
                return (
                  <button
                    key={ft}
                    type="button"
                    onClick={() => toggleFuelType(ft)}
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-all cursor-pointer border ${
                      selected
                        ? "bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]"
                        : "bg-[#f8fafc] text-[#94a3b8] border-[#e2e8f0] hover:border-[#cbd5e1]"
                    }`}
                  >
                    {selected && <Check className="w-2.5 h-2.5" />}
                    {ft}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="col-span-full">
            <label className="block text-[11px] text-[#94a3b8] uppercase tracking-[0.3px] font-medium mb-1.5">Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={3}
              placeholder="Enter a description for this fuel station..."
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Create Button */}
        <div className="flex justify-end mt-5 pt-4 border-t border-[#f1f5f9]">
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-medium text-white bg-[#e53935] hover:bg-[#d32f2f] active:bg-[#c62828] transition-all cursor-pointer shadow-[0_1px_3px_rgba(229,57,53,0.3)] hover:shadow-[0_4px_12px_rgba(229,57,53,0.35)]"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Fuel Station
          </button>
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
                <h3 className="text-[13px] text-[#0f172a] font-semibold">Create Fuel Station Code Preview</h3>
                <p className="text-[10px] text-[#94a3b8]">POST /api/v1/fuel-stations</p>
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

          {/* Code Body */}
          <div className="relative">
            <div className="flex items-center gap-1.5 px-5 py-1.5 bg-[#1e293b] text-[10px] text-[#94a3b8] border-b border-[#334155]">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              {getFilename()}
            </div>
            <div className="max-h-[55vh] overflow-auto bg-[#0f172a]">
              <Highlight theme={themes.nightOwl} code={getCode()} language={getLanguage()}>
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre className="p-4 text-[12px] leading-[1.7]">
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })} className="table-row">
                        <span className="table-cell pr-4 text-right text-[#475569] select-none w-[40px]">{i + 1}</span>
                        <span className="table-cell">
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </span>
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

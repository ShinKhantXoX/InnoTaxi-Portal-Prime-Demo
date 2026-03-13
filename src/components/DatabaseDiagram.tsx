import { useState, useRef, useEffect } from "react";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Database,
  GitBranch,
  Key,
  Link2,
  Table,
  Layers,
  ArrowRight,
  Info,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  FileText,
  X,
  Code2,
  Eye,
} from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

// ─── Types ───
type DbEngine = "postgresql" | "mysql" | "sqlserver" | "sqlite" | "mongoose";

interface Column {
  name: string;
  type: string;
  pk?: boolean;
  fk?: string; // e.g. "driver_license_types.id"
  nullable?: boolean;
  unique?: boolean;
  default?: string;
  index?: boolean;
}

interface TableEntity {
  name: string;
  label: string;
  color: string;
  icon: typeof Database;
  columns: Column[];
}

// ─── Copy helper ───
function copyToClipboard(text: string) {
  const fallbackCopy = (t: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = t;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
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

// ─── DB Engine Config ───
const dbEngines: Record<DbEngine, { label: string; icon: string; color: string }> = {
  postgresql: { label: "PostgreSQL", icon: "🐘", color: "#336791" },
  mysql: { label: "MySQL", icon: "🐬", color: "#4479A1" },
  sqlserver: { label: "SQL Server", icon: "🔷", color: "#CC2927" },
  sqlite: { label: "SQLite", icon: "📦", color: "#003B57" },
  mongoose: { label: "Mongoose", icon: "🍃", color: "#47A248" },
};

const dbEngineOptions: DbEngine[] = ["postgresql", "mysql", "sqlserver", "sqlite", "mongoose"];

// ─── Entity Definitions ───
const entities: TableEntity[] = [
  {
    name: "driver_license_types",
    label: "Driver License Types",
    color: "#e53935",
    icon: FileText,
    columns: [
      { name: "id", type: "BIGINT", pk: true },
      { name: "code", type: "VARCHAR(10)", unique: true },
      { name: "name", type: "VARCHAR(255)" },
      { name: "category", type: "VARCHAR(100)" },
      { name: "vehicle_class", type: "VARCHAR(150)" },
      { name: "validity_years", type: "INT", default: "1" },
      { name: "status", type: "ENUM('ACTIVE','INACTIVE')", default: "'ACTIVE'" },
      { name: "created_at", type: "TIMESTAMP", default: "NOW()" },
      { name: "updated_at", type: "TIMESTAMP", default: "NOW()" },
      { name: "deleted_at", type: "TIMESTAMP", nullable: true },
    ],
  },
  {
    name: "drivers",
    label: "Drivers",
    color: "#2563eb",
    icon: Table,
    columns: [
      { name: "id", type: "BIGINT", pk: true },
      { name: "license_type_id", type: "BIGINT", fk: "driver_license_types.id", index: true },
      { name: "full_name", type: "VARCHAR(255)" },
      { name: "nrc_number", type: "VARCHAR(50)", unique: true },
      { name: "phone", type: "VARCHAR(20)" },
      { name: "email", type: "VARCHAR(255)", nullable: true, unique: true },
      { name: "date_of_birth", type: "DATE" },
      { name: "address", type: "TEXT", nullable: true },
      { name: "status", type: "ENUM('ACTIVE','PENDING','SUSPENDED','INACTIVE')", default: "'PENDING'" },
      { name: "license_number", type: "VARCHAR(50)", unique: true },
      { name: "license_issued_at", type: "DATE" },
      { name: "license_expires_at", type: "DATE" },
      { name: "created_at", type: "TIMESTAMP", default: "NOW()" },
      { name: "updated_at", type: "TIMESTAMP", default: "NOW()" },
      { name: "deleted_at", type: "TIMESTAMP", nullable: true },
    ],
  },
  {
    name: "vehicles",
    label: "Vehicles",
    color: "#16a34a",
    icon: Table,
    columns: [
      { name: "id", type: "BIGINT", pk: true },
      { name: "driver_id", type: "BIGINT", fk: "drivers.id", index: true },
      { name: "plate_number", type: "VARCHAR(20)", unique: true },
      { name: "make", type: "VARCHAR(100)" },
      { name: "model", type: "VARCHAR(100)" },
      { name: "year", type: "INT" },
      { name: "color", type: "VARCHAR(50)" },
      { name: "vehicle_type", type: "ENUM('SEDAN','SUV','HATCHBACK','VAN','MOTORCYCLE','THREE_WHEEL')" },
      { name: "status", type: "ENUM('ACTIVE','INACTIVE','MAINTENANCE')", default: "'ACTIVE'" },
      { name: "created_at", type: "TIMESTAMP", default: "NOW()" },
      { name: "updated_at", type: "TIMESTAMP", default: "NOW()" },
      { name: "deleted_at", type: "TIMESTAMP", nullable: true },
    ],
  },
  {
    name: "rides",
    label: "Rides",
    color: "#7c3aed",
    icon: Table,
    columns: [
      { name: "id", type: "BIGINT", pk: true },
      { name: "driver_id", type: "BIGINT", fk: "drivers.id", index: true },
      { name: "passenger_id", type: "BIGINT", fk: "passengers.id", index: true },
      { name: "vehicle_id", type: "BIGINT", fk: "vehicles.id", index: true },
      { name: "pickup_lat", type: "DECIMAL(10,7)" },
      { name: "pickup_lng", type: "DECIMAL(10,7)" },
      { name: "dropoff_lat", type: "DECIMAL(10,7)" },
      { name: "dropoff_lng", type: "DECIMAL(10,7)" },
      { name: "fare_amount", type: "DECIMAL(10,2)" },
      { name: "distance_km", type: "DECIMAL(8,2)" },
      { name: "status", type: "ENUM('REQUESTED','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED')" },
      { name: "started_at", type: "TIMESTAMP", nullable: true },
      { name: "completed_at", type: "TIMESTAMP", nullable: true },
      { name: "created_at", type: "TIMESTAMP", default: "NOW()" },
    ],
  },
  {
    name: "passengers",
    label: "Passengers",
    color: "#d97706",
    icon: Table,
    columns: [
      { name: "id", type: "BIGINT", pk: true },
      { name: "full_name", type: "VARCHAR(255)" },
      { name: "phone", type: "VARCHAR(20)", unique: true },
      { name: "email", type: "VARCHAR(255)", nullable: true },
      { name: "status", type: "ENUM('ACTIVE','INACTIVE')", default: "'ACTIVE'" },
      { name: "created_at", type: "TIMESTAMP", default: "NOW()" },
      { name: "updated_at", type: "TIMESTAMP", default: "NOW()" },
      { name: "deleted_at", type: "TIMESTAMP", nullable: true },
    ],
  },
  {
    name: "audit_logs",
    label: "Audit Logs",
    color: "#64748b",
    icon: Table,
    columns: [
      { name: "id", type: "BIGINT", pk: true },
      { name: "table_name", type: "VARCHAR(100)", index: true },
      { name: "record_id", type: "BIGINT", index: true },
      { name: "action", type: "ENUM('CREATE','UPDATE','DELETE')" },
      { name: "old_values", type: "JSON", nullable: true },
      { name: "new_values", type: "JSON", nullable: true },
      { name: "performed_by", type: "BIGINT", nullable: true },
      { name: "created_at", type: "TIMESTAMP", default: "NOW()" },
    ],
  },
  {
    name: "license_policies",
    label: "License Policies",
    color: "#0891b2",
    icon: Layers,
    columns: [
      { name: "id", type: "BIGINT", pk: true },
      { name: "label", type: "VARCHAR(255)" },
      { name: "description", type: "TEXT", nullable: true },
      { name: "policy_type", type: "ENUM('DRIVER_LICENSE','VEHICLE_LICENSE')", default: "'DRIVER_LICENSE'" },
      { name: "status", type: "ENUM('ACTIVE','INACTIVE')", default: "'ACTIVE'" },
      { name: "created_at", type: "TIMESTAMP", default: "NOW()" },
      { name: "updated_at", type: "TIMESTAMP", default: "NOW()" },
      { name: "deleted_at", type: "TIMESTAMP", nullable: true },
    ],
  },
];

// ─── Relationships ───
const relationships = [
  { from: "drivers", fromCol: "license_type_id", to: "driver_license_types", toCol: "id", type: "N:1" as const, label: "belongs to" },
  { from: "vehicles", fromCol: "driver_id", to: "drivers", toCol: "id", type: "N:1" as const, label: "owned by" },
  { from: "rides", fromCol: "driver_id", to: "drivers", toCol: "id", type: "N:1" as const, label: "driven by" },
  { from: "rides", fromCol: "passenger_id", to: "passengers", toCol: "id", type: "N:1" as const, label: "requested by" },
  { from: "rides", fromCol: "vehicle_id", to: "vehicles", toCol: "id", type: "N:1" as const, label: "uses" },
];

// ─── DDL Code generators ───
function generateDDL(engine: DbEngine): string {
  if (engine === "mongoose") return generateMongooseDDL();
  const lines: string[] = [];
  const autoInc = engine === "postgresql" ? "BIGSERIAL" : engine === "mysql" ? "BIGINT AUTO_INCREMENT" : engine === "sqlserver" ? "BIGINT IDENTITY(1,1)" : "INTEGER";
  const timestampType = engine === "sqlserver" ? "DATETIME2" : "TIMESTAMP";
  const nowFn = engine === "postgresql" ? "NOW()" : engine === "mysql" ? "CURRENT_TIMESTAMP" : engine === "sqlserver" ? "GETDATE()" : "CURRENT_TIMESTAMP";
  const jsonType = engine === "postgresql" ? "JSONB" : engine === "sqlserver" ? "NVARCHAR(MAX)" : engine === "sqlite" ? "TEXT" : "JSON";
  const enumComment = engine === "postgresql" ? "" : "";

  lines.push(`-- ============================================================`);
  lines.push(`-- InnoTaxi Database Schema — ${dbEngines[engine].label}`);
  lines.push(`-- Generated: 2026-03-12`);
  lines.push(`-- Tables: ${entities.length} | Relationships: ${relationships.length}`);
  lines.push(`-- ============================================================\n`);

  if (engine === "postgresql") {
    lines.push(`-- Create custom ENUM types`);
    lines.push(`CREATE TYPE license_status AS ENUM ('ACTIVE', 'INACTIVE');`);
    lines.push(`CREATE TYPE driver_status AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE');`);
    lines.push(`CREATE TYPE vehicle_type AS ENUM ('SEDAN', 'SUV', 'HATCHBACK', 'VAN', 'MOTORCYCLE', 'THREE_WHEEL');`);
    lines.push(`CREATE TYPE vehicle_status AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');`);
    lines.push(`CREATE TYPE ride_status AS ENUM ('REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');`);
    lines.push(`CREATE TYPE audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE');`);
    lines.push(`CREATE TYPE policy_type AS ENUM ('DRIVER_LICENSE', 'VEHICLE_LICENSE');\n`);
  }

  for (const entity of entities) {
    lines.push(`-- ─── ${entity.label} ───`);
    lines.push(`CREATE TABLE ${entity.name} (`);

    const colLines: string[] = [];
    const constraints: string[] = [];

    for (const col of entity.columns) {
      let colType = col.type;

      // Map types per engine
      if (col.pk) {
        colType = autoInc;
      } else if (col.type.startsWith("ENUM")) {
        if (engine === "postgresql") {
          // Use the custom enum type
          const enumMap: Record<string, string> = {
            "ENUM('ACTIVE','INACTIVE')": col.name === "status" && entity.name === "driver_license_types" ? "license_status" : col.name === "status" && entity.name === "passengers" ? "license_status" : col.name === "status" && entity.name === "vehicles" ? "vehicle_status" : col.name === "status" && entity.name === "license_policies" ? "license_status" : "driver_status",
            "ENUM('ACTIVE','PENDING','SUSPENDED','INACTIVE')": "driver_status",
            "ENUM('SEDAN','SUV','HATCHBACK','VAN','MOTORCYCLE','THREE_WHEEL')": "vehicle_type",
            "ENUM('ACTIVE','INACTIVE','MAINTENANCE')": "vehicle_status",
            "ENUM('REQUESTED','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED')": "ride_status",
            "ENUM('CREATE','UPDATE','DELETE')": "audit_action",
            "ENUM('DRIVER_LICENSE','VEHICLE_LICENSE')": "policy_type",
          };
          colType = enumMap[col.type] || "VARCHAR(50)";
        } else if (engine === "sqlserver" || engine === "sqlite") {
          colType = "VARCHAR(50)";
        }
        // MySQL supports ENUM natively
      } else if (col.type === "TIMESTAMP") {
        colType = timestampType;
      } else if (col.type === "JSON") {
        colType = jsonType;
      } else if (col.type === "TEXT" && engine === "sqlserver") {
        colType = "NVARCHAR(MAX)";
      } else if (col.type === "BIGINT" && col.fk) {
        colType = engine === "sqlite" ? "INTEGER" : "BIGINT";
      }

      let colDef = `  ${col.name.padEnd(20)} ${colType}`;

      if (col.pk) {
        colDef += ` PRIMARY KEY`;
      }
      if (!col.nullable && !col.pk) {
        colDef += ` NOT NULL`;
      }
      if (col.unique) {
        colDef += ` UNIQUE`;
      }
      if (col.default) {
        const defVal = col.default === "NOW()" ? nowFn : col.default;
        colDef += ` DEFAULT ${defVal}`;
      }

      colLines.push(colDef);

      // FK constraints
      if (col.fk) {
        const [refTable, refCol] = col.fk.split(".");
        constraints.push(
          `  CONSTRAINT fk_${entity.name}_${col.name} FOREIGN KEY (${col.name}) REFERENCES ${refTable}(${refCol})`
        );
      }
    }

    const allLines = [...colLines, ...constraints];
    lines.push(allLines.join(",\n"));
    lines.push(`);\n`);

    // Indexes
    const indexedCols = entity.columns.filter((c) => c.index && !c.pk);
    for (const col of indexedCols) {
      lines.push(`CREATE INDEX idx_${entity.name}_${col.name} ON ${entity.name}(${col.name});`);
    }

    // Soft-delete index
    if (entity.columns.some((c) => c.name === "deleted_at")) {
      lines.push(`CREATE INDEX idx_${entity.name}_deleted_at ON ${entity.name}(deleted_at);`);
    }

    lines.push("");
  }

  // Comments
  if (engine === "postgresql") {
    lines.push(`-- ─── Table Comments ───`);
    lines.push(`COMMENT ON TABLE driver_license_types IS 'Myanmar driver license type classifications (THA, KA, KHA, GA, GHA, NGA, ZA, HA, SA, INT, TMP)';`);
    lines.push(`COMMENT ON TABLE drivers IS 'Registered taxi drivers with license and status information';`);
    lines.push(`COMMENT ON TABLE vehicles IS 'Vehicles registered to drivers for ride service';`);
    lines.push(`COMMENT ON TABLE rides IS 'Ride transactions between drivers and passengers';`);
    lines.push(`COMMENT ON TABLE passengers IS 'Registered passengers who use the taxi service';`);
    lines.push(`COMMENT ON TABLE audit_logs IS 'Audit trail for all data mutations across tables';`);
    lines.push(`COMMENT ON TABLE license_policies IS 'Policies governing driver and vehicle license issuance, renewal, and compliance';`);
  }

  return lines.join("\n");
}

// ─── Mongoose Schema Generators ───
function mapToMongooseType(col: Column): string {
  if (col.type.includes("BIGINT") || col.type === "INT") return "Number";
  if (col.type.startsWith("VARCHAR") || col.type === "TEXT") return "String";
  if (col.type === "DATE" || col.type === "TIMESTAMP") return "Date";
  if (col.type.startsWith("DECIMAL")) return "mongoose.Types.Decimal128";
  if (col.type.startsWith("ENUM")) {
    const vals = col.type.match(/'([^']+)'/g)?.map((v) => v.replace(/'/g, "")) || [];
    return `String, enum: [${vals.map((v) => `'${v}'`).join(", ")}]`;
  }
  if (col.type === "JSON") return "mongoose.Schema.Types.Mixed";
  return "String";
}

function generateMongooseDDL(): string {
  const lines: string[] = [];
  lines.push(`// ============================================================`);
  lines.push(`// InnoTaxi Database Schema — Mongoose (MongoDB)`);
  lines.push(`// Generated: 2026-03-12`);
  lines.push(`// Collections: ${entities.length} | References: ${relationships.length}`);
  lines.push(`// ============================================================\n`);
  lines.push(`const mongoose = require('mongoose');`);
  lines.push(`const { Schema } = mongoose;\n`);

  for (const entity of entities) {
    lines.push(`// ─── ${entity.label} ───`);
    const schemaName = `${toCamelCase(entity.name)}Schema`;
    lines.push(`const ${schemaName} = new Schema({`);

    for (const col of entity.columns) {
      if (col.name === "id") continue; // MongoDB uses _id automatically
      const mongoType = mapToMongooseType(col);
      const opts: string[] = [];

      if (mongoType.includes("enum:")) {
        opts.push(`type: ${mongoType}`);
      } else if (col.fk) {
        opts.push(`type: Schema.Types.ObjectId`);
        const [refTable] = col.fk.split(".");
        opts.push(`ref: '${toPascalCase(refTable)}'`);
      } else {
        opts.push(`type: ${mongoType}`);
      }

      if (!col.nullable && !col.pk) opts.push(`required: true`);
      if (col.unique) opts.push(`unique: true`);
      if (col.index && !col.unique) opts.push(`index: true`);
      if (col.default) {
        if (col.default === "NOW()") opts.push(`default: Date.now`);
        else opts.push(`default: ${col.default}`);
      }

      lines.push(`  ${col.name}: { ${opts.join(", ")} },`);
    }

    const hasTimestamps = entity.columns.some((c) => c.name === "created_at") && entity.columns.some((c) => c.name === "updated_at");
    lines.push(`}, {`);
    if (hasTimestamps) {
      lines.push(`  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },`);
    }
    lines.push(`  collection: '${entity.name}',`);
    lines.push(`});\n`);

    // Add soft-delete plugin hint
    if (entity.columns.some((c) => c.name === "deleted_at")) {
      lines.push(`// Soft-delete: filter out deleted_at != null by default`);
      lines.push(`${schemaName}.pre(/^find/, function() { this.where({ deleted_at: null }); });\n`);
    }

    // Indexes
    const indexedCols = entity.columns.filter((c) => c.index && !c.pk && !c.unique);
    if (indexedCols.length > 0) {
      for (const col of indexedCols) {
        lines.push(`${schemaName}.index({ ${col.name}: 1 });`);
      }
      lines.push(``);
    }

    lines.push(`const ${toPascalCase(entity.name)} = mongoose.model('${toPascalCase(entity.name)}', ${schemaName});\n`);
  }

  lines.push(`// ─── Exports ───`);
  lines.push(`module.exports = {`);
  for (const entity of entities) {
    lines.push(`  ${toPascalCase(entity.name)},`);
  }
  lines.push(`};`);

  return lines.join("\n");
}

function generateMongooseTableSchema(entity: TableEntity): string {
  const lines: string[] = [];
  lines.push(`// ============================================================`);
  lines.push(`// Collection: ${entity.name} — Mongoose (MongoDB)`);
  lines.push(`// Generated: 2026-03-12`);
  lines.push(`// ============================================================\n`);
  lines.push(`const mongoose = require('mongoose');`);
  lines.push(`const { Schema } = mongoose;\n`);

  const schemaName = `${toCamelCase(entity.name)}Schema`;
  lines.push(`const ${schemaName} = new Schema({`);

  for (const col of entity.columns) {
    if (col.name === "id") continue;
    const mongoType = mapToMongooseType(col);
    const opts: string[] = [];

    if (mongoType.includes("enum:")) {
      opts.push(`type: ${mongoType}`);
    } else if (col.fk) {
      opts.push(`type: Schema.Types.ObjectId`);
      const [refTable] = col.fk.split(".");
      opts.push(`ref: '${toPascalCase(refTable)}'`);
    } else {
      opts.push(`type: ${mongoType}`);
    }

    if (!col.nullable && !col.pk) opts.push(`required: true`);
    if (col.unique) opts.push(`unique: true`);
    if (col.index && !col.unique) opts.push(`index: true`);
    if (col.default) {
      if (col.default === "NOW()") opts.push(`default: Date.now`);
      else opts.push(`default: ${col.default}`);
    }

    lines.push(`  ${col.name}: { ${opts.join(", ")} },`);
  }

  const hasTimestamps = entity.columns.some((c) => c.name === "created_at") && entity.columns.some((c) => c.name === "updated_at");
  lines.push(`}, {`);
  if (hasTimestamps) {
    lines.push(`  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },`);
  }
  lines.push(`  collection: '${entity.name}',`);
  lines.push(`});\n`);

  // Soft-delete
  if (entity.columns.some((c) => c.name === "deleted_at")) {
    lines.push(`// Soft-delete: filter out deleted_at != null by default`);
    lines.push(`${schemaName}.pre(/^find/, function() { this.where({ deleted_at: null }); });\n`);
  }

  // Indexes
  const indexedCols = entity.columns.filter((c) => c.index && !c.pk && !c.unique);
  if (indexedCols.length > 0) {
    for (const col of indexedCols) {
      lines.push(`${schemaName}.index({ ${col.name}: 1 });`);
    }
    lines.push(``);
  }

  // Virtual populate for reverse relations
  const referencedBy = relationships.filter((r) => r.to === entity.name);
  if (referencedBy.length > 0) {
    lines.push(`// ─── Virtual Populate (reverse relations) ───`);
    for (const rel of referencedBy) {
      lines.push(`${schemaName}.virtual('${rel.from}', {`);
      lines.push(`  ref: '${toPascalCase(rel.from)}',`);
      lines.push(`  localField: '_id',`);
      lines.push(`  foreignField: '${rel.fromCol}',`);
      lines.push(`});\n`);
    }
  }

  lines.push(`const ${toPascalCase(entity.name)} = mongoose.model('${toPascalCase(entity.name)}', ${schemaName});\n`);
  lines.push(`module.exports = ${toPascalCase(entity.name)};`);

  return lines.join("\n");
}

// ─── Mermaid ER Diagram Code ───
const mermaidCode = `erDiagram
    driver_license_types {
        bigint id PK
        varchar code UK "THA, KA, KHA, GA, GHA, NGA, ZA, HA, SA, INT, TMP"
        varchar name
        varchar category
        varchar vehicle_class
        int validity_years
        enum status "ACTIVE | INACTIVE"
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    drivers {
        bigint id PK
        bigint license_type_id FK
        varchar full_name
        varchar nrc_number UK
        varchar phone
        varchar email UK
        date date_of_birth
        text address
        enum status "ACTIVE | PENDING | SUSPENDED | INACTIVE"
        varchar license_number UK
        date license_issued_at
        date license_expires_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    vehicles {
        bigint id PK
        bigint driver_id FK
        varchar plate_number UK
        varchar make
        varchar model
        int year
        varchar color
        enum vehicle_type "SEDAN | SUV | HATCHBACK | VAN | MOTORCYCLE | THREE_WHEEL"
        enum status "ACTIVE | INACTIVE | MAINTENANCE"
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    rides {
        bigint id PK
        bigint driver_id FK
        bigint passenger_id FK
        bigint vehicle_id FK
        decimal pickup_lat
        decimal pickup_lng
        decimal dropoff_lat
        decimal dropoff_lng
        decimal fare_amount
        decimal distance_km
        enum status "REQUESTED | ACCEPTED | IN_PROGRESS | COMPLETED | CANCELLED"
        timestamp started_at
        timestamp completed_at
        timestamp created_at
    }

    passengers {
        bigint id PK
        varchar full_name
        varchar phone UK
        varchar email
        enum status "ACTIVE | INACTIVE"
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    audit_logs {
        bigint id PK
        varchar table_name
        bigint record_id
        enum action "CREATE | UPDATE | DELETE"
        jsonb old_values
        jsonb new_values
        bigint performed_by
        timestamp created_at
    }

    driver_license_types ||--o{ drivers : "has many"
    drivers ||--o{ vehicles : "owns"
    drivers ||--o{ rides : "drives"
    passengers ||--o{ rides : "requests"
    vehicles ||--o{ rides : "used in"
`;

// ─── Column Type Icon ───
function getTypeIcon(col: Column) {
  if (col.pk) return <Key className="w-3 h-3 text-[#f59e0b]" />;
  if (col.fk) return <Link2 className="w-3 h-3 text-[#6366f1]" />;
  if (col.type.includes("TIMESTAMP") || col.type === "DATE") return <Calendar className="w-3 h-3 text-[#94a3b8]" />;
  if (col.type.startsWith("ENUM")) return <ToggleLeft className="w-3 h-3 text-[#94a3b8]" />;
  if (col.type.includes("INT") || col.type.includes("DECIMAL")) return <Hash className="w-3 h-3 text-[#94a3b8]" />;
  return <Type className="w-3 h-3 text-[#94a3b8]" />;
}

// ─── Entity Card Component ───
function EntityCard({
  entity,
  expanded,
  onToggle,
}: {
  entity: TableEntity;
  expanded: boolean;
  onToggle: () => void;
}) {
  const pkCount = entity.columns.filter((c) => c.pk).length;
  const fkCount = entity.columns.filter((c) => c.fk).length;
  const nullableCount = entity.columns.filter((c) => c.nullable).length;

  return (
    <div className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: `${entity.color}30` }}>
      {/* Table header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8fafc] transition-colors cursor-pointer"
        style={{ backgroundColor: `${entity.color}08` }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${entity.color}15` }}
        >
          <entity.icon className="w-4 h-4" style={{ color: entity.color }} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] text-[#0f172a] font-semibold">{entity.name}</h3>
            <span className="px-1.5 py-0.5 rounded bg-[#f1f5f9] text-[9px] text-[#64748b] font-mono">
              {entity.columns.length} cols
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-[#f59e0b]">{pkCount} PK</span>
            {fkCount > 0 && <span className="text-[10px] text-[#6366f1]">{fkCount} FK</span>}
            {nullableCount > 0 && <span className="text-[10px] text-[#94a3b8]">{nullableCount} nullable</span>}
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
        )}
      </button>

      {/* Column list */}
      {expanded && (
        <div className="border-t" style={{ borderColor: `${entity.color}20` }}>
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                <th className="px-3 py-1.5 text-left text-[9px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold w-5"></th>
                <th className="px-3 py-1.5 text-left text-[9px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold">Column</th>
                <th className="px-3 py-1.5 text-left text-[9px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold">Type</th>
                <th className="px-3 py-1.5 text-left text-[9px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold hidden sm:table-cell">Constraints</th>
              </tr>
            </thead>
            <tbody>
              {entity.columns.map((col, idx) => (
                <tr
                  key={col.name}
                  className={`border-b border-[#f8fafc] last:border-0 ${idx % 2 === 0 ? "" : "bg-[#fafbfc]"}`}
                >
                  <td className="px-3 py-1.5">{getTypeIcon(col)}</td>
                  <td className="px-3 py-1.5">
                    <code className="text-[11px] text-[#0f172a] font-mono">{col.name}</code>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className="text-[10px] text-[#64748b] font-mono">
                      {col.type.length > 30 ? col.type.substring(0, 30) + "…" : col.type}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {col.pk && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-[#fef3c7] text-[#92400e]">
                          PK
                        </span>
                      )}
                      {col.fk && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-[#eef2ff] text-[#4f46e5]">
                          FK → {col.fk}
                        </span>
                      )}
                      {col.unique && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-[#f0fdf4] text-[#16a34a]">
                          UQ
                        </span>
                      )}
                      {col.nullable && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-[#f1f5f9] text-[#94a3b8]">
                          NULL
                        </span>
                      )}
                      {col.index && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-[#fdf2f8] text-[#be185d]">
                          IDX
                        </span>
                      )}
                      {col.default && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-[#f8fafc] text-[#64748b]">
                          = {col.default}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── ERD Visual Layout Configuration ───
interface ErdNode {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
  keyCols: { name: string; badge: string; badgeColor: string; badgeBg: string }[];
}

interface ErdLine {
  from: string;
  to: string;
  fromSide: "top" | "bottom" | "left" | "right";
  toSide: "top" | "bottom" | "left" | "right";
  label: string;
  fromCard: string;
  toCard: string;
}

const erdNodeDefs: Omit<ErdNode, "keyCols">[] = [
  { name: "driver_license_types", x: 340, y: 20,  w: 230, h: 152, color: "#e53935", label: "driver_license_types" },
  { name: "drivers",       x: 380, y: 260, w: 196, h: 186, color: "#2563eb", label: "drivers" },
  { name: "vehicles",      x: 40,  y: 510, w: 196, h: 168, color: "#16a34a", label: "vehicles" },
  { name: "rides",         x: 380, y: 510, w: 196, h: 176, color: "#7c3aed", label: "rides" },
  { name: "passengers",    x: 720, y: 510, w: 196, h: 156, color: "#d97706", label: "passengers" },
  { name: "audit_logs",    x: 720, y: 90,  w: 196, h: 156, color: "#64748b", label: "audit_logs" },
];

function buildErdNodes(): ErdNode[] {
  return erdNodeDefs.map((def) => {
    const entity = entities.find((e) => e.name === def.name)!;
    const keyCols = entity.columns
      .filter((c) => c.pk || c.fk || c.unique)
      .slice(0, 5)
      .map((c) => ({
        name: c.name,
        badge: c.pk ? "PK" : c.fk ? "FK" : "UQ",
        badgeColor: c.pk ? "#92400e" : c.fk ? "#4f46e5" : "#16a34a",
        badgeBg: c.pk ? "#fef3c7" : c.fk ? "#eef2ff" : "#f0fdf4",
      }));
    return { ...def, keyCols };
  });
}

const erdLines: ErdLine[] = [
  { from: "driver_license_types", to: "drivers",    fromSide: "bottom", toSide: "top",    label: "has many",     fromCard: "1", toCard: "N" },
  { from: "drivers",       to: "vehicles",   fromSide: "bottom", toSide: "top",    label: "owns",         fromCard: "1", toCard: "N" },
  { from: "drivers",       to: "rides",      fromSide: "bottom", toSide: "top",    label: "drives",       fromCard: "1", toCard: "N" },
  { from: "passengers",    to: "rides",      fromSide: "left",   toSide: "right",  label: "requests",     fromCard: "1", toCard: "N" },
  { from: "vehicles",      to: "rides",      fromSide: "right",  toSide: "left",   label: "used in",      fromCard: "1", toCard: "N" },
];

function getAnchorPoint(node: ErdNode, side: "top" | "bottom" | "left" | "right") {
  switch (side) {
    case "top":    return { x: node.x + node.w / 2, y: node.y };
    case "bottom": return { x: node.x + node.w / 2, y: node.y + node.h };
    case "left":   return { x: node.x,               y: node.y + node.h / 2 };
    case "right":  return { x: node.x + node.w,      y: node.y + node.h / 2 };
  }
}

// ─── Backend Language Definitions ───
type BackendLang = "nodejs" | "python" | "java" | "go" | "php" | "ruby" | "csharp" | "sql";

interface LangConfig {
  id: BackendLang;
  label: string;
  filename: (table: string, engine?: string) => string;
  language: string;
  logo: JSX.Element;
}

const nodejsLogo = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M11.998 24c-.321 0-.641-.084-.922-.247L8.14 22.016c-.438-.245-.224-.332-.08-.383.658-.229.791-.281 1.493-.681.074-.041.17-.026.245.019l2.256 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.192-.137-.242L12.134 1.6c-.083-.046-.192-.046-.274 0L3.07 6.68c-.085.049-.139.143-.139.242v10.075c0 .096.054.189.134.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v9.948c0 1.743-.95 2.745-2.604 2.745-.509 0-.909 0-2.026-.55l-2.31-1.33A1.85 1.85 0 0 1 1.335 17V6.921c0-.655.35-1.267.922-1.592L11.052.253a1.906 1.906 0 0 1 1.844 0l8.794 5.076c.572.325.922.937.922 1.592V17c0 .655-.35 1.265-.921 1.591l-8.795 5.076a1.855 1.855 0 0 1-.898.333z"/>
  </svg>
);

const pythonLogo = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.68H3.21l-.33-.12-.27-.2-.21-.25-.16-.29-.12-.32-.09-.34-.06-.34-.04-.34-.02-.33V6.07l.02-.31.04-.29.07-.27.1-.25.13-.23.16-.21.19-.19.22-.17.25-.14.28-.11.31-.09.34-.07.37-.04h8.15zm-3.6 2.56c-.36 0-.66.12-.89.36-.24.24-.36.54-.36.89s.12.66.36.89.53.36.89.36c.35 0 .65-.12.89-.36.23-.23.35-.53.35-.89s-.12-.65-.35-.89a1.22 1.22 0 0 0-.89-.36zM21.1 6.32l.33.12.27.2.21.25.16.29.12.32.09.34.06.34.04.34.02.33v8.26l-.02.31-.04.29-.07.27-.1.25-.13.23-.16.21-.19.19-.22.17-.25.14-.28.11-.31.09-.34.07-.37.04H12l.69-.05.59-.14.5-.22.41-.27.33-.32.27-.35.2-.36.15-.37.1-.35.07-.32.04-.27.02-.21V11.5h4.02l.06-.02h.15l.29-.05.25-.09.22-.14.18-.17.15-.22.11-.24.08-.26.05-.26.03-.26V6.32zm-3.6 12.94c.36 0 .66-.12.89-.36.24-.24.36-.53.36-.89 0-.35-.12-.65-.36-.89a1.22 1.22 0 0 0-.89-.36c-.35 0-.65.12-.89.36-.23.24-.35.54-.35.89 0 .36.12.66.35.89.24.24.54.36.89.36z"/>
  </svg>
);

const javaLogo = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M8.851 18.56s-.917.534.653.714c.575.085 1.239.134 1.897.134 1.075 0 2.131-.187 3.184-.588l-.318.265c-2.893 1.087-6.547-.058-5.416-.525zm-.48-2.398s-1.022.757.542.919c.986.102 2.098.156 3.098-.072l.318.265c-3.607.932-7.622.073-3.958-.841zm3.508-4.042c.917 1.058-.241 2.009-.241 2.009s2.334-1.205 1.263-2.713c-1.001-1.409-1.768-2.109 2.385-4.522 0 0-6.516 1.627-3.407 5.226zm5.054 7.35s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.554 17.462-.7 14.977-1.82zM9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477l-1.121.478c-4.525 1.192-13.27.637-10.756-.581 2.118-1.028 4.033-.77 4.033-.77zm7.973 4.462c4.598-2.39 2.473-4.687.989-4.375-.364.076-.527.142-.527.142s.135-.213.394-.305c2.945-1.035 5.21 3.054-.949 4.674 0 0 .071-.064.093-.136zM14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.889 4.832 0 6.836-2.274-2.053-3.943-3.858-2.824-5.54 1.644-2.468 6.197-3.665 5.189-7.626zM9.734 23.924c4.416.283 11.199-.157 11.363-2.247 0 0-.309.793-3.654 1.423-3.773.71-8.434.627-11.2.172 0 0 .567.469 3.491.652z"/>
  </svg>
);

const goLogo = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.789.514-1.194 1.274-1.182 2.22.012.934.654 1.706 1.577 1.834.795.105 1.46-.175 1.987-.77.105-.13.199-.27.315-.434H10.47c-.245 0-.304-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 0 1 .292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 0 1-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.06 3.096.581.6.41 1.028.94 1.322 1.588.059.117.035.176-.093.222z"/>
  </svg>
);

const phpLogo = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.49 1.005.374 1.757a3.18 3.18 0 0 1-.312.98c-.16.313-.37.588-.598.815zm5.092-.855c.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049zm1.636-1.596h2.65c.797 0 1.378.209 1.744.628.366.418.49 1.005.374 1.757a3.18 3.18 0 0 1-.312.98c-.16.313-.37.588-.598.815-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164h-1.181l-.327 1.681h-1.378l1.23-6.326z"/>
  </svg>
);

const rubyLogo = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M20.156.083c3.033.525 3.893 2.598 3.829 4.77L24 4.822 22.635 22.71 4.89 23.926h.016C3.433 23.864.15 23.729 0 19.139l1.645-3 2.819 6.586.503-8.865 2.939 5.218.434-8.742 3.79 4.958 1.075-7.834 3.587 4.125L17.55.734l2.606-.651z"/>
  </svg>
);

const csharpLogo = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm-.5 3.5h1l.5 3h2l.5-3h1l-.5 3h2v1h-2.17l-.33 2H18v1h-2.17l-.5 3h-1l.5-3h-2l-.5 3h-1l.5-3H9.5v-1h2.33l.34-2H10v-1h2.33zM13.33 8.5h-2l-.33 2h2z"/>
  </svg>
);

const sqlLogo = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 3s-3.58 3-8 3-8-1.34-8-3 3.58-3 8-3zM4 18V15.87c1.68 1.02 4.62 1.63 8 1.63s6.32-.61 8-1.63V18c0 1.1-3.58 2-8 2s-8-.9-8-2zm16-6V9.87c-1.68 1.02-4.62 1.63-8 1.63s-6.32-.61-8-1.63V12c0 1.1 3.58 2 8 2s8-.9 8-2z"/>
  </svg>
);

const backendLangs: LangConfig[] = [
  {
    id: "nodejs",
    label: "Node.js",
    filename: (t) => `models/${t}.model.js`,
    language: "javascript",
    logo: nodejsLogo,
  },
  {
    id: "python",
    label: "Python",
    filename: (t) => `models/${t}.py`,
    language: "python",
    logo: pythonLogo,
  },
  {
    id: "java",
    label: "Java",
    filename: (t) => `${t.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("")}.java`,
    language: "java",
    logo: javaLogo,
  },
  {
    id: "go",
    label: "Go",
    filename: (t) => `models/${t}.go`,
    language: "go",
    logo: goLogo,
  },
  {
    id: "php",
    label: "Laravel",
    filename: (t) => `${t.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("")}.php`,
    language: "php",
    logo: phpLogo,
  },
  {
    id: "ruby",
    label: "Ruby",
    filename: (t) => `app/models/${t.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()).replace(/s$/, "")}.rb`,
    language: "ruby",
    logo: rubyLogo,
  },
  {
    id: "csharp",
    label: "C#",
    filename: (t) => `Models/${t.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("")}.cs`,
    language: "csharp",
    logo: csharpLogo,
  },
  {
    id: "sql",
    label: "SQL",
    filename: (t, engine?: string) => `migrations/${t}${engine ? `.${engine}` : ""}.sql`,
    language: "sql",
    logo: sqlLogo,
  },
];

// ─── Helper: PascalCase ───
function toPascalCase(s: string): string {
  return s.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function toCamelCase(s: string): string {
  const pascal = toPascalCase(s);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// ─── Code Generators per Language ───
function generateNodejsModel(entity: TableEntity): string {
  const lines: string[] = [];
  lines.push(`const { DataTypes } = require('sequelize');`);
  lines.push(`const sequelize = require('../config/database');\n`);

  const rels = relationships.filter((r) => r.from === entity.name);
  const referencedBy = relationships.filter((r) => r.to === entity.name);

  lines.push(`const ${toPascalCase(entity.name)} = sequelize.define('${entity.name}', {`);
  for (const col of entity.columns) {
    const tsType = mapToSequelizeType(col);
    lines.push(`  ${col.name}: {`);
    lines.push(`    type: ${tsType},`);
    if (col.pk) lines.push(`    primaryKey: true,\n    autoIncrement: true,`);
    if (!col.nullable && !col.pk) lines.push(`    allowNull: false,`);
    if (col.unique) lines.push(`    unique: true,`);
    if (col.default) lines.push(`    defaultValue: ${col.default === "NOW()" ? "DataTypes.NOW" : col.default},`);
    if (col.fk) {
      const [refTable, refCol] = col.fk.split(".");
      lines.push(`    references: { model: '${refTable}', key: '${refCol}' },`);
    }
    lines.push(`  },`);
  }
  lines.push(`}, {`);
  lines.push(`  tableName: '${entity.name}',`);
  lines.push(`  timestamps: true,`);
  if (entity.columns.some((c) => c.name === "deleted_at")) {
    lines.push(`  paranoid: true,`);
  }
  lines.push(`  underscored: true,`);
  lines.push(`});\n`);

  // Associations
  if (referencedBy.length > 0 || rels.length > 0) {
    lines.push(`// ─── Associations ───`);
    for (const rel of referencedBy) {
      lines.push(`${toPascalCase(entity.name)}.hasMany(require('./${rel.from}.model'), { foreignKey: '${rel.fromCol}' });`);
    }
    for (const rel of rels) {
      lines.push(`${toPascalCase(entity.name)}.belongsTo(require('./${rel.to}.model'), { foreignKey: '${rel.fromCol}' });`);
    }
    lines.push(``);
  }

  lines.push(`module.exports = ${toPascalCase(entity.name)};`);
  return lines.join("\n");
}

function mapToSequelizeType(col: Column): string {
  if (col.type.includes("BIGINT")) return "DataTypes.BIGINT";
  if (col.type === "INT") return "DataTypes.INTEGER";
  if (col.type.startsWith("VARCHAR")) return `DataTypes.STRING(${col.type.match(/\d+/)?.[0] || 255})`;
  if (col.type === "TEXT") return "DataTypes.TEXT";
  if (col.type === "DATE") return "DataTypes.DATEONLY";
  if (col.type === "TIMESTAMP") return "DataTypes.DATE";
  if (col.type.startsWith("DECIMAL")) return `DataTypes.DECIMAL(${col.type.match(/\((.+)\)/)?.[1] || "10,2"})`;
  if (col.type.startsWith("ENUM")) {
    const vals = col.type.match(/'([^']+)'/g)?.map((v) => v.replace(/'/g, "")) || [];
    return `DataTypes.ENUM(${vals.map((v) => `'${v}'`).join(", ")})`;
  }
  if (col.type === "JSON") return "DataTypes.JSONB";
  return "DataTypes.STRING";
}

function generatePythonModel(entity: TableEntity): string {
  const lines: string[] = [];
  lines.push(`from sqlalchemy import Column, BigInteger, Integer, String, Text, Date, DateTime, Enum, Numeric, JSON, ForeignKey`);
  lines.push(`from sqlalchemy.orm import relationship`);
  lines.push(`from app.database import Base\n`);

  const className = toPascalCase(entity.name);
  lines.push(`class ${className}(Base):`);
  lines.push(`    __tablename__ = '${entity.name}'\n`);

  for (const col of entity.columns) {
    const pyType = mapToPythonType(col);
    let colDef = `    ${col.name} = Column(${pyType}`;
    if (col.pk) colDef += `, primary_key=True, autoincrement=True`;
    if (col.fk) colDef += `, ForeignKey('${col.fk}')`;
    if (!col.nullable && !col.pk) colDef += `, nullable=False`;
    if (col.unique) colDef += `, unique=True`;
    if (col.index) colDef += `, index=True`;
    if (col.default) {
      if (col.default === "NOW()") colDef += `, server_default=func.now()`;
      else colDef += `, default=${col.default}`;
    }
    colDef += `)`;
    lines.push(colDef);
  }

  // Relationships
  const referencedBy = relationships.filter((r) => r.to === entity.name);
  const rels = relationships.filter((r) => r.from === entity.name);
  if (referencedBy.length > 0 || rels.length > 0) {
    lines.push(``);
    lines.push(`    # ─── Relationships ───`);
    for (const rel of referencedBy) {
      lines.push(`    ${rel.from} = relationship('${toPascalCase(rel.from)}', back_populates='${entity.name.replace(/s$/, "")}')`);
    }
    for (const rel of rels) {
      lines.push(`    ${rel.to.replace(/s$/, "")} = relationship('${toPascalCase(rel.to)}', back_populates='${entity.name}')`);
    }
  }

  lines.push(``);
  lines.push(`    def __repr__(self):`);
  lines.push(`        return f'<${className}(id={self.id})>'`);
  return lines.join("\n");
}

function mapToPythonType(col: Column): string {
  if (col.type.includes("BIGINT")) return "BigInteger";
  if (col.type === "INT") return "Integer";
  if (col.type.startsWith("VARCHAR")) return `String(${col.type.match(/\d+/)?.[0] || 255})`;
  if (col.type === "TEXT") return "Text";
  if (col.type === "DATE") return "Date";
  if (col.type === "TIMESTAMP") return "DateTime";
  if (col.type.startsWith("DECIMAL")) return `Numeric(${col.type.match(/\((.+)\)/)?.[1] || "10,2"})`;
  if (col.type.startsWith("ENUM")) {
    const vals = col.type.match(/'([^']+)'/g)?.map((v) => v.replace(/'/g, "")) || [];
    return `Enum(${vals.map((v) => `'${v}'`).join(", ")}, name='${col.name}_enum')`;
  }
  if (col.type === "JSON") return "JSON";
  return "String(255)";
}

function generateJavaModel(entity: TableEntity): string {
  const lines: string[] = [];
  const className = toPascalCase(entity.name);

  lines.push(`package com.innotaxi.model;\n`);
  lines.push(`import jakarta.persistence.*;`);
  lines.push(`import java.math.BigDecimal;`);
  lines.push(`import java.time.LocalDate;`);
  lines.push(`import java.time.LocalDateTime;`);
  lines.push(`import lombok.*;\n`);
  lines.push(`@Entity`);
  lines.push(`@Table(name = "${entity.name}")`);
  lines.push(`@Data`);
  lines.push(`@NoArgsConstructor`);
  lines.push(`@AllArgsConstructor`);
  lines.push(`@Builder`);
  if (entity.columns.some((c) => c.name === "deleted_at")) {
    lines.push(`@SQLDelete(sql = "UPDATE ${entity.name} SET deleted_at = NOW() WHERE id = ?")`);
    lines.push(`@Where(clause = "deleted_at IS NULL")`);
  }
  lines.push(`public class ${className} {\n`);

  for (const col of entity.columns) {
    if (col.pk) {
      lines.push(`    @Id`);
      lines.push(`    @GeneratedValue(strategy = GenerationType.IDENTITY)`);
    }
    if (col.fk) {
      lines.push(`    @ManyToOne(fetch = FetchType.LAZY)`);
      lines.push(`    @JoinColumn(name = "${col.name}")`);
    }
    if (col.unique) {
      lines.push(`    @Column(unique = true)`);
    }
    if (col.type.startsWith("ENUM")) {
      lines.push(`    @Enumerated(EnumType.STRING)`);
    }
    const jType = mapToJavaType(col);
    lines.push(`    private ${jType} ${toCamelCase(col.name)};`);
    lines.push(``);
  }

  lines.push(`}`);
  return lines.join("\n");
}

function mapToJavaType(col: Column): string {
  if (col.type.includes("BIGINT")) return "Long";
  if (col.type === "INT") return "Integer";
  if (col.type.startsWith("VARCHAR")) return "String";
  if (col.type === "TEXT") return "String";
  if (col.type === "DATE") return "LocalDate";
  if (col.type === "TIMESTAMP") return "LocalDateTime";
  if (col.type.startsWith("DECIMAL")) return "BigDecimal";
  if (col.type.startsWith("ENUM")) return "String";
  if (col.type === "JSON") return "String";
  return "String";
}

function generateGoModel(entity: TableEntity): string {
  const lines: string[] = [];
  const structName = toPascalCase(entity.name);

  lines.push(`package models\n`);
  lines.push(`import (`);
  lines.push(`    "time"\n`);
  if (entity.columns.some((c) => c.type.startsWith("DECIMAL"))) {
    lines.push(`    "github.com/shopspring/decimal"`);
  }
  lines.push(`    "gorm.io/gorm"`);
  lines.push(`)\n`);

  lines.push(`// ${structName} represents the ${entity.name} table`);
  lines.push(`type ${structName} struct {`);

  for (const col of entity.columns) {
    const goType = mapToGoType(col);
    const jsonTag = col.name;
    let gormTag = `column:${col.name}`;
    if (col.pk) gormTag += `;primaryKey;autoIncrement`;
    if (!col.nullable && !col.pk) gormTag += `;not null`;
    if (col.unique) gormTag += `;unique`;
    if (col.index) gormTag += `;index`;
    if (col.default) gormTag += `;default:${col.default === "NOW()" ? "CURRENT_TIMESTAMP" : col.default}`;
    if (col.type.startsWith("ENUM")) {
      const vals = col.type.match(/'([^']+)'/g)?.map((v) => v.replace(/'/g, "")) || [];
      gormTag += `;type:enum(${vals.join(",")})`;
    }

    lines.push(`    ${toPascalCase(col.name).padEnd(20)} ${goType.padEnd(18)} \`json:"${jsonTag}" gorm:"${gormTag}"\``);
  }

  // Add relationship fields
  const referencedBy = relationships.filter((r) => r.to === entity.name);
  if (referencedBy.length > 0) {
    lines.push(``);
    lines.push(`    // Associations`);
    for (const rel of referencedBy) {
      lines.push(`    ${toPascalCase(rel.from).padEnd(20)} []${toPascalCase(rel.from).padEnd(15)} \`json:"${rel.from},omitempty" gorm:"foreignKey:${toPascalCase(rel.fromCol)}"\``);
    }
  }

  lines.push(`}\n`);
  lines.push(`// TableName overrides the default table name`);
  lines.push(`func (${structName}) TableName() string {`);
  lines.push(`    return "${entity.name}"`);
  lines.push(`}`);
  return lines.join("\n");
}

function mapToGoType(col: Column): string {
  if (col.nullable && !col.pk) {
    if (col.type.includes("BIGINT") || col.type === "INT") return "*int64";
    if (col.type.startsWith("VARCHAR") || col.type === "TEXT" || col.type.startsWith("ENUM")) return "*string";
    if (col.type === "DATE" || col.type === "TIMESTAMP") return "*time.Time";
    if (col.type.startsWith("DECIMAL")) return "*decimal.Decimal";
    if (col.type === "JSON") return "*string";
  }
  if (col.type.includes("BIGINT") || col.type === "INT") return "int64";
  if (col.type.startsWith("VARCHAR") || col.type === "TEXT" || col.type.startsWith("ENUM")) return "string";
  if (col.type === "DATE" || col.type === "TIMESTAMP") return "time.Time";
  if (col.type.startsWith("DECIMAL")) return "decimal.Decimal";
  if (col.type === "JSON") return "string";
  return "string";
}

function generatePhpModel(entity: TableEntity): string {
  const lines: string[] = [];
  const className = toPascalCase(entity.name);
  const singular = entity.name.replace(/s$/, "");

  lines.push(`<?php\n`);
  lines.push(`namespace App\\Models;\n`);
  lines.push(`use Illuminate\\Database\\Eloquent\\Model;`);
  if (entity.columns.some((c) => c.name === "deleted_at")) {
    lines.push(`use Illuminate\\Database\\Eloquent\\SoftDeletes;`);
  }
  lines.push(`use Illuminate\\Database\\Eloquent\\Relations\\{BelongsTo, HasMany};\n`);
  lines.push(`class ${className} extends Model`);
  lines.push(`{`);
  if (entity.columns.some((c) => c.name === "deleted_at")) {
    lines.push(`    use SoftDeletes;\n`);
  }
  lines.push(`    protected $table = '${entity.name}';\n`);

  const fillable = entity.columns.filter((c) => !c.pk && !["created_at", "updated_at", "deleted_at"].includes(c.name));
  lines.push(`    protected $fillable = [`);
  for (const col of fillable) {
    lines.push(`        '${col.name}',`);
  }
  lines.push(`    ];\n`);

  lines.push(`    protected $casts = [`);
  for (const col of entity.columns) {
    if (col.type === "DATE") lines.push(`        '${col.name}' => 'date',`);
    else if (col.type === "TIMESTAMP" && !["created_at", "updated_at", "deleted_at"].includes(col.name)) lines.push(`        '${col.name}' => 'datetime',`);
    else if (col.type.startsWith("DECIMAL")) lines.push(`        '${col.name}' => 'decimal:2',`);
    else if (col.type === "JSON") lines.push(`        '${col.name}' => 'array',`);
  }
  lines.push(`    ];\n`);

  // Relationships
  const rels = relationships.filter((r) => r.from === entity.name);
  const referencedBy = relationships.filter((r) => r.to === entity.name);

  for (const rel of rels) {
    const relClassName = toPascalCase(rel.to);
    const methodName = toCamelCase(rel.to).replace(/s$/, "");
    lines.push(`    public function ${methodName}(): BelongsTo`);
    lines.push(`    {`);
    lines.push(`        return $this->belongsTo(${relClassName}::class, '${rel.fromCol}');`);
    lines.push(`    }\n`);
  }

  for (const rel of referencedBy) {
    const relClassName = toPascalCase(rel.from);
    const methodName = toCamelCase(rel.from);
    lines.push(`    public function ${methodName}(): HasMany`);
    lines.push(`    {`);
    lines.push(`        return $this->hasMany(${relClassName}::class, '${rel.fromCol}');`);
    lines.push(`    }\n`);
  }

  lines.push(`}`);
  return lines.join("\n");
}

function generateRubyModel(entity: TableEntity): string {
  const lines: string[] = [];
  const className = toPascalCase(entity.name).replace(/s$/, "");

  lines.push(`# frozen_string_literal: true\n`);
  lines.push(`class ${className} < ApplicationRecord`);
  lines.push(`  self.table_name = '${entity.name}'\n`);

  // Associations
  const rels = relationships.filter((r) => r.from === entity.name);
  const referencedBy = relationships.filter((r) => r.to === entity.name);

  for (const rel of rels) {
    const assocName = rel.to.replace(/s$/, "");
    lines.push(`  belongs_to :${assocName}, foreign_key: :${rel.fromCol}`);
  }
  for (const rel of referencedBy) {
    lines.push(`  has_many :${rel.from}, foreign_key: :${rel.fromCol}, dependent: :destroy`);
  }

  if (rels.length > 0 || referencedBy.length > 0) lines.push(``);

  // Validations
  lines.push(`  # ─── Validations ───`);
  for (const col of entity.columns) {
    if (col.pk) continue;
    if (!col.nullable && !col.default) {
      lines.push(`  validates :${col.name}, presence: true`);
    }
    if (col.unique) {
      lines.push(`  validates :${col.name}, uniqueness: true`);
    }
    if (col.type.startsWith("ENUM")) {
      const vals = col.type.match(/'([^']+)'/g)?.map((v) => v.replace(/'/g, "")) || [];
      lines.push(`  validates :${col.name}, inclusion: { in: %w[${vals.join(" ")}] }`);
    }
  }

  lines.push(``);
  lines.push(`  # ─── Scopes ───`);
  lines.push(`  scope :active, -> { where(status: 'ACTIVE') }`) ;
  if (entity.columns.some((c) => c.name === "deleted_at")) {
    lines.push(`  scope :not_deleted, -> { where(deleted_at: nil) }`);
  }

  lines.push(`end`);
  return lines.join("\n");
}

function generateCsharpModel(entity: TableEntity): string {
  const lines: string[] = [];
  const className = toPascalCase(entity.name);

  lines.push(`using System.ComponentModel.DataAnnotations;`);
  lines.push(`using System.ComponentModel.DataAnnotations.Schema;\n`);
  lines.push(`namespace InnoTaxi.Models;\n`);
  lines.push(`[Table("${entity.name}")]`);
  lines.push(`public class ${className}`);
  lines.push(`{`);

  for (const col of entity.columns) {
    if (col.pk) {
      lines.push(`    [Key]`);
      lines.push(`    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]`);
    }
    if (!col.nullable && !col.pk && (col.type.startsWith("VARCHAR") || col.type === "TEXT")) {
      lines.push(`    [Required]`);
    }
    if (col.type.startsWith("VARCHAR")) {
      const len = col.type.match(/\d+/)?.[0] || "255";
      lines.push(`    [MaxLength(${len})]`);
    }
    if (col.fk) {
      const [refTable] = col.fk.split(".");
      lines.push(`    [ForeignKey(nameof(${toPascalCase(refTable.replace(/s$/, ""))}))]`);
    }
    if (col.unique) {
      // EF Core uses fluent API for unique, but we can add a comment
    }
    const csType = mapToCsharpType(col);
    lines.push(`    public ${csType} ${toPascalCase(col.name)} { get; set; }${col.type.startsWith("VARCHAR") || col.type === "TEXT" ? " = string.Empty;" : ""}`);
    lines.push(``);
  }

  // Navigation properties
  const rels = relationships.filter((r) => r.from === entity.name);
  const referencedBy = relationships.filter((r) => r.to === entity.name);

  if (rels.length > 0 || referencedBy.length > 0) {
    lines.push(`    // ─── Navigation Properties ───`);
    for (const rel of rels) {
      const navType = toPascalCase(rel.to).replace(/s$/, "");
      lines.push(`    public virtual ${navType}? ${navType} { get; set; }`);
    }
    for (const rel of referencedBy) {
      lines.push(`    public virtual ICollection<${toPascalCase(rel.from).replace(/s$/, "")}> ${toPascalCase(rel.from)} { get; set; } = new List<${toPascalCase(rel.from).replace(/s$/, "")}>();`);
    }
    lines.push(``);
  }

  lines.push(`}`);
  return lines.join("\n");
}

function mapToCsharpType(col: Column): string {
  const nullable = col.nullable ? "?" : "";
  if (col.type.includes("BIGINT")) return `long${nullable}`;
  if (col.type === "INT") return `int${nullable}`;
  if (col.type.startsWith("VARCHAR") || col.type === "TEXT" || col.type.startsWith("ENUM")) return `string${col.nullable ? "?" : ""}`;
  if (col.type === "DATE" || col.type === "TIMESTAMP") return `DateTime${nullable}`;
  if (col.type.startsWith("DECIMAL")) return `decimal${nullable}`;
  if (col.type === "JSON") return `string${col.nullable ? "?" : ""}`;
  return "string";
}

// ─── Per-Table DDL Generator ───
function generateTableDDL(entity: TableEntity, engine: DbEngine): string {
  if (engine === "mongoose") return generateMongooseTableSchema(entity);
  const autoInc = engine === "postgresql" ? "BIGSERIAL" : engine === "mysql" ? "BIGINT AUTO_INCREMENT" : engine === "sqlserver" ? "BIGINT IDENTITY(1,1)" : "INTEGER";
  const timestampType = engine === "sqlserver" ? "DATETIME2" : "TIMESTAMP";
  const nowFn = engine === "postgresql" ? "NOW()" : engine === "mysql" ? "CURRENT_TIMESTAMP" : engine === "sqlserver" ? "GETDATE()" : "CURRENT_TIMESTAMP";
  const jsonType = engine === "postgresql" ? "JSONB" : engine === "sqlserver" ? "NVARCHAR(MAX)" : engine === "sqlite" ? "TEXT" : "JSON";

  const lines: string[] = [];
  lines.push(`-- ============================================================`);
  lines.push(`-- Table: ${entity.name} — ${dbEngines[engine].label}`);
  lines.push(`-- Generated: 2026-03-12`);
  lines.push(`-- ============================================================\n`);

  // Enum types for PostgreSQL
  if (engine === "postgresql") {
    const enumCols = entity.columns.filter((c) => c.type.startsWith("ENUM"));
    if (enumCols.length > 0) {
      lines.push(`-- Custom ENUM types`);
      const enumMap: Record<string, string> = {
        "ENUM('ACTIVE','INACTIVE')": entity.name === "driver_license_types" || entity.name === "passengers" || entity.name === "license_policies" ? "license_status" : "vehicle_status",
        "ENUM('ACTIVE','PENDING','SUSPENDED','INACTIVE')": "driver_status",
        "ENUM('SEDAN','SUV','HATCHBACK','VAN','MOTORCYCLE','THREE_WHEEL')": "vehicle_type",
        "ENUM('ACTIVE','INACTIVE','MAINTENANCE')": "vehicle_status",
        "ENUM('REQUESTED','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED')": "ride_status",
        "ENUM('CREATE','UPDATE','DELETE')": "audit_action",
        "ENUM('DRIVER_LICENSE','VEHICLE_LICENSE')": "policy_type",
      };
      const seen = new Set<string>();
      for (const col of enumCols) {
        const typeName = enumMap[col.type];
        if (typeName && !seen.has(typeName)) {
          seen.add(typeName);
          const vals = col.type.match(/\('([^)]+)'\)/)?.[1]?.split("','").join("', '") || "";
          lines.push(`CREATE TYPE ${typeName} AS ENUM ('${vals}');`);
        }
      }
      lines.push("");
    }
  }

  lines.push(`CREATE TABLE ${entity.name} (`);

  const colLines: string[] = [];
  const constraints: string[] = [];

  for (const col of entity.columns) {
    let colType = col.type;
    if (col.pk) {
      colType = autoInc;
    } else if (col.type.startsWith("ENUM")) {
      if (engine === "postgresql") {
        const enumMap: Record<string, string> = {
          "ENUM('ACTIVE','INACTIVE')": entity.name === "driver_license_types" || entity.name === "passengers" || entity.name === "license_policies" ? "license_status" : "vehicle_status",
          "ENUM('ACTIVE','PENDING','SUSPENDED','INACTIVE')": "driver_status",
          "ENUM('SEDAN','SUV','HATCHBACK','VAN','MOTORCYCLE','THREE_WHEEL')": "vehicle_type",
          "ENUM('ACTIVE','INACTIVE','MAINTENANCE')": "vehicle_status",
          "ENUM('REQUESTED','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED')": "ride_status",
          "ENUM('CREATE','UPDATE','DELETE')": "audit_action",
          "ENUM('DRIVER_LICENSE','VEHICLE_LICENSE')": "policy_type",
        };
        colType = enumMap[col.type] || "VARCHAR(50)";
      } else if (engine === "sqlserver" || engine === "sqlite") {
        colType = "VARCHAR(50)";
      }
    } else if (col.type === "TIMESTAMP") {
      colType = timestampType;
    } else if (col.type === "JSON") {
      colType = jsonType;
    } else if (col.type === "TEXT" && engine === "sqlserver") {
      colType = "NVARCHAR(MAX)";
    } else if (col.type === "BIGINT" && col.fk) {
      colType = engine === "sqlite" ? "INTEGER" : "BIGINT";
    }

    let colDef = `  ${col.name.padEnd(20)} ${colType}`;
    if (col.pk) colDef += ` PRIMARY KEY`;
    if (!col.nullable && !col.pk) colDef += ` NOT NULL`;
    if (col.unique) colDef += ` UNIQUE`;
    if (col.default) {
      const defVal = col.default === "NOW()" ? nowFn : col.default;
      colDef += ` DEFAULT ${defVal}`;
    }
    colLines.push(colDef);

    if (col.fk) {
      const [refTable, refCol] = col.fk.split(".");
      constraints.push(
        `  CONSTRAINT fk_${entity.name}_${col.name} FOREIGN KEY (${col.name}) REFERENCES ${refTable}(${refCol})`
      );
    }
  }

  const allLines = [...colLines, ...constraints];
  lines.push(allLines.join(",\n"));
  lines.push(`);\n`);

  // Indexes
  const indexedCols = entity.columns.filter((c) => c.index && !c.pk);
  for (const col of indexedCols) {
    lines.push(`CREATE INDEX idx_${entity.name}_${col.name} ON ${entity.name}(${col.name});`);
  }
  if (entity.columns.some((c) => c.name === "deleted_at")) {
    lines.push(`CREATE INDEX idx_${entity.name}_deleted_at ON ${entity.name}(deleted_at);`);
  }

  // PostgreSQL comments
  if (engine === "postgresql") {
    const commentMap: Record<string, string> = {
      driver_license_types: "Myanmar driver license type classifications (THA, KA, KHA, GA, GHA, NGA, ZA, HA, SA, INT, TMP)",
      drivers: "Registered taxi drivers with license and status information",
      vehicles: "Vehicles registered to drivers for ride service",
      rides: "Ride transactions between drivers and passengers",
      passengers: "Registered passengers who use the taxi service",
      audit_logs: "Audit trail for all data mutations across tables",
    };
    if (commentMap[entity.name]) {
      lines.push(`\nCOMMENT ON TABLE ${entity.name} IS '${commentMap[entity.name]}';`);
    }
  }

  return lines.join("\n");
}

function generateSchemaCode(entity: TableEntity, lang: BackendLang, engine?: DbEngine): string {
  switch (lang) {
    case "nodejs": return generateNodejsModel(entity);
    case "python": return generatePythonModel(entity);
    case "java":   return generateJavaModel(entity);
    case "go":     return generateGoModel(entity);
    case "php":    return generatePhpModel(entity);
    case "ruby":   return generateRubyModel(entity);
    case "csharp": return generateCsharpModel(entity);
    case "sql":    return generateTableDDL(entity, engine || "postgresql");
  }
}

// ─── Schema Code Preview Dialog ───
function SchemaCodePreviewDialog({
  tableName,
  onClose,
}: {
  tableName: string;
  onClose: () => void;
}) {
  const entity = entities.find((e) => e.name === tableName);
  const [activeLang, setActiveLang] = useState<BackendLang>("nodejs");
  const [dbEngine, setDbEngine] = useState<DbEngine>("postgresql");
  const [dbDropdownOpen, setDbDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDbDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!entity) return null;

  const code = generateSchemaCode(entity, activeLang, dbEngine);
  const langConfig = backendLangs.find((l) => l.id === activeLang)!;

  const handleCopy = () => {
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] overflow-hidden w-full max-w-[820px] max-h-[85vh] flex flex-col"
        style={{ animation: "fadeInScale 0.2s ease-out" }}
      >
        {/* Dialog Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${entity.color}15` }}
            >
              <Database className="w-4 h-4" style={{ color: entity.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] text-[#0f172a] font-semibold">{entity.name}</h3>
                <span className="px-1.5 py-0.5 rounded bg-[#f1f5f9] text-[9px] text-[#64748b] font-mono">
                  {entity.columns.length} columns
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">Schema model code preview — {entity.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Database Engine Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDbDropdownOpen(!dbDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] text-[#0f172a] transition-colors cursor-pointer"
              >
                <span className="text-[13px]">{dbEngines[dbEngine].icon}</span>
                <span>{dbEngines[dbEngine].label}</span>
                <ChevronDown className={`w-3 h-3 text-[#94a3b8] transition-transform ${dbDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dbDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50" style={{ animation: "fadeInScale 0.15s ease-out" }}>
                  {dbEngineOptions.map((eng) => (
                    <button
                      key={eng}
                      onClick={() => {
                        setDbEngine(eng);
                        setDbDropdownOpen(false);
                        setCopied(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] transition-colors cursor-pointer ${
                        dbEngine === eng
                          ? "bg-[#f1f5f9] text-[#0f172a] font-semibold"
                          : "text-[#475569] hover:bg-[#f8fafc]"
                      }`}
                    >
                      <span className="text-[14px]">{dbEngines[eng].icon}</span>
                      <span>{dbEngines[eng].label}</span>
                      {dbEngine === eng && (
                        <Check className="w-3 h-3 text-[#6366f1] ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Language Pill Tabs */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
          <div className="flex items-center gap-1 flex-wrap">
            {backendLangs.map((lang) => {
              const isActive = activeLang === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => {
                    setActiveLang(lang.id);
                    setCopied(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0f172a] text-white shadow-sm"
                      : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-[#94a3b8]"}>{lang.logo}</span>
                  {lang.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer border shrink-0 ml-2 ${
              copied
                ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
                : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] border-[#e2e8f0]"
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Code Block */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Traffic light dots + filename */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#011627] border-b border-[#1e293b]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
            </div>
            <span className="text-[10px] text-[#64748b] ml-2">{langConfig.filename(entity.name, activeLang === "sql" ? dbEngine : undefined)}</span>
            {activeLang === "sql" && (
              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#64748b]">
                {dbEngines[dbEngine].icon} {dbEngines[dbEngine].label}
              </span>
            )}
          </div>

          {/* Syntax-highlighted code */}
          <div className="flex-1 overflow-auto">
            <Highlight theme={themes.nightOwl} code={code} language={langConfig.language === "csharp" ? "typescript" : langConfig.language === "sql" ? (dbEngine === "mongoose" ? "javascript" : "sql") : langConfig.language}>
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  style={{
                    ...style,
                    margin: 0,
                    padding: "16px",
                    fontSize: "12px",
                    lineHeight: "1.6",
                    minHeight: "100%",
                  }}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      <span className="inline-block w-8 text-right mr-4 text-[#475569] select-none text-[11px]">
                        {i + 1}
                      </span>
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

        {/* Dialog Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#94a3b8]" />
            <span className="text-[10px] text-[#94a3b8]">
              {entity.columns.filter((c) => c.pk).length} PK &middot; {entity.columns.filter((c) => c.fk).length} FK &middot; {entity.columns.filter((c) => c.unique).length} UQ &middot; {entity.columns.filter((c) => c.index).length} IDX
              &middot; {dbEngines[dbEngine].icon} {dbEngines[dbEngine].label}
            </span>
          </div>
          <span className="text-[10px] text-[#94a3b8]">
            Press <kbd className="px-1 py-0.5 rounded bg-[#e2e8f0] text-[9px] font-mono">ESC</kbd> to close
          </span>
        </div>
      </div>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Visual ERD Component ───
function ErdVisual() {
  const nodes = buildErdNodes();
  const canvasW = 960;
  const canvasH = 720;
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-[#fafbfc] overflow-hidden">
      {/* ERD Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-[#6366f1]" />
          <span className="text-[11px] text-[#0f172a] font-semibold">Entity-Relationship Diagram</span>
          <span className="px-1.5 py-0.5 rounded bg-[#f1f5f9] text-[9px] text-[#64748b] font-mono">
            {entities.length} tables &middot; {relationships.length} relations
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-5 h-0 border-t-2 border-dashed border-[#94a3b8]" />
              <span className="text-[9px] text-[#94a3b8]">FK relation</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1 py-0 rounded text-[8px] font-semibold bg-[#fef3c7] text-[#92400e]">PK</span>
              <span className="text-[9px] text-[#94a3b8]">Primary</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1 py-0 rounded text-[8px] font-semibold bg-[#eef2ff] text-[#4f46e5]">FK</span>
              <span className="text-[9px] text-[#94a3b8]">Foreign</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="overflow-auto p-4" style={{ maxHeight: 780 }}>
        <div className="relative mx-auto" style={{ width: canvasW, height: canvasH }}>
          {/* SVG Lines Layer */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={canvasW}
            height={canvasH}
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker
                id="erd-arrow"
                viewBox="0 0 10 7"
                refX="10"
                refY="3.5"
                markerWidth="8"
                markerHeight="6"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
              <marker
                id="erd-arrow-hover"
                viewBox="0 0 10 7"
                refX="10"
                refY="3.5"
                markerWidth="8"
                markerHeight="6"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
              </marker>
            </defs>

            {erdLines.map((line, idx) => {
              const fromNode = nodes.find((n) => n.name === line.from)!;
              const toNode = nodes.find((n) => n.name === line.to)!;
              const from = getAnchorPoint(fromNode, line.fromSide);
              const to = getAnchorPoint(toNode, line.toSide);
              const isHovered = hoveredLine === idx || hoveredNode === line.from || hoveredNode === line.to;

              // Compute control points for smooth cubic bezier curves
              let c1x = from.x, c1y = from.y, c2x = to.x, c2y = to.y;
              const dy = to.y - from.y;
              const dx = to.x - from.x;

              if (line.fromSide === "bottom" && line.toSide === "top") {
                const midY = from.y + dy * 0.5;
                c1x = from.x; c1y = midY;
                c2x = to.x;   c2y = midY;
              } else if (line.fromSide === "left" && line.toSide === "right") {
                const midX = from.x + dx * 0.5;
                c1x = midX; c1y = from.y;
                c2x = midX; c2y = to.y;
              } else if (line.fromSide === "right" && line.toSide === "left") {
                const midX = from.x + dx * 0.5;
                c1x = midX; c1y = from.y;
                c2x = midX; c2y = to.y;
              }

              const pathD = `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;

              // Label position at midpoint of bezier
              const labelX = (from.x + c1x + c2x + to.x) / 4;
              const labelY = (from.y + c1y + c2y + to.y) / 4;

              // Cardinality badge positions
              const card1X = from.x + (c1x - from.x) * 0.2;
              const card1Y = from.y + (c1y - from.y) * 0.2;
              const card2X = to.x + (c2x - to.x) * 0.2;
              const card2Y = to.y + (c2y - to.y) * 0.2;

              return (
                <g key={idx}>
                  {/* Hit area for hover */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={16}
                    style={{ pointerEvents: "stroke", cursor: "pointer" }}
                    onMouseEnter={() => setHoveredLine(idx)}
                    onMouseLeave={() => setHoveredLine(null)}
                  />
                  {/* Visible line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isHovered ? "#6366f1" : "#cbd5e1"}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    strokeDasharray={isHovered ? "none" : "6 3"}
                    markerEnd={isHovered ? "url(#erd-arrow-hover)" : "url(#erd-arrow)"}
                    style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
                  />
                  {/* Relationship label */}
                  <g>
                    <rect
                      x={labelX - 30}
                      y={labelY - 9}
                      width={60}
                      height={18}
                      rx={5}
                      fill={isHovered ? "#eef2ff" : "white"}
                      stroke={isHovered ? "#c7d2fe" : "#e2e8f0"}
                      strokeWidth={1}
                    />
                    <text
                      x={labelX}
                      y={labelY + 4}
                      textAnchor="middle"
                      className="select-none"
                      style={{
                        fontSize: "9px",
                        fill: isHovered ? "#4f46e5" : "#94a3b8",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {line.label}
                    </text>
                  </g>
                  {/* Cardinality - "from" side */}
                  <g>
                    <circle cx={card1X} cy={card1Y} r={9} fill={isHovered ? "#eef2ff" : "white"} stroke={isHovered ? "#c7d2fe" : "#e2e8f0"} strokeWidth={1} />
                    <text
                      x={card1X}
                      y={card1Y + 3.5}
                      textAnchor="middle"
                      className="select-none"
                      style={{
                        fontSize: "9px",
                        fill: isHovered ? "#4f46e5" : "#64748b",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {line.fromCard}
                    </text>
                  </g>
                  {/* Cardinality - "to" side */}
                  <g>
                    <circle cx={card2X} cy={card2Y} r={9} fill={isHovered ? "#eef2ff" : "white"} stroke={isHovered ? "#c7d2fe" : "#e2e8f0"} strokeWidth={1} />
                    <text
                      x={card2X}
                      y={card2Y + 3.5}
                      textAnchor="middle"
                      className="select-none"
                      style={{
                        fontSize: "9px",
                        fill: isHovered ? "#4f46e5" : "#64748b",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {line.toCard}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Entity Node Cards */}
          {nodes.map((node) => {
            const isHover = hoveredNode === node.name;
            const isRelated = erdLines.some(
              (l) =>
                (hoveredNode && (l.from === hoveredNode || l.to === hoveredNode)) &&
                (l.from === node.name || l.to === node.name)
            );
            const highlight = isHover || isRelated;

            return (
              <div
                key={node.name}
                className="absolute rounded-xl border-2 overflow-hidden bg-white transition-all duration-200 cursor-pointer group/card"
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.w,
                  zIndex: highlight ? 10 : 2,
                  borderColor: highlight ? node.color : `${node.color}40`,
                  boxShadow: highlight
                    ? `0 4px 20px ${node.color}25, 0 0 0 3px ${node.color}12`
                    : "0 1px 4px rgba(0,0,0,0.06)",
                  transform: highlight ? "scale(1.02)" : "scale(1)",
                }}
                onMouseEnter={() => setHoveredNode(node.name)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedTable(node.name)}
              >
                {/* Header bar */}
                <div
                  className="px-3 py-2 flex items-center gap-2"
                  style={{ backgroundColor: `${node.color}12` }}
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${node.color}20` }}
                  >
                    <Database className="w-3 h-3" style={{ color: node.color }} />
                  </div>
                  <span
                    className="text-[11px] font-semibold font-mono truncate"
                    style={{ color: node.color }}
                  >
                    {node.label}
                  </span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="text-[9px] text-[#94a3b8] font-mono">
                      {entities.find((e) => e.name === node.name)?.columns.length}
                    </span>
                    <Code2 className="w-3 h-3 text-[#94a3b8] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  </span>
                </div>
                {/* Key columns */}
                <div className="px-2.5 py-1.5 space-y-[3px]">
                  {node.keyCols.map((col) => (
                    <div key={col.name} className="flex items-center gap-1.5">
                      <span
                        className="px-1 py-0 rounded text-[7px] font-bold shrink-0"
                        style={{ color: col.badgeColor, backgroundColor: col.badgeBg }}
                      >
                        {col.badge}
                      </span>
                      <span className="text-[10px] text-[#475569] font-mono truncate">{col.name}</span>
                    </div>
                  ))}
                  {/* "more columns" indicator */}
                  {(() => {
                    const totalCols = entities.find((e) => e.name === node.name)?.columns.length || 0;
                    const shown = node.keyCols.length;
                    const remaining = totalCols - shown;
                    return remaining > 0 ? (
                      <div className="text-[9px] text-[#94a3b8] pl-1 pt-0.5">
                        +{remaining} more columns
                      </div>
                    ) : null;
                  })()}
                </div>
                {/* Click hint footer */}
                <div className="px-2.5 py-1.5 border-t opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-1" style={{ borderColor: `${node.color}15`, backgroundColor: `${node.color}06` }}>
                  <Eye className="w-3 h-3" style={{ color: node.color }} />
                  <span className="text-[9px] font-medium" style={{ color: node.color }}>View Schema Code</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schema Code Preview Dialog */}
      {selectedTable && (
        <SchemaCodePreviewDialog
          tableName={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  );
}

// ─── SQL Code Block Component ───
function SqlCodeBlock({
  title,
  description,
  icon: Icon,
  getCode,
  filename,
}: {
  title: string;
  description: string;
  icon: typeof Database;
  getCode: (engine: DbEngine) => string;
  filename: (engine: DbEngine) => string;
}) {
  const [engine, setEngine] = useState<DbEngine>("postgresql");
  const [engineDropdownOpen, setEngineDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setEngineDropdownOpen(false);
      }
    };
    if (engineDropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [engineDropdownOpen]);

  const code = getCode(engine);
  const cfg = dbEngines[engine];

  const handleCopy = () => {
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e2e8f0]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#eef2ff] flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-[#4f46e5]" />
          </div>
          <div>
            <h3 className="text-[13px] text-[#0f172a] font-semibold">{title}</h3>
            <p className="text-[10px] text-[#94a3b8]">{description}</p>
          </div>
        </div>
      </div>

      {/* Engine dropdown + Copy */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setEngineDropdownOpen(!engineDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a] transition-colors cursor-pointer"
            >
              <span>{cfg.icon}</span>
              {cfg.label}
              <ChevronDown className={`w-3 h-3 transition-transform ${engineDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {engineDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50 min-w-[180px]">
                {dbEngineOptions.map((e) => {
                  const eCfg = dbEngines[e];
                  return (
                    <button
                      key={e}
                      onClick={() => {
                        setEngine(e);
                        setEngineDropdownOpen(false);
                        setCopied(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors cursor-pointer ${
                        engine === e
                          ? "bg-[#fef3c7] text-[#92400e] font-medium"
                          : "text-[#475569] hover:bg-[#f8fafc]"
                      }`}
                    >
                      <span className="text-[12px]">{eCfg.icon}</span>
                      {eCfg.label}
                      {engine === e && <Check className="w-3 h-3 ml-auto text-[#92400e]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer border ${
            copied
              ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
              : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] border-[#e2e8f0]"
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>

      {/* Code block */}
      <div className="overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] border-b border-[#1e293b]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
          </div>
          <span className="text-[10px] text-[#64748b] ml-2">{filename(engine)}</span>
        </div>
        <Highlight theme={themes.vsDark} code={code} language={engine === "mongoose" ? "javascript" : "sql"}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                ...style,
                margin: 0,
                padding: "16px",
                fontSize: "12px",
                lineHeight: "1.6",
                maxHeight: "500px",
                overflow: "auto",
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-8 text-right mr-4 text-[#475569] select-none text-[11px]">
                    {i + 1}
                  </span>
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
  );
}

// ─── Main Page ───
export function DatabaseDiagramAndSchema() {
  const [expandedEntities, setExpandedEntities] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(entities.map((e) => [e.name, true]))
  );
  const [diagramExpanded, setDiagramExpanded] = useState(true);
  const [relExpanded, setRelExpanded] = useState(true);
  const [ddlExpanded, setDdlExpanded] = useState(true);
  const [mermaidExpanded, setMermaidExpanded] = useState(true);
  const [mermaidCopied, setMermaidCopied] = useState(false);

  const toggleEntity = (name: string) => {
    setExpandedEntities((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const totalColumns = entities.reduce((sum, e) => sum + e.columns.length, 0);
  const totalFKs = entities.reduce((sum, e) => sum + e.columns.filter((c) => c.fk).length, 0);
  const totalIndexes = entities.reduce(
    (sum, e) => sum + e.columns.filter((c) => c.index).length + (e.columns.some((c) => c.name === "deleted_at") ? 1 : 0),
    0
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center">
            <GitBranch className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <h1 className="text-[22px] text-[#0f172a] font-semibold tracking-[-0.22px]">
              Database Diagram and Schema
            </h1>
            <p className="text-[13px] text-[#64748b]">
              Entity-Relationship diagram &middot; {entities.length} tables &middot; {totalColumns} columns &middot; {relationships.length} relationships
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Tables", value: entities.length, color: "#e53935", icon: "📊" },
          { label: "Total Columns", value: totalColumns, color: "#2563eb", icon: "📋" },
          { label: "Foreign Keys", value: totalFKs, color: "#6366f1", icon: "🔗" },
          { label: "Indexes", value: totalIndexes, color: "#16a34a", icon: "⚡" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border px-3 py-2.5"
            style={{ borderColor: `${stat.color}25`, backgroundColor: `${stat.color}08` }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[13px]">{stat.icon}</span>
              <span className="text-[11px] font-semibold" style={{ color: stat.color }}>
                {stat.label}
              </span>
            </div>
            <p className="text-[20px] font-semibold text-[#0f172a] mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Relationships Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden mb-4">
        <button
          onClick={() => setRelExpanded(!relExpanded)}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#fef3c7] flex items-center justify-center">
            <Link2 className="w-4 h-4 text-[#d97706]" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] text-[#0f172a] font-semibold">Relationships & ERD</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[10px] text-[#64748b] font-medium">
                {relationships.length} relations
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8]">Visual entity-relationship diagram with foreign key relationships</p>
          </div>
          {relExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
          )}
        </button>

        {relExpanded && (
          <div className="px-5 pb-5 pt-0">
            {/* Visual ERD */}
            <div className="mb-4">
              <ErdVisual />
            </div>

            {/* Relationships Table */}
            <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold">From Table</th>
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold">FK Column</th>
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold hidden sm:table-cell"></th>
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold">To Table</th>
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold">PK Column</th>
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold hidden md:table-cell">Type</th>
                    <th className="px-3 py-2.5 text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold hidden lg:table-cell">Label</th>
                  </tr>
                </thead>
                <tbody>
                  {relationships.map((rel, idx) => {
                    const fromEntity = entities.find((e) => e.name === rel.from);
                    const toEntity = entities.find((e) => e.name === rel.to);
                    return (
                      <tr
                        key={idx}
                        className={`border-b border-[#f1f5f9] last:border-0 ${idx % 2 === 0 ? "" : "bg-[#fafbfc]"}`}
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: fromEntity?.color || "#64748b" }}
                            />
                            <code className="text-[11px] text-[#0f172a] font-mono">{rel.from}</code>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <code className="text-[10px] text-[#6366f1] font-mono">{rel.fromCol}</code>
                        </td>
                        <td className="px-3 py-2 hidden sm:table-cell">
                          <ArrowRight className="w-3.5 h-3.5 text-[#94a3b8]" />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: toEntity?.color || "#64748b" }}
                            />
                            <code className="text-[11px] text-[#0f172a] font-mono">{rel.to}</code>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <code className="text-[10px] text-[#f59e0b] font-mono">{rel.toCol}</code>
                        </td>
                        <td className="px-3 py-2 hidden md:table-cell">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#eef2ff] text-[#4f46e5]">
                            {rel.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 hidden lg:table-cell">
                          <span className="text-[11px] text-[#64748b]">{rel.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Entity Diagram Section */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden mb-4">
        <button
          onClick={() => setDiagramExpanded(!diagramExpanded)}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#6366f1]" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] text-[#0f172a] font-semibold">Entity Overview</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[10px] text-[#64748b] font-medium">
                {entities.length} tables
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8]">All database entities with column definitions, keys, and constraints</p>
          </div>
          {diagramExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
          )}
        </button>

        {diagramExpanded && (
          <div className="px-5 pb-5 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {entities.map((entity) => (
                <EntityCard
                  key={entity.name}
                  entity={entity}
                  expanded={expandedEntities[entity.name] ?? true}
                  onToggle={() => toggleEntity(entity.name)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mermaid ER Diagram Code */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden mb-4">
        <button
          onClick={() => setMermaidExpanded(!mermaidExpanded)}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-[#16a34a]" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] text-[#0f172a] font-semibold">Mermaid ER Diagram</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[10px] text-[#64748b] font-medium">
                Portable
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8]">Copy-paste into any Mermaid-compatible renderer (GitHub, Notion, dbdiagram.io)</p>
          </div>
          {mermaidExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
          )}
        </button>

        {mermaidExpanded && (
          <div className="px-5 pb-5 pt-0">
            <div className="rounded-2xl overflow-hidden border border-[#e2e8f0]">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#f0fdf4] text-[#16a34a]">
                    🧜‍♀️ Mermaid Syntax
                  </span>
                </div>
                <button
                  onClick={() => {
                    copyToClipboard(mermaidCode);
                    setMermaidCopied(true);
                    setTimeout(() => setMermaidCopied(false), 2000);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer border ${
                    mermaidCopied
                      ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
                      : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] border-[#e2e8f0]"
                  }`}
                >
                  {mermaidCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {mermaidCopied ? "Copied!" : "Copy Code"}
                </button>
              </div>

              {/* Code */}
              <div className="overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] border-b border-[#1e293b]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
                  </div>
                  <span className="text-[10px] text-[#64748b] ml-2">er-diagram.mmd</span>
                </div>
                <Highlight theme={themes.vsDark} code={mermaidCode} language="markup">
                  {({ style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                      style={{
                        ...style,
                        margin: 0,
                        padding: "16px",
                        fontSize: "12px",
                        lineHeight: "1.6",
                        maxHeight: "460px",
                        overflow: "auto",
                      }}
                    >
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          <span className="inline-block w-8 text-right mr-4 text-[#475569] select-none text-[11px]">
                            {i + 1}
                          </span>
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
          </div>
        )}
      </div>

      {/* DDL Code Preview */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden mb-4">
        <button
          onClick={() => setDdlExpanded(!ddlExpanded)}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#fef3c7] flex items-center justify-center">
            <Database className="w-4 h-4 text-[#d97706]" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] text-[#0f172a] font-semibold">DDL Schema</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[10px] text-[#64748b] font-medium">
                5 engines
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8]">SQL DDL & Mongoose schemas with constraints, indexes, and engine-specific types</p>
          </div>
          {ddlExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
          )}
        </button>

        {ddlExpanded && (
          <div className="px-5 pb-5 pt-0">
            <SqlCodeBlock
              title="Full Database Schema"
              description={`${entities.length} tables, ${totalColumns} columns, ${relationships.length} FK relationships`}
              icon={Database}
              getCode={(engine) => generateDDL(engine)}
              filename={(engine) =>
                engine === "postgresql"
                  ? "schema.sql"
                  : engine === "mysql"
                  ? "schema.mysql.sql"
                  : engine === "sqlserver"
                  ? "schema.mssql.sql"
                  : engine === "mongoose"
                  ? "models/index.js"
                  : "schema.sqlite.sql"
              }
            />
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
        <Info className="w-4 h-4 text-[#94a3b8] shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] text-[#64748b]">
            This diagram corresponds to the backend API endpoints defined in the{" "}
            <span className="text-[#e53935] font-medium">Backend Development</span> page.
            All tables use soft deletes (<code className="text-[10px] bg-[#f1f5f9] px-1 rounded font-mono">deleted_at</code>),
            timestamp tracking, and follow the same entity structure used in the REST API code previews.
          </p>
          <p className="text-[10px] text-[#94a3b8] mt-1">
            License type codes: THA, KA, KHA, GA, GHA, NGA, ZA, HA, SA, INT, TMP
          </p>
        </div>
      </div>
    </div>
  );
}
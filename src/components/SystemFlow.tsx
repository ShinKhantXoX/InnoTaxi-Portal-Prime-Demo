import { useState, useRef, useEffect } from "react";
import {
  ArrowRightLeft,
  Users,
  Car,
  Shield,
  MapPin,
  CreditCard,
  Bell,
  Star,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  X,
  Info,
  ArrowRight,
  Smartphone,
  Server,
  Database,
  Globe,
  Zap,
  Lock,
  RefreshCw,
  FileText,
  ShieldAlert,
  Phone,
} from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

// ─── Types ───
interface FlowStep {
  id: string;
  label: string;
  description: string;
  actor: string;
  type: "action" | "decision" | "process" | "data" | "notification";
}

interface SystemFlowData {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: typeof Users;
  color: string;
  actors: string[];
  steps: FlowStep[];
  mermaidCode: string;
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

// ─── Flow Data ───
const systemFlows: SystemFlowData[] = [
  {
    id: "driver-registration",
    title: "Driver Registration Flow",
    description: "End-to-end process from driver sign-up to account activation, including license verification and profile approval.",
    category: "Driver Management",
    icon: Users,
    color: "#e53935",
    actors: ["Driver", "Mobile App", "Backend API", "Admin", "Database"],
    steps: [
      { id: "1", label: "Submit Registration", description: "Driver fills registration form with personal info", actor: "Driver", type: "action" },
      { id: "2", label: "Validate Input", description: "Client-side validation of required fields", actor: "Mobile App", type: "process" },
      { id: "3", label: "POST /api/v1/drivers", description: "Send registration data to backend", actor: "Backend API", type: "data" },
      { id: "4", label: "Check Duplicate", description: "Verify phone/email doesn't already exist", actor: "Backend API", type: "decision" },
      { id: "5", label: "Create Driver Profile", description: "Insert into drivers table with UNDER_REVIEW status", actor: "Database", type: "data" },
      { id: "6", label: "Upload License Photo", description: "Upload driver license document for verification", actor: "Driver", type: "action" },
      { id: "7", label: "Create License Profile", description: "Insert into driver_license_profiles with issue_date and expired_at", actor: "Database", type: "data" },
      { id: "8", label: "Admin Review", description: "Admin reviews driver profile and license documents", actor: "Admin", type: "decision" },
      { id: "9", label: "Update Status", description: "Set driver_profile_status to APPROVED or REJECT", actor: "Admin", type: "action" },
      { id: "10", label: "Send Notification", description: "Notify driver of approval/rejection via push notification", actor: "Backend API", type: "notification" },
    ],
    mermaidCode: `sequenceDiagram
    participant D as Driver
    participant App as Mobile App
    participant API as Backend API
    participant DB as Database
    participant Admin as Admin Panel

    D->>App: Fill registration form
    App->>App: Validate input fields
    App->>API: POST /api/v1/drivers
    API->>DB: Check duplicate (phone/email)
    alt Duplicate found
        DB-->>API: Conflict error
        API-->>App: 409 Conflict
        App-->>D: Show error message
    else No duplicate
        DB-->>API: OK
        API->>DB: INSERT INTO drivers (status: UNDER_REVIEW)
        DB-->>API: Driver created
        API-->>App: 201 Created
        App-->>D: Show success
    end
    D->>App: Upload license photo
    App->>API: POST /api/v1/drivers/:id/license
    API->>DB: INSERT INTO driver_license_profiles
    DB-->>API: License profile created
    Admin->>API: GET /api/v1/drivers?status=UNDER_REVIEW
    API->>DB: SELECT pending drivers
    DB-->>Admin: Driver list
    Admin->>API: PUT /api/v1/drivers/:id/status
    API->>DB: UPDATE driver_profile_status
    API->>D: Push notification (APPROVED/REJECT)`,
  },
  {
    id: "ride-booking",
    title: "Ride Booking Flow",
    description: "Complete ride lifecycle from passenger request through driver matching, trip execution, and payment processing.",
    category: "Ride Management",
    icon: MapPin,
    color: "#2196f3",
    actors: ["Passenger", "Mobile App", "Backend API", "Driver", "Payment Gateway"],
    steps: [
      { id: "1", label: "Request Ride", description: "Passenger enters pickup and destination locations", actor: "Passenger", type: "action" },
      { id: "2", label: "Calculate Fare", description: "Estimate fare based on distance, traffic, and surge pricing", actor: "Backend API", type: "process" },
      { id: "3", label: "Find Nearby Drivers", description: "Query available drivers within radius using geolocation", actor: "Backend API", type: "data" },
      { id: "4", label: "Match Driver", description: "Select optimal driver based on distance and rating", actor: "Backend API", type: "decision" },
      { id: "5", label: "Driver Accepts", description: "Driver receives request and confirms acceptance", actor: "Driver", type: "action" },
      { id: "6", label: "Trip Started", description: "Driver arrives at pickup, passenger confirms start", actor: "Driver", type: "action" },
      { id: "7", label: "Track Trip", description: "Real-time GPS tracking of vehicle during trip", actor: "Mobile App", type: "process" },
      { id: "8", label: "Trip Completed", description: "Driver marks trip as completed at destination", actor: "Driver", type: "action" },
      { id: "9", label: "Process Payment", description: "Charge passenger via selected payment method", actor: "Payment Gateway", type: "data" },
      { id: "10", label: "Rate & Review", description: "Both parties rate and review each other", actor: "Passenger", type: "action" },
    ],
    mermaidCode: `sequenceDiagram
    participant P as Passenger
    participant App as Mobile App
    participant API as Backend API
    participant DB as Database
    participant Dr as Driver
    participant PG as Payment Gateway

    P->>App: Enter pickup & destination
    App->>API: POST /api/v1/rides/estimate
    API->>API: Calculate fare (distance + surge)
    API-->>App: Fare estimate
    P->>App: Confirm booking
    App->>API: POST /api/v1/rides
    API->>DB: Find nearby available drivers
    DB-->>API: Driver list (sorted by distance)
    API->>Dr: Push ride request
    alt Driver accepts
        Dr->>API: PUT /api/v1/rides/:id/accept
        API->>DB: UPDATE ride status = ACCEPTED
        API-->>P: Driver assigned notification
        Dr->>API: PUT /api/v1/rides/:id/arrive
        API-->>P: Driver arrived notification
        P->>App: Confirm pickup
        Dr->>API: PUT /api/v1/rides/:id/start
        API->>DB: UPDATE ride status = IN_PROGRESS
        Note over Dr,P: Real-time GPS tracking
        Dr->>API: PUT /api/v1/rides/:id/complete
        API->>PG: Process payment
        PG-->>API: Payment confirmed
        API->>DB: UPDATE ride status = COMPLETED
        API-->>P: Receipt & rate driver
        API-->>Dr: Rate passenger
    else Driver declines/timeout
        API->>DB: Find next driver
        API->>Dr: Push to next driver
    end`,
  },
  {
    id: "payment-processing",
    title: "Payment Processing Flow",
    description: "Secure payment handling including fare calculation, payment method selection, transaction processing, and receipt generation.",
    category: "Financial",
    icon: CreditCard,
    color: "#4caf50",
    actors: ["Passenger", "Backend API", "Payment Gateway", "Database"],
    steps: [
      { id: "1", label: "Trip Completed", description: "Ride ends and final fare is calculated", actor: "Backend API", type: "process" },
      { id: "2", label: "Apply Promotions", description: "Check and apply any active promo codes or discounts", actor: "Backend API", type: "decision" },
      { id: "3", label: "Select Payment", description: "Use passenger's default or selected payment method", actor: "Passenger", type: "action" },
      { id: "4", label: "Tokenize Card", description: "Securely tokenize payment details", actor: "Payment Gateway", type: "process" },
      { id: "5", label: "Charge Amount", description: "Process the payment transaction", actor: "Payment Gateway", type: "data" },
      { id: "6", label: "Record Transaction", description: "Store transaction record in database", actor: "Database", type: "data" },
      { id: "7", label: "Calculate Commission", description: "Split fare between driver and platform", actor: "Backend API", type: "process" },
      { id: "8", label: "Generate Receipt", description: "Create detailed receipt with breakdown", actor: "Backend API", type: "notification" },
    ],
    mermaidCode: `sequenceDiagram
    participant P as Passenger
    participant API as Backend API
    participant DB as Database
    participant PG as Payment Gateway

    API->>API: Calculate final fare
    API->>DB: Check active promotions
    DB-->>API: Promo details
    API->>API: Apply discount (if valid)
    API->>PG: Create payment intent
    PG->>PG: Tokenize payment method
    PG->>PG: Process charge
    alt Payment successful
        PG-->>API: Payment confirmed
        API->>DB: INSERT INTO transactions
        API->>API: Calculate commission split
        API->>DB: UPDATE driver_wallet (credit)
        API->>DB: INSERT INTO receipts
        API-->>P: Receipt notification
    else Payment failed
        PG-->>API: Payment declined
        API-->>P: Retry payment notification
        API->>DB: Log failed attempt
    end`,
  },
  {
    id: "license-verification",
    title: "License Verification Flow",
    description: "Driver license type validation and verification process with admin review, document verification, and status management.",
    category: "Driver Management",
    icon: Shield,
    color: "#ff9800",
    actors: ["Driver", "Backend API", "Admin", "Database"],
    steps: [
      { id: "1", label: "Submit License", description: "Driver uploads license type document (THA, KA, KHA, etc.)", actor: "Driver", type: "action" },
      { id: "2", label: "Validate Type", description: "Check license type against driver_license_types table", actor: "Backend API", type: "decision" },
      { id: "3", label: "Check Expiry", description: "Verify expired_at date is in the future", actor: "Backend API", type: "decision" },
      { id: "4", label: "Store Document", description: "Save to driver_license_profiles with issue_date", actor: "Database", type: "data" },
      { id: "5", label: "Queue for Review", description: "Add to admin verification queue", actor: "Backend API", type: "process" },
      { id: "6", label: "Verify Document", description: "Admin reviews license authenticity and details", actor: "Admin", type: "decision" },
      { id: "7", label: "Update Status", description: "Set driver_profile_status (APPROVED/REJECT)", actor: "Admin", type: "action" },
      { id: "8", label: "Notify Driver", description: "Send verification result notification", actor: "Backend API", type: "notification" },
    ],
    mermaidCode: `sequenceDiagram
    participant D as Driver
    participant App as Mobile App
    participant API as Backend API
    participant DB as Database
    participant Admin as Admin Panel

    D->>App: Upload license document
    App->>API: POST /api/v1/drivers/:id/license
    API->>DB: SELECT FROM driver_license_types WHERE code = :type
    alt Invalid license type
        DB-->>API: Not found
        API-->>App: 400 Invalid license type
    else Valid type
        API->>API: Check expired_at > NOW()
        alt License expired
            API-->>App: 400 License expired
        else Valid expiry
            API->>DB: INSERT INTO driver_license_profiles
            Note over DB: issue_date, expired_at, status: UNDER_REVIEW
            DB-->>API: Profile created
            API-->>App: 201 Submitted for review
            Admin->>API: GET /api/v1/licenses?status=UNDER_REVIEW
            Admin->>Admin: Review document
            Admin->>API: PUT /api/v1/licenses/:id/verify
            API->>DB: UPDATE driver_profile_status
            API->>D: Push notification (result)
        end
    end`,
  },
  {
    id: "notification-system",
    title: "Notification System Flow",
    description: "Multi-channel notification delivery system handling push notifications, SMS, email, and in-app messaging.",
    category: "Infrastructure",
    icon: Bell,
    color: "#9c27b0",
    actors: ["Backend API", "Notification Service", "FCM/APNs", "SMS Gateway", "Email Service"],
    steps: [
      { id: "1", label: "Trigger Event", description: "System event triggers notification (ride update, payment, etc.)", actor: "Backend API", type: "action" },
      { id: "2", label: "Resolve Template", description: "Select notification template based on event type", actor: "Backend API", type: "process" },
      { id: "3", label: "Check Preferences", description: "Verify user notification preferences and channels", actor: "Backend API", type: "decision" },
      { id: "4", label: "Queue Message", description: "Add to notification queue for async processing", actor: "Backend API", type: "data" },
      { id: "5", label: "Send Push", description: "Deliver via Firebase Cloud Messaging or APNs", actor: "FCM/APNs", type: "notification" },
      { id: "6", label: "Send SMS", description: "Deliver critical notifications via SMS", actor: "SMS Gateway", type: "notification" },
      { id: "7", label: "Store In-App", description: "Save notification for in-app notification center", actor: "Backend API", type: "data" },
    ],
    mermaidCode: `sequenceDiagram
    participant Src as Event Source
    participant API as Backend API
    participant Q as Message Queue
    participant NS as Notification Service
    participant FCM as FCM/APNs
    participant SMS as SMS Gateway
    participant DB as Database

    Src->>API: Trigger event (ride_update, payment, etc.)
    API->>DB: SELECT user notification preferences
    DB-->>API: Preferences (push, sms, in_app)
    API->>API: Resolve template for event type
    API->>Q: Enqueue notification job
    Q->>NS: Process notification
    par Push Notification
        NS->>FCM: Send push notification
        FCM-->>NS: Delivery receipt
    and SMS (if critical)
        NS->>SMS: Send SMS
        SMS-->>NS: Delivery status
    and In-App
        NS->>DB: INSERT INTO notifications
    end
    NS->>DB: UPDATE notification_log (status)`,
  },
  {
    id: "rating-review",
    title: "Rating & Review Flow",
    description: "Post-trip rating and review system for both drivers and passengers, with aggregate score calculation.",
    category: "Ride Management",
    icon: Star,
    color: "#ffc107",
    actors: ["Passenger", "Driver", "Backend API", "Database"],
    steps: [
      { id: "1", label: "Trip Ends", description: "Ride marked as completed", actor: "Backend API", type: "action" },
      { id: "2", label: "Prompt Rating", description: "Show rating dialog to both parties", actor: "Backend API", type: "notification" },
      { id: "3", label: "Submit Rating", description: "Passenger rates driver (1-5 stars + comment)", actor: "Passenger", type: "action" },
      { id: "4", label: "Driver Rates", description: "Driver rates passenger (1-5 stars)", actor: "Driver", type: "action" },
      { id: "5", label: "Store Reviews", description: "Insert into reviews table with ride reference", actor: "Database", type: "data" },
      { id: "6", label: "Update Averages", description: "Recalculate aggregate rating for both parties", actor: "Backend API", type: "process" },
      { id: "7", label: "Flag if Low", description: "Auto-flag if rating drops below threshold", actor: "Backend API", type: "decision" },
    ],
    mermaidCode: `sequenceDiagram
    participant P as Passenger
    participant Dr as Driver
    participant API as Backend API
    participant DB as Database

    API-->>P: Show rating prompt
    API-->>Dr: Show rating prompt
    par Passenger rates
        P->>API: POST /api/v1/reviews (driver_rating: 5, comment)
        API->>DB: INSERT INTO reviews (type: DRIVER)
    and Driver rates
        Dr->>API: POST /api/v1/reviews (passenger_rating: 4)
        API->>DB: INSERT INTO reviews (type: PASSENGER)
    end
    API->>DB: SELECT AVG(rating) for driver
    API->>DB: UPDATE drivers SET avg_rating
    API->>DB: SELECT AVG(rating) for passenger
    API->>DB: UPDATE passengers SET avg_rating
    alt Rating below threshold (< 3.0)
        API->>DB: INSERT INTO flagged_accounts
        API-->>API: Notify admin for review
    end`,
  },
  {
    id: "emergency-contact",
    title: "Emergency Contact Management Flow",
    description: "Driver emergency contact CRUD lifecycle — add, update, and manage up to 3 emergency contacts per driver with contact name, relationship, and phone number with prefix.",
    category: "Driver Management",
    icon: ShieldAlert,
    color: "#dc2626",
    actors: ["Driver", "Mobile App", "Backend API", "Database", "Admin"],
    steps: [
      { id: "1", label: "Open Emergency Contacts", description: "Driver navigates to emergency contact section in profile", actor: "Driver", type: "action" },
      { id: "2", label: "Load Existing Contacts", description: "GET /api/v1/emergency-profiles?driver_id=:id — fetch existing contacts", actor: "Mobile App", type: "data" },
      { id: "3", label: "Add New Contact", description: "Driver fills form: contact_name, relationship, prefix + phone_number", actor: "Driver", type: "action" },
      { id: "4", label: "Validate Input", description: "Client-side validation: required fields, phone format, prefix selection", actor: "Mobile App", type: "process" },
      { id: "5", label: "Check Max Limit", description: "Backend checks max 3 emergency contacts per driver", actor: "Backend API", type: "decision" },
      { id: "6", label: "Store Contact", description: "INSERT INTO emergency_profiles with status UNDER_REVIEW", actor: "Database", type: "data" },
      { id: "7", label: "Confirm Creation", description: "Return success response with created profile data", actor: "Backend API", type: "notification" },
      { id: "8", label: "Update Contact", description: "Driver modifies existing emergency contact details", actor: "Driver", type: "action" },
      { id: "9", label: "Soft Delete Contact", description: "Set deleted_at timestamp instead of removing record", actor: "Database", type: "data" },
      { id: "10", label: "Admin View", description: "Admin can view all emergency contacts for any driver", actor: "Admin", type: "action" },
    ],
    mermaidCode: `sequenceDiagram
    participant D as Driver
    participant App as Mobile App
    participant API as Backend API
    participant DB as Database
    participant Admin as Admin Panel

    D->>App: Open emergency contacts section
    App->>API: GET /api/v1/emergency-profiles?driver_id=:id
    API->>DB: SELECT * FROM emergency_profiles WHERE driver_id = :id AND deleted_at IS NULL
    DB-->>API: Existing contacts (0-3)
    API-->>App: Return contact list

    D->>App: Fill form (contact_name, relationship, prefix, phone_number)
    App->>App: Validate required fields & phone format
    App->>API: POST /api/v1/emergency-profiles
    Note over API: Body: { driver_id, contact_name, prefix, phone_number, relationship }
    API->>DB: SELECT COUNT(*) FROM emergency_profiles WHERE driver_id = :id AND deleted_at IS NULL
    alt Count >= 3
        DB-->>API: Count = 3
        API-->>App: 400 Maximum 3 emergency contacts per driver
        App-->>D: Show limit error
    else Count < 3
        API->>DB: INSERT INTO emergency_profiles (contact_name, prefix, phone_number, relationship, status: UNDER_REVIEW)
        DB-->>API: Profile created
        API-->>App: 201 Created
        App-->>D: Show success notification
    end

    D->>App: Edit existing contact
    App->>API: PUT /api/v1/emergency-profiles/:id
    API->>DB: UPDATE emergency_profiles SET contact_name, prefix, phone_number, relationship
    DB-->>API: Updated
    API-->>App: 200 OK

    D->>App: Delete emergency contact
    App->>API: DELETE /api/v1/emergency-profiles/:id
    API->>DB: UPDATE emergency_profiles SET deleted_at = NOW()
    DB-->>API: Soft deleted
    API-->>App: 200 OK

    Admin->>API: GET /api/v1/emergency-profiles?driver_id=:id
    API->>DB: SELECT with driver relation
    DB-->>Admin: Emergency contact list`,
  },
];

// ─── Step type colors ───
const stepTypeConfig: Record<string, { bg: string; text: string; label: string }> = {
  action: { bg: "#eff6ff", text: "#2563eb", label: "Action" },
  decision: { bg: "#fefce8", text: "#ca8a04", label: "Decision" },
  process: { bg: "#f0fdf4", text: "#16a34a", label: "Process" },
  data: { bg: "#faf5ff", text: "#9333ea", label: "Data" },
  notification: { bg: "#fef2f2", text: "#dc2626", label: "Notification" },
};

// ─── Category filter options ───
const categories = ["All", "Driver Management", "Ride Management", "Financial", "Infrastructure"];

// ─── Code Preview Modal ───
function CodeModal({
  flow,
  open,
  onClose,
}: {
  flow: SystemFlowData;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!open) return null;

  const handleCopy = () => {
    copyToClipboard(flow.mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative bg-white rounded-[16px] border border-[#e2e8f0] shadow-[0_24px_80px_rgba(0,0,0,0.2)] flex flex-col transition-all duration-300 ${
          isFullscreen ? "w-[95vw] h-[92vh]" : "w-[720px] max-h-[80vh]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${flow.color}15` }}
            >
              <ArrowRightLeft className="w-4 h-4" style={{ color: flow.color }} />
            </div>
            <div>
              <p className="text-[13px] text-[#0f172a] font-semibold">{flow.title}</p>
              <p className="text-[11px] text-[#94a3b8]">Mermaid Sequence Diagram</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-[#64748b] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16a34a]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#e53935] hover:bg-[#fef2f2] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Code */}
        <div className="flex-1 overflow-auto p-0">
          <Highlight theme={themes.nightOwl} code={flow.mermaidCode.trim()} language="markdown">
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className="text-[12px] leading-[1.7] p-5 overflow-auto"
                style={{ ...style, background: "#011627", margin: 0, borderRadius: 0 }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="flex">
                    <span className="inline-block w-8 text-right mr-4 text-[#546e7a] select-none text-[11px]">
                      {i + 1}
                    </span>
                    <span>
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
  );
}

// ─── Main Component ───
export function SystemFlow() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFlows, setExpandedFlows] = useState<Record<string, boolean>>({});
  const [codeModalFlow, setCodeModalFlow] = useState<SystemFlowData | null>(null);

  const filteredFlows = selectedCategory === "All"
    ? systemFlows
    : systemFlows.filter((f) => f.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedFlows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="font-['Inter',sans-serif]">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-[10px] bg-[#fef2f2] flex items-center justify-center">
            <ArrowRightLeft className="w-4 h-4 text-[#e53935]" />
          </div>
          <h1 className="text-[22px] text-[#0f172a] tracking-[-0.22px]">
            System Flow
          </h1>
        </div>
        <p className="text-[13px] text-[#64748b] mt-1 ml-10">
          Architecture and sequence diagrams for all major system processes in the InnoTaxi platform.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Flows", value: systemFlows.length.toString(), icon: ArrowRightLeft, color: "#e53935" },
          { label: "Actors", value: [...new Set(systemFlows.flatMap((f) => f.actors))].length.toString(), icon: Users, color: "#2196f3" },
          { label: "Total Steps", value: systemFlows.reduce((a, f) => a + f.steps.length, 0).toString(), icon: Zap, color: "#4caf50" },
          { label: "Categories", value: (categories.length - 1).toString(), icon: FileText, color: "#ff9800" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-[12px] border border-[#e2e8f0] p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}12` }}
              >
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              </div>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-medium">
                {stat.label}
              </p>
            </div>
            <p className="text-[22px] text-[#0f172a] tracking-[-0.44px]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
              selectedCategory === cat
                ? "bg-[#fef2f2] text-[#e53935] border-[#fecaca]"
                : "bg-white text-[#64748b] border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#0f172a]"
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-2 text-[11px] text-[#94a3b8]">
          {filteredFlows.length} flow{filteredFlows.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Flow Cards */}
      <div className="flex flex-col gap-4">
        {filteredFlows.map((flow) => {
          const isExpanded = expandedFlows[flow.id] || false;
          const Icon = flow.icon;

          return (
            <div
              key={flow.id}
              className="bg-white rounded-[14px] border border-[#e2e8f0] overflow-hidden hover:shadow-sm transition-shadow"
            >
              {/* Card Header */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer group"
                onClick={() => toggleExpand(flow.id)}
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${flow.color}12` }}
                >
                  <Icon className="w-5 h-5" style={{ color: flow.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] text-[#0f172a] font-semibold">{flow.title}</h3>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${flow.color}12`, color: flow.color }}
                    >
                      {flow.category}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#94a3b8] mt-0.5 truncate">{flow.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#94a3b8]">{flow.steps.length} steps</span>
                    <span className="text-[#e2e8f0]">·</span>
                    <span className="text-[11px] text-[#94a3b8]">{flow.actors.length} actors</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCodeModalFlow(flow);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-[#64748b] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                    title="View Mermaid code"
                  >
                    <FileText className="w-3 h-3" />
                    Code
                  </button>
                  <ChevronDown
                    className={`w-4 h-4 text-[#94a3b8] transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-[#e2e8f0]">
                  {/* Actors */}
                  <div className="px-5 py-3 bg-[#fafbfc] border-b border-[#f1f5f9]">
                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold mb-2">
                      Actors / Participants
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {flow.actors.map((actor) => {
                        const actorIcons: Record<string, typeof Users> = {
                          Driver: Users,
                          Passenger: Users,
                          Admin: Shield,
                          "Mobile App": Smartphone,
                          "Backend API": Server,
                          Database: Database,
                          "Payment Gateway": CreditCard,
                          "Notification Service": Bell,
                          "FCM/APNs": Bell,
                          "SMS Gateway": Globe,
                          "Email Service": Globe,
                          "Admin Panel": Shield,
                          "Event Source": Zap,
                          "Message Queue": RefreshCw,
                        };
                        const ActorIcon = actorIcons[actor] || Server;
                        return (
                          <div
                            key={actor}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#e2e8f0] text-[11px] text-[#475569] font-medium"
                          >
                            <ActorIcon className="w-3 h-3 text-[#94a3b8]" />
                            {actor}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Steps Timeline */}
                  <div className="px-5 py-4">
                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold mb-3">
                      Flow Steps
                    </p>
                    <div className="flex flex-col gap-0">
                      {flow.steps.map((step, idx) => {
                        const typeConf = stepTypeConfig[step.type];
                        return (
                          <div key={step.id} className="flex gap-3">
                            {/* Timeline line */}
                            <div className="flex flex-col items-center">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 z-10"
                                style={{
                                  backgroundColor: typeConf.bg,
                                  color: typeConf.text,
                                }}
                              >
                                {step.id}
                              </div>
                              {idx < flow.steps.length - 1 && (
                                <div className="w-px flex-1 bg-[#e2e8f0] min-h-[20px]" />
                              )}
                            </div>
                            {/* Content */}
                            <div className="pb-4 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-[13px] text-[#0f172a] font-medium">{step.label}</p>
                                <span
                                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-[0.3px]"
                                  style={{ backgroundColor: typeConf.bg, color: typeConf.text }}
                                >
                                  {typeConf.label}
                                </span>
                                <span className="text-[10px] text-[#94a3b8]">— {step.actor}</span>
                              </div>
                              <p className="text-[12px] text-[#64748b] mt-0.5">{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-[12px] border border-[#e2e8f0] px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-3.5 h-3.5 text-[#94a3b8]" />
          <p className="text-[11px] text-[#94a3b8] uppercase tracking-[0.5px] font-semibold">Step Type Legend</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stepTypeConfig).map(([key, conf]) => (
            <div
              key={key}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#f1f5f9]"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: conf.text }}
              />
              <span className="text-[11px] text-[#475569] font-medium">{conf.label}</span>
              <span className="text-[10px] text-[#94a3b8] capitalize">— {key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code Modal */}
      <CodeModal
        flow={codeModalFlow || systemFlows[0]}
        open={!!codeModalFlow}
        onClose={() => setCodeModalFlow(null)}
      />
    </div>
  );
}
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// --- Admin Auth Helpers ---

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_glory_one_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Initialize default admin if not exists
async function ensureAdminExists() {
  const existing = await kv.get("admin_credentials");
  if (!existing) {
    const hashed = await hashPassword("admin123");
    await kv.set(
      "admin_credentials",
      JSON.stringify({
        username: "admin",
        passwordHash: hashed,
        createdAt: new Date().toISOString(),
      })
    );
    console.log("Default admin created (username: admin, password: admin123)");
  }
}

// Verify admin token middleware helper
async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const session = await kv.get(`admin_session_${token}`);
  if (!session) return false;
  try {
    const parsed = JSON.parse(session);
    // Sessions expire after 24 hours
    if (Date.now() - new Date(parsed.createdAt).getTime() > 24 * 60 * 60 * 1000) {
      await kv.del(`admin_session_${token}`);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Init admin on startup
const adminInitPromise = ensureAdminExists();

// Health check endpoint
app.get("/make-server-55db73c3/health", (c) => {
  return c.json({ status: "ok" });
});

// --- Admin Auth Routes ---

// Admin Login
app.post("/make-server-55db73c3/admin/login", async (c) => {
  try {
    // Ensure admin setup has completed before processing login
    await adminInitPromise;

    const { username, password } = await c.req.json();
    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }

    // Double-check admin exists; create if somehow missing
    let credStr = await kv.get("admin_credentials");
    if (!credStr) {
      await ensureAdminExists();
      credStr = await kv.get("admin_credentials");
    }
    if (!credStr) {
      return c.json({ error: "Admin not configured. Please try again in a moment." }, 500);
    }

    const creds = JSON.parse(credStr);
    const hashed = await hashPassword(password);

    if (username !== creds.username || hashed !== creds.passwordHash) {
      console.log(`Failed admin login attempt for username: ${username}`);
      return c.json({ error: "Invalid username or password" }, 401);
    }

    // Create session token
    const token = generateToken();
    await kv.set(
      `admin_session_${token}`,
      JSON.stringify({
        username,
        createdAt: new Date().toISOString(),
        ip: c.req.header("x-forwarded-for") || "unknown",
      })
    );

    console.log(`Admin login successful: ${username}`);
    return c.json({ success: true, token, username });
  } catch (error) {
    console.log(`Error during admin login: ${error}`);
    return c.json({ error: `Login failed: ${error}` }, 500);
  }
});

// Admin Logout
app.post("/make-server-55db73c3/admin/logout", async (c) => {
  try {
    const token = c.req.header("X-Admin-Token");
    if (token) {
      await kv.del(`admin_session_${token}`);
      console.log("Admin session destroyed");
    }
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error during admin logout: ${error}`);
    return c.json({ error: `Logout failed: ${error}` }, 500);
  }
});

// Verify Admin Session
app.get("/make-server-55db73c3/admin/verify", async (c) => {
  try {
    const token = c.req.header("X-Admin-Token");
    const valid = await verifyAdminToken(token);
    if (!valid) {
      return c.json({ authenticated: false }, 401);
    }
    const session = await kv.get(`admin_session_${token}`);
    const parsed = session ? JSON.parse(session) : {};
    return c.json({ authenticated: true, username: parsed.username });
  } catch (error) {
    console.log(`Error verifying admin session: ${error}`);
    return c.json({ authenticated: false }, 401);
  }
});

// Change Admin Password
app.put("/make-server-55db73c3/admin/password", async (c) => {
  try {
    const token = c.req.header("X-Admin-Token");
    const valid = await verifyAdminToken(token);
    if (!valid) {
      return c.json({ error: "Unauthorized: invalid admin session" }, 401);
    }

    const { currentPassword, newPassword } = await c.req.json();
    if (!currentPassword || !newPassword) {
      return c.json({ error: "Current and new password are required" }, 400);
    }
    if (newPassword.length < 6) {
      return c.json({ error: "New password must be at least 6 characters" }, 400);
    }

    const credStr = await kv.get("admin_credentials");
    const creds = JSON.parse(credStr!);
    const currentHash = await hashPassword(currentPassword);

    if (currentHash !== creds.passwordHash) {
      return c.json({ error: "Current password is incorrect" }, 401);
    }

    creds.passwordHash = await hashPassword(newPassword);
    creds.updatedAt = new Date().toISOString();
    await kv.set("admin_credentials", JSON.stringify(creds));

    console.log("Admin password changed successfully");
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error changing admin password: ${error}`);
    return c.json({ error: `Failed to change password: ${error}` }, 500);
  }
});

// --- Public Routes ---

// Submit contact inquiry (public - no auth required)
app.post("/make-server-55db73c3/inquiries", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, company, inquiryType, subject, message } = body;

    if (!name || !email || !inquiryType || !subject || !message) {
      return c.json({ error: "Missing required fields: name, email, inquiryType, subject, message" }, 400);
    }

    const id = `inquiry_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const inquiry = {
      id,
      name,
      email,
      phone: phone || "",
      company: company || "",
      inquiryType,
      subject,
      message,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    await kv.set(id, JSON.stringify(inquiry));
    console.log(`Inquiry stored successfully: ${id}`);

    return c.json({ success: true, id });
  } catch (error) {
    console.log(`Error storing inquiry: ${error}`);
    return c.json({ error: `Failed to store inquiry: ${error}` }, 500);
  }
});

// --- Protected Admin Routes ---

// Get all inquiries (admin only)
app.get("/make-server-55db73c3/inquiries", async (c) => {
  try {
    const token = c.req.header("X-Admin-Token");
    const valid = await verifyAdminToken(token);
    if (!valid) {
      return c.json({ error: "Unauthorized: admin login required" }, 401);
    }

    const inquiries = await kv.getByPrefix("inquiry_");
    const parsed = inquiries.map((item: any) => {
      try { return JSON.parse(item.value); } catch { return item; }
    });
    return c.json({ success: true, inquiries: parsed });
  } catch (error) {
    console.log(`Error fetching inquiries: ${error}`);
    return c.json({ error: `Failed to fetch inquiries: ${error}` }, 500);
  }
});

// Update inquiry status (admin only)
app.put("/make-server-55db73c3/inquiries/:id", async (c) => {
  try {
    const token = c.req.header("X-Admin-Token");
    const valid = await verifyAdminToken(token);
    if (!valid) {
      return c.json({ error: "Unauthorized: admin login required" }, 401);
    }

    const id = c.req.param("id");
    const body = await c.req.json();
    const { status, adminNote } = body;

    const existing = await kv.get(id);
    if (!existing) {
      return c.json({ error: `Inquiry not found: ${id}` }, 404);
    }

    const inquiry = JSON.parse(existing);
    if (status) inquiry.status = status;
    if (adminNote !== undefined) inquiry.adminNote = adminNote;
    inquiry.updatedAt = new Date().toISOString();

    await kv.set(id, JSON.stringify(inquiry));
    console.log(`Inquiry updated: ${id}, status: ${status}`);

    return c.json({ success: true, inquiry });
  } catch (error) {
    console.log(`Error updating inquiry: ${error}`);
    return c.json({ error: `Failed to update inquiry: ${error}` }, 500);
  }
});

// Delete inquiry (admin only)
app.delete("/make-server-55db73c3/inquiries/:id", async (c) => {
  try {
    const token = c.req.header("X-Admin-Token");
    const valid = await verifyAdminToken(token);
    if (!valid) {
      return c.json({ error: "Unauthorized: admin login required" }, 401);
    }

    const id = c.req.param("id");
    const existing = await kv.get(id);
    if (!existing) {
      return c.json({ error: `Inquiry not found: ${id}` }, 404);
    }

    await kv.del(id);
    console.log(`Inquiry deleted: ${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting inquiry: ${error}`);
    return c.json({ error: `Failed to delete inquiry: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);
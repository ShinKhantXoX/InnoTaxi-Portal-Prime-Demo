import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  Waves,
  AlertCircle,
  Anchor,
  Fish,
} from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { AdminDashboard } from "./AdminDashboard";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-55db73c3`;

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("admin_token");
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setChecking(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/verify`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
          "X-Admin-Token": token,
        },
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        setAdminToken(token);
        setUsername(data.username || "admin");
      } else {
        sessionStorage.removeItem("admin_token");
      }
    } catch (error) {
      console.error("Error verifying admin session:", error);
      sessionStorage.removeItem("admin_token");
    } finally {
      setChecking(false);
    }
  };

  const handleLogin = (token: string, user: string) => {
    sessionStorage.setItem("admin_token", token);
    setAdminToken(token);
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      if (adminToken) {
        await fetch(`${API_BASE}/admin/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Token": adminToken,
          },
        });
      }
    } catch (error) {
      console.error("Error during admin logout:", error);
    }
    sessionStorage.removeItem("admin_token");
    setAdminToken(null);
    setIsAuthenticated(false);
    setUsername("");
    toast.success("Logged out successfully");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <Shield size={32} className="text-[#0369a1]/40" />
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated && adminToken) {
    return (
      <AdminDashboard
        adminToken={adminToken}
        adminUsername={username}
        onLogout={handleLogout}
      />
    );
  }

  return <AdminLoginScreen onLogin={handleLogin} />;
}

// ---- Admin Login Screen ----

function AdminLoginScreen({
  onLogin,
}: {
  onLogin: (token: string, username: string) => void;
}) {
  const [formUsername, setFormUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formUsername.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          username: formUsername.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Admin login failed:", data.error);
        setError(data.error || "Invalid credentials");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setLoading(false);
        return;
      }

      toast.success(`Welcome back, ${data.username}!`);
      onLogin(data.token, data.username);
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Unable to connect to server. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#075985]" />

      {/* Animated ocean decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Wave patterns */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-[8%] left-[5%] opacity-[0.06]"
        >
          <Waves size={160} className="text-white" />
        </motion.div>
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute bottom-[15%] right-[8%] opacity-[0.06]"
        >
          <Waves size={130} className="text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-[35%] right-[15%] opacity-[0.04]"
        >
          <Anchor size={90} className="text-white" />
        </motion.div>
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute bottom-[25%] left-[12%] opacity-[0.04]"
        >
          <Fish size={80} className="text-white" />
        </motion.div>

        {/* Bubble particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: 6 + i * 4,
              height: 6 + i * 4,
              left: `${15 + i * 14}%`,
              bottom: "-5%",
            }}
            animate={{
              y: [0, -(400 + i * 100)],
              opacity: [0.3, 0],
              x: [0, (i % 2 === 0 ? 20 : -20)],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + i * 1.5,
              delay: i * 1.2,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Wave SVG at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path
              d="M0 120V80C240 30 480 60 720 80C960 100 1200 50 1440 30V120H0Z"
              fill="white"
              fillOpacity="0.03"
            />
            <path
              d="M0 120V90C360 50 720 70 1080 90C1260 100 1350 95 1440 85V120H0Z"
              fill="white"
              fillOpacity="0.05"
            />
          </svg>
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo / Brand header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Shield size={30} className="text-white" />
          </motion.div>
          <h1
            className="text-white mb-1"
            style={{ fontSize: "1.6rem", fontWeight: 600 }}
          >
            Glory One
          </h1>
          <p className="text-white/50" style={{ fontSize: "0.85rem" }}>
            Admin Control Panel
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.08] backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Card top accent */}
          <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-500" />

          <div className="p-7 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock size={16} className="text-white/60" />
              <h2
                className="text-white/90"
                style={{ fontSize: "1.05rem", fontWeight: 500 }}
              >
                Sign In
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  className="block text-white/60 mb-2"
                  style={{ fontSize: "0.8rem", fontWeight: 400 }}
                >
                  Username
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => {
                      setFormUsername(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder-white/30 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.1] outline-none transition-all"
                    style={{ fontSize: "0.9rem" }}
                    placeholder="Enter username"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-white/60 mb-2"
                  style={{ fontSize: "0.8rem", fontWeight: 400 }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder-white/30 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.1] outline-none transition-all"
                    style={{ fontSize: "0.9rem" }}
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/15 border border-red-400/20"
                  >
                    <AlertCircle size={15} className="text-red-400 shrink-0" />
                    <p className="text-red-300" style={{ fontSize: "0.82rem" }}>
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-cyan-500/50 text-white/70"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30"
                }`}
                style={{ fontSize: "0.92rem", fontWeight: 500 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                    >
                      <Shield size={17} />
                    </motion.div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn size={17} />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>

            {/* Default credentials hint */}
            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <p
                className="text-white/30 text-center"
                style={{ fontSize: "0.72rem" }}
              >
                Default credentials: admin / admin123
              </p>
              <p
                className="text-white/20 text-center mt-1"
                style={{ fontSize: "0.68rem" }}
              >
                Change your password after first login
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/25 mt-6"
          style={{ fontSize: "0.72rem" }}
        >
          Glory One Seafood &mdash; Admin Panel
        </motion.p>
      </motion.div>
    </div>
  );
}

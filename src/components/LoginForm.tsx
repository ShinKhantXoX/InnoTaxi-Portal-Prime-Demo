import { useState } from "react";
import { useNavigate } from "react-router";
import imgImage from "/Logo.svg";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Eye, EyeOff, Mail, ArrowRight, Info, FileCode2, AlertCircle } from "lucide-react";
import { CodePreviewDialog, type FrameworkKey } from "./CodePreviewDialog";

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [previewFramework, setPreviewFramework] = useState<FrameworkKey>("vue");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const openPreview = (fw: FrameworkKey) => {
    setPreviewFramework(fw);
    setShowCodePreview(true);
  };

  const handleAutoFill = () => {
    setEmail("admin@innotaxi.com");
    setPassword("admin123");
    setErrors({});
    setTouched({});
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(val) }));
    }
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  const handleSignIn = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setTouched({ email: true, password: true });
    setErrors({ email: emailError, password: passwordError });
    if (emailError || passwordError) return;

    // Build user profile
    const username = email.split("@")[0];
    const userProfile = {
      email,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      role: "Administrator",
      avatar: username.substring(0, 2).toUpperCase(),
      loginAt: new Date().toISOString(),
      keepSignedIn,
    };

    // Store in localStorage
    localStorage.setItem("innotaxi_user", JSON.stringify(userProfile));
    localStorage.setItem("innotaxi_credentials", JSON.stringify({ email, password }));

    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f1f5f9] p-8">
      <div className="w-full max-w-[440px]">
        {/* Card */}
        <div className="relative bg-white rounded-[14px] border border-[#e2e8f0] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06),0px_1px_2px_0px_rgba(0,0,0,0.06)] p-8">
          {/* Code Preview Icon */}
          <button
            onClick={() => setShowCodePreview(true)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#94a3b8] hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#f0fdf4] transition-all cursor-pointer"
            title="Preview PrimeVue Code"
          >
            <FileCode2 className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <img
              src={imgImage}
              alt="InnoTaxi"
              className="w-8 h-8 rounded-[10px] object-cover"
            />
            <p className="text-[11px] tracking-[0.88px] uppercase text-[#e53935] font-medium">
              Admin Portal
            </p>
          </div>

          <h2 className="text-[24px] tracking-[-0.48px] text-[#0f172a] font-medium mb-1">
            Welcome back
          </h2>
          <p className="text-[13.5px] tracking-[-0.135px] text-[#64748b] mb-8">
            Sign in to the InnoTaxi Service admin dashboard
          </p>

          {/* Form */}
          <div className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                  <Mail className={`w-4 h-4 ${errors.email && touched.email ? "text-[#e53935]" : "text-[#94a3b8]"}`} />
                </span>
                <InputText
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="Email Address"
                  className={`w-full !pl-10 !h-[52px] !bg-[#f8fafc] !rounded-[10px] !text-[14px] transition-all ${
                    errors.email && touched.email
                      ? "!border-[#e53935] !shadow-[0_0_0_1px_rgba(229,57,53,0.15)]"
                      : "!border-[#cbd5e1]"
                  }`}
                />
              </div>
              {errors.email && touched.email && (
                <div className="flex items-center gap-1.5 mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#e53935] shrink-0" />
                  <span className="text-[12px] text-[#e53935]">{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 ${errors.password && touched.password ? "[&_rect]:stroke-[#e53935] [&_path]:stroke-[#e53935]" : ""}`}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-[#94a3b8]"
                  >
                    <rect
                      x="1.6"
                      y="7.6"
                      width="12.8"
                      height="7.8"
                      rx="1.333"
                      stroke="#94A3B8"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M4.6 7.267V5.267C4.6 3.95 5.7 2.6 8 2.6C10.3 2.6 11.4 3.95 11.4 5.267V7.267"
                      stroke="#94A3B8"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={handlePasswordBlur}
                  placeholder="Password"
                  className={`w-full !pl-10 !pr-10 !h-[52px] !bg-[#f8fafc] !rounded-[10px] !text-[14px] focus:!border-[#e53935] focus:!shadow-[0_0_0_1px_rgba(229,57,53,0.2)] transition-all ${
                    errors.password && touched.password
                      ? "!border-[#e53935] !shadow-[0_0_0_1px_rgba(229,57,53,0.15)]"
                      : "!border-[#cbd5e1]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-[#94a3b8] hover:text-[#64748b] transition-colors cursor-pointer p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <div className="flex items-center gap-1.5 mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#e53935] shrink-0" />
                  <span className="text-[12px] text-[#e53935]">{errors.password}</span>
                </div>
              )}
              <div className="flex justify-end mt-1.5">
                <button className="text-[12px] text-[#e53935] font-medium hover:underline cursor-pointer">
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2.5">
              <Checkbox
                inputId="keepSignedIn"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.checked ?? false)}
                className="[&_.p-checkbox-box]:!border-[#cbd5e1] [&_.p-checkbox-box]:!rounded [&_.p-checkbox-box.p-highlight]:!bg-[#e53935] [&_.p-checkbox-box.p-highlight]:!border-[#e53935]"
              />
              <label
                htmlFor="keepSignedIn"
                className="text-[13px] text-[#475569] font-medium cursor-pointer"
              >
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Sign In Button */}
            <Button
              label="Sign In"
              icon={
                <ArrowRight className="w-4 h-4 ml-2" />
              }
              iconPos="right"
              onClick={handleSignIn}
              className="!w-full !h-[46px] !bg-[#e53935] !border-[#e53935] !rounded-[10px] !shadow-[0px_1px_3px_0px_rgba(229,57,53,0.3)] !text-[14px] !font-medium hover:!bg-[#d32f2f] !justify-center"
            />
          </div>

          {/* Divider */}
          <Divider align="center" className="!my-5">
            <span className="text-[11px] tracking-[0.88px] uppercase text-[#94a3b8] font-medium">
              Demo Access
            </span>
          </Divider>

          {/* Demo Credentials */}
          <div className="bg-[#fef2f2] rounded-[10px] border border-[rgba(254,202,202,0.6)] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#e53935] flex items-center justify-center">
                  <Info className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[12px] tracking-[0.12px] text-[#e53935] font-semibold">
                  Demo Credentials
                </span>
              </div>
              <Button
                label="Auto Fill"
                onClick={handleAutoFill}
                className="!h-7 !bg-[#fef2f2] !border-[#fecaca] !text-[#e53935] !text-[11px] !font-medium !rounded-[10px] !px-3 hover:!bg-[#fee2e2]"
                size="small"
              />
            </div>
            <div className="bg-white/60 rounded-lg border border-[rgba(254,202,202,0.3)] px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-[#94a3b8] w-[58px]">
                  Email
                </span>
                <code className="text-[12px] text-[#991b1b] font-mono">
                  admin@innotaxi.com
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#94a3b8] w-[58px]">
                  Password
                </span>
                <code className="text-[12px] text-[#991b1b] font-mono">
                  admin123
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="flex flex-col items-center gap-3 mt-5">
          <p className="text-center text-[11px] text-[#94a3b8]">
            Styled with{" "}
            <span className="font-semibold text-[#64748b]">PrimeReact</span> Aura
            Theme · Built with React + Tailwind
          </p>
          <button
            onClick={() => openPreview("vue")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e2e8f0] rounded-[10px] text-[12px] font-medium text-[#475569] hover:border-[#64748b] hover:text-[#0f172a] hover:shadow-sm transition-all cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Preview Code
          </button>
        </div>

        <CodePreviewDialog
          visible={showCodePreview}
          onHide={() => setShowCodePreview(false)}
          initialFramework={previewFramework}
        />
      </div>
    </div>
  );
}
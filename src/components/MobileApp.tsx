import DriverAppChangeLanguage from "../imports/DriverAppChangeLanguage";
import DriverAppLoginWithEmail from "../imports/DriverAppLoginWithEmail";
import { useState, type ReactNode } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { selectLanguageFlutterCode, selectLanguageWidgetTestCode } from "./mobileAppFlutterCodes";
import { loginWithEmailFlutterCode, loginWithEmailWidgetTestCode } from "./mobileAppFlutterCodes";
import {
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  Check,
  Copy,
  Code,
} from "lucide-react";

// ─── Types ───
interface ScreenPage {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: typeof Globe;
  color: string;
}

// ─── Screen Data ───
const driverAppScreens: ScreenPage[] = [
  { id: "select-language", title: "Select Language", description: "Language selection with Myanmar, English, and other locale options", category: "Onboarding", icon: Globe, color: "#6366f1" },
  { id: "login-email", title: "Login with Email", description: "Email & password sign-in with tab switcher for Email, Mobile OTP, and PIN Code", category: "Authentication", icon: Mail, color: "#e53935" },
];

const categories = ["All", "Onboarding", "Authentication"];

// ─── Figma Phone Frame (for imported Figma designs at 393×852) ───
function FigmaPhoneFrame({ children }: { children: ReactNode }) {
  const figmaW = 393;
  const figmaH = 852;
  const frameW = 280;
  const frameH = 606;
  const innerW = frameW - 6;
  const innerH = frameH - 6;
  const scale = Math.min(innerW / figmaW, innerH / figmaH);
  const scaledW = figmaW * scale;
  const scaledH = figmaH * scale;

  return (
    <div className="relative mx-auto" style={{ width: frameW, height: frameH }}>
      {/* Outer phone bezel */}
      <div className="absolute inset-0 rounded-[36px] bg-[#1a1a2e] shadow-xl" />
      {/* Screen area */}
      <div className="absolute inset-[3px] rounded-[33px] overflow-hidden bg-[#e8e8e8]">
        <div
          className="absolute"
          style={{
            width: figmaW,
            height: figmaH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            left: (innerW - scaledW) / 2,
            top: (innerH - scaledH) / 2,
          }}
        >
          {children}
        </div>
      </div>
      {/* Home indicator */}
      <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full bg-white/30" />
    </div>
  );
}

// ─── Individual Screen Renderers ───

function SelectLanguageScreen() {
  return (
    <FigmaPhoneFrame>
      <DriverAppChangeLanguage />
    </FigmaPhoneFrame>
  );
}

function LoginWithEmailScreen() {
  return (
    <FigmaPhoneFrame>
      <DriverAppLoginWithEmail />
    </FigmaPhoneFrame>
  );
}

// ─── Flutter code map per screen ───
interface FlutterCodeTab {
  key: string;
  label: string;
  fileName: string;
  code: string;
}

const screenFlutterCodes: Record<string, FlutterCodeTab[]> = {
  "select-language": [
    { key: "page", label: "Page", fileName: "select_language_page.dart", code: selectLanguageFlutterCode },
    { key: "test", label: "Widget Test", fileName: "select_language_page_test.dart", code: selectLanguageWidgetTestCode },
  ],
  "login-email": [
    { key: "page", label: "Page", fileName: "login_email_page.dart", code: loginWithEmailFlutterCode },
    { key: "test", label: "Widget Test", fileName: "login_email_page_test.dart", code: loginWithEmailWidgetTestCode },
  ],
};

// ─── Screen renderer map ───
const screenRenderers: Record<string, () => JSX.Element> = {
  "select-language": SelectLanguageScreen,
  "login-email": LoginWithEmailScreen,
};

// ─── Main Export ───
export function MobileApp() {
  const [selectedScreen, setSelectedScreen] = useState<string>("select-language");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "detail">("detail");
  const [codeTabKey, setCodeTabKey] = useState("page");
  const [codeCopied, setCodeCopied] = useState(false);

  const filtered = activeCategory === "All"
    ? driverAppScreens
    : driverAppScreens.filter((s) => s.category === activeCategory);

  const currentScreen = driverAppScreens.find((s) => s.id === selectedScreen);
  const ScreenRenderer = screenRenderers[selectedScreen];

  const currentIndex = filtered.findIndex((s) => s.id === selectedScreen);

  const goPrev = () => {
    if (currentIndex > 0) {
      setSelectedScreen(filtered[currentIndex - 1].id);
      setCodeTabKey("page");
      setCodeCopied(false);
    }
  };
  const goNext = () => {
    if (currentIndex < filtered.length - 1) {
      setSelectedScreen(filtered[currentIndex + 1].id);
      setCodeTabKey("page");
      setCodeCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e53935] to-[#ff6f61] flex items-center justify-center shadow-md">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-[18px] text-[#0f172a]" style={{ fontWeight: 700 }}>Driver App — UI Preview</h2>
            <p className="text-[13px] text-[#64748b]">Interactive mobile screen previews for InnoTaxi Driver Application</p>
          </div>
          <div className="flex items-center gap-1.5">
            {(["detail", "grid"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg text-[12px] transition-all cursor-pointer ${
                  viewMode === m ? "bg-[#0f172a] text-white" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                }`}
                style={{ fontWeight: viewMode === m ? 600 : 400 }}
              >
                {m === "detail" ? "Detail View" : "Grid View"}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => {
            const count = cat === "All" ? driverAppScreens.length : driverAppScreens.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  const newFiltered = cat === "All" ? driverAppScreens : driverAppScreens.filter((s) => s.category === cat);
                  if (newFiltered.length > 0 && !newFiltered.find((s) => s.id === selectedScreen)) {
                    setSelectedScreen(newFiltered[0].id);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-[11px] transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#e53935] text-white shadow-sm"
                    : "bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9] border border-[#e2e8f0]"
                }`}
                style={{ fontWeight: activeCategory === cat ? 600 : 400 }}
              >
                {cat} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {viewMode === "detail" ? (
        /* ─── Detail View: Phone + Screen List ─── */
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Screen list */}
          <div className="lg:w-[280px] shrink-0 bg-white rounded-xl border border-[#e2e8f0] p-3 max-h-[680px] overflow-y-auto">
            <p className="text-[11px] text-[#94a3b8] px-1 mb-2" style={{ fontWeight: 600 }}>{filtered.length} SCREENS</p>
            <div className="flex flex-col gap-1">
              {filtered.map((screen) => {
                const isActive = selectedScreen === screen.id;
                return (
                  <button
                    key={screen.id}
                    onClick={() => setSelectedScreen(screen.id)}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#fef2f2] border border-[#fecaca]"
                        : "hover:bg-[#f8fafc] border border-transparent"
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: isActive ? screen.color + "20" : "#f1f5f9" }}
                    >
                      <screen.icon className="w-3.5 h-3.5" style={{ color: isActive ? screen.color : "#94a3b8" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] truncate ${isActive ? "text-[#e53935]" : "text-[#0f172a]"}`} style={{ fontWeight: isActive ? 600 : 500 }}>
                        {screen.title}
                      </p>
                      <p className="text-[8px] text-[#94a3b8] truncate">{screen.category}</p>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#e53935] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone preview */}
          <div className="flex-1 flex flex-col">
            {/* Nav arrows + screen title */}
            <div className="flex items-center gap-4 mb-4 w-full justify-center">
              <button
                onClick={goPrev}
                disabled={currentIndex <= 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  currentIndex <= 0 ? "border-[#e2e8f0] text-[#cbd5e1]" : "border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <p className="text-[14px] text-[#0f172a]" style={{ fontWeight: 600 }}>{currentScreen?.title}</p>
                <p className="text-[11px] text-[#64748b]">{currentScreen?.description}</p>
              </div>
              <button
                onClick={goNext}
                disabled={currentIndex >= filtered.length - 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  currentIndex >= filtered.length - 1 ? "border-[#e2e8f0] text-[#cbd5e1]" : "border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center">
              <div className="pb-4">
                {ScreenRenderer && <ScreenRenderer />}
              </div>
              {/* Screen counter */}
              <div className="flex items-center gap-1 mt-2">
                {filtered.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScreen(s.id)}
                    className={`rounded-full transition-all cursor-pointer ${
                      s.id === selectedScreen ? "w-4 h-1.5 bg-[#e53935]" : "w-1.5 h-1.5 bg-[#e2e8f0] hover:bg-[#cbd5e1]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ─── Grid View: All phones ─── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((screen) => {
            const Renderer = screenRenderers[screen.id];
            return (
              <div key={screen.id} className="flex flex-col items-center">
                <div
                  className={`rounded-2xl p-3 transition-all cursor-pointer ${
                    selectedScreen === screen.id ? "bg-[#fef2f2] ring-2 ring-[#e53935]" : "bg-white border border-[#e2e8f0] hover:shadow-md"
                  }`}
                  onClick={() => {
                    setSelectedScreen(screen.id);
                    setViewMode("detail");
                  }}
                  style={{ transform: "scale(0.65)", transformOrigin: "top center" }}
                >
                  {Renderer && <Renderer />}
                </div>
                <div className="text-center -mt-28">
                  <p className="text-[12px] text-[#0f172a]" style={{ fontWeight: 600 }}>{screen.title}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: screen.color + "15", color: screen.color, fontWeight: 500 }}>
                    {screen.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Flutter Code Preview — full width below */}
      {screenFlutterCodes[selectedScreen] && (() => {
                const tabs = screenFlutterCodes[selectedScreen];
                const activeTab = tabs.find((t) => t.key === codeTabKey) || tabs[0];
                const handleCopy = () => {
                  const textarea = document.createElement("textarea");
                  textarea.value = activeTab.code;
                  textarea.style.position = "fixed";
                  textarea.style.opacity = "0";
                  document.body.appendChild(textarea);
                  textarea.select();
                  document.execCommand("copy");
                  document.body.removeChild(textarea);
                  setCodeCopied(true);
                  setTimeout(() => setCodeCopied(false), 2000);
                };
                return (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e2e8f0]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#e2e8f0]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#e3f2fd] flex items-center justify-center">
                          <Code className="w-3.5 h-3.5 text-[#0288d1]" />
                        </div>
                        <div>
                          <h3 className="text-[13px] text-[#0f172a]" style={{ fontWeight: 600 }}>Flutter UI Code</h3>
                          <p className="text-[10px] text-[#94a3b8]">{currentScreen?.title} — {currentScreen?.description}</p>
                        </div>
                      </div>
                      {/* remove close button, keep only the header content */}
                    </div>

                    {/* Framework switcher + sub-tabs + Copy */}
                    <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e2e8f0] bg-[#fafbfc]">
                      <div className="flex items-center gap-3">
                        {/* Flutter pill */}
                        <div className="flex items-center gap-1 bg-[#f1f5f9] rounded-lg p-0.5">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] bg-white text-[#0f172a] shadow-sm" style={{ fontWeight: 500 }}>
                            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                              <path d="M18.2 2L5 15.2l4.1 4.1L27.4 2H18.2z" fill="#42A5F5" />
                              <path d="M18.2 16.7L9.1 25.8l4.1 4.1 13.2-13.2H18.2z" fill="#42A5F5" />
                              <path d="M9.1 19.3l4.6 4.6 4.5-4.5-4.6-4.6L9.1 19.3z" fill="#0D47A1" />
                            </svg>
                            Flutter
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] text-[#64748b] hover:text-[#334155] cursor-pointer">
                            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                              <path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2z" fill="#8BC34A" />
                              <path d="M10 16l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                            Jetpack Compose
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] text-[#64748b] hover:text-[#334155] cursor-pointer">
                            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                              <path d="M16 2L2 16l14 14 14-14L16 2z" fill="#FF6F00" />
                              <path d="M16 8l-8 8 8 8 8-8-8-8z" fill="#FF8F00" />
                            </svg>
                            SwiftUI
                          </div>
                        </div>

                        {/* Sub-tabs */}
                        {tabs.length > 1 && (
                          <div className="contents">
                            <div className="w-px h-5 bg-[#e2e8f0]" />
                            <div className="flex items-center gap-0.5">
                              {tabs.map((tab) => (
                                <button
                                  key={tab.key}
                                  onClick={() => { setCodeTabKey(tab.key); setCodeCopied(false); }}
                                  className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${
                                    activeTab.key === tab.key
                                      ? "bg-[#e3f2fd] text-[#0288d1]"
                                      : "text-[#94a3b8] hover:text-[#64748b] hover:bg-[#f1f5f9]"
                                  }`}
                                  style={{ fontWeight: activeTab.key === tab.key ? 600 : 400 }}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Copy button */}
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

                    {/* Code block */}
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] border-b border-[#1e293b]">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
                        </div>
                        <span className="text-[10px] text-[#64748b] ml-2">{activeTab.fileName}</span>
                      </div>
                      <Highlight
                        theme={themes.nightOwl}
                        code={activeTab.code}
                        language="typescript"
                      >
                        {({ style, tokens, getLineProps, getTokenProps }) => (
                          <pre
                            style={{
                              ...style,
                              margin: 0,
                              padding: "16px",
                              fontSize: "12px",
                              lineHeight: "1.6",
                              maxHeight: "540px",
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
              })()}
    </div>
  );
}
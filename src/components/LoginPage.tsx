import { LeftPanel } from "./LeftPanel";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen font-['Inter',sans-serif]">
      {/* Left panel - hidden on small screens */}
      <div className="hidden lg:block lg:w-[48%]">
        <LeftPanel />
      </div>
      {/* Right panel - login form */}
      <div className="flex-1">
        <LoginForm />
      </div>
    </div>
  );
}

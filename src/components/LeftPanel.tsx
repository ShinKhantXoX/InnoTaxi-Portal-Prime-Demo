import imgImage from "/Logo.svg";
import { MapPin, Clock, Shield } from "lucide-react";

const features = [
  { icon: MapPin, label: "Live Tracking" },
  { icon: Clock, label: "24/7 Operations" },
  { icon: Shield, label: "Secure Platform" },
];

export function LeftPanel() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#d32f2f] via-[#e53935] to-[#ef5350] overflow-hidden flex flex-col justify-between p-12">
      {/* Decorative circles */}
      <div className="absolute top-[-80px] right-[80px] w-[360px] h-[360px] rounded-full border-[50px] border-white opacity-[0.06]" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[480px] h-[480px] rounded-full border-[50px] border-white opacity-[0.06]" />
      <div className="absolute top-[400px] right-[100px] w-[200px] h-[200px] rounded-full border-[30px] border-white opacity-[0.06]" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <img
          src={imgImage}
          alt="InnoTaxi"
          className="w-11 h-11 rounded-[14px] shadow-lg object-cover"
        />
        <div>
          <p className="text-[22px] tracking-[-0.26px] text-white">
            <span className="font-medium">Inno</span>
            <span className="text-white/60">Taxi</span>
          </p>
          <p className="text-[10px] tracking-[1.5px] uppercase text-white/40 font-medium">
            Admin Portal
          </p>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
          <span className="text-[11px] tracking-[0.22px] text-white/70 font-medium">
            System Online
          </span>
        </div>

        <div>
          <h1 className="text-[40px] tracking-[-0.4px] text-white font-medium leading-[48px]">
            Your ride,
          </h1>
          <h1 className="text-[40px] tracking-[-0.4px] text-white/50 font-medium leading-[48px]">
            your way.
          </h1>
        </div>

        <p className="text-[14px] leading-[23.8px] tracking-[-0.14px] text-white/55 max-w-[330px]">
          Admin dashboard for managing fleet operations, drivers, passengers,
          and ride analytics — all in one place.
        </p>

        <div className="flex gap-2.5 flex-wrap">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 bg-white/15 border border-white/10 rounded-full px-4 py-2"
            >
              <feature.icon className="w-3.5 h-3.5 text-[#fecaca]" />
              <span className="text-[12px] text-white/90 font-medium">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-[11px] tracking-[0.11px] text-white/30">
          © 2026 InnoTaxi Service. Graduation Project.
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-1.5 rounded-full bg-white" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/25" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  );
}

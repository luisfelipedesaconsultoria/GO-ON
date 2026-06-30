import React from "react";

export function Logo({ size = 28, color = "#0B5A28" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="29" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="26" cy="22" r="7" fill="#0D0F0E" />
      <path d="M16 46c0-8 6-13 10-13s10 5 10 13" fill="#0D0F0E" />
      <circle cx="40" cy="20" r="7.5" fill={color} />
      <path d="M29 46c0-9 6.5-15 11-15s11 6 11 15" fill={color} />
    </svg>
  );
}

export function ProgressRing({ pct, size = 60, stroke = 6, color = "#C8F562", track = "rgba(255,255,255,0.15)" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="progress-ring-circle" />
    </svg>
  );
}

export function SectionHeader({ children, className = "" }) {
  return <p className={`text-xs font-black uppercase tracking-wide text-forest mb-3 ${className}`}>{children}</p>;
}

export function Badge({ children, color = "#0B5A28", bg = "#E3F0E6" }) {
  return (
    <span className="text-[10px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1" style={{ color, background: bg }}>
      {children}
    </span>
  );
}

export function Card({ children, className = "", dark = false, style = {} }) {
  return (
    <div
      className={`rounded-2xl border ${dark ? "border-white/10" : "border-black/6"} ${className}`}
      style={{ background: dark ? "rgba(255,255,255,0.06)" : "white", ...style }}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({ children, onClick, className = "", icon: Icon, type = "button", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-ink text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-opacity ${disabled ? "opacity-40" : "hover:opacity-90"} ${className}`}
    >
      {children} {Icon && <Icon size={16} />}
    </button>
  );
}

export function ForestButton({ children, onClick, className = "", icon: Icon, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-forest text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-opacity ${disabled ? "opacity-40" : "hover:opacity-90"} ${className}`}
    >
      {Icon && <Icon size={16} />} {children}
    </button>
  );
}

export function OutlineButton({ children, onClick, className = "" }) {
  return (
    <button onClick={onClick} className={`border-2 border-black/15 text-ink rounded-xl py-3.5 font-bold text-sm hover:bg-black/5 transition-colors ${className}`}>
      {children}
    </button>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="text-center py-12 px-6">
      {Icon && <Icon size={32} className="text-stone mx-auto mb-3" />}
      <p className="font-bold text-sm text-ink mb-1">{title}</p>
      {description && <p className="text-xs text-stone max-w-xs mx-auto">{description}</p>}
    </div>
  );
}

export function Avatar({ initials, size = 40, color = "#0B5A28" }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-black text-white flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.32 }}
    >
      {initials}
    </div>
  );
}

export function Spinner({ size = 16, color = "currentColor" }) {
  return (
    <svg className="spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}
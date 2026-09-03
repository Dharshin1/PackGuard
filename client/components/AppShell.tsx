import { NavLink, Link } from "react-router-dom";
import { Bell, FileClock, FileText, LayoutDashboard, Menu, Plus, ScanLine, Settings, ShieldCheck, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "New inspection", to: "/upload", icon: ScanLine },
  { label: "Inspection history", to: "/history", icon: FileClock },
  { label: "Reports", to: "/report", icon: FileText },
];

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="PackSure home">
      <span className={cn("flex h-9 w-9 items-center justify-center rounded-sm", light ? "bg-packsure-amber text-packsure-ink" : "bg-packsure-amber/10 text-packsure-amber")}>
        <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className={cn("font-display text-[22px] font-bold uppercase tracking-[0.03em]", light ? "text-packsure-ink" : "text-white")}>Pack<span className="text-packsure-amber">Sure</span></span>
    </Link>
  );
}

function Sidebar() {
  return (
    <aside className="hidden w-[276px] shrink-0 flex-col border-r border-white/[0.09] bg-packsure-deep px-4 py-6 lg:flex">
      <div className="px-3"><Brand /></div>
      <div className="mt-12 px-3 text-[10px] font-bold uppercase tracking-[0.19em] text-emerald-300/90">Workspace</div>
      <nav className="mt-3 space-y-1">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => cn("group flex items-center gap-3 rounded-sm px-3 py-3 text-[13px] font-semibold transition-colors", isActive ? "bg-packsure-amber/10 text-packsure-amber font-bold" : "text-emerald-100 hover:bg-white/[0.05] hover:text-white")}>
            {({ isActive }) => <><Icon className={cn("h-[17px] w-[17px]", isActive ? "text-packsure-amber" : "text-emerald-300/80 group-hover:text-white")} strokeWidth={1.8} /><span>{label}</span>{label === "New inspection" && <span className="ml-auto rounded bg-packsure-amber/15 px-1.5 py-0.5 font-mono-display text-[9px] font-bold text-packsure-amber">⌘ N</span>}</>}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-4">
        <div className="rounded-sm border border-packsure-amber/25 bg-[#0e2023] p-4">
          <div className="mb-3 flex items-center justify-between"><span className="font-mono-display text-[10px] font-bold uppercase tracking-[0.14em] text-packsure-amber">Monthly usage</span><span className="text-xs font-bold text-white">68%</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-packsure-deep"><div className="h-full w-[68%] rounded-full bg-packsure-amber" /></div>
          <p className="mt-3 text-[11px] font-medium leading-5 text-emerald-100">682 of 1,000 inspections used</p>
        </div>
        <NavLink to="/settings" className="flex items-center gap-3 rounded-sm px-3 py-3 text-[13px] font-semibold text-emerald-100 hover:bg-white/[0.05] hover:text-white"><Settings className="h-[17px] w-[17px] text-emerald-300/80" />Settings</NavLink>
        <div className="flex items-center gap-3 border-t border-white/[0.09] px-3 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20 text-xs font-bold text-packsure-amber">AS</div>
          <div className="min-w-0"><p className="truncate text-xs font-bold text-white">Ananya Sharma</p><p className="truncate text-[10px] font-medium text-amber-200/90">Senior Inspector</p></div>
          <button aria-label="Notifications" className="ml-auto text-emerald-300 hover:text-white"><Bell className="h-4 w-4" /></button>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-packsure-ink text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <header className="flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-packsure-ink/95 px-5  lg:hidden">
            <Brand /><button aria-label="Open menu" onClick={() => setOpen(!open)} className="rounded-sm p-2 text-slate-400 hover:bg-white/[0.05] hover:text-white">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </header>
          {open && <div className="absolute inset-x-0 top-[72px] z-30 border-b border-white/[0.08] bg-packsure-deep p-4 shadow-2xl lg:hidden"><nav className="space-y-1">{navigation.map(({ label, to, icon: Icon }) => <NavLink onClick={() => setOpen(false)} key={to} to={to} className={({ isActive }) => cn("flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-semibold", isActive ? "bg-packsure-amber/10 text-packsure-amber" : "text-slate-400")}><Icon className="h-4 w-4" />{label}</NavLink>)}</nav></div>}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}

export function NewInspectionButton() {
  return <Link to="/upload" className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-packsure-amber px-4 text-sm font-extrabold text-packsure-ink  transition-transform hover:-translate-y-0.5"><Plus className="h-4 w-4" strokeWidth={2.5} />New inspection</Link>;
}

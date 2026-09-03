import { ArrowLeft, ArrowRight, Camera, Check, CheckCircle2, ChevronRight, Download, FileCheck2, FileDown, FileText, Images, LoaderCircle, ScanLine, ShieldCheck, Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";

const screenCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
  "/upload": { eyebrow: "Inspection intake", title: "Upload a product label", description: "Drop a clear label image here and PackSure will extract every declaration that matters." },
  "/analysis": { eyebrow: "AI analysis", title: "Review extracted fields", description: "Compare the source evidence with PackSure’s structured reading before you make a decision." },
  "/result": { eyebrow: "Inspection result", title: "Your compliance decision", description: "Findings, evidence, and reasoning will come together here in one inspection-ready view." },
  "/history": { eyebrow: "Inspection history", title: "Every inspection, organized", description: "Filter, search, and open any past inspection without losing the context behind the decision." },
  "/report": { eyebrow: "Report center", title: "Generate a clear report", description: "Preview and export a polished Legal Metrology report built from verified inspection data." },
  "/settings": { eyebrow: "Workspace settings", title: "Tune your workspace", description: "Manage your team, inspection preferences, and reporting defaults in one place." },
};

const historyRecords = [
  { id: "PKG-2024-0812", company: "Northstar Components", product: "Industrial valve assembly", status: "Approved", confidence: "98%", date: "Aug 12, 2024", tone: "success" },
  { id: "PKG-2024-0809", company: "Apex Manufacturing", product: "Pressure regulator kit", status: "Needs review", confidence: "84%", date: "Aug 9, 2024", tone: "amber" },
  { id: "PKG-2024-0804", company: "Meridian Systems", product: "Control panel enclosure", status: "Rejected", confidence: "91%", date: "Aug 4, 2024", tone: "danger" },
  { id: "PKG-2024-0731", company: "Cobalt Logistics", product: "Replacement seal set", status: "Approved", confidence: "96%", date: "Jul 31, 2024", tone: "success" },
];

const historyTone: Record<string, { text: string; bg: string; dot: string }> = {
  success: { text: "text-packsure-success", bg: "bg-packsure-success/10", dot: "bg-packsure-success" },
  amber: { text: "text-packsure-amber", bg: "bg-packsure-amber/10", dot: "bg-packsure-amber" },
  danger: { text: "text-packsure-danger", bg: "bg-packsure-danger/10", dot: "bg-packsure-danger" },
};

function HistoryPanel() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const filteredRecords = historyRecords.filter((record) => {
    const matchesQuery = `${record.id} ${record.company} ${record.product}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || record.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 border-b border-white/[0.09] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-sm font-extrabold text-white">Inspection records</h2><p className="mt-1 text-[11px] font-semibold text-emerald-200/90">{filteredRecords.length} of {historyRecords.length} records shown</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative block"><span className="sr-only">Search inspections</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inspections" className="h-9 w-full rounded-sm border border-white/20 bg-white/[0.06] pl-3 pr-3 text-xs text-white outline-none placeholder:text-emerald-200/60 focus:border-packsure-amber/50 sm:w-44" /></label>
          <label className="block"><span className="sr-only">Filter by status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 w-full rounded-sm border border-white/20 bg-[#123235] px-3 text-xs font-semibold text-white outline-none focus:border-packsure-amber/50 sm:w-36"><option>All statuses</option><option>Approved</option><option>Needs review</option><option>Rejected</option></select></label>
        </div>
      </div>
      <div className="hidden grid-cols-[1.15fr_1fr_0.72fr_0.7fr_20px] gap-4 px-3 py-3 font-mono-display text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-300/90 md:grid"><span>Inspection</span><span>Product</span><span>Status</span><span>Confidence</span><span /></div>
      <div className="divide-y divide-white/[0.08]">
        {filteredRecords.map((record) => { const tone = historyTone[record.tone]; return <Link to="/result" key={record.id} className="group relative grid items-center gap-3 px-1 py-4 transition-colors hover:bg-white/[0.04] md:grid-cols-[1.15fr_1fr_0.72fr_0.7fr_20px] md:gap-4 md:px-3"><div className="min-w-0"><div className="flex items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-packsure-amber/15 text-[9px] font-bold text-packsure-amber">{record.company.slice(0, 2).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-xs font-extrabold text-white group-hover:text-packsure-amber">{record.company}</p><p className="mt-1 font-mono-display text-[9px] font-semibold text-emerald-300">{record.id}</p></div></div></div><div className="min-w-0 pl-10 md:pl-0"><p className="truncate text-[11px] font-semibold text-slate-100">{record.product}</p><p className="mt-1 text-[10px] font-medium text-emerald-200/80">{record.date}</p></div><div className="pl-10 md:pl-0"><span className={`inline-flex items-center gap-1.5 rounded-sm border border-current px-2 py-1 font-mono-display text-[9px] font-bold uppercase tracking-[0.08em] ${tone.bg} ${tone.text}`}><span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />{record.status}</span></div><div className="hidden text-[11px] font-bold text-white md:block"><span className={tone.text}>{record.confidence}</span><span className="ml-1 text-[9px] font-medium text-emerald-200">confidence</span></div><ChevronRight className="absolute right-5 h-4 w-4 text-emerald-300 transition-transform group-hover:translate-x-1 group-hover:text-packsure-amber md:static" /></Link>; })}
        {filteredRecords.length === 0 && <div className="px-3 py-12 text-center text-xs font-semibold text-emerald-200">No inspections match your search.</div>}
      </div>
    </div>
  );
}

const reportOptions = [
  { id: "full", title: "Full inspection report", description: "All extracted fields, evidence, and compliance reasoning", meta: "6 pages", icon: FileCheck2 },
  { id: "certificate", title: "Compliance certificate", description: "A concise certificate for approved inspections", meta: "2 pages", icon: ShieldCheck },
  { id: "findings", title: "Findings & evidence", description: "Flagged fields with supporting label evidence", meta: "3 pages", icon: FileText },
  { id: "history", title: "Inspection history export", description: "A dated summary of your recent inspections", meta: "4 pages", icon: CheckCircle2 },
];

function escapePdfText(value: string) {
  return value.replace(/[\\\\()]/g, "\\\\$&");
}

function createInspectionPdf(title: string) {
  const safeTitle = escapePdfText(title);
  const stream = `BT /F1 22 Tf 72 716 Td (${safeTitle}) Tj /F1 11 Tf 0 -34 Td (PackSure Legal Metrology Intelligence) Tj 0 -26 Td (Inspection ID: PS-240819-084) Tj 0 -20 Td (Status: Compliant) Tj 0 -20 Td (Confidence: 94%) Tj 0 -34 Td (This report was generated from verified inspection data.) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\\nstream\\n${stream}\\nendstream`,
  ];
  let pdf = "%PDF-1.4\\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\\n${object}\\nendobj\\n`; });
  const xrefOffset = pdf.length;
  pdf += `xref\\n0 ${objects.length + 1}\\n0000000000 65535 f \\n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \\n`; });
  pdf += `trailer\\n<< /Size ${objects.length + 1} /Root 1 0 R >>\\nstartxref\\n${xrefOffset}\\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

function ReportPanel() {
  const [selectedId, setSelectedId] = useState(reportOptions[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const selectedReport = reportOptions.find((option) => option.id === selectedId) ?? reportOptions[0];
  const generatedReport = reportOptions.find((option) => option.id === generatedId);

  const selectReport = (id: string) => {
    setSelectedId(id);
    setGeneratedId(null);
  };

  const generateReport = () => {
    setIsGenerating(true);
    setGeneratedId(null);
    window.setTimeout(() => {
      setIsGenerating(false);
      setGeneratedId(selectedId);
    }, 900);
  };

  const downloadReport = () => {
    if (!generatedReport) return;
    const blob = createInspectionPdf(generatedReport.title);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `packsure-${generatedReport.id}-PS-240819-084.pdf`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="relative grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <div className="mb-5"><h2 className="text-sm font-extrabold text-white">Generate report</h2><p className="mt-1 text-[11px] font-semibold leading-5 text-emerald-200">Choose a format based on what you need to share.</p></div>
        <div className="space-y-2">{reportOptions.map((option) => { const Icon = option.icon; const isSelected = selectedId === option.id; return <button type="button" key={option.id} onClick={() => selectReport(option.id)} className={`flex w-full items-center gap-3 rounded-sm border p-3 text-left transition-colors ${isSelected ? "border-packsure-amber/60 bg-packsure-amber/[0.12]" : "border-white/[0.12] bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${isSelected ? "bg-packsure-amber/20 text-packsure-amber" : "bg-white/[0.08] text-emerald-300"}`}><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className={`block text-xs font-extrabold ${isSelected ? "text-white" : "text-slate-100"}`}>{option.title}</span><span className="mt-1 block truncate text-[10px] font-medium text-emerald-200/80">{option.description}</span></span><span className="shrink-0 text-right"><span className={`block text-[10px] font-extrabold ${isSelected ? "text-packsure-amber" : "text-amber-200/80"}`}>{option.meta}</span><span className={`mt-1 block h-4 w-4 rounded-full border ${isSelected ? "border-packsure-amber bg-packsure-amber" : "border-white/30"}`}>{isSelected && <Check className="h-3 w-3 text-packsure-ink" strokeWidth={3} />}</span></span></button>; })}</div>
      </div>
      <div className="rounded-sm border border-white/[0.12] bg-[#0b2325] p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-white/[0.09] pb-4"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-packsure-amber" /><span className="font-mono-display text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">PDF preview</span></div>{generatedReport ? <span className="flex items-center gap-1.5 text-[10px] font-bold text-packsure-success"><span className="h-1.5 w-1.5 rounded-full bg-packsure-success" />Generated</span> : <span className="text-[10px] font-bold text-amber-200/80">Draft</span>}</div>
        <div className="cut-lines mt-5 rounded-sm border border-white/10 bg-[#f4f4ed] p-5 text-[#183031] shadow-xl sm:p-6"><div className="flex items-start justify-between border-b border-[#183031]/15 pb-4"><div><div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded bg-[#0f7770] text-white"><ShieldCheck className="h-4 w-4" /></span><span className="text-[11px] font-black tracking-[-0.03em]">Pack<span className="text-[#0f7770]">Sure</span></span></div><p className="mt-5 max-w-[220px] text-lg font-black leading-tight tracking-[-0.04em]">{generatedReport?.title ?? selectedReport.title}</p></div><span className="font-mono-display text-[8px] font-bold text-[#183031]/70">PS / 084</span></div><div className="mt-5 grid grid-cols-2 gap-3 text-[9px]"><div><p className="font-bold uppercase tracking-widest text-[#183031]/70">Inspection</p><p className="mt-1 font-extrabold">PS-240819-084</p></div><div><p className="font-bold uppercase tracking-widest text-[#183031]/70">Status</p><p className="mt-1 font-extrabold text-[#16805a]">Compliant</p></div><div><p className="font-bold uppercase tracking-widest text-[#183031]/70">Fields checked</p><p className="mt-1 font-extrabold">8 / 8 verified</p></div><div><p className="font-bold uppercase tracking-widest text-[#183031]/70">Confidence</p><p className="mt-1 font-extrabold">94%</p></div></div><div className="mt-6 space-y-2"><div className="h-1.5 w-full rounded bg-[#183031]/10" /><div className="h-1.5 w-4/5 rounded bg-[#183031]/10" /><div className="h-1.5 w-3/5 rounded bg-[#183031]/10" /></div></div>
        {generatedReport ? <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-extrabold text-white">Your PDF is ready</p><p className="mt-1 font-mono-display text-[9px] font-bold text-emerald-300">packsure-{generatedReport.id}-PS-240819-084.pdf</p></div><button type="button" onClick={downloadReport} className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-packsure-amber px-4 text-xs font-extrabold text-packsure-ink "><Download className="h-3.5 w-3.5" />Download PDF</button></div> : <button type="button" disabled={isGenerating} onClick={generateReport} className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-packsure-amber text-xs font-extrabold text-packsure-ink transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70">{isGenerating ? <><LoaderCircle className="h-4 w-4 animate-spin" />Generating PDF…</> : <><FileDown className="h-4 w-4" />Generate PDF</>}</button>}
      </div>
    </div>
  );
}

function AnalysisPanel() {
  const fields = ["MRP", "Net quantity", "Manufacturer", "Address", "Date information"];
  return <div className="relative flex min-h-[245px] items-center justify-center"><div className="scan-frame relative w-full max-w-md border border-white/10 bg-[#0e2023] p-5"><div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="font-mono-display text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300">Field extraction</span><span className="font-mono-display text-[9px] font-bold uppercase tracking-widest text-packsure-amber">Running</span></div><div className="mt-4 space-y-3">{fields.map((field, index) => <div key={field} className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs"><span className="font-semibold text-emerald-100">{field}</span><span className="font-mono-display text-[9px] font-semibold text-emerald-300">{index < 2 ? "reading…" : "queued"}</span></div>)}</div><div className="animate-scan-line absolute inset-x-0 top-0 h-px bg-packsure-amber" /></div></div>;
}

function SourcePicker({ onClose, onCamera, onGallery }: { onClose: () => void; onCamera: () => void; onGallery: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-packsure-ink/75 p-4  sm:items-center" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="source-picker-title" className="w-full max-w-md rounded-sm border border-white/15 bg-packsure-panel p-5 shadow-2xl sm:p-6" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-display text-[10px] font-bold uppercase tracking-[0.18em] text-packsure-amber">Choose a source</p>
            <h2 id="source-picker-title" className="mt-2 text-lg font-extrabold tracking-[-0.03em] text-white">How would you like to add it?</h2>
            <p className="mt-2 text-xs leading-5 text-emerald-100">Use a live photo or select an image from your device.</p>
          </div>
          <button type="button" aria-label="Close source picker" onClick={onClose} className="rounded-sm p-2 text-emerald-300 transition-colors hover:bg-white/[0.06] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onCamera} className="group rounded-sm border border-packsure-amber/20 bg-packsure-amber/[0.06] p-4 text-left transition-colors hover:border-packsure-amber/50 hover:bg-packsure-amber/10">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-packsure-amber/15 text-packsure-amber"><Camera className="h-5 w-5" /></span>
            <span className="mt-4 flex items-center justify-between text-sm font-extrabold text-white">Camera <ChevronRight className="h-4 w-4 text-packsure-amber transition-transform group-hover:translate-x-1" /></span>
            <span className="mt-1 block text-[10px] font-medium leading-4 text-emerald-200">Take a photo now</span>
          </button>
          <button type="button" onClick={onGallery} className="group rounded-sm border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-white/25 hover:bg-white/[0.07]">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-packsure-amber/15 text-packsure-amber"><Images className="h-5 w-5" /></span>
            <span className="mt-4 flex items-center justify-between text-sm font-extrabold text-white">Gallery <ChevronRight className="h-4 w-4 text-packsure-amber transition-transform group-hover:translate-x-1" /></span>
            <span className="mt-1 block text-[10px] font-medium leading-4 text-emerald-200">Choose from your device</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadPanel() {
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files?.[0]) return;
    setPickerOpen(false);
    navigate("/analysis");
  };

  return (
    <>
      <div className="relative flex min-h-[245px] flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-sm bg-packsure-amber/10 text-packsure-amber"><ScanLine className="h-7 w-7" /></span>
        <p className="mt-5 text-sm font-extrabold text-white">Drop label image to begin</p>
        <p className="mt-2 text-xs font-semibold text-emerald-200">PNG, JPG or HEIC up to 10 MB</p>
        <button type="button" onClick={() => setPickerOpen(true)} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-packsure-amber px-4 py-2.5 text-xs font-extrabold text-packsure-ink transition-transform hover:-translate-y-0.5"><ScanLine className="h-3.5 w-3.5" />Use sample inspection</button>
      </div>
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleSelected} className="sr-only" />
      <input ref={galleryInputRef} type="file" accept="image/*,.pdf" onChange={handleSelected} className="sr-only" />
      {pickerOpen && <SourcePicker onClose={() => setPickerOpen(false)} onCamera={() => cameraInputRef.current?.click()} onGallery={() => galleryInputRef.current?.click()} />}
    </>
  );
}

export default function Placeholder() {
  const { pathname } = useLocation();
  const copy = screenCopy[pathname] ?? screenCopy["/upload"];
  const isUpload = pathname === "/upload";
  const isHistory = pathname === "/history";
  const isReport = pathname === "/report";
  const isAnalysis = pathname === "/analysis";

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <Link to="/dashboard" className="mb-10 inline-flex items-center gap-2 text-xs font-bold text-emerald-300 transition-colors hover:text-packsure-amber"><ArrowLeft className="h-3.5 w-3.5" />Back to overview</Link>
        <div className="max-w-2xl">
          <p className="font-mono-display text-[10px] font-bold uppercase tracking-[0.2em] text-packsure-amber">{copy.eyebrow}</p>
          <h1 className="font-display mt-3 text-4xl font-bold uppercase tracking-[0.01em] text-white sm:text-6xl">{copy.title}<span className="text-packsure-amber">.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-emerald-100 sm:text-base">{copy.description}</p>
        </div>
        <div className={`mt-10 grid gap-5 ${isHistory || isReport ? "lg:grid-cols-1" : "lg:grid-cols-[1.2fr_0.8fr]"}`}>
          <div className={`relative min-h-[290px] overflow-hidden rounded-sm border border-white/10 bg-packsure-panel p-6 shadow-panel ${isUpload ? "border-dashed border-packsure-amber/30" : ""}`}>
            <div className="absolute inset-0 grid-glow opacity-50" />
            {isUpload ? <UploadPanel /> : isHistory ? <HistoryPanel /> : isReport ? <ReportPanel /> : isAnalysis ? <AnalysisPanel /> : <div className="relative flex min-h-[245px] flex-col items-center justify-center text-center"><span className="flex h-14 w-14 items-center justify-center rounded-sm bg-packsure-amber/10 text-packsure-amber"><FileText className="h-7 w-7" /></span><p className="mt-5 text-sm font-extrabold text-white">This workspace is ready for your data</p><p className="mt-2 max-w-sm text-xs leading-5 text-emerald-200">Continue prompting to fill in this screen with your connected inspection workflow.</p></div>}
          </div>
          <div className={`${isHistory || isReport ? "hidden" : ""} rounded-sm border border-white/10 bg-packsure-panel p-6`}>
            <div className="flex items-center gap-2 text-packsure-amber"><Sparkles className="h-4 w-4" /><span className="font-mono-display text-[10px] font-bold uppercase tracking-[0.16em]">Coming together</span></div>
            <h2 className="mt-5 text-lg font-extrabold text-white">Designed around evidence</h2>
            <div className="mt-5 space-y-4">{["Structured backend fields", "Confidence at every step", "Auditable evidence trail"].map((item) => <div key={item} className="flex items-center gap-3 text-xs font-semibold text-slate-100"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-packsure-success/10 text-packsure-success"><Check className="h-3 w-3" strokeWidth={3} /></span>{item}</div>)}</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

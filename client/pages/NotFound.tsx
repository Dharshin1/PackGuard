import { Link } from "react-router-dom";

export default function NotFound() {
  return <div className="flex min-h-screen items-center justify-center bg-packsure-ink px-6 text-center text-white"><div><p className="font-mono-display text-xs uppercase tracking-[0.2em] text-packsure-cyan">404 / Not found</p><h1 className="mt-4 text-4xl font-extrabold tracking-[-0.05em]">That page moved.</h1><Link to="/" className="mt-7 inline-flex rounded-xl bg-packsure-cyan px-5 py-3 text-sm font-bold text-packsure-ink">Return to PackSure</Link></div></div>;
}

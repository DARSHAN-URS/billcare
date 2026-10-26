"use client";

import { BookingPreviewView } from "@/components/booking-preview-view";
import Link from "next/link";
import { ArrowLeft, Home, Laptop } from "lucide-react";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-amber-200 selection:text-slate-950">
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white bg-[#0c0c0e] hover:bg-white/[0.08] px-4 py-2.5 rounded-xl border border-white/[0.1] transition-all shadow-lg"
        >
          <Laptop className="w-3.5 h-3.5 text-amber-300" /> Back to Console
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white bg-[#0c0c0e] hover:bg-white/[0.08] px-4 py-2.5 rounded-xl border border-white/[0.1] transition-all shadow-lg"
        >
          <Home className="w-3.5 h-3.5 text-slate-400" /> Home
        </Link>
      </div>
      <BookingPreviewView />
    </div>
  );
}

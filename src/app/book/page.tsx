"use client";

import { BookingPreviewView } from "@/components/booking-preview-view";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Salon Console
        </Link>
      </div>
      <BookingPreviewView />
    </div>
  );
}

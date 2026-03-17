import Link from "next/link";
import { ShieldCheck, Upload, ChartColumnBig, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-neutral-200 pb-5">
          <h1 className="text-2xl text-neutral-900">Chat Wrapped</h1>
          <Link href="/upload" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700">
            Upload Chat
          </Link>
        </header>

        <section className="grid gap-8 py-12 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">WhatsApp conversation analytics</p>
            <h2 className="text-5xl leading-tight text-neutral-900">Discover Your WhatsApp Chat Wrapped</h2>
            <p className="max-w-xl text-lg text-neutral-600">
              Upload your WhatsApp export and get deep insights about your conversations. Built for privacy: no database,
              temporary processing, and clean report pages you can share.
            </p>
            <div className="flex gap-3">
              <Link href="/upload" className="rounded-lg bg-neutral-900 px-5 py-3 text-sm text-white hover:bg-neutral-700">
                Upload WhatsApp Chat (.txt/.zip)
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-sm text-neutral-500">Preview Insight Cards</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-neutral-200 bg-white p-4">Total messages</div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4">Most active chatter</div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4">Peak chat hour</div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4">Top topics</div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-sm text-neutral-500">Privacy Notice</p>
              <p className="mt-2 text-sm text-neutral-700">Your chat is processed securely. Raw messages are deleted after analysis.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-t border-neutral-200 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <Upload className="h-5 w-5 text-neutral-700" />
            <p className="mt-3 text-sm text-neutral-800">Simple upload flow with parsing and progress steps.</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <ChartColumnBig className="h-5 w-5 text-neutral-700" />
            <p className="mt-3 text-sm text-neutral-800">Overview, activity, users, content, and topics dashboards.</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <Sparkles className="h-5 w-5 text-neutral-700" />
            <p className="mt-3 text-sm text-neutral-800">AI insights with optional Cerebras integration using env key.</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <ShieldCheck className="h-5 w-5 text-neutral-700" />
            <p className="mt-3 text-sm text-neutral-800">No database by default. Report data stays in temporary memory.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

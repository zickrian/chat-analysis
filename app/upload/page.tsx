import Link from "next/link";
import { UploadForm } from "@/components/upload/upload-form";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto grid min-h-screen w-full max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="space-y-6">
          <Link href="/" className="text-sm text-neutral-600 underline-offset-2 hover:underline">
            Back to landing
          </Link>
          <h1 className="text-4xl leading-tight text-neutral-900">Upload WhatsApp Chat Export</h1>
          <p className="max-w-lg text-neutral-600">
            Supported format: <span className="font-medium text-neutral-900">.txt</span> and <span className="font-medium text-neutral-900">.zip</span>.
            Your chat is processed temporarily in memory and removed after session expiry.
          </p>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-sm text-neutral-700">Processing flow</p>
            <ol className="mt-3 space-y-1 text-sm text-neutral-600">
              <li>1. Parsing messages</li>
              <li>2. Computing statistics</li>
              <li>3. AI analysis (optional via Cerebras API key)</li>
              <li>4. Generating report dashboard + wrapped story</li>
            </ol>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <UploadForm />
        </section>
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { UploadCloud, CheckSquare, Square, FileImage, AlertCircle } from 'lucide-react';
import { SEO } from './SEO';

/**
 * CustomPosterUpload — standalone upload-flow component for the /custom-poster
 * page. Contains the required copyright-ownership checkbox that must be ticked
 * before the upload/submit button is enabled.
 *
 * Checkbox state lives in component state only (no localStorage).
 */
export const CustomPosterUpload: React.FC = () => {
  const [rightConfirmed, setRightConfirmed] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rightConfirmed || !file) return;
    setSubmitted(true);
  };

  const canSubmit = rightConfirmed && !!file;

  return (
    <>
      <SEO
        title="Custom Poster Upload | WallifyStore"
        description="Upload your own artwork to print as a custom poster. By submitting, you confirm you own the rights to your image."
        canonicalUrl="https://wallifystore.in/custom-poster"
        type="website"
      />

      <div className="max-w-2xl mx-auto px-4 py-10 pb-24 min-h-screen">

        {/* Page heading */}
        <div className="mb-8">
          <span className="text-xs font-black text-primary uppercase tracking-widest">
            Custom Posters
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-black tracking-tight mt-1">
            Upload Your Artwork
          </h1>
          <p className="font-body text-sm text-black/60 mt-2 leading-relaxed">
            Send us your image and we'll print it on our premium 300 GSM matte
            paper. Please read the upload guidelines carefully before submitting.
          </p>
        </div>

        {submitted ? (
          /* ── Success state ─────────────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 animate-fadeInUp">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckSquare className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-display text-black">
              Artwork Submitted!
            </h2>
            <p className="font-body text-sm text-black/60 max-w-xs leading-relaxed">
              We've received your file. Our team will review it and reach out via
              WhatsApp to confirm sizing, pricing and delivery.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFile(null);
                setRightConfirmed(false);
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-primary text-black font-black text-sm shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Upload Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* ── File drop zone ──────────────────────────────────────────────── */}
            <div>
              <label
                htmlFor="poster-file"
                className={`flex flex-col items-center justify-center gap-3 w-full min-h-[200px] rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer px-6 py-8 ${
                  dragOver
                    ? 'border-primary bg-primary/10'
                    : file
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-black/15 bg-black/[0.02] hover:border-primary/40 hover:bg-primary/5'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {file ? (
                  <>
                    <FileImage className="w-10 h-10 text-primary" aria-hidden="true" />
                    <p className="font-body text-sm font-bold text-black text-center">
                      {file.name}
                    </p>
                    <p className="font-body text-xs text-black/50">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <span className="text-xs text-primary font-bold underline">
                      Change file
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-black/30" aria-hidden="true" />
                    <div className="text-center">
                      <p className="font-body text-sm font-bold text-black">
                        Drop your image here or{' '}
                        <span className="text-primary underline">browse</span>
                      </p>
                      <p className="font-body text-xs text-black/50 mt-1">
                        JPG, PNG or TIFF · Minimum 150 dpi · Max 50 MB
                      </p>
                    </div>
                  </>
                )}
                <input
                  id="poster-file"
                  type="file"
                  accept="image/jpeg,image/png,image/tiff,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label="Upload your poster image"
                />
              </label>
            </div>

            {/* ── Notes field ─────────────────────────────────────────────────── */}
            <div className="space-y-1.5">
              <label
                htmlFor="poster-notes"
                className="text-[10px] font-black uppercase text-black/70 ml-1 font-body"
              >
                Notes (optional)
              </label>
              <textarea
                id="poster-notes"
                name="notes"
                rows={3}
                placeholder="Size you want, any special instructions, delivery address hint…"
                className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none font-body"
              />
            </div>

            {/* ── Copyright ownership checkbox ─────────────────────────────────── */}
            <div
              className={`rounded-2xl border-2 p-4 transition-all duration-200 ${
                rightConfirmed
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-black/10 bg-black/[0.02]'
              }`}
            >
              <label
                htmlFor="rights-confirm"
                className="flex items-start gap-3 cursor-pointer group"
              >
                <span
                  className="shrink-0 mt-0.5 text-primary transition-transform group-active:scale-95"
                  aria-hidden="true"
                >
                  {rightConfirmed ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5 text-black/30 group-hover:text-black/50 transition-colors" />
                  )}
                </span>
                <span className="font-body text-sm text-black leading-snug">
                  I confirm that I own this image or have the legal right to use
                  it for printing, and I accept the{' '}
                  <a
                    href="/content-policy"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.history.pushState({}, '', '/content-policy');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="text-black font-bold underline decoration-primary decoration-2 underline-offset-2 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm"
                  >
                    Copyright &amp; Content Policy
                  </a>
                  .
                </span>
                <input
                  id="rights-confirm"
                  type="checkbox"
                  checked={rightConfirmed}
                  onChange={(e) => setRightConfirmed(e.target.checked)}
                  className="sr-only"
                  aria-required="true"
                />
              </label>

              {/* Inline helper text linking to Section C */}
              <div className="mt-3 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-black/40 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="font-body text-[11px] text-black/50 leading-relaxed">
                  Customers who upload artwork are solely responsible for ensuring
                  they hold the necessary rights for commercial printing.{' '}
                  <a
                    href="/content-policy#section-c"
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, '', '/content-policy');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      // After navigation, scroll to the anchor
                      setTimeout(() => {
                        document.getElementById('section-c')?.scrollIntoView({ behavior: 'smooth' });
                      }, 120);
                    }}
                    className="underline decoration-primary/60 underline-offset-2 hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm"
                  >
                    See Section C of our policy →
                  </a>
                </p>
              </div>
            </div>

            {/* ── Submit ──────────────────────────────────────────────────────── */}
            <div
              className="sticky bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-background to-transparent pt-4"
              style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
            >
              <button
                type="submit"
                disabled={!canSubmit}
                aria-disabled={!canSubmit}
                className="w-full h-14 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(250,203,21,0.3)] uppercase tracking-widest text-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none border border-primary/20 hover:enabled:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                <UploadCloud className="w-4 h-4" aria-hidden="true" />
                Send via WhatsApp
              </button>
              {!rightConfirmed && (
                <p
                  className="text-center font-body text-[11px] text-black/40 mt-2"
                  role="note"
                  aria-live="polite"
                >
                  Please tick the copyright confirmation above to submit.
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  );
};

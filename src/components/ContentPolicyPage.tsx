import React from 'react';
import { SEO } from './SEO';
import { ExternalLink, Info, AlertTriangle, BookOpen } from 'lucide-react';

/**
 * ContentPolicyPage — renders the /content-policy route.
 * Sections A–D, table of contents with anchor links, responsive mobile-first.
 * Matches WallifyStore design tokens exactly (DM Serif Display / DM Sans,
 * #FACB15 primary, rounded-2xl cards, bg-black/[0.03] surfaces).
 */

const POLICY_DATE = '31 October 2026';
const CONTACT_EMAIL = 'wallifystore1@gmail.com';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Copyright & Content Policy | WallifyStore',
  url: 'https://wallifystore.in/content-policy',
  description:
    'WallifyStore copyright and content policy covering fan art, unofficial merchandise, customer-uploaded artwork and rights-holder takedown contact.',
  publisher: {
    '@type': 'Organization',
    name: 'WallifyStore',
    url: 'https://wallifystore.in',
  },
};

/* ── Small reusable atoms ─────────────────────────────────────────────────── */

const SectionAnchor: React.FC<{ id: string }> = ({ id }) => (
  <span id={id} className="block -mt-20 pt-20" aria-hidden="true" />
);

const SectionHeading: React.FC<{ label: string; title: string }> = ({
  label,
  title,
}) => (
  <div className="mb-4">
    <span className="text-xs font-black text-primary uppercase tracking-widest font-body">
      {label}
    </span>
    <h2 className="text-2xl sm:text-3xl font-display text-black tracking-tight mt-1">
      {title}
    </h2>
  </div>
);

const Card: React.FC<{
  icon: React.ReactNode;
  title: string;
  body: string;
}> = ({ icon, title, body }) => (
  <div className="flex gap-4 bg-black/[0.03] border border-black/[0.07] rounded-2xl p-4 sm:p-5">
    <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-black">
      {icon}
    </div>
    <div>
      <h3 className="font-body text-sm font-black text-black mb-1">{title}</h3>
      <p className="font-body text-sm text-black/60 leading-relaxed">{body}</p>
    </div>
  </div>
);

/* ── Main component ───────────────────────────────────────────────────────── */

export const ContentPolicyPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Copyright & Content Policy | WallifyStore"
        description="Learn about WallifyStore's approach to fan art, unofficial merchandise, customer-uploaded artwork, and how rights holders can contact us for takedown requests."
        canonicalUrl="https://wallifystore.in/content-policy"
        type="website"
        jsonLd={jsonLd}
      />

      {/* ── Page shell ────────────────────────────────────────────────────── */}
      <div className="min-h-screen bg-background">

        {/* Hero strip */}
        <div className="bg-black/[0.02] border-b border-black/[0.06] px-4 pt-28 pb-10 sm:pt-32 sm:pb-12">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-black text-primary uppercase tracking-widest font-body">
              WallifyStore · Legal
            </span>
            <h1 className="text-3xl sm:text-5xl font-display text-black tracking-tight mt-2 leading-tight">
              Copyright &amp; Content Policy
            </h1>
            <p className="font-body text-sm text-black/55 mt-3 leading-relaxed max-w-xl">
              This page explains the types of content we carry, our relationship
              with rights holders, how we handle customer-uploaded artwork, and
              how to contact us if you believe your rights have been infringed.
            </p>
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-4 py-10 pb-24 space-y-14">

          {/* ── Table of Contents ──────────────────────────────────────────── */}
          <nav
            aria-label="Page contents"
            className="bg-black/[0.03] border border-black/[0.07] rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-black/50" aria-hidden="true" />
              <h2 className="font-body text-[11px] font-black uppercase tracking-widest text-black/60">
                Contents
              </h2>
            </div>
            <ol className="font-body text-sm space-y-2.5 list-none">
              {[
                { href: '#section-a', label: 'A', title: 'Types of content we deal with' },
                { href: '#section-b', label: 'B', title: 'Our products are not official merchandise' },
                { href: '#section-c', label: 'C', title: 'Customer-uploaded artwork policy' },
                { href: '#section-d', label: 'D', title: 'Rights-holder contact and takedown' },
              ].map(({ href, label, title }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-3 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-lg"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-black text-black group-hover:bg-primary transition-colors">
                      {label}
                    </span>
                    <span className="text-black/70 group-hover:text-black transition-colors underline decoration-transparent group-hover:decoration-primary decoration-[1.5px] underline-offset-3">
                      {title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION A — Types of content
          ════════════════════════════════════════════════════════════════════ */}
          <section aria-labelledby="section-a-heading">
            <SectionAnchor id="section-a" />
            <SectionHeading label="Section A" title="Types of content we deal with" />
            <p className="font-body text-sm text-black/60 leading-relaxed mb-5">
              To understand our policy, it helps to be clear about the categories
              of content that appear across our store.
            </p>

            <div className="space-y-3">
              <Card
                icon={<span className="text-lg" aria-hidden="true">🎨</span>}
                title="Fan Art"
                body="Artwork created by fans using characters, fictional worlds or other elements from existing entertainment properties. Fan art is a form of creative expression inspired by — but distinct from — officially produced material."
              />
              <Card
                icon={<span className="text-lg" aria-hidden="true">🖼️</span>}
                title="Unofficial Merchandise"
                body="Products that are not presented as official merchandise authorised by the entertainment company. We are transparent that our poster designs fall into this category and we do not claim any official affiliation."
              />
              <Card
                icon={<span className="text-lg" aria-hidden="true">✅</span>}
                title="Licensed Merchandise"
                body="Products made with the necessary commercial permissions from the relevant rights holders. We are not a licensed merchandiser; we do not represent any of our products as officially licensed unless expressly stated otherwise."
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION B — Not official merchandise
          ════════════════════════════════════════════════════════════════════ */}
          <section aria-labelledby="section-b-heading">
            <SectionAnchor id="section-b" />
            <SectionHeading label="Section B" title="Our products are not official merchandise" />

            <div className="space-y-4 font-body text-sm text-black/65 leading-relaxed">
              <p>
                WallifyStore clearly distinguishes its products from officially
                licensed merchandise. We do not hold licences from studios,
                entertainment companies or rights holders, and we do not claim
                to do so. None of our posters should be understood as
                authorised, approved or endorsed by any property owner.
              </p>
              <p>
                This distinction, however, does not automatically make fan art
                lawful to sell commercially. Whether a particular design can be
                sold — and under what conditions — depends on the specific
                intellectual-property rights involved, the jurisdiction, and
                the way the design uses protected material.
              </p>
            </div>

            {/* Example box */}
            <div className="mt-5 bg-black/[0.03] border border-black/[0.07] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-black/50 shrink-0" aria-hidden="true" />
                <span className="font-body text-[11px] font-black uppercase tracking-widest text-black/50">
                  Example
                </span>
              </div>
              <p className="font-body text-sm text-black/65 leading-relaxed italic">
                An independent artist creates a new Spider-Man illustration. The
                artist may own copyright in the original illustration, but
                Marvel-related character rights may still be involved. The
                artist's permission alone may not clear every right necessary
                for commercial merchandise.
              </p>
            </div>

            {/* Important callout */}
            <div className="mt-4 bg-primary/10 border border-primary/30 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className="w-4 h-4 text-black shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-body text-[11px] font-black uppercase tracking-widest text-black mb-1">
                    Important
                  </p>
                  <p className="font-body text-sm text-black/75 leading-relaxed">
                    Our disclaimer is a disclosure about the nature of our
                    products. It is not a licence from Marvel, DC, Disney or any
                    other rights holder.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION C — Customer-uploaded artwork
          ════════════════════════════════════════════════════════════════════ */}
          <section aria-labelledby="section-c-heading">
            <SectionAnchor id="section-c" />
            <SectionHeading label="Section C" title="Customer-uploaded artwork policy" />

            <div className="space-y-4 font-body text-sm text-black/65 leading-relaxed">
              <p>
                In addition to our own catalogue of poster designs, we offer a
                custom poster printing service. This service allows customers to
                upload their own image files and receive a professionally
                printed poster.
              </p>

              {/* Two-column difference explanation */}
              <div className="grid sm:grid-cols-2 gap-3 my-5">
                <div className="bg-black/[0.03] border border-black/[0.07] rounded-2xl p-4">
                  <h3 className="font-body text-xs font-black uppercase tracking-widest text-black mb-2">
                    Our catalogue designs
                  </h3>
                  <p className="font-body text-[13px] text-black/60 leading-relaxed">
                    Artwork produced or sourced by WallifyStore for our standard
                    product range. We are responsible for the decisions we make
                    about this content.
                  </p>
                </div>
                <div className="bg-black/[0.03] border border-black/[0.07] rounded-2xl p-4">
                  <h3 className="font-body text-xs font-black uppercase tracking-widest text-black mb-2">
                    Customer-uploaded artwork
                  </h3>
                  <p className="font-body text-[13px] text-black/60 leading-relaxed">
                    Files provided directly by the customer. The customer takes
                    full responsibility for ensuring they own the image or hold
                    the legal right to use it for printing.
                  </p>
                </div>
              </div>

              <p>
                Customers who upload an image must confirm, before submitting,
                that they own the image or have the legal right to use it for
                commercial printing purposes. We rely on this confirmation in
                good faith.
              </p>
              <p>
                WallifyStore is not responsible for copyright violations arising
                from customer-uploaded content. By submitting an image through
                our custom poster service, the customer accepts sole
                responsibility for any rights-related claims arising from that
                image.
              </p>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION D — Rights-holder contact
          ════════════════════════════════════════════════════════════════════ */}
          <section aria-labelledby="section-d-heading">
            <SectionAnchor id="section-d" />
            <SectionHeading label="Section D" title="Rights-holder contact and takedown" />

            <div className="space-y-4 font-body text-sm text-black/65 leading-relaxed">
              <p>
                If you are a rights holder — or act on behalf of one — and
                believe that content displayed on WallifyStore infringes your
                intellectual-property rights, please contact us so we can review
                your concern promptly.
              </p>
              <p>
                To help us investigate your claim as quickly as possible, please
                include in your message:
              </p>
              <ul className="space-y-2 pl-1">
                {[
                  'A link to the specific product page on our site',
                  'A description of the work you believe has been infringed',
                  'Documentation or other evidence establishing your ownership of, or authority over, the relevant rights',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                We will review each valid notice and take appropriate action
                without undue delay.
              </p>
            </div>

            {/* Contact card */}
            <div className="mt-5 bg-black/[0.03] border border-black/[0.07] rounded-2xl p-5">
              <p className="font-body text-[11px] font-black uppercase tracking-widest text-black/50 mb-2">
                Contact for takedown requests
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 font-body text-sm font-bold text-black hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </div>
          </section>

          {/* ── Footer meta ───────────────────────────────────────────────── */}
          <footer className="border-t border-black/[0.08] pt-8 space-y-2">
            <p className="font-body text-xs text-black/40">
              Last updated: {POLICY_DATE}
            </p>
            <p className="font-body text-xs text-black/40 leading-relaxed max-w-lg">
              This page is for general information and is not legal advice. If
              you have specific legal questions about intellectual-property
              rights, please consult a qualified legal professional.
            </p>
          </footer>

        </div>
      </div>
    </>
  );
};

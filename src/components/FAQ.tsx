import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    question: 'What paper and print quality are Wallify posters?',
    answer:
      'Every Wallify poster is printed on ultra-thick 300 GSM premium matte art paper using archival, fade-resistant HD inks. The glare-free matte finish delivers deep contrast, vibrant colors, and crisp typography under any room lighting.',
  },
  {
    question: 'Do posters come with frames or unframed?',
    answer:
      'You have complete flexibility! You can order posters unframed or with our sleek, lightweight matte black frames featuring shatterproof crystal-clear acrylic glass. Framing add-ons are available for A5 (+₹299) and A4 (+₹399) sizes and come ready to hang.',
  },
  {
    question: 'What sizes are available?',
    answer:
      'We offer 4 popular sizes: A6 (10.5 × 14.8 cm, ₹29) for phone cases and desk shelves; A5 (14.8 × 21 cm, ₹49) for compact collages; A4 (21 × 29.7 cm, ₹79) – our most popular room decor size; and A3 (29.7 × 42 cm, ₹149) for bold statement walls.',
  },
  {
    question: 'How do bulk offers and free posters work?',
    answer:
      'Our tiered bulk savings unlock automatic free posters: Buy 5 Get 1 FREE, Buy 7 Get 2 FREE, Buy 10 Get 3 FREE, and Buy 20 Get 7 FREE! Free posters are automatically unlocked in your bag without needing coupon codes.',
  },
  {
    question: 'How long does delivery take across Kerala and India?',
    answer:
      'All orders are carefully packed in rigid, crush-proof packaging and dispatched within 24 to 48 hours. Delivery takes 2–3 business days across Kerala and 3–5 business days across the rest of India.',
  },
  {
    question: 'Can I print custom images or posters?',
    answer:
      'Yes! We provide custom high-definition poster printing. If you have your own artwork, anime edit, personal photos, or high-res images, contact us directly on WhatsApp and we will print them in any size you desire.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Structured data for Google FAQPage schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="px-4 py-12 max-w-4xl mx-auto w-full" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 id="faq-heading" className="text-2xl sm:text-3xl font-display text-white">
          Everything You Need to Know
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-2 max-w-md mx-auto">
          Got questions about our prints, sizes, frames, or delivery? We’ve got answers.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden transition-all duration-200 hover:border-white/15"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <span className="font-semibold text-sm sm:text-base text-white/90">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-primary' : 'text-white/40'
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/5"
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

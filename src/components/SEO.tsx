import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any>;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl = 'https://wallifystore.in',
  image = 'https://wallifystore.in/wallify-logo.jpg',
  type = 'website',
  jsonLd,
  noindex = false,
}) => {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Robots meta
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute(
      'content',
      noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // 4. Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 5. hreflang links (en-IN, en, x-default all point to same URL for India-first store)
    const hreflangLocales = [
      { hreflang: 'en-IN', href: canonicalUrl },
      { hreflang: 'en', href: canonicalUrl },
      { hreflang: 'x-default', href: 'https://wallifystore.in' },
    ];
    // Remove old hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    // Add fresh ones
    hreflangLocales.forEach(({ hreflang, href }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      document.head.appendChild(link);
    });

    // 6. Open Graph
    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="og:${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', `og:${property}`);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    updateOgTag('title', title);
    updateOgTag('description', description);
    updateOgTag('image', image);
    updateOgTag('type', type);
    updateOgTag('url', canonicalUrl);
    updateOgTag('locale', 'en_IN');
    updateOgTag('site_name', 'WallifyStore');

    // 7. Twitter Card
    const updateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="twitter:${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', `twitter:${name}`);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    updateTwitterTag('card', 'summary_large_image');
    updateTwitterTag('title', title);
    updateTwitterTag('description', description);
    updateTwitterTag('image', image);

    // 8. JSON-LD Structured Data
    let scriptTag = document.querySelector('#seo-json-ld');
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('id', 'seo-json-ld');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalUrl, image, type, jsonLd, noindex]);

  return null;
};


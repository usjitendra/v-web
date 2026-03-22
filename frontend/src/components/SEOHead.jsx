// components/SEOHead.jsx
import React, { useEffect } from 'react';
import { useGetSEOByPageQuery } from '../rtk/slices/seoApiSlice';

// Default SEO data for fallback
const defaultSEO = {
  title: 'MedicwayCare - Medical Tourism & Healthcare Solutions',
  description: 'MedicwayCare connects you with world-class hospitals and doctors for affordable medical treatment abroad. Expert healthcare guidance globally.',
  keywords: ['medical tourism', 'healthcare abroad', 'international treatment', 'affordable medical', 'best hospitals'],
  canonicalUrl: window.location.href,
  ogTitle: 'MedicwayCare - Medical Tourism & Healthcare Solutions',
  ogDescription: 'Get affordable, world-class medical treatment abroad with MedicwayCare. Connect with top hospitals and experienced doctors.',
  ogImage: '/default-og-image.jpg',
  ogType: 'website',
  ogUrl: window.location.href,
  twitterCard: 'summary_large_image',
  twitterTitle: 'MedicwayCare - Medical Tourism Solutions',
  twitterDescription: 'Affordable healthcare abroad with world-class doctors and hospitals.',
  twitterImage: '/default-twitter-image.jpg',
  twitterSite: '@MedicwayCare',
  googleAnalyticsId: '',
  facebookPixelId: ''
};

const SEOHead = ({
  pageType = 'custom',
  pageIdentifier = '',
  customTitle,
  customDescription,
  customKeywords,
  customImage,
  noIndex = false
}) => {
  const { data: seoData, isLoading, error } = useGetSEOByPageQuery(
    { pageType, pageIdentifier },
    { skip: pageType === 'custom' && !pageIdentifier }
  );

  useEffect(() => {
    if (isLoading) return;

    // Use fetched SEO data or fall back to defaults/custom props
    const seo = seoData?.data || defaultSEO;

    // Override with custom props if provided
    const finalSEO = {
      ...seo,
      ...(customTitle && { title: customTitle, ogTitle: customTitle, twitterTitle: customTitle }),
      ...(customDescription && {
        description: customDescription,
        ogDescription: customDescription,
        twitterDescription: customDescription
      }),
      ...(customKeywords && { keywords: customKeywords }),
      ...(customImage && { ogImage: customImage, twitterImage: customImage }),
    };

    // Update document title
    document.title = finalSEO.title;

    // Update or create meta tags
    updateMetaTag('name', 'description', finalSEO.description);
    updateMetaTag('name', 'keywords', Array.isArray(finalSEO.keywords) ? finalSEO.keywords.join(', ') : finalSEO.keywords);
    updateMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : seo.robotsContent || 'index, follow');
    updateMetaTag('property', 'og:title', finalSEO.ogTitle);
    updateMetaTag('property', 'og:description', finalSEO.ogDescription);
    updateMetaTag('property', 'og:image', finalSEO.ogImage);
    updateMetaTag('property', 'og:type', finalSEO.ogType);
    updateMetaTag('property', 'og:url', finalSEO.ogUrl || window.location.href);
    updateMetaTag('name', 'twitter:card', finalSEO.twitterCard);
    updateMetaTag('name', 'twitter:title', finalSEO.twitterTitle);
    updateMetaTag('name', 'twitter:description', finalSEO.twitterDescription);
    updateMetaTag('name', 'twitter:image', finalSEO.twitterImage);
    updateMetaTag('name', 'twitter:site', finalSEO.twitterSite);

    // Update canonical URL
    updateCanonicalUrl(finalSEO.canonicalUrl || window.location.href);

    // Update language
    updateLanguage(seo.language || 'en');

    // Handle structured data (JSON-LD)
    if (seo.structuredData && Object.keys(seo.structuredData).length > 0) {
      updateStructuredData(seo.structuredData);
    }

    // Handle custom meta tags
    if (seo.customMetaTags && seo.customMetaTags.length > 0) {
      updateCustomMetaTags(seo.customMetaTags);
    }

    // Handle alternate languages
    if (seo.alternateLanguages && seo.alternateLanguages.length > 0) {
      updateAlternateLanguages(seo.alternateLanguages);
    }

  }, [seoData, isLoading, customTitle, customDescription, customKeywords, customImage, noIndex]);

  // Helper function to update or create meta tags
  const updateMetaTag = (attribute, name, content) => {
    if (!content) return;

    let element = document.querySelector(`meta[${attribute}="${name}"]`);

    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  };

  // Update canonical URL
  const updateCanonicalUrl = (url) => {
    let canonical = document.querySelector('link[rel="canonical"]');

    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
  };

  // Update language
  const updateLanguage = (lang) => {
    document.documentElement.lang = lang;
  };

  // Update structured data
  const updateStructuredData = (structuredData) => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]#seo-structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-structured-data';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  };

  // Update custom meta tags
  const updateCustomMetaTags = (customMetaTags) => {
    // Remove existing custom meta tags
    const existingCustom = document.querySelectorAll('meta[data-custom-seo]');
    existingCustom.forEach(tag => tag.remove());

    // Add new custom meta tags
    customMetaTags.forEach((tag, index) => {
      const meta = document.createElement('meta');
      meta.setAttribute('data-custom-seo', `custom-${index}`);

      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      if (tag.httpEquiv) meta.setAttribute('http-equiv', tag.httpEquiv);
      if (tag.content) meta.setAttribute('content', tag.content);

      document.head.appendChild(meta);
    });
  };

  // Update alternate languages
  const updateAlternateLanguages = (alternateLanguages) => {
    // Remove existing alternate links
    const existingAlternates = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingAlternates.forEach(link => link.remove());

    // Add new alternate links
    alternateLanguages.forEach((alt) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alt.lang);
      link.setAttribute('href', alt.url);
      document.head.appendChild(link);
    });
  };

  // Cleanup function to reset to defaults when component unmounts
  useEffect(() => {
    return () => {
      // Reset to default title on unmount
      document.title = defaultSEO.title;
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;

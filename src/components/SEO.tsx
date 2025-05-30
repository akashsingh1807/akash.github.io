/**
 * SEO Component for managing meta tags and structured data
 * Provides comprehensive SEO optimization for all pages
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOMetadata } from '@/types/common';

/**
 * Extended SEO props interface
 */
interface SEOProps extends SEOMetadata {
  type?: 'website' | 'article' | 'profile' | undefined;
  author?: string | undefined;
  publishedTime?: string | undefined;
  modifiedTime?: string | undefined;
  tags?: string[] | undefined;
  locale?: string | undefined;
  siteName?: string | undefined;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player' | undefined;
  twitterSite?: string | undefined;
  twitterCreator?: string | undefined;
  structuredData?: object | undefined;
}

/**
 * Default SEO configuration
 */
const DEFAULT_SEO: Partial<SEOProps> = {
  siteName: 'Akash Singh - Portfolio',
  locale: 'en_US',
  type: 'website',
  twitterCard: 'summary_large_image',
  twitterSite: '@akashsingh',
  ogImage: '/og-image.jpg',
};

/**
 * SEO Component that manages all meta tags and structured data
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  ogImage,
  canonicalUrl,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  tags = [],
  locale = 'en_US',
  siteName = DEFAULT_SEO.siteName,
  twitterCard = 'summary_large_image',
  twitterSite = DEFAULT_SEO.twitterSite,
  twitterCreator,
  structuredData,
}) => {
  // Construct full title
  const fullTitle = title.includes(siteName!) ? title : `${title} | ${siteName}`;

  // Construct canonical URL (handle SSR)
  const fullCanonicalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // Construct OG image URL (handle SSR)
  const fullOgImage = ogImage?.startsWith('http')
    ? ogImage
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${ogImage || DEFAULT_SEO.ogImage}`;

  // Generate structured data for articles
  const generateArticleStructuredData = () => {
    if (type !== 'article' || !author) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      image: fullOgImage,
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${typeof window !== 'undefined' ? window.location.origin : ''}/logo.png`,
        },
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullCanonicalUrl,
      },
      keywords: [...keywords, ...tags].join(', '),
    };
  };

  // Generate structured data for website
  const generateWebsiteStructuredData = () => {
    if (type !== 'website') return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      description,
      url: typeof window !== 'undefined' ? window.location.origin : '',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${typeof window !== 'undefined' ? window.location.origin : ''}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  };

  // Generate person structured data
  const generatePersonStructuredData = () => {
    if (type !== 'profile') return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Akash Singh',
      jobTitle: 'Full Stack Developer',
      description,
      url: typeof window !== 'undefined' ? window.location.origin : '',
      sameAs: [
        'https://github.com/akashsingh',
        'https://linkedin.com/in/akashsingh',
        'https://twitter.com/akashsingh',
      ],
      image: fullOgImage,
    };
  };

  // Get the appropriate structured data
  const getStructuredData = () => {
    if (structuredData) return structuredData;

    switch (type) {
      case 'article':
        return generateArticleStructuredData();
      case 'website':
        return generateWebsiteStructuredData();
      case 'profile':
        return generatePersonStructuredData();
      default:
        return null;
    }
  };

  const structuredDataJson = getStructuredData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author || 'Akash Singh'} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Article specific Open Graph tags */}
      {type === 'article' && author && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Structured Data */}
      {structuredDataJson && (
        <script type="application/ld+json">
          {JSON.stringify(structuredDataJson)}
        </script>
      )}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

/**
 * Hook to generate SEO props for blog posts
 */
export const useBlogPostSEO = (post: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  tags?: string[] | undefined;
  author?: string | undefined;
}): SEOProps => {
  return {
    title: post.title,
    description: post.excerpt,
    canonicalUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`,
    type: 'article',
    author: post.author || 'Akash Singh',
    publishedTime: new Date(post.date).toISOString(),
    tags: post.tags,
    keywords: post.tags || [],
    ogImage: `/blog-images/${post.slug}.jpg`,
  };
};

/**
 * Default SEO component for pages without specific SEO needs
 */
export const DefaultSEO: React.FC<{
  title?: string | undefined;
  description?: string | undefined;
}> = ({
  title = 'Akash Singh - Full Stack Developer Portfolio',
  description = 'Experienced full stack developer specializing in React, Node.js, and modern web technologies. View my projects, blog posts, and get in touch.'
}) => (
  <SEO
    title={title}
    description={description}
    keywords={['full stack developer', 'react', 'nodejs', 'typescript', 'web development', 'portfolio']}
    type="website"
  />
);

export default SEO;

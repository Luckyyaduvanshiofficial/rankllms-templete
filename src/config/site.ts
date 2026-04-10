import type { SocialLinks, LegalConfig } from '../lib/types';

export const name = import.meta.env.SITE_NAME || 'RankLLMs';

export const description =
  import.meta.env.SITE_DESCRIPTION ||
  'Compare 300+ Large Language Models by their pricing, context windows, and benchmarks.';

function resolveSiteUrl(): string {
  const siteUrl = (typeof process !== 'undefined' && process.env?.SITE_URL) || import.meta.env.SITE_URL;

  if (siteUrl) {
    return siteUrl;
  }

  // Use Astro's import.meta.env.PROD to detect production vs development
  if (!import.meta.env.PROD) {
    return 'http://localhost:4321';
  }

  throw new Error('SITE_URL is required for production builds. Set it in your environment.');
}

export const url = resolveSiteUrl();

export const author = import.meta.env.SITE_AUTHOR || 'Lucky Yaduvanshi';

export const logo = '/logo.svg';

export const ogImage = '/images/og-image.png';

export const social: SocialLinks = {
  twitter: 'https://twitter.com/rankllms',
  github: 'https://github.com/rankllms',
  discord: 'https://discord.gg/rankllms',
};

export const legal: LegalConfig = {
  privacyEmail: 'privacy@rankllms.com',
  legalEmail: 'legal@rankllms.com',
  lastUpdated: 'April 9, 2026',
};

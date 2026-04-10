import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import pagefind from 'astro-pagefind';
import { siteConfig } from './src/config';

// Site URL is resolved from the shared site config to keep canonical URLs,
// RSS, and the Astro site setting aligned.
const siteUrl = siteConfig.url;

export default defineConfig({
  site: siteUrl,
  image: {
    domains: ['images.unsplash.com'],
  },
  integrations: [
    pagefind(),
    mdx(),
    icon(),
    sitemap({
      filter: (page) => {
        const { features } = siteConfig;

        // Filter out pages based on feature flags
        if (!features.blog && page.includes('/blog')) return false;
        if (!features.docs && page.includes('/docs')) return false;
        if (!features.changelog && page.includes('/changelog')) return false;
        if (!features.testimonials && page.includes('/testimonials')) return false;
        if (!features.roadmap && page.includes('/roadmap')) return false;

        return true;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

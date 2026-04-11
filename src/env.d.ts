/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly SITE_NAME: string;
  readonly SITE_DESCRIPTION: string;
  readonly SITE_AUTHOR: string;
  readonly STRAPI_URL: string;
  readonly STRAPI_TOKEN: string;
  /** Optional JSON POST endpoint for the blog newsletter form (see docs/10-blog.md). */
  readonly PUBLIC_NEWSLETTER_SUBMIT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

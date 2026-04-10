// cspell:ignore Yaduvanshi
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Strapi API Client
 * Used for fetching articles and content from the self-hosted Strapi backend.
 */

export interface StrapiFetchOptions {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

export type BlogPost = CollectionEntry<'blog'>;

let warnedAboutStrapiFallback = false;

function warnOnce(message: string) {
  if (!warnedAboutStrapiFallback) {
    console.warn(message);
    warnedAboutStrapiFallback = true;
  }
}

/**
 * Fetches data from the Strapi API
 * @param options - Configure the endpoint and URL parameters
 */
export async function fetchStrapiApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: StrapiFetchOptions): Promise<T> {
  const strapiUrl = import.meta.env.STRAPI_URL;
  if (!strapiUrl) {
    throw new Error('STRAPI_URL not defined');
  }

  const endpointPath = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = new URL(`/api/${endpointPath}`, strapiUrl);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (import.meta.env.STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${import.meta.env.STRAPI_TOKEN}`;
  }

  const res = await fetch(url.toString(), { headers });

  if (!res.ok) {
    throw new Error(`Failed to fetch from Strapi: ${res.statusText}`);
  }

  let data = await res.json();
  if (wrappedByKey) data = data[wrappedByKey];
  if (wrappedByList) data = data[0];

  return data as T;
}

/**
 * Hybrid Content Fetcher
 * Safely tries to fetch articles from Strapi. If Strapi is offline or not configured,
 * it seamlessly falls back to reading the local Astro Markdown collections.
 */
export interface StrapiArticle {
  attributes: {
    slug: string;
    title: string;
    description: string;
    content: string;
    createdAt: string;
    publishedAt?: string;
    author?: string;
    image?: { data?: { attributes?: { url: string } } };
    tags?: { data?: { attributes: { name: string } }[] };
    draft?: boolean;
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const strapiUrl = import.meta.env.STRAPI_URL;

  if (!strapiUrl) {
    warnOnce('STRAPI_URL not defined. Using local blog content.');
    return getCollection('blog', ({ data }: { data: BlogPost['data'] }) => !data.draft);
  }

  try {
    // Attempt to fetch from Strapi first (useful for automated n8n articles)
    const strapiArticles = await fetchStrapiApi<StrapiArticle[]>({
      endpoint: 'articles',
      query: { populate: '*' },
      wrappedByKey: 'data',
    });

    // Map Strapi schema to Astro's expected CollectionEntry format
    return strapiArticles.map((article: StrapiArticle) => ({
      id: article.attributes.slug,
      slug: article.attributes.slug,
      collection: 'blog',
      body: article.attributes.content,
      data: {
        title: article.attributes.title,
        description: article.attributes.description,
        publishedDate: new Date(article.attributes.publishedAt || article.attributes.createdAt),
        author: article.attributes.author || 'Lucky Yaduvanshi',
        image: article.attributes.image?.data?.attributes?.url,
        tags: article.attributes.tags?.data?.map((t) => t.attributes.name) || [],
        draft: article.attributes.draft || false,
      },
    })) as BlogPost[];
  } catch (error) {
    // Fallback to local Astro markdown when Strapi isn't completely configured
    warnOnce(
      `Strapi fallback triggered. Error details: ${error instanceof Error ? error.message : error}`
    );
    return getCollection('blog', ({ data }: { data: BlogPost['data'] }) => !data.draft);
  }
}

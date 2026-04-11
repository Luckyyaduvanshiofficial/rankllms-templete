import rss from '@astrojs/rss';
import { siteConfig } from '@/config';
import type { APIContext } from 'astro';
import { getBlogPosts } from '@/lib/strapi';
import { getPostsForMainFeed, type BlogEntry } from '@/lib/blog';

export async function GET(context: APIContext) {
  if (!siteConfig.features.blog) {
    return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"></rss>', {
      headers: { 'Content-Type': 'application/xml' },
    });
  }

  const allPosts = await getBlogPosts();
  const blogPosts = getPostsForMainFeed(allPosts);

  const sortedPosts = blogPosts.sort(
    (a: BlogEntry, b: BlogEntry) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf()
  );

  return rss({
    title: `${siteConfig.name} Blog`,
    description: siteConfig.description,
    site: context.site ?? siteConfig.url,
    items: sortedPosts.map((post: BlogEntry) => ({
      title: post.data.title,
      pubDate: post.data.publishedDate,
      description: post.data.description,
      author: post.data.author,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}

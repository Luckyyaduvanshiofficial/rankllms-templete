import type { CollectionEntry } from 'astro:content';

/** Blog post from local collections or Strapi-backed hybrid (`__fromStrapi`). */
export type BlogEntry = CollectionEntry<'blog'> & { __fromStrapi?: true };

/** Tag that triggers “news archive” behavior when older than `NEWS_ARCHIVE_MONTHS`. */
export const NEWS_TAG = 'news';

export const NEWS_ARCHIVE_MONTHS = 3;

/** Posts per page: homepage grid slice and `/blog/page/*` use the same value. */
export const BLOG_POSTS_PER_PAGE = 9;

function cutoffDate(monthsAgo: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return d;
}

/** True when post is tagged as news and published before the rolling cutoff. */
export function isArchivedNewsPost(
  post: BlogEntry,
  months: number = NEWS_ARCHIVE_MONTHS
): boolean {
  const isNews = post.data.tags?.some((t: string) => t.toLowerCase() === NEWS_TAG) ?? false;
  return isNews && post.data.publishedDate < cutoffDate(months);
}

/** Main blog listing: index, tag pages, pagination (excludes old “news” posts). */
export function getPostsForMainFeed(posts: BlogEntry[]): BlogEntry[] {
  return posts.filter((p) => !isArchivedNewsPost(p));
}

/** `/blog/archive` — only old news posts. */
export function getArchivedNewsPosts(posts: BlogEntry[]): BlogEntry[] {
  return posts.filter((p) => isArchivedNewsPost(p));
}

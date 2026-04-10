const fs = require('node:fs');
const indexFilePath = './src/pages/blog/index.astro';
const tagFilePath = './src/pages/blog/tag/[tag].astro';
let content;
try {
  content = fs.readFileSync(indexFilePath, 'utf8');
} catch (error) {
  console.error(`Error reading file ${indexFilePath}:`, error);
  process.exit(1);
}

const postsDeclaration = 'const posts = await getBlogPosts();';
const newPostsLogic = `const allPosts = await getBlogPosts();
const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
const posts = allPosts.filter(post => {
  const isNews = post.data.tags?.some((tag) => tag.toLowerCase() === 'news');
  const isOlderThan3Months = post.data.publishedDate < threeMonthsAgo;
  return !(isNews && isOlderThan3Months);
});`;

try {
  content = content.replace(postsDeclaration, newPostsLogic);
  fs.writeFileSync(indexFilePath, content, 'utf8');
} catch (error) {
  console.error(`Error processing ${indexFilePath}:`, error);
  process.exit(1);
}

let contentTag;
try {
  contentTag = fs.readFileSync(tagFilePath, 'utf8');
} catch (error) {
  console.error(`Error reading file ${tagFilePath}:`, error);
  process.exit(1);
}

try {
  contentTag = contentTag.replace(postsDeclaration, newPostsLogic);
  fs.writeFileSync(tagFilePath, contentTag, 'utf8');
} catch (error) {
  console.error(`Error processing ${tagFilePath}:`, error);
  process.exit(1);
}

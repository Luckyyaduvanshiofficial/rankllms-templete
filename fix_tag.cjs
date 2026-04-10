const fs = require('node:fs');
const tagFilePath = './src/pages/blog/tag/[tag].astro';
let content;
try {
  content = fs.readFileSync(tagFilePath, 'utf8');
} catch (error) {
  console.error(`Error reading file ${tagFilePath}:`, error);
  process.exit(1);
}

const startMarker = '{/* Featured Post (Hero) */}';
const endMarker = '{/* Grid */}';

let snippet;
try {
  snippet = fs.readFileSync('tag_hero.txt', 'utf8');
} catch (error) {
  console.error('Error reading tag_hero.txt:', error);
  process.exit(1);
}

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent =
    content.substring(0, startIndex) +
    snippet +
    '\n      ' +
    content.substring(endIndex + endMarker.length);
  try {
    fs.writeFileSync(tagFilePath, newContent, 'utf8');
    console.log('Successfully replaced [tag].astro hero');
  } catch (error) {
    console.error(`Error writing to file ${tagFilePath}:`, error);
    process.exit(1);
  }
} else {
  console.log('Markers not found');
}

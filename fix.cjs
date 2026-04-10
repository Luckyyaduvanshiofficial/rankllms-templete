const fs = require('node:fs');
const indexFilePath = './src/pages/blog/index.astro';
let content;
try {
  content = fs.readFileSync(indexFilePath, 'utf8');
} catch (error) {
  console.error(`Error reading file ${indexFilePath}:`, error);
  process.exit(1);
}

const startMarker = '{/* Top Featured Post */}';
const endMarker = '{/* Browse by Category */}';

let snippet;
try {
  snippet = fs.readFileSync('fix_hero.txt', 'utf8');
} catch (error) {
  console.error('Error reading fix_hero.txt:', error);
  process.exit(1);
}

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent =
    content.substring(0, startIndex) + snippet + '\n      ' + content.substring(endIndex);
  try {
    fs.writeFileSync(indexFilePath, newContent, 'utf8');
    console.log('Successfully replaced');
  } catch (error) {
    console.error(`Error writing to file ${indexFilePath}:`, error);
    process.exit(1);
  }
} else {
  console.log('Markers not found');
}

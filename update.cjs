const fs = require('node:fs');
const filePath = './src/pages/blog/index.astro';

let content;
try {
  content = fs.readFileSync(filePath, 'utf8');
} catch (error) {
  console.error(`Error reading file ${filePath}:`, error);
  process.exit(1);
}

const startMarker = '{/* Top Featured Post */}';
const endMarker = '{/* Browse by Category */}';

let snippet;
try {
  snippet = fs.readFileSync('snippet.txt', 'utf8');
} catch (error) {
  console.error('Error reading snippet.txt:', error);
  process.exit(1);
}

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent =
    content.substring(0, startIndex) + snippet + '\n      ' + content.substring(endIndex);
  try {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Successfully replaced');
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    process.exit(1);
  }
} else {
  console.log('Markers not found');
}

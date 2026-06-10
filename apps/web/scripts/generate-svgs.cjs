const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/illustrations');

const svgs = [
  'welcome.svg',
  'connect.svg',
  'done.svg',
  'inbox-empty.svg',
  'compose.svg',
  'ai-agent.svg',
  'search-empty.svg',
  'docs-empty.svg',
  'calendar-empty.svg',
  'error.svg'
];

const template = (name) => `<svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="200" rx="10" fill="transparent" />
  <circle cx="120" cy="80" r="40" fill="#FFFFFF" fill-opacity="0.1" />
  <rect x="80" y="140" width="80" height="10" rx="5" fill="#FFFFFF" fill-opacity="0.2" />
  <rect x="90" y="160" width="60" height="10" rx="5" fill="#FFFFFF" fill-opacity="0.1" />
  <text x="120" y="85" font-family="sans-serif" font-size="12" fill="#FFFFFF" text-anchor="middle" fill-opacity="0.5">${name}</text>
</svg>`;

svgs.forEach(name => {
  fs.writeFileSync(path.join(dir, name), template(name));
});

console.log('SVGs generated successfully!');

#!/usr/bin/env node
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node tools/validate-card.js path/to/card.html');
  process.exit(2);
}
const html = fs.readFileSync(file, 'utf8');
const errors = [];
const warnings = [];
const error = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const forbidden = [
  [/fonts\.googleapis\.com|fonts\.gstatic\.com/i, 'External Google Fonts are forbidden; use Wujood self-hosted fonts.'],
  [/font-awesome|fontawesome|cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome/i, 'Font Awesome/CDN icon libraries are forbidden; use Wujood SVG icons.'],
];
for (const [rx,msg] of forbidden) if (rx.test(html)) error(msg);

if (!/\/engine\/v1\/assets\/fonts\/fonts\.css/i.test(html)) warn('Wujood fonts.css is not referenced.');
if (!/\/engine\/v1\/styles\/wujood-base\.css/i.test(html)) warn('Wujood base CSS is not referenced.');

const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
for (const img of imgs) {
  const src = (img.match(/\bsrc=["']([^"']+)/i)||[])[1] || '(unknown image)';
  if (!/\bwidth=["']\d+/i.test(img) || !/\bheight=["']\d+/i.test(img)) warn(`${src}: image should declare width and height (or verify stable aspect-ratio in CSS).`);
}

const galleryTags = [...html.matchAll(/<[^>]+data-wj-behavior=["']gallery["'][^>]*>/gi)].map(m=>m[0]);
for (const tag of galleryTags) {
  if (/<img\b/i.test(tag) && !/loading=["']lazy["']/i.test(tag)) error('Gallery image must use loading="lazy".');
}

if (/data-wj-behavior=["']gallery["']/i.test(html) && !/type=["']module["']/i.test(html)) warn('Gallery behavior exists but no module script was detected; verify Wujood Engine is loaded.');

console.log(`Wujood Card Validator: ${file}`);
for (const m of errors) console.log(`ERROR: ${m}`);
for (const m of warnings) console.log(`WARN: ${m}`);
if (!errors.length && !warnings.length) console.log('PASS: card complies with checked Wujood v1 rules.');
else console.log(`Result: ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);

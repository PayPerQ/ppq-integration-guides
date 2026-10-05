#!/usr/bin/env node
// Validates every guide and builds index.json, which ppq.ai reads to list the guides.
//   node scripts/check.mjs          check guides, fail if index.json is out of date
//   node scripts/check.mjs --write  check guides and rewrite index.json
// No dependencies on purpose: contributors only need Node 18+.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const guidesDir = path.join(root, 'guides');
const write = process.argv.includes('--write');

const REQUIRED = ['title', 'slug', 'date', 'author', 'tags'];
const OPTIONAL = ['image', 'ogImage', 'intro', 'description'];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE = /^\/blog-images\/[a-z0-9-]+\/[^/]+$/;
// Images ppq.ai itself serves, usable without a copy here.
const SITE_IMAGES = ['/ppqai-opengraph-banner.png'];
// Words that must not appear in public guides.
const FORBIDDEN = [/openrouter/i];

// Minimal frontmatter parser: `key: value` lines and `key:` followed by `  - item` lists.
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const data = {};
  let listKey = null;
  for (const line of m[1].split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      data[listKey].push(unquote(item[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value === '') {
      data[key] = [];
      listKey = key;
    } else {
      data[key] = unquote(value);
      listKey = null;
    }
  }
  // An empty `key:` with no list items means "no value".
  for (const k of Object.keys(data)) {
    if (Array.isArray(data[k]) && data[k].length === 0 && k !== 'tags') data[k] = '';
  }
  return { data, body: text.slice(m[0].length) };
}

function unquote(v) {
  const t = v.trim();
  return /^(['"]).*\1$/.test(t) ? t.slice(1, -1) : t;
}

// Markdown with code blocks and inline code removed, so examples like `<YOUR_KEY>` are not flagged.
function proseOnly(body) {
  return body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

const errors = [];
const index = [];
const files = fs.readdirSync(guidesDir).filter((f) => f.endsWith('.md')).sort();

for (const file of files) {
  const err = (msg) => errors.push(`guides/${file}: ${msg}`);
  const text = fs.readFileSync(path.join(guidesDir, file), 'utf8');
  const parsed = parseFrontmatter(text);
  if (!parsed) {
    err('missing frontmatter (--- block at the top)');
    continue;
  }
  const { data, body } = parsed;

  for (const k of REQUIRED) if (!data[k] || data[k].length === 0) err(`missing "${k}"`);
  for (const k of Object.keys(data)) {
    if (!REQUIRED.includes(k) && !OPTIONAL.includes(k)) err(`unknown frontmatter field "${k}"`);
  }
  if (data.slug !== file.replace(/\.md$/, '')) err(`slug "${data.slug}" must match the file name`);
  if (data.slug && !SLUG.test(data.slug)) err('slug must be lowercase letters, digits and dashes');
  if (data.date && !DATE.test(data.date)) err('date must be YYYY-MM-DD');
  if (data.tags && !Array.isArray(data.tags)) err('tags must be a list');

  const images = [data.image, data.ogImage].filter(Boolean);
  for (const m of body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) images.push(decodeURI(m[1].trim()));
  for (const img of new Set(images)) {
    if (SITE_IMAGES.includes(img)) continue;
    if (!IMAGE.test(img)) err(`image "${img}" must be under /blog-images/<slug>/`);
    else if (!fs.existsSync(path.join(root, img))) err(`image "${img}" not found in the repo`);
  }

  const prose = proseOnly(body);
  if (/<[a-zA-Z!/][^>]*>/.test(prose)) err('raw HTML is not rendered on ppq.ai; use Markdown (wrap examples in backticks)');
  for (const re of FORBIDDEN) if (re.test(text)) err(`contains a forbidden word (${re.source})`);

  index.push({
    slug: data.slug,
    title: data.title,
    date: data.date,
    author: data.author,
    tags: Array.isArray(data.tags) ? data.tags : [],
    image: data.image || '',
    ogImage: data.ogImage || '',
    intro: data.intro || '',
    description: data.description || '',
    path: `guides/${file}`,
  });
}

index.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
const json = JSON.stringify({ version: 1, guides: index }, null, 2) + '\n';
const indexPath = path.join(root, 'index.json');

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s) in ${files.length} guides.`);
  process.exit(1);
}
if (write) {
  fs.writeFileSync(indexPath, json);
  console.log(`index.json written (${index.length} guides).`);
} else if (!fs.existsSync(indexPath) || fs.readFileSync(indexPath, 'utf8') !== json) {
  console.error('index.json is out of date. Run: node scripts/check.mjs --write');
  process.exit(1);
} else {
  console.log(`${index.length} guides OK, index.json up to date.`);
}

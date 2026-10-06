#!/usr/bin/env node
// Rasterises web/icons/icon.svg into the PNG sizes the web app manifest needs (uses Playwright).
import { launch } from './browser.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const svg = readFileSync(new URL('../web/icons/icon.svg', import.meta.url), 'utf8');
const browser = await launch();
const page = await browser.newPage();
const shot = async (size, file, maskable = false) => {
  await page.setViewportSize({ width: size, height: size });
  // Maskable icons keep the artwork inside the 80% safe zone on a full-bleed background.
  const inner = maskable ? svg.replace('rx="112"', 'rx="0"').replace('<path', '<g transform="translate(51.2 51.2) scale(0.8)"><path').replace('</svg>', '</g></svg>') : svg;
  await page.setContent(`<html><body style="margin:0;background:${maskable ? '#0d5c63' : 'transparent'}">${inner.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: fileURLToPath(new URL(`../web/icons/${file}`, import.meta.url)), omitBackground: !maskable });
};
await shot(192, 'icon-192.png');
await shot(512, 'icon-512.png');
await shot(512, 'maskable-512.png', true);
await browser.close();
console.log('icons written');

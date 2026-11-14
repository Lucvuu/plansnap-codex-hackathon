'use strict';
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

const root = process.cwd();
const required = [
  'app/index.html', 'app/manifest.json', 'app/sw.js', 'app/css/style.css',
  'app/js/storage.js', 'app/js/compressor.js', 'app/js/scheduler.js',
  'app/js/vision-agent.js', 'app/js/ical-export.js', 'app/js/app.js',
  'capacitor.config.json'
];
for (const file of required) {
  if (!existsSync(join(root, file))) throw new Error(`Missing build asset: ${file}`);
}
const manifest = JSON.parse(readFileSync(join(root, 'app/manifest.json'), 'utf8'));
if (manifest.display !== 'standalone' || manifest.start_url !== './index.html') throw new Error('Invalid standalone manifest.');
if (manifest.theme_color !== '#0a0f1d' || manifest.background_color !== '#0a0f1d') throw new Error('Invalid PWA colors.');
const capacitor = JSON.parse(readFileSync(join(root, 'capacitor.config.json'), 'utf8'));
if (capacitor.webDir !== 'app' || !capacitor.appId) throw new Error('Invalid Capacitor config.');
const html = readFileSync(join(root, 'app/index.html'), 'utf8');
for (const asset of required.filter((file) => file.startsWith('app/js/')).map((file) => `./js/${file.split('/').pop()}`)) {
  if (!html.includes(asset)) throw new Error(`index.html does not load ${asset}`);
}
console.log('Production asset and configuration checks passed.');

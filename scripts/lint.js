'use strict';
const { execFileSync } = require('node:child_process');
const { readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');

function findJs(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? findJs(full) : (name.endsWith('.js') ? [full] : []);
  });
}

const files = [...findJs(join(process.cwd(), 'app', 'js')), join(process.cwd(), 'app', 'sw.js')];
for (const file of files) execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
console.log(`Syntax check passed: ${files.length} JavaScript files.`);

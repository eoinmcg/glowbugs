#!/usr/bin/env node

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change to the project root (parent of scripts directory)
process.chdir(join(__dirname, ".."));

const LITTLEJS = 'littlejs.min.js'
const DIST_FOLDER = 'dist';
const SRC = 'game.js';

fs.copyFileSync(`littlejs/${LITTLEJS}`, `${DIST_FOLDER}/${LITTLEJS}`);

let buffer = '';
buffer = '<!DOCTYPE html>';
buffer += '<head>';
// buffer += `<title>${PROGRAM_TITLE}</title>`;
buffer += '<meta charset=utf-8>';
buffer += '</head>';
buffer += '<body>';
buffer += `<script src="${LITTLEJS}"></script>`;
buffer += `<script src="${SRC}"></script>`;

// output html file
fs.writeFileSync(`${DIST_FOLDER}/index.html`, buffer, { flag: 'w+' });


fs.rmSync('DIST_FOLDER/postmortem.html', { force: true });
fs.rmSync('DIST_FOLDER/style.css', { force: true });

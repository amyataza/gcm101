#!/usr/bin/env node
// Minimal static server for development and testing (node tools/serve.mjs web 8080).
// Production hosting is any static host; see docs/deployment.md.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';
const root = resolve(process.argv[2] || 'web');
const port = Number(process.argv[3] || 8080);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.m4a': 'audio/mp4', '.txt': 'text/plain; charset=utf-8', '.csv': 'text/csv' };
const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = normalize(join(root, path));
    if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    const data = await readFile(file);
    const headers = { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
    const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
    if (range) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Number(range[2]) : data.length - 1;
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${data.length}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
      res.end(data.subarray(start, end + 1));
      return;
    }
    // Compress text like production static hosts do (GitHub Pages, Netlify, Cloudflare Pages).
    if (/gzip/.test(req.headers['accept-encoding'] || '') && /text|json|javascript|svg|manifest/.test(headers['Content-Type'])) {
      const gz = gzipSync(data);
      res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip', 'Content-Length': gz.length, Vary: 'Accept-Encoding' });
      res.end(gz);
      return;
    }
    res.writeHead(200, { ...headers, 'Content-Length': data.length, 'Accept-Ranges': 'bytes' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
  }
});
// If the port is busy (e.g. another dev server), try the next few instead of crashing.
let tryPort = port;
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE' && tryPort < port + 10) {
    console.log(`Port ${tryPort} is in use, trying ${tryPort + 1}…`);
    server.listen(++tryPort);
  } else throw e;
});
server.on('listening', () => console.log(`Serving ${root} at http://localhost:${tryPort}`));
server.listen(tryPort);

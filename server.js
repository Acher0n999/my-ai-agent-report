'use strict';
// Minimal zero-dependency static server for local preview.
// Usage: node server.js   (optionally PORT=8080 node server.js)
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 4318;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.woff2': 'font/woff2',
};

function send(res, code, type, body) {
  res.writeHead(code, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]);
  } catch {
    return send(res, 400, 'text/plain; charset=utf-8', 'bad request');
  }

  // resolve inside ROOT only (no path traversal)
  const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(ROOT)) return send(res, 403, 'text/plain; charset=utf-8', 'forbidden');

  fs.readFile(file, (err, data) => {
    if (err) {
      if (fs.existsSync(file + '.html')) {
        return fs.readFile(file + '.html', (e2, d2) =>
          e2 ? notFound(res) : send(res, 200, TYPES['.html'], d2));
      }
      return notFound(res);
    }
    send(res, 200, TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', data);
  });
});

function notFound(res) {
  fs.readFile(path.join(ROOT, '404.html'), (e, d) =>
    e ? send(res, 404, 'text/plain; charset=utf-8', 'Not found')
      : send(res, 404, TYPES['.html'], d));
}

server.listen(PORT, '127.0.0.1', () => {
  console.log(`AI Agent 使用报告 → http://127.0.0.1:${PORT}/`);
});

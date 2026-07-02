// Minimal zero-dependency static server for the portfolio site.
// Hostinger (and most Node hosts) run `npm start` and expect the app to
// listen on process.env.PORT. The static site lives in ./upanishad-portfolio.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "upanishad-portfolio");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

function sendError(res, status, message) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<h1>${status}</h1><p>${message}</p>`);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(req.url, `http://${req.headers.host || "localhost"}`).pathname
    );
  } catch {
    return sendError(res, 400, "Bad request");
  }

  let filePath = path.join(ROOT, pathname);

  // Prevent path traversal outside the site root.
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    return sendError(res, 403, "Forbidden");
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const stream = fs.createReadStream(filePath);

    stream.on("open", () => {
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    });
    stream.on("error", () => {
      sendError(res, 404, "Page not found.");
    });
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Portfolio server listening on port ${PORT}`);
});

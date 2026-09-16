import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const siteRoots = [
  { prefix: "/", directory: join(projectRoot, "src", "public") },
  { prefix: "/pages/", directory: join(projectRoot, "src", "pages") },
];
const port = Number(process.env.PORT || process.argv[2] || 3000);
const requestTimeoutMs = 30_000;
const shutdownTimeoutMs = 10_000;

const mimeTypes = {
  ".css": "text/css; charset=utf-8", ".gif": "image/gif", ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml",
  ".wav": "audio/wav", ".webp": "image/webp",
};

function pathnameFrom(url) {
  try { return decodeURIComponent(new URL(url, "http://localhost").pathname); }
  catch { return null; }
}

function getSafePath(requestUrl) {
  const pathname = pathnameFrom(requestUrl);
  if (!pathname) return null;
  const root = siteRoots.find(({ prefix }) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix));
  if (!root) return null;
  const relativePath = pathname === "/" ? "index.html" : pathname.slice(root.prefix.length);
  const filePath = normalize(join(root.directory, relativePath || "index.html"));
  return filePath === root.directory || filePath.startsWith(`${root.directory}${sep}`) ? filePath : null;
}

async function existingFile(filePath) {
  try { return (await fs.stat(filePath)).isFile() ? filePath : null; } catch { return null; }
}

async function resolveFilePath(requestUrl) {
  const requestedPath = getSafePath(requestUrl);
  if (!requestedPath) return null;
  const directPath = await existingFile(requestedPath);
  if (directPath) return directPath;
  const pathname = pathnameFrom(requestUrl);
  if (pathname?.startsWith("/pages/")) {
    const sharedAsset = await existingFile(join(siteRoots[0].directory, pathname.slice("/pages/".length)));
    if (sharedAsset) return sharedAsset;
  }
  return existingFile(join(siteRoots[0].directory, "index.html"));
}

function headersFor(filePath) {
  const extension = extname(filePath).toLowerCase();
  const isHtml = extension === ".html";
  return {
    "Cache-Control": isHtml ? "no-cache, must-revalidate" : "public, max-age=3600, stale-while-revalidate=86400",
    "Content-Type": mimeTypes[extension] || "application/octet-stream",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
  };
}

const server = createServer(async (request, response) => {
  response.setTimeout(requestTimeoutMs, () => response.destroy());
  if (request.url === "/healthz" || request.url === "/health") {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" }).end("Method Not Allowed"); return;
    }
    response.writeHead(200, { "Cache-Control": "no-store", "Content-Type": "application/json; charset=utf-8" });
    response.end(request.method === "HEAD" ? undefined : JSON.stringify({ status: "ok", service: "static-portal" }));
    return;
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method Not Allowed"); return;
  }
  try {
    const filePath = await resolveFilePath(request.url || "/");
    if (!filePath) { response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not Found"); return; }
    response.writeHead(200, headersFor(filePath));
    if (request.method === "HEAD") { response.end(); return; }
    const stream = createReadStream(filePath);
    stream.on("error", () => { if (!response.headersSent) response.writeHead(500); response.end("Internal Server Error"); });
    stream.pipe(response);
  } catch {
    if (!response.headersSent) response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal Server Error");
  }
});

server.keepAliveTimeout = 5_000;
server.headersTimeout = requestTimeoutMs + 5_000;
server.listen(port, "0.0.0.0", () => console.log(`[delta-synth] Static portal available on port ${port}`));

let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[delta-synth] ${signal}: closing server`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), shutdownTimeoutMs).unref();
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (error) => { console.error("[delta-synth] Uncaught exception", error); shutdown("uncaughtException"); });
process.on("unhandledRejection", (error) => { console.error("[delta-synth] Unhandled rejection", error); shutdown("unhandledRejection"); });

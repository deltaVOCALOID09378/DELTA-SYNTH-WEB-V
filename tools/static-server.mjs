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

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".webp": "image/webp",
};

function getSafePath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  const root = siteRoots.find(({ prefix }) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix));
  if (!root) return null;

  const relativePath = pathname === "/" ? "index.html" : pathname.slice(root.prefix.length);
  const filePath = normalize(join(root.directory, relativePath || "index.html"));
  return filePath === root.directory || filePath.startsWith(`${root.directory}${sep}`) ? filePath : null;
}

async function resolveFilePath(requestUrl) {
  const requestedPath = getSafePath(requestUrl);
  if (!requestedPath) return null;

  try {
    const stats = await fs.stat(requestedPath);
    if (stats.isFile()) return requestedPath;
  } catch {
    // Fall through to shared assets or the site's entry point for unknown routes.
  }

  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  if (pathname.startsWith("/pages/")) {
    const sharedAssetPath = join(siteRoots[0].directory, pathname.slice("/pages/".length));
    try {
      const stats = await fs.stat(sharedAssetPath);
      if (stats.isFile()) return sharedAssetPath;
    } catch {
      // Continue to the public entry point when the shared asset is unavailable.
    }
  }

  const fallbackPath = join(siteRoots[0].directory, "index.html");
  try {
    await fs.access(fallbackPath);
    return fallbackPath;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  try {
    const filePath = await resolveFilePath(request.url || "/");
    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }

    const contentType = mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
    const headers = {
      "Cache-Control": "no-cache",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    };
    response.writeHead(200, headers);
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal Server Error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`[delta-synth] Static portal available on port ${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

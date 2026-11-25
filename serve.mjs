// Zero-dependency static preview server with no-store caching,
// so edits always show up in the browser preview.
const root = import.meta.dir.replace(/\\/g, "/");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};
const noStore = { "Cache-Control": "no-store, must-revalidate" };

Bun.serve({
  hostname: "127.0.0.1",
  port: 4321,
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";

    const target = (root + pathname).replace(/\/\.\.+/g, "");
    if (!target.startsWith(root)) return new Response("Forbidden", { status: 403, headers: noStore });

    const file = Bun.file(target);
    if (!(await file.exists())) return new Response("Not found", { status: 404, headers: noStore });

    const ext = target.slice(target.lastIndexOf("."));
    return new Response(file, {
      headers: { ...noStore, "Content-Type": types[ext] || "application/octet-stream" },
    });
  },
});

console.log("preview on http://127.0.0.1:4321");

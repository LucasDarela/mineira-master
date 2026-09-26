import { promises as fs } from "fs";
import path from "path";

// Serve as imagens enviadas pelo admin (antes ficavam no Supabase Storage)
const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const base = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "storage"), "uploads");
  const file = path.resolve(base, ...parts.map((p) => decodeURIComponent(p)));
  if (!file.startsWith(base + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(file);
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

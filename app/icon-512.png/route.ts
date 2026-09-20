import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  const body = await readFile(join(process.cwd(), "public/android-chrome-512x512.png"));
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

import { calculatorManifest } from "@/lib/seo";

export function GET() {
  return Response.json(calculatorManifest(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}

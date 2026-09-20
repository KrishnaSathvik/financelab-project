import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (!host?.startsWith("www.")) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.hostname = host.slice(4);
  url.protocol = "https:";
  url.port = "";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

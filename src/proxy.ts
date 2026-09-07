import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  let baseResponse = NextResponse.next({ request });

  if (hostname.startsWith("admin.")) {
    console.log(`[Middleware] Admin domain detected. Pathname: ${url.pathname}`);
    if (url.pathname === "/") {
      const rewriteUrl = new URL("/admin", request.url);
      rewriteUrl.search = url.search;
      console.log(`[Middleware] Rewriting / to ${rewriteUrl.toString()}`);
      baseResponse = NextResponse.rewrite(rewriteUrl);
    } else if (!url.pathname.startsWith("/admin")) {
      const rewriteUrl = new URL(`/admin${url.pathname}`, request.url);
      rewriteUrl.search = url.search;
      console.log(`[Middleware] Rewriting ${url.pathname} to ${rewriteUrl.toString()}`);
      baseResponse = NextResponse.rewrite(rewriteUrl);
    }
  }

  const finalResponse = await updateSession(request, baseResponse);
  console.log(`[Middleware] Returning response for ${url.pathname}`);
  return finalResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

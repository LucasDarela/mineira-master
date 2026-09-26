import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

// Protege as rotas /admin usando a sessão própria (cookie assinado), sem Supabase.
export async function updateSession(request: NextRequest, customResponse?: NextResponse) {
  const response = customResponse || NextResponse.next({ request });
  const user = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  const hostname = request.headers.get("host") || "";
  const isAdminDomain = hostname.startsWith("admin.");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin") || isAdminDomain;
  const isLoginRoute =
    request.nextUrl.pathname.startsWith("/admin/login") ||
    (isAdminDomain && request.nextUrl.pathname === "/login");

  if (!user && isAdminRoute && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return response;
}

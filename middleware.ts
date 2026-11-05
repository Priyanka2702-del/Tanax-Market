import { NextResponse, type NextRequest } from "next/server";

/**
 * First line of defence for the private portal: no session cookie -> /login.
 * The cookie is validated against the database in app/dashboard/layout.tsx and in every API route.
 */
export function middleware(req: NextRequest) {
  if (!req.cookies.get("tm_session")?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };

import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes handle their own auth — skip intl middleware and locale redirect
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Strip locale prefix to get the route path (e.g. /en/auth/login → /auth/login)
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  const publicPaths = ["/auth", "/terms", "/privacy", "/api/webhooks"];
  const isLocaleRoot = pathname === "/" || rest === "/";
  const isPublic =
    isLocaleRoot ||
    publicPaths.some((p) => rest === p || rest.startsWith(p + "/"));

  const intlResponse = intlMiddleware(request);

  if (isPublic) return intlResponse;

  let response = intlResponse ?? NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const localePrefix = routing.locales
    .map((l) => `/${l}`)
    .find((l) => pathname.startsWith(l));
  const locale = localePrefix?.slice(1) ?? routing.defaultLocale;

  if (!user && rest !== "/auth" && !rest.startsWith("/auth/")) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

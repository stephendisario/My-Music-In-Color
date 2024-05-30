import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./app/lib/session";

const protectedRoutes = ["/", "/dashboard"];
const publicRoutes = ["/login", "/callback"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = cookies().get("session")?.value;
  console.log("COOKIE", cookie)
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.payload) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.payload) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: publicRoutes.concat(protectedRoutes),
};
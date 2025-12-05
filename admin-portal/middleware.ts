export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/contacts/:path*", "/users/:path*", "/content/:path*"],
};




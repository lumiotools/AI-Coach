import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/home",
    "/home/faqs",
    "/home/pricing",
    "/home/blog",
    "/api/(.*)",
    "/stripe",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
//d

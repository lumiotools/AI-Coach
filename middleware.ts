import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/home",
    "/home/faqs",
    "/home",
    "/home/blog",
    "/home/about",
    "/api/(.*)",
    "/stripe",
    "/property-pitch"
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
//ddhhdffddffffffddddgff


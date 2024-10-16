import { Footer } from "@/components/LandingPage/Footer";
import { Header } from "@/components/LandingPage/Header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col bg-black text-white min-h-screen scroll-smooth overflow-y-auto">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;

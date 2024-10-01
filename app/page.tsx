"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import useTheme from "@/app/hooks/useTheme";
import { Page } from "@/components/page";

const ChatPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme(); 

  useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const isMobileDevice = /Mobi|Android|iPhone/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/home");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
        <div className="text-center transition-opacity duration-500 ease-in-out">
          <h2 className="text-2xl font-semibold mb-4 animate-pulse opacity-90">
            Loading...
          </h2>
          <p className="text-gray-300">Please wait...</p>
        </div>
      </div>
    );
  }

  return isSignedIn ? (
    <Page/>
  ) : null; 
};

export default ChatPage;

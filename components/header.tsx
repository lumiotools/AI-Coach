"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Menu, BrainCircuit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import styles from "./overall.module.css";
import sun from "@/components/Assets/sun.svg";
import moon from "@/components/Assets/MoonStars.svg";
import lightlogo from "@/components/Assets/light-logo1.png";
import darklogo from "@/components/Assets/dark-logo3.png";
import useTheme from "@/app/hooks/useTheme";
import { useClerk, useUser, useAuth } from "@clerk/nextjs";
import PersonalizedAIForm from "./PersonalizeAIForm";

export default function HeaderBar({
  isSidebarOpen,
  setIsSidebarOpen,
  signOut,
}: any) {
  const { theme, toggleTheme } = useTheme();
  const { openUserProfile } = useClerk();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => setIsFormOpen(true);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const hasSeenPersonalizedIntro =
        user.unsafeMetadata?.hasSeenPersonalizedIntro;
      const hasSeenIntro = user.unsafeMetadata?.hasSeenIntro;

      if (!hasSeenPersonalizedIntro && hasSeenIntro) {
        setIsFormOpen(true);
      }
    }
  }, [isLoaded, isSignedIn, user, userId]);

  const closeIntroModal = () => {
    setIsFormOpen(false);

    if (user) {
      user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          hasSeenPersonalizedIntro: true,
        },
      });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 text-white bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] dark:bg-[#A5C3FF3D]">
        <div className="flex items-center">
          <Button
            variant="navbtn"
            size="nav"
            className="md:hidden mr-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5 text-[#ffffff] dark:text-[#001c4f]" />
          </Button>

          <Link href="/home">
            {theme === "light" ? (
              <Image
                src={lightlogo}
                alt="AgentCoach.ai Logo"
                className={`h-10 md:h-10 w-[160px]`}
              />
            ) : (
              <Image
                src={darklogo}
                alt="AgentCoach.ai Logo"
                className={`h-10 md:h-10 w-[160px]`}
              />
            )}
          </Link>
        </div>
        <div className="flex items-center md:space-x-4 space-x-0">
          <Button
            onClick={() => handleOpenForm()}
            variant="navbtn"
            size="nav"
            className="font-100 text-white md:hidden"
          >
            <BrainCircuit
              className={`size-5 md:h-5 md:w-5 text-[#ffffff] dark:text-[#001c4f]  ${styles.pad}`}
            />
          </Button>

          <Button
            onClick={toggleTheme}
            variant="navbtn"
            size="nav"
            className={styles.pad}
          >
            {theme === "light" ? (
              <Image
                src={sun}
                className={`${styles.mode} !size-6`}
                alt="Sun Icon"
              />
            ) : (
              <Image
                src={moon}
                className={`${styles.mode} !size-6`}
                alt="Moon Icon"
              />
            )}
          </Button>

          <Button
            onClick={() => openUserProfile()}
            variant="navbtn"
            size="nav"
            className="font-100 text-white md:hidden "
          >
            <Settings
              className={`size-5 md:h-5 md:w-5 text-[#ffffff] dark:text-[#001c4f]  ${styles.pad}`}
            />
          </Button>
          <Button
            variant="navbtn"
            size="nav"
            className="font-100 text-white md:hidden"
          >
            <LogOut
              className={`size-5 md:h-5 md:w-5 text-[#ffffff] dark:text-[#001c4f] ${styles.pad}`}
            />
          </Button>

          <Button
            onClick={() => handleOpenForm()}
            variant="gradient"
            size="sm"
            className="hidden md:flex dark:text-[#001c4f] text-sm space-x-2"
          >
            <BrainCircuit className="size-5" />
            <p>Personalize AI</p>
          </Button>

          <Button
            onClick={() => openUserProfile()}
            variant="gradient"
            size="sm"
            className="hidden md:flex dark:text-[#001c4f] text-sm space-x-2"
          >
            <Settings className="size-5" />
            <p>Settings</p>
          </Button>

          <Button
            onClick={() => signOut({ redirectUrl: "/home" })}
            variant="gradient"
            size="sm"
            className="hidden md:flex dark:text-[#001c4f] text-sm space-x-2"
          >
            <LogOut className="size-5" />
            <p>Logout</p>
          </Button>
        </div>
      </header>

      <PersonalizedAIForm isOpen={isFormOpen} onClose={closeIntroModal} />
    </>
  );
}

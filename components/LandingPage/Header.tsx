"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import logo from "@/components/Assets/logo.png";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="py-2 px-6 flex justify-between items-center bg-white relative">
      <div className="flex items-center">
        <Link href="/home">
          <Image src={logo} alt="AgentCoach Logo" className="w-auto h-16" />
        </Link>
      </div>
      <button
        className="md:hidden text-black"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:block absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent z-50`}
      >
        <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0">
          {["home", "pricing", "faqs", "blog"].map((page) => (
            <li key={page}>
              <Link
                href={
                  page === "home"
                    ? "/home"
                    : page === "blog"
                    ? "https://agentcoachblogteamlumio.wordpress.com/"
                    : `/home/${page}`
                }
                className="text-black hover:text-blue-500 w-full text-left"
              >
                {page === "faqs"
                  ? "FAQ's"
                  : page.charAt(0).toUpperCase() + page.slice(1)}
              </Link>
            </li>
          ))}
          {isSignedIn ? (
            <>
              <li className="md:hidden">
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="text-black hover:text-blue-500 w-full text-left"
                  >
                    Go to Chatbot
                  </Button>
                </Link>
              </li>
              <li className="md:hidden">
                <Link href="/home#home-page-bottom-section">
                  <Button className="text-white w-full rounded-md bg-black">
                    See Demo
                  </Button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="md:hidden">
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    className="text-black hover:text-blue-500 w-full text-left"
                  >
                    Log In
                  </Button>
                </Link>
              </li>
              <li className="md:hidden">
                <Link href="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-md">
                    Sign Up
                  </Button>
                </Link>
              </li>
              <li className="md:hidden">
                <Link href="/demo">
                  <Button className="text-white w-full rounded-md">
                    See Demo
                  </Button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="hidden md:flex space-x-4">
        {isSignedIn ? (
          <>
            <Link href="/">
              <Button className="text-white bg-blue-500 hover:bg-blue-600 rounded-md w-full text-left">
                Go to Chatbot
              </Button>
            </Link>
            <Link href="/home#home-page-bottom-section">
              <Button className="text-white w-full rounded-md">See Demo</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/signin">
              <Button
                variant="ghost"
                className="text-black hover:text-blue-500"
              >
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Sign Up
              </Button>
            </Link>
            <Link href="/home#home-page-bottom-section">
              <Button className="text-white w-full rounded-md bg-black">
                See Demo
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

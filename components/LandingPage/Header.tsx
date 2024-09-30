"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className="py-4 px-6 flex justify-between items-center bg-white relative"
    >
      <div
        className="text-xl md:text-2xl font-bold text-black"
      >
        agentcoach.ai
      </div>
      <button
        className="md:hidden text-black"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X size={24} />
        ) : (
          <Menu size={24} />
        )}
      </button>
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:block absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent z-50`}
      >
        <ul
          className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0"
        >
          {["home", "pricing", "faqs", "blog"].map((page) => (
            <li key={page}>
              <Link
                href={page === "home" ? "/home" : `/home/${page}`} // Updated for home page
                className="text-black hover:text-blue-500 w-full text-left"
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </Link>
            </li>
          ))}
          <li className="md:hidden">
            <Link href="https://blessed-perch-83.accounts.dev/sign-in">
              <Button
                variant="ghost"
                className="text-black hover:text-blue-500 w-full text-left"
              >
                Log In
              </Button>
            </Link>
          </li>
          <li className="md:hidden">
            <Link href="https://blessed-perch-83.accounts.dev/sign-in">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                Sign Up
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="hidden md:flex space-x-4">
        <Link href="https://blessed-perch-83.accounts.dev/sign-in">
          <Button
            variant="ghost"
            className="text-black hover:text-blue-500"
          >
            Log In
          </Button>
        </Link>
        <Link href="https://blessed-perch-83.accounts.dev/sign-in">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
}

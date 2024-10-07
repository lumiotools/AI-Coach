import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import logo from "@/components/Assets/logo.png";
import Image from 'next/image';

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const socialLinks = [
  { href: "/", icon: <Facebook size={20} />, label: "Facebook" },
  { href: "/", icon: <Twitter size={20} />, label: "Twitter" },
  { href: "/", icon: <Instagram size={20} />, label: "Instagram" },
  { href: "/", icon: <Linkedin size={20} />, label: "LinkedIn" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQ's" },
  { href: "/blog", label: "Blog" },
];

interface QuickLinkProps {
  href: string;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <Link href={href} className="hover:text-blue-400 transition-colors" aria-label={label}>
      {icon}
    </Link>
  );
}

function QuickLink({ href, label }: QuickLinkProps) {
  return (
    <li>
      <Link href={href} className="hover:text-blue-400 transition-colors">
        {label}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="bg-white text-black pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto gap-12 flex flex-col md:flex-row justify-between">
        <div className="flex space-y-4 flex-col">
          <div className="w-full">
            <Image src={logo} alt="AgentCoach Logo" className="h-16 w-auto ml-[-10px]" />
          </div>
          <p className="text-sm text-gray-500 flex flex-col">
            <span>Empowering real estate professionals with </span>
            <span>AI-driven coaching and insights.</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start justify-center gap-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="flex flex-row items-start justify-center gap-6">
              {quickLinks.map(link => (
                <QuickLink key={link.href} {...link} />
              ))}
            </ul>
          </div>

          <div className="flex space-x-4">
            {socialLinks.map(link => (
              <SocialLink key={link.label} {...link} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold">Contact Us</h4>
          <p className="text-sm">Email</p>
          <p>support@agentcoach.ai</p>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-gray-400">
        <p>© 2024 Agentcoach.ai. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}

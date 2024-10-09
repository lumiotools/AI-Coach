import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import logo from "@/components/Assets/newlogo.png";
import Image from 'next/image';

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=61565512659552", icon: <Facebook size={20} />, label: "Facebook" },
  { href: "https://x.com/aiagentcoach", icon: <Twitter size={20} />, label: "Twitter" },
  { href: "https://www.instagram.com/agentcoach.ai", icon: <Instagram size={20} />, label: "Instagram" },
  { href: "https://www.linkedin.com/in/jeff-hammer-950118330/", icon: <Linkedin size={20} />, label: "LinkedIn" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/home/about", label: "About" },
  { href: "/home/faqs", label: "FAQ's" },
  { href: "/home/pricing", label: "Pricing" },
  { href: "https://agentcoachblogteamlumio.wordpress.com", label: "Blog" },
];

interface QuickLinkProps {
  href: string;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <Link href={href} className="hover:text-blue-400 transition-colors" aria-label={label} target="_blank"
      rel="noopener noreferrer">
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
    <footer className="bg-white text-black pt-16 pb-5 px-6 drop-shadow shadow-md">
      <div className="max-w-7xl mx-auto gap-12 flex flex-col md:flex-row justify-between">
        <div className="flex space-y-4 flex-col">
          <div className="w-full">
            <Image src={logo} alt="AgentCoach Logo" className="h-10 w-auto" />
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
      <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-gray-300">
        <p>© 2024 Agentcoach.ai. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/privacy-policy.pdf" className="transition-colors hover:text-blue-400" >Privacy Policy</a>
          <a href="/terms-of-service.pdf" className="transition-colors hover:text-blue-400">Terms of Service</a>
          <a href="/cookie-policy.pdf" className="transition-colors hover:text-blue-400">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}

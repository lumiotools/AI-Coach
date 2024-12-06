"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const prompts: string[] = [
    "Create 10 Engaging Facebook Ads for First-Time Home Buyers",
    "Craft a Tailored Home Buyer Guide for Client 'Mr. & Mrs. Smith'",
    "Generate a Professional Podcast Scripts with Interviewing Local Experts",
    "Master Negotiations: Paste Your Text - Get Expert Advice!",
    "Design a Marketing Schedule to Earn $100K in 12 Months",
    "Create a Beautiful Mid-Century House with Pool Image for Instagram",
    "Develop Telephone Scripts & Email Campaigns for Expired Listings",
    "Write a 700 Word In-Depth Article on Your Local Real Estate Market",
    "Generate a Personalized Moving Checklist from my Company",
    "Provide a Personal Mantra to Help me Stay Focused and Motivated",
    "What can I do to work less, or smarter, without sacrificing income?",
    "Develop Effective Lead Generation Campaign to Attract More Clients"
    ];

export default function PromptCards() {
  const scrollRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastScrollPositions = useRef<number[]>([0, 0, 0]);

  //   const scroll = () => {
  //     scrollRefs.forEach((ref, index) => {
  //       if (ref.current && (hoveredRow !== index || hoveredCard === null)) {
  //         if (index === 1) {
  //           ref.current.scrollLeft -= 1; // Move second row in opposite direction
  //         } else {
  //           ref.current.scrollLeft += 1;
  //         }

  //         // Check if we've reached the end and loop back
  //         if (ref.current.scrollLeft <= 0) {
  //           ref.current.scrollLeft = ref.current.scrollWidth / 2;
  //         } else if (ref.current.scrollLeft >= ref.current.scrollWidth / 2) {
  //           ref.current.scrollLeft = 0;
  //         }

  //         // Update last scroll position
  //         lastScrollPositions.current[index] = ref.current.scrollLeft;
  //       }
  //     });
  //     animationRef.current = requestAnimationFrame(scroll);
  //   };

  //   useEffect(() => {
  //     // Set initial scroll positions
  //     scrollRefs.forEach((ref, index) => {
  //       if (ref.current) {
  //         if (index === 1) {
  //           ref.current.scrollLeft = ref.current.scrollWidth / 4;
  //         } else if (index === 2) {
  //           ref.current.scrollLeft = ref.current.scrollWidth / 3;
  //         }
  //         lastScrollPositions.current[index] = ref.current.scrollLeft;
  //       }
  //     });

  //     animationRef.current = requestAnimationFrame(scroll);
  //     return () => {
  //       if (animationRef.current) {
  //         cancelAnimationFrame(animationRef.current);
  //       }
  //     };
  //   }, []);

  const scroll = () => {
    scrollRefs.forEach((ref, index) => {
      if (ref.current && (index !== hoveredRow || !hoveredCard)) {
        if (index === 1) {
          ref.current.scrollLeft -= 1;
        } else {
          ref.current.scrollLeft += 1;
        }
        if (
          ref.current.scrollLeft <= 0 ||
          ref.current.scrollLeft >= ref.current.scrollWidth / 2
        ) {
          ref.current.scrollLeft =
            index === 1 ? ref.current.scrollWidth / 2 : 0;
        }
      }
    });
    animationRef.current = requestAnimationFrame(scroll);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(scroll);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredRow, hoveredCard]);

  return (
    <div className="bg-black py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-1 text-white">
        See How AgentPartner.ai Empowers Your Business
      </h2>
      <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
        Explore the sample prompts below to discover actionable questions and
        tasks you can assign to your new Al Partner. Imagine effortlessly
        generating a complete series of drip emails for new clients in mere
        seconds. With your creativity as the only limit, empower your real
        estate business like never before.{" "}
      </p>
      <div className="flex w-full flex-col gap-4">
        {scrollRefs.map((ref, i) => (
          <div
            key={i}
            className="w-full overflow-hidden"
            ref={ref}
            onMouseEnter={() => setHoveredRow(i)}
            onMouseLeave={() => {
              setHoveredRow(null);
              setHoveredCard(null);
            }}
          >
            <div className="flex space-x-4" style={{ width: "max-content" }}>
              {[...prompts, ...prompts].map((prompt, index) => (
                <PromptCard
                  key={index}
                  prompt={prompt}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PromptCardProps {
  prompt: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function PromptCard({ prompt, onMouseEnter, onMouseLeave }: PromptCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => {
        setIsHovered(true);
        onMouseEnter();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseLeave();
      }}
      className="w-[300px] flex-shrink-0 bg-[#202123] text-white p-4 flex items-center justify-between rounded-lg transition-all duration-300 ease-in-out m-2 bg-gradient-to-r from-blue-900 to-blue-800"
    >
      <p
        className={`text-sm flex-grow text-left pr-2 transition-all duration-300 ease-in-out ${
          isHovered ? "underline" : ""
        }`}
      >
        {prompt}
      </p>
      <div className="flex items-center justify-center w-6 h-6 overflow-hidden">
        <ArrowRight
          className={`transition-all duration-300 ease-in-out transform ${
            isHovered ? "translate-x-1" : ""
          }`}
          size={20}
        />
      </div>
    </button>
  );
}

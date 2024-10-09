'use client'

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const prompts: string[] = [
    "How can AI real estate coaching benefit me?",
    "What legal documents are required for selling a property?",
    "What are the best practices for cold calling in real estate?",
    "How can I improve my property listings?",
    "What are effective negotiation techniques for real estate?",
    "How do I create a compelling marketing strategy?",
    "What are the key factors in pricing a property?",
    "How can I build a strong real estate network?",
    "What are the latest trends in real estate technology?",
    "How do I handle difficult clients in real estate?",
    "What are the best ways to generate leads in real estate?",
    "How can I improve my time management as a real estate agent?",
];

export default function PromptCards() {
    const scrollRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
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
                if (ref.current.scrollLeft <= 0 || ref.current.scrollLeft >= (ref.current.scrollWidth / 2)) {
                    ref.current.scrollLeft = index === 1 ? ref.current.scrollWidth / 2 : 0;
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
                Explore AgentCoach.ai's Expertise
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
                Scroll through example prompts to see how our AI delivers expert advice on real estate topics.
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
                        <div className="flex space-x-4" style={{ width: 'max-content' }}>
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
            <p className={`text-sm flex-grow text-left pr-2 transition-all duration-300 ease-in-out ${isHovered ? 'underline' : ''}`}>
                {prompt}
            </p>
            <div className="flex items-center justify-center w-6 h-6 overflow-hidden">
                <ArrowRight
                    className={`transition-all duration-300 ease-in-out transform ${isHovered ? 'translate-x-1' : ''}`}
                    size={20}
                />
            </div>
        </button>
    );
}
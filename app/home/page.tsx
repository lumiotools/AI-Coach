"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import TestimonialSlider from "@/components/LandingPage/TestimonialSlider";
import Link from "next/link";

import DemoVideo from "@/components/Assets/video/demo.mp4";

interface DemoVideoComponentProps {
  className: string;
}

export const DemoVideoComponent: React.FC<DemoVideoComponentProps> = ({
  className,
}) => {
  return (
    <video className={className} preload="auto" autoPlay loop muted>
      <source src={DemoVideo} type="video/mp4" />
    </video>
  );
};

const TEXTS: string[] = [
  "General Advisor",
  "Negotiation Expert",
  "Sales Advisor",
  "Marketing Guru",
  "Motivation Guide",
];

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

export default function Home() {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const scrollRef3 = useRef<HTMLDivElement>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const scrollAmounts = useRef<number[]>([0, 0, 0]);
  const speeds = [0.5, 0.7, 0.5]; // Speeds for each row

  const handleScroll = useCallback(() => {
    const scrollContainers = [scrollRef1.current, scrollRef2.current, scrollRef3.current];

    scrollContainers.forEach((container, index) => {
      if (container && hoveredRow !== index) {
        scrollAmounts.current[index] += speeds[index];
        if (scrollAmounts.current[index] >= container.scrollWidth / 2) {
          scrollAmounts.current[index] = 0;
        }
        container.scrollLeft = index % 2 === 0
          ? container.scrollWidth / 2 - scrollAmounts.current[index]
          : scrollAmounts.current[index];
      }
    });

    requestAnimationFrame(handleScroll);
  }, []);

  useEffect(() => {
    const animationId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(animationId);
  }, [handleScroll]);

  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => (index + 1) % TEXTS.length),
      3000
    );
    return () => clearInterval(intervalId);
  }, []);

  const testimonials = [
    {
      name: "Lisa Kim",
      role: "Broker Associate",
      quote:
        "I love how convenient it is to access coaching resources at any time!",
      avatarUrl: "https://picsum.photos/seed/lisa/200/200",
    },
    {
      name: "Mike Rodriguez",
      role: "Realtor",
      quote:
        "The real-time feedback is invaluable. It's like having a mentor in my pocket.",
      avatarUrl: "https://picsum.photos/seed/mike/200/200",
    },
    {
      name: "Jan Stiedemann",
      role: "Global Applications Representative",
      quote:
        "AgentCoach.ai has revolutionized my approach to negotiations. I feel more confident than ever!",
      avatarUrl: "https://picsum.photos/seed/jan/200/200",
    },
    {
      name: "Alice Johnson",
      role: "Real Estate Agent",
      quote: "This platform has changed the way I approach my clients!",
      avatarUrl: "https://picsum.photos/seed/alice/200/200",
    },
    {
      name: "Bob Smith",
      role: "Property Manager",
      quote: "The insights I gain are invaluable for my business.",
      avatarUrl: "https://picsum.photos/seed/bob/200/200",
    },
    {
      name: "Charlie Brown",
      role: "Real Estate Investor",
      quote: "I can't imagine my career without this AI coaching.",
      avatarUrl: "https://picsum.photos/seed/charlie/200/200",
    },
    {
      name: "Diana Prince",
      role: "Realtor",
      quote: "The coaching has helped me close more deals than ever!",
      avatarUrl: "https://picsum.photos/seed/diana/200/200",
    },
    {
      name: "Ethan Hunt",
      role: "Real Estate Consultant",
      quote: "A must-have tool for any serious real estate professional.",
      avatarUrl: "https://picsum.photos/seed/ethan/200/200",
    },
    {
      name: "Fiona Green",
      role: "Real Estate Broker",
      quote: "I love the personalized advice I receive!",
      avatarUrl: "https://picsum.photos/seed/fiona/200/200",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log(currentIndex);
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const [title1, setTitle1] = useState<string>("");
  const [title2, setTitle2] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [rotatingTexts, setRotatingTexts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://admindashbord-lumio.onrender.com/get-landing-page"
        );
        const { title, subtitle, rotatingTexts } = response.data;

        const title1 = title.split("With")[0];
        const title2 = title.split("Career")[1];
        setTitle1(title1);
        setTitle2(title2);

        setSubtitle(subtitle);
        setRotatingTexts(rotatingTexts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const rotateText = setInterval(() => {
      const filteredTexts = rotatingTexts.filter((text) =>
        console.log("Line 180", text)
      );
      if (filteredTexts.length > 0) {
        setIndex((prevIndex) => (prevIndex + 1) % filteredTexts.length);
      }
    }, 3000);

    return () => clearInterval(rotateText);
  }, [rotatingTexts]);

  return (
    <div className="bg-black text-white">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <p className="text-base md:text-lg mb-6 text-gray-400">
            Introducing AI-Powered Coaching for Real Estate Agents
          </p>
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold mb-8 text-white text-clip">
            {title1}
            <br className="hidden md:block" />
            {title2}
            <br className="hidden md:block" />
            <span className="text-blue-400 ml-1">
              {rotatingTexts.filter((text) => text).length > 0
                ? rotatingTexts.filter((text) => text)[index]
                : "..."}{" "}
              <span className="text-white">{subtitle}</span>
            </span>
          </h1>

          {/* <Link
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-base py-2 px-3 rounded-md mt-8 transition duration-300 ease-in-out transform hover:scale-105"
            href="/signup"
          >
            SIGN UP FOR FREE
          </Link> */}
          <Link
            className="mt-10 text-center w-[180px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            href="/signup"
          >
            SIGN UP FOR FREE
          </Link>
          <div className="flex flex-col mt-12">
            <div className="flex flex-col md:flex-row md:gap-10">
              <div className="flex flex-row gap-4 items-center">
                <div className="p-[6px] rounded-full bg-blue-600">
                  <Check className="text-black h-3 w-3 md:h-5 md:w-5"></Check>
                </div>
                <p className="text-sm md:text-base">No credit card required</p>
              </div>
              <div className="flex flex-row gap-4 mt-5 md:mt-0 items-center">
                <div className="p-[6px] rounded-full bg-blue-600">
                  <Check className="text-black h-3 w-3 md:h-5 md:w-5"></Check>
                </div>
                <p className="text-sm md:text-base">Free general coach included</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-16 px-4 bg-white text-black">
        <h2 className="text-3xl font-bold text-center mb-1">
          Explore AI Chatbots
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
          Engage with our AI chatbots to receive expert guidance tailored to
          your needs in Sales, Negotiation, Marketing, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <ChatbotCard
            title="Sales Advisor"
            description="Boost your property sales with expert tips and proven strategies tailored for real estate professionals."
            icon="💬"
          />

          <ChatbotCard
            title="Negotiation Expert"
            description="Master the art of negotiation with advice on closing deals, overcoming objections, and maximizing value."
            icon="🤝"
          />

          <ChatbotCard
            title="Marketing Guru"
            description="Elevate your marketing game with creative campaigns, branding insights, and social media strategies that attract clients."
            icon="📢"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
          <ChatbotCard
            title="Motivation Guide"
            description="Stay inspired and focused with personalized tips, affirmations, and goal-setting strategies from the Motivation Mentor bot."
            icon="🎯"
          />

          <ChatbotCard
            title="General Advisor"
            description="Get comprehensive advice on various aspects of real estate, from legalities to client management, tailored to your needs."
            icon="📊"
          />
        </div>
        <div className="text-center mt-12">
          <Link
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-3 px-5 rounded-md mt-8"
            href="/signup"
          >
            TRY IT NOW
          </Link>
        </div>
      </div>

      <div className="bg-black py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-1 text-white">
          Explore AgentCoach.ai&apos;s Expertise
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
          Scroll through example prompts to see how our AI delivers expert advice on real estate topics.
        </p>
        <div className="flex w-full flex-col gap-4">
          {[scrollRef1, scrollRef2, scrollRef3].map((ref, i) => (
            <div
              key={i}
              className="w-full overflow-hidden"
              ref={ref}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div
                className="flex space-x-4"
                style={{
                  width: 'max-content',
                }}
              >
                {[...prompts, ...prompts].map((prompt, index) => (
                  <PromptCard
                    key={index}
                    prompt={prompt}
                    isRowHovered={hoveredRow === i}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white py-16 px-4">
        <div className="flex justify-center items-center overflow-hidden">
          <TestimonialSlider></TestimonialSlider>
        </div>
      </div>

      <div className="py-16 px-4" id="home-page-bottom-section">
        <h2 className="text-3xl font-bold text-center mb-1">
          Start Transforming Your Real Estate Career Today - For Free!
        </h2>
        <p className="text-center mb-10 max-w-4xl mx-auto text-gray-400">
          Unlock expert AI-driven advice for real estate, sales, negotiation.
          Get started for free and elevate your career today!
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
          <div className="md:w-1/2 border-gray-100 rounded-lg">
            <DemoVideoComponent className="w-full object-cover h-auto" />
          </div>
          <div className="md:w-1/2 flex flex-col justify-center">
            <p className="mb-4 text-justify text-lg text-gray-400">
              Get instant access to <span className="text-white text-lg">AgentCoach.ai</span> and start experiencing expert
              advice tailored just for you in <span className="text-white text-lg"> Real Estate, Sales, Negotiation,
                Marketing, and Motivation.</span>
            </p>
            <p className="mb-4 text-justify text-gray-500">
              Best of all, you can get started right now, completely free! Take
              advantage of this opportunity to boost your career and see the
              difference AI-powered coaching can make.
            </p>
            <Link
              className="text-center w-[180px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm py-2 px-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
              href="/signup"
            >
              SIGN UP FOR FREE
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

type ChatbotCardProps = {
  readonly title: string;
  readonly description: string;
  readonly icon: React.ReactNode;
};

function ChatbotCard({ title, description, icon }: ChatbotCardProps) {
  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer">
      <div className="text-4xl mb-4 bg-blue-600 w-16 h-16 flex items-center justify-center rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-center text-gray-300">{description}</p>
    </div>
  );
}

interface PromptCardProps {
  prompt: string;
  isRowHovered: boolean;
}

function PromptCard({ prompt, isRowHovered }: PromptCardProps) {
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      className="w-[300px] flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 flex items-center justify-between rounded-lg transition-all duration-300 ease-in-out"
    >
      <p className={`text-sm flex-grow text-left pr-2 transition-all duration-300 ease-in-out ${isCardHovered ? 'underline' : ''}`}>
        {prompt}
      </p>
      <div className="flex items-center justify-center w-6 h-6 overflow-hidden">
        <ArrowRight
          className={`transition-all duration-300 ease-in-out transform ${isCardHovered ? 'translate-x-1' : ''}`}
          size={20}
        />
      </div>
    </button>
  );
}
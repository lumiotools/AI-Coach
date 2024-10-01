"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
// import TestimonialSlider from "@/components/TestimonialSlider"; // Updated import path
import axios from "axios";
import { Check, Loader2 } from "lucide-react";
import TestimonialSlider from "@/components/LandingPage/TestimonialSlider";
import Link from "next/link";

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
  const scrollRef1 = useRef<HTMLDivElement | null>(null);
  const scrollRef2 = useRef<HTMLDivElement | null>(null);
  const scrollRef3 = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  console.log(hoveredIndex);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => (index + 1) % TEXTS.length),
      3000
    );
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const scrollContainers = [
      scrollRef1.current,
      scrollRef2.current,
      scrollRef3.current,
    ];
    scrollContainers.forEach((scrollContainer, index) => {
      if (scrollContainer) {
        let scrollAmount = 0;
        const step = 0.4; // Increased speed for all containers

        const scroll = () => {
          scrollAmount += step;
          if (index === 1) {
            // Move second container to the right
            if (scrollAmount >= scrollContainer.scrollWidth / 2) {
              scrollAmount = 0;
            }
            scrollContainer.scrollLeft = scrollAmount;
          } else {
            // Move first and third containers to the left
            if (scrollAmount >= scrollContainer.scrollWidth / 2) {
              scrollAmount = 0;
            }
            scrollContainer.scrollLeft =
              scrollContainer.scrollWidth / 2 - scrollAmount; // Reverse direction
          }
          requestAnimationFrame(scroll);
        };

        requestAnimationFrame(scroll);
      }
    });
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
        "Agent Coach.ai has revolutionized my approach to negotiations. I feel more confident than ever!",
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
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
    
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get(
          "https://admindashbord-lumio.onrender.com/get-landing-page"
        );
        const { title, subtitle, rotatingTexts } = response.data;

        const title1=title.split("With")[0]
        const title2=title.split("Career")[1]
        // const titleWords = title.split(" ");
        console.log("Line 163", rotatingTexts);
        // const midpoint = Math.ceil(titleWords.length / 2.7);
        setTitle1(title1);
        setTitle2(title2);

        setSubtitle(subtitle);
        setRotatingTexts(rotatingTexts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
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
      {loading ? ( // Conditional rendering for loader
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <p className="text-base md:text-xl mb-6 text-gray-400">
            Introducing AI-Powered Coaching for Real Estate Agents
          </p>
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold mb-8 text-white text-clip">
            {title1}
            <br className="hidden md:block"/>
            {title2} 
            <br className="hidden md:block"/>
            {/* <span className="text-clip">{title}</span> */}
            <span className="text-blue-400 ml-1">
              {rotatingTexts.filter((text) => text).length > 0
                ? rotatingTexts.filter((text) => text)[index]
                : "..."}{" "}
              <span className="text-white">{subtitle}</span>
            </span>
          </h1>
                    
          <Link
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-base py-4 px-10 rounded-xl mt-8 transition duration-300 ease-in-out transform hover:scale-105"
            href="https://proud-pup-68.accounts.dev/sign-up"
          >
            SIGN UP FOR FREE
          </Link>
          <div className="flex flex-col">
            <div className="flex flex-row gap-10 mt-5">
              <div className="flex flex-row gap-4 mt-5 items-center">
                <div className="p-[6px] rounded-full bg-blue-600">
                  <Check className="text-black"></Check>
                </div>
                <p className="">No credit card required</p>
              </div>
              <div className="flex flex-row gap-4 mt-5 items-center">
                <div className="p-[6px] rounded-full bg-blue-600">
                  <Check className="text-black"></Check>
                </div>
                <p className="">Free general coach included</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-16 px-4 bg-white text-black">
        <h2 className="text-3xl font-bold text-center mb-8">
          Explore AI Chatbots
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
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
          {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            TRY IT NOW
          </Button> */}
          <Link
            className="bg-blue-600 hover:bg-blue-700 text-white text-base py-3 px-8 rounded-xl mt-8"
            href="https://proud-pup-68.accounts.dev/sign-up"
          >
            TRY IT NOW
          </Link>
        </div>
      </div>

      <div className="bg-black py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Explore AgentCoach.ai&apos;s Expertise
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
          Scroll through example prompts to see how our AI delivers expert
          advice on real estate topics.
        </p>
        <div className="flex w-full flex-col gap-6">
          <div className="max-w-full mx-auto overflow-hidden" ref={scrollRef1}>
            <div
              className="flex gap-4"
              style={{
                display: "flex",
                gap: "3rem",
                width: "max-content",
              }}
            >
              {[...prompts, ...prompts].map((prompt, index) => (
                <PromptCard
                  key={index}
                  prompt={prompt}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </div>
          </div>
          <div className="max-w-full mx-auto overflow-hidden" ref={scrollRef2}>
            <div
              className="flex gap-4 ml-20"
              style={{
                display: "flex",
                gap: "3rem",
                width: "max-content",
              }}
            >
              {[...prompts, ...prompts].map((prompt, index) => (
                <PromptCard
                  key={index}
                  prompt={prompt}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </div>
          </div>
          <div className="max-w-full mx-auto overflow-hidden" ref={scrollRef3}>
            <div
              className="flex gap-4"
              style={{
                display: "flex",
                gap: "3rem",
                width: "max-content",
              }}
            >
              {[...prompts, ...prompts].map((prompt, index) => (
                <PromptCard
                  key={index}
                  prompt={prompt}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16 px-4">
        {/* <h2 className="text-3xl font-bold text-center mb-8 text-black">
            What Users Say About Agent Coach.ai
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Hear from real estate professionals who have transformed their careers with our AI Coach.
          </p> */}
        <div className="flex justify-center items-center overflow-hidden">
          {/* <div className="flex transition-transform duration-500">
              <Carousel
                opts={{
                  align: "start",
                  loop: true, // Enable looping
                }}
                className="relative w-full" // Ensure the carousel is positioned correctly
              >
                <CarouselContent>
                  {testimonials.slice(0, 3).map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <TestimonialCard {...testimonial} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                  <CarouselPrevious onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)} />
                </div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <CarouselNext onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)} />
                </div>
              </Carousel>
            </div> */}

          <TestimonialSlider></TestimonialSlider>
        </div>
      </div>

      <div className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Start Transforming Your Real Estate Career Today - For Free!
        </h2>
        <p className="text-center mb-10 max-w-4xl mx-auto">
          Unlock expert AI-driven advice for real estate, sales, negotiation.
          Get started for free and elevate your career today!
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
          <div className="md:w-1/2 flex flex-col justify-center">
            <p className="mb-4 text-justify">
              Get instant access to AgentCoach.ai and start experiencing expert
              advice tailored just for you in Real Estate, Sales, Negotiation,
              Marketing, and Motivation.
            </p>
            <p className="mb-4 text-justify">
              Best of all, you can get started right now, completely free! Take
              advantage of this opportunity to boost your career and see the
              difference AI-powered coaching can make.
            </p>
            {/* <p
              className="text-base text-white p-2 rounded-lg border text-center"
            >
              SIGN UP FOR FREE &amp; UNLOCK YOUR POTENTIAL TODAY!
            </p> */}
            {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xl py-6 px-8 w-1/2 mt-5">
              SIGN UP FOR FREE
            </Button> */}
            <Link
              className="text-center md:w-1/2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-base py-4 px-10 rounded-xl mt-8 transition duration-300 ease-in-out transform hover:scale-105"
              href="https://proud-pup-68.accounts.dev/sign-up"
            >
              SIGN UP FOR FREE
            </Link>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://picsum.photos/seed/agentcoach/600/400"
              alt="AgentCoach.ai Dashboard"
              className="rounded-lg shadow-lg border"
            />

            {/* <video
              src={Video}
              controls={false}
              autoPlay
              loop
              muted
              className="w-full object-cover h-auto"
            /> */}
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
    <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 rounded-lg">
      <div className="text-4xl mb-4 bg-blue-600 w-16 h-16 flex items-center justify-center rounded-full mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}

type PromptCardProps = {
  readonly prompt: string;
  readonly onMouseEnter: () => void;
  readonly onMouseLeave: () => void;
};

function PromptCard({ prompt, onMouseEnter, onMouseLeave }: PromptCardProps) {
  return (
    <button
      tabIndex={0} // Added tabIndex for keyboard navigation
      style={{ width: "300px", flexShrink: 0 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 rounded-lg flex items-center justify-between transition-all duration-300"
    >
      <p className="text-sm">{prompt}</p>
      <span className="ml-2">→</span>
    </button>
  );
}

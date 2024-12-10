export const dynamic = "force-dynamic";

import { Check } from "lucide-react";
import TestimonialSlider from "@/components/LandingPage/TestimonialSlider";
import Link from "next/link";
import RotatingText from "./RotatingText";
import PromptCards from "@/components/PromptCards";

async function getLandingPageData() {
  const defaultData = {
    title: "Accelerate Your Real Estate Career With Cutting-Edge AI Driven ",
    subtitle: "Coaching Tools",
    rotatingTexts: [
      "Real Estate",
      "Marketing",
      "Negotiation",
      "Motivation",
      "Sale",
    ],
    preTitle: "Introducing AI-Powered Coaching for Real Estate Agents",
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_API}/get-landing-page`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Home data ok");
    return { ...defaultData, ...data };
  } catch (error) {
    console.error("Error fetching landing page data:", error);
    return defaultData;
  }
}

export default async function Home() {
  const { title, subtitle, rotatingTexts, preTitle } =
    await getLandingPageData();

  const title1 =
    title.split("With")[0] || "Accelerate Your Real Estate Career ";
  const title2 = title.split("Career")[1] || "With Cutting-Edge AI Driven";

  return (
    <div className="bg-black text-white">
      <div className="flex flex-col items-center justify-center min-h-[700px] text-center px-4">
        <p className="text-base md:text-lg mb-6 text-gray-400">{preTitle}</p>
        <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold mb-8 text-white">
          {title1}
          <br className="hidden md:block" />
          {title2}
          <br className="hidden md:block" />
          <RotatingText
            texts={rotatingTexts.filter((text: string) => text) || ["Coaching"]}
            subtitle={subtitle || "Tools"}
          />
        </h1>

        <Link
          className="mt-10 text-center w-[200px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          href="/signup"
        >
          Start 7 Day Free Trial
        </Link>
        <div className="flex flex-col mt-12">
          <div className="flex flex-col md:flex-row md:gap-10">
            <div className="flex flex-row gap-4 items-center">
              <div className="p-[6px] rounded-full bg-blue-600">
                <Check className="text-black h-3 w-3 md:h-5 md:w-5" />
              </div>
              <p className="text-sm md:text-base">No Credit Card Required!</p>
            </div>
            <div className="flex flex-row gap-4 mt-5 md:mt-0 items-center">
              <div className="p-[6px] rounded-full bg-blue-600">
                <Check className="text-black h-3 w-3 md:h-5 md:w-5" />
              </div>
              <p className="text-sm md:text-base">
                Explore All Features and Tools
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 bg-white text-black">
        <h2 className="text-3xl font-bold text-center mb-1">
          Discover Our Al Chatbots - Your Real Estate Success Partner
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
          Instantly generate everything you need - from Facebook ads and home
          buyer or relocation guides, to scripts for calling expired listings
          and property brochures that impress at every listing appointment. Our
          Al-powered chatbot "partners" make content creation effortless,
          delivering top-notch results in seconds.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <ChatbotCard
            title="Sales Advisor"
            description="Boost your property sales with expert tips and proven strategies tailored for real estate professionals."
            icon="💬"
          />
          <ChatbotCard
            title="Negotiation Expert"
            description="Paste in the text of your negotiation and receive the perfect crafted response - in script or
document form."
            icon="🤝"
          />
          <ChatbotCard
            title="Marketing Partner"
            description="Elevate your marketing game with consistent, creative content for social media, blogs, articles, guides and more."
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
            title="Real Estate"
            description="Get comprehensive advice on various aspects of real estate, from legalities to client management, tailored to your needs."
            icon="🏢"
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

      <PromptCards />

      <div className="bg-white py-16 px-4">
        <div className="flex justify-center items-center overflow-hidden">
          <TestimonialSlider />
        </div>
      </div>

      <div className="py-16 px-4" id="home-page-bottom-section">
        <h2 className="text-3xl font-bold text-center mb-1">
          Revolutionize Your Real Estate Operations Today - Free Access!
        </h2>
        <p className="text-center mb-10 max-w-4xl mx-auto text-gray-400">
          Introducing Your Perfect Business Partner - Unlock Al-Powered Tools and Intelligence to Elevate Your Real Estate Business, Achieve Balance, and Grow Your Wealth.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
          <div className="md:w-1/2 border-gray-100 rounded-lg">
            <video
              className="w-full object-cover h-auto"
              preload="auto"
              autoPlay
              loop
              muted
              controls
            >
              <source src="/video/demo.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center">
            <p className="mb-4 text-justify text-lg text-gray-400">
              Take the Next Step Towards Success - Start Your Free Trial Today
            </p>
            <p className="mb-4 text-justify text-gray-500">
              Experience firsthand how AgentPartner.ai can transform your real estate business. Imagine reducing your marketing expenses while increasing your efficiency, allowing you to focus on what you do best - closing deals and building relationships. Don't wait to elevate your business, achieve greater balance, and grow your wealth. Join countless other real estate professionals who have already unlocked their potential with AgentPartner.ai. Start your free trial now and see the difference intelligent technology can make in your career.
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

import React from "react";
import Image from "next/image";
import jeff from "@/public/images/agent.png";

export default function AboutUs() {
  return (
    <div className="bg-white text-[#001D5B] py-16 px-4">
      <div className="max-w-6xl mx-auto py-20">
        <h1 className="text-4xl font-bold text-center mb-12">
          About AI Coach
        </h1>
        <p className="text-lg mb-12 text-justify">
          Welcome to AI Coach, where cutting-edge AI technology meets
          decades of real estate expertise to deliver powerful, AI-driven
          solutions tailored for today's real estate professionals. Our platform
          is the result of extensive industry knowledge and a passion for
          innovation, spearheaded by our founder Jeff Hammer, who has dedicated
          over 35 years to transforming the residential real estate landscape.
        </p>
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-[400px] flex-shrink-0">
            <Image
              src={jeff}
              alt="AI Coach Team"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
          <div className="md:flex-grow">
            <p className="text-lg h-full overflow-y-auto text-justify">
              Jeff's remarkable career highlights his deep expertise in the real
              estate industry. Beginning as a Top 1% agent with ReMax, he
              successfully built a thriving residential real estate firm with
              over 70 agents in Denver, CO's prestigious Cherry Creek area.
              <br />
              <br />
              As a mentor, coach, and accomplished business owner, Jeff knows
              what it takes to excel in this competitive field. He also
              developed a nationwide residential realtor database that connected
              thousands of agents with home buyers and sellers, a venture he
              successfully sold for several million dollars in 2024. His legacy
              of excellence and innovative spirit continues through
              AI Coach.
            </p>
          </div>
        </div>
        <p className="text-lg mb-6 text-justify">
          Our mission at AI Coach is to empower agents at every level
          with AI-powered tools that streamline real estate sales, enhance and
          automate marketing efforts, improve client communication, and support
          business and personal growth. By integrating artificial intelligence
          into the real estate process, agents can save valuable time, reduce
          business building expenses, make data-driven decisions, and focus on
          building meaningful client relationships and closing more deals.
        </p>
        <h2 className="text-2xl font-bold mb-4">Why Choose AI Coach?</h2>
        <ul className="list-disc list-inside mb-6 text-lg">
          <li>
            <span className="font-bold">Cost Efficiency:</span> Dramatically
            reduce your marketing expenses with intelligent automation and
            targeted strategies.
          </li>
          <li>
            <span className="font-bold">Time Savings:</span> Eliminate
            time-consuming tasks, allowing you to concentrate on
            revenue-generating activities.
          </li>
          <li>
            <span className="font-bold">Enhanced Productivity:</span> Leverage
            AI-driven insights to optimize your workflows and boost overall
            productivity.
          </li>
          <li>
            <span className="font-bold">Data-Driven Decisions:</span> Utilize
            comprehensive analytics to make informed decisions that drive
            business growth.
          </li>
          <li>
            <span className="font-bold">Scalable Solutions:</span> Whether
            you're a new agent or an industry veteran, our tools adapt to your
            unique needs and scale with your business.
          </li>
          <li>
            <span className="font-bold">Improved Client Relationships:</span>{" "}
            Enhance your communication and engagement with clients through
            personalized, AI-powered interactions.
          </li>
        </ul>
        <h2 className="text-2xl font-bold mb-4">Built by Agents, for Agents</h2>
        <p className="text-lg mb-6 text-justify">
          We take pride in offering AI Coach as a comprehensive resource,
          designed by agents for agents. Our platform adapts to the unique needs
          of real estate professionals, providing the flexibility and
          functionality required to navigate the ever-evolving market with
          confidence and ease. Whether you're just starting out or looking to
          elevate your established business, AI Coach is here to support
          your journey.
        </p>
        <h2 className="text-2xl font-bold mb-4">
          Join Us in Redefining Success in Real Estate
        </h2>
        <p className="text-lg text-justify">
          Embrace the future of real estate with AI Coach by your side.
          Our AI-powered tools and intelligent solutions are here to help you
          streamline operations, reduce costs, grow your wealth and expand your
          freedom. Experience the transformative impact of having a dedicated AI
          partner and take your real estate career to new heights.
        </p>
      </div>
    </div>
  );
}
import React from "react";

import jeff from "@/public/images/agent.png";

export default function AboutUs() {
    return (
        <div
            className="bg-white text-[#001D5B] py-16 px-4"
        >
            <div className="max-w-6xl mx-auto py-20">
                <h1
                    className="text-4xl font-bold text-center mb-12"
                >
                    About AgentCoach.ai
                </h1>
                <p className="text-lg mb-12 text-justify">
                    Welcome to AgentCoach.ai, where we blend the latest in AI technology
                    with decades of real estate expertise to provide powerful, AI-driven
                    solutions tailored for today's real estate professionals. Our platform
                    is the culmination of extensive industry knowledge and a passion for
                    innovation, led by our founder Jeff Hammerberg, who has dedicated over
                    35 years to redefining the residential real estate landscape.
                </p>
                <div
                    className="flex flex-col md:flex-row gap-8 mb-12"
                >
                    <div
                        className="md:w-[400px] flex-shrink-0"
                    >
                        <img
                            // src="https://picsum.photos/seed/agentcoach/600/400"
                            src={jeff.src}
                            alt="AgentCoach.ai Team"
                            className="rounded-lg shadow-lg w-full h-full object-cover"
                        />
                    </div>
                    <div className="md:flex-grow">
                        <p
                            className="text-lg h-full overflow-y-auto text-justify"
                        >
                            Jeff's career accomplishments showcase his profound expertise in
                            the real estate industry. Starting as a Top 1% agent with ReMax,
                            he went on to establish a thriving residential real estate firm
                            with over 70 agents in the prestigious Cherry Creek area of
                            Denver, CO.
                            <br />
                            <br />
                            As a mentor, coach, and accomplished business owner, Jeff
                            understands what it takes to succeed in this competitive field. He
                            also created a nationwide residential realtor database that
                            connected thousands of agents with home buyers and sellers, a
                            venture he successfully sold for several million dollars in 2024.
                            His legacy of commitment to excellence and drive for innovation
                            now lives on through AgentCoach.ai.
                        </p>
                    </div>
                </div>
                <p className="text-lg mb-6 text-justify">
                    At AgentCoach.ai, we are proud to have a dedicated team of seasoned
                    professionals and forward-thinking tech experts who share Jeff's
                    vision. Our team comprises industry veterans, AI specialists, and
                    marketing strategists who collectively bring a wealth of knowledge and
                    insight to the table. With a blend of real estate experience and
                    technological expertise, our team is uniquely positioned to understand
                    the challenges real estate agents face and provide solutions that
                    truly make a difference.
                </p>
                <p className="text-lg mb-6 text-justify">
                    Our goal at AgentCoach.ai is to empower agents at every level with
                    tools that streamline real estate sales, marketing, enhance client
                    communication, and support business growth. We believe that by
                    integrating artificial intelligence into the real estate process,
                    agents can save valuable time, make data-driven decisions, and
                    ultimately focus on building meaningful client relationships and
                    closing more deals.
                </p>
                <p className="text-lg mb-6 text-justify">
                    We're proud to offer AgentCoach.ai as a comprehensive resource, built
                    by agents for agents, that adapts to the unique needs of real estate
                    professionals. Whether you're new to the field or an industry veteran,
                    our platform is here to help you navigate the ever-evolving market
                    with confidence and ease.
                </p>
                <p className="text-lg text-justify">
                    Join us as we redefine what it means to succeed in real estate. With
                    AgentCoach.ai by your side, the future is yours to shape.
                </p>
            </div>
        </div>
    );
}
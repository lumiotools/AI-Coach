"use client";

import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import icon12 from "@/components/Assets/icon12.svg";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper as SwiperType } from "swiper/types";

export const testimonials = [
  {
    id: 1,
    image: "/images/kathy.png",
    icon: icon12,
    text: '"My marketing costs have dropped by 40%, reducing stress and allowing me to invest more in quality client relationships."',
    name: "Kathy Welsh",
    position: "Real Estate Agent",
  },
  {
    id: 2,
    image: "/images/jeff.png",
    icon: icon12,
    text: '"AI Coach has streamlined my daily tasks, giving me more time to focus on closing deals and growing my business."',
    name: "Jeff Hammerberg",
    position: "Real Estate Agent",
  },
  {
    id: 3,
    image: "/images/merlin.png",
    icon: icon12,
    text: '"By scheduling the use of AgentPartner daily, I\'ve minimized my marketing budget and maximized my outreach, bringing consistency into my marketing efforts."',
    name: "Merlin Parker",
    position: "Broker/Owner",
  },
  {
    id: 4,
    image: "/images/james.png",
    icon: icon12,
    text: '"I love the competitive edge it\'s given me in negotiations, ensuring my clients get top value and I\'m earning top commissions."',
    name: "James Alonso",
    position: "Realtor",
  },
];

type Testimonial = {
  id: number;
  image: string;
  icon: string;
  text: string;
  name: string;
  position: string;
};

const TestimonialCard: React.FC<Testimonial> = ({
  name,
  position,
  text,
  image,
}) => (
  <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 rounded-lg flex flex-col items-center w-full h-full min-h-[350px]">
    <div className="relative mb-4">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 rounded-full border-4 border-white"
      />
    </div>
    <div className="flex-grow flex flex-col justify-between items-center">
      <p className="text-base italic mb-4 text-center leading-tight max-w-80 md:max-w-96">
        {text}
      </p>
      <div>
        <h3 className="font-bold text-lg mb-1 text-center">{name}</h3>
        <p className="text-base text-blue-200 text-center">{position}</p>
      </div>
    </div>
  </div>
);

const TestimonialSlider: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
            What Agents Say <br className="block md:hidden" /> About
            AI Coach
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Hear How Real Estate Professionals Are
            <br className="block md:hidden" /> Dramatically Reducing Marketing
            Expenses and
            <br className="block md:hidden" /> Streamlining Their Workflows with
            an Al Partner.
          </p>
        </div>
        <div className="relative">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={1}
            spaceBetween={24}
            loop={true}
            centeredSlides={true}
            autoplay={{
              delay: isMobile ? 6000 : 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            modules={[Pagination, Autoplay, Navigation]}
            className="mySwiper rounded-lg overflow-visible"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="p-2 rounded-md">
                <TestimonialCard {...testimonial} image={testimonial.image} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex justify-center mt-8 space-x-4">
            <Button
              onClick={handlePrev}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 py-2 sm:px-4 sm:py-2"
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 py-2 sm:px-4 sm:py-2"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="h-4 w-4 sm:ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;

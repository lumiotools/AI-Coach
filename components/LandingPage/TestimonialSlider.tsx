import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import icon12 from "@/components/Assets/icon12.svg";
import pp1 from "@/components/Assets/images/kathy.png";
import pp2 from "@/components/Assets/images/jeff.png";
import pp3 from "@/components/Assets/images/merlin.png";
import pp4 from "@/components/Assets/images/james.png";

export const testimonials = [
  {
    id: 1,
    image: pp1,
    icon: icon12,
    text: '"The real-time feedback is invaluable. It\'s like having a mentor in my pocket."',
    name: "Kathy Welsh",
    position: "Real Estate Agent",
  },
  {
    id: 2,
    image: pp2,
    icon: icon12,
    text: '"AgentCoach.ai has revolutionized my approach to negotiations. I feel more confident than ever!"',
    name: "Jeff Hammerberg",
    position: "Real Estate Agent",
  },
  {
    id: 3,
    image: pp3,
    icon: icon12,
    text: '"The interactive scenarios have empowered me to negotiate confidently and overcome objections with ease."',
    name: "Merlin Parker",
    position: "Broker/Owner",
  },
  {
    id: 4,
    image: pp4,
    icon: icon12,
    text: '"I love how convenient it is to access my AI coach 24/7!"',
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
  <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 md:p-8 rounded-lg flex flex-col items-center w-full h-full">
    <div className="relative mb-2">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white"
      />
    </div>
    <p className="text-sm md:text-base italic mb-2 text-center h-20 leading-tight max-w-xs">
      {text}
    </p>
    <h3 className="font-bold text-lg mb-1">{name}</h3>
    <p className="text-xs md:text-sm text-blue-200">{position}</p>
  </div>
);

const TestimonialSlider: React.FC = () => {
  return (
    <section className="py-5 cursor-pointer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-black">
            What Users Say <br className="block md:hidden" /> About
            AgentCoach.ai
          </h2>
          <p className="text-sm sm:text-base text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Hear from real estate professionals who{" "}
            <br className="block md:hidden" /> have transformed their careers
            with our AI Coach.
          </p>
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={32}
          loop={true}
          centeredSlides={true}
          pagination={false}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 2,
            },
            1280: {
              slidesPerView: 3,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="p-2">
              <TestimonialCard
                {...testimonial}
                position={testimonial.position}
                text={testimonial.text}
                image={testimonial.image.src}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSlider;

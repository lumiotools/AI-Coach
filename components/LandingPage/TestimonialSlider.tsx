import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import pp1 from "@/components/Assets/pp1.png";
import pp3 from "@/components/Assets/pp3.png";
import pp2 from "@/components/Assets/pp2.png"; // Corrected path for pp2
import pp4 from "@/components/Assets/pp4.png"; // Assuming pp4.png exists
import pp5 from "@/components/Assets/pp5.png"; // Assuming pp5.png exists
import pp6 from "@/components/Assets/pp6.png"; // Assuming pp6.png exists
import pp7 from "@/components/Assets/pp7.png"; // Assuming pp7.png exists
import icon12 from "@/components/Assets/icon12.svg";

export const testimonials = [
  {
    id: 1,
    image: pp1, // Use pp1 for the first testimonial
    icon: icon12,
    text: '"Agent Coach.ai has revolutionized my approach to negotiations. I feel more confident than ever!"',
    name: "Jan Stiedemann",
    position: "Global Applications Representative",
  },
  {
    id: 2,
    image: pp2, // Use pp2 for the second testimonial
    icon: icon12,
    text: '"I\'ve seen a significant boost in my marketing strategies thanks to the personalized coaching."',
    name: "Sara Smith",
    position: "Real Estate Agent",
  },
  {
    id: 3,
    image: pp3, // Use pp3 for the third testimonial
    icon: icon12,
    text: '"The real-time feedback is invaluable. It\'s like having a mentor in my pocket."',
    name: "Tom Johnson",
    position: "Realtor",
  },
  {
    id: 4,
    image: pp4, // Use pp4 for the fourth testimonial
    icon: icon12,
    text: '"The interactive scenarios helped me prepare for real-life challenges."',
    name: "Emily White",
    position: "Real Estate Broker",
  },
  {
    id: 5,
    image: pp5, // Use pp5 for the fifth testimonial
    icon: icon12,
    text: '"Thanks to this AI Coach, I was able to close more deals this year."',
    name: "David Brown",
    position: "Real Estate Consultant",
  },
  {
    id: 6,
    image: pp6, // Use pp6 for the sixth testimonial
    icon: icon12,
    text: '"I love how convenient it is to access coaching resources at any time!"',
    name: "Lisa Kim",
    position: "Broker Associate",
  },
  {
    id: 7,
    image: pp7, // Use pp7 for the seventh testimonial
    icon: icon12,
    text: '"The real-time feedback is invaluable. It\'s like having a mentor in my pocket."',
    name: "Mike Rodriguez",
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
            What Users Say <br className="block md:hidden" /> About Agent
            Coach.ai
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
            delay: 4500,
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

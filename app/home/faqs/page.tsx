"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./faq.module.css";
import downicon from "@/components/Assets/faqdownicon.svg";
import axios from "axios"; // Added axios
import { Loader2 } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const Faq: React.FC = () => {
  const [faqData, setFaqData] = useState<FaqItem[]>([]); // Changed to use fetched data
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // {{ edit_1 }} Added activeIndex state
  const answerRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Added useEffect for fetching data
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://admindashbord-lumio.onrender.com/faqs"
        );
        const { faqs } = response.data; // Adjust based on your API response structure
        setFaqData(faqs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      // {{ edit_1 }} Updated loading state handling
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    ); // Conditional rendering for loader

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index); // {{ edit_2 }} Ensure activeIndex is defined
  };

  return (
    <div className={styles.main}>
      <div className={styles.box}>
        <h1 className="text-3xl font-normal text-white mb-2">
          Frequently Asked Questions About Agent Coach.ai
        </h1>
        <p className="text-lg text-gray-400 text-center w-11/12">
          Find answers to your queries about the capabilities and usage of Agent
          Coach.ai.
        </p>
      </div>
      <div className={styles.faqContainer}>
        {faqData.map((item: FaqItem, index: number) => (
          <div key={index} className={styles.faqItem}>
            <div
              className={`${styles.questionBox} ${
                activeIndex === index ? styles.active : ""
              } cursor-pointer`}
              onClick={() => toggleAnswer(index)}
            >
              {item.question}
              <div className={styles.icon}>
                <Image
                  src={downicon}
                  className={`${styles.arr} ${
                    activeIndex === index ? "transform rotate-180" : ""
                  } transition-transform duration-300`}
                  alt="Toggle answer"
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <div
              ref={(el) => {
                answerRef.current[index] = el; // Store the element
                return; // Ensure the function returns void
              }}
              className={`${styles.answerBox} ${
                activeIndex === index ? styles.visible : ""
              }`}
              style={{
                height:
                  activeIndex === index
                    ? ⁠ ${(answerRef.current[index]?.scrollHeight || 0) + 40}px ⁠
                    : "0px",
                opacity: activeIndex === index ? 1 : 0,
              }}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;

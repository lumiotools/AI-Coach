"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./faq.module.css";
import downicon from "@/components/Assets/faqdownicon.svg";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const Faq: React.FC = () => {
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const answerRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://admindashbord-lumio.onrender.com/faqs"
        );
        const { faqs } = response.data;
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
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.main}>
      <div className={styles.box}>
        <h1 className="text-3xl font-normal text-white mb-2">
          Frequently Asked Questions AboutAgent Coach.ai
        </h1>
        <p className="text-lg text-gray-400 text-center w-11/12">
          Get the Answers You Need About AgentCoach.ai's Powerful Features and
          Benefits!
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
                answerRef.current[index] = el;
                return;
              }}
              className={`${styles.answerBox} ${
                activeIndex === index ? styles.visible : ""
              }`}
              style={{
                height:
                  activeIndex === index
                    ? `${(answerRef.current[index]?.scrollHeight || 0) + 40}px`
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

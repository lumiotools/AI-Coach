"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./faq.module.css";
import downicon from "@/components/Assets/faqdownicon.svg";

interface FaqItemProps {
  item: {
    question: string;
    answer: string;
  };
  index: number;
}

export default function ClientFaqItem({ item, index }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.style.maxHeight = isOpen
        ? `${answerRef.current.scrollHeight}px`
        : "0";
    }
  }, [isOpen]);

  const toggleAnswer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.faqItem}>
      <div
        className={`${styles.questionBox} ${
          isOpen ? styles.active : ""
        } cursor-pointer`}
        onClick={toggleAnswer}
      >
        {item.question}
        <div className={styles.icon}>
          <Image
            src={downicon}
            className={`${styles.arr} ${
              isOpen ? "transform rotate-180" : ""
            } transition-transform duration-300`}
            alt={isOpen ? "Close answer" : "Open answer"}
            width={20}
            height={20}
          />
        </div>
      </div>
      <div
        ref={answerRef}
        className={`${styles.answerBox} ${isOpen ? styles.visible : ""}`}
        style={{
          maxHeight: "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        {item.answer}
      </div>
    </div>
  );
}

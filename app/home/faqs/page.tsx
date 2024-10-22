import React from "react";
import styles from "./faq.module.css";
import { Loader2 } from "lucide-react";
import ClientFaqItem from "./ClientFaqItem";

interface FaqItem {
  question: string;
  answer: string;
}

async function getFaqs(): Promise<FaqItem[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_API}/faqs`,
    { next: { revalidate: 3600 } }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch FAQs");
  }
  const data = await response.json();
  return data.faqs;
}

export default async function Faq() {
  let faqData: FaqItem[];
  try {
    faqData = await getFaqs();
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading FAQs. Please try again later.</p>
      </div>
    );
  }

  if (!faqData || faqData.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.box}>
        <h1 className="text-3xl font-normal text-white mb-2">
          Frequently Asked Questions About AgentCoach.ai
        </h1>
        <p className="text-lg text-gray-400 text-center w-11/12">
          Get the Answers You Need About AgentCoach.ai's Powerful Features and
          Benefits!
        </p>
      </div>
      <div className={styles.faqContainer}>
        {faqData.map((item: FaqItem, index: number) => (
          <ClientFaqItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

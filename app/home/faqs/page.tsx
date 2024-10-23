import React from "react";
import styles from "./faq.module.css";
import ClientFaqItem from "./ClientFaqItem";

interface FaqItem {
  question: string;
  answer: string;
  _id: string;
}

const defaultFaqs: FaqItem[] = [
  {
    question: "What is AgentCoach.ai?",
    answer:
      "AgentCoach.ai is an AI-powered platform specifically designed for real estate agents. By providing personalized advice, strategies, and insights based on your prompts, it helps you improve your skills and communication, create marketing materials and reports, and effectively grow your business.",
    _id: "66fa7b5eaec6a9c1269bc133",
  },
  {
    question: "How does AgentCoach.ai work?",
    answer:
      "AgentCoach.ai delivers expert sales and negotiation tips with precise responses to your specific queries, providing you with tailored objection-handling tactics and strategies. Elevate your marketing game with instant custom-written articles, email campaigns, and eye-catching ads for Facebook and Instagram. Create compelling branding, taglines and more - your imagination is the only limit! Get specialized advice on any real estate, sales, marketing, negotiation or motivation topic, all backed by the latest in AI technology. With AgentCoach.ai, you're never alone in your real estate journey!",
    _id: "66fa7b75aec6a9c1269bc138",
  },
  {
    question: "How often is the AI updated with new information?",
    answer:
      "We continuously update our AI model with the latest real estate trends, market data, and industry insights. The system is refreshed daily to ensure you always have access to the most current and relevant information.",
    _id: "66fa7b9caec6a9c1269bc148",
  },
  {
    question: "Can I access AgentCoach.ai on my mobile device?",
    answer:
      "Yes, AgentCoach.ai is fully responsive and can be accessed on any device with an internet connection, including smartphones and tablets.",
    _id: "66fa7b86aec6a9c1269bc13f",
  },
  {
    question: "Is my data secure with AgentCoach.ai?",
    answer:
      "We take data security very seriously. All your information is encrypted and stored securely. We adhere to strict privacy policies and never share your personal data with third parties without your explicit consent.",
    _id: "66fa7bb0aec6a9c1269bc153",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes, we offer a 7-day free trial for new users! This gives you the chance to explore all the features of AgentCoach.ai and discover how it can enhance your real estate career before committing to one of our affordable paid plans.",
    _id: "66fc337bb2d230a0d040c2b0",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel your subscription at any time. There are no long-term contracts, and you can easily manage your subscription settings from your account dashboard.",
    _id: "66fa7bc7aec6a9c1269bc160",
  },
];

async function getFaqs(): Promise<FaqItem[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_API}/faqs`,
      {
        next: { revalidate: 3600 },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("FAQ data fetched successfully");
    return data.faqs;
  } catch (error) {
    console.error("Error fetching FAQ data:", error);
    return defaultFaqs;
  }
}

export default async function Faq() {
  let faqData: FaqItem[];
  try {
    faqData = await getFaqs();
  } catch (error) {
    console.error("Error in Faq component:", error);
    faqData = defaultFaqs;
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
        {faqData.map((item: FaqItem) => (
          <ClientFaqItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

"use client"

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "axios";
import { Loader2 } from "lucide-react";

type Faq = {
  question: string;
  answer: string;
};

export default function FAQ() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://admindashbord-lumio.onrender.com/faqs");
        const { faqs } = response.data;
        setFaqs(faqs)
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally { 
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-800">
          Frequently Asked Questions
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-blue-200 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="text-left p-4 hover:bg-blue-50 transition-colors duration-200">
                  <span className="text-lg font-medium text-black">{faq.question}</span> {/* Changed text color to black */}
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-blue-50">
                  <p className="text-black leading-relaxed">{faq.answer}</p> {/* Changed text color to black */}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
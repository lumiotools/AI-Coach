"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OD7X2SGxfAbFy2L9HhqRfde5HzpY5pAb1LsDvgWMfNOyCjh9djhd8Me7TFODBFP7HArIWdBkDwNHvaHLpCxhsI300zZDZU0MO"
);

interface Tier {
  name: string;
  plan: string;
  description: string;
  monthlyPrice: {
    original: string;
    discounted: string;
    strikethrough?: boolean;
  };
  annualPrice: {
    original: string;
    discounted: string;
    strikethrough?: boolean;
  };
  features: string[];
  popular?: boolean;
}

interface PricingCardProps {
  tier: Tier;
  originalPrice: string;
  price: string;
  billingPeriod: "monthly" | "annual";
  onSubscribe: (plan: string) => Promise<void>;
  isLoading: boolean;
  strikethrough?: boolean;
}

function parsePrice(price: string): number {
  return parseFloat(price.replace("$", "")) || 0;
}

function calculateSavingsPercentage(monthlyPrice: number, annualPrice: number): number {
  const monthlyEquivalent = annualPrice / 12;
  return monthlyPrice > 0 ? (1 - monthlyEquivalent / monthlyPrice) * 100 : 0;
}

function getAverageSavings(tiers: Tier[]): number {
  const individualTier = tiers.find((tier) => tier.plan === "individual");
  const teamTier = tiers.find((tier) => tier.plan === "team");

  if (!individualTier || !teamTier) {
    return 0;
  }

  const individualMonthlyPrice = parsePrice(individualTier.monthlyPrice.discounted);
  const individualAnnualPrice = parsePrice(individualTier.annualPrice.discounted);

  const teamMonthlyPrice = parsePrice(teamTier.monthlyPrice.discounted);
  const teamAnnualPrice = parsePrice(teamTier.annualPrice.discounted);

  const individualSavings = calculateSavingsPercentage(
    individualMonthlyPrice,
    individualAnnualPrice
  );
  const teamSavings = calculateSavingsPercentage(
    teamMonthlyPrice,
    teamAnnualPrice
  );

  return (individualSavings + teamSavings) / 2;
}

export default function PricingPage(): JSX.Element {
  // const tiers: Tier[] = [
  //   {
  //     name: "Individual Plan",
  //     plan: "individual",
  //     description: "Best for individuals.",
  //     monthlyPrice: {
  //       original: "$20",
  //       discounted: "$15",
  //       strikethrough: true,
  //     },
  //     annualPrice: {
  //       original: "$200",
  //       discounted: "$150",
  //       strikethrough: true,
  //     },
  //     features: ["Feature 1", "Feature 2"],
  //     popular: false,
  //   },
  //   {
  //     name: "Team Plan",
  //     plan: "team",
  //     description: "Best for teams.",
  //     monthlyPrice: {
  //       original: "$50",
  //       discounted: "$40",
  //       strikethrough: true,
  //     },
  //     annualPrice: {
  //       original: "$500",
  //       discounted: "$400",
  //       strikethrough: true,
  //     },
  //     features: ["Feature A", "Feature B"],
  //     popular: true,
  //   },
  //   // Add more tiers as needed
  // ]; 

  const tiers: Tier[] = [
    {
      name: "Free",
      monthlyPrice: {
        original: "$0",
        discounted: "$0",
        strikethrough: false,
      },
      annualPrice: {
        original: "$0",
        discounted: "$0",
        strikethrough: false,
      },
      description: "Essential AI coaching for individuals",
      features: ["General AI Coach Only", "Usage Limits"],
      plan: "free",
    },
    {
      name: "Individual",
      monthlyPrice: {
        original: "$49.95",
        discounted: "$29.95",
        strikethrough: true,
      },
      annualPrice: {
        original: "$445",
        discounted: "$285",
        strikethrough: true,
      },
      description: "Advanced Multi-Category AI Coaching for Real Estate Agents",
      features: [
        "Specialized AI Coaches",
        "24/7 Access",
        "No Usage Limits",
        "Single User Access",
      ],
      plan: "individual",
      popular: true,
    },
    {
      name: "Team",
      monthlyPrice: {
        original: "$99.95",
        discounted: "$49.95",
        strikethrough: true,
      },
      annualPrice: {
        original: "$895",
        discounted: "$445",
        strikethrough: true,
      },
      description: "Comprehensive AI Coaching Solutions for Real Estate Teams",
      features: [
        "Specialized AI Coaches",
        "24/7 Access",
        "No Usage Limits",
        "Up to 5 Users",
      ],
      plan: "team",
    },
    {
      name: "Organization",
      monthlyPrice: {
        original: "Contact us",
        discounted: "Contact us",
        strikethrough: false,
      },
      annualPrice: {
        original: "Contact us",
        discounted: "Contact us",
        strikethrough: false,
      },
      description: "Tailored Solutions for Organizations",
      features: [
        "Custom Built AI Coaches",
        "Organizational Branding",
        "API Access & Integration",
        "Dedicated Account Manager",
      ],
      plan: "organization",
    },
  ];


  const averageSavings = getAverageSavings(tiers);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  console.log(billingPeriod)

  const handleSubscribe = async (plan: string): Promise<void> => {
    if (plan === "free") {
      alert("Please sign up for the free plan directly from the app.");
      return;
    }

    if (plan === "enterprise") {
      alert("Please contact us to subscribe to the Enterprise plan.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan,
            billingPeriod,
            email: "kunalsalunkhe360@gmail.com",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error("Stripe redirect error:", error);
        }
      } else {
        console.error("Stripe not loaded");
      }
    } catch (error) {
      console.error("Error during subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-bold mb-2 text-center text-blue-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          AgentCoach.ai Pricing
        </motion.h1>
        <motion.p
          className="text-xl text-center mb-12 text-gray-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Choose the perfect plan for your coaching needs
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="monthly" className="mb-12 relative">
            <span className="bg-yellow-400 text-gray-800 text-xs font-bold rounded-lg p-1.5 absolute right-[5%] top-[-40px] md:right-[13%] md:top-[-32px] lg:right-[24%] xl:right-[29%] ">
              {averageSavings.toFixed(0)}% off
            </span>
            <TabsList className="bg-white grid w-full grid-cols-2 max-w-[400px] mx-auto my-10 h-fit rounded-full overflow-hidden shadow-md">
              <TabsTrigger
                value="monthly"
                onClick={() => setBillingPeriod("monthly")}
                className="p-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300 ease-in-out"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="annual"
                onClick={() => setBillingPeriod("annual")}
                className="p-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300 ease-in-out"
              >
                Yearly
              </TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {tiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PricingCard
                      tier={tier}
                      originalPrice={tier.monthlyPrice.original}
                      price={tier.monthlyPrice.discounted}
                      billingPeriod="monthly"
                      onSubscribe={() => handleSubscribe(tier.plan)} // Updated to use an arrow function
                      isLoading={isLoading}
                      strikethrough={tier.monthlyPrice.strikethrough}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="annual">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {tiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PricingCard
                      tier={tier}
                      originalPrice={tier.annualPrice.original}
                      price={tier.annualPrice.discounted}
                      billingPeriod="annual"
                      onSubscribe={() => handleSubscribe(tier.plan)} // Updated to use an arrow function
                      isLoading={isLoading}
                      strikethrough={tier.annualPrice.strikethrough}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        <div className="mb-16">
          <Card className="border-none rounded-[20px] bg-gradient-to-r from-blue-600 to-blue-400 backdrop-blur-[20px] overflow-hidden shadow-xl">
            <CardContent className="p-10">
              <div className="flex justify-center mb-4">
                <div className="bg-white text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  High Performer Spring 2023
                </div>
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-white">
                &quot;Truly a game changer for documentation across all
                functions&quot;
              </h3>
              <p className="text-center text-gray-100 mb-6 lg:w-1/2 mx-auto">
                &quot;AgentCoach.AI is easy to use and powerful. Ever had a
                situation where you need to schedule time with a colleague to
                show them how to do something, but schedules don&apos;t align?
                Make a quick AgentCoach.AI in these cases, creating can take as
                little as a minute (seriously).&quot;
              </p>
              <div className="text-center">
                <p className="font-semibold text-white">Chris Widner</p>
                <p className="text-sm text-gray-200">
                  Business Operations Automation Lead
                </p>
                <p className="text-sm text-gray-200">IDK</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-2 text-center text-blue-800">
            Still Have Questions?
          </h2>
          <Link
            href="/contact"
            className="text-blue-600 hover:underline transition-all duration-300 ease-in-out"
          >
            Reach Out
          </Link>
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  tier,
  originalPrice,
  price,
  billingPeriod,
  onSubscribe,
  isLoading,
  strikethrough,
}: PricingCardProps) {
  return (
    <Card
      className={`rounded-[20px] bg-white backdrop-blur-[20px] flex flex-col text-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 ${tier.popular ? "border-[2px] border-blue-500" : "border border-gray-200"
        } h-full`}
    >
      <CardHeader className="flex-grow-0">
        {tier.popular && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-[20px]">
            Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold text-blue-800">
          {tier.name}
        </CardTitle>
        <CardDescription className="text-gray-600 line-clamp-2 h-12">
          {tier.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div>
          <p className="text-3xl font-bold mb-4 flex flex-col items-start text-blue-800">
            <span className="flex items-baseline">
              {price}
              {tier.plan !== "organization" && (
                <span className="text-sm font-normal ml-1 text-gray-600">
                  /{billingPeriod}
                </span>
              )}
            </span>
            {strikethrough && (
              <span className="line-through text-xl font-extralight text-gray-500">
                {originalPrice}
              </span>
            )}
          </p>
          <ul className="space-y-2">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className={`w-full hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 ${tier.plan === "free" ? "bg-gray-400" : "bg-blue-500"
            } text-white`}
          onClick={() => onSubscribe(tier.plan)}
          disabled={isLoading}
        >
          {tier.plan === "organization" ? "Contact Us" : "Choose Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
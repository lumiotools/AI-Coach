"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";
import { json, text } from "stream/consumers";

interface PersonalizedAIFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PersonalizedAIForm({
  isOpen,
  onClose,
}: PersonalizedAIFormProps) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    yearsInRealEstate: "",
    companyName: "",
    businessGoals: "",
    learningStyle: "",
    personalDevelopment: "",
    financialAspirations: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("No user found");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user")
        .update({ personalized_data: formData })
        .eq("user_id", user.id);

      if (error) throw error;

      onClose();
    } catch (error) {
      console.error("Error saving data to Supabase:", error);
    }
  };

  useEffect(() => {
    const fetchPersonalizedData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("user")
          .select("personalized_data")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching personalized data:", error);
        } else if (data && data.personalized_data) {
          setFormData({
            ...formData,
            ...data.personalized_data,
            name: user.fullName || data.personalized_data.name || "",
          });
        } else {
          setFormData({
            ...formData,
            name: user.fullName || "",
          });
        }
      }
    };

    fetchPersonalizedData();
  }, [user]);

  return (
    <div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-custom-gradient backdrop-blur-[20px] dark:bg-white dark:text-black rounded-lg shadow-xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <div className="flex flex-col items-end mb-4 md:mb-0">
                <Button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  variant="ghost"
                  size="icon"
                >
                  <p className="text-white bg-[#2f76ff] hover:bg-[#1e63e6] flex justify-center items-center font-bold rounded-md px-2 py-1 border border-none">
                    Skip
                  </p>
                </Button>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-center text-white dark:text-black bg-clip-text">
                Personalize Your AI Experience
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-white dark:text-black"
                    >
                      First Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="w-full flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-[#f0f0f0] border border-[#2F76FF] rounded-[8px] focus:outline-none 
                      dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
                      placeholder:text-gray-100 dark:placeholder:text-gray-600"
                      style={{
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 300,
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="yearsInRealEstate"
                      className="text-sm font-medium text-white dark:text-black"
                    >
                      Number of Years in Real Estate
                    </Label>
                    <Input
                      id="yearsInRealEstate"
                      name="yearsInRealEstate"
                      type="number"
                      placeholder="Enter number of years"
                      value={formData.yearsInRealEstate}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-[#f0f0f0] border border-[#2F76FF] rounded-[8px] focus:outline-none 
                      dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
                      placeholder:text-gray-100 dark:placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="currentRole"
                    className="text-sm font-medium text-white dark:text-black"
                  >
                    What is Your Company Name?
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Name of Your Company..."
                    className="w-full flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-[#f0f0f0] border border-[#2F76FF]  rounded-[8px] focus:outline-none 
                    dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
                    placeholder:text-gray-100 dark:placeholder:text-gray-600"
                    style={{
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 300,
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="businessGoals"
                    className="text-sm font-medium text-white dark:text-black"
                  >
                    Business Goals and Objectives
                  </Label>
                  <Textarea
                    id="businessGoals"
                    name="businessGoals"
                    value={formData.businessGoals}
                    onChange={handleInputChange}
                    placeholder="Describe your business goals..."
                    className="w-full min-h-[100px] flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-[#f0f0f0] border border-[#2F76FF] focus:outline-none rounded-[8px] 
                    dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
                    placeholder:text-gray-100 dark:placeholder:text-gray-600"
                    style={{
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 300,
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white dark:text-black">
                    Preferred Learning Style
                  </Label>
                  <RadioGroup
                    name="learningStyle"
                    value={formData.learningStyle}
                    onValueChange={(value) =>
                      handleSelectChange("learningStyle", value)
                    }
                    className="flex flex-wrap gap-4 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-white border border-[#2F76FF] p-4  rounded-[8px]"
                  >
                    {[
                      "Visual",
                      "Auditory",
                      "Reading/Writing",
                      "Kinesthetic",
                    ].map((style) => (
                      <div key={style} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={style.toLowerCase()}
                          id={style.toLowerCase()}
                          className="text-white dark:text-black bg-gray-800 dark:bg-white"
                        />
                        <Label
                          htmlFor={style.toLowerCase()}
                          className="text-white dark:text-black"
                        >
                          {style}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="personalDevelopment"
                    className="text-sm font-medium text-white dark:text-black"
                  >
                    Personal Development and Wellbeing
                  </Label>
                  <Textarea
                    id="personalDevelopment"
                    name="personalDevelopment"
                    value={formData.personalDevelopment}
                    onChange={handleInputChange}
                    placeholder="Areas of personal growth..."
                    className="w-full min-h-[100px] flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-[#f0f0f0] border border-[#2F76FF] focus:outline-none rounded-[8px] 
                    dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
                    placeholder:text-gray-100 dark:placeholder:text-gray-600"
                    style={{
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 300,
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="financialAspirations"
                    className="text-sm font-medium text-white dark:text-black"
                  >
                    Financial and Career Aspirations
                  </Label>
                  <Textarea
                    id="financialAspirations"
                    name="financialAspirations"
                    value={formData.financialAspirations}
                    onChange={handleInputChange}
                    placeholder="Your financial goals..."
                    className="w-full min-h-[100px] flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-[#f0f0f0] border border-[#2F76FF] focus:outline-none rounded-[8px] 
                    dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
                    placeholder:text-gray-100 dark:placeholder:text-gray-600"
                    style={{
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 300,
                    }}
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label
                    htmlFor="background"
                    className="text-sm font-medium text-white dark:text-black"
                  >
                    Your Background
                  </Label>
                  <Textarea
                    id="background"
                    name="background"
                    value={formData.background}
                    onChange={handleInputChange}
                    placeholder="Tell us about your background..."
                    className="w-full min-h-[100px] flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-[#f0f0f0] border border-[#2F76FF] rounded-[8px]focus:outline-none 
                    dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
                    placeholder:text-gray-100 dark:placeholder:text-gray-600 "
                    style={{
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 300,
                    }}
                  />
                </div> */}

                <div className="flex justify-center items-center">
                  <Button
                    type="submit"
                    className="text-white bg-[#2f76ff] hover:bg-[#1e63e6] flex justify-center items-center font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Personalize My Experience
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

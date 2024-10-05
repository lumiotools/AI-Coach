"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Textarea } from "../components/ui/textarea";

interface PersonalizedAIFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PersonalizedAIForm({
  isOpen,
  onClose,
}: PersonalizedAIFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: 25,
    occupation: "",
    learningStyle: "",
    contentType: "",
    communicationStyle: "",
    goals: "",
    accessibilityNeeds: false,
    background: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("personalizedAIData", JSON.stringify(formData));
    onClose();
  };

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
              <Button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                variant="ghost"
                size="icon"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>

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
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
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
                      htmlFor="age"
                      className="text-sm font-medium text-white dark:text-black"
                    >
                      Age
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="18"
                      max="100"
                      className="w-full flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-[#f0f0f0]  border border-[#2F76FF]  rounded-[8px] focus:outline-none  
                                            dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
                                            placeholder:text-gray-100 dark:placeholder:text-gray-600"
                      style={{
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 300,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="occupation"
                    className="text-sm font-medium text-white dark:text-black"
                  >
                    Occupation
                  </Label>
                  <div className="rounded-full">
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      placeholder="Your current job"
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
                </div>

                <div className="space-y-2">
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

                {/* <div className="space-y-2">
                                    <Label htmlFor="contentType" className="text-sm font-medium text-white dark:text-gray-300">Preferred Content Type</Label>
                                    <Select onValueChange={(value) => handleSelectChange("contentType", value)}
                                    >
                                        <SelectTrigger    className="w-full flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-white border border-[#2F76FF] focus:outline-none  pl-6 
                                        dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
                                        placeholder:text-gray-500"
                                                                      style={{
                                                                          fontSize: "16px",
                                                                          fontStyle: "normal",
                                                                          fontWeight: 300,
                                                                      }}>
                                            <SelectValue placeholder="Select content type" />
                                        </SelectTrigger>
                                        <SelectContent
   className="w-full flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-white border border-[#2F76FF] focus:outline-none 
   dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
   placeholder:text-gray-500"
                                 style={{
                                     fontSize: "16px",
                                     fontStyle: "normal",
                                     fontWeight: 300,
                                 }}
                                        >
                                            {["Text", "Audio", "Video", "Interactive"].map((type) => (
                                                <SelectItem key={type} value={type.toLowerCase()} className="w-full flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-white border border-[#2F76FF] focus:outline-none 
                                                dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
                                                placeholder:text-gray-500"
                                                                              style={{
                                                                                  fontSize: "16px",
                                                                                  fontStyle: "normal",
                                                                                  fontWeight: 300,
                                                                              }}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="communicationStyle" className="text-sm font-medium text-white dark:text-gray-300">Preferred Communication Style</Label>
                                    <Select onValueChange={(value) => handleSelectChange("communicationStyle", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select communication style" className="text-white" />
                                        </SelectTrigger>
                                        <SelectContent 
                                                                                className="bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-white border border-[#2F76FF] focus:outline-none"
>
                                            {["Formal", "Casual", "Technical", "Humorous"].map((style) => (
                                                <SelectItem key={style} value={style.toLowerCase()} className="text-black">{style}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div> */}

                <div className="space-y-2">
                  <Label
                    htmlFor="goals"
                    className="text-sm font-medium text-white dark:text-black"
                  >
                    Your Goals
                  </Label>
                  <Textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    placeholder="What are your learning or professional goals?"
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

                {/* <div className="flex items-center space-x-2">
                                    <Switch
                                        id="accessibilityNeeds"
                                        checked={formData.accessibilityNeeds}
                                        onCheckedChange={handleSwitchChange}
                                    />
                                    <Label htmlFor="accessibilityNeeds" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        I have accessibility needs
                                    </Label>
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

"use client";

import { useState, FormEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Copy, Mail, RefreshCcw, Share2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import "react-toastify/dist/ReactToastify.css";
import HeaderBar from "@/components/header";
import { useClerk } from "@clerk/nextjs";

interface Description {
  title: string;
  mainDescription: string;
  propertyHighlights: string;
  additionalFeatures: string;
  locationAdvantages: string;
  conclusion: string;
}

interface BrochureContent {
  headline: string;
  tagline: string;
  overview: string;
  keyFeatures: string[];
  end: string;
  callToAction: string;
}

export default function BrochureProComponent() {
  const [description, setDescription] = useState<Description>({
    title: "",
    mainDescription: "",
    propertyHighlights: "",
    additionalFeatures: "",
    locationAdvantages: "",
    conclusion: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [formData, setFormData] = useState({
    type: "",
    propertyAddress: "",
    propertyType: "",
    locationAmenities: "",
    propertyDescription: "",
    interiorFeatures: "", // Sample data
    exteriorFeatures: "", // Sample data
  });
  const [errors, setErrors] = useState({
    type: "",
    propertyAddress: "",
    propertyType: "",
    locationAmenities: "",
    propertyDescription: "",
    interiorFeatures: "",
    exteriorFeatures: "",
  });
  const [brochureContent, setBrochureContent] =
    useState<BrochureContent | null>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const toastIdRef = useRef<string | number | null>(null);

  const { signOut } = useClerk();

  const loadingSteps = [
    "Analyzing property details...",
    "Crafting a compelling description...",
    "Finalizing your professional brochure...",
  ];

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      type: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      type: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key as keyof typeof errors] = `${key
          .replace(/([A-Z])/g, " $1")
          .trim()} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoadingStep(0);

    const data = {
      listingType: formData.type,
      propertyAddress: formData.propertyAddress,
      propertyType: formData.propertyType,
      locationAmenities: formData.locationAmenities,
      propertyDescription: formData.propertyDescription,
      interiorFeatures: formData.interiorFeatures,
      exteriorFeatures: formData.exteriorFeatures,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROPERTY_PITCH_API_URL}/generate-description`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate description");
      }
      setLoadingStep(1);
      const result = await response.json();
      setBrochureContent({
        headline: result.headline,
        tagline: result.tagline,
        overview: result.overview,
        keyFeatures: [
          ...result.locationHighlights,
          result.propertyFeatures.exterior,
          result.propertyFeatures.interior,
          ...result.propertyFeatures.uniqueSellingPoints,
        ],
        end: result.lifestyleDescription + "\n" + result.marketInsight,
        callToAction: result.callToAction,
      });
    } catch (error) {
      console.error("Error generating description:", error);
      setError(
        "An error occurred while generating the description. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (brochureContent) {
      const content = `
${brochureContent.headline}

${brochureContent.tagline}

${brochureContent.overview}

Key Features:
${brochureContent.keyFeatures.map((feature) => `- ${feature}`).join("\n")}

${brochureContent.end}

${brochureContent.callToAction}
      `;

      navigator.clipboard.writeText(content).then(
        () => {
          toast.success("Content copied to clipboard!");
        },
        () => {
          toast.error("Failed to copy content", {
            position: "top-right",
            autoClose: 1500,
            style: {
              backgroundColor: "#F44336",
              color: "#FFFFFF",
              padding: "16px",
              borderRadius: "8px",
            },
          });
        }
      );
    }
  };

  const handleEmailContent = () => {
    setIsEmailDialogOpen(true);
  };

  const sendEmail = async () => {
    if (brochureContent && emailAddress && !isEmailSending) {
      setIsEmailSending(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PROPERTY_PITCH_API_URL}/send-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: emailAddress,
              subject: brochureContent.headline,
              brochureContent: JSON.stringify(brochureContent),
            }),
          }
        );

        if (response.ok) {
          setIsEmailDialogOpen(false);
          setEmailAddress("");
        } else {
          const errorText = await response.text();
          throw new Error(`Failed to send email: ${errorText}`);
        }
      } catch (error) {
        console.error("Error sending email:", error);
      } finally {
        setIsEmailSending(false);
      }
    }
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    setLoadingStep(0);

    const data = {
      listingType: formData.type,
      propertyAddress: formData.propertyAddress,
      propertyType: formData.propertyType,
      locationAmenities: formData.locationAmenities,
      propertyDescription: formData.propertyDescription,
      interiorFeatures: formData.interiorFeatures,
      exteriorFeatures: formData.exteriorFeatures,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROPERTY_PITCH_API_URL}/generate-description`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate description");
      }
      setLoadingStep(1);
      const result = await response.json();
      console.log("result", result);

      setBrochureContent({
        headline: result.headline,
        tagline: result.tagline,
        overview: result.overview,
        keyFeatures: [
          ...result.locationHighlights,
          result.propertyFeatures.exterior,
          result.propertyFeatures.interior,
          ...result.propertyFeatures.uniqueSellingPoints,
        ],
        end: result.lifestyleDescription + "\n" + result.marketInsight,
        callToAction: result.callToAction,
      });
      toast.success("Brochure content regenerated successfully!");
    } catch (error) {
      console.error("Error regenerating description:", error);
      setError(
        "An error occurred while regenerating the description. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderBrochureContent = () => {
    if (!brochureContent) return null;

    const { headline, tagline, overview, keyFeatures, end, callToAction } =
      brochureContent;

    const mergedKeyFeatures = [
      keyFeatures.slice(0, Math.ceil(keyFeatures.length / 2)).join(" "),
      keyFeatures.slice(Math.ceil(keyFeatures.length / 2)).join(" "),
    ];

    return (
      <div className="space-y-6">
        <ToastContainer />
        <div className="text-center">
          <h3 className="text-3xl font-bold  text-blue-500 opacity-80 mb-2 text-center transition-colors">
            {headline}
          </h3>
          <p className="text-xl text-blue-500 opacity-80 italic text-center transition-colors">
            {tagline}
          </p>
        </div>
        <div>
          <h4 className="text-2xl font-semibold text-blue-500 opacity-80 mb-2 transition-colors">
            Highlights
          </h4>
          <p className="text-gray-200 text-justify">{overview}</p>
        </div>
        <div>
          <h4 className="text-2xl font-semibold text-blue-500 opacity-80 mb-2 transition-colors">
            Key Features
          </h4>
          {mergedKeyFeatures.map((paragraph, index) => (
            <p key={index} className="text-gray-200 text-justify mb-2">
              {paragraph.trim()}
            </p>
          ))}
        </div>
        <div className="text-gray-200">
          <p className="mb-4 text-justify">{end}</p>
          <p className="font-semibold text-blue-500 opacity-80 text-justify transition-colors">
            {callToAction}
          </p>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <Button
            onClick={handleCopyToClipboard}
            className="flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </Button>
          <Dialog
            open={isEmailDialogOpen}
            onOpenChange={(open) => {
              if (!isEmailSending) {
                setIsEmailDialogOpen(open);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={handleEmailContent}
                className="flex items-center space-x-2"
                disabled={isEmailSending}
              >
                <Mail className="w-4 h-4" />
                <span>{isEmailSending ? "Sending..." : "Email"}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1E2738] border-[#2A3652] text-white sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Enter Email Address
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center w-full gap-4">
                  <Input
                    id="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="col-span-3 bg-[#1E2738] border-[#2A3652] text-white w-full"
                  />
                </div>
              </div>
              <Button
                onClick={sendEmail}
                disabled={isEmailSending}
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white"
              >
                {isEmailSending ? "Sending..." : "Send Email"}
              </Button>
            </DialogContent>
          </Dialog>
          <Button
            onClick={handleRegenerate}
            className="flex items-center space-x-2 transition-colors text-white"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Regenerate</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <HeaderBar
        isSidebarOpen={false}
        setIsSidebarOpen={() => false}
        signOut={signOut}
      />
      <div className="min-h-screen bg-[#0A0E17] text-white pb-8 pt-24">
        <ToastContainer />
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h1 className="text-2xl font-semibold mb-2">Property Pitch</h1>
            <p className="text-lg text-gray-300 mb-2">
              Turn Key Features into Standout Descriptions
            </p>
            <div className="max-w-3xl mx-auto text-gray-400 text-base">
              <p className="mb-4 text-gray-400 text-base text-balance">
                PropertyPitch transforms property details into well-crafted
                descriptions that help sell. With smart text generation tailored
                for real estate listings, this tool provides a seamless way to
                copy, download, or share impactful property copy with your
                audience. Whether you&apos;re highlighting key features or
                creating an entire listing, PropertyPitch ensures your content
                is polished, professional, and optimized to attract potential
                buyers.
              </p>
            </div>
          </header>

          <main className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#131A2B] p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-6">
                Create Property Pitch
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="type">Listing Type</Label>
                  <Select
                    name="type"
                    onValueChange={handleSelectChange}
                    value={formData.type}
                  >
                    <SelectTrigger
                      id="type"
                      className="bg-[#1E2738] border-[#2A3652] text-white"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E2738] border-[#2A3652]">
                      <SelectItem
                        value="sale"
                        className="text-gray-200 focus:bg-[#2A3652] focus:text-white"
                      >
                        For Sale
                      </SelectItem>
                      <SelectItem
                        value="rent"
                        className="text-gray-200 focus:bg-[#2A3652] focus:text-white"
                      >
                        For Rent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-red-400 text-sm mt-1">{errors.type}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="propertyAddress">Property Address</Label>
                  <Input
                    id="propertyAddress"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. 550 Milwaukee Street Denver, CO 80202"
                    className="bg-[#1E2738] border-[#2A3652] text-white"
                  />
                  {errors.propertyAddress && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.propertyAddress}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Input
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    placeholder="e.g. Single Family Ranch Style Home, Hi-Rise Condominium"
                    className="bg-[#1E2738] border-[#2A3652] text-white"
                  />
                  {errors.propertyType && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.propertyType}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="locationAmenities">
                    Property Location and Nearby Amenities
                  </Label>
                  <Textarea
                    id="locationAmenities"
                    name="locationAmenities"
                    value={formData.locationAmenities}
                    onChange={handleInputChange}
                    placeholder="e.g. Located in the Cherry Creek Neighborhood of Denver, CO near the Botanic Gardens and Cherry Creek Mall"
                    rows={3}
                    className="bg-[#1E2738] border-[#2A3652] text-white"
                  />
                  {errors.locationAmenities && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.locationAmenities}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="propertyDescription">
                    Describe the Property
                  </Label>
                  <Textarea
                    id="propertyDescription"
                    name="propertyDescription"
                    value={formData.propertyDescription}
                    onChange={handleInputChange}
                    placeholder="e.g. 4 Bedroom, 3 Bath brick mid-century ranch with a 2 car garage on a quiet cul de sac"
                    rows={3}
                    className="bg-[#1E2738] border-[#2A3652] text-white"
                  />
                  {errors.propertyDescription && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.propertyDescription}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="interiorFeatures">Interior Features</Label>
                  <Textarea
                    id="interiorFeatures"
                    name="interiorFeatures"
                    value={formData.interiorFeatures}
                    onChange={handleInputChange}
                    placeholder="e.g. Updated Viking appliances, library with wall-to-wall custom bookcases, two fireplaces"
                    rows={3}
                    className="bg-[#1E2738] border-[#2A3652] text-white"
                  />
                  {errors.interiorFeatures && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.interiorFeatures}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="exteriorFeatures">Exterior Features</Label>
                  <Textarea
                    id="exteriorFeatures"
                    name="exteriorFeatures"
                    value={formData.exteriorFeatures}
                    onChange={handleInputChange}
                    placeholder="e.g. Large private patio and lush landscaping, in-ground swimming pool with guest casita"
                    rows={3}
                    className="bg-[#1E2738] border-[#2A3652] text-white"
                  />
                  {errors.exteriorFeatures && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.exteriorFeatures}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors   text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Create Brochure"}
                </Button>
              </form>
            </div>

            <div className="bg-[#131A2B] p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-6">
                Generated Property Pitch
              </h2>
              <div
                className="bg-[#1E2738] p-6 rounded-lg overflow-y-auto max-h-[90rem]"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#4B5563 #1F2937",
                }}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Brain className="w-16 h-16 text-[#2463EB] animate-pulse" />
                    <p className="text-center text-gray-300 text-lg">
                      {loadingSteps[loadingStep]}
                    </p>
                  </div>
                ) : brochureContent ? (
                  <div className="space-y-6 text-gray-200">
                    {renderBrochureContent()}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">
                    {error ||
                      "Your professional property brochure content will appear here after you generate the listing."}
                  </p>
                )}
              </div>
            </div>
          </main>

          <footer className="mt-12 text-center text-sm text-gray-400">
            © 2024 PropertyPitch. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
}

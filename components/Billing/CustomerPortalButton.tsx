"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function CustomerPortalButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      console.log("user", user?.primaryEmailAddress?.emailAddress);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/create-customer-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user?.primaryEmailAddress?.emailAddress,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create portal session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error creating portal session:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <span onClick={handleManageBilling}>
      {isLoading ? "Loading..." : "Manage Billing"}
    </span>
  );
}

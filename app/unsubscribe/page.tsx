"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0D1C] text-white">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Unsubscribe</CardTitle>
            <CardDescription>Invalid email address</CardDescription>
          </CardHeader>
          <CardContent>
            <p>The email address is invalid. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace this URL with your actual API endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMAIL_SERVER_URL}/unsubscribe?email=${email}`
      );

      if (!response.ok) {
        throw new Error("Failed to unsubscribe");
      }

      setIsUnsubscribed(true);
    } catch (err) {
      setError("An error occurred while unsubscribing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <Card className="w-[350px] bg-[#272944] text-white border-0">
        <CardHeader>
          <CardTitle>Unsubscribe</CardTitle>
          <CardDescription>Confirm your email unsubscription</CardDescription>
        </CardHeader>
        <CardContent>
          {isUnsubscribed ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="mr-2" />
              <p>You have been successfully unsubscribed.</p>
            </div>
          ) : (
            <p>
              Are you sure you want to unsubscribe {email} from our mailing
              list?
            </p>
          )}
          {error && (
            <div className="flex items-center text-red-600 mt-2">
              <AlertCircle className="mr-2" />
              <p>{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {!isUnsubscribed && (
            <>
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleUnsubscribe} disabled={isLoading}>
                {isLoading ? "Unsubscribing..." : "Confirm Unsubscribe"}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

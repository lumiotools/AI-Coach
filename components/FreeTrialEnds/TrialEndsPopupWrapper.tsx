"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import TrialEndPopup from "./TrialEndsPopup";

interface TrialStatus {
  remainingDays: number;
  trialEnded: boolean;
}

interface PlanDetails {
  name: string;
  price: number;
  description: string;
  billingPeriod: string;
}

interface UserMetadata {
  paymentInfo?: {
    email: string;
    payment_id: string;
  };
  planDetails?: PlanDetails;
  trialStatus?: TrialStatus;
}

export default function TrialEndPopupWrapper() {
  const [showPopup, setShowPopup] = useState(false);
  const [remainingDays, setRemainingDays] = useState<number | null>(null);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkAndUpdateTrialStatus = async () => {
      if (isLoaded && user) {
        const metadata = user.publicMetadata as UserMetadata;
        const planDetails = metadata.planDetails;

        const response = await fetch("/api/update-trial-status", {
          method: "POST",
        });
        const data = await response.json();
        if (data.success) {
          setRemainingDays(data.trialStatus.remainingDays);
          setShowPopup(data.trialStatus.remainingDays == 0 && !planDetails);

          setRemainingDays(0);
          setShowPopup(true);
        } else {
          console.error("Failed to update trial status:", data.error);
        }
      }
    };

    checkAndUpdateTrialStatus();
  }, [user, isLoaded, router]);

  console.log(showPopup, remainingDays);

  if (!showPopup || remainingDays === null) return null;

  return (
    <>
      <TrialEndPopup
        onClose={() => setShowPopup(false)}
        remainingDays={remainingDays}
      />
    </>
  );
}

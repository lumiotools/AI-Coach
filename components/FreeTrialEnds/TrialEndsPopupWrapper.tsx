"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import TrialEndPopup from "./TrialEndsPopup";

const POPUP_THRESHOLD = 3; // Show popup when 3 days are remaining

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

  useEffect(() => {
    const checkAndUpdateTrialStatus = async () => {
      if (isLoaded && user) {
        const metadata = user.publicMetadata as UserMetadata;
        const trialStatus = metadata.trialStatus;
        const planDetails = metadata.planDetails;

        if (!trialStatus) {
          const response = await fetch("/api/update-trial-status", {
            method: "POST",
          });
          const data = await response.json();
          if (data.success) {
            setRemainingDays(data.trialStatus.remainingDays);
            setShowPopup(
              data.trialStatus.remainingDays <= POPUP_THRESHOLD && !planDetails
            );
          } else {
            console.error("Failed to update trial status:", data.error);
          }
        } else {
          setRemainingDays(trialStatus.remainingDays);
          setShowPopup(
            trialStatus.remainingDays <= POPUP_THRESHOLD && !planDetails
          );
        }
      }
    };

    checkAndUpdateTrialStatus();
  }, [user, isLoaded]);

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

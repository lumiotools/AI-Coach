"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import TrialEndPopup from "./TrialEndsPopup";

const POPUP_THRESHOLD = 3; // Show popup when 3 days are remaining

interface TrialStatus {
  remainingDays: number;
  trialEnded: boolean;
}

export default function TrialEndPopupWrapper() {
  const [showPopup, setShowPopup] = useState(false);
  const [remainingDays, setRemainingDays] = useState<number | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const checkAndUpdateTrialStatus = async () => {
      if (isLoaded && user) {
        let trialStatus = user.publicMetadata.trialStatus as
          | TrialStatus
          | undefined;

        if (!trialStatus) {
          const response = await fetch("/api/update-trial-status", {
            method: "POST",
          });
          const data = await response.json();
          if (data.success) {
            trialStatus = data.trialStatus;
          } else {
            console.error("Failed to update trial status:", data.error);
            return;
          }
        }

        if (trialStatus) {
          setRemainingDays(trialStatus.remainingDays);
          setShowPopup(trialStatus.remainingDays <= POPUP_THRESHOLD);
        }
      }
    };

    checkAndUpdateTrialStatus();
  }, [user, isLoaded]);

  if (!showPopup || remainingDays === null) return null;

  return (
    <TrialEndPopup
      onClose={() => setShowPopup(false)}
      remainingDays={remainingDays}
    />
  );
}

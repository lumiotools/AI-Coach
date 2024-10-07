"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import TrialEndPopup from "./TrialEndsPopup";

const TRIAL_DURATION = 7; // Trial duration in days
const POPUP_THRESHOLD = 3; // Show popup when 3 days are remaining

export default function TrialEndPopupWrapper() {
  const [showPopup, setShowPopup] = useState(false);
  const [remainingDays, setRemainingDays] = useState(TRIAL_DURATION);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      const checkTrialEnd = () => {
        const signUpDate = user.createdAt
          ? new Date(user.createdAt)
          : new Date();
        const now = new Date();
        const diffTime = now.getTime() - signUpDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(TRIAL_DURATION - diffDays, 0);

        setRemainingDays(daysLeft);
        setShowPopup(daysLeft <= POPUP_THRESHOLD && daysLeft >= 0);
      };

      checkTrialEnd();
    }
  }, [user, isLoaded]);

  if (!showPopup) return null;

  return (
    <TrialEndPopup
      onClose={() => setShowPopup(false)}
      remainingDays={remainingDays}
    />
  );
}

import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const signUpDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = now.getTime() - signUpDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const trialDuration = 7;

    // const remainingDays = Math.max(trialDuration - diffDays, 0);
    const remainingDays=100;

    const trialStatus = {
      remainingDays,
      trialEnded: false,
      showPopup: false,
    };

    // Check if the user has a paid plan
    const hasPaidPlan = user.publicMetadata.planDetails !== undefined;

    // Preserve existing publicMetadata
    const updatedPublicMetadata = {
      ...user.publicMetadata,
      trialStatus: hasPaidPlan ? undefined : trialStatus,
    };

    await clerkClient.users.updateUser(userId, {
      publicMetadata: updatedPublicMetadata,
    });

    return NextResponse.json({ success: true, trialStatus, hasPaidPlan });
  } catch (error) {
    console.error("Failed to update trial status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

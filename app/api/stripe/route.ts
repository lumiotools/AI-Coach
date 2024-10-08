import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { paymentInfo } = await request.json();

    console.log("Payment info:", paymentInfo);

    if (!paymentInfo.userEmail) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get the user's email from Clerk
    const user = await clerkClient.users.getUserList({
      emailAddress: [paymentInfo.userEmail],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = user.data[0];

    if (paymentInfo.tier === "free") {
      console.log("Updating user metadata for free tier");
      await clerkClient.users.updateUserMetadata(userData.id, {
        publicMetadata: {
          paymentInfo: null,
          planDetails: null,
          subscriptionStatus: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: null,
          trialStatus: {
            trialEnded: false,
            remainingDays: 7,
          },
        },
      });

      return NextResponse.json(
        { message: "User payment info updated successfully" },
        { status: 200 }
      );
    }

    // Update user metadata in Clerk
    console.log("Updating user metadata for paid tier");
    await clerkClient.users.updateUserMetadata(userData.id, {
      publicMetadata: {
        paymentInfo: {
          payment_id: paymentInfo._id,
          email: paymentInfo.userEmail,
        },
        planDetails: paymentInfo.planDetails,
        subscriptionStatus: paymentInfo.status,
        currentPeriodEnd: paymentInfo.currentPeriodEnd,
        cancelAtPeriodEnd: paymentInfo.cancelAtPeriodEnd,
        trialStatus: {
          trialEnded: true,
          remainingDays: 0,
        },
      },
    });

    return NextResponse.json(
      { message: "User payment info updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user payment info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
            trialEnded: true,
            remainingDays: 0,
            showPopup: false,
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
          showPopup: false,
        },
      },
    });

    console.log(paymentInfo.planDetails.name);

    if (paymentInfo.planDetails.name === "Team") {
      const emailRes = await resend.emails.send({
        from: "aiagentcoach@teamlumio.ai",
        to: [paymentInfo.userEmail],
        subject: "Request for Team Member Emails",
        html: `
        <p>Hi there!</p>
        <p>Thank you for choosing our <strong>Comprehensive AI Coaching Solutions for Real Estate Teams</strong>.</p>
        <p>To get started with your plan, please send us the email addresses of the team members you'd like to add. As part of the plan, you can add up to 5 users to your account. Once we have their details, we'll ensure their access is set up immediately.</p>
        <p>If you have any questions, feel free to reach out.</p>
        `,
      });

      console.log("Email response:", emailRes);

      if (emailRes.error) {
        return NextResponse.json(
          { error: "Failed to send welcome email" },
          { status: 500 }
        );
      }
    }

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

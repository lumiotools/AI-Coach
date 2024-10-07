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

    // Update user metadata in Clerk
    await clerkClient.users.updateUserMetadata(userData.id, {
      publicMetadata: {
        ...userData.publicMetadata,
        paymentInfo: {
          payment_id: paymentInfo._id,
          email: paymentInfo.userEmail,
        },
        planDetails: paymentInfo.planDetails,
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

async function getPaymentInfoFromDatabase(email: string) {
  // This is a placeholder function. Replace with your actual database query.
  try {
    const paymentInfo = await fetch(
      `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/payments/${email}`
    );
    return paymentInfo;
  } catch (error) {
    console.error("Error fetching payment info from database:", error);
    return null;
  }
}

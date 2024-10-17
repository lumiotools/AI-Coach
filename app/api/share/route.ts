import { Resend } from "resend";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

async function getUserEmail(userId: string): Promise<string> {
  const user = await clerkClient.users.getUser(userId);
  return user.emailAddresses[0].emailAddress;
}

export async function POST(req: NextRequest) {
  try {
    const { content, type } = await req.json();
    const { userId } = auth();

    console.log("content 121", content?.headline, content?.tagline);

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userEmail = await getUserEmail(userId);

    const senderEmail =
      type === "property"
        ? "support@agentcoach.ai"
        : "aiagentcoach@teamlumio.ai";
    const mailSubject =
      type === "property" && content?.headline
        ? content.headline
        : "Shared Message from AgentCoach.ai";

    try {
      const result = await resend.emails.send({
        from: senderEmail,
        to: userEmail,
        subject: mailSubject,
        html: JSON.stringify(content),
      });
      console.log("Resend API response:", result);

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: `Failed to send email: ${error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Email sent successfully",
      email: userEmail,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: `An unexpected error occurred: ${error}` },
      { status: 500 }
    );
  }
}

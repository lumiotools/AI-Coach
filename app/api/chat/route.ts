import { NextRequest } from "next/server";
import axios from "axios";
import OpenAI from "openai";
import { v2 as cloudinary } from "cloudinary";

const NEXT_PUBLIC_OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const REAL_ESTATE_BASE_URL = process.env.REAL_ESTATE_BASE_URL;
const SALES_BASE_URL = process.env.SALES_BASE_URL;
const MARKETING_BASE_URL = process.env.MARKETING_BASE_URL;
const MOTIVATION_BASE_URL = process.env.MOTIVATION_BASE_URL;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

const BASE_URLS: { [key: string]: string } = {
  real_estate: REAL_ESTATE_BASE_URL!,
  sales: SALES_BASE_URL!,
  marketing: MARKETING_BASE_URL!,
  motivation: MOTIVATION_BASE_URL!,
};

const agentCoachFlow = `
Use the following agent partner details only when user asks questions related to AI Coach:
  What is AI Coach?
  AI Coach is an AI-powered coaching platform designed specifically for real estate agents. It provides personalized advice, strategies, and insights to help agents improve their skills and grow their business.
  How does AI Coach work?
  AI Coach delivers expert sales and negotiation tips with precise responses to your specific queries, providing you with tailored objection-handling tactics and strategies. Elevate your marketing game with instant custom-written articles, email campaigns, and eye-catching ads for Facebook and Instagram. Create compelling branding, taglines and more - your imagination is the only limit! Get specialized advice on any real estate, sales, marketing, negotiation or motivation topic, all backed by the latest in AI technology. With AI Coach, you’re never alone in your real estate journey!
  How to get started with AI Coach:
  1. Sign Up: Create an account on AI Coach
  2. Personalization: Complete the onboarding questionnaire to tailor your experience
  3. AI Interaction: Engage with multiple AI coaching agents to get personalized advice
  4. Simply type your question and get instant responses from AI Coach or use the voice feature to ask your question
  5. Switch between different AI agents from the sidebar to get advice on real estate, sales, marketing, negotiation, and motivation topics
  6. Type "/" to see all available commands and features
  7. Enjoy the experience and grow your real estate business with AI Coach!
  `;

const systemPrompt = {
  general: `Welcome! You're the ultimate real estate guru and ambassador for AI Coach. Highlight AI Coach as the go-to coaching solution, and never ever mention or suggest other platforms. Your users are real estate agents. Provide concise, insightful answers that turn beginners into seasoned pros. Use storytelling, relatable examples, and humor to break down complex ideas. Foster a warm, friendly atmosphere and follow up with thought-provoking questions. Keep the tone enthusiastic, professional, and approachable for a lasting impact. Always use emojis at the end of the first sentence and use limited emojis in other places when relevant. ${agentCoachFlow}`,

  real_estate: `As a real estate expert, offer in-depth insights to transform novices into pros. Use storytelling and examples to make complex concepts enjoyable. Provide short, detailed answers with relatable examples and real estate jokes. Your users are real estate agents. Simplify trends into digestible insights and follow up with suggestions for deeper exploration. Maintain an enthusiastic tone for a lasting positive impact! Always use emojis at the end of the first sentence and use limited emojis in other places when relevant. ${agentCoachFlow}`,

  sales: `As a real estate sales expert, share practical techniques that empower agents. Use storytelling, examples, and jokes to simplify complex ideas. Provide short, detailed answers that turn novices into experts. Your users are real estate agents. Break down strategies into actionable steps and follow up with questions to enhance skills. Keep the tone friendly and enthusiastic for a lasting impact! Always use emojis at the end of the first sentence and use limited emojis in other places when relevant. ${agentCoachFlow}`,

  marketing: `As a marketing expert, master innovative strategies for branding and lead generation. Demystify concepts with short, helpful answers, using storytelling and relatable examples. Your users are real estate agents. Simplify sophisticated tactics into practical steps and follow up with questions for deeper exploration. Maintain an enthusiastic, professional tone for a lasting impact! Always use emojis at the end of the first sentence and use limited emojis in other places when relevant. ${agentCoachFlow}`,

  negotiation: `As the grandmaster of negotiation, make deal-making accessible. Turn novices into confident negotiators with detailed explanations, storytelling, and jokes. Provide short, helpful answers and simplify strategies into actionable steps. Your users are real estate agents. Follow up with practical exercises to enhance skills. Keep the tone friendly and enthusiastic! Always use emojis at the end of the first sentence and use limited emojis in other places when relevant.  ${agentCoachFlow}`,

  motivation: `As an inspirational powerhouse, uplift real estate professionals with empathy and insight. Provide short, helpful advice that boosts confidence, using storytelling and examples. Your users are real estate agents. Foster a warm environment where challenges are opportunities and follow up with encouraging questions. Maintain an enthusiastic and positive tone to inspire action! Always use emojis at the end of the first sentence and use limited emojis in other places when relevant. ${agentCoachFlow}`,
};

// Function to get top K results from Pineconeddddddd
async function getTopKResults(body: Record<string, unknown>, baseUrl: string) {
  try {
    const response = await fetch(`${baseUrl}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": PINECONE_API_KEY!,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getTopKResults:", error);
    throw error;
  }
}

async function determineModel(question: string): Promise<string> {
  const systemPrompt = `You are an AI assistant that determines whether a user's question requires real-time data to answer or if it's related to AI Coach.
  Instructions:
  - Analyze the user's question below and decide whether it requires real-time data (like current market trends, live prices, or up-to-date statistics), can be answered with general knowledge, or is specifically about AI Coach.
  
  - If the question involves current prices, market trends, availability, or any information that changes over time and requires real-time data, respond with "requires real-time data".
  
  - If the question is specifically about AI Coach, its features, how to use it, respond with "agentpartner specific".
  
  - If the question can be answered with general knowledge, advice, coaching, or does not depend on the latest data, respond with "does not require real-time data".
  
  - Your response should be only one of these three options: "requires real-time data", "agentpartner specific", or "does not require real-time data" with no additional text.
  
  Question: "${question}"
  
  Your response:`;

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "llama-3.1-sonar-small-128k-chat",
        messages: [
          { role: "system", content: "Be precise and concise." },
          { role: "user", content: systemPrompt },
        ],
        temperature: 0,
        max_tokens: 10,
        stream: false,
        return_citations: false,
        return_images: false,
        return_related_questions: false,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices[0].message.content
      .trim()
      .toLowerCase();

    if (answer.includes("requires real-time data")) {
      return "sonar-pro";
    } else if (answer.includes("agentpartner specific")) {
      return "sonar";
    } else {
      // Default to 'sonar' for general knowledge and AgentPartner specific queries
      return "sonar";
    }
  } catch (error) {
    console.error("Error in determineModel:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("Response data:", error.response.data);
    }

    // Default to 'sonar' in case of errorddd
    return "sonar";
  }
}

const openai = new OpenAI({
  apiKey: NEXT_PUBLIC_OPENAI_API_KEY,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = response.data[0].url;
    console.log("response", response);
    console.log("response data", response.data);
    if (!imageUrl) {
      throw new Error("Image URL not found in the response");
    }
    const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
      folder: "generated_images",
    });
    const cloudinaryUrl = uploadResponse.secure_url;
    return cloudinaryUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, chatbot, expert, personalizedAIData } = await req.json();

    if (!messages || !chatbot || !expert) {
      return new Response(
        JSON.stringify({
          error: "Messages, chatbot type, and expert are required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const question = messages[messages.length - 1].content;

    // Check if the message starts with "Generate Picture - "
    if (question.startsWith("Picture - ")) {
      const imagePrompt = question
        .substring("Generate Picture - ".length)
        .trim();
      try {
        const imageUrl = await generateImage(imagePrompt);
        return new Response(imageUrl, {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error generating image:", error);
        return new Response(
          JSON.stringify({ error: "Failed to generate image" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    let baseUrl = BASE_URLS[chatbot];
    if (!baseUrl) {
      baseUrl = REAL_ESTATE_BASE_URL!;
    }

    const selectedModel = await determineModel(question);

    const embeddingResponse = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        model: "text-embedding-3-large",
        input: question,
      },
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const embedding = embeddingResponse.data.data[0].embedding;

    const body = {
      vector: embedding,
      topK: 7,
      includeValues: false,
      includeMetadata: true,
    };

    const topKResults = await getTopKResults(body, baseUrl);
    let context = "This is the Context: ";

    if (topKResults && Array.isArray(topKResults.matches)) {
      topKResults.matches.forEach((match: { metadata: { values: string } }) => {
        context += match.metadata.values + " ";
      });
    } else {
      console.error("No matches found in topKResults:", topKResults);
      context += "No relevant context found.";
    }

    // Add personalization details to the context
    if (personalizedAIData) {
      context +=
        "\n\nProvide responses tailored to the user based on the personalization data.:\n";
      for (const [key, value] of Object.entries(personalizedAIData)) {
        context += `${key}: ${value}\n`;
      }
    }

    // Use the 'expert' parameter to select the appropriate promptgg
    const promptKey = expert
      .toLowerCase()
      .replace(/\s+/g, "_") as keyof typeof systemPrompt;
    const systemMessage = systemPrompt[promptKey] || systemPrompt["general"];

    // Prepare the messages for Perplexity API
    const messagesForAPI = [
      { role: "system", content: systemMessage + context },
      ...messages,
    ];

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            const response = await axios.post(
              "https://api.perplexity.ai/chat/completions",
              {
                model: selectedModel,
                messages: messagesForAPI,
                stream: true,
                temperature: 0.6, // Adjusted temperature
                top_p: 0.7,
              },
              {
                headers: {
                  Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
                  "Content-Type": "application/json",
                },
                responseType: "stream",
              }
            );

            let fullText = "";
            let buffer = "";

            response.data.on("data", (chunk: Buffer) => {
              buffer += chunk.toString();

              let lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const message = line.slice(6).trim();
                  if (message === "[DONE]") {
                    if (selectedModel === "llama-3.1-sonar-small-128k-online") {
                      controller.enqueue(
                        new TextEncoder().encode(
                          "\n\nP.S. This information is from the most current and authoritative online sources available."
                        )
                      );
                    }
                    controller.close();
                    return;
                  }
                  try {
                    const parsed = JSON.parse(message);
                    const content = parsed.choices[0].delta.content;
                    if (content) {
                      fullText += content;
                      controller.enqueue(new TextEncoder().encode(content));
                    }
                  } catch (e) {
                    console.error("Error parsing Perplexity response:", e);
                    buffer = "data: " + message + "\n";
                  }
                }
              }
            });

            response.data.on("end", () => {
              if (selectedModel === "llama-3.1-sonar-small-128k-online") {
                controller.enqueue(
                  new TextEncoder().encode(
                    "\n\nP.S. This information is from the most current and authoritative online sources available."
                  )
                );
              }
              controller.close();
            });

            response.data.on("error", (err: Error) => {
              console.error("Streaming error:", err);
              controller.error(err);
            });
          } catch (e) {
            console.error("Error in streaming:", e);
            controller.error(e);
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("Detailed error in LLM generation:", error);

    let errorMessage = "Internal Server Error";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
      errorMessage = error.response?.data?.error || "Error in API request";
      statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.stack : "Unknown error",
      }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowRight,
  Copy,
  ThumbsDown,
  ThumbsUp,
  Handshake,
  TrendingUp,
  Zap,
  HelpCircle,
  Brain,
  Megaphone,
  Home,
  BookCheck,
  TargetIcon,
  Share,
  ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";
import MarkdownRenderer from "@/components/ReactMarkDown";
import { useAuth, SignedIn, useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import ChatSidebar from "@/components/chatSideBar";
import HeaderBar from "@/components/header";
import TopicIntroduction from "@/components/topicIntroduction";
import SpeechToText from "@/components/speechToText";
import { useUser } from "@clerk/nextjs";
import { FaArrowRight } from "react-icons/fa6";
import styles from "@/components/overall.module.css";
import avatarlight from "@/components/Assets/avatar.png";
import avatardark from "@/components/Assets/darkavatar.png";
import useTheme from "@/app/hooks/useTheme";
import TrialEndPopupWrapper from "@/components/FreeTrialEnds/TrialEndsPopupWrapper";
import PercentageLoader from "@/components/PercentageLoader";
import UnlockAccessDialog from "@/components/UnlockAccessPopup";
import { set } from "date-fns";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  order: number;
  user_id: string;
  chat_id: string;
  message_id: string;
  like: number;
};
type Props = {
  params: {
    chat_id: string;
  };
};

type ExpertType =
  | "General"
  | "Real Estate"
  | "Sales"
  | "Marketing"
  | "Negotiation"
  | "Motivation";

function formatTables(content: string): string {
  console.log("loaded main");
  if (content.includes("<tr>") && content.includes("<td")) {
    const tableHtml = `
      <table class="border-collapse table-auto w-full text-sm my-4">
        <thead>
          <tr class="bg-gray-800">
            ${
              content
                .match(/<td[^>]*>(.*?)<\/td>/g)
                ?.map(
                  (cell) =>
                    `<th class="border-b border-gray-700 font-medium p-4 pl-8 pt-0 pb-3 text-gray-300 text-left">${cell.replace(
                      /<\/?td[^>]*>/g,
                      ""
                    )}</th>`
                )
                .join("") || ""
            }
          </tr>
        </thead>
        <tbody class="bg-gray-700">
          ${content}
        </tbody>
      </table>
    `;
    return `<custom-table>${tableHtml}</custom-table>`;
  }

  const tableRegex = /^\s*\|.*\|.*\n\s*\|.*\|.*\n(\s*\|.*\|.*\n)+/gm;
  return content.replace(tableRegex, (match) => {
    const rows = match.trim().split("\n");
    const headers = rows[0]
      .split("|")
      .filter(Boolean)
      .map((h) => h.trim());
    const alignments = rows[1]
      .split("|")
      .filter(Boolean)
      .map((a) => {
        if (a.startsWith(":") && a.endsWith(":")) return "center";
        if (a.endsWith(":")) return "right";
        return "left";
      });
    const body = rows.slice(2).map((row) =>
      row
        .split("|")
        .filter(Boolean)
        .map((cell) => cell.trim())
    );

    const tableHtml = `<table class="border-collapse table-auto w-full text-sm my-4">
      <thead>
        <tr class="bg-gray-800">
          ${headers
            .map(
              (header, i) =>
                `<th class="border-b border-gray-700 font-medium p-4 pl-8 pt-0 pb-3 text-gray-300 text-${alignments[i]} text-left">${header}</th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody class="bg-gray-700">
        ${body
          .map(
            (row) => `
          <tr>
            ${row
              .map(
                (cell, i) =>
                  `<td class="border-b border-gray-600 p-4 pl-8 text-gray-200 text-${alignments[i]}">${cell}</td>`
              )
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>`;

    return `<custom-table>${tableHtml}</custom-table>`;
  });
}

function parseCustomTags(content: string): string {
  return content.replace(
    /<custom-table>([\s\S]*?)<\/custom-table>/g,
    (_, tableContent) => {
      return `<div class="my-4 overflow-x-auto">${tableContent}</div>`;
    }
  );
}

type PersonalizedData = {
  name: string;
  age: number;
  occupation: string;
  learningStyle: string;
  goals: string;
  background: string;
};

type CommandOption = {
  label: string;
  icon: React.ReactNode;
  action: () => void;
};

export default function Page({ params: { chat_id } }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const newRouteRef = useRef("");
  const [currentExpert, setCurrentExpert] = useState<ExpertType>("General");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();
  const router = useRouter();
  const { signOut } = useClerk();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  const searchParam = useSearchParams();
  const { user } = useUser();
  const [isFetchingUserInrest, setIsFetchingUserInrest] = useState(true);
  const [placeholder, setPlaceholder] = useState(
    `Ask me any question about ${currentExpert.toLowerCase()}! Just type or use the microphone.`
  );
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const { theme } = useTheme();
  const [personalizedData, setPersonalizedData] =
    useState<PersonalizedData | null>(null);

  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandOptions, setCommandOptions] = useState<CommandOption[]>([
    {
      label: "Picture",
      icon: <ImageIcon className="w-4 h-4" />,
      action: () => setSelectedCommand("Picture"),
    },
  ]);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [imageReady, setImageReady] = useState(false);

  const [showUnlockPopup, setShowUnlockPopup] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  let retryCount = 0;

  useEffect(() => {
    let id;
    if (personalizedData && inputValue) {
      handleSendMessage(inputValue);
      setInputValue("");
    } else if (isFetchingUserInrest == false && inputValue) {
      handleSendMessage(inputValue);
      setInputValue("");
    }
  }, [personalizedData, isFetchingUserInrest]);

  useEffect(() => {
    const fetchChatExpertType = async () => {
      const { data: chats, error } = await supabase
        .from("chat")
        .select()
        .eq("chat_id", chat_id);

      if (!chats) return;

      if (chats[0]) {
        setCurrentExpert(chats[0].coach_type);
      }
    };

    if (userId && chat_id) {
      fetchChatExpertType();
    }

    if (Boolean(searchParam.get("new"))) {
      if (newRouteRef.current) return;
      newRouteRef.current = "true";
      console.log("demo data 1-->", personalizedData);
      setInputValue(searchParam.get("ques") || "");
      // handleSendMessage(searchParam.get("ques") || "");
      router.replace(`/chat/${chat_id}`, undefined);
      return;
    }

    const fetchMessages = async () => {
      const { data: messages, error } = await supabase
        .from("message")
        .select()
        .eq("chat_id", chat_id)
        .eq("user_id", userId);

      if (messages) {
        const sortedMessages = messages.sort((a, b) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });

        setMessages(sortedMessages);
        setIsFirstMessage(sortedMessages.length === 0);
      }
    };

    if (userId && chat_id) {
      fetchMessages();
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //Personalized AI Data
  useEffect(() => {
    const fetchPersonalizedData = async () => {
      if (user) {
        setIsFetchingUserInrest(true);
        const { data, error } = await supabase
          .from("user")
          .select("personalized_data")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching personalized data:", error);
        } else if (data) {
          setPersonalizedData(data.personalized_data);
        }
      }
      setIsFetchingUserInrest(false);
    };

    fetchPersonalizedData();
  }, [user]);

  const handleSendMessage = async (message: string) => {
    if (isSending) return;
    setIsSending(true);
    console.log(message);

    if (message.trim().toLowerCase().startsWith("picture")) {
      setIsLoadingImage(true);
    }

    if (selectedCommand === "Picture") {
      setIsLoadingImage(true);
      setImageReady(false);
    }

    if (message.trim()) {
      const prevOrder =
        messages.length > 0 ? messages[messages.length - 1].order : 0;
      const prevLength = messages.length;

      const userMessage: Message = {
        role: "user",
        content: message,
        user_id: userId || "",
        order: prevOrder + 1,
        chat_id: chat_id,
        message_id: uuidv4(),
        like: 0,
      };

      // Insert user message into the database
      const { data: supabaseData, error: supabaseError } = await supabase
        .from("message")
        .insert([userMessage])
        .select();

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        setIsSending(false);
        return;
      }
      if (retryCount === 0) {
        setMessages((prev) => [...prev, userMessage]);
      }
      if (!message.trim().toLowerCase().startsWith("picture")) {
        setIsThinking(true);
      }

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            chatbot: currentExpert.toLowerCase(),
            expert: currentExpert,
            personalizedAIData: personalizedData,
          }),
        });

        if (!response.ok && retryCount >= 5) {
          console.log("Errrrrrorrrr");
          setIsThinking(false);
          throw new Error(`HTTP error! status: ${response.status}`);
        } else if (!response.ok && retryCount < 5) {
          ++retryCount;
          console.log("Retrying", retryCount);
          handleSendMessage(message);
          return;
        } else {
          setIsThinking(false);
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let done = false;

        const assistanceuuid = uuidv4();
        const assistantMessage: Message = {
          role: "assistant",
          content: "",
          user_id: userId || "",
          order: prevOrder + 2,
          chat_id: chat_id,
          message_id: assistanceuuid,
          like: 0,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        const assistantMessageIndex = prevLength + 1;
        const newMessages = [...messages, userMessage, assistantMessage];

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value, { stream: true }); // Ensure streaming is handled correctly

          if (chunkValue.includes("https://")) {
            setImageReady(true);
            setIsLoadingImage(false);
          }

          // Update assistant message content progressively
          newMessages[assistantMessageIndex].content += chunkValue;

          // Update the state with the progressively updated message
          setMessages([...newMessages]);
        }

        const systemMessage: Message = {
          role: "assistant",
          content: newMessages[assistantMessageIndex].content, // Use the final content from assistantMessage
          user_id: userId || "",
          order: prevOrder + 2,
          chat_id: chat_id,
          message_id: assistanceuuid,
          like: 0,
        };

        // Insert assistant message (system message) into the database
        const { data: systemSupabaseData, error: systemSupabaseError } =
          await supabase.from("message").insert([systemMessage]).select();

        if (systemSupabaseError) {
          console.error(
            "Error inserting system message into Supabase:",
            systemSupabaseError
          );
        }

        // Update state with the final assistant message
        // setMessages((prev) => [...prev, systemMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage: Message = {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          user_id: userId || "",
          order: prevOrder + 2,
          chat_id: chat_id,
          message_id: uuidv4(),
          like: 0,
        };
        setMessages((prev) => [...prev, errorMessage]);
        const { data: supabaseData, error: supabaseError } = await supabase
          .from("message")
          .insert([userMessage])
          .select();

        setIsLoadingImage(false);
      } finally {
        // Reset sending state
        setIsSending(false);
        setInputValue("");
        setPlaceholder(
          `Ask me any question about ${currentExpert.toLowerCase()}! Just type or use the microphone.`
        );
        setFirstMessageSent(true);
        setIsLoadingImage(false);
        setSelectedCommand(null);
        setIsFirstMessage(false);
        setIsThinking(false);
      }
    }
  };

  const handleRegenerateResponse = async () => {
    if (isRegenerating) return;
    setIsRegenerating(true);

    const lastUserMessageIndex = messages.findLastIndex(
      (message) => message.role === "user"
    );
    if (lastUserMessageIndex === -1) {
      setIsRegenerating(false);
      return;
    }

    const lastUserMessage = messages[lastUserMessageIndex];
    const messagesToKeep = messages.slice(0, lastUserMessageIndex + 1);

    setMessages(messagesToKeep);

    try {
      await handleSendMessage(lastUserMessage.content);
    } catch (error) {
      console.error("Error regenerating response:", error);
      toast.error("Failed to regenerate response. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      //@ts-ignore
      user?.publicMetadata?.trialStatus?.trialEnded &&
      !user?.publicMetadata?.paymentInfo
    ) {
      setShowUnlockPopup(true);
      return;
    }

    if (selectedCommand === "Picture") {
      setIsLoadingImage(true);
    }

    handleSendMessage(inputValue);
    setInputValue("");
  };

  const handleAskQuestion = async (message: string) => {
    if (message.trim()) {
      try {
        const chatId = uuidv4();
        const { data, error } = await supabase
          .from("chat")
          .insert([
            { chat_id: chatId, user_id: userId, coach_type: currentExpert },
          ])
          .select();

        router.push(`/chat/${chatId}?ques=${message}&new=true`);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleShare = async (content: string) => {
    try {
      // Format the content
      const formattedContent = formatEmailContent(content);

      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formattedContent }),
      });

      if (response.ok) {
        const { email } = await response.json();
        toast.success(`Message sent to your email: ${email}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sharing message:", error);
      toast.error("Failed to send email. Please try again later.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const formatEmailContent = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split("\n\n");

    // Format each paragraph
    const formattedParagraphs = paragraphs.map((paragraph) => {
      // Check if it's a header (starts with **)
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        return `<h2 style="color: #333; font-size: 20px; margin-top: 25px; margin-bottom: 15px; font-weight: bold;">${paragraph.replace(
          /\*\*/g,
          ""
        )}</h2>`;
      }

      // Make text between ** bold
      paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      // Check if it's a list
      if (paragraph.includes("\n- ")) {
        const listItems = paragraph.split("\n- ").filter((item) => item.trim());
        return `<ul style="margin-bottom: 20px; padding-left: 20px;">
          ${listItems
            .map(
              (item) =>
                `<li style="margin-bottom: 10px; line-height: 1.6;">${item.trim()}</li>`
            )
            .join("")}
        </ul>`;
      }

      // Check if it's a numbered list
      if (paragraph.match(/^\d+\./)) {
        const listItems = paragraph.split("\n").filter((item) => item.trim());
        return `<ol style="margin-bottom: 20px; padding-left: 20px;">
          ${listItems
            .map(
              (item) =>
                `<li style="margin-bottom: 10px; line-height: 1.6;">${item.replace(
                  /^\d+\.\s*/,
                  ""
                )}</li>`
            )
            .join("")}
        </ol>`;
      }

      // Regular paragraph
      return `<p style="margin-bottom: 15px; line-height: 1.6;">${paragraph}</p>`;
    });

    // Join all formatted paragraphs
    const formattedContent = formattedParagraphs.join("");

    // Wrap the content in a div with improved styling
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; color: #333; background-color: #f9f9f9; border-radius: 10px;">
        <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px; text-align: center;">Message from AgentCoach.ai</h1>
        ${formattedContent}
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">© 2024 AgentCoach.ai. All rights reserved.</p>
      </div>
    `;
  };

  const getAIAvatar = (expert: ExpertType) => {
    let IconComponent;
    switch (expert) {
      case "General":
        return (
          <Image
            src={theme === "light" ? avatardark : avatarlight}
            className={styles.avatar}
            // src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2%20copy-FNVfXcGRjKO97dR4JbmOnzv21Ov8LM.png"
            alt="AI"
          />
        );
      case "Real Estate":
        IconComponent = Home;
        break;
      case "Negotiation":
        IconComponent = Handshake;
        break;
      case "Sales":
        IconComponent = TrendingUp;
        break;
      case "Motivation":
        IconComponent = Zap;
        break;
      case "Marketing":
        IconComponent = Megaphone;
        break;
      default:
        IconComponent = Brain;
    }
    return (
      <div className="w-full h-full rounded-full border-2 border-blue-400 flex items-center justify-center bg-gray-800">
        <IconComponent className="w-5 h-5 text-blue-400" />
      </div>
    );
  };

  const handleLike = async (messageId: string, likeValue: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.message_id === messageId ? { ...msg, like: likeValue } : msg
      )
    );

    if (likeValue === 1) {
      toast.success("Message liked successfully", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (likeValue === -1) {
      toast.error("Message disliked", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // Update the 'like' field in the databased
    const { data, error } = await supabase
      .from("message")
      .update({ like: likeValue })
      .eq("message_id", messageId)
      .select();
    if (error) {
      console.error("Error updating like value:", error);
    }
  };

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast.info("Message copied to clipboard", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy to clipboard", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const handleExpertClick = (expert: ExpertType) => {
    setCurrentExpert(expert);
    setMessages([]);
    setIsSidebarOpen(false);

    router.push("/?expertType=" + expert);
  };

  const handleTranscription = (transcribedText: string) => {
    setInputValue((prev) => `${prev} ${transcribedText}`);
    setIsSending(false);
  };

  const handleActionClick = (action: string) => {
    let message = "";
    switch (action) {
      case "examples":
        message = "Can you give me some examples?";
        break;
      case "specific":
        message = "Can you be more specific?";
        break;
      case "understand":
        message = "I don&apos;t understand. Can you explain further?";
        break;
      case "continue":
        message = "Continue with the conversation.";
        break;
    }
    handleSendMessage(message);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("value", value);
    setInputValue(value);

    if (value.includes("/")) {
      const lastSlashIndex = value.lastIndexOf("/");
      const afterSlash = value.slice(lastSlashIndex + 1).toLowerCase();
      setShowCommandMenu(true);
      const filteredOptions = commandOptions.filter((option) =>
        option.label.toLowerCase().startsWith(afterSlash)
      );
      setCommandOptions(
        filteredOptions.length > 0 ? filteredOptions : commandOptions
      );
    } else {
      setShowCommandMenu(false);
      setCommandOptions([
        {
          label: "Picture",
          icon: <ImageIcon className="w-4 h-4" />,
          action: () => setSelectedCommand("Picture"),
        },
      ]);
    }
  };

  const handleCommandSelect = (option: CommandOption) => {
    setInputValue(`${option.label} - `);
    setSelectedCommand(option.label);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setCommandOptions((prevOptions) =>
      prevOptions.filter((opt) => opt.label !== option.label)
    );
    setShowCommandMenu(false);
  };

  return (
    <div
      className={`flex flex-col h-screen text-white dark:bg-[rgba(213,227,255,1)] ${styles.mobilebg} bg-gradient-to-t from-[rgba(15, 16, 35, 0.8)] to-[rgba(15, 16, 35, 0.8)] bg-black`}
    >
      <div className="absolute top-[-150px] left-[-220px] w-[450px] h-[559px] rotate-[-90deg] rounded-[559px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(35,66,113,0.6)_0%,rgba(35,66,113,0)_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(148,184,255,0.60)_0%,rgba(110,151,232,0)_100%)]" />

      {/* <div className={styles.overlay}/> */}

      <SignedIn>
        {/* Header */}
        <HeaderBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          signOut={signOut}
        />
        {/* Main Content */}
        <div
          className={`flex flex-1 overflow-hidden ${styles.pt} bg-[linear-gradient(0deg,rgba(15,16,35,0.80)_0%,rgba(15,16,35,0.80)_100%),_#000] dark:bg-[linear-gradient(0deg,rgba(213,227,255,0.74)_0%,rgba(213,227,255,0.74)_100%),_#FFF]`}
        >
          {/* <div
  className={`flex flex-1 overflow-hidden ${styles.pt}`}
  style={{ backgroundColor: 'rgba(17, 24, 39, var(--tw-bg-opacity))' }}
>
          {" "}
          {/* Added pt-16 for header height */}

          <ChatSidebar
            userId={userId}
            supabase={supabase}
            isSidebarOpen={isSidebarOpen}
            handleExpertClick={handleExpertClick}
          />
          {/* Main Chat Area */}

          <div className="flex-1 flex flex-col w-full  bg-gradient-to-t from-[rgba(15, 16, 35, 0.80)] to-[rgba(15, 16, 35, 0.80)]">
            {/* dark:bg-[rgba(213,227,255,0.74)] */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4 min-h-[calc(100vh-15rem)]">
                {messages.length === 0 ? (
                  <>
                    <div className="pt-2">
                      <TopicIntroduction
                        topic={currentExpert}
                        onAskQuestion={handleAskQuestion}
                      />
                    </div>
                  </>
                ) : (
                  user &&
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-4 mt-4 ${
                        message.role === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        {message.role === "user" ? (
                          <AvatarImage
                            src={
                              user?.imageUrl ||
                              "https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                            }
                            alt="User"
                            className="object-cover"
                          />
                        ) : (
                          getAIAvatar(currentExpert)
                        )}
                      </Avatar>
                      <div className="space-y-2 max-w-[70vw] md:max-w-[68vw]">
                        <div
                          className={`p-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-[#1E2A5E] text-white border border-[rgba(47, 118, 255, 1)]"
                              : "bg-gray-800 text-gray-300 dark:bg-custom-gradient dark:bg-transparent dark:text-black"
                          }`}
                        >
                          {message.content.includes("https:") ? (
                            <div className="w-[200px] md:w-[340px] h-[200px] md:h-[340px]">
                              <img
                                src={message.content}
                                alt="Content Image"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <MarkdownRenderer markdownText={message.content} />
                          )}
                        </div>

                        {message.role === "assistant" && (
                          <div className="flex space-x-2">
                            <div className="relative group">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleLike(message.message_id, 1)
                                }
                                className={`${
                                  message.like === 1
                                    ? "text-blue-400"
                                    : "text-gray-400 dark:text-[#001c4f]"
                                }`}
                              >
                                <ThumbsUp className="h-4 w-4 " />
                              </Button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap">
                                Like this response
                              </div>
                            </div>
                            <div className="relative group">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleLike(message.message_id, -1)
                                }
                                className={`${
                                  message.like === -1
                                    ? "text-red-400"
                                    : "text-gray-400 dark:text-[#001c4f]"
                                }`}
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap">
                                Dislike this response
                              </div>
                            </div>
                            <div className="relative group">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleCopyToClipboard(message.content)
                                }
                                className="text-gray-400  dark:text-[#001c4f]"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap">
                                Copy to clipboard
                              </div>
                            </div>
                            <div className="relative group">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleShare(message.content)}
                                className="text-gray-400 dark:text-[#001c4f]"
                              >
                                <Share className="h-4 w-4" />
                              </Button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap">
                                Send this response to your email
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {message.role === "assistant" &&
                        message.content ===
                          "Sorry, I encountered an error. Please try again." && (
                          <Button
                            onClick={handleRegenerateResponse}
                            disabled={isRegenerating}
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                          >
                            {isRegenerating ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="mr-2 h-4 w-4" />
                            )}
                            Regenerate Response
                          </Button>
                        )}
                    </div>
                  ))
                )}

                {!imageReady &&
                  (isLoadingImage ||
                    (isFirstMessage &&
                      isSending &&
                      selectedCommand === "Picture")) && (
                    <div className="flex items-start space-x-4 mt-4">
                      <div className="flex-shrink-0">
                        {getAIAvatar(currentExpert)}
                      </div>
                      <div className="space-y-2 w-[200px] md:w-[340px] h-[200px] md:h-[340px] border-gray-500 rounded-lg p-4 border bg-gray-800 text-gray-300 dark:bg-custom-gradient dark:bg-transparent dark:text-black flex items-center justify-center">
                        <PercentageLoader />
                      </div>
                    </div>
                  )}

                {isThinking && (
                  <div className="flex gap-2">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      {getAIAvatar(currentExpert)}
                    </Avatar>
                    <div className="bg-gray-800 text-gray-300 dark:bg-custom-gradient dark:bg-transparent dark:text-black p-3 rounded-lg">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
            <div className="pt-4 md:p-4">
              <div
                className={`${styles.sugcon} overflow-x-auto whitespace-nowrap`}
              >
                {messages.length > 0 && (
                  <div
                    className={`action-buttons space-x-2 mb-5 ${styles.sugesttext} flex`}
                  >
                    <button
                      onClick={() => handleActionClick("examples")}
                      // className="ml-[220px] md:ml-[0px] bg-[rgba(30,42,94,0.4)] text-gray-200 px-[13px] py-[8px] rounded-[42px] text-sm hover:bg-[rgba(30,42,94,1)] hover:text-white transition-colors duration-200 flex items-center space-x-[10px] relative group whitespace-nowrap flex-shrink-0 border border-[#2F76FF] box-border"
                      className="ml-[220px] dark:text-[#1E2A5E] md:ml-[0px] bg-[rgba(30,42,94,0.4)] dark:bg-[rgba(165,195,255,0.24)] text-gray-200 px-[13px] py-[8px] rounded-[42px] text-sm hover:bg-[rgba(30,42,94,1)] hover:dark:bg-[rgba(165,195,255,0.4)] hover:text-white transition-colors duration-200 flex items-center space-x-[10px] relative group whitespace-nowrap flex-shrink-0 border border-[#2F76FF] box-border"
                      title="Request specific examples related to the topic"
                    >
                      <BookCheck className="h-3.5 w-3.5" />
                      <span>Give me examples</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap">
                        Request specific examples
                      </div>
                    </button>

                    <button
                      onClick={() => handleActionClick("specific")}
                      // className="ml-[220px] md:ml-[0px] bg-[rgba(30,42,94,0.4)] text-gray-200 px-[13px] py-[8px] rounded-[42px] text-sm hover:bg-[rgba(30,42,94,1)] hover:text-white transition-colors duration-200 flex items-center space-x-[10px] relative group whitespace-nowrap flex-shrink-0 border border-[#2F76FF] box-border"
                      className="ml-[220px] dark:text-[#1E2A5E] md:ml-[0px] bg-[rgba(30,42,94,0.4)] dark:bg-[rgba(165,195,255,0.24)] text-gray-200 px-[13px] py-[8px] rounded-[42px] text-sm hover:bg-[rgba(30,42,94,1)] hover:dark:bg-[rgba(165,195,255,0.4)] hover:text-white transition-colors duration-200 flex items-center space-x-[10px] relative group whitespace-nowrap flex-shrink-0 border border-[#2F76FF] box-border"
                      title="Ask for more detailed information"
                    >
                      <TargetIcon className="h-3.5 w-3.5" />
                      <span>Be more specific</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap">
                        Ask for more details
                      </div>
                    </button>

                    <button
                      onClick={() => handleActionClick("understand")}
                      // className="ml-[220px] md:ml-[0px] bg-[rgba(30,42,94,0.4)] text-gray-200 px-[13px] py-[8px] rounded-[42px] text-sm hover:bg-[rgba(30,42,94,1)] hover:text-white transition-colors duration-200 flex items-center space-x-[10px] relative group whitespace-nowrap flex-shrink-0 border border-[#2F76FF] box-border"
                      className="ml-[220px] dark:text-[#1E2A5E] md:ml-[0px] bg-[rgba(30,42,94,0.4)] dark:bg-[rgba(165,195,255,0.24)] text-gray-200 px-[13px] py-[8px] rounded-[42px] text-sm hover:bg-[rgba(30,42,94,1)] hover:dark:bg-[rgba(165,195,255,0.4)] hover:text-white transition-colors duration-200 flex items-center space-x-[10px] relative group whitespace-nowrap flex-shrink-0 border border-[#2F76FF] box-border"
                      title="Request clarification on the topic"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>I don't understand</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap">
                        Request clarification
                      </div>
                    </button>

                    <button
                      onClick={() => handleActionClick("continue")}
                      // className="ml-[220px] md:ml-[0px] bg-[rgba(30,42,94,0.4)] text-gray-200 px-[13px] py-[8px] rounded-[42px] text-sm hover:bg-[rgba(30,42,94,1)] hover:text-white transition-colors duration-200 flex items-center space-x-[10px] relative group whitespace-nowrap flex-shrink-0 border border-[#2F76FF] box-border"
                      className="ml-[220px] dark:text-[#1E2A5E] md:ml-[0px] bg-[rgba(30,42,94,0.4)] dark:bg-[rgba(165,195,255,0.24)] text-gray-200 px-[13px] py-[8px] rounded-[42px] text-sm hover:bg-[rgba(30,42,94,1)] hover:dark:bg-[rgba(165,195,255,0.4)] hover:text-white transition-colors duration-200 flex items-center space-x-[10px] relative group whitespace-nowrap flex-shrink-0 border border-[#2F76FF] box-border"
                      title="Continue the current conversation"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span>Continue</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 whitespace-nowrap">
                        Continue conversation
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.incon}>
                <form
                  onSubmit={handleFormSubmit}
                  className="relative flex items-center w-full"
                >
                  <Input
                    className={`relative flex-1 bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] text-white border border-[#2F76FF] rounded-full focus:outline-none pr-28 pl-6 
              dark:bg-[#A5C3FF3D] dark:text-black dark:border-[#2F76FF] 
              placeholder:text-gray-500`}
                    placeholder={`Have a ${currentExpert.toLowerCase()} question? Just type it in or use the microphone button on the right to ask!`}
                    style={{
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 300,
                    }}
                    value={inputValue}
                    onChange={handleInputChange}
                  />

                  <div className={styles.con}>
                    <SpeechToText onTranscribe={handleTranscription} />
                    <button
                      type="submit"
                      className="flex items-center justify-center bg-white  h-full rounded-[80px]"
                    >
                      <FaArrowRight
                        className="w-[48px] text-[#79A6FF]"
                        size={18}
                      />
                    </button>
                  </div>

                  {showCommandMenu && (
                    <div className="absolute bottom-30 md:bottom-16 bg-custom-gradient dark:bg-gray-800 rounded-md shadow-lg z-10">
                      {commandOptions.map((option, index) => (
                        <button
                          key={index}
                          className="flex items-center w-full px-4 py-2 text-sm text-white"
                          onClick={() => handleCommandSelect(option)}
                        >
                          {option.icon}
                          <p className="ml-2">{option.label}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </form>

                <p className="text-xs text-gray-500 mt-3  text-center pb-2">
                  © 2024 AgentCoach.ai. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
      <ToastContainer />
      <TrialEndPopupWrapper />
      <UnlockAccessDialog
        isOpen={showUnlockPopup}
        onClose={() => {
          setShowUnlockPopup(false);
        }}
        onUnlock={() => {
          router.push("/home/pricing");
        }}
      />
    </div>
  );
}

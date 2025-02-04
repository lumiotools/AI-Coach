"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import "react-toastify/dist/ReactToastify.css";
import { add, format } from "date-fns";
import styles from "./overall.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Brain,
  Handshake,
  Home,
  Megaphone,
  Newspaper,
  TrendingUp,
  Zap,
} from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import UnlockAccessDialog from "./UnlockAccessPopup";
import AdminDashboardButton from "./AdminDashboardButton";

type ChatPreview = {
  chat_id: string;
  firstMessage: string;
  created_at: string;
  coach_type: string;
};

function ChatHistory({ userId, supabase, userEmail }: any) {
  const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);
  const [showToday, setShowToday] = useState(true);
  const [showYesterday, setShowYesterday] = useState(false);
  const [showOthers, setShowOthers] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchChatPreviews = async () => {
      const { data: chats, error } = await supabase
        .from("chat")
        .select(
          `chat_id, created_at, coach_type, messages:message(content, created_at)`
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching chat previews:", error);
        return;
      }

      const chatPreviews = chats.map((chat: any) => {
        const firstMessageContent =
          chat.messages.length > 0
            ? chat.messages[0].content
            : "No messages yet";

        return {
          chat_id: chat.chat_id,
          firstMessage: firstMessageContent,
          created_at: new Date(chat.created_at),
          coach_type: chat.coach_type,
        };
      });

      setChatPreviews(chatPreviews);
    };

    fetchChatPreviews();
  }, [supabase, userId]);

  const groupChatsByDate = (chats: ChatPreview[]) => {
    const groupedChats: { [key: string]: ChatPreview[] } = {};

    chats.forEach((chat) => {
      const dateKey = format(chat.created_at, "yyyy-MM-dd");
      if (!groupedChats[dateKey]) {
        groupedChats[dateKey] = [];
      }
      groupedChats[dateKey].push(chat);
    });

    return groupedChats;
  };

  const groupedChats = groupChatsByDate(chatPreviews);
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(new Date(Date.now() - 864e5), "yyyy-MM-dd");

  return (
    <div className="w-64 h-full text-white">
      <hr className="border-gray-700"></hr>
      <hr className="border-gray-700"></hr>
      <h2 className="dark:text-[#1E2A5E] flex pl-[29px] pt-[15px] text-xl font-semibold pt-2 pr-2 pl-2 pb-0 text-gray-100 common-text">
        Chat History
      </h2>
      <ScrollArea className="max-h-[calc(100vh-8rem)] p-2 overflow-y-auto ">
        {Object.keys(groupedChats).length > 0 ? (
          <div>
            {groupedChats[today] && groupedChats[today].length > 0 && (
              <div className=" mb-[8px]">
                <div className="flex items-center justify-between pl-[21px] pr-2">
                  <h3 className="text-sm font-lg text-[#8C8C8C] dark:text-[#2F76FF]">
                    Today
                  </h3>
                  <button
                    onClick={() => setShowToday(!showToday)} // Toggle visibility
                    className="focus:outline-none"
                  >
                    {showToday ? (
                      <ChevronUp size={20} className="dark:text-[#2F76FF]" />
                    ) : (
                      <ChevronDown size={20} className="dark:text-[#2F76FF]" />
                    )}
                  </button>
                </div>
                <div className="w-[92%] ml-auto border-b-2 border-[#79A6FF] pb-[6px] mb-[14px]" />

                {showToday && (
                  <>
                    {groupedChats[today].map((chat) => (
                      <Link key={chat.chat_id} href={`/chat/${chat.chat_id}`}>
                        <div className="ml-[12px] m-[2px] pl-[10px] flex items-center hover:bg-black space-x-2 p-2 bg-opacity-10 dark:hover:bg-[rgba(30,42,94,0.12)] rounded-lg cursor-pointer">
                          <div>
                            <p className="text-sm text-gray-300 dark:text-[#435B8C] line-clamp-1 text-ellipsis">
                              {chat.firstMessage}
                            </p>
                            <p className="text-xs text-gray-500">
                              <span className="text-sm text-gray-400 dark:text-[#5676B5]">
                                {chat.coach_type}
                              </span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}

            {groupedChats[yesterday] && groupedChats[yesterday].length > 0 && (
              <div className=" mb-[8px]">
                <div className="flex items-center justify-between pl-[21px] pr-2">
                  <h3 className="text-sm font-lg text-[#8C8C8C] dark:text-[#2F76FF]">
                    Yesterday
                  </h3>
                  <button
                    onClick={() => setShowYesterday(!showYesterday)} // Toggle visibility
                    className="focus:outline-none"
                  >
                    {showYesterday ? (
                      <ChevronUp size={20} className="dark:text-[#2F76FF]" />
                    ) : (
                      <ChevronDown size={20} className="dark:text-[#2F76FF]" />
                    )}
                  </button>
                </div>
                <div className="w-[92%] ml-auto border-b-2 border-[#79A6FF] pb-[6px] mb-[14px]" />

                {showYesterday && (
                  <>
                    {groupedChats[yesterday].map((chat) => (
                      <Link key={chat.chat_id} href={`/chat/${chat.chat_id}`}>
                        <div className="ml-[12px] m-[2px] pl-[10px] flex items-center hover:bg-black space-x-2 p-1 bg-opacity-10 dark:hover:bg-[rgba(30,42,94,0.12)] rounded-lg cursor-pointer">
                          <div>
                            <p className="text-sm text-gray-300 dark:text-[#435B8C] line-clamp-1 text-ellipsis">
                              {chat.firstMessage}
                            </p>
                            <p className="text-xs text-gray-500">
                              <span className="text-sm text-gray-400 dark:text-[#5676B5]">
                                {chat.coach_type}
                              </span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}

            {Object.keys(groupedChats)
              .filter((date) => date !== today && date !== yesterday)
              .map((date) => (
                <div className=" mb-[8px]" key={date}>
                  <div className="flex items-center justify-between pl-[21px] pr-2">
                    <h3 className="text-sm font-lg text-[#8C8C8C] dark:text-[#2F76FF]">
                      {format(new Date(date), "MMMM dd, yyyy")}
                    </h3>
                    <button
                      onClick={() =>
                        setShowOthers((prev) => ({
                          ...prev,
                          [date]: !prev[date],
                        }))
                      } // Toggle visibility
                      className="focus:outline-none"
                    >
                      {showOthers[date] ? (
                        <ChevronUp size={20} className="dark:text-[#2F76FF]" />
                      ) : (
                        <ChevronDown
                          size={20}
                          className="dark:text-[#2F76FF]"
                        />
                      )}
                    </button>
                  </div>
                  <div className="w-[92%] ml-auto border-b-2 border-[#79A6FF] pb-[6px] mb-[14px]" />

                  {showOthers[date] && (
                    <>
                      {groupedChats[date].map((chat) => (
                        <Link key={chat.chat_id} href={`/chat/${chat.chat_id}`}>
                          <div className="ml-[12px] m-[2px] pl-[10px] flex items-center hover:bg-black space-x-2 p-2 bg-opacity-10 dark:hover:bg-[rgba(30,42,94,0.12)] rounded-lg cursor-pointer">
                            <div>
                              <p className="text-sm text-gray-300 dark:text-[#435B8C] line-clamp-1 text-ellipsis">
                                {chat.firstMessage}
                              </p>
                              <p className="text-xs text-gray-500">
                                <span className="text-sm text-gray-400 dark:text-[#5676B5]">
                                  {chat.coach_type}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-400 p-4 dark:text-[#001c4f]">
            No chats available.
          </p>
        )}
      </ScrollArea>
    </div>
  );
}

export default function Sidebar({
  isSidebarOpen,
  supabase,
  handleExpertClick,
}: any) {
  const [activeExpert, setActiveExpert] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const { user } = useUser();
  const userMetadata = user?.publicMetadata as {
    paymentInfo?: { email: string; payment_id: string };
    planDetails?: {
      name: string;
      price: number;
      description: string;
      billingPeriod: string;
    };
    trialStatus?: { trialEnded: boolean; remainingDays: number };
  };
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const hasPaymentInfo = !!userMetadata?.paymentInfo;
  const hasPlanDetails = !!userMetadata?.planDetails;
  const isOnFreeTrial =
    userMetadata?.trialStatus && !userMetadata.trialStatus.trialEnded;

  const canAccessChatExperts = hasPaymentInfo && hasPlanDetails;

  const handleExpertButtonClick = (expert: string) => {
    if (canAccessChatExperts || isOnFreeTrial) {
      setShowPopup(false);
      setActiveExpert(expert);
      handleExpertClick(expert);
    } else {
      // setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleUnlock = () => {
    router.push("/home");
  };

  return (
    <div
      className={`${isSidebarOpen ? "block" : "hidden"} ${
        styles["no-margin-sidebar"]
      } md:block fixed md:relative z-20 w-64 h-[calc(100vh-78px)] md:h-[calc(100vh-82px)] bg-gray-900 transition-all duration-300 ease-in-out overflow-y-auto`}
    >
      <Button
        variant="ghost"
        className={`flex items-center dark:hover:bg-[rgba(30,42,94,0.12)] justify-center h-16 w-full dark:text-[#1E2A5E] 
    border-b border-gray-700 dark:border-b-[var(--c1,#2F76FF)] text-white 
    hover:bg-white hover:text-white hover:bg-opacity-10 hover:rounded-t-lg 
    ${
      activeExpert === "General"
        ? "rounded-t-lg bg-white bg-opacity-10 dark:bg-[rgba(30,42,94,0.12)]"
        : ""
    }`}
        onClick={() => handleExpertButtonClick("General")}
      >
        <Brain className="h-6 w-6 mr-2" />
        <span className="font-semibold common-text dark:text-[#1E2A5E] ">
          Artificial Intelligence
        </span>
      </Button>

      <div className="p-4 space-y-[8px]">
        <h3 className="text-sm text-start text-gray-400 mb-2 common-text font-normal dark:text-[#1E2A5E]">
          Select Your AI Partner
        </h3>
        {["Real Estate", "Sales", "Marketing", "Negotiation", "Motivation"].map(
          (expert) => (
            <Button
              key={expert}
              variant="ghost"
              className={`mx-auto dark:text-[#1E2A5E] w-full justify-start text-gray-300 
              hover:bg-white hover:text-white hover:bg-opacity-10 hover:rounded-lg 
              dark:hover:bg-[rgba(30,42,94,0.12)] pl-[22px]
              ${
                activeExpert === expert
                  ? "rounded-lg bg-white bg-opacity-10 dark:bg-[rgba(30,42,94,0.12)]"
                  : ""
              }`}
              onClick={() => handleExpertButtonClick(expert)}
            >
              {expert === "Real Estate" && <Home className="mr-2 h-4 w-4" />}
              {expert === "Sales" && <TrendingUp className="mr-2 h-4 w-4" />}
              {expert === "Marketing" && <Megaphone className="mr-2 h-4 w-4" />}
              {expert === "Negotiation" && (
                <Handshake className="mr-2 h-4 w-4" />
              )}
              {expert === "Motivation" && <Zap className="mr-2 h-4 w-4" />}
              AI {expert} Partner
            </Button>
          )
        )}
      </div>
      <AdminDashboardButton userEmail={userEmail} />
      <ChatHistory
        userId={user?.id}
        supabase={supabase}
        userEmail={userEmail}
      />
      <UnlockAccessDialog
        isOpen={showPopup}
        onClose={handlePopupClose}
        onUnlock={handleUnlock}
      />
    </div>
  );
}

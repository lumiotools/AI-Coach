import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";

export default function TrialEndPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-custom-gradient backdrop-blur-20 rounded-lg shadow-lg relative text-white border-gray-700">
        <CardHeader className="text-right">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>
        <CardContent className="text-center p-6">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-16 h-16 mx-auto text-red-500"
            >
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Your trial ends in 7 days</h2>
          <p className="text-gray-400 mb-6">
            Are you making use of your trial as best as possible? Don't forget
            to try out custom branding and blurring out sensitive information.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4 p-6">
          <Link href="/home/pricing">
            <Button variant="outline" className="rounded-md">
              SEE PLANS
            </Button>
          </Link>
          <a
            href="https://cal.com/lumiopartners/30min?date=2024-10-07&month=2024-10"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="rounded-md">
              BOOK A DEMO
            </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

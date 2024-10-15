'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

interface IntroductionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntroductionModal({ isOpen, onClose }: IntroductionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) onClose(); // Call onClose when the dialog is closing
      }}>
      <DialogContent className="w-full max-w-[90%] md:max-w-md mx-auto rounded-lg p-6 shadow-xl" style={{
        background: 'linear-gradient(293.27deg, rgba(0, 3, 98, 0.8) 0.61%, rgba(7, 50, 63, 0.8) 99.39%), rgba(25, 53, 93, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Welcome to AgentCoach.AI!</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-3 text-white">
          <p className="text-justify">
            Next, you’ll have the option to complete a brief questionnaire, which helps our bots gain insights into your current real estate business and goals, ensuring you receive the most personalized responses.
          </p>
          <p className="text-justify">
            Once you’ve submitted the questionnaire, you’ll enter our “General Coach” area. From there, you can select one of our pre-written questions or simply type or speak any general knowledge question or request in the search box. Our General AI will provide you with personalized advice right away!
          </p>
          <p className="text-justify">
            If you’re looking for more specialized help, explore the other sections: Real Estate, Sales, Marketing, Negotiation or Motivation, tailored to your needs.
          </p>
          <p className="font-semibold text-[#2f76ff] text-justify">
            The power of expert coaching is just a question away - the only limitation is your imagination!
          </p>
        </div>
        <DialogFooter>
          <Button 
            onClick={onClose}
            className="w-full mt-6 text-white bg-[#2f76ff] hover:bg-[#1e63e6] rounded-md"
          >
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
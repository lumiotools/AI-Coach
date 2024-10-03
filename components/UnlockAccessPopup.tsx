import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UnlockAccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export default function UnlockAccessDialog({
  isOpen,
  onClose,
  onUnlock,
}: UnlockAccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-t from-[rgba(121,166,255,0.16)] to-[rgba(47,118,255,0.16)] backdrop-blur-[20px] dark:bg-[#A5C3FF3D] space-y-2 py-4 border-gray-700">
        <DialogHeader className="">
          <DialogTitle className="text-2xl leading-none text-white">
            Unlock Exclusive Access
          </DialogTitle>
          <DialogDescription className="text-xs">
            Sign up to access this expert feature and elevate your skills!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-transparent hover:text-white rounded-md mt-4 sm:mt-0"
          >
            Skip for now
          </Button>
          <Button
            className="bg-[#2F76FF] dark:bg-white rounded-md"
            onClick={onUnlock}
          >
            Unlock Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

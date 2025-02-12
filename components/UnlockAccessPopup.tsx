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
      <DialogContent className="sm:max-w-[425px] bg-custom-gradient backdrop-blur-20 space-y-2 py-4 border-gray-700">
        <DialogHeader className="">
          <DialogTitle className="text-2xl leading-none text-white">
            Unlock Exclusive Access
          </DialogTitle>
          <DialogDescription className="text-xs">
            Upgrade to access this expert feature and elevate your skills!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
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

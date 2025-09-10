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
import { AlertTriangle } from "lucide-react";

export default function DeleteConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  campaignName 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-lg">Delete Campaign</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            Are you sure you want to delete "{campaignName}"? This action will permanently remove:
            <ul className="mt-2 ml-4 list-disc text-sm space-y-1">
              <li>The campaign and all its settings</li>
              <li>All generated marketing assets</li>
              <li>Social media captions</li>
              <li>AI-generated images</li>
              <li>Newsletter content</li>
              <li>Display ads</li>
              <li>Video ad content</li>
            </ul>
            <p className="mt-3 font-medium text-red-600">This action cannot be undone.</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
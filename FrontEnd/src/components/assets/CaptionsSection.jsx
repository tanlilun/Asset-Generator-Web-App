import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Edit3, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AssetSet } from "@/api/entities";

// Make sure keys and platform names are aligned
const PLATFORM_KEYS = ["facebook", "instagram", "linkedin", "twitter"];
const PLATFORM_NAMES = ["Facebook", "Instagram", "LinkedIn", "Twitter"];

export default function CaptionsSection({ captions, assetSetId }) {
  // State to track saving status
  const [isSaving, setIsSaving] = useState(false);

  // Convert captions object to array for rendering/editing
  const captionsArray = PLATFORM_KEYS.map((key) => captions[key] || "");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCaptions, setEditedCaptions] = useState(captionsArray);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Update editedCaptions if captions prop changes
  useEffect(() => {
    setEditedCaptions(PLATFORM_KEYS.map((key) => captions[key] || ""));
  }, [captions]);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleEdit = (index, newText) => {
    const updated = [...editedCaptions];
    updated[index] = newText;
    setEditedCaptions(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedCaptions = PLATFORM_KEYS.reduce((acc, key, i) => {
        acc[key] = editedCaptions[i];
        return acc;
      }, {});
  
      await AssetSet.update(assetSetId, {
        captions: updatedCaptions
      });
    } catch (error) {
      console.error("Error saving captions:", error);
    }
    setIsSaving(false);
  };
  

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Social Media Captions</h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
          <Badge variant="outline" className="text-purple-700 border-purple-200">
            {editedCaptions.length} Options
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {editedCaptions.map((caption, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          {PLATFORM_NAMES[index] || `Caption ${index + 1}`}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                          className="h-6 px-2"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>

                      {editingIndex === index ? (
                        <Textarea
                          value={caption}
                          onChange={(e) => handleEdit(index, e.target.value)}
                          onBlur={() => setEditingIndex(null)}
                          className="min-h-[100px] text-sm"
                          autoFocus
                        />
                      ) : (
                        <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                          {caption}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(caption, index)}
                      className="shrink-0"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

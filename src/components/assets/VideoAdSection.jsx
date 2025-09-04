
import React, { useState } from "react";
import { AssetSet } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Save, Play, Video } from "lucide-react";

export default function VideoAdSection({ videoAd, assetSetId }) {
  const [script, setScript] = useState(videoAd.script || "");
  const [overlayText, setOverlayText] = useState(videoAd.overlay_text || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await AssetSet.update(assetSetId, {
        video_ad: { script, overlay_text: overlayText, video_url: videoAd.video_url }
      });
    } catch (error) {
      console.error("Error saving video ad:", error);
    }
    setIsSaving(false);
  };

  const downloadScript = () => {
    const content = `
VIDEO AD SCRIPT
===============

Script:
${script}

Overlay Text:
${overlayText}

Duration: 15 seconds
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'video-ad-script.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Video className="w-5 h-5 text-purple-600" />
          Short Video Ad
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={downloadScript}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Script
          </Button>
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
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Video Script</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="script">15-Second Script</Label>
              <Textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter video script here..."
                rows={8}
                className="text-base"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Video Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="overlay">Overlay Text</Label>
              <Input
                id="overlay"
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                placeholder="Text to overlay on video"
                className="text-base"
              />
            </div>

            {/* Video Preview Placeholder */}
            <div className="space-y-2">
              <Label>Video Preview</Label>
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-200">
                <div className="text-center">
                  <Play className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-600 font-medium">Video Preview</p>
                  <p className="text-sm text-gray-500 mt-1">15-second video ad</p>
                  {overlayText && (
                    <div className="mt-4 px-4 py-2 bg-black/80 text-white text-sm rounded">
                      {overlayText}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

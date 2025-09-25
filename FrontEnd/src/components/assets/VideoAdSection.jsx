import React, { useState } from "react";
import { AssetSet } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Save, Play, Video } from "lucide-react";
import banklogo from "../img/UnionBank-logo.png";
import visalogo from "../img/VISA-logo.png";

export default function VideoAdSection({ assetSet, onUpdateAssetSet }) {
  const videoAd = assetSet.video_ad || {};
  const [overlayText, setOverlayText] = useState(videoAd.overlay_text || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedVideoAd = {
        ...videoAd,
        overlay_text: overlayText,
      };

      // Save to API
      await AssetSet.update(assetSet.id, {
        video_ad: updatedVideoAd,
      });

      // Notify parent with updated assetSet
      const updatedAssetSet = {
        ...assetSet,
        video_ad: updatedVideoAd,
      };
      if (onUpdateAssetSet) {
        onUpdateAssetSet(updatedAssetSet);
      }
    } catch (error) {
      console.error("Error saving video ad:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadVideo = async (URL, filename = "video-ad.mp4") => {
    if (!URL) {
      console.error("No video URL provided.");
      return;
    }
  
    try {
      const response = await fetch(URL);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const blob = await response.blob();
  
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
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
            onClick={downloadVideo}
            disabled={!videoAd.video_url}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Video
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

      <div className="max-w-2xl">
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

            {/* Video Preview */}
            <div className="space-y-2">
              <Label>Video Preview</Label>
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-200">
                <div className="text-center w-full h-full">
                  {videoAd.video_url ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <video
                        className="w-full h-full object-cover"
                        controls
                        poster=""
                      >
                        <source src={videoAd.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      {overlayText && (
                        <div className="absolute bottom-16 left-4 text-white font-extrabold text-3xl leading-tight drop-shadow-md uppercase z-10">
                          {overlayText}
                        </div>
                      )}

                      <div className="absolute bottom-4 right-4 flex items-center space-x-2 z-10">
                        <img src={visalogo} alt="VISA" className="h-6 md:h-8" />
                        <img
                          src={banklogo}
                          alt="Partner Logo"
                          className="h-6 md:h-8"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Play className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                      <p className="text-purple-600 font-medium">Video Preview</p>
                      <p className="text-sm text-gray-500 mt-1">
                        15-second video ad
                      </p>
                      {overlayText && (
                        <div className="mt-4 px-4 py-2 bg-black/80 text-white text-sm rounded">
                          {overlayText}
                        </div>
                      )}
                    </>
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

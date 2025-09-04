import React, { useState } from "react";
import { AssetSet } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Save, Monitor } from "lucide-react";

export default function AdBuilder({ ads, assetSetId, selectedImageUrl }) {
  const [adData, setAdData] = useState(ads);
  const [isSaving, setIsSaving] = useState(false);

  const adFormats = [
    { key: "leaderboard", name: "Leaderboard", size: "728x90" },
    { key: "billboard", name: "Billboard", size: "970x250" },
    { key: "halfpage", name: "Half Page", size: "300x600" }
  ];

  const handleAdUpdate = (adType, field, value) => {
    setAdData(prev => ({
      ...prev,
      [adType]: {
        ...prev[adType],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await AssetSet.update(assetSetId, { ads: adData });
    } catch (error) {
      console.error("Error saving ads:", error);
    }
    setIsSaving(false);
  };

  const downloadAdPreview = (adType, format) => {
    const ad = adData[adType];
    if (!ad) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const dimensions = {
      leaderboard: [728, 90],
      billboard: [970, 250], 
      halfpage: [300, 600]
    };
    [canvas.width, canvas.height] = dimensions[adType];

    const drawAd = (image) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (adType === 'halfpage') { // Vertical layout
        ctx.fillStyle = '#212529';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(ad.headline || 'Headline', canvas.width / 2, 40);
        
        if (image) {
          const imgHeight = (canvas.width / image.width) * image.height;
          ctx.drawImage(image, 0, 60, canvas.width, imgHeight);
        }

        ctx.font = '16px Arial';
        ctx.fillText(ad.body || 'Body text', canvas.width / 2, 380);

        ctx.fillStyle = '#6d28d9';
        ctx.fillRect(50, canvas.height - 70, canvas.width - 100, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(ad.cta || 'CTA', canvas.width / 2, canvas.height - 45);

      } else { // Horizontal layout
        if (image) {
            const imgWidth = (canvas.height / image.height) * image.width;
            ctx.drawImage(image, 0, 0, Math.min(imgWidth, canvas.width * 0.4), canvas.height);
        }
        
        const textX = canvas.width * 0.45;
        ctx.fillStyle = '#212529';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(ad.headline || 'Headline', textX, canvas.height * 0.3);

        ctx.font = '14px Arial';
        ctx.fillText(ad.body || 'Body text', textX, canvas.height * 0.5);

        ctx.fillStyle = '#6d28d9';
        ctx.fillRect(textX, canvas.height * 0.65, 150, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(ad.cta || 'CTA', textX + 75, canvas.height * 0.65 + 20);
      }

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${adType}-ad-${format.size}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    };
    
    if (selectedImageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => drawAd(img);
        img.onerror = () => drawAd(null);
        img.src = selectedImageUrl;
    } else {
        drawAd(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-purple-600" />
          Display Ads
        </h3>
        <Button onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white">
          {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save All</>}
        </Button>
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-4">
        <TabsList className="grid grid-cols-3 bg-white shadow-sm">
          {adFormats.map((format) => (
            <TabsTrigger key={format.key} value={format.key} className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <div className="text-center"><div className="font-medium">{format.name}</div><div className="text-xs text-gray-500">{format.size}</div></div>
            </TabsTrigger>
          ))}
        </TabsList>

        {adFormats.map((format) => (
          <TabsContent key={format.key} value={format.key} className="mt-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div><span>{format.name} Ad</span><span className="text-sm font-normal text-gray-500 ml-2">({format.size})</span></div>
                  <Button variant="outline" onClick={() => downloadAdPreview(format.key, format)}><Download className="w-4 h-4 mr-2" />Download</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                     <div className="space-y-2"><Label htmlFor={`${format.key}-headline`}>Headline</Label><Input id={`${format.key}-headline`} value={adData[format.key]?.headline || ""} onChange={(e) => handleAdUpdate(format.key, 'headline', e.target.value)} placeholder="Enter compelling headline"/></div>
                     <div className="space-y-2"><Label htmlFor={`${format.key}-body`}>Body Text</Label><Input id={`${format.key}-body`} value={adData[format.key]?.body || ""} onChange={(e) => handleAdUpdate(format.key, 'body', e.target.value)} placeholder="Enter body text"/></div>
                     <div className="space-y-2"><Label htmlFor={`${format.key}-cta`}>Call to Action</Label><Input id={`${format.key}-cta`} value={adData[format.key]?.cta || ""} onChange={(e) => handleAdUpdate(format.key, 'cta', e.target.value)} placeholder="Enter CTA button text"/></div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
                    <p className="text-sm font-medium text-gray-700 mb-2 sr-only">Preview:</p>
                    <div className="bg-white border-2 border-dashed border-gray-300 w-full overflow-hidden" style={{ aspectRatio: format.size.replace('x', '/') }}>
                      {format.key === 'halfpage' ? ( // Vertical
                        <div className="flex flex-col items-center justify-around h-full p-2">
                          <div className="text-lg font-bold text-gray-800 text-center">{adData[format.key]?.headline || 'Headline'}</div>
                          {selectedImageUrl && <img src={selectedImageUrl} className="max-h-[40%] w-auto my-2" alt="ad preview"/>}
                          <div className="text-sm text-gray-600 text-center">{adData[format.key]?.body || 'Body Text'}</div>
                          <div className="mt-2 px-4 py-1 bg-purple-600 text-white text-sm rounded">{adData[format.key]?.cta || 'CTA'}</div>
                        </div>
                      ) : ( // Horizontal
                        <div className="flex items-center h-full w-full">
                          <div className="w-2/5 h-full flex-shrink-0">{selectedImageUrl && <img src={selectedImageUrl} className="w-full h-full object-cover" alt="ad preview"/>}</div>
                          <div className="w-3/5 flex flex-col justify-center p-2">
                            <div className="text-md font-bold text-gray-800">{adData[format.key]?.headline || 'Headline'}</div>
                            <div className="text-xs text-gray-600 mt-1">{adData[format.key]?.body || 'Body Text'}</div>
                            <div className="mt-2 px-2 py-1 bg-purple-600 text-white text-xs rounded self-start">{adData[format.key]?.cta || 'CTA'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
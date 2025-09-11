import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Monitor } from "lucide-react";

export default function AdBuilder({ ads }) {
  const adFormats = [
    {
      key: "leaderboard",
      name: "Leaderboard",
      size: "728x90",
      images: [
        ads?.leaderboard?.leaderBoard1,
        ads?.leaderboard?.leaderBoard2,
        ads?.leaderboard?.leaderBoard3,
      ],
    },
    {
      key: "billboard",
      name: "Billboard",
      size: "970x250",
      images: [
        ads?.billboard?.billBoard1,
        ads?.billboard?.billBoard2,
        ads?.billboard?.billBoard3,
      ],
    },
    {
      key: "halfpage",
      name: "Half Page",
      size: "300x600",
      images: [
        ads?.halfpage?.halfPage1,
        ads?.halfpage?.halfPage2,
        ads?.halfpage?.halfPage3,
      ],
    },
  ];
  
  const downloadAdPreview = (imageUrl, adType, index, format) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const dimensions = {
      leaderboard: [728, 90],
      billboard: [970, 250],
      halfpage: [300, 600],
    };
    [canvas.width, canvas.height] = dimensions[adType];

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;

      const ratio = img.width / img.height;
      const targetRatio = canvas.width / canvas.height;

      if (ratio > targetRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * ratio;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / ratio;
      }

      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${adType}-ad-${index + 1}-${format.size}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    };
    img.onerror = () => {
      console.error("Failed to load image:", imageUrl);
    };
    img.src = imageUrl;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-purple-600" />
          Display Ads
        </h3>
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-4">
        <TabsList className="grid grid-cols-3 bg-white shadow-sm">
          {adFormats.map((format) => (
            <TabsTrigger
              key={format.key}
              value={format.key}
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
            >
              <div className="text-center">
                <div className="font-medium">{format.name}</div>
                <div className="text-xs text-gray-500">{format.size}</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {adFormats.map((format) => (
          <TabsContent key={format.key} value={format.key} className="space-y-4">
            {format.images.map((imageUrl, index) => (
              <Card key={index} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div>
                      <span>{format.name} {index + 1}</span>
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        ({format.size})
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => downloadAdPreview(imageUrl, format.key, index, format)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div
                      className="bg-white border-2 border-dashed border-gray-300 w-full max-w-3xl overflow-hidden"
                      style={{ aspectRatio: format.size.replace("x", "/") }}
                    >
                      <img
                        src={imageUrl}
                        alt={`${format.name} preview ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

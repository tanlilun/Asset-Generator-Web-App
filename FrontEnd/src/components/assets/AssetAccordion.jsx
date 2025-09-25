import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Image as ImageIcon,
  FileText,
  Mail,
  Monitor,
  Video
} from "lucide-react";

import SocialMediaPostSection from "./SocialMediaPostSection";
import NewsletterEditor from "./NewsletterEditor";
import AdBuilder from "./AdBuilder";
import VideoAdSection from "./VideoAdSection";

export default function AssetAccordion({ assetSet, onUpdateAssetSet  }) {
  const [activeTab, setActiveTab] = useState("social");

  const tabs = [
    { id: "social", label: "Social Posts", icon: ImageIcon },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "ads", label: "Display Ads", icon: Monitor },
    { id: "video", label: "Video Ad", icon: Video }
  ];

  return (
    <div className="border-t border-gray-100 bg-gray-50/50 p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 bg-white shadow-sm h-auto sm:h-12">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 py-2 sm:py-0"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="social" className="mt-6">
            <SocialMediaPostSection 
              assetSet={assetSet} 
              onUpdateAssetSet={onUpdateAssetSet}
            />
        </TabsContent>

        <TabsContent value="newsletter" className="mt-6">
          <NewsletterEditor 
            assetSet={assetSet} 
            onUpdateAssetSet={onUpdateAssetSet}
          />
        </TabsContent>

        <TabsContent value="ads" className="mt-6">
          <AdBuilder 
            assetSet={assetSet} 
            onUpdateAssetSet={onUpdateAssetSet}
          />
        </TabsContent>

        <TabsContent value="video" className="mt-6">
          <VideoAdSection 
            assetSet={assetSet} 
            onUpdateAssetSet={onUpdateAssetSet}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
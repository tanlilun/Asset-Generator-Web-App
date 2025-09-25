import React, { useState, useEffect } from "react";
import { AssetSet } from "@/api/entities";
import { User } from "@/api/entities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Linkedin, Instagram, Download, Copy, Check, Save } from "lucide-react";
import FacebookPreview from "./previews/FacebookPreview";
import LinkedInPreview from "./previews/LinkedInPreview";
import InstagramPreview from "./previews/InstagramPreview";

export default function SocialMediaPostSection({ assetSet, onUpdateAssetSet }) {
  const [user, setUser] = useState(null);

  const selectedImage = assetSet.images?.find(img => img.selected);
  const selectedImageUrl = selectedImage?.url || "";

  const [captions, setCaptions] = useState({
    facebook: assetSet.captions?.facebook || "",
    linkedin: assetSet.captions?.linkedin || "",
    instagram: assetSet.captions?.instagram || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(null);

  const useDummyUser = true;
  const dummyUser = {
    full_name: "Vince Lui",
    email: "vince.lui@facultydigital.com",
  };

  React.useEffect(() => {
    const loadUser = async () => {
      if (useDummyUser) {
        setUser(dummyUser);
      } else {
        try {
          const currentUser = await User.me();
          setUser(currentUser);
        } catch (error) {
          console.log("User not authenticated");
        }
      }
    };
    loadUser();
  }, []);

  const handleCaptionChange = (platform, value) => {
    setCaptions(prev => ({ ...prev, [platform]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Construct updated asset set
      const updatedAssetSet = {
        ...assetSet,
        captions: {
          facebook: captions.facebook,
          linkedin: captions.linkedin,
          instagram: captions.instagram,
        },
      };
  
      // Save to backend
      await AssetSet.update(assetSet.id, updatedAssetSet);
  
      // Notify parent with the updated version
      onUpdateAssetSet(updatedAssetSet);
    } catch (error) {
      console.error("Failed to save captions", error);
    } finally {
      setIsSaving(false);
    }
  };  
  
  const handleCopy = (text, platform) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = async (url, filename) => {
     if (!url) return;
    try {
      const response = await fetch(url);
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
  
  const platformTabs = [
    { name: "Facebook", icon: Facebook, value: "facebook" },
    { name: "LinkedIn", icon: Linkedin, value: "linkedin" },
    { name: "Instagram", icon: Instagram, value: "instagram" },
  ];

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Social Media Posts</h3>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save</>}
            </Button>
        </div>
      <Tabs defaultValue="facebook" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {platformTabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              <tab.icon className="w-4 h-4" /> {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="facebook">
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div>
              <Textarea value={captions.facebook} onChange={e => handleCaptionChange('facebook', e.target.value)} className="h-32 mb-4" />
              <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                    <img src={selectedImageUrl} alt="Preview" className="w-12 h-12 rounded object-cover" />
                    <span className="text-sm font-medium text-gray-700">Campaign Image</span>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(captions.facebook, 'facebook')}>{copied === 'facebook' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(selectedImageUrl, "facebook-image.png")}><Download className="w-4 h-4" /></Button>
                 </div>
              </div>
            </div>
            <FacebookPreview user={user} caption={captions.facebook} imageUrl={selectedImageUrl} />
          </div>
        </TabsContent>

        <TabsContent value="linkedin">
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div>
              <Textarea value={captions.linkedin} onChange={e => handleCaptionChange('linkedin', e.target.value)} className="h-32 mb-4" />
               <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                    <img src={selectedImageUrl} alt="Preview" className="w-12 h-12 rounded object-cover" />
                    <span className="text-sm font-medium text-gray-700">Campaign Image</span>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(captions.linkedin, 'linkedin')}>{copied === 'linkedin' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(selectedImageUrl, "linkedin-image.png")}><Download className="w-4 h-4" /></Button>
                 </div>
              </div>
            </div>
            <LinkedInPreview user={user} caption={captions.linkedin} imageUrl={selectedImageUrl} />
          </div>
        </TabsContent>

        <TabsContent value="instagram">
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div>
              <Textarea value={captions.instagram} onChange={e => handleCaptionChange('instagram', e.target.value)} className="h-32 mb-4" />
              <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                    <video src={assetSet.video_ad?.video_url} className="w-12 h-12 rounded object-cover bg-black" />
                    <span className="text-sm font-medium text-gray-700">Campaign Video</span>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(captions.instagram, 'instagram')}>{copied === 'instagram' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(assetSet.video_ad?.video_url, "instagram-video.mp4")}><Download className="w-4 h-4" /></Button>
                 </div>
              </div>
            </div>
            <InstagramPreview user={user} caption={captions.instagram} videoUrl={assetSet.video_ad?.video_url} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
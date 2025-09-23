
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Campaign, AssetSet } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  X, 
  TrendingUp, 
  Zap,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

const BANK_PRODUCT = [
  "Credit Card",
  "Financial Insurance",
  "Personal Loan", 
  "Savings Account"
];

const AUDIENCE_OPTIONS = [
  "Students (18-24 years old)",
  "Young Professionals (25-35 years old)", 
  "Travel Enthusiasts",
  "Empty Nesters"
];

const CAMPAIGN_THEMES = [
  "Family",
  "Travel Rewards",
  "Dining Experience", 
  "Retail & Entertainment"
];

export default function Generate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bank_product: "",
    target_audience: "",
    theme: "",
    description: ""
  });  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");

  async function generateAssets() {
    if (!formData.name || !formData.theme || !formData.target_audience) {
      return;
    }
  
    setIsGenerating(true);
    setGenerationStep("Creating campaign...");
  
    try {
      // 1. Create campaign (starts generation)
      const campaign = await Campaign.create({
        name: formData.name,
        bank_product: formData.bank_product,
        theme: formData.theme,
        target_audience: formData.target_audience,
        description: formData.description,
        captions_status: "pending",
        newsletter_status: "pending",
        images_status: "pending",
        // ads_status: "pending",
        ads_leaderboard_1_status: "pending",
        ads_leaderboard_2_status: "pending",
        ads_leaderboard_3_status: "pending",
        ads_billboard_1_status: "pending",
        ads_billboard_2_status: "pending",
        ads_billboard_3_status: "pending",
        ads_half_page_1_status: "pending",
        ads_half_page_2_status: "pending",
        ads_half_page_3_status: "pending",
        video_status: "pending",
        status: "generating"
      });
  
      // 2. Generate captions
      setGenerationStep("Generating social media captions...");
      await Campaign.update(campaign.id, { captions_status: "generating" });
      // Backend generates captions asynchronously or synchronously
      await waitForStatus(campaign.id, "captions_status", "completed");
      setGenerationStep("Social media captions generated.");
  
      // 3. Generate newsletter content
      setGenerationStep("Creating newsletter content...");
      await Campaign.update(campaign.id, { newsletter_status: "generating" });
      await waitForStatus(campaign.id, "newsletter_status", "completed");
      setGenerationStep("Newsletter content created.");
  
      // 4. Generate images
      setGenerationStep("Generating relevant image...");
      await Campaign.update(campaign.id, { images_status: "generating" });
      await waitForStatus(campaign.id, "images_status", "completed");
      setGenerationStep("Images generated.");
  
      // 5. Generate ads copy
      setGenerationStep("Creating Ad Banners...");
      // await Campaign.update(campaign.id, { ads_status: "generating" });
      await Campaign.update(campaign.id, {
        ads_leaderboard_1_status: "generating",
        ads_leaderboard_2_status: "generating",
        ads_leaderboard_3_status: "generating",
        ads_billboard_1_status: "generating",
        ads_billboard_2_status: "generating",
        ads_billboard_3_status: "generating",
        ads_half_page_1_status: "generating",
        ads_half_page_2_status: "generating",
        ads_half_page_3_status: "generating"
      });

      const adFields = [
        "ads_leaderboard_1_status",
        "ads_leaderboard_2_status",
        "ads_leaderboard_3_status",
        "ads_billboard_1_status",
        "ads_billboard_2_status",
        "ads_billboard_3_status",
        "ads_half_page_1_status",
        "ads_half_page_2_status",
        "ads_half_page_3_status"
      ];
      
      for (let field of adFields) {
        await waitForStatus(campaign.id, field, "completed");
      }
      // await waitForStatus(campaign.id, "ads_status", "completed");
      setGenerationStep("Ad Banners ready.");
  
      // 6. Generate video script
      setGenerationStep("Creating short video...");
      await Campaign.update(campaign.id, { video_status: "generating" });
      await waitForStatus(campaign.id, "video_status", "completed");
      setGenerationStep("Short video created.");
  
      // 7. Mark campaign complete
      await Campaign.update(campaign.id, { status: "completed" });
      setGenerationStep("All assets generated!");
  
      // 8. Fetch all assets
      const assets = await AssetSet.getByCampaignId(campaign.id);
  
      // 9. Navigate to assets page
      navigate(createPageUrl("Assets"));
  
    } catch (error) {
      console.error("Error generating assets:", error);
      setGenerationStep(error.message || "Error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }
  
  // Helper function to poll a specific status field until it matches expected value or timeout
  function waitForStatus(campaignId, statusField, expectedStatus, timeout = 120000, interval = 2000) {
    const startTime = Date.now();
  
    return new Promise((resolve, reject) => {
      const timer = setInterval(async () => {
        try {
          const campaign = await Campaign.getById(campaignId);
          if (campaign[statusField] === expectedStatus) {
            clearInterval(timer);
            resolve();
          } else if (campaign[statusField] === "error") {
            clearInterval(timer);
            reject(new Error(`Error in ${statusField.replace('_status', '')} generation.`));
          } else if (Date.now() - startTime > timeout) {
            clearInterval(timer);
            reject(new Error(`${statusField.replace('_status', '')} generation timed out.`));
          }
          // else keep polling
        } catch (err) {
          clearInterval(timer);
          reject(err);
        }
      }, interval);
    });
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Home"))}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
              Generate Marketing Assets
            </h1>
            <p className="text-gray-600 mt-2">Create a complete set of AI-powered marketing materials</p>
          </div>
        </div>

        {!isGenerating ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campaign Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">Campaign Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your campaign name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-12 text-base"
                    />
                  </div>

                  {/* Bank Product */}
                  <div className="space-y-2">
                    <Label htmlFor="bank_product" className="text-base font-medium">Bank Product</Label>
                    <Select
                      value={formData.bank_product}
                      onValueChange={(value) => setFormData({ ...formData, bank_product: value })}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Choose a bank product" />
                      </SelectTrigger>
                      <SelectContent>
                        {BANK_PRODUCT.map((product) => (
                          <SelectItem key={product} value={product}>
                            {product}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-base font-medium">Target Audience</Label>
                    <Select
                      value={formData.target_audience}
                      onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {AUDIENCE_OPTIONS.map((audience) => (
                          <SelectItem key={audience} value={audience}>
                            {audience}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campaign Theme */}
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="text-base font-medium">Campaign Theme</Label>
                    <Select
                      value={formData.theme}
                      onValueChange={(value) => setFormData({...formData, theme: value})}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Choose a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAMPAIGN_THEMES.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">Additional Context (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add any specific requirements, brand guidelines, or additional context for better asset generation..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="h-24 text-base"
                  />
                </div>

                <div className="pt-6">
                  <Button
                    onClick={generateAssets}
                    disabled={!formData.name || !formData.theme || formData.target_audience.length === 0}
                    className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    Generate Complete Asset Set
                    <TrendingUp className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Card className="w-full max-w-md border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Assets</h3>
                <p className="text-gray-600 mb-4">{generationStep}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full w-3/4 transition-all duration-300"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4">This may take 30-60 seconds</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

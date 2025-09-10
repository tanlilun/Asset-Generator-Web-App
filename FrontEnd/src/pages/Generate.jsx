
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Campaign, AssetSet } from "@/api/entities";
import { InvokeLLM, GenerateImage } from "@/api/integrations";
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

const CAMPAIGN_THEMES = [
  "Summer Sale",
  "Black Friday",
  "Product Launch", 
  "Brand Awareness",
  "Holiday Special",
  "Back to School",
  "Spring Collection",
  "Customer Appreciation",
  "Limited Time Offer",
  "New Year Campaign"
];

const AUDIENCE_OPTIONS = [
  "Young Adults (18-35)",
  "Professionals (25-45)", 
  "Parents",
  "Students",
  "Seniors (55+)",
  "Tech Enthusiasts",
  "Fashion Lovers",
  "Fitness Enthusiasts",
  "Business Owners",
  "Budget-Conscious Shoppers"
];

export default function Generate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    theme: "",
    target_audience: [],
    description: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");

  const handleAudienceToggle = (audience) => {
    setFormData(prev => ({
      ...prev,
      target_audience: prev.target_audience.includes(audience)
        ? prev.target_audience.filter(a => a !== audience)
        : [...prev.target_audience, audience]
    }));
  };

  const generateAssets = async () => {
    if (!formData.name || !formData.theme || formData.target_audience.length === 0) {
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create campaign
      setGenerationStep("Creating campaign...");
      const campaign = await Campaign.create({
        name: formData.name,
        theme: formData.theme,
        target_audience: formData.target_audience,
        status: "generating"
      });

      // Generate captions
      setGenerationStep("Generating social media captions...");
      const captionsResult = await InvokeLLM({
        prompt: `Create 5 engaging social media captions for a ${formData.theme} campaign targeting ${formData.target_audience.join(', ')}. Campaign: ${formData.name}. ${formData.description ? `Additional context: ${formData.description}` : ''}`,
        response_json_schema: {
          type: "object",
          properties: {
            captions: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      // Generate newsletter content
      setGenerationStep("Creating newsletter content...");
      const newsletterResult = await InvokeLLM({
        prompt: `Create a newsletter for a ${formData.theme} campaign targeting ${formData.target_audience.join(', ')}. Campaign: ${formData.name}. Include subject line and HTML body.`,
        response_json_schema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            body: { type: "string" }
          }
        }
      });

      // Generate ad copy
      setGenerationStep("Writing ad copy...");
      const adsResult = await InvokeLLM({
        prompt: `Create display ad copy for different sizes for a ${formData.theme} campaign targeting ${formData.target_audience.join(', ')}. Include headline, body text, and CTA for each size.`,
        response_json_schema: {
          type: "object",
          properties: {
            leaderboard: {
              type: "object",
              properties: {
                headline: { type: "string" },
                body: { type: "string" },
                cta: { type: "string" }
              }
            },
            billboard: {
              type: "object", 
              properties: {
                headline: { type: "string" },
                body: { type: "string" },
                cta: { type: "string" }
              }
            },
            halfpage: {
              type: "object",
              properties: {
                headline: { type: "string" },
                body: { type: "string" },
                cta: { type: "string" }
              }
            }
          }
        }
      });

      // Generate video script
      setGenerationStep("Creating video script...");
      const videoResult = await InvokeLLM({
        prompt: `Create a 15-second video ad script for a ${formData.theme} campaign targeting ${formData.target_audience.join(', ')}. Include script and overlay text.`,
        response_json_schema: {
          type: "object",
          properties: {
            script: { type: "string" },
            overlay_text: { type: "string" }
          }
        }
      });

      // Generate images
      setGenerationStep("Generating AI images...");
      const imagePrompts = [
        `${formData.theme} marketing campaign, professional, modern, ${formData.target_audience.join(' ')}, high quality`,
        `${formData.theme} advertising visual, creative, eye-catching, ${formData.target_audience.join(' ')}, vibrant colors`,
        `${formData.theme} promotional image, sleek design, contemporary, ${formData.target_audience.join(' ')}, premium look`,
        `${formData.theme} marketing banner, dynamic, engaging, ${formData.target_audience.join(' ')}, bold typography`
      ];

      const imagePromises = imagePrompts.map(async (prompt, index) => {
        setGenerationStep(`Generating image ${index + 1} of 4...`);
        const result = await GenerateImage({ prompt });
        return {
          url: result.url,
          prompt: prompt,
          selected: index === 0
        };
      });

      const images = await Promise.all(imagePromises);

      // Save asset set
      setGenerationStep("Saving your assets...");
      await AssetSet.create({
        campaign_id: campaign.id,
        captions: captionsResult.captions || [],
        images: images,
        newsletter: newsletterResult,
        ads: adsResult,
        video_ad: videoResult
      });

      // Update campaign status
      await Campaign.update(campaign.id, { status: "completed" });

      // Navigate to assets page
      navigate(createPageUrl("Assets"));
    } catch (error) {
      console.error("Error generating assets:", error);
      setGenerationStep("Error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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

                <div className="space-y-3">
                  <Label className="text-base font-medium">Target Audience</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {AUDIENCE_OPTIONS.map((audience) => (
                      <Badge
                        key={audience}
                        variant={formData.target_audience.includes(audience) ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-200 justify-center py-2 px-3 ${
                          formData.target_audience.includes(audience)
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'hover:bg-purple-50 hover:border-purple-300'
                        }`}
                        onClick={() => handleAudienceToggle(audience)}
                      >
                        {audience}
                        {formData.target_audience.includes(audience) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {formData.target_audience.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Selected {formData.target_audience.length} audience segment{formData.target_audience.length > 1 ? 's' : ''}
                    </p>
                  )}
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

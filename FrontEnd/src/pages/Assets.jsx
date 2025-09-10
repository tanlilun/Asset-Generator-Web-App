import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Campaign, AssetSet } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Calendar,
  Target,
  Sparkles,
  Filter,
  Trash2,
  X
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import AssetAccordion from "../components/assets/AssetAccordion";
import DeleteConfirmationDialog from "../components/assets/DeleteConfirmationDialog";

export default function Assets() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [assetSets, setAssetSets] = useState({}); 
  const [selectedImages, setSelectedImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openAccordions, setOpenAccordions] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, campaign: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [campaignData, assetData] = await Promise.all([
        Campaign.list('-created_date'),
        AssetSet.list('-created_date')
      ]);
      setCampaigns(campaignData);
      
      const assetsMap = assetData.reduce((acc, asset) => {
        acc[asset.campaign_id] = asset;
        return acc;
      }, {});
      setAssetSets(assetsMap);

      const initialSelectedImages = assetData.reduce((acc, asset) => {
        const selected = asset.images?.find(img => img.selected);
        if (selected) {
          acc[asset.id] = selected.url;
        }
        return acc;
      }, {});
      setSelectedImages(initialSelectedImages);

    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleSelectImage = async (assetSetId, imageIndex) => {
    const assetSet = Object.values(assetSets).find(asset => asset.id === assetSetId);
    if (!assetSet) return;
    
    const imageUrl = assetSet.images[imageIndex].url;
    setSelectedImages(prev => ({ ...prev, [assetSetId]: imageUrl }));

    const updatedImages = assetSet.images.map((img, i) => ({
      ...img,
      selected: i === imageIndex
    }));
    await AssetSet.update(assetSetId, { images: updatedImages });
  };

  const handleDeleteCampaign = async (campaign) => {
    try {
      // Delete associated asset set first
      const assetSet = assetSets[campaign.id];
      if (assetSet) {
        await AssetSet.delete(assetSet.id);
      }
      
      // Delete the campaign
      await Campaign.delete(campaign.id);
      
      // Update local state
      setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
      setAssetSets(prev => {
        const updated = { ...prev };
        delete updated[campaign.id];
        return updated;
      });
      setSelectedImages(prev => {
        const updated = { ...prev };
        if (assetSet) {
          delete updated[assetSet.id];
        }
        return updated;
      });
      
      setDeleteDialog({ isOpen: false, campaign: null });
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };
  
  const toggleAccordion = (campaignId) => {
    setOpenAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDateFilter("");
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = !searchQuery || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.theme.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = !dateFilter || 
      format(new Date(campaign.created_date), 'yyyy-MM-dd') === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-4">
            Your Marketing Assets
          </h1>
          <p className="text-gray-600 text-lg">Manage and download your generated marketing materials</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-gray-200/60"
              />
            </div>
            <Button 
              variant="outline" 
              className="gap-2 h-12"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/60 p-4"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="date-filter" className="text-sm font-medium mb-2 block">
                      Filter by Date
                    </Label>
                    <Input
                      id="date-filter"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFilters}
                      disabled={!searchQuery && !dateFilter}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                
                {(searchQuery || dateFilter) && (
                  <div className="mt-3 pt-3 border-t border-gray-200/60">
                    <p className="text-sm text-gray-600">
                      {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
                      {searchQuery && ` matching "${searchQuery}"`}
                      {dateFilter && ` from ${format(new Date(dateFilter), 'MMM d, yyyy')}`}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredCampaigns.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {campaigns.length === 0 ? "No campaigns yet" : "No campaigns match your filters"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {campaigns.length === 0 
                    ? "Start by generating your first marketing asset set"
                    : "Try adjusting your search or date filters"
                  }
                </p>
                {campaigns.length === 0 && (
                  <Button 
                    onClick={() => navigate(createPageUrl("Generate"))}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Assets
                  </Button>
                )}
              </motion.div>
            ) : (
              filteredCampaigns.map((campaign) => {
                const assetSet = assetSets[campaign.id];
                const isOpen = openAccordions.has(campaign.id);
                
                return (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Collapsible open={isOpen} onOpenChange={() => toggleAccordion(campaign.id)}>
                      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-gray-50/80 transition-colors duration-200 p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                                  <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-xl text-gray-900 mb-2">{campaign.name}</CardTitle>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                      {campaign.theme}
                                    </Badge>
                                    <Badge variant="outline" className="text-gray-600">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {format(new Date(campaign.created_date), 'MMM d, yyyy')}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {campaign.target_audience?.map((audience, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        <Target className="w-2 h-2 mr-1" />
                                        {audience}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteDialog({ isOpen: true, campaign });
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="text-gray-400">
                                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {assetSet && (
                            <AssetAccordion 
                              assetSet={assetSet} 
                              campaign={campaign} 
                              selectedImageUrl={selectedImages[assetSet.id]}
                              onSelectImage={(imageIndex) => handleSelectImage(assetSet.id, imageIndex)}
                            />
                          )}
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        <DeleteConfirmationDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, campaign: null })}
          onConfirm={() => handleDeleteCampaign(deleteDialog.campaign)}
          campaignName={deleteDialog.campaign?.name}
        />
      </div>
    </div>
  );
}
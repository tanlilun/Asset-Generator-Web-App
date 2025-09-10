import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Check, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ImageGenerator({ images, onSelectImage }) {
  const selectedImageIndex = images.findIndex(img => img.selected);

  const handleDownload = async () => {
    const image = images[selectedImageIndex];
    if (!image?.url) return;

    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campaign-image-${selectedImageIndex + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">AI Generated Images</h3>
        <Badge variant="outline" className="text-purple-700 border-purple-200">
          {images.length} Options
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedImageIndex === index 
                  ? 'ring-2 ring-purple-500 shadow-lg bg-purple-50' 
                  : 'hover:shadow-lg bg-white'
              }`}
              onClick={() => onSelectImage(index)}
            >
              <CardContent className="p-4">
                <div className="aspect-video relative rounded-lg overflow-hidden mb-3 bg-gray-100">
                  {image.url ? (
                    <img 
                      src={image.url} 
                      alt={`Generated option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {selectedImageIndex === index && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Option {index + 1}
                  </span>
                  {selectedImageIndex === index && (
                    <Badge className="bg-purple-600 text-white">Selected</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleDownload}
          disabled={!images[selectedImageIndex]?.url}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Selected Image
        </Button>
      </div>
    </div>
  );
}
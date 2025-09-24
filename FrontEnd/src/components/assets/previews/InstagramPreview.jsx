import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

export default function InstagramPreview({ user, caption, videoUrl }) {
  const userName = user?.full_name?.split(' ')[0].toLowerCase() || "yourusername";
  const userInitials = (user?.full_name || "Y").charAt(0);

  return (
    <div className="bg-white border rounded-xl w-full max-w-[340px] mx-auto overflow-hidden font-sans">
        <div className="flex items-center p-3">
            <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white text-xs">{userInitials}</AvatarFallback>
            </Avatar>
            <p className="font-bold text-sm ml-3">{userName}</p>
            <MoreHorizontal className="w-5 h-5 text-gray-800 ml-auto" />
        </div>
        
        <div className="w-full aspect-square bg-black flex items-center justify-center">
            {videoUrl ? (
                <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover"></video>
            ) : (
                <p className="text-white">Video preview</p>
            )}
        </div>

        <div className="p-3">
            <div className="flex items-center">
                <Heart className="w-6 h-6 mr-3 hover:text-gray-500 transition-colors cursor-pointer" />
                <MessageCircle className="w-6 h-6 mr-3 hover:text-gray-500 transition-colors cursor-pointer" />
                <Send className="w-6 h-6 mr-3 hover:text-gray-500 transition-colors cursor-pointer" />
                <Bookmark className="w-6 h-6 ml-auto hover:text-gray-500 transition-colors cursor-pointer" />
            </div>

            <p className="text-sm font-bold mt-2">1 like</p>

            <p className="text-sm mt-1">
                <span className="font-bold">{userName}</span>
                <span className="ml-1 whitespace-pre-wrap">{caption}</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">View all 1 comments</p>
        </div>
    </div>
  );
}
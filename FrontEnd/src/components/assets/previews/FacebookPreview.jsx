import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const ActionButton = ({ icon: Icon, label }) => (
  <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors">
    <Icon className="w-5 h-5" />
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

export default function FacebookPreview({ user, caption, imageUrl }) {
  const userName = user?.full_name || "Your Name";
  const userInitials = userName.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 font-sans w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gray-300 text-gray-700">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500">Just now · 🌎</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </div>
      <p className="text-gray-800 text-[15px] mb-3 whitespace-pre-wrap">{caption}</p>
      {imageUrl && <img src={imageUrl} alt="Post content" className="w-full rounded-lg border" />}
      <div className="flex justify-between text-sm text-gray-500 py-2 mt-2">
        <span>1 Like</span>
        <span>1 Comment</span>
      </div>
      <div className="border-t my-1"></div>
      <div className="flex justify-around">
        <ActionButton icon={ThumbsUp} label="Like" />
        <ActionButton icon={MessageCircle} label="Comment" />
        <ActionButton icon={Share2} label="Share" />
      </div>
    </div>
  );
}
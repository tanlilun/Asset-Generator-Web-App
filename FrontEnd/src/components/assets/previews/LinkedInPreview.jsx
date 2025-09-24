import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Repeat, Send, MoreHorizontal } from 'lucide-react';

const ActionButton = ({ icon: Icon, label }) => (
  <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 p-2 rounded-md transition-colors">
    <Icon className="w-5 h-5" />
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

export default function LinkedInPreview({ user, caption, imageUrl }) {
  const userName = user?.full_name || "Your Name";
  const userJob = user?.job_title || "Your Job Title";
  const userInitials = userName.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <div className="bg-white rounded-lg shadow-md border p-4 font-sans w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-12 h-12 rounded-full">
            <AvatarFallback className="bg-blue-200 text-blue-800">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userJob}</p>
            <p className="text-xs text-gray-500">1h · 🌎</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </div>
      <p className="text-gray-800 text-sm mb-3 whitespace-pre-wrap">{caption}</p>
      {imageUrl && <img src={imageUrl} alt="Post content" className="w-full rounded-md border" />}
      <div className="flex items-center text-xs text-gray-500 py-2 mt-2">
        <span className="flex items-center -space-x-1">
          <span className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-[8px]">👍</span>
          <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-[8px]">💡</span>
        </span>
        <span className="ml-2">1</span>
      </div>
      <div className="border-t my-1"></div>
      <div className="flex justify-around">
        <ActionButton icon={ThumbsUp} label="Like" />
        <ActionButton icon={MessageCircle} label="Comment" />
        <ActionButton icon={Repeat} label="Repost" />
        <ActionButton icon={Send} label="Send" />
      </div>
    </div>
  );
}
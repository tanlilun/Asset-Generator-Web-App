import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, User as UserIcon, Settings, Palette, Languages } from "lucide-react";

export default function SettingsModal({ isOpen, onOpenChange, user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setUser(initialUser);
    setFormData({
      full_name: initialUser.full_name || "",
      company: initialUser.company || "",
      job_title: initialUser.job_title || "",
      phone: initialUser.phone || "",
      bio: initialUser.bio || ""
    });
  }, [initialUser, isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(formData);
      // You might want a way to refresh the user data in the layout here
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setIsSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Settings
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="general" className="w-full pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">
              <Palette className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="account">
              <UserIcon className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Theme
                </Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh">中文 (Simplified)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="account" className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label htmlFor="full_name">Full Name</Label><Input id="full_name" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} /></div>
                <div className="space-y-2"><Label htmlFor="company">Company</Label><Input id="company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="Your company name"/></div>
                <div className="space-y-2"><Label htmlFor="job_title">Job Title</Label><Input id="job_title" value={formData.job_title} onChange={(e) => setFormData({...formData, job_title: e.target.value})} placeholder="Marketing Manager, etc."/></div>
                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Your phone number"/></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea id="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows={3} placeholder="Tell us about yourself..." className="w-full px-3 py-2 border border-gray-200 rounded-md"/>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp, 
  ArrowRight,
  Play,
  Image as ImageIcon,
  FileText,
  Video
} from "lucide-react";

export default function Home() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.log("User not authenticated");
      }
    };
    loadUser();
  }, []);

  const features = [
    {
      icon: ImageIcon,
      title: "AI-Generated Images",
      description: "4 unique image options per campaign",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FileText,
      title: "Smart Captions",
      description: "Engaging social media copy",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Video,
      title: "Video Ads",
      description: "Short-form video content",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Target,
      title: "Display Ads",
      description: "Multiple banner formats",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Hero Section */}
      <section className="relative px-6 md:px-8 pt-12 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-orange-600/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200/60 rounded-full px-4 py-2 text-sm font-medium text-purple-700 mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Marketing Suite
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-6">
              Welcome{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Generate complete marketing asset sets in seconds. From social captions to display ads, 
              let AI handle your creative workflow.
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to={createPageUrl("Generate")} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Generate Assets
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            <Link to={createPageUrl("Assets")}>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 border-2 hover:bg-gray-50 transition-all duration-200"
              >
                <Play className="w-5 h-5 mr-2" />
                View Past Assets
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">10+</div>
                <div className="text-gray-600">Asset Types Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">5x</div>
                <div className="text-gray-600">Faster Than Manual</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">95%</div>
                <div className="text-gray-600">Time Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
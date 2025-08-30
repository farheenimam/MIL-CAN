import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeDisplay } from "@/components/badge-display";
import { ProfileSection } from "@/components/profile-section";

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: userContent } = useQuery({
    queryKey: ["/api/content/user"],
  });

  const { data: userBadges } = useQuery({
    queryKey: ["/api/badges/user"],
  });

  const { data: allBadges } = useQuery({
    queryKey: ["/api/badges"],
  });

  // Calculate stats from content
  const stats = {
    uploads: userContent?.length || 0,
    views: userContent?.reduce((sum: number, c: any) => sum + (c.views || 0), 0) || 0,
    likes: userContent?.reduce((sum: number, c: any) => sum + (c.likes || 0), 0) || 0,
    comments: userContent?.reduce((sum: number, c: any) => sum + (c.comments || 0), 0) || 0,
  };

  // Group content by category
  const contentByCategory = userContent?.reduce((acc: any, content: any) => {
    const category = content.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(content);
    return acc;
  }, {} as Record<string, any[]>) || {};

  const categoryDisplayNames: Record<string, { name: string; icon: string; color: string }> = {
    'fact-checking': { name: 'Fact Checking', icon: 'search', color: 'accent' },
    'digital-literacy': { name: 'Digital Literacy', icon: 'eye', color: 'primary' },
    'safety-ethics': { name: 'Safety & Ethics', icon: 'shield', color: 'green-400' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-orange-900 dark:via-yellow-900 dark:to-orange-800">
      {/* Navigation */}
      <nav className="bg-orange-100/80 dark:bg-orange-900/80 glass-card border-b border-orange-200 dark:border-orange-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="text-orange-700 dark:text-orange-200 hover:text-orange-900 dark:hover:text-orange-100 hover:bg-orange-200/50 dark:hover:bg-orange-800/50"
                data-testid="button-back-to-home"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Home
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-orange-700 dark:text-orange-200">
                Welcome back, <span className="text-orange-900 dark:text-orange-100 font-semibold">{user?.firstName || 'Creator'}!</span>
              </span>
              <Button variant="ghost" size="icon" className="bg-orange-200/50 dark:bg-orange-800/50 hover:bg-orange-300/50 dark:hover:bg-orange-700/50">
                <i className="fas fa-cog text-orange-600 dark:text-orange-300"></i>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <i className="fas fa-video text-orange-600 dark:text-orange-300 text-2xl"></i>
            <h1 className="text-3xl font-heading font-bold text-orange-700 dark:text-orange-200">Creator Dashboard</h1>
          </div>
          <p className="text-orange-600 dark:text-orange-300">Create, share, and track your media literacy content</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="bg-orange-200/60 dark:bg-orange-800/60 rounded-xl p-1 mb-8 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-700 dark:text-orange-200">
              <i className="fas fa-chart-line mr-2"></i>Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-700 dark:text-orange-200">
              <i className="fas fa-folder mr-2"></i>My Content
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-700 dark:text-orange-200">
              <i className="fas fa-user-circle mr-2"></i>Portfolio
            </TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-700 dark:text-orange-200">
              <i className="fas fa-medal mr-2"></i>Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/70 dark:bg-orange-900/70 glass-card p-6 rounded-xl group hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-700/50 transition-all duration-300 border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center justify-between mb-4">
                  <i className="fas fa-upload text-2xl text-muted-foreground"></i>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground" data-testid="text-total-uploads">{stats.uploads}</div>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">Total Uploads</h3>
                <p className="text-xs text-muted-foreground">Content pieces created</p>
              </div>

              <div className="bg-white/70 dark:bg-orange-900/70 glass-card p-6 rounded-xl group hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-700/50 transition-all duration-300 border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center justify-between mb-4">
                  <i className="fas fa-eye text-2xl text-muted-foreground"></i>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground" data-testid="text-total-views">{stats.views.toLocaleString()}</div>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">Monthly Views</h3>
                <p className="text-xs text-muted-foreground">Content engagement</p>
              </div>

              <div className="bg-white/70 dark:bg-orange-900/70 glass-card p-6 rounded-xl group hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-700/50 transition-all duration-300 border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center justify-between mb-4">
                  <i className="fas fa-heart text-2xl text-red-400"></i>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground" data-testid="text-total-likes">{stats.likes.toLocaleString()}</div>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">Likes Received</h3>
                <p className="text-xs text-muted-foreground">Community appreciation</p>
              </div>

              <div className="bg-white/70 dark:bg-orange-900/70 glass-card p-6 rounded-xl group hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-700/50 transition-all duration-300 border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center justify-between mb-4">
                  <i className="fas fa-comments text-2xl text-muted-foreground"></i>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground" data-testid="text-total-comments">{stats.comments.toLocaleString()}</div>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">Comments</h3>
                <p className="text-xs text-muted-foreground">Community discussions</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card glass-card p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-6">
                <i className="fas fa-bolt text-accent text-xl"></i>
                <h2 className="text-xl font-heading font-bold text-accent">Quick Actions</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg h-auto flex-col">
                  <i className="fas fa-plus text-xl mb-3"></i>
                  <h3 className="font-semibold">Create Post</h3>
                  <p className="text-xs text-blue-100">Write article or blog post</p>
                </Button>
                <Button className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-xl text-white hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg h-auto flex-col">
                  <i className="fas fa-video text-xl mb-3"></i>
                  <h3 className="font-semibold">Upload Video</h3>
                  <p className="text-xs text-red-100">Share your course videos</p>
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg h-auto flex-col">
                  <i className="fas fa-camera text-xl mb-3"></i>
                  <h3 className="font-semibold">Create Reel</h3>
                  <p className="text-xs text-purple-100">Short-form content</p>
                </Button>
              </div>
            </div>

            {/* Content by Category */}
            <div className="bg-card glass-card p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-6">
                <i className="fas fa-folder-open text-accent text-xl"></i>
                <h2 className="text-xl font-heading font-bold text-accent">Your Content by Category</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(categoryDisplayNames).map(([key, category]) => {
                  const count = contentByCategory[key]?.length || 0;
                  return (
                    <div key={key} className="bg-secondary/50 p-4 rounded-xl hover:bg-secondary/70 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <i className={`fas fa-${category.icon} text-${category.color}`}></i>
                        <span className={`text-xs bg-${category.color} text-${category.color === 'green-400' ? 'white' : 'accent-foreground'} px-2 py-1 rounded-full font-semibold`}>
                          {count}
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground">{category.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {key === 'fact-checking' ? 'Source verification' : 
                         key === 'digital-literacy' ? 'Media analysis' : 'Online safety'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {userContent && userContent.length > 0 ? (
              <div className="grid gap-6">
                {userContent.map((content) => (
                  <div key={content.id} className="bg-card glass-card p-6 rounded-xl" data-testid={`card-content-${content.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{content.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{content.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span><i className="fas fa-eye mr-1"></i>{content.views} views</span>
                          <span><i className="fas fa-heart mr-1"></i>{content.likes} likes</span>
                          <span><i className="fas fa-comments mr-1"></i>{content.comments} comments</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${categoryDisplayNames[content.category]?.color}/20 text-${categoryDisplayNames[content.category]?.color}`}>
                          {categoryDisplayNames[content.category]?.name || content.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-folder-open text-muted-foreground text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-foreground mb-2">No content yet</h3>
                <p className="text-muted-foreground">Start creating educational content to see it here</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="portfolio">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="badges">
            <BadgeDisplay 
              userBadges={userBadges || []} 
              allBadges={allBadges || []} 
              userRole="creator"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

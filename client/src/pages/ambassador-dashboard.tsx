import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeDisplay } from "@/components/badge-display";
import { ProfileSection } from "@/components/profile-section";

export default function AmbassadorDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: userEvents } = useQuery({
    queryKey: ["/api/events/user"],
  });

  const { data: activeEvents } = useQuery({
    queryKey: ["/api/events/active"],
  });

  const { data: userBadges } = useQuery({
    queryKey: ["/api/badges/user"],
  });

  const { data: allBadges } = useQuery({
    queryKey: ["/api/badges"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-black text-white">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-sm border-b border-purple-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="text-white hover:text-purple-300 hover:bg-white/10"
                data-testid="button-back-to-home"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Home
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Welcome back, <span className="text-purple-300 font-semibold">{user?.firstName || 'Ambassador'}!</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <i className="fas fa-graduation-cap text-purple-300 text-2xl"></i>
            <h1 className="text-3xl font-heading font-bold text-purple-300">Ambassador Dashboard</h1>
          </div>
          <p className="text-white/80">Welcome back, Content Creator!</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="bg-black/40 backdrop-blur-sm rounded-xl p-1 mb-8 border border-purple-400/30 shadow-lg shadow-purple-500/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-purple-200">
              <i className="fas fa-chart-line mr-2"></i>Overview
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-purple-200">
              <i className="fas fa-calendar mr-2"></i>My Events
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-purple-200">
              <i className="fas fa-calendar-check mr-2"></i>Active Events
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-purple-200">
              <i className="fas fa-user-circle mr-2"></i>Portfolio
            </TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-purple-200">
              <i className="fas fa-medal mr-2"></i>Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <BadgeDisplay 
              userBadges={userBadges || []} 
              allBadges={allBadges || []} 
              userRole="ambassador"
            />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {userEvents && userEvents.length > 0 ? (
              <div className="grid gap-6">
                {userEvents.map((event: any) => (
                  <div key={event.id} className="bg-card glass-card p-6 rounded-xl" data-testid={`card-event-${event.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span><i className="fas fa-calendar mr-1"></i>{new Date(event.startDate).toLocaleDateString()}</span>
                          <span><i className="fas fa-users mr-1"></i>{event.participants || 0} participants</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            event.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-calendar text-muted-foreground text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-foreground mb-2">No events yet</h3>
                <p className="text-muted-foreground">Start organizing events to see them here</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            {/* Active Events & Challenges */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 glass-card p-6 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-laptop text-blue-400 text-xl"></i>
                    <h3 className="text-lg font-semibold text-foreground">Digital Literacy Week Challenge</h3>
                  </div>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    Join Event
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Create content highlighting key dimensions of media literacy in modern education
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <span className="text-blue-400"><i className="fas fa-calendar mr-1"></i> Ends in 5 days</span>
                  <span className="text-muted-foreground"><i className="fas fa-users mr-1"></i> 47 participants</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-600/20 to-red-800/20 glass-card p-6 rounded-xl border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-exclamation-triangle text-red-400 text-xl"></i>
                    <h3 className="text-lg font-semibold text-foreground">Misinformation Awareness Campaign</h3>
                  </div>
                  <Button className="bg-red-500 text-white hover:bg-red-600">
                    Join Event
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Develop educational materials about identifying misinformation
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <span className="text-red-400"><i className="fas fa-clock mr-1"></i> 12 days left</span>
                  <span className="text-muted-foreground"><i className="fas fa-users mr-1"></i> 32 participants</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="badges">
            <BadgeDisplay 
              userBadges={userBadges || []} 
              allBadges={allBadges || []} 
              userRole="ambassador"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

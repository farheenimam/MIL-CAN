import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export default function Leaderboard() {
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();

  // Mock leaderboard data for now - replace with actual API call
  const leaderboardData = [
    { rank: 1, name: "Amy Ambassador", role: "Ambassador", points: 35, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=150&h=150&fit=crop&crop=face" },
    { rank: 2, name: "Chris Creator", role: "Creator", points: 23, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    { rank: 3, name: "Andy Advocate", role: "Ambassador", points: 20, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { rank: 4, name: "Casey Content", role: "Creator", points: 10, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-sm border-b border-purple-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-black text-lg"></i>
              </div>
              <div>
                <span className="text-xl font-heading font-bold text-yellow-400">MIL-CAN</span>
                <span className="text-xs text-yellow-200 ml-2">LITERACY</span>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-1">
              <Button 
                variant="ghost" 
                className="text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                data-testid="button-resources"
              >
                <i className="fas fa-book mr-2"></i>
                Resources
              </Button>
              <Button 
                variant="ghost" 
                className="text-yellow-400 font-semibold px-4 py-2 rounded-lg bg-yellow-400/10"
                data-testid="button-leaderboard-active"
              >
                <i className="fas fa-trophy mr-2"></i>
                Leaderboard
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 px-4 py-2 rounded-lg transition-all"
                data-testid="button-creator-kit"
                onClick={() => setLocation('/creator-kit')}
              >
                <i className="fas fa-tools mr-2"></i>
                Creator Kit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="text-white hover:text-yellow-400 px-4 py-2 rounded-lg hover:bg-white/10 ml-4"
                data-testid="button-back-home"
              >
                <i className="fas fa-home mr-2"></i>
                Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">Leaderboard</h1>
        </div>

        {/* Leaderboard */}
        <div className="space-y-6">
          {leaderboardData.map((user, index) => (
            <div
              key={user.rank}
              className="flex items-center justify-between p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:bg-gray-700/30 transition-all duration-200"
              data-testid={`leaderboard-rank-${user.rank}`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-12 h-12 rounded-lg font-bold text-xl text-white bg-gray-700/50">
                  #{user.rank}
                </div>

                {/* User Info */}
                <div>
                  <h3 className="font-semibold text-white text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-300 capitalize">{user.role}</p>
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className="text-2xl font-bold text-white" data-testid={`points-${user.rank}`}>
                  {user.points} pts
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { Badge, UserBadge } from "@shared/schema";

interface BadgeDisplayProps {
  userBadges: (UserBadge & { badge: Badge })[];
  allBadges: Badge[];
  userRole: 'creator' | 'ambassador';
}

export function BadgeDisplay({ userBadges, allBadges, userRole }: BadgeDisplayProps) {
  // Filter badges relevant to user role
  const relevantBadges = allBadges.filter(badge => 
    !badge.role || badge.role === userRole
  );

  const earnedBadgeIds = userBadges.map(ub => ub.badge.id);

  // Define badge categories for better organization
  const badgeCategories = {
    creator: {
      'First Upload': { color: 'gold', icon: 'star' },
      'Viral Content': { color: 'gold', icon: 'fire' },
      'Top Creator': { color: 'muted', icon: 'trophy' },
      'Community Hero': { color: 'muted', icon: 'users' },
    },
    ambassador: {
      'Mentor': { color: 'gold', icon: 'handshake' },
      'Event Host': { color: 'gold', icon: 'calendar-alt' },
      'Community Builder': { color: 'gold', icon: 'users' },
      'Expert': { color: 'muted', icon: 'crown' },
      'Global Impact': { color: 'muted', icon: 'globe' },
    }
  };

  const currentBadgeCategories = badgeCategories[userRole] || {};

  return (
    <div className="bg-card glass-card p-6 rounded-xl">
      <div className="flex items-center space-x-3 mb-6">
        <i className="fas fa-award text-accent text-xl"></i>
        <h2 className="text-xl font-heading font-bold text-accent">
          {userRole === 'creator' ? 'Creator Achievements' : 'Ambassador Achievements'}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {relevantBadges.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          const badgeConfig = (currentBadgeCategories as any)[badge.name] || { color: 'muted', icon: 'medal' };
          
          return (
            <div 
              key={badge.id} 
              className={`text-center p-4 rounded-xl transition-all duration-300 ${
                isEarned ? 'bg-secondary/50' : 'bg-secondary/30 opacity-50'
              }`}
              data-testid={`badge-${badge.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                isEarned 
                  ? badgeConfig.color === 'gold' 
                    ? 'badge' 
                    : 'bg-muted'
                  : 'bg-muted'
              }`}>
                <i className={`fas fa-${badge.icon || badgeConfig.icon} text-lg ${
                  isEarned && badgeConfig.color === 'gold' ? 'text-background' : 'text-muted-foreground'
                }`}></i>
              </div>
              <h4 className={`font-semibold text-sm mb-1 ${
                isEarned ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {badge.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isEarned ? 'Earned' : badge.requirement || 'Not earned yet'}
              </p>
              {isEarned && userBadges.find(ub => ub.badge.id === badge.id) && (
                <p className="text-xs text-accent mt-1">
                  {new Date(userBadges.find(ub => ub.badge.id === badge.id)!.earnedAt || new Date()).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Badge Progress</span>
          <span className="text-sm text-muted-foreground">
            {userBadges.length} / {relevantBadges.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(userBadges.length / relevantBadges.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export default function CreatorKit() {
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();

  const resources = [
    {
      title: "Presentation Slides",
      description: "Ready-to-use slides for your event",
      icon: "fas fa-presentation",
    },
    {
      title: "Facilitator Guide", 
      description: "Step-by-step instructions",
      icon: "fas fa-book-open",
    },
    {
      title: "Code of Conduct",
      description: "Safety guidelines for events", 
      icon: "fas fa-shield-alt",
    },
    {
      title: "Activity Templates",
      description: "Interactive exercises",
      icon: "fas fa-puzzle-piece",
    },
  ];

  const handleDownload = (resource: string) => {
    console.log(`Downloading ${resource}`);
    // Here you would implement actual download logic
  };

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
                className="text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setLocation('/leaderboard')}
                data-testid="button-leaderboard"
              >
                <i className="fas fa-trophy mr-2"></i>
                Leaderboard
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg bg-yellow-400/10"
                data-testid="button-creator-kit-active"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">Event Kit</h1>
          <p className="text-gray-300 text-lg">Download resources to run media literacy events.</p>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-8 hover:bg-gray-700/40 transition-all duration-200"
              data-testid={`resource-${index}`}
            >
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <i className={`${resource.icon} text-yellow-400 text-2xl mr-3`}></i>
                  <h2 className="text-xl font-bold text-white">{resource.title}</h2>
                </div>
                <p className="text-gray-300">{resource.description}</p>
              </div>
              
              <Button
                onClick={() => handleDownload(resource.title)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
                data-testid={`download-${index}`}
              >
                <i className="fas fa-download mr-2"></i>
                Download
              </Button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">MIL-CAN NETWORK</h3>
            <p className="text-white mb-1">Media & Information Literacy Creators & Ambassadors Network</p>
            <div className="flex justify-center items-center space-x-8 mt-4 text-sm text-gray-300">
              <span>© 2024 MIL-CAN</span>
              <span>•</span>
              <span>EMPOWERING DIGITAL LITERACY</span>
              <span>•</span>
              <span>BUILDING CRITICAL THINKERS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
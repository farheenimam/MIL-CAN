import { useState, useEffect } from "react";
import backgroundVideo from "../../../background.mp4";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { ReviewsSlider } from "@/components/reviews-slider";
import { JoinModal } from "@/components/join-modal";
import { CreatorSignupModal } from "@/components/creator-signup-modal";
import { AmbassadorSigninModal } from "@/components/ambassador-signin-modal";
import { AiAssistant } from "@/components/ai-assistant";

export default function Landing() {
  const { theme, setTheme } = useTheme();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [creatorSignupOpen, setCreatorSignupOpen] = useState(false);
  const [ambassadorSigninOpen, setAmbassadorSigninOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if video should be shown based on URL
  const [shouldShowVideo, setShouldShowVideo] = useState(() => {
    return (
      window.location.hash === "#home" ||
      window.location.hash === "" ||
      window.location.href.includes("pike.replit.dev/#home")
    );
  });

  // Update video visibility when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setShouldShowVideo(
        window.location.hash === "#home" ||
          window.location.hash === "" ||
          window.location.href.includes("pike.replit.dev/#home"),
      );
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const { data: statistics } = useQuery({
    queryKey: ["/api/statistics"],
  });

  const { data: reviews } = useQuery({
    queryKey: ["/api/reviews"],
  });

  // Animate counters
  useEffect(() => {
    if (!statistics) return;

    const animateCounter = (element: HTMLElement, target: number) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
      }, 30);
    };

    document.querySelectorAll(".stats-counter").forEach((counter) => {
      const element = counter as HTMLElement;
      const dataKey = element.getAttribute("data-key");
      let target = 0;

      switch (dataKey) {
        case "creators":
          target = (statistics as any)?.creators || 0;
          break;
        case "ambassadors":
          target = (statistics as any)?.ambassadors || 0;
          break;
        case "events":
          target = (statistics as any)?.eventsHosted || 0;
          break;
      }

      if (target > 0) {
        animateCounter(element, target);
      }
    });
  }, [statistics]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-orange-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-black text-lg"></i>
              </div>
              <div>
                <span className="text-xl font-heading font-bold text-yellow-400">
                  MIL-CAN
                </span>
                <span className="text-xs text-yellow-200 ml-2">LITERACY</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <a
                href="#home"
                className="text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
              >
                Home
              </a>
              <a
                href="#mission"
                className="text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
              >
                Mission
              </a>
              <a
                href="#reviews"
                className="text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
              >
                Reviews
              </a>
              <Button
                variant="ghost"
                className="text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                data-testid="button-resources"
                onClick={() => (window.location.href = "/resources")}
              >
                <i className="fas fa-book mr-2"></i>
                Resources
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                data-testid="button-leaderboard"
                onClick={() => (window.location.href = "/leaderboard")}
              >
                <i className="fas fa-trophy mr-2"></i>
                Leaderboard
              </Button>
              <Button
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 px-4 py-2 rounded-lg transition-all"
                data-testid="button-creator-kit"
                onClick={() => (window.location.href = "/creator-kit")}
              >
                <i className="fas fa-tools mr-2"></i>
                Creator Kit
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-white hover:text-yellow-400 hover:bg-white/10"
                data-testid="button-theme-toggle"
              >
                <i
                  className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}
                ></i>
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white hover:text-yellow-400 hover:bg-white/10"
                data-testid="button-mobile-menu"
              >
                <i className="fas fa-bars"></i>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-sm border-t border-gray-700/30">
              <div className="px-4 py-4 space-y-2">
                <a
                  href="#home"
                  className="block text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  Home
                </a>
                <a
                  href="#mission"
                  className="block text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  Mission
                </a>
                <a
                  href="#reviews"
                  className="block text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  Reviews
                </a>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                  data-testid="button-resources-mobile"
                >
                  <i className="fas fa-book mr-2"></i>
                  Resources
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                  data-testid="button-leaderboard-mobile"
                  onClick={() => (window.location.href = "/leaderboard")}
                >
                  <i className="fas fa-trophy mr-2"></i>
                  Leaderboard
                </Button>
                <Button
                  className="w-full justify-start bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 px-4 py-2 rounded-lg transition-all"
                  data-testid="button-creator-kit-mobile"
                  onClick={() => (window.location.href = "/creator-kit")}
                >
                  <i className="fas fa-tools mr-2"></i>
                  Creator Kit
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Video Background - Only show for #home section and contained within hero */}
        {shouldShowVideo && (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-25 z-0"
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
          </>
        )}

        <div className="relative text-center max-w-6xl mx-auto px-4 z-20">
          <div className="inline-flex items-center space-x-2 bg-card/80 glass-card px-4 py-2 rounded-full mb-8">
            <span className="text-accent font-medium">
              ✨ EMPOWERING DIGITAL LITERACY
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold text-purple-400 glow-text mb-6 animate-glow-pulse">
            MIL-CAN
          </h1>
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-4">
            MEDIA & INFORMATION LITERACY
          </h2>
          <h3 className="text-xl md:text-2xl font-heading font-medium text-purple-400 mb-8">
            CREATORS & AMBASSADORS NETWORK
          </h3>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Join a community of educators, content creators, and literacy
            advocates working together to combat misinformation and promote
            critical thinking in the digital age.
          </p>

          {/* Live Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-card/80 glass-card border-2 border-black p-6 rounded-xl text-center group hover:shadow-glow transition-all duration-300">
              <div className="text-4xl mb-2">🎨</div>
              <div
                className="text-3xl font-bold text-purple-400 stats-counter"
                data-key="creators"
                data-testid="text-creators-count"
              >
                {(statistics as any)?.creators || 0}
              </div>
              <div className="text-sm text-gray-300 font-medium">
                Active Creators
              </div>
            </div>
            <div className="bg-card/80 glass-card border-2 border-black p-6 rounded-xl text-center group hover:shadow-glow transition-all duration-300">
              <div className="text-4xl mb-2">🎓</div>
              <div
                className="text-3xl font-bold text-purple-400 stats-counter"
                data-key="ambassadors"
                data-testid="text-ambassadors-count"
              >
                {(statistics as any)?.ambassadors || 0}
              </div>
              <div className="text-sm text-gray-300 font-medium">
                Ambassadors
              </div>
            </div>
            <div className="bg-card/80 glass-card border-2 border-black p-6 rounded-xl text-center group hover:shadow-glow transition-all duration-300">
              <div className="text-4xl mb-2">📹</div>
              <div
                className="text-3xl font-bold text-purple-400 stats-counter"
                data-key="content"
                data-testid="text-content-count"
              >
                {(statistics as any)?.contentPieces || 0}
              </div>
              <div className="text-sm text-gray-300 font-medium">
                Content Pieces
              </div>
            </div>
            <div className="bg-card/80 glass-card border-2 border-black p-6 rounded-xl text-center group hover:shadow-glow transition-all duration-300">
              <div className="text-4xl mb-2">🎪</div>
              <div
                className="text-3xl font-bold text-purple-400 stats-counter"
                data-key="events"
                data-testid="text-events-count"
              >
                {(statistics as any)?.eventsHosted || 0}
              </div>
              <div className="text-sm text-gray-300 font-medium">
                Events Hosted
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center items-center">
            <Button
              onClick={() => setJoinModalOpen(true)}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-200 shadow-glow transform hover:scale-105"
              data-testid="button-join-network"
            >
              <i className="fas fa-rocket mr-2"></i>
              Join the Network
            </Button>
          </div>
        </div>

        {/* Floating Elements */}
        <div
          className="absolute top-20 left-10 w-6 h-6 bg-accent/30 rounded-full animate-float z-20"
          style={{ animationDelay: "-2s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-4 h-4 bg-primary/30 rounded-full animate-float z-20"
          style={{ animationDelay: "-4s" }}
        ></div>
        <div className="absolute bottom-40 left-20 w-8 h-8 bg-accent/20 rounded-full animate-float z-20"></div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              🎯 <span className="font-bold">Our Mission</span>
            </h2>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">
              Building Digital Literacy Through{" "}
              <span className="text-purple-400">Community</span>
            </h3>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              We connect content creators and campus ambassadors to combat
              misinformation through educational content and community events.
            </p>
          </div>

          {/* Mission Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-card/80 glass-card border-2 border-black p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-heading font-semibold text-purple-400 mb-4">
                CREATE
              </h3>
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Educational Content
              </h4>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Create engaging, educational content that teaches critical
                thinking, fact-checking, and digital literacy skills to learners
                of all ages.
              </p>
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <i className="fas fa-check-circle"></i>
                <span className="font-medium">Open to All Creators</span>
              </div>
            </div>

            <div className="bg-card/80 glass-card border-2 border-black p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-heading font-semibold text-purple-400 mb-4">
                EDUCATE
              </h3>
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Ambassador Program
              </h4>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Experienced educators and literacy advocates who mentor
                creators, curate content, and lead community initiatives.
                Invitation only.
              </p>
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <i className="fas fa-star"></i>
                <span className="font-medium">Invitation Required</span>
              </div>
            </div>

            <div className="bg-card/80 glass-card border-2 border-black p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-heading font-semibold text-purple-400 mb-4">
                IMPACT
              </h3>
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Global Community
              </h4>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Building a worldwide network of media literacy advocates working
                together to create a more informed and critical-thinking
                society.
              </p>
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <i className="fas fa-infinity"></i>
                <span className="font-medium">Worldwide Network</span>
              </div>
            </div>
          </div>

          {/* Platform Features */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              🚀 <span className="font-bold">Platform Features</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Discover powerful tools and resources designed to enhance your
              media literacy journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card/80 glass-card border-2 border-black p-6 rounded-xl">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Leaderboard
              </h3>
              <p className="text-gray-300 text-sm">
                Track contributions and achievements across the network
              </p>
            </div>

            <div className="bg-card/80 glass-card border-2 border-black p-6 rounded-xl">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Creator Kit
              </h3>
              <p className="text-gray-300 text-sm">
                Tools and resources for effective content creation
              </p>
            </div>

            <div className="bg-card/80 glass-card border-2 border-black p-6 rounded-xl">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Asset Library
              </h3>
              <p className="text-gray-300 text-sm">
                Browse and share educational resources
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              💬 <span className="font-bold">What Our Community Says</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Real testimonials from creators and ambassadors making an impact
              in digital literacy education.
            </p>
          </div>
          <ReviewsSlider reviews={(reviews as any) || []} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700/30 py-12 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h3 className="text-lg font-heading font-bold text-accent mb-2">
              MIL-CAN NETWORK
            </h3>
            <p className="text-sm text-muted-foreground">
              Media & Information Literacy Creators & Ambassadors Network
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 MIL-CAN • EMPOWERING DIGITAL LITERACY • BUILDING CRITICAL
            THINKERS
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JoinModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onCreatorSelected={() => {
          setJoinModalOpen(false);
          setCreatorSignupOpen(true);
        }}
        onAmbassadorSelected={() => {
          setJoinModalOpen(false);
          setAmbassadorSigninOpen(true);
        }}
      />

      <CreatorSignupModal
        open={creatorSignupOpen}
        onClose={() => setCreatorSignupOpen(false)}
      />

      <AmbassadorSigninModal
        open={ambassadorSigninOpen}
        onClose={() => setAmbassadorSigninOpen(false)}
      />

      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
          className="bg-primary text-primary-foreground px-6 py-4 rounded-full font-semibold text-sm hover:bg-primary/90 transition-all duration-200 shadow-glow transform hover:scale-105 flex items-center gap-3"
          data-testid="button-ai-assistant-support"
        >
          🤖
          <span>AI Assistant Support</span>
        </Button>
      </div>

      {/* AI Assistant */}
      <AiAssistant
        open={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />
    </div>
  );
}

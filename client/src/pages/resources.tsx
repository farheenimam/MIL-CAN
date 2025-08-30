import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function Resources() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const toolsAndTutorials = [
    {
      title: "Fact-Checking Toolkit",
      description: "Essential tools for verifying information online",
      category: "fact-checking",
      resources: [
        { name: "Snopes", url: "https://snopes.com", description: "Comprehensive fact-checking database" },
        { name: "PolitiFact", url: "https://politifact.com", description: "Political fact-checking platform" },
        { name: "FactCheck.org", url: "https://factcheck.org", description: "Independent fact-checking organization" }
      ]
    },
    {
      title: "Digital Literacy Resources",
      description: "Building skills for the digital age",
      category: "digital-literacy",
      resources: [
        { name: "Common Sense Media", url: "https://commonsensemedia.org", description: "Digital citizenship education" },
        { name: "Mozilla Foundation", url: "https://foundation.mozilla.org", description: "Web literacy resources" },
        { name: "Digital Wellness Institute", url: "https://digitalwellness.org", description: "Healthy technology use" }
      ]
    },
    {
      title: "Online Safety & Ethics",
      description: "Staying safe and ethical online",
      category: "safety-ethics",
      resources: [
        { name: "Stop, Think, Connect", url: "https://stopthinkconnect.org", description: "Cybersecurity awareness" },
        { name: "ConnectSafely", url: "https://connectsafely.org", description: "Safe social networking tips" },
        { name: "Digital Citizenship Institute", url: "https://digitalcitizenship.net", description: "Ethics in digital spaces" }
      ]
    }
  ];

  const educationalMaterials = [
    {
      title: "Lesson Plans",
      items: [
        "Elementary Media Literacy (K-5)",
        "Middle School Critical Thinking (6-8)",
        "High School Information Analysis (9-12)",
        "Adult Digital Literacy Workshop"
      ]
    },
    {
      title: "Interactive Activities",
      items: [
        "Spot the Fake News Game",
        "Social Media Privacy Simulator",
        "Information Source Evaluation",
        "Digital Footprint Tracker"
      ]
    },
    {
      title: "Assessment Tools",
      items: [
        "Media Literacy Skills Assessment",
        "Digital Citizenship Quiz",
        "Critical Thinking Rubric",
        "Information Literacy Checklist"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-black dark:from-purple-900 dark:via-indigo-900 dark:to-black">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-sm border-b border-blue-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="text-white hover:text-yellow-400 hover:bg-white/10"
                data-testid="button-back-to-home"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Home
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">
                <i className="fas fa-book text-yellow-400 mr-2"></i>
                <span className="font-semibold">Resource Library</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <i className="fas fa-book-open text-yellow-400 text-2xl"></i>
            <h1 className="text-3xl font-heading font-bold text-yellow-400">Resource Library</h1>
          </div>
          <p className="text-blue-200 mb-4">Comprehensive collection of media literacy tools, resources, and educational materials</p>
          <div className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 backdrop-blur-sm border border-blue-700/50 p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold text-yellow-400 mb-3">📚 What You'll Find Here</h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              Our resource library is designed to empower educators, students, and digital citizens with the tools and knowledge needed to navigate today's complex media landscape. From fact-checking toolkits to educational activities, these resources help build critical thinking skills and combat misinformation in communities worldwide.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-800/50 text-blue-200 text-xs rounded-full">🔍 Fact-checking tools</span>
              <span className="px-3 py-1 bg-blue-800/50 text-blue-200 text-xs rounded-full">🎓 Educational materials</span>
              <span className="px-3 py-1 bg-blue-800/50 text-blue-200 text-xs rounded-full">🛡️ Digital safety guides</span>
              <span className="px-3 py-1 bg-blue-800/50 text-blue-200 text-xs rounded-full">📊 Research insights</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 dark:bg-blue-900/70 border-blue-200 dark:border-blue-700"
              data-testid="input-search-resources"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"></i>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tools" className="mb-8">
          <TabsList className="bg-blue-200/60 dark:bg-blue-800/60 rounded-xl p-1 mb-8 shadow-lg">
            <TabsTrigger value="tools" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700 dark:text-blue-200">
              <i className="fas fa-tools mr-2"></i>Tools & Tutorials
            </TabsTrigger>
            <TabsTrigger value="materials" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700 dark:text-blue-200">
              <i className="fas fa-graduation-cap mr-2"></i>Educational Materials
            </TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700 dark:text-blue-200">
              <i className="fas fa-microscope mr-2"></i>Research & Studies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolsAndTutorials.map((toolkit, index) => (
                <div key={index} className="bg-white/70 dark:bg-blue-900/70 glass-card p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-700/50 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-3">{toolkit.title}</h3>
                  <p className="text-blue-600 dark:text-blue-300 text-sm mb-4">{toolkit.description}</p>
                  <div className="space-y-3">
                    {toolkit.resources.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="p-3 bg-blue-50/50 dark:bg-blue-800/30 rounded-lg">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
                        >
                          {resource.name} <i className="fas fa-external-link-alt ml-1 text-xs"></i>
                        </a>
                        <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">{resource.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationalMaterials.map((material, index) => (
                <div key={index} className="bg-white/70 dark:bg-blue-900/70 glass-card p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-700/50 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4">{material.title}</h3>
                  <div className="space-y-2">
                    {material.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3 p-2 hover:bg-blue-50/50 dark:hover:bg-blue-800/30 rounded-lg transition-colors cursor-pointer">
                        <i className="fas fa-file-alt text-blue-500 mt-1"></i>
                        <span className="text-blue-700 dark:text-blue-200 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="research" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/70 dark:bg-blue-900/70 glass-card p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4">Latest Research</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-800/30 rounded-lg">
                    <h4 className="font-medium text-blue-700 dark:text-blue-200">Digital Literacy in Education (2024)</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">Comprehensive study on the impact of digital literacy programs in schools.</p>
                    <Button className="mt-3 text-xs bg-blue-500 hover:bg-blue-600">Read Study</Button>
                  </div>
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-800/30 rounded-lg">
                    <h4 className="font-medium text-blue-700 dark:text-blue-200">Misinformation Spread Patterns (2024)</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">Analysis of how false information spreads through social media platforms.</p>
                    <Button className="mt-3 text-xs bg-blue-500 hover:bg-blue-600">Read Study</Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 dark:bg-blue-900/70 glass-card p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4">Key Statistics</h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50/50 dark:bg-blue-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">78%</div>
                    <div className="text-xs text-blue-500 dark:text-blue-400">of adults struggle with online misinformation</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50/50 dark:bg-blue-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">65%</div>
                    <div className="text-xs text-blue-500 dark:text-blue-400">improvement with media literacy training</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50/50 dark:bg-blue-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">45%</div>
                    <div className="text-xs text-blue-500 dark:text-blue-400">of schools lack comprehensive programs</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
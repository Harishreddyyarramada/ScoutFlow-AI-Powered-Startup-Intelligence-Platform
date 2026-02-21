import { useState } from 'react';
import { ArrowRight, Zap, TrendingUp, Users, BarChart3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/companies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics Dashboard',
      description: 'Track key metrics and performance indicators in real-time'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Company Database',
      description: 'Access detailed profiles of 10,000+ portfolio companies'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Market Trends',
      description: 'Stay updated with latest market movements and opportunities'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Quick Insights',
      description: 'Get AI-powered recommendations and scoring'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Companies Tracked' },
    { number: '2.5B', label: 'Total Capital' },
    { number: '500+', label: 'Active Investors' },
    { number: '98%', label: 'Data Accuracy' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 hover:bg-white/20 transition-all">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">
                Introducing ScoutFlow v2.0 - Now with AI Intelligence
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-8 px-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              Find & Analyze Your Next Investment
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed">
              ScoutFlow is your ultimate platform for discovering promising startups, tracking portfolio companies, and making data-driven investment decisions with confidence.
            </p>
          </div>

          {/* Search Bar with Glassmorphism */}
          <div className="flex justify-center mb-8 px-4">
            <div className="w-full max-w-2xl">
              <div className="relative backdrop-blur-xl bg-white/6 border border-white/10 rounded-2xl p-2 hover:bg-white/10 transition-all shadow-2xl">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-purple-400 ml-3 flex-shrink-0" />
                  <Input
                    aria-label="Search companies, investors, or sectors"
                    type="text"
                    placeholder="Search companies, investors, or sectors..."
                    className="border-0 bg-transparent text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  />
                  <Button
                    type="button"
                    onClick={handleSearch}
                    aria-label="Search"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl mr-1 flex-shrink-0"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 px-4">
            <Button
              type="button"
              onClick={() => navigate('/companies')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-lg font-semibold flex items-center gap-2 justify-center px-6 py-4 w-full sm:w-auto"
            >
              Explore Companies
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/saved-searches')}
              variant="outline"
              className="border-2 border-purple-400/30 hover:bg-white/6 text-white rounded-xl text-lg font-semibold backdrop-blur-md bg-white/3 px-6 py-4 w-full sm:w-auto"
            >
              View Saved Searches
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 px-2">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/6 border border-white/8 rounded-2xl p-4 sm:p-6 text-center hover:bg-white/10 transition-all hover:scale-105 transform"
              >
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-1">
                  {stat.number}
                </p>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 px-2">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Powerful Features Built for Investors
              </span>
            </h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              Everything you need to make smarter investment decisions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/6 border border-white/8 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all hover:scale-105 transform hover:shadow-2xl group"
              >
                <div className="mb-4 text-purple-400 group-hover:text-pink-400 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/12 to-pink-500/12 border border-white/10 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Ready to Transform Your Investment Strategy?
            </h2>
            <p className="text-gray-300 mb-6 text-base sm:text-lg">
              Join hundreds of investors already using ScoutFlow to discover and track their next unicorn.
            </p>
            <Button
              type="button"
              onClick={() => navigate('/companies')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl text-lg font-semibold w-full sm:w-auto"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Link */}
      <section className="relative py-8 px-4 text-center border-t border-white/8">
        <p className="text-gray-400 text-sm max-w-3xl mx-auto">
          © 2026 ScoutFlow. All rights reserved. | Built for the future of venture capital.
        </p>
      </section>
    </div>
  );
}

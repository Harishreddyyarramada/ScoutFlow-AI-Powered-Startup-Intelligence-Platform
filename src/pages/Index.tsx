import { useState } from 'react';
import { ArrowRight, Zap, TrendingUp, Users, BarChart3, Search, Globe } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 hover:bg-white/20 transition-all">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">
                Introducing ScoutFlow v2.0 - Now with AI Intelligence
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Find & Analyze Your Next Investment
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              ScoutFlow is your ultimate platform for discovering promising startups, tracking portfolio companies, and making data-driven investment decisions with confidence.
            </p>
          </div>

          {/* Search Bar with Glassmorphism */}
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-2xl">
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 hover:bg-white/20 transition-all shadow-2xl">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-purple-400 ml-4" />
                  <Input
                    type="text"
                    placeholder="Search companies, investors, or sectors..."
                    className="border-0 bg-transparent text-white placeholder:text-gray-400 focus:outline-none focus:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl mr-1"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button
              onClick={() => navigate('/companies')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 rounded-xl text-lg font-semibold flex items-center gap-2 group"
            >
              Explore Companies
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate('/saved-searches')}
              variant="outline"
              className="border-2 border-purple-400/30 hover:bg-white/10 text-white px-8 py-6 rounded-xl text-lg font-semibold backdrop-blur-md bg-white/5"
            >
              View Saved Searches
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all hover:scale-105 transform"
              >
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Powerful Features Built for Investors
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to make smarter investment decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all hover:scale-105 transform hover:shadow-2xl group"
              >
                <div className="mb-4 text-purple-400 group-hover:text-pink-400 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Investment Strategy?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join hundreds of investors already using ScoutFlow to discover and track their next unicorn.
            </p>
            <Button
              onClick={() => navigate('/companies')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-6 rounded-xl text-lg font-semibold"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Link */}
      <section className="relative py-12 px-4 text-center border-t border-white/10">
        <p className="text-gray-400">
          © 2026 ScoutFlow. All rights reserved. | Built for the future of venture capital.
        </p>
      </section>
    </div>
  );
}

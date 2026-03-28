/**
 * Aethos Social Cloud - Analytics Hub
 * Page d'analyse avancée multi-plateformes
 * 
 * @version 3.0.0
 * @author Aethos Cognitive Systems
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Eye, Heart, Share2,
  ArrowUpRight, ArrowDownRight, Calendar, Download, Filter
} from 'lucide-react';

interface PlatformMetrics {
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  growth: number;
  viralPosts: number;
}

interface ContentPerformance {
  id: string;
  platform: string;
  content: string;
  publishedAt: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagementRate: number;
  viralScore: number;
  predictedBy: 'OMNI-MIND' | 'NOVA-GENESIS' | 'HUMAN';
}

const AnalyticsHub: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metrics, setMetrics] = useState<PlatformMetrics[]>([]);
  const [topPosts, setTopPosts] = useState<ContentPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Données simulées pour la démo
  useEffect(() => {
    const simulateData = () => {
      // Métriques par plateforme
      const platformData: PlatformMetrics[] = [
        { platform: 'Instagram', followers: 125400, engagement: 8.5, reach: 450000, impressions: 890000, growth: 12.3, viralPosts: 23 },
        { platform: 'TikTok', followers: 89200, engagement: 15.2, reach: 1200000, impressions: 2100000, growth: 28.7, viralPosts: 45 },
        { platform: 'YouTube', followers: 67800, engagement: 6.8, reach: 320000, impressions: 580000, growth: 8.9, viralPosts: 12 },
        { platform: 'LinkedIn', followers: 34500, engagement: 4.2, reach: 125000, impressions: 210000, growth: 15.6, viralPosts: 8 },
        { platform: 'Twitter/X', followers: 45600, engagement: 3.9, reach: 180000, impressions: 340000, growth: -2.1, viralPosts: 15 },
        { platform: 'Facebook', followers: 78900, engagement: 5.1, reach: 290000, impressions: 450000, growth: 3.4, viralPosts: 18 },
        { platform: 'Pinterest', followers: 23400, engagement: 7.3, reach: 156000, impressions: 280000, growth: 19.8, viralPosts: 9 },
        { platform: 'Snapchat', followers: 56700, engagement: 11.4, reach: 420000, impressions: 680000, growth: 22.1, viralPosts: 31 }
      ];

      // Top posts performants
      const postsData: ContentPerformance[] = [
        {
          id: '1',
          platform: 'TikTok',
          content: 'Behind the scenes: Creating viral content with AI',
          publishedAt: '2024-01-15',
          likes: 45600,
          comments: 2340,
          shares: 8900,
          views: 1200000,
          engagementRate: 18.5,
          viralScore: 0.94,
          predictedBy: 'OMNI-MIND'
        },
        {
          id: '2',
          platform: 'Instagram',
          content: 'Carousel: 10 tips for social media success',
          publishedAt: '2024-01-14',
          likes: 23400,
          comments: 890,
          shares: 3400,
          views: 450000,
          engagementRate: 12.3,
          viralScore: 0.87,
          predictedBy: 'NOVA-GENESIS'
        },
        {
          id: '3',
          platform: 'LinkedIn',
          content: 'The future of AI in social media marketing',
          publishedAt: '2024-01-13',
          likes: 8900,
          comments: 567,
          shares: 1200,
          views: 125000,
          engagementRate: 9.8,
          viralScore: 0.76,
          predictedBy: 'HUMAN'
        },
        {
          id: '4',
          platform: 'YouTube',
          content: 'Tutorial: Mastering social analytics',
          publishedAt: '2024-01-12',
          likes: 12300,
          comments: 780,
          shares: 2100,
          views: 320000,
          engagementRate: 7.2,
          viralScore: 0.81,
          predictedBy: 'OMNI-MIND'
        },
        {
          id: '5',
          platform: 'Twitter/X',
          content: 'Thread: 15 viral patterns decoded by AI',
          publishedAt: '2024-01-11',
          likes: 15600,
          comments: 1200,
          shares: 4500,
          views: 280000,
          engagementRate: 11.4,
          viralScore: 0.89,
          predictedBy: 'NOVA-GENESIS'
        }
      ];

      setMetrics(platformData);
      setTopPosts(postsData);
      setIsLoading(false);
    };

    simulateData();
    const interval = setInterval(simulateData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const filteredMetrics = selectedPlatform === 'all' 
    ? metrics 
    : metrics.filter(m => m.platform === selectedPlatform);

  const totalFollowers = metrics.reduce((sum, m) => sum + m.followers, 0);
  const avgEngagement = metrics.reduce((sum, m) => sum + m.engagement, 0) / metrics.length;
  const totalReach = metrics.reduce((sum, m) => sum + m.reach, 0);
  const totalViralPosts = metrics.reduce((sum, m) => sum + m.viralPosts, 0);

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      Instagram: '📸',
      TikTok: '🎵',
      YouTube: '▶️',
      LinkedIn: '💼',
      'Twitter/X': '𝕏',
      Facebook: '📘',
      Pinterest: '📌',
      Snapchat: '👻'
    };
    return icons[platform] || '📱';
  };

  const getPredictorBadge = (predictedBy: string) => {
    const colors: Record<string, string> = {
      'OMNI-MIND': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'NOVA-GENESIS': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'HUMAN': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    };
    return colors[predictedBy] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Hub</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyse approfondie de vos performances multi-plateformes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Calendar className="w-4 h-4" />
            <span>{timeRange}</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filtrer</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Followers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {(totalFollowers / 1000).toFixed(1)}K
              </p>
              <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+15.2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Moyen</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {avgEngagement.toFixed(1)}%
              </p>
              <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+2.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Portée Totale</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {(totalReach / 1000000).toFixed(1)}M
              </p>
              <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+23.7%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Posts Viraux</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {totalViralPosts}
              </p>
              <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+8 this week</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance par Plateforme</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plateforme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Followers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engagement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Portée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Croissance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Posts Viraux</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMetrics.map((platform) => (
                <tr key={platform.platform} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getPlatformIcon(platform.platform)}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{platform.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {(platform.followers / 1000).toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`font-medium ${platform.engagement > 10 ? 'text-green-600' : platform.engagement > 5 ? 'text-yellow-600' : 'text-gray-600'}`}>
                        {platform.engagement.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {(platform.reach / 1000).toFixed(0)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${platform.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {platform.growth >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      <span className="font-medium">{Math.abs(platform.growth).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                      {platform.viralPosts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Meilleurs Posts Performants</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Contenu avec le meilleur engagement et score viral
          </p>
        </div>
        <div className="space-y-4 p-6">
          {topPosts.map((post) => (
            <div key={post.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors">
              <div className="text-2xl">{getPlatformIcon(post.platform)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate pr-4">
                    {post.content}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPredictorBadge(post.predictedBy)}`}>
                    {post.predictedBy}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {(post.likes / 1000).toFixed(1)}K
                  </span>
                  <span className="flex items-center">
                    <Share2 className="w-4 h-4 mr-1" />
                    {(post.shares / 1000).toFixed(1)}K
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {(post.views / 1000).toFixed(0)}K vues
                  </span>
                  <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {post.engagementRate.toFixed(1)}% engagement
                  </span>
                  <span className="flex items-center text-purple-600 dark:text-purple-400 font-medium">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Score viral: {(post.viralScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHub;

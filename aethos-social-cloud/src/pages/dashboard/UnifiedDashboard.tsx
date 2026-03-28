/**
 * UnifiedDashboard.tsx
 * Page principale de Dashboard Unifié pour Aethos Social Cloud.
 * Affiche les métriques en temps réel, l'état de la triade cognitive et les alertes.
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Activity, 
  Zap, 
  BrainCircuit,
  Globe,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Types de données simulées
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: 'indigo' | 'green' | 'red' | 'orange';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

interface CognitiveStatus {
  omniMind: number;
  nexusHive: number;
  novaGenesis: number;
  synergy: number;
}

export const UnifiedDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    impressions: '2.4M',
    engagement: '8.7%',
    crises: '0',
    viralPosts: '12'
  });

  const [cognitiveStatus, setCognitiveStatus] = useState<CognitiveStatus>({
    omniMind: 0.92,
    nexusHive: 0.88,
    novaGenesis: 0.95,
    synergy: 0.91
  });

  const [recentEvents, setRecentEvents] = useState([
    { id: 1, type: 'viral', message: 'Post TikTok détecté comme viral (+245% engagement)', time: 'Il y a 2 min', platform: 'TikTok' },
    { id: 2, type: 'crisis', message: 'Sentiment négatif détecté sur Twitter (Marque)', time: 'Il y a 15 min', platform: 'Twitter' },
    { id: 3, type: 'optimization', message: 'Ajustement automatique du planning de publication', time: 'Il y a 1h', platform: 'Instagram' },
    { id: 4, type: 'insight', message: 'Nouvelle tendance identifiée: #SustainableTech', time: 'Il y a 2h', platform: 'LinkedIn' }
  ]);

  // Simulation de mise à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setCognitiveStatus(prev => ({
        omniMind: Math.min(1, Math.max(0.7, prev.omniMind + (Math.random() - 0.5) * 0.05)),
        nexusHive: Math.min(1, Math.max(0.7, prev.nexusHive + (Math.random() - 0.5) * 0.05)),
        novaGenesis: Math.min(1, Math.max(0.7, prev.novaGenesis + (Math.random() - 0.5) * 0.05)),
        synergy: Math.min(1, Math.max(0.7, prev.synergy + (Math.random() - 0.5) * 0.05))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'viral': return 'bg-green-100 text-green-700 border-green-200';
      case 'crisis': return 'bg-red-100 text-red-700 border-red-200';
      case 'optimization': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'insight': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Unifié</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble en temps réel de votre écosystème social</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Temps Réel
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Impressions Totales" 
          value={metrics.impressions} 
          change={12.5} 
          icon={Globe} 
          color="indigo" 
        />
        <MetricCard 
          title="Taux d'Engagement" 
          value={metrics.engagement} 
          change={8.3} 
          icon={Users} 
          color="green" 
        />
        <MetricCard 
          title="Crises Détectées" 
          value={metrics.crises} 
          change={-100} 
          icon={AlertTriangle} 
          color="red" 
        />
        <MetricCard 
          title="Posts Viraux" 
          value={metrics.viralPosts} 
          change={25.0} 
          icon={Zap} 
          color="orange" 
        />
      </div>

      {/* Cognitive Triad Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BrainCircuit className="text-indigo-600" size={24} />
            État de la Triade Cognitive
          </h2>
          <span className="text-sm text-gray-500">Mis à jour en continu</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'OMNI-MIND', value: cognitiveStatus.omniMind, desc: 'Penseur Stratégique' },
            { name: 'NEXUS HIVE', value: cognitiveStatus.nexusHive, desc: 'Mémoire Collective' },
            { name: 'NOVA GENESIS', value: cognitiveStatus.novaGenesis, desc: 'Créateur Disruptif' },
            { name: 'SYNERGIE', value: cognitiveStatus.synergy, desc: 'Intelligence Globale' }
          ].map((module) => (
            <div key={module.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{module.name}</span>
                <span className="text-sm font-bold text-indigo-600">{(module.value * 100).toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                  style={{ width: `${module.value * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{module.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Flux d'Événements en Temps Réel</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                    {event.type.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{event.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{event.time}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600 font-medium">{event.platform}</span>
                    </div>
                  </div>
                  <Activity className="text-gray-400" size={16} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="w-full text-center text-sm text-indigo-600 font-medium hover:text-indigo-700">
              Voir tous les événements →
            </button>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Répartition par Plateforme</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { name: 'Instagram', percentage: 35, color: 'bg-pink-500' },
              { name: 'TikTok', percentage: 28, color: 'bg-black' },
              { name: 'LinkedIn', percentage: 18, color: 'bg-blue-700' },
              { name: 'Twitter/X', percentage: 12, color: 'bg-gray-900' },
              { name: 'YouTube', percentage: 7, color: 'bg-red-600' }
            ].map((platform) => (
              <div key={platform.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{platform.name}</span>
                  <span className="text-gray-500">{platform.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${platform.color} transition-all duration-500`}
                    style={{ width: `${platform.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;

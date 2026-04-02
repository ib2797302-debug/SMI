/**
 * CreativeStudio.tsx
 * Interface de création assistée par IA pour Aethos Social Cloud.
 * Permet la génération, l'optimisation et la simulation de contenu multi-plateforme.
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  Play, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Clock,
  Globe,
  Video,
  Image as ImageIcon,
  Type
} from 'lucide-react';

interface ContentIdea {
  id: string;
  title: string;
  platforms: string[];
  viralScore: number;
  status: 'draft' | 'simulating' | 'ready' | 'published';
}

export const CreativeStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'optimize' | 'simulate'>('generate');
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([
    { id: '1', title: 'Campagne "Behind the Scenes" - Produit X', platforms: ['TikTok', 'Instagram'], viralScore: 0.87, status: 'ready' },
    { id: '2', title: 'Série éducative: Les coulisses de l\'IA', platforms: ['LinkedIn', 'YouTube'], viralScore: 0.92, status: 'simulating' },
    { id: '3', title: 'Challenge utilisateur: #MaRoutineTech', platforms: ['TikTok', 'Twitter'], viralScore: 0.78, status: 'draft' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-700';
      case 'simulating': return 'bg-blue-100 text-blue-700';
      case 'published': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="text-indigo-600" size={32} />
            Studio Créatif IA
          </h1>
          <p className="text-gray-500 mt-1">Générez, optimisez et simulez votre contenu viral</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Sparkles size={20} />
          Générer avec Nova Genesis
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: 'generate', label: 'Génération', icon: Sparkles },
            { id: 'optimize', label: 'Optimisation', icon: TrendingUp },
            { id: 'simulate', label: 'Simulation', icon: Play }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  isActive 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Input/Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de Création</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objectif</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Engagement maximal</option>
                  <option>Notoriété de marque</option>
                  <option>Conversion ventes</option>
                  <option>Éducation audience</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plateformes cibles</label>
                <div className="space-y-2">
                  {['Instagram', 'TikTok', 'LinkedIn', 'Twitter/X', 'YouTube'].map((platform) => (
                    <label key={platform} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" defaultChecked />
                      <span className="text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ton & Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Professionnel', 'Décontracté', 'Humoristique', 'Inspirant', 'Éducatif', 'Provocant'].map((tone) => (
                    <button 
                      key={tone}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors text-left"
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format de contenu</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="p-3 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col items-center gap-2">
                    <Video size={20} className="text-gray-400" />
                    <span className="text-xs">Vidéo</span>
                  </button>
                  <button className="p-3 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col items-center gap-2">
                    <ImageIcon size={20} className="text-gray-400" />
                    <span className="text-xs">Image</span>
                  </button>
                  <button className="p-3 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col items-center gap-2">
                    <Type size={20} className="text-gray-400" />
                    <span className="text-xs">Texte</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
              <Upload className="mx-auto text-gray-400 mb-4" size={32} />
              <p className="text-sm font-medium text-gray-900 mb-1">Glissez-déposez vos assets</p>
              <p className="text-xs text-gray-500">ou cliquez pour parcourir (vidéos, images, documents)</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Generated Ideas & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ideas List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Idées Générées par Nova Genesis</h3>
              <span className="text-sm text-gray-500">{generatedIdeas.length} idées</span>
            </div>
            <div className="divide-y divide-gray-100">
              {generatedIdeas.map((idea) => (
                <div key={idea.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{idea.title}</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {idea.platforms.map((platform) => (
                          <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">{(idea.viralScore * 100).toFixed(0)}%</div>
                      <div className="text-xs text-gray-500">Score Viral</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}>
                        {idea.status === 'simulating' ? '🔄 Simulation en cours' : 
                         idea.status === 'ready' ? '✅ Prêt à publier' : 
                         idea.status === 'published' ? '📤 Publié' : '📝 Brouillon'}
                      </span>
                      {idea.status === 'ready' && (
                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                          <Play size={14} />
                          Lancer la simulation
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Modifier
                      </button>
                      {idea.status === 'ready' && (
                        <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                          <CheckCircle size={16} />
                          Publier
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Preview Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <Play className="text-indigo-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Aperçu de Simulation</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">+245%</div>
                <div className="text-xs text-gray-500 mt-1">Engagement prédit</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">1.2M</div>
                <div className="text-xs text-gray-500 mt-1">Portée estimée</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">48h</div>
                <div className="text-xs text-gray-500 mt-1">Pic viralité</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle size={16} className="text-orange-500" />
              <span>Basé sur 15 simulations Monte Carlo exécutées par Omni-Mind</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeStudio;

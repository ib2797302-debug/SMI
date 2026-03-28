/**
 * AdminCommandCenter.tsx
 * Interface d'administration complète pour Aethos Social Cloud.
 * Gestion des privilèges, monitoring système, configuration et audit.
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Activity, 
  Settings, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Lock,
  Unlock,
  Search,
  Bell
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CREATOR' | 'ANALYST' | 'VIEWER';
  behavioralScore: number;
  riskScore: number;
  status: 'active' | 'suspended' | 'downgraded';
  lastActive: string;
}

interface SystemAlert {
  id: string;
  type: 'security' | 'performance' | 'compliance' | 'info';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const AdminCommandCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'system' | 'audit' | 'config'>('users');
  
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Alice Martin', email: 'alice@company.com', role: 'ADMIN', behavioralScore: 0.95, riskScore: 0.02, status: 'active', lastActive: 'Il y a 2 min' },
    { id: '2', name: 'Bob Chen', email: 'bob@company.com', role: 'CREATOR', behavioralScore: 0.88, riskScore: 0.15, status: 'active', lastActive: 'Il y a 15 min' },
    { id: '3', name: 'Carol Davis', email: 'carol@company.com', role: 'ANALYST', behavioralScore: 0.45, riskScore: 0.72, status: 'downgraded', lastActive: 'Il y a 1h' },
    { id: '4', name: 'David Kim', email: 'david@company.com', role: 'CREATOR', behavioralScore: 0.92, riskScore: 0.05, status: 'active', lastActive: 'Il y a 3h' },
    { id: '5', name: 'Eve Wilson', email: 'eve@company.com', role: 'VIEWER', behavioralScore: 0.15, riskScore: 0.89, status: 'suspended', lastActive: 'Il y a 2j' },
  ]);

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    { id: '1', type: 'security', message: 'Tentative de connexion suspecte détectée (IP: 192.168.x.x)', timestamp: 'Il y a 5 min', severity: 'high' },
    { id: '2', type: 'performance', message: 'Latence cellule eu-west-1: 180ms (seuil: 200ms)', timestamp: 'Il y a 12 min', severity: 'low' },
    { id: '3', type: 'compliance', message: 'Audit GDPR complété avec succès - 0 violation', timestamp: 'Il y a 1h', severity: 'info' },
    { id: '4', type: 'security', message: 'Downgrade automatique: Utilisateur #3 (riskScore > 0.7)', timestamp: 'Il y a 1h', severity: 'medium' },
  ]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700';
      case 'CREATOR': return 'bg-blue-100 text-blue-700';
      case 'ANALYST': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'downgraded': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const handlePrivilegeAdjustment = (userId: string, action: 'upgrade' | 'downgrade' | 'suspend') => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: action === 'suspend' ? 'suspended' : action === 'downgrade' ? 'downgraded' : 'active',
          role: action === 'upgrade' && user.role !== 'ADMIN' ? 
            (user.role === 'VIEWER' ? 'CREATOR' : user.role === 'CREATOR' ? 'ANALYST' : 'ADMIN') :
            action === 'downgrade' && user.role !== 'VIEWER' ?
            (user.role === 'ADMIN' ? 'ANALYST' : user.role === 'ANALYST' ? 'CREATOR' : 'VIEWER') :
            user.role
        };
      }
      return user;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="text-indigo-600" size={32} />
            Command Center Admin
          </h1>
          <p className="text-gray-500 mt-1">Gestion des privilèges, monitoring et conformité</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Settings size={18} />
            Configuration Globale
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp size={16} />
            <span>+12% cette semaine</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Lock className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>Niveau d'accès maximal</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alertes Actives</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-orange-600">
            <span>2 haute priorité</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conformité</p>
              <p className="text-2xl font-bold text-gray-900">98%</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <span>SOC2 Type II en cours</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: 'users', label: 'Gestion Utilisateurs', icon: Users },
            { id: 'system', label: 'Monitoring Système', icon: Activity },
            { id: 'audit', label: 'Audit & Conformité', icon: Shield },
            { id: 'config', label: 'Configuration IA', icon: Settings }
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

      {/* Main Content */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher un utilisateur..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option>Tous les rôles</option>
              <option>ADMIN</option>
              <option>CREATOR</option>
              <option>ANALYST</option>
              <option>VIEWER</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option>Tous les statuts</option>
              <option>Actif</option>
              <option>Suspendu</option>
              <option>Downgradé</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Behavioral Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dernière Activité</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className={`h-full ${user.behavioralScore > 0.7 ? 'bg-green-500' : user.behavioralScore > 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${user.behavioralScore * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{(user.behavioralScore * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className={`h-full ${user.riskScore < 0.3 ? 'bg-green-500' : user.riskScore < 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${user.riskScore * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{(user.riskScore * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? '✓ Actif' : user.status === 'suspended' ? '✕ Suspendu' : '⚠ Downgradé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status !== 'suspended' && (
                          <button 
                            onClick={() => handlePrivilegeAdjustment(user.id, 'downgrade')}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Downgrader les privilèges"
                          >
                            <Lock size={16} />
                          </button>
                        )}
                        {user.status !== 'active' && (
                          <button 
                            onClick={() => handlePrivilegeAdjustment(user.id, 'upgrade')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Restaurer les privilèges"
                          >
                            <Unlock size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handlePrivilegeAdjustment(user.id, user.status === 'suspended' ? 'upgrade' : 'suspend')}
                          className={`p-2 rounded-lg transition-colors ${user.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                          title={user.status === 'suspended' ? 'Réactiver' : 'Suspendre'}
                        >
                          {user.status === 'suspended' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Alertes Système en Temps Réel</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${getSeverityColor(alert.severity)}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                          alert.type === 'security' ? 'bg-red-100 text-red-700' :
                          alert.type === 'performance' ? 'bg-blue-100 text-blue-700' :
                          alert.type === 'compliance' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {alert.type}
                        </span>
                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{alert.message}</p>
                    </div>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                      Voir détails →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'audit' || activeTab === 'config') && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <Settings className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Module en cours de déploiement</h3>
          <p className="text-gray-500">Cette fonctionnalité sera disponible dans la prochaine mise à jour.</p>
        </div>
      )}
    </div>
  );
};

export default AdminCommandCenter;

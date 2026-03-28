/**
 * GlobalNavShell.tsx
 * Coquille de navigation intelligente et adaptative.
 * S'adapte dynamiquement selon le rôle (Admin, Creator, Analyst) et le contexte cognitif.
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  ShieldAlert, 
  Settings, 
  BrainCircuit, 
  MessageSquare,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

// Types de rôles et permissions
type UserRole = 'ADMIN' | 'CREATOR' | 'ANALYST' | 'VIEWER';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
  path: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'CREATOR', 'ANALYST'], path: '/dashboard' },
  { id: 'studio', label: 'Studio Créatif', icon: Zap, roles: ['CREATOR', 'ADMIN'], path: '/studio' },
  { id: 'hive', label: 'Ruche (Hive)', icon: Users, roles: ['ADMIN', 'ANALYST'], path: '/hive' },
  { id: 'omni', label: 'Omni-Mind', icon: BrainCircuit, roles: ['ADMIN'], path: '/omni', badge: 'LIVE' },
  { id: 'governance', label: 'Gouvernance', icon: ShieldAlert, roles: ['ADMIN'], path: '/governance' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, roles: ['CREATOR', 'ADMIN'], path: '/messages' },
  { id: 'settings', label: 'Paramètres', icon: Settings, roles: ['ADMIN', 'CREATOR'], path: '/settings' },
];

interface GlobalNavShellProps {
  currentUserRole: UserRole;
  cognitiveStatus?: 'NORMAL' | 'HIGH_LOAD' | 'CRISIS';
  children: React.ReactNode;
}

export const GlobalNavShell: React.FC<GlobalNavShellProps> = ({ 
  currentUserRole, 
  cognitiveStatus = 'NORMAL',
  children 
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activePath, setActivePath] = useState('/dashboard');

  // Filtrer les éléments selon le rôle
  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(currentUserRole));

  // Déterminer la couleur d'accentuation selon l'état cognitif
  const getStatusColor = () => {
    switch (cognitiveStatus) {
      case 'CRISIS': return 'border-red-500 bg-red-50/50';
      case 'HIGH_LOAD': return 'border-orange-500 bg-orange-50/50';
      default: return 'border-indigo-600 bg-white';
    }
  };

  return (
    <div className={`flex h-screen w-full transition-colors duration-300 ${getStatusColor()}`}>
      {/* Sidebar Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white/90 backdrop-blur-xl border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 xl:w-64'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-center border-b border-gray-100 px-4">
            <div className="flex items-center gap-2 font-bold text-xl text-indigo-900">
              <BrainCircuit className="text-indigo-600" size={28} />
              <span className={`${!isSidebarOpen && 'lg:hidden'} xl:inline`}>AETHOS</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePath(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                  <span className={`${!isSidebarOpen && 'lg:hidden'} xl:inline`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={`
                      ml-auto text-xs px-2 py-0.5 rounded-full
                      ${item.badge === 'LIVE' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600'}
                      ${!isSidebarOpen && 'lg:hidden'} xl:inline
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile / Status */}
          <div className="p-4 border-t border-gray-100">
            <div className={`flex items-center gap-3 p-2 rounded-lg ${isSidebarOpen || 'lg:flex' ? 'flex' : 'justify-center'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                {currentUserRole[0]}
              </div>
              <div className={`${!isSidebarOpen && 'lg:hidden'} xl:block`}>
                <p className="text-sm font-medium text-gray-900">Utilisateur {currentUserRole}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${cognitiveStatus === 'NORMAL' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {cognitiveStatus === 'NORMAL' ? 'Système Optimal' : 'Attention Requisite'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* Top Header (Search & Global Actions) */}
        <header className="h-16 bg-white/50 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {visibleItems.find(i => i.path === activePath)?.label || 'Dashboard'}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-500 mr-2">Recherche globale...</span>
              <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-400">⌘K</kbd>
            </div>
            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
              <MessageSquare size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default GlobalNavShell;

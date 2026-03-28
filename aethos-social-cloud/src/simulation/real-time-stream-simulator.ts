/**
 * AETHOS SOCIAL CLOUD - REAL-TIME DATA STREAM SIMULATOR
 * Simule les flux entrants de 8 plateformes sociales pour le Dashboard Pilote
 * Génère : Posts, Métriques, Alertes de Crise, Insights IA
 */

export interface SocialStreamEvent {
  id: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'pinterest' | 'snapchat';
  type: 'post' | 'comment' | 'mention' | 'crisis' | 'viral_spike';
  content: string;
  metrics: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    engagementRate: number;
  };
  aiAnalysis: {
    sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
    viralScore: number; // 0-100
    recommendedAction: string;
    cognitiveLoad: number; // Charge sur OMNI-MIND
  };
  timestamp: number;
}

export class RealTimeStreamSimulator {
  private platforms: SocialStreamEvent['platform'][] = [
    'youtube', 'tiktok', 'instagram', 'linkedin', 'twitter', 'facebook', 'pinterest', 'snapchat'
  ];

  private crisisKeywords = ['scandale', 'bug', 'erreur', 'plainte', 'danger', 'fake'];
  private viralTriggers = ['incroyable', 'wow', 'amour', 'gratuit', 'gagnant', 'exclusive'];

  constructor() {}

  /**
   * Génère un événement social réaliste
   */
  generateEvent(): SocialStreamEvent {
    const platform = this.platforms[Math.floor(Math.random() * this.platforms.length)];
    const isCrisis = Math.random() < 0.05; // 5% de chance de crise
    const isViral = Math.random() < 0.10; // 10% de chance de pic viral

    let type: SocialStreamEvent['type'] = 'post';
    let sentiment: SocialStreamEvent['aiAnalysis']['sentiment'] = 'neutral';
    let viralScore = Math.floor(Math.random() * 40) + 10; // Base 10-50

    if (isCrisis) {
      type = 'crisis';
      sentiment = 'critical';
      viralScore = Math.floor(Math.random() * 30) + 70; // 70-100
    } else if (isViral) {
      type = 'viral_spike';
      sentiment = 'positive';
      viralScore = Math.floor(Math.random() * 25) + 75; // 75-100
    }

    const baseViews = isViral ? 50000 : Math.floor(Math.random() * 5000);
    
    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      platform,
      type,
      content: this.generateContent(platform, isCrisis, isViral),
      metrics: {
        views: baseViews,
        likes: Math.floor(baseViews * (Math.random() * 0.1)),
        shares: Math.floor(baseViews * (Math.random() * 0.05)),
        comments: Math.floor(baseViews * (Math.random() * 0.02)),
        engagementRate: parseFloat((Math.random() * 5 + (isViral ? 5 : 0)).toFixed(2))
      },
      aiAnalysis: {
        sentiment,
        viralScore,
        recommendedAction: this.getRecommendedAction(type, sentiment),
        cognitiveLoad: isCrisis ? 0.9 : isViral ? 0.7 : 0.2
      },
      timestamp: Date.now()
    };
  }

  private generateContent(platform: string, isCrisis: boolean, isViral: boolean): string {
    if (isCrisis) {
      const topics = ['Problème de facturation signalé', 'Bug critique sur l\'app', 'Plainte client virale'];
      return `${topics[Math.floor(Math.random() * topics.length)]} - Urgence détectée.`;
    }
    if (isViral) {
      const hooks = ['Cette astuce change tout !', 'Incroyable découverte', 'Offre exclusive limitée'];
      return `${hooks[Math.floor(Math.random() * hooks.length)]} #Trending #${platform}`;
    }
    
    const normalPosts = [
      'Nouvelle mise à jour disponible',
      'Merci pour vos retours positifs',
      'Découvrez notre dernier article de blog',
      'Coulisses de notre équipe',
      'Question du jour : quel est votre outil préféré ?'
    ];
    return normalPosts[Math.floor(Math.random() * normalPosts.length)];
  }

  private getRecommendedAction(type: string, sentiment: string): string {
    if (type === 'crisis') return 'ACTIVER PROTOCOLE CRISE : Notification immédiate Admin + Brouillon réponse';
    if (type === 'viral_spike') return 'BOOSTER : Augmenter budget pub + Préparer contenu suite';
    if (sentiment === 'negative') return 'SURVEILLER : Analyser tendance avant réaction';
    return 'ARCHIVER : Performance normale, aucun action requise';
  }

  /**
   * Simule un flux continu d'événements
   */
  startStream(callback: (event: SocialStreamEvent) => void, intervalMs: number = 2000) {
    console.log('🟢 Aethos Stream Simulator Started...');
    
    // Événement initial immédiat
    callback(this.generateEvent());

    // Flux continu
    setInterval(() => {
      const event = this.generateEvent();
      callback(event);
      
      // Log discret pour le débogage console
      if (event.type === 'crisis') {
        console.warn(`🚨 CRISIS DETECTED on ${event.platform.toUpperCase()}: ${event.content}`);
      } else if (event.type === 'viral_spike') {
        console.log(`🚀 VIRAL SPIKE on ${event.platform.toUpperCase()}: Score ${event.aiAnalysis.viralScore}`);
      }
    }, intervalMs);
  }
}

// Export singleton pour utilisation globale
export const streamSimulator = new RealTimeStreamSimulator();

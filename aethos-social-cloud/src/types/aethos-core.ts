/**
 * AETHOS SOCIAL CLOUD - CORE TYPES
 * 
 * Définit le contrat pour la plateforme autonome d'intelligence sociale.
 * Adapté de whatsMaster Autonomous OS avec focus sur:
 * - Data Mesh & contrats de données
 * - Gouvernance native multi-régime
 * - Creator marketing intégré
 * - Social Data Warehouse unifié
 */

// ============================================================================
// PILIER 1: DATA MESH & CONTRATS DE DONNÉES
// ============================================================================

export type DataDomain = 'social-listening' | 'creator-data' | 'crm' | 'analytics' | 'governance';

export interface DataContract {
  id: string;
  domain: DataDomain;
  version: string;
  schema: ProtobufSchema;
  qualityRules: DataQualityRule[];
  sla: {
    freshness: number; // en secondes
    availability: number; // 0.99 à 0.9999
    accuracy: number; // 0.0 à 1.0
  };
  ownership: {
    team: string;
    steward: string;
    contact: string;
  };
}

export interface ProtobufSchema {
  messageType: string;
  fields: Array<{
    name: string;
    type: 'string' | 'int32' | 'int64' | 'double' | 'bool' | 'repeated' | 'message';
    repeated?: boolean;
    nestedType?: string;
  }>;
}

export interface DataQualityRule {
  id: string;
  type: 'completeness' | 'accuracy' | 'consistency' | 'timeliness';
  threshold: number;
  actionOnFailure: 'alert' | 'block' | 'quarantine';
}

// ============================================================================
// PILIER 2: IA AGENTIQUE POUR INTELLIGENCE SOCIALE
// ============================================================================

export type SocialAgentRole = 
  | 'listener'      // Surveillance réseaux sociaux
  | 'analyst'       // Analyse sentiment, tendances
  | 'creator'       // Création de contenu
  | 'publisher'     // Publication multi-canaux
  | 'engagement'    // Interaction avec audience
  | 'influencer-scout'  // Détection influenceurs
  | 'compliance'    // Vérification conformité
  | 'orchestrator'; // Coordination multi-agents

export interface SocialAgentConfig {
  id: string;
  role: SocialAgentRole;
  persona: {
    name: string;
    brandVoice: 'professional' | 'casual' | 'witty' | 'empathetic' | 'authoritative';
    languagePreferences: string[]; // Ex: ['fr', 'en', 'zh']
    culturalAdaptation?: string; // Ex: 'China-specific', 'EU-GDPR'
  };
  capabilities: SocialAgentCapability[];
  permissions: SocialPlatformPermission[];
  budgetLimit: {
    daily: number;
    perCampaign: number;
    currency: 'USD' | 'EUR';
  };
  complianceProfile: ComplianceRegime;
}

export interface SocialAgentCapability {
  id: string;
  name: string;
  type: 'listening' | 'analysis' | 'creation' | 'publishing' | 'engagement' | 'reporting';
  platforms: SocialPlatform[];
  confidenceThreshold: number;
  costPerCall: number;
}

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'wechat' | 'weibo' | 'youtube';

export interface SocialPlatformPermission {
  platform: SocialPlatform;
  scopes: string[]; // Ex: ['read_posts', 'write_posts', 'read_analytics']
  accountId?: string; // Compte spécifique si applicable
}

// ============================================================================
// PILIER 3: GOUVERNANCE NATIVE MULTI-RÉGIME
// ============================================================================

export type ComplianceRegime = 'GDPR' | 'CCPA' | 'PIPL' | 'HIPAA' | 'FINRA' | 'SOC2' | 'ISO27001';

export interface GovernancePolicy {
  id: string;
  name: string;
  regime: ComplianceRegime;
  rules: GovernanceRule[];
  enforcementLevel: 'advisory' | 'mandatory' | 'blocking';
  regions: string[]; // Ex: ['EU', 'US-CA', 'CN']
  industries: string[]; // Ex: ['finance', 'pharma', 'energy']
}

export interface GovernanceRule {
  id: string;
  category: 'data-privacy' | 'content-compliance' | 'disclosure' | 'retention' | 'audit';
  description: string;
  condition: string; // Expression logique (ex: "contains(PII) AND !hasConsent()")
  action: 'block' | 'redact' | 'flag' | 'require-approval' | 'log';
  autoApply: boolean;
}

export interface ContentComplianceCheck {
  contentId: string;
  checks: Array<{
    ruleId: string;
    status: 'pass' | 'fail' | 'warning';
    details?: string;
    requiresHumanReview: boolean;
  }>;
  overallStatus: 'approved' | 'rejected' | 'pending-review';
  checkedAt: number;
  checkedBy: string; // Agent ID ou User ID
}

// ============================================================================
// PILIER 4: CREATOR MARKETING & INFLUENCEURS
// ============================================================================

export interface CreatorProfile {
  id: string;
  socialHandle: string;
  platforms: CreatorPlatformPresence[];
  audience: {
    totalFollowers: number;
    demographics: {
      ageRanges: Record<string, number>; // Ex: {'18-24': 0.35, '25-34': 0.45}
      genders: Record<string, number>;
      topCountries: string[];
    };
    engagementRate: number; // 0.0 à 1.0
    authenticity: number; // Score 0.0 à 1.0 (détection fake followers)
  };
  categories: string[]; // Ex: ['tech', 'lifestyle', 'beauty']
  brandSafety: {
    score: number; // 0.0 à 1.0
    flags: string[]; // Ex: ['controversial-content', 'political']
  };
  rates: {
    post: number;
    story: number;
    video: number;
    currency: 'USD' | 'EUR';
  };
  complianceStatus: ComplianceRegime[]; // Régimes de conformité acceptés
}

export interface CreatorPlatformPresence {
  platform: SocialPlatform;
  handle: string;
  followers: number;
  avgEngagement: number;
  verified: boolean;
}

export interface InfluencerCampaign {
  id: string;
  name: string;
  brand: string;
  objectives: string[];
  targetCreators: string[]; // Creator IDs
  selectedCreators: string[]; // Creator IDs confirmés
  budget: {
    total: number;
    allocated: number;
    currency: 'USD' | 'EUR';
  };
  timeline: {
    startDate: number;
    endDate: number;
  };
  deliverables: CampaignDeliverable[];
  complianceRequirements: ComplianceRegime[];
  performanceMetrics: {
    impressions?: number;
    engagements?: number;
    conversions?: number;
    roi?: number;
  };
}

export interface CampaignDeliverable {
  type: 'post' | 'story' | 'video' | 'live' | 'giveaway';
  platform: SocialPlatform;
  quantity: number;
  dueDate: number;
  requirements: string[]; // Ex: ['include-hashtag', 'mention-brand', 'disclose-sponsored']
  status: 'pending' | 'in-progress' | 'submitted' | 'approved' | 'rejected';
}

// ============================================================================
// SOCIAL DATA WAREHOUSE UNIFIÉ
// ============================================================================

export interface UnifiedSocialPost {
  id: string;
  platform: SocialPlatform;
  author: {
    id: string;
    handle: string;
    isVerified: boolean;
    followerCount?: number;
  };
  content: {
    text: string;
    media: Array<{
      type: 'image' | 'video' | 'gif' | 'link';
      url: string;
      thumbnailUrl?: string;
    }>;
    hashtags: string[];
    mentions: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  sentiment: {
    score: number; // -1.0 à 1.0
    label: 'negative' | 'neutral' | 'positive';
    confidence: number;
  };
  topics: string[]; // Catégories/thèmes détectés
  collectedAt: number;
  dataResidency: DataResidencyZone;
  complianceFlags: string[]; // Règles de gouvernance appliquées
}

export type DataResidencyZone = 'EU-West' | 'US-East' | 'APAC-SG' | 'China-Mainland' | 'Local-OnPrem';

// ============================================================================
// CELL-BASED ARCHITECTURE & MULTI-RÉGION
// ============================================================================

export interface CellConfig {
  cellId: string;
  region: string;
  dataResidency: DataResidencyZone;
  capacity: {
    maxPostsPerSecond: number;
    maxConcurrentAgents: number;
    maxStorageGB: number;
  };
  status: 'active' | 'draining' | 'offline';
  failoverTargets: string[]; // Cell IDs de repli
}

export interface MultiRegionRouting {
  primaryCell: string;
  secondaryCells: string[];
  routingStrategy: 'latency' | 'residency' | 'cost' | 'hybrid';
  healthChecks: {
    intervalMs: number;
    timeoutMs: number;
    unhealthyThreshold: number;
  };
}

// ============================================================================
// PAY-PER-USE & COST TRACKING
// ============================================================================

export interface UsageRecord {
  id: string;
  tenantId: string;
  timestamp: number;
  action: 'post-processed' | 'agent-execution' | 'storage-gb' | 'api-call';
  quantity: number;
  unitPrice: number; // En USD
  totalCost: number;
  metadata: {
    platform?: SocialPlatform;
    agentId?: string;
    campaignId?: string;
  };
}

export interface CostProjection {
  period: 'daily' | 'weekly' | 'monthly';
  estimatedCost: number;
  breakdown: {
    processing: number;
    storage: number;
    agents: number;
    api: number;
  };
  trends: {
    dailyAverage: number;
    peakDay?: string;
    savingsOpportunities: Array<{
      recommendation: string;
      potentialSavings: number;
    }>;
  };
}

// ============================================================================
// EDGE RENDERING & WASM
// ============================================================================

export interface EdgeRenderConfig {
  templateId: string;
  wasmModule: string; // URL du module WASM
  assets: {
    fonts: string[];
    images: string[];
    styles: string;
  };
  targetLatencyMs: number; // < 200ms
  cacheTTLSeconds: number;
}

export interface RenderedVisual {
  id: string;
  url: string;
  format: 'png' | 'jpg' | 'webp' | 'mp4';
  dimensions: {
    width: number;
    height: number;
  };
  renderTimeMs: number;
  edgeLocation: string; // Code région edge (ex: 'CDG', 'IAD')
  cached: boolean;
}

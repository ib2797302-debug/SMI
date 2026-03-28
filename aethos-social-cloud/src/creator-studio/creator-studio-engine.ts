/**
 * Aethos Creator Studio MVP
 * Native Influencer Marketing Workflow
 * 
 * Features:
 * - Creator discovery & scoring
 * - Campaign management
 * - Brand safety analysis
 * - Contract & payment handling
 * - Performance tracking
 */

import { EventEmitter } from 'events';
import { createHash } from 'crypto';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type CreatorTier = 'nano' | 'micro' | 'mid' | 'macro' | 'mega';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
export type CollaborationType = 'sponsored_post' | 'affiliate' | 'brand_ambassador' | 'product_review' | 'takeover';

export interface Creator {
  id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'wechat' | 'weibo' | 'xiaohongshu';
  username: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  followerCount: number;
  followingCount: number;
  engagementRate: number;
  averageLikes: number;
  averageComments: number;
  averageViews: number;
  tier: CreatorTier;
  categories: string[];
  location: {
    country: string;
    city?: string;
  };
  audienceDemographics: {
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    topLocations: Record<string, number>;
    interests: string[];
  };
  brandSafetyScore: number;
  authenticityScore: number;
  responseRate?: number;
  averageResponseTime?: number; // hours
  rateCard: {
    post?: number;
    story?: number;
    video?: number;
    reel?: number;
    campaign?: number;
  };
  contactInfo?: {
    email?: string;
    agency?: string;
    manager?: string;
  };
  socialLinks: Record<string, string>;
  recentPosts: CreatorPost[];
  collaborations: number;
  rating: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatorPost {
  id: string;
  platform: string;
  content: string;
  mediaUrls: string[];
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  engagementRate: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  brandedContent: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  brand: {
    name: string;
    logoUrl?: string;
    industry: string;
  };
  objectives: string[];
  targetAudience: {
    ageRange: { min: number; max: number };
    genders: string[];
    locations: string[];
    interests: string[];
  };
  budget: {
    total: number;
    allocated: number;
    currency: string;
  };
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: CampaignMilestone[];
  };
  deliverables: CampaignDeliverable[];
  creators: CampaignCreator[];
  status: CampaignStatus;
  metrics: {
    impressions: number;
    engagements: number;
    clicks: number;
    conversions: number;
    roi: number;
  };
  guidelines: {
    do's: string[];
    don'ts: string[];
    hashtags: string[];
    mentions: string[];
    disclosureRequired: boolean;
  };
  approvalWorkflow: {
    requiresApproval: boolean;
    approvers: string[];
    autoApproveThreshold?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignMilestone {
  id: string;
  name: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
  deliverables: string[];
}

export interface CampaignDeliverable {
  id: string;
  type: CollaborationType;
  platform: string;
  quantity: number;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  submittedUrl?: string;
  feedback?: string;
}

export interface CampaignCreator {
  creatorId: string;
  role: 'primary' | 'secondary' | 'backup';
  status: 'invited' | 'negotiating' | 'confirmed' | 'completed' | 'cancelled';
  compensation: {
    type: 'fixed' | 'performance' | 'hybrid';
    amount: number;
    currency: string;
    bonusStructure?: Record<string, number>;
  };
  contract: {
    signed: boolean;
    signedAt?: Date;
    terms: string;
  };
  deliverables: string[]; // IDs of deliverables assigned to this creator
  performance: {
    postsPublished: number;
    totalImpressions: number;
    totalEngagements: number;
    conversionRate: number;
  };
}

export interface CreatorSearchFilters {
  platforms?: string[];
  tiers?: CreatorTier[];
  categories?: string[];
  location?: {
    country?: string;
    cities?: string[];
  };
  followerRange?: {
    min: number;
    max: number;
  };
  engagementRateRange?: {
    min: number;
    max: number;
  };
  brandSafetyMinScore?: number;
  authenticityMinScore?: number;
  audienceAgeGroups?: string[];
  audienceGenders?: string[];
  audienceLocations?: string[];
  rateRange?: {
    min: number;
    max: number;
  };
  availability?: 'available' | 'busy' | 'exclusive';
}

export interface CreatorScoringResult {
  creatorId: string;
  overallScore: number;
  breakdown: {
    reachScore: number;
    engagementScore: number;
    relevanceScore: number;
    authenticityScore: number;
    brandSafetyScore: number;
    valueScore: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface BrandSafetyAnalysis {
  creatorId: string;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    controversialContent: { score: number; incidents: string[] };
    languageAppropriateness: { score: number; issues: string[] };
    brandAlignment: { score: number; mismatches: string[] };
    audienceQuality: { score: number; botPercentage: number };
    pastControversies: { score: number; incidents: string[] };
  };
  flaggedContent: Array<{
    postId: string;
    url: string;
    reason: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: Date;
  }>;
  recommendation: 'approve' | 'review' | 'reject';
  analyzedAt: Date;
}

export interface CreatorStudioMetrics {
  totalCreators: number;
  activeCampaigns: number;
  totalBudget: number;
  averageROI: number;
  topPerformingCreators: string[];
  pendingApprovals: number;
  upcomingDeadlines: number;
}

// ============================================================================
// CREATOR STUDIO ENGINE CLASS
// ============================================================================

export class CreatorStudioEngine extends EventEmitter {
  private creators: Map<string, Creator>;
  private campaigns: Map<string, Campaign>;
  private brandSafetyCache: Map<string, BrandSafetyAnalysis>;

  constructor() {
    super();
    this.creators = new Map();
    this.campaigns = new Map();
    this.brandSafetyCache = new Map();
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Add sample creators
    const sampleCreators: Creator[] = [
      {
        id: 'creator-001',
        platform: 'instagram',
        username: 'lifestyle_emma',
        displayName: 'Emma Lifestyle',
        bio: 'Lifestyle & Travel Content Creator ✈️ | Brand Partnerships 📧',
        followerCount: 125000,
        followingCount: 850,
        engagementRate: 4.2,
        averageLikes: 5250,
        averageComments: 180,
        averageViews: 45000,
        tier: 'micro',
        categories: ['lifestyle', 'travel', 'fashion'],
        location: { country: 'US', city: 'Los Angeles' },
        audienceDemographics: {
          ageGroups: { '18-24': 0.35, '25-34': 0.45, '35-44': 0.15, '45+': 0.05 },
          genders: { female: 0.72, male: 0.28 },
          topLocations: { US: 0.55, UK: 0.15, CA: 0.10, AU: 0.08, other: 0.12 },
          interests: ['fashion', 'travel', 'beauty', 'wellness', 'photography'],
        },
        brandSafetyScore: 0.92,
        authenticityScore: 0.88,
        responseRate: 0.85,
        averageResponseTime: 4,
        rateCard: { post: 1500, story: 800, reel: 2000, campaign: 5000 },
        contactInfo: { email: 'partnerships@emma.com', agency: 'Creator Collective' },
        socialLinks: { instagram: '@lifestyle_emma', tiktok: '@emma_lifestyle' },
        recentPosts: [],
        collaborations: 24,
        rating: 4.7,
        verified: true,
        createdAt: new Date('2022-03-15'),
        updatedAt: new Date(),
      },
      {
        id: 'creator-002',
        platform: 'tiktok',
        username: 'tech_marcus',
        displayName: 'Marcus Tech Reviews',
        bio: 'Tech Reviews & Gadgets 📱 | Honest Opinions | Business: marcus@techreviews.com',
        followerCount: 450000,
        followingCount: 320,
        engagementRate: 6.8,
        averageLikes: 30600,
        averageComments: 1250,
        averageViews: 380000,
        tier: 'mid',
        categories: ['technology', 'gadgets', 'reviews'],
        location: { country: 'UK', city: 'London' },
        audienceDemographics: {
          ageGroups: { '18-24': 0.45, '25-34': 0.38, '35-44': 0.12, '45+': 0.05 },
          genders: { male: 0.68, female: 0.32 },
          topLocations: { UK: 0.40, US: 0.30, DE: 0.10, FR: 0.08, other: 0.12 },
          interests: ['technology', 'gaming', 'science', 'innovation', 'startups'],
        },
        brandSafetyScore: 0.95,
        authenticityScore: 0.91,
        responseRate: 0.92,
        averageResponseTime: 2,
        rateCard: { video: 3500, campaign: 12000 },
        contactInfo: { email: 'marcus@techreviews.com' },
        socialLinks: { tiktok: '@tech_marcus', youtube: '@MarcusTechReviews' },
        recentPosts: [],
        collaborations: 38,
        rating: 4.9,
        verified: true,
        createdAt: new Date('2021-08-20'),
        updatedAt: new Date(),
      },
    ];

    sampleCreators.forEach(creator => {
      this.creators.set(creator.id, creator);
    });
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  /**
   * Search creators with advanced filters
   */
  async searchCreators(filters: CreatorSearchFilters, options?: { limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }): Promise<Creator[]> {
    const limit = options?.limit || 50;
    const sortBy = options?.sortBy || 'engagementRate';
    const sortOrder = options?.sortOrder || 'desc';

    let results = Array.from(this.creators.values());

    // Apply filters
    if (filters.platforms && filters.platforms.length > 0) {
      results = results.filter(c => filters.platforms!.includes(c.platform));
    }

    if (filters.tiers && filters.tiers.length > 0) {
      results = results.filter(c => filters.tiers!.includes(c.tier));
    }

    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(c => c.categories.some(cat => filters.categories!.includes(cat)));
    }

    if (filters.location?.country) {
      results = results.filter(c => c.location.country === filters.location!.country);
    }

    if (filters.followerRange) {
      results = results.filter(c => 
        c.followerCount >= filters.followerRange!.min && 
        c.followerCount <= filters.followerRange!.max
      );
    }

    if (filters.engagementRateRange) {
      results = results.filter(c => 
        c.engagementRate >= filters.engagementRateRange!.min && 
        c.engagementRate <= filters.engagementRateRange!.max
      );
    }

    if (filters.brandSafetyMinScore) {
      results = results.filter(c => c.brandSafetyScore >= filters.brandSafetyMinScore!);
    }

    if (filters.authenticityMinScore) {
      results = results.filter(c => c.authenticityScore >= filters.authenticityMinScore!);
    }

    // Sort results
    results.sort((a, b) => {
      const aValue = (a as any)[sortBy] || 0;
      const bValue = (b as any)[sortBy] || 0;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    // Limit results
    return results.slice(0, limit);
  }

  /**
   * Get creator by ID
   */
  getCreator(creatorId: string): Creator | undefined {
    return this.creators.get(creatorId);
  }

  /**
   * Score a creator for campaign fit
   */
  async scoreCreatorForCampaign(creatorId: string, campaign: Campaign): Promise<CreatorScoringResult> {
    const creator = this.creators.get(creatorId);
    
    if (!creator) {
      throw new Error(`Creator ${creatorId} not found`);
    }

    // Calculate component scores
    const reachScore = this.calculateReachScore(creator, campaign);
    const engagementScore = this.calculateEngagementScore(creator);
    const relevanceScore = this.calculateRelevanceScore(creator, campaign);
    const authenticityScore = creator.authenticityScore * 100;
    const brandSafetyScore = creator.brandSafetyScore * 100;
    const valueScore = this.calculateValueScore(creator, campaign);

    // Weight the scores
    const weights = {
      reach: 0.20,
      engagement: 0.25,
      relevance: 0.25,
      authenticity: 0.10,
      brandSafety: 0.15,
      value: 0.05,
    };

    const overallScore = 
      reachScore * weights.reach +
      engagementScore * weights.engagement +
      relevanceScore * weights.relevance +
      authenticityScore * weights.authenticity +
      brandSafetyScore * weights.brandSafety +
      valueScore * weights.value;

    // Generate insights
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    if (engagementScore > 80) strengths.push('Exceptional engagement rate');
    if (relevanceScore > 80) strengths.push('High audience relevance to campaign');
    if (brandSafetyScore > 90) strengths.push('Excellent brand safety record');
    if (authenticityScore > 85) strengths.push('Strong authentic following');

    if (reachScore < 50) weaknesses.push('Limited reach for campaign goals');
    if (valueScore < 60) weaknesses.push('Above-average cost per engagement');
    if (brandSafetyScore < 80) weaknesses.push('Some brand safety concerns');

    if (overallScore > 85) recommendations.push('Highly recommended for this campaign');
    else if (overallScore > 70) recommendations.push('Good fit with minor considerations');
    else recommendations.push('Consider alternative creators');

    return {
      creatorId,
      overallScore: Math.round(overallScore),
      breakdown: {
        reachScore: Math.round(reachScore),
        engagementScore: Math.round(engagementScore),
        relevanceScore: Math.round(relevanceScore),
        authenticityScore: Math.round(authenticityScore),
        brandSafetyScore: Math.round(brandSafetyScore),
        valueScore: Math.round(valueScore),
      },
      strengths,
      weaknesses,
      recommendations,
    };
  }

  /**
   * Analyze brand safety for a creator
   */
  async analyzeBrandSafety(creatorId: string): Promise<BrandSafetyAnalysis> {
    const creator = this.creators.get(creatorId);
    
    if (!creator) {
      throw new Error(`Creator ${creatorId} not found`);
    }

    // Check cache first
    const cached = this.brandSafetyCache.get(creatorId);
    if (cached && (Date.now() - cached.analyzedAt.getTime()) < 86400000) { // 24 hours
      return cached;
    }

    // Perform analysis (simplified for MVP)
    const controversialContentScore = 0.95;
    const languageAppropriatenessScore = 0.98;
    const brandAlignmentScore = 0.92;
    const audienceQualityScore = 0.88;
    const pastControversiesScore = 1.0;

    const overallScore = (
      controversialContentScore * 0.25 +
      languageAppropriatenessScore * 0.20 +
      brandAlignmentScore * 0.20 +
      audienceQualityScore * 0.20 +
      pastControversiesScore * 0.15
    );

    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    let recommendation: 'approve' | 'review' | 'reject';

    if (overallScore >= 0.90) {
      riskLevel = 'low';
      recommendation = 'approve';
    } else if (overallScore >= 0.75) {
      riskLevel = 'medium';
      recommendation = 'review';
    } else if (overallScore >= 0.60) {
      riskLevel = 'high';
      recommendation = 'review';
    } else {
      riskLevel = 'critical';
      recommendation = 'reject';
    }

    const analysis: BrandSafetyAnalysis = {
      creatorId,
      overallScore,
      riskLevel,
      factors: {
        controversialContent: {
          score: controversialContentScore,
          incidents: [],
        },
        languageAppropriateness: {
          score: languageAppropriatenessScore,
          issues: [],
        },
        brandAlignment: {
          score: brandAlignmentScore,
          mismatches: [],
        },
        audienceQuality: {
          score: audienceQualityScore,
          botPercentage: 100 - audienceQualityScore * 100,
        },
        pastControversies: {
          score: pastControversiesScore,
          incidents: [],
        },
      },
      flaggedContent: [],
      recommendation,
      analyzedAt: new Date(),
    };

    // Cache the result
    this.brandSafetyCache.set(creatorId, analysis);

    this.emit('brand-safety:analyzed', analysis);
    return analysis;
  }

  /**
   * Create a new campaign
   */
  async createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Promise<Campaign> {
    const campaign: Campaign = {
      ...campaignData,
      id: `campaign-${createHash('sha256').update(`${campaignData.name}-${Date.now()}`).digest('hex').slice(0, 12)}`,
      metrics: {
        impressions: 0,
        engagements: 0,
        clicks: 0,
        conversions: 0,
        roi: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.campaigns.set(campaign.id, campaign);
    this.emit('campaign:created', campaign);

    return campaign;
  }

  /**
   * Get campaign by ID
   */
  getCampaign(campaignId: string): Campaign | undefined {
    return this.campaigns.get(campaignId);
  }

  /**
   * Invite creator to campaign
   */
  async inviteCreatorToCampaign(campaignId: string, creatorId: string, compensation: { type: 'fixed' | 'performance' | 'hybrid'; amount: number; currency: string }): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    const creator = this.creators.get(creatorId);
    if (!creator) {
      throw new Error(`Creator ${creatorId} not found`);
    }

    const campaignCreator: CampaignCreator = {
      creatorId,
      role: 'primary',
      status: 'invited',
      compensation,
      contract: {
        signed: false,
        terms: 'Standard influencer agreement terms...',
      },
      deliverables: [],
      performance: {
        postsPublished: 0,
        totalImpressions: 0,
        totalEngagements: 0,
        conversionRate: 0,
      },
    };

    campaign.creators.push(campaignCreator);
    campaign.updatedAt = new Date();

    this.campaigns.set(campaignId, campaign);
    this.emit('campaign:creator-invited', { campaignId, creatorId });
  }

  /**
   * Update campaign status
   */
  updateCampaignStatus(campaignId: string, status: CampaignStatus): void {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    campaign.status = status;
    campaign.updatedAt = new Date();

    this.campaigns.set(campaignId, campaign);
    this.emit('campaign:status-updated', { campaignId, status });
  }

  /**
   * Get Creator Studio metrics
   */
  getMetrics(): CreatorStudioMetrics {
    const campaignsArray = Array.from(this.campaigns.values());
    const activeCampaigns = campaignsArray.filter(c => c.status === 'active');
    
    const totalBudget = activeCampaigns.reduce((sum, c) => sum + c.budget.total, 0);
    const totalAllocated = activeCampaigns.reduce((sum, c) => sum + c.budget.allocated, 0);
    
    const averageROI = activeCampaigns.length > 0
      ? activeCampaigns.reduce((sum, c) => sum + c.metrics.roi, 0) / activeCampaigns.length
      : 0;

    const topPerformingCreators = Array.from(this.creators.entries())
      .sort((a, b) => b[1].engagementRate - a[1].engagementRate)
      .slice(0, 5)
      .map(([id]) => id);

    const pendingApprovals = campaignsArray.reduce((sum, c) => 
      sum + c.creators.filter(cr => cr.status === 'invited').length, 0
    );

    const upcomingDeadlines = campaignsArray.reduce((sum, c) => 
      sum + c.deliverables.filter(d => d.status === 'pending' && d.dueDate > new Date()).length, 0
    );

    return {
      totalCreators: this.creators.size,
      activeCampaigns: activeCampaigns.length,
      totalBudget,
      averageROI,
      topPerformingCreators,
      pendingApprovals,
      upcomingDeadlines,
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private calculateReachScore(creator: Creator, campaign: Campaign): number {
    const requiredReach = campaign.targetAudience.locations.length * 100000;
    const actualReach = creator.followerCount * creator.engagementRate / 100;
    
    if (actualReach >= requiredReach) {
      return 100;
    }
    
    return Math.min(100, (actualReach / requiredReach) * 100);
  }

  private calculateEngagementScore(creator: Creator): number {
    // Benchmark engagement rates by tier
    const benchmarks: Record<CreatorTier, number> = {
      nano: 5.0,
      micro: 4.0,
      mid: 3.0,
      macro: 2.0,
      mega: 1.5,
    };

    const benchmark = benchmarks[creator.tier];
    const ratio = creator.engagementRate / benchmark;
    
    return Math.min(100, ratio * 100);
  }

  private calculateRelevanceScore(creator: Creator, campaign: Campaign): number {
    let score = 0;
    let factors = 0;

    // Category match
    const categoryMatch = creator.categories.some(cat => 
      campaign.targetAudience.interests.includes(cat)
    );
    if (categoryMatch) {
      score += 30;
    }
    factors += 30;

    // Audience demographics match
    const ageMatch = this.checkAgeMatch(creator.audienceDemographics.ageGroups, campaign.targetAudience.ageRange);
    if (ageMatch) {
      score += 25;
    }
    factors += 25;

    // Location match
    const locationMatch = creator.audienceDemographics.topLocations.hasOwnProperty(
      campaign.targetAudience.locations[0]
    );
    if (locationMatch) {
      score += 25;
    }
    factors += 25;

    // Interest alignment
    const interestOverlap = creator.audienceDemographics.interests.filter(i => 
      campaign.targetAudience.interests.includes(i)
    ).length;
    
    if (interestOverlap > 0) {
      score += Math.min(20, interestOverlap * 5);
    }
    factors += 20;

    return factors > 0 ? (score / factors) * 100 : 0;
  }

  private checkAgeMatch(ageGroups: Record<string, number>, ageRange: { min: number; max: number }): boolean {
    const targetGroup = `${ageRange.min}-${ageRange.max}`;
    const groups = Object.keys(ageGroups);
    
    return groups.some(group => {
      const [min, max] = group.split('-').map(Number);
      return (min <= ageRange.max && max >= ageRange.min);
    });
  }

  private calculateValueScore(creator: Creator, campaign: Campaign): number {
    const avgRate = creator.rateCard.campaign || 
                    creator.rateCard.post || 
                    creator.rateCard.video || 
                    0;
    
    if (avgRate === 0) {
      return 50; // Neutral score if no pricing
    }

    const expectedRate = creator.followerCount * 0.01; // $0.01 per follower as baseline
    const ratio = expectedRate / avgRate;
    
    return Math.min(100, ratio * 100);
  }
}

// ============================================================================
// EXPORT DEFAULT INSTANCE
// ============================================================================

export const creatorStudioEngine = new CreatorStudioEngine();

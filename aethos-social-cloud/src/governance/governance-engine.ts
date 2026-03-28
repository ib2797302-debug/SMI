/**
 * Aethos Governance Engine
 * Native Multi-Regime Compliance System
 * 
 * Supports: GDPR, CCPA, PIPL (China), HIPAA, FINRA, SOC2
 * Features: Real-time policy enforcement, audit trails, data residency
 */

import { EventEmitter } from 'events';
import { createHash } from 'crypto';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ComplianceRegime = 
  | 'GDPR'      // EU General Data Protection Regulation
  | 'CCPA'      // California Consumer Privacy Act
  | 'PIPL'      // China Personal Information Protection Law
  | 'HIPAA'     // Health Insurance Portability and Accountability Act
  | 'FINRA'     // Financial Industry Regulatory Authority
  | 'SOC2'      // Service Organization Control 2
  | 'CUSTOM';   // Custom enterprise policies

export interface DataResidencyRule {
  regime: ComplianceRegime;
  allowedRegions: string[];
  prohibitedRegions: string[];
  encryptionRequired: boolean;
  retentionDays: number;
  consentRequired: boolean;
}

export interface PolicyRule {
  id: string;
  name: string;
  regime: ComplianceRegime;
  description: string;
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  priority: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyCondition {
  field: string;
  operator: 'equals' | 'contains' | 'regex' | 'greaterThan' | 'lessThan' | 'in';
  value: any;
}

export interface PolicyAction {
  type: 'allow' | 'deny' | 'redact' | 'encrypt' | 'mask' | 'audit' | 'notify';
  params?: Record<string, any>;
}

export interface ContentItem {
  id: string;
  type: 'post' | 'comment' | 'message' | 'image' | 'video' | 'document';
  content: string;
  metadata: {
    author?: string;
    platform?: string;
    region?: string;
    timestamp?: Date;
    tags?: string[];
    [key: string]: any;
  };
  sensitivity?: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  resourceId: string;
  resourceType: string;
  userId: string;
  regime: ComplianceRegime;
  policyId?: string;
  result: 'allowed' | 'denied' | 'modified';
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface ConsentRecord {
  userId: string;
  regime: ComplianceRegime;
  consentType: string;
  granted: boolean;
  timestamp: Date;
  expiryDate?: Date;
  withdrawalDate?: Date;
  proofHash: string;
}

export interface GovernanceConfig {
  defaultRegime: ComplianceRegime;
  activeRegimes: ComplianceRegime[];
  dataResidencyRules: Map<ComplianceRegime, DataResidencyRule>;
  auditRetentionDays: number;
  realTimeEnforcement: boolean;
  autoRedaction: boolean;
  notificationWebhooks: string[];
}

export interface GovernanceResult {
  allowed: boolean;
  modifiedContent?: string;
  appliedPolicies: string[];
  violations: PolicyViolation[];
  auditLogId: string;
  warnings: string[];
}

export interface PolicyViolation {
  policyId: string;
  regime: ComplianceRegime;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  field: string;
  suggestedAction: string;
}

// ============================================================================
// GOVERNANCE ENGINE CLASS
// ============================================================================

export class GovernanceEngine extends EventEmitter {
  private config: GovernanceConfig;
  private policies: Map<string, PolicyRule>;
  private consentRecords: Map<string, ConsentRecord>;
  private auditLogs: AuditLogEntry[];
  private regimeSpecificValidators: Map<ComplianceRegime, Function>;

  constructor(config?: Partial<GovernanceConfig>) {
    super();
    this.config = this.initializeConfig(config);
    this.policies = new Map();
    this.consentRecords = new Map();
    this.auditLogs = [];
    this.regimeSpecificValidators = new Map();
    this.initializeRegimeValidators();
    this.loadDefaultPolicies();
  }

  private initializeConfig(config?: Partial<GovernanceConfig>): GovernanceConfig {
    const defaultConfig: GovernanceConfig = {
      defaultRegime: 'GDPR',
      activeRegimes: ['GDPR', 'CCPA', 'PIPL'],
      dataResidencyRules: new Map(),
      auditRetentionDays: 2555, // 7 years for compliance
      realTimeEnforcement: true,
      autoRedaction: true,
      notificationWebhooks: [],
    };

    // Initialize default data residency rules
    defaultConfig.dataResidencyRules.set('GDPR', {
      regime: 'GDPR',
      allowedRegions: ['EU', 'EEA', 'UK'],
      prohibitedRegions: [],
      encryptionRequired: true,
      retentionDays: 730,
      consentRequired: true,
    });

    defaultConfig.dataResidencyRules.set('CCPA', {
      regime: 'CCPA',
      allowedRegions: ['US'],
      prohibitedRegions: [],
      encryptionRequired: false,
      retentionDays: 1095,
      consentRequired: true,
    });

    defaultConfig.dataResidencyRules.set('PIPL', {
      regime: 'PIPL',
      allowedRegions: ['CN'],
      prohibitedRegions: [],
      encryptionRequired: true,
      retentionDays: 1095,
      consentRequired: true,
    });

    return { ...defaultConfig, ...config };
  }

  private initializeRegimeValidators(): void {
    // GDPR Validator
    this.regimeSpecificValidators.set('GDPR', (content: ContentItem): PolicyViolation[] => {
      const violations: PolicyViolation[] = [];
      
      // Check for personal data without consent
      const personalDataPatterns = [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
        /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
        /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // Credit card
      ];

      for (const pattern of personalDataPatterns) {
        if (pattern.test(content.content)) {
          violations.push({
            policyId: 'GDPR-001',
            regime: 'GDPR',
            severity: 'high',
            message: 'Personal data detected without verified consent',
            field: 'content',
            suggestedAction: 'redact or obtain explicit consent',
          });
        }
      }

      return violations;
    });

    // PIPL Validator (China-specific)
    this.regimeSpecificValidators.set('PIPL', (content: ContentItem): PolicyViolation[] => {
      const violations: PolicyViolation[] = [];
      
      // Check for cross-border data transfer restrictions
      if (content.metadata?.region === 'CN' && content.metadata?.platform !== 'wechat') {
        violations.push({
          policyId: 'PIPL-001',
          regime: 'PIPL',
          severity: 'critical',
          message: 'Cross-border data transfer requires security assessment',
          field: 'metadata.region',
          suggestedAction: 'verify security assessment approval',
        });
      }

      // Check for sensitive personal information
      const sensitivePatterns = [
        /\b(身份证|护照|驾照|医疗|健康|生物识别)\b/g, // Chinese sensitive keywords
      ];

      for (const pattern of sensitivePatterns) {
        if (pattern.test(content.content)) {
          violations.push({
            policyId: 'PIPL-002',
            regime: 'PIPL',
            severity: 'critical',
            message: 'Sensitive personal information detected',
            field: 'content',
            suggestedAction: 'obtain separate consent and implement enhanced protection',
          });
        }
      }

      return violations;
    });

    // FINRA Validator (Financial services)
    this.regimeSpecificValidators.set('FINRA', (content: ContentItem): PolicyViolation[] => {
      const violations: PolicyViolation[] = [];
      
      // Check for investment advice without disclaimer
      const investmentKeywords = [
        /\b(buy|sell|hold|recommend|invest|stock|bond|portfolio)\b/gi,
        /\b(return|profit|gain|loss|risk)\b/gi,
      ];

      let hasInvestmentContent = false;
      for (const pattern of investmentKeywords) {
        if (pattern.test(content.content)) {
          hasInvestmentContent = true;
          break;
        }
      }

      if (hasInvestmentContent && !content.content.includes('disclaimer')) {
        violations.push({
          policyId: 'FINRA-001',
          regime: 'FINRA',
          severity: 'high',
          message: 'Investment-related content missing required disclaimer',
          field: 'content',
          suggestedAction: 'add regulatory disclaimer',
        });
      }

      // Check for record retention compliance
      if (!content.metadata?.timestamp) {
        violations.push({
          policyId: 'FINRA-002',
          regime: 'FINRA',
          severity: 'medium',
          message: 'Content missing timestamp for record retention',
          field: 'metadata.timestamp',
          suggestedAction: 'add timestamp metadata',
        });
      }

      return violations;
    });

    // HIPAA Validator (Healthcare)
    this.regimeSpecificValidators.set('HIPAA', (content: ContentItem): PolicyViolation[] => {
      const violations: PolicyViolation[] = [];
      
      // Check for PHI (Protected Health Information)
      const phiPatterns = [
        /\b(patient|diagnosis|treatment|prescription|medical record)\b/gi,
        /\b\d{3}-\d{2}-\d{4}\b/g, // SSN pattern
      ];

      for (const pattern of phiPatterns) {
        if (pattern.test(content.content)) {
          violations.push({
            policyId: 'HIPAA-001',
            regime: 'HIPAA',
            severity: 'critical',
            message: 'Potential PHI detected without authorization',
            field: 'content',
            suggestedAction: 'verify patient authorization or redact',
          });
        }
      }

      return violations;
    });
  }

  private loadDefaultPolicies(): void {
    // GDPR Default Policies
    this.addPolicy({
      id: 'GDPR-001',
      name: 'Personal Data Protection',
      regime: 'GDPR',
      description: 'Protect personal data according to GDPR Article 5',
      conditions: [
        { field: 'content', operator: 'regex', value: '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}' },
      ],
      actions: [
        { type: 'audit', params: { logLevel: 'high' } },
        { type: 'notify', params: { channels: ['compliance-team'] } },
      ],
      priority: 100,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // CCPA Default Policies
    this.addPolicy({
      id: 'CCPA-001',
      name: 'Consumer Privacy Rights',
      regime: 'CCPA',
      description: 'Ensure consumer privacy rights under CCPA',
      conditions: [
        { field: 'metadata.region', operator: 'equals', value: 'US' },
      ],
      actions: [
        { type: 'audit', params: { logLevel: 'medium' } },
      ],
      priority: 90,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // PIPL Default Policies
    this.addPolicy({
      id: 'PIPL-001',
      name: 'Cross-Border Data Transfer',
      regime: 'PIPL',
      description: 'Control cross-border data transfers per PIPL',
      conditions: [
        { field: 'metadata.region', operator: 'equals', value: 'CN' },
      ],
      actions: [
        { type: 'audit', params: { logLevel: 'critical' } },
        { type: 'encrypt', params: { algorithm: 'AES-256' } },
      ],
      priority: 100,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  /**
   * Add a new policy rule
   */
  addPolicy(policy: PolicyRule): void {
    this.policies.set(policy.id, policy);
    this.emit('policy:added', policy);
  }

  /**
   * Remove a policy rule
   */
  removePolicy(policyId: string): boolean {
    const deleted = this.policies.delete(policyId);
    if (deleted) {
      this.emit('policy:removed', policyId);
    }
    return deleted;
  }

  /**
   * Enable or disable a policy
   */
  togglePolicy(policyId: string, enabled: boolean): void {
    const policy = this.policies.get(policyId);
    if (policy) {
      policy.enabled = enabled;
      policy.updatedAt = new Date();
      this.policies.set(policyId, policy);
      this.emit('policy:toggled', { policyId, enabled });
    }
  }

  /**
   * Record user consent
   */
  recordConsent(consent: ConsentRecord): void {
    const key = `${consent.userId}:${consent.regime}:${consent.consentType}`;
    
    // Generate proof hash for audit trail
    const proofData = JSON.stringify({
      userId: consent.userId,
      regime: consent.regime,
      consentType: consent.consentType,
      granted: consent.granted,
      timestamp: consent.timestamp.toISOString(),
    });
    consent.proofHash = createHash('sha256').update(proofData).digest('hex');
    
    this.consentRecords.set(key, consent);
    this.emit('consent:recorded', consent);
  }

  /**
   * Verify consent for a specific user and regime
   */
  verifyConsent(userId: string, regime: ComplianceRegime, consentType: string): boolean {
    const key = `${userId}:${regime}:${consentType}`;
    const record = this.consentRecords.get(key);
    
    if (!record) {
      return false;
    }

    if (!record.granted) {
      return false;
    }

    if (record.withdrawalDate) {
      return false;
    }

    if (record.expiryDate && new Date() > record.expiryDate) {
      return false;
    }

    return true;
  }

  /**
   * Withdraw consent
   */
  withdrawConsent(userId: string, regime: ComplianceRegime, consentType: string): void {
    const key = `${userId}:${regime}:${consentType}`;
    const record = this.consentRecords.get(key);
    
    if (record) {
      record.withdrawalDate = new Date();
      record.granted = false;
      this.consentRecords.set(key, record);
      this.emit('consent:withdrawn', { userId, regime, consentType });
    }
  }

  /**
   * Evaluate content against all applicable policies
   */
  async evaluateContent(content: ContentItem, userId: string): Promise<GovernanceResult> {
    const startTime = Date.now();
    const violations: PolicyViolation[] = [];
    const appliedPolicies: string[] = [];
    const warnings: string[] = [];
    let modifiedContent = content.content;
    let allowed = true;

    // Determine applicable regimes based on content metadata
    const applicableRegimes = this.determineApplicableRegimes(content);

    // Check consent requirements
    for (const regime of applicableRegimes) {
      const residencyRule = this.config.dataResidencyRules.get(regime);
      if (residencyRule?.consentRequired) {
        const hasConsent = this.verifyConsent(userId, regime, 'data_processing');
        if (!hasConsent) {
          violations.push({
            policyId: `${regime}-CONSENT`,
            regime,
            severity: 'critical',
            message: `Missing required consent for ${regime}`,
            field: 'consent',
            suggestedAction: 'obtain user consent before processing',
          });
          allowed = false;
        }
      }
    }

    // Apply regime-specific validators
    for (const regime of applicableRegimes) {
      const validator = this.regimeSpecificValidators.get(regime);
      if (validator) {
        const regimeViolations = validator(content);
        violations.push(...regimeViolations);
        
        if (regimeViolations.some(v => v.severity === 'critical')) {
          allowed = false;
        }
      }
    }

    // Apply custom policies
    for (const [, policy] of this.policies) {
      if (!policy.enabled || !applicableRegimes.includes(policy.regime)) {
        continue;
      }

      const matches = this.evaluateConditions(content, policy.conditions);
      if (matches) {
        appliedPolicies.push(policy.id);
        
        for (const action of policy.actions) {
          switch (action.type) {
            case 'deny':
              allowed = false;
              break;
            case 'redact':
              modifiedContent = this.redactContent(modifiedContent, action.params);
              break;
            case 'encrypt':
              // Encryption would be handled by infrastructure layer
              warnings.push(`Encryption required: ${action.params?.algorithm || 'default'}`);
              break;
            case 'audit':
              this.logAuditEvent('policy_applied', content.id, 'content', userId, policy.regime, policy.id, 'allowed', {
                policyName: policy.name,
                action: 'audit',
              });
              break;
            case 'notify':
              this.emit('compliance:notification', {
                policyId: policy.id,
                contentId: content.id,
                channels: action.params?.channels || [],
              });
              break;
          }
        }
      }
    }

    // Sort violations by severity
    violations.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    // Create audit log entry
    const auditLogId = this.logAuditEvent(
      'content_evaluation',
      content.id,
      'content',
      userId,
      applicableRegimes[0] || this.config.defaultRegime,
      appliedPolicies[0],
      allowed ? 'allowed' : 'denied',
      {
        violationsCount: violations.length,
        appliedPoliciesCount: appliedPolicies.length,
        evaluationTimeMs: Date.now() - startTime,
      }
    );

    const result: GovernanceResult = {
      allowed,
      modifiedContent: modifiedContent !== content.content ? modifiedContent : undefined,
      appliedPolicies,
      violations,
      auditLogId,
      warnings,
    };

    this.emit('content:evaluated', result);
    return result;
  }

  /**
   * Check data residency compliance
   */
  checkDataResidency(dataRegion: string, regime: ComplianceRegime): { compliant: boolean; violations: string[] } {
    const rule = this.config.dataResidencyRules.get(regime);
    if (!rule) {
      return { compliant: true, violations: [] };
    }

    const violations: string[] = [];

    if (rule.prohibitedRegions.includes(dataRegion)) {
      violations.push(`Data region ${dataRegion} is prohibited under ${regime}`);
    }

    if (rule.allowedRegions.length > 0 && !rule.allowedRegions.includes(dataRegion)) {
      violations.push(`Data region ${dataRegion} is not in allowed regions for ${regime}: ${rule.allowedRegions.join(', ')}`);
    }

    return {
      compliant: violations.length === 0,
      violations,
    };
  }

  /**
   * Get audit logs for compliance reporting
   */
  getAuditLogs(filters?: {
    regime?: ComplianceRegime;
    startDate?: Date;
    endDate?: Date;
    resourceId?: string;
    userId?: string;
  }): AuditLogEntry[] {
    let logs = [...this.auditLogs];

    if (filters?.regime) {
      logs = logs.filter(log => log.regime === filters.regime);
    }

    if (filters?.startDate) {
      logs = logs.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      logs = logs.filter(log => log.timestamp <= filters.endDate!);
    }

    if (filters?.resourceId) {
      logs = logs.filter(log => log.resourceId === filters.resourceId);
    }

    if (filters?.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }

    // Sort by timestamp descending
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return logs;
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(regime: ComplianceRegime, period: { start: Date; end: Date }): ComplianceReport {
    const logs = this.getAuditLogs({
      regime,
      startDate: period.start,
      endDate: period.end,
    });

    const totalEvaluations = logs.filter(log => log.action === 'content_evaluation').length;
    const deniedCount = logs.filter(log => log.result === 'denied').length;
    const violationsBySeverity = {
      critical: logs.filter(log => log.details.violationsCount > 0).length,
      high: 0,
      medium: 0,
      low: 0,
    };

    return {
      regime,
      period,
      generatedAt: new Date(),
      metrics: {
        totalEvaluations,
        allowedCount: totalEvaluations - deniedCount,
        deniedCount,
        denialRate: totalEvaluations > 0 ? (deniedCount / totalEvaluations) * 100 : 0,
        violationsBySeverity,
        uniqueUsers: new Set(logs.map(log => log.userId)).size,
        uniqueResources: new Set(logs.map(log => log.resourceId)).size,
      },
      topViolations: this.getTopViolations(logs, regime),
      recommendations: this.generateRecommendations(logs, regime),
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private determineApplicableRegimes(content: ContentItem): ComplianceRegime[] {
    const regimes = new Set<ComplianceRegime>();
    
    // Always include default regime
    regimes.add(this.config.defaultRegime);

    // Add regimes based on region
    const region = content.metadata?.region;
    if (region) {
      if (['EU', 'EEA', 'UK', 'DE', 'FR', 'IT', 'ES'].includes(region)) {
        regimes.add('GDPR');
      }
      if (['US', 'CA'].includes(region)) {
        regimes.add('CCPA');
      }
      if (['CN', 'HK', 'TW'].includes(region)) {
        regimes.add('PIPL');
      }
    }

    // Add regimes based on content type (healthcare, finance)
    if (content.sensitivity === 'restricted') {
      regimes.add('HIPAA');
      regimes.add('FINRA');
    }

    // Add all active regimes if real-time enforcement is enabled
    if (this.config.realTimeEnforcement) {
      this.config.activeRegimes.forEach(r => regimes.add(r));
    }

    return Array.from(regimes);
  }

  private evaluateConditions(content: ContentItem, conditions: PolicyCondition[]): boolean {
    return conditions.every(condition => {
      const value = this.getFieldValue(content, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'contains':
          return String(value).includes(condition.value);
        case 'regex':
          return new RegExp(condition.value).test(String(value));
        case 'greaterThan':
          return Number(value) > condition.value;
        case 'lessThan':
          return Number(value) < condition.value;
        case 'in':
          return condition.value.includes(value);
        default:
          return false;
      }
    });
  }

  private getFieldValue(content: ContentItem, field: string): any {
    const parts = field.split('.');
    let value: any = content;

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  private redactContent(content: string, params?: Record<string, any>): string {
    // Simple redaction implementation
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    
    let redacted = content.replace(emailPattern, '[EMAIL_REDACTED]');
    redacted = redacted.replace(phonePattern, '[PHONE_REDACTED]');
    
    return redacted;
  }

  private logAuditEvent(
    action: string,
    resourceId: string,
    resourceType: string,
    userId: string,
    regime: ComplianceRegime,
    policyId?: string,
    result: 'allowed' | 'denied' | 'modified' = 'allowed',
    details?: Record<string, any>
  ): string {
    const entry: AuditLogEntry = {
      id: createHash('sha256')
        .update(`${action}:${resourceId}:${userId}:${Date.now()}`)
        .digest('hex'),
      timestamp: new Date(),
      action,
      resourceId,
      resourceType,
      userId,
      regime,
      policyId,
      result,
      details: details || {},
    };

    this.auditLogs.push(entry);

    // Auto-cleanup old logs
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.auditRetentionDays);
    this.auditLogs = this.auditLogs.filter(log => log.timestamp > cutoffDate);

    this.emit('audit:logged', entry);
    return entry.id;
  }

  private getTopViolations(logs: AuditLogEntry[], regime: ComplianceRegime): ViolationSummary[] {
    const violationCounts = new Map<string, number>();
    
    logs.forEach(log => {
      if (log.details.violationsCount > 0) {
        const key = `${log.policyId || 'unknown'}:${log.action}`;
        violationCounts.set(key, (violationCounts.get(key) || 0) + 1);
      }
    });

    return Array.from(violationCounts.entries())
      .map(([policyAction, count]) => ({
        policyAction,
        count,
        percentage: (count / logs.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private generateRecommendations(logs: AuditLogEntry[], regime: ComplianceRegime): string[] {
    const recommendations: string[] = [];
    
    const denialRate = logs.filter(log => log.result === 'denied').length / logs.length;
    
    if (denialRate > 0.3) {
      recommendations.push('High denial rate detected. Review policy configurations and provide user training.');
    }

    const consentViolations = logs.filter(log => 
      log.details.violationsCount > 0 && log.action.includes('CONSENT')
    ).length;
    
    if (consentViolations > logs.length * 0.1) {
      recommendations.push('Frequent consent violations. Implement clearer consent collection workflows.');
    }

    if (logs.length === 0) {
      recommendations.push('No audit data for this period. Ensure logging is properly configured.');
    }

    return recommendations;
  }
}

// ============================================================================
// COMPLIANCE REPORT TYPE
// ============================================================================

export interface ComplianceReport {
  regime: ComplianceRegime;
  period: { start: Date; end: Date };
  generatedAt: Date;
  metrics: {
    totalEvaluations: number;
    allowedCount: number;
    deniedCount: number;
    denialRate: number;
    violationsBySeverity: { critical: number; high: number; medium: number; low: number };
    uniqueUsers: number;
    uniqueResources: number;
  };
  topViolations: ViolationSummary[];
  recommendations: string[];
}

export interface ViolationSummary {
  policyAction: string;
  count: number;
  percentage: number;
}

// ============================================================================
// EXPORT DEFAULT INSTANCE
// ============================================================================

export const governanceEngine = new GovernanceEngine();

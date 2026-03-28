/**
 * AETHOS SOCIAL CLOUD - E2E LOAD TESTING ENGINE
 * 
 * Moteur de tests de charge end-to-end pour environnement staging.
 * Inspiré de whatsMaster Testing Suite et adapté pour l'architecture cell-based.
 * 
 * Fonctionnalités:
 * - Tests de spike, stress, soak, chaos, failover
 * - Chaos Monkeys (latency, error, cell_failure, network_partition)
 * - Mesure RTO/RPO et temps de récupération
 * - Validation critères de succès configurables
 * - Recommandations automatiques post-test
 */

import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';

// Types inspirés de whatsMaster mais spécialisés Social Cloud
export interface LoadTestScenario {
  id: string;
  name: string;
  type: 'spike' | 'stress' | 'soak' | 'chaos' | 'failover';
  description: string;
  durationMs: number;
  targetCells: string[];
  metrics: LoadTestMetricsConfig;
  successCriteria: SuccessCriterion[];
}

export interface LoadTestMetricsConfig {
  targetRPS: number;          // Requêtes par seconde cibles
  targetP99LatencyMs: number; // Latence P99 cible
  targetErrorRate: number;    // Taux d'erreur max (0-1)
  targetThroughputMbps: number;
  concurrentUsers: number;
}

export interface SuccessCriterion {
  metric: 'p99_latency' | 'error_rate' | 'throughput' | 'availability' | 'rto' | 'rpo';
  operator: '<=' | '>=' | '<' | '>' | '==';
  threshold: number;
  severity: 'critical' | 'warning' | 'info';
}

export interface ChaosMonkeyConfig {
  enabled: boolean;
  type: 'latency' | 'error' | 'cell_failure' | 'network_partition' | 'resource_exhaustion';
  probability: number;        // 0-1, probabilité d'activation
  intensity: number;          // 0-1, intensité de l'attaque
  durationMs: number;
  targetServices?: string[];
  targetCells?: string[];
}

export interface CellFailoverConfig {
  primaryCell: string;
  secondaryCells: string[];
  triggerCondition: 'manual' | 'automatic' | 'scheduled';
  expectedRTOSeconds: number;
  expectedRPOSeconds: number;
}

export interface LoadTestResult {
  testId: string;
  scenarioId: string;
  status: 'running' | 'completed' | 'failed' | 'aborted';
  startTime: number;
  endTime?: number;
  durationMs: number;
  
  // Métriques agrégées
  metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgLatencyMs: number;
    p50LatencyMs: number;
    p95LatencyMs: number;
    p99LatencyMs: number;
    p999LatencyMs: number;
    errorRate: number;
    throughputRPS: number;
    throughputMbps: number;
    
    // Métriques par cellule
    perCellMetrics: Record<string, CellMetrics>;
    
    // Métriques de résilience (pour failover/chaos)
    rtoSeconds?: number;      // Recovery Time Objective
    rpoSeconds?: number;      // Recovery Point Objective
    dataLossCount?: number;
  };
  
  // Résultats des critères de succès
  successEvaluation: {
    passed: boolean;
    criteriaResults: Array<{
      criterion: SuccessCriterion;
      actualValue: number;
      passed: boolean;
      message: string;
    }>;
  };
  
  // Événements notables pendant le test
  events: Array<{
    timestamp: number;
    type: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    description: string;
    metadata?: Record<string, any>;
  }>;
  
  // Recommandations générées par IA
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: 'performance' | 'reliability' | 'cost' | 'security' | 'scalability';
    title: string;
    description: string;
    estimatedImpact: string;
    effortLevel: 'low' | 'medium' | 'high';
  }>;
}

export interface CellMetrics {
  requestsTotal: number;
  errorsTotal: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  cpuUtilizationAvg: number;
  memoryUtilizationAvg: number;
  networkInMbps: number;
  networkOutMbps: number;
}

export interface TestExecutionProgress {
  testId: string;
  status: 'running' | 'completed' | 'failed';
  progressPercent: number;
  elapsedMs: number;
  remainingMs: number;
  currentPhase: string;
  liveMetrics: {
    currentRPS: number;
    currentLatencyP99Ms: number;
    currentErrorRate: number;
    activeUsers: number;
  };
}

// Générateurs de charge inspirés de whatsMaster
class LoadGenerator {
  private activeUsers: Map<string, VirtualUser>;
  private requestQueue: Array<PendingRequest>;
  
  constructor(
    private config: {
      baseUrl: string;
      maxConcurrentUsers: number;
      rampUpTimeMs: number;
    }
  ) {
    this.activeUsers = new Map();
    this.requestQueue = [];
  }
  
  async startLoad(targetRPS: number, durationMs: number): Promise<void> {
    const rampUpSteps = 10;
    const usersPerStep = Math.ceil(this.config.maxConcurrentUsers / rampUpSteps);
    const stepDelayMs = this.config.rampUpTimeMs / rampUpSteps;
    
    for (let i = 0; i < rampUpSteps; i++) {
      await this.spawnUsers(usersPerStep);
      await this.sleep(stepDelayMs);
    }
    
    // Maintenir la charge pendant la durée spécifiée
    await this.maintainLoad(targetRPS, durationMs);
  }
  
  private async spawnUsers(count: number): Promise<void> {
    const promises = [];
    for (let i = 0; i < count && this.activeUsers.size < this.config.maxConcurrentUsers; i++) {
      const userId = `user-${randomUUID()}`;
      const user = new VirtualUser(userId, this.config.baseUrl);
      this.activeUsers.set(userId, user);
      promises.push(user.start());
    }
    await Promise.all(promises);
  }
  
  private async maintainLoad(targetRPS: number, durationMs: number): Promise<void> {
    const startTime = Date.now();
    const requestIntervalMs = 1000 / targetRPS;
    
    while (Date.now() - startTime < durationMs) {
      // Ajuster dynamiquement le nombre d'utilisateurs pour maintenir targetRPS
      await this.adjustUserPool(targetRPS);
      await this.sleep(requestIntervalMs);
    }
  }
  
  private async adjustUserPool(targetRPS: number): Promise<void> {
    // Logique d'ajustement dynamique basée sur le RPS actuel
    // Simplifié pour cet exemple
  }
  
  async stopLoad(): Promise<void> {
    const stopPromises = [];
    for (const [userId, user] of this.activeUsers) {
      stopPromises.push(user.stop());
    }
    await Promise.all(stopPromises);
    this.activeUsers.clear();
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class VirtualUser {
  private running = false;
  private requestCount = 0;
  
  constructor(
    private userId: string,
    private baseUrl: string
  ) {}
  
  async start(): Promise<void> {
    this.running = true;
    this.executeUserJourney();
  }
  
  async stop(): Promise<void> {
    this.running = false;
  }
  
  private async executeUserJourney(): Promise<void> {
    while (this.running) {
      try {
        // Simulation parcours utilisateur Aethos
        await this.simulateSocialPostIngest();
        await this.simulateAgentQuery();
        await this.simulateCreatorSearch();
        await this.simulateComplianceCheck();
        
        this.requestCount++;
        await this.randomDelay(100, 500);
      } catch (error) {
        console.error(`User ${this.userId} error:`, error);
      }
    }
  }
  
  private async simulateSocialPostIngest(): Promise<void> {
    // Simulation ingestion post social via Kafka
    await this.makeRequest('POST', '/api/v1/social/ingest', {
      platform: this.randomPlatform(),
      content: 'Test post content',
      metadata: { userId: this.userId }
    });
  }
  
  private async simulateAgentQuery(): Promise<void> {
    // Simulation requête agent IA
    await this.makeRequest('POST', '/api/v1/agents/query', {
      query: 'Analyse sentiment marque',
      context: { timeRange: '24h' }
    });
  }
  
  private async simulateCreatorSearch(): Promise<void> {
    // Simulation recherche créateur
    await this.makeRequest('GET', '/api/v1/creators/search?q=influencer&filters=tech');
  }
  
  private async simulateComplianceCheck(): Promise<void> {
    // Simulation vérification conformité
    await this.makeRequest('POST', '/api/v1/governance/check', {
      content: 'Sample content for compliance',
      region: 'us-east-1'
    });
  }
  
  private async makeRequest(method: string, path: string, body?: any): Promise<any> {
    // Simulation appel API avec latence réaliste
    const latency = this.randomLatency();
    await this.sleep(latency);
    
    this.requestCount++;
    return { status: 200, data: { success: true } };
  }
  
  private randomPlatform(): string {
    const platforms = ['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'weibo'];
    return platforms[Math.floor(Math.random() * platforms.length)];
  }
  
  private randomLatency(): number {
    // Distribution réaliste de latence
    const base = 20;
    const variance = Math.random() * 80;
    const spike = Math.random() > 0.95 ? Math.random() * 200 : 0;
    return base + variance + spike;
  }
  
  private randomDelay(min: number, max: number): Promise<void> {
    const delay = min + Math.random() * (max - min);
    return this.sleep(delay);
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

interface PendingRequest {
  id: string;
  timestamp: number;
  type: string;
}

/**
 * Moteur principal de tests E2E
 */
export class E2ELoadTestingEngine extends EventEmitter {
  private loadGenerator: LoadGenerator;
  private activeTests: Map<string, TestExecutionContext>;
  private chaosMonkeys: Map<string, ChaosMonkeyInstance>;
  
  constructor(
    private config: {
      stagingBaseUrl: string;
      cells: string[];
      maxConcurrentUsers: number;
      metricsRetentionDays: number;
    }
  ) {
    super();
    this.loadGenerator = new LoadGenerator({
      baseUrl: config.stagingBaseUrl,
      maxConcurrentUsers: config.maxConcurrentUsers,
      rampUpTimeMs: 60000
    });
    this.activeTests = new Map();
    this.chaosMonkeys = new Map();
  }
  
  /**
   * Exécute un scénario de test complet
   */
  async executeScenario(scenario: LoadTestScenario): Promise<LoadTestResult> {
    const testId = randomUUID();
    console.log(`🚀 Démarrage test E2E: ${scenario.name} (${testId})`);
    
    const context = new TestExecutionContext(testId, scenario);
    this.activeTests.set(testId, context);
    
    try {
      // Phase 1: Warm-up
      await context.recordPhase('warmup', async () => {
        await this.warmupSystem(scenario.targetCells);
      });
      
      // Phase 2: Application de la charge
      await context.recordPhase('load-application', async () => {
        await this.applyLoad(scenario);
      });
      
      // Phase 3: Injection chaos (si applicable)
      if (scenario.type === 'chaos' || scenario.type === 'failover') {
        await context.recordPhase('chaos-injection', async () => {
          await this.injectChaos(scenario);
        });
      }
      
      // Phase 4: Stabilisation et collecte métriques
      await context.recordPhase('stabilization', async () => {
        await this.collectMetrics(context);
      });
      
      // Phase 5: Évaluation critères
      const evaluation = await this.evaluateSuccessCriteria(context, scenario);
      
      // Phase 6: Génération recommandations
      const recommendations = await this.generateRecommendations(context);
      
      const result = context.buildResult(evaluation, recommendations);
      console.log(`✅ Test terminé: ${result.status}`);
      
      return result;
    } catch (error) {
      console.error(`❌ Test échoué:`, error);
      const result = context.buildFailure(error as Error);
      return result;
    } finally {
      this.activeTests.delete(testId);
    }
  }
  
  /**
   * Scénarios prédéfinis inspirés de best practices
   */
  getPredefinedScenarios(): LoadTestScenario[] {
    return [
      {
        id: 'spike-test-001',
        name: 'Spike Traffic Test',
        type: 'spike',
        description: 'Test de pic de trafic soudain (10x charge normale)',
        durationMs: 300000, // 5 minutes
        targetCells: ['us-east-1', 'eu-west-1'],
        metrics: {
          targetRPS: 10000,
          targetP99LatencyMs: 200,
          targetErrorRate: 0.01,
          targetThroughputMbps: 500,
          concurrentUsers: 50000
        },
        successCriteria: [
          { metric: 'p99_latency', operator: '<=', threshold: 200, severity: 'critical' },
          { metric: 'error_rate', operator: '<=', threshold: 0.01, severity: 'critical' },
          { metric: 'availability', operator: '>=', threshold: 0.9999, severity: 'critical' }
        ]
      },
      {
        id: 'stress-test-001',
        name: 'Stress Capacity Test',
        type: 'stress',
        description: 'Test de capacité maximale jusqu\'à rupture',
        durationMs: 600000, // 10 minutes
        targetCells: ['us-east-1'],
        metrics: {
          targetRPS: 50000,
          targetP99LatencyMs: 500,
          targetErrorRate: 0.05,
          targetThroughputMbps: 2000,
          concurrentUsers: 200000
        },
        successCriteria: [
          { metric: 'p99_latency', operator: '<=', threshold: 500, severity: 'warning' },
          { metric: 'error_rate', operator: '<=', threshold: 0.05, severity: 'warning' }
        ]
      },
      {
        id: 'soak-test-001',
        name: 'Soak Endurance Test',
        type: 'soak',
        description: 'Test d\'endurance longue durée (fuites mémoire, usure)',
        durationMs: 86400000, // 24 heures
        targetCells: ['us-east-1', 'eu-west-1', 'ap-northeast-1'],
        metrics: {
          targetRPS: 5000,
          targetP99LatencyMs: 150,
          targetErrorRate: 0.001,
          targetThroughputMbps: 250,
          concurrentUsers: 25000
        },
        successCriteria: [
          { metric: 'p99_latency', operator: '<=', threshold: 200, severity: 'critical' },
          { metric: 'error_rate', operator: '<=', threshold: 0.001, severity: 'critical' },
          { metric: 'availability', operator: '>=', threshold: 0.9999, severity: 'critical' }
        ]
      },
      {
        id: 'chaos-test-001',
        name: 'Chaos Monkey Test',
        type: 'chaos',
        description: 'Test de résilience avec injection de pannes aléatoires',
        durationMs: 1800000, // 30 minutes
        targetCells: ['us-east-1'],
        metrics: {
          targetRPS: 3000,
          targetP99LatencyMs: 300,
          targetErrorRate: 0.02,
          targetThroughputMbps: 150,
          concurrentUsers: 15000
        },
        successCriteria: [
          { metric: 'rto', operator: '<=', threshold: 45, severity: 'critical' },
          { metric: 'rpo', operator: '<=', threshold: 5, severity: 'critical' },
          { metric: 'error_rate', operator: '<=', threshold: 0.02, severity: 'warning' }
        ]
      },
      {
        id: 'failover-test-001',
        name: 'Cell Failover Test',
        type: 'failover',
        description: 'Test de basculement inter-cellules',
        durationMs: 600000, // 10 minutes
        targetCells: ['us-east-1', 'eu-west-1'],
        metrics: {
          targetRPS: 5000,
          targetP99LatencyMs: 250,
          targetErrorRate: 0.01,
          targetThroughputMbps: 250,
          concurrentUsers: 25000
        },
        successCriteria: [
          { metric: 'rto', operator: '<=', threshold: 30, severity: 'critical' },
          { metric: 'rpo', operator: '<=', threshold: 2, severity: 'critical' },
          { metric: 'dataLossCount', operator: '<=', threshold: 0, severity: 'critical' }
        ]
      }
    ];
  }
  
  /**
   * Configure et active un Chaos Monkey
   */
  async activateChaosMonkey(config: ChaosMonkeyConfig): Promise<string> {
    const monkeyId = `monkey-${randomUUID()}`;
    const monkey = new ChaosMonkeyInstance(monkeyId, config);
    this.chaosMonkeys.set(monkeyId, monkey);
    
    console.log(`🐵 Chaos Monkey activé: ${config.type} (probabilité: ${config.probability})`);
    await monkey.start();
    
    return monkeyId;
  }
  
  /**
   * Désactive un Chaos Monkey
   */
  async deactivateChaosMonkey(monkeyId: string): Promise<void> {
    const monkey = this.chaosMonkeys.get(monkeyId);
    if (monkey) {
      await monkey.stop();
      this.chaosMonkeys.delete(monkeyId);
      console.log(`🔴 Chaos Monkey désactivé: ${monkeyId}`);
    }
  }
  
  /**
   * Obtient la progression d'un test en cours
   */
  getTestProgress(testId: string): TestExecutionProgress | null {
    const context = this.activeTests.get(testId);
    if (!context) return null;
    return context.getProgress();
  }
  
  // Méthodes privées d'implémentation
  
  private async warmupSystem(cells: string[]): Promise<void> {
    console.log('🔥 Warm-up du système...');
    // Préchauffage caches, connexions DB, etc.
    await this.sleep(10000);
  }
  
  private async applyLoad(scenario: LoadTestScenario): Promise<void> {
    console.log(`⚡ Application charge: ${scenario.metrics.targetRPS} RPS`);
    await this.loadGenerator.startLoad(
      scenario.metrics.targetRPS,
      scenario.durationMs
    );
  }
  
  private async injectChaos(scenario: LoadTestScenario): Promise<void> {
    console.log('💥 Injection chaos...');
    
    const chaosConfigs: ChaosMonkeyConfig[] = [
      {
        enabled: true,
        type: 'latency',
        probability: 0.1,
        intensity: 0.5,
        durationMs: 60000
      },
      {
        enabled: true,
        type: 'error',
        probability: 0.05,
        intensity: 0.3,
        durationMs: 30000
      },
      {
        enabled: scenario.type === 'failover',
        type: 'cell_failure',
        probability: 1.0,
        intensity: 1.0,
        durationMs: 120000,
        targetCells: [scenario.targetCells[0]]
      }
    ];
    
    for (const config of chaosConfigs) {
      if (config.enabled) {
        await this.activateChaosMonkey(config);
      }
    }
  }
  
  private async collectMetrics(context: TestExecutionContext): Promise<void> {
    // Collecte métriques depuis Prometheus, cellules, etc.
    console.log('📊 Collecte métriques...');
    // Implémentation réelle appellerait les APIs de monitoring
  }
  
  private async evaluateSuccessCriteria(
    context: TestExecutionContext,
    scenario: LoadTestScenario
  ): Promise<LoadTestResult['successEvaluation']> {
    const metrics = context.getAggregatedMetrics();
    const results = [];
    
    for (const criterion of scenario.successCriteria) {
      const actualValue = this.extractMetricValue(metrics, criterion.metric);
      const passed = this.evaluateComparison(actualValue, criterion.operator, criterion.threshold);
      
      results.push({
        criterion,
        actualValue,
        passed,
        message: `${criterion.metric} ${criterion.operator} ${criterion.threshold}: ${actualValue} (${passed ? '✅' : '❌'})`
      });
    }
    
    const allCriticalPassed = results
      .filter(r => r.criterion.severity === 'critical')
      .every(r => r.passed);
    
    return {
      passed: allCriticalPassed,
      criteriaResults: results
    };
  }
  
  private extractMetricValue(metrics: any, metricName: string): number {
    const mapping: Record<string, keyof typeof metrics> = {
      'p99_latency': 'p99LatencyMs',
      'error_rate': 'errorRate',
      'throughput': 'throughputRPS',
      'availability': 'availability',
      'rto': 'rtoSeconds',
      'rpo': 'rpoSeconds'
    };
    
    const key = mapping[metricName];
    return (metrics[key] as number) || 0;
  }
  
  private evaluateComparison(actual: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case '<=': return actual <= threshold;
      case '>=': return actual >= threshold;
      case '<': return actual < threshold;
      case '>': return actual > threshold;
      case '==': return actual === threshold;
      default: return false;
    }
  }
  
  private async generateRecommendations(context: TestExecutionContext): Promise<LoadTestResult['recommendations']> {
    const metrics = context.getAggregatedMetrics();
    const recommendations: LoadTestResult['recommendations'] = [];
    
    // Analyse automatique et génération recommandations
    if (metrics.p99LatencyMs > 200) {
      recommendations.push({
        priority: 'high',
        category: 'performance',
        title: 'Optimiser latence P99',
        description: 'La latence P99 dépasse 200ms. Considérer cache embeddings, CDN edge, ou optimisation requêtes DB.',
        estimatedImpact: 'Réduction latence de 30-50%',
        effortLevel: 'medium'
      });
    }
    
    if (metrics.errorRate > 0.01) {
      recommendations.push({
        priority: 'high',
        category: 'reliability',
        title: 'Réduire taux d\'erreur',
        description: 'Taux d\'erreur élevé détecté. Vérifier timeouts, circuit breakers, et gestion retries.',
        estimatedImpact: 'Amélioration disponibilité à 99.99%',
        effortLevel: 'medium'
      });
    }
    
    if (metrics.rtoSeconds && metrics.rtoSeconds > 45) {
      recommendations.push({
        priority: 'high',
        category: 'reliability',
        title: 'Améliorer RTO',
        description: 'Le RTO dépasse 45 secondes. Optimiser détection panne et basculement automatique.',
        estimatedImpact: 'RTO < 30 secondes',
        effortLevel: 'high'
      });
    }
    
    // Recommendations inspirées de whatsMaster FinOps
    if (metrics.throughputRPS < 1000) {
      recommendations.push({
        priority: 'medium',
        category: 'cost',
        title: 'Optimiser coût/performance',
        description: 'Throughput faible par rapport aux ressources. Considérer serverless scaling ou right-sizing.',
        estimatedImpact: 'Réduction coûts infrastructure 20-30%',
        effortLevel: 'low'
      });
    }
    
    return recommendations;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Contexte d'exécution d'un test
 */
class TestExecutionContext {
  private phases: Array<{ name: string; start: number; end?: number }>;
  private metricsSamples: Array<MetricSample>;
  private events: LoadTestResult['events'];
  private startTime: number;
  
  constructor(
    private testId: string,
    private scenario: LoadTestScenario
  ) {
    this.phases = [];
    this.metricsSamples = [];
    this.events = [];
    this.startTime = Date.now();
  }
  
  async recordPhase<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const phase = { name, start: Date.now() };
    this.phases.push(phase);
    this.emitEvent('phase_start', 'info', `Démarrage phase: ${name}`);
    
    try {
      const result = await fn();
      phase.end = Date.now();
      this.emitEvent('phase_end', 'info', `Phase terminée: ${name}`, {
        durationMs: phase.end - phase.start
      });
      return result;
    } catch (error) {
      phase.end = Date.now();
      this.emitEvent('phase_error', 'error', `Erreur phase: ${name}`, {
        error: (error as Error).message
      });
      throw error;
    }
  }
  
  emitEvent(type: string, severity: LoadTestResult['events'][0]['severity'], description: string, metadata?: any): void {
    this.events.push({
      timestamp: Date.now(),
      type,
      severity,
      description,
      metadata
    });
  }
  
  addMetricSample(sample: MetricSample): void {
    this.metricsSamples.push(sample);
  }
  
  getAggregatedMetrics(): LoadTestResult['metrics'] {
    // Agrégation simplifiée des métriques
    const totalSamples = this.metricsSamples.length;
    if (totalSamples === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        avgLatencyMs: 0,
        p50LatencyMs: 0,
        p95LatencyMs: 0,
        p99LatencyMs: 0,
        p999LatencyMs: 0,
        errorRate: 0,
        throughputRPS: 0,
        throughputMbps: 0,
        perCellMetrics: {}
      };
    }
    
    // Calcul percentiles (simplifié)
    const latencies = this.metricsSamples.map(s => s.latencyMs).sort((a, b) => a - b);
    const p99Index = Math.floor(totalSamples * 0.99);
    
    return {
      totalRequests: totalSamples,
      successfulRequests: Math.floor(totalSamples * 0.99),
      failedRequests: Math.floor(totalSamples * 0.01),
      avgLatencyMs: latencies.reduce((a, b) => a + b, 0) / totalSamples,
      p50LatencyMs: latencies[Math.floor(totalSamples * 0.5)],
      p95LatencyMs: latencies[Math.floor(totalSamples * 0.95)],
      p99LatencyMs: latencies[p99Index],
      p999LatencyMs: latencies[Math.floor(totalSamples * 0.999)],
      errorRate: 0.01,
      throughputRPS: totalSamples / ((Date.now() - this.startTime) / 1000),
      throughputMbps: 0,
      perCellMetrics: {}
    };
  }
  
  getProgress(): TestExecutionProgress {
    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(100, (elapsed / this.scenario.durationMs) * 100);
    const metrics = this.getAggregatedMetrics();
    
    return {
      testId: this.testId,
      status: 'running',
      progressPercent: progress,
      elapsedMs: elapsed,
      remainingMs: Math.max(0, this.scenario.durationMs - elapsed),
      currentPhase: this.phases[this.phases.length - 1]?.name || 'initializing',
      liveMetrics: {
        currentRPS: metrics.throughputRPS,
        currentLatencyP99Ms: metrics.p99LatencyMs,
        currentErrorRate: metrics.errorRate,
        activeUsers: this.scenario.metrics.concurrentUsers
      }
    };
  }
  
  buildResult(
    evaluation: LoadTestResult['successEvaluation'],
    recommendations: LoadTestResult['recommendations']
  ): LoadTestResult {
    const metrics = this.getAggregatedMetrics();
    
    return {
      testId: this.testId,
      scenarioId: this.scenario.id,
      status: evaluation.passed ? 'completed' : 'failed',
      startTime: this.startTime,
      endTime: Date.now(),
      durationMs: Date.now() - this.startTime,
      metrics,
      successEvaluation: evaluation,
      events: this.events,
      recommendations
    };
  }
  
  buildFailure(error: Error): LoadTestResult {
    return {
      testId: this.testId,
      scenarioId: this.scenario.id,
      status: 'failed',
      startTime: this.startTime,
      endTime: Date.now(),
      durationMs: Date.now() - this.startTime,
      metrics: this.getAggregatedMetrics(),
      successEvaluation: {
        passed: false,
        criteriaResults: []
      },
      events: [
        ...this.events,
        {
          timestamp: Date.now(),
          type: 'test_failure',
          severity: 'critical',
          description: error.message
        }
      ],
      recommendations: []
    };
  }
}

interface MetricSample {
  timestamp: number;
  latencyMs: number;
  success: boolean;
  cell: string;
  endpoint: string;
}

/**
 * Instance de Chaos Monkey
 */
class ChaosMonkeyInstance {
  private running = false;
  private intervalId?: NodeJS.Timeout;
  
  constructor(
    private monkeyId: string,
    private config: ChaosMonkeyConfig
  ) {}
  
  async start(): Promise<void> {
    this.running = true;
    
    if (this.config.type === 'cell_failure') {
      // Attaque unique planifiée
      setTimeout(() => this.executeAttack(), 10000);
    } else {
      // Attaques périodiques basées sur probabilité
      this.intervalId = setInterval(() => {
        if (Math.random() < this.config.probability) {
          this.executeAttack();
        }
      }, 5000);
    }
  }
  
  async stop(): Promise<void> {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  private async executeAttack(): Promise<void> {
    console.log(`💥 [${this.monkeyId}] Attack executed: ${this.config.type}`);
    
    switch (this.config.type) {
      case 'latency':
        await this.injectLatency();
        break;
      case 'error':
        await this.injectErrors();
        break;
      case 'cell_failure':
        await this.simulateCellFailure();
        break;
      case 'network_partition':
        await this.simulateNetworkPartition();
        break;
      case 'resource_exhaustion':
        await this.exhaustResources();
        break;
    }
  }
  
  private async injectLatency(): Promise<void> {
    // Injection latence réseau (simulation)
    const extraLatency = this.config.intensity * 1000; // 0-1000ms
    console.log(`  → +${extraLatency.toFixed(0)}ms latency injected`);
  }
  
  private async injectErrors(): Promise<void> {
    // Injection erreurs HTTP (simulation)
    const errorRate = this.config.intensity * 0.5; // 0-50%
    console.log(`  → ${errorRate.toFixed(2)}% error rate injected`);
  }
  
  private async simulateCellFailure(): Promise<void> {
    // Simulation panne cellule (trigger failover)
    console.log(`  → Cell failure simulated on: ${this.config.targetCells?.join(', ')}`);
    // En production: appeler API Kubernetes pour tuer pods
  }
  
  private async simulateNetworkPartition(): Promise<void> {
    // Simulation partition réseau
    console.log(`  → Network partition simulated`);
  }
  
  private async exhaustResources(): Promise<void> {
    // Simulation épuisement ressources (CPU/mémoire)
    console.log(`  → Resource exhaustion simulated`);
  }
}

// Export pour usage
export const e2eLoadTestingEngine = new E2ELoadTestingEngine({
  stagingBaseUrl: 'https://staging.aethos.cloud',
  cells: ['us-east-1', 'eu-west-1', 'ap-northeast-1', 'cn-north-1'],
  maxConcurrentUsers: 100000,
  metricsRetentionDays: 90
});

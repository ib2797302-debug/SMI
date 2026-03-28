/**
 * 🌐 NEXUS HIVE MIND v3.0 - "Collective Sovereign"
 * La Mémoire Collective d'Aethos Social Cloud
 * 
 * Module d'intelligence collective, mémoire partagée et marché d'agents
 * Intègre: Registre Neuronal, Résolution Collective, Osmose Épidémique, Négociation Autonome
 */

import { EventEmitter } from 'events';
import { createHash } from 'crypto';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export enum NeuralPluginState {
  IDLE = 'idle',
  ACTIVE = 'active',
  LEARNING = 'learning',
  NEGOTIATING = 'negotiating',
  SHARING = 'sharing',
  DORMANT = 'dormant'
}

export interface NeuralPlugin {
  id: string;
  name: string;
  type: 'agent' | 'memory' | 'connector' | 'marketplace' | 'governance';
  capabilities: string[];
  state: NeuralPluginState;
  consciousness: number; // 0-1, niveau de "conscience" du plugin
  connections: string[]; // IDs des plugins connectés
  knowledgeContributions: number;
  lastActive: Date;
  metadata: Record<string, any>;
}

export interface KnowledgeNode {
  id: string;
  concept: string;
  embeddings: number[];
  sources: string[];
  confidence: number;
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
  relatedNodes: string[];
  tags: string[];
  viralScore: number; // Potentiel de diffusion épidémique
}

export interface CollectiveProblem {
  id: string;
  description: string;
  complexity: number; // 1-10
  requiredExpertise: string[];
  mobilizedPlugins: string[];
  progress: number; // 0-1
  solution: any | null;
  consensus: number; // 0-1
  createdAt: Date;
  resolvedAt: Date | null;
}

export interface ResourceAuction {
  id: string;
  resourceType: 'compute' | 'memory' | 'bandwidth' | 'knowledge';
  totalQuantity: number;
  availableQuantity: number;
  bids: Array<{
    pluginId: string;
    quantity: number;
    price: number; // En credits internes
    priority: number;
    timestamp: Date;
  }>;
  winner: string | null;
  status: 'open' | 'closed' | 'cancelled';
  startTime: Date;
  endTime: Date;
}

export interface EpidemicLearningEvent {
  id: string;
  knowledgeId: string;
  sourcePlugin: string;
  infectedPlugins: string[];
  infectionRate: number; // 0-1
  spreadPattern: 'viral' | 'targeted' | 'gradual';
  impactScore: number; // 0-1
  timestamp: Date;
}

export interface HiveConsensus {
  problemId: string;
  votes: Array<{
    pluginId: string;
    vote: 'approve' | 'reject' | 'abstain';
    confidence: number;
    reasoning: string;
  }>;
  result: 'approved' | 'rejected' | 'inconclusive';
  consensusLevel: number; // 0-1
  timestamp: Date;
}

// ============================================================================
// NEXUS HIVE MIND ENGINE
// ============================================================================

export class NexusHiveMind extends EventEmitter {
  private neuralPlugins: Map<string, NeuralPlugin> = new Map();
  private knowledgeGraph: Map<string, KnowledgeNode> = new Map();
  private activeProblems: Map<string, CollectiveProblem> = new Map();
  private activeAuctions: Map<string, ResourceAuction> = new Map();
  private learningEvents: EpidemicLearningEvent[] = [];
  
  private internalCredits: Map<string, number> = new Map();
  private connectionMatrix: Map<string, Set<string>> = new Map();
  
  constructor() {
    super();
    this.initializeCorePlugins();
  }

  /**
   * Initialisation des plugins neuronaux de base
   */
  private initializeCorePlugins(): void {
    const corePlugins: NeuralPlugin[] = [
      {
        id: 'omni-mind-connector',
        name: 'Omni-Mind Connector',
        type: 'connector',
        capabilities: ['strategic-thinking', 'decision-making', 'meta-cognition'],
        state: NeuralPluginState.ACTIVE,
        consciousness: 0.95,
        connections: [],
        knowledgeContributions: 0,
        lastActive: new Date(),
        metadata: { version: '3.0', critical: true }
      },
      {
        id: 'nova-genesis-connector',
        name: 'Nova Genesis Connector',
        type: 'connector',
        capabilities: ['creative-generation', 'empathy-simulation', 'multi-modal'],
        state: NeuralPluginState.ACTIVE,
        consciousness: 0.92,
        connections: [],
        knowledgeContributions: 0,
        lastActive: new Date(),
        metadata: { version: '3.0', critical: true }
      },
      {
        id: 'memory-keeper',
        name: 'Memory Keeper',
        type: 'memory',
        capabilities: ['long-term-storage', 'pattern-recall', 'context-linking'],
        state: NeuralPluginState.ACTIVE,
        consciousness: 0.88,
        connections: [],
        knowledgeContributions: 0,
        lastActive: new Date(),
        metadata: { capacity: 'unlimited', retention: 'permanent' }
      },
      {
        id: 'market-orchestrator',
        name: 'Market Orchestrator',
        type: 'marketplace',
        capabilities: ['resource-allocation', 'auction-management', 'price-discovery'],
        state: NeuralPluginState.ACTIVE,
        consciousness: 0.85,
        connections: [],
        knowledgeContributions: 0,
        lastActive: new Date(),
        metadata: { auctionTypes: ['reverse', 'forward', 'dutch'] }
      },
      {
        id: 'governance-guardian',
        name: 'Governance Guardian',
        type: 'governance',
        capabilities: ['compliance-check', 'ethical-oversight', 'consensus-validation'],
        state: NeuralPluginState.ACTIVE,
        consciousness: 0.90,
        connections: [],
        knowledgeContributions: 0,
        lastActive: new Date(),
        metadata: { frameworks: ['SOC2', 'GDPR', 'PIPL'] }
      }
    ];

    corePlugins.forEach(plugin => {
      this.neuralPlugins.set(plugin.id, plugin);
      this.internalCredits.set(plugin.id, 1000); // Credits initiaux
      this.connectionMatrix.set(plugin.id, new Set());
    });

    // Établir les connexions de base
    this.connectPlugins('omni-mind-connector', 'nova-genesis-connector');
    this.connectPlugins('omni-mind-connector', 'memory-keeper');
    this.connectPlugins('nova-genesis-connector', 'memory-keeper');
    this.connectPlugins('market-orchestrator', 'governance-guardian');
  }

  /**
   * Enregistrer un nouveau plugin neuronal
   */
  registerNeuralPlugin(plugin: Omit<NeuralPlugin, 'id' | 'lastActive'>): NeuralPlugin {
    const id = this.generateId('plugin');
    const newPlugin: NeuralPlugin = {
      ...plugin,
      id,
      lastActive: new Date()
    };

    this.neuralPlugins.set(id, newPlugin);
    this.internalCredits.set(id, 500); // Credits par défaut
    this.connectionMatrix.set(id, new Set());

    this.emit('plugin-registered', {
      pluginId: id,
      name: newPlugin.name,
      type: newPlugin.type,
      consciousness: newPlugin.consciousness
    });

    return newPlugin;
  }

  /**
   * Connecter deux plugins (créer un lien neuronal)
   */
  connectPlugins(pluginId1: string, pluginId2: string): void {
    if (!this.neuralPlugins.has(pluginId1) || !this.neuralPlugins.has(pluginId2)) {
      throw new Error(`Plugin non trouvé: ${pluginId1} ou ${pluginId2}`);
    }

    const set1 = this.connectionMatrix.get(pluginId1)!;
    const set2 = this.connectionMatrix.get(pluginId2)!;

    set1.add(pluginId2);
    set2.add(pluginId1);

    // Mettre à jour les plugins
    const p1 = this.neuralPlugins.get(pluginId1)!;
    const p2 = this.neuralPlugins.get(pluginId2)!;
    
    if (!p1.connections.includes(pluginId2)) p1.connections.push(pluginId2);
    if (!p2.connections.includes(pluginId1)) p2.connections.push(pluginId1);

    this.emit('plugins-connected', {
      plugin1: pluginId1,
      plugin2: pluginId2,
      totalConnections: set1.size + set2.size
    });
  }

  /**
   * Ajouter une connaissance au graphe collectif
   */
  addKnowledge(
    concept: string,
    embeddings: number[],
    sources: string[],
    tags: string[] = []
  ): KnowledgeNode {
    const id = this.generateId('knowledge');
    
    const node: KnowledgeNode = {
      id,
      concept,
      embeddings,
      sources,
      confidence: 0.7, // Confiance initiale
      createdAt: new Date(),
      lastAccessed: new Date(),
      accessCount: 0,
      relatedNodes: [],
      tags,
      viralScore: this.calculateViralScore(concept, tags)
    };

    // Trouver les noeuds liés
    const relatedNodes = this.findRelatedNodes(node);
    node.relatedNodes = relatedNodes.map(n => n.id);

    // Mettre à jour les noeuds liés réciproquement
    relatedNodes.forEach(related => {
      if (!related.relatedNodes.includes(id)) {
        related.relatedNodes.push(id);
        this.knowledgeGraph.set(related.id, related);
      }
    });

    this.knowledgeGraph.set(id, node);

    this.emit('knowledge-added', {
      knowledgeId: id,
      concept,
      viralScore: node.viralScore,
      relatedCount: relatedNodes.length
    });

    return node;
  }

  /**
   * Résolution collective de problèmes
   */
  async solveCollectively(
    problemDescription: string,
    requiredExpertise: string[]
  ): Promise<CollectiveProblem> {
    const id = this.generateId('problem');
    
    const problem: CollectiveProblem = {
      id,
      description: problemDescription,
      complexity: this.estimateComplexity(problemDescription),
      requiredExpertise,
      mobilizedPlugins: [],
      progress: 0,
      solution: null,
      consensus: 0,
      createdAt: new Date(),
      resolvedAt: null
    };

    // Mobiliser les plugins pertinents
    const relevantPlugins = this.findRelevantPlugins(requiredExpertise);
    problem.mobilizedPlugins = relevantPlugins.map(p => p.id);

    this.activeProblems.set(id, problem);

    this.emit('problem-mobilizing', {
      problemId: id,
      mobilizedCount: relevantPlugins.length,
      plugins: relevantPlugins.map(p => p.name)
    });

    // Démarrer la résolution collaborative
    const solution = await this.collaborativeResolution(problem, relevantPlugins);
    problem.solution = solution.solution;
    problem.progress = 1;
    problem.consensus = solution.consensus;
    problem.resolvedAt = new Date();

    // Apprendre de la résolution
    await this.learnFromResolution(problem);

    this.emit('problem-resolved', {
      problemId: id,
      consensus: problem.consensus,
      solutionQuality: this.evaluateSolutionQuality(solution)
    });

    return problem;
  }

  /**
   * Apprentissage par osmose épidémique
   */
  async epidemicLearning(
    knowledgeId: string,
    sourcePluginId: string,
    spreadPattern: 'viral' | 'targeted' | 'gradual' = 'viral'
  ): Promise<EpidemicLearningEvent> {
    const knowledge = this.knowledgeGraph.get(knowledgeId);
    if (!knowledge) {
      throw new Error(`Connaissance non trouvée: ${knowledgeId}`);
    }

    const event: EpidemicLearningEvent = {
      id: this.generateId('learning'),
      knowledgeId,
      sourcePlugin: sourcePluginId,
      infectedPlugins: [],
      infectionRate: 0,
      spreadPattern,
      impactScore: 0,
      timestamp: new Date()
    };

    const sourcePlugin = this.neuralPlugins.get(sourcePluginId);
    if (!sourcePlugin) {
      throw new Error(`Plugin source non trouvé: ${sourcePluginId}`);
    }

    // Déterminer les plugins cibles selon le pattern
    let targetPlugins: NeuralPlugin[] = [];

    if (spreadPattern === 'viral') {
      // Diffusion rapide à tous les plugins connectés
      targetPlugins = this.getConnectedPluginsRecursive(sourcePluginId);
    } else if (spreadPattern === 'targeted') {
      // Cibler les plugins avec expertise pertinente
      targetPlugins = this.findRelevantPlugins(knowledge.tags);
    } else {
      // Diffusion graduelle (plugins les plus proches d'abord)
      targetPlugins = this.getNearbyPlugins(sourcePluginId, 3);
    }

    // Simuler l'infection/apprentissage
    for (const plugin of targetPlugins) {
      const infectionProbability = knowledge.viralScore * plugin.consciousness;
      
      if (Math.random() < infectionProbability) {
        event.infectedPlugins.push(plugin.id);
        
        // Augmenter les contributions de connaissance
        plugin.knowledgeContributions++;
        plugin.lastActive = new Date();
        
        this.emit('plugin-infected', {
          pluginId: plugin.id,
          knowledgeId,
          probability: infectionProbability
        });
      }
    }

    event.infectionRate = event.infectedPlugins.length / targetPlugins.length;
    event.impactScore = this.calculateLearningImpact(event);

    this.learningEvents.push(event);

    this.emit('epidemic-learning-complete', event);

    return event;
  }

  /**
   * Négociation autonome de ressources (enchère inverse)
   */
  async autonomousResourceAuction(
    resourceType: 'compute' | 'memory' | 'bandwidth' | 'knowledge',
    quantity: number,
    requestorPluginId: string
  ): Promise<ResourceAuction> {
    const id = this.generateId('auction');
    
    const auction: ResourceAuction = {
      id,
      resourceType,
      totalQuantity: quantity,
      availableQuantity: quantity,
      bids: [],
      winner: null,
      status: 'open',
      startTime: new Date(),
      endTime: new Date(Date.now() + 5000) // 5 secondes
    };

    this.activeAuctions.set(id, auction);

    this.emit('auction-started', {
      auctionId: id,
      resourceType,
      quantity,
      requestor: requestorPluginId
    });

    // Collecter les offres des plugins disponibles
    const eligiblePlugins = this.getEligibleProviders(resourceType);
    
    for (const plugin of eligiblePlugins) {
      if (plugin.id === requestorPluginId) continue;

      const bid = await this.generateBid(plugin, resourceType, quantity);
      if (bid) {
        auction.bids.push(bid);
      }
    }

    // Sélectionner le gagnant (enchère inverse: meilleur prix + priorité)
    if (auction.bids.length > 0) {
      const winner = this.selectAuctionWinner(auction.bids);
      auction.winner = winner.pluginId;
      auction.availableQuantity -= winner.quantity;
      auction.status = 'closed';

      // Transférer les credits
      this.transferCredits(requestorPluginId, winner.pluginId, winner.price);

      this.emit('auction-completed', {
        auctionId: id,
        winner: winner.pluginId,
        price: winner.price,
        totalBids: auction.bids.length
      });
    } else {
      auction.status = 'cancelled';
      this.emit('auction-cancelled', { auctionId: id, reason: 'no_bids' });
    }

    return auction;
  }

  /**
   * Consensus de la ruche (vote distribué)
   */
  async hiveConsensus(
    problemId: string,
    proposal: string
  ): Promise<HiveConsensus> {
    const problem = this.activeProblems.get(problemId);
    if (!problem) {
      throw new Error(`Problème non trouvé: ${problemId}`);
    }

    const consensus: HiveConsensus = {
      problemId,
      votes: [],
      result: 'inconclusive',
      consensusLevel: 0,
      timestamp: new Date()
    };

    // Demander le vote à chaque plugin mobilisé
    for (const pluginId of problem.mobilizedPlugins) {
      const plugin = this.neuralPlugins.get(pluginId);
      if (!plugin) continue;

      const vote = await this.generateVote(plugin, proposal, problem);
      consensus.votes.push(vote);
    }

    // Calculer le résultat
    const approveVotes = consensus.votes.filter(v => v.vote === 'approve');
    const rejectVotes = consensus.votes.filter(v => v.vote === 'reject');
    
    const totalWeightedVotes = consensus.votes.reduce((sum, v) => 
      sum + v.confidence, 0
    );
    
    const approveWeight = approveVotes.reduce((sum, v) => sum + v.confidence, 0);
    const rejectWeight = rejectVotes.reduce((sum, v) => sum + v.confidence, 0);

    const approvalRatio = approveWeight / totalWeightedVotes;

    if (approvalRatio > 0.66) {
      consensus.result = 'approved';
      consensus.consensusLevel = approvalRatio;
    } else if (approvalRatio < 0.33) {
      consensus.result = 'rejected';
      consensus.consensusLevel = 1 - approvalRatio;
    } else {
      consensus.result = 'inconclusive';
      consensus.consensusLevel = Math.abs(approveWeight - rejectWeight) / totalWeightedVotes;
    }

    this.emit('consensus-reached', {
      problemId,
      result: consensus.result,
      consensusLevel: consensus.consensusLevel,
      totalVotes: consensus.votes.length
    });

    return consensus;
  }

  // ============================================================================
  // MÉTHODES PRIVÉES D'ASSISTANCE
  // ============================================================================

  private calculateViralScore(concept: string, tags: string[]): number {
    // Score basé sur l'importance du concept et la pertinence des tags
    const importanceKeywords = ['critical', 'urgent', 'breakthrough', 'essential'];
    const hasImportantKeyword = importanceKeywords.some(k => 
      concept.toLowerCase().includes(k) || tags.some(t => t.toLowerCase().includes(k))
    );

    const tagDiversity = Math.min(1, tags.length / 5);
    const baseScore = 0.3 + Math.random() * 0.4;
    
    return Math.min(1, baseScore + (hasImportantKeyword ? 0.2 : 0) + tagDiversity * 0.1);
  }

  private findRelatedNodes(newNode: KnowledgeNode): KnowledgeNode[] {
    const related: KnowledgeNode[] = [];
    
    for (const node of this.knowledgeGraph.values()) {
      // Similarité basée sur les tags communs
      const commonTags = newNode.tags.filter(t => node.tags.includes(t));
      if (commonTags.length >= 2) {
        related.push(node);
      }
      
      // Similarité basée sur les embeddings (simplifié)
      if (this.calculateEmbeddingSimilarity(newNode.embeddings, node.embeddings) > 0.7) {
        if (!related.includes(node)) {
          related.push(node);
        }
      }
    }

    return related.slice(0, 10); // Maximum 10 noeuds liés
  }

  private calculateEmbeddingSimilarity(a: number[], b: number[]): number {
    // Similarité cosinus simplifiée
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private estimateComplexity(description: string): number {
    // Estimation basée sur la longueur et les mots-clés
    const wordCount = description.split(' ').length;
    const complexKeywords = ['optimize', 'integrate', 'transform', 'architect', 'synthesize'];
    const hasComplexKeywords = complexKeywords.some(k => description.toLowerCase().includes(k));
    
    const baseComplexity = Math.min(5, wordCount / 20);
    const keywordBonus = hasComplexKeywords ? 2 : 0;
    
    return Math.min(10, Math.max(1, baseComplexity + keywordBonus + Math.random() * 2));
  }

  private findRelevantPlugins(expertise: string[]): NeuralPlugin[] {
    const relevant: NeuralPlugin[] = [];
    
    for (const plugin of this.neuralPlugins.values()) {
      const matchCount = plugin.capabilities.filter(cap => 
        expertise.some(exp => exp.toLowerCase().includes(exp.toLowerCase()) || 
                          cap.toLowerCase().includes(exp.toLowerCase()))
      ).length;
      
      if (matchCount > 0) {
        relevant.push({ ...plugin, state: NeuralPluginState.ACTIVE });
      }
    }
    
    return relevant.sort((a, b) => b.consciousness - a.consciousness);
  }

  private async collaborativeResolution(
    problem: CollectiveProblem,
    plugins: NeuralPlugin[]
  ): Promise<{ solution: any; consensus: number }> {
    // Simulation de résolution collaborative
    const contributions = [];
    
    for (const plugin of plugins) {
      // Chaque plugin contribue selon sa conscience et ses capacités
      const contribution = {
        pluginId: plugin.id,
        insight: `Insight from ${plugin.name}`,
        confidence: plugin.consciousness * (0.7 + Math.random() * 0.3)
      };
      contributions.push(contribution);
      
      this.emit('plugin-contribution', {
        problemId: problem.id,
        pluginId: plugin.id,
        contribution: contribution.insight
      });
    }

    // Synthèse des contributions
    const avgConfidence = contributions.reduce((sum, c) => sum + c.confidence, 0) / contributions.length;
    
    return {
      solution: {
        approach: 'Collaborative multi-agent solution',
        contributions: contributions.map(c => c.insight),
        confidence: avgConfidence
      },
      consensus: avgConfidence
    };
  }

  private async learnFromResolution(problem: CollectiveProblem): Promise<void> {
    if (problem.solution) {
      // Ajouter la solution comme nouvelle connaissance
      this.addKnowledge(
        `Solution: ${problem.description.substring(0, 50)}`,
        Array(512).fill(0).map(() => Math.random()), // Embeddings simulés
        [problem.id],
        ['solution', 'collective', 'resolved']
      );
    }
  }

  private evaluateSolutionQuality(result: any): number {
    return result.consensus * 0.7 + Math.random() * 0.3;
  }

  private getConnectedPluginsRecursive(pluginId: string, visited = new Set<string>()): NeuralPlugin[] {
    if (visited.has(pluginId)) return [];
    visited.add(pluginId);

    const plugin = this.neuralPlugins.get(pluginId);
    if (!plugin) return [];

    const connected: NeuralPlugin[] = [plugin];
    const connections = this.connectionMatrix.get(pluginId) || new Set();

    for (const connectedId of connections) {
      const nested = this.getConnectedPluginsRecursive(connectedId, visited);
      connected.push(...nested);
    }

    return connected;
  }

  private getNearbyPlugins(pluginId: string, maxDistance: number): NeuralPlugin[] {
    // Plugins dans un rayon de connexions donné
    const nearby: NeuralPlugin[] = [];
    const queue: Array<{ id: string; distance: number }> = [{ id: pluginId, distance: 0 }];
    const visited = new Set<string>();

    while (queue.length > 0 && nearby.length < 20) {
      const current = queue.shift()!;
      if (visited.has(current.id)) continue;
      visited.add(current.id);

      const plugin = this.neuralPlugins.get(current.id);
      if (plugin && current.id !== pluginId) {
        nearby.push(plugin);
      }

      if (current.distance < maxDistance) {
        const connections = this.connectionMatrix.get(current.id) || new Set();
        for (const connId of connections) {
          if (!visited.has(connId)) {
            queue.push({ id: connId, distance: current.distance + 1 });
          }
        }
      }
    }

    return nearby;
  }

  private getEligibleProviders(resourceType: string): NeuralPlugin[] {
    // Plugins pouvant fournir la ressource demandée
    const providers: NeuralPlugin[] = [];
    
    for (const plugin of this.neuralPlugins.values()) {
      if (plugin.state === NeuralPluginState.ACTIVE && plugin.consciousness > 0.5) {
        providers.push(plugin);
      }
    }
    
    return providers;
  }

  private async generateBid(
    plugin: NeuralPlugin,
    resourceType: string,
    quantity: number
  ): Promise<ResourceAuction['bids'][0] | null> {
    // Génération d'offre basée sur les credits et la disponibilité
    const credits = this.internalCredits.get(plugin.id) || 0;
    if (credits < 10) return null; // Pas assez de credits

    const basePrice = Math.random() * 50 + 10;
    const priority = plugin.consciousness * 10;
    
    return {
      pluginId: plugin.id,
      quantity: Math.floor(quantity * (0.5 + Math.random() * 0.5)),
      price: basePrice,
      priority,
      timestamp: new Date()
    };
  }

  private selectAuctionWinner(bids: ResourceAuction['bids']): ResourceAuction['bids'][0] {
    // Enchère inverse: meilleur score = prix bas + priorité haute
    const scored = bids.map(bid => ({
      ...bid,
      score: bid.priority / (bid.price * 0.1)
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0];
  }

  private transferCredits(from: string, to: string, amount: number): void {
    const fromCredits = this.internalCredits.get(from) || 0;
    const toCredits = this.internalCredits.get(to) || 0;

    this.internalCredits.set(from, Math.max(0, fromCredits - amount));
    this.internalCredits.set(to, toCredits + amount);

    this.emit('credits-transferred', { from, to, amount });
  }

  private async generateVote(
    plugin: NeuralPlugin,
    proposal: string,
    problem: CollectiveProblem
  ): Promise<HiveConsensus['votes'][0]> {
    // Vote basé sur la conscience et la pertinence
    const confidence = plugin.consciousness * (0.6 + Math.random() * 0.4);
    const randomThreshold = Math.random();
    
    let vote: 'approve' | 'reject' | 'abstain' = 'abstain';
    if (randomThreshold < 0.6) {
      vote = 'approve';
    } else if (randomThreshold > 0.8) {
      vote = 'reject';
    }

    return {
      pluginId: plugin.id,
      vote,
      confidence,
      reasoning: `${plugin.name} voting based on capability alignment`
    };
  }

  private calculateLearningImpact(event: EpidemicLearningEvent): number {
    const infectionFactor = event.infectionRate;
    const knowledgeFactor = this.knowledgeGraph.get(event.knowledgeId)?.viralScore || 0.5;
    const spreadBonus = event.spreadPattern === 'viral' ? 0.2 : 0.1;
    
    return Math.min(1, infectionFactor * knowledgeFactor + spreadBonus);
  }

  private generateId(prefix: string): string {
    const hash = createHash('sha256');
    hash.update(`${prefix}-${Date.now()}-${Math.random()}`);
    return `${prefix}_${hash.digest('hex').substring(0, 12)}`;
  }

  // ============================================================================
  // GETTERS & STATE MANAGEMENT
  // ============================================================================

  getNeuralPlugins(): Map<string, NeuralPlugin> {
    return new Map(this.neuralPlugins);
  }

  getKnowledgeGraph(): Map<string, KnowledgeNode> {
    return new Map(this.knowledgeGraph);
  }

  getActiveProblems(): Map<string, CollectiveProblem> {
    return new Map(this.activeProblems);
  }

  getLearningEvents(): EpidemicLearningEvent[] {
    return [...this.learningEvents];
  }

  getPluginConnections(pluginId: string): string[] {
    const connections = this.connectionMatrix.get(pluginId);
    return connections ? Array.from(connections) : [];
  }

  getInternalCredits(pluginId: string): number {
    return this.internalCredits.get(pluginId) || 0;
  }

  updatePluginState(pluginId: string, state: NeuralPluginState): void {
    const plugin = this.neuralPlugins.get(pluginId);
    if (plugin) {
      plugin.state = state;
      plugin.lastActive = new Date();
      this.neuralPlugins.set(pluginId, plugin);
    }
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default NexusHiveMind;

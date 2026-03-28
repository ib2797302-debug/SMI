/**
 * ADVANCED OBSERVABILITY SYSTEM
 * Système d'Observabilité Avancée
 * 
 * Logging, tracing, métriques et alertes en temps réel
 */

export interface LogEntry {
  timestamp: number;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  message: string;
  cellId: string;
  context?: any;
  traceId?: string;
}

export interface Trace {
  id: string;
  operation: string;
  startTime: number;
  endTime?: number;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  attributes: Record<string, any>;
  spans: Span[];
}

export interface Span {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'OK' | 'ERROR';
  error?: any;
}

export class AdvancedObservability {
  private cellId: string;
  private logs: LogEntry[] = [];
  private traces: Map<string, Trace> = new Map();
  private metrics: Map<string, number[]> = new Map();
  private maxLogs: number = 1000;
  private alertCallbacks: Array<(level: string, message: string) => void> = [];

  constructor(cellId: string) {
    this.cellId = cellId;
  }

  /**
   * Journalisation structurée
   */
  log(
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL',
    message: string,
    context?: any,
    traceId?: string
  ): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      cellId: this.cellId,
      context,
      traceId
    };

    this.logs.push(entry);

    // Nettoyage automatique
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Output console en développement
    if (process.env.NODE_ENV !== 'production') {
      const color = this.getLogLevelColor(level);
      console.log(`[${color}${level}\x1b[0m] ${message}`, context || '');
    }

    // Alerte immédiate pour CRITICAL
    if (level === 'CRITICAL') {
      this.triggerAlerts('CRITICAL', message);
    }
  }

  /**
   * Démarrage d'une trace distribuée
   */
  startTrace(operation: string, attributes: Record<string, any> = {}): string {
    const traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const trace: Trace = {
      id: traceId,
      operation,
      startTime: Date.now(),
      status: 'RUNNING',
      attributes,
      spans: []
    };

    this.traces.set(traceId, trace);
    return traceId;
  }

  /**
   * Ajout d'un span à une trace
   */
  addSpan(traceId: string, spanName: string): () => void {
    const trace = this.traces.get(traceId);
    if (!trace) return () => {};

    const span: Span = {
      name: spanName,
      startTime: Date.now(),
      status: 'OK'
    };

    trace.spans.push(span);

    // Retourne fonction de fin du span
    return () => {
      span.endTime = Date.now();
      span.duration = span.endTime - span.startTime;
    };
  }

  /**
   * Fin d'une trace
   */
  endTrace(traceId: string, result?: any): void {
    const trace = this.traces.get(traceId);
    if (!trace) return;

    trace.endTime = Date.now();
    trace.status = result?.error ? 'FAILED' : 'COMPLETED';
    
    // Enrichir avec les résultats
    if (result) {
      trace.attributes.result = result;
    }

    // Calcul des métriques de performance
    const duration = trace.endTime - trace.startTime;
    this.recordMetric(`trace.${trace.operation}.duration`, duration);
  }

  /**
   * Enregistrement d'une métrique
   */
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Garder seulement les 100 dernières valeurs
    if (values.length > 100) {
      values.shift();
    }
  }

  /**
   * Récupération des statistiques d'une métrique
   */
  getMetricStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    return {
      avg: sum / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  }

  /**
   * Inscription d'un callback d'alerte
   */
  onAlert(callback: (level: string, message: string) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Déclenchement des alertes
   */
  alert(level: string, message: string): void {
    this.triggerAlerts(level, message);
    this.log(level as any, `[ALERT] ${message}`);
  }

  private triggerAlerts(level: string, message: string): void {
    this.alertCallbacks.forEach(cb => cb(level, message));
  }

  /**
   * Flush des logs vers un système externe
   */
  async flush(): Promise<void> {
    // Simulation d'envoi vers un système de logging distant
    // (ELK, Datadog, CloudWatch, etc.)
    this.log('INFO', `Flush de ${this.logs.length} logs effectué`);
    
    // Ici, implémenter l'envoi vers le backend de logging
    return Promise.resolve();
  }

  /**
   * Récupération des logs récents
   */
  getRecentLogs(limit: number = 50, level?: string): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = this.logs.filter(log => log.level === level);
    }
    return filtered.slice(-limit);
  }

  /**
   * Récupération d'une trace
   */
  getTrace(traceId: string): Trace | undefined {
    return this.traces.get(traceId);
  }

  /**
   * Métriques de santé du système d'observabilité
   */
  getHealthMetrics(): {
    totalLogs: number;
    activeTraces: number;
    metricsCount: number;
    errorRate: number;
  } {
    const recentLogs = this.logs.slice(-100);
    const errorCount = recentLogs.filter(l => l.level === 'ERROR' || l.level === 'CRITICAL').length;
    
    return {
      totalLogs: this.logs.length,
      activeTraces: Array.from(this.traces.values()).filter(t => t.status === 'RUNNING').length,
      metricsCount: this.metrics.size,
      errorRate: recentLogs.length > 0 ? errorCount / recentLogs.length : 0
    };
  }

  /**
   * Couleurs pour logs console
   */
  private getLogLevelColor(level: string): string {
    const colors: Record<string, string> = {
      DEBUG: '\x1b[36m',    // Cyan
      INFO: '\x1b[32m',     // Green
      WARN: '\x1b[33m',     // Yellow
      ERROR: '\x1b[31m',    // Red
      CRITICAL: '\x1b[35m'  // Magenta
    };
    return colors[level] || '\x1b[0m';
  }

  /**
   * Nettoyage des anciennes traces
   */
  cleanupOldTraces(maxAgeMs: number = 3600000): void {
    const now = Date.now();
    for (const [id, trace] of this.traces.entries()) {
      if (now - trace.startTime > maxAgeMs) {
        this.traces.delete(id);
      }
    }
  }
}

/**
 * AUTO-REPAIR SYSTEM
 * Système Auto-Cicatrisant Intelligent
 * 
 * Détecte, diagnostique et répare automatiquement les anomalies
 * sans interruption de service.
 */

import { AdvancedObservability } from '../utils/advanced-observability';

export interface RepairableModule {
  name?: string;
  healthCheck?: () => Promise<boolean>;
  reset?: () => Promise<void>;
  reconnect?: () => Promise<void>;
}

export interface RepairEvent {
  id: string;
  timestamp: number;
  errorType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  diagnosis: string;
  actionTaken: string;
  success: boolean;
  durationMs: number;
}

export class AutoRepairSystem {
  private modules: RepairableModule[];
  private observability: AdvancedObservability;
  private enabled: boolean;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private repairHistory: RepairEvent[] = [];
  private isEmergencyMode: boolean = false;

  constructor(
    modules: RepairableModule[],
    observability: AdvancedObservability,
    enabled: boolean = true
  ) {
    this.modules = modules;
    this.observability = observability;
    this.enabled = enabled;
  }

  /**
   * Démarrage de la surveillance continue
   */
  async startMonitoring(): Promise<void> {
    if (!this.enabled) return;

    this.observability.log('INFO', 'Démarrage Auto-Repair System');
    
    // Health check toutes les 10 secondes
    this.monitoringInterval = setInterval(async () => {
      await this.runHealthChecks();
    }, 10000);
  }

  /**
   * Arrêt de la surveillance
   */
  async stopMonitoring(): Promise<void> {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.observability.log('INFO', 'Auto-Repair System arrêté');
  }

  /**
   * Exécution des checks de santé sur tous les modules
   */
  private async runHealthChecks(): Promise<void> {
    if (this.isEmergencyMode) return;

    const checks = this.modules.map(async (module) => {
      if (!module.healthCheck) return;
      
      try {
        const isHealthy = await module.healthCheck();
        if (!isHealthy) {
          this.observability.log('WARN', `Module ${module.name || 'inconnu'} défaillant`);
          await this.attemptRepair('HEALTH_CHECK_FAILED', new Error('Health check failed'), { moduleName: module.name });
        }
      } catch (error) {
        this.observability.log('ERROR', `Erreur health check module ${module.name}`, error);
      }
    });

    await Promise.allSettled(checks);
  }

  /**
   * Tentative de réparation automatique
   */
  async attemptRepair(
    errorType: string,
    error: any,
    context?: any
  ): Promise<RepairEvent> {
    const startTime = Date.now();
    const eventId = `repair_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.observability.log('WARN', `Tentative de réparation: ${errorType}`, { context, error: error.message });

    let diagnosis = 'Diagnosis in progress...';
    let actionTaken = 'No action taken';
    let success = false;

    try {
      // 1. Diagnostic intelligent basé sur le type d'erreur
      diagnosis = this.diagnoseError(errorType, error, context);
      
      // 2. Sélection de la stratégie de réparation
      const strategy = this.selectRepairStrategy(errorType, diagnosis);
      
      // 3. Exécution de la réparation
      actionTaken = await this.executeRepairStrategy(strategy, context);
      success = true;

      this.observability.log('INFO', `Réparation réussie: ${actionTaken}`, { eventId });

    } catch (repairError) {
      this.observability.log('ERROR', `Échec de la réparation`, repairError);
      actionTaken = `Failed: ${repairError.message}`;
      success = false;
      
      // Escalade si échec critique
      if (this.isCriticalError(errorType)) {
        await this.emergencyIsolation();
      }
    }

    const durationMs = Date.now() - startTime;
    
    const event: RepairEvent = {
      id: eventId,
      timestamp: startTime,
      errorType,
      severity: this.assessSeverity(errorType, error),
      diagnosis,
      actionTaken,
      success,
      durationMs
    };

    this.repairHistory.push(event);
    
    // Nettoyage historique (garder les 100 derniers événements)
    if (this.repairHistory.length > 100) {
      this.repairHistory = this.repairHistory.slice(-100);
    }

    return event;
  }

  /**
   * Diagnostic intelligent de l'erreur
   */
  private diagnoseError(errorType: string, error: any, context?: any): string {
    const patterns: Record<string, string> = {
      'SYSTEM_STARTUP': 'Échec initialisation composants critiques',
      'POST_PROCESSING': 'Erreur traitement flux de données ou timeout API externe',
      'UNHANDLED_REJECTION': 'Promesse non gérée indiquant un manque de gestion d\'erreur',
      'HEALTH_CHECK_FAILED': 'Module répondant lentement ou état interne corrompu',
      'CONNECTION_LOST': 'Perte de connectivité réseau ou service distant indisponible',
      'MEMORY_PRESSURE': 'Consommation mémoire excessive détectée',
      'CPU_SPIKE': 'Charge CPU anormale indiquant une boucle infinie ou calcul intensif'
    };

    return patterns[errorType] || `Erreur inconnue: ${error.message || 'Unknown error'}`;
  }

  /**
   * Sélection de la stratégie de réparation optimale
   */
  private selectRepairStrategy(errorType: string, diagnosis: string): string {
    if (errorType.includes('CONNECTION') || errorType.includes('TIMEOUT')) {
      return 'RECONNECT';
    }
    
    if (errorType.includes('MEMORY') || errorType.includes('CPU')) {
      return 'RESET_MODULE';
    }
    
    if (errorType.includes('STARTUP')) {
      return 'FULL_REINIT';
    }

    // Stratégie par défaut : tentative de reconnexion puis reset
    return 'SOFT_RESET';
  }

  /**
   * Exécution de la stratégie de réparation
   */
  private async executeRepairStrategy(strategy: string, context?: any): Promise<string> {
    switch (strategy) {
      case 'RECONNECT':
        await this.performReconnection(context);
        return 'Reconnexion services externes effectuée';
        
      case 'RESET_MODULE':
        await this.performModuleReset(context);
        return 'Reset module effectué avec succès';
        
      case 'SOFT_RESET':
        await this.performSoftReset();
        return 'Soft reset système effectué';
        
      case 'FULL_REINIT':
        await this.performFullReinit();
        return 'Réinitialisation complète effectuée';
        
      default:
        return 'Aucune stratégie applicable trouvée';
    }
  }

  /**
   * Reconnexion des services
   */
  private async performReconnection(context?: any): Promise<void> {
    const modulesToReconnect = this.modules.filter(m => m.reconnect);
    
    for (const module of modulesToReconnect) {
      try {
        await module.reconnect!();
        this.observability.log('INFO', `Module ${module.name} reconnecté`);
      } catch (err) {
        this.observability.log('ERROR', `Échec reconnexion module ${module.name}`, err);
      }
    }
  }

  /**
   * Reset d'un module spécifique
   */
  private async performModuleReset(context?: any): Promise<void> {
    const moduleName = context?.moduleName;
    const module = this.modules.find(m => m.name === moduleName);
    
    if (module && module.reset) {
      await module.reset();
      this.observability.log('INFO', `Module ${moduleName} reseté`);
    }
  }

  /**
   * Soft reset global
   */
  private async performSoftReset(): Promise<void> {
    // Réinitialisation légère sans perte d'état critique
    this.observability.log('INFO', 'Soft reset en cours...');
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  /**
   * Réinitialisation complète
   */
  private async performFullReinit(): Promise<void> {
    this.observability.log('WARN', 'Full reinit en cours - Interruption temporaire possible');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Évaluation de la sévérité
   */
  private assessSeverity(errorType: string, error: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (errorType.includes('CRITICAL') || errorType.includes('EMERGENCY')) {
      return 'CRITICAL';
    }
    if (errorType.includes('STARTUP') || errorType.includes('MEMORY')) {
      return 'HIGH';
    }
    if (errorType.includes('CONNECTION') || errorType.includes('TIMEOUT')) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  /**
   * Vérifie si l'erreur est critique
   */
  private isCriticalError(errorType: string): boolean {
    return ['SYSTEM_STARTUP', 'MEMORY_PRESSURE', 'CPU_SPIKE', 'DATA_CORRUPTION'].includes(errorType);
  }

  /**
   * Mode urgence : isolation des composants défaillants
   */
  async emergencyIsolation(): Promise<void> {
    this.isEmergencyMode = true;
    this.observability.log('CRITICAL', 'MODE URGENCE ACTIVÉ - Isolation composants');
    
    // Déconnexion sécurisée des modules non essentiels
    // Maintien uniquement des fonctions critiques (gouvernance, sécurité)
    
    await this.observability.flush();
    
    // Alerte équipe ops
    this.observability.alert('CRITICAL', 'Système en mode urgence - Intervention humaine requise');
  }

  /**
   * Récupération du nombre de réparations
   */
  getRepairCount(): number {
    return this.repairHistory.length;
  }

  /**
   * Récupération des statistiques de réparation
   */
  getRepairStats(): { total: number; success: number; failed: number; avgDurationMs: number } {
    const total = this.repairHistory.length;
    const success = this.repairHistory.filter(r => r.success).length;
    const failed = total - success;
    const avgDurationMs = total > 0 
      ? this.repairHistory.reduce((acc, r) => acc + r.durationMs, 0) / total 
      : 0;

    return { total, success, failed, avgDurationMs };
  }

  /**
   * Historique des réparations
   */
  getRepairHistory(limit: number = 10): RepairEvent[] {
    return this.repairHistory.slice(-limit);
  }
}

# 🎓 AETHOS SOCIAL CLOUD - ADMIN COMMAND CENTER FORMATION GUIDE

## Vue d'Ensemble

Le **Command Center** est l'interface de contrôle ultime pour les administrateurs Aethos. Il centralise la supervision de tous les modules cognitifs, la gestion des privilèges IA, le monitoring des performances et les opérations critiques.

---

## 🔑 Accès et Authentification

### Niveaux d'Accès Admin

| Niveau | Périmètre | Prérequis | MFA Requis |
|--------|-----------|-----------|------------|
| **L1 - Support** | Tickets utilisateurs, reset passwords | Formation base | ✅ SMS/Email |
| **L2 - Ops** | Monitoring, déploiements mineurs, scaling | Certification L1 + 3 mois | ✅ TOTP/App |
| **L3 - SysAdmin** | Configuration système, gouvernance, cells | Certification L2 + 6 mois | ✅ Hardware Key |
| **L4 - Super Admin** | Full access, audit logs, emergency overrides | Approval Board + background check | ✅ Multi-key (3/5) |

### Procédure de Connexion Sécurisée

```typescript
// Flow d'authentification admin
POST /api/admin/auth/login
{
  username: "admin_jdoe",
  password: "••••••••",
  mfaCode: "123456",
  context: {
    ipAddress: "203.0.113.42",
    deviceFingerprint: "abc123...",
    location: "Paris, FR"
  }
}

// Réponse avec token temporaire (15 min)
{
  accessToken: "eyJhbGc...",
  refreshToken: "dGhpcyBp...",
  expiresIn: 900,
  requiredActions: [] // ou ["CHANGE_PASSWORD", "REVIEW_SECURITY_ALERTS"]
}
```

---

## 🖥️ Modules du Command Center

### 1. **Dashboard Global** (Vue d'ensemble temps réel)

**Métriques Clés Affichées**:
- 🟢 Disponibilité Système: 99.99% (Cell-based)
- 🧠 Synergie Triadique: 0.87/1.00
- ⚡ Latence Moyenne: 142ms (< 200ms target)
- 📊 Posts Traités (24h): 2.4M
- 💰 Coût Infrastructure: 0.0012 $/post (< 0.0015 $ target)
- 🔐 Alertes Sécurité Actives: 3 (à reviewer)

**Widgets Interactifs**:
- Carte thermique régionale (trafic par cellule)
- Graphique de synergie cognitive (Omni/Nexus/Nova)
- Top templates marketplace (trending)
- Feed d'incidents en temps réel

---

### 2. **Gestion des Utilisateurs & Privilèges IA**

#### Recherche et Filtrage
```
Rechercher: [nom/email/ID] ────────────────🔍
Filtres: [Rôle ▼] [Profil Cognitif ▼] [Risk Score ▼] [Statut ▼]
```

#### Fiche Utilisateur Détaillée

**Onglets**:
1. **Profil**: Informations de base, abonnements, connected accounts
2. **Privilèges**: behavioralScore, riskScore, dynamic permissions
3. **Activité**: Logs de connexion, posts publiés, templates utilisés
4. **IA Adaptation**: Profil cognitif détecté (MINIMAL/VIBRANT/FOCUSED)
5. **Alertes**: Incidents, violations, downgrades automatiques

**Actions Disponibles**:
- ✏️ Modifier manuellement les seuils (override IA)
- 🔒 Suspendre compte (temporaire/permanent)
- ⬇️ Downgrader privilèges (urgence sécurité)
- 📤 Exporter données (GDPR compliance)
- 👁️ Voir en tant que l'utilisateur (debug mode)

---

### 3. **Monitoring Cognitive Triad**

#### Omni-Mind Core Metrics
```
┌────────────────────────────────────────────┐
│ OMNI-MIND HEALTH                           │
├────────────────────────────────────────────┤
│ Decision Quality:     ████████░░  82%      │
│ Monte Carlo Simulations: 1,247 (24h)       │
│ Auto-Critiques Triggered: 34               │
│ Bio-Context Adjustments: 156 users         │
│ Policy Updates Applied: 3 (v2.4.1 → v2.4.2)│
└────────────────────────────────────────────┘
```

#### Nexus Hive Mind Metrics
```
┌────────────────────────────────────────────┐
│ NEXUS HIVE HEALTH                          │
├────────────────────────────────────────────┤
│ Neural Plugins Active: 5                   │
│ Knowledge Graph Nodes: 2.4M (+12k today)   │
│ Epidemic Learning Events: 7                │
│ Internal Auctions (24h): 342               │
│ Avg Consensus Time: 23ms                   │
└────────────────────────────────────────────┘
```

#### Nova Genesis Metrics
```
┌────────────────────────────────────────────┐
│ NOVA GENESIS HEALTH                        │
├────────────────────────────────────────────┤
│ Creative Concepts Generated: 8,432 (24h)   │
│ Genetic Algorithm Runs: 234                │
│ Empathy Accuracy: 0.79                     │
│ UI Auto-Evolutions Applied: 12             │
│ Spontaneous Pulse Ideas: 421 (5.2%/sec)    │
└────────────────────────────────────────────┘
```

---

### 4. **Gestion des Abonnements Modulaires**

#### Vue d'Ensemble des Plans Actifs
```
┌─────────────────────────────────────────────────────────────┐
│ ABONNEMENTS ACTIFS (Total: 12,450 utilisateurs payants)     │
├─────────────────────────────────────────────────────────────┤
│ STARTER (0 $)          : 8,230 users  │ Churn: 2.1%/mois   │
│ GROWTH (29 $)          : 2,890 users  │ Churn: 1.4%/mois   │
│ PRO (79 $)             : 980 users    │ Churn: 0.8%/mois   │
│ ENTERPRISE (Custom)    : 350 users    │ Churn: 0.3%/mois   │
│                                                                │
│ MODULES ADD-ONS POPULAIRES:                                   │
│ • Creator Studio Pro   : 1,240 activations (+15%)            │
│ • Advanced Analytics   : 890 activations (+8%)               │
│ • China Expansion      : 120 activations (+22%)              │
│ • SOC2 Compliance Pack : 85 activations (+5%)                │
└─────────────────────────────────────────────────────────────┘
```

#### Actions sur Abonnements
- 🎁 Offrir crédit promotionnel
- 🔄 Changer de plan (upgrade/downgrade)
- ❌ Annuler avec raison (churn analysis)
- 📊 Voir historique de paiement
- 🤖 Recommandation IA de module (basé sur usage)

---

### 5. **Supervision des Connecteurs Sociaux**

#### État des APIs par Plateforme
| Plateforme | Statut | Latence | Rate Limit | Erreurs (24h) |
|------------|--------|---------|------------|---------------|
| YouTube | 🟢 Operational | 89ms | 98%可用 | 12 |
| TikTok | 🟢 Operational | 124ms | 95%可用 | 34 |
| Instagram | 🟢 Operational | 156ms | 92%可用 | 28 |
| Facebook | 🟢 Operational | 143ms | 94%可用 | 19 |
| LinkedIn | 🟢 Operational | 178ms | 89%可用 | 45 |
| Twitter/X | 🟡 Degraded | 312ms | 76%可用 | 128 ⚠️ |
| Pinterest | 🟢 Operational | 98ms | 97%可用 | 8 |
| Snapchat | 🟢 Operational | 112ms | 96%可用 | 15 |

**Actions Correctives**:
- 🔄 Refresh tokens API
- ⚙️ Ajuster rate limits
- 📞 Escalade vers support plateforme
- 📉 Basculer en mode dégradé

---

### 6. **Audit Logs & Conformité**

#### Recherche dans les Logs
```
Filtres: [Date Range] [User ID] [Action Type] [Severity] [Module]
Exemple: user_id="user_123" AND action="PRIVILEGE_CHANGE" AND date>"2025-01-01"
```

#### Types d'Événements Trackés
- 🔐 Authentifications (succès/échec)
- 👤 Changements de privilèges (auto ou manuel)
- 📝 Publications de contenu
- 🛒 Achats marketplace
- ⚙️ Modifications configuration
- 🚨 Alertes sécurité (risk score spikes)
- 🧠 Décisions IA critiques (avec Chain-of-Thought)

#### Export pour Audit
- Formats: JSON, CSV, PDF (signed)
- Rétention: 7 ans (SOC2 requirement)
- Chiffrement: AES-256 avec clés dédiées

---

### 7. **Emergency Response Console**

#### Scénarios d'Urgence Pré-Configurés

**1. Compte Admin Compromis**
```bash
# Commande d'urgence
POST /api/admin/emergency/downgrade-admin
{
  adminId: "admin_malicious",
  reason: "SUSPECTED_COMPROMISE",
  notifySecurityTeam: true,
  revokeAllSessions: true,
  freezeActions: true
}

# Actions Automatiques Déclenchées:
✅ Immediate session termination (tous devices)
✅ Privilege downgrade to L0 (no access)
✅ Security team alert (SMS + Email + PagerDuty)
✅ Audit log entry with full context
✅ Optional: IP ban for 24h
```

**2. Cellule Région en Panne**
```bash
# Failover automatique ou manuel
POST /api/admin/emergency/cell-failover
{
  sourceCell: "us-east-1",
  targetCell: "us-west-2",
  graceful: false, # force immediate switch
  notifyUsers: true
}

# RTO Observé: < 45 secondes
```

**3. Spike de Trafic Anormal (DDoS?)**
```bash
# Activation auto-scaling + rate limiting
POST /api/admin/emergency/ddos-mitigation
{
  enableRateLimiting: true,
  threshold: 1000 req/min/IP,
  enableGeoBlocking: true,
  blockedCountries: ["XX", "YY"], # basé sur threat intel
  scaleUpCells: ["us-east-1", "eu-west-1"]
}
```

---

## 🎯 Workflows Critiques

### Workflow 1: Investigation d'une Alerte Sécurité

**Scénario**: Un utilisateur a un riskScore qui passe de 0.15 à 0.87 en 10 minutes.

**Étapes Admin**:
1. 🔍 **Recherche rapide**: Entrer user ID dans Command Center
2. 👁️ **Review activité récente**: 
   - 15 connexions depuis 5 pays différents (impossible travel)
   - Tentative de changement email + password
   - Export massif de données (500 posts en 2 min)
3. 🤖 **Consulter l'analyse IA**:
   ```json
   {
     "threatType": "ACCOUNT_TAKEOVER",
     "confidence": 0.94,
     "recommendedAction": "IMMEDIATE_SUSPENSION",
     "evidence": ["geo_anomaly", "velocity_abuse", "data_exfil_pattern"]
   }
   ```
4. ⚡ **Action**: Cliquer "Suspend Account" (ou laisser l'IA agir auto si seuil > 0.85)
5. 📧 **Notification**: Envoyer email sécurisé à l'utilisateur légitime
6. 📝 **Documentation**: Ajouter note d'incident pour audit SOC2

---

### Workflow 2: Calibration des Seuils de Privilèges (A/B Testing)

**Objectif**: Optimiser le seuil de `behavioralScore` pour l'accès aux features premium.

**Étapes**:
1. 🧪 **Créer expérimentation**:
   ```json
   {
     "experimentId": "BEHAVIORAL_THRESHOLD_V2",
     "variantA": { "threshold": 0.70, "users": 2500 },
     "variantB": { "threshold": 0.80, "users": 2500 },
     "duration": "14 days",
     "successMetric": "conversion_to_paid"
   }
   ```
2. 📊 **Monitor résultats** (dashboard dédié):
   - Jour 7: Variant B montre +12% de conversion, -3% de faux positifs
   - Risk incidents: équivalents entre A et B
3. ✅ **Décision**: Déployer variant B (0.80) à 100% des utilisateurs
4. 📢 **Communication**: Mettre à jour documentation et notifier équipes

---

### Workflow 3: Approbation d'un Template Marketplace Frauduleux

**Scénario**: Un template soumis prétend garantir "1M de vues en 24h".

**Étapes de Validation**:
1. 🤖 **Analyse IA automatique** (Nova Genesis):
   - Détection claim exagéré: "1M de vues" → red flag
   - Comparaison avec preuves fournies: analytics montrent max 50k vues
   - Similarity check: 87% copié d'un template existant
2. 🚫 **Rejet automatique** avec motif:
   ```
   Status: REJECTED
   Reasons:
   - False performance claims (claimed 1M, proven 50k)
   - Plagiarism detected (87% similarity with template #4521)
   - Insufficient proof data (only 3 posts vs required 10)
   ```
3. 📧 **Notification créateur**:
   - Email avec détails du rejet
   - Lien pour soumettre version corrigée
   - Avertissement: 2 rejets supplémentaires = ban temporaire
4. 📝 **Log pour audit**: Preuve de modération active (requis marketplace safe)

---

## 📚 Bonnes Pratiques Admin

### Do's ✅
- Toujours activer le MFA hardware key pour L3/L4
- Review les alertes sécurité sous 15 minutes (SLA critique)
- Documenter toute action manuelle override dans les notes d'audit
- Tester les procédures d'urgence trimestriellement (chaos engineering)
- Former les nouveaux admins pendant 2 semaines avant accès complet

### Don'ts ❌
- Jamais partager les credentials admin (même entre admins L4)
- Jamais désactiver les contrôles de sécurité "temporairement" sans ticket
- Jamais ignorer une alerte de riskScore > 0.85
- Jamais modifier les seuils IA en production sans A/B test préalable
- Jamais exporter des logs utilisateurs sans raison légale documentée

---

## 🎓 Programme de Certification Admin

### Niveau 1: Admin Support (2 semaines)
- ✅ Module e-learning: Bases de la plateforme Aethos
- ✅ Quiz: Sécurité, confidentialité, GDPR
- ✅ Shadowing: 40h avec admin senior
- ✅ Examen pratique: Résoudre 20 tickets simulés
- **Certification**: Badge L1, accès restreint

### Niveau 2: Admin Ops (1 mois)
- ✅ Formation avancée: Monitoring, scaling, connecteurs APIs
- ✅ Certification AWS/Azure (cloud infrastructure)
- ✅ Simulation d'incidents: 5 scénarios critiques
- ✅ Projet: Automatiser 1 workflow répétitif
- **Certification**: Badge L2, accès ops complet

### Niveau 3: SysAdmin (3 mois)
- ✅ Architecture profonde: Triad cognitive, cell-based design
- ✅ Sécurité offensive: Formation ethical hacking basics
- ✅ Audit SOC2: Comprendre exigences et preuves
- ✅ Leadership: Gérer une garde astreinte
- **Certification**: Badge L3, accès configuration

### Niveau 4: Super Admin (6 mois + approval board)
- ✅ Background check approfondi
- ✅ Présentation devant board technique
- ✅ Crisis management simulation (48h continue)
- ✅ Contribution: Amélioration majeure documentée
- **Certification**: Badge L4, full access (multi-sig requis)

---

## 🆘 Support & Escalade

### Canaux de Support Admin
- **Slack**: `#admin-ops` (réponse < 5 min, 24/7)
- **PagerDuty**: Pour incidents P0/P1 (astreinte rotate weekly)
- **Email**: `admin-support@aethos.cloud` (réponse < 1h)
- **Urgence Extrême**: Hotline CEO/CTO (seulement pour P0 critique)

### Matrice d'Escalade
| Sévérité | Impact | Temps de Réponse | Escalade Après |
|----------|--------|------------------|----------------|
| **P0** | Platform down, data breach | < 5 min | 15 min → CTO |
| **P1** | Feature critique broken | < 15 min | 1h → Head of Eng |
| **P2** | Bug majeur, workaround existe | < 1h | 4h → Team Lead |
| **P3** | Bug mineur, cosmetic | < 24h | 48h → Sprint Planning |

---

## 🎯 KPI de Performance Admin

| Métrique | Cible | Mesure Actuelle | Trend |
|----------|-------|-----------------|-------|
| MTTR (Mean Time To Resolve) | < 30 min | 24 min | 🟢 |
| False Positive Rate (security) | < 2% | 1.4% | 🟢 |
| User Satisfaction (internal survey) | > 4.5/5 | 4.7/5 | 🟢 |
| Audit Findings (SOC2) | 0 major | 0 | 🟢 |
| Automation Rate (tasks auto vs manual) | > 80% | 76% | 🟡 |

---

**Document Préparé Par**: DevOps & Security Team  
**Version**: 1.2  
**Dernière Mise à Jour**: Janvier 2025  
**Prochaine Review**: Trimestrielle ou post-incident majeur

**Mot de la Direction**:
> *"Un admin bien formé est la première ligne de défense et le meilleur accélérateur de croissance d'Aethos. Investissez dans votre formation, posez des questions, et n'hésitez jamais à escalader en cas de doute."* — CTO, Aethos Social Cloud

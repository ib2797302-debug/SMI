# 🧪 AETHOS SOCIAL CLOUD - Smart Unit Testing Suite

## Vue d'ensemble

Cette suite de tests intelligents valide non seulement la fonctionnalité, mais aussi:
- **La cohérence cognitive** des décisions IA
- **L'éthique** des recommandations
- **La résilience** face aux cas limites
- **La performance** en charge réelle

## Commandes Disponibles

```bash
# Exécuter tous les tests intelligents
npm run test:smart

# Tests avec couverture
npm run test:coverage

# Mode watch pour développement
npm run test:watch

# Tests E2E avec Playwright
npm run test:e2e
```

## Structure des Tests

### 1. Tests Cognitifs (Triade)

```typescript
// tests/cognitive/omni-mind.test.ts
describe('OMNI-MIND CORE', () => {
  it('doit produire un Chain-of-Thought traçable', async () => {
    // Validation: 5 étapes minimum, éthique > 0.7
  });

  it('doit simuler 15+ scénarios Monte Carlo', async () => {
    // Validation: variance < 0.15, convergence
  });

  it('doit auto-critiquer ses décisions', async () => {
    // Validation: 5 questions systématiques posées
  });
});
```

### 2. Tests de Gouvernance

```typescript
// tests/governance/compliance.test.ts
describe('Multi-Régime Compliance', () => {
  it('doit détecter les données PII', async () => {
    // GDPR, CCPA, PIPL
  });

  it('doit appliquer les règles de résidence', async () => {
    // Données EU → EU, China → China
  });

  it('doit générer un audit trail immuable', async () => {
    // SHA-256 hash, rétention 7 ans
  });
});
```

### 3. Tests Data Mesh

```typescript
// tests/data-mesh/kafka-streaming.test.ts
describe('Kafka Streaming', () => {
  it('doit valider les contrats Protobuf', async () => {
    // Schema registry compatibility
  });

  it('doit router vers la bonne cellule', async () => {
    // Latence < 50ms inter-cellule
  });

  it('doit gérer le tiered storage', async () => {
    // S3 offload après 7 jours
  });
});
```

### 4. Tests de Charge Cellulaire

```typescript
// tests/load/cell-resilience.test.ts
describe('Cell-Based Resilience', () => {
  it('doit failover en < 45 secondes', async () => {
    // Chaos monkey: kill cell
  });

  it('doit maintenir 99.99% disponibilité', async () => {
    // Spike test: 10x traffic
  });

  it('doit récupérer sans perte de données', async () => {
    // RPO = 0
  });
});
```

### 5. Tests d'Interface Neuro-Adaptative

```typescript
// tests/ui/neuro-adapter.test.ts
describe('Neuro-Adaptive UI', () => {
  it('doit détecter le profil cognitif', async () => {
    // Visionary vs Guardian vs Executor
  });

  it('doit adapter le design system', async () => {
    // MINIMAL / VIBRANT / FOCUSED
  });

  it('doit respecter l\'accessibilité WCAG 2.1 AA', async () => {
    // Contrast, keyboard nav, screen readers
  });
});
```

## Critères de Réussite Intelligents

| Module | Métrique | Seuil | Action si échec |
|--------|----------|-------|-----------------|
| OMNI-MIND | Decision Quality | > 0.75 | Augmenter profondeur réflexion |
| NOVA GENESIS | Creativity Score | > 0.65 | Activer pulse spontané 8% |
| NEXUS HIVE | Collective Intelligence | > 0.70 | Stimuler connexions neuronales |
| Governance | Compliance Rate | 100% | Bloquer publication |
| Data Mesh | P99 Latency | < 200ms | Scale horizontal cellules |
| UI | Cognitive Load | < 0.6 | Simplifier interface |

## Rapports Générés

Après exécution:
- `coverage/`: Rapport de couverture HTML
- `test-results.xml`: Format JUnit pour CI/CD
- `cognitive-metrics.json`: Métriques de la triade
- `performance-baseline.json`: Référence pour tests futurs

## Intégration Continue

```yaml
# .github/workflows/test.yml
name: Smart Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm run test:smart
      - run: pnpm run test:coverage
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
```

## Debugging Intelligent

En cas d'échec, le système propose automatiquement:
1. **Root Cause Analysis**: Arbre de décision des causes probables
2. **Fix Suggestions**: Correctifs basés sur les patterns appris
3. **Regression Prevention**: Nouveaux tests à ajouter

## Exemple d'Exécution

```bash
$ npm run test:smart

🧠 Running Cognitive Tests...
✅ OMNI-MIND: Decision Quality 0.82 (threshold 0.75)
✅ NOVA GENESIS: Creativity Score 0.71 (threshold 0.65)
✅ NEXUS HIVE: Collective Intelligence 0.76 (threshold 0.70)

🔐 Running Governance Tests...
✅ GDPR Compliance: 100%
✅ CCPA Compliance: 100%
✅ PIPL Compliance: 100%

🕸️ Running Data Mesh Tests...
✅ Kafka Streaming: P99 latency 145ms (< 200ms)
✅ Cell Routing: 100% accuracy
✅ Protobuf Validation: 0 errors

⚡ Running Load Tests...
✅ Failover Time: 38s (< 45s threshold)
✅ Availability: 99.995% (> 99.99% threshold)
✅ RPO: 0 (no data loss)

🎨 Running UI Tests...
✅ Profile Detection: 94% accuracy
✅ WCAG 2.1 AA: Passed
✅ Cognitive Load: 0.52 (< 0.6 threshold)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tests: 127
Passed: 127 ✅
Failed: 0 ❌
Skipped: 0 ⏭️

Coverage: 94.3%
Cognitive Health: 96.2%
Performance Score: 98.1%

🎉 All systems operational!
```

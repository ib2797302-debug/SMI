# AETHOS SOCIAL CLOUD - KAFKA PRODUCTION CLUSTER CONFIGURATION
# Configuration complète avec Tiered Storage pour Data Mesh

## Architecture du Cluster Kafka

### Topologie Multi-Région (Cell-Based)

```
┌─────────────────────────────────────────────────────────────────┐
│                    GLOBAL LOAD BALANCER                         │
│                  (Cloudflare / AWS Global Accelerator)          │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  CELL US-EAST │   │ CELL EU-WEST  │   │CELL AP-NORTHEAST│
│   (Primary)   │   │  (Secondary)  │   │  (Secondary)    │
├───────────────┤   ├───────────────┤   ├───────────────┤
│ Kafka Brokers │   │ Kafka Brokers │   │ Kafka Brokers │
│     x6        │   │     x4        │   │     x4        │
│ Tiered Store  │   │ Tiered Store  │   │ Tiered Store  │
│ S3 us-east-1  │   │ S3 eu-west-1  │   │ S3 ap-northeast│
└───────────────┘   └───────────────┘   └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌──────────────────┐
                    │  CELL CHINA      │
                    │  (cn-north-1)    │
                    │  Isolated        │
                    │  PIPL Compliant  │
                    └──────────────────┘
```

## Configuration des Brokers Kafka

### Broker Configuration (broker-config.yaml)

```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: aethos-kafka-cluster
  namespace: aethos-data-mesh
spec:
  kafka:
    version: 3.7.0
    replicas: 6
    listeners:
      - name: plain
        port: 9092
        type: internal
        tls: false
      - name: tls
        port: 9093
        type: internal
        tls: true
        authentication:
          type: oauth
          validIssuerUri: https://auth.aethos.cloud/realms/aethos
          jwksEndpointUri: https://auth.aethos.cloud/realms/aethos/protocol/openid-connect/certs
          usernameClaim: preferred_username
      - name: external
        port: 9094
        type: route
        tls: true
        authentication:
          type: oauth
          validIssuerUri: https://auth.aethos.cloud/realms/aethos
          jwksEndpointUri: https://auth.aethos.cloud/realms/aethos/protocol/openid-connect/certs
          usernameClaim: preferred_username
    
    config:
      # Optimisations pour le streaming temps réel
      offsets.topic.replication.factor: 3
      transaction.state.log.replication.factor: 3
      transaction.state.log.min.isr: 2
      default.replication.factor: 3
      min.insync.replicas: 2
      
      # Tiered Storage Configuration
      remote.log.storage.system.enable: true
      remote.log.storage.manager.class.name: org.apache.kafka.server.log.remote.storage.s3.S3RemoteStorageManager
      remote.log.storage.manager.class.path: /opt/kafka/plugins/s3-storage/*
      
      # S3 Configuration (par cellule)
      remote.log.storage.s3.bucket.name: aethos-kafka-tiered-storage-${REGION}
      remote.log.storage.s3.region: ${AWS_REGION}
      remote.log.storage.s3.endpoint.override: ${S3_ENDPOINT_OVERRIDE:}
      
      # Rétention et segmentation
      log.retention.hours: 168  # 7 jours sur disque local
      log.segment.bytes: 1073741824  # 1GB
      log.roll.hours: 24
      
      # Remote Log Manager
      remote.log.index.cache.size.bytes: 1073741824  # 1GB cache
      remote.log.manager.task.interval.ms: 1000
      remote.log.manager.thread.pool.size: 10
      
      # Compression optimisée pour le social data
      compression.type: zstd
      message.max.bytes: 10485760  # 10MB max par message
      
      # Performance tuning
      num.network.threads: 8
      num.io.threads: 16
      socket.send.buffer.bytes: 102400
      socket.receive.buffer.bytes: 102400
      socket.request.max.bytes: 104857600
      
      # Security
      authorizer.class.name: kafka.security.authorizer.AclAuthorizer
      super.users: User:admin;User:aethos-system
      allow.everyone.if.no.acl.found: false
      
    storage:
      type: jbod
      volumes:
        - id: 0
          type: persistent-claim
          size: 500Gi
          deleteClaim: false
          class: gp3
        - id: 1
          type: persistent-claim
          size: 500Gi
          deleteClaim: false
          class: gp3
    
    resources:
      requests:
        memory: 16Gi
        cpu: 4
      limits:
        memory: 32Gi
        cpu: 8
    
    jvmOptions:
      -Xms: 8G
      -Xmx: 8G
      gcLoggingEnabled: false
      javaSystemProperties:
        - name: com.sun.management.jmxremote
          value: "true"
        - name: com.sun.management.jmxremote.authenticate
          value: "false"
        - name: com.sun.management.jmxremote.ssl
          value: "false"
        - name: com.sun.management.jmxremote.port
          value: "9999"
    
    metricsConfig:
      type: jmxPrometheusExporter
      valueFrom:
        configMapKeyRef:
          name: aethos-kafka-metrics
          key: kafka-metrics-config.yml
    
    logging:
      type: external
      name: aethos-kafka-log-config
  
  zookeeper:
    replicas: 3
    storage:
      type: persistent-claim
      size: 100Gi
      deleteClaim: false
      class: gp3
    resources:
      requests:
        memory: 4Gi
        cpu: 1
      limits:
        memory: 8Gi
        cpu: 2
  
  entityOperator:
    topicOperator:
      reconciliationIntervalSeconds: 60
    userOperator:
      reconciliationIntervalSeconds: 60
```

## Topics pour Social Data Mesh

### Topics Configuration (topics.yaml)

```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: social-posts-ingest
  namespace: aethos-data-mesh
  labels:
    strimzi.io/cluster: aethos-kafka-cluster
spec:
  partitions: 48
  replicas: 3
  config:
    retention.ms: 604800000  # 7 jours
    segment.bytes: 1073741824
    cleanup.policy: delete
    compression.type: zstd
    min.insync.replicas: 2
    remote.storage.enable: true
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: social-engagement-events
  namespace: aethos-data-mesh
  labels:
    strimzi.io/cluster: aethos-kafka-cluster
spec:
  partitions: 36
  replicas: 3
  config:
    retention.ms: 2592000000  # 30 jours
    segment.bytes: 536870912
    cleanup.policy: delete
    compression.type: zstd
    min.insync.replicas: 2
    remote.storage.enable: true
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: creator-analytics-stream
  namespace: aethos-data-mesh
  labels:
    strimzi.io/cluster: aethos-kafka-cluster
spec:
  partitions: 24
  replicas: 3
  config:
    retention.ms: 7776000000  # 90 jours
    segment.bytes: 536870912
    cleanup.policy: delete
    compression.type: zstd
    min.insync.replicas: 2
    remote.storage.enable: true
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: compliance-audit-logs
  namespace: aethos-data-mesh
  labels:
    strimzi.io/cluster: aethos-kafka-cluster
spec:
  partitions: 12
  replicas: 3
  config:
    retention.ms: 220752000000  # 7 ans (SOC2/GDPR)
    segment.bytes: 268435456
    cleanup.policy: delete
    compression.type: lz4
    min.insync.replicas: 2
    remote.storage.enable: true
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: agent-coordination
  namespace: aethos-data-mesh
  labels:
    strimzi.io/cluster: aethos-kafka-cluster
spec:
  partitions: 16
  replicas: 3
  config:
    retention.ms: 86400000  # 1 jour
    segment.bytes: 134217728
    cleanup.policy: compact,delete
    compression.type: snappy
    min.insync.replicas: 2
    remote.storage.enable: false
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: governance-policy-updates
  namespace: aethos-data-mesh
  labels:
    strimzi.io/cluster: aethos-kafka-cluster
spec:
  partitions: 8
  replicas: 3
  config:
    retention.ms: 7776000000  # 90 jours
    segment.bytes: 134217728
    cleanup.policy: compact
    compression.type: snappy
    min.insync.replicas: 2
    remote.storage.enable: false
```

## Schema Registry Configuration

```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: aethos-schema-registry
  namespace: aethos-data-mesh
spec:
  kafka:
    # ... configuration broker ci-dessus
  schemaRegistry:
    replicas: 3
    authentication:
      type: oauth
      validIssuerUri: https://auth.aethos.cloud/realms/aethos
      jwksEndpointUri: https://auth.aethos.cloud/realms/aethos/protocol/openid-connect/certs
    config:
      kafkastore.bootstrap.servers: PLAINTEXT://aethos-kafka-cluster-kafka-bootstrap:9092
      schema.compatibility.level: BACKWARD
      schema.registry.host.name: 0.0.0.0
      logger.level: INFO
    resources:
      requests:
        memory: 2Gi
        cpu: 1
      limits:
        memory: 4Gi
        cpu: 2
```

## Connecteurs pour Data Integration

### Twitter/X Connector
```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaConnector
metadata:
  name: twitter-x-ingest-connector
  namespace: aethos-data-mesh
  labels:
    strimzi.io/cluster: aethos-kafka-connect
spec:
  class: com.github.jcustenborder.kafka.connect.twitter.TwitterSourceConnector
  tasksMax: 6
  config:
    topic: social-posts-ingest
    twitter.oauth.consumer.key: ${TWITTER_CONSUMER_KEY}
    twitter.oauth.consumer.secret: ${TWITTER_CONSUMER_SECRET}
    twitter.oauth.access.token: ${TWITTER_ACCESS_TOKEN}
    twitter.oauth.access.token.secret: ${TWITTER_ACCESS_TOKEN_SECRET}
    filter.keywords: "brand monitoring,social intelligence,competitor analysis"
    language.code: en,fr,es,de,zh,ja
    tweet.mode: extended
```

### LinkedIn Connector
```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaConnector
metadata:
  name: linkedin-company-ingest
  namespace: aethos-data-mesh
  labels:
    strimzi.io/cluster: aethos-kafka-connect
spec:
  class: io.aiven.kafka.connect.http.HttpSourceConnector
  tasksMax: 4
  config:
    topic: social-posts-ingest
    http.url: https://api.linkedin.com/v2/ugcPosts
    http.headers.Authorization: Bearer ${LINKEDIN_ACCESS_TOKEN}
    poll.interval.ms: 30000
    response.format: JSON
```

### WeChat/Weibo Connector (China Cell)
```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaConnector
metadata:
  name: wechat-weibo-ingest-cn
  namespace: aethos-data-mesh-cn
  labels:
    strimzi.io/cluster: aethos-kafka-cluster-cn
spec:
  class: io.aiven.kafka.connect.http.HttpSourceConnector
  tasksMax: 8
  config:
    topic: social-posts-ingest-cn
    http.url: https://api.weibo.com/2/statuses/home_timeline
    http.headers.Authorization: OAuth2 ${WEIBO_ACCESS_TOKEN}
    poll.interval.ms: 15000
    response.format: JSON
    # PIPL Compliance: données anonymisées avant sortie Chine
    transforms: AnonymizePII
    transforms.AnonymizePII.type: com.aethos.kafka.connect.transforms.PIILegalRedaction
```

## Monitoring & Alerting

### Prometheus Rules
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: aethos-kafka-alerts
  namespace: aethos-data-mesh
spec:
  groups:
    - name: kafka.rules
      rules:
        - alert: KafkaBrokerDown
          expr: kafka_brokers < 3
          for: 5m
          labels:
            severity: critical
          annotations:
            summary: "Kafka broker down"
            description: "Kafka cluster {{ $labels.cluster }} has only {{ $value }} brokers remaining"
        
        - alert: KafkaUnderReplicatedPartitions
          expr: kafka_topic_partition_under_replicated_partitions > 0
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "Kafka under-replicated partitions"
            description: "Topic {{ $labels.topic }} has {{ $value }} under-replicated partitions"
        
        - alert: KafkaConsumerLagHigh
          expr: kafka_consumer_group_lag > 10000
          for: 10m
          labels:
            severity: warning
          annotations:
            summary: "High Kafka consumer lag"
            description: "Consumer group {{ $labels.group_id }} has lag of {{ $value }}"
        
        - alert: KafkaTieredStorageSyncFailed
          expr: rate(kafka_log_remote_storage_sync_failed_total[5m]) > 0
          for: 5m
          labels:
            severity: critical
          annotations:
            summary: "Kafka tiered storage sync failed"
            description: "Tiered storage synchronization failing on broker {{ $labels.broker }}"
```

## Backup & Disaster Recovery

### Backup Strategy
```yaml
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: kafka-topic-backup-daily
  namespace: aethos-data-mesh
spec:
  schedule: "0 2 * * *"
  template:
    includedNamespaces:
      - aethos-data-mesh
    selector:
      matchLabels:
        app: kafka
    ttl: "720h"  # 30 jours
    storageLocation: aethos-s3-backup
    volumeSnapshotLocations:
      - aethos-snapshot
---
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: kafka-topic-backup-hourly
  namespace: aethos-data-mesh
spec:
  schedule: "0 * * * *"
  template:
    includedNamespaces:
      - aethos-data-mesh
    selector:
      matchLabels:
        app: kafka-topics-critical
    ttl: "168h"  # 7 jours
    storageLocation: aethos-s3-backup
```

## Coût Estimé (Pay-per-use Transparency)

| Composant | Spécification | Coût Mensuel | Coût par Post ($0.0015/post) |
|-----------|--------------|--------------|------------------------------|
| Kafka Brokers | 6x m5.2xlarge | $1,752 | $0.000058 |
| Tiered Storage S3 | 5TB + transfert | $150 | $0.000005 |
| Schema Registry | 3x t3.medium | $90 | $0.000003 |
| Kafka Connect | 4x m5.xlarge | $584 | $0.000019 |
| Monitoring | Managed Prometheus | $100 | $0.000003 |
| **TOTAL** | | **$2,676/mois** | **$0.000088/post** |

*À 30M posts/mois = coût infrastructure 2.9% du revenue*

## Déploiement Multi-Cellule

```bash
#!/bin/bash
# deploy-kafka-cell.sh

CELL_NAME=$1
REGION=$2
NAMESPACE="aethos-data-mesh-${CELL_NAME}"

echo "🚀 Déploiement cellule Kafka: ${CELL_NAME} dans ${REGION}"

# Création namespace
kubectl create namespace ${NAMESPACE} || true

# Application configuration spécifique région
envsubst < infra/kafka/broker-config.yaml | \
  sed "s/\${REGION}/${REGION}/g" | \
  kubectl apply -n ${NAMESPACE} -f -

# Déploiement topics
kubectl apply -n ${NAMESPACE} -f infra/kafka/topics.yaml

# Configuration connecteurs régionaux
if [ "$CELL_NAME" = "cn" ]; then
  kubectl apply -n ${NAMESPACE} -f infra/kafka/connectors-china.yaml
else
  kubectl apply -n ${NAMESPACE} -f infra/kafka/connectors-global.yaml
fi

echo "✅ Cellule ${CELL_NAME} déployée avec succès"
```

## Sécurité & Conformité

### RBAC Kafka
```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaUser
metadata:
  name: aethos-agentic-engine
  namespace: aethos-data-mesh
  labels:
    strimzi.io/cluster: aethos-kafka-cluster
spec:
  authentication:
    type: oauth
  authorization:
    type: simple
    acls:
      - resource:
          type: topic
          name: "social-posts-ingest"
          patternType: literal
        operation: Write
        host: "*"
      - resource:
          type: topic
          name: "agent-coordination"
          patternType: literal
        operation: Read
        host: "*"
      - resource:
          type: group
          name: "aethos-agents"
          patternType: prefix
        operation: Read
        host: "*"
```

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: kafka-isolation
  namespace: aethos-data-mesh
spec:
  podSelector:
    matchLabels:
      strimzi.io/name: aethos-kafka-cluster-kafka
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: aethos-data-mesh
        - podSelector:
            matchLabels:
              app: kafka-connect
      ports:
        - protocol: TCP
          port: 9092
        - protocol: TCP
          port: 9093
  egress:
    - to:
        - namespaceSelector: {}
      ports:
        - protocol: TCP
          port: 443  # S3, Schema Registry
```

---

**Prochaines étapes:**
1. Déployer la cellule primaire us-east-1
2. Configurer le tiered storage S3
3. Tester le failover inter-cellules
4. Valider la conformité PIPL pour la cellule Chine
5. Mettre en place le monitoring temps réel

# Monitoring and Logging Guidelines

## Overview
This document outlines the monitoring and logging strategy for the DataScope system, ensuring comprehensive observability and troubleshooting capabilities.

## Monitoring

### Application Metrics

#### Core Metrics
1. Request Metrics
   - Request count
   - Response times
   - Error rates
   - Status codes

2. Performance Metrics
   - JVM metrics
   - Thread pool stats
   - Memory usage
   - GC metrics

3. Business Metrics
   - Query execution times
   - Data source health
   - Cache hit rates
   - User activity

### Prometheus Configuration
```yaml
management:
  endpoints:
    web:
      exposure:
        include: prometheus,health,info,metrics
  metrics:
    tags:
      application: data-scope
    export:
      prometheus:
        enabled: true
```

### Grafana Dashboards

#### System Dashboard
```json
{
  "dashboard": {
    "panels": [
      {
        "title": "CPU Usage",
        "type": "graph",
        "metrics": ["system_cpu_usage", "process_cpu_usage"]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "metrics": ["jvm_memory_used", "jvm_memory_max"]
      },
      {
        "title": "GC Statistics",
        "type": "graph",
        "metrics": ["jvm_gc_pause_seconds", "jvm_gc_collection_seconds"]
      }
    ]
  }
}
```

#### Application Dashboard
```json
{
  "dashboard": {
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "metrics": ["http_server_requests_seconds_count"]
      },
      {
        "title": "Response Time",
        "type": "heatmap",
        "metrics": ["http_server_requests_seconds_bucket"]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "metrics": ["http_server_requests_seconds_count{status>=500}"]
      }
    ]
  }
}
```

### Alerting Rules

#### System Alerts
```yaml
groups:
  - name: system_alerts
    rules:
      - alert: HighCPUUsage
        expr: system_cpu_usage > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High CPU usage detected

      - alert: HighMemoryUsage
        expr: jvm_memory_used_bytes / jvm_memory_max_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High memory usage detected
```

#### Application Alerts
```yaml
groups:
  - name: application_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_server_requests_seconds_count{status>=500}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected

      - alert: SlowResponses
        expr: http_server_requests_seconds_max > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: Slow response times detected
```

## Logging

### Log Levels

#### Level Usage Guidelines
- ERROR: System errors requiring immediate attention
- WARN: Potential issues or unexpected states
- INFO: Important business events and state changes
- DEBUG: Detailed information for troubleshooting
- TRACE: Very detailed debugging information

### Log Format
```java
@Slf4j
public class LoggingConfig {
    @Bean
    public LoggingEventCompositeJsonEncoder encoder() {
        return new LoggingEventCompositeJsonEncoder(
            timestamp,
            level,
            logger,
            thread,
            message,
            stacktrace,
            mdc: {
                traceId,
                userId,
                requestId
            }
        );
    }
}
```

### Logging Examples

#### Request Logging
```java
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain chain) {
        MDC.put("requestId", UUID.randomUUID().toString());
        log.info("Request received: {} {}", request.getMethod(), request.getRequestURI());
        
        try {
            chain.doFilter(request, response);
        } finally {
            log.info("Response sent: {}", response.getStatus());
            MDC.clear();
        }
    }
}
```

#### Business Logic Logging
```java
@Slf4j
public class QueryService {
    public QueryResult executeQuery(Query query) {
        log.info("Executing query: {}", query.getId());
        
        try {
            QueryResult result = queryExecutor.execute(query);
            log.info("Query completed: {}, rows: {}", 
                query.getId(), result.getRowCount());
            return result;
        } catch (Exception e) {
            log.error("Query failed: {}", query.getId(), e);
            throw e;
        }
    }
}
```

### Log Aggregation

#### ELK Stack Configuration
```yaml
logstash:
  input:
    beats:
      port: 5044
  
  filter:
    json:
      source: "message"
    
    grok:
      match:
        message: "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}"
    
    date:
      match: ["timestamp", "ISO8601"]
    
  output:
    elasticsearch:
      hosts: ["elasticsearch:9200"]
      index: "data-scope-%{+YYYY.MM.dd}"
```

#### Kibana Dashboards
1. Error Analysis Dashboard
   - Error distribution
   - Error trends
   - Stack trace analysis
   - Error correlation

2. Performance Dashboard
   - Response time distribution
   - Slow query analysis
   - Resource usage correlation
   - Request patterns

### Log Retention

#### Retention Policy
```yaml
elasticsearch:
  ilm:
    policies:
      logs:
        hot:
          max_size: "50GB"
          max_age: "30d"
        warm:
          min_age: "2d"
          actions:
            rollover:
              max_size: "100GB"
              max_age: "7d"
        delete:
          min_age: "90d"
```

## Health Checks

### Endpoint Configuration
```yaml
management:
  endpoint:
    health:
      show-details: always
      group:
        datasource:
          include: db,diskSpace
        cache:
          include: redis
```

### Custom Health Indicators
```java
@Component
public class DataSourceHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        try {
            // Check data source connectivity
            return Health.up()
                .withDetail("connections", getActiveConnections())
                .withDetail("latency", getConnectionLatency())
                .build();
        } catch (Exception e) {
            return Health.down()
                .withException(e)
                .build();
        }
    }
}
```

## Tracing

### Spring Cloud Sleuth Configuration
```yaml
spring:
  sleuth:
    sampler:
      probability: 1.0
    baggage:
      correlation-fields: user-id,request-id
```

### Trace Context
```java
@Slf4j
public class TraceInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) {
        String traceId = Span.current().context().traceId();
        MDC.put("traceId", traceId);
        log.info("Processing request with trace: {}", traceId);
        return true;
    }
}
```

## Metrics Collection

### Custom Metrics
```java
@Component
public class QueryMetrics {
    private final Counter queryCounter;
    private final Timer queryTimer;
    private final Gauge activeQueries;
    
    public QueryMetrics(MeterRegistry registry) {
        this.queryCounter = Counter.builder("query.executions")
            .description("Number of query executions")
            .register(registry);
            
        this.queryTimer = Timer.builder("query.duration")
            .description("Query execution duration")
            .register(registry);
            
        this.activeQueries = Gauge.builder("query.active", 
            queryExecutor, QueryExecutor::getActiveQueries)
            .description("Number of active queries")
            .register(registry);
    }
}
```

## Performance Monitoring

### Response Time Monitoring
```java
@Aspect
@Component
public class PerformanceMonitor {
    private final Timer.Builder timerBuilder;
    
    @Around("@annotation(Monitored)")
    public Object monitor(ProceedingJoinPoint joinPoint) {
        Timer.Sample sample = Timer.start();
        try {
            return joinPoint.proceed();
        } finally {
            sample.stop(timerBuilder
                .tag("method", joinPoint.getSignature().getName())
                .register(meterRegistry));
        }
    }
}
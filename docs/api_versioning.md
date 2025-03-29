# API Versioning Guidelines

## Overview
This document outlines the API versioning strategy for the DataScope system, ensuring backward compatibility and smooth evolution of APIs.

## Versioning Strategy

### Version Format
- API versions follow semantic versioning (MAJOR.MINOR.PATCH)
- URI path versioning: /api/v{MAJOR}/...
- Header versioning for fine-grained control
- Version metadata in responses

### Version Components
```json
{
    "api": {
        "version": "1.0.0",
        "deprecated": false,
        "sunset": "2026-12-31",
        "documentation": "https://api.datascope.com/docs/v1"
    }
}
```

## API Lifecycle

### Stages
1. Active
   - Current stable version
   - Fully supported
   - Regular updates

2. Deprecated
   - Still functional
   - No new features
   - Bug fixes only
   - Sunset date announced

3. Sunset
   - End of life
   - Read-only mode
   - Redirects to new version
   - Eventually removed

### Version Support
- Major versions supported for 24 months
- Minor versions supported for 12 months
- At least 6 months notice before sunsetting
- Maximum of 2 major versions supported simultaneously

## Implementation

### URI Versioning
```java
@RestController
@RequestMapping("/api/v1")
public class QueryControllerV1 {
    @PostMapping("/queries")
    public ResponseEntity<QueryResult> executeQuery(
            @RequestBody QueryRequest request) {
        // V1 implementation
    }
}

@RestController
@RequestMapping("/api/v2")
public class QueryControllerV2 {
    @PostMapping("/queries")
    public ResponseEntity<QueryResultV2> executeQuery(
            @RequestBody QueryRequestV2 request) {
        // V2 implementation
    }
}
```

### Header Versioning
```java
@RestController
@RequestMapping("/api/queries")
public class QueryController {
    @PostMapping(headers = "API-Version=1")
    public ResponseEntity<QueryResult> executeQueryV1(
            @RequestBody QueryRequest request) {
        // V1 implementation
    }

    @PostMapping(headers = "API-Version=2")
    public ResponseEntity<QueryResultV2> executeQueryV2(
            @RequestBody QueryRequestV2 request) {
        // V2 implementation
    }
}
```

### Version Negotiation
```java
@Component
public class ApiVersionInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) {
        String version = request.getHeader("API-Version");
        if (version == null) {
            version = "1"; // Default version
        }
        request.setAttribute("apiVersion", version);
        return true;
    }
}
```

## Breaking Changes

### What Constitutes a Breaking Change
1. Request Changes
   - New required fields
   - Removed fields
   - Changed field types
   - Changed validation rules

2. Response Changes
   - Removed fields
   - Changed field types
   - Changed response structure
   - Changed error formats

3. Behavior Changes
   - Changed business logic
   - Changed validation rules
   - Changed error conditions
   - Changed security requirements

### Handling Breaking Changes
1. Create New Version
```java
public class QueryRequestV2 extends QueryRequest {
    private List<String> newField; // Breaking change
}

public class QueryResultV2 extends QueryResult {
    private Map<String, Object> additionalData; // Breaking change
}
```

2. Maintain Compatibility
```java
@Component
public class QueryRequestConverter {
    public QueryRequestV2 convertToV2(QueryRequest v1Request) {
        QueryRequestV2 v2Request = new QueryRequestV2();
        BeanUtils.copyProperties(v1Request, v2Request);
        // Add default values for new fields
        return v2Request;
    }
}
```

## Documentation

### Version Documentation
```yaml
openapi: 3.0.0
info:
  title: DataScope API
  version: 2.0.0
  description: |
    API Version: 2.0.0
    Status: Active
    Supported Until: 2026-12-31
    Breaking Changes:
    - Added required field 'newField'
    - Changed response format for errors
```

### Deprecation Notices
```java
@Deprecated
@ApiOperation(
    value = "Execute Query",
    notes = "Deprecated: Use /api/v2/queries instead. Will be removed on 2026-12-31"
)
@PostMapping("/api/v1/queries")
public ResponseEntity<QueryResult> executeQueryV1(
        @RequestBody QueryRequest request) {
    // V1 implementation
}
```

## Migration Support

### Migration Tools
```java
@Component
public class QueryMigrationService {
    public QueryRequestV2 migrateRequest(QueryRequest oldRequest) {
        // Convert old request to new format
    }

    public QueryResult migrateResponse(QueryResultV2 newResponse) {
        // Convert new response to old format
    }
}
```

### Migration Documentation
```markdown
## Migration Guide: V1 to V2

### Changes
1. Request Format
   - Added required field 'newField'
   - Changed validation rules

2. Response Format
   - Added 'additionalData' section
   - Changed error structure

### Migration Steps
1. Update client code
2. Test with new endpoints
3. Update error handling
4. Verify results
```

## Version Management

### Version Registry
```java
@Component
public class ApiVersionRegistry {
    private final Map<String, ApiVersion> versions = new HashMap<>();

    @PostConstruct
    public void init() {
        versions.put("1.0.0", new ApiVersion(
            "1.0.0",
            true,
            LocalDate.of(2026, 12, 31)
        ));
        versions.put("2.0.0", new ApiVersion(
            "2.0.0",
            false,
            null
        ));
    }

    public ApiVersion getVersion(String version) {
        return versions.get(version);
    }
}
```

### Version Monitoring
```java
@Component
public class ApiVersionMetrics {
    private final Counter versionUsage;

    public ApiVersionMetrics(MeterRegistry registry) {
        this.versionUsage = Counter.builder("api.version.usage")
            .description("API version usage count")
            .tag("version", "")
            .register(registry);
    }

    public void recordVersionUsage(String version) {
        versionUsage.tag("version", version).increment();
    }
}
```

## Testing Strategy

### Version Tests
```java
@SpringBootTest
public class ApiVersionTests {
    @Test
    public void whenUsingV1_thenGetV1Response() {
        // Test V1 API
    }

    @Test
    public void whenUsingV2_thenGetV2Response() {
        // Test V2 API
    }

    @Test
    public void whenMigrating_thenDataPreserved() {
        // Test migration
    }
}
```

### Compatibility Tests
```java
@SpringBootTest
public class ApiCompatibilityTests {
    @Test
    public void whenV1Client_thenWorksWithV2() {
        // Test backward compatibility
    }

    @Test
    public void whenDeprecated_thenWarningReturned() {
        // Test deprecation notices
    }
}
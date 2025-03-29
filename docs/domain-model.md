# DataScope Domain Model Design

## Core Domain Models

### DataSource
Represents a database data source
```java
public class DataSource {
    private DataSourceId id;
    private String name;
    private DataSourceType type;
    private String host;
    private int port;
    private String databaseName;
    private String username;
    private EncryptedPassword password;
    private DataSourceStatus status;
    private String description;
    private Version version;
    private AuditInfo auditInfo;
    
    // Business methods
    public void activate();
    public void deactivate();
    public boolean testConnection();
    public void updateCredentials(String username, String password);
}
```

### Schema
Represents a database schema
```java
public class Schema {
    private SchemaId id;
    private DataSourceId dataSourceId;
    private String name;
    private String description;
    private Version version;
    private AuditInfo auditInfo;
    
    // Business methods
    public List<Table> getTables();
    public void updateDescription(String description);
}
```

### Table
Represents a database table
```java
public class Table {
    private TableId id;
    private SchemaId schemaId;
    private String name;
    private String description;
    private List<Column> columns;
    private Version version;
    private AuditInfo auditInfo;
    
    // Business methods
    public void addColumn(Column column);
    public void removeColumn(ColumnId columnId);
    public boolean hasColumn(String columnName);
}
```

### Column
Represents a table column
```java
public class Column {
    private ColumnId id;
    private TableId tableId;
    private String name;
    private DataType dataType;
    private Integer length;
    private Integer precision;
    private Integer scale;
    private boolean nullable;
    private boolean isPrimaryKey;
    private String description;
    private Version version;
    private AuditInfo auditInfo;
    
    // Business methods
    public void updateMetadata(ColumnMetadata metadata);
    public boolean isNumeric();
    public boolean isDateTime();
}
```

### Query
Represents a saved query
```java
public class Query {
    private QueryId id;
    private String name;
    private String description;
    private DataSourceId dataSourceId;
    private String sqlContent;
    private int version;
    private QueryStatus status;
    private Version version;
    private AuditInfo auditInfo;
    
    // Business methods
    public void publish();
    public Query createNewVersion();
    public boolean isExecutable();
}
```

### TableRelationship
Represents relationship between tables
```java
public class TableRelationship {
    private RelationshipId id;
    private TableId sourceTableId;
    private TableId targetTableId;
    private ColumnId sourceColumnId;
    private ColumnId targetColumnId;
    private RelationshipType type;
    private Double confidence;
    private Version version;
    private AuditInfo auditInfo;
    
    // Business methods
    public boolean isAutoDetected();
    public void updateConfidence(double confidence);
}
```

### DisplayConfig
Represents display configuration for queries
```java
public class DisplayConfig {
    private ConfigId id;
    private QueryId queryId;
    private DisplayType displayType;
    private ConfigContent content;
    private boolean isDefault;
    private Version version;
    private AuditInfo auditInfo;
    
    // Business methods
    public void setAsDefault();
    public void updateContent(ConfigContent content);
}
```

## Value Objects

### EncryptedPassword
```java
public class EncryptedPassword {
    private String encryptedValue;
    private String salt;
    
    public static EncryptedPassword encrypt(String plaintext);
    public boolean matches(String plaintext);
}
```

### DataType
```java
public class DataType {
    private String name;
    private TypeCategory category;
    
    public boolean isNumeric();
    public boolean isDateTime();
    public boolean isText();
}
```

### ConfigContent
```java
public class ConfigContent {
    private List<ConditionConfig> conditions;
    private List<ColumnConfig> columns;
    private List<OperationConfig> operations;
    
    public boolean validate();
    public String toJson();
}
```

### Version
```java
public class Version {
    private int value;
    
    public Version increment();
    public boolean isNewer(Version other);
}
```

### AuditInfo
```java
public class AuditInfo {
    private String createdBy;
    private LocalDateTime createdAt;
    private String modifiedBy;
    private LocalDateTime modifiedAt;
}
```

## Enums

### DataSourceType
```java
public enum DataSourceType {
    MYSQL,
    DB2
}
```

### DataSourceStatus
```java
public enum DataSourceStatus {
    ACTIVE,
    INACTIVE
}
```

### QueryStatus
```java
public enum QueryStatus {
    DRAFT,
    PUBLISHED
}
```

### RelationshipType
```java
public enum RelationshipType {
    MANUAL,
    AUTO_DETECTED
}
```

### DisplayType
```java
public enum DisplayType {
    FORM,
    TABLE,
    CHART
}
```

### TypeCategory
```java
public enum TypeCategory {
    NUMERIC,
    TEXT,
    DATE_TIME,
    BOOLEAN,
    BINARY
}
```

## Domain Services

### DataSourceService
```java
public interface DataSourceService {
    boolean testConnection(DataSource dataSource);
    void extractMetadata(DataSource dataSource);
    void syncMetadata(DataSource dataSource, SyncType syncType);
}
```

### QueryService
```java
public interface QueryService {
    QueryResult executeQuery(Query query, Map<String, Object> parameters);
    String translateNaturalLanguage(String question, QueryContext context);
    void validateQuery(String sql);
}
```

### RelationshipService
```java
public interface RelationshipService {
    List<TableRelationship> detectRelationships(Table table);
    void validateRelationship(TableRelationship relationship);
}
```

### ConfigurationService
```java
public interface ConfigurationService {
    DisplayConfig createDefaultConfig(Query query);
    void validateConfig(DisplayConfig config);
}
# DataScope - Coding Standards and Best Practices

## Overview

This document outlines the coding standards and best practices for the DataScope project. Following these standards ensures code consistency, maintainability, and quality across the project. All contributors should adhere to these guidelines when writing or modifying code.

## General Principles

### Clean Code

- Write code that is easy to understand and maintain
- Follow the SOLID principles
- Keep methods and classes focused on a single responsibility
- Avoid code duplication (DRY - Don't Repeat Yourself)
- Favor readability over cleverness
- Write code for humans, not just for computers

### Code Organization

- Organize code logically within the appropriate modules
- Follow the package structure defined in the architecture
- Keep related functionality together
- Separate concerns appropriately

### Naming Conventions

- Use meaningful, descriptive names
- Be consistent with naming patterns
- Choose names that reveal intent
- Avoid abbreviations unless they are widely understood
- Use domain terminology from the ubiquitous language

## Java Code Standards

### Naming Conventions

- **Classes**: PascalCase, noun or noun phrase (e.g., `DataSource`, `QueryExecutor`)
- **Interfaces**: PascalCase, adjective, noun, or noun phrase (e.g., `Executable`, `Repository`)
- **Methods**: camelCase, verb or verb phrase (e.g., `executeQuery`, `findById`)
- **Variables**: camelCase, noun or noun phrase (e.g., `dataSource`, `queryResult`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_CONNECTIONS`, `DEFAULT_TIMEOUT`)
- **Packages**: lowercase, domain-reversed notation (e.g., `com.datascope.domain.query`)
- **Enums**: PascalCase for enum name, UPPER_SNAKE_CASE for enum constants

### Formatting

- Use 4 spaces for indentation (not tabs)
- Maximum line length of 120 characters
- One statement per line
- Use blank lines to separate logical blocks of code
- Use consistent brace style (opening brace on the same line)
- Avoid unnecessary parentheses
- Use spaces around operators and after commas

Example:
```java
public class QueryExecutor {
    private static final int DEFAULT_TIMEOUT = 30;
    
    private final DataSource dataSource;
    
    public QueryExecutor(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    
    public QueryResult executeQuery(String sql, Map<String, Object> parameters, int timeout) {
        int actualTimeout = timeout > 0 ? timeout : DEFAULT_TIMEOUT;
        
        try (Connection connection = dataSource.getConnection()) {
            // Execute query
            return processResults(connection, sql, parameters, actualTimeout);
        } catch (SQLException e) {
            throw new QueryExecutionException("Failed to execute query", e);
        }
    }
    
    private QueryResult processResults(Connection connection, String sql, 
                                      Map<String, Object> parameters, int timeout) {
        // Process query results
    }
}
```

### Comments

- Write self-documenting code that minimizes the need for comments
- Use Javadoc for all public classes and methods
- Include `@param`, `@return`, and `@throws` tags in method Javadoc
- Add implementation comments only when necessary to explain complex logic
- Keep comments up-to-date with code changes
- Avoid commented-out code

Example Javadoc:
```java
/**
 * Executes an SQL query against the data source with the specified parameters.
 *
 * @param sql The SQL query to execute
 * @param parameters The query parameters
 * @param timeout The query timeout in seconds, or 0 for default timeout
 * @return The query result containing columns and rows
 * @throws QueryExecutionException If the query execution fails
 */
public QueryResult executeQuery(String sql, Map<String, Object> parameters, int timeout) {
    // Method implementation
}
```

### Exception Handling

- Use specific exception types rather than generic ones
- Create custom exceptions for domain-specific error conditions
- Include meaningful error messages
- Catch exceptions at the appropriate level
- Don't catch exceptions you can't handle properly
- Always clean up resources in a finally block or use try-with-resources
- Log exceptions with appropriate context

### Null Handling

- Avoid returning null when possible (use Optional, empty collections, etc.)
- Use `@NotNull` and `@Nullable` annotations to document nullability
- Validate method parameters for null when appropriate
- Use Objects.requireNonNull() for mandatory parameters
- Consider using Optional for values that might not be present

### Immutability

- Make classes immutable when possible
- Use final fields
- Don't provide setters for immutable objects
- Return defensive copies of mutable fields
- Use unmodifiable collections when returning collections

## Domain-Driven Design Standards

### Entities

- Implement entities with clear identity
- Encapsulate business logic within entities
- Use rich domain models with behavior, not just data
- Implement proper equality based on identity
- Protect invariants through validation

Example:
```java
public class DataSource {
    private final String id;
    private String name;
    private String description;
    private DataSourceType type;
    private String host;
    private int port;
    private String databaseName;
    private String username;
    private EncryptedPassword password;
    private ConnectionStatus status;
    
    // Constructor with validation
    public DataSource(String id, String name, DataSourceType type, 
                     String host, int port, String databaseName,
                     String username, String password) {
        this.id = Objects.requireNonNull(id, "ID must not be null");
        setName(name);
        this.type = Objects.requireNonNull(type, "Type must not be null");
        setHost(host);
        setPort(port);
        setDatabaseName(databaseName);
        setUsername(username);
        setPassword(password);
        this.status = ConnectionStatus.INACTIVE;
    }
    
    // Business methods
    public void activate() {
        this.status = ConnectionStatus.ACTIVE;
    }
    
    public void deactivate() {
        this.status = ConnectionStatus.INACTIVE;
    }
    
    public void markError(String errorMessage) {
        this.status = ConnectionStatus.ERROR;
        // Additional error handling logic
    }
    
    // Getters and setters with validation
    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name must not be empty");
        }
        this.name = name;
    }
    
    // Other getters and setters with appropriate validation
    
    // Equality based on identity
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DataSource that = (DataSource) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```

### Value Objects

- Implement value objects without identity
- Make value objects immutable
- Implement equality based on all attributes
- Use factory methods for complex creation logic

Example:
```java
public final class EncryptedPassword {
    private final String encryptedValue;
    private final String salt;
    
    private EncryptedPassword(String encryptedValue, String salt) {
        this.encryptedValue = encryptedValue;
        this.salt = salt;
    }
    
    public static EncryptedPassword fromPlainText(String plainText) {
        String salt = generateSalt();
        String encrypted = encrypt(plainText, salt);
        return new EncryptedPassword(encrypted, salt);
    }
    
    public boolean matches(String plainText) {
        String encrypted = encrypt(plainText, salt);
        return encryptedValue.equals(encrypted);
    }
    
    // Getters (no setters for immutability)
    
    // Equality based on all attributes
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EncryptedPassword that = (EncryptedPassword) o;
        return Objects.equals(encryptedValue, that.encryptedValue) && 
               Objects.equals(salt, that.salt);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(encryptedValue, salt);
    }
    
    // Private helper methods
    private static String generateSalt() {
        // Salt generation logic
    }
    
    private static String encrypt(String plainText, String salt) {
        // Encryption logic
    }
}
```

### Repositories

- Define repository interfaces in the domain layer
- Keep repository interfaces focused on domain concepts
- Use domain types in repository interfaces
- Implement repositories in the infrastructure layer
- Use meaningful method names that reflect domain concepts

Example:
```java
// Domain layer
public interface DataSourceRepository {
    DataSource findById(String id);
    List<DataSource> findAll();
    List<DataSource> findByType(DataSourceType type);
    void save(DataSource dataSource);
    void remove(DataSource dataSource);
}

// Infrastructure layer
@Repository
public class MySqlDataSourceRepository implements DataSourceRepository {
    private final JdbcTemplate jdbcTemplate;
    private final DataSourceRowMapper rowMapper;
    
    @Autowired
    public MySqlDataSourceRepository(JdbcTemplate jdbcTemplate, DataSourceRowMapper rowMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.rowMapper = rowMapper;
    }
    
    @Override
    public DataSource findById(String id) {
        try {
            return jdbcTemplate.queryForObject(
                "SELECT * FROM tbl_data_source WHERE id = ?",
                rowMapper,
                id
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
    
    // Other method implementations
}
```

### Services

- Use application services to orchestrate domain operations
- Keep domain services focused on domain logic
- Avoid anemic domain models by putting behavior in entities
- Use services for operations that don't naturally fit in entities
- Implement transaction boundaries in application services

Example:
```java
@Service
@Transactional
public class DataSourceManagementService {
    private final DataSourceRepository dataSourceRepository;
    private final MetadataExtractor metadataExtractor;
    
    @Autowired
    public DataSourceManagementService(DataSourceRepository dataSourceRepository,
                                      MetadataExtractor metadataExtractor) {
        this.dataSourceRepository = dataSourceRepository;
        this.metadataExtractor = metadataExtractor;
    }
    
    public DataSource createDataSource(DataSourceCreationRequest request) {
        // Create and validate the data source
        DataSource dataSource = new DataSource(
            UUID.randomUUID().toString(),
            request.getName(),
            request.getType(),
            request.getHost(),
            request.getPort(),
            request.getDatabaseName(),
            request.getUsername(),
            request.getPassword()
        );
        
        // Save the data source
        dataSourceRepository.save(dataSource);
        
        return dataSource;
    }
    
    public void synchronizeMetadata(String dataSourceId) {
        DataSource dataSource = dataSourceRepository.findById(dataSourceId);
        if (dataSource == null) {
            throw new EntityNotFoundException("Data source not found: " + dataSourceId);
        }
        
        // Extract and save metadata
        metadataExtractor.extractAndSaveMetadata(dataSource);
        
        // Update data source status
        dataSource.activate();
        dataSourceRepository.save(dataSource);
    }
    
    // Other service methods
}
```

## Testing Standards

### Unit Tests

- Write unit tests for all business logic
- Use JUnit 5 for testing
- Follow the Arrange-Act-Assert pattern
- Use descriptive test method names
- Test one concept per test method
- Use appropriate assertions
- Mock external dependencies
- Keep tests independent of each other

Example:
```java
@ExtendWith(MockitoExtension.class)
public class DataSourceTest {
    
    @Test
    void shouldActivateDataSource() {
        // Arrange
        DataSource dataSource = new DataSource(
            "test-id",
            "Test Source",
            DataSourceType.MYSQL,
            "localhost",
            3306,
            "test_db",
            "user",
            "password"
        );
        
        // Act
        dataSource.activate();
        
        // Assert
        assertEquals(ConnectionStatus.ACTIVE, dataSource.getStatus());
    }
    
    @Test
    void shouldThrowExceptionWhenNameIsEmpty() {
        // Arrange
        DataSource dataSource = new DataSource(
            "test-id",
            "Test Source",
            DataSourceType.MYSQL,
            "localhost",
            3306,
            "test_db",
            "user",
            "password"
        );
        
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            dataSource.setName("");
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            dataSource.setName(null);
        });
    }
}
```

### Integration Tests

- Use Spring Test for integration testing
- Use Testcontainers for database testing
- Test repository implementations with real databases
- Test API controllers with MockMvc
- Use appropriate profiles for testing
- Clean up test data after tests

Example:
```java
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
public class DataSourceRepositoryIntegrationTest {
    
    @Container
    static MySQLContainer<?> mySqlContainer = new MySQLContainer<>("mysql:8.0")
        .withDatabaseName("testdb")
        .withUsername("testuser")
        .withPassword("testpass");
    
    @Autowired
    private DataSourceRepository dataSourceRepository;
    
    private DataSource testDataSource;
    
    @BeforeAll
    static void beforeAll() {
        System.setProperty("spring.datasource.url", mySqlContainer.getJdbcUrl());
        System.setProperty("spring.datasource.username", mySqlContainer.getUsername());
        System.setProperty("spring.datasource.password", mySqlContainer.getPassword());
    }
    
    @BeforeEach
    void setUp() {
        testDataSource = new DataSource(
            "test-id",
            "Test Source",
            DataSourceType.MYSQL,
            "localhost",
            3306,
            "test_db",
            "user",
            "password"
        );
        dataSourceRepository.save(testDataSource);
    }
    
    @AfterEach
    void tearDown() {
        dataSourceRepository.remove(testDataSource);
    }
    
    @Test
    void shouldFindDataSourceById() {
        // Act
        DataSource found = dataSourceRepository.findById("test-id");
        
        // Assert
        assertNotNull(found);
        assertEquals("Test Source", found.getName());
        assertEquals(DataSourceType.MYSQL, found.getType());
    }
}
```

## Database Standards

### SQL Coding Standards

- Use prepared statements or parameterized queries
- Use meaningful table and column names
- Follow the database naming conventions specified in the project
- Use appropriate indexes for performance
- Write readable and maintainable SQL
- Use joins appropriately
- Avoid using SELECT * in production code

### MyBatis Standards

- Organize mapper XML files logically
- Use meaningful IDs for SQL statements
- Use parameterized queries
- Use result maps for complex mappings
- Keep SQL statements readable with proper formatting
- Use dynamic SQL when appropriate
- Document complex queries

Example:
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.datascope.infrastructure.repository.mybatis.DataSourceMapper">
  
  <resultMap id="dataSourceResultMap" type="com.datascope.domain.datasource.DataSource">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="description" column="description"/>
    <result property="type" column="type"/>
    <result property="host" column="host"/>
    <result property="port" column="port"/>
    <result property="databaseName" column="database_name"/>
    <result property="username" column="username"/>
    <result property="status" column="status"/>
    <!-- Other mappings -->
  </resultMap>
  
  <select id="findById" resultMap="dataSourceResultMap">
    SELECT id, name, description, type, host, port, database_name, username, status
    FROM tbl_data_source
    WHERE id = #{id}
  </select>
  
  <select id="findByType" resultMap="dataSourceResultMap">
    SELECT id, name, description, type, host, port, database_name, username, status
    FROM tbl_data_source
    WHERE type = #{type}
  </select>
  
  <insert id="insert">
    INSERT INTO tbl_data_source (
      id, name, description, type, host, port, database_name, 
      username, password_encrypted, password_salt, status,
      nonce, created_time, created_by, modified_time, modified_by
    ) VALUES (
      #{id}, #{name}, #{description}, #{type}, #{host}, #{port}, #{databaseName},
      #{username}, #{password.encryptedValue}, #{password.salt}, #{status},
      0, NOW(), #{createdBy}, NOW(), #{modifiedBy}
    )
  </insert>
  
  <!-- Other CRUD operations -->
  
</mapper>
```

## Security Standards

### Secure Coding Practices

- Validate all input data
- Use parameterized queries to prevent SQL injection
- Encode output to prevent XSS
- Implement proper authentication and authorization
- Protect sensitive data with encryption
- Use secure random number generation
- Implement proper error handling that doesn't expose sensitive information
- Follow the principle of least privilege

### Password and Credential Handling

- Never store passwords in plain text
- Use strong, industry-standard encryption algorithms
- Use salted hashing for passwords
- Implement secure key management
- Rotate encryption keys periodically
- Validate the strength of user passwords

Example:
```java
public class CredentialEncryptor {
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int KEY_LENGTH = 256;
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;
    
    private final SecretKey secretKey;
    
    public CredentialEncryptor(String encryptionKey) {
        this.secretKey = deriveKey(encryptionKey);
    }
    
    public String encrypt(String plainText, String salt) {
        try {
            byte[] iv = generateIv();
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec);
            cipher.updateAAD(salt.getBytes(StandardCharsets.UTF_8));
            
            byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + cipherText.length);
            byteBuffer.put(iv);
            byteBuffer.put(cipherText);
            
            return Base64.getEncoder().encodeToString(byteBuffer.array());
        } catch (Exception e) {
            throw new EncryptionException("Failed to encrypt value", e);
        }
    }
    
    public String decrypt(String encryptedText, String salt) {
        try {
            byte[] decoded = Base64.getDecoder().decode(encryptedText);
            ByteBuffer byteBuffer = ByteBuffer.wrap(decoded);
            
            byte[] iv = new byte[GCM_IV_LENGTH];
            byteBuffer.get(iv);
            
            byte[] cipherText = new byte[byteBuffer.remaining()];
            byteBuffer.get(cipherText);
            
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, parameterSpec);
            cipher.updateAAD(salt.getBytes(StandardCharsets.UTF_8));
            
            byte[] plainText = cipher.doFinal(cipherText);
            return new String(plainText, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new EncryptionException("Failed to decrypt value", e);
        }
    }
    
    private byte[] generateIv() {
        byte[] iv = new byte[GCM_IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(iv);
        return iv;
    }
    
    private SecretKey deriveKey(String password) {
        try {
            KeySpec spec = new PBEKeySpec(password.toCharArray(), "fixed-salt".getBytes(), 65536, KEY_LENGTH);
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] key = factory.generateSecret(spec).getEncoded();
            return new SecretKeySpec(key, "AES");
        } catch (Exception e) {
            throw new EncryptionException("Failed to derive key", e);
        }
    }
}
```

## Conclusion

These coding standards and best practices are designed to ensure code quality, maintainability, and security across the DataScope project. All contributors should follow these guidelines when writing or modifying code. Regular code reviews should verify adherence to these standards.

The standards may evolve over time as the project grows and as best practices in the industry change. Suggestions for improvements to these standards are welcome and should be discussed with the team.

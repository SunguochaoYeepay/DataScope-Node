# 数据源密码加密功能实现计划

## 概述

数据源密码加密是保障数据源安全的关键措施。根据需求，我们需要使用AES加密算法和盐值对数据源密码进行加密和解密，确保即使数据库被泄露，敏感的连接密码也不会被直接获取。本文档详细说明了密码加密功能的实现计划。

## 功能需求

1. 使用AES加密算法对数据源密码进行加密
2. 为每个数据源生成唯一的盐值，增强安全性
3. 提供密码解密功能，用于数据源连接时获取原始密码
4. 确保加密过程安全可靠，避免密钥泄露
5. 加密实现应该是线程安全的

## 技术方案

### 1. 密码加密工具类

创建一个专门的密码加密工具类，提供加密、解密和盐值生成功能。

```java
package com.datascope.infrastructure.security.encryption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * 密码加密工具类
 */
@Component
public class PasswordEncryptor {

    /**
     * AES加密算法，使用CBC模式和PKCS5Padding填充
     */
    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    
    /**
     * 密钥生成算法
     */
    private static final String SECRET_KEY_ALGORITHM = "PBKDF2WithHmacSHA256";
    
    /**
     * 密钥迭代次数
     */
    private static final int ITERATION_COUNT = 65536;
    
    /**
     * 密钥长度
     */
    private static final int KEY_LENGTH = 256;
    
    /**
     * 主密钥，从配置文件中读取
     */
    @Value("${datascope.security.encryption.master-key}")
    private String masterKey;
    
    /**
     * 生成随机盐值
     *
     * @return Base64编码的盐值
     */
    public String generateSalt() {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
    
    /**
     * 加密密码
     *
     * @param password 原始密码
     * @param salt     盐值
     * @return 加密后的密码
     */
    public String encrypt(String password, String salt) {
        try {
            // 解码盐值
            byte[] saltBytes = Base64.getDecoder().decode(salt);
            
            // 生成随机IV
            byte[] iv = new byte[16];
            new SecureRandom().nextBytes(iv);
            IvParameterSpec ivspec = new IvParameterSpec(iv);
            
            // 生成密钥
            SecretKey secretKey = generateSecretKey(saltBytes);
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getEncoded(), "AES");
            
            // 初始化加密器
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivspec);
            
            // 加密
            byte[] encryptedBytes = cipher.doFinal(password.getBytes(StandardCharsets.UTF_8));
            
            // 将IV和加密后的密码合并
            byte[] combined = new byte[iv.length + encryptedBytes.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encryptedBytes, 0, combined, iv.length, encryptedBytes.length);
            
            // Base64编码
            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new RuntimeException("密码加密失败", e);
        }
    }
    
    /**
     * 解密密码
     *
     * @param encryptedPassword 加密后的密码
     * @param salt              盐值
     * @return 原始密码
     */
    public String decrypt(String encryptedPassword, String salt) {
        try {
            // 解码加密后的密码
            byte[] combined = Base64.getDecoder().decode(encryptedPassword);
            
            // 解码盐值
            byte[] saltBytes = Base64.getDecoder().decode(salt);
            
            // 提取IV
            byte[] iv = new byte[16];
            System.arraycopy(combined, 0, iv, 0, iv.length);
            IvParameterSpec ivspec = new IvParameterSpec(iv);
            
            // 提取加密后的密码
            byte[] encryptedBytes = new byte[combined.length - iv.length];
            System.arraycopy(combined, iv.length, encryptedBytes, 0, encryptedBytes.length);
            
            // 生成密钥
            SecretKey secretKey = generateSecretKey(saltBytes);
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getEncoded(), "AES");
            
            // 初始化解密器
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivspec);
            
            // 解密
            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            
            // 转换为字符串
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("密码解密失败", e);
        }
    }
    
    /**
     * 生成密钥
     *
     * @param salt 盐值
     * @return 密钥
     * @throws Exception 生成密钥异常
     */
    private SecretKey generateSecretKey(byte[] salt) throws Exception {
        PBEKeySpec spec = new PBEKeySpec(masterKey.toCharArray(), salt, ITERATION_COUNT, KEY_LENGTH);
        SecretKeyFactory factory = SecretKeyFactory.getInstance(SECRET_KEY_ALGORITHM);
        return factory.generateSecret(spec);
    }
}
```

### 2. 配置文件设置

在配置文件中设置主密钥，用于加密和解密。

```yaml
# application.yml
datascope:
  security:
    encryption:
      master-key: ${DATASCOPE_MASTER_KEY:DataScope-Default-Master-Key-For-Development-Only}
```

在生产环境中，应该通过环境变量`DATASCOPE_MASTER_KEY`设置主密钥，而不是使用默认值。

### 3. 数据源服务集成

在`DataSourceService`中集成密码加密功能，确保在创建和更新数据源时正确处理密码加密。

```java
@Service
@RequiredArgsConstructor
public class DataSourceServiceImpl implements DataSourceService {

    private final DataSourceRepository repository;
    private final PasswordEncryptor passwordEncryptor;
    
    @Override
    @Transactional
    public DataSource create(DataSource entity, String operator) {
        validateDataSource(entity);
        
        if (repository.existsByName(entity.getName())) {
            throw DataSourceException.nameExists(entity.getName());
        }
        
        // 生成盐值并加密密码
        String salt = passwordEncryptor.generateSalt();
        String encryptedPassword = passwordEncryptor.encrypt(entity.getPassword(), salt);
        
        // 设置加密后的密码和盐值
        entity.setSalt(salt);
        entity.setPassword(encryptedPassword);
        
        entity.init(operator);
        return repository.save(entity);
    }
    
    @Override
    @Transactional
    public DataSource update(DataSource entity, String operator) {
        Assert.notNull(entity.getId(), "数据源ID不能为空");
        validateDataSource(entity);
        
        DataSource existing = repository.findById(entity.getId())
                .orElseThrow(() -> DataSourceException.notFound(entity.getId()));
        
        if (!existing.getName().equals(entity.getName()) && repository.existsByName(entity.getName())) {
            throw DataSourceException.nameExists(entity.getName());
        }
        
        // 判断密码是否变更
        if (!isEncryptedPassword(entity.getPassword())) {
            // 如果是明文密码，则重新加密
            String encryptedPassword = passwordEncryptor.encrypt(entity.getPassword(), existing.getSalt());
            entity.setPassword(encryptedPassword);
        }
        
        // 保留原有的盐值
        entity.setSalt(existing.getSalt());
        
        entity.update(operator);
        return repository.save(entity);
    }
    
    /**
     * 判断是否为加密后的密码
     *
     * @param password 密码
     * @return 是否为加密后的密码
     */
    private boolean isEncryptedPassword(String password) {
        // 简单判断是否为Base64编码的字符串
        try {
            Base64.getDecoder().decode(password);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
```

### 4. 连接管理器集成

在数据源连接管理器中集成密码解密功能，确保在创建数据库连接时使用解密后的密码。

```java
@Component
@RequiredArgsConstructor
public class DataSourceConnectionManager {

    private final PasswordEncryptor passwordEncryptor;
    
    /**
     * 获取数据库连接
     *
     * @param dataSource 数据源
     * @return 数据库连接
     * @throws SQLException 连接异常
     */
    public Connection getConnection(DataSource dataSource) throws SQLException {
        try {
            // 解密密码
            String decryptedPassword = passwordEncryptor.decrypt(dataSource.getPassword(), dataSource.getSalt());
            
            // 构建JDBC URL
            String jdbcUrl = buildJdbcUrl(dataSource);
            
            // 设置连接属性
            Properties props = new Properties();
            props.setProperty("user", dataSource.getUsername());
            props.setProperty("password", decryptedPassword);
            
            // 获取连接
            return DriverManager.getConnection(jdbcUrl, props);
        } catch (Exception e) {
            throw new SQLException("获取数据库连接失败: " + e.getMessage(), e);
        }
    }
}
```

## 安全考虑

### 1. 主密钥保护

主密钥是整个加密系统的核心，必须妥善保护：

1. 在生产环境中，通过环境变量或安全的配置管理系统提供主密钥
2. 避免将主密钥硬编码在代码或配置文件中
3. 定期轮换主密钥，并重新加密所有密码

### 2. 盐值管理

每个数据源使用唯一的盐值，增强安全性：

1. 使用安全的随机数生成器生成盐值
2. 盐值长度应该足够长（至少16字节）
3. 盐值应该与加密后的密码一起存储

### 3. 加密算法选择

选择强大的加密算法和参数：

1. 使用AES-256加密算法
2. 使用CBC模式和随机IV
3. 使用PBKDF2WithHmacSHA256算法派生密钥
4. 使用足够多的迭代次数（至少65536次）

### 4. 错误处理

妥善处理加密和解密过程中的错误：

1. 避免在错误消息中泄露敏感信息
2. 记录加密和解密错误，但不包含原始密码
3. 在解密失败时提供有用的错误信息，但不泄露加密细节

## 测试计划

### 1. 单元测试

```java
@SpringBootTest
class PasswordEncryptorTest {

    @Autowired
    private PasswordEncryptor passwordEncryptor;
    
    @Test
    void testEncryptAndDecrypt() {
        // 准备测试数据
        String originalPassword = "Test@Password123";
        
        // 生成盐值
        String salt = passwordEncryptor.generateSalt();
        
        // 加密
        String encryptedPassword = passwordEncryptor.encrypt(originalPassword, salt);
        
        // 验证加密结果不为空且不等于原始密码
        assertNotNull(encryptedPassword);
        assertNotEquals(originalPassword, encryptedPassword);
        
        // 解密
        String decryptedPassword = passwordEncryptor.decrypt(encryptedPassword, salt);
        
        // 验证解密结果等于原始密码
        assertEquals(originalPassword, decryptedPassword);
    }
    
    @Test
    void testDifferentSalts() {
        // 准备测试数据
        String originalPassword = "Test@Password123";
        
        // 生成两个不同的盐值
        String salt1 = passwordEncryptor.generateSalt();
        String salt2 = passwordEncryptor.generateSalt();
        
        // 使用不同的盐值加密相同的密码
        String encryptedPassword1 = passwordEncryptor.encrypt(originalPassword, salt1);
        String encryptedPassword2 = passwordEncryptor.encrypt(originalPassword, salt2);
        
        // 验证使用不同盐值加密的结果不同
        assertNotEquals(encryptedPassword1, encryptedPassword2);
        
        // 验证使用正确的盐值解密
        assertEquals(originalPassword, passwordEncryptor.decrypt(encryptedPassword1, salt1));
        assertEquals(originalPassword, passwordEncryptor.decrypt(encryptedPassword2, salt2));
        
        // 验证使用错误的盐值解密会失败
        assertThrows(RuntimeException.class, () -> passwordEncryptor.decrypt(encryptedPassword1, salt2));
        assertThrows(RuntimeException.class, () -> passwordEncryptor.decrypt(encryptedPassword2, salt1));
    }
    
    @Test
    void testSaltGeneration() {
        // 生成多个盐值
        String salt1 = passwordEncryptor.generateSalt();
        String salt2 = passwordEncryptor.generateSalt();
        String salt3 = passwordEncryptor.generateSalt();
        
        // 验证盐值不为空
        assertNotNull(salt1);
        assertNotNull(salt2);
        assertNotNull(salt3);
        
        // 验证盐值不重复
        assertNotEquals(salt1, salt2);
        assertNotEquals(salt1, salt3);
        assertNotEquals(salt2, salt3);
        
        // 验证盐值长度
        assertTrue(Base64.getDecoder().decode(salt1).length >= 16);
    }
}
```

### 2. 集成测试

```java
@SpringBootTest
class DataSourceServiceIntegrationTest {

    @Autowired
    private DataSourceService dataSourceService;
    
    @Autowired
    private DataSourceRepository dataSourceRepository;
    
    @Autowired
    private PasswordEncryptor passwordEncryptor;
    
    @Test
    void testCreateDataSourceWithEncryptedPassword() {
        // 准备测试数据
        DataSource dataSource = new DataSource();
        dataSource.setName("test-db-" + System.currentTimeMillis());
        dataSource.setType(DataSource.DataSourceType.MYSQL);
        dataSource.setHost("localhost");
        dataSource.setPort(3306);
        dataSource.setDatabase("test_db");
        dataSource.setUsername("test_user");
        dataSource.setPassword("test_password");
        
        // 创建数据源
        DataSource savedDataSource = dataSourceService.create(dataSource, "test-user");
        
        // 验证密码已加密
        assertNotEquals("test_password", savedDataSource.getPassword());
        
        // 验证盐值不为空
        assertNotNull(savedDataSource.getSalt());
        
        // 验证可以解密密码
        String decryptedPassword = passwordEncryptor.decrypt(savedDataSource.getPassword(), savedDataSource.getSalt());
        assertEquals("test_password", decryptedPassword);
    }
    
    @Test
    void testUpdateDataSourcePassword() {
        // 准备测试数据
        DataSource dataSource = new DataSource();
        dataSource.setName("test-db-update-" + System.currentTimeMillis());
        dataSource.setType(DataSource.DataSourceType.MYSQL);
        dataSource.setHost("localhost");
        dataSource.setPort(3306);
        dataSource.setDatabase("test_db");
        dataSource.setUsername("test_user");
        dataSource.setPassword("original_password");
        
        // 创建数据源
        DataSource savedDataSource = dataSourceService.create(dataSource, "test-user");
        
        // 更新密码
        savedDataSource.setPassword("new_password");
        DataSource updatedDataSource = dataSourceService.update(savedDataSource, "test-user");
        
        // 验证密码已更新
        String decryptedPassword = passwordEncryptor.decrypt(updatedDataSource.getPassword(), updatedDataSource.getSalt());
        assertEquals("new_password", decryptedPassword);
    }
}
```

## 下一步工作

完成密码加密功能后，下一步将实施：

1. 数据源连接池管理
2. 数据源连接测试功能
3. 数据源元数据同步功能
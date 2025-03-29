# DataScope - Maven模块结构

## 概述

本文档描述了DataScope项目的Maven模块结构，该结构遵循领域驱动设计(DDD)原则。项目被划分为以下五个主要模块：

1. data-scope-app
2. data-scope-domain
3. data-scope-facade
4. data-scope-infrastructure
5. data-scope-main

## 模块结构

### 父项目 (data-scope)

父项目包含所有子模块，并定义了共享的依赖项、插件和属性。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/>
    </parent>

    <groupId>com.datascope</groupId>
    <artifactId>data-scope</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <name>DataScope</name>
    <description>A comprehensive data management and query system</description>

    <modules>
        <module>data-scope-domain</module>
        <module>data-scope-app</module>
        <module>data-scope-facade</module>
        <module>data-scope-infrastructure</module>
        <module>data-scope-main</module>
    </modules>

    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        
        <!-- 依赖版本 -->
        <mybatis.version>3.5.13</mybatis.version>
        <mybatis-spring.version>3.0.2</mybatis-spring.version>
        <mapstruct.version>1.5.5.Final</mapstruct.version>
        <lombok.version>1.18.28</lombok.version>
        <commons-lang3.version>3.12.0</commons-lang3.version>
        <commons-collections4.version>4.4</commons-collections4.version>
        <commons-io.version>2.13.0</commons-io.version>
        <guava.version>32.0.1-jre</guava.version>
        <jackson.version>2.15.2</jackson.version>
        <mysql-connector.version>8.0.33</mysql-connector.version>
        <db2-jdbc.version>11.5.8.0</db2-jdbc.version>
        <springdoc-openapi.version>2.1.0</springdoc-openapi.version>
        <testcontainers.version>1.18.3</testcontainers.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- 内部模块依赖 -->
            <dependency>
                <groupId>com.datascope</groupId>
                <artifactId>data-scope-domain</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.datascope</groupId>
                <artifactId>data-scope-app</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.datascope</groupId>
                <artifactId>data-scope-facade</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.datascope</groupId>
                <artifactId>data-scope-infrastructure</artifactId>
                <version>${project.version}</version>
            </dependency>

            <!-- MyBatis -->
            <dependency>
                <groupId>org.mybatis</groupId>
                <artifactId>mybatis</artifactId>
                <version>${mybatis.version}</version>
            </dependency>
            <dependency>
                <groupId>org.mybatis</groupId>
                <artifactId>mybatis-spring</artifactId>
                <version>${mybatis-spring.version}</version>
            </dependency>

            <!-- 数据库驱动 -->
            <dependency>
                <groupId>com.mysql</groupId>
                <artifactId>mysql-connector-j</artifactId>
                <version>${mysql-connector.version}</version>
            </dependency>
            <dependency>
                <groupId>com.ibm.db2</groupId>
                <artifactId>jcc</artifactId>
                <version>${db2-jdbc.version}</version>
            </dependency>

            <!-- 工具库 -->
            <dependency>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct</artifactId>
                <version>${mapstruct.version}</version>
            </dependency>
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </dependency>
            <dependency>
                <groupId>org.apache.commons</groupId>
                <artifactId>commons-lang3</artifactId>
                <version>${commons-lang3.version}</version>
            </dependency>
            <dependency>
                <groupId>org.apache.commons</groupId>
                <artifactId>commons-collections4</artifactId>
                <version>${commons-collections4.version}</version>
            </dependency>
            <dependency>
                <groupId>commons-io</groupId>
                <artifactId>commons-io</artifactId>
                <version>${commons-io.version}</version>
            </dependency>
            <dependency>
                <groupId>com.google.guava</groupId>
                <artifactId>guava</artifactId>
                <version>${guava.version}</version>
            </dependency>

            <!-- Jackson -->
            <dependency>
                <groupId>com.fasterxml.jackson.core</groupId>
                <artifactId>jackson-databind</artifactId>
                <version>${jackson.version}</version>
            </dependency>
            <dependency>
                <groupId>com.fasterxml.jackson.datatype</groupId>
                <artifactId>jackson-datatype-jsr310</artifactId>
                <version>${jackson.version}</version>
            </dependency>

            <!-- API文档 -->
            <dependency>
                <groupId>org.springdoc</groupId>
                <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
                <version>${springdoc-openapi.version}</version>
            </dependency>

            <!-- 测试容器 -->
            <dependency>
                <groupId>org.testcontainers</groupId>
                <artifactId>testcontainers-bom</artifactId>
                <version>${testcontainers.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- 所有模块共享的依赖 -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.11.0</version>
                    <configuration>
                        <source>${java.version}</source>
                        <target>${java.version}</target>
                        <annotationProcessorPaths>
                            <path>
                                <groupId>org.projectlombok</groupId>
                                <artifactId>lombok</artifactId>
                                <version>${lombok.version}</version>
                            </path>
                            <path>
                                <groupId>org.mapstruct</groupId>
                                <artifactId>mapstruct-processor</artifactId>
                                <version>${mapstruct.version}</version>
                            </path>
                        </annotationProcessorPaths>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

### 领域模块 (data-scope-domain)

领域模块包含核心业务逻辑和领域实体。它是最内层的模块，不依赖于其他模块。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>com.datascope</groupId>
        <artifactId>data-scope</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    
    <artifactId>data-scope-domain</artifactId>
    <name>DataScope - Domain</name>
    <description>Domain model and business logic</description>
    
    <dependencies>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
    </dependencies>
</project>
```

### 应用模块 (data-scope-app)

应用模块包含应用服务，负责编排领域对象以实现用例。它依赖于领域模块。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>com.datascope</groupId>
        <artifactId>data-scope</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    
    <artifactId>data-scope-app</artifactId>
    <name>DataScope - Application</name>
    <description>Application services that orchestrate domain operations</description>
    
    <dependencies>
        <dependency>
            <groupId>com.datascope</groupId>
            <artifactId>data-scope-domain</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
        </dependency>
    </dependencies>
</project>
```

### 外观模块 (data-scope-facade)

外观模块包含API控制器和DTO。它依赖于应用模块。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>com.datascope</groupId>
        <artifactId>data-scope</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    
    <artifactId>data-scope-facade</artifactId>
    <name>DataScope - Facade</name>
    <description>API controllers and DTOs</description>
    
    <dependencies>
        <dependency>
            <groupId>com.datascope</groupId>
            <artifactId>data-scope-app</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.datatype</groupId>
            <artifactId>jackson-datatype-jsr310</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
        </dependency>
    </dependencies>
</project>
```

### 基础设施模块 (data-scope-infrastructure)

基础设施模块包含仓储实现和外部服务集成。它依赖于领域模块。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>com.datascope</groupId>
        <artifactId>data-scope</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    
    <artifactId>data-scope-infrastructure</artifactId>
    <name>DataScope - Infrastructure</name>
    <description>Repository implementations and external services</description>
    
    <dependencies>
        <dependency>
            <groupId>com.datascope</groupId>
            <artifactId>data-scope-domain</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
        </dependency>
        <dependency>
            <groupId>com.ibm.db2</groupId>
            <artifactId>jcc</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-collections4</artifactId>
        </dependency>
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
        </dependency>
        <dependency>
            <groupId>com.google.guava</groupId>
            <artifactId>guava</artifactId>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>mysql</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

### 主应用模块 (data-scope-main)

主应用模块是应用程序的入口点，包含引导和配置。它依赖于所有其他模块。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>com.datascope</groupId>
        <artifactId>data-scope</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    
    <artifactId>data-scope-main</artifactId>
    <name>DataScope - Main</name>
    <description>Application bootstrap and configuration</description>
    
    <dependencies>
        <dependency>
            <groupId>com.datascope</groupId>
            <artifactId>data-scope-domain</artifactId>
        </dependency>
        <dependency>
            <groupId>com.datascope</groupId>
            <artifactId>data-scope-app</artifactId>
        </dependency>
        <dependency>
            <groupId>com.datascope</groupId>
            <artifactId>data-scope-facade</artifactId>
        </dependency>
        <dependency>
            <groupId>com.datascope</groupId>
            <artifactId>data-scope-infrastructure</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## 包结构

每个模块应遵循以下包结构：

### data-scope-domain

```
com.datascope.domain
├── datasource          # 数据源相关的领域对象
│   ├── entity          # 数据源实体
│   ├── repository      # 数据源仓储接口
│   ├── service         # 数据源领域服务
│   └── valueobject     # 数据源值对象
├── metadata            # 元数据相关的领域对象
│   ├── entity
│   ├── repository
│   ├── service
│   └── valueobject
├── query               # 查询相关的领域对象
│   ├── entity
│   ├── repository
│   ├── service
│   └── valueobject
├── relationship        # 关系相关的领域对象
│   ├── entity
│   ├── repository
│   ├── service
│   └── valueobject
├── lowcode             # 低代码集成相关的领域对象
│   ├── entity
│   ├── repository
│   ├── service
│   └── valueobject
└── common              # 通用领域对象和异常
    ├── entity
    ├── exception
    ├── service
    └── valueobject
```

### data-scope-app

```
com.datascope.app
├── datasource          # 数据源应用服务
├── metadata            # 元数据应用服务
├── query               # 查询应用服务
├── relationship        # 关系应用服务
├── lowcode             # 低代码集成应用服务
├── common              # 通用应用服务
└── dto                 # 应用层数据传输对象
```

### data-scope-facade

```
com.datascope.facade
├── api                 # API控制器
│   ├── datasource      # 数据源API
│   ├── metadata        # 元数据API
│   ├── query           # 查询API
│   ├── relationship    # 关系API
│   └── lowcode         # 低代码集成API
├── dto                 # 外观层数据传输对象
│   ├── request         # 请求DTO
│   └── response        # 响应DTO
├── mapper              # DTO与应用层DTO之间的映射器
└── config              # 外观层配置
```

### data-scope-infrastructure

```
com.datascope.infrastructure
├── repository          # 仓储实现
│   ├── datasource      # 数据源仓储实现
│   ├── metadata        # 元数据仓储实现
│   ├── query           # 查询仓储实现
│   ├── relationship    # 关系仓储实现
│   └── lowcode         # 低代码集成仓储实现
├── mybatis             # MyBatis相关配置和映射器
│   ├── mapper          # MyBatis映射器接口
│   └── typehandler     # 自定义类型处理器
├── external            # 外部服务集成
│   ├── llm             # 大型语言模型集成
│   └── datasource      # 外部数据源连接
├── security            # 安全相关实现
│   ├── encryption      # 加密实现
│   └── masking         # 数据掩码实现
├── cache               # 缓存实现
└── config              # 基础设施配置
```

### data-scope-main

```
com.datascope.main
├── config              # 应用配置
├── bootstrap           # 应用引导
└── aop                 # 切面
```

## 依赖关系

模块之间的依赖关系如下：

1. **data-scope-domain**: 不依赖其他模块
2. **data-scope-app**: 依赖 data-scope-domain
3. **data-scope-facade**: 依赖 data-scope-app
4. **data-scope-infrastructure**: 依赖 data-scope-domain
5. **data-scope-main**: 依赖所有其他模块

这种依赖结构确保了领域模型的独立性，并遵循了依赖倒置原则。

## 构建和运行

要构建整个项目，在根目录执行：

```bash
mvn clean install
```

要运行应用程序，在根目录执行：

```bash
cd data-scope-main
mvn spring-boot:run
```

或者在构建后直接运行JAR文件：

```bash
java -jar data-scope-main/target/data-scope-main-1.0.0-SNAPSHOT.jar
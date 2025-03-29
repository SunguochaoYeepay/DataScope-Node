# 模块依赖关系指南

## 模块依赖原则

在DataScope项目中，我们遵循以下模块依赖原则：

1. **单向依赖原则**：依赖关系应该是单向的，避免循环依赖。
2. **依赖倒置原则**：高层模块不应该依赖低层模块，两者都应该依赖抽象。
3. **最小知识原则**：一个模块对其他模块的了解应该尽可能少。

## 模块层次结构

DataScope项目的模块层次结构如下：

```
domain (领域层) ← infrastructure (基础设施层) ← app (应用层) ← main (启动层)
facade (外观层) ← app (应用层) ← main (启动层)
```

- **domain模块**：包含核心业务逻辑和领域模型，不依赖其他模块。
- **facade模块**：提供对外接口和DTO定义，不依赖其他模块。
- **app模块**：实现facade接口，协调domain和facade之间的交互，依赖domain和facade模块。
- **main模块**：应用程序入口，依赖app模块。
- **infrastructure**：基础设施，依赖domain模块。

## 常见问题与解决方案

### 问题1：Facade模块依赖Domain模块中的枚举类

**问题描述**：

Facade模块中的DTO类需要使用Domain模块中定义的枚举类，例如：

```java
// 在Facade模块中

import com.datascope.domain.query.enums.ColumnAlign;
import com.datascope.domain.query.enums.ColumnFixed;
import com.datascope.domain.query.enums.MaskType;

@Data
public class UserDisplayConfigDTO {
  private ColumnAlign align;
  private ColumnFixed fixed;
  private MaskType maskType;
  // ...
}
```

**解决方案**：

在Facade模块中重新定义相同的枚举类，然后在App模块中使用MapStruct进行转换：

1. 在Facade模块中定义枚举类：

```java
// 在Facade模块中
package com.datascope.facade.query.enums;

public enum ColumnAlign {
  LEFT,
  CENTER,
  RIGHT
}
```

2. 在App模块中使用MapStruct进行转换：

```java
// 在App模块中
@Mapper(componentModel = "spring")
public interface EnumMapper {
  default com.datascope.facade.query.enums.ColumnAlign toFacade(com.datascope.domain.query.enums.ColumnAlign domainEnum) {
    if (domainEnum == null) {
      return null;
    }
    return com.datascope.facade.query.enums.ColumnAlign.valueOf(domainEnum.name());
  }

  default com.datascope.domain.query.enums.ColumnAlign toDomain(com.datascope.facade.query.enums.ColumnAlign facadeEnum) {
    if (facadeEnum == null) {
      return null;
    }
    return com.datascope.domain.query.enums.ColumnAlign.valueOf(facadeEnum.name());
  }
}
```

### 问题2：Domain实体与Facade DTO之间的转换

**问题描述**：

需要在App模块中实现Domain实体与Facade DTO之间的转换。

**解决方案**：

使用MapStruct框架简化转换实现：

1. 在App模块中定义Mapper接口：

```java
// 在App模块中
@Mapper(componentModel = "spring", uses = {EnumMapper.class})
public interface UserDisplayConfigMapper {
  UserDisplayConfigDTO toDTO(UserDisplayConfig domain);

  UserDisplayConfig toDomain(UserDisplayConfigDTO dto);

  List<UserDisplayConfigDTO> toDTOList(List<UserDisplayConfig> domains);

  List<UserDisplayConfig> toDomainList(List<UserDisplayConfigDTO> dtos);
}
```

2. MapStruct会自动生成实现类，处理属性映射和枚举转换。

## 最佳实践

1. **避免直接依赖**：Facade模块不应该直接依赖Domain模块中的具体实现类。
2. **使用枚举复制**：当Facade模块需要使用Domain模块中的枚举时，在Facade模块中重新定义相同的枚举。
3. **使用MapStruct**：使用MapStruct框架简化Domain实体与Facade DTO之间的转换。
4. **接口隔离**：在Facade模块中定义接口，在App模块中实现这些接口。
5. **依赖注入**：使用依赖注入框架（如Spring）管理模块之间的依赖关系。

## 示例

### 正确的依赖关系

```java
// 在Domain模块中定义枚举
package com.datascope.domain.query.enums;

public enum ColumnAlign {LEFT, CENTER, RIGHT}

// 在Facade模块中定义相同的枚举
package com.datascope.facade.query.enums;

public enum ColumnAlign {LEFT, CENTER, RIGHT}

// 在Facade模块中使用Facade枚举
package com.datascope.facade.query.dto;
import com.datascope.facade.query.enums.ColumnAlign;

public class UserDisplayConfigDTO {
  private ColumnAlign align;
}

// 在App模块中实现转换
package com.datascope.app.converter;

@Mapper(componentModel = "spring")
public interface EnumMapper {
  com.datascope.facade.query.enums.ColumnAlign toFacade(com.datascope.domain.query.enums.ColumnAlign domainEnum);

  com.datascope.domain.query.enums.ColumnAlign toDomain(com.datascope.facade.query.enums.ColumnAlign facadeEnum);
}
```

### 错误的依赖关系

```java
// 在Facade模块中直接依赖Domain模块中的枚举
package com.datascope.facade.query.dto;

import com.datascope.domain.query.enums.ColumnAlign; // 错误：直接依赖Domain模块

public class UserDisplayConfigDTO {
  private ColumnAlign align;
}
```

## 结论

遵循正确的模块依赖关系可以提高代码的可维护性、可测试性和可扩展性。在DataScope项目中，我们应该确保Domain模块不依赖其他模块，Facade模块不直接依赖Domain模块中的具体实现类，而是通过在Facade模块中重新定义相同的枚举和接口，然后在App模块中实现转换和协调。

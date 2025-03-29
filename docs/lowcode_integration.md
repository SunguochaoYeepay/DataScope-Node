# DataScope 低代码平台集成协议

## 概述

本文档描述了DataScope与低代码平台之间的集成协议，包括配置格式、接口规范和数据交换方式。

## 配置协议

### 查询表单配置

```json
{
  "formConfig": {
    "layout": "horizontal|vertical",
    "labelWidth": "number",
    "conditions": [
      {
        "field": "string",
        "label": "string",
        "component": "string",
        "componentProps": {
          "type": "string",
          "placeholder": "string",
          "options": [],
          "multiple": "boolean",
          "clearable": "boolean"
        },
        "required": "boolean",
        "visible": "boolean",
        "defaultValue": "any",
        "order": "number",
        "group": "string",
        "validation": {
          "type": "string",
          "message": "string",
          "pattern": "string"
        }
      }
    ],
    "groups": [
      {
        "name": "string",
        "label": "string",
        "expanded": "boolean",
        "order": "number"
      }
    ],
    "buttons": [
      {
        "type": "string",
        "label": "string",
        "action": "string",
        "order": "number"
      }
    ]
  }
}
```

### 结果显示配置

```json
{
  "displayConfig": {
    "type": "table|card|chart",
    "columns": [
      {
        "field": "string",
        "label": "string",
        "width": "number",
        "align": "left|center|right",
        "fixed": "none|left|right",
        "visible": "boolean",
        "sortable": "boolean",
        "searchable": "boolean",
        "component": "string",
        "componentProps": {},
        "formatter": "string",
        "mask": {
          "type": "string",
          "config": {}
        }
      }
    ],
    "pagination": {
      "enabled": "boolean",
      "position": "top|bottom|both",
      "pageSize": "number",
      "pageSizes": []
    },
    "selection": {
      "enabled": "boolean",
      "type": "single|multiple"
    },
    "operations": [
      {
        "type": "string",
        "label": "string",
        "action": "string",
        "icon": "string",
        "permission": "string"
      }
    ]
  }
}
```

### 图表配置

```json
{
  "chartConfig": {
    "type": "line|bar|pie",
    "title": "string",
    "xAxis": {
      "field": "string",
      "label": "string"
    },
    "yAxis": {
      "field": "string",
      "label": "string"
    },
    "series": [
      {
        "name": "string",
        "field": "string",
        "type": "string"
      }
    ],
    "legend": {
      "show": "boolean",
      "position": "string"
    }
  }
}
```

## 组件映射

### 数据类型与组件映射

| 数据类型     | 默认组件        | 可选组件                 |
|----------|-------------|----------------------|
| varchar  | Input       | Select, AutoComplete |
| int      | InputNumber | Slider, Select       |
| decimal  | InputNumber | -                    |
| datetime | DatePicker  | DateTimePicker       |
| date     | DatePicker  | -                    |
| time     | TimePicker  | -                    |
| boolean  | Switch      | Checkbox, Radio      |
| text     | TextArea    | RichText             |
| enum     | Select      | Radio, Checkbox      |

### 特殊组件配置

```json
{
  "DatePicker": {
    "format": "string",
    "showTime": "boolean",
    "range": "boolean"
  },
  "Select": {
    "mode": "string",
    "remote": "boolean",
    "api": "string"
  },
  "Upload": {
    "accept": "string",
    "maxSize": "number",
    "multiple": "boolean"
  }
}
```

## 事件处理

### 表单事件

```json
{
  "events": {
    "onSubmit": "function",
    "onChange": "function",
    "onReset": "function",
    "onValidate": "function"
  }
}
```

### 表格事件

```json
{
  "events": {
    "onSelect": "function",
    "onSort": "function",
    "onFilter": "function",
    "onPageChange": "function",
    "onOperation": "function"
  }
}
```

## 数据交换

### 查询参数格式

```json
{
  "conditions": {
    "field": "value"
  },
  "pagination": {
    "page": "number",
    "size": "number"
  },
  "sort": {
    "field": "asc|desc"
  }
}
```

### 查询结果格式

```json
{
  "total": "number",
  "pages": "number",
  "current": "number",
  "size": "number",
  "records": []
}
```

## 权限控制

### 操作权限配置

```json
{
  "permissions": {
    "view": "string",
    "export": "string",
    "delete": "string"
  }
}
```

### 数据权限配置

```json
{
  "dataPermissions": {
    "fields": ["string"],
    "conditions": {}
  }
}
```

## 集成示例

### 表单页面配置

```json
{
  "type": "form",
  "config": {
    "api": "/api/v1/queries/execute",
    "method": "POST",
    "formConfig": {},
    "displayConfig": {},
    "permissions": {}
  }
}
```

### 列表页面配置

```json
{
  "type": "list",
  "config": {
    "api": "/api/v1/queries/execute",
    "method": "POST",
    "formConfig": {},
    "displayConfig": {},
    "permissions": {}
  }
}
```

### 图表页面配置

```json
{
  "type": "chart",
  "config": {
    "api": "/api/v1/queries/execute",
    "method": "POST",
    "formConfig": {},
    "chartConfig": {},
    "permissions": {}
  }
}

/**
 * 配置转换工具
 * 
 * 此模块提供将集成编辑页面数据结构转换为标准化JSON格式的函数，
 * 以及将标准化JSON格式转换回集成编辑数据结构的函数。
 * 
 * 主要用于：
 * 1. 在保存查询/集成配置时，将编辑页面的数据结构转换为标准JSON格式
 * 2. 在加载查询/集成配置时，将标准JSON格式转换回编辑页面的数据结构
 */

/**
 * 将集成编辑配置转换为标准化JSON格式
 * @param {Object} integrationData - 集成编辑页面的数据对象
 * @returns {Object} - 标准化的JSON配置对象
 */
export function convertToStandardConfig(integrationData: any): any {
  console.log('[configConverter] 输入数据:', integrationData);
  
  // 提取原始数据
  const { 
    queryParams = [], 
    tableConfig = {}, 
    paramValues = {},
    chartTitle = '', 
    chartType = 'bar',
    chartDescription = '',
    chartHeight = 400,
    chartShowLegend = true,
    chartAnimation = true,
    chartXField = '',
    chartYField = ''
  } = integrationData;
  
  // 深拷贝避免修改原始数据
  const result: any = {
    meta: {
      database: integrationData.meta?.database || "",
      schema: integrationData.meta?.schema || "",
      table: integrationData.meta?.table || "",
      pageCode: integrationData.meta?.pageCode || "defaultPage"
    },
    filter: [],
    list: [],
    operation: {
      paginationEnable: true,
      totalEnable: true,
      downloadEnable: true,
      operationColumnFixed: "right",
      batchEnable: false,
      tableActions: [],
      rowActions: [],
      defaultPageSize: 10
    },
    chart: null
  };

  // 转换filter
  result.filter = queryParams.map((param: any) => {
    console.log('[configConverter] 处理queryParam:', param);
    
    // 根据param.formType映射到displayType
    const displayTypeMap: Record<string, string> = {
      'input': 'input',
      'textarea': 'textarea',
      'number': 'input-number',
      'password': 'input-password',
      'date': 'date-picker',
      'datetime': 'datetime-picker',
      'select': 'select',
      'multiselect': 'select',
      'checkbox': 'checkbox',
      'radio': 'radio'
    };

    // 映射字段类型
    const fieldTypeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'date': 'date'
    };

    // 创建基本结构
    const filterItem: any = {
      key: param.name,
      label: param.description || param.name,
      fieldType: fieldTypeMap[param.type] || 'string',
      dataFormat: param.format || 'string',
      displayType: displayTypeMap[param.formType] || 'input',
      config: {
        required: !!param.required
      }
    };

    // 设置默认值
    if (param.defaultValue !== undefined) {
      filterItem.defaultValue = param.defaultValue;
    }
    
    // 根据不同表单类型添加特定配置
    if (param.formType === 'select' || param.formType === 'multiselect') {
      if (param.options && Array.isArray(param.options) && param.options.length > 0) {
        filterItem.config.enumKey = param.name + 'Options';
      }
      
      if (param.formType === 'multiselect') {
        filterItem.config.isMultiValue = true;
      }
    }
    
    console.log('[configConverter] 生成的filter项:', filterItem);
    return filterItem;
  });

  // 转换list(表格列)
  if (tableConfig.columns && tableConfig.columns.length > 0) {
    result.list = tableConfig.columns.map((column: any, index: number) => {
      console.log('[configConverter] 处理表格列:', column);
      
      // 映射显示类型到columnType
      const columnTypeMap: Record<string, string> = {
        'TEXT': 'text',
        'NUMBER': 'text',
        'DATE': 'date',
        'TAG': 'tag',
        'STATUS': 'status',
        'SENSITIVE': 'sensitive',
        'LINK': 'link',
        'IMAGE': 'image',
        'BADGE': 'badge'
      };

      // 映射字段类型 
      const fieldTypeMap: Record<string, string> = {
        'TEXT': 'string',
        'NUMBER': 'number',
        'DATE': 'date',
        'DATETIME': 'string',
        'BOOLEAN': 'boolean'
      };

      // 确定数据格式
      let dataFormat = 'string';
      if (column.type === 'NUMBER') {
        dataFormat = 'int';
      } else if (column.type === 'DATE') {
        dataFormat = 'date';
      } else if (column.format) {
        dataFormat = column.format.toLowerCase();
      }

      const listItem: any = {
        isPrimaryKey: index === 0, // 假设第一列为主键
        key: column.field,
        label: column.label,
        fieldType: fieldTypeMap[column.type] || 'string',
        dataFormat: dataFormat,
        columnType: columnTypeMap[column.displayType] || 'text',
        config: {}
      };

      // 添加列配置
      if (column.width) listItem.config.width = column.width;
      if (column.align) listItem.config.align = column.align.toLowerCase();
      if (column.sortable) listItem.config.sortable = column.sortable;
      if (column.filterable) listItem.config.filterable = column.filterable;
      if (column.helpText) listItem.config.help = column.helpText;
      if (column.maskType) listItem.config.maskType = column.maskType;
      
      console.log('[configConverter] 生成的列项:', listItem);
      return listItem;
    });
  }

  // 转换operation(操作配置)
  if (tableConfig.pagination) {
    result.operation.paginationEnable = tableConfig.pagination.enabled !== false;
    if (tableConfig.pagination.pageSize) {
      result.operation.defaultPageSize = tableConfig.pagination.pageSize;
    }
  }
  
  if (tableConfig.export) {
    result.operation.downloadEnable = tableConfig.export.enabled !== false;
  }
  
  // 转换表格顶部操作按钮
  if (tableConfig.actions && tableConfig.actions.length > 0) {
    result.operation.tableActions = tableConfig.actions.map((action: any) => {
      const actionItem = {
        name: action.label,
        hybridEvent: action.handler || action.type,
        icon: action.icon,
        disabled: action.disabled || false
      };
      console.log('[configConverter] 生成的操作按钮:', actionItem);
      return actionItem;
    });
  }
  
  // 转换chart(图表配置)
  if (integrationData.type === 'CHART' && integrationData.chartConfig) {
    const chartConfig: any = {
      type: chartType,
      title: chartTitle,
      description: chartDescription,
      height: chartHeight,
      showLegend: chartShowLegend,
      animation: chartAnimation,
      xField: chartXField,
      yField: chartYField,
      config: {
        theme: integrationData.chartTheme || 'default',
      }
    };
    
    // 根据图表类型添加特定配置
    if (chartType === 'bar') {
      chartConfig.config.isStack = false;
      chartConfig.config.isGroup = false;
    } else if (chartType === 'pie') {
      chartConfig.nameField = integrationData.chartNameField || '';
      chartConfig.valueField = integrationData.chartValueField || '';
    }
    
    // 将chartConfig赋值给result.chart
    result.chart = chartConfig;
    console.log('[configConverter] 生成的图表配置:', result.chart);
  }
  
  console.log('[configConverter] 最终输出配置:', result);
  return result;
}

/**
 * 将标准配置转换回集成编辑格式(用于编辑已有配置)
 * @param {Object} standardConfig - 标准化的JSON配置
 * @returns {Object} - 适用于集成编辑页面的数据结构
 */
export function convertFromStandardConfig(standardConfig: any): any {
  const result: any = {
    meta: standardConfig.meta || {},
    queryParams: [],
    tableConfig: {
      columns: [],
      pagination: {
        enabled: true,
        pageSize: 10
      },
      export: {
        enabled: true,
        formats: ['CSV', 'EXCEL']
      },
      actions: [],
      rowActions: [],
      batchActions: []
    },
    paramValues: {},
    chartTitle: '',
    chartDescription: '',
    chartType: 'bar',
    chartTheme: 'default',
    chartHeight: 400,
    chartShowLegend: true,
    chartAnimation: true,
    chartXField: '',
    chartYField: '',
    chartNameField: '',
    chartValueField: ''
  };
  
  // 从标准配置转换filter到queryParams
  if (standardConfig.filter && Array.isArray(standardConfig.filter)) {
    const displayTypeMap: Record<string, string> = {
      'input': 'text',
      'textarea': 'textarea',
      'input-number': 'number',
      'input-password': 'password',
      'date-picker': 'date',
      'date-range-picker': 'date-range',
      'select': 'select'
    };
    
    const fieldTypeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'date': 'date'
    };
    
    result.queryParams = standardConfig.filter.map((item: any, index: number) => {
      const param: any = {
        name: item.key,
        type: fieldTypeMap[item.fieldType] || 'string',
        format: item.dataFormat || 'string',
        formType: displayTypeMap[item.displayType] || 'text',
        required: item.config?.required === true,
        description: item.label || item.key,
        displayOrder: index,
        isNewParam: false,
        label: item.label,
        placeholder: item.config?.placeholder
      };
      
      // 设置默认值
      if (item.defaultValue !== undefined) {
        param.defaultValue = item.defaultValue;
        result.paramValues[item.key] = item.defaultValue;
      }
      
      // 处理特定类型配置
      if (item.displayType === 'select') {
        param.multiSelect = item.config?.isMultiValue === true;
        param.searchable = item.config?.isSearchable === true;
        // 可能还需要处理options
      } else if (item.displayType === 'date-range-picker') {
        if (item.config?.maxDaysRange) param.maxDateSpan = parseInt(item.config.maxDaysRange);
        param.dateFormat = item.config?.dateFormat;
      } else if (item.displayType === 'input-number') {
        if (item.config?.min) param.minValue = parseInt(item.config.min);
        if (item.config?.max) param.maxValue = parseInt(item.config.max);
        if (item.config?.fixedPoint) param.precision = parseInt(item.config.fixedPoint);
      } else if (item.displayType === 'input' || item.displayType === 'textarea') {
        if (item.config?.minLength) param.minLength = parseInt(item.config.minLength);
        if (item.config?.maxLength) param.maxLength = parseInt(item.config.maxLength);
      }
      
      return param;
    });
  }
  
  // 转换list到tableConfig.columns
  if (standardConfig.list && Array.isArray(standardConfig.list)) {
    const fieldTypeMap: Record<string, string> = {
      'string': 'text',
      'number': 'number',
      'boolean': 'boolean',
      'date': 'date'
    };
    
    const columnTypeMap: Record<string, string> = {
      'text': 'text',
      'date': 'date',
      'boolean': 'boolean',
      'select': 'select',
      'image': 'image',
      'link': 'link',
      'button': 'button'
    };
    
    result.tableConfig.columns = standardConfig.list.map((item: any) => {
      const column: any = {
        field: item.key,
        title: item.label,
        dataType: fieldTypeMap[item.fieldType] || 'text',
        format: item.dataFormat,
        type: columnTypeMap[item.columnType] || 'text',
        isPrimary: item.isPrimaryKey === true,
        sortable: true,
        filterable: true,
        visible: true
      };
      
      // 处理列配置
      if (item.config) {
        if (item.config.width) column.width = parseInt(item.config.width);
        if (item.config.help) column.help = item.config.help;
        if (item.config.fixedPoint !== undefined) column.precision = parseInt(item.config.fixedPoint);
        if (item.config.showTooltip) column.tooltip = true;
        if (item.config.ellipsis) column.ellipsis = true;
      }
      
      return column;
    });
  }
  
  // 转换operation配置
  if (standardConfig.operation) {
    // 分页配置
    if (result.tableConfig.pagination) {
      result.tableConfig.pagination.enabled = standardConfig.operation.paginationEnable !== false;
      if (standardConfig.operation.defaultPageSize) {
        result.tableConfig.pagination.pageSize = standardConfig.operation.defaultPageSize;
      }
    }
    
    // 导出配置
    if (result.tableConfig.export) {
      result.tableConfig.export.enabled = standardConfig.operation.downloadEnable !== false;
    }
    
    // 表格操作按钮
    if (standardConfig.operation.tableActions && Array.isArray(standardConfig.operation.tableActions)) {
      result.tableConfig.actions = standardConfig.operation.tableActions.map((action: any) => ({
        label: action.name,
        action: action.hybridEvent,
        icon: action.icon,
        enabled: !action.disabled,
        type: 'header'
      }));
    }
    
    // 行操作按钮
    if (standardConfig.operation.rowActions && Array.isArray(standardConfig.operation.rowActions)) {
      result.tableConfig.rowActions = standardConfig.operation.rowActions.map((action: any) => ({
        label: action.name,
        action: action.hybridEvent,
        icon: action.icon,
        enabled: !action.disabled,
        type: 'row'
      }));
    }
    
    // 批量操作设置
    result.tableConfig.batchActions = standardConfig.operation.batchEnable ? [
      { 
        label: '批量导出', 
        action: 'exportSelected', 
        icon: 'download', 
        enabled: true 
      }
    ] : [];
  }
  
  // 转换chart配置
  if (standardConfig.chart) {
    result.chartType = standardConfig.chart.type || 'bar';
    result.chartTitle = standardConfig.chart.title || '';
    result.chartDescription = standardConfig.chart.description || '';
    result.chartHeight = standardConfig.chart.height || 400;
    result.chartShowLegend = standardConfig.chart.showLegend !== false;
    result.chartAnimation = standardConfig.chart.animation !== false;
    result.chartXField = standardConfig.chart.xField || '';
    result.chartYField = standardConfig.chart.yField || '';
    
    if (standardConfig.chart.config) {
      result.chartTheme = standardConfig.chart.config.theme || 'default';
    }
    
    if (standardConfig.chart.type === 'pie') {
      result.chartNameField = standardConfig.chart.nameField || '';
      result.chartValueField = standardConfig.chart.valueField || '';
    }
  }
  
  return result;
}
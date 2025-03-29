<!-- 完整版集成编辑页面 -->
<template>
  <div class="container mx-auto px-4 py-6 min-h-screen">
    <!-- 页面标题和操作按钮 -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900">{{ isCreateMode ? '创建集成' : '编辑集成' }}</h1>
      </div>
      <div class="flex items-center">
        <button
          v-if="!isCreateMode"
          type="button"
          class="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none"
          @click="previewIntegration"
        >
          <i class="fas fa-eye mr-1"></i> 预览
        </button>
        <button
          type="button"
          class="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          @click="cancelEdit"
        >
          取消
        </button>
        <button
          type="button"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          @click="saveIntegration"
        >
          保存
        </button>
      </div>
    </div>

    <!-- B. 表单内容 -->
    <div class="space-y-8 mb-10">
      <!-- 基本信息 -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-900">
          基本信息
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- 名称 -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                集成名称 <span class="text-red-500">*</span>
              </label>
              <input 
                id="name"
                v-model="integration.name"
                type="text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm force-border"
                placeholder="请输入集成名称"
              />
            </div>
            
            <!-- 状态 -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                状态
              </label>
              <select
                id="status"
                v-model="integration.status"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm force-border"
              >
                <option value="DRAFT">草稿</option>
                <option value="ACTIVE">已激活</option>
                <option value="INACTIVE">已禁用</option>
              </select>
            </div>
          </div>
          
          <!-- 查询数据源选择 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              选择查询数据源 <span class="text-red-500">*</span>
            </label>
            <QuerySelectorEnhanced
              v-model="integration.queryId"
              :show-preview="true"
              @update:modelValue="handleQueryChange"
            />
            <p v-if="!integration.queryId && showValidationErrors" class="mt-1 text-sm text-red-600">
              请选择查询数据源
            </p>
          </div>
          
          <!-- 集成类型选择 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">集成类型</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="type in integrationTypes"
                :key="type.value"
                class="relative rounded-lg border p-4 cursor-pointer hover:border-indigo-500 transition-all duration-200 ease-in-out"
                :class="[
                  integration.type === type.value
                    ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-300 hover:bg-gray-50'
                ]"
                @click="selectIntegrationType(type.value)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full" :class="getIntegrationTypeIconBg(type.value)">
                      <i :class="getIntegrationTypeIcon(type.value)" class="text-lg"></i>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-gray-900">
                        {{ type.label }}
                      </h3>
                      <p class="text-sm text-gray-500">{{ type.description }}</p>
                    </div>
                  </div>
                  <div v-if="integration.type === type.value" class="flex-shrink-0 flex items-center">
                    <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600">
                      <i class="fas fa-check text-sm"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 描述 -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <textarea
              id="description"
              v-model="integration.description"
              rows="3"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm force-border"
              placeholder="请输入集成描述"
            ></textarea>
            
            <!-- 已移除表单复杂度切换 -->
          </div>
        </div>
      </div>
      
      <!-- 数据条件配置 -->
      <div v-if="showConfigSections" class="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div class="px-4 py-5 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-900 flex justify-between items-center">
          <div>数据条件配置 {{ integration.queryId ? `(ID: ${integration.queryId})` : '' }}</div>
          <div v-if="integration.queryId" class="flex space-x-2">
            <button
              type="button"
              class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none"
              @click="loadParamsFromQuery"
              :disabled="!integration.queryId"
            >
              <i class="fas fa-sync-alt mr-1"></i>
            从数据源加载条件
            </button>
            
            <!-- 数据预览按钮已移除 -->
          </div>
        </div>
        <div class="p-6">
          <!-- 查询参数配置区域 -->
          <div class="mb-6">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 data-params-table">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">排序</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">字段</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">字段类型</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">中文名称</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数据格式</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">表单类型</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">默认值</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">必填</th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <draggable 
                    v-model="queryParams" 
                    tag="tbody"
                    handle=".drag-handle"
                    :animation="150"
                    item-key="name"
                    class="bg-white divide-y divide-gray-200"
                    @change="onParamDragChange"
                  >
                    <template #item="{element: param, index}">
                      <tr class="hover:bg-gray-50">
                        <!-- 拖拽手柄 -->
                        <td class="px-2 py-2 whitespace-nowrap">
                          <div class="drag-handle cursor-move text-gray-400 hover:text-gray-600 flex justify-center items-center w-full h-full">
                            <i class="fas fa-grip-vertical"></i>
                          </div>
                        </td>
                        
                        <!-- 字段 -->
                        <td class="px-4 py-2 whitespace-nowrap">
                          <input 
                            v-model="param.name" 
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md force-border"
                            placeholder="参数名称"
                            :disabled="!param.isNewParam"
                            :class="{'bg-gray-100': !param.isNewParam}"
                          />
                        </td>
                        
                        <!-- 字段类型 -->
                        <td class="px-4 py-2 whitespace-nowrap">
                          <select 
                            v-model="param.type" 
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            :disabled="!param.isNewParam"
                            :class="{'bg-gray-100': !param.isNewParam}"
                          >
                            <option value="string">字符串</option>
                            <option value="number">数字</option>
                            <option value="boolean">布尔值</option>
                            <option value="date">日期</option>
                          </select>
                        </td>
                        
                        <!-- 中文名称 -->
                        <td class="px-4 py-2 whitespace-nowrap">
                          <input 
                            v-model="param.description" 
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="参数描述"
                          />
                        </td>
                        
                        <!-- 数据格式 -->
                        <td class="px-4 py-2 whitespace-nowrap">
                          <select 
                            v-model="param.format" 
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="string">普通字符</option>
                            <option value="int">整数</option>
                            <option value="decimal">小数</option>
                            <option value="enum">枚举</option>
                            <option value="date">日期</option>
                            <option value="date-time">日期时间</option>
                            <option value="card">卡号</option>
                            <option value="mobile">手机号</option>
                            <option value="uri">URI</option>
                            <option value="email">邮箱</option>
                            <option value="json">JSON</option>
                            <option value="boolean">布尔值</option>
                          </select>
                        </td>
                        
                        <!-- 表单类型 -->
                        <td class="px-4 py-2 whitespace-nowrap">
                          <select 
                            v-model="param.formType" 
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="text">文本框</option>
                            <option value="textarea">多行文本</option>
                            <option value="number">数字输入框</option>
                            <option value="password">密码输入框</option>
                            <option value="date">日期选择器</option>
                            <option value="date-range">日期时间区间</option>
                            <option value="select">下拉选择</option>
                          </select>
                        </td>
                        
                        <!-- 参数值(原默认值列) -->
                        <td class="px-4 py-2 whitespace-nowrap">
                          <div v-if="param.type === 'date'">
                          <input 
                              type="date"
                              v-model="paramValues[param.name]" 
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              :class="{ 'border-red-300': validationErrors[param.name] }"
                            />
                          </div>
                          <!-- 枚举值特殊处理 -->
                          <div v-else-if="param.format === 'enum'" class="space-y-2">
                            <select 
                              v-model="paramValues[param.name]" 
                              class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              :class="{ 'border-red-300': validationErrors[param.name] }"
                            >
                              <option value="">请选择</option>
                              <option 
                                v-for="option in param.options || []" 
                                :key="option.value" 
                                :value="option.value"
                              >
                                {{ option.label }}
                              </option>
                            </select>
                          </div>
                          <input 
                            v-else-if="param.type !== 'boolean'"
                            v-model="paramValues[param.name]" 
                            :type="param.type === 'number' ? 'number' : 'text'"
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            :class="{ 'border-red-300': validationErrors[param.name] }"
                            :placeholder="param.description || `请输入值`"
                          />
                          <div v-else class="flex items-center">
                            <input
                              type="checkbox"
                              v-model="paramValues[param.name]"
                              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              :id="'param-value-' + param.name"
                            />
                            <label :for="'param-value-' + param.name" class="ml-2 text-sm text-gray-700">
                              {{ param.description || param.name }}
                            </label>
                          </div>
                          <!-- 验证错误提示 -->
                          <p v-if="validationErrors[param.name]" class="mt-1 text-sm text-red-600">
                            {{ validationErrors[param.name] }}
                          </p>
                        </td>
                        
                        <!-- 必填 -->
                        <td class="px-4 py-2 whitespace-nowrap text-center">
                          <input 
                            type="checkbox" 
                            v-model="param.required" 
                            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        
                        <!-- 操作 -->
                        <td class="px-4 py-2 whitespace-nowrap text-left text-sm font-medium">
                          <button 
                            @click="openAdvancedConfig(param, index)" 
                            class="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            <i class="fas fa-cog mr-1"></i>高级配置
                          </button>
                          <button 
                            @click="removeQueryParam(index)" 
                            class="text-red-600 hover:text-red-900"
                          >
                            <i class="fas fa-trash-alt mr-1"></i>删除
                          </button>
                        </td>
                      </tr>
                    </template>
                  </draggable>
                  <tfoot>
                    <tr>
                      <td colspan="9" class="px-4 py-3">
                        <button 
                          @click="addQueryParam" 
                          class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                        >
                          <i class="fas fa-plus mr-1"></i> 添加参数
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <!-- 已移除重复的参数值设置部分，直接在表格中编辑参数 -->
                    </div>
                    
          <!-- 数据预览功能已移除 -->
        </div>
      </div>

      <!-- 表格配置 -->
      <div v-if="showConfigSections && (integration.type === 'TABLE' || integration.type === 'SIMPLE_TABLE')" class="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div class="px-4 py-5 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-900">
          表格配置 <span class="text-xs text-gray-500 ml-1">(仅在表格类型下显示)</span>
        </div>
        <div class="p-6">
          <!-- 表格完整配置 -->
          <TableConfigTable
            v-model="tableConfig"
            :queryId="integration.queryId"
          />
        </div>
                      </div>
                      
      <!-- 图表配置 -->
      <div v-if="showConfigSections && integration.type === 'CHART'" class="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div class="px-4 py-5 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-900">
          图表配置 <span class="text-xs text-gray-500 ml-1">(仅在图表类型下显示)</span>
        </div>
        <div class="p-6">
          <!-- 图表类型选择 -->
          <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label for="chart_type" class="block text-sm font-medium text-gray-700 mb-1">图表类型</label>
              <select 
                id="chart_type" 
                v-model="chartType"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="bar">柱状图</option>
                <option value="line">折线图</option>
                <option value="pie">饼图</option>
                <option value="scatter">散点图</option>
              </select>
            </div>
            
            <div>
              <label for="chart_theme" class="block text-sm font-medium text-gray-700 mb-1">图表主题</label>
              <select 
                id="chart_theme" 
                v-model="chartTheme"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="default">默认主题</option>
                <option value="light">浅色主题</option>
                <option value="dark">深色主题</option>
              </select>
            </div>
            
            <div>
              <label for="chart_title" class="block text-sm font-medium text-gray-700 mb-1">图表标题</label>
                        <input
                id="chart_title" 
                v-model="chartTitle" 
                type="text"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="输入图表标题"
              />
                      </div>
                      
            <div>
              <label for="chart_description" class="block text-sm font-medium text-gray-700 mb-1">图表描述</label>
                        <input
                id="chart_description" 
                v-model="chartDescription" 
                type="text"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="输入图表描述"
                        />
                      </div>
                      
            <div>
              <label for="chart_height" class="block text-sm font-medium text-gray-700 mb-1">图表高度</label>
                        <input
                id="chart_height" 
                v-model="chartHeight" 
                type="number"
                min="200"
                step="50"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
            <div class="flex flex-col justify-center">
              <div class="flex items-center space-x-6">
                <label class="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="chartShowLegend" 
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">显示图例</span>
                </label>
                
                <label class="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="chartAnimation" 
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">启用动画</span>
                </label>
                    </div>
                  </div>
                </div>
          
          <!-- 字段映射配置 -->
          <div class="mb-6">
            <h3 class="text-md font-medium text-gray-900 mb-3">数据字段映射</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div v-if="chartType === 'bar' || chartType === 'line'">
                <label for="chart_x_field" class="block text-sm font-medium text-gray-700 mb-1">X轴字段</label>
                <select 
                  id="chart_x_field" 
                  v-model="chartXField"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">-- 请选择 --</option>
                  <option v-for="field in availableFields" :key="field" :value="field">{{ field }}</option>
                </select>
              </div>
              
              <div v-if="chartType === 'bar' || chartType === 'line' || chartType === 'scatter'">
                <label for="chart_y_field" class="block text-sm font-medium text-gray-700 mb-1">Y轴字段</label>
                <select 
                  id="chart_y_field" 
                  v-model="chartYField"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">-- 请选择 --</option>
                  <option v-for="field in availableFields" :key="field" :value="field">{{ field }}</option>
                </select>
            </div>
              
              <div v-if="chartType === 'pie'">
                <label for="chart_name_field" class="block text-sm font-medium text-gray-700 mb-1">名称字段</label>
                <select 
                  id="chart_name_field" 
                  v-model="chartNameField"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">-- 请选择 --</option>
                  <option v-for="field in availableFields" :key="field" :value="field">{{ field }}</option>
                </select>
          </div>

              <div v-if="chartType === 'pie'">
                <label for="chart_value_field" class="block text-sm font-medium text-gray-700 mb-1">数值字段</label>
                <select 
                  id="chart_value_field" 
                  v-model="chartValueField"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">-- 请选择 --</option>
                  <option v-for="field in availableFields" :key="field" :value="field">{{ field }}</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 图表预览 -->
          <div class="mt-8">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-md font-medium text-gray-900">图表预览</h3>
              <button
                type="button"
                class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none"
                @click="refreshChartPreview"
              >
                <i class="fas fa-sync-alt mr-1"></i>
                刷新预览
                        </button>
                      </div>
                      
            <!-- 使用 ChartPreview 组件 -->
            <ChartPreview 
              :queryId="integration.queryId"
                          :params="paramValues"
              :chartType="chartType"
              :title="chartTitle"
              :description="chartDescription"
              :height="chartHeight"
              :showLegend="chartShowLegend"
              :animation="chartAnimation"
              :xField="chartXField"
              :yField="chartYField"
              :valueField="chartValueField"
              :categoryField="chartNameField"
              :theme="chartTheme"
              v-if="integration.queryId"
            />
          
            <!-- 无查询ID时的提示 -->
            <div 
              v-else
              class="bg-white border rounded-md flex items-center justify-center"
              :style="{height: `${chartHeight}px`}"
            >
              <p class="text-gray-500">请先选择查询数据源</p>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>

  <!-- 参数高级配置对话框 -->
  <div v-if="showAdvancedConfigModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
      <!-- 对话框标题 -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">参数高级配置 - {{ currentParam?.name }}</h3>
        <button @click="closeAdvancedConfigModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
          <i class="fas fa-times"></i>
        </button>
            </div>
      
      <!-- 对话框内容 -->
      <div class="px-6 py-4 flex-grow overflow-y-auto">
        <div v-if="currentParam" class="space-y-4">
          <!-- 通用配置 -->
          <div class="mb-4 pb-4 border-b border-gray-200">
            <h4 class="text-md font-medium text-gray-900 mb-2">通用配置</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">标签文本</label>
                <input 
                  v-model="currentParam.label" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="前端显示的标签文本"
                />
          </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">参数提示文本</label>
                <input 
                  v-model="currentParam.placeholder" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="输入框内的提示文本"
                />
        </div>
      </div>
        </div>
                
          <!-- 下拉选择特有配置 -->
          <div v-if="currentParam.formType === 'select'" class="mb-4 pb-4 border-b border-gray-200">
            <h4 class="text-md font-medium text-gray-900 mb-2">下拉选择配置</h4>
              <div class="grid grid-cols-1 gap-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="searchable"
                  v-model="currentParam.searchable"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="searchable" class="ml-2 text-sm text-gray-700">支持搜索</label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="multiSelect"
                  v-model="currentParam.multiSelect"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="multiSelect" class="ml-2 text-sm text-gray-700">支持多选</label>
              </div>
                <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">选项列表</label>
                <div class="space-y-2">
                  <div v-for="(option, i) in currentParam.options || []" :key="i" class="flex items-center space-x-2">
                    <input
                      v-model="option.label"
                      placeholder="选项文本"
                      class="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                    <input
                      v-model="option.value"
                      placeholder="选项值"
                      class="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                  <button 
                      @click="removeOption(i)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <i class="fas fa-times"></i>
                            </button>
                  </div>
                  <button 
                    @click="addOption"
                    class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                  >
                    <i class="fas fa-plus mr-1"></i> 添加选项
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 文本输入特有配置 -->
          <div v-if="['text', 'textarea', 'password'].includes(currentParam.formType)" class="mb-4 pb-4 border-b border-gray-200">
            <h4 class="text-md font-medium text-gray-900 mb-2">文本输入配置</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">最小长度</label>
                <input 
                  v-model="currentParam.minLength" 
                  type="number"
                  min="0"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">最大长度</label>
                <input 
                  v-model="currentParam.maxLength" 
                  type="number"
                  min="0"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="allowMultiple"
                  v-model="currentParam.allowMultiple"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="allowMultiple" class="ml-2 text-sm text-gray-700">支持多选(以逗号分隔)</label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="fuzzyMatch"
                  v-model="currentParam.fuzzyMatch"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="fuzzyMatch" class="ml-2 text-sm text-gray-700">支持模糊匹配</label>
              </div>
        </div>
      </div>

          <!-- 数字相关输入配置 -->
          <div v-if="currentParam.formType === 'number'" class="mb-4 pb-4 border-b border-gray-200">
            <h4 class="text-md font-medium text-gray-900 mb-2">数值配置</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">最小值</label>
                <input 
                  v-model="currentParam.minValue" 
                  type="number"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
        </div>
                <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">最大值</label>
                <input 
                  v-model="currentParam.maxValue" 
                  type="number"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">步长</label>
                <input 
                  v-model="currentParam.step" 
                  type="number"
                  min="0.01"
                  step="0.01"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">小数位数</label>
                <input 
                  v-model="currentParam.precision" 
                  type="number"
                  min="0"
                  max="10"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          
          <!-- 日期类型特有配置 -->
          <div v-if="currentParam.formType === 'date' || currentParam.formType === 'date-range'" class="mb-4 pb-4 border-b border-gray-200">
            <h4 class="text-md font-medium text-gray-900 mb-2">日期时间配置</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">最大可选跨度(天)</label>
                <input 
                  v-model="currentParam.maxDateSpan" 
                  type="number"
                  min="0"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                  </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">日期格式</label>
                <select
                  v-model="currentParam.dateFormat"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD HH:mm">YYYY-MM-DD HH:mm</option>
                  <option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</option>
                </select>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="disablePastDates"
                  v-model="currentParam.disablePastDates"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="disablePastDates" class="ml-2 text-sm text-gray-700">禁用过去日期</label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="disableFutureDates"
                  v-model="currentParam.disableFutureDates"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="disableFutureDates" class="ml-2 text-sm text-gray-700">禁用未来日期</label>
                </div>
                
              <!-- 日期时间区间特有配置 -->
              <div v-if="currentParam.formType === 'date-range'" class="col-span-2">
                <div class="border-t border-gray-200 pt-4 mt-2">
                  <h5 class="text-sm font-medium text-gray-900 mb-3">区间特有设置</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">默认起始日期偏移(天)</label>
                      <input 
                        v-model="currentParam.defaultStartOffset" 
                        type="number"
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="-7 表示默认7天前"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">默认结束日期偏移(天)</label>
                      <input 
                        v-model="currentParam.defaultEndOffset" 
                        type="number"
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="0 表示今天"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">区间分隔符</label>
                      <input 
                        v-model="currentParam.rangeSeparator" 
                        type="text"
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="默认为 ~ "
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">快捷选项</label>
                      <select
                        v-model="currentParam.rangePresets"
                        multiple
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        size="4"
                      >
                        <option value="today">今天</option>
                        <option value="yesterday">昨天</option>
                        <option value="thisWeek">本周</option>
                        <option value="lastWeek">上周</option>
                        <option value="thisMonth">本月</option>
                        <option value="lastMonth">上月</option>
                        <option value="last7Days">最近7天</option>
                        <option value="last30Days">最近30天</option>
                        <option value="last90Days">最近90天</option>
                        <option value="thisYear">今年</option>
                        <option value="lastYear">去年</option>
                      </select>
                      <p class="text-xs text-gray-500 mt-1">按住Ctrl或Command键可多选</p>
                    </div>
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        id="showTime"
                        v-model="currentParam.showTime"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label for="showTime" class="ml-2 text-sm text-gray-700">显示时间选择器</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        id="autoSubmit"
                        v-model="currentParam.autoSubmit"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label for="autoSubmit" class="ml-2 text-sm text-gray-700">选择后自动提交</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 标签输入特有配置 -->
          <div v-if="currentParam.formType === 'tags'" class="mb-4 pb-4 border-b border-gray-200">
            <h4 class="text-md font-medium text-gray-900 mb-2">标签输入配置</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">最大标签数量</label>
                <input 
                  v-model="currentParam.maxTags" 
                  type="number"
                  min="1"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="allowCustomTags"
                  v-model="currentParam.allowCustomTags"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="allowCustomTags" class="ml-2 text-sm text-gray-700">允许自定义标签</label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="tagVerification"
                  v-model="currentParam.tagVerification"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="tagVerification" class="ml-2 text-sm text-gray-700">启用标签验证</label>
              </div>
            </div>
            <div class="mt-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">预定义标签</label>
              <div class="space-y-2">
                <div v-for="(tag, i) in currentParam.predefinedTags || []" :key="i" class="flex items-center space-x-2">
                  <input
                    v-model="tag.label"
                    placeholder="标签文本"
                    class="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                  />
                  <button 
                    @click="removeOption(i)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button
                  @click="addOption"
                  class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                >
                  <i class="fas fa-plus mr-1"></i> 添加预定义标签
                </button>
              </div>
            </div>
          </div>
          
          <!-- 文件上传特有配置 -->
          <div v-if="currentParam.formType === 'file'" class="mb-4 pb-4 border-b border-gray-200">
            <h4 class="text-md font-medium text-gray-900 mb-2">文件上传配置</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">允许的文件类型</label>
                <input 
                  v-model="currentParam.allowedFileTypes" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder=".jpg,.png,.pdf"
            />
          </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">最大文件大小(MB)</label>
                <input 
                  v-model="currentParam.maxFileSize" 
                  type="number"
                  min="0"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
        </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="multipleFiles"
                  v-model="currentParam.multipleFiles"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="multipleFiles" class="ml-2 text-sm text-gray-700">允许多文件上传</label>
              </div>
              <div v-if="currentParam.multipleFiles">
                <label class="block text-sm font-medium text-gray-700 mb-1">最大文件数量</label>
                <input 
                  v-model="currentParam.maxFiles" 
                  type="number"
                  min="1"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          
          <!-- 验证配置 -->
          <div class="mb-4 pb-4 border-b border-gray-200">
            <h4 class="text-md font-medium text-gray-900 mb-2">验证规则配置</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">自定义验证正则表达式</label>
                <input 
                  v-model="currentParam.validationRegex" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="正则表达式"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">验证错误提示</label>
                <input 
                  v-model="currentParam.validationMessage" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="验证失败时显示的提示"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 对话框底部按钮 -->
      <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button 
          @click="closeAdvancedConfigModal" 
          class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3 focus:outline-none"
        >
          取消
        </button>
        <button 
          @click="saveAdvancedConfig" 
          class="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIntegrationStore } from '@/stores/integration';
import { useMessageStore } from '@/stores/message';
import type { Integration, TableConfig } from '@/types/integration';
import QuerySelectorEnhanced from '@/components/integration/QuerySelectorEnhanced.vue';
import TableConfigTable from '@/components/integration/tablemode/TableConfigTable.vue';
import QueryPreview from '@/components/integration/QueryPreview.vue';
import draggable from 'vuedraggable';
import { transformFrontendIntegrationToApi } from '@/utils/apiTransformer';
import { ChartType, ChartTheme } from '@/types/integration';
import ChartPreview from '@/components/integration/chartmode/ChartPreview.vue';

const route = useRoute();
const router = useRouter();
const integrationStore = useIntegrationStore();
const messageStore = useMessageStore();

// 不再使用简化模式
const isSimpleMode = ref(false); // 始终为false以保持完整模式

// 是否为创建模式
const isCreateMode = computed(() => route.path.includes('/create'));

// 验证错误显示状态
const showValidationErrors = ref(false);

// 图表配置相关
const chartType = ref('bar');
const chartTheme = ref('default');

// 图表高级配置
const chartTitle = ref('');
const chartDescription = ref('');
const chartHeight = ref(400);
const chartShowLegend = ref(true);
const chartAnimation = ref(true);
const chartXField = ref('');
const chartYField = ref('');
const chartNameField = ref('');
const chartValueField = ref('');
const chartPreviewReady = ref(false);
const availableFields = ref<string[]>([]);

// 默认表格配置，避免undefined导致的类型错误
const defaultTableConfig = {
  columns: [],
  actions: [],
  pagination: {
    enabled: true,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100]
  },
  export: {
    enabled: true,
    formats: ['CSV', 'EXCEL'],
    maxRows: 1000
  },
  batchActions: [],
  aggregation: {
    enabled: false,
    groupByFields: [],
    aggregationFunctions: []
  },
  advancedFilters: {
    enabled: true,
    defaultFilters: [],
    savedFilters: []
  }
};

// 表格配置计算属性
const tableConfig = computed({
  get: () => integration.tableConfig || defaultTableConfig,
  set: (val) => {
    integration.tableConfig = val;
  }
});

// 计算属性
// 判断是否应该显示配置区域
const showConfigSections = computed(() => {
  return !!integration.queryId && !!integration.type;
});

const canPreviewChart = computed(() => {
  if (integration.type !== 'CHART') return false;
  
  // 基本字段映射检查
  if (chartType.value === 'pie') {
    return !!chartNameField.value && !!chartValueField.value;
  } else {
    return !!chartXField.value && !!chartYField.value;
  }
});

// 刷新图表预览
const refreshChartPreview = async () => {
  if (!canPreviewChart.value) {
    messageStore.warning('请完成图表数据字段映射配置');
    return;
  }
  
  try {
    // 这里应该调用API获取实际数据并渲染图表
    // 模拟加载过程
    chartPreviewReady.value = false;
    await new Promise(resolve => setTimeout(resolve, 800));
    chartPreviewReady.value = true;
    
    // 模拟图表渲染
    messageStore.success('图表预览已更新');
  } catch (error) {
    messageStore.error('图表预览加载失败');
  }
};

// 加载可用字段
const loadAvailableFields = async () => {
  if (!integration.queryId) return;
  
  try {
    // 这里应该调用API获取实际字段
    // 模拟加载过程
    availableFields.value = [
      'date', 'category', 'sales', 'profit', 'count', 'region', 
      'product', 'customer', 'amount', 'price', 'quantity'
    ];
  } catch (error) {
    messageStore.error('加载字段失败');
  }
};

// 集成类型选项
const integrationTypes = [
  {
    value: 'SIMPLE_TABLE' as const,
    label: '简单表格',
    description: '快速生成数据表格',
    icon: 'fas fa-table'
  },
  {
    value: 'TABLE' as const,
    label: '高级表格',
    description: '支持条件编辑、高级过滤和数据导出',
    icon: 'fas fa-list-alt'
  },
  {
    value: 'CHART' as const,
    label: '数据图表',
    description: '创建可视化图表，支持多种图表类型',
    icon: 'fas fa-chart-bar'
  }
];

// 集成信息
const integration = reactive({
  id: '',
  name: '',
  description: '',
  type: 'SIMPLE_TABLE' as const, // 默认选择表格类型
  status: 'DRAFT' as const,
  queryId: '',
  tableConfig: {
    columns: [],
    actions: [],
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100]
    },
    export: {
      enabled: true,
      formats: ['CSV', 'EXCEL'],
      maxRows: 1000
    },
    batchActions: [],
    aggregation: {
      enabled: false,
      groupByFields: [],
      aggregationFunctions: []
    },
    advancedFilters: {
      enabled: true, // 默认启用高级过滤
      defaultFilters: [],
      savedFilters: []
    }
  },
  integrationPoint: {
    id: '',
    name: '',
    type: 'URL' as const,
    urlConfig: {
      url: '',
      method: 'GET',
      headers: {}
    }
  },
  createTime: '',
  updateTime: ''
}) as unknown as Integration;

// 选择集成类型
const selectIntegrationType = (type: 'SIMPLE_TABLE' | 'TABLE' | 'CHART') => {
  integration.type = type;
};

// 获取集成类型图标
const getIntegrationTypeIcon = (type: string): string => {
  switch (type) {
    case 'SIMPLE_TABLE':
      return 'fas fa-table text-white';
    case 'TABLE':
      return 'fas fa-list-alt text-white';
    case 'CHART':
      return 'fas fa-chart-bar text-white';
    default:
      return 'fas fa-cog text-white';
  }
};

// 获取图标背景颜色
const getIntegrationTypeIconBg = (type: string): string => {
  switch (type) {
    case 'SIMPLE_TABLE':
      return 'bg-green-500';
    case 'TABLE':
      return 'bg-blue-500';
    case 'CHART':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

// 监听查询ID变化加载字段
watch(() => integration.queryId, (newValue) => {
  if (newValue) {
    // 如果是图表类型，则加载可用字段
    if (integration.type === 'CHART') {
      loadAvailableFields();
    }
  } else {
    availableFields.value = [];
  }
});

// 监听集成类型变化
watch(() => integration.type, (newValue) => {
  if (newValue === 'CHART') {
    loadAvailableFields();
  }
});

// 处理查询变更
const handleQueryChange = async (queryId: string) => {
  if (queryId) {
    integration.queryId = queryId;
    
    // 可选：自动加载参数，取消下面的注释即可实现自动加载
    // if (queryParams.value.length === 0) {
    //   loadParamsFromQuery();
    // }
  }
};

// 取消编辑
const cancelEdit = () => {
  if (confirm('确定要取消编辑吗？未保存的更改将会丢失。')) {
    router.push('/integration');
  }
};

// 保存集成
const saveIntegration = async () => {
  try {
    // 显示验证错误
    showValidationErrors.value = true;
    
    // 保存图表配置到集成对象
    if (integration.type === 'CHART') {
      integration.chartConfig = {
        type: chartType.value as ChartType,
        theme: chartTheme.value as ChartTheme,
        title: chartTitle.value,
        description: chartDescription.value,
        height: chartHeight.value,
        showLegend: chartShowLegend.value,
        animation: chartAnimation.value,
        dataMapping: {
          xField: chartXField.value,
          yField: chartYField.value,
          valueField: chartValueField.value,
          categoryField: chartNameField.value
        }
      };
    }

    // 验证表单
    let hasErrors = false;
    
    if (!integration.name) {
      messageStore.error('集成名称不能为空');
      hasErrors = true;
    }

    if (!integration.queryId) {
      messageStore.error('请选择查询数据源');
      hasErrors = true;
    }
    
    // 图表类型特定验证
    if (integration.type === 'CHART') {
      if (!chartTitle.value) {
        messageStore.error('请输入图表标题');
        hasErrors = true;
      }
      
      if (chartType.value === 'pie') {
        if (!chartNameField.value || !chartValueField.value) {
          messageStore.error('饷形图需要设置名称字段和数值字段');
          hasErrors = true;
        }
      } else {
        if (!chartXField.value || !chartYField.value) {
          messageStore.error('请设置 X 轴和 Y 轴字段');
          hasErrors = true;
        }
      }
    }
    
    // 如果有错误，停止保存
    if (hasErrors) {
      return;
    }

    // 保存集成
    messageStore.info('正在保存集成...');
    
    // 保存查询参数配置
    console.log('[DEBUG] 保存前的参数值:', paramValues.value);
    integration.queryParams = queryParams.value.map(param => {
      console.log('[DEBUG] 保存参数:', param.name, '值:', paramValues.value[param.name]);
      return {
        ...param,
        defaultValue: paramValues.value[param.name]
      };
    });
    console.log('[DEBUG] 参数配置已设置到集成对象:', integration.queryParams);
    
    if (isCreateMode.value) {
      const result = await integrationStore.createIntegration(integration);
      messageStore.success('集成创建成功');
      // 创建成功后跳转到编辑页
      if (result && result.id) {
        router.push(`/integration/edit/${result.id}`);
      } else {
        router.push('/integration');
      }
    } else {
      await integrationStore.updateIntegration(integration.id, integration);
      messageStore.success('集成更新成功');
      // 更新后跳转到集成列表页面
      router.push('/integration');
    }
  } catch (error) {
    console.error('保存集成失败', error);
    messageStore.error('保存失败，请检查输入并重试');
  }
};

// 生命周期钩子
onMounted(async () => {
  if (!isCreateMode.value && route.params.id) {
    try {
      const result = await integrationStore.fetchIntegrationById(route.params.id as string);
      if (result) {
        Object.assign(integration, result);
        
        // 如果有queryParams，初始化到本地的queryParams
        if (result.queryParams && result.queryParams.length > 0) {
          queryParams.value = result.queryParams.map((param: any) => ({
            ...param,
            isNewParam: false
          }));

          // 初始化参数值对象
          const initialValues: Record<string, any> = {};
          queryParams.value.forEach(param => {
            console.log('[DEBUG] 设置参数值:', param.name, '默认值:', param.defaultValue);
            initialValues[param.name] = param.defaultValue;
          });
          paramValues.value = initialValues;
          console.log('[DEBUG] 参数值初始化完成:', paramValues.value);
        }
        
        // 如果是图表类型，加载字段并设置图表配置
        if (integration.type === 'CHART' && (integration as any).chartConfig) {
          loadAvailableFields();
          
          // 从chartConfig加载配置到表单
          const config = (integration as any).chartConfig;
          chartType.value = config.type || 'bar';
          chartTheme.value = config.theme || 'default';
          chartTitle.value = config.title || '';
          chartDescription.value = config.description || '';
          chartHeight.value = config.height || 400;
          chartShowLegend.value = config.showLegend ?? true;
          chartAnimation.value = config.animation ?? true;
          
          if (config.dataMapping) {
            chartXField.value = config.dataMapping.xField || '';
            chartYField.value = config.dataMapping.yField || '';
            chartNameField.value = config.dataMapping.nameField || '';
            chartValueField.value = config.dataMapping.valueField || '';
          }
        }
      }
    } catch (error) {
      console.error('加载集成失败', error);
      messageStore.error('加载失败');
      router.push('/integration/list');
    }
  } else {
    // 创建模式不需要初始化参数值
    paramValues.value = {};
  }
});

// 在script部分添加以下代码
interface QueryParam {
  name: string;
  type: string;
  format: string;
  formType: string;
  required: boolean;
  defaultValue: any;
  description: string;
  displayOrder: number;
  // 高级配置字段
  label?: string;
  placeholder?: string;
  // 日期字段特有
  maxDateSpan?: number;
  dateFormat?: string;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  // 文本输入特有
  minLength?: number;
  maxLength?: number;
  allowMultiple?: boolean;
  fuzzyMatch?: boolean;
  // 下拉选择特有
  searchable?: boolean;
  multiSelect?: boolean;
  options?: Array<{label: string, value: string}>;
  // 数字字段特有
  minValue?: number;
  maxValue?: number;
  step?: number;
  precision?: number;
  // 标签输入特有
  maxTags?: number;
  allowCustomTags?: boolean;
  tagVerification?: boolean;
  predefinedTags?: Array<{label: string}>;
  // 文件上传特有
  allowedFileTypes?: string;
  maxFileSize?: number;
  multipleFiles?: boolean;
  maxFiles?: number;
  // 验证规则
  validationRegex?: string;
  validationMessage?: string;
  isNewParam?: boolean;
  // 日期时间区间特有
  defaultStartOffset?: number;
  defaultEndOffset?: number;
  rangeSeparator?: string;
  rangePresets?: string[];
  showTime?: boolean;
  autoSubmit?: boolean;
}

const showDataPreview = ref(false);
const paramValues = ref<Record<string, any>>({});
const validationErrors = ref<Record<string, string>>({});
const paramsValid = ref(true);

// 高级配置相关状态
const showAdvancedConfigModal = ref(false);
const currentParam = ref<QueryParam | null>(null);
const currentParamIndex = ref<number>(-1);
// 只使用空数组初始化参数
const queryParams = ref<QueryParam[]>([]);

// 添加查询参数
const addQueryParam = () => {
  const newParamName = `param${queryParams.value.length + 1}`;
  queryParams.value.push({
    name: newParamName,
    type: 'string',
    format: 'string',
    formType: 'text',
    required: false,
    defaultValue: '',
    description: '新字段',
    displayOrder: queryParams.value.length,
    isNewParam: true
  });
  
  // 立即设置参数值
  paramValues.value[newParamName] = '';
};

// 移除查询参数
const removeQueryParam = (index: number) => {
  const paramName = queryParams.value[index].name;
  queryParams.value.splice(index, 1);
  
  // 移除参数值
  const newValues = { ...paramValues.value };
  delete newValues[paramName];
  paramValues.value = newValues;
  
  // 更新参数顺序
  queryParams.value.forEach((param, idx) => {
    param.displayOrder = idx;
  });
};

// 处理参数拖拽排序
const onParamDragChange = () => {
  // 更新排序顺序
  queryParams.value.forEach((param, index) => {
    param.displayOrder = index;
  });
  messageStore.success('参数顺序已更新');
};

// 打开高级配置对话框
const openAdvancedConfig = (param: QueryParam, index: number) => {
  // 创建一个深拷贝，避免直接编辑原始对象
  const paramCopy = JSON.parse(JSON.stringify(param));
  
  // 设置默认值
  // 如果标签文本为空，默认使用中文名称
  if (!paramCopy.label) {
    paramCopy.label = paramCopy.description;
  }
  
  // 如果占位符为空，根据字段类型设置默认值
  if (!paramCopy.placeholder) {
    paramCopy.placeholder = `请输入${paramCopy.description}`;
  }
  
  // 初始化options属性，如果是选择类型但没有options
  if (paramCopy.formType === 'select' && !paramCopy.options) {
    paramCopy.options = [
      { label: '选项一', value: 'option1' },
      { label: '选项二', value: 'option2' }
    ];
  }
  
  // 初始化日期时间区间的默认值
  if (paramCopy.formType === 'date-range') {
    if (paramCopy.defaultStartOffset === undefined) {
      paramCopy.defaultStartOffset = -7; // 默认7天前
    }
    if (paramCopy.defaultEndOffset === undefined) {
      paramCopy.defaultEndOffset = 0; // 默认到今天
    }
    if (paramCopy.rangeSeparator === undefined) {
      paramCopy.rangeSeparator = '~';
    }
    if (paramCopy.rangePresets === undefined) {
      paramCopy.rangePresets = ['last7Days', 'thisMonth', 'lastMonth'];
    }
    if (paramCopy.showTime === undefined) {
      paramCopy.showTime = false;
    }
    if (paramCopy.autoSubmit === undefined) {
      paramCopy.autoSubmit = false;
    }
  }
  
  currentParam.value = paramCopy;
  currentParamIndex.value = index;
  showAdvancedConfigModal.value = true;
};

// 关闭高级配置对话框
const closeAdvancedConfigModal = () => {
  showAdvancedConfigModal.value = false;
  currentParam.value = null;
  currentParamIndex.value = -1;
};

// 添加选项（用于下拉框类型）
const addOption = () => {
  if (!currentParam.value) return;
  
  if (!currentParam.value.options) {
    currentParam.value.options = [];
  }
  
  currentParam.value.options.push({
    label: `选项${currentParam.value.options.length + 1}`,
    value: `option${currentParam.value.options.length + 1}`
  });
};

// 移除选项
const removeOption = (index: number) => {
  if (!currentParam.value || !currentParam.value.options) return;
  currentParam.value.options.splice(index, 1);
};

// 保存高级配置
const saveAdvancedConfig = () => {
  if (!currentParam.value || currentParamIndex.value < 0) return;
  
  // 将当前编辑的参数更新到参数数组中
  queryParams.value[currentParamIndex.value] = { ...currentParam.value };
  
  messageStore.success('参数高级配置已保存');
  closeAdvancedConfigModal();
};

// 验证参数
const validateParams = () => {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  queryParams.value.forEach(param => {
    const value = paramValues.value[param.name];
    if (param.required && (value === undefined || value === '')) {
      errors[param.name] = `${param.name} 是必填项`;
      isValid = false;
    }
    
    // 类型验证
    if (value !== undefined && value !== '') {
      switch (param.type) {
        case 'number':
          if (isNaN(Number(value))) {
            errors[param.name] = `${param.name} 必须是数字`;
            isValid = false;
          }
          break;
      }
    }
  });
  
  validationErrors.value = errors;
  paramsValid.value = isValid;
  return isValid;
};

// 处理参数验证状态变化
const handleParamsValidChange = (valid: boolean) => {
  paramsValid.value = valid;
};

// 添加 watch 监听参数值变化
watch(paramValues, () => {
  validateParams();
}, { deep: true });

// 从查询加载参数
const loadParamsFromQuery = async () => {
  if (!integration.queryId) {
    messageStore.error('请先选择数据查询');
    return;
  }
  
  try {
    // 模拟从服务器获取查询参数
    // 实际环境中应该调用API获取
    const mockQueryParameters = [
      {
        name: 'startDate',
        type: 'date',
        format: 'date',
        formType: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0],
        description: '查询开始日期',
        isNewParam: false
      },
      {
        name: 'endDate',
        type: 'date',
        format: 'date-time',
        formType: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0],
        description: '查询结束日期',
        isNewParam: false
      },
      {
        name: 'status',
        type: 'string',
        format: 'enum',
        formType: 'select',
        required: false,
        defaultValue: 'active',
        description: '记录状态',
        isNewParam: false
      },
      {
        name: 'minAmount',
        type: 'number',
        format: 'decimal',
        formType: 'text',
        required: false,
        defaultValue: 0,
        description: '最小金额',
        isNewParam: false
      }
    ];
    
    // 确认是否覆盖现有参数
    if (queryParams.value.length > 0) {
      if (!confirm('将覆盖现有的查询参数配置，确定要继续吗？')) {
        return;
      }
    }
    
    // 更新参数列表
    queryParams.value = mockQueryParameters.map((param, index) => ({
      ...param,
      displayOrder: index
    }));
    
    // 更新参数值
    const initialValues: Record<string, any> = {};
    queryParams.value.forEach(param => {
      // 设置枚举选项
      if (param.format === 'enum') {
        // 为status参数添加默认选项
        if (param.name === 'status') {
          param.options = [
            { label: '激活', value: 'active' },
            { label: '禁用', value: 'inactive' },
            { label: '挂起', value: 'pending' }
          ];
        }
        // 简单设置初始值，不再使用数组
      initialValues[param.name] = param.defaultValue;
      } else {
        initialValues[param.name] = param.defaultValue;
      }
    });
    paramValues.value = initialValues;
    
    // 重置验证状态
    validationErrors.value = {};
    paramsValid.value = true;
    
    messageStore.success('成功从查询加载参数配置');
  } catch (error) {
    console.error('加载查询参数失败', error);
    messageStore.error('加载查询参数失败');
  }
};

// 导出JSON功能
const exportJson = () => {
  try {
    // 首先使用API转换器转换集成数据
    const apiIntegration = transformFrontendIntegrationToApi({ 
      ...integration,
      queryParams: queryParams.value
    });
    
    // 创建一个包含当前配置的对象
    const exportData = {
      integration: apiIntegration,
      queryParams: apiIntegration.queryParams,
      paramValues: paramValues.value
    };
    
    // 转换为JSON字符串并美化格式
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // 创建Blob对象
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `integration-${integration.name || 'config'}-${new Date().toISOString().slice(0, 10)}.json`;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    messageStore.success('配置已成功导出为JSON文件');
  } catch (error) {
    console.error('导出JSON失败', error);
    messageStore.error('导出JSON失败');
  }
};

// 添加预定义标签
const addPredefinedTag = () => {
  if (!currentParam.value) return;
  
  if (!currentParam.value.predefinedTags) {
    currentParam.value.predefinedTags = [];
  }
  
  currentParam.value.predefinedTags.push({
    label: `标签${currentParam.value.predefinedTags.length + 1}`
  });
};

// 删除预定义标签
const removePredefinedTag = (index: number) => {
  if (!currentParam.value || !currentParam.value.predefinedTags) return;
  
  currentParam.value.predefinedTags.splice(index, 1);
};

// 预览集成
const previewIntegration = async () => {
  // 检查是否已经保存过（有ID）
  if (!integration.id) {
    const shouldSave = confirm('在预览前需要先保存集成。是否立即保存？');
    if (shouldSave) {
      // 尝试先保存集成
      try {
        // 显示验证错误
        showValidationErrors.value = true;
        
        // 保存图表配置到集成对象
        if (integration.type === 'CHART') {
          integration.chartConfig = {
            type: chartType.value as ChartType,
            theme: chartTheme.value as ChartTheme,
            title: chartTitle.value,
            description: chartDescription.value,
            height: chartHeight.value,
            showLegend: chartShowLegend.value,
            animation: chartAnimation.value,
            dataMapping: {
              xField: chartXField.value,
              yField: chartYField.value,
              valueField: chartValueField.value,
              categoryField: chartNameField.value
            }
          };
        }

        // 验证表单
        let hasErrors = false;
        
        if (!integration.name) {
          messageStore.error('集成名称不能为空');
          hasErrors = true;
        }

        if (!integration.queryId) {
          messageStore.error('请选择查询数据源');
          hasErrors = true;
        }
        
        // 如果有错误，停止保存
        if (hasErrors) {
          return;
        }

        // 保存集成
        messageStore.info('正在保存集成...');
        
        // 保存查询参数配置
        integration.queryParams = queryParams.value.map(param => ({
          ...param,
          defaultValue: paramValues.value[param.name]
        }));
        
        const result = await integrationStore.createIntegration(integration);
        if (result && result.id) {
          integration.id = result.id;
          messageStore.success('集成创建成功，即将预览');
          
          // 延迟一下确保ID更新
          setTimeout(() => {
            router.push(`/integration/preview/${result.id}`);
          }, 100);
          return;
        } else {
          messageStore.error('保存失败，无法预览');
          return;
        }
      } catch (error) {
        console.error('保存集成失败', error);
        messageStore.error('保存失败，请检查输入并重试');
        return;
      }
    } else {
      // 用户取消保存，不跳转
      return;
    }
  }
  
  // 组装预览URL并跳转
  if (integration.type) {
    console.log('正在跳转到预览页面，集成ID:', integration.id, '类型:', integration.type);
    router.push({
      path: `/integration/preview/${integration.id}`,
      query: { type: integration.type }
    });
  } else {
    let previewUrl = `/integration/preview/${integration.id}`;
    console.log('正在跳转到预览页面:', previewUrl, '集成ID:', integration.id);
    router.push(previewUrl);
  }
};
</script>

<style>
/* 自定义样式 */
.container {
  min-height: 100vh;
  height: auto !important;
}

/* 优化表单高度和可视性 */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.rounded-md {
  border-radius: 0.375rem;
}

.border-gray-300 {
  border-color: #d1d5db;
}

/* 修复表单高度问题 */
.block.w-full {
  min-height: 2.5rem;
}

/* 确保足够内容区域 */
.space-y-8 > * + * {
  margin-top: 2rem;
}

/* 确保表单元素有正确的边框 */
input, select, textarea {
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
}

/* 特别修复参数表格中的表单元素 */
.data-params-table input,
.data-params-table select {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  min-height: 38px;
}

/* 强制添加边框的重要边框 */
.force-border {
  border: 1px solid #d1d5db !important;
}
</style>
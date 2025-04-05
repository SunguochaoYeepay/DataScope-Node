<template>
  <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
    <!-- 标签页切换 -->
    <div class="border-b border-gray-200">
      <nav class="flex" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-3 font-medium text-sm border-b-2 focus:outline-none flex items-center"
          :class="[
            activeTab === tab.key
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <i :class="getTabIcon(tab.key)" class="mr-2"></i>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- 查询结果配置 -->
    <div v-if="activeTab === 'columns'" class="overflow-x-auto">
      <div class="px-4 py-2 flex justify-end">
        <button 
          @click="importFieldsFromData" 
          class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
        >
          <i class="fas fa-file-import mr-2"></i>从数据配置导入字段
        </button>
      </div>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">排序</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">字段</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">字段类型</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数据格式</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">中文名称</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">列格式</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">列宽</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <draggable 
          v-model="tableConfig.columns" 
          tag="tbody"
          handle=".drag-handle"
          :animation="150"
          item-key="field"
          class="bg-white divide-y divide-gray-200"
          @change="onDragChange"
        >
          <template #item="{element: column, index}">
            <tr class="hover:bg-gray-50">
              <!-- 拖拽手柄 -->
              <td class="px-2 py-2 whitespace-nowrap">
                <div class="drag-handle cursor-move text-gray-400 hover:text-gray-600 flex justify-center items-center w-full h-full">
                  <i class="fas fa-grip-vertical"></i>
                </div>
              </td>
              
              <!-- 字段 -->
              <td class="px-4 py-2 whitespace-nowrap">
                <div class="relative">
                  <div 
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md cursor-pointer border border-gray-300 field-selector"
                    @click.stop="toggleFieldDropdown(column, index)"
                    :class="{'bg-gray-100': !column.isNewColumn, 'cursor-not-allowed': !column.isNewColumn, 'cursor-pointer': column.isNewColumn}"
                  >
                    <div class="flex items-center p-2">
                      <span class="flex-1 truncate">{{ column.field || '请选择字段' }}</span>
                      <i v-if="column.isNewColumn" class="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                  
                  <div 
                    v-if="activeFieldDropdown === index && column.isNewColumn" 
                    class="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10"
                    @click.stop
                  >
                    <div class="p-2 border-b">
                <input 
                        v-model="fieldSearchText" 
                        class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 field-search-input" 
                        placeholder="搜索字段..."
                        @click.stop
                        ref="fieldSearchInput"
                      />
                    </div>
                    <div class="max-h-60 overflow-y-auto p-0">
                      <div 
                        v-for="field in filteredAvailableFields" 
                        :key="field" 
                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        @click.stop="selectField(column, field)"
                      >
                        {{ field }}
                      </div>
                      <div 
                        v-if="filteredAvailableFields.length === 0" 
                        class="px-3 py-2 text-gray-500 text-sm"
                      >
                        无匹配字段
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              
              <!-- 字段类型 -->
              <td class="px-4 py-2 whitespace-nowrap">
                <select 
                  v-model="column.type" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  :disabled="!column.isNewColumn"
                  :class="{'bg-gray-100': !column.isNewColumn}"
                >
                  <option value="string">字符串</option>
                  <option value="integer">整数</option>
                  <option value="number">小数</option>
                  <option value="date">日期</option>
                  <option value="boolean">布尔值</option>
                </select>
              </td>
              
              <!-- 数据格式 -->
              <td class="px-4 py-2 whitespace-nowrap">
                <select 
                  v-model="column.format"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="string">字符串</option>
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
              
              <!-- 中文名称 -->
              <td class="px-4 py-2 whitespace-nowrap">
                <input 
                  v-model="column.label" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="显示名称"
                />
              </td>
              
              <!-- 列格式 -->
              <td class="px-4 py-2 whitespace-nowrap">
                <select 
                  v-model="column.align" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option :value="columnAlign.LEFT">左对齐</option>
                  <option :value="columnAlign.CENTER">居中</option>
                  <option :value="columnAlign.RIGHT">右对齐</option>
                </select>
              </td>
              
              <!-- 列宽 -->
              <td class="px-4 py-2 whitespace-nowrap">
                <input 
                  v-model="column.width" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="列宽"
                />
              </td>
              
              <!-- 操作 -->
              <td class="px-4 py-2 whitespace-nowrap text-left text-sm font-medium">
                <button 
                  @click="removeColumn(index)" 
                  class="text-red-600 hover:text-red-900 mr-2"
                >
                  <i class="fas fa-trash-alt mr-1"></i>删除
                </button>
                <button 
                  @click="editColumn(column)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  <i class="fas fa-cog mr-1"></i>更多
                </button>
              </td>
            </tr>
          </template>
        </draggable>
        <tfoot>
          <tr>
            <td colspan="9" class="px-4 py-3">
              <button 
                v-if="showAddColumnButton"
                @click="addColumn" 
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
              >
                <i class="fas fa-plus mr-1"></i> 添加列配置
              </button>
              <span v-else class="text-sm text-gray-500">已导入所有可用字段，无法添加更多列</span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- 页面操作配置 -->
    <div v-if="activeTab === 'actions'" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作名称</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作事件</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">需二次确认</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">显示条件</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">启用条件</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(action, index) in tableConfig.actions" :key="index" class="hover:bg-gray-50">
            <!-- 操作名称 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <input 
                v-model="action.label" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="操作名称"
              />
            </td>
            
            <!-- 操作事件 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <input 
                v-model="action.handler" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="处理函数名"
              />
            </td>
            
            <!-- 需二次确认 -->
            <td class="px-4 py-2 whitespace-nowrap text-left">
              <input 
                type="checkbox" 
                v-model="action.confirm" 
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </td>
            
            <!-- 显示条件 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <select 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="always">始终显示</option>
                <option value="expression">条件表达式</option>
                <option value="permission">权限控制</option>
              </select>
            </td>
            
            <!-- 启用条件 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <select 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="always">始终启用</option>
                <option value="expression">条件表达式</option>
              </select>
            </td>
            
            <!-- 操作 -->
            <td class="px-4 py-2 whitespace-nowrap text-left text-sm font-medium">
              <button 
                @click="removeAction(index)" 
                class="text-red-600 hover:text-red-900 mr-2"
              >
                <i class="fas fa-trash-alt mr-1"></i>删除
              </button>
              <button 
                @click="editAction(action)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                <i class="fas fa-cog mr-1"></i>更多
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="6" class="px-4 py-3">
              <button 
                @click="addAction" 
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
              >
                <i class="fas fa-plus mr-1"></i> 添加操作按钮
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <!-- 批量操作配置 -->
    <div v-if="activeTab === 'batch-actions'" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作名称</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">处理函数</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">二次确认</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(action, index) in tableConfig.batchActions" :key="index" class="hover:bg-gray-50">
            <!-- 操作名称 -->
            <td class="px-4 py-2 whitespace-nowrap">
          <input 
                v-model="action.label" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="操作名称"
              />
            </td>
            
            <!-- 处理函数 -->
            <td class="px-4 py-2 whitespace-nowrap">
            <input 
                v-model="action.handler" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="处理函数名"
              />
            </td>
            
            <!-- 二次确认 -->
            <td class="px-4 py-2 whitespace-nowrap text-left">
              <input 
                type="checkbox" 
                v-model="action.confirmationRequired"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </td>
            
            <!-- 操作 -->
            <td class="px-4 py-2 whitespace-nowrap text-left text-sm font-medium">
            <button 
                @click="removeBatchAction(index)" 
                class="text-red-600 hover:text-red-900"
            >
                <i class="fas fa-trash-alt mr-1"></i>删除
            </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="px-4 py-3">
          <button 
                @click="addBatchAction"
            class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
          >
                <i class="fas fa-plus mr-1"></i> 添加批量操作
          </button>
            </td>
          </tr>
        </tfoot>
      </table>
        </div>
        
    <!-- 表格特性配置 -->
    <div v-if="activeTab === 'features'" class="p-6">
      <div class="space-y-6">
        <!-- 分页配置 -->
        <div>
            <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-medium text-gray-900"><i class="fas fa-pager mr-2 text-indigo-500"></i>分页设置</h3>
              <div class="flex items-center">
              <span class="mr-2 text-sm text-gray-500">启用分页</span>
              <button 
                type="button"
                :class="[tableConfig.pagination.enabled ? 'bg-indigo-600' : 'bg-gray-200']"
                class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
                @click="tableConfig.pagination.enabled = !tableConfig.pagination.enabled"
              >
                <span 
                  :class="[tableConfig.pagination.enabled ? 'translate-x-5' : 'translate-x-0']"
                  class="inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                ></span>
              </button>
            </div>
          </div>
          
          <div v-if="tableConfig.pagination.enabled" class="bg-gray-50 p-4 rounded-md">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 默认每页条数 -->
              <div>
                <label for="page-size" class="block text-sm font-medium text-gray-700 mb-1">默认每页条数</label>
                <input 
                  id="page-size"
                  v-model.number="tableConfig.pagination.pageSize" 
                  type="number" 
                  min="1"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <!-- 可选每页条数 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">可选每页条数</label>
                <div class="flex flex-wrap gap-2">
                  <div v-for="(size, index) in tableConfig.pagination.pageSizeOptions" :key="index" class="flex items-center">
                  <input 
                      v-model.number="tableConfig.pagination.pageSizeOptions[index]" 
                      type="number" 
                      min="1"
                      class="w-16 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md mr-1"
                    />
              <button 
                      @click="removePaginationOption(index)" 
                class="text-red-600 hover:text-red-900"
              >
                      <i class="fas fa-times"></i>
              </button>
            </div>
                  <button 
                    @click="addPaginationOption" 
                    class="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <i class="fas fa-plus mr-1"></i> 添加
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 数据导出配置 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-medium text-gray-900"><i class="fas fa-file-export mr-2 text-indigo-500"></i>数据导出</h3>
            <div class="flex items-center">
              <span class="mr-2 text-sm text-gray-500">启用导出</span>
              <button 
                type="button"
                :class="[tableConfig.export.enabled ? 'bg-indigo-600' : 'bg-gray-200']"
                class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
                @click="tableConfig.export.enabled = !tableConfig.export.enabled"
              >
                <span 
                  :class="[tableConfig.export.enabled ? 'translate-x-5' : 'translate-x-0']"
                  class="inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                ></span>
              </button>
            </div>
          </div>
          
          <div v-if="tableConfig.export.enabled" class="bg-gray-50 p-4 rounded-md">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 导出格式 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">导出格式</label>
                <div class="space-y-2">
                  <div class="flex items-center">
              <input 
                      id="export-csv" 
                      type="checkbox" 
                      :checked="tableConfig.export.formats.includes('CSV')"
                      @change="toggleExportFormat('CSV')"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label for="export-csv" class="ml-2 block text-sm text-gray-900">CSV</label>
                  </div>
                  <div class="flex items-center">
                    <input 
                      id="export-excel" 
                      type="checkbox" 
                      :checked="tableConfig.export.formats.includes('EXCEL')"
                      @change="toggleExportFormat('EXCEL')"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label for="export-excel" class="ml-2 block text-sm text-gray-900">Excel</label>
                  </div>
                  <div class="flex items-center">
                    <input 
                      id="export-json" 
                      type="checkbox" 
                      :checked="tableConfig.export.formats.includes('JSON')"
                      @change="toggleExportFormat('JSON')"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label for="export-json" class="ml-2 block text-sm text-gray-900">JSON</label>
                  </div>
                </div>
              </div>
              
              <!-- 最大导出行数 -->
              <div>
                <label for="max-rows" class="block text-sm font-medium text-gray-700 mb-1">最大导出行数</label>
                <input 
                  id="max-rows"
                  v-model.number="tableConfig.export.maxRows" 
                  type="number" 
                  min="1"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 其他功能配置 -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2"><i class="fas fa-sliders-h mr-2 text-indigo-500"></i>其他功能</h3>
          <div class="bg-gray-50 p-4 rounded-md">
            <div class="space-y-3">
              <!-- 行选择 -->
              <div class="flex items-center">
                <input 
                  id="row-selection" 
                  type="checkbox" 
                  v-model="enableRowSelection"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label for="row-selection" class="ml-2 block text-sm text-gray-900">行选择功能</label>
              </div>
              
              <!-- 列排序 -->
              <div class="flex items-center">
                <input 
                  id="column-sorting" 
                  type="checkbox" 
                  v-model="enableSorting"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label for="column-sorting" class="ml-2 block text-sm text-gray-900">列排序功能</label>
              </div>
              
              <!-- 列过滤 -->
              <div class="flex items-center">
                <input 
                  id="column-filtering" 
                  type="checkbox" 
                  v-model="enableFiltering"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label for="column-filtering" class="ml-2 block text-sm text-gray-900">列过滤功能</label>
              </div>
              
              <!-- 列拖拽排序 -->
              <div class="flex items-center">
                <input 
                  id="column-drag" 
                  type="checkbox" 
                  v-model="enableColumnDrag"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label for="column-drag" class="ml-2 block text-sm text-gray-900">列拖拽排序</label>
              </div>
              
              <!-- 列显示控制 -->
              <div class="flex items-center">
                <input 
                  id="column-visibility" 
                  type="checkbox" 
                  v-model="enableColumnVisibility"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label for="column-visibility" class="ml-2 block text-sm text-gray-900">列显示控制</label>
              </div>
              
              <!-- 行展开详情 -->
              <div class="flex items-center">
                <input 
                  id="expandable-rows" 
                  type="checkbox" 
                  v-model="enableExpandableRows"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label for="expandable-rows" class="ml-2 block text-sm text-gray-900">行展开详情</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 列编辑弹窗 -->
    <div v-if="showColumnEditModal && editingColumn" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <!-- 弹窗标题 -->
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">编辑列配置</h3>
          <button @click="closeColumnEditModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
            <i class="fas fa-times"></i>
              </button>
            </div>
            
        <!-- 弹窗内容 -->
        <div class="px-6 py-4 flex-grow overflow-y-auto">
          <div class="space-y-4">
            <!-- 基本信息区域 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 pb-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">字段名</label>
                <input 
                  v-model="editingColumn.field" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                  placeholder="字段名称"
                  disabled
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">显示名称</label>
                <input 
                  v-model="editingColumn.label" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                  placeholder="列显示名称"
                />
              </div>
            </div>
            
            <!-- 字段说明/帮助 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">列帮助说明</label>
              <textarea 
                v-model="editingColumn.helpText" 
                rows="3"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                placeholder="输入对该列的说明文字，将在表格中显示为提示信息"
              ></textarea>
            </div>
            
            <!-- 高级配置区域 -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-md font-medium text-gray-900 mb-3">高级配置</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 可见性 -->
                <div class="flex items-center">
                  <input 
                    id="column-visible" 
                    type="checkbox" 
                    v-model="editingColumn.visible"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label for="column-visible" class="ml-2 block text-sm text-gray-900">显示该列</label>
                </div>
                
                <!-- 可排序 -->
                <div class="flex items-center">
                  <input 
                    id="column-sortable" 
                    type="checkbox" 
                    v-model="editingColumn.sortable"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label for="column-sortable" class="ml-2 block text-sm text-gray-900">允许排序</label>
                </div>
                
                <!-- 可过滤 -->
                <div class="flex items-center">
                  <input 
                    id="column-filterable" 
                    type="checkbox" 
                    v-model="editingColumn.filterable"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label for="column-filterable" class="ml-2 block text-sm text-gray-900">允许筛选</label>
                </div>
                
                <!-- 显示顺序 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">显示顺序</label>
                  <input 
                    v-model.number="editingColumn.displayOrder" 
                    type="number" 
                    min="0"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 弹窗底部按钮 -->
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button 
            @click="closeColumnEditModal" 
            class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3 focus:outline-none"
            >
            取消
            </button>
          <button 
            @click="saveColumnEdit" 
            class="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import { useMessageStore } from '@/stores/message';
import draggable from 'vuedraggable';
import { ColumnDisplayType, ColumnAlign, ChartType, ChartTheme } from '@/types/integration';
import type { TableColumn, TableConfig, TableAction, BatchAction, QueryResult, QueryResultColumn } from '@/types/integration';

interface Props {
  modelValue: TableConfig;
  queryId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  queryId: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: TableConfig): void;
}>();

const messageStore = useMessageStore();

const queryResult = ref<QueryResult | null>(null);

// 表格配置，使用计算属性处理
const tableConfig = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// 确保组件挂载时检查配置并初始化默认值
onMounted(() => {
  console.log('[DEBUG] TableConfigTable 组件挂载，当前配置:', props.modelValue);
  
  // 如果modelValue为undefined或没有必要的子对象，初始化它们
  if (!props.modelValue || !props.modelValue.columns) {
    console.log('[DEBUG] 初始化默认表格配置');
    tableConfig.value = {
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
  }
  
  // 确保列数据中每一列都有正确的isNewColumn标记
  if (tableConfig.value.columns && tableConfig.value.columns.length > 0) {
    console.log('[DEBUG] 标记现有列为非新增列');
    tableConfig.value.columns = tableConfig.value.columns.map(column => ({
      ...column,
      isNewColumn: false
    }));
  }
});

// 监听queryId变化
watch(() => props.queryId, (newId) => {
  console.log('[DEBUG] queryId 变化:', newId);
  if (newId) {
    // 可以在这里添加逻辑，当queryId变化时更新可用字段
    loadAvailableFields();
  }
});

// 定义加载可用字段的函数
const loadAvailableFields = async () => {
  if (!props.queryId) return;
  
  try {
    // 这里添加实际加载字段的逻辑
    console.log('[DEBUG] 加载字段，查询ID:', props.queryId);
    // 暂时使用现有的可用字段列表
  } catch (error) {
    console.error('加载可用字段失败:', error);
    messageStore.error('加载字段失败');
  }
};

// 内部状态
const activeTab = ref('columns');
const enableRowSelection = ref(false);
const enableSorting = ref(false);
const enableFiltering = ref(false);
const enableColumnDrag = ref(false);
const enableColumnVisibility = ref(false);
const enableExpandableRows = ref(false);
const availableFields = ref<string[]>([]);
const activeFieldDropdown = ref<number>(-1);
const fieldSearchText = ref('');
const fieldSearchInput = ref<HTMLInputElement | null>(null);
const showColumnEditModal = ref(false);
const editingColumn = ref<TableColumn>({
  field: '',
  label: '',
  type: 'string',
  displayType: ColumnDisplayType.TEXT,
  width: '100',
  align: ColumnAlign.LEFT,
  visible: true,
  sortable: false,
  filterable: false,
  helpText: '',
  displayOrder: 0
});

// 标签页定义
const tabs = [
  { key: 'columns', label: '列配置' },
  { key: 'actions', label: '行操作' },
  { key: 'batch-actions', label: '批量操作' },
  { key: 'features', label: '功能特性' }
];

// 列对齐方式常量
const columnAlign = {
  LEFT: ColumnAlign.LEFT,
  CENTER: ColumnAlign.CENTER,
  RIGHT: ColumnAlign.RIGHT
};

// 获取默认显示类型
const getDefaultDisplayType = (type: string): ColumnDisplayType => {
  switch (type.toLowerCase()) {
    case 'date':
    case 'datetime':
      return ColumnDisplayType.DATE;
    case 'number':
    case 'integer':
    case 'decimal':
      return ColumnDisplayType.NUMBER;
    case 'boolean':
      return ColumnDisplayType.TAG;
    case 'url':
    case 'link':
      return ColumnDisplayType.LINK;
    case 'image':
      return ColumnDisplayType.IMAGE;
    case 'status':
    case 'state':
      return ColumnDisplayType.STATUS;
    case 'sensitive':
    case 'password':
      return ColumnDisplayType.SENSITIVE;
    default:
      return ColumnDisplayType.TEXT;
  }
};

// 字段下拉框相关方法
const openFieldDropdown = (index: number) => {
  activeFieldDropdown.value = index;
  nextTick(() => {
    if (fieldSearchInput.value) {
      fieldSearchInput.value.focus();
    }
  });
};

const closeFieldDropdown = () => {
  activeFieldDropdown.value = -1;
  fieldSearchText.value = '';
};

const toggleFieldDropdown = (column: TableColumn, index: number) => {
  if (!column.isNewColumn) {
    return;
  }
  
  if (availableFields.value.length === 0) {
    loadFieldOptions();
  }
  
  if (activeFieldDropdown.value === index) {
    closeFieldDropdown();
  } else {
    openFieldDropdown(index);
  }
};

// 列表相关方法
const sortColumns = (columns: TableColumn[]) => {
  return [...columns].sort((c1, c2) => c1.displayOrder - c2.displayOrder);
};

const visibleColumns = computed(() => {
  return sortColumns(tableConfig.value.columns.filter(c => c.visible));
});

const hiddenColumns = computed(() => {
  return sortColumns(tableConfig.value.columns.filter(col => !col.visible));
});

// 字段选择相关方法
const selectField = (column: TableColumn, field: string) => {
  column.field = field;
  column.label = field;
  column.displayType = getDefaultDisplayType(column.type);
  closeFieldDropdown();
};

// 添加列
const addColumn = () => {
  const newColumn: TableColumn = {
    field: '',
    label: '',
    type: 'string',
    displayType: ColumnDisplayType.TEXT,
    width: '100',
    align: ColumnAlign.LEFT,
    visible: true,
    displayOrder: tableConfig.value.columns.length,
    isNewColumn: true
  };
  tableConfig.value.columns.push(newColumn);
};

// 移除列
const removeColumn = (index: number) => {
  tableConfig.value.columns.splice(index, 1);
};

// 添加操作按钮
const addAction = () => {
  tableConfig.value.actions.push({
    type: 'button',
    label: '新操作',
    handler: '',
    icon: 'fas fa-cog'
  });
};

// 移除操作按钮
const removeAction = (index: number) => {
  tableConfig.value.actions.splice(index, 1);
};

// 添加分页选项
const addPaginationOption = () => {
  const lastOption = tableConfig.value.pagination.pageSizeOptions[tableConfig.value.pagination.pageSizeOptions.length - 1] || 10;
  tableConfig.value.pagination.pageSizeOptions.push(lastOption * 2);
};

// 移除分页选项
const removePaginationOption = (index: number) => {
  tableConfig.value.pagination.pageSizeOptions.splice(index, 1);
};

// 添加批量操作
const addBatchAction = () => {
  if (!tableConfig.value.batchActions) {
    tableConfig.value.batchActions = [];
  }
  tableConfig.value.batchActions.push({
    id: `batch_action_${new Date().getTime()}`,
    label: '新批量操作',
    handler: 'handleBatchAction',
    confirmationRequired: false,
    confirmationMessage: ''
  });
};

// 删除批量操作
const removeBatchAction = (index: number) => {
  tableConfig.value.batchActions.splice(index, 1);
};

// 切换导出格式
const toggleExportFormat = (format: string) => {
  const index = tableConfig.value.export.formats.indexOf(format);
  if (index === -1) {
    tableConfig.value.export.formats.push(format);
  } else {
    tableConfig.value.export.formats.splice(index, 1);
  }
};

// 获取标签页图标
const getTabIcon = (tabKey: string): string => {
  switch (tabKey) {
    case 'columns':
      return 'fas fa-columns text-indigo-500';
    case 'actions':
      return 'fas fa-mouse-pointer text-indigo-500';
    case 'batch-actions':
      return 'fas fa-tasks text-indigo-500';
    case 'features':
      return 'fas fa-cog text-indigo-500';
    default:
      return 'fas fa-table text-indigo-500';
  }
};

// 编辑列
const editColumn = (column: TableColumn) => {
  // 创建一个深拷贝，防止直接修改原始对象
  editingColumn.value = JSON.parse(JSON.stringify(column));
  showColumnEditModal.value = true;
};

// 关闭编辑弹窗
const closeColumnEditModal = () => {
  showColumnEditModal.value = false;
};

// 保存列编辑
const saveColumnEdit = () => {
  // 找到对应的列并更新
  const index = tableConfig.value.columns.findIndex(c => c.field === editingColumn.value.field);
  if (index !== -1) {
    // 将编辑后的列应用回表格配置
    tableConfig.value.columns[index] = { ...editingColumn.value };
  }
  closeColumnEditModal();
};

// 编辑操作按钮
const editAction = (action: TableAction) => {
  // 打开编辑操作按钮对话框
  alert(`即将编辑操作按钮: ${action.label}`);
};

// 过滤可用字段
const filteredAvailableFields = computed(() => {
  if (!fieldSearchText.value) return availableFields.value;
  
  const searchTerm = fieldSearchText.value.toLowerCase();
  return availableFields.value.filter(field => 
    field.toLowerCase().includes(searchTerm)
  );
});

// 获取所有数据字段
const dataFields = computed(() => {
  return availableFields.value;
});

// 判断是否显示添加按钮
const showAddColumnButton = computed(() => {
  // 如果没有导入过字段，显示添加按钮
  if (availableFields.value.length === 0) return true;
  
  // 获取当前已使用的字段
  const usedFields = new Set(tableConfig.value.columns.map(col => col.field));
  // 检查是否还有未使用的字段
  const hasUnusedFields = availableFields.value.some(field => !usedFields.has(field));
  
  return hasUnusedFields;
});

// 从数据配置导入字段
const importFieldsFromData = () => {
  if (!queryResult.value || !queryResult.value.columns) return;
  
  const existingFields = new Set(tableConfig.value.columns.map(col => col.field));
  
  queryResult.value.columns.forEach((col: QueryResultColumn) => {
    if (!existingFields.has(col.name)) {
      const newColumn: TableColumn = {
        field: col.name,
        label: col.name,
        type: col.type,
        displayType: getDefaultDisplayType(col.type),
        sortable: true,
        filterable: true,
        align: ColumnAlign.LEFT,
        visible: true,
        displayOrder: tableConfig.value.columns.length
      };
      tableConfig.value.columns.push(newColumn);
      existingFields.add(col.name);
    }
  });
};

// 加载可用字段选项
const loadFieldOptions = async () => {
  if (!props.queryId || availableFields.value.length > 0) {
    return;
  }

  try {
    // 调用接口获取查询结果
    const result = await fetch(`/api/queries/${props.queryId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (result.ok) {
      const data = await result.json();
      queryResult.value = data as QueryResult;
      // 从查询结果中获取字段
      if (data.columns) {
        availableFields.value = data.columns.map(col => col.name);
      }
    }
  } catch (error) {
    console.error('加载字段选项失败', error);
    messageStore.error('加载字段选项失败');
  }
};

// 存储字段类型映射
const fieldTypeMap = ref<Record<string, {type: string, format: string, displayType: string}>>({});

// 数据库类型映射函数
const mapDatabaseTypes = (columns: Array<{name: string, type: string, nullable: boolean, dbType: string}>) => {
  const typeMap: Record<string, {type: string, format: string, displayType: string}> = {};
  
  columns.forEach(column => {
    const dbType = column.dbType.toUpperCase();
    let mappedType: {type: string, format: string, displayType: string} = {
      type: 'TEXT',
      format: 'string',
      displayType: 'TEXT'
    };
    
    // MySQL 类型映射
    if (dbType.includes('INT') || dbType === 'BIGINT' || dbType === 'SMALLINT' || dbType === 'TINYINT' || dbType === 'MEDIUMINT') {
      mappedType = {
        type: 'integer',
        format: 'int',
        displayType: 'NUMBER'
      };
    } else if (dbType === 'DECIMAL' || dbType === 'FLOAT' || dbType === 'DOUBLE' || dbType === 'REAL') {
      mappedType = {
        type: 'number',
        format: 'decimal',
        displayType: 'NUMBER'
      };
    } else if (dbType === 'DATE') {
      mappedType = {
        type: 'date',
        format: 'date',
        displayType: 'DATE'
      };
    } else if (dbType === 'DATETIME' || dbType === 'TIMESTAMP') {
      mappedType = {
        type: 'date',
        format: 'date-time',
        displayType: 'DATETIME'
      };
    } else if (dbType === 'BOOLEAN' || dbType === 'BOOL' || (dbType === 'TINYINT' && column.type.includes('(1)'))) {
      mappedType = {
        type: 'boolean',
        format: 'boolean',
        displayType: 'TAG'
      };
    } else if (dbType === 'ENUM' || dbType === 'SET') {
      mappedType = {
        type: 'string',
        format: 'enum',
        displayType: 'STATUS'
      };
    } else if (dbType.includes('BLOB') || dbType.includes('BINARY')) {
      mappedType = {
        type: 'string',
        format: 'binary',
        displayType: 'TEXT'
      };
    }
    // DB2 特有类型
    else if (dbType === 'CLOB' || dbType === 'XML') {
      mappedType = {
        type: 'string',
        format: 'string',
        displayType: 'TEXT'
      };
    } else if (dbType === 'NUMERIC') {
      mappedType = {
        type: 'number',
        format: 'decimal',
        displayType: 'NUMBER'
      };
    } else if (dbType === 'TIME') {
      mappedType = {
        type: 'string',
        format: 'time',
        displayType: 'TEXT'
      };
    } else {
      mappedType = {
        type: 'string',
        format: 'string',
        displayType: 'TEXT'
      };
    }
    
    typeMap[column.name] = mappedType;
  });
  
  return typeMap;
};

// 处理拖拽变化
const onDragChange = (evt: any) => {
  // 更新排序顺序
  tableConfig.value.columns.forEach((column, index) => {
    column.displayOrder = index;
  });
  messageStore.success('列顺序已更新');
};

// 关闭字段下拉框的点击事件监听
onMounted(() => {
  document.addEventListener('click', (event) => {
    // 检查点击事件是否发生在下拉菜单内部
    const target = event.target as HTMLElement;
    const isInsideDropdown = target.closest('.relative') !== null;
    
    if (!isInsideDropdown) {
      closeFieldDropdown();
    }
  });
  
  // 如果有查询ID，预加载字段选项
  if (props.queryId) {
    loadFieldOptions();
  }
});
</script>

<style scoped>
/* 表格配置相关样式 */
.overflow-x-auto {
  max-width: 100%;
  overflow-x: auto;
}

.min-w-full {
  min-width: 100%;
}

table {
  border-collapse: collapse;
  width: 100%;
}

select, input {
  min-height: 38px;
  line-height: 1.5;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

/* 确保表格有适当高度 */
tbody tr {
  height: 50px;
}

thead th {
  height: 40px;
  vertical-align: middle;
}

/* 改善表格头部可见度 */
.bg-gray-50 {
  background-color: #f9fafb;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.font-medium {
  font-weight: 500;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

/* 百分比宽度设置 */
.w-10 {
  width: 2.5rem;
}

/* 字段选择器样式修复 */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* 字段选择器的点击区域 */
.cursor-pointer {
  cursor: pointer;
}

/* 字段选择器修复 */
.field-selector {
  border: 1px solid #d1d5db !important;
  border-radius: 0.375rem;
  min-height: 38px;
  display: block;
  width: 100%;
}

/* 字段搜索框 */
.field-search-input {
  border: 1px solid #d1d5db !important;
  min-height: 32px;
}

/* 修复字段列样式 */
td div.relative {
  position: relative;
}

td div.relative > div.flex {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  min-height: 38px;
}

.focus\:ring-indigo-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgba(99, 102, 241, var(--tw-ring-opacity));
  outline: none;
  border-color: #6366f1;
}
</style>
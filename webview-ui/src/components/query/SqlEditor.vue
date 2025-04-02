<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

// 定义组件属性
const props = defineProps<{
  modelValue: string
  dataSourceId?: string | null
  placeholder?: string
  height?: string
  minHeight?: string
  maxHeight?: string
  readonly?: boolean
  language?: 'sql' | 'text'
}>()

// 定义组件事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'execute', errorMessage?: string): void
  (e: 'save'): void
}>()

// 编辑器DOM元素
const editorEl = ref<HTMLTextAreaElement | null>(null)

// 编辑器高亮模式
const language = props.language || 'sql'

// 编辑器内容
const content = ref(props.modelValue)

// 简单的 SQL 关键字
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
  'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
  'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
  'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT'
]

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
  }
})

// 监听内容变化，更新 modelValue
watch(content, (newValue) => {
  emit('update:modelValue', newValue)
})

// 处理键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  // Tab 键缩进
  if (event.key === 'Tab') {
    event.preventDefault()
    const target = event.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd
    
    // 插入两个空格
    const newValue = target.value.substring(0, start) + '  ' + target.value.substring(end)
    
    content.value = newValue
    
    // 更新光标位置
    setTimeout(() => {
      target.selectionStart = target.selectionEnd = start + 2
    }, 0)
  }
  
  // Ctrl/Cmd + Enter 执行查询
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    execute() // 使用同一个execute函数，确保检查逻辑一致
  }
  
  // Ctrl/Cmd + S 保存查询
  if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    emit('save')
  }
}

// 简单的 SQL 语法高亮
// 注意：这只是一个基本实现，实际项目可以使用 CodeMirror 或 Monaco Editor

// 执行查询
const execute = () => {
  // 验证数据源和查询内容
  if (!props.dataSourceId) {
    // 触发执行事件，但携带错误信息
    emit('execute', '请在左侧面板中选择一个数据源')
    return
  }
  
  if (!content.value.trim()) {
    // 触发执行事件，但携带错误信息
    emit('execute', '请在SQL编辑器中输入查询语句')
    return
  }
  
  // 正常触发执行事件
  emit('execute')
}

// 保存查询
const save = () => {
  emit('save')
}

// 插入 SQL 关键字
const insertKeyword = (keyword: string) => {
  if (!editorEl.value) return
  
  const editor = editorEl.value
  const start = editor.selectionStart
  const end = editor.selectionEnd
  
  // 插入关键字和空格
  const newValue = editor.value.substring(0, start) + keyword + ' ' + editor.value.substring(end)
  
  content.value = newValue
  
  // 更新光标位置
  setTimeout(() => {
    editor.selectionStart = editor.selectionEnd = start + keyword.length + 1
    editor.focus()
  }, 0)
}
</script>

<template>
  <div class="border rounded overflow-hidden">
    <!-- SQL 关键词工具栏 -->
    <div v-if="language === 'sql'" class="bg-gray-100 border-b p-1 flex flex-wrap">
      <button
        v-for="keyword in SQL_KEYWORDS.slice(0, 10)"
        :key="keyword"
        class="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 rounded mr-1 mb-1"
        @click="insertKeyword(keyword)"
      >
        {{ keyword }}
      </button>
      
      <div class="relative group ml-1">
        <button class="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 rounded">
          更多...
        </button>
        
        <div class="absolute left-0 top-full mt-1 bg-white border rounded shadow-lg p-2 hidden group-hover:block z-10">
          <div class="grid grid-cols-2 gap-1 w-72">
            <button
              v-for="keyword in SQL_KEYWORDS.slice(10)"
              :key="keyword"
              class="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded text-left"
              @click="insertKeyword(keyword)"
            >
              {{ keyword }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex-grow"></div>
      
      <div class="text-xs text-gray-500 hidden md:flex items-center">
        <span class="mr-2 bg-gray-200 px-2 py-1 rounded">Ctrl+Enter: 执行</span>
        <span class="bg-gray-200 px-2 py-1 rounded">Ctrl+S: 保存</span>
      </div>
    </div>
    
    <!-- 编辑器 -->
    <textarea
      ref="editorEl"
      v-model="content"
      class="w-full p-3 font-mono text-sm focus:outline-none resize-none"
      :style="{
        height: props.height || 'auto',
        minHeight: props.minHeight || '150px',
        maxHeight: props.maxHeight || 'none'
      }"
      :placeholder="props.placeholder || '请输入SQL查询...'"
      :spellcheck="false"
      :readonly="props.readonly"
      @keydown="handleKeyDown"
    ></textarea>
    
    <!-- 简化的状态区域 -->
    <div class="bg-gray-100 border-t p-1 flex justify-between items-center text-sm">
      <div class="text-xs text-gray-500">{{ content.length }} 字符</div>
      
      <div v-if="!props.dataSourceId" class="text-orange-600 text-xs flex items-center">
        <i class="fas fa-exclamation-circle mr-1"></i>
        请先选择一个数据源
      </div>
      <div v-else-if="!content.trim()" class="text-gray-500 text-xs flex items-center">
        <i class="fas fa-pen mr-1"></i>
        请输入SQL查询
      </div>
      <div v-else class="text-green-600 text-xs flex items-center">
        <i class="fas fa-check-circle mr-1"></i>
        按Ctrl+Enter执行
      </div>
    </div>
  </div>
</template>
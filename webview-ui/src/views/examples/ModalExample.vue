<script setup lang="ts">
import { ref } from 'vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { confirmModal } from '@/services/modal'
import { message } from '@/services/message'

// 本地对话框可见性
const localModalVisible = ref(false)

// 本地对话框配置
const localModalConfig = ref({
  title: '自定义确认',
  content: '这是一个自定义的确认对话框',
  okText: '确认',
  cancelText: '取消',
  type: 'confirm',
  okButtonType: 'primary',
  showCancel: true,
  closable: true
})

// 打开信息对话框
const showInfoModal = () => {
  confirmModal.info({
    title: '提示信息',
    content: '这是一条信息提示',
    onOk: () => {
      message.success('你点击了确定按钮')
    }
  })
}

// 打开成功对话框
const showSuccessModal = () => {
  confirmModal.success({
    title: '成功提示',
    content: '操作已成功完成',
    onOk: () => {
      message.success('你点击了确定按钮')
    }
  })
}

// 打开警告对话框
const showWarningModal = () => {
  confirmModal.warning({
    title: '警告提示',
    content: '此操作可能会导致数据丢失',
    onOk: () => {
      message.success('你点击了确定按钮')
    }
  })
}

// 打开错误对话框
const showErrorModal = () => {
  confirmModal.error({
    title: '错误提示',
    content: '操作失败，请重试',
    onOk: () => {
      message.success('你点击了确定按钮')
    }
  })
}

// 打开确认对话框
const showConfirmModal = () => {
  confirmModal.confirm({
    title: '确认删除',
    content: '确定要删除该数据吗？此操作不可恢复。',
    okButtonType: 'danger',
    okText: '删除',
    onOk: () => {
      message.success('数据已删除')
    },
    onCancel: () => {
      message.info('取消了删除操作')
    }
  })
}

// 自定义对话框处理
const handleCustomModalOk = () => {
  message.success('自定义对话框: 确认')
  localModalVisible.value = false
}

const handleCustomModalCancel = () => {
  message.info('自定义对话框: 取消')
  localModalVisible.value = false
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">对话框示例</h1>
    
    <div class="space-y-8">
      <!-- 对话框类型 -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">对话框类型</h2>
        
        <div class="space-x-4">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="showInfoModal"
          >
            信息对话框
          </button>
          
          <button
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            @click="showSuccessModal"
          >
            成功对话框
          </button>
          
          <button
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            @click="showWarningModal"
          >
            警告对话框
          </button>
          
          <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            @click="showErrorModal"
          >
            错误对话框
          </button>
          
          <button
            class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            @click="showConfirmModal"
          >
            确认对话框
          </button>
        </div>
      </div>
      
      <!-- 组件方式使用 -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">组件方式使用</h2>
        
        <button
          class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          @click="localModalVisible = true"
        >
          打开自定义对话框
        </button>
        
        <ConfirmModal
          v-model:visible="localModalVisible"
          :config="localModalConfig"
          @ok="handleCustomModalOk"
          @cancel="handleCustomModalCancel"
        />
      </div>
    </div>
  </div>
</template>
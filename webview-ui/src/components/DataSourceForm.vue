<template>
  <!-- No changes to template section -->
</template>

<script setup>
import { onMounted, watch } from 'vue';

const props = defineProps({
  dataSource: {
    type: Object,
    default: null
  }
});

const formData = ref({});
const isFormModified = ref(true);

onMounted(() => {
  console.log('DataSourceForm组件已挂载');
  console.log('编辑数据源ID:', props.dataSource?.id || '新建数据源');
  console.log('数据源初始值:', props.dataSource);
});

// 特殊处理：当编辑数据源时，暂停表单验证，等待数据加载完成
watch(() => props.dataSource, (newVal) => {
  if (newVal && newVal.id) {
    console.log('接收到数据源数据更新:', newVal);
    
    // 延迟设置表单数据以确保UI正确更新
    setTimeout(() => {
      const dataToUpdate = { ...newVal };
      
      // 将值复制到表单对象
      formData.name = dataToUpdate.name || '';
      formData.description = dataToUpdate.description || '';
      formData.type = dataToUpdate.type || ''; 
      formData.host = dataToUpdate.host || '';
      formData.port = dataToUpdate.port ? Number(dataToUpdate.port) : undefined;
      formData.database = dataToUpdate.database || '';
      formData.username = dataToUpdate.username || '';
      formData.syncFrequency = dataToUpdate.syncFrequency || 'manual';
      
      // 更新完成后标记表单为未修改状态
      isFormModified.value = false;
      console.log('表单数据已更新为:', formData);
    }, 100);
  }
}, { immediate: true, deep: true });
</script>

<style>
  /* No changes to style section */
</style> 
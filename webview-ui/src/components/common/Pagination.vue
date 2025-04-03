<template>
  <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        type="button"
        :disabled="currentPage <= 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }"
        @click="handlePrevious"
      >
        上一页
      </button>
      <span class="text-sm text-gray-700 mx-4 flex items-center">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
      <button
        type="button"
        :disabled="currentPage >= totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
        @click="handleNext"
      >
        下一页
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          显示第 
          <span class="font-medium">{{ startItem }}</span>
          到
          <span class="font-medium">{{ endItem }}</span>
          条，共
          <span class="font-medium">{{ totalItems }}</span>
          条结果
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            type="button"
            :disabled="currentPage <= 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }"
            @click="handlePrevious"
          >
            <span class="sr-only">上一页</span>
            <i class="fas fa-chevron-left h-5 w-5"></i>
          </button>
          
          <template v-for="page in visiblePageNumbers" :key="page">
            <span 
              v-if="page === '...'" 
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
            >
              ...
            </span>
            <button
              v-else
              type="button"
              :class="[
                page === currentPage
                  ? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              ]"
              @click="handlePageClick(page)"
            >
              {{ page }}
            </button>
          </template>
          
          <button
            type="button"
            :disabled="currentPage >= totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
            @click="handleNext"
          >
            <span class="sr-only">下一页</span>
            <i class="fas fa-chevron-right h-5 w-5"></i>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      default: 10
    },
    maxVisiblePages: {
      type: Number,
      default: 5
    }
  },
  computed: {
    totalPages(): number {
      return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    },
    startItem(): number {
      return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    },
    endItem(): number {
      return Math.min(this.currentPage * this.pageSize, this.totalItems);
    },
    visiblePageNumbers(): Array<number | string> {
      const visiblePages: Array<number | string> = [];
      
      if (this.totalPages <= this.maxVisiblePages) {
        // 页数较少，显示所有页码
        for (let i = 1; i <= this.totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        // 页数较多，显示部分页码
        const halfVisible = Math.floor(this.maxVisiblePages / 2);
        
        // 始终显示第一页
        visiblePages.push(1);
        
        // 计算中间显示的页码范围
        let startPage = Math.max(2, this.currentPage - halfVisible);
        let endPage = Math.min(this.totalPages - 1, this.currentPage + halfVisible);
        
        // 调整以确保显示正确数量的页码
        if (startPage > 2) {
          visiblePages.push('...');
        }
        
        for (let i = startPage; i <= endPage; i++) {
          visiblePages.push(i);
        }
        
        if (endPage < this.totalPages - 1) {
          visiblePages.push('...');
        }
        
        // 始终显示最后一页
        visiblePages.push(this.totalPages);
      }
      
      return visiblePages;
    }
  },
  methods: {
    handlePageClick(page: number | string) {
      // 只处理数字类型的页码，忽略 "..." 类型的页码
      if (typeof page === 'number' && page !== this.currentPage) {
        this.$emit('update:currentPage', page);
        this.$emit('page-change', page);
      }
    },
    handlePrevious() {
      if (this.currentPage > 1) {
        const newPage = this.currentPage - 1;
        this.$emit('update:currentPage', newPage);
        this.$emit('page-change', newPage);
      }
    },
    handleNext() {
      if (this.currentPage < this.totalPages) {
        const newPage = this.currentPage + 1;
        this.$emit('update:currentPage', newPage);
        this.$emit('page-change', newPage);
      }
    }
  }
});
</script> 
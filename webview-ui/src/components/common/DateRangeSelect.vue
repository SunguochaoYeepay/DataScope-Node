<template>
  <div class="date-range-picker">
    <div class="flex space-x-4">
      <div class="w-full">
        <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
        <div class="relative">
          <div 
            class="relative w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            @click="showPicker = !showPicker"
          >
            <span v-if="modelValue && modelValue.startDate && modelValue.endDate">
              {{ formatDateDisplay(modelValue.startDate) }} - {{ formatDateDisplay(modelValue.endDate) }}
            </span>
            <span v-else class="text-gray-400">
              {{ placeholder || '选择日期范围' }}
            </span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-2">
              <i class="fas fa-calendar-alt text-gray-400"></i>
            </span>
          </div>
          
          <div 
            v-if="showPicker" 
            class="absolute z-10 mt-1 w-full min-w-max rounded-md bg-white shadow-lg p-4 border border-gray-200"
          >
            <div class="flex flex-col sm:flex-row gap-4">
              <!-- 预设选项 -->
              <div class="sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
                <div class="text-sm font-medium text-gray-700 mb-2">快速选择</div>
                <div class="space-y-2">
                  <div 
                    v-for="preset in availablePresets" 
                    :key="preset.value"
                    class="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                    :class="{'bg-indigo-50 text-indigo-700': isPresetActive(preset.value)}"
                    @click="applyPreset(preset.value)"
                  >
                    {{ preset.label }}
                  </div>
                </div>
              </div>
              
              <!-- 自定义日期选择 -->
              <div class="sm:w-2/3">
                <div class="text-sm font-medium text-gray-700 mb-2">自定义范围</div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">开始日期</label>
                    <input 
                      type="date" 
                      :value="customRange.startDate"
                      @input="updateCustomStartDate"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">结束日期</label>
                    <input 
                      type="date" 
                      :value="customRange.endDate"
                      @input="updateCustomEndDate"
                      :min="customRange.startDate"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4 flex justify-end space-x-2">
              <button 
                type="button"
                class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                @click="clearSelection"
              >
                清除
              </button>
              <button 
                type="button"
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                @click="applySelection"
              >
                应用
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';

export interface DateRange {
  startDate: string;
  endDate: string;
  preset?: string;
}

interface DatePresetDefinition {
  label: string;
  value: string;
  getRange: () => { startDate: string, endDate: string };
}

export default defineComponent({
  name: 'DateRangeSelect',
  props: {
    modelValue: {
      type: Object as () => DateRange | null,
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    presets: {
      type: Array as () => string[],
      default: () => ['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth', 'last7Days', 'last30Days', 'last90Days']
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showPicker = ref(false);
    const activePreset = ref('');
    const customRange = ref({
      startDate: '',
      endDate: ''
    });

    const allPresets: Record<string, DatePresetDefinition> = {
      today: {
        label: '今天',
        value: 'today',
        getRange: () => {
          const today = new Date();
          const dateStr = formatDateForInput(today);
          return { startDate: dateStr, endDate: dateStr };
        }
      },
      yesterday: {
        label: '昨天',
        value: 'yesterday',
        getRange: () => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const dateStr = formatDateForInput(yesterday);
          return { startDate: dateStr, endDate: dateStr };
        }
      },
      thisWeek: {
        label: '本周',
        value: 'thisWeek',
        getRange: () => {
          const today = new Date();
          const day = today.getDay();
          const diff = today.getDate() - day + (day === 0 ? -6 : 1); // 调整为周一开始
          const monday = new Date(today.setDate(diff));
          const sunday = new Date(today);
          sunday.setDate(monday.getDate() + 6);
          return { startDate: formatDateForInput(monday), endDate: formatDateForInput(sunday) };
        }
      },
      lastWeek: {
        label: '上周',
        value: 'lastWeek',
        getRange: () => {
          const today = new Date();
          const day = today.getDay();
          const diff = today.getDate() - day + (day === 0 ? -6 : 1) - 7; // 上周的周一
          const lastMonday = new Date(today.setDate(diff));
          const lastSunday = new Date(lastMonday);
          lastSunday.setDate(lastMonday.getDate() + 6);
          return { startDate: formatDateForInput(lastMonday), endDate: formatDateForInput(lastSunday) };
        }
      },
      thisMonth: {
        label: '本月',
        value: 'thisMonth',
        getRange: () => {
          const today = new Date();
          const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
          const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          return { startDate: formatDateForInput(firstDay), endDate: formatDateForInput(lastDay) };
        }
      },
      lastMonth: {
        label: '上月',
        value: 'lastMonth',
        getRange: () => {
          const today = new Date();
          const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
          return { startDate: formatDateForInput(firstDay), endDate: formatDateForInput(lastDay) };
        }
      },
      last7Days: {
        label: '过去7天',
        value: 'last7Days',
        getRange: () => {
          const today = new Date();
          const last7Days = new Date();
          last7Days.setDate(today.getDate() - 6);
          return { startDate: formatDateForInput(last7Days), endDate: formatDateForInput(today) };
        }
      },
      last30Days: {
        label: '过去30天',
        value: 'last30Days',
        getRange: () => {
          const today = new Date();
          const last30Days = new Date();
          last30Days.setDate(today.getDate() - 29);
          return { startDate: formatDateForInput(last30Days), endDate: formatDateForInput(today) };
        }
      },
      last90Days: {
        label: '过去90天',
        value: 'last90Days',
        getRange: () => {
          const today = new Date();
          const last90Days = new Date();
          last90Days.setDate(today.getDate() - 89);
          return { startDate: formatDateForInput(last90Days), endDate: formatDateForInput(today) };
        }
      }
    };

    const availablePresets = computed(() => {
      return props.presets.map(presetKey => allPresets[presetKey]).filter(Boolean);
    });

    function formatDateForInput(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    function formatDateDisplay(dateString: string): string {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      return `${year}/${month}/${day}`;
    }

    function isPresetActive(preset: string): boolean {
      return activePreset.value === preset;
    }

    function applyPreset(preset: string): void {
      const presetObj = allPresets[preset];
      if (presetObj) {
        activePreset.value = preset;
        const range = presetObj.getRange();
        customRange.value = { ...range };
      }
    }

    function updateCustomStartDate(event: Event): void {
      const target = event.target as HTMLInputElement;
      customRange.value.startDate = target.value;
      activePreset.value = '';
      
      // 确保结束日期不早于开始日期
      if (customRange.value.endDate && customRange.value.endDate < customRange.value.startDate) {
        customRange.value.endDate = customRange.value.startDate;
      }
    }

    function updateCustomEndDate(event: Event): void {
      const target = event.target as HTMLInputElement;
      customRange.value.endDate = target.value;
      activePreset.value = '';
    }

    function applySelection(): void {
      if (customRange.value.startDate && customRange.value.endDate) {
        emit('update:modelValue', {
          startDate: customRange.value.startDate,
          endDate: customRange.value.endDate,
          preset: activePreset.value || undefined
        });
        showPicker.value = false;
      }
    }

    function clearSelection(): void {
      customRange.value = { startDate: '', endDate: '' };
      activePreset.value = '';
      emit('update:modelValue', null);
      showPicker.value = false;
    }

    // 初始化
    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        customRange.value = {
          startDate: newVal.startDate || '',
          endDate: newVal.endDate || ''
        };
        activePreset.value = newVal.preset || '';
      } else {
        customRange.value = { startDate: '', endDate: '' };
        activePreset.value = '';
      }
    }, { immediate: true });

    return {
      showPicker,
      activePreset,
      customRange,
      availablePresets,
      formatDateDisplay,
      isPresetActive,
      applyPreset,
      updateCustomStartDate,
      updateCustomEndDate,
      applySelection,
      clearSelection
    };
  }
});
</script>
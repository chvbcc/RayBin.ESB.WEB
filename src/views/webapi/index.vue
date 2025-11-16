<script setup lang="ts">
import { $t } from '@/locales';
import { ref } from 'vue';
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue';

const formRef = ref();
const baseInfoCollapsed = ref(false);
const activeKeys = ref(['1', '2']);

const toggleBaseInfo = () => {
  baseInfoCollapsed.value = !baseInfoCollapsed.value;
};
</script>

<template>
    <div class="min-h-500px flex flex-col h-full lt-sm:overflow-auto pr-3">
      <a-form ref="formRef" class="flex flex-col flex-1">
        <a-card :title="$t('page.database.titleBaseInfo')" :bordered="false" class="mb-4">
          <template #extra>
            <UpOutlined v-if="!baseInfoCollapsed" @click="toggleBaseInfo" class="cursor-pointer" />
            <DownOutlined v-else @click="toggleBaseInfo" class="cursor-pointer" />
          </template>
          <a-row v-show="!baseInfoCollapsed" :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <!-- 基本信息内容 -->
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <!-- 基本信息内容 -->
            </a-col>
          </a-row>
        </a-card>
        <a-card :title="$t('page.database.titleDataMapping')" :bordered="false" class="flex flex-col flex-1">
          <div class="flex flex-col h-full flex-1">
            <a-row class="mb-4">
              <a-col :span="24" :md="12" :lg="12"> </a-col>
              <a-col :span="24" :md="12" :lg="12"> </a-col>
            </a-row>
            <div id="div1" class="flex-grow min-h-0">
            </div>

            <a-row id="rowa2" class="mt-4">
              <a-col :span="24" :md="24" :lg="24">

              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-form>
    </div>
</template>

<style scoped />

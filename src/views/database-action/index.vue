<script setup lang="ts">
import { $t } from '@/locales';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
import { fetchGetList,fetchDelete } from '@/service/api';
import { databaseTypeRecord } from '@/constants/business';
import { useTable, useTableOperate } from '@/hooks/common/table';

const router = useRouter();
const appStore = useAppStore();

</script>

<template>
  <div>

  </div>
</template>

<style scoped />

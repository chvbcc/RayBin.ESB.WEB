
<script setup lang="ts">
import { $t } from '@/locales';
import { h, nextTick, ref, watch, useId } from 'vue';
import { paramTypeOptions, paramNameOptions } from '@/constants/token';
const activeKey = ref('1');


</script>
<template>
  <div>
   <a-radio-group>
      <a-radio :value="0">none</a-radio>
      <a-radio :value="1">json</a-radio>
      <a-radio :value="2">xml</a-radio>
      <a-radio :value="3">html</a-radio>
      <a-radio :value="4">text</a-radio>
      <a-radio :value="5">form-data</a-radio>
      <a-radio :value="6">x-www-form-urlencoded</a-radio>
      <a-radio :value="7">binary</a-radio>
    </a-radio-group>


  </div>
</template>
<style scoped />

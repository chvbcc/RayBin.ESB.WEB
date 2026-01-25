<script setup lang="tsx">
  interface Props {
    id: string;
  }

  defineProps<Props>();
</script>

<template>
  <LookForward>
    <p>{{ id }}</p>
  </LookForward>
</template>

<style scoped></style>

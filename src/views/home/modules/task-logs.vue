<script setup lang="tsx">
  import dayjs from 'dayjs';
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { $t,language } from '@/locales';
  import { fetchGetHomeList } from '@/service/api/log';
  import type { TableColumnsType } from 'ant-design-vue';
  import { taskTypeRecord, logLevelRecord } from '@/constants/options';

  defineOptions({
    name: 'TaskLogs'
  });

  const loading = ref(false);
  const router = useRouter();
  const data = ref<Api.Log.TaskLog[]>();
  const columns = computed<TableColumnsType<Api.Log.TaskLog>>(() => [
  {
    key: 'taskID',
    dataIndex: 'taskID',
    title: $t('page.taskLog.taskID'),
    width: 90,
    align: 'center'
  },
  {
    key: 'taskName',
    dataIndex: 'taskName',
    title: $t('page.taskLog.taskName'),
    align: 'center',
    minWidth: 120,
    ellipsis: true,
    customRender: ({ record }) => {
      return (
        <a-button type="link" onClick={() => router.push(`/tasklog/details/${record.id}`)}>
          <span style="font-size:14px">{record.taskName}</span>
        </a-button>
      );
    }
  },
    {
      key: 'taskType',
      dataIndex: 'taskType',
      title: $t('page.taskLog.taskType'),
      align: 'center',
      width: 110,
      customRender: ({ record }) => {
        if (record.taskType === null) {
          return null;
        }
        const label = $t(taskTypeRecord[record.taskType]);
        return label;
      }
    },
    {
      key: 'logLevel',
      dataIndex: 'logLevel',
      title: $t('page.taskLog.logLevel'),
      align: 'center',
      width: 90,
      customRender: ({ record }) => {
        if (record.logLevel === null) {
          return null;
        }
        const label = $t(logLevelRecord[record.logLevel]);
        return <a-tag color={`${getColor(record.logLevel)}`}>{label}</a-tag>;
      }
    },
    {
      key: 'spentTime',
      dataIndex: 'spentTime',
      title: $t('page.taskLog.spentTime'),
      align: 'center',
      width:  language()==='en-US'? 130: 90,
      customRender: ({ record }) => {
        return `${record.spentTime} ms`;
      }
    },
    {
      key: 'message',
      dataIndex: 'message',
      title: $t('page.taskLog.message'),
      align: 'left',
      minWidth: 180,
      ellipsis: true
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: $t('page.taskLog.createTime'),
      align: 'center',
      width: 150,
      customRender: ({ record }) => {
        return record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '';
      }
    }
  ]);

  function getColor(level: number) {
    switch (level) {
      case 1:
        return '#07af61';
      case 2:
        return '#f39c12';
      case 3:
        return '#f66060';
      case 4:
        return '#531dab';
      default:
        return '#2db7f5';
    }
  }

  async function getData() {
    loading.value = true;
    try {
      const { error, data: relust } = await fetchGetHomeList();
      if (!error && relust) {
        data.value = relust;
      }
    } catch (err) {
      window.$message?.error($t('common.getDataFailed'));
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    getData();
  });
</script>

<template>
  <a-card :title="$t('page.home.taskRunLogs')" :bordered="false" size="small" class="card-wrapper">
    <template #extra>
      <a class="text-primary" href="javascript:;">{{ $t('page.home.moreLogs') }}</a>
    </template>
    <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" size="small" :loading="loading" row-key="id" bordered />
  </a-card>
</template>

<style scoped></style>

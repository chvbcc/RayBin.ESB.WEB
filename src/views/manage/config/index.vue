<script setup lang="tsx">
  import { onMounted } from 'vue';
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { $t, language } from '@/locales';
  import { useAppStore } from '@/store/modules/app';
  import { useAntdForm } from '@/hooks/common/form';
  import { SystemConfigApi } from '@/service/api/manage';

  // #region 1. 定义常量
  const router = useRouter();
  const appStore = useAppStore();
  const { formRef } = useAntdForm();
  const model = ref<Api.SystemManage.SystemConfig>(createDefaultModel());

  // #region 2. 定义默认模型创建模型默认值
  function createDefaultModel(): Api.SystemManage.SystemConfig {
    return {
        weComTokenUrl: '',
        weComCorpID:  '',
        weComCorpSecret: '',
        weComTokenPath: '',
        dingTalkTokenUrl: '',
        dingTalkAppKey: '',
        dingTalkAppSecret: '',
        dingTalkTokenPath: '',
        smtpServer: '',
        smtpPort: '',
        emailAccount: '',
        emailPassword: '',
        emailSender: '',
    };
  }

  // 根据语言动态设置 labelCol 宽度
  const labelCol =  computed(() =>language() === 'en-US' ?  { style: { width: '146px' } } :  { style: { width: '120px' } });
  //#endregion

  // #region 3. 获取模型数据
  onMounted(async () => {
    const { error, data } = await SystemConfigApi.fetchGetModel();
    if (!error && data) {
      model.value = data;
    }
  });
  //#endregion

  // #region 9. 保存配置
  async function handleSave() {
    formRef.value?.validate().then(async () => {
      const { error, response } = await SystemConfigApi.fetchUpdate(model.value);
      if (error) { window.$message?.error($t('common.updateFailed')); return; }
      const result = response.data as { code: string; msg: string; data: string};
      if (result.msg === "success") {
        window.$message?.success($t('common.updateSuccess'));
        appStore.tabStore.removeActiveTab();
        router.push({ name: 'connection' });
      }
      else if (result.msg === "fail") {
        window.$message?.error($t('common.updateFailed'));
      } else {
        window.$message?.error(result.msg || $t('common.updateFailed'));
      }
    }
    ).catch(() => {
      return;
    })
  }
  //#endregion

  // #region 10. 返回主页
  function handleBack() {
    appStore.tabStore.removeActiveTab();
    router.push({ name: 'home' });
  }
  //#endregion
</script>

<template>
    <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <a-form ref="formRef" :model="model" :label-col="labelCol">
        <a-card :title="$t('page.manage.config.weComTitle')" :bordered="false" class="card-wrapper">
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.weComTokenUrl')" name="weComTokenUrl" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.weComTokenUrl" :placeholder="$t('page.manage.config.weComTokenUrl')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.weComCorpID')" name="weComCorpID" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.weComCorpID" :placeholder="$t('page.manage.config.weComCorpID')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.weComCorpSecret')" name="weComCorpSecret" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.weComCorpSecret" :placeholder="$t('page.manage.config.weComCorpSecret')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.weComTokenPath')" name="weComTokenPath" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.weComTokenPath" :placeholder="$t('page.manage.config.weComTokenPath')" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card :title="$t('page.manage.config.dingTalkTitle')" :bordered="false" class="card-wrapper mt-16px">
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.dingTalkTokenUrl')" name="dingTalkTokenUrl" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.dingTalkTokenUrl" :placeholder="$t('page.manage.config.dingTalkTokenUrl')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.dingTalkAppKey')" name="dingTalkAppKey" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.dingTalkAppKey" :placeholder="$t('page.manage.config.dingTalkAppKey')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.dingTalkAppSecret')" name="dingTalkAppSecret" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.dingTalkAppSecret" :placeholder="$t('page.manage.config.dingTalkAppSecret')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.dingTalkTokenPath')" name="dingTalkTokenPath" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.dingTalkTokenPath" :placeholder="$t('page.manage.config.dingTalkTokenPath')" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card :title="$t('page.manage.config.emailServiceTitle')" :bordered="false" class="card-wrapper mt-16px">
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.smtpServer')" name="smtpServer" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.smtpServer" :placeholder="$t('page.manage.config.smtpServer')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.smtpPort')" name="smtpPort" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.smtpPort" :placeholder="$t('page.manage.config.smtpPort')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.emailAccount')" name="emailAccount" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.emailAccount" :placeholder="$t('page.manage.config.emailAccount')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.emailPassword')" name="emailPassword" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.emailPassword" :placeholder="$t('page.manage.config.emailPassword')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.manage.config.emailSender')" name="emailSender" :rules="[{ required: true }]" class="m-2">
                <a-input v-model:value="model.emailSender" :placeholder="$t('page.manage.config.emailSender')" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[16, 16]" class="mt-4 text-align-center">
            <a-col :span="24" :md="24" :lg="24">
              <a-button type="primary" @click="handleSave" class="blue-btn mr-8 pl-6 pr-6">
                {{$t('common.save')}}
              </a-button>
              <a-button type="primary" @click="handleBack" ghost class=" pl-6 pr-6">
                {{$t('common.back')}}
              </a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
    </div>
</template>

<style scoped>
</style>

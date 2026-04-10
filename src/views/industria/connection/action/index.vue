<script setup lang="tsx">
import { $t } from '@/locales';
import { onMounted } from 'vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { getPromptMessage } from '@/utils/common';
import CustomAlert from '@/components/custom/custom-alert.vue';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { fetchTest, fetchCheckName, fetchCheckDeviceName, fetchSave,
         fetchGetModel, fetchGetManufacturerList } from '@/service/api/device';

// #region 1. 定义常量
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

const { formRef } = useAntdForm();
const { defaultRequiredRule } = useFormRules();
const manufacturerList = ref<Api.DeviceConnection.ManufacturerList>([]);

// 控制alert显示/隐藏的状态
const showAlert = ref(false);
const type = ref<'error' | 'success' | 'warning' | 'info'>('success');
const message = ref<string>('');
const description = ref<string>('');

//#endregion

// #region 2. 定义默认模型创建模型默认值
const model = ref<Api.DeviceConnection.DeviceConnectionModel>(createDefaultModel());
function createDefaultModel(): Api.DeviceConnection.DeviceConnectionModel {
  return {
    id: 0,
    connectionName: '',
    manufacturerID: 1,
    deviceName: '',
    deviceModel: '',
    address: '',
    username: '',
    password: ''
  };
}
//#endregion

// #region 3. 组件加载后，根据id值判断是添加还是编辑
onMounted(async () => {
  const response = await fetchGetManufacturerList();
  manufacturerList.value = response.data as Api.DeviceConnection.ManufacturerList;
  const id = Number(route.query.id ?? 0);
  if (id) {
    const { error, data } = await fetchGetModel(id);
    if (!error && data) {
      model.value = { ...createDefaultModel(), ...data };
    }
  }
});
//#endregion

// #region 4. 定义规则类型
type RuleKey = Extract<keyof Api.DeviceConnection.DeviceConnectionModel, 'connectionName' | 'manufacturerID' | 'address'>;

// 6. 将rules改为计算属性，根据连接模式动态调整必填字段
const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const connectionNameRule: App.Global.FormRule = {
    required: true, // 添加 required: true，确保显示星号
    validateTrigger: 'blur',
    validator: async (_rule: any, value: string) => {
      const name = (value ?? '').trim();
      if (!name) {
        return Promise.reject(new Error(($t('page.connection.form.connectionName') as string)));
      }
      const createUserId = parseInt(authStore.userInfo.userId) ?? 0;
      const { response } = await fetchCheckName(name, createUserId, model.value.id);
      const data = response.data as { code: string; msg: string; data: boolean };
      if (data.msg === 'success' && data.data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    }
  };
  const deviceNameRule: App.Global.FormRule = {
    required: true, // 添加 required: true，确保显示星号
    validateTrigger: 'blur',
    validator: async (_rule: any, value: string) => {
      const name = (value ?? '').trim();
      if (!name) {
        return Promise.reject(new Error(($t('page.connection.form.connectionName') as string)));
      }
      const createUserId = parseInt(authStore.userInfo.userId) ?? 0;
      const { response } = await fetchCheckDeviceName(name, createUserId, model.value.id);
      const data = response.data as { code: string; msg: string; data: boolean };
      if (data.msg === 'success' && data.data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    }
  };
  // 其余字段保持默认必填规则
  return {
    connectionName: connectionNameRule,
    manufacturerID: defaultRequiredRule,
    deviceName: deviceNameRule,
    deviceModel: defaultRequiredRule,
    address: defaultRequiredRule,
  };
});
//#endregion

// #region 7. 关闭alert的处理函数
const handleCloseAlert = () => {
  showAlert.value = false;
};
//#endregion

// #region 8. 测试连接
async function handleTestConnection() {
  await formRef.value?.validateFields('address').then(async () => {
    const { response } = await fetchTest(model.value);
    const data = response.data as { code: string; msg: string; data: string };
    if (data.msg === 'fail') {
      message.value = $t('common.fail');
      description.value = data.data;
      type.value = 'error';
    } else if (data.msg === 'success') {
      message.value = $t('common.success');
      description.value = $t('page.connection.connectionSuccess');
      type.value = 'success';
    }
    showAlert.value = true;
  }).catch(() => {
    return;
  });
}
//#endregion

// #region 9. 保存连接
async function handleSave() {
  formRef.value?.validate().then(async () => {
    const { error, response } = await fetchTest(model.value);
    if (error) { window.$message?.error($t('common.fail')); return; }
    const result = response.data as { code: string; msg: string; data: string };
    if (result.msg === "fail") {
      message.value =  $t('common.fail')
      description.value = result.data
      type.value = 'error';
      showAlert.value = true;
    }
    else if (result.msg === "success") {
      const { error, response } = await fetchSave(model.value);
      if (error) { window.$message?.error($t('common.addFailed')); return; }
      const result = response.data as { code: string; msg: string; data: string};
      if (result.msg === "success") {
        window.$message?.success(getPromptMessage(route.query, "Success"));
        appStore.tabStore.removeActiveTab();
        void router.push({ name: 'industria_connection' });
      }
      else if (result.msg === "fail") {
        window.$message?.error(result.data);
      } else {
        window.$message?.error(getPromptMessage(route.query, "Failed"));
      }
    }
  }).catch(() => {
    return;
  });
}
//#endregion

// #region 10. 返回连接列表
function handleBack() {
  appStore.tabStore.removeActiveTab();
  void router.push({ name: 'industria_connection' });
}
//#endregion
</script>

<template>
    <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <a-form ref="formRef" :model="model" :rules="rules" :label-col="{ span: 4 }">
        <a-card :title="$t('page.deviceConnection.titleBaseInfo')" :bordered="false" class="card-wrapper">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <a-form-item name="manufacturerID" class="m-2">
                <a-radio-group v-model:value="model.manufacturerID" style="width:100%">
                  <div class="db-grid-container">
                    <a-radio-button v-for="item in manufacturerList" :key="item.id" :value="item.id" class="img-radio-btn">
                      <div class="img-container">
                        <img :src="`../../src/assets/imgs/device/${item.logo}`" :alt="item.name" :class="{ active: model.manufacturerID === item.id }" />
                      </div>
                    </a-radio-button>
                  </div>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.deviceConnection.connectionName')" name="connectionName" class="m-2">
                <a-input v-model:value="model.connectionName" :placeholder="$t('page.deviceConnection.form.connectionName')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.deviceConnection.deviceName')" name="deviceName" class="m-2">
                <a-input v-model:value="model.deviceName" :placeholder="$t('page.deviceConnection.form.deviceName')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.deviceConnection.deviceModel')" name="deviceModel" class="m-2">
                <a-input v-model:value="model.deviceModel" :placeholder="$t('page.deviceConnection.form.deviceModel')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.deviceConnection.address')" name="address" class="m-2">
                <a-input v-model:value="model.address" :placeholder="$t('page.deviceConnection.form.address')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.connection.username')" name="username" class="m-2">
                <a-input v-model:value="model.username" :placeholder="$t('page.connection.form.username')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.connection.password')" name="password" class="m-2">
                <a-input-password v-model:value="model.password" :placeholder="$t('page.connection.form.password')"  />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label-col="{ span: 4}" label="&nbsp;" :colon="false" class="m-2">
                <a-button type="primary" @click="handleTestConnection" class="orange-btn mr-8 pl-6 pr-6">
                  {{$t('common.test')}}
                </a-button>
                <a-button type="primary" @click="handleSave" class="blue-btn mr-8 pl-6 pr-6">
                  {{$t('common.save')}}
                </a-button>
                <a-button type="primary" @click="handleBack" ghost class=" pl-6 pr-6">
                  {{$t('common.back')}}
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
      <CustomAlert v-if="showAlert"  :message="message" :type="type" :description="description" show-icon closable @close="handleCloseAlert" />
    </div>
</template>

<style scoped>
  /* CSS Grid 一行4列布局 小屏幕一行2列 更小的屏幕一行1列*/
  .db-grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(250px, 100%), 1fr));  gap: 20px; width: 100%; padding: 16px;}

  /* 单个数据库按钮样式 */
  .img-radio-btn {
    border: 1px solid #d9d9d9 !important;
    background: white !important;
    padding: 16px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    width: 250px;
    height: 50px;
    min-height: 60px;
  }


  /* 悬停效果 - 只将左侧边框设为 2px */
  .db-grid-container :deep(.ant-radio-button-wrapper:hover) {
    box-shadow: 0 0 0 1px #1890ff inset, 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  }

  /* 选中状态 */
  .db-grid-container :deep(.ant-radio-button-wrapper-checked) {
    border: 1px solid #1890ff !important;
    box-shadow: 0 0 0 0 inset, 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  }

  .img-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 93%; height: 93%; left: 10px; }
  .img-container img { max-width: 96%; max-height: 96%; object-fit: contain; transition: all 0.2s ease; left: 10px; }

  /* 选中时图片变亮并放大 */
  .img-container img.active { opacity: 1; transform: scale(1.2); }
  .card-wrapper { margin-bottom: 16px; }

</style>

<script setup lang="tsx">
  import { $t } from '@/locales';
  import { getLocalIcons } from '@/utils/icon';
  import { SimpleScrollbar } from '@sa/materials';
  import { computed, nextTick, ref, watch } from 'vue';
  import SvgIcon from '@/components/custom/svg-icon.vue';
  import { RoleApi, MenuApi } from '@/service/api/manage';
  import { useAntdForm, useFormRules } from '@/hooks/common/form';
  import { translateOptions, getPromptMessage } from '@/utils/common';
  import { enableStatusOptions, menuTypeOptions, permissionTypeOptions } from '@/constants/options';
  import { getLayoutAndPage, getPathParamFromRoutePath, getRoutePathByRouteName, getRoutePathWithParam, transformLayoutAndPageToComponent } from './shared';

  defineOptions({
    name: 'MenuOperateModal'
  });

  export type OperateType = AntDesign.TableOperateType | 'addChild';

  interface Props {
    operateType: OperateType;
    rowData?: Api.SystemManage.Menu | null;
    allPages: string[];
  }

  const props = defineProps<Props>();

  interface Emits {
    (e: 'submitted'): void;
  }

  const activeKey = ref('1');
  const emit = defineEmits<Emits>();

  const visible = defineModel<boolean>('visible', { default: false });
  const { formRef, validate, resetFields } = useAntdForm();
  const { defaultRequiredRule } = useFormRules();

  const title = computed(() => {
    const titles: Record<OperateType, string> = {
      add: $t('page.manage.menu.addMenu'),
      addChild: $t('page.manage.menu.addChildMenu'),
      edit: $t('page.manage.menu.editMenu')
    };
    return titles[props.operateType];
  });

  const model = ref(createDefaultModel());

  function createDefaultModel(): Api.SystemManage.MenuModel {
    return {
      id: 0,
      menuType: '0',
      title: '',
      name: '',
      path: '',
      pathParam: '',
      component: '',
      layout: '',
      page: '',
      i18nKey: null,
      icon: '',
      localIcon: '',
      parentID: 0,
      status: 0,
      keepAlive: false,
      constant: false,
      order: 0,
      href: null,
      hideInMenu: false,
      activeMenu: null,
      multiTab: false,
      fixedIndexInTab: 0,
      query: [],
      permissions: []
    };
  }

  type RuleKey = Extract<keyof Api.SystemManage.MenuModel, 'title' | 'status' | 'name' | 'path'>;

  const rules= computed<Record<RuleKey, App.Global.FormRule>>(() => {
    const nameRule: App.Global.FormRule = {
      required: true,
      validateTrigger: 'blur',
      validator: async (_rule: any, value: string) => {
        const name = (value ?? '').trim();
        if (!name) {
          return Promise.reject(new Error(($t('page.manage.menu.form.name') as string)));
        }
        const { response } = await MenuApi.fetchCheckName(name, model.value.id);
        const data = response.data as { code: string; msg: string; data: boolean };
        if (data.msg==="success" && data.data) {
          return Promise.reject(new Error($t('common.exists')));
        }
        return Promise.resolve();
      }
    };
    return {
      title: defaultRequiredRule,
      status: defaultRequiredRule,
      name: nameRule,
      path: defaultRequiredRule
    };
  });

  const disabledMenuType = computed(() => props.operateType === 'edit');

  const localIcons = getLocalIcons();
  const localIconOptions = localIcons.map(item => ({
    label: () => (
      <div class="flex-y-center gap-16px">
        <SvgIcon localIcon={item} class="text-icon" />
        <span>{item}</span>
      </div>
    ),
    value: item
  }));

  const showLayout = computed(() => model.value.parentID === 0);
  const showPage = computed(() => model.value.menuType === '1');

  const pageOptions = computed(() => {
    const allPages = [...props.allPages];
    if (model.value.name && !allPages.includes(model.value.name)) {
      allPages.unshift(model.value.name);
    }

    const opts: CommonType.Option[] = allPages.map(page => ({
      label: page,
      value: page
    }));

    return opts;
  });

  const layoutOptions: CommonType.Option[] = [
    {
      label: 'base',
      value: 'base'
    },
    {
      label: 'blank',
      value: 'blank'
    }
  ];

  /** the enabled role options */
  const roleOptions = ref<CommonType.Option<number>[]>([]);

  async function getRoleOptions() {
    const { error, data } = await RoleApi.fetchGetList();
    if (!error) {
      const options = data.map(item => ({
        label: item.roleName,
        value: item.id
      }));
      roleOptions.value = [...options];
    }
  }

  /** - add a query input */
  function addQuery(index: number) {
    model.value.query.splice(index + 1, 0, {
      key: '',
      value: ''
    });
  }

  /** - remove a query input */
  function removeQuery(index: number) {
    model.value.query.splice(index, 1);
  }

  /** - add a button input */
  function addButton(index: number) {
      // 创建新的权限对象
    const newPermission = {
      menuID: 0,
      permissType: '0',
      permissCode: '',
      description: ''
    };
    // 使用 splice 添加到数组中，保持响应性
    model.value.permissions.splice(index + 1, 0, newPermission);
      // 强制更新响应式系统
    model.value = { ...model.value };
  }

  /** - remove a button input */
  function removeButton(index: number) {
    model.value.permissions.splice(index, 1);
  }

  async function handleInitModel() {
    model.value = createDefaultModel();
    if (!props.rowData) return;
    await nextTick();
    if (props.operateType === 'addChild') {
      const { id } = props.rowData;
      Object.assign(model.value, { parentID: id });
    }

    if (props.operateType === 'edit') {
      const { component, ...rest } = props.rowData;
      const { layout, page } = getLayoutAndPage(component);
      const { path, param } = getPathParamFromRoutePath(rest.path);
      Object.assign(model.value, rest, { layout, page, routePath: path, pathParam: param });
    }

    if (!model.value.query) {
      model.value.query = [];
    }
    if (!model.value.permissions) {
      model.value.permissions = [];
    }
  }

  function closeDrawer() {
    model.value.permissions = [];
    visible.value = false;
  }

  function handleUpdateRoutePathByRouteName() {
    if (model.value.name) {
      model.value.path = getRoutePathByRouteName(model.value.name);
    } else {
      model.value.path = '';
    }
  }

  function handleUpdateI18nKeyByRouteName() {
    if (model.value.name) {
      model.value.i18nKey = `route.${model.value.name}` as App.I18n.I18nKey;
    } else {
      model.value.i18nKey = null;
    }
  }

  function getSubmitData() {
    const { layout, page, pathParam, ...params } = model.value;
    const component = transformLayoutAndPageToComponent(layout, page);
    const routePath = getRoutePathWithParam(model.value.path, pathParam);
    return {
      ...params,
      layout,
      page,
      pathParam,
      component,
      path: routePath
    };
  }

  async function handleSubmit() {
    await validate();
    const submitData = getSubmitData();
    const { error, response } = await MenuApi.fetchSave(submitData);
    if (error) { window.$message?.error(getPromptMessage(props.operateType, 'Failed')); return; }
    const result = response.data as { code: string; msg: string; data: boolean };
    if (result.msg === 'success') {
      window.$message?.success(getPromptMessage(props.operateType, 'Success'));
      closeDrawer();
      emit('submitted');
    } else if (result.msg === 'fail') {
      window.$message?.error(result.data);
    } else {
      window.$message?.error(getPromptMessage(props.operateType, 'Failed'));
    }
  }

  watch(visible, () => {
    if (visible.value) {
      resetFields();
      handleInitModel();
      getRoleOptions();
    }
  });

  watch(
    () => model.value.name,
    () => {
      handleUpdateRoutePathByRouteName();
      handleUpdateI18nKeyByRouteName();
    }
  );
</script>

<template>
  <a-modal v-model:open="visible" :title="title" width="960px">
    <div class="h-680px">
      <simple-scrollbar>
        <a-form ref="formRef" :model="model" :rules="rules" :label-col="{ lg: 8, xs: 4 }" label-wrap class="pr-20px">
          <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="$t('page.manage.menu.tabMenu')">
            <a-row>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.menuType')" name="menuType">
                  <a-radio-group v-model:value="model.menuType" :disabled="disabledMenuType">
                    <a-radio v-for="item in menuTypeOptions" :key="item.value" :value="item.value">
                      {{ $t(item.label as App.I18n.I18nKey) }}
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.title')" name="title">
                  <a-input v-model:value="model.title" :placeholder="$t('page.manage.menu.form.title')" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.name')" name="name">
                  <a-input v-model:value="model.name" :placeholder="$t('page.manage.menu.form.name')" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.path')" name="path">
                  <a-input v-model:value="model.path" disabled :placeholder="$t('page.manage.menu.form.path')" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.pathParam')" name="pathParam">
                  <a-input v-model:value="model.pathParam" :placeholder="$t('page.manage.menu.form.pathParam')" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item v-if="showLayout" :label="$t('page.manage.menu.layout')" name="layout">
                  <a-select v-model:value="model.layout" :options="layoutOptions" :placeholder="$t('page.manage.menu.form.layout')" />
                </a-form-item>
              </a-col>
              <a-col v-if="showPage" :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.page')" name="page">
                  <a-select v-model:value="model.page" :options="pageOptions" :placeholder="$t('page.manage.menu.form.page')" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.i18nKey')" name="i18nKey">
                  <a-input v-model:value="model.i18nKey as string" :placeholder="$t('page.manage.menu.form.i18nKey')" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.order')" name="order">
                  <a-input-number v-model:value="model.order as number" class="w-full" :placeholder="$t('page.manage.menu.form.order')" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.localIcon')" name="localIcon">
                    <a-select v-model:value="model.localIcon" :placeholder="$t('page.manage.menu.form.localIcon')" :options="localIconOptions" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.icon')" name="icon">
                  <a-input v-model:value="model.icon" :placeholder="$t('page.manage.menu.form.icon')" class="flex-1">
                    <template #suffix>
                      <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.status')" name="status">
                  <a-radio-group v-model:value="model.status">
                    <a-radio v-for="item in enableStatusOptions" :key="item.value" :value="item.value">
                      {{ $t(item.label as App.I18n.I18nKey) }}
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.keepAlive')" name="keepAlive">
                  <a-radio-group v-model:value="model.keepAlive">
                    <a-radio :value="true">{{ $t('common.yesOrNo.yes') }}</a-radio>
                    <a-radio :value="false">{{ $t('common.yesOrNo.no') }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.constant')" name="constant">
                  <a-radio-group v-model:value="model.constant">
                    <a-radio value>
                      {{ $t('common.yesOrNo.yes') }}
                    </a-radio>
                    <a-radio :value="false">
                      {{ $t('common.yesOrNo.no') }}
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.href')" name="href">
                  <a-input v-model:value="model.href as string" :placeholder="$t('page.manage.menu.form.href')" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.hideInMenu')" name="hideInMenu">
                  <a-radio-group v-model:value="model.hideInMenu">
                    <a-radio :value="true">{{ $t('common.yesOrNo.yes') }}</a-radio>
                    <a-radio :value="false">{{ $t('common.yesOrNo.no') }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col v-if="model.hideInMenu" :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.activeMenu')" name="activeMenu">
                  <a-select v-model:value="model.activeMenu as string" :options="pageOptions" clearable :placeholder="$t('page.manage.menu.form.activeMenu')" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.multiTab')" name="multiTab">
                  <a-radio-group v-model:value="model.multiTab">
                    <a-radio value :label="$t('common.yesOrNo.yes')" />
                    <a-radio :value="false" :label="$t('common.yesOrNo.no')" />
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :xs="24">
                <a-form-item :label="$t('page.manage.menu.fixedIndexInTab')" name="fixedIndexInTab">
                  <a-input-number v-model:value="model.fixedIndexInTab as number" class="w-full" clearable :placeholder="$t('page.manage.menu.form.fixedIndexInTab')" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item :label-col="{ span: 4 }" :label="$t('page.manage.menu.query')" name="query">
                  <a-button v-if="model.query.length === 0" type="dashed" block @click="addQuery(-1)">
                    <template #icon>
                      <icon-carbon-add class="align-sub text-icon" />
                    </template>
                    <span class="ml-8px">{{ $t('common.add') }}</span>
                  </a-button>
                  <template v-else>
                    <div v-for="(item, index) in model.query" :key="index" class="flex gap-3">
                      <a-col :span="9">
                        <a-form-item :name="['query', index, 'key']">
                          <a-input v-model:value="item.key" :placeholder="$t('page.manage.menu.form.queryKey')" class="flex-1" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="9">
                        <a-form-item :name="['query', index, 'value']">
                          <a-input v-model:value="item.value" :placeholder="$t('page.manage.menu.form.queryValue')" class="flex-1" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="5">
                        <a-space class="ml-12px">
                          <a-button size="middle" @click="addQuery(index)">
                            <template #icon>
                              <icon-ic:round-plus class="align-sub text-icon" />
                            </template>
                          </a-button>
                          <a-button size="middle" @click="removeQuery(index)">
                            <template #icon>
                              <icon-ic-round-remove class="align-sub text-icon" />
                            </template>
                          </a-button>
                        </a-space>
                      </a-col>
                    </div>
                  </template>
                </a-form-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="$t('page.manage.menu.tabPermission')">
            <a-row>
              <a-col :span="24">
                <a-form-item :label-col="{ span: 4 }" :label="$t('page.manage.permission.title')" name="permissions">
                  <a-button v-if="model.permissions.length === 0" type="dashed" block @click="addButton(-1)">
                    <template #icon>
                      <icon-carbon-add class="align-sub text-icon" />
                    </template>
                    <span class="ml-8px">{{ $t('common.add') }}</span>
                  </a-button>
                  <template v-else>
                    <div v-for="(item, index) in model.permissions" :key="index" class="flex gap-3">
                      <a-col :span="5">
                        <a-form-item :name="['permissions', index, 'permissType']">
                          <a-select v-model:value="item.permissType" :placeholder="$t('page.manage.permission.form.permissType')" :options="translateOptions(permissionTypeOptions)" allow-clear />
                        </a-form-item>
                      </a-col>
                      <a-col :span="7">
                        <a-form-item :name="['permissions', index, 'permissCode']">
                          <a-input v-model:value="item.permissCode" :placeholder="$t('page.manage.permission.form.permissCode')" class="flex-1" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="7">
                        <a-form-item :name="['permissions', index, 'description']">
                          <a-input v-model:value="item.description" :placeholder="$t('page.manage.permission.form.description')" class="flex-1" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="5">
                        <a-space class="ml-12px">
                          <a-button size="middle" @click="addButton(index)">
                            <template #icon>
                              <icon-ic:round-plus class="align-sub text-icon" />
                            </template>
                          </a-button>
                          <a-button size="middle" @click="removeButton(index)">
                            <template #icon>
                              <icon-ic-round-remove class="align-sub text-icon" />
                            </template>
                          </a-button>
                        </a-space>
                      </a-col>
                    </div>
                  </template>
                </a-form-item>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </simple-scrollbar>
  </div>
  <template #footer>
      <a-space justify="end" :size="16">
        <a-button @click="closeDrawer">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped></style>

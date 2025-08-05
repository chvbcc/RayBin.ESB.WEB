1.修改页面左上角Logo
1.1 SVG 文件放在 src\assets\svg-icon下 esb.svg
1.2 修改 src\layouts\modules\global-logo\index.vue 文件     <icon-local-esb class="text-36px" />
<template>
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <icon-local-esb class="text-36px" />  <!--这里是图标 -->
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out">
      {{ $t('system.title') }}
    </h2>
  </RouterLink>
</template>

2、前端需要的数据格式
code
msg
data

3、修改收藏夹logo
public\favicon.svg

4、本地 svg 图标放在 src/assets/svg-icon 下
custom-icon.svg
<icon-local-custom-icon class="text-24px text-red" />

5、配置后端基础地址. env 下
VITE_SERVICE_BASE_URL=http://127.0.0.1:1666

6、配置请求是否成功的Code .env 下
VITE_SERVICE_SUCCESS_CODE=0000

7、动态路由修改 .env 下  static ｜ dynamic
VITE_AUTH_ROUTE_MODE=dynamic



18、国产数据库支持
OceanBase   使用  Oracle
PolarDB     使用  MySql
GoldenDB    使用  MySql
OpenGauss   使用  PostgreSQL

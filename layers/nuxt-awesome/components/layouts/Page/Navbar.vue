<script lang="ts" setup>
const { awesome } = useAppConfig()
const $screen = useAwesomeScreen()
const menus = computed(
  () =>
    (awesome?.layout?.page?.navbar?.menus ||
      []) as AwesomeLayoutPageNavbarMenu[],
)

// drawer
const HamburgerMenu = defineAsyncComponent(() => import('./HamburgerMenu.vue'))
const showDrawer = ref(false)

</script>

<template>
  <header
    class="flex fixed backdrop-filter backdrop-blur-md top-0 z-40 w-full flex-none transition-colors duration-300 lg:z-50 border-b border-gray-950/10 dark:border-gray-50/[0.2] bg-white/[0.5] dark:bg-gray-950/[0.5]"
  >
    <!-- content -->
    <div
      class="flex-1 flex items-center justify-between max-w-screen-2xl mx-auto px-4"
    >
      <!-- title -->
      <div>
        <slot name="title">
          <NuxtLink to="/" class="font-bold text-lg text-primary-500">
            <Icon
              :name="awesome.icon || ''"
              class="font-black text-xl font-mono mr-2 inline-block"
            />
            <span class="capitalize">{{ awesome.name }}</span>
          </NuxtLink>
        </slot>
      </div>
      <!-- menus -->
      <div
        v-if="$screen.higherThan('md', $screen.current.value)"
        class="flex space-x-4 items-center"
        :class="{ 'divide-x divide-gray-500': menus.length > 0 }"
      >
        <div class="flex space-x-4 text-sm items-center">
          <!-- dynamic menus -->
          <template v-for="(item, i) in menus" :key="i">
            <LayoutPageNavbarMenuWrapper :menu="item" />
          </template>
        </div>
        <!-- others -->
        <div class="pl-4 flex space-x-3 text-xl">
          <!-- todo: feat/localization -->
          <!-- <AwesomeLink class="text-gray-400 hover:text-gray-100">
            <Icon name="la:language" />
          </AwesomeLink> -->
          <LayoutPageNavbarDropdownThemeSwitcher />
          <AwesomeLink
            v-if="awesome?.project?.links?.github"
            class="dark:text-gray-400 text-gray-600"
            :href="awesome?.project?.links?.github"
          >
            <Icon name="mdi:github-face" />
          </AwesomeLink>
        </div>
      </div>
      <!-- drawer:btn -->
      <div
        v-else
        class="flex space-x-4 items-center"
        :class="{ 'divide-x divide-gray-500': menus.length > 0 }"
      >
        <div class="pl-4 flex space-x-3 text-xl">
          <AwesomeLink
            aria-label="Navigation Menu shows up on bottom"
            class="text-gray-400 hover:text-gray-100"
            @click.prevent="() => (showDrawer = !showDrawer)"
          >
            <Icon name="heroicons:bars-3-bottom-right-20-solid" />
          </AwesomeLink>
        </div>
      </div>
    </div>
    <!-- misc -->
    <!-- drawer -->
    <HamburgerMenu v-if="!$screen.higherThan('md', $screen.current.value) && showDrawer" @menu:close="showDrawer = !showDrawer"/>
  </header>
</template>

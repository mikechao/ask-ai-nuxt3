<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const LayoutPageSection = defineAsyncComponent(() => import('../layers/nuxt-awesome/components/layouts/Page/Section/index.vue'))
const LayoutPageWrapper = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/layouts/Page/Wrapper.vue'))
const AwesomeAlertBanner = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/awesome/AlertBanner.vue'))
const { awesome } = useAppConfig()
const userStore = useUserStore()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isSmaller: Ref<boolean> = breakpoints.smallerOrEqual("sm")
const leadingsTextStyleDefault = "font-weight: 900; display: block; font-size: 6rem; line-height: 1;"
const leadingTextStyleSM = "font-weight: 900; display: block; font-size: 3.75rem; line-height: 1;"
const leadingTextStyle = ref(leadingsTextStyleDefault)

onMounted(() => {
  isSmaller.value = breakpoints.smallerOrEqual('sm').value
})

watch(isSmaller, (value) => {
  if (value) {
    leadingTextStyle.value = leadingTextStyleSM
  } else {
    leadingTextStyle.value = leadingsTextStyleDefault
  }
}, {immediate: true})

const leadingsText = [
  {
    text: 'ASK',
    startColor: '#007CF0',
    endColor: '#00DFD8',
    delay: 0,
  },
  {
    text: 'AI',
    startColor: '#7928CA',
    endColor: '#FF0080',
    delay: 2,
  },
]

const alertTilte = computed(() => {
  if (userStore.accountExists) {
    return 'Could not login with ' + userStore.accountExists.providerUsed
  } 
  return undefined
})

const alertText = computed(() => {
  if (userStore.accountExists) {
    return 'Account with email ' + userStore.accountExists.conflictEmail + ' already exists.\nLogin with Google'
  }
  return undefined
})

function alertBannerClosed() {
  userStore.clearAccountExists()
}

onUnmounted(() => {
  userStore.clearAccountExists()
})
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex max-sm:py-0">
    <LayoutPageSection class="flex-1 flex max-sm:mb-1">
      <div class="flex-1 flex flex-col items-center justify-center max-sm:h-min">
        <AwesomeAlertBanner 
          v-if="userStore.accountExists"
          type="primary"
          :title="alertTilte"
          :text="alertText"
          @banner:closed="alertBannerClosed"
        />
        <h1 class="text-center mt-4 max-sm:mt-1">
          <span
            v-for="(item, i) in leadingsText"
            :key="i"
            :style="leadingTextStyle + `--content: '${item.text}'; --start-color: ${
              item.startColor
            }; --end-color: ${item.endColor}; --animation-name: anim-fg-${
              i + 1
            }`"
            class="animated-text-bg"
          >
            <span class="animated-text-fg">{{ item.text }}</span>
          </span>
        </h1>
        <div class="px-4 mt-6 text-center max-w-[500px] md:max-w-[600px]">
          {{
            awesome?.description ||
            'Ask AI about text, audio or an image'
          }}
        </div>
        <div class="px-4 mt-6 text-center max-w-[500px] md:max-w-[600px]">
            Guest User's AI Chatbot memory will be wiped after logging out
        </div>
        <div class="px-4 mt-6 text-center max-w-[500px] md:max-w-[600px]">
            Google/GitHub User's AI Chatbot memory will be retained after logging out
        </div>
        <div class="flex space-x-4 ml-2 mt-8 justify-center max-sm:flex-col max-sm:items-center max-sm:space-x-0 max-sm:space-y-1 max-sm:w-full max-sm:h-min">
          <AwesomeButton class="max-sm:w-4/5" href="#" @click="userStore.loginAsGuest">
            <Icon name="mdi:shield-account" class="w-5 h5"/>
            Login as Guest
          </AwesomeButton>
          <AwesomeButton class="max-sm:w-4/5" href="#" @click="userStore.loginWithGoogle">
            <Icon name="mdi:google" class="w-5 h-5 mr-1"/>
            Login with Google
          </AwesomeButton>
          <AwesomeButton class="max-sm:w-4/5" href="#" @click="userStore.loginWithGitHub">
            <Icon name="mdi:github-face" class="w-5 h-5 mr-1"/>
            Login with GitHub
          </AwesomeButton>
        </div>
      </div>
    </LayoutPageSection>
    <ModalOverlay :is-visible="userStore.isLoading"/>
  </LayoutPageWrapper>
</template>
<style lang="scss">
:root {
  --padding: 0.05em;
}

@keyframes anim-fg-1 {
  0%,
  16.667%,
  100% {
    opacity: 1;
  }
  33.333%,
  83.333% {
    opacity: 0;
  }
}
@keyframes anim-fg-2 {
  0%,
  16.667%,
  66.667%,
  100% {
    opacity: 0;
  }
  33.333%,
  50% {
    opacity: 1;
  }
}
@keyframes anim-fg-3 {
  0%,
  50%,
  100% {
    opacity: 0;
  }
  66.667%,
  83.333% {
    opacity: 1;
  }
}
.animated-text-bg {
  position: relative;
  display: block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  content: var(--content);
  display: block;
  width: 100%;
  color: theme('colors.slate.800');
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  padding-left: var(--padding);
  padding-right: var(--padding);
  &:before {
    content: var(--content);
    position: absolute;
    display: block;
    width: 100%;
    color: theme('colors.slate.800');
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    padding-left: var(--padding);
    padding-right: var(--padding);
  }
}
.animated-text-fg {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-left: var(--padding);
  padding-right: var(--padding);
  background-image: linear-gradient(
    90deg,
    var(--start-color),
    var(--end-color)
  );
  position: relative;
  opacity: 0;
  z-index: 1;
  animation: var(--animation-name) 8s infinite;
}
html.dark {
  .animated-text-bg {
    color: theme('colors.gray.100');
    &:before {
      color: theme('colors.gray.100');
    }
  }
}
</style>
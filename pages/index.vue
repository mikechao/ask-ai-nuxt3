<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
import { useFirebaseLogin } from '~/composables/useFirebaseLogin'
import type { User } from 'firebase/auth'

const AwesomeButton = defineAsyncComponent(() => import("~/layers/nuxt-awesome/components/awesome/Button/index.vue"))
const LayoutPageSection = defineAsyncComponent(() => import('../layers/nuxt-awesome/components/layouts/Page/Section/index.vue'))
const LayoutPageWrapper = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/layouts/Page/Wrapper.vue'))
const AwesomeAlertBanner = defineAsyncComponent(() => import('~/layers/nuxt-awesome/components/awesome/AlertBanner.vue'))
const { awesome } = useAppConfig()
const userStore = useUserStore()

const accountExists = ref<AccountExists>()
const isLoading = ref(false)

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
  if (accountExists.value) {
    return 'Could not login with ' + accountExists.value.providerUsed
  } 
  return undefined
})

const alertText = computed(() => {
  if (accountExists.value) {
    return 'Account with email ' + accountExists.value.conflictEmail + ' already exists.\nLogin with Google'
  }
  return undefined
})

function alertBannerClosed() {
  accountExists.value = undefined
}

onUnmounted(() => {
  accountExists.value = undefined
})

async function loginAsGuest() {
  isLoading.value = true
  const { loginAsGuest } = useFirebaseLogin()
  const user = await loginAsGuest() as User
  userStore.setUser(user)
  isLoading.value = false
}

async function loginWithGoogle() {
  isLoading.value = true
  const { accountExists: loginAccountExists, loginWithGoogle } = useFirebaseLogin()
  const user = await loginWithGoogle() as User
  userStore.setUser(user)
  if (loginAccountExists.value) {
    accountExists.value = loginAccountExists.value
  }
  isLoading.value = false
}

async function loginWithGitHub() {
  isLoading.value = true
  const { accountExists: loginAccountExists, loginWithGitHub } = useFirebaseLogin()
  const user = await loginWithGitHub() as User
  userStore.setUser(user)
  if (loginAccountExists.value) {
    accountExists.value = loginAccountExists.value
  }
  isLoading.value = false
}
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex max-sm:py-0">
    <LayoutPageSection class="flex-1 flex max-sm:mb-1">
      <div class="flex-1 flex flex-col items-center justify-center max-sm:h-min">
        <AwesomeAlertBanner 
          v-if="accountExists"
          type="primary"
          :title="alertTilte"
          :text="alertText"
          @banner:closed="alertBannerClosed"
        />
        <h1 class="text-center mt-4 max-sm:mt-1">
          <span
            v-for="(item, i) in leadingsText"
            :key="i"
            :style="`--content: '${item.text}'; --start-color: ${
              item.startColor
            }; --end-color: ${item.endColor}; --animation-name: anim-fg-${
              i + 1
            }`"
            class="animated-text-bg block font-black text-8xl max-sm:text-7xl"
          >
            <span class="animated-text-fg">{{ item.text }}</span>
          </span>
        </h1>
        <div 
          class="px-4 mt-6 text-center max-w-[600px]
          max-sm:px-2 max-sm:mt-7 max-sm:max-w-[500px]  "
        >
          {{
            awesome?.description ||
            'Ask AI about text, audio or an image'
          }}
        </div>
        <div 
          class="px-4 mt-6 text-center max-w-[600px] 
          max-sm:px-2 max-sm:mt-7 max-sm:max-w-[500px]"
        >
            Guest User's AI Chatbot memory will be wiped after logging out
        </div>
        <div 
          class="px-4 mt-6 text-center max-w-[600px] 
          max-sm:px-2 max-sm:mt-7 max-sm:max-w-[500px]  "
        >
            Google/GitHub User's AI Chatbot memory will be retained after logging out
        </div>
        <div
          class="flex space-x-4 ml-2 mt-8 justify-center 
          max-sm:flex-col max-sm:items-center max-sm:space-x-0 max-sm:space-y-1 max-sm:w-full max-sm:h-min max-sm:mt-12"
        >
          <AwesomeButton class="max-sm:w-4/5" href="#" @click="loginAsGuest">
            <Icon name="mdi:shield-account" class="w-5 h5"/>
            Login as Guest
          </AwesomeButton>
          <AwesomeButton class="max-sm:w-4/5" href="#" @click="loginWithGoogle">
            <Icon name="mdi:google" class="w-5 h-5 mr-1"/>
            Login with Google
          </AwesomeButton>
          <AwesomeButton class="max-sm:w-4/5" href="#" @click="loginWithGitHub">
            <Icon name="mdi:github-face" class="w-5 h-5 mr-1"/>
            Login with GitHub
          </AwesomeButton>
        </div>
      </div>
    </LayoutPageSection>
    <ModalOverlay :is-visible="isLoading" text="Logging in"/>
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
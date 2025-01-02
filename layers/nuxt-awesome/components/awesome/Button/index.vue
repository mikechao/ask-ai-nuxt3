<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  to: {
    type: [String, Object],
    default: undefined,
  },
  href: {
    type: String,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false
  },
  vertical: {
    type: Boolean,
    default: false
  }
})
// state:styles
const defaultStyle = computed(() =>{
  const able = (props.disabled) ? `opacity-50 cursor-not-allowed` : `cursor-pointer` 
 return able + `
  border transition-color duration-300
  focus:outline-none focus:ring-1 focus:ring-offset-1 focus:dark:ring-offset-gray-50 focus:dark:ring-gray-400 focus:ring-gray-600/[0.6] focus:ring-offset-gray-800/[0.6]
  flex items-center justify-center font-semibold
`})

const styles = reactive<{
  [key: string]: string
}>({
  none: '',
  primary: 'text-white bg-primary-500 hover:bg-primary-400 border-primary-500',
  secondary:
    'text-gray-800 bg-gray-200 border-gray-200 hover:bg-gray-300 dark:text-white dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700',
  opposite:
    'text-white bg-gray-800 hover:bg-white hover:text-gray-800 hover:border-gray-900 dark:text-gray-800 dark:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:border-white',
  danger: 'text-white bg-red-500 hover:bg-red-400 border-red-500',
})
const sizes = reactive<{
  [key: string]: string
}>({
  lg: 'h-14 px-8 text-lg rounded-lg',
  md: 'h-10 px-6 text-base rounded',
  sm: 'h-9 px-4 text-sm rounded',
  xs: 'h-6 px-3 text-xs rounded',
})
// state
const selectedStyle = computed(() =>
  props.type in styles ? styles[props.type] : styles.primary,
)
const selectedSize = computed(() => props.vertical ? 'text-sm rounded' : sizes[props.size] || sizes.lg)

const verticalStyle = computed(() => {
  return props.vertical ? 'writing-mode: vertical-rl; padding-top: 10px; padding-bottom: 10px' : ''
})

// methods
const onClick = (event: MouseEvent) => {
  const router = useRouter()
  if (props.to) {
    router.push(props.to)
  }
  if (!props.href) {
    event.preventDefault()
  }
}
</script>

<template>
  <NuxtLink
    v-if="to"
    tag="a"
    :to="to"
    :class="`${defaultStyle} ${selectedStyle} ${selectedSize}`"
    :style="verticalStyle"
  >
    <slot>{{ text }}</slot>
  </NuxtLink>
  <a
    v-else
    :class="`${defaultStyle} ${selectedStyle} ${selectedSize}`"
    :href="href"
    :style="verticalStyle"
    @click="onClick"
  >
    <slot>{{ text }}</slot>
  </a>
</template>

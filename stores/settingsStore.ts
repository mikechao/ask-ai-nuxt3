export const useSettingStore = defineStore('settingStore', () => {
  const aiMode = ref(true)
  const pirateMode = ref(false)
  const yodaMode = ref(false)

  watch(aiMode, (newValue) => {
    if (newValue) {
      pirateMode.value = false
      yodaMode.value = false
    }
  })

  watch(pirateMode, (newValue) => {
    if (newValue) {
      aiMode.value = false
      yodaMode.value = false
    }
  })

  watch(yodaMode, (newValue) => {
    if (newValue) {
      aiMode.value = false
      pirateMode.value = false
    }
  })

  return {
    aiMode,
    pirateMode,
    yodaMode
  }
})
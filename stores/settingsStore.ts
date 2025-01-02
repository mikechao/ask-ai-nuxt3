export const useSettingStore = defineStore('settingStore', () => {
  const aiMode = ref(true)
  const pirateMode = ref(false)
  const yodaMode = ref(false)

  watch(aiMode, (newValue) => {
    if (newValue) {
      pirateMode.value = false
      yodaMode.value = false
    } else if (!pirateMode.value && !yodaMode.value) {
      aiMode.value = true
    }
  })

  watch(pirateMode, (newValue) => {
    if (newValue) {
      aiMode.value = false
      yodaMode.value = false
    } else if (!aiMode.value && !yodaMode.value) {
      aiMode.value = true
    }
  })

  watch(yodaMode, (newValue) => {
    if (newValue) {
      aiMode.value = false
      pirateMode.value = false
    } else if (!aiMode.value && !pirateMode.value) {
      aiMode.value = true
    }
  })

  return {
    aiMode,
    pirateMode,
    yodaMode
  }
})
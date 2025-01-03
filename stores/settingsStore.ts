import { AIChatMode, AIMode } from "~/types/enums"

export const useSettingStore = defineStore('settingStore', () => {
  const aiMode = ref(true)
  const pirateMode = ref(false)
  const yodaMode = ref(false)
  
  const gpt4oMini = ref(true)
  const geminiPro = ref(false)

  const chatSettings = reactive({
    aiAvatarURL: './aiAvatar.webp',
    aiChatMode: AIChatMode.AI,
    aiModel: AIMode.GPT_4o_mini
  })

  watch(gpt4oMini, (newValue) => {
    if (newValue) {
      chatSettings.aiModel = AIMode.GPT_4o_mini
      geminiPro.value = false
    } else if (!geminiPro.value){
      geminiPro.value = true
    }
  })

  watch(geminiPro, (newValue) => {
    if (newValue) {
      chatSettings.aiModel = AIMode.GEMINI_PRO
      gpt4oMini.value = false
    } else if (!gpt4oMini.value){
      gpt4oMini.value = true
    }
  })

  watch(aiMode, (newValue) => {
    if (newValue) {
      pirateMode.value = false
      yodaMode.value = false
      chatSettings.aiAvatarURL = './aiAvatar.webp'
      chatSettings.aiChatMode = AIChatMode.AI
    } else if (!pirateMode.value && !yodaMode.value) {
      aiMode.value = true
    }
  })

  watch(pirateMode, (newValue) => {
    if (newValue) {
      aiMode.value = false
      yodaMode.value = false
      chatSettings.aiAvatarURL = './pirateAvatar.webp'
      chatSettings.aiChatMode = AIChatMode.Pirate
    } else if (!aiMode.value && !yodaMode.value) {
      aiMode.value = true
    }
  })

  watch(yodaMode, (newValue) => {
    if (newValue) {
      aiMode.value = false
      pirateMode.value = false
      chatSettings.aiAvatarURL = './yoda.webp'
      chatSettings.aiChatMode = AIChatMode.Yoda
    } else if (!aiMode.value && !pirateMode.value) {
      aiMode.value = true
    }
  })

  return {
    aiMode,
    pirateMode,
    yodaMode,
    gpt4oMini,
    geminiPro,
    chatSettings
  }
})
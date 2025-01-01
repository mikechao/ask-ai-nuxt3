
export const useTokenStore = defineStore('token', () => {
  const initialState = {
    textTokens: 0,
    audioTokens: 0,
    imageDescriptionTokensUsed: 0,
    imageChatTokensUsed: 0
  }

  const state = reactive({...initialState})

  const imageTokens = computed(() => {
    return state.imageDescriptionTokensUsed + state.imageChatTokensUsed
  })

  const totalTokens = computed(() => {
    return state.textTokens + 
    state.audioTokens +
    state.imageDescriptionTokensUsed +
    state.imageChatTokensUsed
  })

  function addTextTokens(tokens: number) {
    state.textTokens += tokens
  }

  function addAudioTokens(tokens: number) {
    state.audioTokens += tokens
  }

  function addImageDescriptionTokensUsed(tokens: number) {
    state.imageDescriptionTokensUsed += tokens
  }

  function addImageChatTokensUsed(tokens: number) {
    state.imageChatTokensUsed += tokens
  }

  async function reset() {
    Object.assign(state, initialState)
  }

  return {
    state, 
    totalTokens,
    imageTokens,
    reset, 
    addTextTokens, 
    addAudioTokens,
    addImageDescriptionTokensUsed,
    addImageChatTokensUsed
  }
})
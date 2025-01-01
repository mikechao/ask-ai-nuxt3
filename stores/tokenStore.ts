
export const useTokenStore = defineStore('token', () => {
  const initialState = {
    textTokens: 0,
    audioTokens: 0,
  }

  const state = reactive({...initialState})

  const totalTokens = computed(() => {
    return state.textTokens + state.audioTokens
  })

  function addTextTokens(tokens: number) {
    state.textTokens += tokens
  }

  function addAudioTokens(tokens: number) {
    state.audioTokens += tokens
  }

  async function reset() {
    Object.assign(state, initialState)
  }

  return {
    state, 
    totalTokens, 
    reset, 
    addTextTokens, 
    addAudioTokens
  }
})

export const useTokenStore = defineStore('token', () => {
  const initialState = {
    textTokens: 0,
  }

  const state = reactive({...initialState})

  const totalTokens = computed(() => {
    return state.textTokens
  })

  function addTextTokens(tokens: number) {
    state.textTokens += tokens
  }

  async function reset() {
    Object.assign(state, initialState)
  }

  return {state, reset, totalTokens, addTextTokens}
})
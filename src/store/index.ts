import { createStore } from 'vuex'

const novelManager = (window as any).novelManager

export default createStore({
  state () {
    const settings = novelManager.profileHandle.settings.get()
    const strings = settings.language === 'system' || !settings.language ? novelManager.languageToggle(navigator.language) : novelManager.languageToggle(settings.language)
    return {
      settings,
      strings
    }
  },
  getters: {
  },
  mutations: {
    languageToggle (state: any, lang: string) {
      state.settings.language = lang
    }
  },
  actions: {
    async languageToggle ({ commit, state }, lang: string) {
      try {
        state.settings = await novelManager.languageToggle(lang)
        commit('languageToggle', lang)
      } catch (err: any) {
        if (err.message.includes('no such file or directory')) {
          throw new Error('Error: no such language in languages directory!')
        }
      }
    }
  },
  modules: {
  }
})

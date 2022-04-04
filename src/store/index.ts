import { createStore } from 'vuex'
import ipcRenderer from '@/modules/ipcRenderer'

export default createStore({
  state () {
    const settings = ipcRenderer.sendSync('profileHandle.settings.get')
    const strings = settings.language === 'system' || !settings.language ? ipcRenderer.sendSync('languageToggle', navigator.language) : ipcRenderer.sendSync('languageToggle', settings.language)
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
        state.strings = state.settings.language === 'system' || !state.settings.language ? ipcRenderer.sendSync('languageToggle', navigator.language) : ipcRenderer.sendSync('languageToggle', state.settings.language)
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

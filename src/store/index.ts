import { createStore } from 'vuex'
import { ipcRenderer } from '@/modules/ipcRenderer'

export default createStore({
  state () {
    const settings = ipcRenderer.sendSync('profileHandle.settings.get')
    if (!settings.language) settings.language = 'system'
    const strings = settings.language === 'system' ? ipcRenderer.sendSync('languageToggle', navigator.language) : ipcRenderer.sendSync('languageToggle', settings.language)
    return {
      settings,
      strings,
      page: 'homepage'
    }
  },
  getters: {
  },
  mutations: {
    changePage (state: any, page: string) {
      state.page = page
    }
  },
  actions: {
    async languageToggle ({ state }: any, lang: string) {
      state.settings.language = lang
      try {
        state.strings = state.settings.language === 'system' ? ipcRenderer.sendSync('languageToggle', navigator.language) : ipcRenderer.sendSync('languageToggle', state.settings.language)
      } catch (err: any) {
        if (err.message.includes('no such file or directory')) {
          throw new Error('Error: no such language in languages directory!')
        }
      }
    },
    async changeSettings ({ state }: any, newSettings) {
      const temp = Object.assign({}, state.settings, newSettings)
      await ipcRenderer.invoke('profileHandle.settings.set', temp)
      state.settings = temp
    }
  },
  modules: {
  }
})

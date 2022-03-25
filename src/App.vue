<template>
  <nav class="navbar">
    <div class="title">
      <img src="./assets/icon.png" alt="icon" class="icon"/>
      <span class="text">Novel Manager</span>
    </div>
    <div class="button">
      <svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" @click="novelManager.windowOperation.minimize()">
        <rect fill="#fff" x="3" y="9.41869455274827" width="18.5" height="1" id="svg_1" stroke-width="2" rx="1.5" stroke="#000"></rect>
      </svg>
      <svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" @click="novelManager.windowOperation.close()">
        <rect fill="#fff" x="-2.5" y="9.5" width="24" height="1" id="svg_2" stroke="#000" stroke-width="2" rx="2" transform="rotate(45 9.5 9.91869)"></rect>
        <rect fill="#fff" x="-2.5" y="9.5" width="24" height="1" id="svg_3" stroke="#000" stroke-width="2" rx="2" transform="rotate(-45 9.5 9.91869)"></rect>
      </svg>
    </div>
  </nav>
  <aside class="sidebar">
    <sidebar-paragraph>{{ string.ui.sidebar.fetch }}</sidebar-paragraph>
    <sidebar-item id="homepage" icon="&#127968;">{{ string.ui.sidebar.homepage }}</sidebar-item>
    <sidebar-item id="bookstore" icon="&#128218;">{{ string.ui.sidebar.bookstore }}</sidebar-item>
    <sidebar-item id="search" icon="&#128270;">{{string.ui.sidebar.search}}</sidebar-item>
    <sidebar-item id="download" icon="&#11015;">{{string.ui.sidebar.download}}</sidebar-item>
    <sidebar-item id="update" icon="&#128259;">{{string.ui.sidebar.update}}</sidebar-item>
    <sidebar-paragraph>{{string.ui.sidebar.tools}}</sidebar-paragraph>
    <sidebar-item id="split" icon="&#9986;">{{string.ui.sidebar.split}}</sidebar-item>
    <sidebar-item id="adblock" icon="&#128721;">{{string.ui.sidebar.adblock}}</sidebar-item>
    <sidebar-paragraph>{{string.ui.sidebar.manage}}</sidebar-paragraph>
    <sidebar-item id="adblock" icon="&#9881;">{{string.ui.sidebar.settings}}</sidebar-item>
  </aside>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import sidebarParagraph from './components/sidebar/paragraph.vue'
import sidebarItem from './components/sidebar/item.vue'

@Options({
  components: {
    sidebarParagraph,
    sidebarItem
  },
  methods: {
    async switchLanguage (lang: string) {
      try {
        this.string = await this.novelManager.languageToggle(lang)
        this.setting.language = lang
      } catch (err: any) {
        if (err.message.includes('no such file or directory')) {
          throw new Error('Error: no such language in languages directory!')
        }
      }
    }
  },
  async created () {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.xygeng.cn/Bing/url/', true)
    xhr.send()
    xhr.onload = () => { document.getElementById('app')!.style.backgroundImage = `url(${JSON.parse(xhr.response).data})` }
    this.setting = await this.novelManager.profileHandle.settings.get()
    if (this.setting.language === 'system') {
      await this.switchLanguage(navigator.language)
    } else {
      await this.switchLanguage(this.setting.language)
    }
  },
  data () {
    (window as any).vueAPI = this
    return {
      novelManager: (window as any).novelManager,
      setting: {
        language: navigator.language
      },
      string: {
        ui: {
          sidebar: {
            fetch: 'Fetch',
            homepage: 'Homepage',
            bookstore: 'Bookstore',
            search: 'Search',
            download: 'Download',
            update: 'Update',
            tools: 'Tools',
            split: 'Split',
            adblock: 'ADBlock',
            manage: 'Manage',
            settings: 'Settings'
          }
        }
      }
    }
  }
})

export default class App extends Vue {}
</script>

<style>
/*noinspection CssUnusedSymbol*/
body {
  margin: 0;
}

#app {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  user-select: none;
  background-image: url("./assets/default-background.png");
}

.button {
  cursor: pointer;
}

.navbar {
  -webkit-app-region: drag;
  background: #5c66c0d2;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar .title .text {
  display: inline-block;
  vertical-align: middle;
  font-weight: 700;
}

.navbar .title .icon {
  margin: 7px;
  height: 27px;
  -webkit-user-drag: none;
  display: inline-block;
  vertical-align: middle;
}

.navbar .button {
  display: flex;
  align-items: stretch;
}

.navbar .button * {
  align-self: stretch;
  -webkit-app-region: no-drag;
  padding: 9px 10px;
}

.navbar .button *:hover {
  background-color: #00000022;
}

.sidebar {
  width: 240px;
  height: calc(100vh - 41px);
  background-color: #FFFFFF55;
}
</style>

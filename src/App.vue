<template>
  <nav class="navbar" @load="switchLang(language)">
    <div class="title">
      <img src="./assets/icon/icon.png" alt="icon" class="icon"/>
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
    <sidebar-paragraph>{{string.ui.sidebar.fetch}}</sidebar-paragraph>
    <sidebar-item id="homepage" icon="&#127968;">{{string.ui.sidebar.homepage}}</sidebar-item>
    <sidebar-item id="bookstore" icon="&#128218;">{{string.ui.sidebar.bookstore}}</sidebar-item>
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
    switchLang (lang: string) {
      if (!['zh-hans', 'en-us'].includes(lang)) throw new Error('unsupport language')
      this.language = lang
      if (this.language === 'zh-hans') {
        this.string = {
          ui: {
            sidebar: {
              fetch: '获取',
              homepage: '首页',
              bookstore: '书城',
              search: '搜索',
              download: '下载',
              update: '更新',
              tools: '工具',
              split: '分割',
              adblock: '去除广告',
              manage: '管理',
              settings: '设置'
            }
          }
        }
      } else if (this.language === 'en-us') {
        this.string = {
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
  },
  data () {
    (window as any).vueAPI = this
    const language = 'zh-hans'
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.xygeng.cn/Bing/url/', true)
    xhr.send()
    xhr.onload = () => { document.getElementById('app')!.style.backgroundImage = `url(${JSON.parse(xhr.response).data})` }
    xhr.onerror = () => { document.getElementById('app')!.style.backgroundImage = 'url(./asset/background/default.png)' }
    let string
    // this.switchLang(language)
    // TODO: call switch language function instead of hard code
    return {
      novelManager: (window as any).novelManager,
      string,
      language
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

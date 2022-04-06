<template>
  <nav class="navbar">
    <div class="title">
      <img src="./assets/icon.png" alt="icon" class="icon"/>
      <span class="text">Novel Manager</span>
    </div>
    <div class="button">
      <svg width="22" height="22" xmlns="http://www.w3.org/2000/svg"
           @click="ipcRenderer.send('windowOperation.minimize')">
        <rect fill="#fff" x="3" y="9.41869455274827" width="18.5" height="1" id="svg_1" stroke-width="2" rx="1.5"
              stroke="#000"/>
      </svg>
      <svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" @click="ipcRenderer.send('windowOperation.close')">
        <rect fill="#fff" x="-2.5" y="9.5" width="24" height="1" id="svg_2" stroke="#000" stroke-width="2" rx="2"
              transform="rotate(45 9.5 9.91869)"/>
        <rect fill="#fff" x="-2.5" y="9.5" width="24" height="1" id="svg_3" stroke="#000" stroke-width="2" rx="2"
              transform="rotate(-45 9.5 9.91869)"/>
      </svg>
    </div>
  </nav>
  <aside class="sidebar">
    <template v-if="page !== 'settings'">
      <SidebarParagraph>{{ strings.ui.sidebar.fetch }}</SidebarParagraph>
      <SidebarItem icon="🏠" @click="page = 'homepage'">{{ strings.ui.sidebar.homepage }}</SidebarItem>
      <SidebarItem icon="📚" @click="page = 'bookstore'">{{ strings.ui.sidebar.bookstore }}</SidebarItem>
      <SidebarItem icon="🔎" @click="page = 'search'">{{ strings.ui.sidebar.search }}</SidebarItem>
      <SidebarItem icon="⬇" @click="page = 'download'">{{ strings.ui.sidebar.download }}</SidebarItem>
      <SidebarItem icon="🔄" @click="page = 'update'">{{ strings.ui.sidebar.update }}</SidebarItem>
      <SidebarParagraph>{{ strings.ui.sidebar.tools }}</SidebarParagraph>
      <SidebarItem icon="✂" @click="page = 'split'">{{ strings.ui.sidebar.split }}</SidebarItem>
      <SidebarItem icon="🛑" @click="page = 'adblock'">{{ strings.ui.sidebar.adblock }}</SidebarItem>
      <SidebarParagraph>{{ strings.ui.sidebar.manage }}</SidebarParagraph>
      <SidebarItem icon="⚙" @click="page = 'settings'">{{ strings.ui.sidebar.settings }}</SidebarItem>
    </template>
<!-- TODO: settings page -->
  </aside>
  <main class="main">
    <div id="homepage" v-if="page === 'homepage'">
      <div class="fast-update">
        <div class="title">
          <div>
            <span v-pre class="icon">⏩</span>
            <span class="text">{{ strings.ui.main.fastUpdate }}</span>
          </div>
          <div class="refresh clickable" @click="loadUpdatingBooks(true)" v-if="store.state.settings.booksPath">
            <span class="text">{{ strings.ui.main.refresh }}</span>
            <span v-pre class="icon">🔄</span>
          </div>
        </div>
        <div class="content">
          <template v-if="store.state.settings.booksPath">
            <MessageboxAsItem v-if="!updatingBooks.length" class="item wide" icon="🛒">
              {{ strings.ui.main.errors.noBooksIsUpdating }}
            </MessageboxAsItem>
            <template v-else v-for="(v, i) of updatingBooks" :key="i">
              <LoadingNotice v-if="!v?.status" class="item"></LoadingNotice>
              <MessageboxAsItem v-else-if="v.status === 'ERROR'" class="item" @click="reloadBook(i)">
                {{ strings.ui.main.errors.novelInfoGettingError.replace('${name}', v.name) }}
              </MessageboxAsItem>
              <FastUpdateItem v-else :book="v"/>
            </template>
            <p v-for="i of [0, 1, 2, 3]" class="fill" :key="i"></p>
          </template>
          <MessageboxAsItem class="item wide" v-else @click="selectBooksPath">
            {{ strings.ui.main.errors.noBooksPath }}
          </MessageboxAsItem>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, getCurrentInstance } from 'vue'
import { useStore, Store } from 'vuex'
import SidebarParagraph from '@/components/sidebar/paragraph.vue'
import SidebarItem from '@/components/sidebar/item.vue'
import LoadingNotice from '@/components/main/loading.vue'
import MessageboxAsItem from '@/components/main/messageboxAsItem.vue'
import FastUpdateItem from '@/components/main/fastUpdateItem.vue'
import { ipcRenderer } from '@/modules/ipcRenderer'
import { BookDetail, BookSummary } from '@/modules/booksHandle'

const store: Store<any> = useStore()
const strings = computed<any>(() => store.state.strings)
const page = computed<string>({
  get () {
    return store.state.page
  },
  set (p) {
    store.commit('changePage', p)
  }
})

const updatingBooks: Array<BookDetail | undefined> = reactive([])

function languageToggle (lang: string): void {
  store.dispatch('languageToggle', lang)
}

async function loadUpdatingBooks (force = false) {
  updatingBooks.length = 0
  const summaries = await ipcRenderer.invoke('profileHandle.updatingBooks.summaries')
  updatingBooks.length = summaries.length
  summaries.forEach(async (v: BookSummary, i: number) => {
    try {
      updatingBooks[i] = await ipcRenderer.invoke('profileHandle.updatingBooks.single', v.uuid, force)
    } catch (e) {
      console.error(e)
      updatingBooks[i] = {
        name: v.name,
        uuid: v.uuid,
        author: undefined,
        status: 'ERROR',
        category: undefined,
        updateTime: undefined,
        updateTimestamp: v.updateTimestamp,
        description: undefined,
        cover: undefined,
        wordCount: undefined,
        content: []
      }
    }
  })
}

async function reloadBook (index:number) {
  try {
    updatingBooks[index]!.status = undefined
    updatingBooks[index] = await ipcRenderer.invoke('profileHandle.updatingBooks.single', updatingBooks[index]!.uuid, true)
  } catch (e) {
    console.error(e)
    updatingBooks[index]!.status = 'ERROR'
  }
}

async function selectBooksPath () {
  const raw = await ipcRenderer.invoke('dialogHandle.selectBooksPath')
  if (!raw.canceled) {
    await store.dispatch('changeSettings', {
      booksPath: raw.filePaths[0]
    })
  }
}

onMounted(async () => {
  if (store.state.settings.isDevelopment) {
    (window as any).vueAPI = (getCurrentInstance() as any).setupState
    languageToggle(store.state.settings.language)
  }
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://api.xygeng.cn/Bing/url/', true)
  xhr.send()
  xhr.onload = () => {
    document.getElementById('app')!.style.backgroundImage = `url(${JSON.parse(xhr.response).data})`
  }
  document.getElementById('app')!.onerror = () => {
    document.getElementById('app')!.style.backgroundImage = 'url("./assets/default-background.png");'
  }
  loadUpdatingBooks()
})
</script>

<style>
.clickable {
  cursor: pointer;
}

/*noinspection CssUnusedSymbol*/
body {
  margin: 0;
  overflow-x: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  user-select: none;
  -webkit-user-drag: none;
  background-image: url("./assets/default-background.png");
  display: grid;
  grid-template-areas: "navbar navbar" "sidebar main";
  grid-template-columns: 240px 1fr;
  grid-template-rows: 41px 1fr;
}

.button {
  cursor: pointer;
}

.navbar {
  -webkit-app-region: drag;
  grid-area: navbar;
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
  grid-area: sidebar;
  background-color: #FFFFFF55;
}

.main {
  grid-area: main;
}

#homepage {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.fast-update {
  display: flex;
  flex-direction: column;
}

.fast-update .title {
  margin: 5px;
  background: #FFF;
  border-radius: 3px;
  height: 23px;
  box-shadow: 2px 2px 3px #383838;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.fast-update .title .text {
  font-size: 15px;
  font-weight: 600;
  text-shadow: 1px 1px 3px #9f9f9f;
}

.fast-update .title .refresh {
  background: #CCC;
  margin: 1px;
  padding: 0 0 0 5px;
  border-radius: 3px;
}

.fast-update .content {
  transition: all 1s ease;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.fast-update .content .item {
  width: 300px;
  margin: 4px 7px;
  padding: 10px;
  align-items: center;
  flex-grow: 1;
  border-radius: 3px;
  background: #FFF;
  box-shadow: 2px 2px 5px #383838;
}

.item.wide {
  height: 30vh;
}

.fast-update .content .fill {
  width: 300px;
  flex-grow: 1;
  margin: 0 18px;
  height: 0;
}
</style>

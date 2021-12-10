<template>
  <div id="main-warp">
    <!-- style="{ backgroundImage: BackgroundImage }" -->
    <!-- <img src="./assets/RE4pdF1.png" alt="" class="image_link"/>-->
    <!-- <img src="./assets/RE4wE9C.png" alt="" class="image_link"/>-->
    <!-- <img src="./assets/RE4wqHL.png" alt="" class="image_link"/>-->

    <nav id="navbar">
      <div id="navbar-logo">
        <img src="./assets/icon.png" alt="icon" id="navbar-logo-icon">
        Novel Manager
      </div>
      <div id="navbar-button">
        <span id="navbar-button-min" @click="close_window" class="clickable">&#8212;</span>
        <span id="navbar-button-close" @click="minimize_window" class="clickable">&#10006;</span>
      </div>
    </nav>

    <aside id="sidebar">
      <ul id="sidebar-list">
        <Paragraph>&nbsp;&nbsp;获取</Paragraph>
        <Item icon="&#127968;" id="homepage">&nbsp;首页</Item>
        <Item icon="&#128218;" id="bookshop">&nbsp;书城</Item>
        <Item icon="&#128270;" id="search">搜索</Item>
        <Item icon="&#128315;" id="download">下载</Item>
        <Item icon="&#128260;" id="update">更新</Item>
        <Paragraph>&nbsp;&nbsp;工具</Paragraph>
        <Item icon="&#9986;" id="split">分割</Item>
        <Item icon="&#128721;" id="adblock">去除广告</Item>
        <Paragraph>&nbsp;&nbsp;管理</Paragraph>
        <Item icon="&#9881;" id="adblock">设置</Item>
      </ul>
    </aside>

    <div id="main-page">
      <div id="main-page-fast-update-title" class="clickable-list-title">&#9193;快捷更新</div>
      <div id="main-page-fast-update-container" class="clickable-list-container">
        <FastUpdateItem v-for="index in serializingNovelArray" :key="`main-page-fast-update-item-${index}`"
                        :cover="serializingNovelArray[index]">

        </FastUpdateItem>
        <p v-for="_ of [1, 2, 3, 4]" class="clickable-list-fill" :key="_"></p>
      </div>
    </div>
  </div>
</template>
<script>
import Item from './components/Sidebar/Item'
import Paragraph from './components/Sidebar/Paragraph'
import FastUpdateItem from './components/MainPage/Home/FastUpdateItem'

export default {
  components: {
    Item,
    Paragraph,
    FastUpdateItem
  },
  data () {
    window.vueAPI = this;
    (async () => {
      this.serializingNovelArray = await window.electron.getSerializingNovel()
    })()
    return {
      serializingNovelArray: undefined
    }
  },
  methods: {
    close_window () {
      window.electron.windowOperation.minimize()
    },
    minimize_window () {
      window.electron.windowOperation.close()
    }
  },
  computed: {}
}
</script>

<style lang="scss">
#main-warp {
  display: grid;
  height: 100%;
  grid-template-areas:
  "navbar navbar"
  "sidebar main-page";
  grid-template-columns: 200px 1fr;
  grid-template-rows: 40px calc(100vh - 40px);
  transition: background 2s;
  background-image: url("./assets/RE4pdF1.png");
}

#navbar {
  -webkit-app-region: drag;
  grid-area: navbar;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #5c66c0d2;
}

#navbar-logo {
  padding: 5px 10px 5px 10px;
  transition: all 0.1s ease;
  font-size: 15px;
  font-weight: 600;
  font-family: '微软雅黑', sans-serif;
  color: #000;
}

#navbar-logo-icon {
  height: 20px;
  width: 19.7px;
  vertical-align: middle
}

#navbar-button {
  transition: all 0.15s ease;
  font-weight: 600;
  font-family: '微软雅黑', sans-serif;
  color: #000;
  align-items: center;
  -webkit-app-region: no-drag;
}

#navbar-button-close:hover, #navbar-button-min:hover {
  background: #00000021;
}

#navbar-button-min {
  padding: 8px 11px;
  font-size: 18px;
}

#navbar-button-close {
  padding: 7px 11px;
  font-size: 19px;
}

#sidebar {
  grid-area: sidebar;
  background: #ffffff56;
  //height: calc(100vh - 40px);
}

#sidebar-list {
  padding: 0;
  list-style: none;
  margin: 6px 0;
}

#main-page {
  grid-area: main-page;
  display        : flex;
  justify-content: flex-start;
  align-items    : stretch;
  flex-direction : column;
  overflow-y     : scroll;
  overflow-x     : hidden;
}

.image_link {
  display: none;
}

.clickable {
  cursor: pointer;
}

.clickable-list-title {
  border-radius: 5px;
  background   : #0000002c;
  margin       : 4px 6px;
  padding      : 6px 10px 8px;
  font-size    : 17px;
  font-weight  : 550;
  font-family  : '微软雅黑', sans-serif;
  color        : #000;
  text-shadow  : 2px 2px 2px #929292;
}

.clickable-list-container {
  transition    : all 1s ease;
  display       : flex;
  flex-direction: row;
  flex-wrap     : wrap;
}

.clickable-list-fill {
  width    : 300px;
  flex-grow: 1;
  margin   : 0 18px;
  height   : 0;
}

</style>

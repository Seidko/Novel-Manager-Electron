<!--suppress HtmlUnknownTag -->
<template>
  <aside id="sidebar">
    <ul id="sidebar-list">
      <li v-for="(item, item_index) in sidebar_item_list"
          :key="item_index"
          :class="{ clickable: item.type === 'item', 'sidebar-list-item': item.type === 'item', 'sidebar-list-para': item.type === 'para' }"

          @click="console.log(item)">
        <span v-if="item.type === 'para'">
          <span v-html="item.text"></span>
          <hr class="sidebar-span-hr"/>
        </span>
        <span v-if="item.type === 'item'">
          <span class="sidebar-list-icon" v-html="item.icon"></span>
          <span class="sidebar-list-text" v-html="item.text"></span>
        </span>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data () {
    return {
      sidebar_item_list: [
        { type: 'para', text: '&nbsp;&nbsp;获取' },
        { type: 'item', id: 'homepage', icon: '&#127968;', text: '&nbsp;首页' },
        { type: 'item', id: 'bookshop', icon: '&#128218;', text: '&nbsp;书城' },
        { type: 'item', id: 'search', icon: '&#128270;', text: '搜索' },
        { type: 'item', id: 'download', icon: '&#128315;', text: '下载' },
        { type: 'item', id: 'update', icon: '&#128260;', text: '更新' },
        { type: 'para', text: '&nbsp;&nbsp;工具' },
        { type: 'item', id: 'split', icon: '&#9986;', text: '分割' },
        { type: 'item', id: 'adblock', icon: '&#128721;', text: '去除广告' },
        { type: 'para', text: '&nbsp;&nbsp;管理' },
        { type: 'item', id: 'settings', icon: '&#9881;', text: '设置' }
      ]
    }
  }
}
</script>

<style lang="scss">
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

.sidebar-list-item {
  transition: all 0.1s ease;
  padding: 4px 0;
  font-size: 17px;
  font-weight: 600;
  font-family: '微软雅黑', sans-serif;
  color: #000;
}

.sidebar-list-item:hover {
  background: #00000021;
}

.sidebar-list-para {
  font-size: 12px;
  color: #313131;
  font-weight: 600;
  font-family: '微软雅黑', sans-serif;
}

.sidebar-span-hr {
  height: 1px;
  background: #525252;
  border: 0;
  margin: 2px 4px;
}

.sidebar-list-icon {
  font-size: 33px;
  text-shadow: 3px 3px 5px #646464;
  font-family: 'Segoe UI Emoji', serif;
}

.sidebar-list-text {
  padding: 10px;
  vertical-align: super;
  text-shadow: 2px 2px 2px #929292;
}
</style>

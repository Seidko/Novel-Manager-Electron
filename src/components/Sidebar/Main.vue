<!--suppress HtmlUnknownTag -->
<template>
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
</template>

<script>
import Item from './Item'
import Paragraph from './Paragraph'

export default {
  name: 'Sidebar',
  components: { Item, Paragraph },
  data () {
    return {}
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
</style>

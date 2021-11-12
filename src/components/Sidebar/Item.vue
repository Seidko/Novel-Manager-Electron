<template>
  <li :id="id" class="sidebar-list-item">
    <span class="sidebar-list-icon" v-html="icon"></span>
    <span class="sidebar-list-text">
      <slot>
        <p style="background-color: red">Something Error Happened</p>
      </slot>
    </span>
  </li>
</template>

<script>
export default {
  name: 'Item',
  props: {
    icon: String,
    id: String
  }
}
</script>

<style lang="scss">
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

<template>
  <li class="sidebar-list-para">
    <slot>
      <p style="background-color: red">Something Error Happened</p>
    </slot>
    <div class="sidebar-span-hr"></div>
  </li>
</template>

<script>
export default {
  name: 'Paragraph'
}
</script>

<style lang="scss">
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
</style>

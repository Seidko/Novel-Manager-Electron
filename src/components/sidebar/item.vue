<template>
  <div>
    <span class="icon" v-html="props.icon ? props.icon : ''" />
    <span class="text">
      <slot>
        <span style="background-color: red">Something Error Happened</span>
      </slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  icon?: string
}>()
</script>

<style scoped>
div {
  transition: all 0.1s ease;
  padding: 4px 0;
}

div:hover {
  background: #00000021;
}

.icon {
  font-size: 33px;
  text-shadow: 3px 3px 5px #646464;
  font-family: 'Segoe UI Emoji', serif;
}

.text {
  font-size: 17px;
  font-weight: 600;
  font-family: '微软雅黑', sans-serif;
  color: #000;
  padding: 10px;
  vertical-align: super;
  text-shadow: 2px 2px 2px #929292;
}
</style>

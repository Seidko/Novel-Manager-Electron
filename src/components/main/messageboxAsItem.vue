<template>
  <div class="row">
    <div class="column">
      <p class="icon" v-html="props.icon ? props.icon : '❌'" />
      <b class="text"><slot/></b>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon?: string
}>()
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
}

.column {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  margin: 5px;
  font-size: 32px;
  text-shadow: 2px 2px 2px #b3b3b3;
}

.text {
  font-size: 17px;
  font-weight: 700;
  color: #e70e00;
  text-shadow: 2px 2px 2px #b3b3b3;
  text-align: center;
}

</style>

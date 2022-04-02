<template>
  <div class="item clickable">
    <img class="cover" :src="props.book.cover" alt="cover"/>
    <span class="name">{{ props.book.name }}</span>
    <span class="info">
        {{ props.book.author }}
        {{ props.book.category ? "| " + props.book.category : "" }}
        {{ props.book.status ? "| " + props.book.status : "" }}
        {{ props.book.updateTime ? "| " + props.book.updateTime : "" }}
    </span>
    <span class="newest-chapter">{{ props.book.content[props.book.content.length - 1][1] }}</span>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
const props = defineProps(['book'])

</script>

<style scoped>
.item {
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 46px 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 3px 5px;
}

.name {
  grid-row: 1;
  grid-column-start: 2;
  grid-column-end: 5;
  font-size: 15px;
  font-weight: 700;
  color: #333;
  user-select: text;
  cursor: text;
}

.info {
  grid-row: 2;
  grid-column-start: 2;
  grid-column-end: 5;
  font-size: 11px;
  font-weight: 700;
  color: #555
}

.cover {
  -webkit-user-drag: none;
  width: 46px;
  height: 61px;
  grid-row-start: 1;
  grid-row-end: 4;
}

.newest-chapter {
  grid-row: 3;
  grid-column-start: 2;
  grid-column-end: 5;
  font-size: 11.5px;
  font-weight: 700;
  color: #464646
}
</style>

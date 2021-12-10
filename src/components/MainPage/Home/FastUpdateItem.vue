<template>
  <div class="clickable-list-item">
    <slot name="">
      <img src="../../../assets/default_book_cover.png" alt="default cover" />
    </slot>
  </div>
</template>

<script>
export default {
  name: 'FastUpdateItem',
  props: {
    author: String,
    category: String,
    status: String,
    words_count: Number,
    cover: String
  }
}
</script>

<style lang="scss">
.clickable-list-item {
  transition : all 0.1s ease;
  width        : 300px;
  margin       : 4px 8px;
  padding      : 10px;
  align-items  : center;
  border-radius: 5px;
  background   : #FFF;
  flex-grow    : 1;
  box-shadow   : 5px 5px 5px #00000059;
}
</style>

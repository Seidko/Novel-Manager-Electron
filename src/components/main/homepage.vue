<template>
  <div id="homepage">
    <div class="fast-update">
      <div class="title">
        <span>{{}}</span>
      </div>
      <div class="content"></div>
    </div>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {},
  inject: {
    string: Object
  }
})

export default class item extends Vue {}
</script>

<style scoped>
#homepage {
  display: flex;
  flex-direction: column
}

.fast-update .title {
  margin: 5px;
  background: #FFF;
  height: 20px;
  border-radius: 3px;
}
</style>

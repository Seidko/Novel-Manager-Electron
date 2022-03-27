<!--suppress JSUnresolvedVariable -->
<template>
  <div id="homepage">
    <div class="fast-update">
      <div class="title">
        <span v-pre class="icon">⏩</span>
        <span class="text">{{ strings.ui.main.fastUpdate }}</span>
      </div>
      <div class="content"></div>
    </div>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {},
  computed: {
    strings () {
      return this.$store.state.strings
    }
  }
})

export default class item extends Vue {}
</script>

<style scoped>
#homepage {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.fast-update {
  display: flex;
  flex-direction: column;
}

.fast-update .title {
  margin: 5px;
  background: #FFF;
  border-radius: 3px;
  height: 23px;
  box-shadow: 2px 2px 3px #383838;
}

.fast-update .title .text {
  font-size: 15px;
  font-weight: 600;
  text-shadow: 1px 1px 3px #9f9f9f;
}
</style>

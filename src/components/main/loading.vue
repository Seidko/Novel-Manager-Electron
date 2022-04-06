<template>
  <div class="row">
    <div class="column">
      <div class="animation"/>
      <div class="text">
        <slot>
          {{ strings.ui.main.loading }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const strings = computed<any>(() => store.state.strings)
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

.animation {
  margin: 5px 0 0 0;
  height: 0;
  width: 0;
  animation: loading1 0.8s cubic-bezier(0.54, 0.21, 0.41, 0.8) infinite;
  border-radius: 20px;
  padding: 15px;
  background: transparent;
  border: 4px solid #666666;
  border-top-color: #000000;

}

@keyframes loading1 {
  to {
    transform: rotate(360deg);
  }
}

.text {
  font-size: 17px;
  font-weight: 700;
  color: #272727;
  text-shadow: 2px 2px 2px #b3b3b3;
}
</style>

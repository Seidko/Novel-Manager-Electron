<template>
 <div>
   <p class="paragraph">
     <slot>
       <span style="background-color: red">Something Error Happened</span>
     </slot>
   </p>
   <div class="line"></div>
 </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class Paragraph extends Vue {}
</script>

<style scoped>
.paragraph {
  font-size: 12px;
  color: #313131;
  font-weight: 600;
  font-family: '微软雅黑', sans-serif;
  padding: 3px 0 0 10px;
  margin: 0;
}

.line {
  height: 1px;
  background: #525252;
  border: 0;
  margin: 2px 4px;
}
</style>

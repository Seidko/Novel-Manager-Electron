<template>
  <div class="error">
    <p class="icon">❌</p>
    <b class="text"><slot/></b>
  </div>
</template>

<style scoped>

.error {
  display: flex;
  flex-direction: column;
}

.icon {
  margin: 5px;
  font-size: 32px;
  text-shadow: 2px 2px 2px #b3b3b3;
}

.text {
  font-size: 17px;
  font-weight: 700;
  color: #F00;
  text-shadow: 2px 2px 2px #b3b3b3;
  text-align: center;
}

</style>

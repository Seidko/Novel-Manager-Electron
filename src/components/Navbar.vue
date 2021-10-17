<template>
  <nav id="navbar">
    <div id="navbar-logo">
      <img src="../assets/favicon.png" alt="icon" id="navbar-logo-icon">
      Novel Manager
    </div>
    <div id="navbar-button">
      <span id="navbar-button-min" @click="close_window" class="clickable">&#8212;</span>
      <span id="navbar-button-close" @click="minimize_window" class="clickable">&#10006;</span>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    close_window () {
      console.log('minimize')
    },
    minimize_window () {
      console.log('close')
    }
  }
}
</script>

<style lang="scss">
#navbar {
  -webkit-app-region: drag;
  grid-area: navbar;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #5c66c0d2;
}

#navbar-logo {
  padding: 5px 10px 5px 10px;
  transition: all 0.1s ease;
  font-size: 15px;
  font-weight: 600;
  font-family: '微软雅黑', sans-serif;
  color: #000;
}

#navbar-logo-icon {
  height: 20px;
  width: 19.7px;
  vertical-align: middle
}

#navbar-button {
  transition: all 0.15s ease;
  font-weight: 600;
  font-family: '微软雅黑', sans-serif;
  color: #000;
  align-items: center;
  -webkit-app-region: no-drag;
}

#navbar-button-close:hover, #navbar-button-min:hover {
  background: #00000021;
}

#navbar-button-min {
  padding: 8px 11px;
  font-size: 18px;
}

#navbar-button-close {
  padding: 7px 11px;
  font-size: 19px;
}

</style>

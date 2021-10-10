<template :style="{backgroundImage: BackgroundImage}">
  <Navbar></Navbar>
  <Sidebar></Sidebar>
  <MainPage></MainPage>
</template>

<script>
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import MainPage from './components/MainPage'

const BackgroundList = [
  './assets/RE4wqHL.png',
  './assets/RE4pdF1.png',
  './assets/RE4wE9C.png'
]

export default {
  components: { MainPage, Sidebar, Navbar },
  data () {
    return {
      BackgroundImage: BackgroundList[Math.floor(Math.random() * BackgroundList.length)]
    }
  },
  methods: {}
}
</script>

<style lang="scss">

#main-warp {
  display: grid;
  grid-template-areas:
  "navbar navbar"
  "sidebar main-page";
  grid-template-columns: 200px 1fr;
  grid-template-rows: 40px 1fr;
}

#main-page {
  grid-area: main-page;
  height: calc(100vh - 40px);
}

</style>

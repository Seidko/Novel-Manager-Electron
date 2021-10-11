<template>
  <div id="main-warp" :style="{ backgroundImage: BackgroundImage }">
    <img src="./assets/RE4pdF1.png" alt="" class="image_link"/>
    <img src="./assets/RE4wE9C.png" alt="" class="image_link"/>
    <img src="./assets/RE4wqHL.png" alt="" class="image_link"/>
    <Navbar></Navbar>
    <Sidebar></Sidebar>
    <MainPage></MainPage>
  </div>
</template>
<script>
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import MainPage from './components/MainPage'

export default {
  components: { MainPage, Sidebar, Navbar },
  data () {
    setTimeout(() => {
      // for (const i in this.$el) {
      //   console.log(i)
      // }
      let temp1 = this.$el.getElementsByClassName('image_link')
      console.log(temp1)
      temp1 = temp1[Math.floor(Math.random() * temp1.length)].currentSrc
      console.log(temp1)
      this.$data.BackgroundImage = "url('" + temp1 + "')"
      console.log(this.$data.BackgroundImage)
    }, 1)
    return {
      BackgroundImage: null
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

.image_link {
  visibility: hidden;
  height: 0;
  width: 0;
}

</style>

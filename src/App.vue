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
// import { DebuggerOptions, Ref } from 'vue'

export default {
  components: { MainPage, Sidebar, Navbar },
  data () {
    window.vueAPI = this
    setTimeout(() => {
      // TODO: 将要替换为vuex结构
      for (const i in this.$el.getElementsByClassName('image_link')) {
        const temp1 = this.$el.getElementsByClassName('image_link')
        this.BackgroundImageList.push(temp1[i].src)
      }
      this.BackgroundImage = `url(${this.BackgroundImageList[Math.floor(Math.random() * this.BackgroundImageList.length)]})`
    }, 10)
    return {
      BackgroundImage: 'url()',
      BackgroundImageList: [],
      TemporaryValue: {
        BackgroundUpdater: 0,
        BackgroundUpdateTime: 60000
      }
    }
  },
  methods: {},
  computed: {}
}
</script>

<style lang="scss">
#main-warp {
  display: grid;
  height: 100%;
  grid-template-areas:
  "navbar navbar"
  "sidebar main-page";
  grid-template-columns: 200px 1fr;
  grid-template-rows: 40px calc(100vh - 40px);
  transition: background 2s;
}

.image_link {
  display: none;
}

.clickable {
  cursor: pointer;
}

</style>

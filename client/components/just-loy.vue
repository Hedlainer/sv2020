<template>
  <div
    ref="gallery"
    class="gallery"
  >
    <div
      v-for="image in GetjustifiedLayout.boxes"
      :key="image.name"
      class="image_wrap"
      :style="{
        transform: `translate(${Math.floor(image.left + Math.random() * width/100*1)}px,
        ${ Math.floor(image.top +Math.random() * width/100*2)}px)`,
        width : `${Math.floor(image.width + Math.random() * width/100*1)}px`,
        height : `${Math.floor(image.height + Math.random() * height/100*1)}px`,
      }"
    >
      <lazyPicture :file="image.SeriesFileName" :width="image.width" />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import justifiedLayout from 'justified-layout'
let width, height, widthContainer
if (process.browser) {
  height = window.innerHeight
  width = window.innerWidth
  if (width / height < 1) {
    widthContainer = width * 0.05
  } else {
    widthContainer = width * 0.125
  }
}

export default {
  components: {
    lazyPicture: () => import('~/components/lazy-picture.vue')
  },
  data () {
    return {
      width,
      height,
      widthContainer
    }
  },
  computed: {
    GetjustifiedLayout () {
      const layout = justifiedLayout(this.$store.state.SeriesAspect, {
        fullWidthBreakoutRowCadence: 3,
        targetRowHeight: (this.height / 100) * 55,
        containerWidth: this.width,
        containerPadding: {
          top: 10,
          right: this.widthContainer,
          bottom: 10,
          left: this.widthContainer
        },
        boxSpacing: {
          horizontal: (this.width / 100) * 4,
          vertical: (this.height / 100) * 8
        }
      })
      layout.boxes.forEach((element, index) => {
        element.SeriesFileName = this.$store.state.SeriesFileName[index]
        element.SeriesSpec = this.$store.state.SeriesSpec[index]
      })
      return layout
    }
  },
  beforeMount () {
    window.addEventListener('resize', debounce(this.resize, 400))
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },

  methods: {
    resize () {
      this.width = window.innerWidth
      this.height = window.innerHeight
      if (this.width / this.height < 1) {
        this.widthContainer = this.width * 0.05
      } else {
        this.widthContainer = this.width * 0.125
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gallery {
  position: relative;
  padding-bottom: 5vh;
  height: auto;
}
.image_wrap {
  position: absolute;
  overflow: hidden;
  border-radius: 4px;
  transition: transform 1s;
  box-shadow: inset 0px 0px 0px 1px #03a9f4;
}
</style>

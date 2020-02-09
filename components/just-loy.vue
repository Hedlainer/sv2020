<template>
  <client-only>
    <div
      ref="gallery"
      class="gallery"
      :style="{
        height : `${GetjustifiedLayout.containerHeight}px`,
        width : `${wc}px`}"
    >
      <div
        v-for="image in GetjustifiedLayout.boxes"
        :key="image.name"
        class="image_wrap"
        :style="{
          transform: `translate(${Math.floor(image.left + Math.random() * nw/100*1)}px, ${ Math.floor(image.top +Math.random() * nw/100*2)}px)`,
          width : `${Math.floor(image.width + Math.random() * nw/100*1)}px`,
          height : `${Math.floor(image.height + Math.random() * nh/100*1)}px`,
        }"
      >
        <lazyPicture :file="image.name" :width="image.width" />
      </div>
    </div>
  </client-only>
</template>

<script>
import debounce from 'lodash/debounce'
import justifiedLayout from 'justified-layout'
let width
if (process.browser) {
  width = window.innerWidth
}
export default {
  components: {
    lazyPicture: () => import('~/components/lazy-picture.vue')
  },

  data () {
    return {
      width,
      nw: null,
      nh: null,
      wc: null
    }
  },
  computed: {
    GetjustifiedLayout () {
      const layout = justifiedLayout(this.$store.state.aspectJL, {
        fullWidthBreakoutRowCadence: 3,
        targetRowHeight: (this.nh / 100) * 55,
        containerWidth: this.wc,
        containerPadding: {
          top: 100,
          right: 0,
          bottom: 100,
          left: 0
        },
        boxSpacing: {
          horizontal: (this.nw / 100) * 4,
          vertical: (this.nh / 100) * 8
        }
      })
      layout.boxes.forEach((element, index) => {
        element.name = this.$store.state.nameJL[index]
      })
      return layout
    }
  },
  beforeMount () {
    this.resize()
    window.addEventListener('resize', debounce(this.resize, 200))
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },

  methods: {
    resize () {
      this.nw = window.innerWidth
      this.nh = window.innerHeight
      if (this.nw / this.nh < 1) {
        this.wc = this.nw * 0.9
      } else {
        this.wc = this.nw * 0.75
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gallery {
  position: relative;
  margin: auto;
}
.image_wrap {
  position: absolute;
  overflow: hidden;
  border-radius: 4px;
  transition: transform 1s;
  box-shadow: inset 0px 0px 0px 1px #03a9f4;
}
</style>

<template>
  <div
    class="gallery"
  >
    <div class="preview">
      <picture class="lazy__fullscreen">
        <source
          :srcset="`/image/webp/1920/${$store.state.Series.Cover.Name}.webp`"
          type="image/webp"
        />
        <img
          alt="SvobodinaPhoto"
          crossorigin="anonimous"
          decode="async"
          draggable="false"
          :src="`/image/jpg/1920/${$store.state.Series.Cover.Name}.jpg`"
        />
      </picture>
    </div>
    <lazypicture
      v-for="(image, index) in GetjustifiedLayout.boxes"
      :key="image.SeriesFileName"
      class="anim"
      :color="image.SeriesSpec.Color"
      :current-width="image.width"
      :file="image.SeriesFileName"
      :full-screen-image="false"
      :my-index="index"
      :style="layoutStyle (image)"
    />
  </div>
</template>

<script>
/* eslint-disable security/detect-object-injection */
// import apicture from '~/components/apicture.vue'
import anime from 'animejs'
import debounce from 'lodash/debounce'
import justifiedLayout from 'justified-layout'
let width, height, widthContainer
if (process.browser) {
  height = window.innerHeight
  width = window.innerWidth
  if (width / height < 1) {
    widthContainer = width * 0.03
  } else {
    widthContainer = width * 0.125
  }
}

export default {
  data () {
    return {
      width,
      height,
      widthContainer
    }
  },
  computed: {
    GetjustifiedLayout () {
      // eslint-disable-next-line array-func/prefer-array-from
      const layout = justifiedLayout([...this.$store.state.Series.Aspect], {
        fullWidthBreakoutRowCadence: 3,
        targetRowHeight: (this.height / 100) * 55,
        containerWidth: this.width,
        containerPadding: {
          top: 10,
          right: this.widthContainer,
          bottom: 100,
          left: this.widthContainer
        },
        boxSpacing: {
          horizontal: this.width * 0.04,
          vertical: this.height * 0.08
        }
      })
      layout.boxes.forEach((element, index) => {
        element.SeriesFileName = this.$store.state.Series.ImageName[index]
        element.SeriesSpec = this.$store.state.Series.Spec[index]
      })
      return layout
    }
  },
  mounted () {
    anime({
      targets: '.anim',
      easing: 'linear',
      opacity: [0, 1],
      translateX: () => anime.random(-window.innerWidth * 0.017, window.innerWidth * 0.017),
      translateY: () => anime.random(-window.innerHeight * 0.03, window.innerHeight * 0.03)
    })
    anime({
      duration: 2000,
      targets: '.preview',
      easing: 'linear',
      opacity: [1, 0.2],
      filter: 'grayscale(100%)'
      // update (anim) {
      //   anim.animatables[0].target.style.filter = 'blur(' + 20 * anim.progress / 100 + 'px)'
      //   console.log(anim)
      // }
      // translateX: () => anime.random(-window.innerWidth * 0.017, window.innerWidth * 0.017),
      // translateY: () => anime.random(-window.innerHeight * 0.03, window.innerHeight * 0.03)
    })
  },
  beforeMount () {
    window.addEventListener('resize', debounce(this.resize, 400))
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },

  methods: {
    layoutStyle (image) {
      return {
        left: `${image.left}px`,
        top: `${image.top}px`,
        width: `${image.width}px`,
        height: `${image.height}px`
      }
    },
    resize () {
      this.width = window.innerWidth
      this.height = window.innerHeight
      if (this.width / this.height < 1) {
        this.widthContainer = this.width * 0.03
      } else {
        this.widthContainer = this.width * 0.125
      }
    }
  }
}
</script>
<style lang="scss">
.anim{
  position: absolute;
}
.preview{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>

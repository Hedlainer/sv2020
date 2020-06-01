<template>
  <div
    class="gallery"
  >
    <adaptivePicture
      v-for="image in GetjustifiedLayout.boxes"
      :key="image.name"
      class="image_wrap"
      :color="image.SeriesSpec.Color"
      :file="image.SeriesFileName"
      :style="layoutStyle (image)"
      :width="image.width"
    />
  </div>
</template>

<script>
/* eslint-disable security/detect-object-injection */
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
  components: {
    // eslint-disable-next-line vue/no-unused-components
    lazyPicture: () => import('~/components/lazy-picture.vue'),
    adaptivePicture: () => import('~/components/adaptive-picture.vue')
    // ParamsPhoto: () => import('~/components/params-photo.vue')
  },
  // props: {
  //   objectName: {
  //     required: true,
  //     type: Array
  //   }
  // },
  data () {
    return {
      width,
      height,
      widthContainer
    }
  },
  computed: {
    GetjustifiedLayout () {
      // const aspect = this.$store.state.Series.Aspect.map(el => el)
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
  beforeMount () {
    window.addEventListener('resize', debounce(this.resize, 400))
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },

  methods: {
    layoutStyle (image) {
      const plusOrMinus = Math.random() < 0.5 ? -1 : 1
      const coefWidth = Math.floor(Math.random() * this.width * 0.019 * plusOrMinus)
      const coefHeight = Math.floor(Math.random() * this.height * 0.03 * plusOrMinus)
      return {
        left: `${image.left}px`,
        top: `${image.top}px`,
        width: `${image.width}px`,
        height: `${image.height}px`,
        transform: `translate(${coefWidth}px, ${coefHeight}px)`
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

<style lang="scss" scoped>
.gallery {
  position: relative;
  height: auto;
}
// .image_wrap {
//   position: absolute;
//   // overflow: hidden;
//   // border-radius: 4px;
//   transition: transform 1s;
//   // box-shadow: inset 0px 0px 0px 1px #03a9f4;
// }
</style>

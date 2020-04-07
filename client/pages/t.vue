<template>
  <div
    class="gallery"
  >
    <div
      v-for="image in GetjustifiedLayout.boxes"
      :key="image.name"
      class="image_wrap"
      :style="layoutStyle (image)"
    >
      <lazyPicture
        :color="image.Color"
        :file="image.SeriesFileName"
        :fullwidth="width"
        :width="image.width"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import justifiedLayout from 'justified-layout'
import photoseries from '~/static/db/Photoseries.json'
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
    lazyPicture: () => import('~/components/lazy-picture.vue')
  },
  // props: {
  //   objectName: {
  //     required: true,
  //     type: Array
  //   }
  // },
  data () {
    return {
      photoseries,
      width,
      height,
      widthContainer
    }
  },
  computed: {
    GetjustifiedLayout () {
      const aspect = this.photoseries.map(el => el.Aspect)
      const layout = justifiedLayout(aspect, {
        fullWidthBreakoutRowCadence: 3,
        targetRowHeight: (this.height / 100) * 65,
        // containerWidth: this.width,
        containerPadding: {
          top: 100,
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
        const FileName = this.photoseries.map(el => el.FileName)
        const Color = this.photoseries.map(el => el.Color)
        // eslint-disable-next-line security/detect-object-injection
        element.SeriesFileName = FileName[index]
        // eslint-disable-next-line security/detect-object-injection
        element.Color = Color[index]
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
      // const plusOrMinus = Math.random() < 0.5 ? -1 : 1
      // const coefWidth = Math.floor(Math.random() * this.width * 0.019 * plusOrMinus)
      // const coefHeight = Math.floor(Math.random() * this.height * 0.03 * plusOrMinus)
      return {
        left: `${image.left}px`,
        top: `${image.top}px`,
        width: `${image.width}px`,
        height: `${image.height}px`
        // transform: `translate(${coefWidth}px, ${coefHeight}px)`
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
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: auto;
  align-items:center;
}
.image_wrap {
  align-self: center;
  // position: absolute;
  transition: transform 1s;
}
</style>

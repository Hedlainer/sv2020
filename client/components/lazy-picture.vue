<template>
  <div
    v-observe-visibility="{
      callback: visibilityChanged,
      throttle:700,
      once: true
    }"
    class="lazy"
    :style="{ boxShadow: `inset 0px 0px 0px 1px ${color}`,
              backgroundColor: hex2rgba(color, .3) }"
  >
    <picture v-if="fullScreenImage&curentImageLoaded" class="lazy__fullscreen">
      <source
        :srcset="`/image/webp/${ImageSize.fullImageWidth}/${file}.webp`"
        type="image/webp"
      />
      <img
        ref="imgFull"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decode="async"
        draggable="false"
        :src="`/image/jpg/${ImageSize.fullImageWidth}/${file}.jpg`"
        @load="loadImages"
      />
    </picture>
    <picture
      v-if="isVisible"
      class="lazy__original"
    >
      <source
        :srcset="`/image/webp/${ImageSize.currentImageWidth}/${file}.webp`"
        type="image/webp"
      />
      <img
        ref="imgSmall"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decode="async"
        draggable="false"
        :src="`/image/jpg/${ImageSize.currentImageWidth}/${file}.jpg`"
        @load="curentImageLoaded = true"
      />
    </picture>
  </div>
</template>

<script>
let width, height
if (process.browser) {
  height = window.innerHeight
  width = window.innerWidth
}
export default {
  props: {
    fullScreenImage: { type: Boolean, default: false },
    file: { required: true, type: String },
    currentWidth: { required: true, type: Number },
    myIndex: { default: 0, type: Number },
    color: { required: true, type: String }
  },
  data () {
    return {
      height,
      curentImageLoaded: false,
      fullwidth: width,
      isVisible: false
    }
  },
  computed: {
    ImageSize () {
      const ImageSize = x => {
        const w =
          x < 480
            ? 480
            : x < 720
              ? 720
              : x < 1024
                ? 1024
                : x < 1440
                  ? 1440
                  : x < 1920
                    ? 1920
                    : 2560
        return w
      }
      return {
        fullImageWidth: ImageSize(this.fullWidth),
        currentImageWidth: ImageSize(this.currentWidth)
      }
    }
  },
  // mounted () {
  //   const ii = this.$refs.img
  //   ii.onload(() => console.log('qqq'))
  //   // .then(() => {
  //   // this.$emit('myEvent')
  //   // console.log('ii')
  //   // })
  //   // if (this.smalloded & this.bigloaded) {
  //   //   this.$emit('allloaded', this.k)
  //   // };
  // },
  methods: {
    loadImages () {
      this.$emit('loaded', { index: this.myIndex, imgFull: this.$refs.imgFull, imgSmall: this.$refs.imgSmall })
    },
    e () {
      console.log(this.myIndex)
    },
    hex2rgba (hex, alpha = 1) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
      return `rgba(${r},${g},${b},${alpha})`
    },
    allImageLoaded () {
      if (this.smalloded & this.bigloaded) {
        this.$emit('allloaded', this.k)
      }
    },

    visibilityChanged (isVisible) {
      this.isVisible = isVisible
    }
  }
}
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
<style lang="scss" scoped>
.lazy {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  transition: transform 1s;
}
img {
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}

.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
}
</style>

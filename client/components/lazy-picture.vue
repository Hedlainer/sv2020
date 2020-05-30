<template>
  <div
    v-observe-visibility="{
      callback: visibilityChanged,
      throttle:400,
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
        ref="fullImage"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decode="async"
        draggable="false"
        :src="`/image/jpg/${ImageSize.fullImageWidth}/${file}.jpg`"
        @load="fullImageLoaded"
      />
    </picture>
    <picture v-if="isVisible" class="lazy__original">
      <source
        :srcset="`/image/webp/${ImageSize.currentImageWidth}/${file}.webp`"
        type="image/webp"
      />
      <img
        ref="currentImage"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decode="async"
        draggable="false"
        :src="`/image/jpg/${ImageSize.currentImageWidth}/${file}.jpg`"
        @click="clickFullImg"
        @load="currentImageLoad"
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
      fullWidth: width,
      phVisible: true,
      opacity: 1,
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
  mounted () {},
  methods: {
    fullImageLoaded () {
      this.$emit('fulload', { img: [this.$refs.currentImage, this.$refs.fullImage], index: this.myIndex })
    },
    hex2rgba (hex, alpha = 1) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
      return `rgba(${r},${g},${b},${alpha})`
    },
    currentImageLoad () {
      this.curentImageLoaded = true
      console.log('current image', this.myIndex)
    },
    clickFullImg () {
      this.$emit('myClick', { index: this.myIndex })
      console.log('click')
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

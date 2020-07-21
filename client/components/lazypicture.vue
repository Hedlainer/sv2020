<template>
  <div
    v-observe-visibility="{
      callback: visibilityChanged,
      throttle:500,
      once: true
    }"
    class="lazy"
    @click="clickFullImg"
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
        decoding="async"
        draggable="false"
        :src="`/image/jpg/${ImageSize.fullImageWidth}/${file}.jpg`"
        @load="fullImageLoaded"
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
        ref="currentImage"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decoding="async"
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
// :style="{ boxShadow: `inset 0px 0px 0px 1px ${hex2rgba(color, 1)}`,
//               backgroundColor: hex2rgba(color, .3) }"
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
      const ImageSize = (x) => {
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

  methods: {
    fullImageLoaded () {
      this.$emit('fulload', {
        img: [this.$refs.currentImage, this.$refs.fullImage],
        aspect: this.$refs.fullImage.naturalHeight / this.$refs.fullImage.naturalWidth,
        index: this.myIndex
      })
    },

    clickFullImg ($event) {
      this.$emit('myClick', {
        index: this.myIndex,
        x: $event.offsetX,
        y: $event.offsetY,
        img: [this.$refs.currentImage, this.$refs.fullImage],
        aspect: this.$refs.fullImage.naturalHeight / this.$refs.fullImage.naturalWidth
      })
    },

    hex2rgba (hex, alpha = 1) {
      if (this.curentImageLoaded) {
        return 'rgba(0,0,0,0)'
      } else {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
        return `rgba(${r},${g},${b},${alpha})`
      }
    },

    visibilityChanged (isVisible, ev) {
      this.isVisible = isVisible
      // console.log(ev)
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
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  transition: transform 1s;
}
img {
  // display: none;
  //position: absolute;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
}
</style>

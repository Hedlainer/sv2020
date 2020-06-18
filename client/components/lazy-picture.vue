<template>
  <div
    v-mouse="mouseEv"
    v-observe-visibility="{
      callback: visibilityChanged,
      throttle:700,
      once: true
    }"
    class="lazy"
    :style="{ boxShadow: `inset 0px 0px 0px 1px ${color}`,
              backgroundColor: hex2rgba(color, .3) }"
    @mousedown="clickFullImg"
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
  directives: {
    mouse: {
    // определение директивы
      inserted: function (el, binding) {
        const f = function (evt) {
          if (binding.value(evt, el)) {
            el.removeEventListener('mousemove', f)
            el.removeEventListener('touchmove', f)
          }
        }
        el.addEventListener('mousemove', f)
        el.addEventListener('touchmove', f)
        // el.addEventListener('mousemove', e => this.mouseEv(e, i))
      }
    }
  },
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
  mounted () {
    // console.log(this.$refs.currentImage)

    // this.$refs.currentImage.addEventListener('mousemove', e => this.mouseEv(e))
    // this.$refs.currentImage.addEventListener('touchmove', e => this.mouseEv(e))
  },
  methods: {
    // e ($event) {
    //   console.log($event)
    // },
    mouseEv (event) {
      if (event.targetTouches) {
        this.$emit('mousecord', { x: event.targetTouches[0].offsetX, y: event.targetTouches[0].offsetY })
      } else {
        this.$emit('mousecord', { x: event.offsetX, y: event.offsetY })
      }
    },
    // handleMouse: function (evt, el) {
    //   console.log(evt)
    // },
    fullImageLoaded () {
      this.$emit('fulload', { img: [this.$refs.currentImage, this.$refs.fullImage], index: this.myIndex })
    },
    hex2rgba (hex, alpha = 1) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
      return `rgba(${r},${g},${b},${alpha})`
    },
    // currentImageLoad () {
    //   this.curentImageLoaded = true
    //   // console.log('current image', this.myIndex)
    // },
    clickFullImg ($event) {
      this.$emit('myClick', { index: this.myIndex, x: $event.offsetX, y: $event.offsetY })
      // console.log('click')
    },
    visibilityChanged (isVisible, ev) {
      this.isVisible = isVisible
    }
    // mousemove ($event) {
    //   // console.log($event)
    // }
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

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
    <picture
      v-if="isVisible"
      class="lazy__original"
    >
      <source
        :srcset="`/image/webp/${ImageSize}/${file}.webp`"
        type="image/webp"
      />
      <source
        :srcset="`/image/jpg/${ImageSize}/${file}.jpg`"
        type="image/jpg"
      />
      <img
        ref="img"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        :src="`/image/jpg/${ImageSize}/${file}.jpg`"
      />
    </picture>
    <picture v-if="fullScreen&isVisible" class="lazy__fullscreen">
      <source
        :srcset="`/image/webp/${FullSize}/${file}.webp`"
        type="image/webp"
      />
      <source
        :srcset="`/image/jpg/${FullSize}/${file}.jpg`"
        type="image/jpg"
      />
      <img
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        :src="`/image/jpg/${FullSize}/${file}.jpg`"
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
    fullScreen: { type: Boolean, default: false },
    file: { required: true, type: String },
    width: { required: true, type: Number },
    k: { default: 0, type: Number },
    color: { required: true, type: String }
  },
  data () {
    return {
      height,
      fullwidth: width,
      phVisible: true,
      opacity: 1,
      isVisible: false
    }
  },
  computed: {
    ImageSize () {
      const ImageSize =
        this.width < 480
          ? 480
          : this.width < 720
            ? 720
            : this.width < 1024
              ? 1024
              : this.width < 1440
                ? 1440
                : this.width < 1920
                  ? 1920
                  : 2560
      return ImageSize
    },
    FullSize () {
      const FullSize =
        this.fullwidth < 480
          ? 480
          : this.fullwidth < 720
            ? 720
            : this.fullwidth < 1024
              ? 1024
              : this.fullwidth < 1440
                ? 1440
                : this.fullwidth < 1920
                  ? 1920
                  : 2560
      return FullSize
    }
  },
  mounted () {
    // const ii = this.$refs.img
    // ii.decode()
    // .then(() => {
    //   // this.$emit('myEvent')
    console.log('ii')
    // })
    // if (this.smalloded & this.bigloaded) {
    //   this.$emit('allloaded', this.k)
    // };
  },
  methods: {
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

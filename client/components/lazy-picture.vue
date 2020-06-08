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
<<<<<<< HEAD
        ref="imgFull"
=======
        ref="fullImage"
>>>>>>> 50407439460d2f6ffd580d9c4599ce864dd83c88
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decode="async"
        draggable="false"
        :src="`/image/jpg/${ImageSize.fullImageWidth}/${file}.jpg`"
<<<<<<< HEAD
        @load="loadImages"
      />
    </picture>
    <picture
      v-if="isVisible"
      class="lazy__original"
    >
=======
        @load="fullImageLoaded"
      />
    </picture>
    <picture v-if="isVisible" class="lazy__original">
>>>>>>> 50407439460d2f6ffd580d9c4599ce864dd83c88
      <source
        :srcset="`/image/webp/${ImageSize.currentImageWidth}/${file}.webp`"
        type="image/webp"
      />
      <img
<<<<<<< HEAD
        ref="imgSmall"
=======
        ref="currentImage"
>>>>>>> 50407439460d2f6ffd580d9c4599ce864dd83c88
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decode="async"
        draggable="false"
        :src="`/image/jpg/${ImageSize.currentImageWidth}/${file}.jpg`"
<<<<<<< HEAD
        @load="curentImageLoaded = true"
=======
        @click="clickFullImg"
        @load="currentImageLoad"
>>>>>>> 50407439460d2f6ffd580d9c4599ce864dd83c88
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
<<<<<<< HEAD
      fullwidth: width,
=======
      fullWidth: width,
      phVisible: true,
      opacity: 1,
>>>>>>> 50407439460d2f6ffd580d9c4599ce864dd83c88
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
<<<<<<< HEAD
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
=======
  mounted () {},
  methods: {
    fullImageLoaded () {
      this.$emit('fulload', { img: [this.$refs.currentImage, this.$refs.fullImage], index: this.myIndex })
>>>>>>> 50407439460d2f6ffd580d9c4599ce864dd83c88
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

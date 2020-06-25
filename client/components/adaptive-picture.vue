<template>
  <div
    v-observe-visibility="{
      callback: visibilityChanged,
      throttle:400,
      once: true
    }"
    class="lazy"
    :style="{ boxShadow: `inset 0px 0px 0px 1px ${color}`,backgroundImage: `url(/image/svg/${file}.svg)`}"
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
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        :src="`/image/jpg/${ImageSize}/${file}.jpg`"
        :style="{ opacity: opacity}"
        @load="opacity = 1"
      />
    </picture>
  </div>
</template>

<script>
export default {
  props: {
    file: { required: true, type: String },
    width: { required: true, type: Number },
    id: { default: 0, type: Number },
    color: { required: true, type: String }
  },
  data () {
    return {
      opacity: 0,
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
    }
  },
  methods: {
    hex2rgba (hex, alpha = 1) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
      return `rgba(${r},${g},${b},${alpha})`
    },
    visibilityChanged (isVisible) {
      this.isVisible = isVisible
    }
  }
}
</script>
<style lang="scss" scoped>
.lazy__original{
  min-height: 100%;
  background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center top;
}
.lazy {
  transition: transform 1s;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
img {
  transition: opacity 1s;
}
</style>

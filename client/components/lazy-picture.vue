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
    <div class="fixed">
      <picture v-if="false" class="fullscreen">
        <source
          type="image/webp"
          :srcset="`/image/webp/${setWidth}/${file}.webp`"
        >
        <source
          type="image/jpg"
          :srcset="`/image/jpg/${setWidth}/${file}.jpg`"
        >
        <img
          :src="`/image/jpg/${setWidth}/${file}.jpg`"
          alt="SvobodinaPhoto"
        >
      </picture>
    </div>
    <!-- <transition name="fade" :css="true">
      <picture v-if="isVisible&phVisible" class="lazy__ph">
        <source
          type="image/webp"
          :srcset="`/image/webp/10/${file}.webp`"
        >
        <source
          type="image/jpg"
          :srcset="`/image/jpg/10/${file}.jpg`"
        >
        <img
          :src="`/image/jpg/10/${file}.jpg`"
          alt="SvobodinaPhoto"
        >
      </picture>
    </transition> -->
    <picture v-if="isVisible" class="lazy__original" :style="{opacity: opacity}">
      <source
        type="image/webp"
        :srcset="`/image/webp/${size}/${file}.webp`"
      >
      <source
        type="image/jpg"
        :srcset="`/image/jpg/${size}/${file}.jpg`"
      >
      <img
        :src="`/image/jpg/${size}/${file}.jpg`"
        alt="SvobodinaPhoto"
        @load="imageLoad"
      >
    </picture>
  </div>
</template>

<script>
// :style="{box-shadow: `inset 0px 0px 0px 1px #03a9f4`};"

export default {
  props: {
    file: {
      required: true,
      type: String
    },
    width: {
      required: true,
      type: Number
    },
    fullwidth: {
      required: true,
      type: Number
    },
    color: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      phVisible: true,
      opacity: 1,
      isVisible: false
    }
  },
  computed: {
    size () {
      const size =
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
      return size
    },
    setWidth () {
      const setWidth =
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
      return setWidth
    }
  },
  methods: {
    imageLoad () {
      this.phVisible = false
    },
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
  &>* {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: 50% 50%;
  }

  &__original {
    transition: opacity 0.3s linear;
    z-index: 1;

    &>img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: 50% 50%;
    }
  }

  &__ph {
    filter: blur(5px);
    z-index: 0;
    &>img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: 50% 50%;
    }
  }
}

</style>

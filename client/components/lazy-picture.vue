<template>
  <div
    v-observe-visibility="{
      callback: visibilityChanged,
      throttle:400,
      once: true
    }"
    class="lazy"
  >
    <transition name="fade" :css="true">
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
    </transition>
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
export default {
  props: {
    file: {
      required: true,
      type: String
    },
    width: {
      required: true,
      type: Number
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
    }
  },
  methods: {
    imageLoad () {
      // this.opacity = 1
      this.phVisible = false
    },
    visibilityChanged (isVisible) {
      this.isVisible = isVisible
    }
  }
}
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
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

<template>
  <div class="photoseries__container" @mousemove="show = $event.isTrusted" @mouseleave="show = false">
    <nuxt-link :to="`photoseries/${objectName.Route}`">
      <span
        class="photoseries__transparent"
        @mousemove="moveY = $event.offsetY"
        @mouseenter="$emit('color', objectName.Color)"
      />
    </nuxt-link>
    <lazyPicture class="photoseries__wrapper" :color="objectName.Color" :file="objectName.FileName" :width="720" :fullwidth="width" />
    <transition name="fade">
      <div v-if="show" class="name__wrapper" :style="{transform: `translateY(${moveY-30}px)`}">
        <h2>{{ objectName.Name }}</h2>
      </div>
    </transition>
  </div>
</template>

<script>
let width, height
if (process.browser) {
  height = window.innerHeight
  width = window.innerWidth
}
export default {
  components: {
    lazyPicture: () => import('~/components/lazy-picture.vue')
  },
  props: {
    objectName: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      width,
      height,
      color: null,
      show: false,
      moveY: 0
    }
  }
}
</script>

<style lang="scss">
.photoseries__wrapper {
  border-radius: 3px;
  overflow: hidden;
}
.photoseries__container {
  width: 100%;
  height: 100%;
  position: relative;
}
.photoseries__transparent {
  width: 100%;
  height: 100%;
  z-index: 4;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

.name__wrapper {
  z-index: 3;
  text-align: center;
  width: 70vw;
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -35vw;

  >h2 {
color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  background-size: cover;
  background-repeat: no-repeat;
  font-size: 8vh;
  line-height: 8vh;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  margin-top: 0px;
  margin-bottom: 0px;
    // margin: 0;
    // font-size: 10vh;
    // color: #03a9f4;
    // font-weight: 300;
    // text-shadow: 1px 1px 4px rgba(0, 0, 0, 1);
  }
}
</style>

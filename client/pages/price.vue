<template>
  <div ref="container" class="wrap" @mousewheel="horscroll">
    <div class="container" :style="{ transform: `translateX(${sc}px)` }"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sc: null,
    };
  },
  methods: {
    horscroll($event) {
      this.sc += $event.deltaY;
    },
  },
};
</script>

<style>
.wrap {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow-x: auto;
}
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 1000vw;
  height: 100vh;
  background: rgb(255, 0, 0);
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(0, 255, 57, 1) 50%,
    rgba(255, 0, 174, 1) 100%
  );
}
</style>

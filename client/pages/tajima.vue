<template>
  <section class="qqq" @mousewheel.passive="changeSpeed">
    <!-- <h1>{{speed}}</h1> -->
    <div class="holder">
      <img :src="`/image/jpg/1024/${gallery[pos]}.jpg`" alt="">
    </div>
    <div class="measure">
      <div class="m1" />
      <div class="m2" />
      <div class="m3" />
      <div class="dot" />
    </div>
  </section>
</template>

<script>
import anime from 'animejs/lib/anime.es.js'
import photoseries from '~/static/db/Photoseries.json'
export default {
  data () {
    return {
      photoseries,
      speed: 0,
      position: 0,
      pos: 0

    }
  },
  computed: {
    gallery () {
      const map = this.photoseries.map(el => el.FileName)
      return map
    }
  },
  mounted () {
    // this.raff()
    // window.requestAnimationFrame(this.changeSpeed);
    // this.changeSpeed();
    // let speed = 0
    // const position = 0
    // window.addEventListener('wheel', function (event) {
    //   speed += event.deltaY * 0.00025
    // })

    // function raf () {
    //   const tl = anime.timeline()
    //   position += speed
    //   speed *= 0.85

    //   const i = Math.round(position)
    //   const dif = i - position

    //   position += dif * 0.155
    //   if (Math.abs(i - position) < 0.001) {
    //     position = i
    //   }

    //   tl.add({
    //     targets: '.dot',
    //     translateY: position * 200
    //   })
    //   // console.log(position)
    //   // material.uniforms.progress.value = position;

    //   // let curslide =
    //   //   (Math.floor(position) - 1 + gallery.length) % gallery.length;
    //   // let nextslide =
    //   //   (((Math.floor(position) + 1) % gallery.length) - 1 + gallery.length) %
    //   //   gallery.length;
    //   // console.log(curslide, nextslide);
    //   // material.uniforms.texture1.value = gallery[curslide];
    //   // material.uniforms.texture2.value = gallery[nextslide];
    //   // this.pos =
    //   //   (Math.floor(position) - 1 + this.gallery.length) % this.gallery.length;
    //   // console.log(speed,position);
    //   window.requestAnimationFrame(raf)
    // }
    // // console.log(position);
    this.raf()
  },
  methods: {
    changeSpeed ($event) {
      this.speed += $event.deltaY * 0.00025
    //   this.raf()
    },
    raf () {
      this.position += this.speed
      this.speed *= 0.85

      const i = Math.round(this.position)
      const dif = i - this.position

      this.position += dif * 0.155
      if (Math.abs(i - this.position) < 0.001) {
        this.position = i
      }

      const tl = anime.timeline()
      tl.add({
        targets: '.dot',
        translateY: this.position * 200
      })

      this.pos =
        (Math.floor(this.position) - 1 + this.gallery.length) % this.gallery.length
      window.requestAnimationFrame(this.raf)
    }
  }
}
</script>

<style lang="scss" scoped>
.holder{
    height: 100vh;
}
.qqq {
  /* height: 300vh; */
}
.measure {
  position: fixed;
  z-index: 1000;
  height: 400px;
  border-left: 5px solid #fff;
  left: 50px;
  top: 50px;
  & > * {
    width: 10px;
    height: 10px;
    background: red;
    position: absolute;
  }
}
.m1 {
  top: 0;
}
.m2 {
  top: 200px;
}
.m3 {
  top: 400px;
}
.dot {
  background: green;
  left: 20px;
  width: 20px;
  height: 20px;
}
img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}
</style>

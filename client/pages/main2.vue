<template>
  <main class="wrapper" @mousewheel.passive="changeSpeed">
    <div class="measure">
      <div class="m1"></div>
      <div class="m2"></div>
      <div class="m3"></div>
      <div class="dot"></div>
    </div>
    <!-- <img crossorigin="anonymous" :src="`/image/jpg/1024/${gallery[activeTextureIndex]}.jpg`" alt> -->
    <div id="canvas" ref="webgl"></div>
    <div ref="plane" class="plane" @click="changeImage">
      <!-- <h1>{{ position }}</h1>
      <h1>{{ speed }}</h1> -->
      <img
        alt
        crossorigin="anonymous"
        src="/image/jpg/1024/19-03-02-21-06-25.jpg"
      />
      <img
        alt
        crossorigin="anonymous"
        src="/image/jpg/1024/19-03-02-13-46-07.jpg"
      />
      <img
        alt
        crossorigin="anonymous"
        src="/image/jpg/1024/19-03-02-21-55-28.jpg"
      />
      <img
        alt
        crossorigin="anonymous"
        src="/image/jpg/1024/19-03-02-12-14-44.jpg"
      />
      <img
        alt
        crossorigin="anonymous"
        src="/image/jpg/1024/19-03-02-17-25-38.jpg"
      />
      <img
        alt
        crossorigin="anonymous"
        src="/image/jpg/1024/19-05-01-13-36-02.jpg"
      />
      <img
        alt
        crossorigin="anonymous"
        src="/image/jpg/1024/19-06-15-09-53-39.jpg"
      />
      <img
        alt
        crossorigin="anonymous"
        src="/image/jpg/1024/19-07-27-08-02-50.jpg"
      />
    </div>
  </main>
</template>

<script>
import { Curtains } from "curtainsjs";
import anime from "animejs";
import photoseries from "~/static/db/Photoseries.json";
import vertex from "~/assets/vertex.vert";
import fragment from "~/assets/fragment.frag";
export default {
  data() {
    return {
      photoseries,
      activeTextureIndex: 2,
      nextTextureIndex: 3,
      speed: 0,
      position: 0,
      pos: 0,
      curtains: null,
      plane: null,
      params: {
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          progress: {
            name: "uProgress",
            type: "1f",
            value: 0,
          },
        },
      },
    };
  },
  computed: {
    gallery() {
      const map = this.photoseries.map((el) => el.FileName);
      return map;
    },
  },
  mounted() {
    this.setupCurtains();
    this.setupPlane();
    this.raf();
    this.anim();
  },
  methods: {
    anim() {
      const tl = anime.timeline();
      tl.add({
        update() {
          this.anim();
          console.log("animation");
        },
        autoplay: true,
        targets: ".dot",
        translateY: this.position * 200,
      });
      //   this.plane.uniforms.progress.value = this.position
    },
    changeSpeed($event) {
      this.speed += $event.deltaY * 0.0003;
    },
    raf() {
      this.speed *= 0.7;
      this.position += this.speed;
      const i = Math.round(this.position);
      const dif = i - this.position;
      this.position += dif * 0.06;

      if (Math.abs(i - this.position) < 0.001) {
        this.position = i;
      }

      this.activeTextureIndex =
        (Math.floor(this.position) - 1 + this.plane.images.length) %
        this.plane.images.length;
      this.nextTextureIndex =
        (((Math.floor(this.position) + 1) % this.plane.images.length) -
          1 +
          this.plane.images.length) %
        this.plane.images.length;

      //   this.plane.userData.nextTex.setSource(
      //     this.plane.images[this.nextTextureIndex]
      //   )
      //   this.plane.userData.activeTex.setSource(
      //     this.plane.images[this.activeTextureIndex]
      //   )

      requestAnimationFrame(this.raf);
    },
    changeImage() {
      const tl = anime.timeline();
      tl.add({
        targets: this.plane.uniforms.progress,
        value: 1,
        delay: 0,
        duration: 2000,
        easing: "cubicBezier(0.215, 0.61, 0.355, 1)",
      });
    },
    setupCurtains() {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio,
      });
    },
    setupPlane() {
      this.plane = this.curtains.addPlane(this.$refs.plane, this.params);
      if (this.plane) {
        this.plane.userData = {
          activeTex: this.plane.createTexture("activeTex"),
          nextTex: this.plane.createTexture("nextTex"),
        };
        this.plane
          .onReady(() => {
            //   this.curtains.disableDrawing()
            this.setTexture();
          })
          .onRender(() => {
            //   console.log("I'm render")
            if ((this.position ^ 0) !== this.position) {
              // не удалять строку, условие при котором переменная не равна 0
              // console.log(this.curtains)
              // this.curtains.enableDrawing()
              this.plane.uniforms.progress.value = this.position;
              this.setTexture();
            }
          });
        //   .onLoading(() => console.log("I'm load"))
      }
    },
    setTexture() {
      this.plane.userData.activeTex.setSource(
        this.plane.images[this.activeTextureIndex]
      );
      this.plane.userData.nextTex.setSource(
        this.plane.images[this.nextTextureIndex]
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
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
#canvas {
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: -1;
}
.plane {
  width: 100%;
  height: 100vh;
}
.plane img {
  display: none;
}
</style>

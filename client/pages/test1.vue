<template>
  <div class="page">
    <div id="webgl" ref="webgl"></div>
    <main class="seriya__wrapper" @scroll.passive="updateScroll">
      <lazyPicture
        v-for="(seriya, index) in photoseries"
        :key="seriya.Id"
        ref="CurtainsPlanes"
        class="seriya__container"
        :color="seriya.Color"
        :current-width="710"
        :file="seriya.FileName"
        :full-screen-image="true"
        :my-index="index"
        @fulload="preparePlane"
        @myClick="activeAnimate"
      />
    </main>
  </div>
</template>

<script>
import { Curtains } from 'curtainsjs'
import anime from 'animejs/lib/anime.es.js'
import lazyPicture from '~/components/lazy-picture.vue'
import photoseries from '~/static/db/Photoseries.json'
import { vertex, fragment } from '~/assets/shader3.js'

export default {
  components: {
    lazyPicture
  },

  data () {
    return {
      calcCords: {},
      photoseries,
      animating: true,
      duration: 1700,
      curtains: null,
      // координаты мыши для пересчёта в шейдер
      mouseNormalized: { x: 0, y: 0 },
      planes: [],
      params: {
        widthSegments: 32,
        heightSegments: 32,
        vertexShader: vertex,
        fragmentShader: fragment,
        fov: 1,
        autoloadSources: false,
        uniforms: {
          uViewSize: { name: 'uViewSize', type: '2f', value: [] },
          uMouse: { name: 'uMouse', type: '2f', value: [] },
          uPlanePosition: { name: 'uPlanePosition', type: '2f', value: [] },
          uResolution: { name: 'uResolution', type: '2f', value: [] },
          uProgress: { name: 'uProgress', type: '1f', value: 0 }
        }
      }
    }
  },
  mounted () {
    this.initCurtains()
    // console.log(this.planes)
    // console.log(this.$refs.CurtainsPlanes[3])
  },
  methods: {
    activeAnimate (ctx) {
      this.toFullscreen(ctx)
    },
    preparePlane (ctx) {
      const plane = this.planes[ctx.index]
      plane.loadSources(ctx.img)
      // считаем вестор для нормализации изображения в шейдере
      let xNormalized, yNormalized
      if (window.innerHeight / window.innerWidth > ctx.aspect) {
        xNormalized = (window.innerWidth / window.innerHeight) * ctx.aspect
        yNormalized = 1
      } else {
        xNormalized = 1
        yNormalized = window.innerHeight / window.innerWidth / ctx.aspect
      }
      plane.uniforms.uResolution.value = [xNormalized, yNormalized]
      this.getUnifors(ctx)
    },
    // route (a) {
    //   this.$router.push(`photoseries/${a}`)
    // },
    initCurtains () {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio,
        watchScroll: false
      })
      for (const value of this.$refs.CurtainsPlanes) {
        const plane = this.curtains.addPlane(value.$el, this.params)
        this.planes.push(plane)
      }
    },
    getUnifors (i) {
      // eslint-disable-next-line security/detect-object-injection
      const plane = this.planes[i.index]
      const rectPlane = plane.getBoundingRect()
      // ширина плана в условных еденицах
      this.calcCords.w = (window.innerWidth / rectPlane.width) * this.curtains.pixelRatio
      this.calcCords.h = (window.innerHeight / rectPlane.height) * this.curtains.pixelRatio
      // вектор для перемещения плана при увеличении до размера окна
      this.calcCords.x = (rectPlane.left / rectPlane.width - this.calcCords.w / 2 + 0.5) * 2
      this.calcCords.y = (-(rectPlane.top / rectPlane.height - this.calcCords.h / 2) - 0.5) * 2

      this.calcCords.mouseX = (i.x / rectPlane.width) * this.curtains.pixelRatio
      this.calcCords.mouseY = 1 - (i.y / rectPlane.height) * this.curtains.pixelRatio

      plane.uniforms.uMouse.value = [this.calcCords.mouseX, this.calcCords.mouseY]
      plane.uniforms.uViewSize.value = [this.calcCords.w, this.calcCords.h]
      plane.uniforms.uPlanePosition.value = [this.calcCords.x, this.calcCords.y]
    },
    toFullscreen (i) {
      this.getUnifors(i)
      // eslint-disable-next-line security/detect-object-injection
      const plane = this.planes[i.index]
      const tl = anime.timeline({ autoplay: false, easing: 'linear' })
      tl.add({
        targets: plane.uniforms.uProgress,
        value: 1,
        duration: this.duration,
        easing: 'cubicBezier(0.215, 0.61, 0.355, 1)'
      })
        .add(
          {
            targets: plane.uniforms.uProgress,
            value: 0,
            easing: 'cubicBezier(0.445, 0.05, 0.55, 0.95)',
            duration: this.duration
          },
          '+=1500'
        )
      tl.play()
    },
    updateScroll (event) {
      this.curtains.updateScrollValues(
        event.target.scrollTop,
        event.target.scrollLeft
      )
      for (const val of this.curtains.planes) {
        val.updateScrollPosition()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$scrollBarHeight: 1px;

::-webkit-scrollbar {
  width: $scrollBarHeight;
  height: $scrollBarHeight;
}

::-webkit-scrollbar-button {
  width: $scrollBarHeight;
  height: $scrollBarHeight;
}
/* $hf: 100vh; */
$h: 60vh;
$w: $h * 1.5;
$m: $w/2;
$t: $h + $m;
.page {
  height: 100vh;
  position: relative;
  overflow: hidden;
}
img {
  // display: none;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}
.seriya__wrapper {
  position: absolute;
  top: 20vh;
  height: 100vw;
  width: $h;
  transform: rotate(-90deg) translateY(-$h);
  transform-origin: right top;
  overflow-y: auto;
  overflow-x: hidden;
}
.seriya__container {
  box-shadow: inset 0px 0px 0px 1px #03a9f4;
  border-radius: 3px;
  margin-top: 200px;
  margin-bottom: $h/2;
  width: $w;
  height: $h;
  transform: rotate(90deg) translateX(-$m);
  transform-origin: left bottom;
}
#webgl {
  position: absolute;
  top: 0;
  // right: 0;
  // bottom: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  /* z-index: -1; */
  /* transition: opacity 0.5s ease-in; */
  /* opacity: 1.3; */
}
.plane-image {
//  display: none;
  opacity: 1;
}
</style>

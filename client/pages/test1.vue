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
        @fulload="doSome"
        @myClick="e"
      />
    </main>
  </div>
</template>

<script>
import { Curtains } from 'curtainsjs'
import lazyPicture from '~/components/lazy-picture.vue'
import anime from 'animejs/lib/anime.es.js'
import photoseries from '~/static/db/Photoseries.json'
import { vertex, fragment } from '~/assets/shader3.js'
export default {
  components: {
    lazyPicture
  },
  data () {
    return {
      // fullloaded: null,
      // smalloaded: null,
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
        fov: 180,
        autoloadSources: false,
        uniforms: {
          // uTime: { name: 'uTime', type: '1f', value: 0 },
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
    e (ctx) {
      this.toFullscreen(ctx.index)
    },
    async doSome (ctx) {
      // // eslint-disable-next-line no-debugger
      // debugger
      this.planes[ctx.index].loadSources(ctx.img)
      this.handlePlanes(ctx.index)
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
      // eslint-disable-next-line no-loops/no-loops
      for (const value of this.$refs.CurtainsPlanes) {
        const plane = this.curtains.addPlane(value.$el, this.params)
        this.planes.push(plane)
      }
    },
    handlePlanes (i) {
      // eslint-disable-next-line security/detect-object-injection
      const plane = this.planes[i]
      console.log(plane)
      // eslint-disable-next-line no-debugger
      // debugger
      plane.onReady(() => {
        // this.curtains.enableDrawing()
        // plane.htmlElement.addEventListener('click', () => this.toFullscreen(i))
        plane.htmlElement.addEventListener('mousemove', e => this.mouseEv(e, i))
        plane.htmlElement.addEventListener('touchmove', e => this.mouseEv(e, i))
      })
    },
    getUnifors (i) {
      // eslint-disable-next-line security/detect-object-injection
      const plane = this.planes[i]
      const rectPlane = plane.getBoundingRect()
      // ширина плана в условных еденицах
      const wUnit =
        (window.innerWidth / rectPlane.width) * this.curtains.pixelRatio
      const hUnit =
        (window.innerHeight / rectPlane.height) * this.curtains.pixelRatio
      // вектор для перемещения плана при увеличении до размера окна
      const xUnit = (rectPlane.left / rectPlane.width - wUnit / 2 + 0.5) * 2
      const yUnit = (-(rectPlane.top / rectPlane.height - hUnit / 2) - 0.5) * 2
      // параметры изображения в пикселях
      const widthImg = plane.images[1].naturalWidth
      const heightImg = plane.images[1].naturalHeight

      const imageAspect = heightImg / widthImg
      // считаем вестор для нормализации изображения в шейдере
      let xNormalized, yNormalized
      if (window.innerHeight / window.innerWidth > imageAspect) {
        xNormalized = (window.innerWidth / window.innerHeight) * imageAspect
        yNormalized = 1
      } else {
        xNormalized = 1
        yNormalized = window.innerHeight / window.innerWidth / imageAspect
      }

      plane.uniforms.uViewSize.value = [wUnit, hUnit]
      plane.uniforms.uPlanePosition.value = [xUnit, yUnit]
      plane.uniforms.uResolution.value = [xNormalized, yNormalized]
    },
    mouseEv (e, i) {
      // console.log(e)
      // eslint-disable-next-line security/detect-object-injection
      const plane = this.planes[i]
      const rectPlane = plane.getBoundingRect()
      if (e.targetTouches) {
        this.mouseNormalized.x = (e.targetTouches[0].offsetX / rectPlane.width) * this.curtains.pixelRatio
        this.mouseNormalized.y = 1 - (e.targetTouches[0].offsetY / rectPlane.height) * this.curtains.pixelRatio
      } else {
        this.mouseNormalized.x = (e.offsetX / rectPlane.width) * this.curtains.pixelRatio
        this.mouseNormalized.y = 1 - (e.offsetY / rectPlane.height) * this.curtains.pixelRatio
      }
      plane.uniforms.uMouse.value = [
        this.mouseNormalized.x,
        this.mouseNormalized.y
      ]
    },
    toFullscreen (i) {
      this.getUnifors(i)
      // eslint-disable-next-line security/detect-object-injection
      const plane = this.planes[i]
      const tl = anime.timeline({ autoplay: false, easing: 'linear' })
      tl.add({ targets: this.curtains.container, zIndex: 10, duration: 0 })
        // .add(
        //   {
        //     targets: plane.htmlElement,
        //     delay: 100,
        //     opacity: 0,
        //     duration: 100
        //   },
        //   "+=200"
        // )
        .add({
          targets: plane.uniforms.uProgress,
          value: 1,
          // delay: 0,
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
        .add({
          targets: this.curtains.container,
          delay: 1,
          zIndex: -10,
          duration: 0
        })
      tl.play()
    },
    updateScroll (event) {
      this.curtains.updateScrollValues(
        event.target.scrollTop,
        event.target.scrollLeft
      )
      // eslint-disable-next-line no-loops/no-loops
      for (const val of this.curtains.planes) {
        // eslint-disable-next-line security/detect-object-injection
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
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  /* z-index: -1; */
  /* transition: opacity 0.5s ease-in; */
  /* opacity: 1.3; */
}
.plane-image {
//  display: none;
  opacity: 1;
}
</style>

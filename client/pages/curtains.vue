<template>
  <div class="page">
    <div id="webgl" ref="webgl" />
    <main class="seriya__wrapper" @scroll="e">
      <div v-for="seriya in photoseries" ref="vforest" :key="seriya.ID" class="seriya__container">
        <!-- <h2 style="color:white">{{seriya.Name}}</h2> -->
        <img crossorigin="use-credentials" :src="`/img/${seriya.Id}.jpg`">
        <img crossorigin="use-credentials" :src="`/img/${seriya.Id}.jpg`">
      </div>
    </main>
  </div>
</template>

<script>
import { Curtains } from 'curtainsjs'
import anime from 'animejs/lib/anime.es.js'
import photoseries from '~/static/db/Photoseries.json'
import { vertex, fragment } from '~/assets/shader3.js'
export default {
  data () {
    return {
      photoseries,
      scrollX: 0,
      scrollY: 0
    }
  },
  mounted () {
    const curtains = new Curtains({
      container: this.$refs.webgl,
      pixelRatio: window.devicePixelRatio,
      watchScroll: false
    })
    const mouseNormalized = { x: 0, y: 0 }
    let animating = true
    const segments = 64
    const duration = 1700
    const params = {
      widthSegments: segments,
      heightSegments: segments,
      vertexShader: vertex,
      fragmentShader: fragment,
      fov: 180,
      autoloadSources: true,
      uniforms: {
        uTime: { name: 'uTime', type: '1f', value: 0 },
        uViewSize: { name: 'uViewSize', type: '2f', value: [] },
        uMouse: { name: 'uMouse', type: '2f', value: [] },
        uPlanePosition: { name: 'uPlanePosition', type: '2f', value: [] },
        uResolution: { name: 'uResolution', type: '2f', value: [] },
        uProgress: { name: 'uProgress', type: '1f', value: 0 }
      }
    }
    curtains.updateScrollValues(this.scrollX, this.scrollY)
    // curtains.disableDrawing();
    for (let i = 0; i < this.$refs.vforest.length; i++) {
      const plane = curtains.addPlane(this.$refs.vforest[i], params)
      plane.onReady(() => {
        plane.updateScrollPosition()
        plane.htmlElement.addEventListener('mousedown', () =>
          toFullscreen(plane)
        )
        plane.htmlElement.addEventListener('mousemove', e => mouseEv(e, plane))
        plane.htmlElement.addEventListener('touchmove', e => mouseEv(e, plane))
      })
    }

    function mouseEv (e, plane) {
      const rectPlane = plane.getBoundingRect()
      if (e.targetTouches) {
        mouseNormalized.x =
          (e.targetTouches[0].offsetX / rectPlane.width) * curtains.pixelRatio
        mouseNormalized.y =
          1 -
          (e.targetTouches[0].offsetY / rectPlane.height) * curtains.pixelRatio
      } else {
        mouseNormalized.x = (e.offsetX / rectPlane.width) * curtains.pixelRatio
        mouseNormalized.y =
          1 - (e.offsetY / rectPlane.height) * curtains.pixelRatio
      }
    }

    function toFullscreen (plane) {
      getUnifors(plane)
      if (animating === false) { return }
      animating = false
      const tl = anime.timeline({ autoplay: false, easing: 'linear' })
      tl.add({ targets: curtains.container, zIndex: 10, duration: 0 })
        // .add(
        //   {
        //     targets: plane.htmlElement,
        //     delay: 100,
        //     opacity: 0,
        //     duration: 100
        //   },
        //   "+=200"
        // )
        .add(
          {
            targets: plane.uniforms.uProgress,
            value: 1,
            delay: 0,
            duration,
            easing: 'cubicBezier(0.215, 0.61, 0.355, 1)',
            begin () {
              // curtains.enableDrawing();
            }
          },
          '-=200'
        )
        .add({
          targets: plane.uniforms.uProgress,
          value: 0,
          delay: 1500,
          easing: 'cubicBezier(0.445, 0.05, 0.55, 0.95)',
          duration,
          complete () {
            // console.timeEnd("click");
            animating = true
            // curtains.disableDrawing();
          }
        })
        .add({
          targets: curtains.container,
          delay: 1,
          zIndex: -10,
          duration: 0
        })
      tl.play()
    }

    function getUnifors (plane) {
      const rectPlane = plane.getBoundingRect()
      // ширина плана в условных еденицах
      const wUnit = (window.innerWidth / rectPlane.width) * curtains.pixelRatio
      const hUnit =
        (window.innerHeight / rectPlane.height) * curtains.pixelRatio
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
      plane.uniforms.uMouse.value = [mouseNormalized.x, mouseNormalized.y]
    }
  },
  methods: {
    e (ev) {
      this.scrollX = ev.target.scrollLeft
      this.scrollY = ev.target.scrollTop
      console.log(ev.target.scrollTop, ev.target.scrollLeft)
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
$h: 60vh;
$w: $h * 0.66;
$m: $w/2;
$t: $h + $m;
.page {
  height: 100vh;
  position: relative;
}
img {
  height: 101%;
  width: 101%;
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
  overflow: hidden;
  box-shadow: inset 0px 0px 0px 1px #03a9f4;
  border-radius: 3px;
  margin-top: -$w;
  margin-bottom: $m;
  width: $w;
  height: $h;
  transform: rotate(90deg) translateX(-$m);
  transform-origin: left bottom;
}
#webgl {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 100vh;
  z-index: -10;
  transition: opacity 0.5s ease-in;
  opacity: 1.3;
}
</style>

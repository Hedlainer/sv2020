<template>
  <div class="page">
    <div id="webgl" ref="webgl"></div>
    <main class="seriya__wrapper" @scroll.passive="updateScroll">
      <lazyPicture
        v-for="(seriya,i) in photoseries"
        :key="seriya.Id"
        ref="CurtainsPlanes"
        class="seriya__container"
        :color="seriya.Color"
        :file="seriya.FileName"
        :full-screen="true"
        :my-index="i"
        :width="710"
        @loaded="loadImg"
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
    }
  },
  mounted () {
    this.initCurtains()
  },
  methods: {
    loadImg (ctx) {
      const plane = this.curtains.addPlane(this.$refs.CurtainsPlanes[ctx.index].$el, this.params)
      console.log(ctx)
      this.planes.push(plane)
      this.handlePlanes(ctx.index)
    },
    doSome ($event) {
      console.log($event)
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
    },
    handlePlanes (i) {
      // eslint-disable-next-line security/detect-object-injection
      const plane = this.curtains.planes[i]
      if (plane) {
        this.curtains.enableDrawing()
        plane.htmlElement.addEventListener('click', () => this.toFullscreen(i))
        plane.htmlElement.addEventListener('mousemove', e => this.mouseEv(e, i))
        plane.htmlElement.addEventListener('touchmove', e => this.mouseEv(e, i))
      }
    },
    getUnifors (i) {
      const plane = this.curtains.planes[i]
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
      const plane = this.curtains.planes[i]
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
      const plane = this.curtains.planes[i]
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
      for (let i = 0; i < this.curtains.planes.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        this.curtains.planes[i].updateScrollPosition()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

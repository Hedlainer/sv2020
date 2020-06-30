<template>
  <div class="seriya">
    <div id="webgl" ref="webgl"></div>
    <main class="seriya__wrapper" @scroll.passive="updateScroll">
      <lazyPicture
        v-for="(seriya,i) in photoseries"
        :key="seriya.Id"
        ref="CurtainsPlanes"
        class="seriya__wrapper__img"
        :color="seriya.Color"
        :current-width="320"
        :file="seriya.FileName"
        :full-screen-image="true"
        :my-index="i"
        @loaded="loadImg"
      />
    </main>
  </div>
</template>

<script>
import { Curtains } from 'curtainsjs'
import anime from 'animejs'
import lazyPicture from '~/components/lazy-picture.vue'
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
        fov: 1,
        autoloadSources: false,
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
    // console.log(this.doSome())

    // console.log(this.curtains.planes)
    // console.log(this.$refs.CurtainsPlanes[3])
  },
  methods: {
    async loadImg (ctx) {
      await this.doSome(ctx)
      await this.handlePlanes(ctx)
    },
    async doSome (ctx) {
      const plane = this.curtains.addPlane(this.$refs.CurtainsPlanes[ctx.index].$el, this.params)
      plane.loadImages([ctx.imgSmall, ctx.imgFull])
      // return plane
    },
    // route (a) {
    //   this.$router.push(`photoseries/${a}`)
    // },
    initCurtains () {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio,
        watchScroll: true
      })
    },
    async handlePlanes (i) {
      const plane = this.curtains.planes[i.index]
      // eslint-disable-next-line no-debugger
      // debugger
      this.$refs.CurtainsPlanes[parseInt(i.index)].$el.addEventListener('click', () => this.toFullscreen(plane))
      this.$refs.CurtainsPlanes[parseInt(i.index)].$el.addEventListener('mousemove', e => this.mouseEv(e, plane))
      this.$refs.CurtainsPlanes[parseInt(i.index)].$el.addEventListener('touchmove', e => this.mouseEv(e, plane))
    },
    async getUnifors (plane) {
      // const plane = this.curtains.planes[parseInt(i)]
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
    mouseEv (e, plane) {
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
    async toFullscreen (plane) {
      await this.getUnifors(plane)
      const tl = anime.timeline({ autoplay: false, easing: 'linear' })
      tl.add({ targets: this.curtains.container, zIndex: 10, duration: 0 })
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
$scrollBarHeight: 1px;

::-webkit-scrollbar {
  width: $scrollBarHeight;
  height: $scrollBarHeight;
}

::-webkit-scrollbar-button {
  width: $scrollBarHeight;
  height: $scrollBarHeight;
}
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

.seriya {
  position: relative;
  transition: background-color 2s;
  width: 100%;
  height: 100vh;
  overflow-x: auto;
  &__wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    padding-left: 5vw;
    padding-right: 5vw;
    height: 100%;
    position: absolute;
    &__img {
      display: block;
      border-radius: 3px;
      &:nth-child(odd) {
        width: calc(33vh * 1.5);
        height: 33vh;
      }
      &:nth-child(even) {
        width: calc(37vh * 1.5);
        height: 37vh;
      }
    }
  }
  }
</style>

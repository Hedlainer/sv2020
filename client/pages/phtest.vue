<template>
  <main
    class="seriya"
    @scroll.passive="updateScroll"
  >
    <div id="webgl" ref="webgl"></div>
    <lazypicture
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
      @myClick="activateAnimate"
    />
  </main>
</template>

<script>
import { Curtains } from 'curtainsjs'
import anime from 'animejs'
import photoseries from '~/static/db/Photoseries.json'
import { vertex, fragment } from '~/assets/shaderPhotoseries.js'
export default {
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
        autoloadSources: true,
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
    activateAnimate (ctx) {
      // create

      const plane = this.curtains.addPlane(this.$refs.CurtainsPlanes[ctx.index].$el, this.params)

      // prepare

      plane.onReady(() => {
        let xNormalized, yNormalized
        if (window.innerHeight / window.innerWidth > ctx.aspect) {
          xNormalized = (window.innerWidth / window.innerHeight) * ctx.aspect
          yNormalized = 1
        } else {
          xNormalized = 1
          yNormalized = window.innerHeight / window.innerWidth / ctx.aspect
        }
        plane.uniforms.uResolution.value = [xNormalized, yNormalized]

        // get uniforms

        const rectPlane = plane.getBoundingRect()
        // ширина плана в условных еденицах
        this.calcCords.w = (window.innerWidth / rectPlane.width) * this.curtains.pixelRatio
        this.calcCords.h = (window.innerHeight / rectPlane.height) * this.curtains.pixelRatio
        // вектор для перемещения плана при увеличении до размера окна
        this.calcCords.x = (rectPlane.left / rectPlane.width - this.calcCords.w / 2 + 0.5) * 2
        this.calcCords.y = (-(rectPlane.top / rectPlane.height - this.calcCords.h / 2) - 0.5) * 2

        this.calcCords.mouseX = (ctx.x / rectPlane.width) * this.curtains.pixelRatio
        this.calcCords.mouseY = 1 - (ctx.y / rectPlane.height) * this.curtains.pixelRatio

        plane.uniforms.uMouse.value = [this.calcCords.mouseX, this.calcCords.mouseY]
        plane.uniforms.uViewSize.value = [this.calcCords.w, this.calcCords.h]
        plane.uniforms.uPlanePosition.value = [this.calcCords.x, this.calcCords.y]

        // animate

        const tl = anime.timeline({ autoplay: false, easing: 'linear' })
        tl.add({
          targets: '#webgl',
          zIndex: 2,
          duration: 0
        })
          .add({
            targets: plane.uniforms.uProgress,
            value: 1,
            duration: this.duration,
            easing: 'cubicBezier(0.215, 0.61, 0.355, 1)',
            complete: () => {
              this.$router.push(`photoseries/${this.photoseries[ctx.index].Route}`)
            }
          })
        tl.play()
      })
    //   this.toFullscreen(ctx)
    },

    initCurtains () {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio,
        watchScroll: true
      })
    },

    updateScroll (event) {
      this.curtains.updateScrollValues(
        event.target.scrollTop,
        event.target.scrollLeft
      )
      // eslint-disable-next-line no-loops/no-loops
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

.seriya {
  position: absolute;
  padding: 0 2.5vw;
  height: 100vh;
  display: flex;
  align-items: center;
  &__container {
    position: relative;
    margin: auto 3vw;
    text-align: center;
      &:nth-child(odd) {
        width: calc(65vh * 1.5);
        height: 65vh;
      }
      &:nth-child(even) {
        width: calc(67vh * 1.5);
        height: 67vh;
      }
  }
}
#webgl {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
}

@media screen and (orientation: portrait) {

  .seriya {
    overflow: hidden;
    width: 100vw;
    padding: 2.5vh 0;
    height: auto;
    flex-direction: column;
    &__container {
      width: 95vw;
      height: calc(95vw / 1.5);
      margin: 5vw 0;
  }
}
}

</style>

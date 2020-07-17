 <!-- РАБОЧИЙ ВАРИАНТ, НО ФОТКИ ОТКРЫВАЮТСЯ В НАЧАЛЕ!!!! СО СКРОЛЛТРИГЕРОМ И ПОДГРУЗКОЙ ПЛАНОВ ПРИ ЗАГРУЗКЕ ИЗОБРАЖЕНИЙ  -->
<template>
  <main
    ref="container"
  >
    <div id="webgl" ref="webgl"></div>
    <div
      class="seriya"
    >
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
    </div>
  </main>
</template>

<script>
// @mousewheel="value += $event.deltaY"
//   :style="{transform: `translateX(-${value}.px)`}"

import { Curtains } from 'curtainsjs'
import anime from 'animejs'
import photoseries from '~/static/db/Photoseries.json'
import { vertex, fragment, fspass } from '~/assets/shaderPhotoseries.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { CustomEase } from 'gsap/dist/CustomEase'
export default {
  layout: 'series',
  data () {
    return {
      planesDeformation: 0,
      shaderPassParams: {
        fragmentShader: fspass, // we'll be using the lib default vertex shader
        uniforms: {
          displacement: {
            name: 'uDisplacement',
            type: '1f',
            value: 0
          }
        }
      },
      value: 0,
      shaderPass: null,
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

    gsap.registerPlugin(ScrollTrigger, CustomEase)

    gsap.to('.seriya', {
      x: -(document.querySelector('.seriya').offsetWidth - window.innerWidth),
      ease: 'none',
      onUpdate: () => {
        for (const value of this.planes) {
          value.setRelativePosition(gsap.getProperty('.seriya', 'x'), 0, 0)
        }
        this.curtains.updateScrollValues()
        // debugger
        // console.log(gsap.getProperty('.seriya', 'x'))
        // setRelativePosition(gsap.getProperty('.seriya', 'x', 'px'),0,0)
      },
      scrollTrigger: {
        trigger: '.seriya',
        pin: true,
        scrub: 1,
        end: () => '+=' + document.querySelector('.seriya').offsetWidth
      }
    })
  },
  methods: {
    horizontalScroll ($event) {
      if ($event.deltaY > 0) {
        this.value += $event.deltaY
        this.$refs.container.scrollLeft = this.value
      }
      this.$refs.container.scrollLeft += $event.deltaY
      this.value = this.$refs.container.scrollLeft
    },
    activateAnimate (ctx) {
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
      console.log(plane)//
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
      // eslint-disable-next-line no-loops/no-loops
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
            // this.$router.push(`photoseries/${this.photoseries[i.index].Route}`)
          }
        })
        // .add(
        //   {
        //     targets: plane.uniforms.uProgress,
        //     value: 0,
        //     easing: 'cubicBezier(0.445, 0.05, 0.55, 0.95)',
        //     duration: this.duration
        //   }
        //   // '+=1500'
        // )
      tl.play()
    }
    // updateScroll (event) {
    //   this.curtains.updateScrollValues(
    //     event.target.scrollTop,
    //     event.target.scrollLeft
    //   )
    // eslint-disable-next-line no-loops/no-loops
    //   for (const val of this.curtains.planes) {
    //     val.updateScrollPosition()
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>

.seriya {
  position: absolute;
  z-index: 2;
  padding: 0 2.5vw;
  height: 99vh;
  display: flex;
  align-items: center;
  overflow-x: auto;
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

// @media screen and (orientation: portrait) {
//   .seriya {
//     overflow: hidden;
//     width: 100vw;
//     padding: 2.5vh 0;
//     height: auto;
//     flex-direction: column;
//     &__container {
//       width: 95vw;
//       height: calc(95vw / 1.5);
//       margin: 5vw 0;
//   }
// }
// }
</style>

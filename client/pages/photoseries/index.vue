<template>
  <main>
    <div id="webgl" ref="webgl"></div>
    <div class="seriya">
      <lp2
        v-for="(seriya, index) in photoseries"
        :key="seriya.Id"
        ref="CurtainsPlanes"
        class="seriya__container"
        :color="seriya.Color"
        :current-width="710"
        :file="seriya.FileName"
        :full-screen-image="true"
        :my-index="index"
        @myClick="activateAnimate"
      >
        <template #title>
          <span class="plane-title">{{ seriya.Title }}</span>
        </template>
        <template #fullScreenImage>
          <picture class="lazy__fullscreen">
            <source
              :srcset="`/image/webp/1920/${seriya.FileName}.webp`"
              type="image/webp"
            />
            <img
              alt="SvobodinaPhoto"
              crossorigin="anonimous"
              decoding="async"
              draggable="false"
              :src="`/image/jpg/1920/${seriya.FileName}.jpg`"
            />
          </picture>
        </template>
        <template #currentImage>
          <picture class="lazy__original">
            <source
              :srcset="`/image/webp/720/${seriya.FileName}.webp`"
              type="image/webp"
            />
            <img
              ref="currentImage"
              alt="SvobodinaPhoto"
              crossorigin="anonimous"
              decoding="async"
              draggable="false"
              :src="`/image/jpg/720/${seriya.FileName}.jpg`"
            />
          </picture>
        </template>
      </lp2>
    </div>
  </main>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CustomEase } from "gsap/dist/CustomEase";
import { Curtains } from "curtainsjs";
// import anime from 'animejs'
import photoseries from "~/static/db/Photoseries.json";
import { vertex, fragment, fspass } from "~/assets/shaderPhotoseries.js";
// import { vertexPass, fragmentPass } from '~/assets/shaderPass.js'
import lp2 from "~/components/lp2.vue";

export default {
  layout: "series",
  components: {
    lp2,
  },
  data() {
    return {
      planesDeformation: 0,
      shaderPassParams: {
        fragmentShader: fspass, // we'll be using the lib default vertex shader
        uniforms: {
          displacement: {
            name: "uDisplacement",
            type: "1f",
            value: 0,
          },
        },
      },
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
        autoloadSources: true,
        uniforms: {
          uViewSize: { name: "uViewSize", type: "2f", value: [] },
          uMouse: { name: "uMouse", type: "2f", value: [] },
          uPlanePosition: { name: "uPlanePosition", type: "2f", value: [] },
          uResolution: { name: "uResolution", type: "2f", value: [] },
          uProgress: { name: "uProgress", type: "1f", value: 0 },
        },
      },
    };
  },
  mounted() {
    this.initCurtains();

    gsap.registerPlugin(ScrollTrigger, CustomEase);

    gsap.to(".seriya", {
      x: -(document.querySelector(".seriya").offsetWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: ".seriya",
        pin: true,
        scrub: 1,
        end: () => "+=" + document.querySelector(".seriya").offsetWidth,
      },
    });

    this.curtains
      .onRender(() => {
        // update our planes deformation
        // increase/decrease the effect
        this.planesDeformation = this.lerp(this.planesDeformation, 0, 0.1);
        // console.log(this.planesDeformation)
      })
      .onScroll(() => {
        // get scroll deltas to apply the effect on scroll
        var delta = this.curtains.getScrollDeltas();

        // invert value for the effect
        delta.y = -delta.y;

        // threshold
        if (delta.y > 60) {
          delta.y = 60;
        } else if (delta.y < -60) {
          delta.y = -60;
        }

        if (Math.abs(delta.y) > Math.abs(this.planesDeformation)) {
          this.planesDeformation = this.lerp(
            this.planesDeformation,
            delta.y,
            0.5
          );
        }
      });

    this.shaderPass = this.curtains.addShaderPass(this.shaderPassParams);
    this.shaderPass.onRender(() => {
      console.log("render");
      this.shaderPass.uniforms.displacement.value =
        this.planesDeformation / 1000;
    });
  },
  methods: {
    lerp(start, end, amt) {
      return (1 - amt) * start + amt * end;
    },
    activateAnimate(ctx) {
      // create

      // this.curtains = new Curtains({
      //   container: this.$refs.webgl,
      //   pixelRatio: window.devicePixelRatio,
      //   watchScroll: true
      // })
      // // eslint-disable-next-line no-loops/no-loops
      // // for (const value of this.$refs.CurtainsPlanes) {
      // //   const plane = this.curtains.addPlane(value.$el, this.params)
      // //   this.planes.push(plane)
      // // }
      // this.curtains.disableDrawing()

      // const plane = this.curtains.addPlane(this.$refs.CurtainsPlanes[ctx.index].$el, this.params)

      const plane = this.curtains.planes[ctx.index];
      // debugger
      const aspect =
        plane.images[0].naturalHeight / plane.images[0].naturalWidth;
      // console.log(this.$refs.fullImage)
      // prepare

      plane.onReady(() => {
        let xNormalized, yNormalized;
        if (window.innerHeight / window.innerWidth > aspect) {
          xNormalized = (window.innerWidth / window.innerHeight) * aspect;
          yNormalized = 1;
        } else {
          xNormalized = 1;
          yNormalized = window.innerHeight / window.innerWidth / aspect;
        }
        plane.uniforms.uResolution.value = [xNormalized, yNormalized];

        // get uniforms
        // debugger
        const rectPlane = plane.getBoundingRect();
        // ширина плана в условных еденицах
        this.calcCords.w =
          (window.innerWidth / rectPlane.width) * this.curtains.pixelRatio;
        this.calcCords.h =
          (window.innerHeight / rectPlane.height) * this.curtains.pixelRatio;
        // вектор для перемещения плана при увеличении до размера окна
        this.calcCords.x =
          (rectPlane.left / rectPlane.width - this.calcCords.w / 2 + 0.5) * 2;
        this.calcCords.y =
          (-(rectPlane.top / rectPlane.height - this.calcCords.h / 2) - 0.5) *
          2;

        this.calcCords.mouseX =
          (ctx.x / rectPlane.width) * this.curtains.pixelRatio;
        this.calcCords.mouseY =
          1 - (ctx.y / rectPlane.height) * this.curtains.pixelRatio;

        plane.uniforms.uMouse.value = [
          this.calcCords.mouseX,
          this.calcCords.mouseY,
        ];
        plane.uniforms.uViewSize.value = [this.calcCords.w, this.calcCords.h];
        plane.uniforms.uPlanePosition.value = [
          this.calcCords.x,
          this.calcCords.y,
        ];

        // animate

        const tl = gsap.timeline();
        CustomEase.create("easeName", "0.215, 0.61, 0.355, 1");
        // this.curtains.enableDrawing()
        tl.to("#webgl", { zIndex: 2, duration: 0 });
        tl.to(plane.uniforms.uProgress, {
          value: 1,
          duration: 1.5,
          easing: "easeName",
          onComplete: () => {
            this.$router.push(
              `photoseries/${this.photoseries[ctx.index].Route}`
            );
          },
        });

        // const tl = anime.timeline({ autoplay: false, easing: 'linear' })
        // tl.add({
        //   targets: '#webgl',
        //   zIndex: 2,
        //   duration: 0
        // })
        //   .add({
        //     targets: plane.uniforms.uProgress,
        //     value: 1,
        //     duration: this.duration,
        //     easing: 'cubicBezier(0.215, 0.61, 0.355, 1)',
        //     complete: () => {
        //       this.$router.push(`photoseries/${this.photoseries[ctx.index].Route}`)
        //     }
        //   })
        tl.play();
      });
      //   this.toFullscreen(ctx)
    },

    // activateAnimate (ctx) {
    //   this.toFullscreen(ctx)
    // },
    // preparePlane (ctx) {
    //   const plane = this.planes[ctx.index]
    //   plane.loadSources(ctx.img)
    //   // считаем вестор для нормализации изображения в шейдере
    //   let xNormalized, yNormalized
    //   if (window.innerHeight / window.innerWidth > ctx.aspect) {
    //     xNormalized = (window.innerWidth / window.innerHeight) * ctx.aspect
    //     yNormalized = 1
    //   } else {
    //     xNormalized = 1
    //     yNormalized = window.innerHeight / window.innerWidth / ctx.aspect
    //   }
    //   plane.uniforms.uResolution.value = [xNormalized, yNormalized]
    //   // this.getUnifors(ctx)
    // },
    // route (a) {
    //   this.$router.push(`photoseries/${a}`)
    // },
    initCurtains() {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio,
        watchScroll: true,
        antialias: false,
      });
      for (const value of this.$refs.CurtainsPlanes) {
        const plane = this.curtains.addPlane(value.$el, this.params);
        this.planes.push(plane);
      }
      // this.curtains.disableDrawing()
    },
    // getUnifors (i) {
    //   // eslint-disable-next-line security/detect-object-injection
    //   const plane = this.planes[i.index]
    //   const rectPlane = plane.getBoundingRect()
    //   // ширина плана в условных еденицах
    //   this.calcCords.w = (window.innerWidth / rectPlane.width) * this.curtains.pixelRatio
    //   this.calcCords.h = (window.innerHeight / rectPlane.height) * this.curtains.pixelRatio
    //   // вектор для перемещения плана при увеличении до размера окна
    //   this.calcCords.x = (rectPlane.left / rectPlane.width - this.calcCords.w / 2 + 0.5) * 2
    //   this.calcCords.y = (-(rectPlane.top / rectPlane.height - this.calcCords.h / 2) - 0.5) * 2

    //   this.calcCords.mouseX = (i.x / rectPlane.width) * this.curtains.pixelRatio
    //   this.calcCords.mouseY = 1 - (i.y / rectPlane.height) * this.curtains.pixelRatio

    //   plane.uniforms.uMouse.value = [this.calcCords.mouseX, this.calcCords.mouseY]
    //   plane.uniforms.uViewSize.value = [this.calcCords.w, this.calcCords.h]
    //   plane.uniforms.uPlanePosition.value = [this.calcCords.x, this.calcCords.y]
    // },
    gsap() {
      // const tl = gsap.timline()
      // tl.to('#webgl', { zIndex: 2, duration: 0 })
      // tl.to(plane.uniforms.uProgress, {
      //   value: 1,
      //   duration: this.duration,
      //   easing: 'cubicBezier(0.215, 0.61, 0.355, 1)',
      //   onComplete: () => {
      //     this.$router.push(`photoseries/${this.photoseries[i.index].Route}`)
      //   }
      // })
    },
    // toFullscreen (i) {
    //   this.getUnifors(i)
    //   // eslint-disable-next-line security/detect-object-injection
    //   const plane = this.planes[i.index]
    //   console.log(gsap)
    //   const tl = gsap.timeline()
    // CustomEase.create('easeName', '0.215, 0.61, 0.355, 1')
    //   tl.to('#webgl', { zIndex: 2, duration: 0 })

    //   tl.to(plane.uniforms.uProgress, {
    //     value: 1,
    //     duration: 1.5,
    //     easing: 'easeName',
    //     onComplete: () => {
    //       // console.log(this)
    //       //  debugger
    //       this.$router.push(`photoseries/${this.photoseries[i.index].Route}`)
    //     }
    //   })

    //   // const tl = anime.timeline({ autoplay: false, easing: 'linear' })
    //   // tl.add({
    //   //   targets: '#webgl',
    //   //   zIndex: 2,
    //   //   duration: 0
    //   // })
    //   //   .add({
    //   //     targets: plane.uniforms.uProgress,
    //   //     value: 1,
    //   //     duration: this.duration,
    //   //     easing: 'cubicBezier(0.215, 0.61, 0.355, 1)',
    //   //     complete: () => {
    //   //       this.$router.push(`photoseries/${this.photoseries[i.index].Route}`)
    //   //     }
    //   //   })
    //   // .add(
    //   //   {
    //   //     targets: plane.uniforms.uProgress,
    //   //     value: 0,
    //   //     easing: 'cubicBezier(0.445, 0.05, 0.55, 0.95)',
    //   //     duration: this.duration
    //   //   }
    //   //   // '+=1500'
    //   // )
    //   // tl.play()
    // },
    updateScroll(event) {
      this.curtains.updateScrollValues(
        event.target.scrollTop,
        event.target.scrollLeft
      );
      for (const val of this.curtains.planes) {
        val.updateScrollPosition();
      }
    },
  },
};
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
// img {
//   display: none;
// }
.seriya {
  position: absolute;
  will-change: transform;
  padding: 0 2.5vw;
  height: 100vh;
  display: flex;
  align-items: center;
  &__container {
    position: relative;
    margin: auto 3vw;
    text-align: center;
    &:nth-child(odd) {
      width: calc(62vh * 1.5);
      height: 62vh;
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
.plane-title {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: translate3D(-50%, -50%, 0);
  font-size: 4vw;
  font-weight: 100;
  line-height: 1.2;
  // text-transform: uppercase;
  color: #43adf3;
  -webkit-text-stroke: 0.5px white;

  transition: color 0.5s;
}
.lazy__original {
  width: 100%;
  height: 100%;
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

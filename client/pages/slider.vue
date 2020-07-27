<template>
  <div id="content">
    <h1 id="title">Photoseries</h1>
    <div id="webgl" ref="webgl"></div>
    <!-- drag slider -->
    <div id="planes" ref="planes" class="seriya">
      <div
        v-for="(seriya, index) in photoseries"
        :key="seriya.Id"
        class="seriya__container"
      >
        <span class="plane-title">{{ seriya.Title }}</span>
        <lazypicture
          ref="CurtainsPlanes"
          :color="seriya.Color"
          :current-width="710"
          :file="seriya.FileName"
          :full-screen-image="true"
          :my-index="index"
          @myClick="activateAnimate"
        />
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import { Curtains } from "curtainsjs";
import anime from "animejs";
import photoseries from "~/static/db/Photoseries.json";
import { vertex, fragment } from "~/assets/shaderPhotoseries.js";
// class Slider {
//   /** * CONSTRUCTOR ***/

//   constructor (options = {}) {
//     // our options
//     this.options = {
//       // slider state and values
//       // the div we are going to translate
//       element: options.element || document.getElementById('planes'),
//       // easing value, the lower the smoother
//       easing: options.easing || 0.1,
//       // translation speed
//       // 1: will follow the mouse
//       // 2: will go twice as fast as the mouse, etc
//       dragSpeed: options.dragSpeed || 1,
//       // duration of the in animation
//       duration: options.duration || 750
//     }

//     // if we are currently dragging
//     this.isMouseDown = false
//     // if the slider is currently translating
//     this.isTranslating = false

//     // current position
//     this.currentPosition = 0
//     // drag start position
//     this.startPosition = 0
//     // drag end position
//     this.endPosition = 0

//     // slider translation
//     this.translation = 0

//     this.animationFrame = null

//     // we'll need to set up our slider here...
//   }
// }
export default {
  data() {
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
          uViewSize: { name: "uViewSize", type: "2f", value: [] },
          uMouse: { name: "uMouse", type: "2f", value: [] },
          uPlanePosition: { name: "uPlanePosition", type: "2f", value: [] },
          uResolution: { name: "uResolution", type: "2f", value: [] },
          uProgress: { name: "uProgress", type: "1f", value: 0 },
        },
      },
      slider: null,
      options: {
        // slider state and values
        // the div we are going to translate
        element: null,
        // easing value, the lower the smoother
        easing: 0.05,
        // translation speed
        // 1: will follow the mouse
        // 2: will go twice as fast as the mouse, etc
        dragSpeed: 2,
        // duration of the in animation
        duration: 750,
      },
      // if we are currently dragging
      isMouseDown: false,
      // if the slider is currently translating
      isTranslating: false,

      // current position
      currentPosition: 0,
      // drag start position
      startPosition: 0,
      // drag end position
      endPosition: 0,

      // slider translation
      translation: 0,

      animationFrame: null,
    };
  },
  mounted() {
    this.options.element = this.$refs.planes;
    // this.setupSlider()
    // this.slider = new Slider(this.options)
    this.initCurtains();
    // console.log(this.slider)
  },
  methods: {
    /** * HELPERS ***/
    activateAnimate(ctx) {
      // create

      const plane = this.curtains.addPlane(
        this.$refs.CurtainsPlanes[ctx.index].$el,
        this.params
      );

      // prepare

      plane.onReady(() => {
        let xNormalized, yNormalized;
        if (window.innerHeight / window.innerWidth > ctx.aspect) {
          xNormalized = (window.innerWidth / window.innerHeight) * ctx.aspect;
          yNormalized = 1;
        } else {
          xNormalized = 1;
          yNormalized = window.innerHeight / window.innerWidth / ctx.aspect;
        }
        plane.uniforms.uResolution.value = [xNormalized, yNormalized];

        // get uniforms

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

        const tl = anime.timeline({ autoplay: false, easing: "linear" });
        tl.add({
          targets: "#webgl",
          zIndex: 2,
          duration: 0,
        }).add({
          targets: plane.uniforms.uProgress,
          value: 1,
          duration: this.duration,
          easing: "cubicBezier(0.215, 0.61, 0.355, 1)",
          complete: () => {
            this.$router.push(
              `photoseries/${this.photoseries[ctx.index].Route}`
            );
          },
        });
        tl.play();
      });
      //   this.toFullscreen(ctx)
    },

    initCurtains() {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio,
        watchScroll: true,
      });
    },
    // lerp function used for easing
    lerp(value1, value2, amount) {
      amount = amount < 0 ? 0 : amount;
      amount = amount > 1 ? 1 : amount;
      return (1 - amount) * value1 + amount * value2;
    },
    // return our mouse or touch position
    getMousePosition(e) {
      let mousePosition;
      if (e.targetTouches) {
        if (e.targetTouches[0]) {
          mousePosition = [
            e.targetTouches[0].clientX,
            e.targetTouches[0].clientY,
          ];
        } else if (e.changedTouches[0]) {
          // handling touch end event
          mousePosition = [
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY,
          ];
        } else {
          // fallback
          mousePosition = [e.clientX, e.clientY];
        }
      } else {
        mousePosition = [e.clientX, e.clientY];
      }

      return mousePosition;
    },
    // set the slider boundaries
    // we will translate it horizontally in landscape mode
    // vertically in portrait mode
    setBoundaries() {
      if (window.innerWidth >= window.innerHeight) {
        // landscape
        this.boundaries = {
          max: -1 * this.options.element.clientWidth + window.innerWidth,
          min: 0,
          sliderSize: this.options.element.clientWidth,
          referentSize: window.innerWidth,
        };

        // set our slider direction
        this.direction = 0;
      } else {
        // portrait
        this.boundaries = {
          max: -1 * this.options.element.clientHeight + window.innerHeight,
          min: 0,
          sliderSize: this.options.element.clientHeight,
          referentSize: window.innerHeight,
        };

        // set our slider direction
        this.direction = 1;
      }
    },
    /** * HOOKS ***/

    // this is called once our mousedown / touchstart event occurs and the drag starts
    onDragStarted(mousePosition) {
      // we'll use it later
      // note the mouse/touch position parameter
    },

    // this is called while we are currently dragging the slider
    onDrag(mousePosition) {
      // we'll use it later
      // note the mouse/touch position parameter
    },

    // this is called once our mouseup / touchend event occurs and the drag ends
    onDragEnded(mousePosition) {
      // we'll use it later
      // note the mouse/touch position parameter
    },

    // this is called continuously while the slider is translating
    onTranslation() {
      // we'll use it later
    },

    // this is called once the translation has ended
    onTranslationEnded() {
      // we'll use it later
    },

    // this is called after our slider has been resized
    onSliderResized() {
      // we'll use it later
    },

    /** * ANIMATIONS ***/

    // this will translate our slider HTML element and set up our hooks
    translateSlider(translation) {
      translation = Math.floor(translation * 100) / 100;

      // should we translate it horizontally or vertically?
      const direction = this.direction === 0 ? "translateX" : "translateY";
      // apply translation
      this.options.element.style.transform =
        direction + "(" + translation + "px)";

      // if the slider translation is different than the translation to apply
      // that means the slider is still translating
      if (this.translation !== translation) {
        // hook function to execute while we are translating
        this.onTranslation();
      } else if (this.isTranslating && !this.isMouseDown) {
        // if those conditions are met, that means the slider is no longer translating
        this.isTranslating = false;

        // hook function to execute after translation has ended
        this.onTranslationEnded();
      }

      // finally set our translation
      this.translation = translation;
    },

    // this is our request animation frame loop where we will translate our slider
    animate() {
      // interpolate values
      const translation = this.lerp(
        this.translation,
        this.currentPosition,
        this.options.easing
      );

      // apply our translation
      this.translateSlider(translation);
      // console.log(translation);

      this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    },

    /** * EVENTS ***/

    // on mouse down or touch start
    onMouseDown(e) {
      // start dragging
      this.isMouseDown = true;

      // apply specific styles
      this.options.element.classList.add("dragged");

      // get our touch/mouse start position
      const mousePosition = this.getMousePosition(e);
      // use our slider direction to determine if we need X or Y value
      this.startPosition = mousePosition[this.direction];

      // drag start hook
      this.onDragStarted(mousePosition);
    },

    // on mouse or touch move
    onMouseMove(e) {
      // if we are not dragging, we don't do nothing
      if (!this.isMouseDown) return;

      // get our touch/mouse position
      const mousePosition = this.getMousePosition(e);

      // get our current position
      this.currentPosition =
        this.endPosition +
        (mousePosition[this.direction] - this.startPosition) *
          this.options.dragSpeed;

      // if we're not hitting the boundaries
      if (
        this.currentPosition > this.boundaries.min &&
        this.currentPosition < this.boundaries.max
      ) {
        // if we moved that means we have started translating the slider
        this.isTranslating = true;
      } else {
        // clamp our current position with boundaries
        this.currentPosition = Math.min(
          this.currentPosition,
          this.boundaries.min
        );
        this.currentPosition = Math.max(
          this.currentPosition,
          this.boundaries.max
        );
      }

      // drag hook
      this.onDrag(mousePosition);
    },

    // on mouse up or touchend
    onMouseUp(e) {
      // we have finished dragging
      this.isMouseDown = false;

      // remove specific styles
      this.options.element.classList.remove("dragged");

      // update our end position
      this.endPosition = this.currentPosition;

      // send our mouse/touch position to our hook
      const mousePosition = this.getMousePosition(e);

      // drag ended hook
      this.onDragEnded(mousePosition);
    },

    // on resize we will need to apply old translation value to new sizes
    onResize(e) {
      // get our old translation ratio
      const ratio = this.translation / this.boundaries.sliderSize;

      // reset boundaries and properties bound to window size
      this.setBoundaries();

      // reset all translations
      this.options.element.style.transform = "tanslate3d(0, 0, 0)";

      // calculate our new translation based on the old translation ratio
      let newTranslation = ratio * this.boundaries.sliderSize;
      // clamp translation to the new boundaries
      newTranslation = Math.min(newTranslation, this.boundaries.min);
      newTranslation = Math.max(newTranslation, this.boundaries.max);

      // apply our new translation
      this.translateSlider(newTranslation);

      // reset current and end positions
      this.currentPosition = newTranslation;
      this.endPosition = newTranslation;

      // call our resize hook
      this.onSliderResized();
    },

    /** * SET UP AND DESTROY ***/

    // set up our slider
    // init its boundaries, add event listeners and start raf loop
    setupSlider() {
      this.setBoundaries();

      // event listeners

      // mouse events
      window.addEventListener("mousemove", this.onMouseMove.bind(this), {
        passive: true,
      });
      window.addEventListener("mousedown", this.onMouseDown.bind(this));
      window.addEventListener("mouseup", this.onMouseUp.bind(this));

      // touch events
      window.addEventListener("touchmove", this.onMouseMove.bind(this), {
        passive: true,
      });
      window.addEventListener("touchstart", this.onMouseDown.bind(this), {
        passive: true,
      });
      window.addEventListener("touchend", this.onMouseUp.bind(this));

      // resize event
      window.addEventListener("resize", this.onResize.bind(this));

      // launch our request animation frame loop
      this.animate();
    },

    // will be called silently to cleanly remove the slider
    destroySlider() {
      // remove event listeners

      // mouse events
      window.removeEventListener("mousemove", this.onMouseMove, {
        passive: true,
      });
      window.removeEventListener("mousedown", this.onMouseDown);
      window.removeEventListener("mouseup", this.onMouseUp);

      // touch events
      window.removeEventListener("touchmove", this.onMouseMove, {
        passive: true,
      });
      window.removeEventListener("touchstart", this.onMouseDown, {
        passive: true,
      });
      window.removeEventListener("touchend", this.onMouseUp);

      // resize event
      window.removeEventListener("resize", this.onResize);

      // cancel request animation frame
      cancelAnimationFrame(this.animationFrame);
    },

    // call this method publicly to destroy our slider
    destroy() {
      // destroy everything related to the slider
      this.destroySlider();
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen {
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

  #title {
    position: fixed;
    top: 20px;
    right: 20px;
    left: 20px;
    z-index: 1;
    pointer-events: none;
    font-size: 1.5em;
    line-height: 1;
    margin: 0;
    text-transform: uppercase;
    color: #032f4d;
    text-align: center;
  }

  /* disable pointer events and text selection during drag */
  #planes.dragged .plane-wrapper {
    pointer-events: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .plane-title {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    transform: translate3D(-50%, -50%, 0);
    font-size: 4vw;
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
    color: #032f4d;
    -webkit-text-stroke: 1px white;

    transition: color 0.5s;
  }

  #planes.dragged .plane-title {
    color: transparent;
  }

  .plane {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    overflow: hidden;
    transition: filter 0.5s;
  }

  #planes.dragged .plane {
    filter: grayscale(1);
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

<template>
  <main class="wrapper">
    <div id="canvas" ref="webgl"></div>
    <div
      v-for="image in images"
      :key="image.src"
      ref="plane"
      class="plane"
    >
      <img
        alt
        crossorigin="anonymous"
        :src="image.src"
      />
    </div>
  </main>
</template>

<script>
import { Curtains } from 'curtainsjs'
import { vertex, fragment, fspass } from '~/assets/shaderinit2.js'
// eslint-disable-next-line no-unused-vars
// import anime from 'animejs'
export default {
  data () {
    return {
      curtains: null,
      plane: null,
      planesDeformation: 0,
      planes: [],
      images:
        [{ src: '/image/jpg/1024/19-03-02-17-25-38.jpg' },
          { src: '/image/jpg/1024/19-03-02-13-46-07.jpg' },
          { src: '/image/jpg/1024/19-05-01-13-36-02.jpg' }],
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
      shaderPass: null,
      params: {
        vertexShader: vertex,
        fragmentShader: fragment,
        shareProgram: true,
        uniforms: {
          planeDeformation: {
            name: 'uPlaneDeformation',
            type: '1f',
            value: 0
          }
        }
      }
    }
  },
  computed: {},
  mounted () {
    this.setupCurtains()
    this.init()
  },
  methods: {
    shaderP () {
      // this.shaderPass = this.curtains.addShaderPass(this.shaderPassParams)
    },
    lerp (start, end, amt) {
      // debugger
      return (1 - amt) * start + amt * end
    },
    setupCurtains () {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio,
        antialias: false
      })
    },
    init () {
      this.curtains.onRender(() => {
        // update our planes deformation
        // increase/decrease the effect
        this.planesDeformation = this.lerp(this.planesDeformation, 0, 0.1)
        // console.log(this.planesDeformation)
      }).onScroll(() => {
      // get scroll deltas to apply the effect on scroll
        var delta = this.curtains.getScrollDeltas()

        // invert value for the effect
        delta.y = -delta.y

        // threshold
        if (delta.y > 60) {
          delta.y = 60
        } else if (delta.y < -60) {
          delta.y = -60
        }

        if (Math.abs(delta.y) > Math.abs(this.planesDeformation)) {
          this.planesDeformation = this.lerp(this.planesDeformation, delta.y, 0.5)
        }
        // debugger
        // console.log(this.planesDeformation)
      })
      this.shaderPass = this.curtains.addShaderPass(this.shaderPassParams)
      this.shaderPass.onRender(() => {
        this.shaderPass.uniforms.displacement.value = this.planesDeformation / 1000
      })

      for (const value of this.$refs.plane) {
        const plane = this.curtains.addPlane(value, this.params)
        plane.onRender(() => {
          // plane.uniforms.planeDeformation.value = this.planesDeformation / 60 // update our time uniform value
        //  console.log(plane.uniforms.planeDeformation.value)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}
#canvas {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 100vh;
  z-index: 10;
}
.plane {
  width: 80%;
  height: 80vh;
  margin: 10vh auto;
}
.plane img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: 50% 50%;
  display: none;
}
</style>

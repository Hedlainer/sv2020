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
import { vertex, fragment } from '~/assets/shaderinit.js'
// eslint-disable-next-line no-unused-vars
// import anime from 'animejs'
export default {
  data () {
    return {
      curtains: null,
      plane: null,
      planes: [],
      images:
        [{ src: '/image/jpg/1024/19-03-02-17-25-38.jpg' },
          { src: '/image/jpg/1024/19-03-02-13-46-07.jpg' },
          { src: '/image/jpg/1024/19-05-01-13-36-02.jpg' }],
      params: {
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          time: {
            name: 'uTime',
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
    this.setupPlane()
  },
  methods: {
    setupCurtains () {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio
      })
    },
    handlePlanes (i) {
      // eslint-disable-next-line security/detect-object-injection
      const plane = this.planes[i]
      plane.onRender(() => {
        plane.uniforms.time.value++ // update our time uniform value
      })
    },
    setupPlane () {
      // eslint-disable-next-line no-loops/no-loops
      for (let i = 0; i < this.$refs.plane.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        this.plane = this.curtains.addPlane(this.$refs.plane[i], this.params)
        if (this.plane) {
          this.planes.push(this.plane)
          this.handlePlanes(i)
        }
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
  width: 100%;
  height: 100vh;
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

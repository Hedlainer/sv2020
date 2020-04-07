<template>
  <main class="wrapper" @mousewheel.passive="changeSpeed">
    <div id="canvas" ref="webgl"></div>
    <div ref="plane" class="plane">
      <!-- <h1>{{position}}</h1>
      <h1>{{Math.abs(Math.floor(position) - position)}}</h1>
      <h1>{{changeIndex}}</h1>-->
      <!-- <img decoding="async" crossorigin="anonymous" src="/img/15201-05-19.jpg" alt>
      <img decoding="async" crossorigin="anonymous" src="/img/183 05-05-19.jpg" alt>
      <img decoding="async" crossorigin="anonymous" src="/img/15301-05-19.jpg" alt>-->
    </div>
  </main>
</template>

<script>
import { Curtains } from 'curtainsjs'
import anime from 'animejs/lib/anime.es.js'
import { vertex, fragment } from '~/assets/shadertest.js'
export default {
  data () {
    return {
      im1: undefined,
      im2: undefined,
      im3: undefined,
      images: [],
      changeIndex: 0,
      animation: undefined,
      activeTextureIndex: 0,
      nextTextureIndex: 1,
      speed: 0,
      position: 0,
      pos: 0,
      curtains: null,
      plane: null,
      params: {
        vertexShader: vertex,
        fragmentShader: fragment,
        autoloadSources: false,
        uniforms: {
          progress: {
            name: 'uProgress',
            type: '1f',
            value: 0
          }
        }
      }
    }
  },
  watch: {
    changeIndex () {
      this.plane.userData.activeTex.setSource(
        this.plane.images[this.changeIndex]
      )
      this.plane.userData.nextTex.setSource(
        this.plane.images[this.changeIndex + 1]
      )
    }
  },
  mounted () {
    this.setupCurtains()
    this.setupPlane()
    this.Animation()

    console.log(this.plane)
    this.im1 = new Image()
    this.im1.src = '/image/jpg/1024/19-03-02-12-14-44.jpg'
    this.im1.decode().then(() => {
    //   this.plane.loadSource(img)
      console.log('я декадировалась', this.im1)
    //   // this.plane.userData.activeTex.setSource(img);
    })
  },
  beforeMount () {
    function asyncImage (img, src) {
      img = new Image()
      img.src = src
      img.crossOrigin = 'anonymous'
    //   img.decoding = 'async'
    }
    asyncImage(this.im1, '/image/jpg/1024/19-03-02-12-14-44.jpg')
    asyncImage(this.im2, '/image/jpg/1024/19-03-02-21-55-28.jpg')
    asyncImage(this.im3, '/image/jpg/1024/19-03-02-13-46-07.jpg')
  },
  methods: {
    changeSpeed ($event) {
      this.speed += $event.deltaY * 0.0002
    },
    Animation () {
      this.animation = anime({
        autoplay: true,
        loop: true,
        changeBegin: () => {},
        change: () => {
          this.plane.uniforms.progress.value = this.position
          this.changeIndex = this.position < 1 ? 0 : 1
        },
        update: () => {
          this.position += this.speed
          this.speed *= 0.7
          const i = Math.round(this.position)
          const dif = i - this.position

          this.position += dif * 0.037
          if (Math.abs(i - this.position) < 0.00001) {
            this.position = i
          }
        }
        // changeComplete: () => this.setTexture()
      })
    },
    setupCurtains () {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio
      })
    },
    setupPlane () {
      this.plane = this.curtains.addPlane(this.$refs.plane, this.params)
      if (this.plane) {
        this.plane.userData = {
          activeTex: this.plane.createTexture({ sampler: 'activeTex' }),
          nextTex: this.plane.createTexture({ sampler: 'nextTex' })
        }

        // this.plane.loadSources(this.images)
        // this.plane.userData.activeTex.setSource(this.images[0])
        // this.plane.userData.nextTex.setSource(this.images[1])
        // const img = new Image()
        // img.src = '/image/jpg/1024/19-03-02-21-55-28.jpg'
        // img.crossOrigin = 'anonymous'
        // img.decoding = 'async'
        // img.decode().then(() => {
        //   this.plane.loadSource(img)
        //   console.log('я декадировалась', img)
        //   // this.plane.userData.activeTex.setSource(img);
        // })
        // const img2 = new Image()
        // img2.src = '/image/jpg/1024/19-03-02-13-46-07.jpg'
        // img2.crossOrigin = 'anonymous'
        // img2.decoding = 'async'
        // img2.decode().then(() => {
        //   this.plane.loadSource(img2)
        //   console.log('я декадировалась', img2)
        //   // this.plane.userData.activeTex.setSource(img2);
        // })
        // const img3 = new Image()
        // img3.src = '/image/jpg/1024/19-03-02-21-06-25.jpg'
        // img3.crossOrigin = 'anonymous'
        // img3.decoding = 'async'
        // img3.decode().then(() => {
        //   this.plane.loadSource(img3)
        //   console.log('я декадировалась', img3)
        // })
        // eslint-disable-next-line no-unused-vars
        const asyncPlane = async () => {
          await this.im1.decode()
          await this.im2.decode()
          await this.im3.decode()
          this.plane.loadImages([this.im1, this.im2, this.im3])
          this.plane.userData.activeTex.setSource(this.im1)
          this.plane.userData.nextTex.setSource(this.im2)
        }
        // }
        // eslint-disable-next-line no-debugger
        // debugger
        // asyncPlane()
        this.plane
          .onLoading(() => {
            // this.plane.loadSource()
            // this.plane.userData.activeTex.setSource(this.images[0])
            // this.plane.userData.nextTex.setSource(this.images[1])
            // this.setTexture()
          })
          .onRender(() => {})
      }
    },
    setIndex () {
      this.activeTextureIndex =
        (Math.floor(this.position) - 1 + this.plane.images.length) %
        this.plane.images.length
      this.nextTextureIndex =
        (((Math.floor(this.position) + 1) % this.plane.images.length) -
          1 +
          this.plane.images.length) %
        this.plane.images.length
    },
    setTexture () {
      // debugger;
      this.plane.userData.activeTex.setSource()
      this.plane.userData.nextTex.setSource()
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
}
.knopka {
  position: absolute;
  left: 200px;
}
.wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}
.measure {
  position: fixed;
  z-index: 1000;
  height: 400px;
  border-left: 5px solid #fff;
  left: 50px;
  top: 50px;
  & > * {
    width: 10px;
    height: 10px;
    background: red;
    position: absolute;
  }
}
.m1 {
  top: 0;
}
.m2 {
  top: 200px;
}
.m3 {
  top: 400px;
}
.dot {
  background: green;
  left: 20px;
  width: 20px;
  height: 20px;
}
#canvas {
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: -1;
}
.plane {
  width: 100%;
  height: 100vh;
  //   margin: 10vh auto;
}
.plane img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  display: none;
}
</style>

<!-- РАБОЧИЙ СЛАЙДЕР БЕЗ ДЕКОДИРОВАНИЯ ЧЕРЕЗ КАНВУ -->
<template>
  <main class="wrapper" @mousewheel.passive="changeSpeed">
    <div class="fixscroll" @scroll="getScrollPosition">
      <div ref="sc" class="scroller">
        <!-- <p class="poshandler">
          {{ scrollPos }}
        </p> {{ scrollPos }} -->
      </div>
    </div>
    <div
      id="canvas"
      ref="webgl"
      class="dot2"
    ></div>
    <div
      ref="plane"
      class="plane"
      @load="eee"
    >
      <!-- <h1>{{ position }}</h1> -->
      <!-- <h1>{{ speed }}</h1> -->
      <h1>{{ scrollPos }}</h1>
      <!-- <img
        ref="img1"
        alt
        crossorigin="anonymous"
        decoding="async"
        src="/image/jpg/1024/19-03-02-21-06-25.jpg"
      />
      <img
        ref="img2"
        alt
        crossorigin="anonymous"
        decoding="async"
        src="/image/jpg/1024/19-03-02-13-46-07.jpg"
      />
      <img
        ref="img3"
        alt
        crossorigin="anonymous"
        decoding="async"
        src="/image/jpg/1024/19-03-02-21-55-28.jpg"
      /> -->
      <canvas ref="c1"></canvas>
      <canvas ref="c2"></canvas>
    </div>
  </main>
</template>

<script>
import { Curtains } from 'curtainsjs'
import anime from 'animejs'
import { vertex, fragment } from '~/assets/shadertest.js'
export default {
  data () {
    return {
      animation: null,
      activeTextureIndex: 0,
      nextTextureIndex: 1,
      speed: 0,
      position: 0,
      position2: 0,
      pos: 0,
      curtains: undefined,
      plane: undefined,
      scrollPos: '',
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

  mounted () {
    this.setupCurtains()
    this.setupPlane()

    const animation = anime({
      autoplay: false,
      targets: '.dot2',
      easing: 'linear'
      // translateX: 750,
      // rotate: 45,
      // scale: 0.9
    })
    const canvas1 = this.$refs.c1
    const canvas2 = this.$refs.c2

    const ctx1 = canvas1.getContext('2d')
    const ctx2 = canvas2.getContext('2d')
    const images = []

    // const img1 = this.$refs.img1
    // const img2 = this.$refs.img2
    // const img3 = this.$refs.img3
    const img1 = new Image()
    img1.src = '/image/jpg/1024/19-03-02-21-06-25.jpg'
    img1.decoding = 'async'
    const img2 = new Image()
    img2.src = '/image/jpg/1024/19-03-02-13-46-07.jpg'
    img2.decoding = 'async'
    const img3 = new Image()
    img3.src = '/image/jpg/1024/19-03-02-21-55-28.jpg'
    img3.decoding = 'async'

    img1.decode().then(() => {
      console.log('decode1')
      images.push(img1)
      canvas1.width = img1.naturalWidth
      canvas1.height = img1.naturalHeight
      ctx1.drawImage(img1, 0, 0)
      this.plane.loadCanvas(canvas1)
      this.plane.userData.activeTex.setSource(canvas1)
    })

    img2.decode().then(() => {
      console.log('decode2')
      images.push(img2)
      canvas2.width = img2.naturalWidth
      canvas2.height = img2.naturalHeight
      ctx2.drawImage(img2, 0, 0)
      this.plane.loadCanvas(canvas2)
      this.plane.userData.nextTex.setSource(canvas2)
    })

    img3.decode().then(() => {
      console.log('decode3')
      images.push(img3)
      ctx2.drawImage(img3, 0, 0)
      ctx1.drawImage(img3, 0, 0)
    })
    // console.log(images);
    Promise.all([img1.decode(), img2.decode(), img3.decode()]).then(() => {
      // this.curtains.enableDrawing();
      // this.setTexture();
      raf()
    })

    const raf = () => {
      this.position += this.speed
      // чем меньше цифра тем больше нужно крутить колёсико типа расстояниея которое нужно прокрутить
      this.speed *= 0.7
      // turget position round number Прилипчивость к половине так как округляем до целого
      const i = Math.round(this.position)
      // const dif = i - this.position
      // LERP!!!
      // i target position
      // this.position - current position
      // * 0,some number - coef lerp с какой скоростью бужет прилипать чем больше тем сильнее крутить
      this.position += (i - this.position) * 0.037

      if (Math.abs(i - this.position) < 0.00001) {
        this.position = i
      }
      this.position2 = this.position - Math.floor(this.position)

      animation.seek(animation.duration * this.position)

      // if (this.position > images.length - 1) {
      //   this.position = 0
      // }
      // this.plane.uniforms.progress.value = this.position
      // ctx1.drawImage(images[Math.floor(this.position)], 0, 0)
      // ctx2.drawImage(images[Math.floor(this.position) + 1], 0, 0)

      this.scrollPos += (1600 - this.scrollPos) * 0.037
      this.$refs.sc.scrollTo(this.scrollPos, this.scrollPos)
      requestAnimationFrame(raf)
    }
  },
  methods: {
    getScrollPosition ($event) {
      this.scrollPos = $event.target.scrollTop
      console.log($event)
    },
    eee () {
      console.log('типа загрузилось')
    },
    changeSpeed ($event) {
      this.speed += $event.deltaY * 0.0002
    },
    setupCurtains () {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio
      })
      // this.curtains.disableDrawing();
    },

    setupPlane () {
      this.plane = this.curtains.addPlane(this.$refs.plane, this.params)
      if (this.plane) {
        this.plane.userData = {
          activeTex: this.plane.createTexture({ sampler: 'activeTex' }),
          nextTex: this.plane.createTexture({ sampler: 'nextTex' })
        }
        this.plane
          .onReady(() => {
            // this.plane.loadCanvases([this.$refs.c1, this.$refs.c2]);
            // this.setTexture();
          })
          .onRender(() => {
            // this.plane.uniforms.progress.value = this.position;
          })
        //   .onLoading(() => console.log("I'm load"))
      }
    },
    setTexture () {
      this.plane.userData.activeTex.setSource(this.plane.canvases[0])
      this.plane.userData.nextTex.setSource(this.plane.canvases[1])
    }
  }
}
</script>

<style lang="scss" scoped>
h1{
  background-color: blanchedalmond;
}
.wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}
#canvas {
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: -1;
  /* opacity: 0.5; */
}
.plane {
  width: 80%;
  height: 80vh;
  margin: 10vh auto;
}
.plane canvas,
img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.5;
  display: none;
}
.dot {
  position: fixed;
  background: green;
  left: 20px;
  width: 20px;
  height: 20px;
}
.fixscroll{
  position: fixed;
  left: 200px;
  top: 200px;
  min-width: 50vw;
  height: 50vh;
  background-color: white;
  overflow-y: auto;
}
.scroller{
height: 500vh;
position: relative;
background: rgb(153,0,255);
background: linear-gradient(180deg, rgba(153,0,255,1) 0%, rgba(0,158,89,1) 50%, rgba(252,230,69,1) 100%);
}
.poshandler{
  position: fixed;
  top: 0;
  left: 0;
}
</style>

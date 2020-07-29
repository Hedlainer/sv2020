<!--  eslint-disable vue/singleline-html-element-content-newline -->
<!--  eslint-disable vue/max-attributes-per-line -->
<!--  eslint-disable vue/mustache-interpolation-spacing -->
<!-- РАБОЧИЙ СЛАЙДЕР БЕЗ ДЕКОДИРОВАНИЯ ЧЕРЕЗ КАНВУ -->
<!-- eslint-disable prettier/prettier -->
<template>
  <main ref="sc" class="wrapper" style="" @scroll.passive="getScrollPosition">
    <div id="canvas" ref="webgl"></div>
    <div class="grid2">
      <!-- <h2>{{ main[1].Title }}</h2> -->
      <!-- eslint-disable-next-line vue/mustache-interpolation-spacing-->
    </div>
    <picture v-for="image in images" :key="image.src" ref="images" class="lazy__original">
      <source :srcset="`/image/webp/1920/${image.src}.webp`" type="image/webp" />
      <img alt="SvobodinaPhoto" crossorigin="anonimous" decoding="async" draggable="false"
        :src="`/image/jpg/1920/${image.src}.jpg`" />
    </picture>
    <div class="fixscroll">
      <div class="grid">
        <transition :css:="false" mode="out-in" name="split" @before-enter="beforeEnter" @enter="enter">
          <!-- <h3 :key="snab" ref="sab" class="description">
            <span v-for="(letter,index) in SubTitle" :key="index" class="letter">{{` ${letter}`}}</span>
          </h3> -->
          <svg class="description" fill="none"  width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <foreignObject width="100%" height="100%">
                <h3 :key="snab" ref="sab" class="description">
                  <span v-for="(letter,index) in SubTitle" :key="index" class="letter">{{` ${letter}`}}</span>
                </h3>
            </foreignObject>
          </svg>
        </transition>
        <div ref="plane" class="plane ">
          <canvas ref="c1"></canvas>
          <canvas ref="c2"></canvas>
        </div>
      </div>

      <!-- <div class="scroller"> -->
      <!-- </div> -->
    </div>
    <reviews />
    <!-- <h1>{{ position }}</h1> -->
  </main>
</template>

<script>
import main from "~/static/db/main.json";
import { Curtains } from "curtainsjs";
import anime from "animejs";
import { vertex, fragment } from "~/assets/shadertest.js";

export default {
  // asyncData() {
  //   return new Promise((resolve) => {
  //     setTimeout(function () {
  //       resolve({});
  //     }, 3000);
  //   });
  // },
  data() {
    return {
      main,
      images: [
        { src: "19-05-01-11-28-10" },
        { src: "19-08-24-17-09-02" },
        { src: "19-06-15-10-15-54" },
        { src: "19-07-27-10-47-57" },
        { src: "19-05-10-17-43-45" },
      ],
      lastPos: 0,
      timer: 0,
      delta: 0,
      delay: 50,
      animation: null,
      activeTextureIndex: 0,
      nextTextureIndex: 1,
      speed: 0,
      snab: 0,
      position: 0,
      position2: 0,
      pos: 0,
      curtains: undefined,
      plane: undefined,
      scrollPos: 0,
      scrollPos2: 0,
      params: {
        vertexShader: vertex,
        fragmentShader: fragment,
        autoloadSources: false,
        uniforms: {
          progress: {
            name: "uProgress",
            type: "1f",
            value: 0,
          },
        },
      },
    };
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    SubTitle() {
      switch (this.snab) {
        case 0:
          return main[0].Subtitle.split("\n");
        case 1:
          return main[1].Subtitle.split(" ");
        case 2:
          return main[2].Subtitle.split(" ");
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();

      setTimeout(() => {
        // debugger;
        this.$nuxt.$loading.finish();
      }, 500);
    });
    this.setupCurtains();
    this.setupPlane();
    // const els2 = document.querySelectorAll('.description')
    // const els = this.$refs.sab
    // console.log(els)
    // console.log(els2);
    // [].forEach.call(els2, function (el) {
    //   // outerHTML, thats *important*, no direct text nodes should be in parsed HTML
    //   el.outerHTML = Splitter(el.outerHTML, '<span class="letter">$</span>')
    // })

    const canvas1 = this.$refs.c1;
    const canvas2 = this.$refs.c2;

    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    var images = [];
    for (const iterator of this.$refs.images) {
      images.push(iterator.children[1].decode());
    }
    // const pr = Promise.all(images)

    const img1 = this.$refs.images[0].children[1];
    const img2 = this.$refs.images[1].children[1];
    // const img3 = this.$refs.images[2].children[1]

    const decode = async () => {
      await Promise.all(images);

      // await img1.decode()
      // await img2.decode()
      // await img3.decode()

      canvas1.width = img1.naturalWidth;
      canvas1.height = img1.naturalHeight;
      canvas2.width = img2.naturalWidth;
      canvas2.height = img2.naturalHeight;

      ctx1.drawImage(img1, 0, 0);
      this.plane.loadCanvas(canvas1);

      ctx2.drawImage(img2, 0, 0);
      this.plane.loadCanvas(canvas2);

      this.setTexture();

      raf();
    };
    decode();

    const raf = () => {
      const scrollHeight =
        document.querySelector(".fixscroll").offsetHeight / 5;
      this.snab = Math.round(this.scrollPos / scrollHeight);
      this.scrollPos += (this.snab * scrollHeight - this.scrollPos) * 0.057;
      // console.log(this.snab)
      if (Math.abs(this.snab - this.scrollPos / 1000) < 0.00001) {
        this.scrollPos = this.snab * 1000;
      }
      this.plane.uniforms.progress.value = this.scrollPos / 1000;

      ctx1.drawImage(
        this.$refs.images[Math.floor(this.scrollPos / 1000)].children[1],
        0,
        0
      );
      ctx2.drawImage(
        this.$refs.images[Math.floor(this.scrollPos / 1000) + 1].children[1],
        0,
        0
      );

      this.$refs.sc.scrollTo(0, this.scrollPos);
      // console.log(this.snab)

      requestAnimationFrame(raf);
    };
  },
  methods: {
    beforeEnter() {
      // el.style.opacity = 0
      // el.style.transformOrigin = 'left'
    },
    enter(el, done) {
      console.log(el);
      const els = el.querySelectorAll(".letter");
      anime({
        targets: els,
        translateY: ["-200%", "0%"],
        opacity: [0, 1],
        delay: anime.stagger(10, {
          easing: "easeOutSine",
          from: 10,
        }),
        easing: "linear",
        // eslint-disable-next-line no-unused-vars
        changeComplete(anime) {
          // console.log('animate!!!!')
          // console.log(anime)
          done();
        },
      });
      //   done()
    },
    getScrollPosition($event) {
      this.scrollPos = $event.target.scrollTop;
    },
    setupCurtains() {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio,
      });
    },

    setupPlane() {
      this.plane = this.curtains.addPlane(this.$refs.plane, this.params);
      if (this.plane) {
        this.plane.userData = {
          activeTex: this.plane.createTexture({ sampler: "activeTex" }),
          nextTex: this.plane.createTexture({ sampler: "nextTex" }),
        };
      }
    },
    setTexture() {
      this.plane.userData.activeTex.setSource(this.plane.canvases[0]);
      this.plane.userData.nextTex.setSource(this.plane.canvases[1]);
    },
  },
  // watch: {
  //   snab (newValue, oldValue) {
  //     anime({
  //       targets: '.description',
  //       changeComplete (anime) {
  //         console.log(anime)
  //       }
  //       // opacity: 0
  //     })
  //   }
  // },
  render(createElement) {
    return createElement("h1", this.snab);
  },
};
</script>

<style lang="scss">
.letter {
  display: inline-block;
  overflow: hidden;
  margin-block-start: 0px;
  margin-block-end: 0px;
  // border-style: solid;
  // border-color: red;
  // border-width: 1px;
}
.grid {
  position: sticky;
  display: grid;
  top: 0;
  height: 100vh;
  width: 100%;
  grid-template-rows: 1fr 1fr 2fr 4fr 2.66fr 5.33fr 5.33fr 4.33fr 2.83fr 3.5fr 3.5fr 2.83fr 4.33fr 5.33fr 5.33fr 2.66fr 4fr 2fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 2fr 4fr 2.66fr 5.33fr 5.33fr 4.33fr 2.83fr 3.5fr 3.5fr 2.83fr 4.33fr 5.33fr 5.33fr 2.66fr 4fr 2fr 1fr 1fr;
  // background: url(/image/ggr.svg) left top / 100% 100% no-repeat;
  .plane {
    grid-column: 3 / 14;
    grid-row: 4 / 18;
    canvas {
      display: none;
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
}

.description {
  grid-column: 15 / 19;
  grid-row: 7 / 15;
  max-width: 100%;
  margin: 0;
  white-space: pre-wrap;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  color: white;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.7);
}
img {
  display: none;
}
h1 {
  position: fixed;
  background-color: blanchedalmond;
}
.wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow-y: auto;
}
#canvas {
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: -1;
  display: block;
  // opacity: 0.5;
}
.fixscroll {
  height: 5000px;
}
</style>

<template>
  <main class="wrapper">
    <div id="canvas" ref="webgl"></div>
    <div v-for="image in images" :key="image.src" ref="plane" class="plane">
      <img alt crossorigin="anonymous" :src="image.src" />
      <div ref="title" class="title">{{ image.title }}</div>
    </div>
  </main>
</template>

<script>
import { Curtains } from "curtainsjs";
import { vertex, fragment, Tvertex, Tfragment } from "~/assets/shaderinit.js";
// import anime from 'animejs'
export default {
  data() {
    return {
      curtains: null,
      plane: null,
      title: null,
      planes: [],
      images: [
        {
          src: "/image/jpg/1024/19-03-02-17-25-38.jpg",
          title:
            "Реальная история вашего свадебного дня будет значить для вас намного больше, чем постановочная фотосессия. Имея большой опыт работы в репортажной фотографии, я работаю со спокойным и вдумчивым подходом. Продуманная композиция и понимание света создают красивые и содержательные фотографии настоящих моментов и эмоций.",
        },
        // {
        //   src: "/image/jpg/1024/19-03-02-13-46-07.jpg",
        //   title:
        //     "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus dicta, quidem consectetur cumque dolorum, magni voluptate minima, ex laborum",
        // },
        // {
        //   src: "/image/jpg/1024/19-05-01-13-36-02.jpg",
        //   title: "Lorem ipsum \n dolor sit amet",
        // },
      ],
      TitleParams: {
        vertexShader: Tvertex,
        fragmentShader: Tfragment,
        uniforms: {
          time: {
            name: "uTime",
            type: "1f",
            value: 0,
          },
        },
      },
      params: {
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          time: {
            name: "uTime",
            type: "1f",
            value: 0,
          },
        },
      },
    };
  },
  computed: {},
  mounted() {
    this.setupCurtains();
    this.setupPlane();
    this.setupTitlePlane();
    // console.log(this.$refs.title)
  },
  methods: {
    wrapText(ctx, text, mLeft, mTop, maxWidth, lineHeight) {
      let words = text.split(" ");
      let countWords = words.length;
      let line = "";
      for (let n = 0; n < countWords; n++) {
        let testLine = line + words[n] + " ";
        let testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth) {
          ctx.fillText(line, mLeft, mTop);
          line = words[n] + " ";
          mTop += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, mLeft, mTop);
    },
    writeText(plane, canvas) {
      const htmlPlane = plane.htmlElement;
      const pStyle = window.getComputedStyle(htmlPlane);
      const { width, height } = plane.getBoundingRect();
      canvas.width = width / this.curtains.pixelRatio;
      canvas.height = height / this.curtains.pixelRatio;
      const ctx = canvas.getContext("2d");

      // draw our title with the original style
      ctx.fillStyle = pStyle.color;
      ctx.font = `${pStyle.fontWeight} ${pStyle.fontSize} ${pStyle.fontFamily}`;
      ctx.fontStyle = pStyle.fontStyle;
      ctx.textAlign = pStyle.textAlign;
      ctx.textBaseline = "top";

      this.wrapText(
        ctx,
        htmlPlane.innerText,
        +pStyle.marginLeft.slice(0, -2),
        +pStyle.marginTop.slice(0, -2),
        canvas.width,
        +pStyle.lineHeight.slice(0, -2)
      );

      // update our canvas texture once on next draw call
      if (plane.textures.length > 0) {
        // we just changed the texture source sizes, we need to update its texture matrix
        plane.textures[0].resize();
        // update the webgl texture on next draw call
        plane.textures[0].needUpdate();
      }
    },

    setupCurtains() {
      this.curtains = new Curtains({
        container: this.$refs.webgl,
        pixelRatio: window.devicePixelRatio,
        premultipliedAlpha: true,
      });
    },
    setupPlane() {
      for (const plane of this.$refs.plane) {
        this.plane = this.curtains.addPlane(plane, this.params);
        if (this.plane) {
          this.planes.push(this.plane);
          this.handlePlanes(this.plane);
        }
      }
    },
    setupTitlePlane() {
      for (const t of this.$refs.title) {
        this.title = this.curtains.addPlane(t, this.TitleParams);

        if (this.title) {
          const canvas = document.createElement("canvas");
          // then we add a data sampler attribute to our canvas
          canvas.setAttribute("data-sampler", "planeTexture");
          canvas.style.display = "none";
          // and load it into our plane
          // console.log(canvas.width);

          this.title.loadCanvas(canvas);
          this.title.moveToFront();
          this.handleTitlePlanes(this.title);
        }
      }
    },
    handleTitlePlanes(plane) {
      plane
        .onLoading((texture) => {
          // our canvas texture is ready
          // debugger
          texture.shouldUpdate = false;
          // we write our title in our canvas
          if (document.fonts) {
            document.fonts.ready.then(() => {
              this.writeText(plane, texture.source);
            });
          } else {
            setTimeout(function () {
              this.writeText(plane, texture.source);
            }, 750);
          }
          // this.writeText(plane, texture.source)
        })
        .onRender(() => {
          // update the time uniform
          plane.uniforms.time.value++;
          // console.log(plane.uniforms.time.value)
        })
        .onAfterResize(() => {
          // update our canvas sizes and rewrite our title
          this.writeText(plane, plane.textures[0].source);
        });
    },
    handlePlanes(plane) {
      // const plane = this.planes[i]
      plane.onRender(() => {
        plane.uniforms.time.value++; // update our time uniform value
      });
    },
  },
};
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
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -2;
}
canvas {
  display: block;
  margin: 0;
}
.title {
  // visibility: hidden;
  vertical-align: baseline;
  font-size: 30px;
  // margin-left: 30px;
  // line-height: 42px;
  font-family: Roboto Slab, sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  // z-index: -3;
  opacity: 0;
  max-width: 50vw;
  margin: 0;
  display: inline-block;
}
.plane {
  width: 100%;
  height: 100vh;
  // margin: 10vh auto;
}
.plane img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: 50% 50%;
  display: none;
}
</style>

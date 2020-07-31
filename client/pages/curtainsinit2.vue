<template>
  <main class="wrapper">
    <div id="canvas" ref="webgl"></div>
    <div v-for="image in images" :key="image.src" ref="plane" class="plane">
      <img alt crossorigin="anonymous" :src="image.src" />
      <h2 ref="title" class="title">
        {{ image.title }}
      </h2>
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
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus dicta, quidem consectetur cumque dolorum, magni voluptate minima, ex laborum maxime dolor soluta perferendis eaque? Reprehenderit aspernatur obcaecati illo deserunt perspiciatis!",
        },
        {
          src: "/image/jpg/1024/19-03-02-13-46-07.jpg",
          title: "Lorem ipsum \n dolor sit amet",
        },
        {
          src: "/image/jpg/1024/19-05-01-13-36-02.jpg",
          title: "Lorem ipsum \n dolor sit amet",
        },
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
    wrapText(context, text, marginLeft, marginTop, maxWidth, lineHeight) {
      var words = text.split(" ");
      var countWords = words.length;
      var line = "";
      for (var n = 0; n < countWords; n++) {
        var testLine = line + words[n] + " ";
        var testWidth = context.measureText(testLine).width;
        if (testWidth > maxWidth) {
          context.fillText(line, marginLeft, marginTop);
          line = words[n] + " ";
          marginTop += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, marginLeft, marginTop);
    },
    writeText(plane, canvas) {
      var htmlPlane = plane.htmlElement;
      var htmlPlaneStyle = window.getComputedStyle(htmlPlane);

      var planeBoundingRect = plane.getBoundingRect();

      var htmlPlaneWidth = planeBoundingRect.width / this.curtains.pixelRatio;
      var htmlPlaneHeight = planeBoundingRect.height / this.curtains.pixelRatio;
      console.log(htmlPlaneWidth);
      // set sizes
      canvas.width = htmlPlaneWidth;
      canvas.height = htmlPlaneHeight;
      var context = canvas.getContext("2d");

      context.width = htmlPlaneWidth;
      context.height = htmlPlaneHeight;

      // draw our title with the original style
      context.fillStyle = htmlPlaneStyle.color;
      context.font = htmlPlaneStyle.fontSize + " " + htmlPlaneStyle.fontFamily;
      context.fontStyle = htmlPlaneStyle.fontStyle;
      context.textAlign = htmlPlaneStyle.textAlign;

      // vertical alignment is a bit hacky
      // context.textBaseline = "middle";

      this.wrapText(
        context,
        htmlPlane.innerText,
        0,
        0,
        htmlPlaneWidth,
        htmlPlaneStyle.fontSize * 1.2
      );

      // context.fillText(htmlPlane.innerText, 0, htmlPlaneHeight / 1.8);

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
          // canvas.style.display = 'none'
          // and load it into our plane
          console.log(canvas);

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
.title {
  font-size: 80px;
  color: red;
  z-index: -3;
  opacity: 0;
  // max-width: 30vw;
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

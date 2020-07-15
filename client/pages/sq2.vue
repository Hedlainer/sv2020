<template>
  <div class="wrap">
    <picture
      v-if="isVisible"
      class="lazy__original"
    >
      <source
        :srcset="`/image/webp/${ImageSize.currentImageWidth}/${file}.webp`"
        type="image/webp"
      />
      <img
        ref="currentImage"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decode="async"
        draggable="false"
        :src="`/image/jpg/${ImageSize.currentImageWidth}/${file}.jpg`"
        @load="curentImageLoaded = true"
      />
    </picture>
    <nuxt-link class="link" to="/sq1">
      sq1
    </nuxt-link>
    <div class="square">
      <h1>SQ2</h1>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import anime from 'animejs'
export default {
  // transition: {
  //   name: 'child',
  //   // mode: 'out-in',
  //   mode: 'in-out',
  //   // mode: '',
  //   css: false,
  //   beforeEnter (el) {
  //     anime.set(el, {
  //       translateY: '100%',
  //       scale: 0.9 // set down
  //     })
  //   },
  //   enter (el, done) {
  //     done()
  //     anime({
  //       targets: el,
  //       translateY: '50%',
  //       scale: 0.9,
  //       easing: 'easeInOutQuad',
  //       changeComplete () {
  //         anime({
  //           targets: el,
  //           translateY: '0%',
  //           scale: 1
  //         })
  //       }
  //     })
  //   //   done()
  //   },
  //   leave (el, done) {
  //     anime({
  //       targets: el,
  //       translateY: '50%',
  //       scale: 0.9, // middle to down
  //       easing: 'easeInOutQuad',
  //       changeComplete () {
  //         anime({
  //           targets: el,
  //           translateY: '100%',
  //           scale: 1,
  //           changeComplete () { done() }
  //         })
  //       }
  //     })
  //   }
  // }

}
</script>

<style lang="scss" scoped>
.link{
    padding: 20px;
    position: fixed;
    left: 20px;
    top: 20px;
    background-color: white;
}
.wrap{
  position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
.square{
width: 200px;
height: 200px;
background-color: green;
 display: flex;
    align-items: center;
    justify-content: center;
}
</style>

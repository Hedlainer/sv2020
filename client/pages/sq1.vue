<template>
  <div class="wrap">
    <nuxt-link class="link" to="/sq2">
      sq2
    </nuxt-link>
    <div class="square"></div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import anime from 'animejs/lib/anime.es.js'
export default {
  transition: {
    name: 'page3',
    // mode: 'out-in',
    // mode: 'in-out',
    mode: '',
    css: false,
    beforeEnter (el) {
      anime({
        // duration: 3000,
        targets: el,
        // opacity: 0,
        // scale: 1.5
        translateX: ['100%', '50%'],
        easing: 'linear'
      })
    },
    enter (el, done) {
      anime({
        targets: el,
        // opacity: [0, 1],
        translateX: ['50%', '0%'],
        easing: 'easeInOutQuad',
        complete () { done() }
      })
    //   done()
    },
    // afterEnter (el) {
    //   anime({
    //     targets: el,
    //     // translateX: '10%',
    //     easing: 'easeInOutQuad'
    //   })
    // }
    leave (el, done) {
      anime({
        targets: el,
        // opacity: [1, 0],
        translateX: ['0', '-50%'],
        easing: 'easeInOutQuad',
        complete () { done() }
      })
    },
    afterLeave (el) {
      anime({
        targets: el,
        translateX: ['-50%', '-100%'],
        easing: 'easeInOutQuad'
      })
    }

    //     beforeEnter (el) {
    //       anime({
    //         targets: el,
    //         // left: '240px',
    //         scale: 0.9,
    //         translateY: '200px',
    //         easing: 'easeInOutQuad'
    //       })
    //     }
    //   },

  }
}
</script>

<style lang="scss" scoped>
.link{
    padding: 20px;
    background-color: white;
    position: fixed;
    left: 20px;
    top: 20px;
}
.wrap{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
.square{
width: 200px;
height: 100px;
background-color: red;
}
</style>

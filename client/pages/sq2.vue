<template>
  <div class="wrap">
    <nuxt-link class="link" to="/sq1">
      sq1
    </nuxt-link>
    <div class="square"></div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import anime from 'animejs/lib/anime.es.js'
export default {
  transition: {
    name: 'page1',
    // mode: 'out-in',
    // mode: 'in-out',
    mode: '',
    css: false,
    beforeEnter (el) {
      anime({
        targets: el,
        // opacity: 0,
        translateY: ['-100%', '-50%'],
        easing: 'easeInOutQuad'
      })
    },
    enter (el, done) {
      anime({
        targets: el,
        translateY: ['-50%', '0%'],
        easing: 'easeInOutQuad',
        complete () { done() }
      })
    },

    leave (el, done) {
      anime({
        targets: el,
        translateY: ['0%', '50%'],
        easing: 'easeInOutQuad',
        complete () { done() }
      })
    },
    afterLeave (el) {
      anime({
        targets: el,
        translateY: ['50%', '100%'],
        easing: 'easeInOutQuad'
      })
    }
    // afterLeave (el) {
    //   anime({
    //     targets: el,
    //     translateY: '100%',
    //     easing: 'easeInOutQuad'
    //   })
    // }

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
    position: fixed;
    left: 20px;
    top: 20px;
    background-color: white;
}
.wrap{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
.square{
width: 200px;
height: 200px;
background-color: green;
}
</style>

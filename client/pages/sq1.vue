<template>
  <div class="wrap">
    <nuxt-link class="link" to="/sq2">
      sq2
    </nuxt-link>
    <div class="square">
      <h1>SQ1</h1>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import anime from 'animejs'
export default {
  transition: {
    name: 'parent',
    // mode: 'out-in',
    mode: 'in-out',
    // mode: '',
    css: false,
    // beforeEnter (el) {
    //   anime.set(el, {
    //     translateY: '-100%',
    //     scale: 0.9
    //   })
    // },
    enter (el, done) {
      // done()
      anime({
        targets: el,
        // translateY: '-50%',
        // scale: 0.9,
        easing: 'linear',
        changeComplete () {
          done()
        }
      })
    //   done()
    },
    leave (el, done) {
      anime({
        targets: el,
        // translateY: '-50%',
        scale: 3, // middle to down
        easing: 'easeInOutQuad',
        changeComplete () {
          // done()
          anime({
            targets: el,
            duration: 3000,
            opacity: 0,
            easing: 'linear',
            changeComplete () { done() }
          })
        }
      })
    }
    // afterLeave (el) {
    //   anime({
    //     targets: el,
    //     translateX: ['-50%', '-100%'],
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
    background-color: white;
    position: fixed;
    left: 20px;
    top: 20px;
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
background-color: rgb(255, 17, 0);
display: flex;
    align-items: center;
    justify-content: center;
}
</style>

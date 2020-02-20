<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        SvobodinaPhoto
      </h1>
      <h2 class="subtitle">
        the best photographer ever
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >
          Documentation
        </a>
        <nuxt-link class="button--green" to="/photoseries">
          Фотосерии
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
// import { TweenMax, Power2 } from 'gsap'
import Logo from '~/components/Logo.vue'

export default {
  transition: {
    name: 'bounce',
    mode: 'in-out'
  },
  components: {
    Logo
  }
}
</script>

<style>
.bounce-enter, .bounce-leave-to{
  transform: translateY(-100%);
}
/* .bounce-enter-to, .bounce-leave{
  transform: translateY(100%);
} */
.bounce-enter-active, .bounce-leave-active {
  transition: all 1s ease;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

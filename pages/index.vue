<template>
  <div class="container">
    <Reviews />
    <nuxt-link class="button--green" to="/photoseries">
      Фотосерии
    </nuxt-link>
  </div>
</template>

<script>
// import { TweenMax, Power2 } from 'gsap'

export default {
  components: {
    Reviews: () => import('~/components/reviews.vue')
  }
}
</script>

<style>
body{
  background-color: black;
}
</style>

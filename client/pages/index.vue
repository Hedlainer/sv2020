<template>
  <mainz />
</template>

<script>
// import { TweenMax, Power2 } from 'gsap'

export default {
  components: {
    mainz: () => import('~/components/main.vue')
  }
}
</script>

<style>
.wrapper img{
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}
.wrapper{
  position: absolute;
  top: 10vh;
  left:10vw;
  width: 80%;
  height: 80vh;
}
.text{
  position: absolute;
  width: 50vw;
  bottom: 0;
  right: 0;
  background-color: rgba(5, 5, 5, 0.711);
  padding: 20px;
    overflow: hidden;
  border-radius: 6px;
}
.container {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color:#03a9f4;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #ffffff;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

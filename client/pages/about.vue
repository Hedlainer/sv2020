<template>
  <div ref="glide" class="glide">
    <div class="glide__track" data-glide-el="track">
      <ul class="glide__slides">
        <li v-for="seriya in photoseries" :key="seriya.ID" class="glide__slide">
          <img
            :src="`/image/jpg/1024/${seriya.FileName}.jpg`"
            alt="SvobodinaPhoto"
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Glide from '@glidejs/glide'

import photoseries from '~/static/db/Photoseries.json'
// new Glide('.glide').mount({ Controls, Breakpoints })
export default {
  data () {
    return {
      photoseries,
      glide: null
    }
  },
  mounted () {
    this.glide = new Glide('.glide', {
      type: 'carousel',
      startAt: 0,
      perView: 3
    }).mount()
  }
}
</script>

<style lang="scss">
@import "node_modules/@glidejs/glide/src/assets/sass/glide.core";
@import "node_modules/@glidejs/glide/src/assets/sass/glide.theme";
.glide{
  height: 100vh;
  background-color: #fff;
}
</style>

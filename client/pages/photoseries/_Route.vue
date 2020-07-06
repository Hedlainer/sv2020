<template>
  <div>
    <h1>{{ $store.state.Series.Title }}</h1>
    <SeriesLayout class="gallery" />
  </div>
</template>

<script>
export default {
  async fetch ({ store, params }) {
    await store.dispatch('GET_SERIES', params.Route)
  }
}
</script>

<style lang="scss" scoped>
h1{
    margin: 0;
    font-size: 8vw;
    line-height: 8vw;
    font-weight: 700;
    color: #03a9f4;
    opacity: 0.2;
    z-index: 2;
}
.gallery {
  position: relative;
  height: auto;
}
</style>

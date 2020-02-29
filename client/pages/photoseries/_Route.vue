<template>
  <div>
    <!-- <h1>{{ $store.state.Series.Title }}</h1> -->
    <h1>{{ $store.state.hernya.Title }}</h1>
    <SeriesLayout />
  </div>
</template>

<script>
export default {
  components: {
    SeriesLayout: () => import('~/components/series-layout.vue')
  },
  fetch ({ store, params }) {
    // await store.dispatch('GET_SERIES', params.Route)
    store.commit('HERNYA', params.Route)
  }
  // beforeCreate () {
  //   this.$store.dispatch('GET_SERIES', this.$route.params.Route)
  // }
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
}
</style>

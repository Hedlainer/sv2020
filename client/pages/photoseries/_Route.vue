<template>
  <div>
    <SeriesLayout
      :object-name="$store.state.Series"
    />
  </div>
</template>

<script>
export default {
  components: {
    SeriesLayout: () => import('~/components/series-layout.vue')
  },
  beforeCreate () {
    this.$store.dispatch('GET_SERIES', this.$route.params.Route)
  }
}
</script>

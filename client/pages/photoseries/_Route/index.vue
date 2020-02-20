<template>
  <div>
    <JustLoy />
  </div>
</template>

<script>
export default {
  components: {
    JustLoy: () => import('~/components/just-loy.vue')
  },
  beforeCreate () {
    this.$store.dispatch('GET_SERIES', this.$route.params.Route)
  }
}
</script>

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
    this.$store.dispatch('getAWS', this.$route.params.Route)
  }
}
</script>

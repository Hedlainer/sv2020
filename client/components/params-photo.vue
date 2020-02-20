<template>
  <div class="spec">
    <p>{{ spec.F }}</p>
  </div>
</template>

<script>
export default {
  props: {
    spec: {
      required: true,
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
.spec{
    position: absolute;
}
</style>

<template>
  <div>
    <client-only>
      <div v-for="datum in data.Props.ImageName" :key="datum">
        <p>{{ datum }}</p>
      </div>
    </client-only>
  </div>
</template>

<script>
import data from 'static/db/AlenaAlexei.json'
const getData = () => import('static/db/AlenaAlexei.json').then(m => m.default || m)
export default {
  async asyncData ({ req }) {
    const data = await getData()
    return { data }
  },
  data () {
    return {
      dat: data
    }
  }
  // async fetch (ctx) {
  //   const data = await getData()
  //   ctx.store.commit('FetchSome', data)
  // }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <div style="background-color: white">
    <button @click="getSeriya">
      getimage
    </button>
    <br>
    <div v-if="show">
      <img
        v-for=" image in ph.ImagesCategory"
        :key="image.Id"
        :src="'https://svobodina.ru/wp-content/uploads/' + image.FileName"
        alt
      >
    </div>
  </div>
</template>

<script>
// import imageData from '~/static/data/image.json'
// import photoseries from '~/static/data/photoseries.json'
export default {
  data () {
    return {
      find: 'Rita-Vlad',
      show: false
    }
  },
  computed: {
    ph () {
      return this.$store.getters.photoseriesImage
    }
  },
  mounted () {
    // photoseries.forEach(el => {
    //   el.Images = imageData.filter(image => image.Keywords.includes(el.Name));
    //   el.FileName = imageData
    //     .filter(image => image.Keywords.includes(`photoseries${el.Id}`))
    //     .map(e => e.FileName)[0];
    // });

    // console.log(this.$store.getters.photoseriesImage)
  },
  methods: {
    getSeriya () {
      this.$store.commit('GET_IMAGE', this.find)
      this.show = true
    }
  }
}
</script>

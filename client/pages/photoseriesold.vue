<template>
  <section
    ref="container"
    class="seriya"
    :style="{ backgroundColor: bgColor }"
    @mousewheel="horizontalScroll"
  >
    <div ref="wrap" class="seriya__wrapper">
      <div
        v-for="seriya in photoseries"
        :key="seriya.ID"
        class="seriya__wrapper__img"
      >
        <photoseriesImage :object-name="seriya" @color="bgColor = $event" />
      </div>
    </div>
  </section>
</template>

<script>
import photoseries from "~/static/db/Photoseries.json";
export default {
  components: {
    photoseriesImage: () => import("~/components/photoseries-image.vue"),
  },
  data() {
    return {
      photoseries,
      bgColor: null,
      show: false,
      minHour: 0,
      max: 8400,
      value: 1,
      sm: null,
    };
  },
  mounted() {
    // console.log(this.photoseries.map(el => el.Aspect))
  },
  beforeMount() {
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    horizontalScroll($event) {
      if ($event.deltaY > 0) {
        this.value += $event.deltaY;
        this.$refs.container.scrollLeft = this.value;
      }
      this.$refs.container.scrollLeft += $event.deltaY;
      this.value = this.$refs.container.scrollLeft;
    },
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 1px;
  height: 1px;
  &-button {
    width: 1px;
    height: 1px;
  }
}
.seriya {
  position: relative;
  transition: background-color 2s;
  width: 100%;
  height: 100vh;
  overflow-x: auto;
  &__wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    padding-left: 5vw;
    padding-right: 5vw;
    height: 100%;
    position: absolute;
    &__img {
      display: block;
      border-radius: 3px;
      &:nth-child(odd) {
        width: calc(65vh * 1.5);
        height: 65vh;
      }
      &:nth-child(even) {
        width: calc(67vh * 1.5);
        height: 67vh;
      }
    }
  }
}
</style>

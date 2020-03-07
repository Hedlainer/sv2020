<template>
  <div>
    <div class="review">
      <div class="image__holder">
        <img :src="`/${counter}.jpg`" alt>
      </div>
      <div class="name__holder">
        <h3 class="review__name">
          {{ reviews[counter].Title }}
        </h3>
      </div>
      <div class="review__holder">
        <p class="review__body">
          {{ reviews[counter].Subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import reviews from '~/static/data/main.json'
export default {
  data () {
    return {
      reviews,
      counter: 1
    }
  },
  computed: {
    randomReviews () {
      const counter = Math.floor(this.reviews.length * Math.random())
      return this.reviews[counter]
    }
  },
  mounted () {
    this.rReviews()
  },
  methods: {
    rReviews () {
      setInterval(() => {
        this.counter = Math.floor(this.reviews.length * Math.random())
      }, 12000)
    }
  }
}
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
.image__holder {
  position: absolute;
  top: 10vh;
  left: 10%;
  width: 80%;
  height: 80vh;
  & > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: 50% 50%;
  }
}
.review {
  position: relative;
  height: 100vh;
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  &__name {
    margin: 0;
    font-size: 20vw;
    line-height: 20vw;
    font-weight: 700;
    color: #03a9f4;
    opacity: 0.2;
  }
  &__body {
    font-weight: 200;
    color: white;
    margin: 0;
    padding: 5px;
    font-size: 26px;
    white-space: pre-wrap;
    background-color: rgba(0, 0, 0, 0.705);
  }
  &__holder {
    display: flex;
    align-items: flex-end;
    position: absolute;
    border-color: #03a9f4;
    /* border-style: solid; */
    /* border-width: 1px; */
    border-radius: 5px;
    /* background-color: #fff; */
    width: 40%;
    height: auto;
    overflow-y: auto;
    bottom: 0;
    right: 0;
  }
}
.name__holder {
  /* transform: rotate(-90deg);
  transform-origin: left bottom; */
  position: absolute;
  width: 80vw;
  overflow: hidden;
  left: 2%;
  top: -14vw;
}
p {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>

<template>
  <div class="review">
    <div class="name__holder">
      <h3 class="review__name">
        {{ reviews[5].name }}
      </h3>
    </div>
    <div class="review__holder">
      <p class="review__body">
        {{ reviews[5].body }}
      </p>
    </div>
  </div>
</template>

<script>
import reviews from '~/static/reviews.json'
export default {
  data () {
    return {
      reviews
    }
  },
  computed: {
    withBrTags: function () {
      const doc = this.reviews[3].body
      return doc.replace(/(\\r)*\\n/g, '<br>')
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
.review {
  position: relative;
  height: 50vh;
  width: 98%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
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
    padding: 10px;
    font-size: 26px;
    white-space: pre-wrap;
  }
  &__holder {
    border-color: #03a9f4;
    /* border-style: solid; */
    /* border-width: 1px; */
    border-radius: 5px;
    /* background-color: #fff; */
    margin-left: 20%;
    width: 80%;
    height: 40vh;
    overflow-y: auto;
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
</style>

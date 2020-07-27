<template>
  <div>
    <div v-for="m in main" :key="m.id" class="review">
      <div class="image__holder">
        <img alt src="/image/jpg/1920/19-03-02-16-16-38.jpg" />
      </div>
      <div class="name__holder">
        <h3 class="review__name">{{ m.Title }}</h3>
      </div>
      <div class="review__holder">
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <p class="review__body">{{ m.Subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import main from "~/static/db/main.json";
export default {
  data() {
    return {
      main,
      c: 1,
    };
  },
  computed: {
    randommain() {
      const c = Math.floor(this.main.length * Math.random());
      return this.main[c];
    },
  },
  mounted() {
    this.rmain();
  },
  methods: {
    rmain() {
      setInterval(() => {
        this.c = Math.floor(this.main.length * Math.random());
      }, 12000);
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
.image__holder {
  position: absolute;
  top: 10vh;
  left: 10%;
  width: 80%;
  height: 80vh;
}
.review {
  position: relative;
  height: 100vh;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  &__name {
    text-shadow: white 1px 1px 0;
    font-family: Roboto, sans-serif;
    margin: 0;
    font-size: 120px;
    line-height: 120px;
    font-weight: 700;
    color: #03a9f4;
    opacity: 0.3;
  }
  &__body {
    font-family: Roboto, sans-serif;
    font-weight: 300;
    color: white;
    padding: 15px;
    font-size: 26px;
    background-color: rgba(0, 0, 0, 0.705);
  }
  &__holder {
    white-space: pre-wrap;
    display: flex;
    align-items: flex-end;
    position: absolute;
    border-color: #03a9f4;
    border-radius: 5px;
    width: 55%;
    height: auto;
    overflow-y: auto;
    bottom: 2%;
    right: 2%;
  }
}
.name__holder {
  /* transform: rotate(-90deg);
  transform-origin: left bottom; */
  position: absolute;
  width: 80vw;
  overflow: hidden;
  left: 2%;
  top: 2%;
}
p {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>

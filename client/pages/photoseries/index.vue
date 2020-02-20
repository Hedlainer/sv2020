<template>
  <section
    ref="container"
    :style="{ backgroundColor: bgColor }"
    class="seriya"
    @mousewheel="horizontalScroll"
  >
    <div class="slidecontainer">
      <input
        v-model.number="value"
        type="range"
        :min="minHour"
        :max="max"
        step="1"
        class="slider"
        @input="$refs.container.scrollLeft = value"
      >
    </div>
    <div ref="wrap" class="seriya__wrapper">
      <div v-for="seriya in photoseries" :key="seriya.ID" class="seriya__wrapper__img">
        <photoseriesImage :object-name="seriya" @color="bgColor = $event" />
      </div>
    </div>
  </section>
</template>

<script>
import photoseries from '~/static/data/photoseries.json'
export default {
  components: {
    photoseriesImage: () =>
      import('~/components/photoseries-image.vue')
  },
  data () {
    return {
      photoseries,
      bgColor: null,
      show: false,
      minHour: 0,
      max: 8400,
      value: 1,
      sm: null
    }
  },
  mounted () {
    // this.resize()
  },
  beforeMount () {
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    horizontalScroll ($event) {
      if ($event.deltaY > 0) {
        this.value += $event.deltaY
        this.$refs.container.scrollLeft = this.value
      }
      this.$refs.container.scrollLeft += $event.deltaY
      this.value = this.$refs.container.scrollLeft
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
.seriya {
  position: relative;
  transition: background-color 2s;
  width: 100%;
  height: 100vh;
  overflow-x: auto;
  &__wrapper2 {
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
      box-shadow: inset 0px 0px 0px 1px #03a9f4;
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
      box-shadow: inset 0px 0px 0px 1px #03a9f4;
      border-radius: 3px;
      &:nth-child(odd) {
        width: calc(33vh * 1.5);
        height: 33vh;
      }
      &:nth-child(even) {
        width: calc(37vh * 1.5);
        height: 37vh;
      }
    }
  }
}
</style>
<style scoped>
.slidecontainer {
  z-index: 2;
  position: fixed;
  left: 35vw;
  top: 3vh;
  width: 30vw;
}
p {
  color: #ffffff;
}
input[type="range"].slider {
  -webkit-appearance: none;
  width: 100%;
  margin: 4px 0;
}
input[type="range"].slider:focus {
  outline: none;
}
input[type="range"].slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 0px;
  cursor: pointer;
  box-shadow: 0.4px 0.4px 0.9px #a8a8a8, 0px 0px 0.4px #b5b5b5;
  background: #ffffff;
  border-radius: 17.1px;
  border: 0.5px solid #ffffff;
}
input[type="range"].slider::-webkit-slider-thumb {
  box-shadow: 0.9px 0.9px 2.7px rgba(0, 0, 62, 0.67),
    0px 0px 0.9px rgba(0, 0, 88, 0.67);
  border: 0.5px solid #000000;
  height: 8px;
  width: 29px;
  border-radius: 17px;
  background: #03a9f4;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -4.5px;
}
input[type="range"].slider:focus::-webkit-slider-runnable-track {
  background: #ffffff;
}
input[type="range"].slider::-moz-range-track {
  width: 100%;
  height: 0px;
  cursor: pointer;
  box-shadow: 0.4px 0.4px 0.9px #a8a8a8, 0px 0px 0.4px #b5b5b5;
  background: #ffffff;
  border-radius: 17.1px;
  border: 0.5px solid #ffffff;
}
input[type="range"].slider::-moz-range-thumb {
  box-shadow: 0.9px 0.9px 2.7px rgba(0, 0, 62, 0.67),
    0px 0px 0.9px rgba(0, 0, 88, 0.67);
  border: 0.5px solid #000000;
  height: 8px;
  width: 29px;
  border-radius: 17px;
  background: #03a9f4;
  cursor: pointer;
}
input[type="range"].slider::-ms-track {
  width: 100%;
  height: 0px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type="range"].slider::-ms-fill-lower {
  background: #878787;
  border: 0.5px solid #ffffff;
  border-radius: 34.2px;
  box-shadow: 0.4px 0.4px 0.9px #a8a8a8, 0px 0px 0.4px #b5b5b5;
}
input[type="range"].slider::-ms-fill-upper {
  background: #ffffff;
  border: 0.5px solid #ffffff;
  border-radius: 34.2px;
  box-shadow: 0.4px 0.4px 0.9px #a8a8a8, 0px 0px 0.4px #b5b5b5;
}
input[type="range"].slider::-ms-thumb {
  box-shadow: 0.9px 0.9px 2.7px rgba(0, 0, 62, 0.67),
    0px 0px 0.9px rgba(0, 0, 88, 0.67);
  border: 0.5px solid #000000;
  height: 8px;
  width: 29px;
  border-radius: 17px;
  background: #03a9f4;
  cursor: pointer;
  height: 0px;
}
input[type="range"].slider:focus::-ms-fill-lower {
  background: #ffffff;
}
input[type="range"].slider:focus::-ms-fill-upper {
  background: #ffffff;
}
</style>

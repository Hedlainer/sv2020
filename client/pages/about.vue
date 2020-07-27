<template>
  <div ref="glide" class="glide">
    <!-- <div class="slidecontainer">
      <input
        v-model.number="value"
        class="slider"
        :max="max"
        :min="minHour"
        step="1"
        type="range"
        @input="$refs.container.scrollLeft = value"
      />
    </div> -->
    <div class="glide__track" data-glide-el="track">
      <ul class="glide__slides">
        <li v-for="seriya in photoseries" :key="seriya.ID" class="glide__slide">
          <img
            alt="SvobodinaPhoto"
            :src="`/image/jpg/1024/${seriya.FileName}.jpg`"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
// import anime from 'animejs'
import photoseries from "~/static/db/Photoseries.json";
// new Glide('.glide').mount({ Controls, Breakpoints })
export default {
  data() {
    return {
      photoseries,
      glide: null,
    };
  },
  mounted() {},
};
</script>

<style lang="scss">
.glide {
  height: 100vh;
  background-color: #fff;
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

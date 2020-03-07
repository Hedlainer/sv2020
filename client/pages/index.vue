<template>
  <section>
    <div class="container">
      <div class="wrapper">
        <img src="/image/jpg/1920/19-03-02-16-16-38.jpg" alt="">
      </div>
      <div class="text">
        <h2 class="title">
          До
        </h2>
        <p class="subtitle">
          Первые фотографии на следующий день <br>
          Все фотографии через 21 день или меньше
        </p>
      </div>

      <div>
        <!-- <nuxt-link class="button--green" to="/photoseries">
        Фотосерии
      </nuxt-link> -->
      </div>
    </div>
    <div class="container">
      <div class="wrapper">
        <img src="/image/jpg/1920/19-03-02-16-16-38.jpg" alt="">
      </div>
      <div class="text">
        <h2 class="title">
          Во время
        </h2>
        <p class="subtitle">
          Первые фотографии на следующий день <br>
          Все фотографии через 21 день или меньше
        </p>
      </div>

      <div>
        <!-- <nuxt-link class="button--green" to="/photoseries">
        Фотосерии
      </nuxt-link> -->
      </div>
    </div>
    <div class="container">
      <div class="wrapper">
        <img src="/image/jpg/1920/19-03-02-16-16-38.jpg" alt="">
      </div>
      <div class="text">
        <h2 class="title">
          После
        </h2>
        <p class="subtitle">
          - Несколько фотографии на следующий день <br>
          - Качественная, а не "авторская" обработка всех кадров <br>
          - Все фото меньше, чем за 21 день
        </p>
      </div>

      <div>
        <!-- <nuxt-link class="button--green" to="/photoseries">
        Фотосерии
      </nuxt-link> -->
      </div>
    </div>
  </section>
</template>

<script>
// import { TweenMax, Power2 } from 'gsap'

export default {

}
</script>

<style>
.wrapper img{
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}
.wrapper{
  position: absolute;
  top: 10vh;
  left:10vw;
  width: 80%;
  height: 80vh;
}
.text{
  position: absolute;
  width: 50vw;
  bottom: 0;
  right: 0;
  background-color: rgba(5, 5, 5, 0.711);
  padding: 20px;
    overflow: hidden;
  border-radius: 6px;
}
.container {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color:#03a9f4;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #ffffff;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

<template>
  <div>
    <picture @load="isLoad">
      <source :srcset="`https://svobodina.ru/wp-content/uploads/${size}/webp/${objectName.FileName}`" />
      <source :srcset="`https://svobodina.ru/wp-content/uploads/${size}/jpg/${objectName.FileName}`" />
      <img
        :alt="objectName.Creator"
        :src="`https://svobodina.ru/wp-content/uploads/${size}/jpg/${objectName.FileName}`"
      />
    </picture>
    <img
      alt
      src="/img/big.jpg"
      @load="ev"
    />
  </div>
</template>

<script>
export default {
  props: {
    objectName: {
      required: true,
      type: Object
    }
  },
  data () {
    return {

    }
  }
}
</script>

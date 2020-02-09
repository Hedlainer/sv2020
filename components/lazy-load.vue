<template>
    <div>
      <picture @load="isLoad">
        <source :srcset="`https://svobodina.ru/wp-content/uploads/${size}/webp/${objectName.FileName}`">
        <source :srcset="`https://svobodina.ru/wp-content/uploads/${size}/jpg/${objectName.FileName}`">
        <img :src="`https://svobodina.ru/wp-content/uploads/${size}/jpg/${objectName.FileName}`"
          :alt="objectName.Creator">
      </picture>
      <img @load="ev" src="/img/big.jpg" alt>
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
  data() {
      return {
          
      }
  },
}
</script>
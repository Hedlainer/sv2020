<template>
  <nuxt class="main" />
</template>

<script>
export default {
  computed: {
    meta() {
      return [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { hid: "description", name: "description", content: "Home" },
      ];
    },
  },

  head() {
    const canonical = `https://svobodinaphoto.com${this.$route.path
      .toLowerCase()
      .replace(/\/$/, "")}`;
    return {
      meta: [...this.meta],
      script: [
        // { src: 'https://markknol.github.io/console-log-viewer/console-log-viewer.js' }
      ],
      link: [{ rel: "canonical", href: canonical }],
    };
  },
};
</script>
<style lang="css">
::-webkit-scrollbar {
  width: 1px;
  height: 1px;
}
::-webkit-scrollbar-button {
  width: 1px;
  height: 1px;
}
html {
  background: black;
}
img {
  display: none;
}
.main {
  /* height: 100vh; */
  position: relative;
}
</style>

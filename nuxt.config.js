module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  // srcDir: 'src/',

  head: {
    htmlAttrs: {
      lang: 'ru'
    },
    title: process.env.npm_package_name || '',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  // eslint-disable-next-line indent
  //  serverMiddleware: [
  //     '~/serverMiddleware/api'
  //   ],
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vue-observer-visibility.client.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  // buildModules: [
  //   '@nuxtjs/eslint-module',
  //   [
  //     'nuxt-compress',
  //     {
  //       brotli: {
  //         asset: '[path].br',
  //         test: /\.(js|css)$/
  //       }
  //     }
  //   ]
  // ],

  // eslint: {
  //   fix: true
  // },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
    
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    filenames: {
      chunk: ({
        isDev
      }) => (isDev ? '[name].js' : '[name].bundle.js')
    },
    // analyze: true,
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {}
  }
}

const isDev = process.env.NODE_ENV !== 'production'
module.exports = {
  mode: 'universal',
  components: true,
  telemetry: false,
  // pageTransition: {
  //   name: 'page',
  //   mode: 'out-in'
  // },
  /*
   ** Headers of the page
   */
  srcDir: 'client',
  buildDir: 'app',
  head: {
    htmlAttrs: {
      lang: 'ru'
    },
    title: process.env.npm_package_name || '',
    meta: [{
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
    color: '#03a9f4'
  },
  /*
   ** Global CSS
   */
  //  serverMiddleware: [
  //     '~/serverMiddleware/api'
  //   ],
  css: ['normalize.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vue-observer-visibility.client.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/eslint-module',
    [
      'nuxt-compress',
      {
        brotli: {
          asset: '[path].br',
          test: /\.(js|css)$/
        }
      }
    ]
  ],

  eslint: {
    fix: true
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // 'nuxt-trailingslash-module',
    'nuxt-webfontloader',
    // 'cookie-universal-nuxt',
    '@nuxtjs/style-resources',
    '@nuxtjs/axios'
    // '@nuxtjs/pwa'
  ],
  webfontloader: {
    google: {
      families: ['Roboto:100,400,700&display=swap']
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  styleResources: {
    scss: ['./assets/scss/global-variables.scss'], // alternative: scss
    less: [],
    stylus: []
  },

  axios: {},
  /*
   ** Build configuration
   */
  build: {
    // filenames: {
    //   chunk: ({
    //     isDev
    //   }) => (isDev ? '[name].js' : '[name].bundle.js')
    // },
    filenames: {
      app: ({
        isDev
      }) => isDev ? '[name].js' : 'js/[contenthash].js',
      chunk: ({
        isDev
      }) => isDev ? '[name].js' : 'js/[contenthash].js',
      css: ({
        isDev
      }) => isDev ? '[name].css' : 'css/[contenthash].css',
      img: ({
        isDev
      }) => isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]',
      font: ({
        isDev
      }) => isDev ? '[path][name].[ext]' : 'fonts/[contenthash:7].[ext]',
      video: ({
        isDev
      }) => isDev ? '[path][name].[ext]' : 'videos/[contenthash:7].[ext]'
    },
    ...(!isDev && {
      html: {
        minify: {
          collapseBooleanAttributes: true,
          decodeEntities: true,
          minifyCSS: true,
          minifyJS: true,
          processConditionalComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          trimCustomFragments: true,
          useShortDoctype: true
        }
      }
    }),
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    },
    optimization: {
      minimize: !isDev
    },
    ...(!isDev && {
      extractCSS: {
        ignoreOrder: true
      }
    }),
    transpile: ['vue-lazy-hydration', 'intersection-observer'],
    postcss: {
      plugins: {
        ...(!isDev && {
          cssnano: {
            preset: ['advanced', {
              autoprefixer: false,
              cssDeclarationSorter: false,
              zindex: false,
              discardComments: {
                removeAll: true
              }
            }]
          }
        })
      },
      ...(!isDev && {
        preset: {
          browsers: 'cover 99.5%',
          autoprefixer: true
        }
      }),

      order: 'cssnanoLast'
    },
    // analyze: true,
    /*
     ** You can extend webpack config here
     */
    // extend (config, ctx) {}

    extend (config) {
      config.module.rules.push({

        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]

      })
    }
  }
}

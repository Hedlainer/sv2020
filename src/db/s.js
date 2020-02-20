// import { resolve } from 'path'
// import sqip from 'sqip' // in node will be => const sqip = require('sqip').default

const resolve = require('path').resolve
const sqip = require('sqip').default;

(async () => {
  try {
    // Process whole folder with default settings
    const folderResults = await sqip({
      input: resolve(__dirname, 'src/image'),
      output: resolve(__dirname, 'src/prev2'),
      width: 32,
      plugins: [
        {
          name: 'primitive',
          options: {
            numberOfPrimitives: 50,
            mode: 7
          }
        },
        // 'sqip-plugin-svgo'
        'svgo',
        'data-uri'
      ]
    })
    console.log(folderResults)
  } catch (err) {
    console.log('Something went wrong generating the SQIP previews')
    console.error(err)
  }
})()

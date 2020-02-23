// import { resolve } from 'path'
// import sqip from 'sqip' // in node will be => const sqip = require('sqip').default

// const sqip = require('sqip').default;

// (async () => {
//   try {
//     // Process whole folder with default settings
//     const folderResults = await sqip({
//       input: resolve(__dirname, 'src/image'),
//       output: resolve(__dirname, 'src/prev2'),
//       width: 32,
//       plugins: [
//         {
//           name: 'primitive',
//           options: {
//             numberOfPrimitives: 50,
//             mode: 7
//           }
//         },
//         // 'sqip-plugin-svgo'
//         'svgo',
//         'data-uri'
//       ]
//     })
//     console.log(folderResults)
//   } catch (err) {
//     console.log('Something went wrong generating the SQIP previews')
//     console.error(err)
//   }
// })()

// requiring path and fs modules
const resolve = require('path').resolve
const fs = require('fs')
const lqip = require('lqip')

// joining path of directory
const directoryPath = resolve(__dirname, '../image')
// passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  // handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }
  const color = []
  // listing all files using forEach
  files.sort(function (a, b) {
    if (a < b) {
      return -1
    }
  })


  files.forEach(function (file) {
    // Do whatever you want to do with the file
    lqip.palette(`src/image/${file}`).then((res) => {
      // the response will be sorted from most dominant colour to least
      color.push(res[0])//  [ '#628792', '#bed4d5', '#5d4340', '#ba454d', '#c5dce4', '#551f24' ]
      console.log(color)
    })
    console.log(file)
  })
})


// const file = resolve(__dirname, 'src/image/*jpg')

// lqip.palette(file).then((res) => {
//   // the response will be sorted from most dominant colour to least
//   console.log(res)//  [ '#628792', '#bed4d5', '#5d4340', '#ba454d', '#c5dce4', '#551f24' ]
// })

const fs = require('fs')
const resolve = require('path').resolve
const lqip = require('lqip')

const data = JSON.parse(fs.readFileSync('src/db/data.json'))
const db = JSON.parse(fs.readFileSync('src/db/db.json'))

// сортируем все фотки по названию
data.sort(function (a, b) {
  const nameA = a.FileName.toLowerCase()
  const nameB = b.FileName.toLowerCase()
  if (nameA < nameB) {
    return -1
  }
})
// сортируем исходный файл убираем всё ненужное
const lightData = data.map((el) => {
  return {
    Name: el.FileName.slice(0, -4),
    Params: {
      Sh: el.ShutterSpeedValue,
      F: el.ApertureValue,
      Fl: +el.FocalLength.slice(0, -3)
    },
    Aspect: +(el.ImageWidth / el.ImageHeight).toFixed(3),
    Keywords: el.Keywords
  }
})
// const db2 = db
// db2.filter(el => el.Props.Type === 'Series')

db.Series.forEach((el) => {
  el.ImageName = lightData
    .filter(image => image.Keywords.includes(el.Name))
    .map(image => image.Name)
  el.Aspect = lightData
    .filter(image => image.Keywords.includes(el.Name))
    .map(image => image.Aspect)
  el.Cover = lightData
    .filter(image => image.Keywords.includes(el.Name))
    .find(image => image.Keywords.includes('cover'))
    // .map(e => e.Name)[0]
  el.Spec = lightData.filter(image => image.Keywords.includes(el.Name))
    .map(image => image.Params)

  try {
    fs.writeFileSync(`client/static/db/${el.Name}.json`, JSON.stringify(el, null, 2))
    console.log(`file ${el.Name} is redy`)
  } catch (error) {
    console.log(error)
  }
  // const data2 = JSON.stringify(map, null, 2)
})

// const hernya = db.Series.map(el => el.Cover)
const hernya2 = db.Series.map((el, index) => {
  return {
    Id: index,
    Route: el.Name,
    Title: el.Title,
    FileName: el.Cover.Name,
    Aspect: el.Cover.Aspect
  }
})

try {
  fs.writeFileSync('client/static/db/Photoseries.json', JSON.stringify(hernya2, null, 2))
  console.log('file Photoseries.json is redy')
} catch (error) {
  console.log(error)
}
// const aaa = hernya.map(e => e.Name === '19-05-05-15-24-54')
// => lightData.find(e => e.Name === element))

// console.log(hernya)
console.log(hernya2)
// console.log(aaa)

// записываем во второй файл, но возможно пока не надо
// const data2 = JSON.stringify(map, null, 2)
// fs.writeFileSync('./data2.json', d

const fs = require('fs')

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
const db2 = db
db2.filter(el => el.Props.Type === 'Series')
console.log(db2[1].Props.Type)


db.forEach((el) => {
  el.Props.ImageName = lightData
    .filter(image => image.Keywords.includes(el.Name))
    .map(image => image.Name)
  el.Props.Aspect = lightData
    .filter(image => image.Keywords.includes(el.Name))
    .map(image => image.Aspect)
  el.Props.Cover = lightData
    .filter(image => image.Keywords.includes(el.Name))
    .filter(image => image.Keywords.includes('cover'))
    .map(e => e.Name)
  el.Props.Spec = lightData.filter(image => image.Keywords.includes(el.Name))
    .map(image => image.Params)

  try {
    fs.writeFileSync(`client/static/db/${el.Name}.json`, JSON.stringify(el, null, 2))
    console.log(`file ${el.Name} is redy`)
  } catch (error) {
    console.log(error)
  }
  // const data2 = JSON.stringify(map, null, 2)
})

// записываем во второй файл, но возможно пока не надо
// const data2 = JSON.stringify(map, null, 2)
// fs.writeFileSync('./data2.json', data2)

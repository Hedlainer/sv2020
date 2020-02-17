const fs = require('fs')

const data = JSON.parse(fs.readFileSync('./data.json'));
const db = JSON.parse(fs.readFileSync('./db.json'));

// сортируем все фотки по названию
data.sort(function (a, b) {
  const nameA = a.FileName.toLowerCase()
  const nameB = b.FileName.toLowerCase()
  if (nameA < nameB) {
    return -1
  }
})
// сортируем исходный файл убираем всё ненужное
const map = data.map((el) => {
  return {
    Name: el.FileName.slice(0, -4),
    Params:{
      Sh: el.ShutterSpeedValue,
      F: el.ApertureValue,
      Fl: +el.FocalLength.slice(0, -3),
    },
    Aspect: +(el.ImageWidth / el.ImageHeight).toFixed(3),
    Keywords: el.Keywords,
  }
})

db.forEach((el) => {
  el.Props.ImageName = map
    .filter(image => image.Keywords.includes(el.Name))
    .map(image => image.Name)
  el.Props.Aspect = map
    .filter(image => image.Keywords.includes(el.Name))
    .map(image => image.Aspect)
  el.Props.Cover = map
    .filter(image => image.Keywords.includes(el.Name))
    .filter(image => image.Keywords.includes('cover'))
    .map(e => e.Name)
  el.Props.Spec = map.filter(image => image.Keywords.includes(el.Name))
  .map(image => image.Params)

  // const data2 = JSON.stringify(map, null, 2)
  fs.writeFileSync(`./db/${el.Name}.json`, JSON.stringify(el, null, 2))

})





// записываем во второй файл, но возможно пока не надо
// const data2 = JSON.stringify(map, null, 2)
// fs.writeFileSync('./data2.json', data2)

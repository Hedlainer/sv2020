// import imageData from '~/static/data/472base.json'
// import photoseries from '~/static/data/photoseries.json'

// imageData.sort(function (a, b) {
//   const nameA = a.FileName.toLowerCase()
//   const nameB = b.FileName.toLowerCase()
//   if (nameA < nameB) { return -1 }
// })
// const photoseries2 = photoseries
// photoseries.forEach((el) => {
//   el.JLName = imageData
//     .filter(image => image.Keywords.includes(el.Name))
//     .map(image => image.FileName.toString().slice(0, -4))
//   el.JLAspect = imageData
//     .filter(image => image.Keywords.includes(el.Name))
//     .map(image => image.ImageWidth / image.ImageHeight)
//   el.FileName = imageData
//     .filter(image => image.Keywords.includes(el.Name))
//     .filter(image => image.Keywords.includes('cover'))
//     .map(e => e.FileName).toString().slice(0, -4)
//   el.ImagesPH = imageData.filter(image => image.Keywords.includes(el.Name))
// })
// eslint-disable-next-line no-unused-vars
// const fillterPhotoseries = photoseries.map((el) => {
//   return {
//     FileName: imageData
//       .filter(image => image.Keywords.includes(el.Name))
//       .filter(image => image.Keywords.includes('cover'))
//       .map(e => e.FileName).toString().slice(0, -4),
//     Name: el.Name,
//     Color: el.Color,
//     Route: el.Route
//   }
// })
export const state = () => ({
  aws: [],
  SeriesAspect: [],
  SeriesFileName: [],
  SeriesSpec: [],
  Series: []
})
export const getters = {
  // aspect (ctx) {
  //   ctx.state.list.map(el => el.Aspect)
  // }
}
export const mutations = {
  AWS (state, payload) {
    state.aspectJL = payload.map(el => el.Aspect)
    state.nameJL = payload.map(el => el.Name)
  },
  FetchSome (state, payload) {
    state.Fetch = payload
  },
  change_series (state, payload) {
    state.SeriesAspect = payload.Props.Aspect
    state.SeriesFileName = payload.Props.ImageName
    state.SeriesSpec = payload.Props.Spec
    state.Series = payload
  }
}

export const actions = {
  async getAWS (ctx, payload) {
    const imageData = await this.$axios.$get(
      `https://j4x5vclvh9.execute-api.eu-central-1.amazonaws.com/api/imagedata/${payload}`
    )
    imageData.sort(function (a, b) {
      const nameA = a.Name.toLowerCase()
      const nameB = b.Name.toLowerCase()
      if (nameA < nameB) { return -1 }
    })
    ctx.commit('AWS', imageData)
  },
  async getData (ctx, payload) {
    const data = await this.$axios.$get('./data/472base.json')
    const ph2 = await this.$axios.$get('./data/photoseries.json')
    data.sort(function (a, b) {
      const nameA = a.FileName.toLowerCase()
      const nameB = b.FileName.toLowerCase()
      if (nameA < nameB) { return -1 }
    })

    ph2.forEach((el) => {
      el.JLName = data
        .filter(image => image.Keywords.includes(el.Name))
        .map(image => image.FileName.toString().slice(0, -4))
      el.JLAspect = data
        .filter(image => image.Keywords.includes(el.Name))
        .map(image => image.ImageWidth / image.ImageHeight)
      el.FileName = data
        .filter(image => image.Keywords.includes(el.Name))
        .filter(image => image.Keywords.includes('cover'))
        .map(e => e.FileName).toString().slice(0, -4)
      el.ImagesPH = data.filter(image => image.Keywords.includes(el.Name))
    })

    const filter = ph2.find(el => el.Route === payload)

    ctx.commit('filterPH2', filter)
  },
  async GET_SERIES (ctx, payload) {
    const data = await this.$axios.$get(`./db/${payload}.json`)
    ctx.commit('change_series', data)
  }
}

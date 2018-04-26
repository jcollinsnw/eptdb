export default {
  cta: {
    APIKey: '',
    proxyUrl: '',
    stops: [{
      name: 'Linden',
      class: 'purple-line',
      stpid: 30163
    }, {
      name: 'Howard',
      class: 'purple-line',
      stpid: 30164
    }, {
      name: 'Loop',
      class: 'red-line',
      stpid: 30174
    }]
  },
  divvy: {
    statusUrl: 'https://data.cityofchicago.org/resource/aavc-b2wj.json',
    stationUrl: '',
    locations: [{
      name: 'Elmwood Ave & Austin St',
      icon: 'home'
    }, {
      name: 'University Library (NU)',
      icon: 'work'
    }]
  },
  weather: {
    APIKey: '',
    units: 'imperial',
    cityId: 4891382 // Evanston
  }
}

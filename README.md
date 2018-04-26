# Evanston Public Transit Dashboard

> An electron-vue project to show Divvy Bike and CTA Train schedules along with weather. This will also work in Chicago.

![](https://i.imgur.com/IYzUGFS.png)

#### Configure EPTDB

``` javascript
// edit src/renderer/config.js

export default {
  cta: {
  	 // See Note A.1
    APIKey: '<YOUR-CTA-API-KEY>',
    
    // Formatted like this: https://hostname.com/prod/ctaproxy
    // See Note A.2
    proxyUrl: '<YOUR-CTA-PROXY>',
    
    // See Note A.3
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
  	 // This works so you can leave this hostname for now
    statusUrl: 'https://data.cityofchicago.org/resource/aavc-b2wj.json',
    
    // Formatted like this: https://hostname.com/prod/divvyproxy
    // See Note B.1
    stationUrl: '<YOUR-DIVVY-PROXY>',
    
    // See Note B.2
    locations: [{
      name: 'Elmwood Ave & Austin St',
      icon: 'home'
    }, {
      name: 'University Library (NU)',
      icon: 'work'
    }]
  },
  weather: {
  	 // See Note C.1
    APIKey: '',
    
    units: 'imperial',
    
    // Evanston
    // See Note C.2
    cityId: 4891382
  }
}
```
#### Build Setup
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

## Notes
### A.1

CTA API Keys can be requested [here.](https://www.transitchicago.com/developers/traintrackerapply/) They are emailed to you and turnaround is usually about a day.

### A.2
The CTA API must be proxied to allow for cross origin requests. I just used API Gateway in AWS with a very simple proxy then set up CORS. All you need is the hostname and base path.

### A.3
This is the list of stops that will be displayed. You need to get the list of stpid's from the GTFS feed that CTA provies [here.](https://www.transitchicago.com/developers/gtfs/) Download the gian text file and search for your stop and play around with IDs until something works.

### B.1
The Divvy Stations JSON file [https://feeds.divvybikes.com/stations/stations.json](https://feeds.divvybikes.com/stations/stations.json) must be proxied to allow for cross origin requests. I just used API Gateway in AWS with a very simple proxy then set up CORS. All you need is the hostname and base path. This is the only way to get the number of bikes/docks available currently.

### B.2
Look through the Stations JSON and find the station you are interested in. Copy the exact stationName and specify an [icon](https://material.io/icons/) that you would like to use.

### C.1
Sign up for a free [OpenWeatherMap API Key](https://openweathermap.org/api) and put it here.

### C.2
Find your CityID and put it here.

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[7c4e3e9](https://github.com/SimulatedGREG/electron-vue/tree/7c4e3e90a772bd4c27d2dd4790f61f09bae0fcef) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

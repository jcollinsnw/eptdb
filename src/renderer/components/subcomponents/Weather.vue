<template>
  <v-expansion-panel popout expandable class="cta">
      <v-expansion-panel-content :value="true">
        <div slot="header">
          <v-icon class="im">cloud</v-icon>
          <div class="title">Weather</div>
        </div>
        <v-card>
          <v-progress-linear height="3" color="secondary" :value="updatePercent"></v-progress-linear>
          <v-container>
            <v-layout row class="center">
              <v-flex xs2 class="forecast"><div class="vc"><i :class="['wi', 'large', currentConditions.icon]" :style="{color: currentConditions.color}"></i></div></v-flex>
              <v-flex xs7 class="forecast"><div class="vc">{{currentConditions.condition}}</div></v-flex>
              <v-flex xs3 class="forecast">
                  <v-layout row align-center>
                    <v-flex class="forecast lg">
                      {{currentConditions.temp}}°
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex class="forecast sm">
                      <span class="hi">{{currentConditions.high}}°</span>/<span class="lo">{{currentConditions.low}}°</span>
                    </v-flex>
                  </v-layout>
              </v-flex>
            </v-layout>
            <v-layout row style="padding-top: 9px;">
              <v-flex xs3 class="center" v-for="(f, i) in forecast" :key="'f-' + i">
                <v-layout row class="center" align-center><v-flex xs12>{{f.dow}}</v-flex></v-layout>
                <v-layout row class="center"><v-flex xs12><i :class="['wi', f.conditions.icon]" :style="{color: f.conditions.color}"></i></v-flex></v-layout>
                <v-layout row class="center"><v-flex xs12>{{f.conditions.condition}}</v-flex></v-layout>
                <v-layout row class="center"><v-flex xs12><span class="hi">{{f.high}}°</span>/<span class="lo">{{f.low}}°</span></v-flex></v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import iconMap from '../../assets/iconMap.json'
import { EventBus } from '../../eventBus.js'

export default {
  name: 'Weather',
  props: {
    updateSeconds: {
      type: Number,
      default: 600
    }
  },
  data () {
    return {
      updated: 0,
      currentConditions: {},
      forecast: [],
      ready: false,
      interval: null,
      updatePercent: 0,
      timer: null,
      now: Math.floor(Date.now() / 1000)
    }
  },
  computed: {
  },
  mounted () {
    this.apiKey = this.$config.weather.apiKey
    this.getData({time: this.now, runSleep: false})
    EventBus.$on('heartbeat', now => {
      this.now = now.time
      if (now.sleep) {
        this.updatePercent = 100 - (Math.max(this.now - this.updated, 0) / (this.$config.options.sleepMinutes * 60)) * 100
      } else {
        this.updatePercent = 100 - (Math.max(this.now - this.updated, 0) / this.updateSeconds) * 100
      }
      if (now.runSleep || (this.now % this.updateSeconds === 0 && !now.sleep)) {
        this.getData(now)
      }
    })
  },
  methods: {
    getData: function (now) {
      console.log('Update Weather')
      this.$http.get(`https://api.openweathermap.org/data/2.5/weather?id=${this.$config.weather.cityId}&appid=${this.$config.weather.APIKey}&units=${this.$config.weather.units}`).then((result) => {
        this.currentConditions = {
          temp: Math.floor(result.data.main.temp),
          humidity: result.data.main.humidity,
          condition: this.caps(result.data.weather[0].description),
          icon: 'wi-night-' + iconMap[result.data.weather[0].id].icon,
          color: iconMap[result.data.weather[0].id].color
        }
        this.$http.get(`https://api.openweathermap.org/data/2.5/forecast?id=${this.$config.weather.cityId}&appid=${this.$config.weather.APIKey}&units=${this.$config.weather.units}`).then((result) => {
          var fc = this.forecastCalc(result.data.list)
          this.currentConditions.high = fc[0].high
          this.currentConditions.low = fc[0].low
          if (this.currentConditions.temp > this.currentConditions.high) {
            this.currentConditions.high = this.currentConditions.temp
          }
          if (this.currentConditions.temp < this.currentConditions.low) {
            this.currentConditions.low = this.currentConditions.temp
          }
          this.forecast = fc.slice(1, 5)
          this.updated = this.now
          this.ready = true
        })
      })
    },
    forecastCalc: function (data) {
      var fc = {}
      var dates = []
      var l = []
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      for (var h in data) {
        var hour = data[h]
        var date = hour.dt_txt.split(' ')[0]
        var dateFull = new Date(hour.dt_txt)
        hour.main.temp = Math.round(hour.main.temp)
        if (!fc.hasOwnProperty(date)) {
          dates.push(date)
          fc[date] = {
            high: hour.main.temp,
            low: hour.main.temp,
            date: date,
            dateFull: dateFull,
            dow: days[dateFull.getDay()],
            conditions: {
              condition: this.caps(hour.weather[0].description),
              icon: 'wi-day-' + iconMap[hour.weather[0].id].icon,
              color: iconMap[hour.weather[0].id].color
            }
          }
        }
        if (fc[date].high < hour.main.temp) {
          fc[date].high = hour.main.temp
        }
        if (fc[date].low > hour.main.temp) {
          fc[date].low = hour.main.temp
        }
      }
      for (var i in dates) {
        var datel = dates[i]
        l.push(fc[datel])
      }
      return l
    },
    stop: function () {
      clearInterval(this.interval)
    },
    caps: function (str) {
      return str
        .toLowerCase()
        .split(' ')
        .map(function (word) {
          return word[0].toUpperCase() + word.substr(1)
        })
        .join(' ')
    }
  }
}
</script>

<style scoped>
.im {
  height: 30px;
  padding-top: 4px;
  float: left;
}
.r {
  text-align: right;
  padding-right: 10px;
}
.c {
  font-size: 30px;
  font-weight: bold;
}
.pl {
  background-color: #522398;
  padding-left: 10px;
}
.pr {
  float: left;
  margin-right: 20px;
}
.hi {
  color: orange;
}
.lo {
  color: cyan;
}
.rl {
  background-color: #c60c30;
  padding-left: 10px;
}
.vc {
  color: white;
  height: 50px;
  padding-left: 13px;
}
.center {
  text-align: center;
}
.inactiveBike {
  color: #424242;
}
.pc {
  border: 2px solid black;
}
.ico {
  padding-right: 3px;
}
.title {
  font-size: 20px;
  font-weight: 500;
  color: white;
  line-height: 30px;
  float: left;
  padding-top: 6px;
  padding-left: 10px;
}
.forecast {
  font-size: 25px;
}
.forecast.lg {
  font-size: 30px;
}
.forecast.sm {
  font-size: 20px;
}
.forecast > .vc {
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
.cta .expansion-panel__container {
  background-color: black !important;
}
.np {
  padding: 0px;
}
.cta .card {
  background-color: black !important;
}
</style>

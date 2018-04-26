<template>
  <v-expansion-panel popout expandable>
      <v-expansion-panel-content>
        <div slot="header"><img src="~@/assets/divvy.svg" class="im"></div>
        <v-card>
          <v-progress-linear height="3" color="primary" :value="updatePercent"></v-progress-linear>
          <v-container v-if="ready" class="center">
            <v-layout row v-for="station in divvyLocations" :key="'station-' + station.name">
              <v-flex xs12>
                <v-chip color="black" class="vc">
                  <v-avatar>
                    <v-icon large>{{station.icon}}</v-icon>
                  </v-avatar>
                  <v-icon class="ico" large v-for="t in divvyStationData[station.name].availableBikes" :key="'t'+t" color="blue">directions_bike</v-icon>
                  <v-icon class="ico inactiveBike" large v-for="n in divvyStationData[station.name].availableDocks" :key="n">directions_bike</v-icon>
                </v-chip>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { EventBus } from '../../eventBus.js'

export default {
  name: 'Divvy',
  props: {
    updateSeconds: {
      type: Number,
      default: 60
    }
  },
  data () {
    return {
      statusUrl: null,
      stationUrl: null,
      divvyLocations: [],
      updated: 0,
      divvyStatusData: {},
      divvyStationData: {},
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
    this.divvyLocations = this.$config.divvy.locations
    this.statusUrl = this.$config.divvy.statusUrl
    this.stationUrl = this.$config.divvy.stationUrl
    this.getDivvyData()
    EventBus.$on('heartbeat', now => {
      this.now = now
      this.updatePercent = 100 - (Math.max(this.now - this.updated, 0) / this.updateSeconds) * 100
      if (this.now % this.updateSeconds === 0) {
        console.log('Update Divvy')
        this.getDivvyData()
      }
    })
  },
  methods: {
    stop: function () {
      clearInterval(this.interval)
    },
    getDivvyData: function () {
      this.$http.get(this.statusUrl).then((response) => {
        for (var i in this.divvyLocations) {
          var locationData = this.$jq(['locations[address=?]', this.divvyLocations[i].name], {locations: response.data}).value
          this.divvyStatusData[this.divvyLocations[i].name] = locationData
        }
      })
      this.$http.get(this.stationUrl)
        .then(_response => {
          for (var i in this.divvyLocations) {
            var stationData = this.$jq(['locationsS[stationName=?]', this.divvyLocations[i].name], {locationsS: _response.data.stationBeanList}).value
            this.divvyStationData[this.divvyLocations[i].name] = stationData
          }
          this.ready = true
          this.updated = Math.floor(Date.now() / 1000)
        })
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
.cta .expansion-panel__container {
  background-color: black !important;
}
.cta .card {
  background-color: black !important;
}
</style>

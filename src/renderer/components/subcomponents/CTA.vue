<template>
  <v-expansion-panel popout expandable class="cta">
      <v-expansion-panel-content>
        <div slot="header">
          <img src="~@/assets/cta.svg" class="im">
          <div class="title">Trains</div>
        </div>
        <v-card>
          <v-progress-linear height="3" color="secondary" :value="updatePercent"></v-progress-linear>
          <v-container v-if="ready">
            <v-layout row class="pc" v-for="stop in stops" :key="stop.name">
              <v-flex xs4 :class="[stop.class, stop.flash, 'c']">{{stop.name}}</v-flex>
              <v-flex xs4 :class="[stop.class, stop.flash, 'c', 'r']" v-if="arrivals[stop.name].etas[0] !== 0">{{arrivals[stop.name].etas[0]}}m <v-icon>wifi</v-icon></v-flex>
              <v-flex xs4 :class="[stop.class, stop.flash, 'c', 'r']" v-else>Due <v-icon>wifi</v-icon></v-flex>
              <v-flex xs4 :class="[stop.class, stop.flash, 'c', 'r']" v-if="arrivals[stop.name].etas[1] !== 0">{{arrivals[stop.name].etas[1]}}m <v-icon>access_time</v-icon></v-flex>
              <v-flex xs4 :class="[stop.class, stop.flash, 'c', 'r']" v-else>Due <v-icon>wifi</v-icon></v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { EventBus } from '../../eventBus.js'

export default {
  name: 'Cta',
  props: {
    updateSeconds: {
      type: Number,
      default: 60
    }
  },
  data () {
    return {
      updated: 0,
      ready: false,
      interval: null,
      updatePercent: 0,
      timer: null,
      now: Math.floor(Date.now() / 1000),
      arrivals: {},
      stops: null
    }
  },
  computed: {
    arrivalsList: function () {
      var l = []
      for (var i in this.stops) {
        var stop = this.stops[i]
        if (this.arrivals.hasOwnProperty(stop.name)) {
          l.push(this.arrivals[stop.name])
        }
      }
      return l
    }
  },
  mounted () {
    this.stops = this.$config.cta.stops
    this.getCTAData()
    EventBus.$on('heartbeat', now => {
      this.now = now
      this.updatePercent = 100 - (Math.max(this.now - this.updated, 0) / this.updateSeconds) * 100
      if (this.now % this.updateSeconds === 0) {
        console.log('Update CTA')
        this.getCTAData()
      }
    })
  },
  methods: {
    stop: function () {
      clearInterval(this.interval)
    },
    getCTAData: function () {
      var pl = []
      for (var i in this.stops) {
        var stop = this.stops[i]
        stop.flash = null
        var stpid = stop.stpid
        var p = this.$http.get(`https://${this.$config.cta.proxyUrl}?key=${this.$config.cta.APIKey}&stpid=${stpid}&outputType=JSON`)
        pl.push(p)
      }
      Promise.all(pl).then((data) => {
        for (var s in this.stops) {
          var stop = this.stops[s]
          var ctaInfo = data[s].data.ctatt
          this.arrivals[stop.name] = {etas: [], name: stop.name}
          for (var e in ctaInfo.eta) {
            var eta = ctaInfo.eta[e]
            var _d = Date.parse(eta.arrT)
            var diff = _d / 1000 - this.now
            this.stops[s].flash = 'flash-' + this.stops[s].class
            this.arrivals[stop.name].etas.push(Math.floor(diff / 60))
          }
        }
        this.updated = this.now
        this.ready = true
      })
    }
  }
}
</script>

<style scoped>
@keyframes flash-purple {
    100% {
        background-color: #522398;
        opacity:1;
    }
    0% {
        background-color: #fff;
    }
}
    
.flash-purple-line {
    -webkit-animation-name: flash-purple;
    -webkit-animation-duration: 500ms;
    -webkit-animation-iteration-count: 1;
    -webkit-animation-timing-function: ease-in-out;
}
@keyframes flash-red {
    100% {
        background-color: #c60c30;
        opacity:1;
    }
    0% {
        background-color: #fff;
    }
}
    
.flash-red-line {
    -webkit-animation-name: flash-red;
    -webkit-animation-duration: 500ms;
    -webkit-animation-iteration-count: 1;
    -webkit-animation-timing-function: ease-in-out;
}  
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
.purple-line {
  background-color: #522398;
  padding-left: 10px;
}
.pr {
  float: left;
  margin-right: 20px;
}
.red-line {
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
.cta .expansion-panel__container {
  background-color: black !important;
}
.cta .card {
  background-color: black !important;
}
</style>

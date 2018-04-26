<template>
  <v-container>
    <v-layout row>
        <v-flex xs12>
          <divvy :update-seconds="300"></divvy>
        </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs6>
        <cta :update-seconds="60"></cta>
      </v-flex>
      <v-flex xs6>
        <weather></weather>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Divvy from './subcomponents/Divvy'
import Weather from './subcomponents/Weather'
import Cta from './subcomponents/CTA'
import { EventBus } from '../eventBus.js'

export default {
  name: 'Dash',
  data () {
    return {
      update: {
        divvy: 60,
        cta: 60,
        weather: 360
      },
      heartbeat: null
    }
  },
  mounted () {
    this.start()
  },
  methods: {
    stop: function () {
      clearInterval(this.heartbeat)
    },
    start: function () {
      this.heartbeat = setInterval(() => {
        this.now = Math.floor(Date.now() / 1000)
        EventBus.$emit('heartbeat', this.now)
      }, 1000)
    }
  },
  components: {
    Divvy: Divvy,
    Cta: Cta,
    Weather: Weather
  }
}
</script>

<style scoped>
</style>

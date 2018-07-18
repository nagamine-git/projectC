<template>
  <div>
    <vue-progress-bar></vue-progress-bar>
      <div class="container">
        <div class="info" v-if="currentEvent === null">
          <span>ロード中・・・</span>
        </div>
        <div class="info" v-else :class="flashBackground">
          <span>{{currentEvent.summary}} [{{remainingTimeView}}]</span>
        </div>
      </div>
  </div>
</template>

<script>
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const clientSecret = require('@/../client_secret.json').installed
const storage = require('electron-json-storage')
const { ipcRenderer } = require('electron')

export default {
  data () {
    return {
      currentEvent: {
        summary: null,
        end: {
          dateTime: null
        },
        start: {
          dateTime: null
        }
      },
      futureEvents: [],
      nowTime: null,
      nowPercent: null,
      remainingTime: null,
      remainingTimeView: null,
      elapsedTime: null,
      startFlash: false,
      endFlash: false
    }
  },
  mounted () {
    ipcRenderer.sendSync('changeView', 'on')
    const calendarEventsListParams = {
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 2,
      'orderBy': 'startTime'
    }

    const auth = new OAuth2(clientSecret.client_id,
      clientSecret.client_secret,
      this.$route.meta.redirectUri)

    const saveTokens = (tokens) => {
      storage.get('config', function (error, data) {
        if (error) throw error
        let json = {
          tokens: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
          }
        }
        storage.set('config', json, function (error) {
          if (error) throw error
        })
      })
    }

    let self = this
    function getNowTime () {
      self.nowTime = new Date().getTime()
    }

    function checkEvent () {
      if (self.futureEvents.length >= 2) {
        if (new Date().getTime() >= new Date(self.futureEvents[0].end.dateTime).getTime()) {
          self.currentEvent = self.futureEvents[1]
        } else {
          self.currentEvent = self.futureEvents[0]
        }
      }
    }

    function refreshCalendar () {
      if (self.$route.query.tokens) {
        auth.credentials = self.$route.query.tokens
        const calendar = google.calendar({version: 'v3', auth})
        return calendar.events.list(calendarEventsListParams).then(res => {
          self.futureEvents = res.data.items
          checkEvent()
        }).catch(err => {
          console.log(err)
        })
      } else {
        auth.getToken(self.$route.query.code).then(res => {
          saveTokens(res.tokens)
          auth.credentials = res.tokens
          const calendar = google.calendar({version: 'v3', auth})
          return calendar.events.list(calendarEventsListParams)
        }).then(res => {
          self.futureEvents = res.data.items
          checkEvent()
        }).catch(err => {
          console.log(err)
        })
      }
    }

    // 1秒ごとタイマー更新
    getNowTime()
    setInterval(getNowTime, 1000)

    // 3分ごとカレンダーの同期
    refreshCalendar()
    setInterval(refreshCalendar, 180000)

    this.$electron.ipcRenderer.on('refreshCalendar', e => {
      refreshCalendar()
    })
  },
  watch: {
    nowTime: function () {
      if (this.currentEvent) {
        let endTime = new Date(this.currentEvent.end.dateTime).getTime()
        let startTime = new Date(this.currentEvent.start.dateTime).getTime()
        this.remainingTime = Math.floor((endTime - this.nowTime) / 1000)
        this.elapsedTime = this.nowTime - startTime
        let remainingTimeHour = String(Math.floor(Math.floor(this.remainingTime / 60) / 60))
        let remainingTimeMin = String(Math.floor(this.remainingTime / 60) % 60)
        let remainingTimeSec = String(this.remainingTime % 60)
        this.remainingTimeView = remainingTimeHour + ':' + remainingTimeMin + ':' + remainingTimeSec
        this.nowPercent = Math.round(((this.elapsedTime) / (endTime - startTime)) * 100)
        if (this.nowPercent >= 0 && this.nowPercent <= 100) {
          this.$Progress.set(this.nowPercent)
          if (this.remainingTime <= 60 && this.remainingTime > 0) {
            this.endFlash = true
            this.startFlash = false
          } else if (this.nowPercent >= 0 && this.elapsedTime < 60000) {
            this.endFlash = false
            this.startFlash = true
          } else {
            this.endFlash = false
            this.startFlash = false
          }
        } else {
          this.$Progress.set(0)
          this.startFlash = false
          this.endFlash = false
        }
      }
    }
  },
  computed: {
    flashBackground: function () {
      return {
        'set_background_color_end': this.endFlash,
        'set_background_color_start': this.startFlash
      }
    }
  }
}
</script>

<style scoped src="./style.css"></style>

<template>
  <div>
    <vue-progress-bar></vue-progress-bar>
      <div class="container">
        <div class="info" v-if="event.summary === null">
          <span>ロード中・・・</span>
        </div>
        <div class="info" v-else>
          <span>{{event.summary}} [{{remainingTime}}]</span>
        </div>
      </div>
  </div>
</template>

<script>
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const clientSecret = require('@/../client_secret.json').installed
const storage = require('electron-json-storage')

export default {
  data () {
    return {
      event: {
        summary: null,
        end: {
          dateTime: null
        },
        start: {
          dateTime: null
        }
      },
      nowTime: null,
      nowPercent: null,
      remainingTime: null
    }
  },
  mounted () {
    const calendarEventsListParams = {
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
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
    setInterval(getNowTime, 1000)

    if (this.$route.query.tokens) {
      auth.credentials = this.$route.query.tokens
      const calendar = google.calendar({version: 'v3', auth})
      return calendar.events.list(calendarEventsListParams).then(res => {
        console.log(res)
        this.event = res.data.items[0]
      }).catch(err => {
        console.log(err)
        alert('エラー！: ' + err)
      })
    } else {
      auth.getToken(this.$route.query.code).then(res => {
        saveTokens(res.tokens)
        auth.credentials = res.tokens
        const calendar = google.calendar({version: 'v3', auth})
        return calendar.events.list(calendarEventsListParams)
      }).then(res => {
        console.log(res)
        this.event = res.data.items[0]
      }).catch(err => {
        console.log(err)
        alert('エラー！: ' + err)
      })
    }

    this.$electron.ipcRenderer.on('start', e => {
      this.$Progress.start()
    })
    this.$electron.ipcRenderer.on('end', e => {
      this.$Progress.set(100)
    })
  },
  watch: {
    nowTime: function () {
      let endTime = new Date(this.event.end.dateTime).getTime()
      let startTime = new Date(this.event.start.dateTime).getTime()
      let remainingTimeHour = String(Math.floor(Math.floor(Math.floor((endTime - this.nowTime) / 1000) / 60) / 60))
      let remainingTimeMin = String(Math.floor(Math.floor((endTime - this.nowTime) / 1000) / 60) % 60)
      let remainingTimeSec = String(Math.floor((endTime - this.nowTime) / 1000) % 60)
      this.remainingTime = remainingTimeHour + ':' + remainingTimeMin + ':' + remainingTimeSec
      this.nowPercent = Math.round(((this.nowTime - startTime) / (endTime - startTime)) * 100)
      this.$Progress.set(this.nowPercent)
    }
  }
}
</script>

<style scoped src="./style.css"></style>

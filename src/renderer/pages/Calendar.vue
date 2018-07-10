<template>
  <div>
    <vue-progress-bar></vue-progress-bar>
      <div class="container">
        <div class="info" v-if="event.summary === null">
          <span>ロード中・・・</span>
        </div>
        <div class="info" v-else>
          <span>{{event.summary}}</span>[<span>{{event.end.dateTime}}</span>-><span>{{event.start.dateTime}}</span>]
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
      }
    }
  },
  mounted () {
    this.$electron.ipcRenderer.on('start', e => {
      this.$Progress.start()
    })
    this.$electron.ipcRenderer.on('end', e => {
      this.$Progress.set(100)
    })

    const auth = new OAuth2(clientSecret.client_id,
      clientSecret.client_secret,
      this.$route.meta.redirectUri)
    auth.getToken(this.$route.query.code).then(res => {
      auth.credentials = res.tokens

      const calendar = google.calendar({version: 'v3', auth})
      return calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      })
    }).then(res => {
      console.log(res)
      this.event = res.data.items[0]
    }).catch(err => {
      console.log(err)
      alert('エラー！: ' + err)
    })

    storage.get('config', function (error, data) {
      if (error) throw error

      if (Object.keys(data).length === 0) {
        console.log('データがないときの処理')
        let json = {
          user: 'hoge'
        }
        storage.set('config', json, function (error) {
          if (error) throw error
        })
      } else {
        console.log('データがあるときの処理')
        console.log(data)
      }
    })
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    height: 100%;
    width: 100% ;
  }

  body { 
    font-family: 'Source Sans Pro', sans-serif;
    height: 100%;
    margin: 0;
    width: 100%;
  }

  .container {
    border-style: none;
    text-align: center;
  }

  .info {
    border-style: none;
    background-color: #222222;
    border-radius: 0px 0px 6px 6px;
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
    display: inline-block;
    opacity: 0.89;
    padding: 1px 12px 3px;
    border-style: none;
    color: #fff;
  }

  .info span {
    font-size: 11.5px;
  }

</style>

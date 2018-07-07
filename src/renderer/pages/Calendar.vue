<template>
<div>
  <div v-if="null === events">ロード中</div>
  <ul v-else>
    <li v-for="e of events">
      {{e.summary}}
    </li>
  </ul>
</div>
</template>

<script>
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const clientSecret = require('@/../client_secret.json').installed

export default {
  data () {
    return { events: null }
  },
  mounted () {
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
      this.events = res.data.items
    }).catch(err => {
      console.log(err)
      alert('エラー！: ' + err)
    })
  }
}
</script>
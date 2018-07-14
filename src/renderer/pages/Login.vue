<template>
  <webview ref="webview" :src="url" @will-navigate="onWillNavigate" />
</template>

<style scoped>
webview {
  display: inline-flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<script>
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const clientSecret = require('@/../client_secret.json').installed

export default {
  data () {
    return { url: 'about:blank' }
  },
  mounted () {
    const storage = require('electron-json-storage')
    const router = this.$router

    storage.get('config', function (error, data) {
      if (error) throw error
      if (Object.keys(data).indexOf('tokens') >= 0) {
        router.push({name: 'calendar', query: {tokens: data.tokens}})
      }
    })

    if (process.env.NODE_ENV === 'development') {
      window.webview = this.$refs.webview
    }
    const auth = new OAuth2(clientSecret.client_id,
      clientSecret.client_secret,
      // clientSecret.redirect_uris[0])
      this.$route.meta.redirectUri)
    this.url = auth.generateAuthUrl({scope: 'https://www.googleapis.com/auth/calendar'})
  },
  methods: {
    onWillNavigate (ev) {
      const url = '' + ev.url
      if (url.startsWith(this.$route.meta.redirectUri)) {
        // 念の為止める。 stop() は効かない模様
        this.$refs.webview.loadURL('about:blank')
        const parser = new URL(url)
        const code = parser.searchParams.get('code')
        this.$router.push({name: 'calendar', query: {code}})
      }
    }
  }
}
</script>
<template>
<div>
  <div>テスト</div>
  <div v-if="null === files">ロード中</div>
    <ul v-else>
      <li v-for="f of files" :key="'file-' + f.id">
        {{f.name}}
      </li>
    </ul>
</div>
</template>

<script>
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const clientSecret = require('@/../client_secret.json').web

export default {
  data () {
    return { files: null }
  },
  mounted () {
    const auth = new OAuth2(clientSecret.client_id,
      clientSecret.client_secret,
      this.$route.meta.redirectUri)
    auth.getToken(this.$route.query.code).then(res => {
      auth.credentials = res.tokens

      const drive = google.drive({version: 'v3', auth})
      return drive.files.list({
        q: "'root' in parents and trashed = false"})
    }).then(res => {
      this.files = res.data.files
    }).catch(err => {
      console.log(err)
      alert('エラー！: ' + err)
    })
  }
}
</script>
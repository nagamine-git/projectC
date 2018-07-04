<template>
  <div>
    <vue-progress-bar></vue-progress-bar>
      <div class="container">
        <div class="info">
          <span>コンテンツをここに表示。右には残り時間。</span>[<span>30</span>:<span>00</span>]
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    methods: {
      start () {
        this.$Progress.start()
      },
      set (num) {
        this.$Progress.set(num)
      },
      increase (num) {
        this.$Progress.increase(num)
      },
      decrease (num) {
        this.$Progress.decrease(num)
      },
      finish () {
        this.$Progress.finish()
      },
      fail () {
        this.$Progress.fail()
      },
      test () {
        this.$Progress.start()

        this.$http.jsonp('http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=7waqfqbprs7pajbz28mqf6vz')
          .then((response) => {
            this.$Progress.finish()
          }, (response) => {
            this.$Progress.fail()
          })
      }
    },
    mounted () {
      this.$electron.ipcRenderer.on('start', e => {
        this.$Progress.start()
      })
      this.$electron.ipcRenderer.on('end', e => {
        this.$Progress.set(100)
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

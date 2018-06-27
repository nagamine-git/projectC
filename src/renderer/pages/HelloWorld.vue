<template>
  <div id='main'>
    <button>Googleでサインイン</button>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld'
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
    -webkit-app-region: drag;
    -webkit-user-select: none;
    font-family: 'Source Sans Pro', sans-serif;
    height: 100%;
    margin: 0;
    opacity:0.5;
    width: 100%;
  }
  
  #main {
    background-color: black;
    color: white;
    height: 100vh;
    text-align: center;
    width: 100vw;
    padding: 20px 5px 0;
    position:fixed;
  }
  
  #main button {
    margin-top: 15px;
    padding: 10px;
  }

</style>

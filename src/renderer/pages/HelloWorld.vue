<template>
  <div id='main'>
    <div id='progress' />
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
    width: 100%;
  }
  
  #main {
    background-color: #616161;
    height: 4px;
    text-align: center;
    width: 100vw;
    position:fixed;
    z-index: 99;
    opacity:0.5;
  }

  #progress {
    background-color: #0288D1;
    height: 4px;
    text-align: center;
    width: 50vw;
    position:fixed;
    z-index: 100;
  }
  
</style>

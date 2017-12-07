<template>
  <div id="app">
    <header>
      <img src="static/img/logo.png">
      <h1>HEG horaire printemps <span>2017-2018 (semaine type)</span></h1>
    </header>
    <main id="main">
      <router-view></router-view>
      <footer>Source: JP3 semaine 14 mars 2017, état au 05/12/2017</footer>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  margin: 0;
  height: 50px;
  padding: 0 8px;
  background-color: #35495E;
  color: #ffffff;
  display: flex;
  align-items: center;
}

header img {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  flex-grow: 0;
}

header h1 {
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  padding-left: 16px;
  padding-top: 4px;
}

header h1 span {
  display: block;
  font-size: 65%;
}

main {
  flex: 1;
  overflow: auto;
}

footer {
  font-size: 70%;
  text-align: right;
  color: #999;
  padding: 8px;
}
</style>

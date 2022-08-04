<template>
  <header>
    <nav>
      <router-link to="/calculator">计算器</router-link>|
      <router-link to="/practice">点数练习</router-link>
    </nav>
    <div class="flex"></div>
    <img src="@/assets/setting.svg" id="setting"/>
  </header>
  <div id="content">
    <router-view/>
  </div>
</template>

<script>
  export default{
    name:"App",
  }
</script>

<style>
  nav {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }

  header{
    height: 40px;
    text-align: center;
    background-color:aliceblue;
    position: fixed;
    width: 100%;
    top: 0;
    left:0;
    display: flex;
  }

  nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  nav a.router-link-exact-active {
    color: #42b983;
  }
  .flex{
    flex: auto;
  }

  #content{
    padding-top: 40px;
  }

  #setting{
    height: 40px;
  }
</style>

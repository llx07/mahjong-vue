<template>
  <header>
    <nav>
      <router-link to="/calculator">计算器</router-link>|
      <router-link to="/practice">点数练习</router-link>
    </nav>
    <div class="flex"></div>
    <img src="@/assets/setting.svg" id="setting" @click="showSetting=!showSetting"/>
  </header>
  <div id="content">
    <router-view :rule="rule"/>
  </div>

  <div id="modal" v-if="showSetting">
    <setting-select v-model="rule" @close="showSetting=false"/>
  </div>

</template>

<script>
  import { Rule } from './store/calc'
  import SettingSelect from './components/SettingSelect.vue'
  export default{
    name:"App",
    data(){
      return {
        rule:new Rule(),
        showSetting:false
      }
    },
    components: {
      SettingSelect
    },
    created(){
      if(localStorage.getItem('rule')!=null){
        this.rule = JSON.parse(localStorage.getItem('rule'))
      }
    },
    methods:{
      updateSetting(x){
        this.rule=x;
      }
    }
  }
</script>

<style scoped>
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
    width: calc(100% - 20px);
    top: 0;
    left:0;
    display: flex;
    padding: 0 10px;
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
    cursor: pointer;
  }

  #modal::before{
    content: "";
    background-color: rgba(0,0,0,0.5);
    z-index: 5;
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height: 100%;
  }
</style>

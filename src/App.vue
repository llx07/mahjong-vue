<template>
  <div id="root">
    <header>
      <nav>
        llx的日麻工具 v2.0
        <router-link to="/calculator">计算器</router-link>|
        <router-link to="/practice">点数练习</router-link>
      </nav>
      <div class="flex"></div>
      <n-icon size="60" @click="showSetting=!showSetting" id="setting">
        <settings/>
      </n-icon>
    </header>
    <div id="content">
      <router-view :rule="rule"/>
    </div>

    <footer>            
      <div>
        © 2022 Linlexiao All rights reserved. &nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;
        素材来自：<a target="_blank" href="http://wiki.lingshangkaihua.com/mediawiki/index.php/%E9%A6%96%E9%A1%B5">立直麻将百科</a>
        &nbsp;&nbsp;&nbsp;
        备案号：<a target="_blank" href="https://beian.miit.gov.cn/">沪ICP备2022015064号</a>
        <!-- <a href="/legacy" id="bk">返回旧版？</a> -->
      </div>
    </footer>
    <n-modal
      v-model:show="showSetting"
      class="custom-card"
      preset="card"
      :style="{width:'600px'}"
      title="自定义设置"
      :bordered="false"
      @after-leave="updateData"
    >

      <n-grid :cols="2" :y-gap="3">
        <n-grid-item>食断：</n-grid-item>
        <n-grid-item>
          <n-radio-group v-model:value="rule.shiDuan">
            <n-radio-button
              v-for="o in settings[0]" :key="o.value"
              :value="o.value"
              :label="o.label"
            />
          </n-radio-group>
        </n-grid-item>
        <n-grid-item>多倍役满：</n-grid-item>
        <n-grid-item>
          <n-radio-group v-model:value="rule.duoBeiYiMan">
          <n-radio-button
            v-for="o in settings[0]" :key="o.value"
            :value="o.value"
            :label="o.label"
          />
          </n-radio-group>
        </n-grid-item>

        <n-grid-item>复合役满：</n-grid-item> 
        <n-grid-item>
          <n-radio-group v-model:value="rule.fuHeYiMan">
          <n-radio-button
            v-for="o in settings[0]" :key="o.value"
            :value="o.value"
            :label="o.label"
          />
          </n-radio-group>
        </n-grid-item>
        <n-grid-item>连风雀头：</n-grid-item>
        <n-grid-item>
          <n-radio-group v-model:value="rule.lianFeng4">
          <n-radio-button
            v-for="o in settings[1]" :key="o.value"
            :value="o.value"
            :label="o.label"
          />
          </n-radio-group>
        </n-grid-item>

        <n-grid-item>13番及以上：</n-grid-item> 
        <n-grid-item>
          <n-radio-group v-model:value="rule.allowLeiMan">
          <n-radio-button
            v-for="o in settings[2]" :key="o.value"
            :value="o.value"
            :label="o.label"
          />
        </n-radio-group>
        </n-grid-item>
      </n-grid>
    </n-modal>
  </div>
</template>

<script>
  import { Rule } from './store/calc'
  import { NModal,NRadioGroup,NRadioButton, NGrid, NGridItem, NIcon} from 'naive-ui'
  import { Settings } from 'vicons/ionicons-v5'

  export default{
    name:"App",
    data(){
      return {
        rule:new Rule(),
        showSetting:false,
        settings:[
          [{value:1,label:"有"},{value:0,label:"无"}],
          [{value:0,label:"2符"},{value:1,label:"4符"}],
          [{value:1,label:"累计役满"},{value:0,label:"三倍满"}],
        ],
      }
    },
    components: {
      NModal,NRadioGroup,NRadioButton,NGrid, NGridItem,NIcon,
      Settings
    },
    created(){
      if(localStorage.getItem('rule')!=null){
        this.rule = JSON.parse(localStorage.getItem('rule'))
      }
    },
    methods:{
      updateData(){
        localStorage.setItem('rule',JSON.stringify(this.rule))
      }
    }
  }
</script>

<style scoped>
  #bk{
    margin-left: 60px;
  }

  #root{
    --nav-height:60px;
  }
  nav {
    height:var(--nav-height);
    line-height: var(--nav-height);
    text-align: center;
    font-size: 25px;
  }

  header{
    height: var(--nav-height);
    text-align: center;
    background-color:aliceblue;
    position: fixed;
    width: calc(100% - 20px);
    top: 0;
    left:0;
    display: flex;
    padding: 0 10px;
  }

  footer {
    position: fixed ;
    bottom: 0;
    left:0;
    width: 100%;
    padding: 0;
    margin: 0;
    height: 40px;/*脚部的高度*/
    background: aliceblue;
    clear:both;
    text-align: center;
    align-content: center;
    justify-content: center;
    align-items:center;
    display:flex;
    flex-direction:column;
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
    padding-top: var(--nav-height);
    padding-bottom: 40px;
  }

  #setting{
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

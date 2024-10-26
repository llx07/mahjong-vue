<template>
  <div id="root">
    <header>
      <n-space>
        <router-link class="nav" to="/calculator">计算器</router-link>
        <div class="nav">|</div>
        <router-link class="nav" to="/practice">点数练习</router-link>
      </n-space>

      <n-space justify="end" id="nav-buttons">
        <n-icon size="2rem" @click="showInfo=!showInfo" color="#333">
          <InfoRound/>
        </n-icon>
        <n-icon size="2rem" @click="showSetting=!showSetting" color="#333">
          <SettingsRound/>
        </n-icon>
      </n-space>
    </header>
    
    <div id="content">
      <router-view :rule="rule"/>
    </div>

    <footer>            
      <div>©2022-2023 linlexiao.com 版权所有 | 
        <a target="_blank" href="https://beian.miit.gov.cn/"> 沪ICP备2022025418号-2</a>
      </div>
    </footer>

    <!-- 设置修改框  -->
    <n-modal
      v-model:show="showSetting"
      class="custom-card"
      preset="card"
      :style="{width:'37.5rem'}"
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

        <n-grid-item>13翻及以上：</n-grid-item> 
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

    
    <!-- 信息框  -->
    <n-modal
      v-model:show="showInfo"
      class="custom-card"
      preset="card"
      :style="{width:'37.5rem'}"
      title="关于"
      :bordered="false"
    >

      <div>
        <p>
            本项目采用 Vue 构建，核心逻辑使用 JavaScript 实现，并在 Github 上开源。项目地址 <a href="https://github.com/linlexiao0/mahjong-vue">https://github.com/linlexiao0/mahjong-vue</a>。欢迎提出 Pull Requests 或 Fork 你自己的版本！
        </p>

        <p>
          牌画素材来自 <a href="https://github.com/lietxia/mahjong_graphic">https://github.com/lietxia/mahjong_graphic</a>，以「M+字型授權條款」授权。
        </p>

        <p>
          支持对某些规则进行自定义（旁边的按钮）。现在可以自定义的规则有：食断，是否计多倍役满、复合役满，连凤雀头符数，是否计累计役满。
        </p>

        <p>
          如果有什么意见和想法，可以在 Github 上提出 Issue，或也可以联系我的邮箱 <a href="mailto://linlexiao2007@outlook.com">linlexiao2007@outlook.com</a>。
        </p>

        
        <p>
          目前的计划（按重要性排序）：
          <ol>
            <li>改进 UI</li>
            <li>将项目迁移到TypeScript</li>
            <li>编写测试用例</li>
          </ol>
        </p>
      </div>

    </n-modal>

  </div>
</template>

<script>
  import { Rule } from './store/definition'
  import { NModal,NRadioGroup,NRadioButton, NGrid, NGridItem, NIcon, NSpace} from 'naive-ui'
  import { SettingsRound,InfoRound } from '@vicons/material'

  export default{
    name:"App",
    data(){
      return {
        rule:new Rule(),
        showSetting:false,
        showInfo:false,


        settings:[
          [{value:1,label:"有"},{value:0,label:"无"}],
          [{value:0,label:"2符"},{value:1,label:"4符"}],
          [{value:1,label:"累计役满"},{value:0,label:"三倍满"}],
        ],
      }
    },
    components: {
      NModal,NRadioGroup,NRadioButton,NGrid, NGridItem,NIcon,NSpace,
      SettingsRound,InfoRound
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
    margin-left: 3.75rem;
  }

  #root{
    --nav-height: 2.5rem  ;
    --nav-padding: 0.25rem  ;
  }
  

  header,footer{
    z-index: 5;
  }

  header{
    height: var(--nav-height);
    text-align: center;
    position: fixed;
    width: calc(100% - 2.4rem);
    top: 0;
    left:0;
    display: flex;
    padding: var(--nav-padding) 1.2rem;
  }

  footer {
    position: fixed ;
    bottom: 0;
    left:0;
    width: 100%;
    padding: 0;
    margin: 0;
    height: 2rem;
    text-align: center;
    align-content: center;
    justify-content: center;
    align-items:center;
    display:flex;
    flex-direction:column;
}

  .nav {
    height:var(--nav-height);
    line-height: var(--nav-height);
    text-align: center;
    font-size: 1.5rem;
  }

  a.nav  {
    font-weight: bold;
    color: #2c3e50;
  }
  #nav-buttons{
    flex-grow: 1;
  }
  
  #nav-buttons svg{
    cursor: pointer;
  }
  a.nav.router-link-exact-active {
    color: #42b983;
  }
  .flex{
    flex: auto;
  }

  #content{
    padding-top: var(--nav-height);
    padding-bottom: 2rem;
    padding-left: 2px;
    padding-right: 2px;
  }


  #modal::before{
    content: "";
    background-color: rgba(0,0,0,0.5);
    z-index: 10;
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height: 100%;
  }
</style>

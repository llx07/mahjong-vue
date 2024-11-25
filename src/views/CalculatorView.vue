<template>  

  <div class="flex-row">
    <div>
      <div v-for="row in paiName" :key="row" class="flex-row nowrap">
        <pai-select v-for="pai in row" :key="pai" 
          :name="pai" @click="add(pai)" :class="{disabled:isDisable[pai]}"></pai-select>
      </div>
    </div>
    <div class="flex-row">
      <div class="flex-col class1">
        <n-button class="btn" @click="clearAll()" type="error" ghost size="large">清空</n-button>
        <n-button class="btn" @click="myCalculate()" type="primary" ghost size="large"
         :disabled="!calculateEnable">计算</n-button>
        <n-divider class="line"/>
        <n-grid :cols="3" :y-gap="3">
          <n-grid-item>加入类型</n-grid-item>
          <n-grid-item :span="2"><n-select v-model:value="mode" :options="optionMode"/></n-grid-item>
          <n-grid-item>和了方式</n-grid-item>
          <n-grid-item :span="2"><n-select v-model:value="agariWay" :options="optionAgariWay"/></n-grid-item>
          <n-grid-item>场风</n-grid-item>
          <n-grid-item :span="2"><n-select v-model:value="field" :options="optionWind"/></n-grid-item>
          <n-grid-item>自风</n-grid-item>
          <n-grid-item :span="2"><n-select v-model:value="seat" :options="optionWind"/></n-grid-item>
        </n-grid>
        <n-divider class="line"/>
        
        <n-grid :cols="3" :y-gap="3">
          <n-grid-item>赤宝牌</n-grid-item>
          <n-grid-item :span="2"><n-input-number v-model:value="red" size="large" :min="0"/></n-grid-item>
          <n-grid-item>本场</n-grid-item>
          <n-grid-item :span="2"><n-input-number v-model:value="ponba" size="large" :min="0" /></n-grid-item>
        </n-grid>
      </div>
      <n-checkbox-group v-model:value="yakus" class="flex-col">
          <n-checkbox v-for="item in yakuName" :key="item.value" size="large"
            :value="item.value" :label="item.name" :disabled="isYakuDisable[item.value]"/>
      </n-checkbox-group>
    </div>

    <div id="result">
      <div v-if="isTrueAgari">
        <div class="number">
          <div v-if="result.pointType==2">{{result.point1}} / {{result.point2}}</div>
          <div v-else-if="result.pointType==0">{{result.point1}} ALL</div>
          <div v-else>{{result.point1}}</div>
        </div>
        <div v-if="!result.isYakuman">{{result.han}}翻
          <span v-if="needFu">{{result.fu}}符</span>
          {{manName}}
        </div>
        <div v-else>{{result.han}}倍役满</div>
        <ul>
          <li v-for="(name,index) in result.yaku" :key="index">
            {{name}}
          </li>
        </ul>

        <div v-if="needFu">
          符计算内容：
          
        <ul>
          <li v-for="(name,index) in result.fuMessages" :key="index">
            {{name}}
          </li>
        </ul>
        </div>
      </div>
      <div v-else>
        <div class="number">
          无役/无和牌型
        </div>
      </div>
    </div>
  </div>

  <div class="flex-row">
    <div class="flex-col flex nospace">
      手牌
      <div class="box nospace">
        <pai-select v-for="(pai,index) in hand" :key="index" 
          :name="pai" @click="removeSingle(hand,pai)"></pai-select>
      </div>
    </div>
    <div class="flex-col flex nospace">
        副露
      <div class="box nospace">
        <block-select v-for="(item, index) in furo" :key="index"
          :type="item.type" :name="item.name" @click="removeMulti(item)"></block-select>
      </div>
    </div>
  </div>
  
  <div class="flex-row">
    <div class="flex-col flex nospace">
      宝牌指示牌 
      <div class="box nospace">
        <pai-select v-for="(pai,index) in dora" :key="index" 
          :name="pai" @click="removeSingle(dora,pai)"></pai-select>
      </div>
    </div>
    <div class="flex-col flex nospace">
      里宝牌指示牌
      <div class="box nospace">
        <pai-select v-for="(pai,index) in ura" :key="index" 
          :name="pai" @click="removeSingle(ura,pai)"></pai-select>
      </div>
    </div>
  </div>

  
</template>

<script>
import PaiSelect from '../components/PaiSelect.vue'
import BlockSelect from '../components/BlockSelect.vue'
import { NButton, NSelect, NDivider, NCheckboxGroup, NCheckbox, NGrid, NGridItem, NInputNumber} from 'naive-ui'
import { next, getType, getNumber } from '@/store/util'
import { Calculator } from '@/store/calc'
import { Result} from '@/store/definition'
import { PositionType, Pai, Block, BlockType, RIICHI, DOUBLE_RIICHI, IPPATSU, HAITEI_RAOYUE, HOUTEI_RAOYUI, RINNSHANN_KAIHOU, CHANKAN, TENHOU, CHIIHOU, TSUMO, RON, State } from "@/store/types"

export default {
  name: 'App',
  components: {
    PaiSelect,
    BlockSelect,
    NButton,
    NSelect,
    NDivider,
    NCheckboxGroup,
    NCheckbox, NGrid, NGridItem, NInputNumber
  },
  props:{
    rule:Object
  },
  data() {
    return {
      paiName: [
        ['1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p'],
        ['1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s'],
        ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m'],
        ['1z', '2z', '3z', '4z', '5z', '6z', '7z']
      ],
      optionMode:[
        {label:"手牌", value:"pai"},
        {label:"吃", value:"chi"},
        {label:"碰", value:"pon"},
        {label:"杠", value:"kan"},
        {label:"暗杠", value:"ankan"},
        {label:"宝牌指示牌", value:"dora"},
        {label:"里宝牌指示牌", value:"ura"},
      ],
      optionAgariWay:[
        {label:"自摸", value:"tsumo"},
        {label:"荣和", value:"ron"},
      ],
      optionWind:[
        {label:"东", value:"east"},
        {label:"南", value:"south"},
        {label:"西", value:"west"},
        {label:"北", value:"north"},
      ],
      yakuName:[
        {value:"riichi", name:"立直"},
        {value:"double-riichi", name:"双立直"},
        {value:"ippatsu", name:"一发"},
        {value:"haite", name:"海底捞月"},
        {value:"houte", name:"河底摸鱼"},
        {value:"rinnshann", name:"岭上开花"},
        {value:"chankan", name:"抢杠"},
        {value:"tenhou", name:"天和"},
        {value:"chiihou", name:"地和"},
      ],
      hand:[],
      furo:[],
      dora:[],
      ura:[],
      yakus:[],
      mode:"pai",
      agariWay:"tsumo",
      field:"east",
      seat:"east",
      red:0,
      ponba:0,
      result:new Result(),
    }
  },
  methods:{
    add(name){
      if(!this.isDisable[name]){
        if(this.mode=='pai')this.addSingle(this.hand,name);
        else if(this.mode=='dora')this.addSingle(this.dora,name);
        else if(this.mode=='ura')this.addSingle(this.ura,name);
        else this.addMulti(name);
      }
    },
    addSingle(obj, name){
      obj.push(name)
    },
    addMulti(na){
      this.furo.push({type:this.mode,name:na});
    },
    removeSingle(obj, name){
      // TODO 在hand为11p234s1p时，点击最后一个1p会删除第一个1p
      obj.splice(this.hand.findIndex((x)=>{return x==name}),1)
    },
    removeMulti(name){
      // TODO 在hand为11p234s1p时，点击最后一个1p会删除第一个1p
      this.furo.splice(this.hand.findIndex((x)=>{return x==name}),1)
    },
    clearAll(){
      this.hand=[],
      this.furo=[],
      this.ura=[],
      this.yakus=[],
      this.mode='pai',
      this.agariWay='tsumo',
      this.field='east',
      this.seat='east'
    },
    myCalculate(){
      function cvtWind(x){
        if(x=='east')return PositionType.EAST;
        if(x=='west')return PositionType.WEST;
        if(x=='south')return PositionType.SOUTH;
        if(x=='north')return PositionType.NORTH;
      }
      function cvtPai(s){
        return new Pai(getType(s),getNumber(s))
      }
      function cvtFuro(s){
        let open = true
        let localType=BlockType.TRI
        if(s.type=="ankan")open=false

        if(s.type=="chi")localType = BlockType.SEQ
        else if(s.type=="pon")localType = BlockType.TRI
        else localType = BlockType.QUAD
        return new Block(localType,getType(s.name),getNumber(s.name),open)
      }
      function cvtYaku(x){
        if(x=="riichi")return RIICHI
        if(x=="double-riichi")return DOUBLE_RIICHI
        if(x=="ippatsu")return IPPATSU
        if(x=="haite")return HAITEI_RAOYUE
        if(x=="houte")return HOUTEI_RAOYUI
        if(x=="rinnshann")return RINNSHANN_KAIHOU
        if(x=="chankan")return CHANKAN
        if(x=="tenhou")return TENHOU
        if(x=="chiihou")return CHIIHOU
      }
      const tAgariWay = this.agariWay=='tsumo'?TSUMO:RON;
      const tSeat = cvtWind(this.seat);
      const tField = cvtWind(this.field);

      let tPai = [];
      for(const p of this.hand)tPai.push(cvtPai(p));

      const tAgariPai = tPai[tPai.length-1]
      tPai.splice(tPai.length-1,1);

      let tDora=[]
      for(const p of this.dora)tDora.push(cvtPai(p));
      let tUra=[]
      for(const p of this.ura)tUra.push(cvtPai(p));

      let tBlock = [];
      for(const b of this.furo)tBlock.push(cvtFuro(b));

      let tYaku=[];
      for(const y of this.yakus)tYaku.push(cvtYaku(y));

      let s = new State(
        tField,tSeat,tYaku,tAgariWay,tPai,tBlock,tDora,tUra,tAgariPai,this.red
      )

      let c = new Calculator()
      this.result = c.calculate(s,this.rule)

      if(this.agariWay=='tsumo'){
        this.result.point1 += 100*this.ponba;
        this.result.point2 += 100*this.ponba;
      }
      else{
        this.result.point1 += 300*this.ponba;
      }
    },
    updateYaku(name){
      this.yakus.splice(this.yakus.findIndex((x)=>{return x==name}),1)
    }
  },
  computed:{
    isDisable(){
      let paiLeft = {
        "1p": 4, "2p": 4, "3p": 4, "4p": 4, "5p": 4, "6p": 4, "7p": 4, "8p": 4, "9p": 4,
        "1s": 4, "2s": 4, "3s": 4, "4s": 4, "5s": 4, "6s": 4, "7s": 4, "8s": 4, "9s": 4,
        "1m": 4, "2m": 4, "3m": 4, "4m": 4, "5m": 4, "6m": 4, "7m": 4, "8m": 4, "9m": 4,
        "1z": 4, "2z": 4, "3z": 4, "4z": 4, "5z": 4, "6z": 4, "7z": 4,
      }
      let rt = {
        "1p": false, "2p": false, "3p": false, "4p": false, "5p": false, "6p": false, "7p": false, "8p": false, "9p": false,
        "1s": false, "2s": false, "3s": false, "4s": false, "5s": false, "6s": false, "7s": false, "8s": false, "9s": false,
        "1m": false, "2m": false, "3m": false, "4m": false, "5m": false, "6m": false, "7m": false, "8m": false, "9m": false,
        "1z": false, "2z": false, "3z": false, "4z": false, "5z": false, "6z": false, "7z": false,
      }

      
      for(const p of this.hand){
        paiLeft[p]--;
      }
      for(const p of this.dora){
        paiLeft[p]--;
      }
      for(const p of this.ura){
        paiLeft[p]--;
      }
      for(const x of this.furo){
        if(x.type=='pon'){
          paiLeft[x.name]-=3;
        }
        else if(x.type=='chi'){
          paiLeft[x.name]--;
          paiLeft[next(x.name)]--;
          paiLeft[next(next(x.name))]--;
        }
        else{
          paiLeft[x.name]-=4;
        }
      }

      if(this.mode=="pai"){
        if(this.hand.length== (14-this.furo.length*3)){
          for(const name in rt){
            rt[name]=true
          }
          return rt
        }
        for(const name in rt){
          if(paiLeft[name]==0){
            rt[name]=true;
          }else{
            rt[name]=false
          }
        }
      }
      else if(this.mode == 'dora'){
        if(this.dora.length==5){
          for(const name in rt){
            rt[name]=true
          }
          return rt
        }
        for(const name in rt){
          if(paiLeft[name]==0){
            rt[name]=true
          }else{
            rt[name]=false
          }
        }
      }
      else if(this.mode == 'ura'){
        if(this.ura.length==5){
          for(const name in rt){
            rt[name]=true
          }
          return rt
        }
        for(const name in rt){
          if(paiLeft[name]==0){
            rt[name]=true
          }else{
            rt[name]=false
          }
        }
      }
      else{
        if(this.furo.length== Math.floor((14-this.hand.length)/3)){
          for(const name in rt){
            rt[name]=true
          }
          return rt
        }
        if(this.mode=="chi"){
          for(const name in rt){
            if(getNumber(name)>7 || getType(name)=='z'){
              rt[name]=true
            }
            else{
              if(paiLeft[name]==0 ||
                paiLeft[next(name)]==0 ||
                paiLeft[next(next(name))]==0){
                rt[name]=true
              }else{
                rt[name]=false
              }
            }
          }
        }
        else if(this.mode=="pon"){
          for(const name in rt){
            if(paiLeft[name]<3){
              rt[name]=true
            }else{
              rt[name]=false
            }
          }
        }
        else{
          for(const name in rt){
            if(paiLeft[name]<4){
              rt[name]=true
            }else{
              rt[name]=false
            }
          }
        }
      }
      return rt;
    },
    isYakuDisable(){
      let stat = {}
      for(const obj of this.yakuName){
        stat[obj.value] = false
      }
      let isMenzen = true
      let haveFuro = false
      let haveKan = false

      for(const b of this.furo){
        haveFuro=true
        if(b.type!='ankan'){
          isMenzen=false
        }
        if(b.type=='kan'||b.type=='ankan'){
          haveKan=true
        }
      }

      if(this.agariWay=='tsumo'){
        stat['chankan']=true
        stat['houte']=true
      }
      if(this.agariWay=='ron'){
        stat['rinnshann']=true
        stat['haite']=true
        stat['tenhou']=true
        stat['chiihou']=true
      }

      if(haveFuro){
        stat['tenhou']=true
        stat['chiihou']=true
      }

      if(!isMenzen){
        stat['riichi']=true
        stat['double-riichi']=true
        stat['ippatsu']=true;
      }

      if(!haveKan){
        stat['rinnshann']=true
      }

      if(this.yakus.includes('riichi')){
        stat['double-riichi']=true
      }
      else if(this.yakus.includes('double-riichi')){
        stat['riichi']=true
      }
      else{
        stat['ippatsu']=true
      }



      if(this.seat=='east'){
        stat['chiihou']=true
      }
      else{
        stat['tenhou']=true
      }

      for(const name in stat){
        if(stat[name]){
          if(this.yakus.includes(name)){
            this.updateYaku(name)
          }
        }
      }

      return stat
    },
    needFu(){
      if(this.result.manType==0)return true;
      if(this.result.manType>=2)return false;
      if(this.result.han==5)return false;
      return true;
    },
    manName(){
      if(this.result.manType==0)return ''
      if(this.result.manType==1)return '满贯'
      if(this.result.manType==2)return '跳满'
      if(this.result.manType==3)return '倍满'
      if(this.result.manType==4)return '三倍满'
      if(this.result.manType==5)return '累计役满'
      return ''
    },
    calculateEnable(){
      return this.hand.length+this.furo.length*3==14
    },
    isTrueAgari(){
      if(this.result.han==0)return 0;

      let hasExceptDora=false;
      for(const name of this.result.yaku){
        if(name.startsWith("宝牌"))continue;
        if(name.startsWith("里宝牌"))continue;
        if(name.startsWith("赤宝牌"))continue;
        if(name.startsWith("红宝牌"))continue;
        console.log(name)
        hasExceptDora = true;
      }
      return hasExceptDora
    }
  }
}
</script>

<style scoped>
  .flex-row{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .flex-col{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  .flex{
    flex:auto
  }
  .flex-row:not(.nospace)>div,.flex-col:not(.nospace)>*{
    margin: 0.1rem;
  }
  .class1{
    width: 16rem;
  }
  .line{
    margin: 0.5rem 0;
  }
  .nowrap{
    flex-wrap: nowrap;
  }
  .number{
    font-size:3.125rem;
  }
  #result{
    padding: 0.3125rem;
    flex:auto;
    border: 0.2rem solid black;
  }
  .box{
    align-items: flex-start;
    border: 0.125rem dashed grey;
    padding: 0.2rem;
    min-height:6.25rem;
    display: flex;
    flex-wrap: wrap;
  }
</style>

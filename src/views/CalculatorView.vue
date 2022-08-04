<template>
  Your Choice {{rule}}

  <div v-for="row in paiName" :key="row" class="flex-row">
      <pai-select v-for="pai in row" :key="pai" 
        :name="pai" @click="add(pai)" :class="{disabled:isDisable[pai]}"></pai-select>
  </div>

  <select v-model="mode">
    <option value="pai">手牌</option>
    <option value="chi">吃</option>
    <option value="pon">碰</option>
    <option value="kan">杠</option>
    <option value="ankan">暗杠</option>
    <option value="dora">宝牌指示牌</option>
    <option value="ura">里宝牌指示牌</option>
  </select>
  <select v-model="agariWay">
    <option value="tsumo">自摸</option>
    <option value="ron">荣和</option>
  </select>
  <select v-model="field">
    <option value="east">东</option>
    <option value="south">南</option>
    <option value="west">西</option>
    <option value="north">北</option>
  </select>
  <select v-model="seat">
    <option value="east">东</option>
    <option value="south">南</option>
    <option value="west">西</option>
    <option value="north">北</option>
  </select>

  <div class="flex-row">
    <div v-for="item in yakuName" :key="item.value">
        <input type="checkbox" v-model="yakus" :id="item.value" 
          :value="item.value" :disabled="isYakuDisable[item.value]">
        <label :for="item.value">{{item.name}}</label>
    </div>
  </div>

  <button class="btn" @click="clearAll()">清空</button>
  <button class="btn" @click="myCalculate()">计算</button>

  <div class="flex-row">
      手牌
      <pai-select v-for="(pai,index) in hand" :key="index" 
        :name="pai" @click="removeSingle(hand,pai)"></pai-select>
  </div>
  <div class="flex-row">
      副露
      <block-select v-for="(item, index) in furo" :key="index"
        :type="item.type" :name="item.name"></block-select>
  </div>
  <div class="flex-row">
      宝牌指示牌 
      <pai-select v-for="(pai,index) in dora" :key="index" 
        :name="pai" @click="removeSingle(dora,pai)"></pai-select>
  </div>
  <div class="flex-row">
      里宝牌指示牌
      <pai-select v-for="(pai,index) in ura" :key="index" 
        :name="pai" @click="removeSingle(ura,pai)"></pai-select>
  </div>

  <div>
    <div v-if="result.pointType==2">{{result.point1}} / {{result.point2}}</div>
    <div v-else-if="result.pointType==0">{{result.point1}} ALL</div>
    <div v-else>{{result.point1}}</div>
    
    <div v-if="!result.isYakuman">{{result.han}}番 {{result.fu}}符</div>
    <div v-else>{{result.han}}倍役满</div>
    
    <ul>
      <li v-for="(name,index) in result.yaku" :key="index">
        {{name}}
      </li>
    </ul>
  </div>
</template>

<script>
import PaiSelect from '../components/PaiSelect.vue'
import BlockSelect from '../components/BlockSelect.vue'
import * as util from '../store/util.js'
import * as calc from '../store/calc'

export default {
  name: 'App',
  components: {
    PaiSelect,
    BlockSelect
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
      result:new calc.Result()
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
        if(x=='east')return calc.EAST;
        if(x=='west')return calc.WEST;
        if(x=='south')return calc.SOUTH;
        if(x=='north')return calc.NORTH;
      }
      function cvtPai(s){
        return new calc.Pai(util.getType(s),util.getNumber(s))
      }
      function cvtFuro(s){
        let open = true
        let localType=calc.TRI
        if(s.type=="ankan")open=false

        if(s.type=="chi")localType = calc.SEQ
        else if(s.type=="pon")localType = calc.TRI
        else localType = calc.QUAD
        return new calc.Block(localType,util.getType(s.name),util.getNumber(s.name),open)
      }
      function cvtYaku(x){
        if(x=="riichi")return calc.RIICHI
        if(x=="double-riichi")return calc.DOUBLE_RIICHI
        if(x=="ippatsu")return calc.IPPATSU
        if(x=="haite")return calc.HAITEI_RAOYUE
        if(x=="houte")return calc.HOUTEI_RAOYUI
        if(x=="rinnshann")return calc.RINNSHANN_KAIHOU
        if(x=="chankan")return calc.CHANKAN
        if(x=="tenhou")return calc.TENHOU
        if(x=="chiihou")return calc.CHIIHOU
      }
      const tAgariWay = this.agariWay=='tsumo'?calc.TSUMO:calc.RON;
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

      let s = new calc.State(
        tField,tSeat,tYaku,tAgariWay,tPai,tBlock,tDora,tUra,tAgariPai,0
      )

      let c = new calc.Calculator()
      this.result = c.calculate(s,this.rule)
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
          paiLeft[util.next(x.name)]--;
          paiLeft[util.next(util.next(x.name))]--;
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
            if(util.getNumber(name)>7 || util.getType(name)=='z'){
              rt[name]=true
            }
            else{
              if(paiLeft[name]==0 ||
                paiLeft[util.next(name)]==0 ||
                paiLeft[util.next(util.next(name))]==0){
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
    }
  }
}
</script>

<style scoped>
  .flex-row{
    display: flex;
    flex-direction: row;
  }
</style>

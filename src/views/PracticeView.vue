<template>
  <div v-if="this.problem!=null">
    <div class="flex-row">
      <pai-select v-for="(name,index) in hand" :key="index" :name="name"/>
      <div class="spacer"></div>
      <pai-select :name="agariPai"/>
      <div class="spacer"></div>
      <block-select v-for="(obj,index) in furo" :key="index"
        :type="obj.type" :name="obj.name" :red="obj.cnt"/>
    </div>
    <div class="flex-row">
      <div class="flex-col">
        <div>宝牌指示牌区</div>
        <div class="flex-row center">
          表
          <pai-select v-for="(name,index) in dora" :key="index" :name="name"/>
        </div>
        <div class="flex-row center">
          里
          <pai-select v-for="(name,index) in ura" :key="index" :name="name"/>
        </div>
        <div>和了情况</div>
        <n-input size="large"
          v-model:value="info" readonly :rows="6"
          type="textarea"
        />
      </div>
      <div class="flex-col flex">
        {{hintText}}
        <n-input size="large" class="flex"
          v-model:value="ans"
          type="textarea"
          :placeholder="placeHolder"
          :class="{readonly:ansReadOnly}"
        />
        <n-button @click="onClick()" size="large">{{btnText}}</n-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {ProblemGenerator} from '@/store/problem'
  import PaiSelect from '@/components/PaiSelect.vue'
  import BlockSelect from '@/components/BlockSelect.vue'
  import { NInput, NButton } from 'naive-ui'
  import {test,CHIIHOU,HOUTEI_RAOYUI,FIELD_WEST,DOUBLE_RIICHI,CHANKAN,HAITEI_RAOYUE,RIICHI,SEAT_NORTH,SEAT_WEST,RON,RINNSHANN_KAIHOU,TENHOU,FIELD_SOUTH,SEAT_EAST,IPPATSU,TSUMO,FIELD_NORTH,FIELD_EAST,SEAT_SOUTH} from '@/store/calc'

  export default{
    name:"PracticeView",
    data(){
      return {
        generator : new ProblemGenerator(this.rule),
        problem:new ProblemGenerator(this.rule).generate() ,
        info: '',
        ans: '',
        hintText:'输入答案',
        btnText:"确认",
        ansReadOnly:false,
      }
    },
    props:{
      rule: Object
    },
    components:{
      PaiSelect,BlockSelect,NInput,NButton
    },
    created(){
      this.newProblem()
    },
    methods:{
      cvtPai(pai){
        let num = pai.num
        let tp = pai.type
        if(pai.redCnt==1)num =0 
        return num+tp
      },
      cvtFuro(b){
        let tp=""
        if(b.bType==0)tp="chi"
        else if(b.bType==1)tp='pon'
        else if(b.bType==2 && b.isOpen)tp='kan'
        else tp='ankan'

        let num = b.num
        let ptp = b.pType

        return {
          type:tp,name:num+ptp,cnt:b.redCnt
        }
      },
      newProblem(){
        // console.log("new problem",this.problem.flag)
        function testFlag(this_,flag,name){
          if(test(this_.problem.flag,flag)){
            this_.info+=name;
          }
        }
        let roundNumber = "一"
        testFlag(this,FIELD_EAST, "东" + roundNumber + "局 ");
        testFlag(this,FIELD_SOUTH, "南" + roundNumber + "局 ");
        testFlag(this,FIELD_WEST, "西" + roundNumber + "局 ");
        testFlag(this,FIELD_NORTH, "北" + roundNumber + "局 ");
        testFlag(this,SEAT_EAST, "东家 ");
        testFlag(this,SEAT_SOUTH, "南家 ");
        testFlag(this,SEAT_WEST, "西家 ");
        testFlag(this,SEAT_NORTH, "北家 ");
        testFlag(this,TSUMO, "自摸\n");
        testFlag(this,RON, "荣和\n");
        testFlag(this,RIICHI, "立直\n");
        testFlag(this,DOUBLE_RIICHI, "双立直\n");
        testFlag(this,IPPATSU, "一发\n");
        testFlag(this,HAITEI_RAOYUE, "海底捞月\n");
        testFlag(this,HOUTEI_RAOYUI, "河底摸鱼\n");
        testFlag(this,RINNSHANN_KAIHOU, "岭上开花\n");
        testFlag(this,CHANKAN, "抢杠\n");
        testFlag(this,TENHOU, "天和\n");
        testFlag(this,CHIIHOU, "地和\n");
      },
      onClick(){
          /*
          答案检测
          答案显示
          */
        if(this.btnText=="确认"){
        console.log(1)
          this.hintText = "答案显示"
          this.ansReadOnly = false
          this.btnText="下一题"
        }
        else{

          this.hintText = "输入答案"
          this.ansReadOnly = true
          this.btnText="确认"
          this.ans=""
          this.problem = this.generator.generate()
          this.newProblem();
        }
      }
    },
    computed:{
      hand(){
        let rt=[]
        for(const x of this.problem.hand){
          if(!x.isAgari){
            rt.push(this.cvtPai(x))
          }
        }
        return rt
      },
      agariPai(){
        return this.cvtPai(this.problem.agariPai);
      },
      furo(){
        let rt=[]
        for(const x of this.problem.furu){
          rt.push(this.cvtFuro(x))
        }
        return rt
      },
      dora(){
        let rt=[]
        for(const x of this.problem.dora){
          rt.push(this.cvtPai(x))
        }
        while(rt.length<5){
          rt.push('B')
        }
        return rt
      },
      ura(){
        let rt=[]
        for(const x of this.problem.ura){
          rt.push(this.cvtPai(x))
        }
        while(rt.length<5){
          rt.push('B')
        }
        return rt
      },
      placeHolder(){
        let pt = this.problem.ans.pointType;
        if(pt==1||pt==3){
            return "荣和：请直接输入点数"
        }
        else if(pt==0){
            return "亲家自摸：请输入收取每人点数"
        }
        else{
            return "子家自摸：请按顺序输入收取子家/亲家点数,中间用空格隔开"
        }
      }
    },
  }
</script>

<style>
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
  .center{
    align-items: center;
  }
  .spacer{
    width: 20px;
  }
</style>
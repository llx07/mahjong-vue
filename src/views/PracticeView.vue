<template>
  <div v-if="this.problem!=null" >
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
        <label>宝牌指示牌区</label>
        <div class="flex-row center">
          <label>表</label>
          <pai-select v-for="(name,index) in dora" :key="index" :name="name"/>
        </div>
        <div class="flex-row center">
          <label>里</label>
          <pai-select v-for="(name,index) in ura" :key="index" :name="name"/>
        </div>
        <label>和了情况</label>
        <n-input size="large"
          v-model:value="info" readonly :rows="6"
          type="textarea"
        />
      </div>
      <div class="flex-col flex">
        <label>{{hintText}}</label>
        <n-input ref="input" v-if="hintText=='输入答案'" size="large" class="flex"
          v-model:value="ans"
          type="textarea"
          :allow-input="(value) => !value || /^[\d ]+$/.test(value)"
          :placeholder="placeHolder"
        />
        <div v-else class="flex" id="ans-div">
          <ul>
            <li v-for="name in yaku" :key="name">{{name}}</li>
          </ul>
          <div v-if="result.includes('符') ">

            符计算内容：
            <ul>
              <li v-for="name in this.problem.ans.fuMessages" :key="name">{{name}}</li>
            </ul>
          </div>

          <div>{{result}}</div>
          <div>{{user[0]}}</div>
          <div>{{user[1]}}</div>

          <div v-if="user[2]" class="correct">答案正确</div>
          <div v-else class="wrong">答案错误</div>
        </div>
        <n-button @click="onClick()" size="large">{{btnText}}</n-button>
      </div>
    </div>
  </div>
</template>

<script>
  import PaiSelect from '@/components/PaiSelect.vue'
  import BlockSelect from '@/components/BlockSelect.vue'
  import { NInput, NButton } from 'naive-ui'

  import {ProblemGenerator} from '@/store/problem'
import { CHIIHOU, HOUTEI_RAOYUI, FIELD_WEST, DOUBLE_RIICHI, CHANKAN, HAITEI_RAOYUE, RIICHI, SEAT_NORTH, SEAT_WEST, RON, RINNSHANN_KAIHOU, TENHOU, FIELD_SOUTH, SEAT_EAST, IPPATSU, TSUMO, FIELD_NORTH, FIELD_EAST, SEAT_SOUTH } from "@/store/types"
  import {test} from '@/store/util'

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
    mounted() {
      //  监听键盘事件
      document.addEventListener('keydown', this.handleKeyDown.bind(null, this));
      this.$refs.input.focus()
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
      handleKeyDown: (vm, e) => {
        if(e.key == "Enter"){
            vm.onClick()
            e.preventDefault()
        }
      },
      onClick(){
          console.log(this)
        if(this.btnText=="确认"){
          this.hintText = "答案显示"
          this.btnText="下一题"
        }
        else{
          this.hintText = "输入答案"
          this.ansReadOnly = true
          this.btnText="确认"
          this.ans=""
          this.problem = this.generator.generate()
          this.info=""
          this.newProblem();
          this.$nextTick(()=>{this.$refs.input.focus()})
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
      },
      yaku(){
        return this.problem.ans.yaku;
      },
      result(){
        const p = this.problem;

        if (p.ans.isYakuman) {
           return(parseInt(p.ans.han) + "倍役满");
        }
        else {
          switch (p.ans.manType) {
            case 0:
             return(
                parseInt(p.ans.han) + "翻 " +
                parseInt(p.ans.fu) + "符");
            case 1:
              if (p.ans.han != 5) {
               return(
                  parseInt(p.ans.han) + "翻 " +
                  parseInt(p.ans.fu) + "符 满贯");
              }
              else {
               return(
                    parseInt(p.ans.han) + "翻 满贯");
              }
            case 2:
               return(parseInt(p.ans.han) +
                                        "翻 跳满");
            case 3:
               return(parseInt(p.ans.han) +
                                        "翻 倍满");
            case 4:
               return(parseInt(p.ans.han) +
                                        "翻 三倍满");
            case 5:
               return(parseInt(p.ans.han) +
                                        "翻 累计役满");
          }
        }
        return "错误"
      },
      user(){
        const s = this.ans;
        let x1=0,x2=0

        const l = s.split(/[;: /]/)
        let lt=[]
        for(const b of l){
            if(b!='')lt.push(b)
        }

        x1 = +lt[0]
        if(lt.length>1)x2=+lt[1]

        let correct = true
        const p = this.problem;
        let rt=[]

        if(p.ans.pointType == 1 || p.ans.pointType==3){
          rt.push(`您输入的答案为: ${x1}\n`)
          rt.push(`正确答案: ${p.ans.point1}\n`)
          if(x1!=p.ans.point1)correct=false
        }
        else if(p.ans.pointType == 0){
          rt.push(`您输入的答案为: ${x1} ALL\n`)
          rt.push(`正确答案: ${p.ans.point1}ALL\n`)
          if(x1!=p.ans.point1)correct=false
        }
        else{
          rt.push(`您输入的答案为: ${x1}/${x2}\n`)
          rt.push(`正确答案: ${p.ans.point1}/${p.ans.point2}\n`)
          if(x1!=p.ans.point1 || x2!=p.ans.point2)correct=false
        }
        rt.push(correct)
        return rt
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
    flex:auto;
    margin: 2px;
  }
  .center{
    align-items: center;
  }
  .spacer{
    width: 1rem;
  }

  .correct{
    color: #0f0;
    font-size: 2rem;
  }
  .wrong{
    color: red;
    font-size: 2rem;
  }

  #ans-div{
    padding: 0.3rem;
    border: 0.1rem solid lightgray;
    border-radius: 0.2rem;
    overflow: auto;
  }

</style>
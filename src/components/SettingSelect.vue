<template>

  <div id="modal-root">
    <button-group label="食断" :values='["有","无"]' @change="set1"/>
    <button-group label="多倍役满" :values='["有","无"]' @change="set2"/>
    <button-group label="复合役满" :values='["有","无"]' @change="set3"/>
    <button-group label="连风雀头" :values='["2符","4符"]' @change="set4" :init="1"/>
    <button-group label="13番以上" :values='["累计役满","三倍满"]' @change="set5"/>
  </div>
</template>

<script>
  import { Rule } from '@/store/calc'
  import ButtonGroup from './ButtonGroup.vue'
  export default{
    name:"SettingSelect",
    components:{
      ButtonGroup
    },
    emits:[
      "update","close"
    ],
    data(){
      return{
        rule: new Rule()
      }
    },
    methods:{
      set1(x){
        this.$emit('update',this.rule)
        this.rule.shiDuan = !x;
      },
      set2(x){
        this.$emit('update',this.rule)
        this.rule.duoBeiYiMan = !x;
      },
      set3(x){
        this.$emit('update',this.rule)
        this.rule.fuHeYiMan = !x;
      },
      set4(x){
        this.$emit('update',this.rule)
        this.rule.lianFeng4 = !!x;
      },
      set5(x){
        this.$emit('update',this.rule)
        this.rule.allowLeiMan= !!x;
      },
    }
  }
</script>

<style scoped>
  #modal-root{
    padding: 50px;
    display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    background-color: linen;
    z-index: 10;
    transform: translate(-50%,-50%);
  }
</style>
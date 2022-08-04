<template>

  <div id="modal-root">
    <button-group label="食断" :values='["有","无"]' v-model="i1"/>
    <button-group label="多倍役满" :values='["有","无"]' v-model="i2"/>
    <button-group label="复合役满" :values='["有","无"]' v-model="i3"/>
    <button-group label="连风雀头" :values='["2符","4符"]' v-model="i4"/>
    <button-group label="13番以上" :values='["累计役满","三倍满"]' v-model="i5"/>
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
      "update:modelValue",
    ],
    props:{
      modelValue:{
        type:[Object,Rule],
        default: new Rule()
      }
    },
    data(){
      return{
        ruleLocal: this.modelValue,
        i1: + !this.modelValue.shiDuan,
        i2: + !this.modelValue.duoBeiYiMan,
        i3: + !this.modelValue.fuHeYiMan,
        i4: + this.modelValue.lianFeng4,
        i5: + this.modelValue.allowLeiMan,
      }
    },
    computed:{
      ruleChange(){
        return [this.i1,this.i2,this.i3,this.i4,this.i5]
      }
    },
    methods:{
      updateData(){
        this.ruleLocal.shiDuan=!this.i1
        this.ruleLocal.duoBeiYiMan=!this.i2
        this.ruleLocal.fuHeYiMan=!this.i3
        this.ruleLocal.lianFeng4=!!this.i4
        this.ruleLocal.allowLeiMan=!!this.i5
        this.$emit('update:modelValue',this.ruleLocal)
        localStorage.setItem("rule",JSON.stringify(this.ruleLocal))
      },
    },
    watch:{
      ruleChange(){
        this.updateData()
      }
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
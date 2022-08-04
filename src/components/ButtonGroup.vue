<template>
  <div class="flex-row">
    <div>{{label}}</div>
    <button v-for="(value,index) in values" :key="index" @click="changeIndex(index)"
      :class="{now:now==index}">{{value}}</button>
  </div>
</template>

<script>
  export default{
    name:"ButtonTwo",
    emits:[
      "update:modelValue"
    ],
    props:{
      values:{
        type:Array,
        required:true,
      },
      label:String,
      modelValue:Number
    },
    data(){
      return{
        now:this.modelValue
      }
    },
    methods:{
      changeIndex(index){
        this.now=index
        this.$emit('update:modelValue',index)
      }
    }
  }
</script>

<style scoped>
  .flex-row{
    display: flex;
    flex-direction: row;
  }

  .now{
    background-color: red;
  }
</style>
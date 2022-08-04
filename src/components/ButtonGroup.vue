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
      "change"
    ],
    props:{
      values:{
        type:Array,
        required:true,
      },
      label:String,
      init:{
        type: Number,
        default:0,
      }
    },
    data(){
      return{
        now:this.init
      }
    },
    methods:{
      changeIndex(index){
        this.now=index
        this.$emit('change',index)
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
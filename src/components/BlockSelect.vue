<template>
  <div v-if="type=='pon'" class="flex-row">
    <pai-select :name='"H"+name'></pai-select>
    <pai-select :name="name"></pai-select>
    <pai-select :name="name"></pai-select>
  </div>
  <div v-else-if="type=='chi'" class="flex-row">
    <pai-select :name='"H"+name'></pai-select>
    <pai-select :name='next(name)'></pai-select>
    <pai-select :name='next(next(name))'></pai-select>
  </div>
  <div v-else-if="type=='kan'" class="flex-row">
    <pai-select :name='"H"+name'></pai-select>
    <pai-select :name="name"></pai-select>
    <pai-select :name="name"></pai-select>
    <pai-select :name="name"></pai-select>
  </div>
  <div v-else-if="type=='ankan'" class="flex-row"> 
    <pai-select name="B"></pai-select>
    <pai-select :name="name"></pai-select>
    <pai-select :name="name"></pai-select>
    <pai-select name="B"></pai-select>
  </div>
</template>

<script>
  import PaiSelect from './PaiSelect.vue'

  export default{
    name:"BlockSelect",
    components: {
      PaiSelect,
    },
    methods:{
      next(name){
        return (parseInt(name[0])+1)+name[1]
      }
    },
    props:{
      type:String,
      name:String
    },
  }
</script>

<style scoped>
  .flex-row{
    display: flex;
    flex-direction: row;
    align-items: flex-end;
  }
</style>
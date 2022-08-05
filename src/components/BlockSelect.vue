<template>
  <div class="flex-row">
    <pai-select v-for='(name,index) in hands' :key="index" :name="name"></pai-select>
  </div>
<!-- 
  <div v-if="type=='pon'" class="flex-row">
    <pai-select :name='"H"+cvt(name)'></pai-select>
    <pai-select :name="cvt(name)"></pai-select>
    <pai-select :name="cvt(name)"></pai-select>
  </div>
  <div v-else-if="type=='chi'" class="flex-row">
    <pai-select :name='"H"+cvt(name)'></pai-select>
    <pai-select :name='cvt(next(name))'></pai-select>
    <pai-select :name='cvt(next(next(name)))'></pai-select>
  </div>
  <div v-else-if="type=='kan'" class="flex-row">
    <pai-select :name='"H"+cvt(name)'></pai-select>
    <pai-select :name="cvt(name)"></pai-select>
    <pai-select :name="cvt(name)"></pai-select>
    <pai-select :name="cvt(name)"></pai-select>
  </div>
  <div v-else-if="type=='ankan'" class="flex-row"> 
    <pai-select name="B"></pai-select>
    <pai-select :name="cvt(name)"></pai-select>
    <pai-select :name="cvt(name)"></pai-select>
    <pai-select name="B"></pai-select>
  </div> -->
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
      },
    },
    computed:{
      hands(){
        let rt = []
        let redLeft = this.red;

        function getPai(name){
          // console.log(redLeft, "red(s)", "name: ",name, "num:",+name[0],'isFive:',+name[0]==5)
          // console.log("need convert:",+name[0]==5 && this.redCount>0)
          if(+name[0]==5 && redLeft>0){
            // console.log("start convert, will be",'0'+name[1],'the type=',name[1])
            redLeft--
            return '0'+name[1];
          }
          return name;
        }


        if(this.type=='pon'){
          rt.push("H"+getPai(this.name))
          for(let i=0;i<2;i++)rt.push(getPai(this.name))
        }
        else if(this.type=='kan'){
          rt.push("H"+getPai(this.name))
          for(let i=0;i<3;i++)rt.push(getPai(this.name))
        }
        else if(this.type=='ankan'){
          rt.push('B')
          for(let i=0;i<2;i++)rt.push(getPai(this.name))
          rt.push('B')
        }
        else if(this.type=='chi'){
          let nm = this.name
          rt.push("H"+getPai(this.name))
          for(let i=0;i<2;i++){
            nm = this.next(nm)
            rt.push(getPai(nm))
          }
        }
        // console.log("hand returns",rt)
        return rt
      }
    },
    props:{
      type:String,
      name:String,
      red:{
        type:Number,
        default:0
      }
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
<template>
  <img :src='require("../assets/"+name+".webp")' :class='{horiz:name[0]=="H"}'/>
</template>

<script>

  export default{
    name:"PaiSelect",
    props:{
      name:String
    },
  }
</script>

<style scoped>
  img{
    height: 100px ;
    display:block;
    cursor: pointer;
  }

  .horiz{
    width: 100px;
    height: auto;
  }

  .disabled{
    cursor:not-allowed;
    opacity: 0.5;
  }
</style>
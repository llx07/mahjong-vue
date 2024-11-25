// 获得一张牌的数字部分
export function getNumber(name:string){
  return parseInt(name[0])
}
// 获得一张牌的类型部分
export function getType(name:string){
  return name[1]
}
// 一张牌数字直接加一得到的牌
export function next(name:string){
  return (parseInt(name[0])+1)+name[1]
}
export function pType2Int(pType:string){
  if(pType=='s')return 0
  if(pType=='p')return 1
  if(pType=='m')return 2
  if(pType=='z')return 3
  return -1
}

// 打乱一个序列
export function shuffle(arr: any[]){
  let len = arr.length;
  let rand;
  let temp;
  while (len > 1) {
      len--;
      rand = Math.floor(Math.random() * len);
      temp = arr[len];
      arr[len] = arr[rand];
      arr[rand] = temp;
  }
  return arr;
}

// [min, max) 范围内随机整数
export function randInt(min:number, max:number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}
// [min, max) 范围内随机整数
export function choose(array:any[]) {
  return array[randInt(0,array.length)]
}


// 测试是否含有某一位
export function test(flag:number,value:number){
  return (flag&value) == value
}
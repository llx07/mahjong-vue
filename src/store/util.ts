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

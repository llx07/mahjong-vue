import { PointType, ManType } from "./types"


export class Rule{ // 可选的规则
    shiDuan:number
    duoBeiYiMan:number
    fuHeYiMan:number
    lianFeng4:number
    allowLeiMan:number
    constructor(){
        this.shiDuan = 1;
        this.duoBeiYiMan = 1;
        this.fuHeYiMan = 1;
        this.lianFeng4 = 1;
        this.allowLeiMan = 1;
    }
}


export class Result{ // 计算结果
    han: number
    fu: number
    fuMessages: string[]
    point1: number
    point2: number
    pointType: PointType
    yaku: string[] 
    isYakuman: boolean
    manType: ManType
    constructor(){
        this.han=0
        this.fu=0
        this.fuMessages = []
        this.point1=0
        this.point2=0
        this.pointType=PointType.OYATSUMO
        this.yaku=[]
        this.isYakuman = false
        this.manType = ManType.NOMANGAN
    }
}

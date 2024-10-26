import { test } from "./util"


export const NOMI = 0
export const FIELD_EAST = 1 << 0
export const FIELD_SOUTH = 1 << 1
export const FIELD_WEST = 1 << 2
export const FIELD_NORTH = 1 << 3
export const SEAT_EAST = 1 << 4
export const SEAT_SOUTH = 1 << 5
export const SEAT_WEST = 1 << 6
export const SEAT_NORTH = 1 << 7
export const HAITEI_RAOYUE = 1 << 8
export const HOUTEI_RAOYUI = 1 << 9
export const TENHOU = 1 << 10
export const CHIIHOU = 1 << 11
export const RINNSHANN_KAIHOU = 1 << 12
export const CHANKAN = 1 << 13
export const RIICHI = 1 << 14
export const DOUBLE_RIICHI = 1 << 15
export const IPPATSU = 1 << 16
export const TSUMO = 1 << 17
export const RON = 1 << 18
export const MENZEN = 1 << 19

export enum BlockType{
    SEQ, TRI, QUAD
}
export enum PositionType{  // 方位 （场风，自风）
    EAST, SOUTH, WEST, NORTH, EMPTY
}
export enum MachiType{
    LIANG_MIAN, KAN_ZHANG, BIAN_ZHANG, SHUANG_PENG, DAN_QI
}




export type PaiType = 'm'|'s'|'p'|'z';
export type PaiNum = number;

export class Pai{
    type: PaiType  // 类型
    num: PaiNum // 数字
    isAgari: boolean // 是否是和牌
    isRed: boolean // 是否是赤宝牌
    redCnt: number

    constructor(type:PaiType, num:PaiNum){
        this.type = type;
        this.num = num;
        this.isAgari = false;
        this.isRed = false;
        this.redCnt = 0;
    }
    toString(){
        return this.type+this.num;
    }
    isYao(){
        if(this.type=='z')return true;
        if(this.num==1 || this.num==9)return true;
        return false
    }
    isRyu(){
        if(this.type=='z'){
            return this.num==6
        }
        if(this.type=='s'){
            return [2,3,4,6,8].includes(this.num)
        }
        return false
    }
    isYakuhai(flag: number){
        if(this.type != 'z')return 0;
        let cnt = 0;
        switch (this.num) {
            case 1:
                if(test(flag,FIELD_EAST))cnt++;
                if(test(flag,SEAT_EAST))cnt++;
                break;
            case 2:
                if(test(flag,FIELD_SOUTH))cnt++;
                if(test(flag,SEAT_SOUTH))cnt++;
                break;
            case 3:
                if(test(flag,FIELD_WEST))cnt++;
                if(test(flag,SEAT_WEST))cnt++;
                break;
            case 4:
                if(test(flag,FIELD_NORTH))cnt++;
                if(test(flag,SEAT_NORTH))cnt++;
                break;
            case 5:
                cnt++;
                break;
            case 6:
                cnt++;
                break;
            case 7:
                cnt++;
                break;
            default:
                break;
        }
        return cnt
    }
    next(){
        const b = new Pai(this.type,this.num)
        b.num++
        if(b.type=='z'){
            if(b.num==5)b.num=1 //原来是4->1
            if(b.num==8)b.num=5 //原来是7->5
        }else{
            if(b.num==10)b.num=1
        }
        return b
    }
    equalTo(other: Pai){
        return this.type==other.type&&
                this.num==other.num
    }
}
export class Block{ // 面子
    bType:BlockType
    pType:PaiType
    num:PaiNum
    isOpen:boolean
    redCnt: number
    constructor(bType:BlockType,pType:PaiType,num:PaiNum,isOpen:boolean){
        this.bType = bType
        this.pType = pType
        this.num  = num
        this.isOpen = isOpen
        this.redCnt = 0;
    }
    consistYao(){ // 是否含有幺九牌
        if(this.pType=='z')return true; // 字牌类型
        if(this.bType==BlockType.SEQ){ // 顺子
            if(this.num ==1 || this.num==7)return true; // 123 或者 789
        }else{ // 刻字
            if(this.num ==1 || this.num==9)return true; // 111(1) 或者 999(9)
        }
        return false
    }
    consistYakuhai(flag:number){
        if(this.pType != 'z')return 0;
        let cnt = 0;
        switch (this.num) {
            case 1:
                if(test(flag,FIELD_EAST))cnt++;
                if(test(flag,SEAT_EAST))cnt++;
                break;
            case 2:
                if(test(flag,FIELD_SOUTH))cnt++;
                if(test(flag,SEAT_SOUTH))cnt++;
                break;
            case 3:
                if(test(flag,FIELD_WEST))cnt++;
                if(test(flag,SEAT_WEST))cnt++;
                break;
            case 4:
                if(test(flag,FIELD_NORTH))cnt++;
                if(test(flag,SEAT_NORTH))cnt++;
                break;
            case 5:
                cnt++;
                break;
            case 6:
                cnt++;
                break;
            case 7:
                cnt++;
                break;
            default:
                break;
        }
        return cnt
    }
    fromPais(pais:Pai[],isOpen:boolean){
        pais.sort()
        if(pais[0]==pais[1]){
            return new Block(pais.length==3?BlockType.TRI:BlockType.QUAD,
                pais[0].type,pais[0].num,isOpen)
        }
        return new Block(BlockType.SEQ,
            pais[0].type,pais[0].num,isOpen)
    }
    getPai(){
        const rt=[]
        switch (this.bType) {
            case BlockType.SEQ:
                for(let i = this.num;i<this.num+3;i++){
                    rt.push(new Pai(this.pType,i))
                }
                break;
            case BlockType.TRI:
                for(let i = this.num;i<this.num+3;i++){
                    rt.push(new Pai(this.pType,this.num))
                }
                break;
            case BlockType.QUAD:
                for(let i = this.num;i<this.num+4;i++){
                    rt.push(new Pai(this.pType,this.num))
                }
                break;
        
            default:
                break;
        }
        return rt;
    }
    equalTo(other: Block){
        return (this.bType==other.bType &&
                this.pType==other.pType &&
                this.num  ==other.num)
    }
}
export class Pair{ // 雀头
    type: PaiType
    num: PaiNum
    constructor(type:PaiType,num:PaiNum){
        this.type=type
        this.num=num
    }
    getPai(){
        const rt=[]
        rt.push(new Pai(this.type,this.num))
        rt.push(new Pai(this.type,this.num))
        return rt
    }
    consistYao(){
        return this.getPai()[0].isYao()
    }
}
export class HandSet{ // 和牌型
    blocks: Block[]
    pair: Pair
    dora: Pai[] // 宝牌指示牌
    ura: Pai[] // 里宝牌指示牌
    type: MachiType // 听牌类型
    flag: number
    agariPai: Pai
    redCnt: number
    constructor(blocks:Block[],pair:Pair,dora:Pai[],ura:Pai[],type:MachiType,flag:number,agariPai:Pai,redCnt:number){
        this.blocks=blocks
        this.pair=pair
        this.dora=dora
        this.ura=ura
        this.type=type
        this.flag=flag
        this.agariPai=agariPai
        this.redCnt=redCnt
    }       
}
export class State{
    flag: number
    furu: Block[]
    pais: Pai[]
    dora: Pai[]
    ura: Pai[]
    agariPai: Pai
    redCnt: number

    constructor(field:PositionType,seat:PositionType, // 场风和自风
            yakus:number[],agariWay:number, // 役和和牌方式（用于计算flag)
            pais:Pai[],furu:Block[],d:Pai[],u:Pai[],agariPai:Pai,redCnt:number){
        this.flag = 0;
        if(field!=PositionType.EMPTY){
            this.flag |= (1<<field)
        }
        if(seat!=PositionType.EMPTY){
            this.flag |= (1<<(seat+4))
        }

        for(const yaku of yakus){
            this.flag |= yaku
        }
        this.flag |= agariWay

        this.furu = furu
        let menzen = true
        for(const b of furu){
            if(b.isOpen){
                menzen = false;
                break;
            }
        }
        if(menzen){
            this.flag |= MENZEN
        }

        this.pais = pais
        this.dora = d
        this.ura = u
        this.agariPai = agariPai
        this.agariPai.isAgari = true

        this.redCnt = redCnt
    }
}

export enum PointType{ // 和牌点数类型
    TSUMO = 0, RON = 1, OYA = 0, KO = 2,
    OYATSUMO = OYA | TSUMO,
    OYARON = OYA | RON,
    KOTSUMO = KO | TSUMO,
    KORON = KO | RON,
}
export enum ManType{ // 点数 X满 类型
    NOMANGAN,MANGAN,HANEMAN,BAIMAN,SANBAIMAN,KAZOEYAKUMAN
}

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

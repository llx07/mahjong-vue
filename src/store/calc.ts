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

export const SEQ = 0;
export const TRI = 1;
export const QUAD = 2;

export const EAST = 0;
export const SOUTH = 1;
export const WEST = 2;
export const NORTH = 3;
export const EMPTY_WIND = 4;

export const LIANG_MIAN = 0;
export const KAN_ZHANG = 1
export const BIAN_ZHANG = 2;
export const SHUANG_PENG = 3;
export const DAN_QI = 4;


export function test(flag,value){
    return (flag&value) == value
}
function pType2Int(pType){
    if(pType=='s')return 0
    if(pType=='p')return 1
    if(pType=='m')return 2
    if(pType=='z')return 3
    return -1
}
export class Pai{
    constructor(type,num){
        this.type = type
        this.num=num
        this.isAgari=false
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
    isYakuhai(flag){
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
        const b = new Pai(this.type,this.num,this.isRed)
        b.num++
        if(b.type=='z'){
            if(b.num==5)b.num=1 //原来是4->1
            if(b.num==8)b.num=5 //原来是7->5
        }else{
            if(b.num==10)b.num=1
        }
        return b
    }
    equalTo(other){
        return this.type==other.type&&
                this.num==other.num
    }
}
export class Block{
    constructor(bType,pType,num,isOpen){
        this.bType = bType
        this.pType = pType
        this.num  = num
        this.isOpen = isOpen
    }
    consistYao(){
        if(this.pType=='z')return true;
        if(this.bType==SEQ){
            if(this.num ==1 || this.num==7)return true;
        }else{
            if(this.num ==1 || this.num==9)return true;
        }
        return false
    }
    consistYakuhai(flag){
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
    fromPais(pais,isOpen){
        pais.sort()
        if(pais[0]==pais[1]){
            return new Block(pais.length==3?TRI:QUAD,
                pais[0].type,pais[0].num,isOpen)
        }
        return new Block(SEQ,
            pais[0].type,pais[0].num,isOpen)
    }
    getPai(){
        const rt=[]
        switch (this.bType) {
            case SEQ:
                for(let i = this.num;i<this.num+3;i++){
                    rt.push(new Pai(this.pType,i))
                }
                break;
            case TRI:
                for(let i = this.num;i<this.num+3;i++){
                    rt.push(new Pai(this.pType,this.num))
                }
                break;
            case QUAD:
                for(let i = this.num;i<this.num+4;i++){
                    rt.push(new Pai(this.pType,this.num))
                }
                break;
        
            default:
                break;
        }
        return rt;
    }
    equalTo(other){
        return (this.bType==other.bType &&
                this.pType==other.pType &&
                this.num  ==other.num)
    }
}
class Pair{
    constructor(type,num){
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
class HandSet{
    constructor(blocks,pair,dora,ura,type,flag,agariPai,redCnt){
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
    constructor(field,seat,yakus,agariWay,p,furu,d,u,agariPai,redCnt){
        this.flag = 0;
        if(field!=EMPTY_WIND){
            this.flag |= (1<<field)
        }
        if(seat!=EMPTY_WIND){
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

        this.pais = p
        this.dora = d
        this.ura = u
        this.agariPai = agariPai
        this.agariPai.isAgari = true

        this.redCnt = redCnt
    }
}

class MenzenTsumo{
    test(handSet){
        if(test(handSet.flag,MENZEN|TSUMO)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "门前清自摸和"
    }
}
class TanYao{
    test(handSet, rule){
        if(!rule.shiDuan)
            if(!test(handSet.flag,MENZEN))return 0
        
        for(const b of handSet.blocks){
            if(b.consistYao()){
                return 0;
            }
        }
        if(handSet.pair.consistYao())return 0;
        return 1;
    }
    getName(){
        return "断幺九"
    }
}
class YakuhaiFieldEast{
    test(handSet){
        if(test(handSet.flag,FIELD_EAST)){
            for(const b of handSet.blocks){
                if(b.pType=='z'&&b.num==1){
                    return 1;
                }
            }
        }
        return 0;
    }
    getName(){
        return "场风牌 - 东"
    }
}
class YakuhaiFieldSouth{
    test(handSet){
        if(test(handSet.flag,FIELD_SOUTH)){
            for(const b of handSet.blocks){
                if(b.pType=='z'&&b.num==2){
                    return 1;
                }
            }
        }
        return 0;
    }
    getName(){
        return "场风牌 - 南"
    }
}
class YakuhaiFieldWest{
    test(handSet){
        if(test(handSet.flag,FIELD_WEST)){
            for(const b of handSet.blocks){
                if(b.pType=='z'&&b.num==3){
                    return 1;
                }
            }
        }
        return 0;
    }
    getName(){
        return "场风牌 - 西"
    }
}
class YakuhaiFieldNorth{
    test(handSet){
        if(test(handSet.flag,FIELD_NORTH)){
            for(const b of handSet.blocks){
                if(b.pType=='z'&&b.num==4){
                    return 1;
                }
            }
        }
        return 0;
    }
    getName(){
        return "场风牌 - 北"
    }
}
class YakuhaiSeatEast{
    test(handSet){
        if(test(handSet.flag,SEAT_EAST)){
            for(const b of handSet.blocks){
                if(b.pType=='z'&&b.num==1){
                    return 1;
                }
            }
        }
        return 0;
    }
    getName(){
        return "自风牌 - 东"
    }
}
class YakuhaiSeatSouth{
    test(handSet){
        if(test(handSet.flag,SEAT_SOUTH)){
            for(const b of handSet.blocks){
                if(b.pType=='z'&&b.num==2){
                    return 1;
                }
            }
        }
        return 0;
    }
    getName(){
        return "自风牌 - 南"
    }
}
class YakuhaiSeatWest{
    test(handSet){
        if(test(handSet.flag,SEAT_WEST)){
            for(const b of handSet.blocks){
                if(b.pType=='z'&&b.num==3){
                    return 1;
                }
            }
        }
        return 0;
    }
    getName(){
        return "自风牌 - 西"
    }
}
class YakuhaiSeatNorth{
    test(handSet){
        if(test(handSet.flag,SEAT_NORTH)){
            for(const b of handSet.blocks){
                if(b.pType=='z'&&b.num==4){
                    return 1;
                }
            }
        }
        return 0;
    }
    getName(){
        return "自风牌 - 北"
    }
}
class YakuhaiHako{
    test(handSet){
        for(const b of handSet.blocks){
            if(b.pType=='z'&&b.num==5){
                return 1;
            }
        }
        return 0;
    }
    getName(){
        return "役牌 - 白"
    }
}
class YakuhaiHatsu{
    test(handSet){
        for(const b of handSet.blocks){
            if(b.pType=='z'&&b.num==6){
                return 1;
            }
        }
        return 0;
    }
    getName(){
        return "役牌 - 发"
    }
}
class YakuhaiCyuu{
    test(handSet){
        for(const b of handSet.blocks){
            if(b.pType=='z'&&b.num==7){
                return 1;
            }
        }
        return 0;
    }
    getName(){
        return "役牌 - 中"
    }
}
class ChanKan{
    test(handSet){
        if(test(handSet.flag,CHANKAN)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "抢杠"
    }
}
class RinshanKaihou{
    test(handSet){
        if(test(handSet.flag,RINNSHANN_KAIHOU)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "岭上开花"
    }
}
class HaiteiRaoyue{
    test(handSet){
        if(test(handSet.flag,HAITEI_RAOYUE)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "海底捞月"
    }
}
class HouteiRaoyui{
    test(handSet){
        if(test(handSet.flag,HOUTEI_RAOYUI)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "河底摸鱼"
    }
}
class Riichi{
    test(handSet){
        if(!test(handSet.flag,MENZEN))return 0;
        if(test(handSet.flag,RIICHI)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "立直"
    }
}
class Iipeikou{
    test(handSet){
        if(!test(handSet.flag,MENZEN))return 0;
        const localBlocks = handSet.blocks.slice(0)
        for(let i=0;i<4;i++){
            for(let j=i+1;j<4;j++){
                const b1 = localBlocks[i]
                const b2 = localBlocks[j]
                if(b1.equalTo(b2) && b1.bType == SEQ){
                    localBlocks.splice(j,1)
                    localBlocks.splice(i,1)
                    if(!localBlocks[0].equalTo(localBlocks[1])){
                        return 1
                    }
                    else{
                        return 0
                    }
                }
            }
        }
        return 0
    }
    getName(){
        return "一杯口"
    }
}
class Pinfu{
    test(handSet){
        if(!test(handSet.flag,MENZEN))return 0;
        if(handSet.pair.getPai()[0].isYakuhai(handSet.flag))
            return 0;
        for(const b of handSet.blocks){
            if(b.bType != SEQ)return 0;
        }
        if(handSet.type != LIANG_MIAN)return 0;
        return 1;
    }
    getName(){
        return "平和"
    }
}
class Ippatsu{
    test(handSet){
        if(!test(handSet.flag,MENZEN))return 0;
        if(test(handSet.flag,IPPATSU))return 1;
        return 0;
    }
    getName(){
        return "一发"
    }
}
class Dora{
    test(handSet){
        let cnt = 0 
        const dora = handSet.dora
        let x = []
        for(const b of handSet.blocks){
            for(const p of b.getPai()){
                x = x.concat(p)
                for(const p2 of dora){
                    if(p2.next().equalTo(p)){
                        cnt ++;
                    }
                }
            }
        }
        for(const p of dora){
            x = x.concat(p)
            if(p.next().equalTo(handSet.pair.getPai()[0])){
                cnt+=2
            }
        }
        return cnt
    }
    getName(){
        return "宝牌"
    }
}
class Ura{
    test(handSet){
        let cnt = 0 
        const ura = handSet.ura
        for(const b of handSet.blocks){
            for(const p of b.getPai()){
                for(const p2 of ura){
                    if(p2.next().equalTo(p)){
                        cnt ++;
                    }
                }
            }
        }
        for(const p of ura){
            if(p.next().equalTo(handSet.pair.getPai()[0])){
                cnt+=2
            }
        }
        return cnt
    }
    getName(){
        return "里宝牌"
    }
}
class AkaDora{
    test(handSet){
        return handSet.redCnt
    }
    getName(){
        return "赤宝牌"
    }
}
class Toitoi{
    test(handSet){
        for(const b of handSet.blocks){
            if(b.bType == SEQ)return 0
        }
        return 2
    }
    getName(){
        return "对对和"
    }
}
class Sanankou{
    test(handSet){
        let cnt  = 0
        for(const b of handSet.blocks){
            if(b.bType != SEQ && !b.isOpen)cnt++
        }
        if(cnt==3)return 2
        return 0
    }
    getName(){
        return "三暗刻"
    }
}
class SanshokuDoukou{
    test(handSet){
        const cnt = [0,0,0,0,0,0,0,0,0,0,0,0,0]
        for(const b of handSet.blocks){
            if(b.bType!=SEQ){
                cnt[b.num] |= (1<<pType2Int(b.pType))
                if(cnt[b.num]==7)
                    return 2;
            }
        }
        return 0
    }
    getName(){
        return "三色同刻"
    }
}
class Sankantsu{
    test(handSet){
        let cnt  = 0
        for(const b of handSet.blocks){
            if(b.bType == QUAD)cnt++
        }
        if(cnt==3)return 2
        return 0
    }
    getName(){
        return "三杠子"
    }
}
class Shousangen{
    test(handSet){
        let cnt = 0;
        for(const b of handSet.blocks){
            if(b.pType=='z' && 5 <= b.num && b.num<=7){
                cnt++
            }
        }
        if(cnt==2 && handSet.pair.type=='z'&&
            5<=handSet.pair.num && handSet.pair.num<=7)
            return 2
        return 0
    }
    getName(){
        return "小三元"
    }
}
class Honroutou{
    test(handSet){
        let haveZi = false
        for(const b of handSet.blocks){
            if(b.bType == SEQ ||!b.getPai()[0].isYao())
                return 0
            if(b.pType=='z')haveZi = true
        }
        if(handSet.pair.type=='z')haveZi=true
        if(handSet.pair.getPai()[0].isYao() && haveZi)return 2
        return 0
    }
    getName(){
        return "混老头"
    }
}
class DoubleRiichi{
    test(handSet){
        if(!test(handSet.flag,MENZEN))return 0;
        if(test(handSet.flag,DOUBLE_RIICHI)){
            return 2
        }
        return 0
    }
    getName(){
        return "双立直"
    }
}
class SanshokuDoujun{
    test(handSet){
        let value = 2
        if(!test(handSet.flag,MENZEN))value--;
        const cnt = [0,0,0,0,0,0,0,0,0,0,0,0,0]
        for(const b of handSet.blocks){
            if(b.bType==SEQ){
                cnt[b.num] |= (1<<pType2Int(b.pType))
                if(cnt[b.num]==7)
                    return value;
            }
        }
        return 0
    }
    getName(){
        return "三色同顺"
    }
}
class Ikkitsuukan{
    test(handSet){
        let value = 2
        if(!test(handSet.flag,MENZEN))value--

        const cnt = [0,0,0,0,0]
        for(const b of handSet.blocks){
            if(b.bType != SEQ)continue
            if(b.num==1){
                cnt[pType2Int(b.pType)] |= 1
                if(cnt[pType2Int(b.pType)]==7)return value
            }
            if(b.num==4){
                cnt[pType2Int(b.pType)] |= 2
                if(cnt[pType2Int(b.pType)]==7)return value
            }
            if(b.num==7){
                cnt[pType2Int(b.pType)] |= 4
                if(cnt[pType2Int(b.pType)]==7)return value
            }
        }
        return 0
    }
    getName(){
        return "一气通贯"
    }
}
class Chantaiyao{
    test(handSet){
        let value = 2
        if(!test(handSet.flag,MENZEN))value--

        let haveZi = false
        let haveSeq = false
        for(const b of handSet.blocks){
            if(b.bType == SEQ){
                haveSeq = true
            }
            if(b.pType == 'z'){
                haveZi = true
            }
            if(!b.consistYao())return 0
        }
        if(handSet.pair.type=='z')haveZi=true
        if(!handSet.pair.consistYao())return 0
        if(!haveZi || !haveSeq)return 0;
        return value
    }
    getName(){
        return "混全带幺九"
    }
}
class Honiisou{
    test(handSet){
        let value = 3
        if(!test(handSet.flag,MENZEN))value--
        const contain = [0,0,0,0]
        for(const b of handSet.blocks){
            contain[pType2Int(b.pType)]=1
        }
        contain[pType2Int(handSet.pair.type)]=1

        const x = contain[0] + contain[1] + contain[2]
        if(x==1 && contain[pType2Int('z')])return value
        return 0
    }
    getName(){
        return "混一色"
    }
}
class Junchantaiyao{
    test(handSet){
        let value = 3
        if(!test(handSet.flag,MENZEN))value--

        let haveZi = false
        let haveSeq = false
        for(const b of handSet.blocks){
            if(b.bType == SEQ){
                haveSeq = true
            }
            if(b.pType == 'z'){
                haveZi = true
            }
            if(!b.consistYao())return 0
        }
        if(handSet.pair.type=='z')haveZi=true

        if(!handSet.pair.consistYao())return 0
        if(haveZi || !haveSeq)return 0;
        return value
    }
    getName(){
        return "纯全带幺九"
    }
}
class Ryanpeikou{
    test(handSet){
        if(!test(handSet.flag,MENZEN))return 0;

        const localBlocks = handSet.blocks.slice(0)
        
        for(let i=0;i<4;i++){
            for(let j=i+1;j<4;j++){
                const b1 = localBlocks[i]
                const b2 = localBlocks[j]
                if(b1.equalTo(b2) && b1.bType == SEQ){
                    localBlocks.splice(j,1)
                    localBlocks.splice(i,1)
                    if(localBlocks[0].equalTo(localBlocks[1])){
                        return 3
                    }
                    else{
                        return 0
                    }
                }
            }
        }

        return 0
    }
    getName(){
        return "两杯口"
    }
}
class Chiniisou{
    test(handSet){
        let value = 6
        if(!test(handSet.flag,MENZEN))value--
        const contain = [0,0,0,0]
        for(const b of handSet.blocks){
            contain[pType2Int(b.pType)]=1
        }
        contain[pType2Int(handSet.pair.type)]=1

        const x = contain[0] + contain[1] + contain[2]
        if(x==1 && !contain[pType2Int('z')])return value
        return 0
    }
    getName(){
        return "清一色"
    }
}

class Daisangen{
    test(handSet){
        let cnt = 0;
        for(const b of handSet.blocks){
            if(b.pType=='z' && 5 <= b.num && b.num<=7){
                cnt++
            }
        }
        if(cnt==3)return 1
        return 0
    }
    getName(){
        return "大三元"
    }
}
class Suuankou{
    test(handSet){
        if(!test(handSet.flag,MENZEN))return 0
        let cnt = 0
        for(const b of handSet.blocks){
            if(b.bType != SEQ && !b.isOpen)cnt++
        }
        if(cnt==4 && 
            !handSet.agariPai.equalTo(handSet.pair.getPai()[0])){
            return 1
        }
        return 0;
    }
    getName(){
        return "四暗刻"
    }
}
class SuuankouTanki{
    test(handSet,rule){
        if(!test(handSet.flag,MENZEN))return 0
        let cnt = 0
        for(const b of handSet.blocks){
            if(b.bType != SEQ && !b.isOpen)cnt++
        }
        if(cnt==4 && 
            handSet.agariPai.equalTo(handSet.pair.getPai()[0])){
            return rule.duoBeiYiMan?2:1;
        }
        return 0;
    }
    getName(){
        return "四暗刻单骑"
    }
}
class Shousuushi{
    test(handSet){
        let cnt = 0
        for(const b of handSet.blocks){
            if(b.pType=='z' && 1<=b.num && b.num<=4)cnt++
        }
        if(cnt == 3 &&
            handSet.pair.type=='z' && 
            1<=handSet.pair.num && handSet.pair.num<=4)return 1
        return 0;
    }
    getName(){
        return "小四喜"
    }
}
class Daisuushi{
    test(handSet,rule){
        let cnt = 0
        for(const b of handSet.blocks){
            if(b.pType=='z' && 1<=b.num && b.num<=4)cnt++
        }
        if(cnt==4)return rule.duoBeiYiMan?2:1;
        return 0
    }
    getName(){
        return "大四喜"
    }
}
class Tsuuiisou{
    test(handSet){
        for(const b of handSet.blocks){
            if(b.pType != 'z')return 0;
        }
        console.log(handSet.pair.type)
        if(handSet.pair.type != 'z')return 0
        return 1
    }
    getName(){
        return "字一色"
    }
}
class Ryuuiisou{
    test(handSet){
        for(const b of handSet.blocks){
            for(const p of b.getPai()){
                if(!p.isRyu())return 0
            }
        }
        for(const p of handSet.pair.getPai()){
            if(!p.isRyu())return 0
        }
        return 1
    }
    getName(){
        return "绿一色"
    }
}
class Chinroutou{
    test(handSet){
        let haveZi = false
        for(const b of handSet.blocks){
            if(b.bType == SEQ ||!b.getPai()[0].isYao())
                return 0
            if(b.pType=='z')haveZi = true
        }
        if(handSet.pair.type=='z')haveZi=true
        if(handSet.pair.getPai()[0].isYao() && !haveZi)return 1
        return 0
    }
    getName(){
        return "清老头"
    }
}
class ChuurenPoutou{
    test(handSet){
        if(!test(handSet.flag,MENZEN))return 0
        if(!new Chiniisou().test(handSet))return 0;
        
        const cnt = [0,0,0,0,0,0,0,0,0,0,0,0]
        const needNum = [0,3,1,1,1,1,1,1,1,3]

        for(const b of handSet.blocks){
            if(b.bType==QUAD)return 0;
            for(const p of b.getPai()){
                cnt[p.num]++
            }
        }
        for(const p of handSet.pair.getPai()){
            cnt[p.num]++
        }

        let mulNum = -1
        for(let i=1;i<=9;i++){
            if(cnt[i]<needNum[i] || cnt[i]>needNum[i]+1)return 0
            if(cnt[i]==needNum[i]+1)mulNum = i
        }

        if(mulNum != handSet.agariPai.num)return 1;
        return 0;
    }
    getName(){
        return "九莲宝灯"
    }
}
class JunseiChuurenPoutou{
    test(handSet,rule){
        if(!test(handSet.flag,MENZEN))return 0
        if(!new Chiniisou().test(handSet))return 0;
        
        const cnt = [0,0,0,0,0,0,0,0,0,0,0,0]
        const needNum = [0,3,1,1,1,1,1,1,1,3]

        for(const b of handSet.blocks){
            if(b.bType==QUAD)return 0;
            for(const p of b.getPai()){
                cnt[p.num]++
            }
        }
        for(const p of handSet.pair.getPai()){
            cnt[p.num]++
        }

        let mulNum = -1
        for(let i=1;i<=9;i++){
            if(cnt[i]<needNum[i] || cnt[i]>needNum[i]+1)return 0
            if(cnt[i]==needNum[i]+1)mulNum = i
        }

        if(mulNum == handSet.agariPai.num)return rule.duoBeiYiMan?2:1;
        return 0;
    }
    getName(){
        return "纯正九莲宝灯"
    }
}
class Suukantsu{
    test(handSet){
        for(const b of handSet.blocks){
            if(b.bType != QUAD)return 0
        }
        return 1
    }
    getName(){
        return "四杠子"
    }
}
class Tenhou{
    test(handSet){
        if(!test(handSet.flag,MENZEN))return 0
        if(test(handSet.flag,TENHOU))return 1
        return 0
    }
    getName(){
        return "天和"
    }
}
class Chiihou{
    test(handSet){
        if(!test(handSet.flag,MENZEN))return 0
        if(test(handSet.flag,CHIIHOU))return 1
        return 0
    }
    getName(){
        return "地和"
    }
}

export const OYATSUMO = 0b00
export const OYARON = 0b01
export const KOTSUMO = 0b10
export const KORON = 0b11
export const NOMANGAN = 0
export const MANGAN = 1
export const HANEMAN = 2
export const BAIMAN = 3
export const SANBAIMAN = 4
export const KAZOEYAKUMAN = 5

// 可选的规则
export class Rule{
    constructor(){
        this.shiDuan = 1;
        this.duoBeiYiMan = 1;
        this.fuHeYiMan = 1;
        this.lianFeng4 = 1;
        this.allowLeiMan = 1;
    }
}

export class Result{
    constructor(){
        this.han=0
        this.fu=0
        this.fuMessages = []
        this.point1=0
        this.point2=0
        this.pointType=OYATSUMO
        this.yaku=[]
        this.isYakuman = false
        this.manType = NOMANGAN
    }
}

//TODO 单例
export class Calculator{
    constructor(){
        this.rule = new Rule();
        this.yakus = [
            new MenzenTsumo(),
            new TanYao(),
            new YakuhaiFieldEast(),
            new YakuhaiFieldSouth(),
            new YakuhaiFieldWest(),
            new YakuhaiFieldNorth(),
            new YakuhaiSeatEast(),
            new YakuhaiSeatSouth(),
            new YakuhaiSeatWest(),
            new YakuhaiSeatNorth(),
            new YakuhaiHako(),
            new YakuhaiHatsu(),
            new YakuhaiCyuu(),
            new ChanKan(),
            new RinshanKaihou(),
            new HaiteiRaoyue(),
            new HouteiRaoyui(),
            new Riichi(),
            new Iipeikou(),
            new Pinfu(),
            new Ippatsu(),
            new Dora(),
            new Ura(),
            new AkaDora(),
            new Toitoi(),
            new Sanankou(),
            new SanshokuDoukou(),
            new Sankantsu(),
            new Shousangen(),
            new Honroutou(),
            new DoubleRiichi(),
            new SanshokuDoujun(),
            new Ikkitsuukan(),
            new Chantaiyao(),
            new Honiisou(),
            new Junchantaiyao(),
            new Ryanpeikou(),
            new Chiniisou(),
        ]
        this.yakumanYakus = [
            new Daisangen(),     new Suuankou(),
            new SuuankouTanki(), new Shousuushi(),
            new Daisuushi(),     new Tsuuiisou(),
            new Ryuuiisou(),     new Chinroutou(),
            new ChuurenPoutou(), new JunseiChuurenPoutou(),
            new Suukantsu(),     new Tenhou(),
            new Chiihou(),
        ]
        this.pow2 = [1]
        for(let i=1;i<=20;i++){
            this.pow2.push(this.pow2[this.pow2.length-1]<<1)
        }
        this.nowP = []
        this.nowHandSet=new HandSet(undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined)
        
    }
    _calculateYaku(hand,res){
        res.yaku.splice(0)
        let cnt = 0;
        for(const x of this.yakumanYakus){
            // Some functions only have one param, JS just ignore the second param(rule)
            const p = x.test(hand,this.rule) 
            if(this.rule.fuHeYiMan)cnt += p
            else cnt=Math.max(cnt,p);
            if(p != 0){
                res.yaku.push(x.getName())
                res.isYakuman = true
            }
        }
        if(res.isYakuman){
            res.han = cnt
            return
        }

        for(const x of this.yakus){
            // Some functions only have one param, JS just ignore the second param(rule)
            const p = x.test(hand, this.rule)
            cnt+=p
            if(p!=0){
                res.yaku.push(
                    `${x.getName()}: ${p}翻`
                )
            }
        }
        //TODO FANFU(DORA NOMI)
        res.han = cnt
    }
    _calculateFu(hand,res){
        if(new Pinfu().test(hand)==1 && test(hand.flag,TSUMO)){
            res.fu=20
            res.fuMessages.push("平和自摸：20符")
            return
        }

        let fu = 20
        res.fuMessages.push("底符：20符")
        if(test(hand.flag,TSUMO)){
            fu+=2
            res.fuMessages.push("自摸 +2符")
        }
        if(test(hand.flag,RON|MENZEN)){
            fu+=10
            res.fuMessages.push("门前荣和 +10符")
        }

        if(hand.type == DAN_QI){
            fu+=2
            res.fuMessages.push("单骑听牌 +2符")
        }
        if(hand.type == KAN_ZHANG){
            fu+=2
            res.fuMessages.push("坎张听牌 +2符")
        }
        if(hand.type==BIAN_ZHANG){
            fu+=2
            res.fuMessages.push("边张听牌 +2符")
        }
        
        for(const b of hand.blocks){
            if(b.bType==SEQ)continue
            let blockFu = 2
            let blockMessage = ""

            if(b.consistYao())blockFu*=2,blockMessage+="幺九"
            else blockMessage+="中张"

            if(!b.isOpen)blockFu*=2,blockMessage+="暗"
            else blockMessage+="明"

            if(b.bType==QUAD)blockFu*=4,blockMessage+="杠"
            else blockMessage+="刻"

            fu+=blockFu
            res.fuMessages.push(blockMessage+` +${blockFu}符`)
        }

        let quetouFu=0;
        if(this.rule.lianFeng4){
            quetouFu = hand.pair.getPai()[0].isYakuhai(hand.flag)*2
        }
        else{
            // 如果雀头是连风，那么min到1 再乘2，即连风也计2符
            quetouFu = Math.min(1,hand.pair.getPai()[0].isYakuhai(hand.flag)) *2
        }
        fu += quetouFu
        if(quetouFu>0)res.fuMessages.push(`役牌雀头 +${quetouFu}符`)

        if(fu==20){
            res.fu=30
            res.fuMessages.push(`吃牌后，合计20符时：30符`)
            return
        }

        
        res.fuMessages.push(`共${fu}符`)
        if(fu%10 != 0){
            fu = Math.floor((fu+10)/10)*10
            res.fuMessages[res.fuMessages.length-1] += `，切上${fu}符`
        }
        res.fu=fu
    }
    _calculatePoint(hand,x){
        x.pointType = 0 |
            (+(!test(hand.flag,SEAT_EAST)))<<1 |
            +test(hand.flag,RON)
        
        let basePoint = 0
        if(x.isYakuman){
            basePoint = 8000 * x.han
        }
        else if ((x.han == 3 && x.fu >= 70) || (x.han == 4 && x.fu >= 40) || x.han == 5) {
            x.manType = MANGAN;
            basePoint = 2000;
        }
        else if (x.han == 6 || x.han == 7) {
            x.manType = HANEMAN;
            basePoint = 3000;
        }
        else if (8 <= x.han && x.han <= 10) {
            x.manType = BAIMAN;
            basePoint = 4000;
        } 
        else if (11 <= x.han && x.han <= 12 || x.han>=13 && !this.rule.allowLeiMan) {
            x.manType = SANBAIMAN;
            basePoint = 6000;
        }
        else if (x.han >= 13 && this.rule.allowLeiMan) {
            x.manType = KAZOEYAKUMAN;
            basePoint = 8000;
        }
        else {
            x.manType = NOMANGAN;
            basePoint = x.fu * this.pow2[x.han + 2];
            if (x.han == 0) basePoint = 0;
        }

        switch (x.pointType) {
            case OYATSUMO:
                x.point1 = 2 * basePoint;
                break;
            case OYARON:
                x.point1 = 6 * basePoint;
                break;
            case KOTSUMO:
                x.point1 = basePoint;
                x.point2 = 2 * basePoint;
                break;
            case KORON:
                x.point1 = 4 * basePoint;
                break;
        }

        if (x.point1 % 100 != 0) {
            x.point1 = Math.floor((x.point1 + 100) / 100) * 100;
        }
        if (x.point2 % 100 != 0) {
            x.point2 = Math.floor((x.point2 + 100) / 100) * 100;
        }
    }
    _calculateNormal(dep){
        if(this.nowP.length==0){
            const newResult = new Result()
            this._calculateFu(this.nowHandSet, newResult);
            this._calculateYaku(this.nowHandSet, newResult);
            this._calculatePoint(this.nowHandSet, newResult);
            if (newResult.point1 > this.result.point1 ||
                (newResult.point1 == this.result.point1 && newResult.point2 > this.result.point2) || (
                 newResult.point1 == this.result.point1 &&newResult.point2 == this.result.point2 &&newResult.han > this.result.han
            )) {
                this.result = newResult;
            }
            return
        }
        if(dep==0){
            const l = this.nowP.length
            for(let i=0;i<l-1;i++){
                if(this.nowP[i].equalTo(this.nowP[i+1])){
                    const a = this.nowP[i]
                    const b = this.nowP[i+1]

                    if(a.isAgari || b.isAgari){
                        this.nowHandSet.type = DAN_QI
                    }

                    this.nowHandSet.pair = new Pair(a.type,a.num)
                    this.nowP.splice(i,2)
                    this._calculateNormal(dep+1)
                    this.nowP.splice(i,0,a,b)
                }
            }
        }
        else{
            const a = this.nowP[0]
            const b = this.nowP[1]
            const c = this.nowP[2]
            if(a.equalTo(b) && b.equalTo(c)){
                let open = false
                if(a.isAgari || b.isAgari || c.isAgari){
                    this.nowHandSet.type = SHUANG_PENG
                    if(test(this.nowHandSet.flag,RON))open = true
                }
                this.nowHandSet.blocks.push(
                    new Block(TRI,a.type,a.num,open)
                )
                this.nowP.splice(0,3)
                this._calculateNormal(dep+1)
                this.nowP.splice(0,0,a,b,c)
                this.nowHandSet.blocks.pop()
            }
            const l = this.nowP.length
            if(this.nowP[0].num > 7 || this.nowP[0].type=='z')return

            let a2 = a.next()
            let a3 = a2.next()

            for(let i=1;i<l;i++){
                for(let j=i+1;j<l;j++){
                    if(this.nowP[i].equalTo(a2) && this.nowP[j].equalTo(a3)){
                        a2 = this.nowP[i]
                        a3 = this.nowP[j]
                        this.nowHandSet.blocks.push(
                            new Block(SEQ,a.type,a.num,false)
                        )
                        if(a.isAgari){
                            if(a.num==7){
                                this.nowHandSet.type=BIAN_ZHANG
                            }
                            else{
                                this.nowHandSet.type=LIANG_MIAN
                            }
                        }
                        else if(a3.isAgari){
                            if(a3.num==3){
                                this.nowHandSet.type=BIAN_ZHANG
                            }
                            else{
                                this.nowHandSet.type=LIANG_MIAN
                            }
                        }
                        else if(a2.isAgari){
                            this.nowHandSet.type=KAN_ZHANG
                        }

                        this.nowP.splice(j,1)
                        this.nowP.splice(i,1)
                        this.nowP.splice(0,1)
                        this._calculateNormal(dep+1)
                        this.nowP.splice(0,0,a)
                        this.nowP.splice(i,0,a2)
                        this.nowP.splice(j,0,a3)
                        this.nowHandSet.blocks.pop()
                    }
                }
            }
        }
    }
    _calculateKokushi(){
        const cnt = []
        const isAgari = []
        for(let i=0;i<20;i++){
            cnt.push(0)
            isAgari.push(false)
        }
        for(const p of this.nowP){
            if(!p.isYao())return
            if(p.type=='m'){
                let x = p.num
                if(x==9)x=2
                if(p.isAgari)isAgari[7+x]=true
                cnt[7+x]++
            }
            else if(p.type=='s'){
                let x = p.num
                if(x==9)x=2
                if(p.isAgari)isAgari[9+x]=true
                cnt[9+x]++
            }
            else if(p.type=='p'){
                let x = p.num
                if(x==9)x=2
                if(p.isAgari)isAgari[11+x]=true
                cnt[11+x]++
            }
            else if(p.type=='z'){
                let x = p.num
                if(x==9)x=2
                if(p.isAgari)isAgari[x]=true
                cnt[x]++
            }
        }
        let yakumanCount = 1
        for(let i=1;i<=13;i++){
            if(cnt[i]==0)return
            if(cnt[i]==2 && isAgari[i])yakumanCount++
        }
        const res = new Result()
        res.han = yakumanCount
        res.isYakuman = true
        res.yaku.push(
            (yakumanCount==1)?"国士无双":"国士无双十三面"
        )

        if(test(this.nowHandSet.flag,TENHOU)){
            res.yaku.push("天和")
            res.han++
        }
        if(test(this.nowHandSet.flag,CHIIHOU)){
            res.yaku.push("地和")
            res.han++
        }
        this._calculatePoint(this.nowHandSet,res)
        this.result = res
    }
    _calculateChiitui(){
        if(!test(this.nowHandSet.flag,MENZEN))return
        if(this.nowP.length != 14)return
        for(let i=0;i<7;i++){
            if(!this.nowP[i*2].equalTo(this.nowP[i*2+1]))return
            if(i!=0){
                if(this.nowP[i*2].equalTo(this.nowP[i*2-1]))return
            }
        }
        let cnt = 2
        let yakuman = 0
        const yakuName = ["七对子: 2翻"]
        const yakumanName = []

        let dora=0
        let ura=0
        const akadora = this.nowHandSet.redCnt
        for(const p of this.nowP){
            for(const d of this.nowHandSet.dora){
                if(p.equalTo(d.next()))dora++
            }
            for(const d of this.nowHandSet.ura){
                if(p.equalTo(d.next()))ura++
            }
        }
        if(dora>0)yakuName.push(`宝牌: ${dora}翻`)
        if(ura>0)yakuName.push(`里宝牌: ${ura}翻`)
        if(akadora>0)yakuName.push(`赤宝牌: ${akadora}翻`)
        cnt+=dora+ura+akadora

        function calcFlagYaku(this_,obj,isYakuman=false){
            const x = obj.test(this_.nowHandSet)
            if(x>0){
                if(!isYakuman){
                    cnt+=x
                    yakuName.push(`${obj.getName()}: ${x}翻`)
                }
                else{
                    yakuman += x
                    yakumanName.push(obj.getName())
                }
            }
        }
        calcFlagYaku(this, new Riichi())
        calcFlagYaku(this, new DoubleRiichi())
        calcFlagYaku(this, new MenzenTsumo())
        calcFlagYaku(this, new Ippatsu())
        calcFlagYaku(this, new ChanKan())
        calcFlagYaku(this, new RinshanKaihou())
        calcFlagYaku(this, new HouteiRaoyui())
        calcFlagYaku(this, new HaiteiRaoyue())
        
        calcFlagYaku(this, new Tenhou(),true)
        calcFlagYaku(this, new Chiihou(),true)

        function CalcTanYao(this_){
            for(const p of this_.nowP){
                if(p.isYao())return
            }
            const value = 1
            const name = "断幺九"
            cnt+=value
            yakuName.push(`${name}: ${value}翻`)
        }
        function CalcHoniisou(this_){
            const typeCnt = [0,0,0,0]
            for(const p of this_.nowP){
                typeCnt[pType2Int(p.type)]=1
            }
            if(typeCnt[0]+typeCnt[1]+typeCnt[2]!=1||
                typeCnt[3]!=1)return
            const value = 3
            const name = "混一色"
            cnt+=value
            yakuName.push(`${name}: ${value}翻`)
        }
        function CalcChiniisou(this_){
            const typeCnt = [0,0,0,0]
            for(const p of this_.nowP){
                typeCnt[pType2Int(p.type)]=1
            }
            if(typeCnt[0]+typeCnt[1]+typeCnt[2]!=1||
                typeCnt[3]==1)return
            const value = 6
            const name = "清一色"
            cnt+=value
            yakuName.push(`${name}: ${value}翻`)
        }
        function CalcHonroutou(this_){
            for(const p of this_.nowP){
                //不用判断字牌 一定不与清老头复合
                if(!p.isYao())return 
            }
            const value = 2
            const name = "混老头"
            cnt+=value
            yakuName.push(`${name}: ${value}翻`)
        }
        function CalcTsuuiisou(this_){
            for(const p of this_.nowP){
                if(p.type !='z')return
            }
            yakuman ++
            yakumanName.push("字一色")
        }
        CalcTanYao(this)
        CalcHoniisou(this)
        CalcChiniisou(this)
        CalcHonroutou(this)
        CalcTsuuiisou(this)
        const res = new Result()
        if(yakuman > 0){
            res.han = yakuman
            res.yaku = yakumanName
            res.isYakuman = true
        }
        else{
            res.han = cnt
            res.fu = 25
            res.yaku = yakuName
        }
        this._calculatePoint(this.nowHandSet,res)
        res.fuMessages.push("七对子：25符")
        this.result = res
    }
    calculate(state,rule=new Rule()){
        this.rule=rule;
        this.nowHandSet = new HandSet([],
            undefined,undefined,undefined,undefined,
            undefined,undefined,undefined,undefined)
        this.result = new Result()

        this.nowP = state.pais
        this.nowP.push(state.agariPai)

        this.nowP.sort()

        this.nowHandSet.flag=state.flag
        this.nowHandSet.dora =state.dora
        this.nowHandSet.ura=state.ura
        this.nowHandSet.agariPai=state.agariPai
        this.nowHandSet.redCnt=state.redCnt
        for(const b of state.furu){
            this.nowHandSet.blocks.push(b)
        }
        this._calculateKokushi()
        this._calculateChiitui()
        this._calculateNormal(0)
        return this.result
    }
}

export function isWaitFor(hand, pai){
    const paiLeftNow = {}
    for(const x of ["m","s","p","z"]){
        paiLeftNow[x] = []
        for(let i=1;i<=9;i++){
            paiLeftNow[x].push(4)
        }
    }
    for(const p of hand){
        paiLeftNow[p.type][p.num]--;
    }

    // 如果手里已经有四张 不算这个听牌 (虚听)
    if(paiLeftNow[pai.type][pai.num]<=0)return false;

    const s = new State(NORTH,NORTH,[],RON,hand,[],[],[],pai,0)
    const c = new Calculator()

    const r = c.calculate(s)
    // console.log(r)
    if(r.han > 0){
        return true;
    }
    return false;
}


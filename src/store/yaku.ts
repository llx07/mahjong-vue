import { Rule } from "./definition";
import { HandSet, MENZEN, TSUMO, FIELD_EAST, FIELD_SOUTH, FIELD_WEST, FIELD_NORTH, SEAT_EAST, SEAT_SOUTH, SEAT_WEST, SEAT_NORTH, CHANKAN, RINNSHANN_KAIHOU, HAITEI_RAOYUE, HOUTEI_RAOYUI, RIICHI, BlockType, MachiType, IPPATSU, Pai, DOUBLE_RIICHI, TENHOU, CHIIHOU } from "./definition";
import { test, pType2Int } from "./util";



export interface Yaku{
    test(handSet:HandSet, rule:Rule):number
    getName():string
}

export class MenzenTsumo implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(test(handSet.flag,MENZEN|TSUMO)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "门前清自摸和"
    }
}
export class TanYao implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiFieldEast implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiFieldSouth implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiFieldWest implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiFieldNorth implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiSeatEast implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiSeatSouth implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiSeatWest implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiSeatNorth implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiHako implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiHatsu implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class YakuhaiCyuu implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class ChanKan implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(test(handSet.flag,CHANKAN)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "抢杠"
    }
}
export class RinshanKaihou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(test(handSet.flag,RINNSHANN_KAIHOU)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "岭上开花"
    }
}
export class HaiteiRaoyue implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(test(handSet.flag,HAITEI_RAOYUE)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "海底捞月"
    }
}
export class HouteiRaoyui implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(test(handSet.flag,HOUTEI_RAOYUI)){
            return 1;
        }
        return 0;
    }
    getName(){
        return "河底摸鱼"
    }
}
export class Riichi implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class Iipeikou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(!test(handSet.flag,MENZEN))return 0;
        const localBlocks = handSet.blocks.slice(0)
        for(let i=0;i<4;i++){
            for(let j=i+1;j<4;j++){
                const b1 = localBlocks[i]
                const b2 = localBlocks[j]
                if(b1.equalTo(b2) && b1.bType == BlockType.SEQ){
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
export class Pinfu implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(!test(handSet.flag,MENZEN))return 0;
        if(handSet.pair.getPai()[0].isYakuhai(handSet.flag))
            return 0;
        for(const b of handSet.blocks){
            if(b.bType != BlockType.SEQ)return 0;
        }
        if(handSet.type != MachiType.LIANG_MIAN)return 0;
        return 1;
    }
    getName(){
        return "平和"
    }
}
export class Ippatsu implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(!test(handSet.flag,MENZEN))return 0;
        if(test(handSet.flag,IPPATSU))return 1;
        return 0;
    }
    getName(){
        return "一发"
    }
}
export class Dora implements Yaku{
    test(handSet:HandSet, rule:Rule){
        let cnt = 0 
        const dora = handSet.dora
        let x:Pai[] = []
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
export class Ura implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class AkaDora implements Yaku{
    test(handSet:HandSet, rule:Rule){
        return handSet.redCnt
    }
    getName(){
        return "赤宝牌"
    }
}
export class Toitoi{
    test(handSet:HandSet, rule:Rule){
        for(const b of handSet.blocks){
            if(b.bType == BlockType.SEQ)return 0
        }
        return 2
    }
    getName(){
        return "对对和"
    }
}
export class Sanankou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        let cnt  = 0
        for(const b of handSet.blocks){
            if(b.bType != BlockType.SEQ && !b.isOpen)cnt++
        }
        if(cnt==3)return 2
        return 0
    }
    getName(){
        return "三暗刻"
    }
}
export class SanshokuDoukou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        const cnt = [0,0,0,0,0,0,0,0,0,0,0,0,0]
        for(const b of handSet.blocks){
            if(b.bType!=BlockType.SEQ){
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
export class Sankantsu implements Yaku{
    test(handSet:HandSet, rule:Rule){
        let cnt  = 0
        for(const b of handSet.blocks){
            if(b.bType == BlockType.QUAD)cnt++
        }
        if(cnt==3)return 2
        return 0
    }
    getName(){
        return "三杠子"
    }
}
export class Shousangen implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class Honroutou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        let haveZi = false
        for(const b of handSet.blocks){
            if(b.bType == BlockType.SEQ ||!b.getPai()[0].isYao())
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
export class DoubleRiichi implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class SanshokuDoujun implements Yaku{
    test(handSet:HandSet, rule:Rule){
        let value = 2
        if(!test(handSet.flag,MENZEN))value--;
        const cnt = [0,0,0,0,0,0,0,0,0,0,0,0,0]
        for(const b of handSet.blocks){
            if(b.bType==BlockType.SEQ){
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
export class Ikkitsuukan implements Yaku{
    test(handSet:HandSet, rule:Rule){
        let value = 2
        if(!test(handSet.flag,MENZEN))value--

        const cnt = [0,0,0,0,0]
        for(const b of handSet.blocks){
            if(b.bType != BlockType.SEQ)continue
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
export class Chantaiyao implements Yaku{
    test(handSet:HandSet, rule:Rule){
        let value = 2
        if(!test(handSet.flag,MENZEN))value--

        let haveZi = false
        let haveSEQ = false
        for(const b of handSet.blocks){
            if(b.bType == BlockType.SEQ){
                haveSEQ = true
            }
            if(b.pType == 'z'){
                haveZi = true
            }
            if(!b.consistYao())return 0
        }
        if(handSet.pair.type=='z')haveZi=true
        if(!handSet.pair.consistYao())return 0
        if(!haveZi || !haveSEQ)return 0;
        return value
    }
    getName(){
        return "混全带幺九"
    }
}
export class Honiisou implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class Junchantaiyao implements Yaku{
    test(handSet:HandSet, rule:Rule){
        let value = 3
        if(!test(handSet.flag,MENZEN))value--

        let haveZi = false
        let haveSEQ = false
        for(const b of handSet.blocks){
            if(b.bType == BlockType.SEQ){
                haveSEQ = true
            }
            if(b.pType == 'z'){
                haveZi = true
            }
            if(!b.consistYao())return 0
        }
        if(handSet.pair.type=='z')haveZi=true

        if(!handSet.pair.consistYao())return 0
        if(haveZi || !haveSEQ)return 0;
        return value
    }
    getName(){
        return "纯全带幺九"
    }
}
export class Ryanpeikou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(!test(handSet.flag,MENZEN))return 0;

        const localBlocks = handSet.blocks.slice(0)
        
        for(let i=0;i<4;i++){
            for(let j=i+1;j<4;j++){
                const b1 = localBlocks[i]
                const b2 = localBlocks[j]
                if(b1.equalTo(b2) && b1.bType == BlockType.SEQ){
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
export class Chiniisou implements Yaku{
    test(handSet:HandSet, rule:Rule){
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

export class Daisangen implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class Suuankou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(!test(handSet.flag,MENZEN))return 0
        let cnt = 0
        for(const b of handSet.blocks){
            if(b.bType != BlockType.SEQ && !b.isOpen)cnt++
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
export class SuuankouTanki implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(!test(handSet.flag,MENZEN))return 0
        let cnt = 0
        for(const b of handSet.blocks){
            if(b.bType != BlockType.SEQ && !b.isOpen)cnt++
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
export class Shousuushi implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class Daisuushi implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class Tsuuiisou implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class Ryuuiisou implements Yaku{
    test(handSet:HandSet, rule:Rule){
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
export class Chinroutou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        let haveZi = false
        for(const b of handSet.blocks){
            if(b.bType == BlockType.SEQ ||!b.getPai()[0].isYao())
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
export class ChuurenPoutou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(!test(handSet.flag,MENZEN))return 0
        if(!new Chiniisou().test(handSet, rule))return 0;
        
        const cnt = [0,0,0,0,0,0,0,0,0,0,0,0]
        const needNum = [0,3,1,1,1,1,1,1,1,3]

        for(const b of handSet.blocks){
            if(b.bType==BlockType.QUAD)return 0;
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
export class JunseiChuurenPoutou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(!test(handSet.flag,MENZEN))return 0
        if(!new Chiniisou().test(handSet, rule))return 0;
        
        const cnt = [0,0,0,0,0,0,0,0,0,0,0,0]
        const needNum = [0,3,1,1,1,1,1,1,1,3]

        for(const b of handSet.blocks){
            if(b.bType==BlockType.QUAD)return 0;
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
export class Suukantsu implements Yaku{
    test(handSet:HandSet, rule:Rule){
        for(const b of handSet.blocks){
            if(b.bType != BlockType.QUAD)return 0
        }
        return 1
    }
    getName(){
        return "四杠子"
    }
}
export class Tenhou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(!test(handSet.flag,MENZEN))return 0
        if(test(handSet.flag,TENHOU))return 1
        return 0
    }
    getName(){
        return "天和"
    }
}
export class Chiihou implements Yaku{
    test(handSet:HandSet, rule:Rule){
        if(!test(handSet.flag,MENZEN))return 0
        if(test(handSet.flag,CHIIHOU))return 1
        return 0
    }
    getName(){
        return "地和"
    }
}

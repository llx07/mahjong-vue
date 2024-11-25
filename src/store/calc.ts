import { Result, Rule } from "./definition"
import { Block, BlockType, CHIIHOU, HandSet, MachiType, ManType, MENZEN, Pai, Pair, PointType, RON, SEAT_EAST, State, TENHOU, TSUMO } from "./types"
import { pType2Int, test } from "./util"
import { AkaDora, ChanKan, Chantaiyao, Chiihou, Chiniisou, Chinroutou, ChuurenPoutou, Daisangen, Daisuushi, Dora, DoubleRiichi, HaiteiRaoyue, Honiisou, Honroutou, HouteiRaoyui, Iipeikou, Ikkitsuukan, Ippatsu, Junchantaiyao, JunseiChuurenPoutou, MenzenTsumo, Pinfu, Riichi, RinshanKaihou, Ryanpeikou, Ryuuiisou, Sanankou, Sankantsu, SanshokuDoujun, SanshokuDoukou, Shousangen, Shousuushi, Suuankou, SuuankouTanki, Suukantsu, TanYao, Tenhou, Toitoi, Tsuuiisou, Ura, Yaku, YakuhaiCyuu, YakuhaiFieldEast, YakuhaiFieldNorth, YakuhaiFieldSouth, YakuhaiFieldWest, YakuhaiHako, YakuhaiHatsu, YakuhaiSeatEast, YakuhaiSeatNorth, YakuhaiSeatSouth, YakuhaiSeatWest } from "./yaku"


//TODO 单例
export class Calculator{ // 计算器实例
    rule:Rule
    yakus:Yaku[]
    yakumanYakus:Yaku[]
    pow2:number[]
    nowP:Pai[]
    nowHandSet?:HandSet
    result?: Result
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
    }
    _calculateYaku(hand:HandSet, res:Result){ // 计算手牌的所有役种
        res.yaku.splice(0)
        let cnt = 0;
        for(const yaku of this.yakumanYakus){
            const p = yaku.test(hand,this.rule) 
            if(this.rule.fuHeYiMan)cnt += p
            else cnt=Math.max(cnt,p);
            if(p != 0){
                res.yaku.push(yaku.getName())
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
    _calculateFu(hand: HandSet,res: Result){
        if(new Pinfu().test(hand, this.rule)==1 && test(hand.flag,TSUMO)){
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

        if(hand.type == MachiType.DAN_QI){
            fu+=2
            res.fuMessages.push("单骑听牌 +2符")
        }
        if(hand.type == MachiType.KAN_ZHANG){
            fu+=2
            res.fuMessages.push("坎张听牌 +2符")
        }
        if(hand.type==MachiType.BIAN_ZHANG){
            fu+=2
            res.fuMessages.push("边张听牌 +2符")
        }
        
        for(const b of hand.blocks){
            if(b.bType==BlockType.SEQ)continue
            let blockFu = 2
            let blockMessage = ""

            if(b.consistYao())blockFu*=2,blockMessage+="幺九"
            else blockMessage+="中张"

            if(!b.isOpen)blockFu*=2,blockMessage+="暗"
            else blockMessage+="明"

            if(b.bType==BlockType.QUAD)blockFu*=4,blockMessage+="杠"
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
    _calculatePoint(hand: HandSet, res:Result){
        res.pointType = 0 |
            (+(!test(hand.flag,SEAT_EAST)))<<1 |
            +test(hand.flag,RON)
        
        let basePoint = 0
        if(res.isYakuman){
            basePoint = 8000 * res.han
        }
        else if ((res.han == 3 && res.fu >= 70) || (res.han == 4 && res.fu >= 40) || res.han == 5) {
            res.manType = ManType.MANGAN;
            basePoint = 2000;
        }
        else if (res.han == 6 || res.han == 7) {
            res.manType = ManType.HANEMAN;
            basePoint = 3000;
        }
        else if (8 <= res.han && res.han <= 10) {
            res.manType = ManType.BAIMAN;
            basePoint = 4000;
        } 
        else if (11 <= res.han && res.han <= 12 || res.han>=13 && !this.rule.allowLeiMan) {
            res.manType = ManType.SANBAIMAN;
            basePoint = 6000;
        }
        else if (res.han >= 13 && this.rule.allowLeiMan) {
            res.manType = ManType.KAZOEYAKUMAN;
            basePoint = 8000;
        }
        else {
            res.manType = ManType.NOMANGAN;
            basePoint = res.fu * this.pow2[res.han + 2];
            if (res.han == 0) basePoint = 0;
        }

        switch (res.pointType) {
            case PointType.OYATSUMO:
                res.point1 = 2 * basePoint;
                break;
            case PointType.OYARON:
                res.point1 = 6 * basePoint;
                break;
            case PointType.KOTSUMO:
                res.point1 = basePoint;
                res.point2 = 2 * basePoint;
                break;
            case PointType.KORON:
                res.point1 = 4 * basePoint;
                break;
        }

        if (res.point1 % 100 != 0) {
            res.point1 = Math.floor((res.point1 + 100) / 100) * 100;
        }
        if (res.point2 % 100 != 0) {
            res.point2 = Math.floor((res.point2 + 100) / 100) * 100;
        }
    }
    _calculateNormal(dep: number){ // dfs 寻找一般和牌型
        if(this.nowP.length==0){
            const newResult = new Result()
            this._calculateFu(this.nowHandSet!, newResult);
            this._calculateYaku(this.nowHandSet!, newResult);
            this._calculatePoint(this.nowHandSet!, newResult);
            
            if(this.result === undefined){
                this.result = newResult;
            }
            else if (newResult.point1 > this.result.point1 ||
                (newResult.point1 == this.result.point1 && newResult.point2 > this.result.point2) 
                || (  newResult.point1 == this.result.point1 &&newResult.point2 == this.result.point2 && newResult.han > this.result.han
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
                        this.nowHandSet!.type = MachiType.DAN_QI
                    }

                    this.nowHandSet!.pair = new Pair(a.type,a.num)
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
                    this.nowHandSet!.type = MachiType.SHUANG_PENG
                    if(test(this.nowHandSet!.flag,RON))open = true
                }
                this.nowHandSet!.blocks.push(
                    new Block(BlockType.TRI,a.type,a.num,open)
                )
                this.nowP.splice(0,3)
                this._calculateNormal(dep+1)
                this.nowP.splice(0,0,a,b,c)
                this.nowHandSet!.blocks.pop()
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
                        this.nowHandSet!.blocks.push(
                            new Block(BlockType.SEQ,a.type,a.num,false)
                        )
                        if(a.isAgari){
                            if(a.num==7){
                                this.nowHandSet!.type=MachiType.BIAN_ZHANG
                            }
                            else{
                                this.nowHandSet!.type=MachiType.LIANG_MIAN
                            }
                        }
                        else if(a3.isAgari){
                            if(a3.num==3){
                                this.nowHandSet!.type=MachiType.BIAN_ZHANG
                            }
                            else{
                                this.nowHandSet!.type=MachiType.LIANG_MIAN
                            }
                        }
                        else if(a2.isAgari){
                            this.nowHandSet!.type=MachiType.KAN_ZHANG
                        }

                        this.nowP.splice(j,1)
                        this.nowP.splice(i,1)
                        this.nowP.splice(0,1)
                        this._calculateNormal(dep+1)
                        this.nowP.splice(0,0,a)
                        this.nowP.splice(i,0,a2)
                        this.nowP.splice(j,0,a3)
                        this.nowHandSet!.blocks.pop()
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

        if(test(this.nowHandSet!.flag,TENHOU)){
            res.yaku.push("天和")
            res.han++
        }
        if(test(this.nowHandSet!.flag,CHIIHOU)){
            res.yaku.push("地和")
            res.han++
        }
        this._calculatePoint(this.nowHandSet!,res)
        this.result = res
    }
    _calculateChiitui(){
        if(!test(this.nowHandSet!.flag,MENZEN))return
        if(this.nowP.length != 14)return
        for(let i=0;i<7;i++){
            if(!this.nowP[i*2].equalTo(this.nowP[i*2+1]))return
            if(i!=0){
                if(this.nowP[i*2].equalTo(this.nowP[i*2-1]))return
            }
        }
        let cnt = 2
        let yakuman = 0
        const yakuName:string[] = ["七对子: 2翻"]
        const yakumanName:string[] = []

        let dora=0
        let ura=0
        const akadora = this.nowHandSet!.redCnt
        for(const p of this.nowP){
            for(const d of this.nowHandSet!.dora){
                if(p.equalTo(d.next()))dora++
            }
            for(const d of this.nowHandSet!.ura){
                if(p.equalTo(d.next()))ura++
            }
        }
        if(dora>0)yakuName.push(`宝牌: ${dora}翻`)
        if(ura>0)yakuName.push(`里宝牌: ${ura}翻`)
        if(akadora>0)yakuName.push(`赤宝牌: ${akadora}翻`)
        cnt+=dora+ura+akadora

        // 辅助函数，计算一类简单的役
        function calcFlagYaku(this_:Calculator ,yaku:Yaku,isYakuman:boolean=false){
            const x = yaku.test(this_.nowHandSet!, this_.rule)
            if(x>0){
                if(!isYakuman){
                    cnt+=x
                    yakuName.push(`${yaku.getName()}: ${x}翻`)
                }
                else{
                    yakuman += x
                    yakumanName.push(yaku.getName())
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

        function CalcTanYao(this_:Calculator){
            for(const p of this_.nowP){
                if(p.isYao())return
            }
            const value = 1
            const name = "断幺九"
            cnt+=value
            yakuName.push(`${name}: ${value}翻`)
        }
        function CalcHoniisou(this_:Calculator){
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
        function CalcChiniisou(this_:Calculator){
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
        function CalcHonroutou(this_:Calculator){
            for(const p of this_.nowP){
                //不用判断字牌 一定不与清老头复合
                if(!p.isYao())return 
            }
            const value = 2
            const name = "混老头"
            cnt+=value
            yakuName.push(`${name}: ${value}翻`)
        }
        function CalcTsuuiisou(this_:Calculator){
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
        this._calculatePoint(this.nowHandSet!,res)
        res.fuMessages.push("七对子：25符")
        this.result = res
    }
    calculate(state:State,rule=new Rule()){ // 主计算函数
        this.rule=rule;
        this.nowHandSet = new HandSet([],
            new Pair('m', 1),state.dora,state.ura, MachiType.BIAN_ZHANG, // 默认，之后会被修改
            state.flag,state.agariPai,state.redCnt)
        this.result = new Result()

        this.nowP = state.pais
        this.nowP.push(state.agariPai)
        this.nowP.sort()

        for(const b of state.furu){
            this.nowHandSet.blocks.push(b)
        }
        this._calculateKokushi()
        this._calculateChiitui()
        this._calculateNormal(0)
        return this.result
    }
}
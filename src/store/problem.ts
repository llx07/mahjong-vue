import { Calculator } from "./calc"
import { Result, Rule } from "./definition"
import { Pai, TSUMO, RON, RIICHI, HAITEI_RAOYUE, HOUTEI_RAOYUI, RINNSHANN_KAIHOU, DOUBLE_RIICHI, IPPATSU, State, Block, PositionType, PaiType, BlockType, PaiNum } from "./types"
import { choose, randInt, shuffle } from "./util"

class Problem{ // 题目
    hand: Pai[]
    agariPai: Pai
    furu: Block[]
    dora: Pai[]
    ura: Pai[]
    flag: number
    ans: Result

    constructor(){
        this.hand = []
        this.agariPai = new Pai('z',1)
        this.furu = []
        this.dora = []
        this.ura = []
        this.flag = 0
        this.ans =  new Result()
    }
}

interface NumberLeft<T>{
    [key:string]: T;
}
export class ProblemGenerator{
    rule: Rule
    tsumoChance : number
    callChance : number
    riichiChance : number
    doubleRiichiChance : number
    ippastsuChance : number
    haiteiHouteiChance : number
    rinnshannKaihouChance : number
    chankanChance : number
    kokushiChance : number
    chituiChance : number

    akaDoraChance : number
    tripletChance : number
    quadChance : number
    closeQuadChance : number

    doraCnt : number
    paiLeft : NumberLeft<number[]>
    akaDoraLeft :NumberLeft<number>

    field : PositionType
    seat : PositionType
    c : Calculator

    constructor(rule:Rule){
        this.rule=rule;

        this.tsumoChance = 0.4  // 自摸概率
        this.callChance = 0.5 // 副露概率
        this.riichiChance = 0.2 // 立直概率
        this.doubleRiichiChance = 0.01 // W立直概率
        this.ippastsuChance = 0.01 // 一发
        this.haiteiHouteiChance = 0.01 // 海/河底
        this.rinnshannKaihouChance = 0.01 //
        this.chankanChance = 0.01
        this.kokushiChance = 0.01
        this.chituiChance = 0.05

        this.akaDoraChance = 0.25
        this.tripletChance = 0.15
        this.quadChance = 0.1
        this.closeQuadChance = 0.4

        this.doraCnt = 0
        this.paiLeft = {}
        this.akaDoraLeft = {}

        this.field = PositionType.EMPTY
        this.seat = PositionType.EMPTY

        this.c = new Calculator()
    }

    generate(){
        this.paiLeft={}
        for(let i=0;i<4;i++){
            this.paiLeft["mspz"[i]] = Array(12)
            for(let j=0;j<10;j++){
                this.paiLeft["mspz"[i]][j]=4
            }
        }

        this.akaDoraLeft['m'] = 1
        this.akaDoraLeft['s'] = 1
        this.akaDoraLeft['p'] = 1

        this.doraCnt = 1
        

        const field = randInt(0,2)
        const seat  = randInt(0,4)

        let agariWay;
        if(this._testChance(this.tsumoChance)){
            agariWay = TSUMO
        }
        else{
            agariWay = RON
        }

        
        const yakus = []
        let hand = []
        const dora = []
        const ura = []
        const furu = []
    
        if(this._testChance(this.kokushiChance)){
            hand = [ new Pai('s',1),
                    new Pai('s',9),
                    new Pai('m',1),
                    new Pai('m',9),
                    new Pai('p',1),
                    new Pai('p',9),
                    new Pai('z',1),
                    new Pai('z',2),
                    new Pai('z',3),
                    new Pai('z',4),
                    new Pai('z',5),
                    new Pai('z',6),
                    new Pai('z',7),
                ]
            const tmp = [ new Pai('s',1),
                new Pai('s',9),
                new Pai('m',1),
                new Pai('m',9),
                new Pai('p',1),
                new Pai('p',9),
                new Pai('z',1),
                new Pai('z',2),
                new Pai('z',3),
                new Pai('z',4),
                new Pai('z',5),
                new Pai('z',6),
                new Pai('z',7),
            ]
            hand.push(choose(tmp))
        }
        else if(this._testChance(this.chituiChance)){
            for(let tuiCnt = 0; tuiCnt<7;){
                const tp = "mspz"[randInt(0,4)] as PaiType
                let num;

                if(tp=='z'){
                    num = randInt(1,8)
                }
                else{
                    num = randInt(1,10)
                }

                if(this._canGetPai(tp,num,3)){
                    tuiCnt ++
                    hand.push(this._getPai(tp,num))
                    hand.push(this._getPai(tp,num))
                }
            }
        }
        else{
            let callCount = randInt(-4,5)
            // let callCount=4
            if(callCount<0)callCount = 0

            if(callCount!=0){
                const wantTanyao = this._testChance(0.5) && this.rule.shiDuan

                let generatedYakuhai = false
                for(let i=0;i<(4-callCount);i++){
                    let p = []
                    if(!wantTanyao){
                        if(i==0 && this._testChance(0.5)){
                            p = this._generateYakuhaiBlock();
                            generatedYakuhai = true
                        }
                        else{
                            p = this._generateRandomBlock()
                        }
                    }
                    else{
                        p = this._generateTanyaoBlock()
                    }

                    for(const x of p)hand.push(x)
                }

                for(let i=0;i<callCount;i++){
                    if(!wantTanyao){
                        if(i==0){
                            if((!generatedYakuhai)||(generatedYakuhai&&this._testChance(0.2))){
                                furu.push(this._generateYakuhaiFuru())
                            }
                            else{
                                furu.push(this._generateRandomFuru())
                            }
                        }
                        else{
                            furu.push(this._generateRandomFuru())
                        }
                    }
                    else{
                        furu.push(this._generateTanyaoFuru())
                    }
                }
                
                let p;
                if(!wantTanyao){
                    p = this._generateRandomPair()
                }
                else{
                    p = this._generateTanyaoPair()
                }
                p.forEach(element => {
                    hand.push(element)
                })
            }
            else{
                const wantTanyao = this._testChance(0.2)
                let wantYakuhai = false

                if(!wantTanyao)wantYakuhai = this._testChance(0.2)

                for(let i=0;i<4;i++){
                    let p;
                    if(wantTanyao){
                        // console.log("tanyao")
                        p = this._generateTanyaoBlock()
                    }
                    else if(wantYakuhai && i==0){
                        // console.log("yakuhai")
                        p = this._generateYakuhaiBlock()
                    }
                    else{
                        // console.log("random")
                        p = this._generateRandomBlock()
                    }

                    p.forEach(element => {
                        hand.push(element)   
                    });
                    // console.log("generate",i,JSON.parse(JSON.stringify(p)),"result",JSON.parse(JSON.stringify(hand)))
                }

                if((!wantTanyao&&!wantYakuhai) || this._testChance(this.riichiChance)){
                    yakus.push(RIICHI)
                }

                let p;
                if(wantTanyao){
                    p = this._generateTanyaoPair()
                }
                else{
                    p = this._generateRandomPair()
                }
                p.forEach(element => {
                    hand.push(element)   
                });
            }
        }


        // -------------------------------------------------------


        // 对于生成好的 hand 数组（dora,ura）进行处理
        hand.sort()
        const agariIndex = randInt(0,hand.length)

        // console.log(JSON.parse(JSON.stringify(hand)))
        const agariPai = hand.splice(agariIndex,1)[0]
        // console.log(JSON.parse(JSON.stringify(hand)))
        for(let i=0;i<this.doraCnt;i++){
            dora.push(this._getRandomPai())
            if(yakus.includes(RIICHI))ura.push(this._getRandomPai())
        }

        if(this._testChance(this.haiteiHouteiChance)){
            if(agariWay==TSUMO){
                yakus.push(HAITEI_RAOYUE)
            }
            else{
                yakus.push(HOUTEI_RAOYUI)
            }
        }

        if(this.doraCnt>1 && agariWay==TSUMO && this._testChance(this.rinnshannKaihouChance)){
            yakus.push(RINNSHANN_KAIHOU)
        }

        if (yakus.includes(RIICHI)) {
            if (this._testChance(this.doubleRiichiChance)) {
                yakus.splice(yakus.findIndex((item)=>{item==RIICHI}));
                yakus.push(DOUBLE_RIICHI);
            }
            if (this._testChance(this.ippastsuChance)) {
                yakus.push  (IPPATSU);
            }
        }
        let cnt = 0
        for(const p of hand){
            if(p.redCnt != undefined){
                cnt += p.redCnt
            }
        }
        for(const p of furu){
            if(p.redCnt != undefined){
                cnt += p.redCnt
            }
        }
        cnt += agariPai.redCnt;

        // console.log("hand",JSON.parse(JSON.stringify(hand)))
        // console.log("field,seat:",field,seat)
        const s = new State(field,seat,yakus,agariWay,hand,furu,dora,ura,agariPai,cnt)
        const rt = new Problem()
        rt.hand = hand
        rt.agariPai = agariPai
        rt.furu = furu
        rt.dora = dora
        rt.ura = ura
        rt.flag = s.flag
        // console.log('state',JSON.parse(JSON.stringify(s)))
        rt.ans = this.c.calculate(s,this.rule)
        console.log('return',JSON.parse(JSON.stringify(rt)))
        return rt
    }

    _canGetTri(tp:PaiType, num:PaiNum){
        return this._canGetPai(tp,num)&&this._canGetPai(tp,num+1)&&this._canGetPai(tp,num+2)
    }

    _generateTanyaoBlock(){
        let success = false
        const rt = []

        do{
            const tp = "msp"[randInt(0,3)] as PaiType
            if(this._testChance(this.tripletChance)){
                const num = randInt(2,9)
                if(this._canGetPai(tp,num,3)){
                    success = true
                    rt.push(this._getPai(tp,num))
                    rt.push(this._getPai(tp,num))
                    rt.push(this._getPai(tp,num))
                }
            }
            else{
                const num = randInt(2,7)
                if(this._canGetPai(tp,num) &&
                    this._canGetPai(tp,num+1) &&
                    this._canGetPai(tp,num+2) ){
                    success = true
                    rt.push(this._getPai(tp,num))
                    rt.push(this._getPai(tp,num+1))
                    rt.push(this._getPai(tp,num+2))
                }
            }
        }
        while(!success);
        return rt
    }

    _generateYakuhaiBlock(){
        const yakuHais = [this.field+1,this.seat+1,5,6,7]
        shuffle(yakuHais)

        for(const num of yakuHais){
            if(this._canGetPai('z',3)){
                return [this._getPai('z',num),
                        this._getPai('z',num),
                        this._getPai('z',num)]
            }
        }
        return this._generateRandomBlock()
    }

    _generateRandomBlock(){
        let success = false
        
        const rt = []

        do{
            const tp = "mspz"[randInt(0,4)] as PaiType
            if(this._testChance(this.tripletChance) || tp =='z'){
                let num;
                if(tp=='z'){
                    num = randInt(1,8)
                }
                else{
                    num = randInt(1,10)
                }

                if(this._canGetPai(tp,num,3)){
                    success = true
                    rt.push(this._getPai(tp,num))
                    rt.push(this._getPai(tp,num))
                    rt.push(this._getPai(tp,num))
                }
            }
            else{
                const num = randInt(1,8)
                if(this._canGetPai(tp,num) && this._canGetPai(tp,num+1)&&this._canGetPai(tp,num+2)){
                    success = true
                    rt.push(this._getPai(tp,num))
                    rt.push(this._getPai(tp,num+1))
                    rt.push(this._getPai(tp,num+2))
                }
            }
        }
        while(!success);
        // console.log("generating random, length=",rt.length)
        return rt
    }

    _generateTanyaoPair(){
        let success = false
        const rt = []
        do{
            const tp = "msp"[randInt(0,3)] as PaiType
            const num = randInt(2,9)
            if(this._canGetPai(tp,num,2)){
                success = true
                rt.push(this._getPai(tp,num))
                rt.push(this._getPai(tp,num))
            }
        }
        while(!success);
        return rt
    }

    _generateYakuhaiPair(){
        const yakuHais = [this.field+1,this.seat+1,5,6,7]
        shuffle(yakuHais)

        for(const num of yakuHais){
            if(this._canGetPai('z',2)){
                return [this._getPai('z',num),
                        this._getPai('z',num)]
            }
        }
        return this._generateRandomPair()
    }

    _generateRandomPair(){
        let success = false
        const rt = []
        do{
            const tp = "mspz"[randInt(0,4)] as PaiType
            let num;
            if(tp=='z'){
                num = randInt(1,8)
            }
            else{
                num = randInt(1,10)
            }
            
            if(this._canGetPai(tp,num,2)){
                success = true
                rt.push(this._getPai(tp,num))
                rt.push(this._getPai(tp,num))
            }
        }
        while (!success);
        return rt;
    }

    _generateRandomFuru(){
        for(;;){
            const tp = "mspz"[randInt(0,4)] as PaiType
            if(this._testChance(this.tripletChance) || tp == 'z'){
                let num: PaiNum;
                if(tp=='z'){
                    num = randInt(1,8) as PaiNum;
                }
                else{
                    num = randInt(1,10) as PaiNum;
                }

                if(this._testChance(this.quadChance)){
                    let isOpen = true
                    if(this._testChance(this.closeQuadChance)){
                        isOpen = false
                    }

                    if(this._canGetPai(tp,num,4)){
                        this.doraCnt ++
                        let redCnt = 0
                        for(let i=0;i<4;i++){
                            redCnt += this._getPai(tp,num).redCnt
                        }

                        const rt = new Block(BlockType.QUAD,tp,num,isOpen)
                        rt.redCnt = redCnt
                        return rt
                    }
                }
                else{
                    if(this._canGetPai(tp,num,3)){
                        let redCnt = 0
                        for(let i=0;i<3;i++){
                            redCnt += this._getPai(tp,num).redCnt
                        }

                        const rt = new Block(BlockType.TRI,tp,num,true)
                        rt.redCnt = redCnt
                        return rt
                    }
                }
            }
            else{
                const num = randInt(1,8) as PaiNum
                if(this._canGetTri(tp,num)){
                    let redCnt = 0
                    for(let i=0;i<3;i++){
                        redCnt += this._getPai(tp,num+i).redCnt
                    }
                    const rt = new Block(BlockType.SEQ,tp,num,true)
                    rt.redCnt = redCnt
                    return rt
                }
            }
        }
    }

    _generateTanyaoFuru(){
        for(;;){
            const tp = "msp"[randInt(0,3)] as PaiType
            if(this._testChance(this.tripletChance)){
                const num = randInt(2,9) as PaiNum

                if(this._testChance(this.quadChance)){
                    let isOpen = true
                    if(this._testChance(this.closeQuadChance)){
                        isOpen = false
                    }

                    if(this._canGetPai(tp,num,4)){
                        this.doraCnt ++
                        let redCnt = 0
                        for(let i=0;i<4;i++){
                            redCnt += this._getPai(tp,num).redCnt
                        }

                        const rt = new Block(BlockType.QUAD,tp,num,isOpen)
                        rt.redCnt = redCnt
                        return rt
                    }
                }
                else{
                    if(this._canGetPai(tp,num,3)){
                        let redCnt = 0
                        for(let i=0;i<3;i++){
                            redCnt += this._getPai(tp,num).redCnt
                        }

                        const rt = new Block(BlockType.TRI,tp,num,true)
                        rt.redCnt = redCnt
                        return rt
                    }
                }
            }
            else{
                const num = randInt(2,7) as PaiNum
                if(this._canGetTri(tp,num)){
                    let redCnt = 0
                    for(let i=0;i<3;i++){
                        redCnt += this._getPai(tp,num+i).redCnt
                    }
                    const rt = new Block(BlockType.SEQ,tp,num,true)
                    rt.redCnt = redCnt
                    return rt
                }
            }
        }
    }

    _generateYakuhaiFuru(){
        const yakuHais = [this.field+1,this.seat+1,5,6,7]
        shuffle(yakuHais)

        for(const x of yakuHais){
            const num = x as PaiNum
            const tp = 'z'
            if(this._testChance(this.quadChance)){
                let isOpen = true
                if(this._testChance(this.closeQuadChance)){
                    isOpen = false
                }

                if(this._canGetPai(tp,num,4)){
                    this.doraCnt ++
                    let redCnt = 0
                    for(let i=0;i<4;i++){
                        redCnt += this._getPai(tp,num).redCnt
                    }

                    const rt = new Block(BlockType.QUAD,tp,num,isOpen)
                    rt.redCnt = redCnt
                    return rt
                }
            }
            else{
                if(this._canGetPai(tp,num,3)){
                    let redCnt = 0
                    for(let i=0;i<3;i++){
                        redCnt += this._getPai(tp,num).redCnt
                    }

                    const rt = new Block(BlockType.TRI,tp,num,true)
                    rt.redCnt = redCnt
                    return rt
                }
            }
        }
        return this._generateRandomFuru()
    }

    _getRandomPai(){
        for(;;){
            const tp = "mspz"[randInt(0,4)] as PaiType
            let num;
            if(tp=='z'){
                num = randInt(1,8) as PaiNum
            }
            else{
                num = randInt(1,10) as PaiNum
            }

            if(this._canGetPai(tp,num))return this._getPai(tp,num)
        }
    }

    _canGetPai(tp:PaiType,n:PaiNum,cnt=1){
        return this.paiLeft[tp][n]>=cnt
    }

    _getPai(tp:PaiType,n:PaiNum){
        if(n==5 && this.akaDoraLeft[tp] >=1 && tp!='z'){
            if(this._testChance(this.akaDoraChance)||
            this.akaDoraLeft[tp]>=this.paiLeft[tp][n]){
                this.akaDoraLeft[tp]--
                this.paiLeft[tp][n]--
                const rt = new Pai(tp,n)
                rt.redCnt = 1
                return rt
            }
        }
        this.paiLeft[tp][n]--
        const rt = new Pai(tp,n)
        rt.redCnt = 0
        return rt
    }

    _testChance(chance:number){
        return Math.random()<chance
    }
}
import {EMPTY_WIND,TSUMO,Result,IPPATSU,HOUTEI_RAOYUI,HAITEI_RAOYUE,RON,SEQ,RINNSHANN_KAIHOU,Calculator,State,NOMI,Pai,QUAD,RIICHI,TRI,DOUBLE_RIICHI,Block} from "./calc"

function shuffle(arr){
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

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

class Problem{
    constructor(){
        this.hand = []
        this.agariPai = new Pai('z',1)
        this.furu = []
        this.dora = []
        this.ura = []
        this.flag = 0
        this.ans =  new Result()
    }
    calculateResult(){
        let cnt = 0
        for(const p of this.hand){
            if(p.redCnt != undefined){
                cnt += p.redCnt
            }
        }
        for(const p of this.furu){
            if(p.redCnt != undefined){
                cnt += p.redCnt
            }
        }
        cnt+=this.agariPai.redCnt;
        let s = new State(EMPTY_WIND,EMPTY_WIND,[],NOMI,this.hand,this.furu,
            this.dora,this.ura,this.agariPai,cnt)
        s.flag = this.flag

        let c = new Calculator()
        this.ans = c.calculate(s)
    }
}

export class ProblemGenerator{
    constructor(rule){
        this.rule=rule;

        this.tsumoChance = 0.4
        this.callChance = 0.5
        this.riichiChance = 0.2
        this.doubleRiichiChance = 0.01
        this.ippastsuChance = 0.01
        this.haiteiHouteiChance = 0.01
        this.rinnshannKaihouChance = 0.01
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

        this.field = EMPTY_WIND
        this.seat = EMPTY_WIND

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
        

        let field = randInt(0,2)
        let seat  = randInt(0,4)

        let agariWay;
        if(this._testChance(this.tsumoChance)){
            agariWay = TSUMO
        }
        else{
            agariWay = RON
        }

        
        let yakus = []
        let hand = []
        let dora = []
        let ura = []
        let furu = []
    
        if(this._testChance(this.kokushiChance)){
            let kokushiHand = [ new Pai('s',1),
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
            shuffle(kokushiHand)
            kokushiHand.push(kokushiHand[kokushiHand.length-1])
            hand = kokushiHand
        }
        else if(this._testChance(this.chituiChance)){
            for(let tuiCnt = 0; tuiCnt<7;){
                let tp = "mspz"[randInt(0,4)]
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
                let wantTanyao = this._testChance(0.5) && this.rule.shiDuan

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
                let wantTanyao = this._testChance(0.2)
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

        hand.sort()
        let agariIndex = randInt(0,hand.length)

        // console.log(JSON.parse(JSON.stringify(hand)))
        let agariPai = hand.splice(agariIndex,1)[0]
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

        // console.log("hand",JSON.parse(JSON.stringify(hand)))
        // console.log("field,seat:",field,seat)
        let s = new State(field,seat,yakus,agariWay,hand,furu,dora,ura,agariPai,cnt)
        let rt = new Problem()
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

    _canGetTri(tp,num){
        return this._canGetPai(tp,num)&&this._canGetPai(tp,num+1)&&this._canGetPai(tp,num+2)
    }

    _generateTanyaoBlock(){
        let success = false
        let rt = []

        do{
            let tp = "msp"[randInt(0,3)]
            if(this._testChance(this.tripletChance)){
                let num = randInt(2,9)
                if(this._canGetPai(tp,num,3)){
                    success = true
                    rt.push(this._getPai(tp,num))
                    rt.push(this._getPai(tp,num))
                    rt.push(this._getPai(tp,num))
                }
            }
            else{
                let num = randInt(2,7)
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
        let yakuHais = [this.field+1,this.seat+1,5,6,7]
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
        
        let rt = []

        do{
            let tp = "mspz"[randInt(0,4)]
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
                let num = randInt(1,8)
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
        let rt = []
        do{
            let tp = "msp"[randInt(0,3)]
            let num = randInt(2,9)
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
        let yakuHais = [this.field+1,this.seat+1,5,6,7]
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
        let rt = []
        do{
            let tp = "mspz"[randInt(0,4)]
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
            let tp = "mspz"[randInt(0,4)]
            if(this._testChance(this.tripletChance) || tp == 'z'){
                let num;
                if(tp=='z'){
                    num = randInt(1,8)
                }
                else{
                    num = randInt(1,10)
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

                        let rt = new Block(QUAD,tp,num,isOpen)
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

                        let rt = new Block(TRI,tp,num,true)
                        rt.redCnt = redCnt
                        return rt
                    }
                }
            }
            else{
                let num = randInt(1,8)
                if(this._canGetTri(tp,num)){
                    let redCnt = 0
                    for(let i=0;i<3;i++){
                        redCnt += this._getPai(tp,num+i).redCnt
                    }
                    let rt = new Block(SEQ,tp,num,true)
                    rt.redCnt = redCnt
                    return rt
                }
            }
        }
    }

    _generateTanyaoFuru(){
        for(;;){
            let tp = "msp"[randInt(0,3)]
            if(this._testChance(this.tripletChance)){
                let num = randInt(2,9)

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

                        let rt = new Block(QUAD,tp,num,isOpen)
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

                        let rt = new Block(TRI,tp,num,true)
                        rt.redCnt = redCnt
                        return rt
                    }
                }
            }
            else{
                let num = randInt(2,7)
                if(this._canGetTri(tp,num)){
                    let redCnt = 0
                    for(let i=0;i<3;i++){
                        redCnt += this._getPai(tp,num+i).redCnt
                    }
                    let rt = new Block(SEQ,tp,num,true)
                    rt.redCnt = redCnt
                    return rt
                }
            }
        }
    }

    _generateYakuhaiFuru(){
        let yakuHais = [this.field+1,this.seat+1,5,6,7]
        shuffle(yakuHais)

        for(const x of yakuHais){
            let num=x
            let tp = 'z'
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

                    let rt = new Block(QUAD,tp,num,isOpen)
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

                    let rt = new Block(TRI,tp,num,true)
                    rt.redCnt = redCnt
                    return rt
                }
            }
        }
        return this._generateRandomFuru()
    }

    _getRandomPai(){
        for(;;){
            let tp = "mspz"[randInt(0,4)]
            let num;
            if(tp=='z'){
                num = randInt(1,8)
            }
            else{
                num = randInt(1,10)
            }

            if(this._canGetPai(tp,num))return this._getPai(tp,num)
        }
    }

    _canGetPai(tp,n,cnt=1){
        return this.paiLeft[tp][n]>=cnt
    }

    _getPai(tp,n){
        if(n==5 && this.akaDoraLeft[tp] >=1 && tp!='z'){
            if(this._testChance(this.akaDoraChance)||
            this.akaDoraLeft[tp]>=this.paiLeft[tp][n]){
                this.akaDoraLeft[tp]--
                this.paiLeft[tp][n]--
                let rt = new Pai(tp,n)
                rt.redCnt = 1
                return rt
            }
        }
        this.paiLeft[tp][n]--
        let rt = new Pai(tp,n)
        rt.redCnt = 0
        return rt
    }

    _testChance(chance){
        return Math.random()<chance
    }
}
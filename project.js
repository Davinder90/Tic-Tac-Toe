const btns = document.querySelectorAll(".block");

// output display content
const userWin = document.getElementById("userwin");
const computerWin = document.getElementById("computerwin");
const tieMatches = document.getElementById("tie");
const nMatches = document.getElementById("match");
let usercount = 0;
let computercount = 0;
let tie = 0;
let matches = 0;

// logical 
let Matrix = [[".",".","."],[".",".","."],[".",".","."]]
let matchFlag = false;
let computerTurn = true;

btns.forEach(button => {
    button.addEventListener("mouseover",event =>{
        event.target.classList.add("hover");
    });
});


btns.forEach(button => {
    button.addEventListener("mouseout",event =>{
        event.target.classList.remove("hover");
    });
});

const handleButton = async (bt_Num) => {
    bt_num = parseInt(bt_Num);
    
    const row = Math.floor((bt_Num - 1) / 3);
    const col = (bt_Num - 1) % 3;

    if(Matrix[row][col] == "." && !matchFlag){
        await addElement("X",bt_Num,row,col);
    }

    else if(matchFlag){
        await removeAllvalues();
        if(!computerTurn){
            computerTurn = true;
        }
    }

    else if (!Matrix[0].includes('.') && !Matrix[1].includes('.') && !Matrix[2].includes('.')){
        matches += 1
        tie += 1
        await removeAllvalues();
        await displayOutput();
    }
}

async function addElement(elementValue,bt_Num,row,col){
    // userpart
    const button = document.getElementById(`block${bt_Num}`);
    const Element = document.createElement("p");
    Element.textContent = elementValue;
    Element.classList.add("valueDesign");
    await button.append(Element);
    Matrix[row][col] = elementValue;
    const blocks = await check(row,col,bt_Num,Matrix,elementValue,3);
    if(blocks){
        matchFlag = true;
        usercount += 1;
        matches += 1
        assignColor(blocks,"user");
        displayOutput();
    }

    // computer part 
    if(!matchFlag){
        await computer()
    }
}

const computer = async () => {
    let randomNum = await findRand();
    if(!matchFlag){
       await computerBlock("0",randomNum);
       let row = Math.floor((randomNum - 1) / 3);
       let col = (randomNum - 1) % 3;
       Matrix[row][col] = "0";

       const computerblocks = await check(row,col,randomNum,Matrix,"0",3);
       if(computerblocks){
          matchFlag = true;
          computercount += 1;
          matches += 1
          assignColor(computerblocks,"computer");
          displayOutput();
       }
    }
}

function assignColor(arr,Class){
    for(let index = 0;index < arr.length;index++){
        const button = document.getElementById(`block${arr[index]}`);
        button.firstElementChild.classList.add(Class);
    }
}

function findRand(){
    let Num;
    while(true){
        Num = Math.floor(Math.random() * 9 + 1);
        let row = Math.floor((Num - 1) / 3);
        let col = (Num - 1) % 3;
        if(Matrix[row][col] == "."){
            break
        }
    }
    return Num;
}

const computerBlock = (elementValue,bt_Num) => {
    const button = document.getElementById(`block${bt_Num}`);
    const Element = document.createElement("p");
    Element.textContent = elementValue;
    Element.classList.add("valueDesign");
    button.append(Element);
}


function check(row,col,Number,Matrix,value,len){
    let counter = [];
    // row traverse
    for(let tempcol = 0;tempcol < len;tempcol++){
        if(Matrix[row][tempcol] != value){
            break
        }
        counter.push(tempcol + (row * 3) + 1);
    }

    if(counter.length == 3){
        return counter
    }
    else{
        counter = []
    }

    // column traverse
    for(let temprow = 0;temprow < len;temprow++){
        if(Matrix[temprow][col] != value){
            break;
        }
        counter.push(col + (temprow * 3) + 1);
    }

    if(counter.length == 3){
        return counter
    }
    else{
        counter = []
    }

    // left upper or right bottom or center
    if((row == 0 && col == 0) || Number == 5 || (row == 2 && col == 2)){
        let temprow = 0;
        for(let tempcol = 0;tempcol < len;tempcol++){
            if(Matrix[temprow][tempcol] != value){
                break;
            }
            counter.push(tempcol + (temprow * 3) + 1);
            temprow += 1;
        }
    }
    
    if(counter.length == 3){
        return counter;
    }
    else{
        counter = []
    }

    // left bottom or right upper or center
    if((row == 2 && col == 0) || Number == 5 || (row == 0 && col == 2)){
        let temprow = 0;
        for(let tempcol = 2;tempcol >= 0;tempcol--){
            if(Matrix[temprow][tempcol] != value){
                break;
            }
            counter.push(tempcol + (temprow * 3) + 1);
            temprow += 1
        }
    }
    if(counter.length == 3){
        return counter
    }
    return false
}

function displayOutput(){
    userWin.textContent = `User Wins : ${usercount}`;
    computerWin.textContent = `Computer Wins : ${computercount}`;
    tieMatches.textContent = `Tie Matches : ${tie}`; 
    nMatches.textContent = `No of Matches : ${matches}`;
}

async function removeAllvalues(){
    await btns.forEach(button => {
        if(button.firstElementChild){
            btnpara = button.firstElementChild;
            button.removeChild(btnpara);
        }
    })
    matchFlag = false;
    Matrix = [[".",".","."],[".",".","."],[".",".","."]]
    if(computerTurn){
        await computer();
        computerTurn = false;
    }
}




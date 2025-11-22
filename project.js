const btns = document.querySelectorAll(".block");

// output display content
const userWin = document.getElementById("userwin");
const computerWin = document.getElementById("computerwin");
const tieMatches = document.getElementById("tie");
const nMatches = document.getElementById("match");
let usercount = 0,
  computercount = 0,
  tiecount = 0,
  matches = 0;
let matchFlag = false,
  computerTurn = false;

// logical
let Matrix = [
  [".", ".", "."],
  [".", ".", "."],
  [".", ".", "."],
];

btns.forEach((button) => {
  button.addEventListener("mouseover", (event) => {
    event.target.classList.add("hover");
  });
});

btns.forEach((button) => {
  button.addEventListener("mouseout", (event) => {
    event.target.classList.remove("hover");
  });
});

// user click
const handleButton = async (bt_Num) => {
  bt_num = parseInt(bt_Num);
  const row = Math.floor((bt_Num - 1) / 3);
  const col = (bt_Num - 1) % 3;
  if (Matrix[row][col] == "." && !matchFlag) {
    await addUserElement("X", bt_Num, row, col);
  } else if (matchFlag) {
    await removeAllvalues();
    if (computerTurn) computer();
  } else if (!checkEmptyBlock()) {
    updateResult(0, 0, 1);
    await removeAllvalues();
  }
};

// check if block is avail or not
const checkEmptyBlock = () => {
  if (
    Matrix[0].includes(".") ||
    Matrix[1].includes(".") ||
    Matrix[2].includes(".")
  )
    return true;
  return false;
};

// add the classes to button
const addValueToButton = (elementValue, bt_Num) => {
  const button = document.getElementById(`block${bt_Num}`);
  const Element = document.createElement("p");
  Element.textContent = elementValue;
  Element.classList.add("valueDesign");
  button.append(Element);
};

// update the result on screen
async function displayOutput() {
  userWin.textContent = `User Wins : ${usercount}`;
  computerWin.textContent = `Computer Wins : ${computercount}`;
  tieMatches.textContent = `Tie Matches : ${tiecount}`;
  nMatches.textContent = `No of Matches : ${matches}`;
}

// udpate result
const updateResult = async (user, computer, tie) => {
  matchFlag = true;
  usercount += user;
  computercount += computer;
  tiecount += tie;
  matches += 1;
  await displayOutput();
};

// remove the all values
async function removeAllvalues() {
  btns.forEach((button) => {
    if (button.firstElementChild) {
      btnpara = button.firstElementChild;
      button.removeChild(btnpara);
    }
  });
  matchFlag = false;
  Matrix = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
  ];
  computerTurn = !computerTurn;
}

// assign the color
async function assignColor(arr, Class) {
  for (let index = 0; index < arr.length; index++) {
    const button = document.getElementById(`block${arr[index]}`);
    button.firstElementChild.classList.add(Class);
  }
}

// user cliks the button to add x
async function addUserElement(elementValue, bt_Num, row, col) {
  addValueToButton(elementValue, bt_Num, row, col);
  Matrix[row][col] = elementValue;
  const blocks = await check(row, col, bt_Num, Matrix, elementValue, 3);
  if (blocks) {
    await assignColor(blocks, "user");
    updateResult(1, 0, 0);
  } else {
    if (checkEmptyBlock()) {
      computer();
    } else {
      matchFlag = true;
    }
  }
}

async function findBlock(Matrix) {
  const table = new Map();

  // ---- Row checks ----
  for (let r = 0; r < Matrix.length; r++) {
    let count = 0;
    for (let c = 0; c < Matrix.length; c++) {
      if (Matrix[r][c] === "X") count++;
    }
    if (!table.has(count)) table.set(count, []);
    table.get(count).push(["row", r]);
  }

  // ---- Column checks ----
  for (let c = 0; c < Matrix.length; c++) {
    let count = 0;
    for (let r = 0; r < Matrix.length; r++) {
      if (Matrix[r][c] === "X") count++;
    }
    if (!table.has(count)) table.set(count, []);
    table.get(count).push(["col", c]);
  }

  // ---- Left diagonal (top-left → bottom-right) ----
  let ldCount = 0;
  for (let i = 0; i < Matrix.length; i++) {
    if (Matrix[i][i] === "X") ldCount++;
  }
  if (!table.has(ldCount)) table.set(ldCount, []);
  table.get(ldCount).push(["ld", 0]);

  // ---- Right diagonal (top-right → bottom-left) ----
  let rdCount = 0;
  let n = Matrix.length;
  for (let i = 0; i < n; i++) {
    if (Matrix[i][n - 1 - i] === "X") rdCount++;
  }
  if (!table.has(rdCount)) table.set(rdCount, []);
  table.get(rdCount).push(["rd", 0]);
  let maxThreat = Math.max(...table.keys());
  return getBlockingMove(Matrix, table, maxThreat);
}

function getBlockingMove(Matrix, table, maxThreat) {
  // Find the max threat (largest number of X's)
  let threats = table.get(maxThreat);

  for (let [type, index] of threats) {
    if (type === "row") {
      let r = index;
      for (let c = 0; c < Matrix.length; c++) {
        if (Matrix[r][c] === ".") return [r, c];
      }
    }

    if (type === "col") {
      let c = index;
      for (let r = 0; r < Matrix.length; r++) {
        if (Matrix[r][c] === ".") return [r, c];
      }
    }

    if (type === "ld") {
      for (let i = 0; i < Matrix.length; i++) {
        if (Matrix[i][i] === ".") return [i, i];
      }
    }

    if (type === "rd") {
      let n = Matrix.length;
      for (let i = 0; i < n; i++) {
        if (Matrix[i][n - 1 - i] === ".") return [i, n - 1 - i];
      }
    }
  }
  return getBlockingMove(Matrix, table, maxThreat - 1);
}

const computer = async () => {
  const block = await findBlock(Matrix);
  let Num = block[0] * 3 + block[1] + 1;
  addValueToButton("0", Num);
  Matrix[block[0]][block[1]] = "0";

  const blocks = await check(block[0], block[1], Num, Matrix, "0", 3);
  if (blocks) {
    await assignColor(blocks, "computer");
    updateResult(0, 1, 0);
  }
};

async function check(row, col, Number, Matrix, value, len) {
  let counter = [];
  // row traverse
  for (let tempcol = 0; tempcol < len; tempcol++) {
    if (Matrix[row][tempcol] != value) break;
    counter.push(tempcol + row * 3 + 1);
  }
  if (counter.length == 3) return counter;
  counter = [];

  // column traverse
  for (let temprow = 0; temprow < len; temprow++) {
    if (Matrix[temprow][col] != value) break;
    counter.push(col + temprow * 3 + 1);
  }

  if (counter.length == 3) return counter;
  counter = [];

  // left upper or right bottom or center
  if ((row == 0 && col == 0) || Number == 5 || (row == 2 && col == 2)) {
    let temprow = 0;
    for (let tempcol = 0; tempcol < len; tempcol++) {
      if (Matrix[temprow][tempcol] != value) {
        break;
      }
      counter.push(tempcol + temprow * 3 + 1);
      temprow += 1;
    }
  }

  if (counter.length == 3) return counter;
  counter = [];

  // left bottom or right upper or center
  if ((row == 2 && col == 0) || Number == 5 || (row == 0 && col == 2)) {
    let temprow = 0;
    for (let tempcol = 2; tempcol >= 0; tempcol--) {
      if (Matrix[temprow][tempcol] != value) {
        break;
      }
      counter.push(tempcol + temprow * 3 + 1);
      temprow += 1;
    }
  }
  if (counter.length == 3) return counter;
  return false;
}

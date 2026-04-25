function deepCopy(grid) {
return grid.map(row => [...row])
}

// ===== Sudoku =====
export function createSudoku(input) {
let grid = deepCopy(input)

return {
getGrid,
guess,
clone,
toJSON,
toString,
getCandidates,
getSingleCandidates,
isConflict
}

function getGrid() {
return deepCopy(grid)
}

function guess({ row, col, value }) {
grid[row][col] = value
}

function clone() {
return createSudoku(deepCopy(grid))
}

function toJSON() {
return { grid: deepCopy(grid) }
}

function toString() {
return grid.map(row => row.join(" ")).join("\n")
}

// ===== Hint =====
function getCandidates(row, col) {
if (grid[row][col] !== 0) return []

```
let s = new Set([1,2,3,4,5,6,7,8,9])

for (let i=0;i<9;i++){
  s.delete(grid[row][i])
  s.delete(grid[i][col])
}

let sr = Math.floor(row/3)*3
let sc = Math.floor(col/3)*3

for (let i=0;i<3;i++){
  for (let j=0;j<3;j++){
    s.delete(grid[sr+i][sc+j])
  }
}

return Array.from(s)
```

}

function getSingleCandidates() {
let res = []

```
for (let r=0;r<9;r++){
  for (let c=0;c<9;c++){
    if (grid[r][c]===0){
      let cands = getCandidates(r,c)
      if (cands.length===1){
        res.push({row:r,col:c,value:cands[0]})
      }
    }
  }
}

return res
```

}

function isConflict() {
for (let i=0;i<9;i++){
let row = new Set()
let col = new Set()

```
  for (let j=0;j<9;j++){
    let r = grid[i][j]
    let c = grid[j][i]

    if (r && row.has(r)) return true
    if (c && col.has(c)) return true

    row.add(r)
    col.add(c)
  }
}

return false
```

}
}

// ===== Game =====
export function createGame({ sudoku }) {
let history = [sudoku.clone()]
let pointer = 0

let mode = "normal"
let exploreSnapshot = null
let failedStates = new Set()

return {
getSudoku,
guess,
undo,
redo,
canUndo,
canRedo,
hint,
enterExplore,
abandonExplore,
commitExplore
}

function getSudoku() {
return history[pointer]
}

function guess(move) {
let newSudoku = getSudoku().clone()
newSudoku.guess(move)

```
if (mode === "explore") {
  let state = JSON.stringify(newSudoku.getGrid())

  if (failedStates.has(state)) {
    console.warn("这个路径已经失败过！")
  }

  if (newSudoku.isConflict()) {
    console.warn("探索失败！")
    failedStates.add(state)
  }
}

history = history.slice(0, pointer + 1)
history.push(newSudoku)
pointer++
```

}

function undo() {
if (pointer > 0) pointer--
}

function redo() {
if (pointer < history.length - 1) pointer++
}

function canUndo() {
return pointer > 0
}

function canRedo() {
return pointer < history.length - 1
}

function hint() {
return getSudoku().getSingleCandidates()
}

function enterExplore() {
if (mode === "explore") return
mode = "explore"
exploreSnapshot = getSudoku().clone()
}

function abandonExplore() {
if (mode !== "explore") return
history = [exploreSnapshot.clone()]
pointer = 0
mode = "normal"
}

function commitExplore() {
mode = "normal"
exploreSnapshot = null
}
}

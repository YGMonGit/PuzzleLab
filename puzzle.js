let iChoice=1, img, gameHeight, gameWidth, size=3, height, width, cHeight, cWidth, timer, moveCount = 0, moveAllowed = 0, totalSeconds = 0, puzzle = [], start = 1, defaultD = 1

var audio = new Audio('applause.mp3')
var audioMenu = new Audio('menu.mp3')
var audioGame = new Audio('game.mp3')
audioMenu.loop = true
audioMenu.volume = 0.3
const up = document.getElementById('up')
const val = document.getElementById('val')
const down = document.getElementById('down')
const image = document.getElementsByClassName('img')
const puzzle_item_value = document.getElementsByClassName('puzzle-item-value')
const frontPage = document.getElementById('frontPage')
const game = document.getElementById('game')
const puzzleContainer = document.getElementById("gameBox")
const toMenu = document.getElementById('toMenu')
const minutesLabel = document.getElementById("minutes")
const secondsLabel = document.getElementById("seconds")
const move = document.getElementById('move')
const win = document.getElementById('win')
const restart = document.getElementById('restart')
const gameStart = document.getElementById('gameStart')

function shrinkVal(){
    val.style.fontSize = "3em"
}

toMenu.addEventListener('click', function(){
    location.reload()
})

up.addEventListener('click', function(){
    defaultD = 0
    shrinkVal()
    if(size < 10){
        ++size
        val.innerHTML = size
    }
})

down.addEventListener('click', function(){
    defaultD = 0
    shrinkVal()
    if(size > 2){
        --size
        val.innerHTML = size
    }
})



restart.addEventListener('click', function(){
    totalSeconds = 0
    start = 1
    moveCount = 0
    moveAllowed = 0
    minutesLabel.innerHTML = "00"
    secondsLabel.innerHTML = "00"
    puzzleContainer.style.backgroundImage = "unset"
    move.innerHTML = "Move: "+moveCount
    win.style.visibility = "hidden"
    clearInterval(timer)
    rand()
    gameStart.style.display = "flex"
    game.style.backgroundImage = "unset"
})

gameStart.addEventListener('click', function(){
    timer = setInterval(setTime, 1000)
    moveAllowed = 1
    gameStart.style.display = "none"
})

for (let i = 0; i < image.length; i++) {
    image[i].addEventListener('click', function(){
        audioMenu.play()
        if(defaultD === 1){
            size = 3
        }
        else{
            size = parseInt(val.innerHTML)
        }
        game.style.display = 'flex'
        frontPage.style.display = 'none'
        iChoice = i+1
        img = new Image()
        img.src = `i${iChoice}.jpg`
        gameHeight = img.height
        gameWidth = img.width
        height = 400
        width = gameWidth * height/gameHeight
        cHeight = height/size
        cWidth = width/size
        puzzleContainer.style.height = `${height+2}px`
        puzzleContainer.style.width = `${width+2}px`
        console.log(cHeight, cWidth)
        generatePuzzle()
        renderPuzzle()
        rand()
        handleInput()
    })
}
        
function getRow(pos) {
    return Math.ceil(pos / size)
}

function getCol(pos) {
    const col = pos % size
    if (col === 0) {
        return size
    }
    return col
}

function rand(){
    const puzzleWithValueOf9 = puzzle.find((item) => item.value === size * size)
    puzzleWithValueOf9.disabled = true

    for (let i = 0; i < 1000; i++) {
        let temp = Math.ceil(Math.random() * 4)
        if(temp == 1){
            moveLeft()
        }else if(temp == 2){
            moveUp()
        }else if(temp == 3){
            moveRight()
        }else{
            moveDown()
        }
    }

    start = 0
    renderPuzzle()
}

function generatePuzzle() {
    for (let i = 1; i <= size * size; i++) {
        puzzle.push({
            value: i,
            position: i,
            x: (getCol(i) - 1) * cWidth,
            y: (getRow(i) - 1) * cHeight,
            disabled: false,
        })
    }
}

function renderPuzzle() {
    puzzleContainer.innerHTML = ""
    let j = 1
    for (let puzzleItem of puzzle) {
        if (puzzleItem.disabled) continue
        puzzleContainer.innerHTML += `
            <div class="puzzle-item" style="left: ${puzzleItem.x}px; top: ${puzzleItem.y}px; background-image: url(${img.src});">
                <div class="puzzle-item-value">
                    ${puzzleItem.value}
                </div>
            </div>
        `
        j++
    }
    
    if(checkGameOver() && start == 0){
        moveAllowed = 0;
        puzzleContainer.innerHTML = ""
        puzzleContainer.style.backgroundImage = `url(${img.src})`
        win.style.visibility = "visible"
        clearInterval(timer)
        game.style.backgroundImage = `url(${img.src})`
        audio.play()
    }

    let child = document.getElementsByClassName('puzzle-item')
    for (let i = 0; i < child.length; i++) {
        child[i].style.height = `${cHeight}px`
        child[i].style.width = `${cWidth}px`
        let left = cWidth * (i % size)
        let top = cHeight * (Math.floor(i / size))
        child[i].style.backgroundSize = `${width}px ${height}px`
        child[i].style.backgroundPosition = `-${left}px -${top}px`
    }
}

function checkGameOver(){
    for (let i = 0; i < puzzle.length; i++) {
        if(puzzle[i].value !== puzzle[i].position) return false                    
    }
    return true
}

function handleInput() {
    document.addEventListener("keydown", handleKeyDown)
}

function handleKeyDown(e) {
    // console.log(e.key)
    if(moveAllowed == 1){
        switch (e.key) {
            case "ArrowLeft":
                moveLeft()
                break
            case "ArrowRight":
                moveRight()
                break
            case "ArrowUp":
                moveUp()
                break
            case "ArrowDown":
                moveDown()
                break
        }
        renderPuzzle()
    }
}

function addMoveCount(){
    if(start === 0){
        moveCount+=1
        move.innerHTML = "Move: "+moveCount
    }
}

function moveLeft() {
    const emptyPuzzle = getEmptyPuzzle()
    const rightPuzzle = getRightPuzzle()
    if (rightPuzzle) {
        addMoveCount()
        swapPositions(emptyPuzzle, rightPuzzle, true)
    }
}

function moveRight() {
    const emptyPuzzle = getEmptyPuzzle()
    const leftPuzzle = getLeftPuzzle()
    if (leftPuzzle) {
        addMoveCount()
        swapPositions(emptyPuzzle, leftPuzzle, true)
    }
}

function moveUp() {
    const emptyPuzzle = getEmptyPuzzle()
    const belowPuzzle = getBelowPuzzle()
    if (belowPuzzle) {
        addMoveCount()
        swapPositions(emptyPuzzle, belowPuzzle, false)
    }
}

function moveDown() {
    const emptyPuzzle = getEmptyPuzzle()
    const abovePuzzle = getAbovePuzzle()
    if (abovePuzzle) {
        addMoveCount()
        swapPositions(emptyPuzzle, abovePuzzle, false)
    }
}

function swapPositions(firstPuzzle, secondPuzzle, isX = false) {
    // position swapping
    let temp = firstPuzzle.position
    firstPuzzle.position = secondPuzzle.position
    secondPuzzle.position = temp

    // x position swapping

    if (isX) {
        temp = firstPuzzle.x
        firstPuzzle.x = secondPuzzle.x
        secondPuzzle.x = temp
    } else {
        // must be y
        temp = firstPuzzle.y
        firstPuzzle.y = secondPuzzle.y
        secondPuzzle.y = temp
    }
}

function getRightPuzzle() {
    /* get the puzzle just right to the empty puzzle */
    const emptyPuzzle = getEmptyPuzzle()
    const isRightEdge = getCol(emptyPuzzle.position) === size
    if (isRightEdge) {
        return null
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position + 1)
    return puzzle
}

function getLeftPuzzle() {
    /* get the puzzle just left to the empty puzzle */
    const emptyPuzzle = getEmptyPuzzle()
    const isLeftEdge = getCol(emptyPuzzle.position) === 1
    if (isLeftEdge) {
        return null
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position - 1)
    return puzzle
}

function getAbovePuzzle() {
    /* get the puzzle just above to the empty puzzle */
    const emptyPuzzle = getEmptyPuzzle()
    const isTopEdge = getRow(emptyPuzzle.position) === 1
    if (isTopEdge) {
        return null
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position - size)
    return puzzle
}

function getBelowPuzzle() {
    /* get the puzzle just below to the empty puzzle */
    const emptyPuzzle = getEmptyPuzzle()
    const isBottomEdge = getRow(emptyPuzzle.position) === size
    if (isBottomEdge) {
        return null
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position + size)
    return puzzle
}

function getEmptyPuzzle() {
    return puzzle.find((item) => item.disabled)
}

function getPuzzleByPos(pos) {
    return puzzle.find((item) => item.position === pos)
}

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } 
    else {
        return valString;
    }
}


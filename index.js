const main = document.querySelector("main");
const home = document.querySelector("#home");
const frontPage = document.querySelector("#frontPage");
const gameEnd = document.querySelector("#gameEnd");

const newBestScore = document.querySelector("#newBestScore");
const inpName = document.querySelector("#inpName");
const subHiscore = document.querySelector("#subHiscore");

const data = document.querySelector("#data");
const nameList = document.querySelector("#nameList");
const scoreList = document.querySelector("#scoreList");

const nut = document.querySelector("#nut");

const lvlIndicator = document.querySelector("#lvlIndicator");
const imgEasy = document.querySelector("#imgEasy");
const imgNormal = document.querySelector("#imgNormal");
const imgHard = document.querySelector("#imgHard");

const hsIndicator = document.querySelector("#hsIndicator");
const easyHS = document.querySelector("#easyHS");
const normalHS = document.querySelector("#normalHS");
const hardHS = document.querySelector("#hardHS");

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let gameOn = false;
let yNut = 0;
let xNut = randomXnut();
let nutSpeed = 5;

let xPlayer = canvas.width/2 -30;
let score = 0;

let xBackgroundPos = 0;
let backgroundSpeed = 0.1;

let squirrel = imgNormal;
let squirrelWidth = 40;
let difficultLvl = 30;
let fix = 10;

let arr;
let nutzHS = "nutzHS";

checkLocalHS();
gameFrontPage();
writeHighscore();

//Hjem skjerm
function gameFrontPage(){
    frontPageAnimation()
    if(gameOn == false){
        requestAnimationFrame(gameFrontPage)
    }
}

//Beveger bakgrunn og nøtt
function frontPageAnimation(){
    xBackgroundPos += backgroundSpeed;

    canvas.style.backgroundPosition = xBackgroundPos + "px"
    ctx.clearRect(0,0,canvas.width, canvas.height)
    drawGameboard();
    ctx.fillStyle = "white";
    ctx.beginPath()
    ctx.drawImage(nut, xNut, yNut, 20, 35)
    ctx.closePath()
    
    if(yNut >= canvas.height){
        yNut = 0;
        xNut = randomXnut();
    }
    yNut += nutSpeed;
}

//Starter spillet
function startGame(){
    reset()
    frontPage.style.display = "none";
    gameEnd.style.display = "none";
    canvas.style.cursor = "none";
    gameOn = true;
    loop();
}

//Kjører spillet
function loop(){
    drawNut()
    getScore()
    gameOver()
    if(gameOn){
        requestAnimationFrame(loop)
    }  
}

//Tegner border på canvas
function drawGameboard(){
    ctx.strokeStyle = "white";
    ctx.strokeRect(0,0,canvas.width,canvas.height)
}

//Gir nøtten tilfeldig X verdi
function randomXnut(){
    let x = Math.floor(Math.random()* 280 )+10;
    return x;
}

//Tegner nøtten
function drawNut(){
    //Sletter hele canvasen hver gang funksjonen kjører 
    xBackgroundPos += backgroundSpeed;

    canvas.style.backgroundPosition = xBackgroundPos + "px";
    ctx.clearRect(0,0,canvas.width, canvas.height)
    drawPlayer();
    drawGameboard();
    //ballfarge
    ctx.fillStyle = "white";
    //Definerer ballen
    ctx.beginPath()
    ctx.drawImage(nut, xNut, yNut, 20, 35)
    ctx.closePath()
    //Ballen faller ned
    yNut += nutSpeed;
}

//Definerer spiller
function drawPlayer(){
    ctx.fillStyle = "red";
    ctx.beginPath()
    ctx.drawImage(squirrel, xPlayer, canvas.height-85, squirrelWidth, 80)
    ctx.closePath()
}

//Plasserer spillern der musa er
function movePlayer(evt){   
    
   if(evt.clientX > 500 || evt.clientX < 920){
        xPlayer = evt.clientX - 500;
   }
}

//Teller poeng 
function getScore(){
    ctx.font = "70px 'VT323'";
    ctx.fillStyle = "rgb(204, 76, 2)"
    ctx.fillText(score, canvas.width/2 -25, 50);
    //Sjekker om ballen treffer spillern og øker farten
    if(xNut > xPlayer - fix && xNut <= xPlayer + difficultLvl && yNut >= canvas.height -70){
        score++;
        yNut = 0;
        nutSpeed++;
        xNut = randomXnut()
    }
}

//Gameover når nøtten treffer bunn
function gameOver(){
    if(yNut >= canvas.height){
        yNut = -200;
        gameOn = false;
        gameEnd.style.display = "block";
        canvas.style.cursor = "pointer";
        //reset()
        ifNewBest()
    };
}

//Sjekker om det er en ny Highscore
function ifNewBest(){
    for(const i in arr){
        if(score > Number(arr[i].score)){
        newBestScore.style.display = "block";
    }}
}

//Henter navn på highscore holder og lager et obj med navn og score
function getName(){
    const obj = {name: inpName.value, score: score}
    return obj
}

//Traverserer highscore listen og legger inn score
function newBest(evt){
    evt.preventDefault();
    for(const i in arr){
        if(score > Number(arr[i].score)){
            newBestScore.style.display = "block"
            arr.splice(i, 0, getName())
            score = 0;        
            if(arr.length > 5){arr.length = 5};
            writeHighscore()
            reset()
            newBestScore.style.display = "none";
        }
    }
    localStorage.setItem(nutzHS, JSON.stringify(arr))
}

//Sjekker localstorage
function checkLocalHS(){
    //sjekker om highscore listen finnes i browseren
    if (localStorage.getItem(nutzHS)) {
        arr = JSON.parse(localStorage.getItem(nutzHS))
        
      } else {
            arr = [
                {name: "___", score: 0},
                {name: "___", score: 0},
                {name: "___", score: 0},
                {name: "___", score: 0},
                {name: "___", score: 0},
        ]
    }
}

//henter riktig Highscore fra Localstorage
function getHS(evt){
    if(evt.target == easyHS){
        hsIndicator.style.left = "25px";
        canvas.style.top = "8px";
        easyLvl()
    }else if(evt.target == hardHS){
        hsIndicator.style.left = "240px";
        canvas.style.top = "8px";
        hardLvl()
    }else{
        hsIndicator.style.left = "120px";
        normalLvl()
    }
    checkLocalHS()
    writeHighscore()
}

//Skriver ut Highscore
function writeHighscore(){
    nameList.innerHTML = "";
    scoreList.innerHTML = "";
    
    for(const i in arr){
        nameList.innerHTML += `<li>${arr[i].name}</li>`;
        scoreList.innerHTML += `<li>${arr[i].score}</li>`;
    }
}

//Reseter spillet
function reset(){
    nutSpeed = 5;
    yNut = 0;
    score = 0;
}

//Setter vanskelighetsgrad 
function chooseLvl(evt){

    if(evt.target == imgEasy){
        easyLvl()
    }else if(evt.target == imgHard){
        hardLvl()
    }else{
        normalLvl()
    }
    checkLocalHS()
    writeHighscore()
}

//Vanskelighetsgrad - Lett
function easyLvl(){
    squirrel = imgEasy;
    squirrelWidth = 70;
    difficultLvl = 45;
    fix = 5;
    imgEasy.className ="choosenSquirrel";
    imgHard.className ="";
    imgNormal.className ="";
    lvlIndicator.style.left = "65px";
    hsIndicator.style.left = "25px";
    nutzHS = "nutzHSEasy";
}

//Vanskelighetsgrad - Normal
function normalLvl(){
    squirrel = imgNormal
    squirrelWidth = 40;
    difficultLvl = 25;
    fix = 10;
    imgNormal.className ="choosenSquirrel";
    imgEasy.className ="";
    imgHard.className ="";
    lvlIndicator.style.left = "195px";
    hsIndicator.style.left = "120px";
    nutzHS = "nutzHS";
}

//Vanskelighetsgrad - Hard
function hardLvl(){
    squirrel = imgHard
    squirrelWidth = 20;
    difficultLvl = 10;
    fix = 10;
    imgHard.className ="choosenSquirrel";
    imgEasy.className ="";
    imgNormal.className ="";
    lvlIndicator.style.left = "322px";
    hsIndicator.style.left = "240px";
    nutzHS = "nutzHSHard";
}

//returnerer til Hjem skjerm
function goHome(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    gameFrontPage()
    gameEnd.style.display = "none";
    frontPage.style.display = "block";
}

home.addEventListener("click", goHome)

inpName.addEventListener("input", getName)

data.addEventListener("submit", newBest)
subHiscore.addEventListener("click", newBest)

imgEasy.addEventListener("click", chooseLvl)
imgNormal.addEventListener("click", chooseLvl)
imgHard.addEventListener("click", chooseLvl)

easyHS.addEventListener("click", getHS)
normalHS.addEventListener("click", getHS)
hardHS.addEventListener("click", getHS)

canvas.addEventListener("mousemove", movePlayer)
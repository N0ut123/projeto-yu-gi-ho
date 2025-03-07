

const state ={
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox: document.getElementById("score_points"),

    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides:{
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer:"computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
    actions:{
       button: document.getElementById("next-duel"),
    },
};


const cardData = [
    {
        id:0,
        name:"blue eyes white dragon",
        type: "Paper",
        Img: "./src/assets/icons/dragon.png",
        winOf:[1],
        loseOf:[2],
    },
    {
        id:1,
        name:"dark magician",
        type: "Rock",
        Img: "./src/assets/icons/magician.png",
        winOf:[2],
        loseOf:[0],
    },
    {
        id:2,
        name:"exodia",
        type: "Scissors",
        Img: "./src/assets/icons/exodia.png",
        winOf:[0],
        loseOf:[1],
    }
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random()* cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, feildSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(feildSide === state.playerSides.player1){

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });

        cardImage.addEventListener("click", () =>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function setCardsField(cardId){

   await removeAllCardsImages();
   let computerCardId = await getRandomCardId();

     await ShowHiddenCardFieldsImages(true);

     await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);

    let   duelResults = await checkDuelResults(cardId, computerCardId);
 
    await updateScore();
    await drawButton(duelResults);
}

async function updateScore(result){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].Img;
    state.fieldCards.computer.src = cardData[computerCardId].Img;
}

async function ShowHiddenCardFieldsImages(value){
    if(value ===  true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if(value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

 async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    }
    if(playerCard.loseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);
    return duelResults;
}

async function removeAllCardsImages(){
    let {computerBox, player1Box} = state.playerSides;
    let imgElemets = computerBox.querySelectorAll("img");
    imgElemets.forEach((img) => img.remove());

    imgElemets = player1Box.querySelectorAll("img");
    imgElemets.forEach((img) => img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].Img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attibute: "+ cardData[index].type;
 
}


async function drawCards(cardNumbers, feildSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard,feildSide);
       
        document.getElementById(feildSide).appendChild(cardImage);
    }
} 

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

try{
 audio.play();
}catch{}

}

function init(){
    ShowHiddenCardFieldsImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init ();

import images from './img/*.png';
console.log(images.barbie);

let myData;
let score = 1000;
let record = 0;
var card01;
var card02;
var counterCards = 0;
let flippedCards = 0;
var flaggame = false;
var card02img = 0;
var card01img = 0;
var moves = 0;

$( document ).ready(()=> {
    
    scoreing();
    recording();
    
    fetch("http://localhost:3000/memoryData")
        .then(result => {
            return result.json()
        })
        .then(data => {
        // Work with JSON data here
            myData = data;
            console.log(myData);
            createTable(myData); 
            $(".flip-card").click(
                
                function() {
                    if (!card01){
                        
                        setFirstCard($(this));
                        //setCorrectCard(card01, card01img, $(this));
                        return;
                    }
                    else {
                        setSecondCard($(this));
                        //setCorrectCard(card02, card02img, $(this));
                    }
                    if(card01!=false && card02!=false && flaggame){
                       
                        if (card01img == card02img){

                            blockMatchedCards();
                        }
                        else if (card01img != card02img || counterCards>2){                         
                            
                            flipWrongCards();
                            
                        }
                    }
                }
         
            );

        }
    );


    
    
}); 

/*
//the card variable can be either card01 either card02 in each turn
//the cardImg variable can be either card01img either card02img in each turn
function setCorrectCard(card, cardImg, clickedCard){ 
    card = clickedCard;
    moves++;
    $(card).css("pointer-events","none");
    counterCards++;
    clickedCard.addClass("flip-card-click");
    clickedCard.addClass("can-flip");
    console.log("Questa è card2");
    cardImg = clickedCard.children().children('.flip-card-back').children().attr('data-cardvalue');
    console.log(cardImg); 
    flaggame=true;
}

*/
function setFirstCard(clickedCard){
    card01 = clickedCard;
    moves++;
    $(card01).css("pointer-events","none");
    counterCards++;
    clickedCard.addClass("flip-card-click");
    clickedCard.addClass("can-flip");
    card01img = clickedCard.children().children('.flip-card-back').children().attr('data-cardvalue');
    console.log(card01img); 
    console.log(card01);
    flaggame=true;
}

function setSecondCard(clickedCard){
    card02 = clickedCard;
    moves++;
    $(card02).css("pointer-events","none");
    counterCards++;
    clickedCard.addClass("flip-card-click");
    clickedCard.addClass("can-flip");
    console.log("Questa è card2");
    card02img = clickedCard.children().children('.flip-card-back').children().attr('data-cardvalue');
    console.log(card02img); 
    flaggame=true;
}

function flipWrongCards(){
    console.log("card1 e card2 sono girate ma non sono uguali");
    checkLoser();
    counterCards =0; 

    $("#table").css("pointer-events","none");//third card fippable fixing PART1 - if users click third card before animation time (0.5s) third card can flip otherwise third card can't
    setTimeout(function(){
        $(".can-flip").removeClass("flip-card-click");
        $(".can-flip").removeClass(".can-flip");
        $(card01).css("pointer-events","auto");
        $(card02).css("pointer-events","auto");
        card01=false;
        card02=false;
        $("#table").css("pointer-events","auto"); //third card fippable fixing PART2
    }, 1450);
}

function blockMatchedCards(){
    console.log("card1 e card2 sono girate e sono uguali");
    $(".flip-card-click").removeClass("can-flip");
    $(".flip-card-click").removeClass("flip-card");
    $(".flip-card-click").addClass("flipped");
    $(card02).css("pointer-events","none");
    $(card01).css("pointer-events","none");
    card01=false;
    card02=false;
    flippedCards += 2;
    console.log(flippedCards);
    console.log(deck2.length);
    checkWinner();
    recording(); 
}


function scoreing(){
    var scoreText =  `<p class="font-weight-bold scoreP rounded">SCORE <br>${score}</p>`;
    var turnText = `<p class="font-weight-bold turnP rounded">TURN<br>${moves/2}</p>`;
    score-=5;
    $('.score').html(scoreText);
    $('.turn').html(turnText);
}

function checkLoser(){
    if (score<=0){
        var scoreText =  `<p class="font-weight-bold scoreP rounded">SCORE <br>0</p>`;
        $('.score').html(scoreText);
        if(alert('You\'re a loser man! \n Go Home!\nif you are brave click \'ok\' and play again')){}
        else window.location.reload(); 
    }
    else
        scoreing();
}

function recording(){
    record = localStorage.getItem('record');
    var recordText =  `<p class="font-weight-bold recordP rounded">RECORD <br>${record}</p>`;
    $('.record').html(recordText);
    
}

function checkWinner(){
    if(flippedCards>=deck2.length){
        if(score>record)
            record=score;
        localStorage.setItem('record', record);
        if(alert(`You\'re a Winner man! \n Your score is ${score}\nif you are brave click \'ok\' and play again.\nRemember to eat Bananas that contains potassium perfect for your memory!`)){}
        else window.location.reload();

    }
}
/*
function removeEmptyDivs(){
    if $(col-sm).haschild
}*/


function createTable(myData){
    //console.log(myData);
    let table = $('#table');
    //check if exist rows and columns
    if (myData.rowNum > 0 && myData.colNum > 0){
        //cycle for create empty rows
        for(var i =0; i<myData.rowNum; i++){
            
            var row = '<div class = "row rounded  row'+i+'">';

            $('.row'+i)
            // cycle for create columns
            for(var j =0; j<myData.colNum; j++){
                var col= '<div class = "col-sm rounded d-flex justify-content-center align-items-center col'+j+'"></div>';
                row += col;

            }
            row+='<div>';
            //fill each row with its columns
            table.append(row);
        }
        fillTable(myData);
    }
}

let deck2 = [];
function fillTable(myData){
    let table = $('#table');

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }
   
    //clone storage.deck in deck2      
    deck2 = myData.deck.slice();
    //shuffle deck2
    shuffle(deck2);

    for (var i=0; i < myData.deck.length; i++){

        var rowNum = myData.deck[i].rowPos;
        var colNum = myData.deck[i].colPos;

        var row = table.find('.row'+rowNum);
        var col = row.find('.col'+colNum)

        var randomCardIndex = deck2[i].cardName; //fill table with deck2 (deck2 is a shuffled copy of myData.deck)
        //console.log(randomCardIndex)
        var cardI = myData.deck[randomCardIndex-1].imgCode;

        var nameOfCard = images[cardI];

        var htmlCard =
            `<div class="container flip-card d-flex justify-content-center rounded">
                <div class="flip-card-inner rounded d-flex align-items-center">
                    <div class="flip-card-front rounded ">
                        <img class="rounded mx-auto d-block img-fluid" src="./dorso.e3878d79.png">
                    </div>
                    <div class="flip-card-back rounded">
                        <img data-cardvalue="`+nameOfCard+`" class="rounded mx-auto d-block img-fluid " src= .`+ nameOfCard +`>
                    </div>
                </div>
            </div>`;
       
        col.append(htmlCard);
    }
}


//align-items-center

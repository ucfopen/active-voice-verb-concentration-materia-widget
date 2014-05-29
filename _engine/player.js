(function() {
  Namespace('Concentration').Engine = (function() {
    console.log("YO");

//TODO:
var level = 1;
var game = false;

var matchQ = ["past _ have + -en + help", "pres + have + -en + work", "past + be + -ing + work", "pres + will + be + -ing + play", "past + be + -ing + be", "pres + be + -ing + have", "past + shall + have + -en + have", "past + have + -en + have", "past + can + -en + be", "pres + may + have + -en + be + -ing + try", "past + may + have + -en + be + -ing + be", "past + be + -ing + study", "pres + have + -en + find", "past + lose", "pres + have + -en + be + -ing + skip", "past + can + be", "past + crash", "pres + seem", "pres + will + be + -ing + have", "pres + may + be + -ing + graduate", "past + shall + have + -en + study"];
var matchA = ["had helped", "has worked", "was working", "will be playing", "was being", "is having", "should have had", "had had", "could have been", "may have been trying", "might have been being", "were studying", "have found", "lost", "has been skipping", "could be", "crashed", "seems", "will be having", "may be graduating", "should have studied"];
var setList = [];
var usedCards = [];
var score = [];

var stahp = false;

//timer data
var sec = 0;
var min = 0;
var hours = 0;
var timerId;
var updateTimer;  
console.log(updateTimer);

function tick(timerId) {
    if(timerId) return
    timerId = setInterval(tock, 1000);
    //immediately begin timer when you click the Start button
    tock(sec, min, hours);
  }  

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    stahp = true;
  }

  function tock() {
    if(stahp == false) {
      sec++;
    if(sec >= 60) {
      min++;
      sec = 0;
    }
    if(min >= 60) {
      hours++;
      min = 0;
    }

    var newTime = [hours, min, sec];

    for (var i = 0; i < newTime.length; i++) {
      //add a 0 in front of the digit
      // ex. 00:09:45
      if(newTime[i] <= 9) {
        newTime[i] = "0"+newTime[i];
      }      
    }
    newTime = newTime.join(":");
    updateTime(newTime, updateTimer);
    }
  }

function start(instance, qset, version) {
  $("#start").on("click", startGame);

  $(document).on("click", ".card", cardClick);

  updateTimer  = $("#timer");

  function startGame() {
    console.log("yep");
    if(!game) {
      game = true;
    //generate cards
    switch(level) {
      case 1:
      generateCards(4);
      console.log("The game has started");
      break;
      case 2:
      generateCards(6);
      break;
      case 3:
      generateCards(9);
      break;
      case 4:
      generateCards(12);
      break;
      case 5:
      generateCards(16);
      break;
    }      

    //start timer
    updateTimer.html("00:00:00");
    tick(timerId);
      }
    }
}

function updateTime(newTime, updateTimer) {
  updateTimer.html(newTime);
}

function generateCards(amount) {
  var maxNum = matchQ.length;
  var matchCards = (amount/2);
  while(matchCards--) {

      //randomly pick indeces that match the amount of cards
      //make sure there are no duplicates
      while(setList.length <= matchCards) {
        var ranNum = (Math.floor(Math.random()*(matchQ.length)));
        if(($.inArray(ranNum, setList)) == -1) {
          setList.push(ranNum);
        }
      }

    }

    while(amount--) {
      $("#game").append("<div class='cardPanel'><div class='card'></div><div class='back'><p></p></div></div>");
    }
    var width = $(".card").width();
    var newKitten = "url('assets/card_back.png')";
    $(".card").css("background", newKitten);

    //add used indeces from this level
    //so we don't re-use them in later levels
    // "discard pile"
    usedCards = usedCards.concat(setList);

    //shuffle cards
    shuffleArray(setList);

    var combined = [];

    for(var i = 0; i < setList.length; i++) {
      combined.push({
        'data' : matchQ[setList[i]],
        'isQuestion' : true,
        'index' : setList[i]
      });
    }

    for(var i = 0; i < setList.length; i++) {
      combined.push({
        'data' : matchA[setList[i]],
        'isQuestion' : false,
        'index' : setList[i]
      });
    }

    shuffleArray(combined);

    $(".card").each(function(index) {
      //assign data to cards
      $(this).data({
        "data" : combined[index].data,
        "isQuestion" : combined[index].isQuestion,
        "index" : combined[index].index
      });
    });

  }

//Fisher-Yates shuffle
function shuffleArray(array) {
  for(var i = array.length - 1; i > 0; i--) {
    var j =Math.floor(Math.random() *(i+1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// var wasQuestion = combined[dsknfs].isQuestion;

function cardClick(e) {
    var card = $(this);
    var passData = $(this).data();

    //flip old cards back over
    if($(".flip").length == 2) {
      $(".flip").removeClass("flip");
      console.log();
      $(".back p").empty();
    }

    var potentialWin = $("#timer").text();

    //flip what was clicked on
    card.toggleClass("flip");
    card.next().children().html(passData.data);

    cardHandler(card, potentialWin);
  }

  var won;
  function cardHandler(card, potentialWin) {
      //storing their score ASAP in case it is a win. No lag!
      console.log(potentialWin);
      console.log(card);

      //compare indeces for a match
      if( ($($(".flip")[0]).data("index")) == ($($(".flip")[1]).data("index")) ) {

          //check for win on last two cards
          if($(".card").length == 2) {
            console.log("last 2 cards, party time");
            score.push(potentialWin);
            console.log("win @: ", potentialWin);
            stahp = true;
            //add time to scoreboard
            $('#score_results').append("<tr class='score_row'><td class='level'>"+level+"</td><td class='score'>"+score[level-1]+"</td></tr>").hide().show('slow');
            //winning message somewhere!
          }

          //animations
          $(".flip").fadeOut("fast", function() {
            $(this).removeClass("flip card");
          });
          $(".flip").fadeIn("fast", function() {
            $(this).addClass("discardCard").removeAttr("style");
          });

          clearTimeout(won);
          
          won = setTimeout(function() {
            $(".back p").empty();
            console.log(won);
            if($(".card").length == 0) {
              win();
            }
          }, 4500);
        }
      }

  function win() {
    //remove old cards, increase level, reset timer
    $("#game").fadeOut(400, function(){
        $("#game").empty();
      });

    level++;
    clearInterval(timerId);
    timerId = null;
    //generate button to offer next level    
    $("#game").fadeIn("fast", function(){
        $(this).append("<p id='confirm'>Congrats! You did it. On to the next level...").hide().fadeIn(400);
        $('#confirm').on("click", function(){
            //show confirmation message 
             $("#confirm").fadeOut(200).empty();
             //generates cards based on the current level
             //levels will generate 2 times the level, plus 2 cards
              generateCards((level*2)+2);
              //lets the timer continue after new round is generated
              stahp = false;
        });

    });

    
  }


  return {
   start: start
 };

})();

}).call(this);


(function() {
  Namespace("Concentration").Engine = (function() {
    var level = 1;
    var game = false;

    //question and answer set
    var matchQ = [
      "past _ have + -en + help",
      "pres + have + -en + work",
      "past + be + -ing + work",
      "pres + will + be + -ing + play",
      "past + be + -ing + be",
      "pres + be + -ing + have",
      "past + shall + have + -en + have",
      "past + have + -en + have",
      "past + can + -en + be",
      "pres + may + have + -en + be + -ing + try",
      "past + may + have + -en + be + -ing + be",
      "past + be + -ing + study",
      "pres + have + -en + find",
      "past + lose",
      "pres + have + -en + be + -ing + skip",
      "past + can + be",
      "past + crash",
      "pres + seem",
      "pres + will + be + -ing + have",
      "pres + may + be + -ing + graduate",
      "past + shall + have + -en + study"
    ];

    var matchA = [
      "had helped",
      "has worked",
      "was working",
      "will be playing",
      "was being",
      "is having",
      "should have had",
      "had had",
      "could have been",
      "may have been trying",
      "might have been being",
      "were studying",
      "have found",
      "lost",
      "has been skipping",
      "could be",
      "crashed",
      "seems",
      "will be having",
      "may be graduating",
      "should have studied"
    ];

    var setList = [];
    var usedCards = [];
    var score = [];

    var stahp = false;
    var pair = 0;

    //timer data
    var sec = 0;
    var min = 0;
    var hours = 0;
    var timerId;
    var updateTimer;

    var themeColor = "red";
    var cardBack = "url('assets/redcard.png') no-repeat";

    var wonTimeout;

    //all the cool stuff that makes the timer work
    function tick(timerId) {
      if (timerId) return;
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
      if (stahp === false) {
        sec++;

        if (sec >= 60) {
          min++;
          sec = 0;
        }

        if (min >= 60) {
          hours++;
          min = 0;
        }

        var newTime = [hours, min, sec];

        for (var i = 0; i < newTime.length; i++) {
          //add a 0 in front of the digit
          // ex. 00:09:45
          if (newTime[i] <= 9) {
            newTime[i] = "0" + newTime[i];
          }
        }

        newTime = newTime.join(":");
        updateTime(newTime, updateTimer);
      }
    }

    function start(instance, qset, version) {
      $("#winning_visual").hide();
      $(document).on("click", "#start", startGame);
      $(document).on("click", ".card", cardClick);

      updateTimer = $("#timer");

      function startGame() {
        if (!game) {
          game = true;
          //generate cards
          switch (level) {
            case 1:
              generateCards(4);
              $("#start").fadeOut(300);
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
      var matchCards = amount / 2;
      while (matchCards--) {
        //randomly pick indeces that match the amount of cards
        //make sure there are no duplicates
        while (setList.length <= matchCards) {
          var ranNum = Math.floor(Math.random() * matchQ.length);
          if ($.inArray(ranNum, setList) == -1) {
            setList.push(ranNum);
          }
        }
      }

      while (amount--) {
        $("#game").append(
          "<div class='cardPanel'><div class='card'></div><div class='back'><p></p></div></div>"
        );
      }

      var width = $(".card").width();
      $(".card").css("background", cardBack);

      //add used indeces from this level
      //so we don't re-use them in later levels
      // "discard pile"
      usedCards = usedCards.concat(setList);

      //shuffle cards
      shuffleArray(setList);

      var combined = [];

      for (var i = 0; i < setList.length; i++) {
        combined.push({
          data: matchQ[setList[i]],
          isQuestion: true,
          index: setList[i]
        });
      }

      for (var i = 0; i < setList.length; i++) {
        combined.push({
          data: matchA[setList[i]],
          isQuestion: false,
          index: setList[i]
        });
      }

      shuffleArray(combined);

      $(".card").each(function(index) {
        //assign data to cards
        $(this).data({
          data: combined[index].data,
          isQuestion: combined[index].isQuestion,
          index: combined[index].index
        });
      });

      updateHeight()
    }

    function updateHeight(){
      var body = document.body
      var html = document.documentElement;
      var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

      Materia.Engine.setHeight(height)
    }

    //Fisher-Yates shuffle
    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }

    function cardClick(e) {
      var card = $(this);
      var passData = $(this).data();

      //flip old cards back over
      if ($(".flip").length == 2) {
        $(".flip").removeClass("flip");
        // $(".back p").empty();
      }

      var potentialWin = $("#timer").text();

      //flip what was clicked on
      card.toggleClass("flip");
      card
        .next()
        .children()
        .html(passData.data);
      cardHandler(card, potentialWin);
    }

    function cardHandler(card, potentialWin) {
      //compare indeces for a match
      if ($($(".flip")[0]).data("index") == $($(".flip")[1]).data("index")) {
        pair++;
        //chooses the next pair's hue, so that the colors dont end up looking too similar
        var hueSelector = [
          "red",
          "green",
          "yellow",
          "blue",
          "orange",
          "purple",
          "monochrome",
          "pink"
        ];
        //assigns the color to a variable, to be used when the pair is matched
        colorCode = randomColor({
          luminosity: "light",
          hue: hueSelector[pair - 1]
        });
        //check for win on last two cards
        if ($(".card").length == 2) {
          score.push(potentialWin);
          stahp = true;
        }

        //animations
        $(".flip").fadeOut("fast", function() {
          $(this).removeClass("flip card");
        });
        $(".flip").fadeIn("fast", function() {
          //color different pairs to corresponding matches
          //changes the css for the card once it is paired
          $(this)
            .parent()
            .css({ borderRadius: "14px", background: colorCode });
          //display winning graphic on match
        });

        clearTimeout(wonTimeout);

        wonTimeout = setTimeout(function() {
          if ($(".card").length === 0) {
            win();
          }
        }, 400);
      }
    }

    function win() {
      //add score to the scoreboard
      $("#score_results").append(
        "<tr class='score_row'><td class='level'>" +
          level +
          "</td><td class='score'>" +
          score[level - 1] +
          "</td></tr>"
      );
      //increase level, stop timer
      level++;
      clearInterval(timerId);
      timerId = null;
      //generate button to offer next level
      $("#game").fadeIn("fast", function() {
        $(this).append("<button id='confirm'>Next Level</button>");
        $("#confirm")
          .hide()
          .fadeIn(400)
          .on("click", function() {
            //clear confirmation so new level can generate
            //on game win...
            //empty the cards out
            $("#game").empty();
            $("#confirm")
              .fadeOut(200)
              .empty();
            pair = 0;

            //adjust game div to fit cards nicely
            switch (level) {
              case 2: // fall through
              case 5:
                $("#game").css("width", "560px");
                break;

              case 4:  // fall through
              case 6:
                $("#game").css("width", "975px");
                break;

              default:
                $("#game").css("width", "765px");
                break;
            }

            //stops game at the 8th level
            if (level <= 8) {
              //levels will generate 2 times the level, plus 2 cards
              generateCards(level * 2 + 2);
              //once new level generates, continue timer
              stahp = false;
            } else {
              stahp = true;
              $("#game").append(
                "<h1>Congrats! You have finished the game!</h1><p>Reload the page to play again.</p>"
              );
            }
          });
      });
      updateHeight()
    }

    return {
      start: start
    };
  })();
}.call(this));

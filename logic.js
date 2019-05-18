//GLOBAL VARIABLES=============================================================

//Screen size
let screenXsize = 640;
let screenXpixels = screenXsize + "px";
let screenYsize = 480;
let screenYpixels = screenYsize + "px";

//Movement incrementation
let moveLeftAmount = "-=50px";
let moveRightAmount = "+=50px";
let moveUpAmount = "-=50px";
let moveDownAmount = "+=50px";

//Sprite movement incrementation
let spaceShipSpeed = 50;
let asteroidSpeed = 20;

//Score and time
let score = 0;
let highScore = 0;
let secondCounter = 0;

//Collision variables
let damageFromAsteroidCollision = 30;
let dangerRange = 50;

//OBJECTS======================================================================

//#############################Player ship#############################
let playerShip = {
  health: 100,
  xposition: 0,
  yposition: screenYsize - 80,
  avatar: "playerShip.png",
  //Initial draw
  initialDraw: function() {
    $("#game-window").append('<img id="playerShip"></img>');
    $("#playerShip").attr("src", `${playerShip.avatar}`);

    $("#playerShip").css({ height: "50px" });
    $("#playerShip").css({ width: "50px" });
    $("#playerShip").css({ position: "absolute" });

    $("#playerShip").css({ left: "0px" });
    $("#playerShip").css({ top: playerShip.yposition });

    document.getElementById("playerxpositionIndicator").innerHTML =
      playerShip.xposition;
    document.getElementById("playerypositionIndicator").innerHTML =
      playerShip.yposition;
  },
  //Redraw player ship
  redraw: function() {
    $("#game-window").append('<img id="playerShip"></img>');
    $("#playerShip").attr("src", `${playerShip.avatar}`);
  },
  //Update health
  updateHealth: function() {
    document.getElementById("healthIndicator").innerHTML = playerShip.health;
    if (playerShip.health < 25) {
      playerShip.avatar = "playerShipCritical.png";
      playerShip.redraw();
    }
  }
};

//#############################Asteroid#############################
let asteroid = {
  xposition: 0,
  yposition: 0,
  avatar: "asteroid.png",
  defaultStartYposition: 30,
  //Initial draw
  initialDraw: function() {
    $("#game-window").append('<img id="asteroid"></img>');
    $("#asteroid").attr("src", `${asteroid.avatar}`);

    $("#asteroid").css({ height: "50px" });
    $("#asteroid").css({ width: "50px" });
    $("#asteroid").css({ position: "absolute" });
  },
  //Move asteroid
  move: function() {
    if (asteroid.yposition < screenYsize + 50) {
      asteroid.yposition += asteroidSpeed;
      $("#asteroid").css({ top: asteroid.yposition });
      document.getElementById("asteroidypositionIndicator").innerHTML =
        asteroid.yposition;
      document.getElementById("asteroidxpositionIndicator").innerHTML =
        asteroid.xposition;
    } else {
      asteroid.reset();
    }
  },
  //Reset asteroid
  reset: function() {
    $("#asteroid").css({ top: "0px" });
    asteroid.yposition = asteroid.defaultStartYposition;
    document.getElementById("asteroidypositionIndicator").innerHTML =
      asteroid.yposition;

    let randomAsteroidxposition = Math.floor(Math.random() * screenXsize);
    $("#asteroid").css({ left: randomAsteroidxposition + "px" });
    asteroid.xposition = randomAsteroidxposition;
    document.getElementById("asteroidxpositionIndicator").innerHTML =
      asteroid.xposition;

    $("#asteroid").css({ left: asteroid.xposition });
    $("#asteroid").css({ top: asteroid.yposition });
  }
};

//#############################Game session#############################
let gameInstance = {
  //Game begins as not over
  over: false,
  startNewInstance: function() {
    gameWindow.renderUserHUD();
    playerShip.initialDraw();
    asteroid.initialDraw();
    asteroid.reset();
    playerShip.updateHealth();
    setInterval(gameInstance.makeTimePass, 20);
  },
  //Make time pass
  makeTimePass: function() {
    if (gameInstance.over === false) {
      secondCounter += 1;
      document.getElementById("elapsedTimeIndicator").innerHTML = secondCounter;
      score = secondCounter * 10;
      document.getElementById("scoreIndicator").innerHTML = score;
      playerShip.updateHealth();
      gameInstance.checkCollision();
      asteroid.move();
    } else {
      if (score > highScore) {
        highScore = score;
        document.getElementById("highScoreIndicator").innerHTML = highScore;
      }
    }
  },
  //Check for collision
  checkCollision: function() {
    let nearOnXaxis =
      asteroid.xposition - dangerRange < playerShip.xposition &&
      playerShip.xposition < asteroid.xposition + dangerRange;
    let nearOnYaxis =
      asteroid.yposition - dangerRange < playerShip.yposition &&
      playerShip.yposition < asteroid.yposition + dangerRange;
    if (nearOnXaxis && nearOnYaxis) {
      playerShip.health = playerShip.health - damageFromAsteroidCollision;

      if (playerShip.health <= 0) {
        gameInstance.over = true;
        gameWindow.renderGameOverScreen();
        return;
      } else {
        $("#game-window").append(
          `<h6 id="crashNotificationPopUp" style="color: white; position: absolute; top: ${playerShip.yposition +
            "px"}; left: ${playerShip.xposition + "px"}">Hit!</h6>`
        );
        playerShip.updateHealth();
        asteroid.reset();
        $("#crashNotificationPopUp").fadeOut(1000);
        setTimeout(function() {
          $("#crashNotificationPopUp").remove();
        }, 1100);
      }
    }
  }
};

//#############################Game window#############################
let gameWindow = {
  //Active session
  renderStartScreen: function() {
    $("#game-window").empty();
    $("#game-window").append(
      '<h2 id="startScreen" style="color: white; margin-top: 150px; text-align: center" >Start New Game?</h2>'
    );
    $("#game-window").append(
      '<h4 id="startScreenPressEnter" style="color: white; text-align: center" >Press ENTER to Begin</h4>'
    );
  },
  renderActiveGame: function() {
    $("#game-window").empty();
    gameInstance.startNewInstance();
  },
  //User HUD
  renderUserHUD: function() {
    $("#game-window").append(
      '<strong class="HUD">Health:</strong><p id="healthIndicator" class="HUD">0</p>'
    );
    $("#game-window").append(
      '<strong class="HUD">Score:</strong><p id="scoreIndicator" class="HUD">0</p>'
    );
  },
  //Game Over screen
  renderGameOverScreen: function() {
    $("#game-window").empty();
    $("#game-window").css({ "text-align": "center" });

    $("#game-window").append(
      '<h2 id="gameOverText" style="color: white; display: none; margin-top: 150px" >Game Over</h2>'
    );
    $("#gameOverText").css({ "font-size": "90px" });
    $("#gameOverText").fadeIn(1500);

    $("#game-window").append(
      `<h5 id="gameOverScore" style="color: white; display: none">Score: ${score}</h5>`
    );
    $("#gameOverScore").fadeIn(1500);

    $("#game-window").append(
      `<h5 id="spaceToRestart" style="color: white; display: none">Press SPACE to Restart</h5>`
    );
    $("#spaceToRestart").fadeIn(1500);
  }
};

//USER INPUT===================================================================

//Listen for keyboard inputs from the user
function checkKey(e) {
  if (e.keyCode == "37") {
    if (playerShip.xposition > 0) {
      $("#playerShip").css({ left: moveLeftAmount });
      playerShip.xposition -= spaceShipSpeed;
      document.getElementById("playerxpositionIndicator").innerHTML =
        playerShip.xposition;
    }
  } else if (e.keyCode == "39") {
    if (playerShip.xposition < screenXsize) {
      $("#playerShip").css({ left: moveRightAmount });
      playerShip.xposition += spaceShipSpeed;
      document.getElementById("playerxpositionIndicator").innerHTML =
        playerShip.xposition;
    }
  } else if (e.keyCode == "32") { //Space bar will reload window
    location.reload();
  } else if (e.keyCode == "13") { //Enter button will start game
    $("#game-window").empty();
    gameWindow.renderActiveGame();
  }
};

//RUN PROGRAM==================================================================

//On startup
gameWindow.renderStartScreen();

//Reoccuring
document.onkeydown = checkKey; //Constantly listen for key input


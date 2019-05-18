let screenXsize = 640;
let screenXpixels = screenXsize + "px";
let screenYsize = 480;
let screenYpixels = screenYsize + "px";

let moveLeftAmount = "-=50px";
let moveRightAmount = "+=50px";
let moveUpAmount = "-=50px";
let moveDownAmount = "+=50px";

let dangerRange = 50;
let asteroidStartYposition = 30;

let spaceShipSpeed = 50;
let asteroidSpeed = 20;

let score = 0;
let highScore = 0;

let secondCounter = 0;
let damageFromAsteroidCollision = 30;

let playerShip = {
  health: 100,
  xposition: 0,
  yposition: screenYsize - 80,
  avatar: "playerShip.png"
};

let asteroid = {
  xposition: 0,
  yposition: 0,
  avatar: "asteroid.png"
};

let gameInstance = {
  over: false
};

function initialDrawPlayerShip() {
  $("#game-window").append('<img id="playerShip"></img>');
  $("#playerShip").attr("src", `${playerShip.avatar}`);

  $("#playerShip").css({ height: "50px" });
  $("#playerShip").css({ width: "50px" });
  $("#playerShip").css({ position: "absolute" });

  //$("#playerShip").css({ left: playerShip.xposition });
  $("#playerShip").css({ left: "0px" });
  $("#playerShip").css({ top: playerShip.yposition });

  document.getElementById("playerxpositionIndicator").innerHTML =
    playerShip.xposition;
  document.getElementById("playerypositionIndicator").innerHTML =
    playerShip.yposition;
}

function redrawShip() {
  $("#game-window").append('<img id="playerShip"></img>');
  $("#playerShip").attr("src", `${playerShip.avatar}`);
}

function initialDrawAsteroid() {
  $("#game-window").append('<img id="asteroid"></img>');
  $("#asteroid").attr("src", `${asteroid.avatar}`);

  $("#asteroid").css({ height: "50px" });
  $("#asteroid").css({ width: "50px" });
  $("#asteroid").css({ position: "absolute" });
}

document.onkeydown = checkKey;

renderUserHUD();
initialDrawPlayerShip();
initialDrawAsteroid();
asteroidReset();
updateHealthIndicator();

function checkKey(e) {
  e = e || window.event;

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
  } else if (e.keyCode == "32") {
    location.reload();
  }

  showPlayerYPosition();
  setTimeout(function() {
    checkCollision();
  }, 1000);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
setInterval(timeKeeper, 20);

function timeKeeper() {
  if (gameInstance.over === false) {
    secondCounter += 1;
    document.getElementById("elapsedTimeIndicator").innerHTML = secondCounter;
    score = secondCounter * 10;
    document.getElementById("scoreIndicator").innerHTML = score;
    updateHealthIndicator();
    checkCollision();
    asteroidMove();
  } else {
    if (score > highScore) {
      highScore = score;
      document.getElementById("highScoreIndicator").innerHTML = highScore;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderUserHUD() {
  $("#game-window").append(
    '<strong class="HUD">Health:</strong><p id="healthIndicator" class="HUD">0</p>'
  );
  $("#game-window").append(
    '<strong class="HUD">Score:</strong><p id="scoreIndicator" class="HUD">0</p>'
  );
}

function renderGameOverScreen() {
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

function asteroidMove() {
  if (asteroid.yposition < screenYsize + 50) {
    asteroid.yposition += asteroidSpeed;
    $("#asteroid").css({ top: asteroid.yposition });
    document.getElementById("asteroidypositionIndicator").innerHTML =
      asteroid.yposition;
    document.getElementById("asteroidxpositionIndicator").innerHTML =
    asteroid.xposition;
  } else {
    asteroidReset();
  }
}

function updateHealthIndicator() {
  document.getElementById("healthIndicator").innerHTML = playerShip.health;
  if (playerShip.health < 25) {
    playerShip.avatar = "playerShipCritical.png";
    redrawShip();
  }
}

function showPlayerYPosition() {
  document.getElementById("playerypositionIndicator").innerHTML =
    playerShip.yposition;
}

function checkCollision() {
  let nearOnXaxis =
    asteroid.xposition - dangerRange < playerShip.xposition &&
    playerShip.xposition < asteroid.xposition + dangerRange;
  let nearOnYaxis =
    asteroid.yposition - dangerRange < playerShip.yposition &&
    playerShip.yposition < asteroid.yposition + dangerRange;
  console.log(nearOnXaxis);
  console.log(nearOnYaxis);
  if (nearOnXaxis && nearOnYaxis) {
    playerShip.health = playerShip.health - damageFromAsteroidCollision;

    if (playerShip.health <= 0) {
      gameInstance.over = true;
      renderGameOverScreen();
      return;
    } else {
      $("#game-window").append(
        `<h6 id="crashNotificationPopUp" style="color: white; position: absolute; top: ${playerShip.yposition +
          "px"}; left: ${playerShip.xposition + "px"}">Hit!</h6>`
      );
      updateHealthIndicator();
      asteroidReset();
      $("#crashNotificationPopUp").fadeOut(1000);
      setTimeout(function() {
        $("#crashNotificationPopUp").remove();
      }, 1100);
    }
  }
}

function asteroidReset() {
  $("#asteroid").css({ top: "0px" });
  asteroid.yposition = asteroidStartYposition;
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

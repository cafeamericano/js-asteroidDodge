let screenXsize = 640;
let screenXpixels = screenXsize + "px";
let screenYsize = 480;
let screenYpixels = screenYsize + "px";

let moveLeftAmount = "-=50px";
let moveRightAmount = "+=50px";
let moveUpAmount = "-=50px";
let moveDownAmount = "+=50px";
let dangerRange = 35;
let asteroidStartYposition = 30;
let spaceShipSpeed = 50;

let score = 0;

let secondCounter = 0;
let damageFromAsteroidCollision = 20;

let playerShip = {
  health: 10,
  xposition: screenXsize / 2,
  yposition: screenYsize - 80
};

let asteroid = {
  xposition: 0,
  yposition: 0
};

function initialDrawPlayerShip() {
  $("#game-window").append('<img id="playerShip"></img>');
  $("#playerShip").attr("src", "playerShip.png");

  $("#playerShip").css({ height: "50px" });
  $("#playerShip").css({ width: "50px" });
  $("#playerShip").css({ position: "absolute" });

  $("#playerShip").css({ left: playerShip.xposition });
  $("#playerShip").css({ top: playerShip.yposition });

  document.getElementById("playerxpositionIndicator").innerHTML =
    playerShip.xposition;
  document.getElementById("playerypositionIndicator").innerHTML =
    playerShip.yposition;
}

function initialDrawAsteroid() {
  $("#game-window").append('<img id="asteroid"></img>');
  $("#asteroid").attr("src", "asteroid.png");

  $("#asteroid").css({ height: "50px" });
  $("#asteroid").css({ width: "50px" });
  $("#asteroid").css({ position: "absolute" });
}

document.onkeydown = checkKey;

initialDrawPlayerShip();
initialDrawAsteroid();
asteroidReset();
renderUserHUD();
updateHealthIndicator();

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == "37") {
    if (playerShip.xposition > 0) {
      $("#playerShip").animate({ left: moveLeftAmount }, 100);
      playerShip.xposition -= spaceShipSpeed;
      document.getElementById("playerxpositionIndicator").innerHTML =
        playerShip.xposition;
    }
  } else if (e.keyCode == "39") {
    if (playerShip.xposition < screenXsize) {
      $("#playerShip").animate({ left: moveRightAmount }, 100);
      playerShip.xposition += spaceShipSpeed;
      document.getElementById("playerxpositionIndicator").innerHTML =
        playerShip.xposition;
    }
  }

  showPlayerYPosition();
  asteroidMove();
  setTimeout(function() {
    checkCollision();
  }, 1000);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

setInterval(myTimer, 100);

function myTimer() {
  timeKeeper();
}

function timeKeeper() {
  secondCounter += 1;
  document.getElementById("elapsedTimeIndicator").innerHTML = secondCounter;
  score = secondCounter * 10;
  document.getElementById("scoreIndicator").innerHTML = score;
  updateHealthIndicator();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderUserHUD() {
  $("#game-window").append(
    '<strong>Health:</strong><p id="healthIndicator">0</p>'
  );
  $("#game-window").append(
    '<strong>Score:</strong><p id="scoreIndicator">0</p>'
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
}

function asteroidMove() {
  if (asteroid.yposition < screenYsize + 50) {
    $("#asteroid").animate({ top: moveDownAmount }, 100);
    asteroid.yposition += 50;
    document.getElementById("asteroidypositionIndicator").innerHTML =
      asteroid.yposition;
  } else {
    asteroidReset();
  }
}

function updateHealthIndicator() {
  document.getElementById("healthIndicator").innerHTML = playerShip.health;
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
      renderGameOverScreen();
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
  $("#asteroid").animate({ top: "0px" }, 0);
  asteroid.yposition = asteroidStartYposition;
  document.getElementById("asteroidypositionIndicator").innerHTML =
    asteroid.yposition;

  let randomAsteroidxposition = Math.floor(
    Math.random() * screenXsize - dangerRange
  );
  $("#asteroid").animate({ left: randomAsteroidxposition + "px" }, 0);
  asteroid.xposition = randomAsteroidxposition;
  document.getElementById("asteroidxpositionIndicator").innerHTML =
    asteroid.xposition;

  $("#asteroid").css({ left: asteroid.xposition });
  $("#asteroid").css({ top: asteroid.yposition });
}

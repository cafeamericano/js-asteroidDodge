let screenXsize = 640
let screenXpixels= screenXsize + 'px'
let screenYsize = 480
let screenYpixels= screenYsize + 'px'

let moveLeftAmount = '-=50px'
let moveRightAmount = '+=50px'
let moveUpAmount = '-=50px'
let moveDownAmount = '+=50px'
let dangerRange = 35
let asteroidStartYposition = 30
let spaceShipSpeed = 50;

let secondCounter = 0;
let damageFromAsteroidCollision = 20;

let playerShip = {
    health: 10,
    xposition: screenXsize/2,
    yposition: screenYsize - 80
}

let asteroid = {
    xposition: 0,
    yposition: 0
}

function initialDrawPlayerShip() {
    $('#game-window').append('<img id="playerShip"></img>');
    $("#playerShip").attr("src", "playerShip.png");

    $("#playerShip").css({ height: '50px' });
    $("#playerShip").css({ width: '50px' });
    $("#playerShip").css({ position: 'absolute' });
    
    $("#playerShip").css({ left: playerShip.xposition });
    $("#playerShip").css({ top: playerShip.yposition });

    document.getElementById("playerxpositionIndicator").innerHTML = playerShip.xposition
    document.getElementById("playerypositionIndicator").innerHTML = playerShip.yposition
}

function initialDrawAsteroid() {
    $('#game-window').append('<img id="asteroid"></img>');
    $("#asteroid").attr("src", "asteroid.png");

    $("#asteroid").css({ height: '50px' });
    $("#asteroid").css({ width: '50px' });
    $("#asteroid").css({ position: 'absolute' });

}

document.onkeydown = checkKey;

initialDrawPlayerShip();
initialDrawAsteroid();

asteroidReset();
updateHealthIndicator();

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
        if(playerShip.xposition > 0) {
            $("#playerShip").animate({left: moveLeftAmount}, 100);
            playerShip.xposition -= spaceShipSpeed;
            document.getElementById("playerxpositionIndicator").innerHTML = playerShip.xposition
        }
    }
    else if (e.keyCode == '39') {
        if(playerShip.xposition < screenXsize) {
            $("#playerShip").animate({left: moveRightAmount}, 100);
            playerShip.xposition += spaceShipSpeed;
            document.getElementById("playerxpositionIndicator").innerHTML = playerShip.xposition
        }
    }

    showPlayerYPosition()
    timeKeeper()
    asteroidMove()
    setTimeout(function(){
        checkCollision()
    }, 1000);
    
}


function timeKeeper() {
    secondCounter += 1;
    document.getElementById("elapsedTimeIndicator").innerHTML = secondCounter;
    updateHealthIndicator();
}

function renderGameOverScreen() {
    $('#game-window').empty();
    $("#game-window").css({ 'text-align': 'center' });

    $('#game-window').append('<h2 id="gameOverText" style="color: white; display: none" >ゲームオーバー</h2>');
    $("#gameOverText").css({ 'font-size': '90px' });
    $("#gameOverText").fadeIn(1500);

    $('body').append('<a style="display: none" id="restartGameButton">Restart</a>');
    $("#restartGameButton").fadeIn(1500);
    $("#restartGameButton").attr("href", "index.html");
}

function asteroidMove() {
    if (asteroid.yposition < screenYsize + 50) {
        $("#asteroid").animate({top: moveDownAmount}, 100);
        asteroid.yposition += 50;
        document.getElementById("asteroidypositionIndicator").innerHTML = asteroid.yposition
    } else {
        asteroidReset()
    }
}

function updateHealthIndicator() {
    document.getElementById("healthIndicator").innerHTML = playerShip.health
}

function showPlayerYPosition() {
    document.getElementById("playerypositionIndicator").innerHTML = playerShip.yposition
}

function checkCollision() {
    let nearOnXaxis = (asteroid.xposition - dangerRange) < playerShip.xposition && playerShip.xposition < (asteroid.xposition + dangerRange)
    let nearOnYaxis = (asteroid.yposition - dangerRange) < playerShip.yposition && playerShip.yposition < (asteroid.yposition + dangerRange)
    console.log(nearOnXaxis)
    console.log(nearOnYaxis)
    if(nearOnXaxis && nearOnYaxis) {
        alert('You hit an asteroid!')
        playerShip.health = playerShip.health - damageFromAsteroidCollision
        updateHealthIndicator();
        asteroidReset();
    }
    if(playerShip.health <= 0) {
        renderGameOverScreen()
    }
}

function asteroidReset() {
    $("#asteroid").animate({top: '0px'}, 0);
    asteroid.yposition = asteroidStartYposition;
    document.getElementById("asteroidypositionIndicator").innerHTML = asteroid.yposition

    let randomAsteroidxposition = Math.floor(Math.random() * screenXsize-dangerRange)  
    $("#asteroid").animate({left: (randomAsteroidxposition + 'px')}, 0);
    asteroid.xposition = randomAsteroidxposition
    document.getElementById("asteroidxpositionIndicator").innerHTML = asteroid.xposition

    $("#asteroid").css({ left: asteroid.xposition });
    $("#asteroid").css({ top: asteroid.yposition });
}
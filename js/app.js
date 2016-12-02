// Array to hold all the accepted values for the y coordinate of enemies
var enemyVerticalCoordinate = [60, 143, 226];
// Array to hold all the possible values for horizontal speed of enemies
var enemyHorizontalSteps = [120, 240, 360, 480];
// Array that holds all the possible values of x positions for gems
var gemsXCoordinate = [30, 132, 233, 334, 435];
var gemsLastXCoordinate = 0;
// Array that holds all the possible values of y positions for gems
var gemsYCoordinate = [180, 263];
// Array that holds the paths to the 3 gems sprites
//var gemsSprites = ['images/gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];
var availableGems = ["blue", "green", "orange"];


/* Enemies our player must avoid.
 * Each enemy has an x and y coordinate to place its sprite; an x and y offset
 * to detect the exact position of the image inside the sprite; an effective
 * width and height for the image inside the sprite and a sprit property to
 * locate the image inside the images folder.
 */
var Enemy = function() {
    // Starting horizontal position of enemies is out of canvas on the left
    //                   this.x = -101 * scaleFactor;
    //var start1 = -0.2 * aCanvasWidth;
    //var start2 = -101 * scaleFactor;
    //this.x = -0.2 * aCanvasWidth;   // -101 / 505
    this.x = -101 * scaleFactor;
    //console.log("width: " + start1 + " scale: " + start2);

    // Get a random vertical position for each enemy instance inside the stone path
    var verticalPos = enemyVerticalCoordinate[getRandomInt(0, 2)];   // * scaleFactor;

    console.log(verticalPos);

    // Starting vertical coordinate of an enemy object
    this.y = verticalPos * scaleFactor;   // / 606 * aCanvasHeight;
    // Get a random speed for each enemy instance
    var dxStep = enemyHorizontalSteps[getRandomInt(0, 3)] * scaleFactor;
    this.dx = dxStep;
    //console.log("Vertical pos: " + verticalPos);
    //console.log("Horizontal step: " + dxStep);

    // Offset of the effective image from the x position, necessary to detect collision
    this.xOffset = 25 * scaleFactor;
    // Offset of the effective image from the y position, necessary to detect collision
    this.yOffset = 40 * scaleFactor;    //85;//40;
    // Effective width of the image, necessary to detect collision
    this.effectiveWidth = 50 * scaleFactor;
    // Effective height of the image, necessary to detect collision
    this.effectiveHeight = 60 * scaleFactor;
    // The image/sprite for our enemies, this uses a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/* Update the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter which will ensure
    // the game runs at the same speed for all computers.
    // The enemy moves until it is completely out of canvas.
    if (this.x <= 610 * scaleFactor) { // / 505 * aCanvasWidth) {
        this.x += this.dx * dt;
    }
    else {
        this.dx = 0;

        //console.log(this.dx);
    }
};

/* Determine if an instance of Enemy is gone outside of canvas (canvas width
 * is 606px). When it happens, take its index and remove that item from the
 * array by index position .
 */
Enemy.prototype.determineIfOut = function() {
    if (this.x > 610 * scaleFactor) {     // / 505 * aCanvasWidth) {
        var that = this;                                                   //  |<--------   can it be a function?
        var pos = allEnemies.indexOf(that)

        //console.log(pos);
        //allEnemies.push(new Enemy());
        //allEnemies.splice(pos, 1);

        // Use setTimeout to avoid flickering of enemy sprites.
        setTimeout( function() {
            allEnemies.splice(pos, 1);
        }, 0);
    }
};

Enemy.prototype.explode = function() {
        var that = this;
        var pos = allEnemies.indexOf(that)

        //console.log(pos);
        //allEnemies.push(new Enemy());
        //allEnemies.splice(pos, 1);

        // Use setTimeout to avoid flickering of enemy sprites.
        setTimeout( function() {
            allEnemies.splice(pos, 1);
        }, 0);
};

/* Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * scaleFactor, Resources.get(this.sprite).naturalHeight * scaleFactor);
};

/* Player class with x and y coordinates, x and y offset, width and height, dx
 * and dy steps and sprite.
 * Player image is positioned at the bottom of the canvas as the game starts.
 * Its dx and dy steps are 0 as long as the user doesn't press any arrow keys.
 * The x and y offset are used to detect the exact position of the image inside
 * the sprite; an effective width and height for the image inside the sprite
 * and a sprit property to locate the image inside the images folder.
 */
var Player = function() {
    this.oldScale = scaleFactor;
    //this.startX = 202;
    //this.startY = 400;
    this.x = 202 * scaleFactor;
    this.y = 400 * scaleFactor;
    this.dx = 0;
    this.dy = 0;
    // Offset of the effective image from the x position
    this.xOffset = 2 * scaleFactor;
    // Offset of the effective image from the y position
    this.yOffset = 40 * scaleFactor;   //40;85;
    // Effective width of the image; necessary to detect collision
    this.effectiveWidth = 96 * scaleFactor;
    // Effective height of the image; necessary to detect collision
    this.effectiveHeight = 45 * scaleFactor;
    this.collected = [];
    this.score = 0;
    this.lives = 1;
    this.sprite = 'images/char-boy.png';
    console.log("score: " + this.score);
};

/* Draw the player on the screen, required method for game
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * scaleFactor, Resources.get(this.sprite).naturalHeight * scaleFactor);
};

/* Handle the player inputs. Each time the user presses an arrow key,
 * it sets a corresponding step that is used inside the 'update' function
 * of the player instance to update its position inside the canvas.
 * Each step corresponds to the width or to the height of a tile, depending
 * on the fact that the movement is either horizontal or vertical.
 */
Player.prototype.handleInput = function(key) {
    if (key === "left" && this.x > 0) { //&& this.hasLeftPathFree()) {
        this.dx = -101 * scaleFactor;
    }
    if (key === "right" && this.x < 354 * scaleFactor) {
        this.dx = 101 * scaleFactor;
    }
    if (key === "down" && this.y < 400 * scaleFactor) {
        this.dy = 83 * scaleFactor;
    }
    if (key === "up" && this.y > 0) {
        this.dy = -83 * scaleFactor;
    }

    if (this.hasNotPathFree()) {
        this.dx = 0;
        this.dy = 0;
    }


    // if (key === "up") {
    //     if (this.y > 83) {
    //         this.dy = -83;
    //         setTimeout(function() {
    //             this.y = 400;
    //         }, 2000);

    //     }
    //     else {
    //         this.dy = -83
    //     }
    // }


    // && this.y > 83) {
    //     this.dy = -83
    // }
    // else {
    //     if (this.y < 50) {
    //         console.log("A");
    //     };
    // }
};

/* Update the player position adding the step value. Step values are set to zero
 * at the beginning of the game. It gets a positive or negative value if the user
 * presses an arrow key. The step value is set back to zero immediately after
 * its value has been used to increment or decrement a player coordinate, to take into
 * account only a step movement for each key press.
 */
Player.prototype.update = function() {
    // if (this.y < 0) {
    //     this.y = 400;
    // }
    //else {
        console.log("step x: " + this.dx + "step y: " + this.dy);

        //this.playerScale = scaleFactor;

        this.x += this.dx;
        this.y += this.dy;
        //this.x *= scaleFactor;
        //this.y *= scaleFactor;
        this.dx = 0;
        this.dy = 0;
    //}

    //console.log("Player pos: " + this.y);
    console.log("lives: " + this.lives);
};



Player.prototype.updateIfResized = function() {
    // var oldScale = scaleFactor;
    // console.log("original x: " + this.x + " - original y: " + this.y);
    // this.x = this.x * scaleFactor;
    // this.y = this.y * scaleFactor;
    // console.log("updated x: " + this.x + " - updated y: " + this.y);

    if (scaleFactor != oldScaleFactor) {
            this.x /= oldScaleFactor;
            this.x *= scaleFactor
            this.y /= oldScaleFactor;
            this.y *= scaleFactor;
        }
};




/* Determnine if the player has reached the water safely.
 */
Player.prototype.checkIfWon = function() {
    if (this.y < 0) {
        //this.y = 400;
        //document.location.reload();
        // setTimeout( function() {
        //     document.location.reload();
        // }, 0);
        return true;
    }
};

/* After the game ended, if the user starts a new game,assign a new Player object to player
 */
Player.prototype.startAgain = function() {
    player = new Player();
    //availableGems = ["blue", "green", "orange"];
};

/* Check that there is no gap between the player and another object. If this condition is met,
 * there is a collision.
 */
Player.prototype.checkCollision = function(obj) {
    if (this.x + this.xOffset < obj.x + obj.xOffset + obj.effectiveWidth &&
        this.x + this.xOffset + this.effectiveWidth > obj.x + obj.xOffset &&
        this.y + this.yOffset < obj.y + obj.yOffset + obj.effectiveHeight &&
        this.y + this.yOffset + this.effectiveHeight > obj.y + this.yOffset) {
        return true;

        //console.log("BUMP");
    }
};


Player.prototype.collect = function(obj) {
    var item = availableGems.indexOf(obj.gemType);
    // for (var i = 0; i < availableGems.length; i++) {
    //     if (availableGems[i]) {
    //         item = availableGems.indexOf(obj.gemType);
    //     }
    // }
    //item = -1;
    //var
    //var collectedGem = availableGems.splice(item, 1);     //availableGems.indexOf(obj.gemType));
    console.log("collected " + obj.gemType);
    //this.updateScore(obj.gemType);
    this.collected.push(availableGems[item]);
    console.log("type " + item);
    availableGems.splice(item, 1);
    console.log("pushed " + this.collected);
    this.score += 20;
};

Player.prototype.updateScore = function() {
    var playerScore = 0,
        blueScore = 0,
        greenScore = 0,
        orangeScore = 0;
    for (var elem = 0; elem < this.collected.length; elem++) {
       if (this.collected[elem] === "blue") {
           blueScore = 15;
           console.log("score blue: " + blueScore);
           playerScore += blueScore;
       } else if (this.collected[elem] === "green") {
            greenScore = 20;
            console.log("score green: " + greenScore);
            playerScore += greenScore;
        }
        if (this.collected[elem] === "orange") {
            orangeScore = 25;
            console.log("score orange: " + orangeScore);
            playerScore += orangeScore;
        }
    }

    this.score = playerScore;

    //this.score += 20;  //blueScore + greenScore + orangeScore;
    console.log("player score: " + playerScore);
    console.log("score: " + this.score);
};

/* Set player coordinates back to their original values
 */
Player.prototype.setCoordinates = function() {
    this.x = 202 * scaleFactor;
    this.y = 400 * scaleFactor;
};


Player.prototype.isThereARock = function(obj) {
    if ((this.y - 101) < obj.y) {
        this.dy = 0;
    }
};

Player.prototype.stayStill = function() {
    this.dx = 0;
    this.dy = 0;
};


Player.prototype.hasLeftPathFree1 = function() {
    var isFree = true;
    //for (var rockElem = 0; rockElem < allRocks.length; rockElem++) {
        if ((this.x - 101) === 202 &&   //{//||    //allRocks[rockElem].x &&
             (this.y) === 68) {  //allRocks[rockElem].y) {
            //return true;
            isFree = false;
        }
    //}
    console.log(isFree);
    return isFree;

    //console.log()

};


Player.prototype.hasLeftPathFree = function(key) {
    var isFree = true;
    for (var rockElem = 0; rockElem < allRocks.length; rockElem++) {

        if ((this.x - 101) === allRocks[rockElem].x &&      //202 &&   //{//||    //allRocks[rockElem].x &&
             (this.y) === 68) {  //allRocks[rockElem].y) {
            //return true;
            isFree = false;
        }
    }
    console.log(isFree);
    return isFree;

    //console.log()

};


Player.prototype.hasNotPathFree = function() {
    var isNotFree = false;
    for (var rockElem = 0; rockElem < allRocks.length; rockElem++) {
        if ((this.x + this.dx) === allRocks[rockElem].x &&
             (this.y + this.dy) === allRocks[rockElem].y + 12) {  //allRocks[rockElem].y) {      //68
            //return true;
            isNotFree = true;
        }
    }
    console.log(isNotFree);
    return isNotFree;

    //console.log()

};


/* Gem class with x and y coordinates and sprite.
 * Gem image is selected randomly from an array of 3 values named
 * 'gemsSprites'. Its x and y coordinates can assume only certain values that
 * can be randomly chosen from arrays 'gemsXCoordinate' and 'gemsYCoordinate'.
 */
var Gem = function() {
    // value of the x coordinate for gem
    var xCoordinate; // = gemsXCoordinate[getRandomInt(0, 4)];
    // Because gems can only occupy two vertical positions, make sure that
    // they appear at different horizontal positions, so they don't ovrlap.
    // Keep selecting a random number from the array until it is different
    // from the last horizontal position of the gem.
    do {
        xCoordinate = gemsXCoordinate[getRandomInt(0, 4)];  //getRandomInt(0, 4);
    }
    while (xCoordinate === gemsLastXCoordinate);
    //this.x = gemsXCoordinate[getRandomInt(0, 4)] * scaleFactor;
    this.x = xCoordinate * scaleFactor;
    this.y = gemsYCoordinate[getRandomInt(0, 1)] * scaleFactor;

    // Set last x coordinate for gem equal to the selected one
    gemsLastXCoordinate = xCoordinate;



    // Offset of the effective image from the x position, necessary to detect collision
    this.xOffset = 1 * 0.4 * scaleFactor;
    // Offset of the effective image from the y position, necessary to detect collision
    this.yOffset = 10 * 0.4 * scaleFactor;    //85;//40;
    // Effective width of the image, necessary to detect collision
    this.effectiveWidth = 95 * 0.4 * scaleFactor;     //37
    // Effective height of the image, necessary to detect collision
    this.effectiveHeight = 40 * 0.4 * scaleFactor;
    // The image/sprite for our enemies, this uses a helper we've provided to easily load images

    //this.availableGems = ['blue', 'green', 'orange'];
    //var chosen = availableGems[getRandomInt(0, 2)];
    //this.sprite = gemsSprites[pickGem(availableGems)];
    //pickGem(this.availableGems);
    //var selected = selectGem(availableGems);
    //var image = 'images/gem Blue.png'
    this.gemType = selectGem(availableGems);
    this.sprite = 'images/gem-' + this.gemType + '.png';          //'images/Gem Blue.png';
    console.log('images/gem-' + this.gemType + '.png');
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + xCoordinate);
    console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB" + gemsLastXCoordinate);
    console.log("x coordinate" + xCoordinate);
    console.log("gem x coordinate" + gemsLastXCoordinate);
};

function selectGem(arr) {
    var gem = "",
        len = arr.length;
    var rand;
    if (len > 0) {
        rand = getRandomInt(0, len - 1);
        gem = arr[rand];
        console.log("Random is " + rand);
        /*
        elem =
        if (elem === 0) {
            gem = arr[elem];  //"blue";
        } else if (elem === 1) {
            gem = "green";
        } else {
            gem = "orange";
        }
        */
    }

    return gem;


    /*
    console.log(arr);
    var picked = arr.splice(getRandomInt(0, 2), 1);
    console.log(picked);
    //availableGems.
    arr.push(picked);
    console.log(arr);
    */
}

/* Draw the gems on the screen at positions x and y, scaled at 40% of its
 * original size.
 */
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * 0.4 * scaleFactor,
        Resources.get(this.sprite).naturalHeight * 0.4 * scaleFactor);
};

Gem.prototype.replace = function() {
    gem = new Gem();
};


var Rock = function(x, y) {
    this.x = x * scaleFactor;
    this.y = y * scaleFactor;     //56

    // Offset of the effective image from the x position, necessary to detect collision
    this.xOffset = 1 * scaleFactor;
    // Offset of the effective image from the y position, necessary to detect collision
    this.yOffset = 50 * scaleFactor;    //85;//40;               //50
    // Effective width of the image, necessary to detect collision
    this.effectiveWidth = 90 * scaleFactor;
    // Effective height of the image, necessary to detect collision
    this.effectiveHeight = 70 * scaleFactor;     //60

    this.sprite = 'images/Rock.png';
};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * scaleFactor,
        Resources.get(this.sprite).naturalHeight * scaleFactor);
};

var Heart = function() {
    this.x = 323;
    this.y = 25;  //108;  //35;    //108;    //35

    // Offset of the effective image from the x position, necessary to detect collision
    this.xOffset = 4 * 0.6 * scaleFactor;
    // Offset of the effective image from the y position, necessary to detect collision
    this.yOffset = 57 * 0.6 * scaleFactor;    //85;//40;               //50
    // Effective width of the image, necessary to detect collision
    this.effectiveWidth = 93 * 0.6 * scaleFactor;
    // Effective height of the image, necessary to detect collision
    this.effectiveHeight = 57 * 0.6 * scaleFactor;     //60

    this.sprite = 'images/Heart.png';
}

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * 0.6 * scaleFactor,
        Resources.get(this.sprite).naturalHeight * 0.6 * scaleFactor);
};


var Key = function() {
    this.x = 123;
    this.y = 25;  //32;  //108;

    // Offset of the effective image from the x position, necessary to detect collision
    this.xOffset = 22 * 0.6 * scaleFactor;
    // Offset of the effective image from the y position, necessary to detect collision
    this.yOffset = 60 * 0.6 * scaleFactor;    //85;//40;               //50
    // Effective width of the image, necessary to detect collision
    this.effectiveWidth = 60 * 0.6 * scaleFactor;
    // Effective height of the image, necessary to detect collision
    this.effectiveHeight = 70 * 0.6 * scaleFactor;     //60

    this.sprite = 'images/Key.png';
};

Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * 0.6 * scaleFactor,
        Resources.get(this.sprite).naturalHeight * 0.6 * scaleFactor);
};




/* Instantiate the enemy objects.
 * Place all enemy objects in an array called allEnemies.
 * The game starts with 3 enemies entering the canvas.
 */
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

/* Instantiate the player object. There is only one player per game.
 */
var player = new Player();

var gem = new Gem();

var allRocks = [new Rock(0, -27), new Rock(202, -27), new Rock(404, -27), new Rock(101, 305), new Rock(404, 388)];

var heart = new Heart();

var key = new Key();

//var rock1 = new Rock(0);
//var rock2 = new Rock(202);
//var rock3 = new Rock(404);


/* Get a random integer number between min (included) and max (included)
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Check that the number of items in the array is 3.
 * If the numer is less than 3, add a new enemy to the array.
 */
Array.prototype.checkNumberOfItems = function() {
    //console.log(this.length);
    if (this.length < 3) {
        this.push(new Enemy());
    }
};

Array.prototype.replaceGems = function() {
    //console.log(this.length);
    console.log("before: " + availableGems);
    availableGems = ["blue", "green", "orange"];
    console.log("after: " + availableGems);
};

Array.prototype.reFill = function() {
    allEnemies = [new Enemy(), new Enemy(), new Enemy()];
};


/* This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    //console.log(allowedKeys[e.keyCode]);

    player.handleInput(allowedKeys[e.keyCode]);
});

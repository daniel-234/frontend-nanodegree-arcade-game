// Array that holds all the accepted values for the y coordinate of enemies
var enemyVerticalCoordinate = [60, 143, 226];
// Array that holds all the possible values for horizontal speed of enemies
var enemyHorizontalSteps = [120, 240, 360, 480];
// Array that holds all the possible values of x positions for gems
var gemsXCoordinate = [30, 132, 233, 334, 435];
// Variable that holds the value of the last x coordinate for gems
var gemsLastXCoordinate = 0;
// Array that holds all the possible values of y positions for gems
var gemsYCoordinate = [180, 263];
// Array that holds the colors of the gems that it is possible to collect
var availableGems = ['blue', 'green', 'orange'];
// Variable that defines the percentage at which heart size will be considered in game
var HEART_IMAGE_REDUCTION = 0.6;
// Variable that defines the percentage at which key size will be considered in game
var KEY_IMAGE_REDUCTION = 0.6;


/* Enemies our player must avoid.
 * Each enemy has an x and y coordinate to place its sprite; an x and y offset
 * to detect the exact position of the image inside the sprite; an effective
 * width and height for the image inside the sprite and a sprite property to
 * locate the image inside the images folder.
 * Variable 'scaleFactor' is used to take into account the viewport size.
 */
var Enemy = function() {
    // Starting horizontal position of enemies is out of canvas on the left
    this.x = -101 * scaleFactor;
    // Get a random vertical position for each enemy instance inside the stone path
    var verticalPos = enemyVerticalCoordinate[getRandomInt(0, 2)];
    // Starting vertical coordinate of an enemy object
    this.y = verticalPos * scaleFactor;
    // Get a random speed for each enemy instance
    var dxStep = enemyHorizontalSteps[getRandomInt(0, 3)] * scaleFactor;
    // Starting horizontal coordinate of an enemy object
    this.dx = dxStep;
    // Offset of the effective image from the x position, necessary to detect collision
    this.xOffset = 25 * scaleFactor;
    // Offset of the effective image from the y position, necessary to detect collision
    this.yOffset = 40 * scaleFactor;
    // Effective width of the image, necessary to detect collision
    this.effectiveWidth = 50 * scaleFactor;
    // Effective height of the image, necessary to detect collision
    this.effectiveHeight = 60 * scaleFactor;
    // The image/sprite for our enemies, this uses a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/* Update the enemy's position, required method for game.
 * Parameter: dt, a time delta between ticks.
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter which will ensure
    // the game runs at the same speed for all computers.
    // The enemy moves until it is completely out of canvas.
    if (this.x <= 610 * scaleFactor) {
        this.x += this.dx * dt;
    }
    // As the enemy exits canvas, it stops moving
    else {
        this.dx = 0;
    }
};

/* Determine if an Enemy instance has gone outside of canvas.
 * When it happens, take its index and remove that item from the
 * array by index position .
 */
Enemy.prototype.determineIfOut = function() {
    if (this.x > 610 * scaleFactor) {
        var that = this;
        // Take the index of the current enemy
        var pos = allEnemies.indexOf(that);
        // Use setTimeout to avoid flickering of enemy sprites.
        setTimeout( function() {
            allEnemies.splice(pos, 1);
        }, 0);
    }
};

/* Take an enemy by index position and remove it from the array.
 */
Enemy.prototype.explode = function() {
        var that = this;
        // Take the index of the current enemy
        var pos = allEnemies.indexOf(that);
        // Use setTimeout to avoid flickering of enemy sprites.
        setTimeout( function() {
            allEnemies.splice(pos, 1);
        }, 0);
};

/* Draw the enemy on the screen; 'scaleFactor' is used to render
 * the enemy size appropriately depending on the viewport size.
 * Variable 'scaleFactor' is used to adapt image size to viewport size.
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * scaleFactor,
        Resources.get(this.sprite).naturalHeight * scaleFactor);
};

/* Player class with x and y coordinates, x and y offset, width and height, dx
 * and dy steps and sprite.
 * Player image is positioned at the bottom of the canvas as the game starts.
 * Its dx and dy steps are 0 as long as the user doesn't press any arrow keys.
 * The x and y offsets are used to detect the exact position of the image inside
 * the sprite. A sprite property locates the image inside the images folder.
 * Variable 'scaleFactor' is used to take into account the viewport size.
 */
var Player = function() {
    // Starting x and y positions for player
    this.x = 202 * scaleFactor;
    this.y = 400 * scaleFactor;
    // Starting steps for player are zero; it reacts to user input
    this.dx = 0;
    this.dy = 0;
    // Offset of the effective image from the x position
    this.xOffset = 2 * scaleFactor;
    // Offset of the effective image from the y position
    this.yOffset = 40 * scaleFactor;
    // Effective width of the image; necessary to detect collision
    this.effectiveWidth = 96 * scaleFactor;
    // Effective height of the image; necessary to detect collision
    this.effectiveHeight = 45 * scaleFactor;
    // Array that holds the gems the player collects during a session
    this.collected = [];
    // Starting score for the player
    this.score = 0;
    // Number of lives at start; if it reaches 0, the game ends
    this.lives = 1;
    // Player image
    this.sprite = 'images/char-boy.png';
};

/* Draw the player on the screen, required method for game.
 * Variable 'scaleFactor' is used to take into account the viewport size.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * scaleFactor,
        Resources.get(this.sprite).naturalHeight * scaleFactor);
};

/* Handle the player inputs. Each time the user presses an arrow key,
 * it sets a corresponding step that is used inside the 'update' function
 * of the player instance to update its position inside the canvas.
 * Each step corresponds to the width or to the height of a tile, depending
 * on the fact that the movement is either horizontal or vertical.
 * Variable 'scaleFactor' is used to take into account the viewport size.
 */
Player.prototype.handleInput = function(key) {
    // Check if the player x coordinate is still inside canvas on the left
    if (key === 'left' && this.x > 0) {
        this.dx = -101 * scaleFactor;
    }
    // Check if the player x coordinate is still inside canvas on the right
    if (key === 'right' && this.x < 354 * scaleFactor) {
        this.dx = 101 * scaleFactor;
    }
    // Check if the player y coordinate is still inside canvas at the bottom
    if (key === 'down' && this.y < 400 * scaleFactor) {
        this.dy = 83 * scaleFactor;
    }
    // Check if the player y coordinate is still inside canvas at the top
    if (key === 'up' && this.y > 0) {
        this.dy = -83 * scaleFactor;
    }

    // Check if there is an obstacle in the player path
    if (this.hasNotPathFree()) {
        this.dx = 0;
        this.dy = 0;
    }
};

/* Update the player position adding the step value. Step values are set to zero
 * at the beginning of the game. It gets a positive or negative value if the user
 * presses an arrow key. The step value is set back to zero immediately after
 * its value has been used to increment or decrement a player coordinate, to take into
 * account only a step movement for each key pressed.
 */
Player.prototype.update = function() {
    // Increment x and y positions by the given step
    this.x += this.dx;
    this.y += this.dy;
    // After step has been assigned to the x and y coordinates of player,
    // change back their value to zero and wait for the next user input
    this.dx = 0;
    this.dy = 0;
};

/* Determnine if the player has reached the water safely.
 */
Player.prototype.checkIfWon = function() {
    // Check if the player y coordinate is negative
    if (this.y < 0) {
        // Then the water has been reached
        return true;
    }
};

/* Check that there is no gap between the player and another object.
 * If this condition is met, there is a collision.
 */
Player.prototype.checkCollision = function(obj) {
    if (this.x + this.xOffset < obj.x + obj.xOffset + obj.effectiveWidth &&
        this.x + this.xOffset + this.effectiveWidth > obj.x + obj.xOffset &&
        this.y + this.yOffset < obj.y + obj.yOffset + obj.effectiveHeight &&
        this.y + this.yOffset + this.effectiveHeight > obj.y + this.yOffset) {
        return true;
    }
};

/* Collect a gem and insert it into the player's collected' array property.
 * It is possible to collect only 3 gems, one for each type.
 * The gem types are listed in the 'availableGems' array. As the
 * player collects each of them, they are inserted into the 'collected'
 * array and removed from their original position inside 'availableGems'.
 */
Player.prototype.collectGem = function(obj) {
    // Give item the index of the current gem inside 'availableGems'
    var item = availableGems.indexOf(obj.gemType);
    // Insert the collected gem into the 'collected' array
    this.collected.push(availableGems[item]);
    // Remove it from its original array
    availableGems.splice(item, 1);
};

/* Update player score. To make things more interesting, each gem type
 * has a different value and will increment the player score by a
 * different amount.
 */
Player.prototype.updateScore = function() {
    var playerScore = 0,
        blueScore = 0,
        greenScore = 0,
        orangeScore = 0;
    // Loop through the array holding the gems collected by the player
    for (var elem = 0; elem < this.collected.length; elem++) {
        // Check if the current gem is blue
        if (this.collected[elem] === 'blue') {
            // Assign it a score of 15 points
            blueScore = 15;
            // Assign this points to the total score
            playerScore += blueScore;
        } else if (this.collected[elem] === 'green') {
            greenScore = 20;
            playerScore += greenScore;
        }
        if (this.collected[elem] === 'orange') {
            orangeScore = 25;
            playerScore += orangeScore;
        }
    }

    // Assign the total score to the player score property
    this.score = playerScore;
};

/* Set player coordinates back to their original values.
 * Variable 'scaleFactor' is used to take into account the viewport size.
 */
Player.prototype.setCoordinates = function() {
    this.x = 202 * scaleFactor;
    this.y = 400 * scaleFactor;
};

/* Check if the player path is free, by trying to match the x and y
 * player coordinates after the next step to the x and y coordinates
 * of the obstacle.
 */
Player.prototype.hasNotPathFree = function() {
    // Initially the player path is free
    var isNotFree = false;
    for (var rockElem = 0; rockElem < allRocks.length; rockElem++) {
        // Check if the player x coordinate corresponds to the obstacle x coordinate
        if (Math.floor(this.x + this.dx) === Math.floor(allRocks[rockElem].x) &&
            // Check if the player y coordinate corresponds to the obstacle y coordinate;
            // note that contrary to the x coordinate, even when the player is in the same
            // tile as the obstacle, there is no exact match between their y value. So we
            // need to take into account it and add 12 pixels to the obstacle y position
            // (and scale it appropriately in case the viewport is resized)
            Math.floor(this.y + this.dy) === Math.floor(allRocks[rockElem].y + (12 * scaleFactor))) {
            // Set the flag variable to false if the path is not free
            isNotFree = true;
        }
    }
    return isNotFree;
};

/* Gem class with x and y coordinates, offsets and size of the visible image
 * inside the sprite.
 * Gem image is selected randomly from an array of 3 values named
 * 'gemsSprites'. Its x and y coordinates can assume only certain values that
 * can be randomly chosen from arrays 'gemsXCoordinate' and 'gemsYCoordinate'.
 * Variable 'scaleFactor' is used to take into account the viewport size.
 */
var Gem = function() {
    // Local value of the x coordinate for gem
    var xCoordinate;
    // Assign it a random value from a given range chosen from 'gemsXCoordinate'
    // until it is different from the x value of the previous gem.
    // This check was introduced to avoid that two gems could pe spawned in
    // the same position, a not uncommon occurrence given that there are only
    // two values for the y coordinate
    do {
        xCoordinate = gemsXCoordinate[getRandomInt(0, 4)];
    }
    while (xCoordinate === gemsLastXCoordinate);
    // Once the right value for x position has been found, assign it to x
    this.x = xCoordinate * scaleFactor;
    // The gem y coordinate can assume two values, without further checks
    this.y = gemsYCoordinate[getRandomInt(0, 1)] * scaleFactor;
    // Set global last x coordinate for gem equal to the selected one; this will keep
    // it in memory and avoid that the next gem will occupy the same x position
    gemsLastXCoordinate = xCoordinate;
    // Offset of the effective image from the x position, necessary to detect collision
    this.xOffset = 1 * 0.4 * scaleFactor;
    // Offset of the effective image from the y position, necessary to detect collision
    this.yOffset = 10 * 0.4 * scaleFactor;
    // Effective width of the image, necessary to detect collision
    this.effectiveWidth = 95 * 0.4 * scaleFactor;
    // Effective height of the image, necessary to detect collision
    this.effectiveHeight = 40 * 0.4 * scaleFactor;
    // Assign the type by selecting it randomly from three given values, through the 'selectGem' function
    this.gemType = selectGem(availableGems);
    // The image/sprite for our enemies, this uses a helper we've provided to easily load images
    this.sprite = 'images/gem-' + this.gemType + '.png';
};

/* Draw the gems on the screen at positions x and y, scaled at 40% of their original size.
 * Variable 'scaleFactor' is used to take into account the viewport size.
 */
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * 0.4 * scaleFactor,
        Resources.get(this.sprite).naturalHeight * 0.4 * scaleFactor);
};

/* Rock class with x and y coordinates and the offsets and effective size
 * of the visible image inside the sprite.
 * Variable 'scaleFactor' is used to take into account the viewport size.
 */
var Rock = function(x, y) {
    this.x = x * scaleFactor;
    this.y = y * scaleFactor;
    // Offset of the effective image from the x position, necessary to detect collision
    this.xOffset = 1 * scaleFactor;
    // Offset of the effective image from the y position, necessary to detect collision
    this.yOffset = 50 * scaleFactor;
    // Effective width of the image, necessary to detect collision
    this.effectiveWidth = 90 * scaleFactor;
    // Effective height of the image, necessary to detect collision
    this.effectiveHeight = 70 * scaleFactor;
    this.sprite = 'images/Rock.png';
};

/* Function that renders the rock image.
 * Variable 'scaleFactor' is used to take into account the viewport size when drawing.
 */
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * scaleFactor,
        Resources.get(this.sprite).naturalHeight * scaleFactor);
};

/* Heart class with x and y coordinates and the offsets and effective size
 * of the visible image inside the sprite.
 * Variable 'HEART_IMAGE_REDUCTION' is used to adapt the heart image in the game. Its
 * size was too big to fit properly and it was thus reduced. Reduction affected not
 * only the rendering, but also all the variables related to the image visible inside
 * the sprite, to implement the visual effect of collision properly.
 * Variable 'scaleFactor' is used to take into account the viewport size.
 */
var Heart = function() {
    this.x = 323 * scaleFactor;
    this.y = 25 * scaleFactor;
    // Offset of the effective image from the x position, necessary to detect collision
    this.xOffset = 4 * HEART_IMAGE_REDUCTION * scaleFactor;
    // Offset of the effective image from the y position, necessary to detect collision
    this.yOffset = 57 * HEART_IMAGE_REDUCTION * scaleFactor;
    // Effective width of the image, necessary to detect collision
    this.effectiveWidth = 93 * HEART_IMAGE_REDUCTION * scaleFactor;
    // Effective height of the image, necessary to detect collision
    this.effectiveHeight = 57 * HEART_IMAGE_REDUCTION * scaleFactor;
    this.theHeight = 56 * HEART_IMAGE_REDUCTION * scaleFactor;
    this.sprite = 'images/Heart.png';
}

/* Function that renders the heart image.
 * Variable 'scaleFactor' is used to take into account the viewport size when drawing.
 */
Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * HEART_IMAGE_REDUCTION * scaleFactor,
        Resources.get(this.sprite).naturalHeight * HEART_IMAGE_REDUCTION * scaleFactor);
};

/* Key class with x and y coordinates and the offsets and effective size of the visible
 * image inside the sprite.
 * Variable 'KEY_IMAGE_REDUCTION' is used to adapt the key image in the game. Its
 * size was too big to fit properly and it was thus reduced. Reduction affected not
 * only the rendering, but also all the variables related to the image visible inside
 * the sprite, to implement the visual effect of collision properly.
 * Variable 'scaleFactor' is used to take into account the viewport size.
 */
var Key = function() {
    this.x = 123 * scaleFactor;
    this.y = 25 * scaleFactor;
    // Offset of the effective image from the x position, necessary to detect collision
    this.xOffset = 22 * KEY_IMAGE_REDUCTION * scaleFactor;
    // Offset of the effective image from the y position, necessary to detect collision
    this.yOffset = 60 * KEY_IMAGE_REDUCTION * scaleFactor;
    // Effective width of the image, necessary to detect collision
    this.effectiveWidth = 60 * KEY_IMAGE_REDUCTION * scaleFactor;
    // Effective height of the image, necessary to detect collision
    this.effectiveHeight = 70 * KEY_IMAGE_REDUCTION * scaleFactor;
    this.sprite = 'images/Key.png';
};

/* Function that renders the key image.
 * Variable 'scaleFactor' is used to take into account the viewport size when drawing.
 */
Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,
        Resources.get(this.sprite).naturalWidth * KEY_IMAGE_REDUCTION * scaleFactor,
        Resources.get(this.sprite).naturalHeight * KEY_IMAGE_REDUCTION * scaleFactor);
};

/* Check that the number of items in the array is equal to the given number num.
 * If the numer is less than num, insert an object obj into the array.
 */
Array.prototype.checkNumberOfItems = function(num, obj) {
    //console.log(this.length);
    if (this.length < num) {
        this.push(obj);
    }
};

/* Select a gem randomly from a given array.
 */
function selectGem(arr) {
    // Declare an empty string variable and a variable to hold the argument array length
    var gem = '',
        len = arr.length;
    var rand;
    // Check if the length of the argument array is greater than zero
    if (len > 0) {
        // Pick a random number among the remaining indexes in the array
        rand = getRandomInt(0, len - 1);
        // Assign the corresponding array value to the gem variable
        gem = arr[rand];
    }

    return gem;
}

/* Get a random integer number between min (included) and max (included)
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Instantiate the enemy objects.
 * Place all enemy objects in an array called allEnemies.
 * The game starts with 3 enemies entering the canvas.
 */
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
/* Instantiate the player object. There is only one player in the game.
 */
var player = new Player();
/* Instantiate the gem object.
 */
var gem = new Gem();
/* Instantiate the rock objects.
 * Place all rock objects in an array called allRocks.
 */
var allRocks = [new Rock(0, -27), new Rock(202, -27), new Rock(404, -27),
                new Rock(101, 305), new Rock(404, 388)];
/* Instantiate the heart object. There is only one heart in the game.
 */
var heart = new Heart();
/* Instantiate the key object. There is only one key in the game.
 */
var key = new Key();

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

    // Send the keys to the 'Player.handleInput()' method
    player.handleInput(allowedKeys[e.keyCode]);
});

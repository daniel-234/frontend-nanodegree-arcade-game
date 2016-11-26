// Array to hold all the accepted values for the y coordinate of enemies
var verticalCoordinate = [60, 143, 226];
// Array to hold all the possible values for horizontal speed of enemies
var horizontalSteps = [120, 240, 360, 480];
// Real dimensions of images in the images folder

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
    var verticalPos = verticalCoordinate[getRandomInt(0, 2)];   // * scaleFactor;

    console.log(verticalPos);

    // Starting vertical coordinate of an enemy object
    this.y = verticalPos * scaleFactor;   // / 606 * aCanvasHeight;
    // Get a random speed for each enemy instance
    var dxStep = horizontalSteps[getRandomInt(0, 3)] * scaleFactor;
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
        var that = this;
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
    this.sprite = 'images/char-boy.png';
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
    if (key === "left" && this.x > 0) {
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


        //this.playerScale = scaleFactor;

        this.x += this.dx;
        this.y += this.dy;
        //this.x *= scaleFactor;
        //this.y *= scaleFactor;
        this.dx = 0;
        this.dy = 0;
    //}

    //console.log("Player pos: " + this.y);
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


/* Instantiate the enemy objects.
 * Place all enemy objects in an array called allEnemies.
 * The game starts with 3 enemies entering the canvas.
 */
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

/* Instantiate the player object. There is only one player per game.
 */
var player = new Player();


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

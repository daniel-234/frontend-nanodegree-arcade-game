// Array to hold all the accepted values for the y coordinate of enemies
var verticalCoordinate = [60, 143, 226];
// Array to hold all the possible values for horizontal speed of enemies
var horizontalSteps = [120, 240, 360, 480];

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // Starting horizontal position of enemies is out of canvas on the left
    this.x = -101;
    // Get a random vertical position for each enemy instance
    var verticalPos = verticalCoordinate[getRandomInt(0, 2)]
    this.y = verticalPos;
    // Get a random speed for each enemy instance
    var dxStep = horizontalSteps[getRandomInt(0, 3)];
    this.dx = dxStep
    console.log("Vertical pos: " + verticalPos);
    console.log("Horizontal step: " + dxStep);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/* Get a random integer number between min (included) and max (included)
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Update the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= 610) {
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
 *
 * Use setTimeout to avoid flickering of enemy sprites (see answer in Stackoverflow:
 * http://stackoverflow.com/questions/19619512/image-flickering-in-canvas).
 */
Enemy.prototype.determineIfOut = function() {
    if (this.x > 610) {
        var that = this;
        var pos = allEnemies.indexOf(that)

        //console.log(pos);
        //allEnemies.push(new Enemy());
        //allEnemies.splice(pos, 1);

        setTimeout( function() {
            allEnemies.splice(pos, 1);
        }, 0);
    }
};

/* Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


/* Instantiate the enemy objects.
 * Place all enemy objects in an array called allEnemies.
 * The game starts with 3 enemies entering the canvas.
 */
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

// Place the player object in a variable called player

// for (var i = 0; i < allEnemies.length; i++) {
//     if (allEnemies[0].x > 600) {
//         console.log("A");
//     }
// }

/* Check that the number of items in the array is 3.
 * If the numer is less than 3, add a new enemy to the array.
 */
Array.prototype.checkNumberOfItems = function() {
    console.log(this.length);
    if (this.length < 3) {
        this.push(new Enemy());
    }
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

    player.handleInput(allowedKeys[e.keyCode]);
});

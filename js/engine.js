/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        // Flag variable set to true when user is playing the game, false otherwise
        active = false;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        // Get our time delta information which is required if your game requires smooth animation. Because everyone's computer processes
        // instructions at different speeds we need a constant value that would be the same for everyone (regardless of how fast their
        // computer is) - hurray time!
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        //
        //
        // Check if the game is in a state that needs a reset.
        //reset();
        //


        // Call our update/render functions, pass along the time delta to our update function since it may be used for smooth animation.
        update(dt);
        render();


        // Set our lastTime variable which is used to determine the time delta for the next time this function is called.
        lastTime = now;

        // If the flag variable active is true, use the browser's requestAnimationFrame function
        // to call this function again as soon as the browser is able to draw another frame.
        // If the flag variable is false, draw the Game Over screen.
        if (active) {
            win.requestAnimationFrame(main);
        } else {
            renderAtGameOver();
        }


        // if (active) {
        //     win.requestAnimationFrame(main);
        // } else {
        //     renderAtStart();
        // }

    }

    /* Draw the start screen the first time the game is loaded by the user.
     */
    function init() {
        drawGameScene();
        ctx.font = "36pt Impact";
        ctx.fillText("Start Game", 145, 352);
        //player.render();
        //renderEntities();
    }




    /* Call a function to draw the initial screen, that appears only the first time the game is loaded.
     */
    //function init() {
        //
        //reset();
        //renderAtStart();
        //lastTime = Date.now();
        //main();
    //}





    /* Set the flag variables to true to start the game.
     */
    function playGame() {
        active = true;
        //
        //firstStart = false;
        //
        //reset();
        //renderAtStart();
        // Set the lastTime variable that is required for the game loop.
        lastTime = Date.now();
        // Call the game loop function
        main();
    }



    //
    /* Draw the start screen the first time the game is loaded by the user.
     */
    //function renderAtStart() {
    //    drawGameScene();
    //    ctx.font = "36pt Impact";
    //    ctx.fillText("Start Game", 145, 352);
        //player.render();
        //renderEntities();
    //}
    //


    /* Draw the screen to Start Again after Game Over.
     */
    function renderAtGameOver() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGameScene();
        ctx.font = "50pt Impact";
        ctx.fillText("Game Over", 105, 262);
        ctx.font = "36pt Impact";
        ctx.fillText("Start Again", 140, 352);
        player.startAgain();
        //renderEntities();
    }

    /* TODO
     * Draw the screen to Start Again after victory.
     */

    /* Draw the game scenario (water, stone and grass tiles) in canvas.
     */
    function drawGameScene() {
        // This array holds the relative URL to the image used for that particular row of the game level
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Loop through the number of rows and columns we've defined above and, using the rowImages array,
        // draw the correct image for that portion of the "grid"
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                // The drawImage function of the canvas' context element requires 3 parameters: the image to draw,
                // the x coordinate to start drawing and the y coordinate to start drawing.
                // We're using our Resources helpers to refer to our images so that we get the benefits of caching
                // these images, since we're using them over and over.
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
    }


    /* Draw the "game level" and then call the renderEntities function.
     */
    function render() {
        // Render the game level scenario
        drawGameScene();
        // Render the game entities (player and enemies)
        renderEntities();
    }

    /* Call the render functions you have defined on your enemy and player entities within app.js.
     * This function is called by the render function and is called on each game tick.
     */
    function renderEntities() {
        // Loop through all of the objects within the allEnemies array and call the render function you have defined
        // and a function to determine for each enemy if it has exited the canvas.
        allEnemies.forEach(function(enemy) {
            enemy.render();
            enemy.determineIfOut();
        });
        // If there are less than 3 enemies in the array, insert a new one.
        allEnemies.checkNumberOfItems();
        player.render();
    }


    /* Call all of the functions which may need to update entity's data.
     * This function is called by main (our game loop) and itself calls all of the functions which may need
     * to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* Update the data/properties related to the game objects (enemies inside the array and player).
     * This is called by the update function and as first thing it checks if the player has won by reaching the water.
     * Then it loops through all of the objects within your allEnemies array as defined in app.js
     * and calls their update() methods. It will then call the update function for your player object.
     * These update methods should focus purely on updating the data/properties related to the object.
     * Do your drawing in your render methods.
     */
    function updateEntities(dt) {
        if (player.checkIfWon()) {
            reset();
        }
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        //
        //player.checkIfWon();

    }


    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            if (player.checkCollision(enemy)) {
                reset();
            }
        });
        //
        //player.checkIfWon();

    }


    //
    //
    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
     //



    /* Set the flag variable active to false so it stops the game from looping until the user decides
     * to start it again.
     */
    function reset() {
        // if (player.checkIfWon()) {
        //     active = false;
        // }
        active = false;

        //
        //player.checkIfWon();
    }



    /* Listen for a click of the mouse. If the user clicks the "Start Game" text inside
     * canvas, the function playGame is called and the game starts.
     */
    canvas.addEventListener('click', function(mouseE) {
        // Assign to mouseX and mouseY the x and y coordinates inside the canvas element
        // of the point that has been clicked by the mouse.
        var mouseX = mouseE.x;
        var mouseY = mouseE.y;
        // Return the offset in pixels of the point that has been clicked from the canvas left border.
        mouseX -= canvas.offsetLeft;
        // Return the offset in pixels of the point that has been clicked from the canvas top border.
        mouseY -= canvas.offsetTop;
        // Check if the x and y mouse coordinates are inside the text "Start Game"
        if (mouseX > 145 && mouseX < 360) {
            if (mouseY > 312 && mouseY < 350) {
                //
                //console.log("Start!");

                // If the user clicks the text, start the game
                playGame();
            }
        }

        //
        // console.log("x: " + mouseX + ", y: " + mouseY);

        //player.handleInput(allowedKeys[e.keyCode]);
    });

    // Load all of the images we know we're going to need to draw our game level.
    // Then set init as the callback method, so that when all of these images are properly loaded
    // our game will start.
    var imagesA = Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);      //init);


    // Assign the canvas' context object to the global variable (the window object when run in a browser)
    // so that developers can use it more easily from within their app.js files.
    global.ctx = ctx;
})(this);

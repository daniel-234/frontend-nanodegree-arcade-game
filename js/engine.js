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
        active = false,
        // Flag variable set to true if the player collided with an enemy, false otherwise
        crashed = false,
        // mouse click x and y coordinates
        mouseX = 0,
        mouseY = 0,
        // user touch x and y coordinates
        touchX = 0,
        touchY = 0,
        // x and y coordinates of an imaginary rectangle that surrounds the text 'Start Game'
        // or 'Start Again' in the initial screens. The user needs to click or touch this text
        // in order for the game to start
        startTextInitialX = 145,
        startTextInitialY = 312,
        startTextFinishingX = 360,
        startTextFinishingY = 350;
        //playerCenterX = player.x + 50,
        //playerCenterY = player.y + 107;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        // Get our time delta information which is required if your game requires
        // smooth animation. Because everyone's computer processes instructions at
        // different speeds we need a constant value that would be the same for
        // everyone (regardless of how fast their computer is) - hurray time!
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        //
        //
        // Check if the game is in a state that needs a reset.
        //reset();
        //


        // Call our update/render functions, pass along the time delta to our
        // update function since it may be used for smooth animation.
        update(dt);
        render();


        // Set our lastTime variable which is used to determine the time delta for the next
        // time this function is called.
        lastTime = now;

        // If the flag variable active is true, use the browser's requestAnimationFrame function
        // to call this function again as soon as the browser is able to draw another frame.
        // If the flag variable is false, draw the Game Over screen.
        if (active) {
            win.requestAnimationFrame(main);
        } else {
            if (crashed === true) {
                renderAtGameOver();
            } else {
                renderAfterWin();
            }
        }


        // if (active) {
        //     win.requestAnimationFrame(main);
        // } else {
        //     renderAtStart();
        // }

    }

    /* Draw the start screen the first time the game is loaded.
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





    /* Set the conditions for the game to start and call its main function.
     */
    function playGame() {
        // Set the active flag variable to true to start the game
        active = true;
        crashed = false;

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
     /* Draw the screen to Start Again after Game Over.
     */
    function renderAfterWin() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGameScene();
        ctx.font = "50pt Impact";
        ctx.fillText("You Won!", 125, 262);
        ctx.font = "36pt Impact";
        ctx.fillText("Start Again", 140, 352);
        player.startAgain();
        //renderEntities();
        //crashed = false;
    }



    /* Draw the game scenario (water, stone and grass tiles) in canvas.
     */
    function drawGameScene() {
        // This array holds the relative URL to the image used for that
        // particular row of the game level
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

        // Loop through the number of rows and columns we've defined above
        // and, using the rowImages array, draw the correct image for that
        // portion of the "grid"
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                // The drawImage function of the canvas' context element
                // requires 3 parameters: the image to draw, the x coordinate
                // to start drawing and the y coordinate to start drawing.
                // We're using our Resources helpers to refer to our images
                // so that we get the benefits of caching these images, since
                // we're using them over and over.
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

    /* Call the render functions you have defined on your enemy and player
     * entities within app.js.
     * This function is called by the render function and is called on each game tick.
     */
    function renderEntities() {
        // Loop through all of the objects within the allEnemies array and call the
        // render function you have defined and a function to determine for each
        // enemy if it has exited the canvas.
        allEnemies.forEach(function(enemy) {
            enemy.render();
            enemy.determineIfOut();
        });
        // If there are less than 3 enemies in the array, insert a new one
        allEnemies.checkNumberOfItems();
        player.render();
    }


    /* Call all of the functions which may need to update entity's data.
     * This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* Update the data/properties related to the game objects (enemies
     * inside the array and player).
     * This is called by the update function and as first thing it checks
     * if the player has won by reaching the water. Then it loops through
     * all of the objects within your allEnemies array as defined in app.js
     * and calls their update() methods. It will then call the update function
     * for your player object.
     * These update methods should focus purely on updating the data/properties
     * related to the object. Do your drawing in your render methods.
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


    /* Check if there is a collision. If any is detected, reset the game.
     */
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            if (player.checkCollision(enemy)) {
                crashed = true;
                reset();
                //console.log("collision");
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





    /* Set the flag variable active to false so it stops the game from looping
     * until the user decides to start it again.
     */
    function reset() {

        // if (player.checkIfWon()) {
        //     active = false;
        // }

        active = false;
        //crashed = false;

        //
        //player.checkIfWon();
    }



    /* Listen for user actions
     */
    //canvas.addEventListener('click', clickOnStart, false);
    //canvas.addEventListener("touchend", touchOnStart, false);
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("touchdown", touchDown, false);


    // To DELETE
    //
    /* Listen for a click of the mouse. If the user clicks the "Start Game" text inside
     * canvas, the function playGame is called and the game starts.
     */
    function clickOnStart(e) {
        if(!e) {
            e = event;
        }
        e.preventDefault();
        // Assign to clickOnStartX and clickOnStartY the x and y coordinates
        // inside the canvas parent element, that is body.
        // To get the x and y coordinates of the click event relative to the canvas,
        // we need to consider that the canvas element has an offset from its
        // parent element. To take that into account, subtract the left and top
        // canvas offsets from the x and y coordinates registered inside the body.
        var clickOnStartX = e.pageX - canvas.offsetLeft;
        var clickOnStartY = e.pageY - canvas.offsetTop;
        // Check if the x and y mouse coordinates are inside the text "Start Game"
        if (clickOnStartX > 145 && clickOnStartX < 360) {
            if (clickOnStartY > 312 && clickOnStartY < 350) {

                //
                //console.log("Start!");

                // If the user clicks inside the text, start the game
                playGame();
            }
        }

        console.log("StartMouse");


        //
        // console.log("x: " + mouseX + ", y: " + mouseY);

        //player.handleInput(allowedKeys[e.keyCode]);

    }


    // TO DELETE
    //
    /* Listen for a touch. If the user touches the "Start Game" text inside
     * canvas, the function playGame is called and the game starts.
     */
    function touchOnStart(e) {
        if(!e) {
            e = event;
        }
        e.preventDefault();
        // Assign to clickOnStartX and clickOnStartY the x and y coordinates
        // inside the canvas parent element, that is body.
        // To get the x and y coordinates of the click event relative to the canvas,
        // we need to consider that the canvas element has an offset from its
        // parent element. To take that into account, subtract the left and top
        // canvas offsets from the x and y coordinates registered inside the body.
        startTouchX = e.targetTouches[0].pageX - canvas.offsetLeft;
        startTouchY = e.targetTouches[0].pageY - canvas.offsetTop;
        // Check if the x and y mouse coordinates are inside the text "Start Game"
        if (touchUp === 0) {
            if (startTouchX > 145 && startTouchX < 360) {
                if (startTouchY > 312 && startTouchY < 350) {

                    //
                    //console.log("Start!");

                    // If the user clicks inside the text, start the game
                    playGame();
                }
            }
        }

        console.log(e.targetTouches.length);
        touchUp = 1;
        console.log(touchUp);
        console.log(e.targetTouches.length);
        //console.log("touch x: " + e.targetTouches[0].pageX);
        //console.log("touch y: " + e.targetTouches[0].pageY);


        //
        // console.log("x: " + mouseX + ", y: " + mouseY);

        //player.handleInput(allowedKeys[e.keyCode]);

    }



    /* Listen for a click of the mouse to move the player. When the user
     * clicks on the game field inside the canvas, the function detects
     * its distance from the player and decides which of the four main
     * directions has the greater distance from the player center.
     * If the point is midway between two directions (like NW), it computes
     * the distance between it and the player and evaluates which coordinate
     * is farther from the player image center.
     */
    function mouseDown(e) {
        if(!e) {
            e = event;
        }
        e.preventDefault();
        // Assign to clickOnStartX and clickOnStartY the x and y coordinates
        // inside the canvas parent element, that is body.
        // To get the x and y coordinates of the click event relative to the canvas,
        // we need to consider that the canvas element has an offset from its
        // parent element. To take that into account, subtract the left and top
        // canvas offsets from the x and y coordinates registered inside the body.
        mouseX = e.pageX - canvas.offsetLeft;
        mouseY = e.pageY - canvas.offsetTop;

        //console.log("x: " + mouseX + ", y: " + mouseY);


        // Check if the game is in its active state
        if (active === false) {

            if (mouseX > startTextInitialX && mouseX < startTextFinishingX) {
                if (mouseY > startTextInitialY && mouseY < startTextFinishingY) {

                //
                //console.log("Start!");

                // If the user clicks inside the text, start the game
                    playGame();
                }
            }
        } else {

            //}




            // Check if the user clicks a point that has a horizontal distance from the
            // position of the effective center of the player greater than its vertical distance
            // The player centre is located approximately 50px from its x coordinate and 85px
            // from its y coordinate
            if (Math.abs(mouseX - (player.x + 50)) > (Math.abs(mouseY - (player.y + 107)))) {
                // Check if the click is on the left of the player
                if (mouseX <= (player.x + 50)) {
                    // Move the player on the left
                    player.handleInput("left");
                    console.log("player x: " + player.x + " player y: " + player.y);
                    console.log("mouse x: " + mouseX + " mouse y: " + mouseY);
                // Check if the click is on the right of the player
                } else {
                    // Move the player on the right
                    player.handleInput("right");
                    console.log("player x: " + player.x + " player y: " + player.y);
                    console.log("mouse x: " + mouseX + " mouse y: " + mouseY);
                }
            }
            // Check if the user clicks a point that has a vertical distance from the
            // position of the effective center of the player greater than its horizontal distance
            else {
                // Check if the click is on the bottom of the player
                if (mouseY >= (player.y + 107)) {
                    // Move the player down
                    player.handleInput("down");
                    console.log("player x: " + player.x + " player y: " + player.y);
                    console.log("mouse x: " + mouseX + " mouse y: " + mouseY);
                // Check if the click is on the top of the player
                } else {
                    // Move the player up
                    player.handleInput("up");
                    console.log("player x: " + player.x + " player y: " + player.y);
                    console.log("mouse x: " + mouseX + " mouse y: " + mouseY);
                }
            }
            // else if (Math.abs(mouseX - player.x) > (Math.abs(mouseY - player.y))) {
            //     console.log("yeah!");
                //player.handleInput("left");

        }

        console.log("MoveMouse");
    }


    /* Listen for a touch from the user to move the player. When the user
     * touches on the game field inside the canvas, the function detects
     * its distance from the player and decides which of the four main
     * directions has the greater distance from the player center.
     * If the point is midway between two directions (like NW), it computes
     * the distance between it and the player and evaluates which coordinate
     * is farther from the player image center.
     */
    function touchDown(e) {
        if(!e) {
            e = event;
        }
        e.preventDefault();
        // Assign to clickOnStartX and clickOnStartY the x and y coordinates
        // inside the canvas parent element, that is body.
        // To get the x and y coordinates of the click event relative to the canvas,
        // we need to consider that the canvas element has an offset from its
        // parent element. To take that into account, subtract the left and top
        // canvas offsets from the x and y coordinates registered inside the body.
        touchX = e.targetTouches[0].pageX - canvas.offsetLeft;
        touchY = e.targetTouches[0].pageY - canvas.offsetTop;

        //console.log("x: " + mouseX + ", y: " + mouseY);


        // Check if the game is in its active state
        if (active === false) {

            if (touchX > startTextInitialX && touchX < startTextFinishingX) {
                if (touchY > startTextInitialY && touchY < startTextFinishingY) {

                    //
                    //console.log("Start!");

                    // If the user clicks inside the text, start the game
                    playGame();
                }
            }





        } else {


        //}
            // Check if the user clicks a point that has a horizontal distance from the
            // position of the effective center of the player greater than its vertical distance
            // The player centre is located approximately 50px from its x coordinate and 85px
            // from its y coordinate
            if (Math.abs(touchX - (player.x + 50)) > (Math.abs(touchY - (player.y + 107)))) { //(player.y + 107)))) {
                // Check if the click is on the left of the player
                if (touchX <= (player.x + 50)) {
                    // Move the player on the left
                    player.handleInput("left");
                    console.log("player x: " + player.x + " player y: " + player.y);
                    console.log("mouse x: " + mouseX + " mouse y: " + mouseY);
                // Check if the click is on the right of the player
                } else {
                    // Move the player on the right
                    player.handleInput("right");
                    console.log("player x: " + player.x + " player y: " + player.y);
                    console.log("mouse x: " + mouseX + " mouse y: " + mouseY);
                }
            }
            // Check if the user clicks a point that has a vertical distance from the
            // position of the effective center of the player greater than its horizontal distance
            else {
                // Check if the click is on the bottom of the player
                if (touchY >= (player.y + 107)) {
                    // Move the player down
                    player.handleInput("down");
                    console.log("player x: " + player.x + " player y: " + player.y);
                    console.log("mouse x: " + mouseX + " mouse y: " + mouseY);
                // Check if the click is on the top of the player
                } else {
                    // Move the player up
                    player.handleInput("up");
                    console.log("player x: " + player.x + " player y: " + player.y);
                    console.log("mouse x: " + mouseX + " mouse y: " + mouseY);
                }
            }
            // else if (Math.abs(mouseX - player.x) > (Math.abs(mouseY - player.y))) {
            //     console.log("yeah!");
                //player.handleInput("left");

        }

        console.log("MoveTouch");
    }



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

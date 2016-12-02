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

// See if only scaleFactor is needed here
var scaleFactor,
    oldScaleFactor,
    resized = false,
    aCanvasWidth = 0,
    aCanvasHeight = 0;

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        //inMemCanvas = doc.createElement('canvas'),
        //inMemCtx = inMemCanvas.getContext('2d'),
        lastTime,
        // Flag variable set to true when user is playing the game, false otherwise
        active = false,
        // Flag variable set to true if the player collided with an enemy, false otherwise
        crashed = false,
        playerWon = false,
        // Initialize mouse click x and y coordinates
        mouseX = 0,
        mouseY = 0,
        // Initialize user touch x and y coordinates
        touchX = 0,
        touchY = 0,
        // x and y coordinates of an imaginary rectangle that surrounds
        // the text 'Start Game' or 'Start Again' in the initial screens.
        // The user needs to click or touch this text in order for the
        // game to start.

        //startTextInitialX = 145,
        //startTextInitialY = 312,
        //startTextFinishingX = 360,
        //startTextFinishingY = 350,

        //playerCenterX = player.x + 50,
        //playerCenterY = player.y + 107;

        // Set canvas max width and max height for bigger viewports.
        // These will be the maximum  dimensions for the canvas and
        // they will be the reference for the canvas in smaller viewports,
        // where the program will calculate the reduction factor for
        // the new dimensions compared to the original ones and use
        // that value to redraw the canvas and scale it proportionally.
        originalWidth = 505,
        originalHeight = 606,

        remainingGems = 3,
        remainingHearts = 1,
        world = 1;
        //lives = 1;
        // Set a variable that calculates the scale factor for smaller
        // viewports. The game field fits in a canvas that has dimensions
        // equal to originalWidth and originalHeight. If the viewport is
        // smaller, the function 'drawGameScene' needs to take this change
        // into account to draw all the tiles images that  compose the
        // full scene with reduced dimensions.
        // This variable sets the value that drives that reduction.
        //scaleFactor;

    // Set canvas width, height and scale factor to the appropriate values
    // depending on the viewport size.
    canvas.width = calculateCanvasSize()[0];
    canvas.height = calculateCanvasSize()[1];
    aCanvasWidth = canvas.width;
    aCanvasHeight = canvas.height;
    scaleFactor = calculateCanvasSize()[2];
    oldScaleFactor = scaleFactor;

    console.log("canvas width: " + canvas.width + " - canvas height: " + canvas.height);

    startTextInitialX = 0.2871 * canvas.width;
    startTextInitialY = 0.51485 * canvas.height;
    startTextFinishingX = 0.71287 * canvas.width;
    startTextFinishingY = 0.5775 * canvas.height;

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
            if (playerWon) {
                renderAfterWin();
                //renderAtGameOver();
            } else {
                renderAtGameOver();
                //renderAfterWin();
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
        var fontSize = 36 * scaleFactor;
        ctx.font = fontSize + "pt" + " " + "Impact";
        ctx.fillText("Start Game", startTextInitialX, startTextFinishingY);  //145, 352);
        //player.render();
        //renderEntities();
        console.log(ctx.font);
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
        //availableGems = 3,
        remainingGems = 3;
        remainingHearts = 1;
        world = 1;
        //lives = 1;
        active = true;
        crashed = false;

        //availableGems = 3;
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
        var fontSizeGameOver = 50 * scaleFactor;
        var fontSizeGameStart = 36 * scaleFactor;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGameScene();
        ctx.font = fontSizeGameOver + "pt" + " " + " Impact";
        ctx.fillText("Game Over", 0.208 * canvas.width, 0.432 * canvas.height);  //105, 262);

        //availableGems = 3;
        ctx.font = fontSizeGameStart + "pt" + " " + " Impact";
        ctx.fillText("Start Again", startTextInitialX, startTextFinishingY);   //140, 352);
        //availableGems = 3;
        availableGems.replaceGems();

        player.startAgain();
        allEnemies.reFill();

        //remainingGems = 3;
        //availableGems.replaceGems();

        //availableGems = 3;
        //renderEntities();
    }

    /* TODO
     * Draw the screen to Start Again after victory.
     */
     /* Draw the screen to Start Again after Game Over.
     */
    function renderAfterWin() {
        var fontSizeWin = 50 * scaleFactor;
        var fontSizeGameStart = 36 * scaleFactor;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGameScene();
        ctx.font = fontSizeWin + "pt" + " " + " Impact";
        ctx.fillText("You Won!", 0.247 * canvas.width, 0.432 * canvas.height);

        //availableGems = 3;
        //ctx.fillText("You Won!", 125, 262);
        //ctx.font = "36pt Impact";
        //ctx.fillText("Start Again", 140, 352);
        ctx.font = fontSizeGameStart + "pt" + " " + " Impact";
        ctx.fillText("Start Again", startTextInitialX, startTextFinishingY);   //140, 352);

        availableGems.replaceGems();
        player.startAgain();
        allEnemies.reFill();

        //remainingGems = 3;
        //availableGems = ["blue", "green", "orange"];

        //availableGems = 3;
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
                ctx.drawImage(Resources.get(rowImages[row]), col * 101 * scaleFactor, row * 83 * scaleFactor,
                    Resources.get(rowImages[row]).naturalWidth * scaleFactor, Resources.get(rowImages[row]).naturalHeight * scaleFactor);
            }
        }

    }


    /* Draw the game scenario (water, stone and grass tiles) in canvas.
     */
    function drawGameScene1() {
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

        if (remainingGems > 0) {
            renderExtras();
        }

        renderRocks();

        // Render the game entities (player and enemies)
        renderEntities();

        //renderExtras();
        renderScore();

        if (remainingHearts > 0) {
            renderHeart();
        }

        if (world === 1) {
            renderKey();
        }


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


    function renderExtras() {
        gem.render();
        //rock1.render();
        //rock2.render();
        //rock3.render();
    }

    function renderRocks() {
        allRocks.forEach(function(rock) {
            rock.render();
        });
        //rock1.render();
        //rock2.render();
        //rock3.render();
    }

    function renderScore() {
        var fontSizeGameStart = 16 * scaleFactor;
        ctx.font = fontSizeGameStart + "pt" + " " + " Impact";
        //ctx.fillStyle = "#fff";
        ctx.fillText("Score: " + player.score, 11 * scaleFactor, 572 * scaleFactor);   //140, 352);    20

        ctx.fillText("Lives: " + player.lives + "/2", 112 * scaleFactor, 572 * scaleFactor);   //140, 352);

        ctx.fillText("World: 1", 213 * scaleFactor, 572 * scaleFactor);   //140, 352);
    }


    function renderHeart() {
        heart.render();
    }

    function renderKey() {
        key.render();
    }


    /* Call all of the functions which may need to update entity's data.
     * This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisionsWithEnemies();
        checkCollisionsWithGems();
        checkCollisionWithStones();
        checkCollisionWithHeart();
        checkCollisionWithKey();
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
            playerWon = true;
            reset();
        }

        // if (resized) {
        //     player.updateIfResized();
        //     resized = false;
        // }

        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();


        //
        //player.checkIfWon();

    }





    /* Check if there is a collision. If any is detected, reset the game.
     */
    function checkCollisionsWithEnemies() {
        allEnemies.forEach(function(enemy) {
            if (player.checkCollision(enemy)) {
                //crashed = true;
                enemy.explode();


                if (player.lives > 1) {
                    player.lives -= 1;
                } else {
                    reset();
                    //console.log("Ciao");
                }

                // if (player.lives === 1) {
                //     reset();
                // } else {
                //     player.lives -= 1;
                // }

                console.log("collision; lives: " + player.lives);
            }
        });

        //
        //player.checkIfWon();
    }


    function checkCollisionsWithGems() {
        // Check if the player touches a gem
        if (player.checkCollision(gem)) {

            //player.updateScore();
            //player.collect(gem);
            //player.updateScore();
            //player.updateScore(gem);


            // Check if there are more gems to collect
            if (remainingGems > 0) {
                // Decrease the number of gems still remaining
                remainingGems -= 1;
                // Collect the gem
                player.collect(gem);
                // Update the
                player.updateScore();

                // Check if there are any more gems to display
                if (remainingGems > 0) {
                    //player.collect(gem);

                    // Display one of the remaining gems
                    gem.replace();
                }

            }



        }
    }

    function checkCollisionsWithGems1() {
        // Check if there are more gems to collect
        if (remainingGems >= 0) {
            // Check if the player touches a gem
            if (player.checkCollision(gem)) {

                //player.updateScore();
                //player.collect(gem);
                //player.updateScore();
                //player.updateScore(gem);

                // Collect the gem
                player.collect(gem);
                // Decrease the number of gems still remaining
                remainingGems -= 1;

                player.updateScore();

                // Check if there are gems to display yet
                if (remainingGems > 0) {
                    //player.collect(gem);

                    // Display one of the remaining gems
                    gem.replace();
                    //remainingGems -= 1;
                }

            }



        }
    }


    function checkCollisionWithStones() {
        allRocks.forEach(function(rock) {
            if (player.checkCollision(rock)) {
                console.log("rock");
            }
        });
    }



    function checkCollisionWithHeart() {
        if (player.checkCollision(heart)) {
            console.log("heart");
            console.log("remaining hearts: " + remainingHearts);
            if (remainingHearts > 0) {
                //enemy.explode();
                player.lives += 1;
                remainingHearts = 0;
            }

        };

    }


    function checkCollisionWithKey() {
        console.log("world before collecting key: " + world);
        if (player.checkCollision(key)) {
            console.log("key collected!");
            //console.log("world: " + world);
            if (world === 1) {
                //enemy.explode();
                world = 2;
                //remainingHearts = 0;
            }

        };
        console.log("world after collecting key: " + world);

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

        if (playerWon === true) {
            active = false;
        } else {  //if (player.lives === 0) {
            crashed = true;
            active = false;
        }

        //crashed = true;
        //active = false;

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
            if (Math.abs(mouseX - (player.x + (50 * scaleFactor))) > (Math.abs(mouseY - (player.y + (107 * scaleFactor))))) {
                // Check if the click is on the left of the player
                if (mouseX <= (player.x + (50 * scaleFactor))) {
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
                if (mouseY >= (player.y + (107 * scaleFactor))) {
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
            if (Math.abs(touchX - (player.x + (50 * scaleFactor))) > (Math.abs(touchY - (player.y + (107 * scaleFactor))))) {   //(player.y + 107)))) {
                // Check if the click is on the left of the player
                if (touchX <= (player.x + (50 * scaleFactor))) {
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
                if (touchY >= (player.y + (107 * scaleFactor))) {
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
        'images/char-boy.png',
        'images/gem-blue.png',
        'images/gem-green.png',
        'images/gem-orange.png',
        'images/Rock.png',
        'images/Heart.png',
        'images/Key.png'
    ]);
    Resources.onReady(init);      //init);

    function calculateCanvasSize() {
        var viewportWidth = win.innerWidth;
        var viewportHeight = win.innerHeight;
        var canvasWidth = 0,
            canvasHeight = 0,
            scaleHeight = 0,
            scaleWidth = 0;
            //canvasDimensions = [];
            oldScaleFactor = scaleFactor;


        if (viewportHeight < 600) {
            scaleHeight = viewportHeight / originalHeight;
            scaleWidth = viewportWidth / originalWidth;
            if (scaleHeight < scaleWidth) {
                scaleFactor = scaleHeight;
            } else {
                scaleFactor = scaleWidth;
            }

            canvasHeight = originalHeight * scaleFactor;
            canvasWidth = originalWidth * scaleFactor;

            //newHeight = viewportHeight;
            //newWidth = newHeight * canvas.width / canvas.height;
            //scaleFactor = newHeight / originalHeight;
        } else if (viewportWidth < 505) {
            scaleHeight = viewportHeight / originalHeight;
            scaleWidth = viewportWidth / originalWidth;
            if (scaleHeight < scaleWidth) {
                scaleFactor = scaleHeight;
            } else {
                scaleFactor = scaleWidth;
            }

            // this assignment can go outside the if
            canvasHeight = originalHeight * scaleFactor;
            canvasWidth = originalWidth * scaleFactor;

            //newWidth = viewportWidth;
            //newHeight = newWidth * canvas.height / canvas.width;
            //scaleFactor = newHeight / originalHeight;
        } else {
            scaleFactor = 1;
            canvasHeight = originalHeight;
            canvasWidth = originalWidth;
            //scaleFactor = scaleFactor = doc.documentElement.clientHeight / originalHeight;
        }

        // Use scaleFactor here
        startTextInitialX = 0.2871 * canvasWidth;
        startTextInitialY = 0.51485 * canvasHeight;
        startTextFinishingX = 0.71287 * canvasWidth;
        startTextFinishingY = 0.5775 * canvasHeight;

        console.log(scaleFactor);

        // Better to return the local variables or to simply set global ones?
        return [canvasWidth, canvasHeight, scaleFactor];

    }

    // Do we really need this function?
    function displayViewportSize() {
        // Get the dimensions of the viewport
        //var viewportWidth = doc.documentElement.clientWidth;
        //var viewportHeight = doc.documentElement.clientHeight;
        // var viewportWidth = win.innerWidth;
        // var viewportHeight = win.innerHeight;
        // var canvasWidth, canvasHeight, scaleHeight, scaleWidth;

        // Determine new size


        //var newWidth = viewportWidth;
        //var scalingFactor = canvas.height / canvas.width;
        //var newHeight = newWidth * canvas.height / canvas.width;
        // if (viewportHeight < 600) {
        //     scaleHeight = viewportHeight / originalHeight;
        //     scaleWidth = viewportWidth / originalWidth;
        //     if (scaleHeight < scaleWidth) {
        //         scaleFactor = scaleHeight;
        //     } else {
        //         scaleFactor = scaleWidth;
        //     }

        //     canvasHeight = originalHeight * scaleFactor;
        //     canvasWidth = originalWidth * scaleFactor;

            //newHeight = viewportHeight;
            //newWidth = newHeight * canvas.width / canvas.height;
            //scaleFactor = newHeight / originalHeight;
        // } else if (viewportWidth < 505) {
        //     scaleHeight = viewportHeight / originalHeight;
        //     scaleWidth = viewportWidth / originalWidth;
        //     if (scaleHeight < scaleWidth) {
        //         scaleFactor = scaleHeight;
        //     } else {
        //         scaleFactor = scaleWidth;
        //     }

        //     canvasHeight = originalHeight * scaleFactor;
        //     canvasWidth = originalWidth * scaleFactor;

            //newWidth = viewportWidth;
            //newHeight = newWidth * canvas.height / canvas.width;
            //scaleFactor = newHeight / originalHeight;
        // } else {
        //     canvasHeight = originalHeight;
        //     canvasWidth = originalWidth;
        //     scaleFactor = 1;
        //     //scaleFactor = scaleFactor = doc.documentElement.clientHeight / originalHeight;
        // }

        // calling a function on player and enemy?
        player.x /= scaleFactor;
        player.y /= scaleFactor;
        allEnemies.forEach(function(enemy) {
            enemy.x /= scaleFactor;
            enemy.y /= scaleFactor;
            enemy.dx /= scaleFactor;
            enemy.dy /= scaleFactor;
        });
        gem.x /= scaleFactor;
        gem.y /= scaleFactor;
        allRocks.forEach(function(rock) {
            rock.x /= scaleFactor;
            rock.y /= scaleFactor;
        });
        heart.x /= scaleFactor;
        heart.y /= scaleFactor;

        var canvasWidth = calculateCanvasSize()[0];
        var canvasHeight = calculateCanvasSize()[1];

        // if (scaleFactor != calculateCanvasSize()[2]) {
        //     scaleFactor = calculateCanvasSize()[2];
        //     resized = true;
        // }
        scaleFactor = calculateCanvasSize()[2];
        //oldScaleFactor = calculateCanvasSize()[3];

        //var canvas = document.getElementsByTagName("canvas");
        console.log(canvas.width);
        console.log(scaleFactor);
        console.log(canvasWidth);
        console.log(canvasHeight);

        // Resize
        //inMemCanvas.width = canvas.width;
        //inMemCanvas.height = canvas.height;

        //inMemCtx.drawImage(canvas, 0, 0);

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // maybe calling a function on either payer and enemy is more appropriate?
        player.x *= scaleFactor;
        player.y *= scaleFactor;
        gem.x *= scaleFactor;
        gem.y *= scaleFactor;
        allEnemies.forEach(function(enemy) {
            enemy.x *= scaleFactor;
            enemy.y *= scaleFactor;
            enemy.dx *= scaleFactor;
            enemy.dy *= scaleFactor;
        });
        allRocks.forEach(function(rock) {
            rock.x *= scaleFactor;
            rock.y *= scaleFactor;
        });
        heart.x *= scaleFactor;
        heart.y *= scaleFactor;

        console.log("width: " + canvasWidth + " height: " + canvasHeight);

        //player.updateIfResized();

        //drawGameScene();
        //playGame();
        //resized = true;
        if (oldScaleFactor != scaleFactor) {
            resized = true;
        }

        //ctx.drawImage(inMemCtx, 0, 0, inMemCtx.naturalWidth * scaleFactor, inMemCtx.naturalHeight * scaleFactor);

        init();



    }

    window.addEventListener("resize", displayViewportSize, false);
    window.addEventListener("orientationchange", displayViewportSize, false);


    // Assign the canvas' context object to the global variable (the window object when run in a browser)
    // so that developers can use it more easily from within their app.js files.
    global.ctx = ctx;
})(this);

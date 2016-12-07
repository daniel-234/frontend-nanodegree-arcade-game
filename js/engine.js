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

// Variable scaleFactor keeps track of the proportion of the canvas size, when the
// viewport dimensions change, in regard to its max dimensions, that are its
// original ones
var scaleFactor;

/* Engine function that defines the canvas, a context and all the functions
 * needed to play the game.
 */
var Engine = (function(global) {
    // Predefine the variables we'll be using within this scope
    var doc = global.document,
        win = global.window,
        // Create the canvas element
        canvas = doc.createElement('canvas'),
        // Grab the 2D context for that canvas
        ctx = canvas.getContext('2d'),
        // Define a variable to hold the time value for the last frame; used to update the game
        lastTime,
        // Flag variable set to true when the game is running, false otherwise
        active = false,
        // Flag variable set to true if the player collided with an enemy, false otherwise
        crashed = false,
        // Flag variable that gets set to true only when the player wins by reaching the water,
        // false otherwise
        playerWon = false,
        // Initialize mouse click x and y coordinates
        mouseX = 0,
        mouseY = 0,
        // Initialize user touch x and y coordinates
        touchX = 0,
        touchY = 0,
        // Variables that hold the offset of the visible player image center from its x and y
        // coordinates; used when calculating the position of the user mouse or touch input
        // in canvas
        PLAYER_CENTER_OFFSET_X = 50,
        PLAYER_CENTER_OFFSET_Y = 107,
        // Coordinates of the text 'Start game' that appears on the screen
        TEXT_LEFT_X = 0.2871,
        TEXT_RIGHT_X = 0.71287,
        TEXT_UPPER_Y = 0.51485,
        TEXT_BOTTOM_Y = 0.5775,
        // Set canvas max width and max height for bigger viewports.
        // These will be the maximum dimensions for the canvas and they will be the reference
        // for the canvas size in smaller viewports, where the program will calculate the
        // reduction factor for the new dimensions compared to the original ones and use
        // that value to redraw the canvas and scale it proportionally
        ORIGINAL_WIDTH = 505,
        ORIGINAL_HEIGHT = 606,
        // Variable that tracks the number of gems not yet collected by the player; set to 3
        // when game starts, decreases every time the player collects one
        remainingGems = 3,
        // Variable that tracks if the player has collected a heart to increase its lives.
        // This version of the game only contains 1 available heart that is placed in world 1
        remainingHearts = 1,
        // Variable that keeps track of the game stage; there are 2 stages to finish the game
        world = 1;

    // Set canvas width, height and scale factor to the appropriate values
    // depending on the viewport size
    canvas.width = calculateCanvasSize()[0];
    canvas.height = calculateCanvasSize()[1];
    // Set the viewport scale factor based on its comparison with canvas maximum size
    scaleFactor = calculateCanvasSize()[2];
    // x and y coordinates of the text 'Start Game', that the user needs to click
    // to start the game
    var startTextInitialX = TEXT_LEFT_X * canvas.width;
    var startTextInitialY = TEXT_UPPER_Y * canvas.height;
    var startTextFinishingX = TEXT_RIGHT_X * canvas.width;
    var startTextFinishingY = TEXT_BOTTOM_Y * canvas.height;
    // Add canvas to the DOM
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
        // Call our update/render functions, pass along the time delta to our
        // update function since it may be used for smooth animation.
        update(dt);
        render();
        // Set our lastTime variable which is used to determine the time delta for
        // the next time this function is called.
        lastTime = now;
        // If the flag variable active is true, use the browser's requestAnimationFrame
        // function to call this function again as soon as the browser is able to draw
        // another frame. If the flag variable is false, draw the Game Over screen.
        if (active) {
            win.requestAnimationFrame(main);
        } else {
            // If the player won, render the final screen for a win
            if (playerWon) {
                renderAfterWin();
                // After the correct screen has been rendered, set the flag variable
                // that checks if the player has won back to false, ready for the next
                // game session
                playerWon = false;
            } else {
                // If the player did not win, render the 'Game Over' screen
                renderAtGameOver();
            }
        }
    }

    /* Draw the start screen the first time the game is loaded.
     */
    function init() {
        // Draw the scene for the first stage of game
        drawGameScene();
        var fontSize = 36 * scaleFactor;
        ctx.font = fontSize + 'pt' + ' ' + 'Impact';
        ctx.fillText('Start Game', startTextInitialX, startTextFinishingY);
    }

    /* Set the conditions for the game to start and call its main function.
     */
    function playGame() {
        // When the game starts there are 3 gems and 1 heart and the player
        // finds himself in world 1
        remainingGems = 3;
        remainingHearts = 1;
        world = 1;
        // Set the active flag variable to true to start the game
        active = true;
        // Set the flag variable that for collision with enemies
        // to false
        crashed = false;
        // Set the lastTime variable that is required for the game loop
        lastTime = Date.now();
        // Call the game loop function
        main();
    }

    /* Draw the screen to Start Again after Game Over.
     */
    function renderAtGameOver() {
        var fontSizeGameOver = 50 * scaleFactor;
        var fontSizeGameStart = 36 * scaleFactor;
        var fontScore = 25 * scaleFactor;
        // Render the appropriate game level scenario
        renderScene();

        // Render the text after the game is finished
        ctx.font = fontSizeGameOver + 'pt' + ' ' + ' Impact';
        ctx.fillText('Game Over', 0.208 * canvas.width, 0.432 * canvas.height);

        ctx.font = fontSizeGameStart + 'pt' + ' ' + ' Impact';
        ctx.fillText('Start Again', startTextInitialX, startTextFinishingY);

        ctx.font = fontScore + 'pt' + ' ' + ' Impact';
        ctx.fillText('Score: ' + player.score, 190 * scaleFactor, 460 * scaleFactor);

        // Set extras and entities to their original values
        availableGems = ['blue', 'green', 'orange'];
        player = new Player();
        allEnemies = [new Enemy(), new Enemy(), new Enemy()];
    }

    /* Clear the context and draw the appropriate game scene.
     */
    function renderScene() {
        // Clear the context before drawing the final screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Check which world the player was in, to draw the correct scene
        if (world === 1) {
            drawGameScene();
        } else {
            drawGameScene2();
        }
    }

    /* Draw the screen to Start Again after victory.
    */
    function renderAfterWin() {
        var fontSizeWin = 50 * scaleFactor;
        var fontSizeGameStart = 36 * scaleFactor;
        var fontScore = 25 * scaleFactor;
        // Clear the context before drawing the final screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // The player won, so it was in stage 2; draw it
        drawGameScene2();

        // Render the text after the game is won
        ctx.font = fontSizeWin + 'pt' + ' ' + ' Impact';
        ctx.fillText('You Won!', 0.247 * canvas.width, 0.432 * canvas.height);

        ctx.font = fontSizeGameStart + 'pt' + ' ' + ' Impact';
        ctx.fillText('Start Again', startTextInitialX, startTextFinishingY);

        ctx.font = fontScore + 'pt' + ' ' + ' Impact';
        ctx.fillText('Score: ' + player.score, 190 * scaleFactor, 460 * scaleFactor);

        // Set extras and entities to their original values
        availableGems = ['blue', 'green', 'orange'];
        player = new Player();
        allEnemies = [new Enemy(), new Enemy(), new Enemy()];
    }

    /* Draw the game scenario (water, stone and grass tiles) in canvas.
     */
    function drawGameScene() {
        // This array holds the relative URL to the image used for each
        // row of the game level
        var rowImages = [
                'images/grass-block.png',   // Top row is grass
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
                // requires 5 parameters: the image to draw, the x coordinate
                // to start drawing, the y coordinate to start drawing,
                // the width to draw the image in the destination canvas,
                // the height to draw the image in the destination canvas.
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
    function drawGameScene2() {
        // This array holds the relative URL to the image used for each
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
                // requires 5 parameters: the image to draw, the x coordinate
                // to start drawing, the y coordinate to start drawing,
                // the width to draw the image in the destination canvas,
                // the height to draw the image in the destination canvas.
                // We're using our Resources helpers to refer to our images
                // so that we get the benefits of caching these images, since
                // we're using them over and over.
                ctx.drawImage(Resources.get(rowImages[row]), col * 101 * scaleFactor, row * 83 * scaleFactor,
                    Resources.get(rowImages[row]).naturalWidth * scaleFactor, Resources.get(rowImages[row]).naturalHeight * scaleFactor);
            }
        }
    }

    /* Draw the "game level" and then render entities and extras.
     */
    function render() {
        // Render the appropriate game level scenario
        renderScene();
        // Draw the next gem if there is any to be collected
        if (remainingGems > 0) {
            renderGems();
        }
        // Render stone obstacles
        renderRocks();
        // Render the game entities (player and enemies)
        renderEntities();
        // render score, heart and key
        renderScore();
        renderHeart();
        renderKey();
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
        allEnemies.checkNumberOfItems(3, new Enemy());
        player.render();
    }

    /* Render the gems if the game is in stage 2.
     */
    function renderGems() {
        if (world === 2) {
            gem.render();
        }
    }

    /* Render the rocks.
     */
    function renderRocks() {
        allRocks.forEach(function(rock) {
            rock.render();
        });
    }

    /* Render the score that appears in game and shows the player score, the number of
     * lives and the world it is in.
     */
    function renderScore() {
        var fontSizeGameStart = 16 * scaleFactor;
        ctx.font = fontSizeGameStart + 'pt' + ' ' + ' Impact';
        ctx.fillText('Score: ' + player.score, 11 * scaleFactor, 572 * scaleFactor);
        ctx.fillText('Lives: ' + player.lives + '/2', 112 * scaleFactor, 572 * scaleFactor);
        ctx.fillText('World: ' + world, 213 * scaleFactor, 572 * scaleFactor);
    }

    /* Render the heart if the game is in stage 1 and it has not been collected yet.
     */
    function renderHeart() {
        if (world === 1 && remainingHearts > 0) {
            heart.render();
        }
    }

    /* Render the key if the world is in stage 1.
     */
    function renderKey() {
        if (world === 1) {
            key.render();
        }
    }

    /* Call all of the functions which may need to update entity's data.
     * This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisionsWithEnemies();
        checkCollisionsWithGems();
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
        if (world === 2 && player.checkIfWon()) {
            playerWon = true;
            reset();
        }

        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* Check if there is a collision with any of the bugs. If any is
     * detected, reset the game.
     */
    function checkCollisionsWithEnemies() {
        allEnemies.forEach(function(enemy) {
            if (player.checkCollision(enemy)) {
                // As the enemy hits the player, it disappears
                enemy.explode();
                // If the player has collected the heart and has more
                // than one life left, keep it alive and decrease its
                // lives value
                if (player.lives > 1) {
                    player.lives -= 1;
                } else {
                    // If the player had only one life, call the reset
                    // function and end the current game session
                    reset();
                }
            }
        });
    }

    /* Check if the player has touched a gem, collect it and increment
     * the player score.
     */
    function checkCollisionsWithGems() {
        // Check if the player touches a gem
        if (player.checkCollision(gem)) {
            // Check if there are more gems to collect
            if (world === 2 && remainingGems > 0) {
                // In that case, decrease the number of gems still remaining
                remainingGems -= 1;
                // Collect the gem
                player.collectGem(gem);
                // Update the score
                player.updateScore();
                // Check if there are any more gems to display
                if (remainingGems > 0) {
                    // In that case, generate a new one
                    gem = new Gem();
                }
            }
        }
    }

    /* Check if the player has touched a heart and increment its lives.
     */
    function checkCollisionWithHeart() {
        if (player.checkCollision(heart)) {
            // Check if the heart is still displayed
            if (remainingHearts > 0) {
                // Increment the player lives
                player.lives += 1;
                // There are no more hearts to collect
                remainingHearts = 0;
            }
        };
    }

    /* Check if the player has touched the key and, if the game is still
     * in stage 1, change to stage 2, set player coordinates to their initial
     * value and create new enemies.
     */
    function checkCollisionWithKey() {
        if (player.checkCollision(key)) {
            if (world === 1) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                world = 2;
                player.setCoordinates();
                allEnemies = [new Enemy(), new Enemy(), new Enemy()];
            }
        };
    }

    /* Set the flag active variable to false so it stops the game from looping
     * until the user decides to start it again.
     * Once reset has been called, it can be for two reasons: if the flag variable
     * 'playerWon' has been set to true, the player has won, otherwise the game is
     * over because an enemy hit the player and the variable 'crashed' needs to be
     * set to true.
     */
    function reset() {
        if (playerWon === true) {
            active = false;
        } else {
            crashed = true;
            active = false;
        }
    }

    /* Listen for a click of the mouse to move the player. When the user
     * clicks on the game field inside the canvas, the function detects
     * its distance from the player and decides which of the four main
     * directions has the greater distance from the player center.
     * If the point is midway between two directions, like NW, it computes
     * the distance between it and the player and evaluates which coordinate
     * is farther from the player image center. If the farthes is N, moves
     * the player upwards; if the farthest is W, moves the player to the left.
     */
    function mouseDown(e) {
        if(!e) {
            e = event;
        }
        e.preventDefault();
        // Assign to mouseX and mouseY the x and y coordinates inside the canvas
        // parent element, that is body.
        // To get the x and y coordinates of the click event relative to the canvas,
        // we need to consider that the canvas element has an offset from its
        // parent element. To take that into account, subtract the left and top
        // canvas offsets from the x and y coordinates registered inside the body.
        mouseX = e.pageX - canvas.offsetLeft;
        mouseY = e.pageY - canvas.offsetTop;

        // Check if the game is in its active state
        if (active === false) {
            // Check if the click was inside the text coordinates
            if (mouseX > startTextInitialX && mouseX < startTextFinishingX) {
                if (mouseY > startTextInitialY && mouseY < startTextFinishingY) {
                    // Start the game
                    playGame();
                }
            }
        } else {
            // Check if the user clicks a point that has a horizontal distance from the
            // position of the effective center of the player greater than its vertical distance
            // The player centre is located approximately 50px from its x coordinate and 107px
            // from its y coordinate
            if (Math.abs(mouseX - (player.x + (PLAYER_CENTER_OFFSET_X * scaleFactor))) >
                (Math.abs(mouseY - (player.y + (PLAYER_CENTER_OFFSET_Y * scaleFactor))))) {
                // Check if the click was on the left of the player
                if (mouseX <= (player.x + (PLAYER_CENTER_OFFSET_X * scaleFactor))) {
                    // Move the player to the left
                    player.handleInput('left');
                // The click was on the right of the player
                } else {
                    // Move the player to the right
                    player.handleInput('right');
                }
            }
            // Check if the user clicks a point that has a vertical distance from the
            // position of the effective center of the player greater than its horizontal distance
            else {
                // Check if the click was on the bottom of the player
                if (mouseY >= (player.y + (PLAYER_CENTER_OFFSET_Y * scaleFactor))) {
                    // Move the player down
                    player.handleInput('down');
                // The click was on the top of the player
                } else {
                    // Move the player up
                    player.handleInput('up');
                }
            }
        }
    }

    /* Listen for a touch from the user to move the player. When the user
     * touches the game field inside the canvas on a touch device, the function detects
     * its distance from the player and decides which of the four main
     * directions has the greater distance from the player center.
     * If the point is midway between two directions, like NW, it computes
     * the distance between it and the player and evaluates which coordinate
     * is farther from the player image center.
     */
    function touchDown(e) {
        if(!e) {
            e = event;
        }
        e.preventDefault();
        // Assign to touchX and touchY the x and y coordinates inside the canvas
        // parent element, that is body.
        // To get the x and y coordinates of the click event relative to the canvas,
        // we need to consider that the canvas element has an offset from its
        // parent element. To take that into account, subtract the left and top
        // canvas offsets from the x and y coordinates registered inside the body.
        touchX = e.targetTouches[0].pageX - canvas.offsetLeft;
        touchY = e.targetTouches[0].pageY - canvas.offsetTop;

        // Check if the game is in its active state
        if (active === false) {
            // Check if the touch event coordinates were inside the text coordinates
            if (touchX > startTextInitialX && touchX < startTextFinishingX) {
                if (touchY > startTextInitialY && touchY < startTextFinishingY) {
                    playGame();
                }
            }
        } else {
            // Check if the user clicks a point that has a horizontal distance from the
            // position of the effective center of the player greater than its vertical distance.
            // The center of the visible player is located approximately 50px from its x coordinate
            // and 107px from its y coordinate
            if (Math.abs(touchX - (player.x + (PLAYER_CENTER_OFFSET_X * scaleFactor))) >
                (Math.abs(touchY - (player.y + (PLAYER_CENTER_OFFSET_Y * scaleFactor))))) {
                // Check if the click was on the left of the player
                if (touchX <= (player.x + (PLAYER_CENTER_OFFSET_X * scaleFactor))) {
                    // Move the player to the left
                    player.handleInput('left');
                // Check if the click was on the right of the player
                } else {
                    // Move the player to the right
                    player.handleInput('right');
                }
            }
            // Check if the user clicks a point that has a vertical distance from the
            // position of the effective center of the player greater than its horizontal distance
            else {
                // Check if the click was on the bottom of the player
                if (touchY >= (player.y + (PLAYER_CENTER_OFFSET_Y * scaleFactor))) {
                    // Move the player down
                    player.handleInput('down');
                // Check if the click was on the top of the player
                } else {
                    // Move the player up
                    player.handleInput('up');
                }
            }
        }
    }

    /* Calculate the new canvas size and its ratio in regard with its
     * max dimensions, to obtain a scaling factor that would be used
     * to resize accordingly everything that appears in the game.
     */
    function calculateCanvasSize() {
        // Set viewport width and height values
        var viewportWidth = win.innerWidth;
        var viewportHeight = win.innerHeight;
        // Set canvas and scale values
        var canvasWidth = 0,
            canvasHeight = 0,
            // The scale values are the ratio between the new viewport size
            // and the old one
            scaleHeight = 0,
            scaleWidth = 0;

        // The canvas size can change because the viewport height or
        // width are less than their original values
        if (viewportHeight < ORIGINAL_HEIGHT || viewportWidth < ORIGINAL_WIDTH) {
            scaleHeight = viewportHeight / ORIGINAL_HEIGHT;
            scaleWidth = viewportWidth / ORIGINAL_WIDTH;
            if (scaleHeight < scaleWidth) {
                scaleFactor = scaleHeight;
            } else {
                scaleFactor = scaleWidth;
            }
            canvasHeight = ORIGINAL_HEIGHT * scaleFactor;
            canvasWidth = ORIGINAL_WIDTH * scaleFactor;
        } else {
            // If the viewport size doesn't change, keep everything unchanged
            scaleFactor = 1;
            canvasHeight = ORIGINAL_HEIGHT;
            canvasWidth = ORIGINAL_WIDTH;
        }

        return [canvasWidth, canvasHeight, scaleFactor];
    }

    /* When called, scale back every entity property to its maximum
     * value (as if there was no scale factor), set the new canvas
     * size values and scale properties back to the new scale factor.
     */
    function adaptToNewViewportSize() {
        // Set property values back to their max value
        scaleUp();
        // Assign the new values to canvas and scale factor
        canvas.width = calculateCanvasSize()[0];
        canvas.height = calculateCanvasSize()[1];
        scaleFactor = calculateCanvasSize()[2];
        // Scale appropriately the text to start playing
        startTextInitialX = TEXT_LEFT_X * canvas.width;
        startTextInitialY = TEXT_UPPER_Y * canvas.height;
        startTextFinishingX = TEXT_RIGHT_X * canvas.width;
        startTextFinishingY = TEXT_BOTTOM_Y * canvas.height;
        // Scale every entity according to the new viewport size
        scaleDown();

        init();
    }

    /* Apply the new scale factor to every entity property coordinate
     * that makes use of it.
     * Used to set back each property to its original value (the one
     * it would take if canvas was at its max size). This is a necessary
     * condition to scale it to the new value.
     */
    function scaleUp() {
        player.x /= scaleFactor;
        player.y /= scaleFactor;
        player.xOffset /= scaleFactor;
        player.yOffset /= scaleFactor;
        player.effectiveWidth /= scaleFactor;
        player.effectiveHeight /= scaleFactor;
        allEnemies.forEach(function(enemy) {
            enemy.x /= scaleFactor;
            enemy.y /= scaleFactor;
            enemy.dx /= scaleFactor;
            enemy.dy /= scaleFactor;
            enemy.xOffset /= scaleFactor;
            enemy.yOffset /= scaleFactor;
            enemy.effectiveWidth /= scaleFactor;
            enemy.effectiveHeight /= scaleFactor;
        });
        gem.x /= scaleFactor;
        gem.y /= scaleFactor;
        gem.xOffset /= scaleFactor;
        gem.yOffset /= scaleFactor;
        gem.effectiveWidth /= scaleFactor;
        gem.effectiveHeight /= scaleFactor;
        allRocks.forEach(function(rock) {
            rock.x /= scaleFactor;
            rock.y /= scaleFactor;
            rock.xOffset /= scaleFactor;
            rock.yOffset /= scaleFactor;
            rock.effectiveWidth /= scaleFactor;
            rock.effectiveHeight /= scaleFactor;
        });
        heart.x /= scaleFactor;
        heart.y /= scaleFactor;
        heart.xOffset /= scaleFactor;
        heart.yOffset /= scaleFactor;
        heart.effectiveWidth /= scaleFactor;
        heart.effectiveHeight /= scaleFactor;
        key.x /= scaleFactor;
        key.y /= scaleFactor;
        key.xOffset /= scaleFactor;
        key.yOffset /= scaleFactor;
        key.effectiveWidth /= scaleFactor;
        key.effectiveHeight /= scaleFactor;
    }

    /* Apply the new scale factor to every entity property coordinate
     * that makes use of it.
     * After each property has been set back to its orginal value,
     * this function is used to scale it according to the new
     * viewport size.
     */
    function scaleDown() {
        player.x *= scaleFactor;
        player.y *= scaleFactor;
        player.xOffset *= scaleFactor;
        player.yOffset *= scaleFactor;
        player.effectiveWidth *= scaleFactor;
        player.effectiveHeight *= scaleFactor;
        gem.x *= scaleFactor;
        gem.y *= scaleFactor;
        gem.xOffset *= scaleFactor;
        gem.yOffset *= scaleFactor;
        gem.effectiveWidth *= scaleFactor;
        gem.effectiveHeight *= scaleFactor;
        allEnemies.forEach(function(enemy) {
            enemy.x *= scaleFactor;
            enemy.y *= scaleFactor;
            enemy.dx *= scaleFactor;
            enemy.dy *= scaleFactor;
            enemy.xOffset *= scaleFactor;
            enemy.yOffset *= scaleFactor;
            enemy.effectiveWidth *= scaleFactor;
            enemy.effectiveHeight *= scaleFactor;
        });
        allRocks.forEach(function(rock) {
            rock.x *= scaleFactor;
            rock.y *= scaleFactor;
            rock.xOffset *= scaleFactor;
            rock.yOffset *= scaleFactor;
            rock.effectiveWidth *= scaleFactor;
            rock.effectiveHeight *= scaleFactor;
        });
        heart.x *= scaleFactor;
        heart.y *= scaleFactor;
        heart.xOffset *= scaleFactor;
        heart.yOffset *= scaleFactor;
        heart.effectiveWidth *= scaleFactor;
        heart.effectiveHeight *= scaleFactor;
        key.x *= scaleFactor;
        key.y *= scaleFactor;
        key.xOffset *= scaleFactor;
        key.yOffset *= scaleFactor;
        key.effectiveWidth *= scaleFactor;
        key.effectiveHeight *= scaleFactor;
    }

    // Listen for user actions
    // Listen for a touch input by the user on canvas when game is running
    canvas.addEventListener('mousedown', mouseDown, false);
    // Listen for a mouse click by the user on canvas when game is running
    canvas.addEventListener('touchdown', touchDown, false);
    // Listen for viewport resize
    window.addEventListener('resize', adaptToNewViewportSize, false);
    // Listen for change in display orientation on mobile devices
    window.addEventListener('orientationchange', adaptToNewViewportSize, false);

    // Load all of the images we know we're going to need to draw our game level.
    // Then set init as the callback method, so that when all of these images are
    // properly loaded our game will start.
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
    Resources.onReady(init);

    // Assign the canvas' context object to the global variable (the window object
    // when run in a browser) so that developers can use it more easily from within
    // their app.js files.
    global.ctx = ctx;
})(this);

frontend-nanodegree-arcade-game
===============================

Students should use this [rubric](https://review.udacity.com/#!/projects/2696458597/rubric) for self-checking their submission. Make sure the functions you write are **object-oriented** - either class functions (like Player and Enemy) or class prototype functions such as Enemy.prototype.checkCollisions, and that the keyword 'this' is used appropriately within your class and class prototype functions to refer to the object the function is called upon. Also be sure that the **readme.md** file is updated with your instructions on both how to 1. Run and 2. Play your arcade game.

For detailed instructions on how to get started, check out this [guide](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).

## Getting Started

To view the website, download a copy of the project to your local machine and open the file index.html with your browser.

## Built With

* [HTML5 canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - The Web API used to draw graphics

## Author

* **Daniele Erbì** - [daniel-234](https://github.com/daniel-234)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* I used some lines of code from this answer in Stackoverflow to avoid image flickering as the enemy sprites moved along the canvas
  [Image flickering in canvas](http://stackoverflow.com/questions/19619512/image-flickering-in-canvas)
* Thanks to this answer on Stackoverflow I have been able to stop the game execution when a specific event occurs (in my case the player either win or lose) - [Can't stop requestAnimationFrame Javascript/HTML5 canvas](http://stackoverflow.com/questions/19449219/cant-stop-requestanimationframe-javascript-html5-canvas)
* I used some of this code to get the coordinates of a mouse click on the canvas element - [Get the coordinates of a mouse click on Canvas in JavaScript](http://miloq.blogspot.it/2011/05/coordinates-mouse-click-canvas.html)
* The algorithm I used to detect collision between player and enemies - [2D collision detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
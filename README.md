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
* I was able to add mouse and touch controls to the canvas thanks to this tutorial by Apple - [Adding Mouse and Touch Controls to Canvas](https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/HTML-canvas-guide/AddingMouseandTouchControlstoCanvas/AddingMouseandTouchControlstoCanvas.html)
* The toughest part I went through during the game development has been making it responsive and able to scale when the canvas was resized or the orientation of the viewport was changed. This difficulty was due to the high presence of dynamic elements in the game and to the fact that every one of them needed to have its coordinates scaled reacting to the new size of the canvas. I went through some reading and here are the articles or answers on Stackoverflow I relied on most.
* [William Malone - HTML5 Game Scaling](http://www.williammalone.com/articles/html5-game-scaling/)
* An article that led me to use a scale factor to maintain proportions when passing from the original game size for desktops to a scaled version for smaller viewports - [HTML5 Rocks - Case Study: Auto-Resizing HTML5 Games](https://www.html5rocks.com/en/tutorials/casestudies/gopherwoord-studios-resizing-html5-games/)
* [Stackoverflow - Resize HTML5 canvas to fit window](https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window?rq=1)
* [HTML5 Cheats - Resizing the HTML5 Canvas Dynamically as the Browser Window is Resized](http://htmlcheats.com/html/resize-the-html5-canvas-dyamically/)
* [MobiForge - HTML5 for the Mobile Web: Canvas](https://mobiforge.com/design-development/html5-mobile-web-canvas)
* [Stackoverflow - Resizing a .png image when drawing to HTML5 canvas using JavaScript](http://stackoverflow.com/questions/10311311/resizing-a-png-image-when-drawing-to-html5-canvas-using-javascript)
* [William Malone - How do you draw an image on HTML5 canvas?](http://www.williammalone.com/briefs/how-to-draw-image-html5-canvas/)
* [Stackoverflow - Canvas drawImage scaling](http://stackoverflow.com/questions/10841532/canvas-drawimage-scaling)
* [Stackoverflow - Working with canvas in different screen sizes](http://stackoverflow.com/questions/8625208/working-with-canvas-in-different-screen-sizes/8626456#8626456)
* [Kirupa - Resizing the HTML5 Canvas Element](https://www.kirupa.com/html5/resizing_html_canvas_element.htm)
* This answer on Stackoverflow let me resize text in response to a resize in canvas - [Stackoverflow - HTML5 Canvas FontSize Based on Canvas Size](http://stackoverflow.com/questions/22943186/html5-canvas-font-size-based-on-canvas-size)
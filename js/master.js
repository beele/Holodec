//===========================================================================
//=============================== PROJECT ===================================
//===========================================================================
//HOLODEC UI 1.0
//Created by Kevin Van den Abeele.
//Free to use and rework. Both commercial and non commercial.
//===========================================================================
//============================== SETTINGS ===================================
//===========================================================================
var imgWidth = 25;
var timeStep = 100;
var implosionDepth = 10;
var allowSimultaneousAnimations = false;
//var implosion = new Implosion(new RectangularImplosionStrategy());
var implosion = new Implosion(new StarlikeImplosionStrategy());
//===========================================================================
//===========================================================================
//===========================================================================
//Internal logic and variables! Do not edit unless you know what you are doing!
var imgHalf = imgWidth / 2;
var imgQuart = imgWidth / 4;

var point;
var sound;
var clickCount = 0;

//Document ready function for when the page is ready.
$(document).ready(function () {
    //Get the DOM elements that are needed often.
    point = $('#point');
    sound = document.getElementById('beep');

    //Set the background and selected item sized according to the desired width.
    $('#itemBackground').css({
        "background-size": imgWidth + "px " + imgWidth + "px"
    });
    point.width(imgWidth);
    point.height(imgWidth);

    //We want to handle mouse clicks.
    var animation = null;
    $(document).click(function (e) {
        if(animation !== null && allowSimultaneousAnimations === false) {
            if(animation.isPlaying() === true) {
                animation.stopAnimation(true);
            }
        }
        animation = new Animation(e);
    });
});

function Animation(eventParams) {
    var clickID = clickCount++;
    var currentDepth = implosionDepth;
    var fadeCount = 0;
    var neighbourCollection = [];
    var isPlaying = true;
    var stopOnNextAnimationStep = false;

    console.log("=================================================================");
    console.log("=================================================================");
    console.log("LOG: DEBUG ==> clicked x: " + eventParams.clientX + " y: " + eventParams.clientY);

    //Round mouse x and y coordinates to nearest half image.
    var divX = Math.floor(eventParams.clientX / imgHalf);
    var divY = Math.floor(eventParams.clientY / imgHalf);

    //Find out the remainder so we can calculate a more exact location later.
    var remX = eventParams.clientX % imgHalf;
    var remY = eventParams.clientY % imgHalf;

    //Use the remainder to see if we want to adjust the location.
    var addX = remX >= imgQuart ? imgHalf : 0;
    var addY = remY >= imgQuart ? imgHalf : 0;

    //Get the first rough positions for the selected point.
    var nearX = (divX * imgHalf) + addX;
    var nearY = (divY * imgHalf) + addY;

    //See if the rough positions need to be adjusted further.
    var correctX = nearX % imgWidth === imgHalf;
    var correctY = nearY % imgWidth === imgHalf;
    var exactX = nearX;
    var exactY = nearY;

    //Adjust only when not both X and Y are incorrect. When they are both incorrect we are actually correct!
    //This is because we then want to fill in a point that is located between four other points.
    if (correctX === false && correctY === true) {
        if (remX > 0) {
            exactX += imgHalf;
        } else {
            exactX -= imgHalf;
        }
    } else if (correctY === false && correctX === true) {
        if (remY > 0) {
            exactY += imgHalf;
        } else {
            exactY -= imgHalf;
        }
    }

    console.log("LOG: DEBUG ==> Nearest point is: " + exactX + "," + exactY);
    console.log("LOG: DEBUG ==> Starting selected point animation");
    //Clear the collections for fade and remove any old neighbours.
    removeNeighbours();
    //Start the implosion effect.
    animateImplosionEffect();

    //Inner functions
    /**
     * Recursive function that animates the implosion effect.
     */
    function animateImplosionEffect() {
        console.log("LOG: DEBUG ==> Animating implosion effect => depth : " + currentDepth);
        point.css({left: exactX - imgHalf, top: exactY - imgHalf});
        point.show();

        //Each animation step has a given timeout.
        setTimeout(function () {
            if (currentDepth === 0) {
                //Set the selected point's location and make it visible.
                //Top and Left of each image are 50 pixels before the center.
                point.css({left: exactX - imgHalf, top: exactY - imgHalf});
                point.show();
                //Start animation moving the selected point.
                animateFromSelection(exactX, exactY);
                //Proceed with fading out the items.
                fadeCount = implosionDepth;
                recursiveFadeOut();
            } else {
                //Calculate (according to the set strategy) and show the next neighbours.
                neighbourCollection.push(showNeighbours(implosion.calculateNeighbours(currentDepth)));
                fadeOlderDepths(neighbourCollection, false);
                //Continue to the next step in the animation.
                --currentDepth;
                animateImplosionEffect();
            }

        }, timeStep / 5);
    }

    /**
     * Recursive function that fades out the implosion effect.
     */
    function recursiveFadeOut() {
        setTimeout(function () {
            if (fadeOlderDepths(neighbourCollection, true)) {
                recursiveFadeOut();
            } else {
                //Remove the previous neighbours.
                removeNeighbours();
            }
        }, timeStep / 10);
    }

    /**
     * Function called from recursiveFadeOut() to fade the neighbours that have been animated and now have to be faded.
     * @param performStopCheck If true the function will see if the fade needs to animate further.
     * @param depthCollection An array containing an array of neighbours for each depth level.
     * @returns {boolean} true if the fade is completely done.
     */
    function fadeOlderDepths(depthCollection, performStopCheck) {
        console.log("LOG: DEBUG ==> Fading older depths.");
        for (var i = 0; i < depthCollection.length; i++) {
            var items = depthCollection[i];
            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                console.log();
                var newOp = parseFloat(item.css('opacity'));
                newOp = newOp <= 0.1 ? 0 : newOp - 0.1;
                item.css({ opacity: newOp });

                //Check to break of the fade is the last item to be faded is also at opacity 0!
                if (j === (items.length - 1) && newOp === 0) {
                    //Replace the array of the already fully faded items with an empty array and remove those neighbours already.
                    removeNeighbours(depthCollection.length - i);
                    neighbourCollection[i] = [];
                }
            }
        }
        if(performStopCheck && fadeCount < 1) {
            return false;
        } else {
            fadeCount--;
            return true;
        }
    }

    /**
     * Recursive function for animating the single point after the implosion.
     * @param xCoord The starting or previously calculated single point (x coordinate)
     * @param yCoord The starting or previously calculated single point (y coordinate)
     */
    function animateFromSelection(xCoord, yCoord) {
        //Each animation step has a given timeout.
        setTimeout(function () {
            console.log("LOG: DEBUG ==> Animating point to new position.");
            //Check to see if the animation has been completed! (when the point goes off screen or the stopOnNextAnimationStep is true.
            if (xCoord < 0 || yCoord < 0 || stopOnNextAnimationStep) {
                console.log("LOG: DEBUG ==> Animation completed!");
                isPlaying = false;
                if (stopOnNextAnimationStep) {
                    stopOnNextAnimationStep = false;
                }
                return;
            }

            var x = xCoord, y = yCoord;
            //Small random generator trick to make the animation differ in motion a bit.
            var rand = Math.floor((Math.random() * 10) + 1);
            if (rand > 5) {
                x -= imgWidth;
            } else {
                y -= imgWidth;
            }
            point.css({left: x - imgHalf, top: y - imgHalf});

            //If the sound was previously playing, reset and play it again.
            sound.currentTime = 0;
            sound.play();

            //Continue to the next step in the animation.
            animateFromSelection(x, y);
        }, timeStep);
    }

    /**
     * Will show the neighbours for the points in the passes points array.
     * @param points contains two sub arrays containing X and Y positions respectively.
     * @returns {Array} an array containing the newly created neighbours.
     */
    function showNeighbours(points) {
        var items = [];
        var pointsX = points[0];
        var pointsY = points[1];

        for (var i = 0; i < pointsX.length; i++) {
            var id = "nb-" + clickID + "-" + "d" + currentDepth + "-" + (i + 1);
            $('#point').clone().attr('id', id).appendTo('body');
            var item = $('#' + id);
            item.css({
                left: (pointsX[i] * imgHalf) + exactX - imgHalf,
                top: (pointsY[i] * imgHalf) + exactY - imgHalf,
                opacity: 1
            });
            items[i] = item;
        }
        return items;
    }

    /**
     * Will remove all neighbours for the current Animation object.
     * @param optionalDepth If the optionalDepth parameter is passed only the neighbours with a matching depth will be removed.
     */
    function removeNeighbours(optionalDepth) {
        var idString = "[id^=nb-" + clickID;
        if (typeof optionalDepth !== "undefined") {
            idString += "d" + optionalDepth + "-";
        }
        idString += "]";
        $(idString).each(function () {
            $(this).remove();
        });
    }

    //Closure getters & setters to allow checks for simultaneous animations.
    return {
        /**
         * Getter for the isPlaying local variable.
         * @returns {boolean} true if the animation if playing, false if not.
         */
        isPlaying: function() {
            return isPlaying;
        },

        /**
         * Setter for the stopOnNextAnimationStep local variable.
         * @param value Boolean : pass true to stop the animation on the next animation step.
         */
        stopAnimation: function(value) {
            stopOnNextAnimationStep = value;
        }
    }
}
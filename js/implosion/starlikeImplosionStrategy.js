var StarlikeImplosionStrategy = function() {};
StarlikeImplosionStrategy.prototype = Object.create(ImplosionStrategyBase.prototype);

StarlikeImplosionStrategy.prototype.calculateNeighbours = function(neighbourDistance) {
    return this.calculateRectangularNeighbours(neighbourDistance);
};

StarlikeImplosionStrategy.prototype.calculateRectangularNeighbours = function(neighbourDistance) {
    //TODO: divFac tends to draw multiple images over eachother as the neighbourDistance nears 1!
    //TODO: for now keep the divFac set to 1!
    var divFac = 1;
    neighbourDistance = Math.floor(neighbourDistance / divFac);

    var pointNum = 0;
    var pointsX = [];
    var pointsY = [];

    var x1, x2, y1, y2 = 0;

    var n = (neighbourDistance * (4 / divFac)) - 2;
    for(var i = 0 ; i < neighbourDistance * (4 / divFac) - 1 ; i++) {
        x1 = 0 - n;
        y1 = 0 - i;
        x2 = n;
        y2 = i;

        pointsX[pointNum] = x1;
        pointsY[pointNum++] = y1;
        pointsX[pointNum] = x2;
        pointsY[pointNum++] = y2;

        n--;
    }

    n = (neighbourDistance *  (4 / divFac)) - 6;
    for(var j = 0 ; j < neighbourDistance * (4 / divFac) - 3 ; j++) {
        x1 = n + 3;
        y1 = 0 - (j + 1);
        x2 = 0 - (n + 3);
        y2 = j + 1;

        pointsX[pointNum] = x1;
        pointsY[pointNum++] = y1;
        pointsX[pointNum] = x2;
        pointsY[pointNum++] = y2;

        n--;
    }

    return [pointsX, pointsY];
};

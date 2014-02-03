var StarlikeImplosionStrategy = function () {
};
StarlikeImplosionStrategy.prototype = Object.create(ImplosionStrategyBase.prototype);

StarlikeImplosionStrategy.prototype.calculateNeighbours = function (neighbourDistance) {
    return this.calculateRectangularNeighbours(neighbourDistance);
};

var prevNeigbourDistance = -1;
StarlikeImplosionStrategy.prototype.calculateRectangularNeighbours = function (neighbourDistance) {
    var divFac = 2;
    neighbourDistance = Math.floor(neighbourDistance / divFac);

    //Check if the newly calculated neighbour distance is equal to the previous one.
    //If it is not equal continue to the next step and calculate the points.
    //Otherwise return no points and skip the current depth.
    if(prevNeigbourDistance === -1 || prevNeigbourDistance !== neighbourDistance) {
        prevNeigbourDistance = neighbourDistance;
    } else {
        return [[],[]];
    }

    var pointNum = 0;
    var pointsX = [];
    var pointsY = [];

    var x1, x2, y1, y2 = 0;

    var n = (neighbourDistance * (4 / divFac)) - 2;
    for (var i = 0; i < neighbourDistance * (4 / divFac) - 1; i++) {
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

    n = (neighbourDistance * (4 / divFac)) - 6;
    for (var j = 0; j < neighbourDistance * (4 / divFac) - 3; j++) {
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

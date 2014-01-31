var RectangularImplosionStrategy = function() {};
RectangularImplosionStrategy.prototype = Object.create(ImplosionStrategyBase.prototype);

RectangularImplosionStrategy.prototype.calculateNeighbours = function(neighbourDistance) {
    return this.calculateRectangularNeighbours(neighbourDistance);
};

RectangularImplosionStrategy.prototype.calculateRectangularNeighbours = function(neighbourDistance) {
    var pointNum = 0;
    var pointsX = [];
    var pointsY = [];

    var x1, x2, y1, y2 = 0;

    var n = neighbourDistance;
    for(var i = 0 ; i < neighbourDistance + 1 ; i++) {
        x1 = 0 - n;
        y1 = 0 - neighbourDistance;
        x2 = n;
        y2 = neighbourDistance;

        pointsX[pointNum] = x1;
        pointsY[pointNum++] = y1;
        pointsX[pointNum] = x2;
        pointsY[pointNum++] = y2;

        n -= 2;
    }

    n = neighbourDistance;
    for(var j = 0 ; j < neighbourDistance - 1 ; j++) {
        x1 = 0 - neighbourDistance;
        y1 = - (n - 2);
        x2 = neighbourDistance;
        y2 = n - 2;

        pointsX[pointNum] = x1;
        pointsY[pointNum++] = y1;
        pointsX[pointNum] = x2;
        pointsY[pointNum++] = y2;

        n -= 2;
    }

    return [pointsX, pointsY];
};
var CircularImplosionStrategy = function () {
};
CircularImplosionStrategy.prototype = Object.create(ImplosionStrategyBase.prototype);

CircularImplosionStrategy.prototype.calculateNeighbours = function (neighbourDistance) {
    return this.calculateCircularNeighbours(neighbourDistance);
};

CircularImplosionStrategy.prototype.calculateCircularNeighbours = function (neighbourDistance) {
    return null;
};
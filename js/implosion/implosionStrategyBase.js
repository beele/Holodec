var ImplosionStrategyBase = function () {
};

ImplosionStrategyBase.prototype.calculateNeighbours = function (neighbourDistance) {
    throw new Error('ImplosionStrategyBase#animate needs to be overridden.')
};
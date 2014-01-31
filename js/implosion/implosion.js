var Implosion = function(strategy) {
    this.strategy = strategy;
};

Implosion.prototype.calculateNeighbours = function(neighbourDistance) {
    return this.strategy.calculateNeighbours(neighbourDistance);
};
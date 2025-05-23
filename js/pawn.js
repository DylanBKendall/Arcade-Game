class Pawn extends Enemy {
  constructor(isHoming) {
    let bulletStats = {
      xVelocity: 0,
      yVelocity: -4,
      damage: 1,
      piercing: 1,
      size: 5,
      attribute: "none",
    };

    let moveDuration = 0.5;
    let pauseDuration = 2.0;
    let totalCycle = moveDuration + pauseDuration;

    // x, y, hitRadius, xVelocity, yVelocity, health, canScreenWrap, isHoming, bulletStats, shootCooldown, points
    super(
      int(random(8)) * 100 + 50,
      -50,
      10,
      0,
      0,
      10,
      false,
      isHoming,
      bulletStats,
      totalCycle / 2,
      5
    );
    this.bulletStats = bulletStats;
    this.moveDuration = moveDuration;
    this.pauseDuration = pauseDuration;
    this.totalCycle = totalCycle;
    this.originalY = this.y;
    this.time = 0;

    this.shootTimer = totalCycle / 2;
  }

  move() {
    let dt = deltaTime / 1000;
    this.time += dt;

    let fullCycles = floor(this.time / this.totalCycle);
    let cyclePosition = this.time % this.totalCycle;
    let fractionOfMove = 0;

    if (cyclePosition < this.moveDuration) {
      fractionOfMove = cyclePosition / this.moveDuration;
    } else {
      fractionOfMove = 1;
    }

    let offsetThisCycle = 100 * fractionOfMove;
    let totalOffset = offsetThisCycle + fullCycles * 100;

    this.y = this.originalY + totalOffset;

    if (this.y > height) {
      this.y -= height;
    }
  }

  display() {
    stroke(0);
    strokeWeight(3);
    if (this.isHoming) {
      fill(0, 255, 0);
      push();
      translate(this.x, this.y);
      let angle = atan2(player.y - this.y, player.x - this.x);
      rotate(angle - HALF_PI);
      triangle(-15, -13, 0, 27, 15, -13);
      pop();
    } else {
      fill(255, 0, 0);
      triangle(
        this.x - 15,
        this.y - 13,
        this.x,
        this.y + 27,
        this.x + 15,
        this.y - 13
      );
    }
    strokeWeight(this.hitRadius * 2);
    point(this.x, this.y);
  }
}

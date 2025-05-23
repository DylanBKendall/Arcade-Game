class Bishop extends Enemy {
  constructor(isHoming) {
    let bulletStats = {
      xVelocity: 4,
      yVelocity: -4,
      damage: 1,
      piercing: 1,
      size: 5,
      attribute: "diagonal",
    };

    let totalCycle = 2.5;

    // x, y, hitRadius, xVelocity, yVelocity, health, canScreenWrap, isHoming, bulletStats shootCooldown, points
    super(
      int(random(8)) * 100 + 50,
      -50,
      10,
      300,
      300,
      10,
      false,
      isHoming,
      bulletStats,
      totalCycle / 2,
      20
    );
    this.bulletStats = bulletStats;
    this.totalCycle = totalCycle;

    this.shootTimer = totalCycle / 2;
  }

  move() {
    let dt = deltaTime / 1000;

    let cyclePosition = this.time % this.totalCycle;

    if (cyclePosition == 1) {
      this.yVelocity *= -1;
    }

    this.y += dt * this.yVelocity;
    this.x += dt * this.xVelocity;

    if (this.y - this.hitRadius > height) this.y = this.hitRadius;

    if (this.x >= width - this.hitRadius) {
      this.x = width - this.hitRadius;
      this.xVelocity *= -1;
      this.bulletStats.xVelocity *= -1;
    }
    if (this.x < this.hitRadius) {
      this.x = this.hitRadius;
      this.xVelocity *= -1;
      this.bulletStats.xVelocity *= -1;
    }
  }

  display() {
    stroke(0);
    strokeWeight(3);
    push();
    translate(this.x, this.y);
    if (this.isHoming) {
      fill(0, 255, 0);
      let angle = atan2(player.y - this.y, player.x - this.x);
      rotate(angle - HALF_PI);
    } else {
      fill(255, 0, 0);
      this.xVelocity > 0 ? rotate(-PI / 4) : rotate(PI / 4);
    }
    triangle(-15, -13, 0, 27, 15, -13);
    pop();
    strokeWeight(this.hitRadius * 2);
    point(this.x, this.y);
  }
}

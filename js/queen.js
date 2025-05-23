class Queen extends Enemy {
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

    // x, y, hitRadius, xVelocity, yVelocity, health, canScreenWrap, isHoming bulletStats, shootCooldown, points
    super(
      int(random(8)) * 100 + 50,
      -50,
      10,
      0,
      0,
      20,
      false,
      isHoming,
      bulletStats,
      totalCycle / 4,
      50
    );
    this.bulletStats = bulletStats;
    this.moveDuration = moveDuration;
    this.pauseDuration = pauseDuration;
    this.totalCycle = totalCycle;
    this.originalY = this.y;
    this.time = 0;

    this.shootTimer = totalCycle / 2;
    this.isDiagonal = false;
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

  shoot() {
    this.shootTimer += deltaTime / 1000;

    if (this.shootTimer >= this.shootCooldown) {
      this.isDiagonal = !this.isDiagonal;
      this.attack();
      this.shootTimer = 0;
    }
  }

  attack() {
    let attribute = this.isDiagonal ? "diagonal" : "none";
    let xVelocity = this.bulletStats.xVelocity;
    let yVelocity = this.bulletStats.yVelocity;
    let angle = 0;
    let magnitude = dist(0, 0, xVelocity, yVelocity);
    if (this.isHoming) {
      angle = atan2(player.y - this.y, player.x - this.x);
      magnitude = sqrt(
        this.bulletStats.yVelocity ** 2 + this.bulletStats.xVelocity ** 2
      );
    }

    if (this.isDiagonal) angle += PI / 4;
    for (let i = 0; i < 4; i++) {
      let xAngle = sin(angle + (i * PI) / 2.0);
      let yAngle = cos(angle + (i * PI) / 2.0);
      xVelocity = xAngle * magnitude;
      yVelocity = yAngle * magnitude;
      entities.push(
        new Bullet(
          this.x,
          this.y,
          {
            ...this.bulletStats,
            xVelocity: xVelocity,
            yVelocity: yVelocity,
            attribute: attribute,
          },
          false
        )
      );
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
      triangle(15, 13, 0, -27, -15, 13);
      triangle(-15, -13, 0, 27, 15, -13);
      pop();
    } else {
      fill(255, 0, 0);
      triangle(
        this.x + 15,
        this.y + 13,
        this.x,
        this.y - 27,
        this.x - 15,
        this.y + 13
      );
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

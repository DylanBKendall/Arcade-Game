class King extends Enemy {
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
      width / 2,
      100,
      100,
      300,
      0,
      750,
      false,
      isHoming,
      bulletStats,
      totalCycle / 8,
      1000
    );
    this.bulletStats = bulletStats;
    this.totalCycle = totalCycle;
    this.moveDuration = moveDuration;
    this.pauseDuration = pauseDuration;

    this.attack1Timer = 0;
    this.attack2Timer = 0;
    this.attack2Cooldown = totalCycle / 2;
    this.moveTimer = 0;
    this.targetX = int(random(1, 4)) * (width / 4);
    this.phase = 1;
  }

  move() {
    let dt = deltaTime / 1000;
    this.moveTimer += dt;

    if (this.moveTimer >= this.moveDuration) {
      this.moveTimer = 0;
      this.targetX = int(random(1, 4)) * (width / 4);
    }

    let dx = this.targetX - this.x;
    let distance = abs(dx);

    if (distance > 1) {
      this.x += (dx / distance) * this.xVelocity * dt;
    } else {
      this.x = this.targetX;
    }
  }

  shoot() {
    if (this.health < 500) {
      this.phase = 2;
      this.shootCooldown = this.totalCycle / 12;
      this.attack2Cooldown = this.totalCycle / 3;
    }
    if (this.health < 250) {
      this.phase = 3;
    }

    this.attack1Timer += deltaTime / 1000;
    this.attack2Timer += deltaTime / 1000;

    if (this.attack1Timer >= this.shootCooldown) {
      this.attack1();
      this.isDiagonal = !this.isDiagonal;
      this.attack1();
      this.isDiagonal = !this.isDiagonal;
      this.attack1Timer = 0;
    }

    if (this.attack2Timer >= this.attack2Cooldown) {
      this.attack2();
      this.attack2Timer = 0;
    }
  }

  attack1() {
    let attribute = this.isDiagonal ? "diagonal" : "none";
    let xVelocity = this.bulletStats.xVelocity;
    let yVelocity = this.bulletStats.yVelocity;
    let angle = 0;
    let magnitude = dist(0, 0, xVelocity, yVelocity);
    // if (this.isHoming) {
    //   angle = atan2(player.y - this.y, player.x - this.x);
    //   magnitude = sqrt(
    //     this.bulletStats.yVelocity ** 2 + this.bulletStats.xVelocity ** 2
    //   );
    // }

    if (this.isDiagonal) angle += PI / 4;
    for (let i = 0; i < 4; i++) {
      let xAngle = sin(angle + (i * PI) / 2.0);
      let yAngle = cos(angle + (i * PI) / 2.0);
      xVelocity = xAngle * magnitude;
      yVelocity = yAngle * magnitude;
      if (this.phase == 2) {
        xVelocity /= 2;
        yVelocity /= 2;
      }
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

  attack2() {
    let xVelocity = this.bulletStats.xVelocity;
    let yVelocity = this.bulletStats.yVelocity;
    let magnitude = dist(0, 0, xVelocity, yVelocity);

    for (let i = 0; i < 8; i++) {
      let xAngle = sin((i * PI) / 2.0);
      let yAngle = cos((i * PI) / 2.0);
      xAngle += PI / 2;
      yAngle += PI / 2;
      xVelocity = xAngle * magnitude;
      yVelocity = yAngle * magnitude;

      if (i > 3) {
        xVelocity *= -1;
      }

      if (this.phase == 2) {
        xVelocity /= 2;
        yVelocity /= 2;
      }

      entities.push(
        new Bullet(
          this.x,
          this.y,
          {
            ...this.bulletStats,
            xVelocity: xVelocity / 8,
            yVelocity: -yVelocity / 2,
          },
          false
        )
      );
    }
  }

  display() {
    stroke(0);
    strokeWeight(3);

    fill(255, 0, 0);
    triangle(
      this.x + 60,
      this.y + 52,
      this.x,
      this.y - 108,
      this.x - 60,
      this.y + 52
    );
    triangle(
      this.x - 60,
      this.y - 52,
      this.x,
      this.y + 108,
      this.x + 60,
      this.y - 52
    );

    if (this.phase == 1) fill(0, 0, 255);
    else if (this.phase == 2) fill(0, 255, 0);
    else fill(0, 255, 255);
    circle(this.x, this.y, this.hitRadius);
    noStroke();
    fill(0);
    circle(this.x, this.y, this.hitRadius / 750 * this.health);
  }
}

class Enemy extends Entity {
  constructor(
    x,
    y,
    hitRadius,
    xVelocity,
    yVelocity,
    health,
    canScreenWrap,
    isHoming,
    bulletStats,
    shootCooldown,
    points
  ) {
    // x, y, hitRadius, xVelocity, yVelocity, health, damage, canScreenWrap, isPlayer
    super(
      x,
      y,
      hitRadius,
      xVelocity,
      yVelocity,
      health,
      1,
      canScreenWrap,
      false
    );
    this.bulletStats = bulletStats;
    this.shootCooldown = shootCooldown;
    this.shootTimer = 0;
    this.points = points;
    this.isHoming = isHoming;
  }

  move() {
    throw new Error("move() must be implemented by subclass");
  }

  display() {
    throw new Error("display() must be implemented by subclass");
  }

  shoot() {
    this.shootTimer += deltaTime / 1000;

    if (this.shootTimer >= this.shootCooldown) {
      if (this.isHoming) {
        this.homingAttack();
      } else {
        entities.push(new Bullet(this.x, this.y, this.bulletStats, false));
      }
      this.shootTimer = 0;
    }
  }

  homingAttack() {
    let magnitude = sqrt(
      this.bulletStats.yVelocity ** 2 + this.bulletStats.xVelocity ** 2
    );
    let newXVelocity = player.x - this.x;
    let newYVelocity = this.y - player.y;
    let newMagnitude = sqrt(newYVelocity ** 2 + newXVelocity ** 2);
    newXVelocity = (newXVelocity / newMagnitude) * magnitude;
    newYVelocity = (newYVelocity / newMagnitude) * magnitude;
    entities.push(
      new Bullet(
        this.x,
        this.y,
        {
          ...this.bulletStats,
          xVelocity: newXVelocity,
          yVelocity: newYVelocity,
        },
        false
      )
    );
  }

  update() {
    this.move();
    this.screenWrap();
    this.shoot();
    this.display();
    this.handleCollision();
    if (this.markForRemoval) {
      effects.push(new DeathEffect(this.x, this.y));
      if (this.isHoming) this.points *= 2;
      score += this.points;
    }
  }
}

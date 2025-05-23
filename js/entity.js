class Entity {
  constructor(x, y, hitRadius, xVelocity, yVelocity, health, damage, canScreenWrap, isPlayer) {
    this.x = x;
    this.y = y;
    this.hitRadius = hitRadius;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.damage = damage;
    this.health = health;
    this.canScreenWrap = canScreenWrap;
    this.isPlayer = isPlayer;
    this.markForRemoval = false;
  }

  move() {
    throw new Error("move() must be implemented by subclass");
  }

  display() {
    throw new Error("display() must be implemented by subclass");
  }

  screenWrap() {
    if (!this.canScreenWrap) return;

    if (this.x + this.hitRadius < 0) this.x = width + this.hitRadius;
    if (this.x - this.hitRadius > width) this.x = this.hitRadius;

    if (this.y + this.hitRadius < 0) this.y = height + this.hitRadius;
    if (this.y - this.hitRadius > height) this.y = this.hitRadius;
  }

  handleCollision() {
    for (let entity of entities) {
      if (this.isPlayer === entity.isPlayer) continue;
      if (entity instanceof Bullet) continue;

      if (
        this.hitRadius + entity.hitRadius >
        dist(this.x, this.y, entity.x, entity.y)
      ) {
        this.health -= entity.damage;
        if (this.health <= 0) this.markForRemoval = true;
      }
    }
  }

  update() {
    this.move();
    this.screenWrap();
    this.display();
    this.handleCollision();
  }
}

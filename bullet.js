class Bullet extends Entity {
  constructor(x, y, bulletStats, playerBullet) {
    // x, y, hitRadius, xVelocity, yVelocity, health, damage, canScreenWrap, isPlayer
    super(
      x,
      y,
      bulletStats.size,
      bulletStats.xVelocity,
      bulletStats.yVelocity,
      bulletStats.piercing,
      bulletStats.damage,
      false,
      playerBullet
    );
    this.alreadyHit = new Set();
    this.attribute = bulletStats.attribute;
    this.bounceCount = 0;
    this.maxBounces = 3;
  }

  move() {
    this.y -= this.yVelocity;
    this.x += this.xVelocity;
    if (this.attribute === "diagonal") {
      if (this.x > width || this.x < 0) {
        this.xVelocity *= -1;
        
        this.bounceCount++;
        if (this.bounceCount > this.maxBounces) {
          this.markForRemoval = true;
        }
      }
    } else {
      if (this.x < 0 || this.x > width) this.markForRemoval = true;
    }
    if (this.y < 0 || this.y > height) {
      this.markForRemoval = true;
    }
  }

  display() {
    if (this.attribute === "none") fill(255, 0, 0);
    if (this.attribute === "diagonal") fill(0, 0, 255);
    stroke(0);
    if (!this.isPlayer) stroke(255);
    strokeWeight(2);
    if (this.attribute === "player") {
      fill(0);
      circle(this.x, this.y, this.hitRadius);
    } else {
      circle(this.x, this.y, this.hitRadius * 3);
    }
  }

  handleCollision() {
    for (let entity of entities) {
      if (this.alreadyHit.has(entity)) continue;
      if (entity.iFrameTimer > 0) continue;
      if (entity instanceof Bullet) continue;
      if (entity.isPlayer === this.isPlayer) continue;

      if (
        this.hitRadius + entity.hitRadius >
        dist(this.x, this.y, entity.x, entity.y)
      ) {
        this.health -= entity.damage;
        entity.health -= this.damage;

        if (entity.isPlayer) {
          entity.iFrameTimer = entity.iFrames;
        }

        this.alreadyHit.add(entity);
        if (this.health <= 0) this.markForRemoval = true;
        if (entity.health <= 0) entity.markForRemoval = true;
      }
    }
  }
}

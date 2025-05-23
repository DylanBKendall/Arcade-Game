class Powerup extends Entity {
  constructor(type) {
    // x, y, hitRadius, xVelocity, yVelocity, health, damage, canScreenWrap, isPlayer
    super(width / 2, -10, 50, 0, 3, 1, 0, true, false);
    this.type = type;
    this.applied = false;
  }

  move() {
    this.y += this.yVelocity;
  }

  display() {
    strokeWeight(3);
    fill(0, 255, 0, 100);
    circle(this.x, this.y, this.hitRadius * 2);
  }

  handleCollision() {
    for (let entity of entities) {
      if (!entity.isPlayer) continue;

      if (
        this.hitRadius + entity.hitRadius >
        dist(this.x, this.y, entity.x, entity.y)
      ) {
        this.health -= entity.damage;
        if (this.health <= 0) this.markForRemoval = true;
        if (!this.applied) this.applyPowerup();
        this.applies = true;
      }
    }
  }
  
  applyPowerup() {
    if (this.type == "megashot") player.bulletStats.size *= 4;
    if (this.type == "heavyshot") player.bulletStats.damage *= 2;
    if (this.type == "fastshot") player.bulletStats.yVelocity *= 2;
    if (this.type == "piercingshot") player.bulletStats.piercing *= 2;
    player.health += 3;
    powerupType = this.type;
  }
}

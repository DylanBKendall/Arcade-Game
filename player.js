class Player extends Entity {
  constructor() {
    // x, y, hitRadius, xVelocity, yVelocity, health, damage, canScreenWrap, isPlayer
    super(width / 2, (height * 3) / 4, 5, 250, 250, 10, 1, false, true);
    this.bulletStats = {
      xVelocity: 0,
      yVelocity: 7,
      damage: 5,
      piercing: 1,
      size: 10,
      attribute: "player",
    };
    this.shootCooldown = 0.3;
    this.shootTimer = 0;
    this.iFrames = 2000;
    this.iFrameTimer = 0;
    startingHealth = this.health;
  }

  move() {
    let dt = deltaTime / 1000;
    if (!this.canScreenWrap) {
      if (keyIsDown(LEFT_ARROW) && this.x > 0) {
        this.x -= this.xVelocity * dt;
      }
      if (keyIsDown(RIGHT_ARROW) && this.x < width) {
        this.x += this.xVelocity * dt;
      }
      if (keyIsDown(UP_ARROW) && this.y > 0) {
        this.y -= this.yVelocity * dt;
      }
      if (keyIsDown(DOWN_ARROW) && this.y < width) {
        this.y += this.yVelocity * dt;
      }
    } else {
      if (keyIsDown(LEFT_ARROW)) {
        this.x -= this.xVelocity * dt;
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.x += this.xVelocity * dt;
      }
      if (keyIsDown(UP_ARROW)) {
        this.y -= this.yVelocity * dt;
      }
      if (keyIsDown(DOWN_ARROW)) {
        this.y += this.yVelocity * dt;
      }
    }
  }

  shoot() {
    this.shootTimer += deltaTime / 1000;

    if (keyIsDown(90) && this.shootTimer >= this.shootCooldown) {
      entities.push(new Bullet(this.x, this.y - 27, this.bulletStats, true));
      this.shootTimer = 0;
    }
  }

  display() {
    if (this.iFrameTimer > 0 && floor(millis() / 100) % 2 === 0) return;
    stroke(0);
    strokeWeight(3);
    fill(255);
    triangle(
      this.x - 15,
      this.y + 13,
      this.x,
      this.y - 27,
      this.x + 15,
      this.y + 13
    );
    strokeWeight(this.hitRadius * 2);
    point(this.x, this.y);
  }

  handleCollision() {
    if (this.health <= 0) {
      this.markForRemoval = true;
      return;
    }
    if (this.iFrameTimer <= 0) {
      for (let entity of entities) {
        if (entity.isPlayer) continue;
        if (entity instanceof Bullet) continue;

        if (
          this.hitRadius + entity.hitRadius >
          dist(this.x, this.y, entity.x, entity.y)
        ) {
          this.health -= entity.damage;
          this.iFrameTimer = this.iFrames;
          if (this.health <= 0) this.markForRemoval = true;
        }
      }
    }
  }

  update() {
    if (this.iFrameTimer > 0) this.iFrameTimer -= deltaTime;

    this.move();
    this.screenWrap();
    this.shoot();
    this.display();
    this.handleCollision();
    if (this.markForRemoval) {
      effects.push(new DeathEffect(this.x, this.y));
      gameOver = true;
    }
  }
}

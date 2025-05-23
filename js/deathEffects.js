class DeathEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 200;
    this.decrement = 5;
    this.done = false;
  }

  display() {
    noStroke();
    this.size -= this.decrement;

    fill(255, 0, 0);
    circle(this.x, this.y, this.size + 24);

    fill(0, 255, 0);
    circle(this.x, this.y, this.size + 16);

    fill(0, 0, 255);
    circle(this.x, this.y, this.size + 8);

    fill(255);
    circle(this.x, this.y, this.size);

    if (this.size <= 0) this.done = true;
  }
}

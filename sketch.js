let pawn = () => new Pawn(false);
let homingPawn = () => new Pawn(true);
let bishop = () => new Bishop(false);
let homingBishop = () => new Bishop(true);
let queen = () => new Queen(false);
let homingQueen = () => new Queen(true);
let king = () => new King(false);
let megashot = () => new Powerup("megashot");
let heavyshot = () => new Powerup("heavyshot");
let fastshot = () => new Powerup("fastshot");
let piercingshot = () => new Powerup("piercingshot");
const WAVE_VARIATIONS = {
  1: [
    [pawn, homingPawn, bishop],
    [homingPawn, pawn, pawn, pawn],
    [homingPawn, queen],
  ],
  2: [
    [homingPawn, bishop, homingBishop, queen],
    [homingPawn, bishop, bishop, bishop, homingBishop],
    [homingPawn, homingBishop, homingQueen],
  ],
  3: [
    [
      homingBishop,
      homingBishop,
      homingBishop,
      homingBishop,
      queen,
      queen,
      homingQueen,
    ],
    [homingBishop, homingBishop, queen, queen, homingQueen, homingQueen],
    [homingBishop, homingQueen, homingQueen, homingQueen],
  ],
  4: [[king]],
  5: [[megashot], [heavyshot], [fastshot], [piercingshot]],
};
let entities = [];
let effects = [];
let wave = 0;
let waveTimer = 5;
let waveInterval = 5;
let scoreTimer = 0;
let scoreDeductionInterval = 5;
let player;
let tutorial = true;
let gameOver = false;
let score = 0;
let powerupType = "";
let startingHealth = 0;

function setup() {
  createCanvas(800, 800);
  player = new Player();
  entities.push(player);
}

function draw() {
  let dt = deltaTime / 1000;
  scoreTimer += dt;
  if (scoreTimer >= scoreDeductionInterval) {
    score -= 10;
    scoreTimer = 0;
  }
  displayBackground();
  displayText();
  checkWave();
  updateAndDisplayEntities();
  if (gameOver && keyIsDown(82)) {
    resetVariables();
    setup();
  }
}

function resetVariables() {
  entities = [];
  effects = [];
  wave = 0;
  waveTimer = 0;
  waveInterval = 3;
  scoreTimer = 0;
  tutorial = true;
  gameOver = false;
  score = 0;
  powerupType = "";
  startingHealth = 0;
}

function updateAndDisplayEntities() {
  for (let i = entities.length - 1; i >= 0; i--) {
    entities[i].update();
  }

  for (let i = effects.length - 1; i >= 0; i--) {
    effects[i].display();
    if (effects[i].done) {
      effects.splice(i, 1);
    }
  }

  entities = entities.filter((e) => !e.markForRemoval);
}

function checkWave() {
  let dt = deltaTime / 1000;
  if (waveTimer >= waveInterval) {
    if ((wave % 5) - 3 === 0 || (wave % 5) - 4 === 0 || wave % 5 === 0) {
      let noEnemies = true;
      for (let entity of entities) {
        if (entity instanceof Enemy || entity instanceof Powerup)
          noEnemies = false;
      }
      if (noEnemies) waveTimer += dt;
      if (waveTimer >= waveInterval * 2) {
        spawnWave();
        waveTimer = 0;
      }
    } else {
      spawnWave();
      waveTimer = 0;
    }
  } else {
    waveTimer += dt;
  }
}

function displayText() {
  strokeWeight(3);
  if (wave !== 0 && wave % 5 === 0) {
    textSize(50);
    text(powerupType + "!!!", width / 3, height / 2);
  }
  if (wave !== 0 && wave % 6 === 0) {
    powerupType = "";
  }
  if (!gameOver) {
    textSize(30);
    text("Heath: " + player.health, 20, 50);
    if (tutorial)
      text("Z to shoot, ARROWS to move", width / 3 - 75, height / 2);
  } else {
    textSize(100);
    text("GAME OVER", width / 8, height / 2);
    textSize(30);
    text(
      "Score: " + score / (startingHealth - player.health),
      width / 2 - 75,
      height / 2 + 50
    );
    text("Press r to restart", width / 2 - 100, height / 2 + 150);
  }
}

function displayBackground() {
  let pulse1 = (sin(frameCount * 0.05) + 1) * 50;
  let pulse2 = (cos(frameCount * 0.05) + 1) * 50;
  let pulse3 = (sin(frameCount * 0.05) / cos(frameCount * 0.05) + 1) * 50;
  background(pulse1, pulse2, pulse3);
}

function spawnWave() {
  tutorial = false;
  let variations =
    WAVE_VARIATIONS[(wave % Object.keys(WAVE_VARIATIONS).length) + 1];
  let selectedWave = variations[int(random(variations.length))];

  for (let enemy of selectedWave) {
    entities.push(enemy());
  }
  wave++;
}

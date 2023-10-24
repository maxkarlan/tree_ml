let grid, next;
// let dA = 01; // Adjusted diffusion rate for A
// let dB = 0.125; // Adjusted diffusion rate for B
// let dC = .05;
// let feed = 0.0367; // Adjusted feed rate
// let kill = 0.0649; // Adjusted kill rate
let colorA, colorB, colorC;
let offScreenCanvas;
let canvasSize = 25;
let offsetX, offsetY;

function setup() {
  dA = random(.7, 1); // Adjusted diffusion rate for A
  dB = random(0.05, 0.25); // Adjusted diffusion rate for B
  dC = random(0.05, 0.25);
  feed = random(0.03, 0.04);
  kill = random(0.057, 0.065);
  createCanvas(windowWidth, windowHeight);
  offsetX = (width - canvasSize) / 2;
  offsetY = (height - canvasSize) / 2;

  grid = [];
  next = [];
  for (let x = 0; x < canvasSize; x++) {
    grid[x] = [];
    next[x] = [];
    for (let y = 0; y < canvasSize; y++) {
      grid[x][y] = { a: 1, b: 0 };
      next[x][y] = { a: 1, b: 0 };
      grid[x][y].c = 0;  // initialize C to 0 everywhere
      next[x][y].c = 0;
    }

  }
  
  // Adjusted initial seeding for chemical B
  for (let i = canvasSize * 0.4; i < canvasSize * 0.6; i++) {
    for (let j = canvasSize * 0.4; j < canvasSize * 0.6; j++) {
      grid[i][j].b = 1;
    }
  }
  // Assign random colors to chemicals A and B
  colorA = color(random(255), random(255), random(255));
  colorB = color(random(255), random(255), random(255));
  colorC = color(random(255), random(255), random(255));

  frameRate(120);

  offScreenCanvas = createGraphics(canvasSize, canvasSize);
}

function draw() {
  background(220);

  offScreenCanvas.background(220);

  // Replace all drawing operations from main canvas to offscreenCanvas
  offScreenCanvas.loadPixels(); // Use this instead of loadPixels()

  for (let x = 1; x < canvasSize - 1; x++) {
    for (let y = 1; y < canvasSize - 1; y++) {
      let a = grid[x][y].a;
      let b = grid[x][y].b;
      let c = grid[x][y].c;
      next[x][y].a = constrain(a + (dA * laplaceA(x, y)) - (a * b * b) + (feed * (1 - a)), 0, 1);
      next[x][y].b = constrain(b + (dB * laplaceB(x, y)) + (a * b * b) - ((kill + feed) * b), 0, 1);
      next[x][y].c = constrain(c + (dC * laplaceC(x, y)) - (a * b * c) + (feed * (1 - c)), 0, 1);
    }
  }

  for (let x = 0; x < canvasSize; x++) {
    for (let y = 0; y < canvasSize; y++) {
      let a = next[x][y].a;
      let b = next[x][y].b;
      let c = next[x][y].c;
      let col = lerpColor(lerpColor(colorA, colorB, b), colorC, c);
      offScreenCanvas.set(x, y, col);
    }
  }

  offScreenCanvas.updatePixels();
  swap();

  // Now, display the content of offscreenCanvas on the main canvas
  // Calculate scale factor based on smaller dimension of the window
  let scaleFactor = min(windowWidth, windowHeight) / canvasSize;
  image(offScreenCanvas, (windowWidth - canvasSize * scaleFactor) / 2, (windowHeight - canvasSize * scaleFactor) / 2, canvasSize * scaleFactor, canvasSize * scaleFactor);
}


function laplaceA(x, y) {
  let sumA = 0;
  sumA += grid[x][y].a * -1;
  sumA += grid[x-1][y].a * 0.2;
  sumA += grid[x+1][y].a * 0.2;
  sumA += grid[x][y-1].a * 0.2;
  sumA += grid[x][y+1].a * 0.2;
  sumA += grid[x-1][y-1].a * 0.05;
  sumA += grid[x+1][y-1].a * 0.05;
  sumA += grid[x+1][y+1].a * 0.05;
  sumA += grid[x-1][y+1].a * 0.05;
  return sumA;
}

function laplaceB(x, y) {
  let sumB = 0;
  sumB += grid[x][y].b * -1;
  sumB += grid[x-1][y].b * 0.2;
  sumB += grid[x+1][y].b * 0.2;
  sumB += grid[x][y-1].b * 0.2;
  sumB += grid[x][y+1].b * 0.2;
  sumB += grid[x-1][y-1].b * 0.05;
  sumB += grid[x+1][y-1].b * 0.05;
  sumB += grid[x+1][y+1].b * 0.05;
  sumB += grid[x-1][y+1].b * 0.05;
  return sumB;
}

function laplaceC(x, y) {
    let sumC = 0;
    // Define the Laplacian for C, similar to A and B
    sumC += grid[x][y].c * -1;
    sumC += grid[x-1][y].c * 0.2;
    sumC += grid[x+1][y].c * 0.2;
    sumC += grid[x][y-1].c * 0.2;
    sumC += grid[x][y+1].c * 0.2;
    sumC += grid[x-1][y-1].c * 0.05;
    sumC += grid[x+1][y-1].c * 0.05;
    sumC += grid[x+1][y+1].c * 0.05;
    sumC += grid[x-1][y+1].c * 0.05;
    return sumC;
}

function swap() {
  let temp = grid;
  grid = next;
  next = temp;
}
let startImg;

let targetImgs = [];

let currentTarget;

let particles = [];

let mode = "start";

// =====================================================
// 색상 팔레트
// =====================================================

let palettes = [

  [
    [255, 80, 80],
    [255, 180, 120]
  ],

  [
    [100, 160, 255],
    [180, 220, 255]
  ],

  [
    [255, 220, 80],
    [255, 180, 60]
  ],

  [
    [180, 120, 255],
    [220, 180, 255]
  ]

];

let currentPalette;

// =====================================================
// preload
// =====================================================

function preload() {

  startImg = loadImage("start.png");

  targetImgs[0] = loadImage("target1.png");
  

}

// =====================================================
// setup
// =====================================================

function setup() {

  createCanvas(windowWidth, windowHeight);

  noStroke();

  targetImgs = targetImgs.filter(img => img);

  currentTarget = random(targetImgs);

  currentPalette = random(palettes);

  generateParticlesFromImage(startImg);

}

// =====================================================
// draw
// =====================================================

function draw() {

  background(0);

  for (let p of particles) {

    p.update();
    p.display();

  }

  if (mode === "start") {

    fill(255, 120);

    textAlign(CENTER);

    textSize(16);

    text("CLICK", width / 2, height - 80);

  }

}

// =====================================================
// 클릭
// =====================================================

function mousePressed() {

  if (mode === "start") {

    explodeParticles();

    mode = "explode";

    setTimeout(() => {

      reformToTarget();

      mode = "reform";

    }, 1500);

  }

}

// =====================================================
// 시작 이미지 → 파티클
// =====================================================

function generateParticlesFromImage(img) {

  particles = [];

  img.loadPixels();

  let scale = 0.9;

  let offsetX =
    width / 2 -
    img.width * scale / 2;

  let offsetY =
    height / 2 -
    img.height * scale / 2;

  // 간격 크게
  for (let x = 0; x < img.width; x += 12) {

    for (let y = 0; y < img.height; y += 12) {

      let index =
        (x + y * img.width) * 4;

      let r = img.pixels[index];

      let a = img.pixels[index + 3];

      if (r > 20 && a > 0) {

        let px = offsetX + x * scale;
        let py = offsetY + y * scale;

        particles.push(
          new Particle(px, py)
        );

        // 최대 개수 제한
        if (particles.length > 10000) {

          return;

        }

      }

    }

  }

}

// =====================================================
// 폭발
// =====================================================

function explodeParticles() {

  for (let p of particles) {

    p.vx = random(-10, 10);
    p.vy = random(-10, 10);

  }

}

// =====================================================
// 재조립
// =====================================================

function reformToTarget() {

  if (!currentTarget) return;

  currentTarget.loadPixels();

  let targets = [];

  let scale = 0.9;

  let offsetX =
    width / 2 -
    currentTarget.width * scale / 2;

  let offsetY =
    height / 2 -
    currentTarget.height * scale / 2;

  for (let x = 0; x < currentTarget.width; x += 12) {

    for (let y = 0; y < currentTarget.height; y += 12) {

      let index =
        (x + y * currentTarget.width) * 4;

      let r = currentTarget.pixels[index];

      let a = currentTarget.pixels[index + 3];

      if (r > 20 && a > 0) {

        targets.push({

          x: offsetX + x * scale,
          y: offsetY + y * scale

        });

      }

    }

  }

  if (targets.length === 0) return;

  for (let i = 0; i < particles.length; i++) {

    let t = random(targets);

    particles[i].targetX = t.x;
    particles[i].targetY = t.y;

    particles[i].reforming = true;

    let c = random(currentPalette);

    particles[i].targetColor = color(
      c[0],
      c[1],
      c[2]
    );

  }

}

// =====================================================
// 파티클 클래스
// =====================================================

class Particle {

  constructor(x, y) {

    this.x = x;
    this.y = y;

    this.targetX = x;
    this.targetY = y;

    this.vx = 0;
    this.vy = 0;

    this.size = random(2, 4);

    this.reforming = false;

    this.color = color(255);

    this.targetColor = color(255);

  }

  update() {

    if (!this.reforming) {

      this.x += this.vx;
      this.y += this.vy;

      this.vx *= 0.96;
      this.vy *= 0.96;

    }

    else {

      this.x = lerp(
        this.x,
        this.targetX,
        0.06
      );

      this.y = lerp(
        this.y,
        this.targetY,
        0.06
      );

      this.color = lerpColor(
        this.color,
        this.targetColor,
        0.04
      );

    }

  }

  display() {

    // glow 1개만 사용
    fill(
      red(this.color),
      green(this.color),
      blue(this.color),
      50
    );

    circle(
      this.x,
      this.y,
      this.size * 3
    );

    fill(this.color);

    circle(
      this.x,
      this.y,
      this.size
    );

  }

}

// =====================================================
// 창 크기 대응
// =====================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

}
// =====================================================
// R 키로 리셋
// =====================================================

function keyPressed() {

  // R 또는 r
  if (key === 'r' || key === 'R') {

    resetSketch();

  }

}

// =====================================================
// 초기 상태로 되돌리기
// =====================================================

function resetSketch() {

  // 상태 초기화
  mode = "start";

  // 랜덤 목표 이미지 다시 선택
  currentTarget = random(targetImgs);

  // 랜덤 팔레트 다시 선택
  currentPalette = random(palettes);

  // 파티클 다시 생성
  generateParticlesFromImage(startImg);

}

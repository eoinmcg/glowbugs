import { W, H, level } from './state.js';
import { pal } from './pal.js';

export function smoke(pos, force = 2, size = 1, c = false) {
  c = c || new Color(1, 1, 1, .5)
  new ParticleEmitter(
    pos, // pos
    0, // angle
    0, // 0.1 * force, // radius / 2, // emitSize
    0.1, // emitTime
    rand(15, 30) * (force + 0.2), // emitRate
    PI / 2, // emiteCone
    tile(13, 8),
    c, c,           // colorStartA, colorStartB
    c.scale(1, 0), c.scale(1, 0), // colorEndA, colorEndB
    0.4, // time
    size, // sizeStart
    size * 2, // sizeEnd
    force * 0.001, // speed
    0.1, // angleSpeed
    0.8, // damp
    0.9, // angleDamp
    -0.2, // gravity
    PI, // particle cone
    0.5, // fade
    1, // randomness
  );
}

export function sparks(p, t = 12, c = YELLOW, time = .1) {
  new ParticleEmitter(
    p, 0,            // pos, angle
    0, time, 30, PI, // emitSize, emitTime, emitRate, emiteCone
    tile(t, 8),                      // tileInfo
    c, c,           // colorStartA, colorStartB
    c.scale(1, 0), c.scale(1, 0), // colorEndA, colorEndB
    1, 4, 2, 1, 0.05,  // time, sizeStart, sizeEnd, speed, angleSpeed

    1, 1, 0.05, PI,   // damping, angleDamping, gravityScale, cone
    0, 0, 0, 0        // fadeRate, randomness, collide, additive
  );
}


export function funkyText(str, pos = cameraPos, opts = {}) {
  const defaults = {
    size: 60,
    cols: [WHITE],
    outline: BLACK,
    wavy: false,
  };

  opts = { ...defaults, ...opts };
  let size = opts.size;
  const cols = Array.isArray(opts.cols) ? opts.cols : [opts.cols];
  const letters = str.toUpperCase().split('');

  overlayContext.font = size + 'px ' + fontDefault;
  const letterSpacing = size * .05;

  const widths = letters.map(letter => overlayContext.measureText(letter).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + (letters.length - 1) * letterSpacing;

  let x = -totalWidth / 2;

  letters.forEach((letter, i) => {
    const width = widths[i];
    const speed = 5;
    const phaseShift = i * .5;
    const individualWave = Math.sin(time * speed + phaseShift);
    const y = opts.wavy ? individualWave * 20 : 0;

    const charPos = pos.add(vec2(x + width / 2, y));
    const colorSpeed = 0;
    const col = cols[Math.floor(time * colorSpeed + i) % cols.length];

    drawTextScreen(
      letter,
      charPos,
      size + (y * .5),
      col,
      size * .25,
      opts.outline,
      'center'
    );

    x += width + letterSpacing;
  });
}

export function bg(c = 1) {
  const NUM = 200;
  const random = new RandomGenerator(level + 1);

  mainContext.fillStyle = pal[c].lerp(BLACK, .6)
  mainContext.beginPath();
  mainContext.rect(0, 0, W, H);
  mainContext.fill();

  for (let i = NUM; i--;) {
    let size = random.float(5, 10);
    let speed = 0;
    const extraSpace = 10;

    const screenPos = vec2(
      (random.float(W) + time) % W - extraSpace,
      (random.float(H) + time * speed * random.float()) % H - extraSpace
    );

    mainContext.globalAlpha = 1 / size;
    mainContext.fillStyle = '#000';
    mainContext.beginPath();
    mainContext.arc(screenPos.x, screenPos.y, size, 0, 2 * Math.PI, false);
    mainContext.fill();
  }

  mainContext.globalAlpha = 1;
}

export function glow() {
  const random = new RandomGenerator(6);
  const num = 30;

  const worldWidth = mainCanvas.width / cameraScale;
  const worldHeight = mainCanvas.height / cameraScale;
  const worldMin = vec2(
    cameraPos.x - worldWidth / 2,
    cameraPos.y - worldHeight / 2
  );

  for (let i = 0; i < num; i++) {
    const baseX = random.float(worldWidth);
    const baseY = random.float(worldHeight);

    const speed = 20 + random.float(30);
    const phaseY = random.float(Math.PI * 2);

    // Move left and wrap around
    const x = ((baseX - time * 8) % worldWidth + worldWidth) % worldWidth;

    const worldPos = vec2(
      worldMin.x + x,
      worldMin.y + baseY + Math.sin(time * speed * 0.05 + phaseY) * 2
    );

    for (let r = 1; r <= 4; r++) {
      const glowColor = new Color(1, 1, .5, .5 * (1 - r / 4));
      drawRect(worldPos, vec2(r * 1), glowColor, time);
    }
  }
}

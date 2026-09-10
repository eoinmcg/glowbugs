import { SCREENX, SCREENY } from "./state";
import Block from "./entities/block";


export const randPos = (off = 5, size = vec2(1)) => {
  let pos, hit;
  do {
    pos = vec2(
      ~~rand(-SCREENX + off, SCREENX - off),
      ~~rand(-SCREENY + off, SCREENY - off)
    );
    hit = 0;
    // Check overlap against all solid engine objects
    engineObjectsCallback(pos, size, o => hit = o.solid);
  } while (hit);

  return pos;
};

let anyKeyDown = false;
addEventListener('keydown', () => anyKeyDown = true);

addEventListener('keydown', e => { if (!e.repeat) anyKeyDown = true });

export const anyInput = () => {
  const hit = anyKeyDown || mouseWasPressed(0) || gamepadWasPressed(1);
  anyKeyDown = false;
  return hit;
};

// exits: bitmask where 1=Horiz Exit, 2=Vert Exit 
// (e.g. 0=none, 1=top/bottom, 2=left/right, 3=both)
export function createWalls(x, y, s = 10, e = 0, t = 4) {
  [
    [x, y, e & 2, 0, 1], // Vertical walls
    [y, x, e & 1, 1, 0]  // Horizontal walls
  ].forEach(([A, B, exit, isH, isV]) => {
    let L = B * 2, d = exit && s < L ? (L - s) / 2 : L, c = exit && s < L ? (s + d) / 2 : 0;
    [-1, 1].forEach(i =>
      [-1, 1].forEach(j =>
        d && (c || j > 0) && new Block(
          vec2(i * A * isV + j * c * isH, i * A * isH + j * c * isV),
          vec2(isH ? d : t, isV ? d : t)
        )
      )
    );
  });
}

export const fader = (cb) => {
  const B = document.body.style;
  B.transition = 'all .5s';
  B.opacity = 0;
  setTimeout(() => {
    cb?.();
    B.opacity = 1;
  }, 300);
};

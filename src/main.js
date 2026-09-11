import {
  TITLE, W, H, TILE_SIZE,
  SCREENX, SCREENY,
  sfx, gameOver, setGameOver,
  playMusic, setTempo, events,
  player, setPlayer,
  newBest, clearNewBest, resetScore, hiScore,
  resetStats,
  exit, setExit,
  shake, setShake,
  setNextLevel, nextLevel, level, setLevel,
} from './state.js';

import Player from "./entities/player";
import Powerup from "./entities/powerup";
import Treat from "./entities/treat";
import Bug from "./entities/bug";
import Baddie from "./entities/baddie";
import Poop from "./entities/poop";
import Blade from "./entities/blade";
import Block from "./entities/block";
import Exit from "./entities/exit";
import Alert from "./entities/alert";
import ScoreDisplay from './entities/scoreDisplay';
import { rainbow, pal } from "./pal.js";
import { funkyText, bg, glow, smoke } from './effects.js';
import { tune } from "./tune";
import { anyInput, createWalls, fader } from "./lib"
import { initSfx } from './sfx.js';

import { levels } from './levels.js';

tileFixBleedScale = 0.5
// setShowWatermark(false)

const SPAWN_TYPES = [Baddie, Bug, Blade, Block, Poop, Treat, Powerup];
let plays = -1, splashInit, levelData, bgColor, tutorialCut;

const startGame = () => {
  plays++
  if (!level && plays > 0 && !tutorialCut) {
    levels.shift()
    tutorialCut = true
  }
  levelData = levels[level];
  if (!levelData) { levelData = levels[levels.length - 1] }

  setGameOver(false);
  resetStats()
  events.length = 0;

  // Clean engine objects and check for an existing score display in a single pass
  let hasScore = false;
  engineObjects.forEach(o => {
    if (o.name == 'score') hasScore = true;
    else if (o.name != 'p1') o.destroy();
  });
  if (!hasScore) new ScoreDisplay();

  bgColor = plays === 0 ? 2 : randInt(4)
  levelData.freq ??= .991
  levelData.target ??= 5


  if (level > 2) {
    events.add(rand(20, 40), () => { new Powerup() })
  }

  setExit(null);
  if (!player) {
    setPlayer(new Player(levelData.target));
  } else {
    player.reset(levelData.target);
  }

  // Spawns
  for (const entry of levelData.spawns) {
    events.add(entry?.time || 0, () => new SPAWN_TYPES[entry.type](entry));
  }

  let i = levelData.treats || 0
  while (i--) { new Treat() }

  createWalls(...levelData.walls);
  playMusic(tune, true, 120);
  new Alert(level === 0 ? `` : `Wave ${level}`);
};

function gameInit() {
  const size = vec2(W, H);
  setCanvasFixedSize(size);
  setCanvasMaxSize(size);
  setCameraScale(TILE_SIZE);

  document.title = TITLE;
  initSfx()

  // Favicon generator
  const c = document.createElement('canvas'), ctx = c.getContext('2d');
  c.width = c.height = 16;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(textureInfos[0].image, 8, 8, 8, 8, 0, 0, 16, 16);
  document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon', href: c.toDataURL() }));

  // START AT TITLE SCREEN (level = -1 or set in state.js)
  // setLevel(-1);
  const m = location.search.match(/l=(\d+)/)
  if (m) {
    setLevel(+m[1])
    startGame()
  } else {
    setLevel(-1)
  }
}

function gameUpdate() {
  // Handle Rainbow / External Level Transitions
  if (nextLevel >= 0) {
    setLevel(nextLevel);
    setNextLevel(-1);
    startGame();
    return;
  }

  events.update();

  // Camera Shake
  if (shake > 0) {
    setShake(shake - timeDelta);
    cameraPos = randInCircle(shake);
  } else cameraPos = vec2();

  // 1. TITLE SCREEN / SPLASH STATE (level === -1)
  if (level < 0) {
    if (anyInput() && !splashInit) {
      splashInit = time;
      events.add(1.5, () => {
        fader(() => {
          setLevel(0);
          startGame();
        });
      });
    }
    return; // Don't run gameplay logic on title screen
  }

  // 2. GAME OVER STATE
  if (gameOver) {
    if (anyInput() && time > gameOver + 1) {
      setPlayer(null);
      resetScore(0);
      fader(() => {
        setLevel(0);
        startGame();
      });
    }
    return;
  }

  // 3. ACTIVE GAMEPLAY STATE
  if (!player || !levelData) return

  if (newBest) { clearNewBest(); new Alert('New HiScore!', pal[13], pal[7]); sfx.hi.play() }

  if (player.bugs.length >= levelData.target && !exit) {
    setExit(new Exit(levelData?.exit));
    setTempo(180)
  }

  if (!levelData.tutorial && !exit && rand() > levelData.freq) {
    new Treat();
  }
}

function gameRender() {
  const center = W / 2;

  // Render Title Screen
  if (level < 0) {
    drawCircle(vec2(0), 110, pal[1].lerp(BLACK, .5));
    const y = splashInit ? (time - splashInit) * -500 : 0;
    funkyText(TITLE, vec2(center, (H * .5) + y), { size: 140, wavy: true, cols: rainbow, outline: BLACK });

    const x = splashInit ? (time - splashInit) * 200 : 0;
    if (x) {
      sfx.click.play()
      smoke(vec2(rand(-SCREENX, SCREENX), rand(-SCREENY, SCREENY)), 5, rand(3, 6), rainbow[~~rand(0, rainbow.length - 1)])
    }



    if (!splashInit) {
      glow()
      drawTextScreen("HI: " + hiScore, vec2(center, H * .1), 50, WHITE, 15, BLACK);
      // if (rand() > .9) sparks(vec2(rand(-40, 40), 0), 7, WHITE)
      if (Math.sin(time * 5) > 0) {
        // drawTextScreen("READY?", vec2(center, H * .905), 36, BLACK);
        drawTextScreen("READY?", vec2(center, H * .9), 40, WHITE);
      }
    }
    return;
  }

  // Render Active Level
  if (levelData) bg(bgColor);

  if (player && !player.exit) {
    const progressW = 100;
    const fillW = clamp(player.visualProgress, 0, progressW);
    drawRect(vec2(0, -45), vec2(progressW + 2, 4), new Color(0, 0, 0, 0.3));
    drawRect(vec2(-progressW / 2 + fillW / 2, -45), vec2(fillW, 2), pal[2]);
  }

  if (gameOver) {
    funkyText("Game Over", vec2(center, H / 2), { size: 120, cols: [pal[7], pal[8], pal[9]], outline: BLACK, wavy: true });
  }
}

engineInit(gameInit, gameUpdate, 0, gameRender, 0, ['t.gif']);

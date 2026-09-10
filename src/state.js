import { TimerSystem } from "./timer.js";

export const TITLE = 'GLOWBUGS';
export const W = 1440;
export const H = 800;
export const TILE_SIZE = 8;
export const SCREENX = (W / TILE_SIZE) / 2
export const SCREENY = (H / TILE_SIZE) / 2

export const sfx = {};

export let player
export const setPlayer = p => player = p;

export let exit
export const setExit = p => exit = p;

export let shake
export const setShake = s => shake = s

export let level = 1;
export const setLevel = s => level = s

// flag for updating level, polled in gameUpdate
export let nextLevel = -1;
export const setNextLevel = (lvl) => nextLevel = lvl;

export let events = new TimerSystem();

// Game State
export let score = 0;
export let gameOver = 0;

const initStats = () => ({ saved: [], eaten: [], combos: 0, buns: 0 })
export let stats = initStats()
export const resetStats = () => stats = initStats()

export let hiScore = 500
try { hiScore = +localStorage.hs || 500 } catch { }

export let newBest = false
let beat = false

export const clearNewBest = () => newBest = false
export const resetScore = () => { score = 0; beat = newBest = false }

export const updateScore = (val = 10) => {
  score += val
  if (!beat && score > hiScore) newBest = beat = true
}

let musicNode = null;
let musicSource = null;
let baseBpm = 120;

export const playMusic = (tune, loop = true, bpm = 120) => {
  if (musicNode) musicNode.stop();
  tune[3] = bpm;
  baseBpm = bpm;
  musicNode = new ZzFXMusic(tune);
  musicSource = musicNode.play();
  if (musicSource) musicSource.loop = loop;
};

export const setTempo = (bpm) => {
  if (!musicSource) return;
  musicSource.playbackRate.value = bpm / baseBpm;
};

export const stopMusic = () => {
  try { musicNode?.stop() } catch { }
  musicNode = musicSource = null
};

export const setGameOver = (val) => {
  inputClear();
  gameOver = val;
  stopMusic();
  if (score > hiScore) {
    hiScore = score;
    try { localStorage.hs = score } catch { }
  }
};

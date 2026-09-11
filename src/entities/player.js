import { TILE_SIZE, setGameOver, sfx, events, stats, setShake, stopMusic, playMusic } from '../state.js'
import Sprite from "./sprite"
import MagicPoop from "./magicPoop"
import Rainbow from "./rainbow"
import Ded from "./ded"
import Score from './score';
import Swiper from '../swiper';
import { smoke, sparks } from "../effects"
import { pal, rainbow } from '../pal.js'
import { victory, dead } from '../tune.js'

const RIGHT = vec2(1, 0)
const LEFT = vec2(-1, 0)
const UP = vec2(0, 1)
const DOWN = vec2(0, -1)
const AXES = ['x', 'y']

export default class Player extends Sprite {
  constructor(target) {
    super(vec2(), vec2(6), tile(0, 8))
    this.dashSpeed = 30
    this.name = 'p1'
    this.renderOrder = 200
    this.reset(target)

  }

  reset(target) {
    this.bugs = []
    this.pathHistory = []
    this.spacing = 15 // space (in history frames) between bugs
    this.visualProgress = this.sick = this.combo = 0
    this.exit = null
    this.speed = .6
    this.pos = vec2()

    this.target = target
    this.swipe = new Swiper()
    this.swipe.clear()

    this.dir = RIGHT
    this.mirror = false
    this.levelComplete = false
    this.invincible = 0
  }

  update() {
    super.update()

    this.progress = this.bugs.length / this.target * 100
    this.visualProgress = Math.min(this.progress, this.visualProgress + 50 * timeDelta * 2)

    if (this.invincible > 0) {
      this.invincible -= timeDelta
      this.color = this.invincible < .2 ? WHITE : rainbow[~~rand(rainbow.length)]
    } else if (this.color && this.sick <= 0) {
      this.color = undefined
    }

    if (this.exit) return (this.velocity = vec2())

    if (this.sick > 0) {
      this.sick -= timeDelta
      this.tileInfo.pos.x = TILE_SIZE * 2
      if (this.sick <= 0) this.color = undefined
      return
    }

    const d = this.swipe.dir
    let moveX = false
    let gamepad = gamepadStick(0)
    if (gamepad.x > 0 || keyIsDown('ArrowRight') || d == 'right') { this.dir = RIGHT; moveX = true }
    else if (gamepad.x < 0 || keyIsDown('ArrowLeft') || d == 'left') { this.dir = LEFT; moveX = true }
    else if (gamepad.y > 0 || keyIsDown('ArrowUp') || d == 'up') this.dir = UP
    else if (gamepad.y < 0 || keyIsDown('ArrowDown') || d == 'down') this.dir = DOWN

    this.velocity = this.dir.scale(this.speed)
    if (moveX) {
      this.mirror = this.velocity.x < 0
    }

    if (this.dir.x + this.dir.y !== 0) {
      this.tileInfo.pos.x = Math.sin(time * 20) > 0 ? 0 : TILE_SIZE

      if (rand() > 0.7) smoke(this.pos.add(vec2(0, -2.5)), 0.5)
      this.offScreenCheck()
    } else {
      this.tileInfo.pos.x = 0
    }

    if (!this.pathHistory.length || this.pos.distance(this.pathHistory[0]) > 0.5) {
      this.pathHistory.unshift(this.pos.copy())
      const maxHistory = (this.bugs.length + 2) * this.spacing
      if (this.pathHistory.length > maxHistory) {
        this.pathHistory.pop()
      }
    }
  }

  render() {
    const off = this.mirror ? -1.5 : 1.5
    drawTile(this.pos.add(vec2(off, 4)), vec2(4), tile(3, 8), this.sick > 0 ? GREEN : WHITE, 0.2 * (this.mirror ? -1 : 1))
    if (this.sick) {
      drawTile(this.pos.add(vec2(off * 1.6, -2 - (2 - this.sick))), vec2(1, this.sick * 2), tile(13, TILE_SIZE), YELLOW)
    }
    super.render()
  }

  offScreenCheck() {
    if (!this.offscreen) return
    AXES.forEach(axis => {
      const limit = axis === 'x' ? this.screenX : this.screenY;
      if (Math.abs(this.pos[axis]) > limit) {
        const wrap = limit * 2 * Math.sign(this.pos[axis]);
        this.pos[axis] -= wrap;
        this.pathHistory.forEach(p => p[axis] -= wrap);

        // Shift follower bugs and set a brief cooldown to prevent wrap-frame collisions
        this.bugs.forEach(b => {
          b.pos[axis] -= wrap;
          b.touchCooldown = 0.2;
        });
      }
    });
  }

  collideWithObject(o) {
    if (o.destroyed || this.exit || o.name === 'magicPoop') return

    if (o.name === 'poop') {
      if (this.invincible > 0) {
        o.destroy()
        sparks(this.pos, 13, pal[3], .5)
        new Score(o.pos, 40, sfx.hit)
        return
      }
      o.destroy()
      if (this.bugs.length) this.breakChainAt(this.bugs[0], { eaten: false })
      this.velocity = vec2()
      this.color = GREEN
      this.sick = 2
      sparks(this.pos, 13, pal[3], .5)
      sfx.barf.play()
    } else if (o.name === 'powerup') {
      o.destroy()
      this.invincible = 6
      sfx.powerup.play()
    } else if (o.name === 'bug') {
      if (!o.followTarget) {
        o.followTarget = this
        o.gracePeriod = .3
        this.bugs.push(o)
        new Score(o.pos, 20, sfx.pickup)
        sparks(o.pos, 7, o.color, 0.2)
      } else if (o.followTarget && o.gracePeriod < 0.01 && this.bugs[0] !== o) {
        this.breakChainAt(o, { eaten: false })
        sfx.hit.play()
      }
    } else if (o.name === 'treat') {
      this.combo++
      stats.buns++
      o.destroy()
      new Score(o.pos, 10)
      new MagicPoop(o)
      sparks(this.pos, 12, pal[14])
    } else if (o.name === 'exit') {
      this.exit = o
      this.exitBug()
      stopMusic()
      events.add(.5, () => playMusic(victory, false))
    } else if (o.name === 'block') {
      new Ded(this.pos)
      smoke(this.pos.add(vec2(rand(-3, 3))))
      setShake(.7)
      this.destroy()
    }

    return super.collideWithObject(o)
  }

  exitBug() {
    if (this.levelComplete) return;

    this.bugs.forEach(b => {
      if (!b.moveToExit) {
        b.moveToExit = true;
        b.followTarget = null
      }
    });

    this.levelComplete = true;
    events.add(1, () => new Rainbow(this.pos));
  }

  eaten(p) {
    new Ded(p)
    this.destroy()
  }

  destroy() {
    super.destroy()
    sfx.hurt.play()
    stopMusic()
    events.add(.5, () => playMusic(dead, false))
    setGameOver?.(time)
  }

  breakChainAt(bug, { eaten = true } = {}) {
    const idx = this.bugs.indexOf(bug)
    if (idx < 0) return

    const breakPoint = bug.pos.copy()
    const released = this.bugs.splice(eaten ? idx + 1 : idx)

    released.forEach(b => b.flee(breakPoint))
    if (eaten) this.bugs.splice(idx, 1)
  }
}

import Sprite from "./sprite"
import Glimmer from "./glimmer"
import Splash from "./splash"
import Poop from "./poop.js";
import { sparks } from "../effects"
import { sfx, player } from "../state"

const DIRS = [vec2(1, 0), vec2(-1, 0), vec2(0, 1), vec2(0, -1)]

export default class Bug extends Sprite {
  constructor(pos, col) {
    super(pos, vec2(6), tile(14, 8))

    this.baseColor = this.color = col
    this.name = 'bug'

    this.speed = 0.1
    this.followTarget = null
    this.directionTimer = 0
    this.moveToExit = this.exited = this.fleeing = false

    sfx.spawn.play()
    new Glimmer(this.pos, this.color)

    this.gracePeriod = 0
    this.origSize = 6
    this.fleeTimer = this.spinSpeed = 0
  }

  flee(awayFrom) {
    this.followTarget = null
    this.moveToExit = false
    this.fleeing = true
    this.fleeTimer = 0.5

    const raw = awayFrom ? this.pos.subtract(awayFrom) : vec2(rand(-1, 1), rand(-1, 1))
    const away = raw.lengthSquared() > 1e-4 ? raw.normalize() : vec2(1, 0)
    const dir = away.add(vec2(rand(-1, 1), rand(-1, 1)).scale(0.4)).normalize()

    if (awayFrom && player) {
      this.pos = awayFrom.add(dir.scale(player.size.x / 2 + 3))
    }

    this.velocity = dir.scale(6)
    this.spinSpeed = (randInt(2) ? 1 : -1) * rand(15, 25)
  }

  changeDirection() {
    this.velocity = DIRS[randInt(4)].scale(this.speed)
    this.directionTimer = rand(3, 7)
  }

  update() {
    if (this.gracePeriod > 0) {
      this.gracePeriod -= timeDelta;
    }

    // Exited bugs are frozen at the exit point — nothing below should run for them
    if (this.exited) {
      super.update()
      return
    }

    if (this.moveToExit && player?.exit) {
      // Near enough to enter exit
      if (this.pos.distance(player.exit.pos) < 0.9) {
        this.pos = player.exit.pos.copy();
        this.velocity = vec2();
        this.exited = true;
        player.exitBug(); // Re-check if all bugs are inside
        sparks(this.pos, 12, this.color);
      } else {
        // Move directly to the exit point
        const dir = player.exit.pos.subtract(this.pos);
        this.velocity = dir.normalize(7);
      }
    } else if (this.fleeing) {
      this.fleeTimer -= timeDelta
      this.angle += this.spinSpeed * timeDelta
      this.clampToScreen()
      if (this.fleeTimer <= 0) {
        this.fleeing = false
        this.angle = this.spinSpeed = 0
        this.changeDirection()
      }
    } else if (this.followTarget && player) {
      const glow = (Math.sin(time * 4) + 1) / 2
      this.color = this.baseColor.lerp(this.baseColor.add(new Color(0.2, 0.2, 0.2, 0)), glow)

      const bugIndex = player.bugs.indexOf(this) + 1
      const historyIndex = bugIndex * player.spacing

      if (player.pathHistory[historyIndex]) {
        const targetPos = player.pathHistory[historyIndex]
        const dx = targetPos.x - this.pos.x
        if (Math.abs(dx) > 0.02) this.mirror = dx < 0
        this.pos = this.pos.lerp(targetPos, 15 * timeDelta)
        this.velocity = vec2(0)
      }
    } else {
      this.color = this.baseColor
    }

    // Mirror logic (non-following bugs face their movement direction)
    if (Math.abs(this.velocity.x) > 0.02) {
      this.mirror = this.velocity.x < 0
    }

    super.update()

    // Size wobble
    const base = this.origSize
    const s = Math.sin(time * (this.followTarget ? 6 : 9)) * (this.followTarget ? 0.3 : 0.5)
    this.size = vec2(base - s, base + s)

    if (this.followTarget || this.fleeing) return

    this.directionTimer -= timeDelta
    if (this.directionTimer <= 0) return this.changeDirection()

    // Screen bounds
    if (this.pos.x <= -this.screenX || this.pos.x >= this.screenX) {
      this.pos.x = clamp(this.pos.x, -this.screenX, this.screenX)
      this.changeDirection()
      return
    }

    if (this.pos.y <= -this.screenY || this.pos.y >= this.screenY) {
      this.pos.y = clamp(this.pos.y, -this.screenY, this.screenY)
      this.changeDirection()
    }
  }

  render() {
    if (this.exited) return
    super.render()
    if (this.velocity.y > 0.01 && !(this.followTarget && this.velocity.lengthSquared() < 1e-4)) return

    const p = this.pos.copy()
    p.x += this.mirror ? -1 : 1
    const eyeSize = this.origSize / 2

    drawTile(p, vec2(eyeSize), tile(13, 8))
  }

  eaten(pos, poop = true) {
    new Splash(pos, this.color)
    if (poop) new Poop({ pos })
    this.destroy()
  }
}

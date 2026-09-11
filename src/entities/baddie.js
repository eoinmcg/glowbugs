import { sparks } from "../effects";
import { pal } from "../pal.js";
import { TILE_SIZE, events, stats, sfx, player } from '../state.js';
import Poop from "./poop.js";
import Sprite from "./sprite.js"

export default class Baddie extends Sprite {
  constructor(o) {
    super(o.pos, vec2(7), tile(10, 8));
    this.name = 'baddie';
    this.speed = .12
    this.velocity = vec2(this.speed);
    this.origSize = this.size.x
    this.eating = false
    this.target = null
    this.retryTimer = 0
    this.renderOrder = 250
  }

  moveToSprite(name = 'treat') {
    const treats = engineObjects.filter(o => o.name === name);
    return treats.length ? treats[randInt(treats.length)] : undefined;
  }

  resumeAfter(delay) {
    events.add(delay, () => {
      this.velocity = vec2(.1);
      this.eating = false
    })
  }

  update() {
    if (!player || player.exit) return;

    this.clampToScreen()
    super.update()

    if ((!this.target || this.target.destroyed) && (this.retryTimer -= timeDelta) <= 0) {
      this.target = this.moveToSprite(this.target?.destroyed ? 'bug' : 'treat');
      this.retryTimer = .25
    }

    if (this.target && !this.eating) {
      const raw = this.target.pos.subtract(this.pos)
      const direction = raw.lengthSquared() > 1e-4 ? raw.normalize() : vec2(1, 0)
      this.velocity = direction.scale(this.speed);
    }
    if (this.pos.x > this.screenX || this.pos.x < -this.screenX) {
      this.velocity.x *= -1
    }
    if (this.pos.y > this.screenY || this.pos.y < -this.screenY) {
      this.velocity.y *= -1
    }
    if (!this.eating) {
      this.tileInfo.pos.x = Math.sin(time * 15) > 0 ? 0 : TILE_SIZE;
      this.mirror = this.velocity.x < 0
      this.size = vec2(this.origSize);
    } else {
      if (rand() > .97) {
        this.mirror = !this.mirror
        sparks(this.pos, 13, this.eating, .5)
      }
      const s = Math.sin(time * 5) * .5;
      this.size = vec2(this.origSize - s, this.origSize + s)
    }
  }

  render() {

    super.render()
    if (this.eating) {
      const size = rand() > .9 ? vec2(1, 2) : vec2(2, 1)
      drawRect(this.pos.add(vec2(0, -3)), size, this.eating)
    }
  }

  collideWithObject(o) {
    if (this.eating || !player || player.exit) return;
    if (o.name === 'p1' && player.invincible > 0) return
    if (o.name === 'treat') {
      o.destroy()
      sparks(this.pos, 12, pal[14])
      new Poop({ pos: this.pos.copy() })
      sfx.fart.play();
      this.velocity = vec2(0)
      this.eating = o.color
      this.resumeAfter(.3)
      return
    }
    if (o.name === 'p1' || o.name === 'bug') {
      this.velocity = vec2(0)
      this.eating = o.name === 'p1' ? WHITE : o.color
      this.resumeAfter(2)
      sfx.bite.play()
      if (o.name === 'bug' && player.bugs.includes(o)) {
        player.breakChainAt(o)
        stats.eaten.push({ color: o.color })
      }
      this.tileInfo.pos.x = TILE_SIZE
      o.eaten(this.pos)
    }

  }
}

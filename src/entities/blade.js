import Sprite from "./sprite"
import Splash from "./splash"
import Ded from "./ded"
import { sparks } from "../effects";
import { player } from "../state"

export default class Blade extends Sprite {
  constructor(o) {
    super(o.pos, vec2(o.size || 8), tile(15, 8));
    this.name = 'blade';

    this.velocity = o.v || vec2(0)

    this.renderOrder = 250
    this.color = new Color(.6, .6, .6)

  }

  update() {
    if (!player || player.exit) return;

    if (this.pos.x > this.screenX || this.pos.x < -this.screenX) {
      this.velocity.x *= -1
    }
    if (this.pos.y > this.screenY || this.pos.y < -this.screenY) {
      this.velocity.y *= -1
    }

    if (!player.exit) {
      this.angle += this.velocity.x > 0 ? .05 : -.05
    }
    super.update()
  }

  collideWithObject(o) {

    if (o.name === 'bug' && !player.exit) {
      if (o.followTarget && player && player.invincible > 0) { return }
      o.eaten(o.pos, false)
      sparks(o.pos, 13, o.color, .5)
    }
    if (o.name === 'treat') {
      sparks(o.pos, 13, WHITE, .25)
      o.destroy()
    }
    if (o.name === 'p1') {
      if (player.invincible > 0) {
        this.velocity = vec2(0)
        return
      }
      o.destroy()
      new Splash(o.pos, RED)
      new Ded(o.pos, WHITE)
      sparks(o.pos, 13, RED, .5)
    }
  }
}


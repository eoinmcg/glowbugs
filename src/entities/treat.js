import { sfx, player } from '../state'
import { smoke } from "../effects";
import { randPos } from '../lib';
import Sprite from "./sprite"

export default class Treat extends Sprite {
  constructor(o = {}) {

    if (!o.pos) { o.pos = randPos() }

    super(o.pos, vec2(6), tile(5, 8))

    this.name = 'treat'

    this.setCollision()
    this.velocity = vec2(0)
    this.mass = 0

    this.off = vec2(.2)

    this.appear = 1
    // this.color = new Color(1, .8, .7)

    // Randomise each treat's glimmer
    this.glimmerSpeed = rand(1.5, 2.5)
    this.glimmerPhase = rand(0, Math.PI * 2)
    sfx.click.play()
  }

  update() {
    const t = time * this.glimmerSpeed + this.glimmerPhase

    const sineValue = Math.sin(t)
    const cosValue = Math.cos(t)

    if (cosValue > 0) {
      this.off = clamp(sineValue * .5, -.2, .2)
    } else {
      this.off = -1
    }

    this.appear -= (timeDelta * 2)
    super.update()
  }

  render() {
    if (this.appear > 0) {
      drawTile(this.pos, vec2(10).add(vec2(-this.appear * 6)), tile(12, 8), WHITE, time)
      smoke(this.pos.add(vec2(rand(-3, 3), rand(-3, 3))))
      return
    }

    super.render()

    if (player && player.exit) return

    if (this.off >= 0) {
      drawTile(
        this.pos.add(vec2(2)),
        vec2(3 * (this.off * 10)),
        tile(12, 8),
        new Color(1, 1, 1, this.off * 4),
        this.off
      )
    }
  }

}

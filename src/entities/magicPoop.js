import { TILE_SIZE, events } from '../state.js'
import { rainbow } from '../pal.js';
import Sprite from "./sprite"
import Bug from "./bug";

const T = 5

export default class MagicPoop extends Sprite {
  constructor(o) {
    super(o.pos, vec2(o.size.x * .5), tile(10, TILE_SIZE))
    this.name = 'magicPoop'
    this.mass = 0

    this.t = T
    events.add(this.t, () => {
      new Bug(this.pos, rainbow[~~rand(0, rainbow.length - 1)])
      this.destroy()
    })
    this.origSize = this.size.x
    this.renderOrder = 90
  }

  update() {
    this.t -= timeDelta

    const base = this.origSize + (T - this.t)
    const s = Math.sin(time * 6) * 0.5
    this.size = vec2(base - s, base + s)
  }
}

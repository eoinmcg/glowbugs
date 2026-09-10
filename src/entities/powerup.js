import { TILE_SIZE, sfx, events } from "../state";
import { sparks } from "../effects";
import Sprite from "./sprite";

export default class Power extends Sprite {

  constructor(o) {

    super(o.pos, vec2(8), tile(6, TILE_SIZE))
    this.name = 'powerup'
    sfx.powerup.play()
    this.mass = 0

    let i = 10
    while (i--) {
      events.add(i / 100, () => sparks(this.pos))
    }
    sparks(this.pos)

  }

}

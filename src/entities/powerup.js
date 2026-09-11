import { TILE_SIZE, sfx, events } from "../state";
import Sprite from "./sprite";

import { sparks } from "../effects";
import { randPos } from "../lib";

export default class Powerup extends Sprite {

  constructor() {

    super(randPos(5, 8), vec2(8), tile(6, TILE_SIZE))
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

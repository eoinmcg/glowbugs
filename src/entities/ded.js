import { TILE_SIZE } from "../state"

export default class Ded extends EngineObject {
  constructor(pos) {
    super(pos, vec2(6), tile(4, TILE_SIZE))
    this.angle = .2
  }
}


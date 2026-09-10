import { TILE_SIZE } from "../state";

export default class Glimmer extends EngineObject {

  constructor(pos, col, growTo = 15) {

    super(pos, vec2(1), tile(12, TILE_SIZE))

    this.color = col
    this.growTo = growTo

    this.renderOrder = 300

  }

  update() {
    this.size.x += .4
    this.size.y += .4

    this.angle += .01

    if (this.size.x > this.growTo) {
      this.destroy()
    }
    super.update()
  }

  render() {
    super.render()

    const startAngle = PI + time * 3, num = 7;
    for (let i = 0; i < num; i++) {
      const angle = startAngle + (PI * 2 * i) / num;
      const p = this.pos.add(vec2().setAngle(angle, this.size.x - this.growTo));
      drawTile(p, vec2(3), tile(12, 8), this.color, time)
    }
  }
}

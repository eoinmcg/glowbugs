import { sfx } from "../state";
import { rainbow } from "../pal";
import { sparks } from "../effects";

export default class Exit extends EngineObject {
  constructor(pos = vec2(0), player) {
    super(pos, vec2(8));
    this.name = 'exit'
    this.setCollision();
    this.mass = 0
    this.player = player
    sfx.open.play()

    rainbow.forEach((col) => {
      sparks(this.pos, 12, col, .5)
    })

  }

  update() {
    this.angle += 0.05;
    super.update();
  }

  render() {
    const len = rainbow.length;
    const offset = Math.floor(time * 2);

    let i = len;
    while (i--) {
      // Map the index to a fraction between 0 and 1 so circles fit within this.size
      const sizeRatio = (i + 1) / len;
      const drawSize = this.size.multiply(vec2(sizeRatio));

      // Cycle through the rainbow array using modulo arithmetic
      const colorIndex = (i + offset) % len;
      const color = rainbow[colorIndex];

      drawTile(this.pos, drawSize, tile(13, 8), color, this.angle);
    }

    if (this.player.exit) return

    const flash = Math.sin(time * 5);
    drawText('EXIT', this.pos.add(vec2(0, 7 + flash)), 5, rainbow[offset % len])
  }
}


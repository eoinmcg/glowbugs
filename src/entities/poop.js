import Sprite from "./sprite";
import { pal } from "../pal";
import { TILE_SIZE, player, exit } from "../state";

const HOP_DURATION = .2;

export default class Poop extends Sprite {
  constructor(o) {
    super(o.pos, vec2(4), tile(11, 8));
    this.name = 'poop';
    this.velocity = vec2(0);
    this.color = pal[3];
    this.mass = 0;

    this.hopTimer = rand(2, 5);
    this.hopElapsed = 0; // Acts as both timer and hopping flag (0 = idle, >0 = hopping)
    this.hopDist = 0;
    this.hopDir = vec2(0);
  }

  update() {
    if (!player || player.exit) return;

    super.update();
    const dir = player.pos.subtract(this.pos);

    // 1. Exit Mode: Follow player continuously and slowly
    // if (exit) {
    //   if (dir.lengthSquared() > 0.0001) {
    //     this.pos = this.pos.add(dir.normalize().scale(timeDelta * 6));
    //   }
    //   return;
    // }

    // 2. Hopping State Machine
    if (this.hopElapsed > 0) {
      this.hopElapsed += timeDelta;

      // Frame movement based on total hop distance over fixed duration
      const frameDist = (this.hopDist / HOP_DURATION) * timeDelta;
      this.pos = this.pos.add(this.hopDir.scale(frameDist));

      if (this.hopElapsed >= HOP_DURATION) {
        this.hopElapsed = 0; // Reset to idle
      }
    } else {
      this.hopTimer -= timeDelta;
      if (this.hopTimer <= 0) {
        this.hopTimer = rand(3, 6);

        if (dir.lengthSquared() > 0.0001) {
          this.hopDir = dir.normalize();
          this.hopDist = rand(4, 8);
          this.hopElapsed = timeDelta; // Start hopping
        }
      }
    }
  }

  render() {
    if (!player || player.exit) return;

    // Squish animation
    const squish = Math.sin(time * 9) * 0.5;
    this.size = vec2(5 - squish, 5 + squish);

    // Arc offset (only when hopping)
    const isHopping = this.hopElapsed > 0;
    const arcY = isHopping ? -Math.sin((this.hopElapsed / HOP_DURATION) * Math.PI) : 0;
    const drawPos = vec2(this.pos.x, this.pos.y + arcY);

    // Render main body at the arc position
    const realPos = this.pos;
    this.pos = drawPos;
    super.render();
    this.pos = realPos;

    if (!player || player.exit) return

    // Eye tracking position
    const eyeOffset = vec2(
      player.pos.x < this.pos.x ? -1 : 1,
      (player.pos.y < this.pos.y ? 0 : 1) - 2
    );
    const eyeBasePos = drawPos.add(eyeOffset);

    // Render eyes via loop to prevent repeated code
    [-1, 1].forEach(x => {
      drawTile(eyeBasePos.add(vec2(x, 0)), vec2(1), tile(13, TILE_SIZE), pal[13]);
    });
  }
}

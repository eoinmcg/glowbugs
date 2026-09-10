import { W, H, TILE_SIZE } from '../state'
export default class Sprite extends EngineObject {
  constructor(pos, size, tileInfo) {
    super(pos, size, tileInfo);
    this.renderOrder = 100;
    this.shadow = true;
    this.setCollision()
  }

  get screenX() { return W / TILE_SIZE / 2 - this.size.x / 2 }
  get screenY() { return H / TILE_SIZE / 2 - this.size.y / 2 }

  render() {
    if (this.shadow)
      drawTile(this.pos.add(vec2(0, -3)), vec2(this.size.x, this.size.x * .5), tile(13, 8), new Color(0, 0, 0, .3));
    super.render();
  }
  clampToScreen() {
    this.pos.x = clamp(this.pos.x, -this.screenX, this.screenX);
    this.pos.y = clamp(this.pos.y, -this.screenY, this.screenY);
  }
  offscreen(pad = 1) {
    return Math.abs(this.pos.x) > this.screenX - pad || Math.abs(this.pos.y) > this.screenY - pad;
  }
}

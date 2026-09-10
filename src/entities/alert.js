import { W, H } from '../state'
export default class Alert extends EngineObject {
  constructor(txt, col = WHITE, stroke = BLACK) {
    super(vec2(0), vec2(1))
    this.txt = txt
    this.size = 1
    this.renderOrder = 100
    this.pos.x = W * .5
    this.col = col.copy()
    this.stroke = stroke.copy()
    this.maxSize = 500
  }

  update() {
    this.size += 2;

    this.pos.y += 1;
    if (this.size > this.maxSize) this.destroy()

    const p = (this.maxSize - this.size) / this.maxSize
    if (p < 5) {
      this.col.a = p
      this.stroke.a = p
    }

  }

  render() {
    drawTextScreen(this.txt, vec2(W * .5, (H * .25) + this.pos.y), this.size, this.col, this.size * .1, this.stroke)
  }
}

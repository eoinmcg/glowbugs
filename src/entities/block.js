export default class Block extends EngineObject {

  constructor(pos, size) {
    super(pos, size)
    this.setCollision()
    this.mass = 0
    this.name = 'block'

  }

  render() {
    drawRect(this.pos, this.size, GRAY)
  }

}

export default class Splash extends EngineObject {
  constructor(pos, col) {

    super(pos, vec2(5, 3), tile(13, 8))
    this.color = col.lerp(BLACK, .4)
    this.name = 'splash'
    this.extra = []
    let i = 3
    while (i--) {
      this.extra.push([
        vec2(rand(-4, 4)), rand(1, 2)
      ])
    }
  }

  render() {
    this.extra.forEach((o) => {
      drawTile(this.pos.add(o[0]), vec2(o[1]), tile(13, 8), this.color)
    })
    super.render()
    //dead eyes
    drawTile(this.pos, vec2(2, .5), tile(13, 8), new Color(0, 0, 0, .3), PI * .3)
    drawTile(this.pos, vec2(2, .5), tile(13, 8), new Color(0, 0, 0, .3), PI * .9)
  }

}


import { rainbow, pal } from '../pal'
import { funkyText } from '../effects'
import {
  W, H, stats, events, sfx, updateScore, TILE_SIZE,
  setNextLevel, level,
} from '../state'
import { anyInput, fader } from "../lib"

const SHADE = new Color(0, 0, 0, .3)

const stagger = (n, each, after) => {
  let i
  for (i = 0; i < n; i++) events.add(i * .1, () => (sfx.score.play(), each(i)))
  after && events.add(i * .1, after)
}

const gridPos = (i, y0) => vec2(-27 + (i % 10) * 8, y0 - (i / 10 | 0) * 5)

export default class Rainbow extends EngineObject {
  constructor(pos = vec2()) {
    super(pos, vec2(1))
    this.renderOrder = 1000
    this.ready = false
    this.perfect = false
    this.grow = this.showSaved = this.showTreats = 0
    this.speed = .1
    this.text = []

    let o = engineObjects
    // for testing
    // o = []
    // for (let i = 0; i < rainbow.length * 5; i += 1) {
    //   o.push({ name: 'bug', exited: true, color: rainbow[i] })
    // }
    // stats.eaten = Array(1)
    // stats.buns = 27
    // console.log(stats.eaten)
    // endtesting
    const bugs = o.filter(o => o.name === 'bug')
    this.saved = bugs.filter(b => b.moveToExit)
    const remaining = bugs.length - this.saved.length
    // console.log({ bugs, saved: this.saved })

    events.add(1, () => {
      sfx.score.play()
      this.text.push({ label: 'Saved', rows: Math.ceil(this.saved.length / 10) })
      stagger(this.saved.length, () => (this.showSaved++, updateScore(50)))
    })

    const treatsDelay = 1.5 + this.saved.length * .1
    events.add(treatsDelay, () => {
      sfx.score.play()
      this.text.push({ label: 'Treats', rows: Math.ceil(stats.buns / 10) })
      stagger(stats.buns, () => (this.showTreats++, updateScore(10)), () => {
        this.ready = true
        if (!remaining && !stats.eaten?.length) {
          this.perfect = true
          updateScore(100)
        }
      })
    })
  }

  update() {
    this.grow > 100 ? (this.ready = true) : (this.grow += this.speed)

    const input = anyInput()
    if (this.ready && input) {
      fader(() => setNextLevel(level + 1));
    }

    super.update()
  }

  render() {
    rainbow.forEach((col, i) => {
      const r = Math.min(2 * (rainbow.length - i) * this.grow, 90 - i * 20)
      drawCircle(vec2(), r, col)
    })

    if (this.perfect) {
      funkyText('PERFECT!', vec2(W / 2, H - 80), { size: 80, wavy: true, cols: rainbow, outline: new Color(.2, .2, .2) })
    }

    // Draw UI Labels
    // let y = H * .1
    // const ROW_PX = 30 // screen-space px per icon row
    // this.text.forEach(t => {
    //   y += 90
    //   drawTextScreen(t.label, vec2(W * .2, y), 60, pal[9], 10, BLACK, 'left')
    //   y += t.rows * ROW_PX
    // })

    // Render Saved Entities
    for (let i = 0; i < this.showSaved; i++) {
      const p = gridPos(i, 30)
      drawTile(p.add(vec2(0, -3)), vec2(8, 3), tile(13, TILE_SIZE), SHADE)
      drawTile(p, vec2(6), tile(14, TILE_SIZE), this.saved[i].color)
      drawTile(p, vec2(2), tile(13, TILE_SIZE))
    }

    // Render Treats
    const savedRows = Math.ceil(this.saved.length / 10)
    for (let i = 0; i < this.showTreats; i++) {
      drawTile(gridPos(i, 20 - savedRows * 5), vec2(6), tile(5, TILE_SIZE), pal[0])
      drawTile(gridPos(i, 20 - savedRows * 5), vec2(4), tile(5, TILE_SIZE))
    }
  }
}

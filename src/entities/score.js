import { updateScore, sfx } from '../state.js'

export default class Score extends EngineObject {
  constructor(pos, score, sound = 'score') {
    super(pos.add(vec2(0, 2))); // Offsets Y during instantiation
    this.text = '+' + score;
    this.a = 1; // Alpha tracker
    updateScore(score);
    sfx[sound].play();
  }

  update() {
    this.a -= timeDelta * .5;
    this.pos.y += timeDelta * 10;
    this.a < 0 ? this.destroy() : this.color = WHITE.scale(1, this.a);
  }

  render() {
    drawText(this.text, this.pos, 4, this.color);
  }
}

import { score, W } from '../state'

export default class ScoreDisplay extends EngineObject {
  constructor() {
    super(vec2(0, 35), vec2(0));
    this.renderOrder = -100;
    this.name = 'score'
  }

  render() {
    const formattedScore = String(score).padStart(5, "0");
    const center = W / 2;
    drawTextScreen(formattedScore, vec2(center, 40), 50, WHITE, 15, BLACK);
  }
}

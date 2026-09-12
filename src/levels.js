// 0 = Baddie, 1 = Bug, 2 = Blade, 3 = Block, 4 = Poop, 5 = Treat, 6 = Powerup
export const levels = [
  {
    exit: vec2(),
    target: 1,
    walls: [],
    tutorial: true,
    spawns: [
      { type: 5, pos: vec2(50, 0) },
      { type: 5, pos: vec2(-50, 0) },
    ]
  },
  // {
  //   walls: [90, 50, 20, 3],
  //   target: 3,
  //   spawns: [
  //     { type: 4, pos: vec2(40, 40) },
  //     // { type: 4, pos: vec2(-40, 40) },
  //     // { type: 4, pos: vec2(40, -40) },
  //     { type: 4, pos: vec2(-40, -40) },
  //   ],
  // },
  {
    walls: [90, 50, 20, 3],
    target: 4,
    treats: 4,
    spawns: [
      { type: 0, pos: vec2(-20, 20) },
    ],
  },
  {
    walls: [90, 50, 20, 2],
    spawns: [
      { type: 2, pos: vec2(-50, 0) },
      { type: 0, pos: vec2(20, 20) },
    ],
  },
  {
    walls: [90, 50, 20, 2],
    treats: 5,
    spawns: [
      // { type: 2, pos: vec2(-50, 0), size: 6, v: vec2(.1, .1) },
      { type: 2, pos: vec2(-60, 0) },
      { type: 2, pos: vec2(60, 0) },
      { type: 0, pos: vec2(20, 20) },
    ],
  },
  {
    walls: [90, 50, 20, 3],
    treats: 5,
    spawns: [
      { type: 2, pos: vec2(-50, 0), size: 6, v: vec2(.1, .1) },
      { type: 2, pos: vec2(50, 0), size: 6, v: vec2(-.1, -.1) },
    ],
  },
  {
    walls: [90, 50, 20],
    spawns: [
      { type: 0, pos: vec2(-20, -20) },
      { type: 2, pos: vec2(-50, 0), v: vec2(0, .2) },
      { type: 2, pos: vec2(50, 0), v: vec2(0, -.2) },
    ],
  },
  {
    walls: [90, 50, 20, 1],
    treats: 5,
    spawns: [
      { type: 0, pos: vec2(-20, -20) },
      // { type: 0, pos: vec2(-0, -20) },
      { type: 2, pos: vec2(-50, 0), v: vec2(0, .2) },
      { type: 2, pos: vec2(-50, 0), size: 6, v: vec2(.1, .1) },
      { type: 2, pos: vec2(50, 0), size: 6, v: vec2(-.1, -.1) },
      { type: 2, pos: vec2(50, 0), v: vec2(0, -.2) },
    ],
  },
];

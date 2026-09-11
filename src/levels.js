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
  {
    // target: 5,
    walls: [90, 50, 20, 3],
    treats: 4,
    spawns: [
      { type: 0, pos: vec2(-20, 20) },
    ],
  },
  {
    // target: 5,
    walls: [90, 50, 20, 2],
    spawns: [
      { type: 2, pos: vec2(-50, 0) },
      { type: 0, pos: vec2(20, 20) },
    ],
  },
  {
    // target: 5,
    walls: [90, 50, 20, 2],
    treats: 5,
    spawns: [
      { type: 2, pos: vec2(-50, 0) },
      { type: 2, pos: vec2(50, 0) },
      { type: 0, pos: vec2(20, 20) },
    ],
  },
  {
    // target: 5,
    // treat: { freq: .991, },
    walls: [90, 50, 20],
    spawns: [
      { type: 0, pos: vec2(-20, -20) },
      { type: 2, pos: vec2(-50, 0), v: vec2(0, .2) },
      { type: 2, pos: vec2(50, 0), v: vec2(0, -.2) },
    ],
  },
  {
    // target: 5,
    // treat: { freq: .991, },
    walls: [90, 50, 20, 1],
    treats: 5,
    spawns: [
      { type: 0, pos: vec2(-20, -20) },
      { type: 0, pos: vec2(-0, -20) },
      { type: 2, pos: vec2(-50, 0), v: vec2(0, .2) },
      { type: 2, pos: vec2(50, 0), v: vec2(0, -.2) },
    ],
  },
];

// const tutorial = {
//   exit: vec2(),
//   bg: 1,
//   target: 1,
//   treat: { freq: .991 },
//   walls: [],
//   spawns: [
//     { type: 5, pos: vec2(50, 0) },
//     { type: 5, pos: vec2(-50, 0) },
//   ]
// }
//
// const rndPos = (pad = 15) => vec2(rand(-50 + pad, 50 - pad), rand(-30 + pad, 30 - pad))
//
// const genLevel = n => {
//   const baddies = Math.min(1 + (n / 2 | 0), 6)
//   const blades = Math.min(n / 3 | 0, 4)
//   const blocks = Math.max(0, Math.min((n - 3) / 2 | 0, 5))
//
//   const spawns = []
//   for (let i = 0; i < baddies; i++) spawns.push({ type: 0, pos: rndPos() })
//   for (let i = 0; i < blades; i++) spawns.push({ type: 2, pos: rndPos(), v: vec2(rand(-.2, .2), rand(-.2, .2)) })
//   for (let i = 0; i < blocks; i++) spawns.push({ type: 3, pos: rndPos() })
//
//   return {
//     exit: vec2(),
//     bg: (n % 3) + 1,
//     target: Math.min(3 + n, 15),
//     treat: { freq: Math.min(.995, .991 + n * .0007) },
//     walls: [],
//     spawns
//   }
// }
//
// const LEVEL_COUNT = 15
// export const levels = [tutorial, ...Array.from({ length: LEVEL_COUNT }, (_, i) => genLevel(i + 1))]

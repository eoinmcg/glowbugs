
const instruments = [
  // Instruments: Lead synth, Arp synth, Noise Percussion
  [.5, 0, 523, , .04, .15, 1, 1.5, , , , , , .02, , .01, .1],   // 0: Pulse Lead
  [.3, 0, 1046, , .02, .08, 1, 1.8],                   // 1: Bright Chiptune Arp
  [, 0, 110, , , .02, 3, 2, , , 800, .02, , 4.8]             // 3: Noise Hi-hat
]

export const tune = [
  instruments,
  [
    [
      [0, 1, 12, , 16, , 19, , 16, , 12, , 16, , 19, , 16, , 12, , 16, , 19, , 16, , 12, , 16, , 19, , 16], // Melody A
      [1, 1, 24, 28, 31, 28, 24, 28, 31, 28, 24, 28, 31, 28, 24, 28, 31, 28, 24, 28, 31, 28, 24, 28, 31, 28, 24, 28, 31, 28, 24, 28, 31, 28], // C major arpeggio
      [3, 1, 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0]
    ],
    [
      [0, 1, 17, , 21, , 24, , 21, , 17, , 21, , 24, , 21, , 14, , 17, , 21, , 17, , 14, , 17, , 21, , 17], // Melody B (F maj / D min)
      [1, 1, 29, 33, 36, 33, 29, 33, 36, 33, 29, 33, 36, 33, 29, 33, 26, 29, 33, 29, 26, 29, 33, 29, 26, 29, 33, 29, 26, 29, 33, 29],
      [3, 1, 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0, , 0]
    ]
  ],
  [0, 1, 0, 1]
];

export const victory = [
  // Reused Instruments (Lead, Arp, Hat)
  instruments,
  // Patterns
  [
    // Pattern 0: Ascending Fanfare + Final Resolving Chord
    [
      // Lead Synth (Channel 0): Ascending C -> E -> G -> High C Fanfare
      [0, 1, 12, , 16, , 19, , 24, , , , 24, 24, 24, , 24],

      // Arp Synth (Channel 1): Rapid Arpeggio Triad Burst -> Sustained High End
      [1, 1, 12, 16, 19, 24, 28, 31, 36, , 28, 31, 36, , 36],

      // Hi-hat Percussion (Channel 2): Celebratory Roll into Final Hit
      [2, 1, 0, 0, 0, 0, 0, 0, 0, , 0, , 0, 0, 0]
    ]
  ],

  // Sequence (Plays once)
  [0]
];

export const dead = [
  instruments,

  [
    [
      [0, 1, 15, , 14, , 11, , 8, , , , 3],
      [1, 1, 27, 26, 23, 20, 18, 15, 12, 8, 3],
      [2, 1, 0, , 0, , , 0, , , , 0]
    ]
  ],

  // Sequence (Plays once)
  [0]
];

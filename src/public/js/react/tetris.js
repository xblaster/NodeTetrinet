export const GameEventEnum = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
  DROP: 5,
};

export const BlockType = {
  EMPTY: 0,
  GREY: 1,
  CYAN: 2,
  GREEN: 3,
  RED: 4,
  BLUE: 5,
  PURPLE: 6,
  YELLOW: 7,
  GHOST: 999,
};

export class Block {
  constructor(pattern) {
    this.pattern = pattern;
    this.rotation = 0;
    this.x = 0;
    this.y = 0;
    this.typeB = BlockType.BLUE;
  }
  clone() {
    const b = new Block(this.pattern);
    b.rotation = this.rotation;
    b.x = this.x;
    b.y = this.y;
    b.typeB = this.typeB;
    return b;
  }
  getPattern() {
    return this.pattern[this.rotation];
  }
  rotate() {
    this.rotation = (this.rotation + 1) % 4;
  }
}

export function cloneZone(zone) {
  return zone.map((row) => row.slice());
}

export function applyZoneWithVal(zone1, zone2) {
  for (let i = 0; i < zone1.length; i++) {
    if (!Array.isArray(zone2[i])) zone2[i] = [];
    for (let j = 0; j < zone1[i].length; j++) {
      if (typeof zone2[i][j] !== 'object') zone2[i][j] = { val: 0 };
      if (zone2[i][j].val !== zone1[i][j]) zone2[i][j].val = zone1[i][j];
    }
  }
}

export function createEmptyZone(rows = 24, cols = 14) {
  const zone = [];
  for (let i = 0; i < rows; i++) {
    zone[i] = [];
    for (let j = 0; j < cols; j++) {
      if (j <= 1 || j >= 12 || i >= rows - 2) zone[i][j] = BlockType.GREY;
      else zone[i][j] = BlockType.EMPTY;
    }
  }
  return zone;
}

export const blockPatterns = [
  // I block
  [
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
  ],
  // Z block
  [
    [
      [0, 1, 1, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  // S block
  [
    [
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 1],
      [0, 0, 0, 0],
    ],
  ],
  // O block
  [
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  ],
  // L block
  [
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 1, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  // J block
  [
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  // T block
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
];

export function createRandomBlock() {
  const idx = Math.floor(Math.random() * blockPatterns.length);
  const block = new Block(cloneZone(blockPatterns[idx]));
  block.x = 0;
  block.y = 5;
  block.typeB = idx + 2;
  return block;
}

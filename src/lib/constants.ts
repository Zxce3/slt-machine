export const MIN_BET = 10;
export const MAX_BET = 1000;
export const MAX_AUTO_SPINS = 100;

export const SYMBOL_WEIGHTS = {
  cat: 15,
  dog: 15,
  monkey: 12,
  bird: 12,
  "9": 10,
  "10": 10,
  j: 8,
  q: 8,
  k: 6,
  a: 4,
};

export const faces = [
  {
    id: "cat",
    imageUrl: "https://api.dicebear.com/9.x/icons/svg?seed=cat&scale=200",
  },
  {
    id: "dog",
    imageUrl: "https://api.dicebear.com/9.x/icons/svg?seed=dog&scale=200",
  },
  {
    id: "monkey",
    imageUrl: "https://api.dicebear.com/9.x/icons/svg?seed=monkey&scale=200",
  },
  {
    id: "bird",
    imageUrl: "https://api.dicebear.com/9.x/icons/svg?seed=bird&scale=200",
  },
  {
    id: "9",
    imageUrl: "https://api.dicebear.com/9.x/icons/svg?seed=9&scale=200",
  },
  {
    id: "10",
    imageUrl: "https://api.dicebear.com/9.x/icons/svg?seed=10&scale=200",
  },
  {
    id: "j",
    imageUrl: "https://api.dicebear.com/9.x/icons/svg?seed=j&scale=200",
  },
  {
    id: "q",
    imageUrl: "https://api.dicebear.com/9.x/icons/svg?seed=q&scale=200",
  },
  {
    id: "k",
    imageUrl: "https://api.dicebear.com/9.x/icons/svg?seed=k&scale=200",
  },
  {
    id: "a",
    imageUrl: "https://api.dicebear.com/9.x/icons/svg?seed=a&scale=200",
  },
];

export const paylines = [
  [0, 3, 6, 9, 12], // Top row
  [1, 4, 7, 10, 13], // Middle row
  [2, 5, 8, 11, 14], // Bottom row
  [0, 4, 8, 10, 12], // Diagonal from top left
  [2, 4, 6, 10, 14], // Diagonal from bottom left
];

export const payouts = {
  3: 1, // Three matching symbols pays 1x bet
  4: 5, // Four matching symbols pays 5x bet
  5: 25, // Five matching symbols pays 25x bet
  6: 50, // Six matching symbols pays 50x bet
  7: 100, // Seven matching symbols pays 100x bet
  8: 200, // Eight matching symbols pays 200x bet
  9: 500, // Nine matching symbols pays 500x bet
  10: 1000, // Ten matching symbols pays 1000x bet
};

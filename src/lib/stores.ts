import { writable } from "svelte/store";
import { getRandomSymbol } from "./functions";

const reels = 5; // Define the number of reels
const slots = 3; // Define the number of slots

export const board = writable(
  Array(reels * slots)
    .fill("")
    .map(() => getRandomSymbol()),
);
export const totalWin = writable(0);
export const matchedPaylines = writable([]);
export const spins = writable(0);
export const autoSpinCount = writable(0);
export const autoSpinning = writable(false);
export const money = writable(1000);
export const lastWinAmount = writable(0);

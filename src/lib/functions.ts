import { get } from "svelte/store";
import { faces, SYMBOL_WEIGHTS, payouts, paylines, MAX_AUTO_SPINS, MAX_BET, MIN_BET } from "./constants";
import { board, totalWin, matchedPaylines, spins, autoSpinCount, autoSpinning, money, lastWinAmount, bet } from "./stores";

export function getRandomSymbol() {
  let totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  let weightSum = 0;

  for (let face of faces) {
    weightSum += SYMBOL_WEIGHTS[face.id];
    if (random <= weightSum) {
      return face;
    }
  }
  return faces[0];
}

export function adjustBet(amount) {
  const bet = Math.max(MIN_BET, Math.min(MAX_BET, bet + amount));
}

export function spin() {
  if (get(money) < bet) {
    alert("Not enough money to spin!");
    stopAutoSpin();
    return;
  }

  lastWinAmount.set(0);
  money.update((m) => m - bet);
  board.set(
    Array(reels * slots)
      .fill("")
      .map(() => getRandomSymbol()),
  );
  calculatePayout();
  spins.update((n) => n + 1);
}

export function calculatePayout() {
  const currentBoard = get(board);
  let newTotalWin = 0;
  let newMatchedPaylines = [];

  for (let line of paylines) {
    let symbols = line.map((index) => currentBoard[index].id);
    let firstSymbol = symbols[0];
    let consecutiveCount = 1;

    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] === firstSymbol) {
        consecutiveCount++;
      } else {
        break;
      }
    }

    if (consecutiveCount >= 3) {
      let payout = payouts[consecutiveCount] * bet;
      newTotalWin += payout;
      newMatchedPaylines.push({
        payline: line.slice(0, consecutiveCount),
        symbols: firstSymbol,
        count: consecutiveCount,
        payout: payout,
      });
    }
  }

  lastWinAmount.set(newTotalWin);
  totalWin.update((t) => t + newTotalWin);
  matchedPaylines.set(newMatchedPaylines);
  money.update((m) => m + newTotalWin);
}

export function autoSpin() {
  if (get(autoSpinCount) <= 0 || get(autoSpinCount) > MAX_AUTO_SPINS) {
    alert(`Please enter a valid number of auto spins (1-${MAX_AUTO_SPINS})!`);
    return;
  }

  if (get(money) < bet) {
    alert("Not enough money for auto spin!");
    return;
  }

  autoSpinning.set(true);
  let count = 0;
  let remainingSpins = get(autoSpinCount);

  autoSpinInterval = setInterval(() => {
    if (count < remainingSpins && get(money) >= bet) {
      spin();
      count++;
    } else {
      stopAutoSpin();
    }
  }, 100);
}

export function stopAutoSpin() {
  autoSpinning.set(false);
  clearInterval(autoSpinInterval);
}

export function isMatched(index) {
  return get(matchedPaylines).some((payline) =>
    payline.payline.includes(index),
  );
}

export function calculateRTP() {
  let totalProbability = 0;
  for (let symbolId in SYMBOL_WEIGHTS) {
    let symbolProb =
      SYMBOL_WEIGHTS[symbolId] /
      Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
    for (let length = 3; length <= 5; length++) {
      let winProb = Math.pow(symbolProb, length);
      let payout = payouts[length] * bet;
      totalProbability += winProb * payout;
    }
  }
  return (totalProbability * 100).toFixed(2);
}

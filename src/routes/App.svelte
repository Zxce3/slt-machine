<script lang="ts">
  import { writable, get } from "svelte/store";
  import { faces } from "$lib/constants";
  import { onMount } from "svelte";
  // Constants
  const MIN_BET = 2;
  const MAX_BET = 1000;
  const MAX_AUTO_SPINS = 100;

  // Symbol weights for better win distribution
  const SYMBOL_WEIGHTS = {
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

  let reels = 5; // lines
  let slots = 3; // rows
  let paylines = [
    [0, 3, 6, 9, 12], // Top row
    [1, 4, 7, 10, 13], // Middle row
    [2, 5, 8, 11, 14], // Bottom row
    [0, 4, 8, 10, 12], // Diagonal from top left
    [2, 4, 6, 10, 14], // Diagonal from bottom left
  ];
  let payouts = {
    3: 1, // Three matching symbols pays 1x bet
    4: 5, // Four matching symbols pays 5x bet
    5: 25, // Five matching symbols pays 25x bet
    6: 50, // Six matching symbols pays 50x bet
    7: 100, // Seven matching symbols pays 100x bet
    8: 200, // Eight matching symbols pays 200x bet
    9: 500, // Nine matching symbols pays 500x bet
    10: 1000, // Ten matching symbols pays 1000x bet
  };
  let bet = $state(100); // Initial bet amount

  // Create writable stores for state management
  let winProbability = writable(10); // New writable store for win probability
  let board = writable(
    Array(reels * slots)
      .fill("")
      .map(() => getRandomSymbol()),
  );
  let totalWin = writable(0);
  type Payline = {
    payline: number[];
    symbols: string;
    count: number;
    payout: number;
  };
  
  let matchedPaylines = writable<Payline[]>([]);
  let spins = writable(0);
  let autoSpinCount = writable(10);
  let autoSpinning = writable(false);
  let money = writable(10000);
  let autoSpinInterval: number | undefined;
  let lastWinAmount = writable(0);
  let showPopup = writable(false);
  let popupMessage = writable("");
  let balanceInput = writable(10000);
  let remainingAutoSpins = writable(0);
  let currentAutoSpinCount = 0;
  let isSpinning = writable(false);
  let currentColumn = writable(0);
  let totalSpend = writable(0); // New writable store for total spend
  let winningColumns = writable<number[]>([]); // New writable store for winning columns

  onMount(() => {
    balanceInput.set(get(money));
  });

  function getRandomSymbol() {
    if (Math.random() * 100 < get(winProbability)) {
      // Force a win by returning the same symbol
      return faces[0];
    }

    let totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let weightSum = 0;

    for (let face of faces) {
      weightSum += SYMBOL_WEIGHTS[face.id as keyof typeof SYMBOL_WEIGHTS];
      if (random <= weightSum) {
        return face;
      }
    }
    return faces[0];
  }

  function adjustBet(amount: number) {
    bet = Math.max(MIN_BET, Math.min(MAX_BET, bet + amount));
  }

  function spin() {
    if (get(money) < bet) {
      alert("Not enough money to spin!");
      stopAutoSpin();
      return;
    }

    isSpinning.set(true);
    lastWinAmount.set(0);
    money.update((m) => m - bet);
    totalSpend.update((s) => s + bet); // Update total spend
    
    // Generate new board state but don't update display immediately
    const newBoard = Array(reels * slots)
      .fill("")
      .map(() => getRandomSymbol());

    let column = 0;
    const spinDelay = 200; // Delay between columns starting to spin
    const spinDuration = 1000; // Duration of each column's spin

    const interval = setInterval(() => {
      currentColumn.set(column);
      column++;
      
      // After last column starts spinning
      if (column >= reels) {
        clearInterval(interval);
        
        // Wait for all animations to complete
        setTimeout(() => {
          // Only update the board if there is no win
          if (get(lastWinAmount) === 0) {
            board.set(newBoard);
          }
          calculatePayout();
          spins.update((n) => n + 1);
          isSpinning.set(false);
        }, spinDuration + 100); // Add small buffer after animation
      }
    }, spinDelay);
  }

  function calculatePayout() {
    const currentBoard = get(board);
    let newTotalWin = 0;
    let newMatchedPaylines = [];
    let newWinningColumns = new Set<number>(); // Use a set to avoid duplicates

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
        let payout = payouts[consecutiveCount as keyof typeof payouts] * bet;
        newTotalWin += payout;
        newMatchedPaylines.push({
          payline: line.slice(0, consecutiveCount),
          symbols: firstSymbol,
          count: consecutiveCount,
          payout: payout,
        });
        // Add the columns that triggered the win to the set
        for (let i = 0; i < consecutiveCount; i++) {
          newWinningColumns.add(line[i] % reels);
        }
      }
    }

    lastWinAmount.set(newTotalWin);
    totalWin.update((t) => t + newTotalWin);
    matchedPaylines.set(newMatchedPaylines);
    money.update((m) => m + newTotalWin);
    winningColumns.set(Array.from(newWinningColumns)); // Convert set to array
    if (newTotalWin > 0) {
      stopAutoSpin();
      showWinPopup(`You won $${newTotalWin}!`);
    }
  }

  function autoSpin() {
    if (get(autoSpinCount) <= 0 || get(autoSpinCount) > MAX_AUTO_SPINS) {
      alert(`Please enter a valid number of auto spins (1-${MAX_AUTO_SPINS})!`);
      return;
    }

    if (get(money) < bet) {
      alert("Not enough money for auto spin!");
      return;
    }

    autoSpinning.set(true);
    if (currentAutoSpinCount === 0) {
      currentAutoSpinCount = get(autoSpinCount);
    }
    remainingAutoSpins.set(currentAutoSpinCount);

    autoSpinInterval = setInterval(() => {
      if (currentAutoSpinCount > 0 && get(money) >= bet) {
        spin();
        currentAutoSpinCount--;
        remainingAutoSpins.set(currentAutoSpinCount);
      } else {
        stopAutoSpin();
      }
    }, 1100); // Adjust the interval duration to match the animation duration
  }

  function stopAutoSpin() {
    autoSpinning.set(false);
    clearInterval(autoSpinInterval);
    remainingAutoSpins.set(0);
  }

  function isMatched(index: number) {
    return get(matchedPaylines).some((payline) =>
      payline.payline.includes(index),
    );
  }

  function calculateRTP() {
    let totalProbability = 0;
    let winProb = get(winProbability) / 100;

    for (let symbolId in SYMBOL_WEIGHTS) {
      let symbolProb =
        SYMBOL_WEIGHTS[symbolId as keyof typeof SYMBOL_WEIGHTS] /
        Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
      for (let length = 3; length <= 5; length++) {
        let actualWinProb = winProb + (1 - winProb) * Math.pow(symbolProb, length);
        let payout = payouts[length as keyof typeof payouts] * bet;
        totalProbability += actualWinProb * payout;
      }
    }
    return (totalProbability * 100).toFixed(2);
  }

  function updateBalance() {
    money.set(get(balanceInput));
  }

  function showWinPopup(message: string) {
    popupMessage.set(message);
    showPopup.set(true);
  }

  function closePopup() {
    showPopup.set(false);
    // Update the board when the popup is closed
    board.set(
      Array(reels * slots)
        .fill("")
        .map(() => getRandomSymbol())
    );
    winningColumns.set([]); // Reset winning columns
    if (currentAutoSpinCount > 0) {
      autoSpin();
    }
  }
</script>

<div class="slot-machine">
  <div class="board">
    {#each Array(slots) as _, rowIndex}
      {#each Array(reels) as _, colIndex}
        <div
          class="slot-container {isMatched(rowIndex * reels + colIndex) ? 'matched' : ''}"
          class:winning-column={$winningColumns.includes(colIndex)}
        >
          <div 
            class="slot-strip"
            class:spinning={$isSpinning && $currentColumn === colIndex}
          >
            <!-- Previous symbol (for continuous effect) -->
            <div class="symbol">
              <img
                src={$board[rowIndex * reels + colIndex].imageUrl}
                alt="Symbol"
              />
            </div>
            <!-- Current symbol -->
            <div class="symbol">
              <img
                src={$board[rowIndex * reels + colIndex].imageUrl}
                alt="Symbol"
              />
            </div>
            <!-- Next symbol (for continuous effect) -->
            <div class="symbol">
              <img
                src={$board[rowIndex * reels + colIndex].imageUrl}
                alt="Symbol"
              />
            </div>
          </div>
        </div>
      {/each}
    {/each}
  </div>

  <div class="bet-controls">
    <button onclick={() => adjustBet(-10)} disabled={$isSpinning}>-</button>
    <span>Bet: ${bet}</span>
    <button onclick={() => adjustBet(10)} disabled={$isSpinning}>+</button>
    <input
      type="number"
      bind:value={$balanceInput}
      min="0"
      placeholder="Set Balance"
      disabled={$isSpinning}
    />
    <button onclick={updateBalance} disabled={$isSpinning}>Update Balance</button>
  </div>

  <div class="controls">
    <button
      class="spin-btn"
      onclick={spin}
      disabled={$autoSpinning || $money < bet || $isSpinning}
    >
      Spin (${bet})
    </button>
    <input
      type="number"
      bind:value={$autoSpinCount}
      min="1"
      max={MAX_AUTO_SPINS}
      placeholder="Auto Spins"
      disabled={$isSpinning}
    />
    <button
      class="auto-spin-btn"
      onclick={autoSpin}
      disabled={$autoSpinning || $money < bet || $isSpinning}
    >
      Auto Spin
    </button>
    <button
      class="stop-auto-spin-btn"
      onclick={stopAutoSpin}
      disabled={!$autoSpinning}
    >
      Stop Auto Spin
    </button>
  </div>
<span>
  <input
      type="number"
      bind:value={$winProbability}
      min="0"
      max="100"
      placeholder="Win Probability"
      disabled={$isSpinning}
    />
    % Win Probability
</span>
  <div class="stats">
    <h2>Balance: ${$money}</h2>
    <h3 class:win-animation={$lastWinAmount > 0}>
      Last Win: ${$lastWinAmount}
    </h3>
    <div>Total Won: ${$totalWin}</div>
    <div>Total Spend: ${$totalSpend}</div> <!-- Display total spend -->
    <div>Spins: {$spins}</div>
    <div>RTP: {calculateRTP()}%</div>
    {#if $autoSpinning}
      <div>Auto Spins Left: {$remainingAutoSpins}</div>
    {/if}
  </div>
</div>

{#if $showPopup}
  <div class="popup">
    <div class="popup-content">
      <p>{$popupMessage}</p>
      <button onclick={closePopup}>Close</button>
    </div>
  </div>
{/if}

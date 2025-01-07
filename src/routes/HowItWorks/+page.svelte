<script>
  export let winProbability = 0;

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
</script>

<main>
  <h1>How It Works</h1>
  <section>
    <h2>Overview</h2>
    <p>
      This slot machine game consists of 5 reels and 3 rows. The goal is to match symbols across paylines to win prizes.
    </p>
  </section>

  <section>
    <h2>Winning Conditions</h2>
    <p>
      To win, you need to match at least 3 symbols in a row on any of the paylines. The paylines are as follows:
    </p>
    <ul>
      <li>Top row: [0, 3, 6, 9, 12]</li>
      <li>Middle row: [1, 4, 7, 10, 13]</li>
      <li>Bottom row: [2, 5, 8, 11, 14]</li>
      <li>Diagonal from top left: [0, 4, 8, 10, 12]</li>
      <li>Diagonal from bottom left: [2, 4, 6, 10, 14]</li>
    </ul>
    <div class="example-images">
      {#each faces.slice(0, 3) as face}
        <img src={face.imageUrl} alt={face.id} />
      {/each}
    </div>
  </section>

  <section>
    <h2>Payouts</h2>
    <p>
      The payouts for matching symbols are as follows:
    </p>
    <ul>
      <li>3 matching symbols: 1x bet</li>
      <li>4 matching symbols: 5x bet</li>
      <li>5 matching symbols: 25x bet</li>
      <li>6 matching symbols: 50x bet</li>
      <li>7 matching symbols: 100x bet</li>
      <li>8 matching symbols: 200x bet</li>
      <li>9 matching symbols: 500x bet</li>
      <li>10 matching symbols: 1000x bet</li>
    </ul>
  </section>

  <section>
    <h2>Win Probability</h2>
    <p>
      You can adjust the probability of winning by setting the win probability. The current win probability is {winProbability}%.
    </p>
  </section>

  <section>
    <h2>How to Play</h2>
    <ol>
      <li>Set your bet amount using the "+" and "-" buttons.</li>
      <li>Click the "Spin" button to start the game.</li>
      <li>If you win, a popup will appear showing your winnings.</li>
      <li>You can also set the number of auto spins and the win probability.</li>
    </ol>
  </section>

  <section>
    <h2>Responsible Gambling</h2>
    <p>
      Gambling should be a fun and entertaining activity. However, it's important to gamble responsibly and be aware of the risks involved. Here are some tips to help you gamble responsibly:
    </p>
    <ul>
      <li>Set a budget and stick to it. Only gamble with money you can afford to lose.</li>
      <li>Set time limits for your gambling sessions.</li>
      <li>Never chase your losses. Accept them as part of the game.</li>
      <li>Take regular breaks to avoid becoming too absorbed in the game.</li>
      <li>Don't gamble when you're feeling stressed, depressed, or under the influence of alcohol or drugs.</li>
    </ul>
    <p>
      If you feel that you or someone you know may have a gambling problem, there are resources available to help:
    </p>
    <ul>
      <li><a href="https://www.gamblersanonymous.org" target="_blank">Gamblers Anonymous</a></li>
      <li><a href="https://www.ncpgambling.org" target="_blank">National Council on Problem Gambling</a></li>
      <li><a href="https://www.begambleaware.org" target="_blank">BeGambleAware</a></li>
    </ul>
  </section>
</main>

<style>
  main {
    padding: 20px;
    font-family: Arial, sans-serif;
    color: wheat;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  section {
    margin-bottom: 20px;
  }

  ul, ol {
    margin-left: 20px;
  }

  .example-images {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .example-images img {
    width: 50px;
    height: 50px;
  }
</style>

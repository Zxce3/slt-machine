<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/HowItWorks">How It Works</a></li>
  </ul>
</nav>

<slot />

<style>
  nav {
    background: linear-gradient(45deg, #333, #555);
    padding: 15px;
    border-bottom: 2px solid #ffcc00;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 20px;
  }

  li {
    display: inline;
  }

  a {
    color: #ffcc00;
    text-decoration: none;
    font-family: 'Press Start 2P', cursive;
    font-size: 1.2em;
  }

  a:hover {
    text-decoration: underline;
    color: #ffffff;
  }
</style>

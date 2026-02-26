import './style.css'
import { startGame } from './mario'

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="shell">
    <div class="topbar">
      <div>
        <div class="brand">Mario (prototype)</div>
        <div class="muted">4 levels • swap sprites later • music + SFX are placeholder tones</div>
      </div>
      <div class="muted">Arrow/WASD move • Space jump • M toggle music</div>
    </div>
    <div class="main">
      <div class="card">
        <div class="canvasWrap"><div id="game"></div></div>
        <div class="hint">
          <div class="muted">Goal: reach the flag. Coins increase score. Falling resets the level.</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button id="btnStart" class="primary">Start</button>
            <button id="btnRestart">Restart Level</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`

startGame({
  mountId: 'game',
  startButton: document.querySelector('#btnStart'),
  restartButton: document.querySelector('#btnRestart'),
})

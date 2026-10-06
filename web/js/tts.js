// Read-aloud with the device's own speech engine (Web Speech API). Synthetic voice, labelled as such.
// Privacy: by default only on-device voices are used; "online" voices (which send text to a provider)
// must be switched on in Settings. Blocks marked [data-read] are spoken in order and highlighted.
import * as store from './store.js';

export const speechSupported = () => 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

// Make symbols speakable (mirrors tools/build_audio.py).
export function speakable(text) {
  return String(text)
    .replace(/US\$\s?([\d,.]+)\s?(tn|trillion|bn|billion|m|million)?/g, (_, n, u) => `${n} ${u ? ({ tn: 'trillion', bn: 'billion', m: 'million' }[u] || u) + ' ' : ''}US dollars`)
    .replace(/\bR\s?(\d[\d,.]*)\s?(billion|million|bn|m)?\b/g, (_, n, u) => `${n} ${u ? ({ bn: 'billion', m: 'million' }[u] || u) + ' ' : ''}rand`)
    .replace(/(\d)\s?bp\b/g, '$1 basis points')
    .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/≈/g, ' approximately ')
    .replace(/→/g, ', then ').replace(/≥/g, ' at least ').replace(/≤/g, ' at most ').replace(/±/g, ' plus or minus ')
    .replace(/\^/g, ' to the power ').replace(/√/g, ' square root of ').replace(/Σ/g, ' sum of ')
    .replace(/\be\.g\./g, 'for example').replace(/\bi\.e\./g, 'that is').replace(/\bvs\b/g, 'versus')
    .replace(/\[(S|R|D)(\d+)\]/g, '').replace(/\s+/g, ' ').trim();
}

export async function voices() {
  if (!speechSupported()) return [];
  let v = speechSynthesis.getVoices();
  if (!v.length) {
    await new Promise((r) => { speechSynthesis.addEventListener('voiceschanged', r, { once: true }); setTimeout(r, 1200); });
    v = speechSynthesis.getVoices();
  }
  return v;
}
export async function pickVoice() {
  const s = await store.settings();
  const all = await voices();
  const allowed = all.filter((v) => v.localService || s.allowOnlineVoices);
  return allowed.find((v) => v.voiceURI === s.voice) || allowed.find((v) => /^en(-|_)?(GB|ZA|NG|KE|IN|US)?/i.test(v.lang) && v.default) || allowed.find((v) => /^en/i.test(v.lang)) || allowed[0] || null;
}

export class Narrator {
  constructor(root, { onState } = {}) {
    this.root = root;
    this.onState = onState || (() => {});
    this.i = 0;
    this.state = 'idle';
    this.blocks = [];
  }
  collect() {
    this.blocks = [...this.root.querySelectorAll('[data-read]')].filter((el) => el.offsetParent !== null || el.closest('.mode-on'));
    return this.blocks;
  }
  async play(from = this.i) {
    if (!speechSupported()) return;
    this.collect();
    if (!this.blocks.length) return;
    this.voice = await pickVoice();
    if (!this.voice) { this.onState('novoice'); return; }
    speechSynthesis.cancel();
    this.i = Math.min(from, this.blocks.length - 1);
    this.state = 'playing';
    this.speakCurrent();
  }
  async speakCurrent() {
    const el = this.blocks[this.i];
    if (!el) { this.stop(); return; }
    this.blocks.forEach((b) => b.classList.remove('speaking'));
    el.classList.add('speaking');
    el.scrollIntoView({ block: 'center', behavior: document.documentElement.dataset.motion === 'reduce' ? 'auto' : 'smooth' });
    const s = await store.settings();
    const u = new SpeechSynthesisUtterance(speakable(el.dataset.read || el.innerText));
    u.voice = this.voice;
    u.lang = this.voice.lang;
    u.rate = s.rate || 1;
    u.onend = () => {
      if (this.state !== 'playing') return;
      this.i++;
      if (this.i >= this.blocks.length) this.stop(true); else this.speakCurrent();
    };
    u.onerror = () => { if (this.state === 'playing') { this.i++; this.speakCurrent(); } };
    speechSynthesis.speak(u);
    this.onState('playing', el, this.i, this.blocks.length);
  }
  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    speechSynthesis.cancel(); // pause() is unreliable on Android; resume restarts the current block
    this.onState('paused', this.blocks[this.i], this.i, this.blocks.length);
  }
  resume() { if (this.state === 'paused') this.play(this.i); }
  next() { this.play(Math.min(this.i + 1, this.blocks.length - 1)); }
  prev() { this.play(Math.max(this.i - 1, 0)); }
  stop(finished = false) {
    this.state = 'idle';
    speechSynthesis.cancel();
    this.blocks.forEach((b) => b.classList.remove('speaking'));
    if (finished) this.i = 0;
    this.onState(finished ? 'finished' : 'stopped');
  }
}
addEventListener('hashchange', () => { if (speechSupported()) speechSynthesis.cancel(); });

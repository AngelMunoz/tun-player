import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PlayerService } from '../services/player.service';
import type { FileWithHandle } from '../types';

@customElement('tun-player')
export class TunPlayer extends LitElement {
  private _player: PlayerService = new PlayerService();

  @state()
  private _song?: FileWithHandle;

  @state()
  private _songDuration = 0;

  @state()
  private _position = 0;

  @state()
  private isPlaying = false;

  public setSong(song?: FileWithHandle) {
    this._song = song;
    this.requestUpdate()
  }

  public async play(): Promise<boolean> {
    if (!this.song) return false;
    try {
      await this._player.play(this.song);
      return true;
    } catch (error) {
      console.warn(`tun-player [play]: ${error.mesage}`)
      return false;
    }
  }

  public pause() {
    if (!this.song) return;
    try {
      this._player.pause();
      return true;
    } catch (error) {
      console.warn(`tun-player [pause]: ${error.mesage}`)
      return false;
    }
  }

  public stop() {
    try {
      this._player.stop();
      this.setSong();
      return true;
    } catch (error) {
      console.warn(`tun-player [stop]: ${error.mesage}`)
      return false
    }
  }

  public seek(pos: number) {
    try {
      this._player.seek(pos);
      return true;
    } catch (error) {
      console.warn(`tun-player [seek]: ${error.mesage}`)
      return false;
    }
  }

  public requestPrevious() {
    const evt = new Event('on-request-previous', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    this.dispatchEvent(evt);
  }

  public requestNext() {
    const evt = new Event('on-request-next', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    this.dispatchEvent(evt);
  }

  get song(): FileWithHandle | undefined {
    return this._song;
  }

  private _onPlay = (event: Event) => {
    this.isPlaying = true;
    this.requestUpdate();
  }
  private _onPause = (event: Event) => {
    this.isPlaying = false;
    this.requestUpdate();
  }
  private _onEnded = (event: Event) => {
    this.isPlaying = false;
    this.requestUpdate();
  }

  private _onDurationChange = (event: Event) => {
    const target = (event.target as HTMLAudioElement)
    this._songDuration = target.duration;
    this.requestUpdate()
  }

  private _onTimeUpdate = (event: Event) => {
    const target = (event.target as HTMLAudioElement);
    this._position = target.currentTime;
    this.requestUpdate()
  }

  render() {
    return html`
    <nav>
      <section class="media-buttons">
        <button @click="${this.requestPrevious}">Previous</button>
        ${this.isPlaying ? html`<button @click="${() => { this.pause() }}">Pause</button>` : html`<button @click="${() => { this.play() }}">Play</button>`}
        <button @click="${this.requestNext}">Next</button>
      </section>
      <input type="range" min="0" .max="${this._songDuration.toString()}" .value=${this._position.toString()} @change="${(e: Event) => this.seek(Number((e.target as HTMLInputElement).value))}" />
      <section>${this.song?.name}</section>
    </nav>
    `;
  }
  static get styles() {
    return css`
        nav {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
        }
        meter {
          flex: 1 0;
        }
        section {
          flex: 0 1;
        }
        .media-buttons {
          display: flex;
          justify-content: space-evenly
        }
      `

  }

  connectedCallback() {
    super.connectedCallback();
    this._player.player.addEventListener('play', this._onPlay)
    this._player.player.addEventListener('pause', this._onPause)
    this._player.player.addEventListener('ended', this._onEnded)
    this._player.player.addEventListener('durationchange', this._onDurationChange)
    this._player.player.addEventListener('timeupdate', this._onTimeUpdate)
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._player.player.removeEventListener('play', this._onPlay)
    this._player.player.removeEventListener('pause', this._onPause)
    this._player.player.removeEventListener('ended', this._onPlay)
    this._player.player.removeEventListener('durationchange', this._onDurationChange)
    this._player.player.removeEventListener('timeupdate', this._onTimeUpdate)
  }
}

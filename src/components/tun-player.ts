import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PlayerService } from '../services/player.service';
import type { FileWithHandle, SongRequest } from '../types';
import PubSub from '../services/pub-sub.service';
import type { Subscription } from 'rxjs';
import { PubSubEvents } from '../enums';

@customElement('tun-player')
export class TunPlayer extends LitElement {
  private _player: PlayerService = new PlayerService();
  private $pb = PubSub;

  private subs: Subscription[] = [];

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
  }

  public async play(): Promise<boolean> {
    if (!this.song) return false;
    try {
      await this._player.play(this.song);
      return true;
    } catch (error) {
      console.warn(`tun-player [play]: ${error.message}`)
      return false;
    }
  }

  public pause() {
    if (!this.song) return;
    try {
      this._player.pause();
      return true;
    } catch (error) {
      console.warn(`tun-player [pause]: ${error.message}`)
      return false;
    }
  }

  public stop() {
    try {
      this._player.stop();
      this.setSong();
      return true;
    } catch (error) {
      console.warn(`tun-player [stop]: ${error.message}`)
      return false
    }
  }

  public seek(pos: number) {
    try {
      this._player.seek(pos);
      return true;
    } catch (error) {
      console.warn(`tun-player [seek]: ${error.message}`)
      return false;
    }
  }

  public requestPrevious() {
    this.$pb.publish<SongRequest>(PubSubEvents.RequestSong, 'Previous')
  }

  public requestNext() {
    this.$pb.publish<SongRequest>(PubSubEvents.RequestSong, 'Next')
  }

  get song(): FileWithHandle | undefined {
    return this._song;
  }

  private _playFromSub = async (song: FileWithHandle) => {
    this._song = song;
    await this.play();
  }

  private _onPlay = (event: Event) => {
    this.isPlaying = true;
  }
  private _onPause = (event: Event) => {
    this.isPlaying = false;
  }
  private _onEnded = (event: Event) => {
    this.isPlaying = false;
  }

  private _onDurationChange = (event: Event) => {
    const target = (event.target as HTMLAudioElement)
    this._songDuration = target.duration;
  }

  private _onTimeUpdate = (event: Event) => {
    const target = (event.target as HTMLAudioElement);
    this._position = target.currentTime;
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
    this.subs.push(this.$pb.subscribe<FileWithHandle>(PubSubEvents.PlaySong, this._playFromSub));
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
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }
}

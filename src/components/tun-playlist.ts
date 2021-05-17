import { html, css, LitElement } from 'lit';
import { customElement, eventOptions, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat'
import { classMap } from 'lit/directives/class-map'
import type { Subscription } from 'rxjs';
import { PubSubEvents } from '../enums';
import { selectFiles } from '../services/file-reader';
import PubSub from '../services/pub-sub.service';
import type { FileWithHandle, SongRequest } from '../types';

@customElement('tun-playlist')
export class TunPlaylist extends LitElement {
  private $pb = PubSub;
  private subs: Subscription[] = [];

  @state()
  private _playlist: FileWithHandle[] = [];
  @state()
  private _selected = -1;

  constructor() {
    super();
    this.subs.push(this.$pb.subscribe<SongRequest>(PubSubEvents.RequestSong, this._onRequestedFromSub));
  }

  async loadSongs() {
    try {
      this._playlist = await selectFiles();
    } catch (error) {
      console.warn(`tun-playlist [load songs]: ${error.message}`);
    }
  }

  selectAndPlay(index: number, file: FileWithHandle) {
    if (index < 0 || this._selected >= this._playlist.length || !file) return;
    this._selected = index;
    this.$pb.publish(PubSubEvents.PlaySong, file)
  }

  private _checkForEnter(event: KeyboardEvent) {
    if (!['Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      this.selectAndPlay(this._selected, this._playlist[this._selected]);
    }
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      if (this._selected >= this._playlist.length) return;
      this._selected++;
    }
    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) {
      event.preventDefault();
      if (this._selected < 0) return;
      this._selected--;
    }
  }

  private _onRequestedFromSub = (kind: SongRequest) => {
    switch (kind) {
      case 'Current':
        this.selectAndPlay(this._selected, this._playlist[this._selected]);
        break;
      case 'Previous':
        if (this._selected <= 0) return;
        this._selected--;
        this.selectAndPlay(this._selected, this._playlist[this._selected]);
        break;
      case 'Next':
        if (this._selected >= this._playlist.length) return;
        this._selected++;
        this.selectAndPlay(this._selected, this._playlist[this._selected]);
        break;
    }
  }

  render() {
    return html`
        <header>
          <p>
            Playlist
          </p>
          <menu>
            <button tabindex="0" @click="${() => this.loadSongs()}">Add Items</button>
          </menu>
        </header>
        <ul
          tabindex="1"
          @keyup="${this._checkForEnter}"
          @click="${(e: Event) => (this._selected = Number((e.target as Element).getAttribute('key')))}">
        ${repeat(this._playlist,
      (file, index) =>
        html`
            <li
                key=${index}
                @dblclick="${() => this.selectAndPlay(index, file)}"
                class="${classMap({ selected: this._selected === index })}">
                  ${file.name}
            </li>
            `)}
        </ul>
        <footer>
          Tun Player &copy; 2021
        </footer>
    `;
  }

  static get styles() {
    return css`

      :host {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 0.5em;
      }

      header {
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: column;
      }

      header p {
        flex: 0 1;
      }

      header menu {
        flex: 1 0;
        padding: 0;
      }

      ul {
        flex: 2 0;
        padding: 0
      }
      ul li {
        cursor: pointer;
      }

      ul li.selected {
        background-color: #abc123f0
      }
      footer {
        position: sticky;
        bottom: 0;
      }
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }
}

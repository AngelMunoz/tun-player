import { MobxLitElement } from '@adobe/lit-mobx';
import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat'
import type { FileWithHandle } from '../types';

@customElement('tun-playlist')
export class TunPlaylist extends MobxLitElement {

  @property({ type: Array })
  playlist: FileWithHandle[] = [];

  selectSong(file: FileWithHandle) {
    this.dispatchEvent(new CustomEvent('on-select-song', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: file
    }));
  }

  setSelected(eventOrElement: Event | HTMLLIElement, file: FileWithHandle) {
    let target: HTMLLIElement;
    if (eventOrElement instanceof Event || eventOrElement instanceof EventTarget) {
      target = ((eventOrElement as Event).target as HTMLLIElement);
    } else {
      target = eventOrElement as HTMLLIElement;
    }
    const lis = this.renderRoot.querySelectorAll('li.selected');
    for (const li of lis) {
      li.classList.remove('selected');
    }
    target.classList.add('selected');
    this.selectSong(file);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keyup', this._checkForEnter);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keyup', this._checkForEnter);
  }

  private _checkForEnter(event: KeyboardEvent) {
    if (event.key !== 'Enter') { return; }

    const el = this.renderRoot.querySelector('li.selected') as HTMLLIElement | undefined;
    if (!el) return;
    const filename = el.dataset.filename;
    if (!filename) return;
    const file = this.playlist.find(f => f.name === filename);
    if (!file) return;
    this.setSelected(el, file);
  }

  render() {
    return html`
        <ul>
        ${repeat(this.playlist,
      file =>
        html`
            <li 
                @focus="${(e: Event) => (e.target as HTMLLIElement).classList.toggle('selected')}"
                @dblclick="${(event: Event) => this.setSelected(event, file)}"
                data-filename="${file.name}">
                  ${file.name}
            </li>
            `)}
        </ul>
    `;
  }

  static get styles() {
    return css`
      li {
        cursor: pointer;
      }
      li.selected {
        background-color: #abc123f0
      }
    `;
  }
}

import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MobxLitElement } from '@adobe/lit-mobx';
import AppStore from './stores/app.store';
import type { FileWithHandle, Page } from './types';
import type { TunPlayer, TunPlaylist } from './components';

@customElement('app-root')
export class AppRoot extends MobxLitElement {

  private $store = AppStore;

  get tunPlayer(): TunPlayer | undefined {
    return this.renderRoot.querySelector('tun-player') as TunPlayer
  }

  get tunPlaylist(): TunPlaylist | undefined {
    return this.renderRoot.querySelector('tun-playlist') as TunPlaylist
  }

  selectPage(page: Page) {
    switch (page) {
      case 'Home':
        return html`<tun-home></tun-home>`;
      case 'Preferences':
        return html`<tun-settings></tun-settings>`
      default:
        return html`<header>
          <h1>Not Found</h1>
        </header>`
    }
  }

  async selectFiles() {
    await (this.$store.loadSongs() as unknown) as Promise<void>;
  }

  selectSong(e: CustomEvent<FileWithHandle>) {
    this.$store.setFile(e.detail);
    this.tunPlayer?.setSong(this.$store.currentSong)
  }

  nextRequested() {
    this.$store.nextSong();
    this.tunPlayer?.setSong(this.$store.currentSong);
    this.tunPlayer?.play();
  }

  backRequested() {
    this.$store.previousSong();
    this.tunPlayer?.setSong(this.$store.currentSong);
    this.tunPlayer?.play();
  }


  render() {
    return html`
      <article>
        <button @click="${this.selectFiles}">Load Files</button>
        <tun-playlist @on-select-song=${this.selectSong} .playlist="${this.$store.playlist}"></tun-playlist>
        <main @on-change-page="${(e: CustomEvent<Page>) => this.$store.setPage(e?.detail)}">${this.selectPage(this.$store.page)}</main>
        <tun-player @on-request-next="${this.nextRequested}" @on-request-previous="${this.backRequested}"></tun-player>
      </article>
    `;
  }
}

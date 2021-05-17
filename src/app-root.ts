import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { Page } from './types';

@customElement('app-root')
export class AppRoot extends LitElement {

  private page?: Page = 'Home';

  selectPage(page: Page) {
    switch (page) {
      case 'Home':
        return html`<tun-home></tun-home>`;
      case 'Preferences':
        return html`<tun-settings></tun-settings>`;
      default:
        return html`
        <header>
          <h1>Not Found</h1>
        </header>
        `;
    }
  }
  render() {
    return html`
      <article>
        <main @on-change-page="${(e: CustomEvent<Page>) => (this.page = e?.detail)}">${this.selectPage(this.page ?? 'Home')}</main>
        <tun-playlist></tun-playlist>
        <tun-player></tun-player>
      </article>
    `;
  }

  public static get styles() {
    return css`
      article {
        height: 100vh;
        overflow: none;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 1fr 0.1fr;
        grid-template-areas:
          'main main playlist'
          'player player playlist';
        gap: 1em;
        align-items: center;
      }

      tun-player {
        grid-area: player;
        align-self: flex-end;
        justify-self: stretch;
        height: 100%;
        border: 2px dashed gray;
      }
      tun-playlist {
        grid-area: playlist;
        height: 100%;
        border: 2px dashed gray;
      }
      main {
        grid-area: main;
        overflow-y: auto;
        height: 100%;
        border: 2px dashed gray;
      }
    `;
  }


}

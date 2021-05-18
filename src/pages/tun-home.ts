import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat';
import PubSub from '../services/pub-sub.service';
import { getExistingPlaylists } from '../services/file-reader';
import { Page } from '../styles';
import { PubSubEvents } from '../enums';
import type { Subscription } from 'rxjs';

@customElement('tun-home')
export class TunHome extends LitElement {

  private $pb = PubSub;
  private subscriptions: Subscription[] = [];

  @state()
  private _playlists: string[] = [];

  constructor() {
    super();
    this.subscriptions.push(this.$pb.subscribe(PubSubEvents.RefreshPlaylists, async () => (this._playlists = await getExistingPlaylists())));
  }

  async firstUpdated() {
    this._playlists = await getExistingPlaylists();
  }

  async loadPlaylist(name: string) {
    this.$pb.publish(PubSubEvents.LoadPlaylist, name);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  render() {
    return html`
      <article>
        <header>Playlists</header>
        <menu>
          ${repeat(this._playlists, (playlist, i) => html`<button key="${i}" @click="${() => this.loadPlaylist(playlist)}">${playlist}</button>`)}
        </menu>

      </article>
    `;
  }

  public static get styles() {
    return [Page, css`
      menu {
        padding: 0;
        display: flex;
        justify-content: space-around
      }
    `];
  }
}

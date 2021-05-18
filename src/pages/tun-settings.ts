import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Page } from '../styles';

@customElement('tun-settings')
export class TunSettings extends LitElement {


  render() {
    return html`
    <article>
      <header>
        <h1>Tun Player Settings</h1>
      </header>
    </article>
    `;
  }

  public static get styles() {
    return [Page];
  }
}

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('tun-home')
export class TunHome extends LitElement {

  render() {
    return html`
      <article>
        "Home"
      </article>
    `;
  }
}

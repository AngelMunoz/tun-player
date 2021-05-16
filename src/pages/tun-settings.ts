import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MobxLitElement } from '@adobe/lit-mobx';

@customElement('tun-settings')
export class TunSettings extends MobxLitElement {

    render() {
        return html`
      <article>
        <header></header>
        <aside></aside>
        <main></main>
        <footer></footer>
      </article>
    `;
    }
}

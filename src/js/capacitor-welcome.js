import { SplashScreen } from '@capacitor/splash-screen';
import { Camera } from '@capacitor/camera';
import { MetaMapCapacitor } from 'metamap-capacitor-plugin';

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();

      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
      }
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
      }
      .button {
        display: inline-block;
        padding: 10px;
        background-color: #73B5F6;
        color: #fff;
        font-size: 0.9em;
        border: 0;
        border-radius: 3px;
        text-decoration: none;
        cursor: pointer;
      }
      .metaMapButtonCss {
        display: block;
        width: 100%;
        padding: 14px 16px;
        margin: 12px 0;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: #fff;
        font-size: 1em;
        font-weight: 600;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      }
      .metaMapButtonCss:active {
        opacity: 0.9;
      }
      main {
        padding: 15px;
      }
      main hr { height: 1px; background-color: #eee; border: 0; }
      main h1 {
        font-size: 1.4em;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      main h2 {
        font-size: 1.1em;
      }
      main h3 {
        font-size: 0.9em;
      }
      main p {
        color: #333;
      }
      main pre {
        white-space: pre-line;
      }
    </style>
    <div>
      <capacitor-welcome-titlebar>
        <h1>Capacitor</h1>
      </capacitor-welcome-titlebar>
      <main>
        <h2>MetaMap</h2>
        <p>
          Launch the MetaMap verification flow.
        </p>
        <button class="button metaMapButtonCss" id="show-metamap-flow">🚀 Show MetaMap Flow</button>
        <p>
          Capacitor makes it easy to build powerful apps for the app stores, mobile web (Progressive Web Apps), and desktop, all
          with a single code base.
        </p>
        <h2>Getting Started</h2>
        <p>
          You'll probably need a UI framework to build a full-featured app. Might we recommend
          <a target="_blank" href="http://ionicframework.com/">Ionic</a>?
        </p>
        <p>
          Visit <a href="https://capacitorjs.com">capacitorjs.com</a> for information
          on using native features, building plugins, and more.
        </p>
        <a href="https://capacitorjs.com" target="_blank" class="button">Read more</a>
        <h2>Tiny Demo</h2>
        <p>
          This demo shows how to call Capacitor plugins. Say cheese!
        </p>
        <p>
          <button class="button" id="take-photo">Take Photo</button>
        </p>
        <p>
          <img id="image" style="max-width: 100%">
        </p>
      </main>
    </div>
    `;
    }

    connectedCallback() {
      const self = this;

      // MetaMap Flow button
      const metaMapBtn = self.shadowRoot.querySelector('#show-metamap-flow');
      if (metaMapBtn) {
        metaMapBtn.addEventListener('click', () => self.showMetaMapFlow());
      }

      // verificationCreated listener (if plugin supports it)
      if (typeof MetaMapCapacitor.addListener === 'function') {
        this._verificationCreatedListener = MetaMapCapacitor.addListener(
          'verificationCreated',
          (data) => {
            console.log('🟡 verificationCreated');
            console.log('   • identityId:', data?.identityId);
            console.log('   • verificationId:', data?.verificationId);
          }
        );
      }

      self.shadowRoot.querySelector('#take-photo').addEventListener('click', async function (e) {
        try {
          const photo = await Camera.getPhoto({
            resultType: 'uri',
          });

          const image = self.shadowRoot.querySelector('#image');
          if (!image) {
            return;
          }

          image.src = photo.webPath;
        } catch (e) {
          console.warn('User cancelled', e);
        }
      });
    }

    disconnectedCallback() {
      if (this._verificationCreatedListener?.remove) {
        this._verificationCreatedListener.remove();
      }
    }

    async showMetaMapFlow() {
      const metadataParams = { key: 'value' };
      const options = {
        clientId: '61dc2317e05524001d482f04',
        flowId: '66deaba15c2154001cd1e14a',
        metadata: metadataParams,
      };

      console.log('🚀 Launching MetaMap Flow with:');
      console.log('   • clientId:', options.clientId);
      console.log('   • flowId:', options.flowId);
      console.log('   • metadata:', options.metadata);

      try {
        const verification = await MetaMapCapacitor.showMetaMapFlow(options);
        console.log('✅ Verification Success');
        console.log('   • identityId:', verification?.identityId);
        console.log('   • verificationId:', verification?.verificationID ?? verification?.verificationId);
      } catch (error) {
        console.warn('❌ Verification Cancelled or Failed');
        console.warn('   • message:', error?.message);
        if (error?.data) {
          console.warn('   • identityId:', error.data.identityId);
          console.warn('   • verificationId:', error.data.verificationId);
          console.warn('   • status:', error.data.status);
        }
      }
    }
  },
);

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
    }
  },
);

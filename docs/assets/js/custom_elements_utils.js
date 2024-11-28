/**
 * ヘルプ
 */
class HelpDialog extends HTMLElement {

  static content = `<dialog part="aaa">
  <header>
    <h2></h2>
    <button class="close" part="icon-button">${SVG.close({ size: '26px' })}</button>
  </header>
  <section>
    <slot name="body"></slot>
  </section>
</dialog>
  `
  static style = `
    :host {
      > button {
        width: 20px;
        height: 20px;
      }
    }
    svg:hover {
      opacity: .5;
    }
    dialog {
      --dialog-width: 600px;
      width: var(--dialog-width);
      max-width: 1000px;
      padding: 0;
      border: 0;
      border-radius: 5px;
      box-shadow: 0 0 5px rgba(0, 0, 0, .5);
      > header {
        padding: .5rem .75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        h2 {
          margin: 0;
          padding: 0;
          font-size: 1.1rem;
          color: #333;
        }
      }
      > section {
        padding: .75rem;
        overscroll-behavior-y: contain;
        overflow-y: auto;
        max-height: calc(100vh - 240px);
      }
    }
    dialog::backdrop {
      background-color: rgba(0, 0, 0, .1);
    }
    @media screen and (max-width: 640px) {
      dialog {
        width: calc(100vw - 26px);
        > section {
          max-height: calc(100vh - 160px);
        }
      }
    }
  `

  constructor() {
    super()

    myUtils.prepareCustomElement(HelpDialog, this.attachShadow({mode: "open"}))

    this.render()
  }

  render() {
    this.shadowRoot.querySelector('h2').textContent = this.dataset.title
    const dialog = this.shadowRoot.querySelector('dialog')
    if (this.dataset.width) {
      dialog.style.setProperty('--dialog-width', this.dataset.width)
    }
    const close = this.shadowRoot.querySelector('.close')
    const help = document.createElement('button')
    help.setAttribute('part', 'icon-button')
    help.append(myUtils.strToDom(SVG.help()))
    this.shadowRoot.append(help)

    help.addEventListener('click', () => {
      dialog.showModal()
    })
    close.addEventListener('click', () => {
      dialog.close()
    })
    dialog.addEventListener('click', e => {
      if (e.target === dialog) {
        dialog.close();
      }
    })
  }
}

customElements.define('help-dialog', HelpDialog)
/**
 * コードブロック（Syntax Highlighter）
 */
class CodeBlock extends HTMLElement {

  static content = `
  <span class="tag"></span>
  <div class="code"></div>
  `
  static style = `
  .tag {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #444;
    border-radius: 4px 4px 0 0;
    padding: 2px .75rem;
    font-size: .75rem;
    color: #ddd;
    height: 18px;
    svg {
      cursor: pointer;
      &.active {
        visibility: hidden;
      }
      &:hover {
        opacity: .5;
      }
    }
  }
  .code {
    pre {
      padding: 1rem;
      margin: 0;
      border-radius: 0 0 4px 4px;
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 1.2;
      font-size: 13px;
    }
  }
  `

  #_root

  constructor() {
    super()

    this.#_root = myUtils.prepareCustomElement(CodeBlock, this.attachShadow({mode: "closed"}))
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render()
      this.rendered = true
    }
  }

  render() {
    const name = this.getAttribute('name') ?? ''

    const tag = this.#_root.querySelector('.tag')

    tag.innerHTML = SVG.copy()
    tag.prepend(`${this.getAttribute('type')}${name ? ' / ' : ''}${name}`)

    // コードのテキストをクリップボードにコピーする
    const icon = tag.querySelector('svg')
    icon.addEventListener('click', () => {
      icon.classList.add('active')
      const text = this.#_root.querySelector('.code').textContent

      const copied = () => {
        setTimeout(() => {
          icon.classList.remove('active')
        }, 200)
      }

      navigator.clipboard.writeText(text).then(
        copied,
        copied
      )
    })
  }

  setCode(value) {
    if (!value) return
    this.#_root.querySelector('.code').innerHTML = value
  }

  static setCodeTexts(settings, codeToHtml) {
    document.querySelectorAll('code-block').forEach(item => {
      if (item.id in settings) {
        codeToHtml(settings[item.id], { lang: item.getAttribute('type'), theme: item.getAttribute('theme') || MyConst.SHIKI.defaultTheme })
          .then(html => item.setCode(html))
      }
    })
  }
}

customElements.define('code-block', CodeBlock)

/**
 * ヘルプ
 */
class HelpDialog extends HTMLElement {

  static content = `<dialog>
  <header>
    <h2></h2>
    <button class="close" part="icon-button">${SVG.close({ size: '30px' })}</button>
  </header>
  <section>
    <slot name="body"></slot>
  </section>
</dialog>
  `
  static style = `
    :host {
      font-weight: 400;
      font-size: 1rem;
      height: 20px;
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
      animation-name: fadeOut;
      animation-fill-mode: forwards;
      animation-duration: 200ms;
      animation-timing-function: ease-out;
      &[open] {
        animation-name: fadeIn;
        animation-fill-mode: forwards;
        animation-duration: 200ms;
        animation-timing-function: ease-out;
      }
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
        .close {
          height: 30px;
          path {
            transform-origin: center;
            transform: scale(1.3);
          }
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
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-100px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateY(0);
        display: block;
      }
      to {
        opacity: 0;
        transform: translateY(-100px);
        display: none;
      }
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
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render()
      this.rendered = true
    }
  }

  noscroll(e){
    if (e.target.closest('[slot]')) {
      e.preventDefault();
    }
  }

  setNoScroll() {
    if (this.scrollable) return
    document.addEventListener('touchmove', this.noscroll, {passive: false});
    document.addEventListener('wheel', this.noscroll, {passive: false});
  }
  
  unsetNoScroll(){
    if (this.scrollable) return
    document.removeEventListener('touchmove', this.noscroll);
    document.removeEventListener('wheel', this.noscroll);
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

      // ダイアログのコンテンツがスクロールする場合は、scroll-behaviorで制御しているため、jsの制御は不要
      const contents = this.shadowRoot.querySelector('dialog section')
      this.scrollable = contents.scrollHeight > contents.clientHeight

      this.setNoScroll()
    })
    close.addEventListener('click', () => {
      dialog.close()
    })
    dialog.addEventListener('click', e => {
      if (e.target === dialog) {
        // backdropにフォーカスがあると、アニメーションがズレる
        close.focus()
        setTimeout(() => {
          dialog.close()
        })
      }
    })
    dialog.addEventListener('close', () => {
      this.unsetNoScroll()
    })
  }
}

customElements.define('help-dialog', HelpDialog)

class WebBrowser extends HTMLElement {
  static content = `
    <div class="browser">
      <div class="address-bar"></div>
      <div class="web-view">
        <slot name="body"></slot>
      </div>
    </div>
  `
  static style = `
    :host {
      --web-view-width: 700px;
      --web-view-height: 50vh;
      * {
        box-sizing: border-box;
      }
    }
    .browser {
      border-radius: 6px;
      background: #777;
      padding: 3px;
      margin-inline: auto;
      width: fit-content;
      .address-bar {
        height: 1.5rem;
        background: #333;
        color: white;
        display: flex;
        align-items: center;
        padding-inline: 1rem;
        font-size: .7rem;
        border-radius: 1rem;
        margin: 2px 4px 4px;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .web-view {
      padding: 1rem 5px;
      width: var(--web-view-width);
      flex: 1;
      border: 1px solid #ccc;
      position: relative;
      height: var(--web-view-height);
      background: white;
    }
    @media screen and (max-width: 800px) {
      .browser {
        width: unset;
      }
      .web-view {
        width: 100%;
        font-size: .8rem;
      }
    }
  `

  static observedAttributes = ['url']

  #_addressBar
  #_webView

  constructor() {
    super()

    myUtils.prepareCustomElement(WebBrowser, this.attachShadow({mode: "open"}))

    this.#_addressBar = this.shadowRoot.querySelector('.address-bar')
    this.#_webView = this.shadowRoot.querySelector('.web-view')

    const host = this.shadowRoot.styleSheets[0].rules[0]

    const [width, height] = [this.getAttribute('view-width'), this.getAttribute('view-height')]
    if (width) {
      host.style.setProperty('--web-view-width', width)
    }
    if (height) {
      host.style.setProperty('--web-view-height', height)
    }
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render()
      this.rendered = true
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'url') {
      if (this.addressBar)
        this.addressBar.textContent = newValue
    }
  }

  render() {
    this.#_addressBar.textContent = this.getAttribute('url')
  }

  get addressBar() {
    return this.#_addressBar
  }

  get webView() {
    return this.#_webView
  }
}

customElements.define('web-browser', WebBrowser)
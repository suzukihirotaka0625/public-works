
class IconButton extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render()
      this.rendered = true
    }
  }

  render() {
    this.innerHTML = SVG[this.getAttribute('icon')](this.dataset)
  }
}

customElements.define('icon-button', IconButton)

/**
 * ラジオボタン
 */
class RadioGroup extends HTMLElement {

  static content = `
  `

  static style = `
    :host {
      display: flex;
      gap: .75rem 1.5rem;
      label {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
    @media screen and (max-width: 640px) {
      :host {
        flex-direction: column;
      }
    }
  `

  #_root

  constructor() {
    super()

    this.#_root = myUtils.prepareCustomElement(RadioGroup, this.attachShadow({mode: "open"}))
  }

  /**
   * チェンジイベント
   * @param {InputE} e 
   */
  #_fireChangeEvent(e) {
    const event = new CustomEvent('changed', {
      composed: true, // false だと Shadow DOM 境界を超えた外部にイベントはバブリングしない
      detail: { value: e.target.value }
    })
    this.dispatchEvent(event)
  }

  /**
   * 
   * @params { name: 'xxx', items: [ { value: 'xxx', label: 'xxx', part: 'xxx', checked: true } ] }
   */
  render({ name, items }) {
    if (this.rendered) {
      return
    }
    this.rendered = true

    items.forEach(item => {
      const label = document.createElement('label')
      const radio = myUtils.$('input', {
        attrs: { type: 'radio', name, value: item.value, part: 'radio input' }
      })
      if (item.checked) {
        radio.checked = true
      }
      // changeイベント
      radio.addEventListener('change', this.#_fireChangeEvent)
      label.append(radio)
      label.append(myUtils.$('span', { attrs: { part: item.part }, text: item.label }))
      this.#_root.append(label)
    })
  }

  get currentValue() {
    return this.shadowRoot.querySelector('input:checked')?.value
  }
}

customElements.define('radio-group', RadioGroup)
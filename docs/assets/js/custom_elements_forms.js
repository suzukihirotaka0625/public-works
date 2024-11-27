
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

    this.#_root = myUtils.prepareCustomElement(RadioGroup, this.attachShadow({mode: "closed"}))
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
    items.forEach(item => {
      const label = document.createElement('label')
      const radio = document.createElement('input')
      radio.setAttribute('part', 'radio input')
      radio.type = 'radio'
      radio.name = name
      radio.value = item.value
      if (item.checked) {
        radio.checked = true
      }
      // changeイベント
      radio.addEventListener('change', this.#_fireChangeEvent)
      label.append(radio)
  
      const span = document.createElement('span')
      if (item.part) {
        span.setAttribute('part', item.part)
      }
      span.textContent = item.label
      label.append(span)
      this.#_root.append(label)
    })
  }
}

customElements.define('radio-group', RadioGroup)

/**
 * ラジオボタン
 */
class RadioGroup extends HTMLElement {

  /**
   * 1. templateに設定JSONを指定する
<template>
{
  "name": "format",
  "items": [
    { "value": "default", "label": "rgb(255 218 27 / 0.2)", "part": "code", "checked": true },
    { "value": "legacy", "label": "rgba(255, 218, 27, 0.2)", "part": "code" }
  ]
}
</template>
   * 2. イベントをリッスンする
   *  document.querySelector('radio-group').addEventListener('changed', e => {
   *    e.detail.value
   *  })
   */

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

  constructor() {
    super()

    const root = myUtils.prepareCustomElement(RadioGroup, this.attachShadow({mode: "closed"}))

    // 設定を取得する
    const { name, items } = JSON.parse(this.querySelector('template').content.textContent)

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
      root.append(label)
    })
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
}

customElements.define('radio-group', RadioGroup)
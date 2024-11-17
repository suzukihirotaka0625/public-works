
class MyMenu extends HTMLElement {

  static content = ``
  static style = `
  ul { 
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 32px;
    height: 24px;
    li {
      position: relative;
      display: flex;
      align-items: center;
      a {
        text-decoration: none;
        color: #229955;
        display: flex;
      }
    }
    > li:not(:first-child):before {
      content: '/';
      display: block;
      position: absolute;
      left: -20px;
      color: #999;
    }
  }
  `

  static homeSvg = (color = '#444') => `
<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z" fill="${color}"/>
</svg>
  `

  static observedAttributes = ['path'];

  #_wrapper

  constructor() {
    super()

    const { wrapper } = myUtils.prepareCustomElement(MyMenu, this.attachShadow({mode: "closed"}), { tag: 'ul' })

    this.#_wrapper = wrapper
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'path') {
      this.#_setMenu(newValue)
    }
  }

  #_setMenu(path) {
    if (!path) return

    const menus = myUtils.parseMenu(path)

    menus.forEach((menu, i) => {
      const li = document.createElement('li')
      let titleWrapper = li
      if (i < menus.length - 1) {
        const a = document.createElement('a')
        titleWrapper = a
        a.href = `${myUtils.rootPath}${menu.path}`
        li.appendChild(a)
      }
      if (i === 0) {
        titleWrapper.innerHTML = MyMenu.homeSvg(titleWrapper.tagName.toUpperCase() === 'A' ? '#229955' : undefined)
      } else {
        titleWrapper.appendChild(document.createTextNode(menu.title))
      }

      this.#_wrapper.appendChild(li)
    })
  }
}

customElements.define('my-menu', MyMenu)


class MyHeader extends HTMLElement {

  static content = `
    <div part="content">
      <h1>My Skills</h1>
      <slot name="menu">メニュー</slot>
    </div>
`
  static style = `
  header {
    padding: 1rem;
    h1 {
      margin: 0 0 .5rem 0;
      padding: 0;
      font-size: 1.6rem;
    }
  }
  `

  constructor() {
    super()

    myUtils.prepareCustomElement(MyHeader, this.attachShadow({mode: "closed"}), { tag: 'header' })
  }
}

customElements.define('my-header', MyHeader)

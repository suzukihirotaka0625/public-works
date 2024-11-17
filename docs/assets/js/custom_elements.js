
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
console.log({ menus })
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
    padding: 1rem 1rem 6px;
    background: #f1f1f1;
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

class PageList extends HTMLElement {

  static content = ``
  static style = `
  :host {
    > div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
  }
  h2, h3 {
    margin: 0;
  }
  h2 {
    font-size: 1.2rem;
  }
  a {
    text-decoration: none;
    color: #229955;
  }
  .children {
    display: grid;
    gap: .75rem;
    grid-template-columns: repeat(2, 1fr);
    > div {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: .75rem;
      h3 {
        font-size: 1.1rem;
      }
      p {
        font-size: .8rem;
        margin: 6px 0 0;
      }
    }
  }
  @media screen and (max-width: 640px) {
  .children {
    grid-template-columns: 1fr;
  }
  `

  static observedAttributes = ['path'];

  #_wrapper

  constructor() {
    super()

    const { wrapper } = myUtils.prepareCustomElement(PageList, this.attachShadow({mode: "closed"}), { tag: 'div' })

    this.#_wrapper = wrapper
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'path') {
      this.#_setPageList(newValue)
    }
  }

  #_setPageList(path) {
    if (!path) return

    const menu = myUtils.getCurrentMenu(path)

    const pageWrapper = document.createElement('div')
    pageWrapper.classList.add('this-page')
    const pageTitle = document.createElement('h2')
    pageTitle.textContent = menu.title
    pageWrapper.appendChild(pageTitle)
    if (menu.note) {
      const pageNote = document.createElement('p')
      pageNote.innerHTML = menu.note
      pageWrapper.appendChild(pageNote)
    }

    const childrenWrapper = document.createElement('div')
    childrenWrapper.classList.add('children')

    Object.values(menu.children).forEach(item => {
      const card = document.createElement('div')
      const cardTitle = document.createElement('h3')
      const link = document.createElement('a')
      link.textContent = item.title
      link.href = item.path
      cardTitle.appendChild(link)
      card.appendChild(cardTitle)

      if (item.note) {
        const cardNote = document.createElement('p')
        cardNote.innerHTML = item.note
        card.appendChild(cardNote)
      }

      childrenWrapper.appendChild(card)
    })

    this.#_wrapper.appendChild(pageWrapper)
    this.#_wrapper.appendChild(childrenWrapper)
  }
}

customElements.define('page-list', PageList)

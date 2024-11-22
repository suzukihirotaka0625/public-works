
class MyMenu extends HTMLElement {

  static content = ``
  static style = `
  ul { 
    list-style: none;
    margin: 0;
    padding: 0 10px 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 4px 32px;
    min-height: 24px;
    li {
      position: relative;
      display: flex;
      a {
        text-decoration: none;
        color: var(--link-color);
        display: flex;
      }
    }
    > li:not(:last-child):after {
      content: '/';
      display: block;
      position: absolute;
      right: -20px;
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
        titleWrapper.innerHTML = MyMenu.homeSvg(
          titleWrapper.tagName.toUpperCase() === 'A'
            ? myUtils.rootStyle.getPropertyValue('--link-color')
            : undefined
        )
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
  .children {
    display: grid;
    gap: .75rem;
    grid-template-columns: repeat(2, 1fr);
    > a {
      text-decoration: none;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: .75rem;
      transition: all .2s ease-in-out;
      &:hover {
        border-color: rgb(var(--link-color-rgb) / .8);
        background-color: rgb(var(--link-color-rgb) / .03);
      }
      > div {
        h3 {
          font-size: 1.1rem;
          color: var(--link-color);
        }
        p {
          font-size: .8rem;
          margin: 6px 0 0;
        }
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
    this.#_wrapper.appendChild(pageWrapper)

    if (menu.children) {
      const childrenWrapper = document.createElement('div')
      childrenWrapper.classList.add('children')

      Object.values(menu.children).forEach(item => {
        const card = document.createElement('div')
        const cardTitle = document.createElement('h3')
        const link = document.createElement('a')
        link.href = item.path
        cardTitle.textContent = item.title
        card.appendChild(cardTitle)
        link.appendChild(card)
        if (item.note) {
          const cardNote = document.createElement('p')
          cardNote.innerHTML = item.note
          card.appendChild(cardNote)
        }
  
        childrenWrapper.appendChild(link)
      })
      this.#_wrapper.appendChild(childrenWrapper)
    }
  }
}

customElements.define('page-list', PageList)

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
      line-height: 1.2;
    }
  }
  `

  #_wrrapper

  static copyIcon = () => `
<svg fill="#f1f1f1" width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M21,8H9A1,1,0,0,0,8,9V21a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V9A1,1,0,0,0,21,8ZM20,20H10V10H20ZM6,15a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2H15a1,1,0,0,1,1,1V5a1,1,0,0,1-2,0V4H4V14H5A1,1,0,0,1,6,15Z"/>
</svg>
`

  static observedAttributes = ['html'];

  constructor() {
    super()

    const { wrapper } = myUtils.prepareCustomElement(CodeBlock, this.attachShadow({mode: "closed"}), { tag: 'div' })

    this.#_wrrapper = wrapper

    const name = this.getAttribute('name') ?? ''

    const tag = wrapper.querySelector('.tag')

    tag.innerHTML = CodeBlock.copyIcon()
    tag.prepend(`${this.getAttribute('type')}${name ? ' / ' : ''}${name}`)

    const icon = tag.querySelector('svg')
    icon.addEventListener('click', () => {
      icon.classList.add('active')
      const text = this.#_wrrapper.querySelector('.code').textContent

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

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'html') {
      this.handleHtml(newValue)
    }
  }

  handleHtml(value) {
    if (!value) return
    this.#_wrrapper.querySelector('.code').innerHTML = value
  }
}

customElements.define('code-block', CodeBlock)

class ExternalLink extends HTMLElement {

  static content = `
  `
  static style = `
    a {
      color: var(--link-color);
      text-decoration: none;
      display: inline-flex;
      gap: 4px;
      align-items: center;
    }
  `
  static icon = (color, size) => `<svg 
  xmlns="http://www.w3.org/2000/svg"
  width="${size}"
  height="${size}"
  viewBox="0 0 24 24"
  fill="none"
  stroke="${color}"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
  <polyline points="15 3 21 3 21 9" />
  <line x1="10" y1="14" x2="21" y2="3" />
</svg>`

  constructor() {
    super()

    const { wrapper } = myUtils.prepareCustomElement(ExternalLink, this.attachShadow({mode: "closed"}), { tag: 'a' })

    wrapper.href = this.getAttribute('link')
    wrapper.target = '_blank'
    wrapper.setAttribute('rel', 'noopener noreferrer')
    wrapper.innerHTML = ExternalLink.icon(
      myUtils.rootStyle.getPropertyValue('--link-color'),
      this.getAttribute('size') || 16
    )

    wrapper.prepend(this.getAttribute('name'))
  }
}

customElements.define('external-link', ExternalLink)
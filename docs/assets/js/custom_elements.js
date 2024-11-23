/**
 * パンクズリストメニュー
 */
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
        gap: 4px;
        &:hover {
          color: rgb(var(--link-color-rgb) / .5);
          svg path {
            fill: rgb(var(--link-color-rgb) / .5);
          }
        }
      }
      .submenu {
        position: absolute;
        padding: 4px;
        top: calc(100% - 4px);
        left: calc(100% - 20px);
        font-size: .75rem;
        background-color: white;
        border: 1px solid #999;
        display: none;
        &.active {
          display: block;
        }
        li {
          width: max-content;
          min-width: 80px;
          padding: 2px 6px 2px 4px;
          &:after {
            content: '';
          }
        }
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
  button.icon {
    border: none;
    padding: 0;
    height: 20px;
    cursor: pointer;
  }
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

  /**
   * パンクズリストを設定する
   * @param {String} path 'top.works.xxx.html'
   * @returns 
   */
  #_setMenu(path) {
    if (!path) return

    const menus = myUtils.parseMenu(path)

    menus.forEach((menu, i) => {
      const li = document.createElement('li')
      let titleWrapper = li
      let isA = false
      const linkColor = myUtils.rootStyle.getPropertyValue('--link-color')
      if (i < menus.length - 1) {
        const a = document.createElement('a')
        titleWrapper = a
        a.href = `${myUtils.rootPath}${menu.path}`
        li.appendChild(a)
        isA = true
      }
      if (i === 0) {
        titleWrapper.innerHTML = SVG.home({
          color: isA ? linkColor : undefined
        })
      } else {
        titleWrapper.appendChild(document.createTextNode(menu.title))
      }

      if (isA && Object.keys(menu.children ?? {}).length > 1) {
        const submenu = this.#_createSubMenu(menu.children, menu.path, i < menus.length ? menus[i + 1].key : '' )
        const svg = myUtils.strToDom(SVG.triangleDown({ color: linkColor, size: '20px' }))
        const btn = document.createElement('button')
        btn.classList.add('icon')

        btn.appendChild(svg)
        btn.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          // 他のサブメニューが開いていたら閉じる
          if (!submenu.classList.contains('active')) {
            this.#_wrapper.querySelectorAll('.submenu').forEach(item => {
              item.classList.remove('active')
            })
          }
          submenu.classList.toggle('active')
        })

        submenu.addEventListener('mouseleave', () => {
          submenu.classList.remove('active')
        })

        titleWrapper.appendChild(btn)
        titleWrapper.appendChild(submenu)
      }

      this.#_wrapper.appendChild(li)
    })
  }

  /**
   * サブメニューを生成する
   * @param {*} children 
   * @param {String} basePath
   * @param {*} nextKey 
   * @returns 
   */
  #_createSubMenu(children, basePath, nextKey) {

    const ul = document.createElement('ul')
    ul.classList.add('submenu')
    Object.values(children).forEach(menu => {
      // 現在の階層はスキップ
      if (menu.path.split('.')[0] === nextKey) return
      const li = document.createElement('li')
      const a = document.createElement('a')
      a.href = `${myUtils.rootPath}${basePath}${basePath === '/' ? '' : '/'}${menu.path}`
      a.textContent = menu.title
      li.appendChild(a)
      ul.appendChild(li)
    })
    return ul
  }
}

customElements.define('my-menu', MyMenu)


/**
 * ヘッダー
 */
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

/**
 * ページ一覧
 * このページ説明と、子階層のページの一覧の表示
 */
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
      line-height: 1.2;
    }
  }
  `

  #_wrrapper

  static observedAttributes = ['html'];

  constructor() {
    super()

    const { wrapper } = myUtils.prepareCustomElement(CodeBlock, this.attachShadow({mode: "closed"}), { tag: 'div' })

    this.#_wrrapper = wrapper

    const name = this.getAttribute('name') ?? ''

    const tag = wrapper.querySelector('.tag')

    tag.innerHTML = SVG.copy()
    tag.prepend(`${this.getAttribute('type')}${name ? ' / ' : ''}${name}`)

    // コードのテキストをクリップボードにコピーする
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


/**
 * 外部リンク
 */
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

  constructor() {
    super()

    const { wrapper } = myUtils.prepareCustomElement(ExternalLink, this.attachShadow({mode: "closed"}), { tag: 'a' })

    wrapper.href = this.getAttribute('link')
    wrapper.target = '_blank'
    wrapper.setAttribute('rel', 'noopener noreferrer')
    wrapper.innerHTML = SVG.externalLink({
      color: myUtils.rootStyle.getPropertyValue('--link-color'),
      size: this.getAttribute('size') || 16
    })

    wrapper.prepend(this.getAttribute('name'))
  }
}

customElements.define('external-link', ExternalLink)
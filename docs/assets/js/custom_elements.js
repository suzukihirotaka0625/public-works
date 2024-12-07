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
      height: 20px;
      line-height: 20px;
      .file-icon {
        margin-right: 6px;
        align-self: center;
      }
      a {
        text-decoration: none;
        color: var(--link-color);
        display: flex;
        &:hover {
          color: rgb(var(--link-color-rgb) / .5);
          svg:not(.file-icon) path {
            fill: rgb(var(--link-color-rgb) / .5);
          }
        }
      }
      button:has(svg) {
        margin-left: 6px;
        transform: translateY(-1px);
      }
      .submenu {
        position: absolute;
        z-index: 1;
        box-sizing: border-box;
        padding: 8px;
        top: calc(100% - 2px);
        left: var(--submenu-left, 0);
        right: var(--submenu-right, auto);
        min-width: max(200px, 100%);
        background-color: white;
        border: 1px solid #999;
        display: none;
        box-shadow: 4px 4px 4px rgb(0 0 0 / .2);
        &.active {
          display: block;
        }
        .submenu-header {
          display: none;
        }
        li {
          min-width: 100px;
          padding: 6px 8px 6px 7px;
          &:after {
            content: '';
          }
          a {
            flex-grow: 1;
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
      height: 20px;
    }
  }
  @media screen and (max-width: 640px) {
    ul {
      li .submenu {
        left: var(--submenu-left);
        width: calc(100vw - 20px);
        li {
          font-size: 1rem;
          padding: .5rem;
        }
        .submenu-header {
          display: block;
          position: relative;
          height: 10px;
          padding: 0;
          > button {
            position: absolute;
            right: 4px;
            padding: 0;
            border: none;
            background: none;
            z-index: 1;
            svg path {
              fill: #444;
            }
          }
        }
      }
    }
  }
  `

  static observedAttributes = ['path'];

  #_root

  constructor() {
    super()

    this.#_root = myUtils.prepareCustomElement(MyMenu, this.attachShadow({mode: "closed"}), { tag: 'ul' })
    document.addEventListener('click', e => {
      if (e.target.tagName !== 'MY-MENU') {
        this.closeSubmenu()
      }
    })
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'path') {
      this.render(newValue)
    }
  }

  #_getFileIcon(menu) {
    const option = { color: '#888', size: '18px '}
    const isFile = menu.path.endsWith('.html')
    const icon = myUtils.strToDom(isFile ? SVG.file(option) : SVG.folder(option))
    icon.firstElementChild.classList.add('file-icon')
    return icon
  }

  /**
   * パンクズリストを設定する
   * @param {String} path 'top.works.xxx.html'
   * @returns 
   */
  render(path) {
    if (!path || this.rendered) return
    this.rendered = true

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

        li.prepend(this.#_getFileIcon(menu))
      }

      if (menu.siblings.length) {
        const submenu = this.#_createSubMenu(menu.siblings)
        const svg = myUtils.strToDom(SVG.triangleDown({ color: linkColor, size: '20px' }))
        const btn = document.createElement('button')
        btn.setAttribute('part', 'icon-button')

        btn.appendChild(svg)
        btn.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          // 他のサブメニューが開いていたら閉じる
          if (!submenu.classList.contains('active')) {
            this.#_root.querySelectorAll('.submenu').forEach(item => {
              item.classList.remove('active')
            })

            // サブメニューの位置調整
            const parentRect = submenu.parentElement.getBoundingClientRect()
            if (myUtils.isSp()) {
              // SP
              submenu.style.setProperty('--submenu-left', `${-parentRect.left + 10}px`)
            } else {
              // PC
              if (window.innerWidth - parentRect.right < 200) {
                // 画面右寄りの場合は、メニューの右端に合わせる
                submenu.style.setProperty('--submenu-left', 'auto')
                submenu.style.setProperty('--submenu-right', '0')
              } else {
                submenu.style.setProperty('--submenu-left', '0')
                submenu.style.setProperty('--submenu-right', 'auto')
              }
            }
          }
          submenu.classList.toggle('active')
        })

        submenu.addEventListener('mouseleave', () => {
          submenu.classList.remove('active')
        })

        titleWrapper.appendChild(btn)
        titleWrapper.appendChild(submenu)
      }

      this.#_root.appendChild(li)
    })
  }

  /**
   * サブメニューを生成する
   * @param {*} submenus 
   * @returns 
   */
  #_createSubMenu(submenus) {
    const ul = document.createElement('ul')
    ul.classList.add('submenu')

    // 閉じるボタン（SP用）
    const header = document.createElement('li')
    header.classList.add('submenu-header')
    const close = myUtils.strToDom(SVG.close({ size: '26px'}))
    const closeBtn = document.createElement('button')
    closeBtn.append(close)
    closeBtn.addEventListener('click', e => {
      e.stopPropagation()
      e.preventDefault()
      header.parentElement.classList.remove('active')
    })
    header.appendChild(closeBtn)
    ul.appendChild(header)

    submenus.forEach(menu => {
      const li = document.createElement('li')
      const a = document.createElement('a')
      a.href = `${myUtils.rootPath}${menu.path}`
      a.textContent = menu.title
      li.appendChild(this.#_getFileIcon(menu))
      li.appendChild(a)
      ul.appendChild(li)
    })
    return ul
  }

  closeSubmenu() {
    this.#_root.querySelectorAll('.submenu').forEach(item => {
      item.classList.remove('active')
    })
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
 * フッター
 */
class MyFooter extends HTMLElement {

  static start = '2024'

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
    const end = new Date().getFullYear().toString()
    const year = Array.from(new Set([MyFooter.start, end])).join(' - ')
    this.innerHTML = `<span>© ${year} suzuhiro</span>`
  }
}

customElements.define('my-footer', MyFooter, { extends: 'footer' })

/**
 * ページ一覧
 * このページ説明と、子階層のページの一覧の表示
 */
class PageList extends HTMLElement {

  static content = ``
  static style = `
  :host {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  h2 {
    margin-block: .5rem;
    font-size: 1.3rem;
  }
  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    .file-icon {
      margin-bottom: 1px;
      path {
        fill: #f1f1ff;
      }
    }
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

  #_root

  constructor() {
    super()

    this.#_root = myUtils.prepareCustomElement(PageList, this.attachShadow({mode: "closed"}))
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'path') {
      this.render(newValue)
    }
  }

  #_getFileIcon(menu) {
    const option = { color: '#888' }
    const isFile = menu.path.endsWith('.html')
    const icon = myUtils.strToDom(isFile ? SVG.file(option) : SVG.folder(option))
    icon.firstElementChild.classList.add('file-icon')
    return icon
  }

  render(path) {
    if (!path || this.rendered) return
    this.rendered = true

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
    this.#_root.appendChild(pageWrapper)

    if (menu.children) {
      const childrenWrapper = document.createElement('div')
      childrenWrapper.classList.add('children')

      Object.values(menu.children).forEach(item => {
        const card = document.createElement('div')
        const cardTitle = document.createElement('h3')
        const link = document.createElement('a')
        link.href = item.path
        cardTitle.textContent = item.title
        cardTitle.prepend(this.#_getFileIcon(item))
        card.appendChild(cardTitle)
        link.appendChild(card)
        if (item.note) {
          const cardNote = document.createElement('p')
          cardNote.innerHTML = item.note
          card.appendChild(cardNote)
        }
  
        childrenWrapper.appendChild(link)
      })
      this.#_root.appendChild(childrenWrapper)
    }
  }
}

customElements.define('page-list', PageList)


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

  #_root

  constructor() {
    super()

    this.#_root = myUtils.prepareCustomElement(ExternalLink, this.attachShadow({mode: "closed"}), { tag: 'a' })
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render()
      this.rendered = true
    }
  }

  render() {
    const root = this.#_root
    root.href = this.getAttribute('link')
    root.target = '_blank'
    root.setAttribute('rel', 'noopener noreferrer')
    root.innerHTML = SVG.externalLink({
      color: myUtils.rootStyle.getPropertyValue('--link-color'),
      size: this.getAttribute('size') || 16
    })

    root.prepend(this.getAttribute('name'))
  }
}

customElements.define('external-link', ExternalLink)
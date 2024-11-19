
const MENUS = {
  top: {
    title: 'My Skills',
    path: '',
    note: '業務で生産性や品質に貢献できる、スキルやツールなどについてまとめたサイトです。',
    children: {
      about: {
        title: 'About Me',
        path: 'about',
        note: '自分のスキルセットや経験、希望する作業内容、考え方など',
      },
      works: {
        title: '実績',
        path: 'works',
        note: '実際に現場で実装したコードをそのままではなく、要点を簡潔にまとめて再現します',
        children: {
          breadcrumb: {
            title: 'パンクズリスト',
            path: 'breadcrumb.html',
            note: 'フォルダ階層をパンクズリストで表示<br/>オーバーフローする場合は中央の階層を省略表示にして、ポップアップで省略した階層を表示する。'
          }
        }
      },
      tools: {
        title: 'Tools',
        path: 'tools',
        note: '実際に業務でも使用している、汎用的なツール類を公開します。',
        children: {
          color: {
            title: 'カラーコード変換',
            path: 'color.html',
            note: '10進数 <-> 16進数(RBG)、RBGA -> RGB の変換です。'
          },
          recursive: {
            title: '再帰処理',
            path: 'recursive.html',
            note: '再帰構造オブジェクトの値チェックや編集を行う'
          }
        }
      }
    }
  }
}

const myUtils = (() => {
  const prepareCustomElement = (element, shadowRoot, options) => {
    const wrapper = document.createElement(options.tag ?? 'div')
    if (element.content) {
      wrapper.innerHTML = element.content
    }

    shadowRoot.appendChild(wrapper)

    
    if (element.style) {
      const style = document.createElement('style')
      style.textContent = element.style
      shadowRoot.appendChild(style)
    }

    return { wrapper, shadowRoot }
  }

  const parseMenu = (key) => {
    const keys = key.replace('.html', '').split('.')
    return keys.reduce((result, key) => {
      if (!(key in result.menu)) {
        throw new Error(`${key} is not exists in menus`)
      }
      const menu = result.menu[key]
      const path = `${result.path}/${menu.path}`
      return {
        menu: menu.children,
        path,
        arr: [...result.arr, { title: menu.title, path }]
      }
    }, { menu: MENUS, path: '', arr: []}).arr
  }

  const getCurrentMenu = (key) => {
    const keys = key.replace('.html', '').split('.')
    let menu = { children: MENUS }
    for (let key of keys) {
      if (!(key in menu.children)) {
        throw new Error(`${key} is not exists in menus`)
      }
      menu = menu.children[key]
    }
    return menu
  }

  return {
    prepareCustomElement,
    parseMenu,
    getCurrentMenu,
    rootPath: location.host.indexOf('localhost') === -1 ? '/public-works' : '/lolipop/public-works/docs',
    rootStyle: getComputedStyle(document.querySelector(':root'))
  }
})()

document.addEventListener('DOMContentLoaded', () => {
  // パンクズリストを作成する
  const myMenu = document.getElementsByTagName('my-menu')[0]
  const pageList = document.getElementsByTagName('page-list')[0]
  if (myMenu || pageList) {
    const path = location.pathname.replace(myUtils.rootPath, 'top').split('/').filter(v => v).join('.')
    myMenu?.setAttribute('path', path)
    pageList?.setAttribute('path', path)
  }
})
/**
 * メニュー
 */
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
          },
          typescript: {
            title: 'Typescript',
            path: 'typescript',
            note: '実際に現場で実装した型定義です。',
            children: {
              highcharts: {
                title: 'Highchartsの設定',
                path: 'highcharts.html',
                note: 'HighChartsのレーダーチャートで、項目ラベルや凡例の位置、テキストサイズなどをデフォルト値と上書きする設定の型定義',
              }
            }
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
            note: 'いろいろなカラーコードの変換を行います。'
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

/**
 * ユーティリティー
 */
const myUtils = (() => {

  const _template = document.createElement('template')

  const strToDom = (str) => {
      _template.innerHTML = str
      return _template.content.cloneNode(true)
  }

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
      const path = `${result.path}${result.path === '/' ? '' : '/'}${menu.path}`
      const siblings = Object.entries(result.menu).filter(([_key, _menu]) => _key !== key).map(([_, _menu]) => {
        return ({
          ..._menu,
          path: `${result.path}${result.path === '/' ? '' : '/'}${_menu.path}`
        })
      })
      return {
        menu: menu.children,
        path,
        arr: [...result.arr, { title: menu.title, path, children: menu.children ?? null, key, siblings }]
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

  const rootStyle = getComputedStyle(document.querySelector(':root'))

  return {
    prepareCustomElement,
    parseMenu,
    getCurrentMenu,
    strToDom,
    rootPath: location.host.indexOf('localhost') === -1 ? '/public-works' : '/lolipop/public-works/docs',
    rootStyle,
    isSp: () => rootStyle.getPropertyValue('--is-sp') === '1'
  }
})()

/** SVG */
class SVG {
  static triangleDown = ({ color = '#000', size = '20px' } = {}) => `
<svg width="${size}" height="${size}" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 6H11L7.5 10.5L4 6Z" fill="${color}" />
</svg>`

  static home = ({ color = '#444', size = '20px' } = {}) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z" fill="${color}"/>
</svg>`

  static copy = ({ color = '#f1f1f1', size = '14px' } = {}) => `<svg fill="${color}" width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M21,8H9A1,1,0,0,0,8,9V21a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V9A1,1,0,0,0,21,8ZM20,20H10V10H20ZM6,15a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2H15a1,1,0,0,1,1,1V5a1,1,0,0,1-2,0V4H4V14H5A1,1,0,0,1,6,15Z"/>
</svg>`

  static externalLink = ({ color = '#444', size = '14px' } = {}) => `<svg 
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

  static close = ({ color = '#444', size = '14px' } = {}) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="${color}"/>
</svg>`
}

// 定数
const MyConst = {
  SHIKI: {
    libPath: `${myUtils.rootPath}/lib/shiki@1.23.1/index.js`,
    defaultTheme: 'dark-plus'
  }
}

// 初期処理
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


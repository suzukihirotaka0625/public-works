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
            note: '再帰構造を持つJSONの値チェックや編集を行います。'
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
    if (element.style) {
      const style = document.createElement('style')
      style.textContent = element.style
      shadowRoot.appendChild(style)
    }

    let wrapper = shadowRoot
    
    if (options) {
      wrapper = document.createElement(options.tag ?? 'div')
      shadowRoot.appendChild(wrapper)
    }

    if (element.content) {
      wrapper.appendChild(strToDom(element.content))
    }

    return wrapper
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

  static help = ({ color = '#444', size = '20px' } = {}) => `<svg fill="${color}" width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="M288.55,150.84c-8.09-3.86-20-6-32.72-5.82-18,.22-33.13,5.2-45,14.78-23,18.48-24.55,40.37-24.77,42.8a61.69,61.69,0,0,0-.09,12,3,3,0,0,0,3,2.69h21.23a3,3,0,0,0,3-3A65.7,65.7,0,0,1,214,204c0-.11,1.14-11.7,14.36-22.34,7-5.64,16.11-8.44,27.83-8.59,9.32-.11,16.93,1.47,20.34,3.09C291,183,298,192.31,298,204.57c0,18-10.9,26.23-30.18,39.18C247.08,257.68,237,275.1,237,297v11a3,3,0,0,0,3,3h22a3,3,0,0,0,3-3V297c0-9.16,2.23-19.13,18.44-30C303.39,253.59,326,238.4,326,204.57,326,181.43,312.7,162.34,288.55,150.84Z" style="fill:none"/>
  <path d="M256,64C150,64,64,150,64,256s86,192,192,192,192-86,192-192S362,64,256,64Zm10.44,302H236.23a2.57,2.57,0,0,1-2.56-2.57v-30.2a2.57,2.57,0,0,1,2.56-2.57h30.21a2.57,2.57,0,0,1,2.56,2.57v30.2A2.57,2.57,0,0,1,266.44,366Zm17-99C267.23,277.88,265,287.85,265,297v11a3,3,0,0,1-3,3H240a3,3,0,0,1-3-3V297c0-21.91,10.08-39.33,30.82-53.26C287.1,230.8,298,222.6,298,204.57c0-12.26-7-21.57-21.49-28.46-3.41-1.62-11-3.2-20.34-3.09-11.72.15-20.82,2.95-27.83,8.59C215.12,192.25,214,203.84,214,204a65.7,65.7,0,0,0-.84,10.28,3,3,0,0,1-3,3H188.91a3,3,0,0,1-3-2.69,61.69,61.69,0,0,1,.09-12c.22-2.43,1.8-24.32,24.77-42.8,11.91-9.58,27.06-14.56,45-14.78,12.7-.15,24.63,2,32.72,5.82C312.7,162.34,326,181.43,326,204.57,326,238.4,303.39,253.59,283.44,267Z"/>
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


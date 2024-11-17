
const MENUS = {
  top: {
    title: 'トップ',
    path: '/',
    children: {
      tools: {
        title: 'Tools',
        path: 'tools',
        children: {

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
    const keys = key.split('.')
    return keys.reduce((result, key) => {
      if (!(key in result.menu)) {
        throw new Error(`${key} is not exists in menus`)
      }
      const menu = result.menu[key]
      const path = `${result.path}${menu.path}`
      return {
        menu: menu.children,
        path,
        arr: [...result.arr, { title: menu.title, path }]
      }
    }, { menu: MENUS, path: '', arr: []}).arr
  }
  
  return {
    prepareCustomElement,
    parseMenu,
    rootPath: location.host.indexOf('localhost') === -1 ? '/public-works' : '/lolipop/public-works/docs'
  }
})()

document.addEventListener('DOMContentLoaded', () => {
  // パンクズリストを作成する
  const menuDom = document.getElementsByTagName('my-menu')
  if (menuDom.length) {
    const path = location.pathname.replace(myUtils.rootPath, 'top').split('/').filter(v => v).join('.')
    menuDom[0].setAttribute('path', path)
  }
})
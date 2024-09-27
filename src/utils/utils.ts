import router from '@/router'

const renderMarkerTpl = (components: Component, props?: Record<string, any>) => {
  const rootElm: HTMLDivElement = document.createElement('div')
  const renderMarkerClu: ComponentPublicInstance = createApp(components, props || {}).mount(rootElm)

  return renderMarkerClu
}

const getFullUrl = (path) => {
  const href = window.location.href

  return href.substring(0, href.lastIndexOf('#')) + '#' + path
}

const routerPush = (path, title = '', ani = 'pop-in') => {
  if (typeof plus !== 'undefined' && plus?.webview) {
    plus.webview.open(
      getFullUrl(path),
      path,
      {
        backButtonAutoControl: 'close',
        titleNView: {
          autoBackButton: true,
          titleText: title,
          backgroundColor: '#FFFFFF',
          splitLine: {
            color: '#EEEEEE',
          },
        },
      },
      ani,
    )
  } else {
    router.push(path)
  }
}

export { renderMarkerTpl, getFullUrl, routerPush }

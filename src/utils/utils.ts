const renderMarkerTpl = (components: Component, props?: Record<string, any>) => {
  const rootElm: HTMLDivElement = document.createElement('div')
  const renderMarkerClu: ComponentPublicInstance = createApp(components, props || {}).mount(rootElm)

  return renderMarkerClu
}

export { renderMarkerTpl }

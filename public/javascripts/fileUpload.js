FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )
  
  FilePond.setOptions({
    stylePanelAspectRatio: 180 / 130,
    imageResizeTargetWidth: 130,
    imageResizeTargetHeight: 180
  })
  
  FilePond.parse(document.body)
import multer from 'multer'

export let nuevoNombreArchivo = null

const storageImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/photoUser')
  },
  filename: function (req, file, cb) {
    nuevoNombreArchivo = `${Date.now()}-${file.originalname}`
    cb(null, nuevoNombreArchivo)
  }
})

const imageFilter = (req, file, cb) => {
  const mimeType = file.mimetype
  const mimePermitidos = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp0', 'image/webp']

  if (mimePermitidos.includes(mimeType)) {
    return cb(null, true)
  } else {
    cb(new Error('Archivo no aceptado'))
  }
}

const storagePost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/image')
  },
  filename: function (req, file, cb) {
    nuevoNombreArchivo = `${Date.now()}-${file.originalname}`
    cb(null, nuevoNombreArchivo)
  }
})

const imageFilterPost = (req, file, cb) => {
  const mimeType = file.mimetype
  const mimePermitidos = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp0', 'image/webp']

  if (mimePermitidos.includes(mimeType)) {
    return cb(null, true)
  } else {
    cb(new Error('Archivo no aceptado'))
  }
}
export const uploadImage = multer({ storage: storageImage, fileFilter: imageFilter })
export const uploadPost = multer({ storage: storagePost, fileFilter: imageFilterPost })

import express from 'express'
import bloggingRouter from '../routes/bloggingRouter.js'

const app = express()

app.use(express.json())
app.use('/api', bloggingRouter)
app.use('*', (req, res) => res.end('USE: No se encontró la ruta'))

app.listen(3000, () => console.log('Servidor levantado porraaaaaaa, vai tomar nos olhos em http:/localhost:3000'))

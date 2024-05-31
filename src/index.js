import express from 'express'
import bloggingRouter from '../routes/bloggingRouter.js'
import { PORT } from '../config/config.js'
import swaggerUi from 'swagger-ui-express'
import jsonDocs from './swagger-output.json' assert {type:'json'}
const app = express()

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(jsonDocs))
app.use('/api', bloggingRouter)
app.use('*', (req, res) => res.end('USE: No se encontró la ruta'))

app.listen(PORT, () => console.log(`Servidor levantado porraaaaaaa, vai tomar nos olhos em http:/localhost:${PORT}`))

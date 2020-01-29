import multer from 'multer'
import crypto from 'crypto'
import { extname, resolve} from 'path'


export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if(err) return cb(err)

/*
        o callback recebe um parametro erro como posição inicial, se err=null,
        significa que não houve erro.
*/
        return cb(null, res.toString('hex') + extname(file.originalname))
      })
    }
  })

}
import multer from '../../config/multer'
import File from '../models/File'
class FileController {
   
  async store(req, res){
    const { originalname: name, filename: path } = req.file

    const file = await File.create({name, path})
    console.log(path)
    return res.json(file)
  }
  
}

export default new FileController
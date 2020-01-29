import Jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import {promisify} from 'util'

export default async (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if(!authHeader) return res.status(401).json({message: 'Token not provided'})

  // const token = authHeader.split(' ')
  const [, token] = authHeader.split(' ') // usando posição 1 do array

  try {

    const decoded = await promisify(Jwt.verify)(token, authConfig.secret)

    req.userId = decoded.id

    return next()

  } catch (err) {
    return res.status(401).json({error: 'Token invalid'})
  }
}


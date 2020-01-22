import User from './../models/User'
import Jwt from 'jsonwebtoken' 
import userAuth from '../../config/auth' 
class SessionController {
  async store(req, res){

    const {email, password} = req.body

    const user = await User.findOne({where: {email}})
    
    if (!user) {
      return res.status(401).json({error: "User not found"})
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({error: "Password does not match"})
    }
    console.log("chegou até aqui, logo user exist e password success")

    const { id, name } = user 

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: Jwt.sign({id}, userAuth.secret, {
        expiresIn: userAuth.expiresIn
      })
    })
     
  }
}

export default new SessionController()
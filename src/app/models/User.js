import Sequelize, { Model } from 'sequelize'
import Bcryptjs from 'bcryptjs'


class User extends Model{

//o parametro sequelize é uma variavel connection(Sequelize) vinda 
 
  static init(sequelize){ 
    
/*
  o metodo super.init() recebe dois parametros como objeto:
  os {dados} uqe o usuario poderá receber na hora de criar, editar, listar; 
  e o objeto {sequilize}  
*/
    super.init({
/*     
      os campos abaixo não precisam ser os que estão no database, mas os 
      que o usuario irá preencher no formulário(create, edit, show)
*/
       name: Sequelize.STRING,
       email: Sequelize.STRING,
       password: Sequelize.VIRTUAL, //não existe no databse
       password_hash: Sequelize.STRING,
       provider: Sequelize.BOOLEAN,
    },
    {
      sequelize,
    }
    ),

/*
    this.addHook é usado para executar trechos de code. 
    beforeSave é usado para o método executar antes de um save database
*/
    this.addHook('beforeSave', async (user) => {
     if (user.password ) {
        user.password_hash = await Bcryptjs.hash(user.password, 8)
     }
    })

    

//  retorna o model que foi inicializado
    return this 


  } // fim static.init()
  static associate(models){
    this.belongsTo(models.File, {foreignKey: 'avatar_id', as: 'avatar' })
  }
    checkPassword(password){
    return Bcryptjs.compare(password, this.password_hash)
  }
}

export default User
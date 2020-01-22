import Sequelize from 'sequelize';

import databseConfig from '../config/database'
import User from './../app/models/User';

const models = [User]

/*
Esta class é responsavel de realizar a conexão com o database;
e carregar os models
*/
class Database {
  constructor() {
    this.init()
  }

  init() {

//  this.sequelize é uma vaiavel estabelece uma conexao com o database 
    this.sequelize = new Sequelize(databseConfig)

    console.log(this.sequelize)
//  cria um map da variavel models(User) e passa para User.init(sequelize)
    models.map(model => model.init(this.sequelize))
  }
}


export default new Database()
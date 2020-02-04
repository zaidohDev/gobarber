import Sequelize from 'sequelize';
import databseConfig from '../config/database';
import User from './../app/models/User';
import File from './../app/models/File';
import Appointment from './../app/models/Appointment';
import mongoose from 'mongoose';

const models = [User, File, Appointment];

/*
Esta class é responsavel de realizar a conexão com o database;
e carregar os models
*/
class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {

    //  this.connection é uma vaiavel estabelece uma conexao com o database 
    this.connection = new Sequelize(databseConfig);

    //  cria um map da variavel models(User) e passa para User.init(sequelize)
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));

  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber', 
    { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true}) 
  }
}

export default new Database()
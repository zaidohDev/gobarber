
module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.createTable('appointments', { 
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        }, 
        // relacionamento(agendamento) com usuario comum
        user_id: {
          type: Sequelize.INTEGER,
          references: {model: 'users', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          alowNull: true
        },
        // relacionamento(agendamento) com prestador no 
        provider_id: {
          type: Sequelize.INTEGER,
          references: {model: 'users', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          alowNull: true
        },
        canceled_at: {
          type: Sequelize.DATE,
          alowNull: true
        }, 
        date: {
          type: Sequelize.DATE,
          alowNull: false
        },
        created_at:{
          type:Sequelize.DATE,
          alowNull: false
        }, 
        updated_at: {
          type: Sequelize.DATE,
          alowNull: false
        }
        });
   
  },

  down: (queryInterface) => {
    
      return queryInterface.dropTable('appointments');
    
  }
};

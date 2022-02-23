const { Sequelize } = require("sequelize")
const config = require("config")

const connectionString = process.env.DATABASE_URL || config.get("db.postgres")
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
          }
    }
  })

module.exports = sequelize
